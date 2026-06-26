'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/access', label: 'Client Access' },
  { href: '/admin/purchases', label: 'Purchases' },
  { href: '/admin/netcash', label: 'Netcash Log' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.href : pathname?.startsWith(item.href)

  const links = (onClick?: () => void) =>
    navItems.map((item) => {
      const active = isActive(item)
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${
            active ? 'bg-navy-800 text-white font-medium' : 'text-navy-300 hover:text-white hover:bg-navy-800'
          }`}
        >
          {item.label}
        </Link>
      )
    })

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-navy-900 border-r border-navy-800 p-6">
        <p className="text-gold-400 font-serif text-lg mb-8">Maono Admin</p>
        <nav className="space-y-1">{links()}</nav>
      </aside>

      {/* Mobile top bar (the admin portal's own nav — separate from the site nav) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-navy-800 bg-navy-950/95 px-4 py-3 backdrop-blur">
        <Link href="/admin" className="font-serif text-lg text-gold-400" onClick={() => setOpen(false)}>
          Maono Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-md border border-navy-700 text-white"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
          />
          <nav className="relative space-y-1 border-b border-navy-800 bg-navy-900 p-4 shadow-xl">
            {links(() => setOpen(false))}
          </nav>
        </div>
      )}
    </>
  )
}
