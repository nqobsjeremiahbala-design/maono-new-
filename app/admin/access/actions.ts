'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'
import { BUNDLE_BY_ID } from '@/lib/checkout'

// Every mutation here changes who can watch paid course content, so each one
// re-checks the caller is an admin server-side (never trust the client).
async function assertAdmin() {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) {
    throw new Error('Unauthorized')
  }
}

// Grant or revoke a single course for a client.
export async function setCourseAccess(userId: string, courseSlug: string, grant: boolean) {
  await assertAdmin()
  const course = await prisma.course.findUnique({ where: { slug: courseSlug }, select: { id: true } })
  if (!course) throw new Error('Course not found')

  if (grant) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { userId, courseId: course.id },
    })
  } else {
    await prisma.enrollment.deleteMany({ where: { userId, courseId: course.id } })
  }
  revalidatePath('/admin/access')
}

// Grant every course in a bundle (Bronze/Silver/Gold/Platinum) in one click.
// Does not revoke courses outside the bundle — it only adds.
export async function assignBundle(userId: string, bundleId: string) {
  await assertAdmin()
  const bundle = BUNDLE_BY_ID[bundleId]
  if (!bundle) throw new Error('Bundle not found')

  const courses = await prisma.course.findMany({
    where: { slug: { in: bundle.courseSlugs } },
    select: { id: true },
  })
  await prisma.$transaction([
    ...courses.map((c) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: c.id } },
        update: {},
        create: { userId, courseId: c.id },
      }),
    ),
    // Record the explicit tier so the dashboard shows the real plan (e.g. Platinum).
    prisma.user.update({ where: { id: userId }, data: { planTier: bundle.name } }),
  ])
  revalidatePath('/admin/access')
}

// Remove all course access for a client (and clear their explicit plan tier).
export async function clearAccess(userId: string) {
  await assertAdmin()
  await prisma.$transaction([
    prisma.enrollment.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { planTier: null } }),
  ])
  revalidatePath('/admin/access')
}
