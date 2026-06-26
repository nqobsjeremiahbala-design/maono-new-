import { prisma } from '@/lib/db'
import { getTier } from '@/lib/netcash/config'
import { readUrlEncoded, parsePostback, logPostback, statusRedirect } from '@/lib/netcash/postback'
import { sendNetcashPendingEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Browser is redirected here for pending/offline methods (EFT/Retail). UI only;
// final fulfillment still comes via Notify. We send a "pending" email here.
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('redirect', raw, p)

  if (p.Reference) {
    const purchase = await prisma.purchase.findUnique({
      where: { netcashRef: p.Reference },
      select: { userId: true, itemKey: true, status: true },
    })
    if (purchase && purchase.status === 'PENDING') {
      const tier = getTier(purchase.itemKey)
      const buyer = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { email: true } })
      if (buyer?.email && tier) await sendNetcashPendingEmail(buyer.email, tier.name)
    }
  }
  return statusRedirect('pending', p.Reference)
}

export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('Reference') ?? undefined
  return statusRedirect('pending', ref)
}
