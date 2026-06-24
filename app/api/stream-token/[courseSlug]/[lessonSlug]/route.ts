import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isStreamConfigured, mintPlaybackToken, streamCustomerCode } from '@/lib/stream'

export const dynamic = 'force-dynamic'

// Mint a short-lived signed Cloudflare Stream playback token for one lesson —
// ONLY after verifying the caller is signed in and enrolled (admins bypass).
// The token is the sole way to play the (signed-URL, DRM) video; it expires
// quickly, so it can't be shared usefully and there is no downloadable file.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> },
) {
  const { courseSlug, lessonSlug } = await params

  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const role = (session.user as { role?: string }).role
  if (role !== 'ADMIN') {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, course: { slug: courseSlug } },
      select: { id: true },
    })
    if (!enrollment) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const lesson = await prisma.lesson.findFirst({
    where: { slug: lessonSlug, module: { course: { slug: courseSlug } } },
    select: { streamUid: true },
  })
  // Not yet migrated to Stream → tell the client to use the R2 fallback player.
  if (!lesson?.streamUid) return NextResponse.json({ error: 'not_on_stream' }, { status: 404 })
  if (!isStreamConfigured()) return NextResponse.json({ error: 'stream_not_configured' }, { status: 503 })

  try {
    const token = await mintPlaybackToken(lesson.streamUid, 3600)
    return NextResponse.json(
      { token, customerCode: streamCustomerCode() },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (e) {
    console.error('[stream-token] mint failed', e)
    return NextResponse.json({ error: 'token_mint_failed' }, { status: 502 })
  }
}
