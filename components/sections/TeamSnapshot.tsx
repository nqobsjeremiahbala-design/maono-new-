import Link from 'next/link'
import { TeamCard } from '@/components/shared/TeamCard'
import { Button } from '@/components/ui/Button'
import type { TeamMember } from '@/lib/types'

const TEAM: TeamMember[] = [
  {
    name: 'Team Member Name',
    role: 'Founder & Head Trader',
    bio: '7+ years of institutional and retail trading experience. Mentored hundreds of South African traders.',
    image: '/images/team/placeholder.jpg',
    years: 7,
  },
]

export function TeamSnapshot() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">Real people</p>
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">Meet the team</h2>
        <p className="text-navy-500 mb-12 max-w-lg mx-auto">
          Not a faceless course platform. We are traders who teach.
        </p>
        <div className="flex flex-wrap justify-center gap-12 mb-10">
          {TEAM.map(m => <TeamCard key={m.name} member={m} />)}
        </div>
        <Button variant="outline">
          <Link href="/about">Read our full story →</Link>
        </Button>
      </div>
    </section>
  )
}
