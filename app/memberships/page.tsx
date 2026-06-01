import Link from 'next/link'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Course Bundles, Once-Off Access',
  description: 'Once-off course bundles from Maono Forex Trading. Bronze, Silver, Gold and Platinum, with lifetime access and unlimited student support.',
  path: '/memberships',
})

type Bundle = {
  name: string
  price: number
  originalPrice?: number
  badge?: string
  description: string
  courses: string[]
  highlighted?: boolean
  ribbon?: string
}

const BUNDLES: Bundle[] = [
  {
    name: 'Bronze',
    price: 899,
    description: 'Build the foundation. Three courses, once-off, lifetime access.',
    courses: ['Forex Introduction', 'Price Action Trading', 'Trading Tools'],
  },
  {
    name: 'Silver',
    price: 1299,
    description: 'The next step up. Stronger structure for serious beginners.',
    courses: ['Forex Introduction', 'Price Action Trading', 'Trading Tools', 'Risk & Money Management'],
  },
  {
    name: 'Gold',
    price: 3500,
    ribbon: 'Recommended',
    description: 'Full course library, lifetime access. Stack everything we teach in one bundle.',
    courses: [
      'Forex Introduction',
      'Price Action Trading',
      'Trading Tools',
      'Risk & Money Management',
      'Advanced Strategy',
      'Trading Psychology',
    ],
    highlighted: true,
  },
  {
    name: 'Platinum',
    price: 6499,
    description: 'Full library plus 1-on-1 mentorship and priority support from Jody and the team.',
    courses: [
      'Everything in Gold',
      'Monthly 1-on-1 mentorship session',
      'Priority Telegram support',
      'Personalised trade plan review',
    ],
  },
]

export default function MembershipsPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Course Bundles</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Once-off access. No subscriptions.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Pick a bundle, pay once, learn forever. Unlimited student support after completion.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BUNDLES.map(bundle => (
            <div
              key={bundle.name}
              className={`relative rounded-xl p-6 flex flex-col ${
                bundle.highlighted
                  ? 'bg-navy-950 text-white ring-2 ring-gold-500'
                  : 'bg-white border border-navy-100'
              }`}
            >
              {bundle.ribbon && (
                <span className="absolute -top-3 left-6 bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {bundle.ribbon}
                </span>
              )}
              <p className={`text-sm font-semibold mb-1 ${bundle.highlighted ? 'text-gold-400' : 'text-navy-500'}`}>
                {bundle.name}
              </p>
              {bundle.badge && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-gold-500 mb-2">{bundle.badge}</p>
              )}
              <div className="flex items-baseline gap-2 mb-1">
                <p className={`font-serif text-3xl ${bundle.highlighted ? 'text-white' : 'text-navy-900'}`}>
                  R{bundle.price.toLocaleString()}
                </p>
                {bundle.originalPrice && (
                  <p className={`text-sm line-through ${bundle.highlighted ? 'text-navy-400' : 'text-navy-400'}`}>
                    R{bundle.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-xs text-navy-400 mb-4">Once-off · lifetime access</p>
              <p className={`text-sm mb-5 ${bundle.highlighted ? 'text-navy-300' : 'text-navy-500'}`}>
                {bundle.description}
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {bundle.courses.map(c => (
                  <li key={c} className={`text-xs flex gap-2 ${bundle.highlighted ? 'text-navy-300' : 'text-navy-600'}`}>
                    <span className="text-gold-500 shrink-0">✓</span> {c}
                  </li>
                ))}
                <li className={`text-xs flex gap-2 font-semibold ${bundle.highlighted ? 'text-gold-400' : 'text-navy-900'}`}>
                  <span className="text-gold-500 shrink-0">✓</span> Unlimited student support after completion
                </li>
              </ul>
              <Link
                href={`/checkout?item=bundle-${bundle.name.toLowerCase()}`}
                className={`press inline-flex items-center justify-center w-full px-4 py-3 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                  bundle.highlighted
                    ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
                    : 'border border-navy-700 text-navy-900 hover:bg-navy-950 hover:text-white'
                }`}
              >
                Buy {bundle.name} →
              </Link>
            </div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-center text-sm text-navy-500 mt-10">
          Every bundle is a single, once-off payment. No recurring charges, no auto-renewals. After purchase you keep
          lifetime access plus unlimited student support.
        </p>
      </section>

      <CTABanner
        headline="Not sure which bundle?"
        sub="Start with the Telegram channel and pick a bundle when you're ready."
      />
    </>
  )
}
