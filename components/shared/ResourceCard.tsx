import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Resource } from '@/lib/types'

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="p-5 hover:shadow-elevated transition-shadow">
      <Badge className="mb-3">{resource.type}</Badge>
      <h3 className="font-serif text-navy-900 mb-2">
        <Link href={`/resources/${resource.slug}`} className="hover:text-gold-500 transition-colors">
          {resource.title}
        </Link>
      </h3>
      <p className="text-sm text-navy-500">{resource.description}</p>
    </Card>
  )
}
