import Link from 'next/link'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export function CTABanner({
  headline = 'Start free. Trade smarter.',
  sub = 'Join the Telegram channel and get real market analysis delivered daily.',
}: {
  headline?: string
  sub?: string
}) {
  return (
    <section className="bg-navy-900 py-12 md:py-16 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">{headline}</h2>
        <p className="text-navy-300 text-base sm:text-lg mb-6 md:mb-8">{sub}</p>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center justify-center px-8 py-4 text-lg bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors"
        >
          Join Telegram Channel
        </Link>
      </div>
    </section>
  )
}
