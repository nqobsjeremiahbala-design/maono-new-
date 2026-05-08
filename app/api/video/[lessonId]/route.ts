import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createReadStream, statSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'

export const dynamic = 'force-dynamic'

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

  // 4. Stream the video file
  const filePath = path.join(process.cwd(), 'uploads', 'videos', lesson.videoUrl)

  let stat
  try {
    stat = statSync(filePath)
  } catch {
    return new Response('Video file not found', { status: 404 })
  }

  const range = request.headers.get('range')

  if (range) {
    // Partial content for seeking
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
    const chunkSize = end - start + 1

    const stream = createReadStream(filePath, { start, end })
    const webStream = Readable.toWeb(stream) as ReadableStream

    return new Response(webStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'private, no-store',
      },
    })
  }

  const stream = createReadStream(filePath)
  const webStream = Readable.toWeb(stream) as ReadableStream

  return new Response(webStream, {
    status: 200,
    headers: {
      'Content-Length': String(stat.size),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-store',
    },
  })
}
