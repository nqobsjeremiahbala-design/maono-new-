import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import {
  verifyOzowWebhook,
  mapOzowStatus,
  type OzowWebhookPayload,
} from '@/lib/payments/ozow'

export async function POST(request: NextRequest) {
  let payload: OzowWebhookPayload

  try {
    const formData = await request.formData()
    payload = Object.fromEntries(formData.entries()) as unknown as OzowWebhookPayload
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  // 1. Verify hash to ensure this came from Ozow (timing-safe).
  if (!verifyOzowWebhook(payload)) {
    console.error('[ozow-webhook] Hash verification failed', payload.TransactionReference)
    return new Response('Unauthorized', { status: 401 })
  }

  const status = mapOzowStatus(payload.Status)
  const purchaseId = payload.TransactionReference

  // 2. Look up the purchase and validate the amount.
  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })
  if (!purchase) {
    console.error('[ozow-webhook] Unknown purchase ref', purchaseId)
    // Return 200 so Ozow stops retrying — replay/spam from unknown refs is not our problem.
    return new Response('OK', { status: 200 })
  }

  // Ozow sends Amount in rands with 2 decimals; our purchase is cents.
  const ozowCents = Math.round(parseFloat(payload.Amount) * 100)
  if (!Number.isFinite(ozowCents) || ozowCents !== purchase.amountCents) {
    console.error(
      `[ozow-webhook] Amount mismatch for ${purchaseId}: ozow=${payload.Amount} ours=${purchase.amountCents}c`
    )
    return new Response('Amount mismatch', { status: 400 })
  }

  // 3. Idempotent state transition — only PENDING purchases advance.
  // Subsequent retries (or replays) hit updateMany with count=0 and do nothing.
  const updated = await prisma.purchase.updateMany({
    where: { id: purchaseId, status: 'PENDING' },
    data: {
      status,
      ozowTransId: payload.TransactionId,
      paymentMethod: 'ozow_eft',
    },
  })

  if (updated.count === 0) {
    console.log(`[ozow-webhook] ${purchaseId} already finalized (current=${purchase.status})`)
    return new Response('OK', { status: 200 })
  }

  console.log(`[ozow-webhook] ${purchaseId} → ${status} (Ozow: ${payload.Status})`)

  // 4. On successful payment, grant enrollment (idempotent via upsert).
  if (status === 'COMPLETE' && purchase.courseId) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: purchase.userId,
          courseId: purchase.courseId,
        },
      },
      update: {},
      create: {
        userId: purchase.userId,
        courseId: purchase.courseId,
      },
    })
    console.log(`[ozow-webhook] Enrolled user ${purchase.userId} in course ${purchase.courseId}`)
  }

  return new Response('OK', { status: 200 })
}
