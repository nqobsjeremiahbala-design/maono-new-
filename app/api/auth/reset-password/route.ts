import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = (await request.json()) as {
      email?: string
      token?: string
      password?: string
    }

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const vt = await prisma.verificationToken.findUnique({ where: { token } })
    if (!vt || vt.identifier !== email || vt.expires < new Date()) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { email },
      data: { passwordHash, legacyPasswordHash: null },
    })
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[reset-password] Error:', error)
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}
