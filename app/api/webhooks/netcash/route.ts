import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { parseNotification, isAccepted } from '@/lib/payments/netcash'
import { CATALOG, enrollSlugsForItem } from '@/lib/checkout'
import { sendPurchaseEmail, sendUpgradeEmail, sendPaymentFailedEmail } from '@/lib/email'

// Netcash Pay Now sends a server-to-server POST here after a payment attempt.
export async function POST(request: NextRequest) {
  let form: Record<string, string>
  try {
    const fd = await request.formData()
    form = Object.fromEntries(fd.entries()) as Record<string, string>
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const n = parseNotification(form)
  const purchaseId = n.Reference
  if (!purchaseId) return new Response('No reference', { status: 400 })

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })
  if (!purchase) {
    console.error('[netcash-webhook] Unknown purchase ref', purchaseId)
    // 200 so Netcash stops retrying an unknown reference.
    return new Response('OK', { status: 200 })
  }

  // Cross-check the echoed extras + amount against what we recorded at checkout.
  // (Netcash Pay Now has no HMAC; the reference + amount + extras must all match,
  //  and the call comes server-to-server from Netcash.)
  const cents = Math.round(parseFloat(n.Amount || '') * 100)
  if (!Number.isFinite(cents) || cents !== purchase.amountCents) {
    console.error(`[netcash-webhook] Amount mismatch for ${purchaseId}: netcash=${n.Amount} ours=${purchase.amountCents}c`)
    return new Response('Amount mismatch', { status: 400 })
  }
  if ((n.Extra1 && n.Extra1 !== purchase.userId) || (n.Extra2 && n.Extra2 !== purchase.itemKey)) {
    console.error(`[netcash-webhook] Extra mismatch for ${purchaseId}`)
    return new Response('Mismatch', { status: 400 })
  }

  const accepted = isAccepted(n)
  const status = accepted ? 'COMPLETE' : 'CANCELLED'

  // Idempotent: only a PENDING purchase advances; retries/replays no-op.
  const updated = await prisma.purchase.updateMany({
    where: { id: purchaseId, status: 'PENDING' },
    data: {
      status,
      gateway: 'netcash',
      paymentMethod: n.Method ? `netcash_${n.Method}`.toLowerCase() : 'netcash',
      netcashRef: n.RequestTrace || undefined,
      paidAt: accepted ? new Date() : null,
    },
  })
  if (updated.count === 0) {
    console.log(`[netcash-webhook] ${purchaseId} already finalized (current=${purchase.status})`)
    return new Response('OK', { status: 200 })
  }
  console.log(`[netcash-webhook] ${purchaseId} → ${status} (accepted=${accepted})`)

  const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
  const itemLabel = CATALOG[purchase.itemKey]?.label ?? 'your order'
  if (buyer?.email) {
    if (status === 'COMPLETE') {
      if (purchase.itemKey.startsWith('bundle-')) await sendUpgradeEmail(buyer.email, itemLabel)
      else await sendPurchaseEmail(buyer.email, itemLabel)
    } else {
      await sendPaymentFailedEmail(buyer.email, itemLabel)
    }
  }

  // On success, grant access to every course the item unlocks (idempotent).
  if (status === 'COMPLETE') {
    const slugs = enrollSlugsForItem(purchase.itemKey)
    const courses = slugs.length
      ? await prisma.course.findMany({ where: { slug: { in: slugs } }, select: { id: true } })
      : []
    const courseIds = new Set(courses.map((c) => c.id))
    if (purchase.courseId) courseIds.add(purchase.courseId)
    for (const courseId of courseIds) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: purchase.userId, courseId } },
        update: {},
        create: { userId: purchase.userId, courseId },
      })
    }
    console.log(`[netcash-webhook] Enrolled user ${purchase.userId} in ${courseIds.size} course(s)`)
  }

  return new Response('OK', { status: 200 })
}
