import Link from 'next/link'
import { BROKER_OF_CHOICE } from '@/lib/links'

export function BrokerOfChoice() {
  return (
    <section className="relative py-20 md:py-24 px-5 sm:px-6 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.14), transparent 50%)',
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">
            Broker of Choice
          </p>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            We trade with{' '}
            <span className="text-gold-400">{BROKER_OF_CHOICE.name}</span>.
          </h2>
          <p className="text-navy-200 text-base sm:text-lg max-w-2xl mx-auto">
            {BROKER_OF_CHOICE.blurb}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-gold-500/40 bg-navy-950/70 backdrop-blur p-8 sm:p-10 md:p-12 text-center shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
            <div>
              <p className="text-gold-400 font-bold text-sm uppercase tracking-wide mb-1">Tight spreads</p>
              <p className="text-navy-300 text-sm">From 0.0 pips on majors. Built for active traders.</p>
            </div>
            <div>
              <p className="text-gold-400 font-bold text-sm uppercase tracking-wide mb-1">SA-friendly funding</p>
              <p className="text-navy-300 text-sm">EFT, card, and local payment options for ZAR deposits.</p>
            </div>
            <div>
              <p className="text-gold-400 font-bold text-sm uppercase tracking-wide mb-1">Fast execution</p>
              <p className="text-navy-300 text-sm">Institutional liquidity with retail-friendly account sizes.</p>
            </div>
          </div>
          <Link
            href={BROKER_OF_CHOICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-10 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold text-lg rounded-md hover:bg-gold-400 transition-colors"
          >
            Open an account with {BROKER_OF_CHOICE.name} →
          </Link>
        </div>
      </div>
    </section>
  )
}
