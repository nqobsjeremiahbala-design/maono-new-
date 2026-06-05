'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export type DashCourse = {
  slug: string
  title: string
  level: string
  total: number
  progress: number
  image: string | null
}
type Plan = { tier: string; name: string } | null

const TABS = [
  { id: 'progress', label: 'In Progress' },
  { id: 'done', label: 'Courses Done' },
  { id: 'plan', label: 'My Plan' },
] as const
type TabId = (typeof TABS)[number]['id']

function CourseGrid({ courses, empty }: { courses: DashCourse[]; empty: string }) {
  if (courses.length === 0) {
    return <p className="py-12 text-center text-sm text-navy-400">{empty}</p>
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/learn/${c.slug}`}
            className="press group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-800 bg-[#1a2235] transition-all hover:-translate-y-1 hover:border-gold-400/60"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-navy-800">
              <Image
                src={c.image || `/images/courses/${c.slug}.jpg`}
                alt={c.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-400">{c.level}</p>
              <h3 className="mb-3 mt-1.5 line-clamp-2 font-serif text-[16px] leading-snug text-white">{c.title}</h3>
              <div className="mt-auto">
                <div className="mb-2 flex items-center justify-between text-xs text-navy-400">
                  <span>{c.total} lessons</span>
                  <span className="tabular-nums">{c.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function PlanPanel({ plan }: { plan: Plan }) {
  return (
    <div className="max-w-xl rounded-2xl border border-gold-400/30 bg-gradient-to-br from-[#1a2235] to-navy-900 p-7 md:p-9">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Current plan</p>
      <div className="mb-2 flex items-center gap-3">
        <h3 className="font-serif text-3xl text-white">{plan ? plan.name : 'Free'}</h3>
        <span className="rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-300">
          {plan ? plan.tier : 'Free'}
        </span>
      </div>
      <p className="mb-7 max-w-md text-navy-300">
        {plan
          ? 'Lifetime access to the courses in your bundle. Upgrade any time to unlock the full library.'
          : "You haven't bought a bundle yet. Unlock the full library with lifetime access — pay once, learn forever."}
      </p>
      <Link
        href="/memberships"
        className="press inline-flex items-center justify-center rounded-md bg-gradient-to-br from-gold-300 to-gold-500 px-7 py-3.5 font-bold text-navy-950 transition-transform hover:-translate-y-0.5"
      >
        Upgrade Plan →
      </Link>
    </div>
  )
}

export function DashboardTabs({
  inProgress,
  done,
  plan,
}: {
  inProgress: DashCourse[]
  done: DashCourse[]
  plan: Plan
}) {
  const [tab, setTab] = useState<TabId>('progress')

  return (
    <div>
      <div className="mb-7 flex gap-7 border-b border-navy-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative -mb-px pb-3 text-[15px] font-semibold transition-colors ${
              tab === t.id ? 'text-white' : 'text-navy-400 hover:text-white'
            }`}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-gold-500" />}
          </button>
        ))}
      </div>

      <div className={tab === 'progress' ? '' : 'hidden'}>
        <CourseGrid courses={inProgress} empty="Nothing in progress yet — pick a course from your library to begin." />
      </div>
      <div className={tab === 'done' ? '' : 'hidden'}>
        <CourseGrid courses={done} empty="No completed courses yet. Keep going — you're closer than you think!" />
      </div>
      <div className={tab === 'plan' ? '' : 'hidden'}>
        <PlanPanel plan={plan} />
      </div>
    </div>
  )
}
