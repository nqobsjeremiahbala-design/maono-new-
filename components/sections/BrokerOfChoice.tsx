import Image from 'next/image'
import Link from 'next/link'
import { BROKER_OF_CHOICE } from '@/lib/links'

export function BrokerOfChoice() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 md:py-24 px-5 sm:px-6 border-y border-white/5">
      {/* Subtle warm "lit from above" gold glow behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 700px 350px at 50% 35%, rgba(212,160,23,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* MGM logo — single clean white card (the artwork already sits on white) */}
        <div className="flex justify-center mb-9">
          <Image
            src="/images/logo/mgm-broker-logo.jpeg"
            alt={`${BROKER_OF_CHOICE.name} logo`}
            width={360}
            height={150}
            className="h-[132px] md:h-[168px] w-auto object-contain rounded-2xl ring-1 ring-gold-500/25 shadow-[0_0_0_1px_rgba(212,160,23,0.15),0_8px_40px_rgba(212,160,23,0.12)]"
          />
        </div>

        <p className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
          Broker of Choice
        </p>

        <h2 className="font-serif font-extrabold text-5xl sm:text-6xl md:text-7xl text-white leading-[1.03] mb-6">
          {BROKER_OF_CHOICE.name}
        </h2>

        {/* FSCA Regulated — white copy (not a card), with a slow pulsing gold dot */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold-500 broker-pulse" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-500" />
          </span>
          <span className="text-white font-semibold tracking-wide text-sm sm:text-base">FSCA Regulated</span>
        </div>

        <p className="text-navy-300 text-base sm:text-lg max-w-xl mx-auto">
          {BROKER_OF_CHOICE.blurb}
        </p>

        {/* Gold gradient separator */}
        <div
          aria-hidden
          className="mx-auto my-9 h-px w-[200px] opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />

        <ul className="space-y-3.5 mb-10 max-w-md mx-auto text-left border-l-2 border-gold-500/20 pl-4">
          {[
            'Tight institutional spreads',
            'Fast execution, low slippage',
            'ZAR-friendly funding & withdrawals',
            'Trusted by the Maono community',
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-[15px] sm:text-base text-navy-100">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/12 text-gold-500 text-sm font-bold">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={BROKER_OF_CHOICE.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex h-[52px] w-[220px] items-center justify-center rounded-md bg-gold-500 text-navy-950 font-bold text-base shadow-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
          >
            Open a trading account →
          </Link>
          <Link
            href={BROKER_OF_CHOICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex h-[52px] w-[220px] items-center justify-center rounded-md border border-gold-500/50 text-gold-500 font-semibold transition-colors hover:bg-gold-500/[0.08]"
          >
            Visit {BROKER_OF_CHOICE.name.split(' ')[0]} site
          </Link>
        </div>
      </div>
    </section>
  )
}
