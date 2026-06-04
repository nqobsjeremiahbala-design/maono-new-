import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import type { SessionUser } from '@/lib/auth'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Videos are stored in the R2 bucket bound as MEDIA_BUCKET (see wrangler.jsonc).
// The returned `fileKey` is persisted as the lesson's videoUrl.
const MAX_SIZE = 500 * 1024 * 1024 // 500MB

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user as SessionUser)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('video') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 500MB)' }, { status: 400 })
  }

  const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type: ${file.type}. Allowed: mp4, webm, mov, avi` },
      { status: 400 },
    )
  }

  const ext = file.name.split('.').pop() || 'mp4'
  const fileKey = `videos/${crypto.randomUUID()}.${ext}`

  const { env } = getCloudflareContext()
  await env.MEDIA_BUCKET.put(fileKey, file.stream(), {
    httpMetadata: { contentType: file.type },
  })

  return NextResponse.json({ fileKey, size: file.size })
}
