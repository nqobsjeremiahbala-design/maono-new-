'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BROKER_OF_CHOICE } from '@/lib/links'

export function BrokerOfChoice() {
  const ref = useRef<HTMLElement>(null)
  const raf = useRef(0)

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    })
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => ref.current?.style.setProperty('--glow', '1')}
      onMouseLeave={() => ref.current?.style.setProperty('--glow', '0')}
      className="broker-spotlight group relative overflow-hidden bg-navy-950 py-16 md:py-24 px-5 sm:px-6 border-y border-white/5"
    >
      {/* Static warm gold glow behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 700px 350px at 50% 35%, rgba(212,160,23,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Heading — big and bold at the top */}
        <h2 className="mb-9 font-serif text-5xl font-extrabold leading-[1.03] text-white sm:text-6xl md:text-7xl">
          Broker of Choice
        </h2>

        {/* MGM logo — transparent dark-site art; sits directly on the navy, big and centred */}
        <div className="mb-9 flex justify-center">
          <Image
            src="/images/logo/maono_global_markets_clean_dark_site.png"
            alt={`${BROKER_OF_CHOICE.name} logo`}
            width={1220}
            height={403}
            priority
            className="h-auto w-full max-w-[340px] object-contain drop-shadow-[0_8px_40px_rgba(212,160,23,0.18)] transition-transform duration-300 group-hover:scale-[1.02] sm:max-w-[460px] md:max-w-[560px]"
          />
        </div>

        {/* FSCA Regulated Broker — prominent white copy (not a card) with a pulsing gold dot */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="broker-pulse absolute inline-flex h-full w-full rounded-full bg-gold-500" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold-500" />
          </span>
          <span className="text-xl font-bold uppercase tracking-[0.12em] text-white sm:text-2xl">FSCA Regulated Broker</span>
        </div>

        <p className="mx-auto max-w-xl text-base text-navy-300 sm:text-lg">{BROKER_OF_CHOICE.blurb}</p>

        {/* Gold gradient separator */}
        <div
          aria-hidden
          className="mx-auto my-9 h-px w-[200px] opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />

        <ul className="mx-auto mb-10 max-w-md space-y-3.5 border-l-2 border-gold-500/20 pl-4 text-left">
          {[
            'Tight institutional spreads',
            'Fast execution, low slippage',
            'ZAR-friendly funding & withdrawals',
            'Trusted by the Maono community',
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-[15px] text-navy-100 sm:text-base">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/12 text-sm font-bold text-gold-500">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={BROKER_OF_CHOICE.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex h-[52px] w-[220px] items-center justify-center rounded-md bg-gold-500 text-base font-bold text-navy-950 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
          >
            Open a trading account →
          </Link>
          <Link
            href={BROKER_OF_CHOICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex h-[52px] w-[220px] items-center justify-center rounded-md border border-gold-500/50 font-semibold text-gold-500 transition-colors hover:bg-gold-500/[0.08]"
          >
            Visit {BROKER_OF_CHOICE.name.split(' ')[0]} site
          </Link>
        </div>
      </div>
    </section>
  )
}
