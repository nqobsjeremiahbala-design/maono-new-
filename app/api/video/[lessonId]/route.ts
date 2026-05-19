import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
const IPFS_ROOT_CID = 'QmSiZD35puBGmJCKew1znuG8PdHZSiLAgDFXgeJ6qZ7Jn8'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params

  // 1. Require authentication
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const userRole = (session.user as { role: string }).role

  // 2. Look up the lesson
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: { course: true },
      },
    },
  })

  if (!lesson || !lesson.videoUrl) {
    return new Response('Not found', { status: 404 })
  }

  // 3. Check enrollment (admins bypass)
  if (userRole !== 'ADMIN') {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    })

    if (!enrollment) {
      return new Response('Not enrolled', { status: 403 })
    }
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
