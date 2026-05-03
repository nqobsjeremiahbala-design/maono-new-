/**
 * Admin Dashboard — /admin
 *
 * TODO: Wire to real DB queries once Prisma is migrated.
 * For now, renders a placeholder with the intended KPI layout.
 */

export default function AdminDashboard() {
  // TODO: Fetch from DB
  const stats = [
    { label: 'Total Users', value: '—' },
    { label: 'Active Enrollments', value: '—' },
    { label: 'Revenue (MTD)', value: '—' },
    { label: 'Active Subscriptions', value: '—' },
  ]

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
        <p className="text-navy-400 text-sm">
          Connect the database to see live purchase data here.
        </p>
      </div>
    </>
  )
}
