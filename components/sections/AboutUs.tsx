import Link from 'next/link'
import Image from 'next/image'

const FACTS = [
  'Based in Cape Town, teaching across South Africa',
  'Seven years of live-market trading experience',
  'One-on-one mentorship, not generic playlists',
  'Signals group and community at no cost',
]

export function AboutUs() {
  return (
    <section className="bg-white py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative order-1">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50">
            <Image
              src="/images/team/founder.jpg"
              alt="Maono founder"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -top-6 -right-6 md:-right-10 bg-white rounded-xl shadow-elevated p-5 max-w-[240px] border border-navy-100">
            <p className="text-[11px] text-gold-600 font-semibold tracking-[0.15em] uppercase mb-1">
              Since 2018
            </p>
            <p className="text-navy-900 font-semibold mb-1">Real team, real desks</p>
            <p className="text-navy-500 text-sm">Trading, teaching, and mentoring daily.</p>
          </div>
        </div>

        <div className="order-2">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy-900 mb-6 leading-[1.05]">
            Built by<br />real traders.
          </h2>
          <p className="text-navy-600 text-lg leading-relaxed mb-10 max-w-md">
            We believe every South African has the potential to achieve financial freedom through forex. Our job is to help you overcome the obstacles that stop most traders and build a process you can repeat for life.
          </p>
          <ul className="space-y-4 mb-10">
            {FACTS.map(f => (
              <li key={f} className="flex items-start gap-3 text-navy-900 text-[17px]">
                <span aria-hidden className="text-gold-500 mt-[1px] text-lg leading-tight">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="press inline-flex items-center justify-center px-8 py-3 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            Meet the team
          </Link>
        </div>
      </div>
    </section>
  )
}
