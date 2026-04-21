import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const tiers = [
  { name: 'Bronze', price: 'R499', period: '/mo', highlight: false },
  { name: 'Silver', price: 'R899', period: '/mo', highlight: false },
  { name: 'Gold', price: 'R1,499', period: '/mo', highlight: true },
  { name: 'Platinum', price: 'R2,499', period: '/mo', highlight: false },
]

export function MembershipsPreview() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Membership tiers
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          From signals access to full mentorship — a tier for every stage of your journey.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tiers.map(t => (
            <div
              key={t.name}
              className={`rounded-lg p-5 text-center border ${
                t.highlight
                  ? 'border-gold-500 bg-navy-950 text-cream-50'
                  : 'border-navy-100 bg-cream-50 text-navy-900'
              }`}
            >
              <p className="font-semibold text-sm mb-1">{t.name}</p>
              <p className={`font-serif text-2xl ${t.highlight ? 'text-gold-400' : 'text-navy-900'}`}>
                {t.price}
              </p>
              <p className="text-xs text-navy-400">{t.period}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline">
            <Link href="/memberships">Compare all membership features →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
