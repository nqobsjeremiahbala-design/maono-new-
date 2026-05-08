import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import type { SessionUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'videos')
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
  const fileKey = `${crypto.randomUUID()}.${ext}`

  await mkdir(UPLOAD_DIR, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, fileKey), buffer)

  return NextResponse.json({ fileKey, size: file.size })
}
