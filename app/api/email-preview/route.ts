import { NextRequest } from 'next/server'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'
import { welcomeBackEmailHtml } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Admin-only: render the welcome-back email exactly as it will send, in the
// browser, for design/copy approval. 404 for everyone else (no info leak).
// Try: /api/email-preview?name=Chantal&plan=Gold  ·  ?name=jwessels&plan=Bronze
export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) {
    return new Response('Not found', { status: 404 })
  }
  const sp = new URL(request.url).searchParams
  const name = sp.get('name') ?? 'Chantal'
  const plan = sp.get('plan') ?? 'Gold'
  const email = sp.get('email') ?? 'client@example.com'
  return new Response(welcomeBackEmailHtml(email, name, plan), {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
