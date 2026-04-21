import Image from 'next/image'
import type { TeamMember } from '@/lib/types'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-navy-200">
        <Image
          src={member.image || '/images/team/placeholder.jpg'}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <p className="font-serif text-navy-900 font-semibold">{member.name}</p>
      <p className="text-sm text-gold-500 mb-2">{member.role}</p>
      <p className="text-sm text-navy-500 max-w-xs mx-auto">{member.bio}</p>
    </div>
  )
}
