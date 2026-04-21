import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="bg-navy-950 pt-20 pb-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-6">
          South African Forex Education
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream-50 leading-tight mb-6">
          Forex education<br />without the noise.
        </h1>
        <p className="text-navy-300 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Institutional-grade trading education for South Africans at every stage — from first chart to full-time trader.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Link href="/signals">Join the free signals group →</Link>
          </Button>
          <Button size="lg" variant="ghost" className="text-navy-300 hover:text-cream-50">
            <Link href="/courses">Explore courses</Link>
          </Button>
        </div>
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6 text-sm text-navy-400 divide-y sm:divide-y-0 sm:divide-x divide-navy-800">
          <span className="py-2 sm:py-0 sm:px-6">Based in Cape Town</span>
          <span className="py-2 sm:py-0 sm:px-6">7+ years trading &amp; mentoring</span>
          <span className="py-2 sm:py-0 sm:px-6">Real team. Real methodology.</span>
        </div>
      </div>
    </section>
  )
}
