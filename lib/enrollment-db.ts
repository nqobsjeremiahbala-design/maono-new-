import { prisma } from './db'

export async function getEnrollmentForUser(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: { completedLessons: true },
  })
}

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
      completedLessons: true,
    },
    orderBy: { enrolledAt: 'desc' },
  })
}

export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  })
}

export async function markLessonCompleteDB(enrollmentId: string, lessonId: string) {
  return prisma.completedLesson.upsert({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    update: {},
    create: { enrollmentId, lessonId },
  })
}

export async function markLessonIncompleteDB(enrollmentId: string, lessonId: string) {
  return prisma.completedLesson.deleteMany({
    where: { enrollmentId, lessonId },
  })
}

export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
  return !!enrollment
}
