// Shared, idempotent fulfilment for Netcash payments.
//
// A successful payment is completed by the FIRST trusted signal to arrive —
// either the browser "Accept" redirect or the server-to-server "Notify" — so a
// lost Notify never strands a paid order. Both are amount-verified against our
// stored tier price and guarded on status PENDING, so calling this repeatedly
// (Accept + Notify + a manual reconcile) only ever grants once.
import { prisma } from '@/lib/db'
import { getTier } from './config'
import { enrollSlugsForItem, COURSE_TITLES } from '@/lib/checkout'
import { sendNetcashSuccessEmail, sendNetcashFailedEmail } from '@/lib/email'
import { isAccepted } from './postback'
import type { NetcashPostback } from './types'

// Enroll the buyer in every course the tier unlocks + set their plan tier. Idempotent.
export async function grantAccess(userId: string, itemKey: string) {
  const slugs = enrollSlugsForItem(itemKey)
  const courses = slugs.length
    ? await prisma.course.findMany({ where: { slug: { in: slugs } }, select: { id: true } })
    : []
  await prisma.$transaction([
    ...courses.map((c) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: c.id } },
        update: {},
        create: { userId, courseId: c.id },
      }),
    ),
    prisma.user.update({ where: { id: userId }, data: { planTier: getTier(itemKey)?.name ?? null } }),
  ])
}

async function sendSuccessEmail(userId: string, itemKey: string) {
  const tier = getTier(itemKey)
  const buyer = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  if (buyer?.email && tier) {
    const titles = enrollSlugsForItem(itemKey).map((s) => COURSE_TITLES[s] ?? s)
    await sendNetcashSuccessEmail(buyer.email, tier.name, titles)
  }
}

export type FulfillResult =
  | 'granted'
  | 'already-complete'
  | 'unknown-ref'
  | 'amount-mismatch'
  | 'declined'

// Grant path only (accepted + amount matches). Never cancels — see cancelFromPostback.
export async function fulfillFromPostback(p: NetcashPostback): Promise<FulfillResult> {
  const reference = p.Reference
  if (!reference) return 'unknown-ref'

  const purchase = await prisma.purchase.findUnique({ where: { netcashRef: reference } })
  if (!purchase) return 'unknown-ref'
  if (purchase.status === 'COMPLETE') return 'already-complete'

  const tier = getTier(purchase.itemKey)
  const expectedCents = tier ? Math.round(tier.price * 100) : purchase.amountCents
  const postedCents = Math.round(parseFloat(p.Amount ?? '') * 100)
  const amountOk = Number.isFinite(postedCents) && postedCents === expectedCents
  const meta = { netcashRequestTrace: p.RequestTrace ?? null, netcashMethod: p.Method ?? null }

  if (!isAccepted(p)) return 'declined'

  if (!amountOk) {
    console.error(
      `[netcash] AMOUNT MISMATCH ref=${reference} posted=${p.Amount} expected=${expectedCents}c — not granting`,
    )
    await prisma.purchase.updateMany({ where: { netcashRef: reference, status: 'PENDING' }, data: meta })
    return 'amount-mismatch'
  }

  // Only the first PENDING -> COMPLETE wins (idempotent across Accept/Notify/manual).
  const updated = await prisma.purchase.updateMany({
    where: { netcashRef: reference, status: 'PENDING' },
    data: { ...meta, status: 'COMPLETE', paidAt: new Date(), paymentMethod: p.Method ? `netcash_${p.Method}` : 'netcash' },
  })
  if (updated.count > 0) {
    await grantAccess(purchase.userId, purchase.itemKey)
    await sendSuccessEmail(purchase.userId, purchase.itemKey)
  }
  return 'granted'
}

// Decline path: mark a still-PENDING order CANCELLED + email once. Never touches
// a COMPLETE order (so a stray decline after a successful Accept is a no-op).
export async function cancelFromPostback(p: NetcashPostback): Promise<'cancelled' | 'noop'> {
  const reference = p.Reference
  if (!reference) return 'noop'
  const purchase = await prisma.purchase.findUnique({ where: { netcashRef: reference } })
  if (!purchase || purchase.status !== 'PENDING') return 'noop'

  const meta = { netcashRequestTrace: p.RequestTrace ?? null, netcashMethod: p.Method ?? null }
  const updated = await prisma.purchase.updateMany({
    where: { netcashRef: reference, status: 'PENDING' },
    data: { ...meta, status: 'CANCELLED' },
  })
  if (updated.count > 0) {
    const tier = getTier(purchase.itemKey)
    const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
    if (buyer?.email && tier) await sendNetcashFailedEmail(buyer.email, tier.name)
    return 'cancelled'
  }
  return 'noop'
}
