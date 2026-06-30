import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createVerificationToken } from '@/lib/auth/verification'
import { sendVerificationEmail } from '@/lib/email'

// Resend the confirmation email. Always returns ok (never reveals whether an
// account exists or its verification state).
export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string }
    if (!email) return NextResponse.json({ ok: true })

    const user = await prisma.user.findUnique({ where: { email } })
    if (user && !user.emailVerified) {
      const token = await createVerificationToken(email)
      const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
      const verifyUrl = `${base}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
      await sendVerificationEmail(email, verifyUrl)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[resend-verification] Error:', error)
    return NextResponse.json({ ok: true })
  }
}
