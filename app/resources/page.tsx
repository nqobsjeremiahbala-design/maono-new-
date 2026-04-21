import { ResourceCard } from '@/components/shared/ResourceCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { getResources } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Free Forex Learning Resources',
  description: 'Free forex guides, lessons, and market breakdowns from the Maono team.',
  path: '/resources',
})

export default function ResourcesPage() {
  const resources = getResources()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Free resources</h1>
          <p className="text-navy-300 text-lg">Guides, lessons, and market breakdowns. No signup required.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(r => <ResourceCard key={r.slug} resource={r} />)}
          {resources.length === 0 && (
            <p className="text-navy-400 col-span-3 text-center py-10">Resources coming soon.</p>
          )}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
