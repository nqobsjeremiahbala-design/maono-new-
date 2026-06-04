import Link from 'next/link'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

export function Hero() {
  return (
    <section className="relative bg-navy-950 overflow-hidden min-h-[620px] md:min-h-dvh flex">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero/hero-main.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Base darkening layer */}
        <div className="absolute inset-0 bg-navy-950/50" />

        {/* Noise/grain texture via CSS */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,15,30,0.7) 100%)',
          }}
        />

        {/* Directional gradient for text readability — mobile */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-navy-950/30 via-navy-950/60 to-navy-950" />
        {/* Directional gradient — desktop */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/20" />

        {/* Color tint for cinematic warmth */}
        <div className="absolute inset-0 bg-gold-500/[0.03] mix-blend-color pointer-events-none" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 md:pt-32 md:pb-36 flex items-end md:items-center">
        <div className="max-w-2xl hero-reveal w-full">
          <h1 className="font-serif font-extrabold text-[2.75rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 drop-shadow-lg tracking-tight">
            Forex education<br />
            <span className="text-gold-400">without the noise.</span>
          </h1>
          <p className="text-white/95 font-semibold text-lg sm:text-xl md:text-2xl mb-6 md:mb-10 max-w-xl drop-shadow-md">
            Institutional-grade trading education for South Africans at every stage, from first chart to full-time trader.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <Link
              href="/register"
              className="group press inline-flex items-center justify-center px-6 sm:px-8 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Start learning
              <span
                aria-hidden
                className="ml-2 inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/courses"
              className="press inline-flex items-center justify-center px-6 sm:px-8 py-4 min-h-[48px] border-2 border-gold-500 text-gold-500 font-bold rounded-md hover:bg-gold-500 hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Explore courses
            </Link>
            <Link
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-6 sm:px-8 py-4 min-h-[48px] text-white font-bold hover:text-gold-400 transition-colors"
            >
              Join Telegram Channel →
            </Link>
          </div>
          <div className="mt-6 md:mt-14 hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-navy-300 sm:divide-x divide-navy-700">
            <span className="sm:pr-6">Based in Cape Town</span>
            <span className="sm:px-6">7+ years trading &amp; mentoring</span>
            <span className="sm:pl-6">Real team. Real methodology.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
