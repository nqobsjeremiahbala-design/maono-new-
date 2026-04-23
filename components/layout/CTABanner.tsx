import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTABanner({
  headline = 'Start free. Trade smarter.',
  sub = 'Join the free signals group and get real market analysis delivered daily.',
}: {
  headline?: string
  sub?: string
}) {
  return (
    <section className="bg-navy-900 py-12 md:py-16 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">{headline}</h2>
        <p className="text-navy-300 text-base sm:text-lg mb-6 md:mb-8">{sub}</p>
        <Button size="lg">
          <Link href="/signals">Join the free signals group →</Link>
        </Button>
      </div>
    </section>
  )
}
