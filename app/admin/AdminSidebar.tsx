'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/purchases', label: 'Purchases' },
  { href: '/admin/subscriptions', label: 'Subscriptions' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-800 p-6 hidden md:block">
      <p className="text-gold-400 font-serif text-lg mb-8">Maono Admin</p>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-navy-800 text-white font-medium'
                  : 'text-navy-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
