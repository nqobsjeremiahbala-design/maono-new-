import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { consumeVerificationToken } from '@/lib/auth/verification'

// Confirms an email-verification token and marks the account verified.
export async function POST(request: NextRequest) {
  try {
    const { email, token } = (await request.json()) as { email?: string; token?: string }
    if (!email || !token) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const valid = await consumeVerificationToken(email, token)
    if (!valid) {
      return NextResponse.json(
        { error: 'This confirmation link is invalid or has expired.' },
        { status: 400 },
      )
    }

    await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[verify-email] Error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
