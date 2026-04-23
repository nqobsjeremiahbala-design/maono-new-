import Image from 'next/image'

const PRINCIPLES = [
  'Risk-first position sizing',
  'Pre-market trade plan template',
  'Trader psychology and journaling',
  'Weekly accountability with mentors',
]

export function ConfidenceSplit() {
  return (
    <section className="bg-white py-16 md:py-32 px-5 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy-900 mb-5 md:mb-6 leading-[1.05]">
            Confidence<br />through discipline.
          </h2>
          <p className="text-navy-600 text-base sm:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">
            Trade with a plan, not a feeling. We teach the process behind the P&amp;L, so every entry is intentional, every loss is survivable, and every month compounds.
          </p>
          <ul className="space-y-4 mb-2">
            {PRINCIPLES.map(p => (
              <li key={p} className="flex items-start gap-3 text-navy-900 text-base sm:text-[17px]">
                <span aria-hidden className="text-gold-500 mt-[1px] text-lg leading-tight">→</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
            <Image
              src="/images/lifestyle/confidence-v2.jpg"
              alt="Disciplined trader focused on charts"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 right-3 md:-bottom-6 md:-right-10 bg-white rounded-xl shadow-elevated p-4 md:p-5 max-w-[200px] md:max-w-[240px] border border-navy-100">
            <p className="text-[10px] md:text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase mb-1">
              Risk rule
            </p>
            <p className="text-navy-900 font-semibold mb-1 text-sm md:text-base">1% per trade, max</p>
            <p className="text-navy-500 text-xs md:text-sm">Capital protection before profit.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
