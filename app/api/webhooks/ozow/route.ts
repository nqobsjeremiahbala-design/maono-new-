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

  // 1. Verify hash to ensure this came from Ozow
  if (!verifyOzowWebhook(payload)) {
    console.error('[ozow-webhook] Hash verification failed', payload.TransactionReference)
    return new Response('Unauthorized', { status: 401 })
  }

  const status = mapOzowStatus(payload.Status)
  const purchaseId = payload.TransactionReference

  console.log(`[ozow-webhook] ${purchaseId} → ${status} (Ozow: ${payload.Status})`)

  // 2. Update purchase record
  const purchase = await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status,
      ozowTransId: payload.TransactionId,
      paymentMethod: 'ozow_eft',
    },
  })

  // 3. On successful payment, create enrollment
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
