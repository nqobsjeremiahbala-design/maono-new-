'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CATALOG, enrollSlugsForItem, TEST_BUNDLE_ID } from '@/lib/checkout'
import { canEnroll } from '@/lib/flags'
import { sendPurchaseEmail, sendUpgradeEmail } from '@/lib/email'
import { isNetcashConfigured } from '@/lib/netcash/config'
import { buildPaymentForm } from '@/lib/netcash/buildPaymentForm'

// Start a real Netcash "Pay Now" payment: create a PENDING purchase (with a
// unique p2) and return the hosted-page form fields for the browser to POST
// (target="_top"). Access is granted later by /api/payments/netcash/notify.
export async function startNetcashCheckout(
  tierId: string,
  contact: { country?: string; email?: string; name?: string; phone?: string } = {},
): Promise<{ ok: boolean; url?: string; fields?: Record<string, string>; error?: string }> {
  const session = await auth()
  if (!session?.user) return { ok: false, error: 'Not authenticated' }

  const role = (session.user as { role?: string }).role
  if (!canEnroll(role)) {
    return { ok: false, error: 'Enrolment is currently closed to new students.' }
  }
  // The hidden R5 test tier is for admin live smoke tests only — never purchasable by students.
  if (tierId === TEST_BUNDLE_ID && role !== 'ADMIN') {
    return { ok: false, error: 'Unknown item' }
  }
  if (!isNetcashConfigured()) {
    return { ok: false, error: 'Online payment is not configured yet. Please contact support.' }
  }

  const userId = (session.user as { id: string }).id
  const res = await buildPaymentForm({
    tierId,
    userId,
    email: contact.email ?? session.user.email,
    name: contact.name ?? session.user.name,
    phone: contact.phone,
    country: contact.country,
  })
  if (!res.ok) return { ok: false, error: res.error }
  return { ok: true, url: res.url, fields: res.fields }
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
