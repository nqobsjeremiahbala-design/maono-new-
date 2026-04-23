import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Maono Forex Trading terms of service.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <section className="py-16 md:py-20 px-5 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">Terms of Service</h1>
        <p className="text-navy-400 text-sm mb-8">Last updated: 2026-04-21</p>
        <p className="text-navy-600">Full terms of service to be added before launch.</p>
      </div>
    </section>
  )
}
