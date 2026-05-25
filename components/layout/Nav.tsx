'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from './Logo'
import { getAllEnrollments } from '@/lib/enrollment'

const links = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/resources', label: 'Resources' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/cart', label: 'Cart' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [hasEnrollments, setHasEnrollments] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    function sync() {
      setHasEnrollments(getAllEnrollments().length > 0)
    }
    sync()
    window.addEventListener('maono-enrollment-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('maono-enrollment-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isLoggedIn = status === 'authenticated' && session?.user
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-28 lg:h-32 flex items-center justify-between">
        <Logo />

        <ul className="hidden md:flex items-center gap-6 lg:gap-7">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[15px] font-bold uppercase tracking-wide text-white hover:text-gold-400 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {(hasEnrollments || isLoggedIn) && (
            <li>
              <Link
                href="/dashboard"
                className="text-[15px] font-bold uppercase tracking-wide text-gold-400 hover:text-gold-300 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="text-[15px] font-bold uppercase tracking-wide text-purple-400 hover:text-purple-300 transition-colors"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-navy-300 mr-1">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-600 text-white hover:border-navy-400 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md text-white border border-navy-700 hover:bg-navy-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="press px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-md bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-4">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white font-bold uppercase tracking-wide text-sm hover:text-gold-400"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {(hasEnrollments || isLoggedIn) && (
              <li>
                <Link
                  href="/dashboard"
                  className="text-gold-400 hover:text-gold-300 text-sm font-bold uppercase tracking-wide"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="text-purple-400 hover:text-purple-300 text-sm font-bold uppercase tracking-wide"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
            <li className="pt-3 flex gap-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setOpen(false) }}
                  className="press w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-600 text-white"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-600 text-white"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md bg-gold-500 text-navy-950"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
