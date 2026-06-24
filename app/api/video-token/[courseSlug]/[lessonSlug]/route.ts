import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isBunnyConfigured, signEmbedToken, bunnyLibraryId } from '@/lib/bunny'

export const dynamic = 'force-dynamic'

// Mint a short-lived signed Bunny Stream embed token for one lesson — ONLY after
// verifying the caller is signed in and enrolled (admins bypass). The token is
// the only way to load the (token-auth, DRM) player; it expires quickly and is
// scoped to the video, so it can't be shared usefully and there's no file URL.
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
    select: { bunnyVideoId: true },
  })
  // Not yet migrated → client uses the R2 fallback player.
  if (!lesson?.bunnyVideoId) return NextResponse.json({ error: 'not_migrated' }, { status: 404 })
  if (!isBunnyConfigured()) return NextResponse.json({ error: 'bunny_not_configured' }, { status: 503 })

  try {
    const { token, expires } = await signEmbedToken(lesson.bunnyVideoId, 3600)
    return NextResponse.json(
      { libraryId: bunnyLibraryId(), videoId: lesson.bunnyVideoId, token, expires },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (e) {
    console.error('[video-token] sign failed', e)
    return NextResponse.json({ error: 'token_sign_failed' }, { status: 502 })
  }
}
