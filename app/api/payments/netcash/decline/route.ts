import { readUrlEncoded, parsePostback, logPostback, statusRedirect } from '@/lib/netcash/postback'

export const dynamic = 'force-dynamic'

// Browser is redirected here on failure — UI ONLY. No DB writes (Notify handles it).
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('decline', raw, p)
  return statusRedirect('declined', p.Reference)
}

export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('Reference') ?? undefined
  return statusRedirect('declined', ref)
}
