import { readUrlEncoded, parsePostback, logPostback, statusRedirect } from '@/lib/netcash/postback'
import { fulfillFromPostback } from '@/lib/netcash/fulfill'

export const dynamic = 'force-dynamic'

// Browser is redirected here the instant the buyer finishes paying. We fulfil
// here too (amount-verified, idempotent) so a lost server-to-server Notify never
// strands a paid order — Notify then confirms it as a harmless no-op.
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('accept', raw, p)
  await fulfillFromPostback(p) // grant in real-time; Accept never cancels
  return statusRedirect('success', p.Reference)
}

// Some Netcash configs return via GET — just show the status page.
export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('Reference') ?? undefined
  return statusRedirect('success', ref)
}
