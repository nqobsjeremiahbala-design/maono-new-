import Link from 'next/link'
import Image from 'next/image'
import { CTABanner } from '@/components/layout/CTABanner'
import { getResources } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Free Forex Learning Resources',
  description:
    'Free guides, lessons, market breakdowns and cheatsheets from the Maono team. No signup, no upsell — just the things that help you trade better.',
  path: '/resources',
})

const TYPE_COPY: Record<string, string> = {
  lesson: 'Lesson',
  breakdown: 'Market breakdown',
  guide: 'Guide',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ResourcesPage() {
  const resources = [...getResources()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const [featured, ...rest] = resources

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-10 py-16 sm:py-20 md:py-28">
          <div className="hero-reveal max-w-3xl">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6">Free resources</p>
            <h1 className="font-serif text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 sm:mb-6">
              Practical guides.<br />
              <span className="text-gold-400">No signup.</span>
            </h1>
            <p className="text-navy-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
              Lessons, cheatsheets, and market breakdowns from the Maono team. Free to read, free to share.
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-white py-16 md:py-28 px-5 sm:px-6 md:px-12">
          <Link
            href={`/resources/${featured.slug}`}
            className="press group block max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:outline-none rounded-3xl"
          >
            <div className="order-2 md:order-1">
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-5">
                Featured · {TYPE_COPY[featured.type] ?? featured.type}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-navy-900 leading-[1.1] mb-5 group-hover:text-gold-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-navy-600 text-base sm:text-lg mb-6 leading-relaxed max-w-lg">{featured.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                Read the guide
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
              <Image
                src={featured.image || '/images/resources/default.jpg'}
                alt={featured.title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </Link>
        </section>
      )}

      <section className="bg-navy-50 py-16 md:py-28 px-5 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 md:mb-14 md:flex md:items-end md:justify-between md:gap-10">
            <div>
              <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">All resources</p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 leading-[1.08] max-w-2xl">
                Everything, organised.
              </h2>
            </div>
            <p className="text-navy-600 text-base sm:text-lg max-w-sm mt-4 md:mt-0">
              New pieces added most weeks. Bookmark the ones that help, skip the ones that do not.
            </p>
          </div>

          {rest.length === 0 ? (
            <p className="text-navy-500">More resources coming soon.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(r => (
                <li key={r.slug}>
                  <Link
                    href={`/resources/${r.slug}`}
                    className="press group block h-full rounded-2xl overflow-hidden bg-white border border-navy-100 hover:border-gold-400 transition-colors focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <div className="relative aspect-[16/9] bg-navy-100 overflow-hidden">
                      <Image
                        src={r.image || '/images/resources/default.jpg'}
                        alt={r.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase">
                          {TYPE_COPY[r.type] ?? r.type}
                        </span>
                        <span className="text-[11px] text-navy-400">· {formatDate(r.date)}</span>
                      </div>
                      <h3 className="font-serif text-xl text-navy-900 mb-2 leading-snug group-hover:text-gold-600 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-navy-500 text-sm line-clamp-3">{r.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTABanner
        headline="Want more than articles?"
        sub="Join the free signals group for daily chart breakdowns sent to your WhatsApp."
      />
    </>
  )
}
