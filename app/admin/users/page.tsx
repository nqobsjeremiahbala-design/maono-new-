import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { resolvePlan } from '@/lib/plan'

export const dynamic = 'force-dynamic'

type Filter = 'all' | 'purchased' | 'free'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const { q, filter: filterRaw } = await searchParams
  const query = (q || '').trim()
  const filter: Filter = filterRaw === 'purchased' || filterRaw === 'free' ? filterRaw : 'all'

  const where: Prisma.UserWhereInput = {}
  if (query) {
    where.OR = [
      { email: { contains: query, mode: 'insensitive' } },
      { name: { contains: query, mode: 'insensitive' } },
    ]
  }
  // "Purchased" = has at least one COMPLETE purchase (matches the back-filled orders).
  if (filter === 'purchased') where.purchases = { some: { status: 'COMPLETE' } }
  if (filter === 'free') where.purchases = { none: { status: 'COMPLETE' } }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { _count: { select: { enrollments: true, purchases: true } } },
  })

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'purchased', label: 'Purchased' },
    { key: 'free', label: 'Not purchased' },
  ]
  const tabHref = (f: Filter) =>
    `/admin/users?filter=${f}${query ? `&q=${encodeURIComponent(query)}` : ''}`

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-white">Users</h1>
        <Link
          href="/admin/users/new"
          className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-400 transition-colors"
        >
          + Add client
        </Link>
      </div>

      {/* Search */}
      <form method="get" className="mb-4 flex max-w-xl gap-3">
        <input type="hidden" name="filter" value={filter} />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search name or email…"
          className="flex-1 rounded-md border border-navy-700 bg-navy-900 px-4 py-2.5 text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none"
        />
        <button type="submit" className="rounded-md bg-gold-500 px-5 py-2.5 font-medium text-navy-950 hover:bg-gold-400 transition-colors">
          Search
        </button>
      </form>

      {/* Purchase filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={tabHref(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === f.key
                ? 'bg-gold-500 text-navy-950 font-semibold'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <p className="mb-3 text-sm text-navy-400">
        {users.length}{users.length === 200 ? '+' : ''} {users.length === 1 ? 'user' : 'users'}
        {query ? ` matching “${query}”` : ''}
      </p>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Name</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Email</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Role</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Plan</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Courses</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Purchases</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const plan = resolvePlan(user.planTier, user._count.enrollments)
              return (
                <tr
                  key={user.id}
                  className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-white">{user.name || '—'}</td>
                  <td className="px-4 py-3 text-navy-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-900/50 text-purple-400'
                        : 'bg-navy-800 text-navy-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-300">{plan ? plan.name : '—'}</td>
                  <td className="px-4 py-3 text-navy-300">{user._count.enrollments}</td>
                  <td className="px-4 py-3 text-navy-300">{user._count.purchases}</td>
                  <td className="px-4 py-3 text-navy-400">
                    {new Date(user.createdAt).toLocaleDateString('en-ZA')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-navy-500 text-sm mt-4 text-center">No users match.</p>
      )}
    </>
  )
}
