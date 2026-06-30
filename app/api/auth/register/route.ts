import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { ENROLLMENT_OPEN } from '@/lib/flags'
import { sendVerificationEmail } from '@/lib/email'
import { createVerificationToken } from '@/lib/auth/verification'

export async function POST(request: NextRequest) {
  try {
    // Registration is closed during the existing-clients launch. Only the
    // migrated WordPress clients (and staff/admin) have accounts. New sign-ups
    // are blocked here so a direct POST can't bypass the UI.
    if (!ENROLLMENT_OPEN) {
      return NextResponse.json({ error: 'Registration is currently closed.' }, { status: 403 })
    }

    const { name, email, password, phone } = (await request.json()) as {
      name?: string
      email?: string
      password?: string
      phone?: string
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      // Return generic success to prevent email enumeration
      return NextResponse.json({ id: 'existing', email }, { status: 201 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        // emailVerified intentionally left null — the user must confirm via email
        // before they can log in (see the gate in lib/auth.ts).
      },
    })

    // Send the email-confirmation link (login is blocked until confirmed).
    const token = await createVerificationToken(email)
    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    const verifyUrl = `${base}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
    await sendVerificationEmail(email, verifyUrl)

    return NextResponse.json(
      { id: user.id, email: user.email, requiresVerification: true },
      { status: 201 },
    )
  } catch (error) {
    console.error('[register] Error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
