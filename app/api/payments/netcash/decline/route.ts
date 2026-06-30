import { readUrlEncoded, parsePostback, logPostback, statusRedirect } from '@/lib/netcash/postback'
import { cancelFromPostback } from '@/lib/netcash/fulfill'

export const dynamic = 'force-dynamic'

// Browser is redirected here on failure. Cancel the still-PENDING order in
// real-time (no-op if it already completed via a successful Accept).
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('decline', raw, p)
  await cancelFromPostback(p)
  return statusRedirect('declined', p.Reference)
}

export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('Reference') ?? undefined
  return statusRedirect('declined', ref)
}
