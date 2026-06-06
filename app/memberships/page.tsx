import Link from 'next/link'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import { BUNDLES, COURSE_TITLES } from '@/lib/checkout'

export const metadata = generatePageMetadata({
  title: 'Course Bundles, Once-Off Access',
  description:
    'Choose a bundle to unlock your courses. Bronze, Silver, Gold and Platinum — once-off, lifetime access, with unlimited student support.',
  path: '/memberships',
})

export default function MembershipsPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Course Bundles</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Pick a bundle. Unlock your courses.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Choosing a bundle is the only way to enrol — each one unlocks a set of courses for a single,
            once-off payment. No subscriptions. Unlimited student support after completion.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className={`group relative rounded-xl p-6 flex flex-col border text-navy-950 transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:border-navy-950 hover:ring-2 hover:ring-navy-900 hover:shadow-[0_24px_48px_-12px_rgba(10,15,30,0.45)] ${
                bundle.recommended
                  ? 'border-navy-900 ring-2 ring-navy-900 bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 shadow-xl'
                  : 'bg-white border-navy-200'
              }`}
            >
              {bundle.recommended && (
                <span className="absolute -top-3 left-6 bg-navy-950 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                  Recommended
                </span>
              )}
              <p className="text-sm font-bold mb-0.5 text-navy-900">{bundle.name}</p>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${bundle.recommended ? 'text-navy-900/70' : 'text-navy-500'}`}>
                {bundle.tagline}
              </p>
              <p className="font-serif font-bold text-3xl text-navy-950 mb-1">
                R{bundle.price.toLocaleString()}
              </p>
              <p className={`text-xs mb-5 ${bundle.recommended ? 'text-navy-900/70' : 'text-navy-500'}`}>
                Once-off · lifetime access
              </p>

              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${bundle.recommended ? 'text-navy-900/80' : 'text-navy-500'}`}>
                {bundle.courseSlugs.length} courses included
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {bundle.courseSlugs.map((slug) => (
                  <li key={slug} className={`text-xs flex gap-2 font-medium ${bundle.recommended ? 'text-navy-900/90' : 'text-navy-800'}`}>
                    <span className="text-navy-900 shrink-0 font-bold">✓</span> {COURSE_TITLES[slug]}
                  </li>
                ))}
                {bundle.perks?.map((perk) => (
                  <li key={perk} className="text-xs flex gap-2 font-bold text-navy-900">
                    <span className="text-navy-900 shrink-0 font-bold">★</span> {perk}
                  </li>
                ))}
                <li className={`text-xs flex gap-2 font-medium ${bundle.recommended ? 'text-navy-900/90' : 'text-navy-800'}`}>
                  <span className="text-navy-900 shrink-0 font-bold">✓</span> Unlimited student support after completion
                </li>
              </ul>

              <Link
                href={`/checkout?item=${bundle.id}`}
                className={`press inline-flex items-center justify-center w-full px-4 py-3 min-h-[44px] rounded-md text-sm font-bold transition-colors ${
                  bundle.recommended
                    ? 'bg-navy-950 text-white hover:bg-navy-800'
                    : 'border border-navy-800 text-navy-900 hover:bg-navy-950 hover:text-white'
                }`}
              >
                Choose {bundle.name} →
              </Link>
            </div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-center text-sm text-navy-500 mt-10">
          Every bundle is a single, once-off payment. No recurring charges, no auto-renewals. After purchase you keep
          lifetime access to every course in your bundle, plus unlimited student support.
        </p>
      </section>

      <CTABanner
        headline="Not sure which bundle?"
        sub="Start with the Telegram channel and pick a bundle when you're ready."
      />
    </>
  )
}
