import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Image from 'next/image'
import { BROKER_OF_CHOICE } from '@/lib/links'

const BROKER_LOGO_PATH = '/images/brokers/maono-global-markets-logo.png'
const BROKER_LOGO_AVAILABLE = fs.existsSync(
  path.join(process.cwd(), 'public', BROKER_LOGO_PATH.replace(/^\//, '')),
)

export function BrokerOfChoice() {
  return (
    <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 border-y border-navy-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Broker of Choice
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
              {BROKER_OF_CHOICE.name}
            </h2>
            <p className="text-navy-300 text-base sm:text-lg mb-6">
              {BROKER_OF_CHOICE.blurb}
            </p>
            <ul className="space-y-2.5 mb-8">
              {[
                'Tight institutional spreads',
                'Fast execution, low slippage',
                'ZAR-friendly funding & withdrawals',
                'Trusted by the Maono community',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-200">
                  <span className="text-gold-400 mt-0.5">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
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
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 md:p-10 shadow-elevated">
            {BROKER_LOGO_AVAILABLE && (
              <div className="relative bg-navy-950 border border-navy-800 rounded-xl px-6 py-8 mb-6 flex items-center justify-center min-h-[140px]">
                <Image
                  src={BROKER_LOGO_PATH}
                  alt={`${BROKER_OF_CHOICE.name} logo`}
                  width={420}
                  height={210}
                  className="w-auto h-20 sm:h-24 object-contain"
                  priority={false}
                />
              </div>
            )}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gold-500/15 ring-1 ring-gold-400/40 flex items-center justify-center">
                <span className="text-gold-400 font-bold text-lg" aria-hidden>MGM</span>
              </div>
              <div>
                <p className="text-white font-semibold">{BROKER_OF_CHOICE.name}</p>
                <p className="text-xs text-navy-400">Maono recommended partner</p>
              </div>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-6">
              We trade with brokers we trust. {BROKER_OF_CHOICE.name} matches our standards on execution,
              spreads, and customer care, the things that quietly cost retail traders the most.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-navy-950 rounded-lg p-4 border border-navy-800">
                <p className="font-serif text-2xl text-gold-400">Tight</p>
                <p className="text-[10px] uppercase tracking-wider text-navy-400 mt-1">Spreads</p>
              </div>
              <div className="bg-navy-950 rounded-lg p-4 border border-navy-800">
                <p className="font-serif text-2xl text-gold-400">Fast</p>
                <p className="text-[10px] uppercase tracking-wider text-navy-400 mt-1">Execution</p>
              </div>
              <div className="bg-navy-950 rounded-lg p-4 border border-navy-800">
                <p className="font-serif text-2xl text-gold-400">ZAR</p>
                <p className="text-[10px] uppercase tracking-wider text-navy-400 mt-1">Funding</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
