import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [userCount, enrollmentCount, purchaseStats, completeCount] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.purchase.aggregate({
      where: { status: 'COMPLETE' },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.purchase.count({ where: { status: 'COMPLETE' } }),
  ])

  const revenueCents = purchaseStats._sum.amountCents || 0
  const revenueDisplay = `R${(revenueCents / 100).toLocaleString('en-ZA')}`

  const stats = [
    { label: 'Total Users', value: userCount.toLocaleString() },
    { label: 'Active Enrollments', value: enrollmentCount.toLocaleString() },
    { label: 'Revenue (Total)', value: revenueDisplay },
    { label: 'Paid Orders', value: completeCount.toLocaleString() },
  ]

  const recentPurchases = await prisma.purchase.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
  })

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-navy-900 border border-navy-800 rounded-lg p-5"
          >
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="text-2xl font-serif text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-lg p-6">
        <h2 className="font-serif text-xl text-white mb-4">Recent Purchases</h2>
        {recentPurchases.length === 0 ? (
          <p className="text-navy-400 text-sm">No purchases yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left">
                <th className="px-3 py-2 text-navy-400 font-medium">Customer</th>
                <th className="px-3 py-2 text-navy-400 font-medium">Course</th>
                <th className="px-3 py-2 text-navy-400 font-medium">Amount</th>
                <th className="px-3 py-2 text-navy-400 font-medium">Status</th>
                <th className="px-3 py-2 text-navy-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPurchases.map((p) => (
                <tr key={p.id} className="border-b border-navy-800/50">
                  <td className="px-3 py-2 text-white">{p.user.name || p.user.email}</td>
                  <td className="px-3 py-2 text-navy-300">{p.course?.title || p.itemKey}</td>
                  <td className="px-3 py-2 text-navy-300">R{(p.amountCents / 100).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === 'COMPLETE' ? 'bg-green-900/50 text-green-400' :
                      p.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-navy-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
