import { redirect } from 'next/navigation'
import { getServerSession, isAdmin } from '@/lib/auth'

/**
 * Admin layout — protects all /admin/* routes.
 *
 * Architecture:
 * - Server Component: checks session on every request (no client JS for auth)
 * - Redirects unauthenticated or non-ADMIN users to /login
 * - Provides a minimal admin shell (sidebar nav + header)
 *
 * CMS Information Architecture:
 *   /admin              → Dashboard (KPIs: revenue, enrollments, active users)
 *   /admin/courses      → Course CRUD list
 *   /admin/courses/new  → Create course
 *   /admin/courses/[id] → Edit course (modules + lessons inline)
 *   /admin/users        → User list, role management
 *   /admin/purchases    → Purchase/payment log
 *   /admin/subscriptions→ Active subscriptions, churn
 *   /admin/content      → Blog + resource management (future)
 */

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session || !isAdmin(session.user)) {
    redirect('/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/purchases', label: 'Purchases' },
    { href: '/admin/subscriptions', label: 'Subscriptions' },
  ]

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 border-r border-navy-800 p-6 hidden md:block">
        <p className="text-gold-400 font-serif text-lg mb-8">Maono Admin</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
