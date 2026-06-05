import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getLesson } from '@/lib/courseLessons'

export const dynamic = 'force-dynamic'

const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
const IPFS_ROOT_CID = 'QmSiZD35puBGmJCKew1znuG8PdHZSiLAgDFXgeJ6qZ7Jn8'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> },
) {
  const { courseSlug, lessonSlug } = await params

  // 1. Require authentication
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Enforce the paywall: only an enrolled buyer (or an admin) may stream.
  // Enrollment is granted by the checkout flow / Ozow webhook on payment.
  const userId = (session.user as { id: string }).id
  const role = (session.user as { role?: string }).role
  if (role !== 'ADMIN') {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, course: { slug: courseSlug } },
      select: { id: true },
    })
    if (!enrollment) {
      return new Response('Forbidden', { status: 403 })
    }
  }

  // 3. Look up the lesson server-side (videoUrl never leaves the server)
  const lesson = getLesson(courseSlug, lessonSlug)
  if (!lesson || lesson.type !== 'video' || !lesson.videoUrl) {
    return new Response('Not found', { status: 404 })
  }

  // 4. Proxy the video from IPFS gateway
  const ipfsUrl = `${IPFS_GATEWAY}/${IPFS_ROOT_CID}/${lesson.videoUrl}`

  const headers: Record<string, string> = {}
  const range = request.headers.get('range')
  if (range) {
    headers['Range'] = range
  }

  const ipfsRes = await fetch(ipfsUrl, { headers })

  if (!ipfsRes.ok && ipfsRes.status !== 206) {
    return new Response('Video file not found', { status: 404 })
  }

  const resHeaders = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600',
  })

  const contentLength = ipfsRes.headers.get('content-length')
  if (contentLength) resHeaders.set('Content-Length', contentLength)

  const contentRange = ipfsRes.headers.get('content-range')
  if (contentRange) resHeaders.set('Content-Range', contentRange)

  return new Response(ipfsRes.body, {
    status: ipfsRes.status,
    headers: resHeaders,
  })
}
