import Link from 'next/link'

const features = [
  'Regulated & trusted South African broker',
  'Competitive spreads on forex, indices & commodities',
  'Seamless account setup for Maono students',
  'Preferred platform for our live trading sessions',
]

export function BrokerSection() {
  return (
    <section className="bg-navy-950 py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-950 p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Broker of Choice
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6">
              Maono Global Markets
            </h2>
            <p className="text-navy-300 text-base sm:text-lg mb-8 max-w-lg">
              Our recommended trading partner. Built for South African traders who are serious about executing in the live market with confidence.
            </p>
            <ul className="space-y-3 mb-10">
              {features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-navy-200">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                      <path d="M1 4L3.5 6.5L9 1" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="https://maonoforextrading.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-8 py-4 min-h-[52px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 transition-colors text-sm tracking-wide"
            >
              Open a Trading Account →
            </a>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-navy-800 border border-gold-500/20 flex items-center justify-center">
              <p className="font-serif text-white text-center text-lg md:text-xl font-bold leading-snug px-4">
                Maono<br />
                <span className="text-gold-400">Global</span><br />
                Markets
              </p>
            </div>
            <p className="text-xs text-navy-500 text-center max-w-[160px]">
              Our official broker partner for live trading
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
