'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CATALOG, enrollSlugsForItem } from '@/lib/checkout'
import { canEnroll } from '@/lib/flags'
import { sendPurchaseEmail, sendUpgradeEmail } from '@/lib/email'
import { buildPayNowForm, isNetcashConfigured } from '@/lib/payments/netcash'

// Start a real Netcash "Pay Now" payment: record a PENDING purchase and return
// the hosted-page form for the browser to POST. Access is granted later by the
// /api/webhooks/netcash notification once Netcash confirms payment.
export async function startNetcashCheckout(
  itemKey: string,
  country: string,
): Promise<{ ok: boolean; url?: string; fields?: Record<string, string>; error?: string }> {
  const session = await auth()
  if (!session?.user) return { ok: false, error: 'Not authenticated' }

  const role = (session.user as { role?: string }).role
  if (!canEnroll(role)) {
    return { ok: false, error: 'Enrolment is currently closed to new students.' }
  }
  if (!isNetcashConfigured()) {
    return { ok: false, error: 'Online payment is not configured yet. Please contact support.' }
  }

  const item = CATALOG[itemKey]
  if (!item) return { ok: false, error: 'Unknown item' }

  const userId = (session.user as { id: string }).id
  const purchase = await prisma.purchase.create({
    data: {
      userId,
      itemKey,
      amountCents: Math.round(item.price * 100),
      status: 'PENDING',
      gateway: 'netcash',
      paymentMethod: 'netcash',
      country: country || 'South Africa',
    },
  })

  const { url, fields } = buildPayNowForm({
    reference: purchase.id,
    amount: item.price,
    description: item.label,
    userId,
    itemKey,
    email: session.user.email ?? undefined,
  })
  return { ok: true, url, fields }
}

// Demo checkout: no real PSP. Records a COMPLETE purchase and enrols the buyer in
// every course the item unlocks, so the courses appear on their dashboard.
export async function completeCheckout(itemKey: string): Promise<{ ok: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user) return { ok: false, error: 'Not authenticated' }

  // Go-live gate: enrollment is closed to new students (admins bypass for demos).
  const role = (session.user as { role?: string }).role
  if (!canEnroll(role)) {
    return { ok: false, error: 'Enrollment is currently closed to new students.' }
  }

  const userId = (session.user as { id: string }).id
  const item = CATALOG[itemKey]
  if (!item) return { ok: false, error: 'Unknown item' }

  const slugs = enrollSlugsForItem(itemKey)
  const courses = slugs.length
    ? await prisma.course.findMany({ where: { slug: { in: slugs } }, select: { id: true } })
    : []

  await prisma.purchase.create({
    data: {
      userId,
      itemKey,
      amountCents: Math.round(item.price * 100),
      status: 'COMPLETE',
      paymentMethod: 'demo',
    },
  })

  for (const c of courses) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: c.id } },
      create: { userId, courseId: c.id },
      update: {},
    })
  }

  // Confirmation email (best-effort; bundles get the "plan upgrade" version).
  const to = session.user.email
  if (to) {
    if (itemKey.startsWith('bundle-')) await sendUpgradeEmail(to, item.label)
    else await sendPurchaseEmail(to, item.label)
  }

  return { ok: true }
}
