'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import type { CourseCurriculum, Lesson } from '@/lib/courseLessons'
import { Markdown } from '@/lib/markdown'
import { setLessonComplete } from './actions'

type Props = {
  courseSlug: string
  courseTitle: string
  curriculum: CourseCurriculum
  /** True when the signed-in account has a DB enrollment for this course. */
  enrolledViaAccount?: boolean
  /** The next course in the learner's sequence, shown after the last lesson. */
  nextCourse?: { slug: string; title: string } | null
  /** Lesson slugs already completed (from the DB) — the source of truth. */
  completedSlugs?: string[]
}

export function LearnClient({ courseSlug, courseTitle, curriculum, enrolledViaAccount = false, nextCourse = null, completedSlugs = [] }: Props) {
  const allLessons = useMemo(
    () => curriculum.modules.flatMap(m => m.lessons),
    [curriculum]
  )
  const [activeSlug, setActiveSlug] = useState<string>(allLessons[0]?.slug ?? '')
  // Progress comes from the DB (completedSlugs) and is persisted via a server
  // action, so it syncs across sign-outs and devices.
  const [completed, setCompleted] = useState<string[]>(completedSlugs)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Fraction (0–1) of the active video watched — feeds the live progress bar.
  const [watched, setWatched] = useState(0)
  const [, startSave] = useTransition()

  // Reset the live watch fraction whenever the active lesson changes.
  useEffect(() => {
    setWatched(0)
  }, [activeSlug])

  // Access is decided server-side (DB enrollment, admins included).
  const access: 'granted' | 'denied' = enrolledViaAccount ? 'granted' : 'denied'

  if (access === 'denied') {
    return (
      <div className="min-h-dvh bg-navy-950 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Access required</p>
          <h1 className="font-serif text-3xl text-white mb-4">You&apos;re not enrolled in this course yet.</h1>
          <p className="text-navy-300 mb-8">Enrol to unlock the full curriculum, lessons, and progress tracking.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/courses/${courseSlug}`}
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              View course
            </Link>
            <Link
              href="/courses"
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              Browse all courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeIndex = allLessons.findIndex(l => l.slug === activeSlug)
  const activeLesson = allLessons[activeIndex] ?? allLessons[0]
  const prev = activeIndex > 0 ? allLessons[activeIndex - 1] : null
  const next = activeIndex >= 0 && activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null
  const isComplete = completed.includes(activeLesson.slug)
  // The bar reflects completed lessons plus how far through the current video the
  // learner is, so it advances live as they watch.
  const activeContribution = isComplete ? 0 : Math.min(Math.max(watched, 0), 1)
  const completionPercent = Math.min(
    100,
    Math.round(((completed.length + activeContribution) / allLessons.length) * 100),
  )

  function persist(slug: string, complete: boolean) {
    setCompleted((prev) =>
      complete ? Array.from(new Set([...prev, slug])) : prev.filter((s) => s !== slug),
    )
    startSave(() => {
      setLessonComplete(courseSlug, slug, complete)
    })
  }

  function toggleComplete() {
    persist(activeLesson.slug, !isComplete)
  }

  // Called as the video plays; auto-marks the lesson complete once mostly watched.
  function handleWatchProgress(fraction: number) {
    setWatched(fraction)
    if (fraction >= 0.9 && !completed.includes(activeLesson.slug)) {
      persist(activeLesson.slug, true)
    }
  }

  function goToLesson(slug: string) {
    setActiveSlug(slug)
    setSidebarOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-dvh bg-navy-950 text-white">
      <div className="border-b border-navy-800 bg-navy-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/my-courses"
              className="text-navy-400 hover:text-white text-sm transition-colors shrink-0 hidden sm:inline-flex items-center gap-1"
            >
              <span aria-hidden>←</span> My courses
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-gold-400 font-semibold tracking-[0.15em] uppercase hidden md:block">Now learning</p>
              <p className="font-serif text-lg text-white truncate">{courseTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-40 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-[width] duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-sm text-navy-300 tabular-nums">{completionPercent}%</span>
            </div>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="lg:hidden press p-2 rounded-md border border-navy-700 text-white"
              aria-label="Toggle lesson list"
              aria-expanded={sidebarOpen}
            >
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full transition-[width] duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-xs text-navy-300 tabular-nums shrink-0">{completionPercent}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[320px_1fr]">
        <Sidebar
          curriculum={curriculum}
          activeSlug={activeLesson.slug}
          completed={completed}
          onSelect={goToLesson}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="px-5 sm:px-6 md:px-10 lg:px-14 py-8 sm:py-10 md:py-14 max-w-4xl">
          <LessonView
            courseSlug={courseSlug}
            lesson={activeLesson}
            lessonIndex={activeIndex + 1}
            totalLessons={allLessons.length}
            isComplete={isComplete}
            onToggleComplete={toggleComplete}
            onWatchProgress={handleWatchProgress}
            prev={prev}
            next={next}
            nextCourse={nextCourse}
            onNavigate={goToLesson}
          />
        </main>
      </div>
    </div>
  )
}

function Sidebar({
  curriculum,
  activeSlug,
  completed,
  onSelect,
  isOpen,
  onClose,
}: {
  curriculum: CourseCurriculum
  activeSlug: string
  completed: string[]
  onSelect: (slug: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <>
      {isOpen && (
        <button
          onClick={onClose}
          className="lg:hidden fixed inset-0 top-16 bg-navy-950/80 backdrop-blur-sm z-40"
          aria-label="Close lesson list"
        />
      )}
      <aside
        className={`
          bg-navy-900 border-r border-navy-800
          lg:sticky lg:top-16 lg:self-start lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto
          ${isOpen ? 'fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto' : 'hidden lg:block'}
        `}
      >
        <nav className="px-5 py-6">
          <p className="text-xs text-navy-500 font-semibold tracking-[0.15em] uppercase mb-5">Curriculum</p>
          <ol className="space-y-7">
            {curriculum.modules.map((m, mi) => (
              <li key={mi}>
                <p className="text-xs text-gold-400 font-semibold tracking-[0.1em] uppercase mb-3">
                  {m.title}
                </p>
                <ul className="space-y-1">
                  {m.lessons.map(l => {
                    const done = completed.includes(l.slug)
                    const active = l.slug === activeSlug
                    return (
                      <li key={l.slug}>
                        <button
                          onClick={() => onSelect(l.slug)}
                          className={`
                            w-full text-left px-3 py-2.5 rounded-md transition-colors press
                            flex items-center gap-3
                            ${active ? 'bg-navy-800 text-white' : 'text-navy-300 hover:bg-navy-800/50 hover:text-white'}
                          `}
                          aria-current={active ? 'true' : undefined}
                        >
                          <span
                            className={`
                              shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2
                              ${done
                                ? 'bg-gold-500 border-gold-500 text-navy-950'
                                : active
                                ? 'border-gold-400 text-gold-400'
                                : 'border-navy-600 text-navy-500'}
                            `}
                            aria-hidden
                          >
                            {done ? (
                              <IconCheck className="h-3.5 w-3.5" />
                            ) : l.type === 'video' ? (
                              <IconPlay className="h-3 w-3 translate-x-[1px]" />
                            ) : (
                              <IconDoc className="h-3 w-3" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm leading-snug">{l.title}</span>
                            <span className="mt-0.5 block text-xs text-navy-500">
                              {l.type === 'video' ? 'Video' : 'Reading'} · {l.duration}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </>
  )
}

function LessonView({
  courseSlug,
  lesson,
  lessonIndex,
  totalLessons,
  isComplete,
  onToggleComplete,
  onWatchProgress,
  prev,
  next,
  nextCourse,
  onNavigate,
}: {
  courseSlug: string
  lesson: Lesson
  lessonIndex: number
  totalLessons: number
  isComplete: boolean
  onToggleComplete: () => void
  onWatchProgress: (fraction: number) => void
  prev: Lesson | null
  next: Lesson | null
  nextCourse: { slug: string; title: string } | null
  onNavigate: (slug: string) => void
}) {
  return (
    <article className="hero-reveal">
      <div className="flex items-center gap-3 text-xs text-navy-400 tracking-[0.15em] uppercase mb-4">
        <span className="text-gold-400 font-semibold">Lesson {lessonIndex} of {totalLessons}</span>
        <span aria-hidden className="text-navy-700">·</span>
        <span>{lesson.type === 'video' ? 'Video' : 'Reading'} · {lesson.duration}</span>
      </div>

      <h1 className="font-serif text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-3 sm:mb-4">
        {lesson.title}
      </h1>
      <p className="text-navy-300 text-base sm:text-lg mb-8 md:mb-10 max-w-2xl">{lesson.description}</p>

      <div className="mb-8 md:mb-10">
        {lesson.type === 'video' ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-elevated">
            <video
              key={lesson.slug}
              src={`/api/video/${courseSlug}/${lesson.slug}`}
              controls
              playsInline
              onTimeUpdate={(e) => {
                const v = e.currentTarget
                if (v.duration > 0) onWatchProgress(v.currentTime / v.duration)
              }}
              onEnded={() => onWatchProgress(1)}
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-5 sm:px-6 md:px-12 py-8 sm:py-10 md:py-14 shadow-elevated">
            <div className="prose-maono max-w-2xl mx-auto">
              <Markdown source={lesson.content ?? ''} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-12 py-5 border-y border-navy-800">
        <button
          onClick={onToggleComplete}
          className={`
            press inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold text-sm transition-colors
            focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 focus-visible:outline-none
            ${isComplete
              ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
              : 'border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400'}
          `}
        >
          <span aria-hidden className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">
            {isComplete ? '✓' : ''}
          </span>
          {isComplete ? 'Completed' : 'Mark as complete'}
        </button>
        <p className="text-xs text-navy-400 sm:ml-2">
          {isComplete ? 'Great. Keep going.' : 'Mark complete when you’re ready to move on.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => prev && onNavigate(prev.slug)}
          disabled={!prev}
          className="press flex-1 group text-left px-5 py-4 rounded-md border border-navy-800 bg-navy-900/50 hover:bg-navy-900 hover:border-navy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="block text-xs text-navy-500 tracking-[0.15em] uppercase mb-1">← Previous</span>
          <span className="block text-sm text-white font-medium truncate">
            {prev?.title ?? 'You’re at the start'}
          </span>
        </button>
        {next ? (
          <button
            onClick={() => onNavigate(next.slug)}
            className="press flex-1 group text-right px-5 py-4 rounded-md border border-navy-800 bg-navy-900/50 hover:bg-navy-900 hover:border-navy-700 transition-colors"
          >
            <span className="block text-xs text-gold-400 tracking-[0.15em] uppercase mb-1">Next →</span>
            <span className="block text-sm text-white font-medium truncate">{next.title}</span>
          </button>
        ) : nextCourse ? (
          // End of this course — move on to the next course in the sequence.
          <Link
            href={`/learn/${nextCourse.slug}`}
            className="press flex-1 text-right px-5 py-4 rounded-md bg-gold-500 hover:bg-gold-400 transition-colors"
          >
            <span className="block text-xs font-bold text-navy-950/70 tracking-[0.15em] uppercase mb-1">Next course →</span>
            <span className="block text-sm text-navy-950 font-bold truncate">{nextCourse.title}</span>
          </Link>
        ) : (
          <div className="flex-1 text-right px-5 py-4 rounded-md border border-navy-800 bg-navy-900/50 opacity-50">
            <span className="block text-xs text-gold-400 tracking-[0.15em] uppercase mb-1">Next →</span>
            <span className="block text-sm text-white font-medium truncate">Course complete 🎉</span>
          </div>
        )}
      </div>
    </article>
  )
}

function IconPlay({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconDoc({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}
