import { redirect } from 'next/navigation'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session || !isAdmin(session.user as SessionUser)) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-navy-950 md:flex overflow-x-hidden">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
