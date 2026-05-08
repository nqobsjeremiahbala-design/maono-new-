import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-8">Subscriptions</h1>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Customer</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Tier</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Amount</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Status</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Period End</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr
                key={s.id}
                className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-white">{s.user.name || s.user.email}</td>
                <td className="px-4 py-3 text-navy-300">{s.tier}</td>
                <td className="px-4 py-3 text-navy-300">R{(s.amountCents / 100).toLocaleString()}/mo</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400' :
                    s.status === 'PAST_DUE' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-400">
                  {new Date(s.currentPeriodEnd).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subscriptions.length === 0 && (
        <p className="text-navy-500 text-sm mt-4 text-center">No subscriptions yet.</p>
      )}
    </>
  )
}
