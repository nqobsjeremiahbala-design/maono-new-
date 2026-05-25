import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...generatePageMetadata({
    title: 'Dashboard',
    description: 'Your Maono dashboard — enrolled courses, progress, and quick links.',
    path: '/dashboard',
  }),
  robots: { index: false, follow: false },
}

const BUNDLE_LABELS: Record<string, { name: string; tier: string; tagline: string }> = {
  'bundle-bronze': { name: 'Bronze Bundle', tier: 'Bronze', tagline: 'Foundation pack · once-off' },
  'bundle-silver': { name: 'Silver Bundle', tier: 'Silver', tagline: 'Structured beginner pack · once-off' },
  'bundle-gold': { name: 'Gold Bundle', tier: 'Gold', tagline: 'Full library · once-off' },
  'bundle-platinum': { name: 'Platinum Bundle', tier: 'Platinum', tagline: '1-on-1 mentorship · once-off' },
}

function ordinal(n: number) {
  return new Intl.NumberFormat('en-ZA').format(n)
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const userId = (session.user as { id: string }).id
  const userName = session.user.name
  const firstName = userName ? userName.split(' ')[0] : null

  const [enrollments, bundlePurchase] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: { include: { _count: { select: { lessons: true } } } },
          },
        },
        completedLessons: true,
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.purchase.findFirst({
      where: {
        userId,
        status: 'COMPLETE',
        itemKey: { startsWith: 'bundle-' },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalCourses = enrollments.length
  const totalLessons = enrollments.reduce(
    (sum, e) => sum + e.course.modules.reduce((n, m) => n + m._count.lessons, 0),
    0,
  )
  const completedLessons = enrollments.reduce((sum, e) => sum + e.completedLessons.length, 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const inProgress = enrollments
    .map((e) => {
      const total = e.course.modules.reduce((n, m) => n + m._count.lessons, 0)
      const done = e.completedLessons.length
      const progress = total > 0 ? Math.round((done / total) * 100) : 0
      return { enrollment: e, total, done, progress }
    })
    .sort((a, b) => {
      if (a.progress === 100 && b.progress < 100) return 1
      if (b.progress === 100 && a.progress < 100) return -1
      return b.progress - a.progress
    })

  const continueLearning = inProgress.find((i) => i.progress > 0 && i.progress < 100) ?? inProgress[0]

  const bundle = bundlePurchase ? BUNDLE_LABELS[bundlePurchase.itemKey] : null

  return (
    <section className="bg-navy-950 min-h-dvh">
      {/* Welcome header */}
      <div className="relative overflow-hidden border-b border-navy-800">
        <div className="absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pt-14 sm:pt-16 md:pt-20 pb-10 md:pb-14">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4">Dashboard</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] mb-3">
            {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
          </h1>
          <p className="text-navy-300 text-base sm:text-lg max-w-2xl">
            Pick up where you left off, track your progress, and stay close to the Telegram channel.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-4">
              <p className="font-serif text-2xl sm:text-3xl text-gold-400">{ordinal(totalCourses)}</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 mt-1">Courses</p>
            </div>
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-4">
              <p className="font-serif text-2xl sm:text-3xl text-gold-400 tabular-nums">{ordinal(completedLessons)}</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 mt-1">Lessons done</p>
            </div>
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-4">
              <p className="font-serif text-2xl sm:text-3xl text-gold-400 tabular-nums">{overallProgress}%</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 mt-1">Overall</p>
            </div>
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-4">
              <p className="font-serif text-2xl sm:text-3xl text-gold-400">{bundle ? bundle.tier : 'Free'}</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-400 mt-1">Plan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10 py-10 md:py-14 space-y-10 md:space-y-12">
        {/* Continue learning + Telegram CTA */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl sm:text-2xl text-white mb-4">Continue learning</h2>
            {continueLearning ? (
              <Link
                href={`/learn/${continueLearning.enrollment.course.slug}`}
                className="press group block bg-navy-900 border border-navy-800 hover:border-gold-400 rounded-2xl overflow-hidden transition-colors"
              >
                <div className="grid sm:grid-cols-[200px_1fr]">
                  <div className="relative aspect-[16/10] sm:aspect-auto sm:h-full bg-navy-800 overflow-hidden">
                    <Image
                      src={continueLearning.enrollment.course.image || `/images/courses/${continueLearning.enrollment.course.slug}.jpg`}
                      alt={continueLearning.enrollment.course.title}
                      fill
                      sizes="(min-width: 640px) 200px, 100vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-950/40 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] text-gold-400 font-semibold tracking-[0.15em] uppercase mb-2">
                      {continueLearning.enrollment.course.level} · {continueLearning.enrollment.course.duration}
                    </p>
                    <h3 className="font-serif text-xl text-white leading-snug mb-2">
                      {continueLearning.enrollment.course.title}
                    </h3>
                    <p className="text-navy-400 text-sm mb-4 line-clamp-2">
                      {continueLearning.enrollment.course.description}
                    </p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-navy-400 mb-1.5">
                        <span>{continueLearning.done} of {continueLearning.total} lessons</span>
                        <span className="tabular-nums">{continueLearning.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full transition-[width] duration-500"
                          style={{ width: `${continueLearning.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm text-gold-400 font-semibold">
                      {continueLearning.progress === 0
                        ? 'Start learning'
                        : continueLearning.progress === 100
                          ? 'Review course'
                          : 'Continue learning'}
                      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8">
                <p className="text-white font-semibold mb-2">No courses yet.</p>
                <p className="text-navy-400 text-sm mb-5">
                  Pick a bundle or a single course to start building a structured trading process.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/memberships"
                    className="press inline-flex items-center justify-center px-5 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
                  >
                    Browse bundles →
                  </Link>
                  <Link
                    href="/courses"
                    className="press inline-flex items-center justify-center px-5 py-3 rounded-md border border-navy-700 text-navy-200 hover:border-gold-400 hover:text-gold-400 transition-colors"
                  >
                    All courses
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Telegram CTA */}
          <aside className="bg-gradient-to-br from-navy-900 via-navy-900 to-gold-500/10 border border-gold-400/30 rounded-2xl p-6 md:p-7 flex flex-col">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Telegram channel</p>
            <h3 className="font-serif text-xl text-white mb-2 leading-snug">
              Daily setups, live calls, and the Maono community.
            </h3>
            <p className="text-navy-300 text-sm mb-6 flex-1">
              Every Maono student gets free access to the Telegram channel. Tap in for real-time breakdowns.
            </p>
            <Link
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press w-full inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Join the Telegram channel →
            </Link>
          </aside>
        </div>

        {/* Bundle / plan strip */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Your plan</p>
              {bundle ? (
                <>
                  <h3 className="font-serif text-2xl text-white mb-1">{bundle.name}</h3>
                  <p className="text-navy-400 text-sm">{bundle.tagline} · lifetime access</p>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-2xl text-white mb-1">No bundle yet</h3>
                  <p className="text-navy-400 text-sm">Pay once, learn forever. Pick a bundle to unlock the full library.</p>
                </>
              )}
            </div>
            <Link
              href="/memberships"
              className="press inline-flex items-center justify-center px-5 py-3 rounded-md border border-navy-700 text-navy-200 hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              {bundle ? 'View all bundles' : 'Browse bundles'} →
            </Link>
          </div>
        </div>

        {/* All enrolled courses */}
        {enrollments.length > 0 && (
          <div>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
              <h2 className="font-serif text-xl sm:text-2xl text-white">All enrolled courses</h2>
              <Link
                href="/my-courses"
                className="press text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                Full library →
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {inProgress.map(({ enrollment, total, progress }) => {
                const course = enrollment.course
                return (
                  <li key={enrollment.id}>
                    <Link
                      href={`/learn/${course.slug}`}
                      className="press group block bg-navy-900 border border-navy-800 hover:border-gold-400 rounded-xl p-5 transition-colors h-full"
                    >
                      <p className="text-[10px] text-gold-400 font-semibold tracking-[0.15em] uppercase mb-2">
                        {course.level}
                      </p>
                      <h3 className="font-serif text-base text-white leading-snug mb-3 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-navy-400 mb-1.5">
                        <span>{total} lessons</span>
                        <span className="tabular-nums">{progress}%</span>
                      </div>
                      <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Quick links */}
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-white mb-5">Quick links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { href: '/courses', label: 'Browse courses', sub: 'Add to your library' },
              { href: '/resources', label: 'Free resources', sub: 'Guides & cheatsheets' },
              { href: '/blog', label: 'Trading blog', sub: 'Insights from the desk' },
              { href: '/memberships', label: 'Course bundles', sub: 'Pay once, learn forever' },
            ].map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="press group block bg-navy-900 border border-navy-800 hover:border-gold-400 rounded-xl p-5 transition-colors"
              >
                <p className="font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">{q.label}</p>
                <p className="text-xs text-navy-400">{q.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
