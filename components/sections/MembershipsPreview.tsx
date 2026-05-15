import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type Bundle = {
  name: string
  price: string
  originalPrice?: string
  blurb: string
  highlight?: boolean
  badge?: string
}

const BUNDLES: Bundle[] = [
  {
    name: 'Bronze',
    price: 'R899',
    blurb: 'Foundation: Forex Intro, Price Action, Tools.',
  },
  {
    name: 'Silver',
    price: 'R1,299',
    blurb: 'Adds risk & money management.',
  },
  {
    name: 'Gold',
    price: 'R799',
    originalPrice: 'R3,500',
    blurb: 'Full course library. Black Friday pricing.',
    badge: 'BF Special',
    highlight: true,
  },
  {
    name: 'Platinum',
    price: 'R6,499',
    blurb: '1-on-1 mentorship + priority support.',
  },
]

export function MembershipsPreview() {
  return (
    <section className="py-16 md:py-20 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Course Bundles
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 leading-tight mb-3">
            Pay once. Learn forever.
          </h2>
          <p className="text-navy-500 max-w-xl mx-auto text-base sm:text-lg">
            Once-off course bundles, lifetime access, unlimited student support.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10">
          {BUNDLES.map(t => (
            <Link
              key={t.name}
              href="/memberships"
              className={`press group relative rounded-xl p-5 sm:p-6 border transition-colors ${
                t.highlight
                  ? 'border-gold-500 bg-navy-950 text-white hover:bg-navy-900'
                  : 'border-navy-100 bg-white hover:border-gold-400'
              }`}
            >
              {t.badge && (
                <span className="absolute -top-2.5 left-4 bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  {t.badge}
                </span>
              )}
              <p className={`font-semibold text-sm mb-1 ${t.highlight ? 'text-gold-400' : 'text-navy-900'}`}>
                {t.name}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className={`font-serif text-2xl sm:text-3xl ${t.highlight ? 'text-white' : 'text-navy-900'}`}>
                  {t.price}
                </p>
                {t.originalPrice && (
                  <p className={`text-xs line-through ${t.highlight ? 'text-navy-400' : 'text-navy-400'}`}>
                    {t.originalPrice}
                  </p>
                )}
              </div>
              <p className={`text-[11px] uppercase tracking-wider mb-3 ${t.highlight ? 'text-navy-400' : 'text-navy-400'}`}>
                Once-off
              </p>
              <p className={`text-xs leading-relaxed ${t.highlight ? 'text-navy-200' : 'text-navy-500'}`}>
                {t.blurb}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline">
            <Link href="/memberships">Compare all bundles →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
