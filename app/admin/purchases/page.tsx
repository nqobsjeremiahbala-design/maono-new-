import { prisma } from '@/lib/db'
import { BUNDLE_BY_ID, COURSE_TITLES } from '@/lib/checkout'
import { NETCASH_METHOD_LABELS } from '@/lib/netcash/config'
import { MarkPaidButton } from './MarkPaidButton'

export const dynamic = 'force-dynamic'

// Human-readable plan/item name from the stored itemKey.
function planLabel(itemKey: string, courseTitle?: string | null): string {
  if (itemKey.startsWith('bundle-')) return BUNDLE_BY_ID[itemKey]?.name ?? itemKey
  return courseTitle || COURSE_TITLES[itemKey] || itemKey
}

// Human-readable payment method (Card, Instant EFT, Capitec Pay…).
function methodLabel(netcashMethod: string | null, paymentMethod: string | null): string {
  const code = netcashMethod ?? (paymentMethod?.startsWith('netcash_') ? paymentMethod.slice(8) : null)
  if (code && NETCASH_METHOD_LABELS[code]) return NETCASH_METHOD_LABELS[code]
  if (paymentMethod === 'netcash_manual') return 'Manual'
  if (paymentMethod === 'demo') return 'Demo'
  return paymentMethod || '—'
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })

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

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Customer</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Email</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Plan</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Amount</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Method</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Reference</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Country</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Status</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Gateway</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Paid / Created</th>
              <th className="px-4 py-3 text-navy-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr
                key={p.id}
                className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-white">{p.user.name || '—'}</td>
                <td className="px-4 py-3 text-navy-400">{p.user.email}</td>
                <td className="px-4 py-3 text-navy-300">{planLabel(p.itemKey, p.course?.title)}</td>
                <td className="px-4 py-3 text-navy-300">
                  R{(p.amountCents / 100).toLocaleString('en-ZA')}
                </td>
                <td className="px-4 py-3 text-navy-300">{methodLabel(p.netcashMethod, p.paymentMethod)}</td>
                <td className="px-4 py-3 font-mono text-xs text-navy-400">{p.netcashRef || '—'}</td>
                <td className="px-4 py-3 text-navy-400">{p.country || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'COMPLETE' ? 'bg-green-900/50 text-green-400' :
                    p.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-400">
                  {p.gateway || p.paymentMethod || '—'}
                </td>
                <td className="px-4 py-3 text-navy-400">
                  {p.paidAt ? (
                    <span className="text-green-400">{fmtDate(p.paidAt)}</span>
                  ) : (
                    <span className="text-navy-500">{fmtDate(p.createdAt)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.status === 'COMPLETE' ? (
                    <span className="text-xs text-navy-600">—</span>
                  ) : (
                    <MarkPaidButton
                      purchaseId={p.id}
                      summary={`${p.user.email} · ${planLabel(p.itemKey, p.course?.title)} · R${(p.amountCents / 100).toLocaleString('en-ZA')}`}
                    />
                  )}
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
