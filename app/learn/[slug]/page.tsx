import { notFound } from 'next/navigation'
import { getCurriculum } from '@/lib/courseLessons'
import { getCourse } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { COURSE_TITLES } from '@/lib/checkout'
import { LearnClient } from './LearnClient'

export const dynamic = 'force-dynamic'

// The fixed learning sequence (module 1 → 6) used to find the "next course".
const COURSE_ORDER = [
  'forex-trading-introduction',
  'price-action-trading',
  'trading-tools',
  'trading-strategies',
  'institutional-trading-concepts',
  'trading-psychology',
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getCourse(slug)
    return {
      ...generatePageMetadata({
        title: `${meta.title} · Player`,
        description: meta.description,
        path: `/learn/${slug}`,
      }),
      robots: { index: false, follow: false },
    }
  } catch {
    return { robots: { index: false, follow: false } }
  }
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const curriculum = getCurriculum(slug)
  if (!curriculum) notFound()

  let course
  try {
    course = getCourse(slug).meta
  } catch {
    notFound()
  }

  // Account-level access: a logged-in user with a DB enrollment for this course
  // can watch on any device — even if local storage was never seeded (e.g.
  // migrated WordPress users). Local storage stays the fallback for progress.
  const session = await auth()
  let enrolledViaAccount = false
  let nextCourse: { slug: string; title: string } | null = null
  if (session?.user) {
    const userId = (session.user as { id: string }).id
    const role = (session.user as { role?: string }).role
    const enr = await prisma.enrollment.findMany({
      where: { userId },
      select: { course: { select: { slug: true } } },
    })
    const enrolledSlugs = new Set(enr.map((e) => e.course.slug))
    enrolledViaAccount = role === 'ADMIN' || enrolledSlugs.has(slug)

    // Next course = the next one in the learning sequence that the client also has
    // (admins see the full sequence).
    const available = role === 'ADMIN' ? COURSE_ORDER : COURSE_ORDER.filter((s) => enrolledSlugs.has(s))
    const idx = available.indexOf(slug)
    if (idx >= 0 && idx < available.length - 1) {
      const ns = available[idx + 1]
      nextCourse = { slug: ns, title: COURSE_TITLES[ns] ?? ns }
    }
  }

  // Strip videoUrl from curriculum before sending to client — video paths stay server-side only
  const safeCurriculum = {
    ...curriculum,
    modules: curriculum.modules.map(m => ({
      ...m,
      lessons: m.lessons.map(({ videoUrl: _v, ...lesson }) => lesson),
    })),
  }

  return (
    <LearnClient
      courseSlug={slug}
      courseTitle={course!.title}
      curriculum={safeCurriculum}
      enrolledViaAccount={enrolledViaAccount}
      nextCourse={nextCourse}
    />
  )
}
