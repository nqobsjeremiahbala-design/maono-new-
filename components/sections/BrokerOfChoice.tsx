import Link from 'next/link'
import { BROKER_OF_CHOICE } from '@/lib/links'

export function BrokerOfChoice() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 md:py-20 px-5 sm:px-6 border-y border-emerald-500/30">
      {/* Vibrant green glow to make the broker block pop */}
      <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          Broker of Choice
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
          {BROKER_OF_CHOICE.name}
        </h2>
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-300 shadow-[0_0_24px_-6px_rgba(16,185,129,0.5)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            FSCA regulated
          </span>
        </div>
        <p className="text-navy-300 text-base sm:text-lg mb-8">
          {BROKER_OF_CHOICE.blurb}
        </p>
        <ul className="space-y-2.5 mb-10 max-w-md mx-auto text-left">
          {[
            'Tight institutional spreads',
            'Fast execution, low slippage',
            'ZAR-friendly funding & withdrawals',
            'Trusted by the Maono community',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-navy-200">
              <span className="text-emerald-400 mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={BROKER_OF_CHOICE.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
          >
            Open a trading account →
          </Link>
          <Link
            href={BROKER_OF_CHOICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-md border border-navy-700 text-navy-200 font-semibold hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            Visit {BROKER_OF_CHOICE.name.split(' ')[0]} site
          </Link>
        </div>
      </div>
    </section>
  )
}
