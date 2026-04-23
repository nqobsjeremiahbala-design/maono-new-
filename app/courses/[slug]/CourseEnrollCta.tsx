'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getEnrollment, getProgress, isEnrolled } from '@/lib/enrollment'

type Props = {
  slug: string
  title: string
  price: number
  totalLessons: number
  hasPlayer: boolean
}

export function CourseEnrollCta({ slug, price, totalLessons, hasPlayer }: Props) {
  const [mounted, setMounted] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function sync() {
      const e = isEnrolled(slug)
      setEnrolled(e)
      setProgress(e ? getProgress(slug, totalLessons || 1) : 0)
    }
    sync()
    setMounted(true)
    window.addEventListener('maono-enrollment-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('maono-enrollment-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [slug, totalLessons])

  if (!mounted) {
    return <EnrollCard price={price} slug={slug} />
  }

  if (enrolled && hasPlayer) {
    const enrollment = getEnrollment(slug)
    return (
      <aside className="bg-navy-900 border border-gold-400/30 rounded-2xl p-6 md:p-7 shadow-elevated">
        <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">You’re enrolled</p>
        <p className="text-white font-semibold mb-4">Pick up where you left off.</p>

        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-navy-300 mb-2">
            <span>Progress</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 rounded-full transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-navy-400 mt-2 tabular-nums">
            {enrollment?.completedLessons.length ?? 0} of {totalLessons} lessons complete
          </p>
        </div>

        <Link
          href={`/learn/${slug}`}
          className="press w-full inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
        >
          {progress === 0 ? 'Start learning' : progress === 100 ? 'Review course' : 'Continue learning'}
          <span aria-hidden className="ml-2">→</span>
        </Link>
        <Link
          href="/my-courses"
          className="press mt-3 w-full inline-flex items-center justify-center px-5 py-3 rounded-md border border-navy-700 text-navy-200 text-sm hover:border-gold-400 hover:text-gold-400 transition-colors"
        >
          Go to my courses
        </Link>
      </aside>
    )
  }

  return <EnrollCard price={price} slug={slug} />
}

function EnrollCard({ price, slug }: { price: number; slug: string }) {
  return (
    <aside className="bg-navy-900 border border-navy-800 rounded-2xl p-6 md:p-7 shadow-elevated">
      <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Enrol now</p>
      <p className="font-serif text-4xl text-white mb-1">
        R{price.toLocaleString()}
      </p>
      <p className="text-navy-400 text-sm mb-6">One-off · lifetime access</p>

      <Link
        href={`/checkout?item=course-${slug}`}
        className="press w-full inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
      >
        Enrol now <span aria-hidden className="ml-2">→</span>
      </Link>

      <ul className="mt-6 space-y-2.5 text-sm text-navy-300">
        <li className="flex items-start gap-2">
          <span aria-hidden className="text-gold-400 mt-0.5">✓</span>
          Full video and reading library
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="text-gold-400 mt-0.5">✓</span>
          Progress saved automatically
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="text-gold-400 mt-0.5">✓</span>
          Free signals group included
        </li>
      </ul>

      <Link
        href="/signals"
        className="block mt-6 text-sm text-navy-300 hover:text-gold-400 transition-colors"
      >
        Or try the free signals group first →
      </Link>
    </aside>
  )
}
