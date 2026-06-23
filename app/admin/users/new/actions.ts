'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'
import { BUNDLE_BY_ID } from '@/lib/checkout'
import { sendClientInviteEmail } from '@/lib/email'

type Result = { ok: boolean; error?: string; isNew?: boolean; emailSent?: boolean }

// Admin-only: create (or find) a client by email, grant course access, set their
// plan tier if a bundle was chosen, and email a new client a set-password link.
export async function createClient(input: {
  email: string
  name?: string
  bundleId?: string
  courseSlugs?: string[]
}): Promise<Result> {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) return { ok: false, error: 'Unauthorized' }

  const email = (input.email || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' }

  // Resolve which courses to grant + the explicit plan tier (bundles only).
  let slugs: string[]
  let planTier: string | null = null
  if (input.bundleId) {
    const bundle = BUNDLE_BY_ID[input.bundleId]
    if (!bundle) return { ok: false, error: 'Unknown bundle.' }
    slugs = bundle.courseSlugs
    planTier = bundle.name
  } else {
    slugs = input.courseSlugs ?? []
  }
  if (slugs.length === 0) return { ok: false, error: 'Pick at least one course or a bundle.' }

  // Create or find the user (never duplicate an email).
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  const isNew = !existing
  const user =
    existing ??
    (await prisma.user.create({
      data: { email, name: input.name?.trim() || null, role: 'STUDENT' },
      select: { id: true },
    }))

  if (planTier) {
    await prisma.user.update({ where: { id: user.id }, data: { planTier } })
  }

  const courses = await prisma.course.findMany({ where: { slug: { in: slugs } }, select: { id: true } })
  await prisma.$transaction(
    courses.map((c) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user.id, courseId: c.id } },
        update: {},
        create: { userId: user.id, courseId: c.id },
      }),
    ),
  )

  // Only new accounts get the set-password invite (don't reset an existing
  // client's password). Existing clients just get the extra access.
  let emailSent = false
  if (isNew) {
    try {
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '')
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      await prisma.verificationToken.deleteMany({ where: { identifier: email } })
      await prisma.verificationToken.create({ data: { identifier: email, token, expires } })
      const base = process.env.NEXT_PUBLIC_APP_URL || 'https://maonoforextrading.co.za'
      const setupUrl = `${base}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
      emailSent = await sendClientInviteEmail(email, input.name ?? null, setupUrl)
    } catch {
      // non-fatal: the client can still use "Forgot password" to set their password
    }
  }

  revalidatePath('/admin/users')
  return { ok: true, isNew, emailSent }
}
