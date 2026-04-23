import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { MembershipTier } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'Membership Tiers, Bronze, Silver, Gold, Platinum',
  description: 'Choose a Maono membership tier. From signals access to full 1-on-1 mentorship.',
  path: '/memberships',
})

const TIERS: MembershipTier[] = [
  {
    name: 'Bronze',
    price: 499,
    period: 'month',
    description: 'Signals access and community. The best entry point.',
    features: ['Daily forex signals', 'WhatsApp community access', 'Weekly market recap'],
    highlighted: false,
  },
  {
    name: 'Silver',
    price: 899,
    period: 'month',
    description: 'Signals + structured beginner course access.',
    features: ['Everything in Bronze', 'Access to Forex Introduction course', 'Monthly group Q&A session'],
    highlighted: false,
  },
  {
    name: 'Gold',
    price: 1499,
    period: 'month',
    description: 'Full course library + live sessions. Most popular.',
    features: ['Everything in Silver', 'All 6 courses unlocked', 'Weekly live trading sessions', 'Trade review submissions'],
    highlighted: true,
  },
  {
    name: 'Platinum',
    price: 2499,
    period: 'month',
    description: '1-on-1 mentorship + everything in Gold.',
    features: ['Everything in Gold', 'Monthly 1-on-1 session', 'Priority WhatsApp support', 'Personalised trade plan'],
    highlighted: false,
  },
]

export default function MembershipsPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">Membership tiers</h1>
          <p className="text-navy-300 text-base sm:text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>
      </section>
      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 flex flex-col ${
                tier.highlighted
                  ? 'bg-navy-950 text-white ring-2 ring-gold-500'
                  : 'bg-white border border-navy-100'
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${tier.highlighted ? 'text-gold-400' : 'text-navy-500'}`}>
                {tier.name}
              </p>
              <p className={`font-serif text-3xl mb-1 ${tier.highlighted ? 'text-white' : 'text-navy-900'}`}>
                R{tier.price.toLocaleString()}
              </p>
              <p className="text-xs text-navy-400 mb-4">per {tier.period}</p>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-navy-300' : 'text-navy-500'}`}>
                {tier.description}
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map(f => (
                  <li key={f} className={`text-xs flex gap-2 ${tier.highlighted ? 'text-navy-300' : 'text-navy-600'}`}>
                    <span className="text-gold-500 shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout?item=tier-${tier.name.toLowerCase()}`}
                className={`press inline-flex items-center justify-center w-full px-4 py-3 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
                    : 'border border-navy-700 text-navy-900 hover:bg-navy-950 hover:text-white'
                }`}
              >
                Start {tier.name} →
              </Link>
            </div>
          ))}
        </div>
      </section>
      <CTABanner
        headline="Not sure which tier?"
        sub="Start with the free signals group and upgrade when you're ready."
      />
    </>
  )
}
