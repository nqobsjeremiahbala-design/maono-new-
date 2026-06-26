import { prisma } from '@/lib/db'
import { getTier } from '@/lib/netcash/config'
import { enrollSlugsForItem, COURSE_TITLES } from '@/lib/checkout'
import { readUrlEncoded, parsePostback, isAccepted, logPostback } from '@/lib/netcash/postback'
import { sendNetcashSuccessEmail, sendNetcashFailedEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const ok = () => new Response('OK', { status: 200 })

// Source of truth for fulfillment. Called server-to-server for EVERY transaction
// (including delayed EFT/Retail), retried by Netcash → must be idempotent and
// always 200 quickly.
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('notify', raw, p)

  const reference = p.Reference
  if (!reference) return ok()

  const purchase = await prisma.purchase.findUnique({ where: { netcashRef: reference } })
  if (!purchase) {
    console.warn('[netcash-notify] unknown reference', reference)
    return ok() // don't make Netcash retry forever
  }
  if (purchase.status === 'COMPLETE') return ok() // idempotent — already fulfilled

  // Verify the amount against OUR stored tier price — never trust the postback alone.
  const tier = getTier(purchase.itemKey)
  const expectedCents = tier ? Math.round(tier.price * 100) : purchase.amountCents
  const postedCents = Math.round(parseFloat(p.Amount ?? '') * 100)
  const amountOk = Number.isFinite(postedCents) && postedCents === expectedCents
  const accepted = isAccepted(p)
  const meta = { netcashRequestTrace: p.RequestTrace ?? null, netcashMethod: p.Method ?? null }

  // Grant ONLY when accepted AND the amount matches our price.
  if (accepted && amountOk) {
    const updated = await prisma.purchase.updateMany({
      where: { netcashRef: reference, status: 'PENDING' },
      data: { ...meta, status: 'COMPLETE', paidAt: new Date(), paymentMethod: p.Method ? `netcash_${p.Method}` : 'netcash' },
    })
    if (updated.count > 0) {
      await grantAccess(purchase.userId, purchase.itemKey)
      const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
      if (buyer?.email && tier) {
        const titles = enrollSlugsForItem(purchase.itemKey).map((s) => COURSE_TITLES[s] ?? s)
        await sendNetcashSuccessEmail(buyer.email, tier.name, titles)
      }
    }
    return ok()
  }

  // Accepted but amount doesn't match our price → suspicious, never grant.
  if (accepted && !amountOk) {
    console.error(`[netcash-notify] AMOUNT MISMATCH ref=${reference} posted=${p.Amount} expected=${expectedCents}c — not granting`)
    await prisma.purchase.updateMany({ where: { netcashRef: reference, status: 'PENDING' }, data: meta })
    return ok()
  }

  // Declined.
  await prisma.purchase.updateMany({
    where: { netcashRef: reference, status: 'PENDING' },
    data: { ...meta, status: 'CANCELLED' },
  })
  const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
  if (buyer?.email && tier) await sendNetcashFailedEmail(buyer.email, tier.name)
  return ok()
}

// Enroll the buyer in every course the tier unlocks + set their explicit plan
// tier (so the dashboard shows the real plan). Idempotent via upsert.
async function grantAccess(userId: string, itemKey: string) {
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
