import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generatePageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...generatePageMetadata({
    title: 'My Courses',
    description: 'Your enrolled courses and learning progress.',
    path: '/my-courses',
  }),
  robots: { index: false, follow: false },
}

export default async function MyCoursesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/my-courses')
  }

  const userId = (session.user as { id: string }).id
  const userName = session.user.name

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              _count: { select: { lessons: true } },
            },
          },
        },
      },
      completedLessons: true,
    },
  })

  // Display courses in the fixed learning sequence (module 1 → 6), same as the dashboard.
  const COURSE_ORDER = [
    'forex-trading-introduction',
    'price-action-trading',
    'trading-tools',
    'trading-strategies',
    'institutional-trading-concepts',
    'trading-psychology',
  ]
  const rank = (slug: string) => {
    const i = COURSE_ORDER.indexOf(slug)
    return i === -1 ? 999 : i
  }
  enrollments.sort((a, b) => rank(a.course.slug) - rank(b.course.slug))

  if (enrollments.length === 0) {
    return (
      <section className="bg-navy-950 min-h-dvh px-5 sm:px-6 py-16 md:py-28">
        <div className="max-w-2xl mx-auto text-center hero-reveal">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6">My courses</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] mb-5">
            You haven&apos;t enrolled in anything yet.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mb-8 md:mb-10 max-w-lg mx-auto">
            Pick a course to build a structured, risk-first trading process.
          </p>
          <Link
            href="/courses"
            className="press inline-flex items-center justify-center px-7 py-4 min-h-[48px] rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
          >
            Browse courses
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-navy-950 min-h-dvh">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pt-14 sm:pt-16 md:pt-24 pb-10 md:pb-12">
          <div className="hero-reveal">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-5">My courses</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] mb-4">
              {userName ? `Welcome back, ${userName.split(' ')[0]}.` : 'Welcome back.'}
            </h1>
            <p className="text-navy-300 text-base sm:text-lg max-w-2xl">
              Pick up where you left off.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pb-16 md:pb-28">
        <ul className="grid sm:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course
            const totalLessons = course.modules.reduce((n, m) => n + m._count.lessons, 0)
            const completedCount = enrollment.completedLessons.length
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
            const image = course.image || `/images/courses/${course.slug}.jpg`

            return (
              <li key={enrollment.id}>
                <Link
                  href={`/learn/${course.slug}`}
                  className="press group block rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-gold-400 transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:outline-none"
                >
                  <div className="relative aspect-[16/9] bg-navy-800 overflow-hidden">
                    <Image
                      src={image}
                      alt={course.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <span className="text-[11px] text-gold-400 font-semibold tracking-[0.15em] uppercase">
                        {course.level}{course.duration ? ` · ${course.duration}` : ''}
                      </span>
                      <span className="text-xs text-white bg-navy-950/80 px-2.5 py-1 rounded-full tabular-nums">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-xl md:text-2xl text-white mb-2 leading-snug">{course.title}</h2>
                    <p className="text-navy-400 text-sm mb-5 line-clamp-2">{course.description}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-navy-400 mb-2">
                        <span>{completedCount} of {totalLessons} lessons</span>
                        <span className="tabular-nums">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full transition-[width] duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm text-gold-400 font-semibold">
                      {progress === 0 ? 'Start learning' : progress === 100 ? 'Review course' : 'Continue learning'}
                      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/courses"
            className="press inline-flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition-colors"
          >
            Browse more courses <span aria-hidden>→</span>
          </Link>
          <a
            href="https://t.me/maonoforextrading"
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            Join Telegram
          </a>
        </div>
      </div>
    </section>
  )
}
