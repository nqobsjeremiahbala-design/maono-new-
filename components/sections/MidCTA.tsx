import Link from 'next/link'
import Image from 'next/image'

export function MidCTA() {
  return (
    <section className="relative bg-navy-950 py-28 md:py-36 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/midcta-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/80" />
      </div>
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl text-white mb-5">
          What are you waiting for?
        </h2>
        <p className="text-navy-200 text-lg mb-10">
          Master the skills, discipline, and strategy to trade forex with confidence. Join us today and trade with purpose.
        </p>
        <Link
          href="/contact"
          className="press inline-flex items-center justify-center px-10 py-4 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
        >
          Contact us
        </Link>
      </div>
    </section>
  )
}
