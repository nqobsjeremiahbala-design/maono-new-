import { notFound } from 'next/navigation'
import { getCourses } from '@/lib/content'
import { CourseCard } from '@/components/shared/CourseCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { PathLevel } from '@/lib/types'

const config: Record<PathLevel, { title: string; description: string; intro: string }> = {
  beginner: {
    title: 'Beginner Path',
    description: 'Start your forex journey the right way. No prior experience needed.',
    intro: "You're new to forex and want a real foundation — not the scattered YouTube strategies that most beginners fall into. This path takes you from zero to placing your first structured trade with confidence.",
  },
  intermediate: {
    title: 'Intermediate Path',
    description: 'You know the basics. Now build a system that actually works.',
    intro: "You've traded before but your results are inconsistent. This path addresses the structural gaps — psychology, price action, and strategy — that keep intermediate traders stuck.",
  },
  advanced: {
    title: 'Advanced Path',
    description: 'Institutional concepts, prop firm prep, and full-time trading.',
    intro: "You're serious about trading as a career. This path covers institutional order flow, advanced price action, trading psychology at a pro level, and everything you need to approach prop firm evaluations.",
  },
}

const levelCourses: Record<PathLevel, string[]> = {
  beginner: ['forex-trading-introduction', 'trading-psychology', 'trading-tools'],
  intermediate: ['price-action-trading', 'trading-strategies', 'trading-psychology'],
  advanced: ['institutional-trading-concepts', 'trading-strategies', 'price-action-trading'],
}

export function generateStaticParams() {
  return (['beginner', 'intermediate', 'advanced'] as PathLevel[]).map(level => ({ level }))
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const c = config[level as PathLevel]
  if (!c) return {}
  return generatePageMetadata({ title: c.title, description: c.description, path: `/paths/${level}` })
}

export default async function PathPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) notFound()
  const lvl = level as PathLevel
  const c = config[lvl]
  const allCourses = getCourses()
  const courses = levelCourses[lvl]
    .map(slug => allCourses.find(course => course.slug === slug))
    .filter((course): course is NonNullable<typeof course> => course !== undefined)

  return (
    <>
      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">{c.title}</h1>
          <p className="text-navy-300 text-lg">{c.intro}</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-8">Recommended courses for this path</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => <CourseCard key={course.slug} course={course} />)}
          </div>
        </div>
      </section>
      <CTABanner
        headline="Start with the free signals group."
        sub="Get familiar with how we think before investing in a course."
      />
    </>
  )
}
