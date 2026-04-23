import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Maono Forex Trading privacy policy.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">Privacy Policy</h1>
        <p className="text-navy-400 text-sm mb-8">Last updated: 2026-04-21</p>
        <p className="text-navy-600">Full privacy policy to be added before launch.</p>
      </div>
    </section>
  )
}
