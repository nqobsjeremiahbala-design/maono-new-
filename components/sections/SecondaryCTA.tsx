import Link from 'next/link'
import Image from 'next/image'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export function SecondaryCTA() {
  return (
    <section className="relative bg-navy-950 py-28 md:py-36 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/secondary-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/75" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-gold-400 text-sm font-medium uppercase tracking-[0.2em] mb-4">
          Choose Maono as your guide and mentor
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-8">
          Start learning forex today.
        </h2>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-10 py-4 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors"
        >
          Join Telegram →
        </Link>
      </div>
    </section>
  )
}
