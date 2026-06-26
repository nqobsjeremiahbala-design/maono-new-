import { prisma } from '@/lib/db'
import { NETCASH_METHOD_LABELS } from '@/lib/netcash/config'

export const dynamic = 'force-dynamic'

// Raw Netcash postback log — for UAT + reconciliation. Shows exactly what Netcash
// sent us, independent of our parsing/fulfillment logic.
export default async function AdminNetcashPage() {
  const rows = await prisma.netcashPostback.findMany({
    orderBy: { receivedAt: 'desc' },
    take: 200,
  })

  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-2">Netcash postbacks</h1>
      <p className="text-navy-300 mb-6 text-sm">
        Raw log of every Notify/Accept/Decline/Redirect Netcash sends — newest first. Fulfillment is
        driven by the <strong>notify</strong> rows.
      </p>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Received</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Kind</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Reference</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Accepted</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Amount</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Method</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Trace</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-navy-800/50 hover:bg-navy-800/30">
                <td className="px-4 py-2.5 text-navy-400">{r.receivedAt.toLocaleString('en-ZA')}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.kind === 'notify' ? 'bg-gold-500/15 text-gold-300' : 'bg-navy-800 text-navy-300'}`}>{r.kind}</span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-navy-200">{r.reference || '—'}</td>
                <td className="px-4 py-2.5">
                  {r.accepted === null ? <span className="text-navy-500">—</span> : r.accepted ? <span className="text-green-400">true</span> : <span className="text-red-400">false</span>}
                </td>
                <td className="px-4 py-2.5 text-navy-300">{r.amount ? `R${r.amount}` : '—'}</td>
                <td className="px-4 py-2.5 text-navy-300">{r.method ? (NETCASH_METHOD_LABELS[r.method] ?? r.method) : '—'}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-navy-500">{r.requestTrace || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && <p className="text-navy-500 text-sm mt-4 text-center">No postbacks yet.</p>}
    </>
  )
}
