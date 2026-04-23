'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllEnrollments, getProgress } from '@/lib/enrollment'

type CatalogEntry = {
  slug: string
  title: string
  description: string
  level: string
  duration: string
  image: string
  totalLessons: number
  hasPlayer: boolean
}

type Row = {
  course: CatalogEntry
  enrolledAt: string
  completedLessons: string[]
  progress: number
}

export function MyCoursesClient({ catalog }: { catalog: CatalogEntry[] }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    function sync() {
      const enrollments = getAllEnrollments()
      const mapped: Row[] = enrollments
        .map(e => {
          const course = catalog.find(c => c.slug === e.courseSlug)
          if (!course) return null
          return {
            course,
            enrolledAt: e.enrolledAt,
            completedLessons: e.completedLessons,
            progress: getProgress(e.courseSlug, course.totalLessons || 1),
          }
        })
        .filter((r): r is Row => r !== null)

      setRows(mapped)
      setName(enrollments.find(e => e.customerName)?.customerName ?? null)
    }

    sync()
    window.addEventListener('maono-enrollment-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('maono-enrollment-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [catalog])

  if (rows === null) {
    return (
      <section className="bg-navy-950 min-h-dvh flex items-center justify-center">
        <p className="text-navy-300 text-sm">Loading your dashboard…</p>
      </section>
    )
  }

  if (rows.length === 0) {
    return (
      <section className="bg-navy-950 min-h-dvh px-5 sm:px-6 py-16 md:py-28">
        <div className="max-w-2xl mx-auto text-center hero-reveal">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6">My courses</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] mb-5">
            You haven&apos;t enrolled in anything yet.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mb-8 md:mb-10 max-w-lg mx-auto">
            Pick a course to build a structured, risk-first trading process. Or start with the free signals group while you decide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="press inline-flex items-center justify-center px-7 py-4 min-h-[48px] rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Browse courses
            </Link>
            <Link
              href="/signals"
              className="press inline-flex items-center justify-center px-7 py-4 min-h-[48px] rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              Join the free signals group
            </Link>
          </div>
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
              {name ? `Welcome back, ${name.split(' ')[0]}.` : 'Welcome back.'}
            </h1>
            <p className="text-navy-300 text-base sm:text-lg max-w-2xl">
              Pick up where you left off. Your progress is saved on this device.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pb-16 md:pb-28">
        <ul className="grid sm:grid-cols-2 gap-6">
          {rows.map(({ course, progress, completedLessons }) => (
            <li key={course.slug}>
              <Link
                href={course.hasPlayer ? `/learn/${course.slug}` : `/courses/${course.slug}`}
                className="press group block rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-gold-400 transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:outline-none"
              >
                <div className="relative aspect-[16/9] bg-navy-800 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <span className="text-[11px] text-gold-400 font-semibold tracking-[0.15em] uppercase">
                      {course.level} · {course.duration}
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
                      <span>{completedLessons.length} of {course.totalLessons} lessons</span>
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
                    {course.hasPlayer
                      ? progress === 0 ? 'Start learning' : progress === 100 ? 'Review course' : 'Continue learning'
                      : 'View course details'}
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="press inline-flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition-colors"
          >
            Browse more courses <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
