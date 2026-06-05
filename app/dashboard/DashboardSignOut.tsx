'use client'
import { signOut } from 'next-auth/react'

export function DashboardSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="press inline-flex items-center gap-2 rounded-md border border-navy-700 px-4 py-2 text-sm font-semibold text-navy-200 hover:border-gold-400 hover:text-gold-400 transition-colors"
    >
      Sign out
    </button>
  )
}
