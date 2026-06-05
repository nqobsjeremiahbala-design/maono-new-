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
    price: 'R1,999',
    originalPrice: 'R3,500',
    blurb: 'Full course library, lifetime access.',
    badge: 'Recommended',
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
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold-600 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase mb-3">
            Course Bundles
          </p>
          <h2 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-navy-900 leading-[1.04] tracking-tight mb-4">
            Pay once.{' '}
            <span className="text-gold-600">Learn forever.</span>
          </h2>
          <p className="text-navy-600 max-w-xl mx-auto text-lg sm:text-xl font-medium">
            Once-off course bundles, lifetime access, unlimited student support.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10">
          {BUNDLES.map(t => (
            <Link
              key={t.name}
              href="/memberships"
              className={`press group relative rounded-xl p-5 sm:p-6 border transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:border-navy-950 hover:ring-2 hover:ring-navy-900 hover:shadow-[0_24px_48px_-12px_rgba(201,168,76,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2 text-navy-950 ${
                t.highlight
                  ? 'border-navy-900 ring-2 ring-navy-900 bg-gradient-to-br from-gold-200 via-gold-400 to-gold-500 shadow-xl sm:scale-[1.03]'
                  : 'border-gold-300 bg-gradient-to-br from-gold-300 to-gold-500'
              }`}
            >
              {t.badge && (
                <span className="absolute -top-2.5 left-4 bg-navy-950 text-gold-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md transition-transform duration-200 group-hover:scale-110">
                  {t.badge}
                </span>
              )}
              <p className="font-bold text-sm mb-1 text-navy-900">
                {t.name}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="font-serif font-bold text-2xl sm:text-3xl text-navy-950">
                  {t.price}
                </p>
                {t.originalPrice && (
                  <p className="text-xs line-through text-navy-900/55">{t.originalPrice}</p>
                )}
              </div>
              <p className="text-[11px] uppercase tracking-wider mb-3 font-semibold text-navy-900/70">Once-off</p>
              <p className="text-xs leading-relaxed text-navy-900/80">
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
