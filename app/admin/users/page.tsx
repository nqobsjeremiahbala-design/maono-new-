import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { enrollments: true, purchases: true } },
    },
  })

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-8">Users</h1>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Name</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Email</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Role</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Enrollments</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Purchases</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                <td className="px-4 py-3 text-navy-300">{user._count.enrollments}</td>
                <td className="px-4 py-3 text-navy-300">{user._count.purchases}</td>
                <td className="px-4 py-3 text-navy-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-navy-500 text-sm mt-4 text-center">No users yet.</p>
      )}
    </>
  )
}
