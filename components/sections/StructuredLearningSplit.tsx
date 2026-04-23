import Link from 'next/link'
import Image from 'next/image'

const FEATURES = [
  'Six-module trading framework',
  'Price action and institutional concepts',
  'Risk-first trade planning',
  'Weekly review and journaling',
]

export function StructuredLearningSplit() {
  return (
    <section className="bg-white py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy-900 mb-6 leading-[1.05]">
            Structured<br />learning
          </h2>
          <p className="text-navy-600 text-lg leading-relaxed mb-10 max-w-md">
            A clear, step-by-step trading framework. No confusing indicators, no random strategies, just a repeatable process you can follow in any market.
          </p>
          <ul className="space-y-4 mb-10">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-navy-900 text-[17px]">
                <span aria-hidden className="text-gold-500 mt-[1px] text-lg leading-tight">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/courses"
            className="press inline-flex items-center justify-center px-8 py-3 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            Explore the course
          </Link>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
            <Image
              src="/images/lifestyle/structured-v2.jpg"
              alt="Structured learning path"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white rounded-xl shadow-elevated p-5 max-w-[240px] border border-navy-100">
            <p className="text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase mb-1">
              Module 3
            </p>
            <p className="text-navy-900 font-semibold mb-1">Institutional concepts</p>
            <p className="text-navy-500 text-sm">12 lessons · 2h 18m</p>
          </div>
        </div>
      </div>
    </section>
  )
}
