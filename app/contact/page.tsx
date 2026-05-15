import Link from 'next/link'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export const metadata = generatePageMetadata({
  title: 'Contact Maono Forex Trading',
  description: 'Get in touch with the Maono team via Telegram.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <section className="bg-navy-950 min-h-dvh flex items-center justify-center px-5 sm:px-6 py-20">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Contact Us</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-6">
          Talk to us on Telegram
        </h1>
        <p className="text-navy-300 text-base sm:text-lg mb-10 max-w-md mx-auto">
          Join our Telegram channel for support, membership enquiries, and direct access to the Maono team.
        </p>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[52px] bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors text-base"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
          </svg>
          Open Telegram Channel
        </Link>
        <div className="mt-12 text-sm text-navy-500 space-y-1">
          <p>+27 81 436 9770</p>
          <p>accounts@maonoforextrading.co.za</p>
        </div>
      </div>
    </section>
  )
}
