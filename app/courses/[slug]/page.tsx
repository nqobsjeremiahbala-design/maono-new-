import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCourse, getCourses } from '@/lib/content'
import { getCurriculum } from '@/lib/courseLessons'
import { CTABanner } from '@/components/layout/CTABanner'
import { JsonLd } from '@/components/shared/JsonLd'
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'
import { Markdown } from '@/lib/markdown'
import { CourseEnrollCta } from './CourseEnrollCta'

export async function generateStaticParams() {
  return getCourses().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getCourse(slug)
    return generatePageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/courses/${slug}`,
    })
  } catch {
    return {}
  }
}

const LEVEL_COPY: Record<string, string> = {
  beginner: 'Beginner · Start here',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const result = getCourse(slug)
    meta = result.meta
    content = result.content
  } catch {
    notFound()
  }

  const curriculum = getCurriculum(slug)
  const totalLessons = curriculum
    ? curriculum.modules.reduce((n, m) => n + m.lessons.length, 0)
    : meta!.lessons

  return (
    <>
      <JsonLd data={courseJsonLd(meta!)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: 'https://maonoforextrading.co.za' },
          { name: 'Courses', url: 'https://maonoforextrading.co.za/courses' },
          { name: meta!.title, url: `https://maonoforextrading.co.za/courses/${slug}` },
        ])}
      />

      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-[1fr_380px] gap-12 md:gap-16 items-start">
          <div className="hero-reveal">
            <Link
              href="/courses"
              className="text-navy-400 hover:text-gold-400 text-sm transition-colors inline-flex items-center gap-1 mb-10"
            >
              <span aria-hidden>←</span> All courses
            </Link>
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
              {LEVEL_COPY[meta!.level] ?? meta!.level}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] mb-6">
              {meta!.title}
            </h1>
            <p className="text-navy-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              {meta!.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-300">
              <span>{meta!.duration}</span>
              <span aria-hidden className="text-navy-700">·</span>
              <span>{totalLessons} lessons</span>
              {curriculum && (
                <>
                  <span aria-hidden className="text-navy-700">·</span>
                  <span className="text-gold-400">Interactive player</span>
                </>
              )}
            </div>
          </div>

          <CourseEnrollCta
            slug={slug}
            title={meta!.title}
            price={meta!.price}
            totalLessons={totalLessons}
            hasPlayer={!!curriculum}
          />
        </div>
      </section>

      <section className="bg-white py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start mb-20">
            <div>
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-5">What you’ll learn</p>
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 leading-[1.1] mb-8">
                Built for execution, not theory.
              </h2>
              <ul className="space-y-3">
                {meta!.topics.map(t => (
                  <li key={t} className="flex items-start gap-3 text-navy-700">
                    <span aria-hidden className="text-gold-500 mt-1 shrink-0">→</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
              <Image
                src={meta!.image || `/images/courses/${slug}.jpg`}
                alt={meta!.title}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {curriculum && (
            <div className="mb-20">
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-5">The curriculum</p>
              <h2 className="font-serif text-3xl md:text-4xl text-navy-900 leading-[1.1] mb-10">
                {curriculum.modules.length} modules · {totalLessons} lessons
              </h2>
              <ol className="space-y-10">
                {curriculum.modules.map((m, mi) => (
                  <li key={mi}>
                    <p className="text-xs text-gold-600 font-semibold tracking-[0.15em] uppercase mb-4">{m.title}</p>
                    <ul className="divide-y divide-navy-100 border-t border-b border-navy-100">
                      {m.lessons.map(l => (
                        <li key={l.slug} className="py-4 flex items-start gap-4">
                          <span
                            className="shrink-0 mt-0.5 w-8 h-8 rounded-full border border-navy-200 flex items-center justify-center text-sm text-navy-600"
                            aria-hidden
                          >
                            {l.type === 'video' ? '▶' : 'A'}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-navy-900 font-medium leading-snug">{l.title}</span>
                            <span className="block text-sm text-navy-500 mt-0.5">{l.description}</span>
                          </span>
                          <span className="shrink-0 text-xs text-navy-400 tabular-nums pt-1">
                            {l.type === 'video' ? 'Video' : 'Read'} · {l.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div>
            <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-5">About this course</p>
            <div className="prose-maono max-w-2xl">
              <Markdown source={content!} />
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Not ready to buy? Start free."
        sub="Join the signals group first — get a feel for how we teach before committing to a course."
      />
    </>
  )
}
