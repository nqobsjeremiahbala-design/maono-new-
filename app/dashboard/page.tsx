import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'
import { DashboardSignOut } from './DashboardSignOut'

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

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const userId = (session.user as { id: string }).id
  const userName = session.user.name
  const email = session.user.email
  const firstName = userName ? userName.split(' ')[0] : null
  const initial = (firstName ?? email ?? 'U').charAt(0).toUpperCase()

  const [enrollments, bundlePurchase] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: { include: { modules: { include: { _count: { select: { lessons: true } } } } } },
        completedLessons: true,
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    prisma.purchase.findFirst({
      where: { userId, status: 'COMPLETE', itemKey: { startsWith: 'bundle-' } },
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
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', active: true },
    { href: '/my-courses', label: 'My courses', badge: totalCourses || undefined },
    { href: '/courses', label: 'Browse courses' },
    { href: '/resources', label: 'Resources' },
    { href: '/blog', label: 'Blog' },
  ]

  const stats = [
    { v: String(totalCourses), k: 'Courses' },
    { v: String(completedLessons), k: 'Lessons done' },
    { v: `${overallProgress}%`, k: 'Overall' },
    { v: bundle ? bundle.tier : 'Free', k: 'Plan' },
  ]

  return (
    <div className="min-h-dvh bg-navy-950 text-white lg:flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-navy-800 bg-gradient-to-b from-navy-950 to-[#080b16] px-4 py-6 sticky top-0 h-dvh">
        <Link href="/" className="flex items-center gap-3 px-2 pb-6">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 font-serif text-[17px] font-bold text-navy-950 shadow-[0_6px_18px_-6px_rgba(201,168,76,0.6)]">
            M
          </span>
          <span>
            <span className="block font-serif text-base font-bold leading-none tracking-wide">MAONO</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.26em] text-navy-500">Forex Trading</span>
          </span>
        </Link>

        <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy-500">Main</p>
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              l.active
                ? 'bg-gold-500/14 text-gold-300 before:absolute before:-left-4 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-gold-500'
                : 'text-navy-300 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {l.label}
            {l.badge ? (
              <span className="ml-auto rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-navy-950">{l.badge}</span>
            ) : null}
          </Link>
        ))}

        <div className="flex-1" />

        <div className="mb-3 rounded-xl border border-gold-400/20 bg-gradient-to-br from-gold-500/[0.13] to-gold-500/[0.03] p-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-[15px] font-bold">{bundle ? bundle.name : 'No bundle'}</span>
            {bundle ? (
              <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-300">Owned</span>
            ) : null}
          </div>
          <p className="mb-3 mt-2 text-xs leading-relaxed text-navy-400">
            {bundle ? `${bundle.tagline} · lifetime access` : 'Pay once, learn forever. Pick a bundle to unlock the full library.'}
          </p>
          <Link
            href="/memberships"
            className="block rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 py-2 text-center text-sm font-bold text-navy-950 transition-transform hover:-translate-y-0.5"
          >
            {bundle ? 'Upgrade →' : 'Browse bundles →'}
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-navy-700 bg-navy-800 font-serif font-semibold text-gold-300">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold leading-tight">{userName ?? 'Student'}</p>
            <p className="truncate text-[11px] text-navy-500">{email}</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-navy-800 bg-navy-950/80 px-5 backdrop-blur md:px-8">
          <div>
            <p className="font-serif text-base font-semibold">Dashboard</p>
            <p className="text-[11.5px] text-navy-500">{today}</p>
          </div>
          <div className="ml-auto">
            <DashboardSignOut />
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl space-y-10 px-5 py-8 md:px-8 md:py-10">
          {/* Welcome + stats */}
          <section>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Dashboard</p>
            <h1 className="mb-2 font-serif text-3xl leading-tight md:text-4xl">
              Welcome back, <span className="text-gold-400">{firstName ?? 'trader'}</span>.
            </h1>
            <p className="max-w-xl text-navy-300">
              Jump back into your lesson, or browse the courses in your package below.
            </p>

            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.k} className="rounded-xl border border-navy-800 bg-navy-900 p-4">
                  <p className="font-serif text-2xl text-gold-400 tabular-nums sm:text-3xl">{s.v}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-navy-400">{s.k}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pick up where you left off */}
          <section>
            <h2 className="mb-4 font-serif text-xl text-white sm:text-2xl">Pick up where you left off</h2>
            {continueLearning ? (
              <Link
                href={`/learn/${continueLearning.enrollment.course.slug}`}
                className="press group block overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-navy-900 to-[#0c1020] transition-colors hover:border-gold-400"
              >
                <div className="grid sm:grid-cols-[260px_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden border-navy-800 bg-navy-800 sm:aspect-auto sm:border-r">
                    <Image
                      src={continueLearning.enrollment.course.image || `/images/courses/${continueLearning.enrollment.course.slug}.jpg`}
                      alt={continueLearning.enrollment.course.title}
                      fill
                      sizes="(min-width: 640px) 260px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-navy-950/30">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(201,168,76,0.7)] transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-400">
                      {continueLearning.enrollment.course.level} · {continueLearning.enrollment.course.duration}
                    </p>
                    <h3 className="mb-2 font-serif text-xl leading-snug text-white">{continueLearning.enrollment.course.title}</h3>
                    <p className="mb-5 line-clamp-2 text-sm text-navy-400">{continueLearning.enrollment.course.description}</p>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${continueLearning.progress}%` }} />
                      </div>
                      <span className="font-mono text-sm text-navy-200">{continueLearning.progress}%</span>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-gold-300 to-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950">
                      {continueLearning.progress === 0 ? 'Start learning' : continueLearning.progress === 100 ? 'Review course' : 'Resume lesson'}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-navy-800 bg-navy-900 p-6 sm:p-8">
                <p className="mb-2 font-semibold text-white">No courses yet.</p>
                <p className="mb-5 text-sm text-navy-400">Pick a bundle or a single course to start building a structured trading process.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/memberships" className="press inline-flex items-center justify-center rounded-md bg-gold-500 px-5 py-3 font-semibold text-navy-950 hover:bg-gold-400 transition-colors">Browse bundles →</Link>
                  <Link href="/courses" className="press inline-flex items-center justify-center rounded-md border border-navy-700 px-5 py-3 text-navy-200 hover:border-gold-400 hover:text-gold-400 transition-colors">All courses</Link>
                </div>
              </div>
            )}
          </section>

          {/* Your courses */}
          {enrollments.length > 0 && (
            <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <h2 className="font-serif text-xl text-white sm:text-2xl">Your courses</h2>
                <Link href="/my-courses" className="press text-sm text-navy-300 transition-colors hover:text-gold-400">Full library →</Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inProgress.map(({ enrollment, total, progress }) => {
                  const course = enrollment.course
                  return (
                    <li key={enrollment.id}>
                      <Link
                        href={`/learn/${course.slug}`}
                        className="press group flex h-full flex-col overflow-hidden rounded-xl border border-navy-800 bg-navy-900 transition-transform hover:-translate-y-1 hover:border-gold-400/60"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden border-b border-navy-800 bg-navy-800">
                          <Image
                            src={course.image || `/images/courses/${course.slug}.jpg`}
                            alt={course.title}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-400">{course.level}</p>
                          <h3 className="mb-3 mt-1.5 line-clamp-2 font-serif text-[15.5px] leading-snug text-white">{course.title}</h3>
                          <div className="mt-auto">
                            <div className="mb-2 flex items-center justify-between text-xs text-navy-400">
                              <span>{total} lessons</span>
                              <span className="tabular-nums">{progress}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* Telegram */}
          <section className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-navy-900 via-navy-900 to-gold-500/10 p-6 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="max-w-lg">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Telegram channel</p>
                <h3 className="mb-1 font-serif text-xl leading-snug text-white">Daily setups, live calls, and the Maono community.</h3>
                <p className="text-sm text-navy-300">Every Maono student gets free access. Tap in for real-time breakdowns.</p>
              </div>
              <Link
                href={TELEGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center justify-center rounded-md bg-gold-500 px-6 py-3.5 font-semibold text-navy-950 hover:bg-gold-400 transition-colors"
              >
                Join the channel →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
