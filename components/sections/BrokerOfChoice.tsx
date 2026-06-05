import Image from 'next/image'
import Link from 'next/link'
import { BROKER_OF_CHOICE } from '@/lib/links'

export function BrokerOfChoice() {
  return (
    <section className="bg-navy-950 py-16 md:py-24 px-5 sm:px-6 border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        {/* MGM logo in a clean white container — large & prominent */}
        <div className="flex justify-center mb-9">
          <div className="rounded-2xl bg-white p-4 md:p-5 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/logo/mgm-broker-logo.jpeg"
              alt={`${BROKER_OF_CHOICE.name} logo`}
              width={360}
              height={150}
              className="h-[132px] md:h-[168px] w-auto object-contain"
            />
          </div>
        </div>

        <p className="text-teal-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          Broker of Choice
        </p>

        <h2 className="font-serif text-[2.75rem] sm:text-5xl md:text-6xl text-white leading-[1.04] mb-6">
          {BROKER_OF_CHOICE.name}
        </h2>

        {/* FSCA Regulated — prominent teal pill with a pulsing glow dot */}
        <div className="flex justify-center mb-7">
          <span className="inline-flex items-center gap-2.5 rounded-full border-2 border-teal-400/60 bg-teal-400/10 px-5 py-2 text-sm sm:text-base font-bold tracking-wide text-teal-200 shadow-[0_0_34px_-8px_rgba(45,212,191,0.65)]">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400" />
            </span>
            FSCA Regulated
          </span>
        </div>

        <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
          {BROKER_OF_CHOICE.blurb}
        </p>

        {/* Separator between tagline and checklist */}
        <div className="h-px w-24 mx-auto my-9 bg-white/10" />

        <ul className="space-y-4 mb-10 max-w-md mx-auto text-left">
          {[
            'Tight institutional spreads',
            'Fast execution, low slippage',
            'ZAR-friendly funding & withdrawals',
            'Trusted by the Maono community',
          ].map(item => (
            <li key={item} className="flex items-center gap-3 text-[15px] sm:text-base text-slate-200">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/40 text-sm font-bold">
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
            className="press inline-flex items-center justify-center px-8 py-4 min-h-[52px] rounded-md bg-gold-500 text-navy-950 font-bold text-base shadow-lg transition-all duration-200 hover:bg-gold-400 hover:scale-[1.03]"
          >
            Open a trading account →
          </Link>
          <Link
            href={BROKER_OF_CHOICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-8 py-4 min-h-[52px] rounded-md border-2 border-teal-400/60 text-teal-200 font-semibold transition-colors hover:border-teal-300 hover:text-teal-100 hover:bg-teal-400/5"
          >
            Visit {BROKER_OF_CHOICE.name.split(' ')[0]} site
          </Link>
        </div>
      </div>
    </section>
  )
}
