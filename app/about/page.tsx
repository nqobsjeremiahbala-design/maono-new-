import { TeamCard } from '@/components/shared/TeamCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { TeamMember } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'About Maono Forex Trading',
  description: 'Meet the team behind Maono. Real traders with 7+ years of experience mentoring South African traders.',
  path: '/about',
})

const TEAM: TeamMember[] = [
  {
    name: 'REPLACE WITH REAL NAME',
    role: 'Founder & Head Trader',
    bio: 'REPLACE WITH REAL BIO, 7+ years of trading and mentoring experience.',
    image: '/images/team/placeholder.jpg',
    years: 7,
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">About Maono</h1>
          <p className="text-navy-300 text-base sm:text-lg">
            We are South African traders who got tired of watching good people lose money to bad education.
          </p>
        </div>
      </section>
      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-4">Our story</h2>
          <p className="text-navy-600 mb-8">
            REPLACE WITH REAL FOUNDER STORY before launch.
          </p>
          <h2 className="font-serif text-2xl text-navy-900 mb-4">Our methodology</h2>
          <p className="text-navy-600 mb-4">
            We teach institutional concepts, how banks, hedge funds, and professional market participants
            actually read and use price. Not retail indicators. Not automated signals. Structure, liquidity, and order flow.
          </p>
          <h2 className="font-serif text-2xl text-navy-900 mb-4 mt-8">What we stand for</h2>
          <ul className="space-y-2 text-navy-600">
            {['Transparency over hype', 'Education over entertainment', 'Community over isolation', 'Long-term growth over quick wins'].map(v => (
              <li key={v} className="flex gap-2"><span className="text-gold-500">✓</span>{v}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-navy-900 mb-10 md:mb-12">The team</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {TEAM.map(m => <TeamCard key={m.name} member={m} />)}
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  )
}
