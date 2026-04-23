'use client'

const STORAGE_KEY = 'maono.enrollment.v1'

type Enrollment = {
  courseSlug: string
  enrolledAt: string
  completedLessons: string[]
  customerName?: string
  customerEmail?: string
}

type State = {
  enrollments: Record<string, Enrollment>
}

function read(): State {
  if (typeof window === 'undefined') return { enrollments: {} }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { enrollments: {} }
    return JSON.parse(raw) as State
  } catch {
    return { enrollments: {} }
  }
}

function write(state: State) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event('maono-enrollment-change'))
}

export function enroll(courseSlug: string, customer?: { name?: string; email?: string }) {
  const state = read()
  if (state.enrollments[courseSlug]) return state.enrollments[courseSlug]
  state.enrollments[courseSlug] = {
    courseSlug,
    enrolledAt: new Date().toISOString(),
    completedLessons: [],
    customerName: customer?.name,
    customerEmail: customer?.email,
  }
  write(state)
  return state.enrollments[courseSlug]
}

export function isEnrolled(courseSlug: string): boolean {
  return !!read().enrollments[courseSlug]
}

export function getEnrollment(courseSlug: string): Enrollment | null {
  return read().enrollments[courseSlug] ?? null
}

export function getAllEnrollments(): Enrollment[] {
  return Object.values(read().enrollments).sort(
    (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  )
}

export function markLessonComplete(courseSlug: string, lessonSlug: string) {
  const state = read()
  const e = state.enrollments[courseSlug]
  if (!e) return
  if (!e.completedLessons.includes(lessonSlug)) {
    e.completedLessons.push(lessonSlug)
    write(state)
  }
}

export function markLessonIncomplete(courseSlug: string, lessonSlug: string) {
  const state = read()
  const e = state.enrollments[courseSlug]
  if (!e) return
  e.completedLessons = e.completedLessons.filter(l => l !== lessonSlug)
  write(state)
}

export function getProgress(courseSlug: string, totalLessons: number): number {
  const e = read().enrollments[courseSlug]
  if (!e || totalLessons === 0) return 0
  return Math.round((e.completedLessons.length / totalLessons) * 100)
}

export function resetEnrollment() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('maono-enrollment-change'))
}
