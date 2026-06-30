import { readUrlEncoded, parsePostback, logPostback } from '@/lib/netcash/postback'
import { fulfillFromPostback, cancelFromPostback } from '@/lib/netcash/fulfill'

export const dynamic = 'force-dynamic'

const ok = () => new Response('OK', { status: 200 })

// Server-to-server confirmation. Idempotent + amount-verified; always 200 fast.
// Fulfilment is shared with the browser Accept handler, so whichever arrives
// first completes the order and the other is a harmless no-op.
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('notify', raw, p)

  const result = await fulfillFromPostback(p)
  if (result === 'declined') await cancelFromPostback(p)
  return ok()
}
