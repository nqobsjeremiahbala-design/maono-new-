'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'
import { getTier } from '@/lib/netcash/config'
import { enrollSlugsForItem, COURSE_TITLES } from '@/lib/checkout'
import { grantAccess } from '@/lib/netcash/fulfill'
import { sendNetcashSuccessEmail } from '@/lib/email'

// Manual reconcile: the admin has confirmed on Netcash that a payment succeeded,
// and completes the order here — grants courses, sets the plan, sends the receipt.
// Idempotent (no-op if already COMPLETE). The safety net for a lost postback.
export async function markPurchasePaid(
  purchaseId: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) return { ok: false, error: 'Unauthorized' }

  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })
  if (!purchase) return { ok: false, error: 'Purchase not found.' }
  if (purchase.status === 'COMPLETE') return { ok: true }

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: 'COMPLETE',
      paidAt: purchase.paidAt ?? new Date(),
      paymentMethod: purchase.paymentMethod ?? 'netcash_manual',
    },
  })
  await grantAccess(purchase.userId, purchase.itemKey)

  const tier = getTier(purchase.itemKey)
  const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
  if (buyer?.email && tier) {
    const titles = enrollSlugsForItem(purchase.itemKey).map((s) => COURSE_TITLES[s] ?? s)
    await sendNetcashSuccessEmail(buyer.email, tier.name, titles)
  }

  revalidatePath('/admin/purchases')
  return { ok: true }
}
