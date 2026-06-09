'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Persist lesson completion to the DB (CompletedLesson) so progress survives
// sign-out / new devices and shows on the dashboard + My Courses. No-ops for a
// user with no enrollment for the course (e.g. an admin previewing).
export async function setLessonComplete(
  courseSlug: string,
  lessonSlug: string,
  complete: boolean,
): Promise<{ ok: boolean }> {
  const session = await auth()
  if (!session?.user) return { ok: false }
  const userId = (session.user as { id: string }).id

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, course: { slug: courseSlug } },
    select: { id: true },
  })
  if (!enrollment) return { ok: false }

  const lesson = await prisma.lesson.findFirst({
    where: { slug: lessonSlug, module: { course: { slug: courseSlug } } },
    select: { id: true },
  })
  if (!lesson) return { ok: false }

  if (complete) {
    await prisma.completedLesson.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
      update: {},
      create: { enrollmentId: enrollment.id, lessonId: lesson.id },
    })
  } else {
    await prisma.completedLesson.deleteMany({
      where: { enrollmentId: enrollment.id, lessonId: lesson.id },
    })
  }
  return { ok: true }
}
