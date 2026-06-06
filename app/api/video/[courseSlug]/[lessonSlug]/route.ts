import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getLesson } from '@/lib/courseLessons'

export const dynamic = 'force-dynamic'

// Videos live in the R2 bucket (bound as MEDIA_BUCKET) under `videos/<videoUrl>`.
// In production (Cloudflare Workers) we stream from R2; in local dev we stream
// from the raw files in `uploads/videos/<videoUrl>`.
function r2Key(videoUrl: string) {
  return `videos/${videoUrl}`
}

function parseRange(header: string | null): { offset?: number; length?: number; suffix?: number } | null {
  if (!header) return null
  const m = /bytes=(\d*)-(\d*)/.exec(header)
  if (!m) return null
  const startRaw = m[1]
  const endRaw = m[2]
  if (startRaw === '' && endRaw === '') return null
  if (startRaw === '') return { suffix: parseInt(endRaw, 10) }
  const offset = parseInt(startRaw, 10)
  if (endRaw === '') return { offset }
  return { offset, length: parseInt(endRaw, 10) - offset + 1 }
}

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

  const rangeHeader = request.headers.get('range')

  // 4a. Local dev: stream straight from the raw upload files.
  if (process.env.NODE_ENV !== 'production') {
    return serveFromLocalFile(lesson.videoUrl, rangeHeader)
  }

  // 4b. Production: stream from R2.
  return serveFromR2(r2Key(lesson.videoUrl), rangeHeader)
}

async function serveFromR2(key: string, rangeHeader: string | null): Promise<Response> {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare')
  const bucket = getCloudflareContext()?.env?.MEDIA_BUCKET as
    | {
        get: (
          k: string,
          opts?: { range?: { offset?: number; length?: number; suffix?: number } },
        ) => Promise<{
          body: ReadableStream
          size: number
          range?: { offset?: number; length?: number; suffix?: number }
          writeHttpMetadata: (h: Headers) => void
        } | null>
      }
    | undefined

  if (!bucket) {
    return new Response('Video storage unavailable', { status: 503 })
  }

  const range = parseRange(rangeHeader)
  const object = await bucket.get(key, range ? { range } : undefined)
  if (!object) {
    return new Response('Video file not found', { status: 404 })
  }

  const headers = new Headers()
  // Force a known, iOS-friendly video type (all assets are H.264/AAC mp4/m4v).
  headers.set('Content-Type', 'video/mp4')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'private, max-age=3600')

  const total = object.size
  if (range) {
    // R2 already returned only the requested bytes in object.body; compute the
    // served range deterministically from the request so we ALWAYS answer a
    // range request with 206 + Content-Range (required by iOS Safari).
    let start: number
    let end: number
    if (range.suffix != null) {
      start = Math.max(0, total - range.suffix)
      end = total - 1
    } else {
      start = range.offset ?? 0
      end = range.length != null ? Math.min(start + range.length - 1, total - 1) : total - 1
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`)
    headers.set('Content-Length', String(end - start + 1))
    return new Response(object.body, { status: 206, headers })
  }

  headers.set('Content-Length', String(total))
  return new Response(object.body, { status: 200, headers })
}

async function serveFromLocalFile(videoUrl: string, rangeHeader: string | null): Promise<Response> {
  const { createReadStream, statSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { Readable } = await import('node:stream')

  const filePath = join(process.cwd(), 'uploads', 'videos', videoUrl)
  let size: number
  try {
    size = statSync(filePath).size
  } catch {
    return new Response('Video file not found', { status: 404 })
  }

  // Git LFS pointer files are tiny text stubs — surface a clear hint instead of
  // streaming garbage to the <video> element.
  if (size < 1024) {
    return new Response(
      'Video content not available locally. Run "git lfs pull" to fetch the real files.',
      { status: 503 },
    )
  }

  let start = 0
  let end = size - 1
  let status = 200
  if (rangeHeader) {
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader)
    if (m) {
      if (m[1]) start = parseInt(m[1], 10)
      if (m[2]) end = parseInt(m[2], 10)
      if (end >= size) end = size - 1
      status = 206
    }
  }

  const nodeStream = createReadStream(filePath, { start, end })
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Content-Length': String(end - start + 1),
    'Cache-Control': 'private, max-age=3600',
  })
  if (status === 206) headers.set('Content-Range', `bytes ${start}-${end}/${size}`)

  return new Response(Readable.toWeb(nodeStream) as unknown as ReadableStream, { status, headers })
}
