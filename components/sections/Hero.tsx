import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative bg-navy-950 overflow-hidden">
      <div className="relative md:hidden aspect-[16/11] w-full">
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-950" />
      </div>

      <div className="hidden md:block absolute inset-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-32 md:pb-36 md:min-h-dvh md:flex md:items-center">
        <div className="max-w-2xl hero-reveal w-full">
          <h1 className="font-serif text-[2.5rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl text-white md:leading-[1.05] mb-5 md:mb-6">
            Forex education<br />
            <span className="text-gold-400">without the noise.</span>
          </h1>
          <p className="text-navy-200 text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-xl">
            Institutional-grade trading education for South Africans at every stage, from first chart to full-time trader.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/signals"
              className="group press inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Join the free signals group
              <span
                aria-hidden
                className="ml-2 inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/courses"
              className="press inline-flex items-center justify-center px-6 sm:px-8 py-4 border-2 border-gold-500 text-gold-500 font-semibold rounded-md hover:bg-gold-500 hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Explore courses
            </Link>
          </div>
          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-navy-300 sm:divide-x divide-navy-700">
            <span className="sm:pr-6">Based in Cape Town</span>
            <span className="sm:px-6">7+ years trading &amp; mentoring</span>
            <span className="sm:pl-6">Real team. Real methodology.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
