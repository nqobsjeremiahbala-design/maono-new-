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
    price: 1999,
    originalPrice: 3500,
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
              className={`relative rounded-xl p-6 flex flex-col text-navy-950 ${
                bundle.highlighted
                  ? 'bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 ring-2 ring-navy-900 shadow-xl'
                  : 'bg-white border border-navy-200'
              }`}
            >
              {bundle.ribbon && (
                <span className="absolute -top-3 left-6 bg-navy-950 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                  {bundle.ribbon}
                </span>
              )}
              <p className="text-sm font-bold mb-1 text-navy-900">
                {bundle.name}
              </p>
              {bundle.badge && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-navy-900 mb-2">{bundle.badge}</p>
              )}
              <div className="flex items-baseline gap-2 mb-1">
                <p className="font-serif font-bold text-3xl text-navy-950">
                  R{bundle.price.toLocaleString()}
                </p>
                {bundle.originalPrice && (
                  <p className={`text-sm line-through ${bundle.highlighted ? 'text-navy-900/55' : 'text-navy-400'}`}>
                    R{bundle.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className={`text-xs mb-4 ${bundle.highlighted ? 'text-navy-900/70' : 'text-navy-500'}`}>Once-off · lifetime access</p>
              <p className={`text-sm mb-5 font-medium ${bundle.highlighted ? 'text-navy-900/90' : 'text-navy-700'}`}>
                {bundle.description}
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {bundle.courses.map(c => (
                  <li key={c} className={`text-xs flex gap-2 font-medium ${bundle.highlighted ? 'text-navy-900/90' : 'text-navy-800'}`}>
                    <span className="text-navy-900 shrink-0 font-bold">✓</span> {c}
                  </li>
                ))}
                <li className="text-xs flex gap-2 font-bold text-navy-900">
                  <span className="text-navy-900 shrink-0 font-bold">✓</span> Unlimited student support after completion
                </li>
              </ul>
              <Link
                href={`/checkout?item=bundle-${bundle.name.toLowerCase()}`}
                className={`press inline-flex items-center justify-center w-full px-4 py-3 min-h-[44px] rounded-md text-sm font-bold transition-colors ${
                  bundle.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-navy-800 text-navy-900 hover:bg-navy-950 hover:text-white'
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
