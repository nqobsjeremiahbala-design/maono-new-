import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function SampleLesson() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest text-center mb-4">
          Free sample lesson
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          See how we teach before you pay a cent.
        </h2>
        <p className="text-center text-navy-500 mb-10 max-w-lg mx-auto">
          This is a real lesson from our course library, no upsell, no watermark, no teaser.
        </p>
        <div className="relative bg-navy-900 rounded-lg overflow-hidden aspect-video mb-8 flex items-center justify-center">
          <p className="text-navy-400 text-sm">Sample lesson video coming soon</p>
        </div>
        <div className="text-center">
          <Button>
            <Link href="/resources">Browse all free resources</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
