import Link from 'next/link'
import { BUNDLES } from '@/lib/checkout'
import { AddClientForm } from './AddClientForm'

export const dynamic = 'force-dynamic'

// Courses in learning-sequence order (module 1 → 6).
const COURSE_ORDER: [string, string][] = [
  ['forex-trading-introduction', 'Forex Trading Introduction'],
  ['price-action-trading', 'Price Action Trading'],
  ['trading-tools', 'Trading Tools'],
  ['trading-strategies', 'Trading Strategies'],
  ['institutional-trading-concepts', 'Institutional Trading Concepts'],
  ['trading-psychology', 'Trading Psychology'],
]
const BUNDLE_OPTIONS = BUNDLES.map((b) => ({ id: b.id, name: b.name, slugs: b.courseSlugs }))

export default function AddClientPage() {
  return (
    <>
      <Link href="/admin/users" className="text-sm text-navy-400 hover:text-white mb-4 inline-block">← Users</Link>
      <h1 className="font-serif text-3xl text-white mb-2">Add a client</h1>
      <p className="text-navy-300 mb-8 max-w-2xl">
        Create a client by email and grant course access. New clients get an email with a link to set
        their password; existing clients just get the extra access added.
      </p>
      <AddClientForm courses={COURSE_ORDER} bundles={BUNDLE_OPTIONS} />
    </>
  )
}
