import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string }
    // Always return ok — never reveal whether an email exists.
    if (!email) return NextResponse.json({ ok: true })

    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '')
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.verificationToken.deleteMany({ where: { identifier: email } })
      await prisma.verificationToken.create({ data: { identifier: email, token, expires } })

      const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
      const resetUrl = `${base}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
      await sendPasswordResetEmail(email, resetUrl)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[forgot-password] Error:', error)
    return NextResponse.json({ ok: true })
  }
}
