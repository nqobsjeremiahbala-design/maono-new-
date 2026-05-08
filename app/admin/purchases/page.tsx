import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  })

  const totals = await prisma.purchase.groupBy({
    by: ['status'],
    _sum: { amountCents: true },
    _count: true,
  })

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-8">Purchases</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {totals.map((t) => (
          <div key={t.status} className="bg-navy-900 border border-navy-800 rounded-lg p-4">
            <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">{t.status}</p>
            <p className="text-xl font-serif text-white">
              R{((t._sum.amountCents || 0) / 100).toLocaleString('en-ZA')}
            </p>
            <p className="text-xs text-navy-500">{t._count} orders</p>
          </div>
        ))}
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Customer</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Item</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Amount</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Status</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Method</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr
                key={p.id}
                className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-white">{p.user.name || p.user.email}</td>
                <td className="px-4 py-3 text-navy-300">{p.course?.title || p.itemKey}</td>
                <td className="px-4 py-3 text-navy-300">R{(p.amountCents / 100).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'COMPLETE' ? 'bg-green-900/50 text-green-400' :
                    p.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-400">{p.paymentMethod || '—'}</td>
                <td className="px-4 py-3 text-navy-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {purchases.length === 0 && (
        <p className="text-navy-500 text-sm mt-4 text-center">No purchases yet.</p>
      )}
    </>
  )
}
