import { prisma } from '@/lib/db'
import { BUNDLES } from '@/lib/checkout'
import { AccessManager } from './AccessManager'

export const dynamic = 'force-dynamic'

// Courses in learning-sequence order (module 1 → 6) for the toggle grid.
const COURSE_ORDER: [string, string][] = [
  ['forex-trading-introduction', 'Forex Trading Introduction'],
  ['price-action-trading', 'Price Action Trading'],
  ['trading-tools', 'Trading Tools'],
  ['trading-strategies', 'Trading Strategies'],
  ['institutional-trading-concepts', 'Institutional Trading Concepts'],
  ['trading-psychology', 'Trading Psychology'],
]

// Bundle → slugs map for the one-click buttons (and optimistic UI on the client).
const BUNDLE_OPTIONS = BUNDLES.map((b) => ({ id: b.id, name: b.name, slugs: b.courseSlugs }))

export default async function AdminAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q || '').trim()

  let users: { id: string; email: string; name: string | null; slugs: string[] }[] = []
  if (query) {
    const found = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 30,
      orderBy: { email: 'asc' },
      include: { enrollments: { select: { course: { select: { slug: true } } } } },
    })
    users = found.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      slugs: u.enrollments.map((e) => e.course.slug),
    }))
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-2">Client Access</h1>
      <p className="text-navy-300 mb-8">
        Search a client by email or name, then grant or revoke courses. Changes apply instantly.
      </p>

      <form method="get" className="flex gap-3 mb-8 max-w-xl">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search email or name…"
          className="flex-1 bg-navy-900 border border-navy-700 rounded-md px-4 py-2.5 text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500"
        />
        <button
          type="submit"
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          Search
        </button>
      </form>

      {!query ? (
        <p className="text-navy-400 text-sm">Enter a search term to find a client.</p>
      ) : users.length === 0 ? (
        <p className="text-navy-400 text-sm">No clients match “{query}”.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-navy-400 text-sm">
            {users.length} {users.length === 1 ? 'client' : 'clients'} found
          </p>
          {users.map((u) => (
            <AccessManager
              key={u.id}
              user={{ id: u.id, email: u.email, name: u.name }}
              courses={COURSE_ORDER}
              enrolledSlugs={u.slugs}
              bundles={BUNDLE_OPTIONS}
            />
          ))}
        </div>
      )}
    </>
  )
}
