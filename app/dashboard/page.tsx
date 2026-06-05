import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'
import { DashboardSignOut } from './DashboardSignOut'
import { DashboardTabs, type DashCourse } from './DashboardTabs'

export const dynamic = 'force-dynamic'

export const metadata = {
  ...generatePageMetadata({
    title: 'Dashboard',
    description: 'Your Maono dashboard — enrolled courses, progress, and quick links.',
    path: '/dashboard',
  }),
  robots: { index: false, follow: false },
}

const BUNDLE_LABELS: Record<string, { name: string; tier: string }> = {
  'bundle-bronze': { name: 'Bronze Bundle', tier: 'Bronze' },
  'bundle-silver': { name: 'Silver Bundle', tier: 'Silver' },
  'bundle-gold': { name: 'Gold Bundle', tier: 'Gold' },
  'bundle-platinum': { name: 'Platinum Bundle', tier: 'Platinum' },
}

// Inline icons (stroke = currentColor)
const IconBook = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
)
const IconCheck = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3 4.7-4.7" /></svg>
)
const IconChart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6"><path d="M6 20v-5" /><path d="M12 20V8" /><path d="M18 20v-9" /></svg>
)
const IconStar = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="h-6 w-6"><path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.6l1.1-6L3.4 9.4l6-.8z" /></svg>
)

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

  const ranked = enrollments
    .map((e): DashCourse => {
      const total = e.course.modules.reduce((n, m) => n + m._count.lessons, 0)
      const progress = total > 0 ? Math.round((e.completedLessons.length / total) * 100) : 0
      return { slug: e.course.slug, title: e.course.title, level: e.course.level, total, progress, image: e.course.image }
    })
    .sort((a, b) => b.progress - a.progress)

  const inProgress = ranked.filter((c) => c.progress < 100)
  const done = ranked.filter((c) => c.progress === 100)
  const continueLearning = ranked.find((c) => c.progress > 0 && c.progress < 100) ?? ranked[0]

  const bundle = bundlePurchase ? BUNDLE_LABELS[bundlePurchase.itemKey] : null
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', active: true, external: false },
    { href: '/my-courses', label: 'My Courses', active: false, external: false },
    { href: TELEGRAM_CHANNEL_URL, label: 'Telegram', active: false, external: true },
  ]

  const stats = [
    { v: String(totalCourses), k: 'Courses', icon: IconBook, accent: 'gold' as const },
    { v: String(completedLessons), k: 'Lessons done', icon: IconCheck, accent: 'teal' as const },
    { v: `${overallProgress}%`, k: 'Overall', icon: IconChart, accent: 'gold' as const },
    { v: bundle ? bundle.tier : 'Free', k: 'Plan', icon: IconStar, accent: 'teal' as const },
  ]

  return (
    <div className="min-h-dvh bg-navy-950 text-white lg:flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-navy-800 bg-gradient-to-b from-navy-950 to-[#080b16] px-4 py-6 sticky top-0 h-dvh">
        <Link href="/" className="flex items-center gap-3 px-2 pb-6">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 font-serif text-[17px] font-bold text-navy-950 shadow-[0_6px_18px_-6px_rgba(201,168,76,0.6)]">M</span>
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
            {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              l.active
                ? 'bg-gold-500/14 text-gold-300 before:absolute before:-left-4 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-gold-500'
                : 'text-navy-300 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {l.label}
            {l.external && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </Link>
        ))}

        <div className="flex-1" />

        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-navy-700 bg-navy-800 font-serif font-semibold text-gold-300">{initial}</span>
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

        <div className="mx-auto w-full max-w-5xl space-y-12 px-5 py-9 md:px-8 md:py-12">
          {/* Welcome + stats */}
          <section>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Dashboard</p>
            <h1 className="mb-2.5 font-serif text-[2.4rem] font-bold leading-[1.1] md:text-[2.7rem]">
              Welcome back, <span className="text-gold-400">{firstName ?? 'trader'}</span>.
            </h1>
            <p className="max-w-xl text-navy-300">Jump back into your lesson, or browse the courses in your package below.</p>

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.k}
                  className={`group flex min-h-[112px] flex-col justify-center rounded-2xl border border-l-4 bg-[#1a2235] p-6 transition-all duration-200 hover:scale-[1.02] hover:border-gold-400/60 ${
                    s.accent === 'gold' ? 'border-navy-800 border-l-gold-500' : 'border-navy-800 border-l-teal-400'
                  }`}
                >
                  <span className={`mb-2 ${s.accent === 'gold' ? 'text-gold-400' : 'text-teal-300'}`}>{s.icon}</span>
                  <p className="font-serif text-[2.6rem] font-bold leading-none text-gold-400 tabular-nums">{s.v}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-navy-400">{s.k}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pick up where you left off */}
          <section>
            <h2 className="mb-5 font-serif text-[22px] font-semibold text-white">Pick up where you left off</h2>
            {continueLearning ? (
              <Link
                href={`/learn/${continueLearning.slug}`}
                className="press group block overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-[#1a2235] to-navy-900 transition-colors hover:border-gold-400"
              >
                <div className="grid sm:grid-cols-[280px_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden border-navy-800 bg-navy-800 sm:aspect-auto sm:border-r">
                    <Image
                      src={continueLearning.image || `/images/courses/${continueLearning.slug}.jpg`}
                      alt={continueLearning.title}
                      fill
                      sizes="(min-width: 640px) 280px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-navy-950/30">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-navy-950 shadow-[0_10px_30px_-8px_rgba(201,168,76,0.7)] transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-7">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-400">{continueLearning.level}</p>
                    <h3 className="mb-4 font-serif text-2xl leading-snug text-white">{continueLearning.title}</h3>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${continueLearning.progress}%` }} />
                      </div>
                      <span className="font-mono text-sm text-navy-200">{continueLearning.progress}%</span>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-gold-300 to-gold-500 px-6 py-3 text-sm font-bold text-navy-950">
                      {continueLearning.progress === 0 ? 'Start learning' : continueLearning.progress === 100 ? 'Review course' : 'Resume lesson'}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-navy-800 bg-[#1a2235] px-6 py-14 text-center">
                <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gold-500/12 text-gold-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-8 w-8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                </span>
                <h3 className="mb-2 font-serif text-2xl text-white">Your learning starts here</h3>
                <p className="mx-auto mb-7 max-w-md text-navy-300">
                  You haven&apos;t enrolled in a course yet. Pick a bundle and get lifetime access to a structured trading curriculum.
                </p>
                <Link
                  href="/memberships"
                  className="press inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 px-10 py-4 text-base font-bold text-navy-950 transition-transform hover:-translate-y-0.5"
                >
                  Browse bundles →
                </Link>
              </div>
            )}
          </section>

          {/* Tabs: In Progress / Courses Done / My Plan */}
          <section>
            <DashboardTabs inProgress={inProgress} done={done} plan={bundle} />
          </section>
        </div>
      </div>
    </div>
  )
}
