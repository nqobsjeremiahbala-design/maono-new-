import Link from 'next/link'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export const metadata = generatePageMetadata({
  title: 'Join the Telegram Channel',
  description: 'Join the Maono Telegram channel. Real market analysis and daily trade ideas. Zero cost.',
  path: '/signals',
})

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-navy-950 py-16 md:py-20 px-5 sm:px-6">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-gold-500 text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">
          Free · No commitment
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
          Join the Telegram channel
        </h1>
        <p className="text-navy-300 text-base sm:text-lg mb-8 md:mb-10">
          Real market analysis. Daily trade ideas. A community of SA traders growing together.
          Telegram-based. Zero cost. Cancel anytime.
        </p>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center justify-center w-full px-8 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 transition-colors"
        >
          Open Telegram Channel →
        </Link>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm text-navy-400 mt-10">
          <div><p className="text-white font-semibold mb-1">Daily</p><p>Market analysis</p></div>
          <div><p className="text-white font-semibold mb-1">Live</p><p>Trade setups</p></div>
          <div><p className="text-white font-semibold mb-1">Free</p><p>Forever</p></div>
        </div>
      </div>
    </div>
  )
}
