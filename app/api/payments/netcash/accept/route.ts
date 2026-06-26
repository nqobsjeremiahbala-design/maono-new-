import { readUrlEncoded, parsePostback, logPostback, statusRedirect } from '@/lib/netcash/postback'

export const dynamic = 'force-dynamic'

// Browser is redirected here on success — UI ONLY. Fulfillment happens via Notify.
export async function POST(request: Request) {
  const { raw, obj } = await readUrlEncoded(request)
  const p = parsePostback(obj)
  await logPostback('accept', raw, p)
  return statusRedirect('success', p.Reference)
}

// Some Netcash configs return via GET — just show the status page.
export function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('Reference') ?? undefined
  return statusRedirect('success', ref)
}
