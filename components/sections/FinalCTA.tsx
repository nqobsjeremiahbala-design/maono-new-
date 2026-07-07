import Link from 'next/link'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 px-5 sm:px-6 bg-navy-950">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-gold-500 text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">
          Start free today
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
          Join the Telegram channel. Zero cost.
        </h2>
        <p className="text-navy-300 text-base sm:text-lg mb-8 md:mb-10">
          Get real market analysis on Telegram daily. No commitment. Cancel anytime.
        </p>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center justify-center w-full px-8 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 transition-colors"
        >
          Join Telegram Channel
        </Link>
      </div>
    </section>
  )
}
