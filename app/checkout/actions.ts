'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CATALOG, enrollSlugsForItem } from '@/lib/checkout'
import { canEnroll } from '@/lib/flags'
import { sendPurchaseEmail, sendUpgradeEmail } from '@/lib/email'

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
