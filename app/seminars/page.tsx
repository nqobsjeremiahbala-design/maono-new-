import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Live Forex Seminars, South Africa',
  description: 'Attend a live Maono forex seminar. In-person trading education events across South Africa.',
  path: '/seminars',
})

export default function SeminarsPage() {
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-white mb-4">Live seminars</h1>
          <p className="text-navy-300 text-lg">In-person trading education events across South Africa.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-navy-100 rounded-lg p-8 text-center">
            <p className="text-navy-400 mb-4">No upcoming seminars scheduled.</p>
            <p className="text-sm text-navy-500">
              Join the free signals group to be notified when the next seminar is announced.
            </p>
          </div>
        </div>
      </section>
      <CTABanner
        headline="Get notified of the next seminar."
        sub="Join the free signals group, all event announcements go there first."
      />
    </>
  )
}
