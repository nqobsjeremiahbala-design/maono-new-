import Link from 'next/link'
import Image from 'next/image'
import { CTABanner } from '@/components/layout/CTABanner'
import { getCourses } from '@/lib/content'
import { getCurriculum } from '@/lib/courseLessons'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Courses',
  description:
    'Structured forex courses from beginner to institutional level. Price action, trading psychology, strategy design, and risk-first execution.',
  path: '/courses',
})

const LEVEL_COPY: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default function CoursesPage() {
  const courses = getCourses()
  const featured = courses.find(c => c.featured) ?? courses[0]
  const rest = courses.filter(c => c.slug !== featured.slug)

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="hero-reveal max-w-3xl">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6">The curriculum</p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
              Forex education<br />
              <span className="text-gold-400">without the noise.</span>
            </h1>
            <p className="text-navy-300 text-lg md:text-xl max-w-2xl leading-relaxed">
              Six structured courses built for real trading, not YouTube views. Start with the fundamentals,
              then layer in price action, risk management, psychology, and institutional concepts.
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-white py-20 md:py-28 px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                Featured · start here
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy-900 leading-[1.05] mb-6">
                {featured.title}
              </h2>
              <p className="text-navy-600 text-lg mb-8 leading-relaxed max-w-lg">
                {featured.description}
              </p>
              <ul className="space-y-2.5 mb-8">
                {featured.topics.slice(0, 4).map(t => (
                  <li key={t} className="flex items-start gap-3 text-navy-700">
                    <span aria-hidden className="text-gold-500 mt-1">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <span className="font-serif text-3xl text-navy-900">
                  R{featured.price.toLocaleString()}
                </span>
                <span className="text-navy-400 text-sm">
                  {featured.duration} · {featured.lessons} lessons
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href={`/courses/${featured.slug}`}
                  className="press inline-flex items-center justify-center px-6 py-3.5 rounded-md bg-navy-950 text-white font-semibold hover:bg-navy-900 transition-colors"
                >
                  View course details
                </Link>
                <Link
                  href={`/checkout?item=course-${featured.slug}`}
                  className="press inline-flex items-center justify-center px-6 py-3.5 rounded-md border border-navy-200 text-navy-900 font-semibold hover:border-gold-500 hover:text-gold-600 transition-colors"
                >
                  Enrol now
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
                <Image
                  src={featured.image || `/images/courses/${featured.slug}.jpg`}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white rounded-xl shadow-elevated p-5 max-w-[240px] border border-navy-100">
                <p className="text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase mb-1">
                  {LEVEL_COPY[featured.level]}
                </p>
                <p className="text-navy-900 font-semibold mb-1">{featured.lessons} lessons</p>
                <p className="text-navy-500 text-sm">{featured.duration} of structured content</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy-50 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 md:flex md:items-end md:justify-between md:gap-10">
            <div>
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">All courses</p>
              <h2 className="font-serif text-4xl md:text-5xl text-navy-900 leading-[1.08] max-w-2xl">
                Pick your path.
              </h2>
            </div>
            <p className="text-navy-600 max-w-sm mt-4 md:mt-0">
              Each course stands on its own. Or bundle three into a learning path for a lower combined price.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {rest.map(c => {
              const hasPlayer = !!getCurriculum(c.slug)
              return (
                <li key={c.slug} className="h-full">
                  <Link
                    href={`/courses/${c.slug}`}
                    className="press group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-navy-100 hover:border-gold-400 transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <div className="relative aspect-[4/3] bg-navy-100 overflow-hidden">
                      <Image
                        src={c.image || `/images/courses/${c.slug}.jpg`}
                        alt={c.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase">
                          {LEVEL_COPY[c.level]}
                        </span>
                        {hasPlayer && (
                          <span className="text-[11px] text-navy-400 tracking-wider">· Interactive</span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-navy-900 mb-2 leading-snug min-h-[3.5rem]">
                        {c.title}
                      </h3>
                      <p className="text-navy-500 text-sm mb-5 line-clamp-2">{c.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-navy-100">
                        <span className="text-navy-900 font-semibold">
                          R{c.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-navy-400">{c.duration} · {c.lessons} lessons</span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <CTABanner
        headline="Not sure which course to pick?"
        sub="Join the free signals group first — you’ll see how we teach before you pay for anything."
      />
    </>
  )
}
