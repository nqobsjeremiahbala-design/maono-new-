'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth, isAdmin } from '@/lib/auth'
import type { SessionUser } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session || !isAdmin(session.user as SessionUser)) {
    redirect('/login')
  }
}

export async function createCourse(formData: FormData) {
  await requireAdmin()

  const course = await prisma.course.create({
    data: {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
      price: Math.round(parseFloat(formData.get('price') as string) * 100),
      duration: formData.get('duration') as string,
      image: (formData.get('image') as string) || null,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
    },
  })

  redirect(`/admin/courses/${course.id}`)
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin()

  await prisma.course.update({
    where: { id: courseId },
    data: {
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
      price: Math.round(parseFloat(formData.get('price') as string) * 100),
      duration: formData.get('duration') as string,
      image: (formData.get('image') as string) || null,
      featured: formData.get('featured') === 'on',
      published: formData.get('published') === 'on',
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function deleteCourse(courseId: string) {
  await requireAdmin()
  await prisma.course.delete({ where: { id: courseId } })
  redirect('/admin/courses')
}

export async function createModule(courseId: string, formData: FormData) {
  await requireAdmin()

  const maxPosition = await prisma.module.aggregate({
    where: { courseId },
    _max: { position: true },
  })

  await prisma.module.create({
    data: {
      courseId,
      title: formData.get('title') as string,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function updateModule(moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin()

  await prisma.module.update({
    where: { id: moduleId },
    data: {
      title: formData.get('title') as string,
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function deleteModule(moduleId: string, courseId: string) {
  await requireAdmin()
  await prisma.module.delete({ where: { id: moduleId } })
  redirect(`/admin/courses/${courseId}`)
}

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin()

  const maxPosition = await prisma.lesson.aggregate({
    where: { moduleId },
    _max: { position: true },
  })

  await prisma.lesson.create({
    data: {
      moduleId,
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
      type: formData.get('type') as 'video' | 'text',
      duration: formData.get('duration') as string,
      description: formData.get('description') as string,
      videoUrl: (formData.get('videoUrl') as string) || null,
      content: (formData.get('content') as string) || null,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  })

  redirect(`/admin/courses/${courseId}`)
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await requireAdmin()
  await prisma.lesson.delete({ where: { id: lessonId } })
  redirect(`/admin/courses/${courseId}`)
}
