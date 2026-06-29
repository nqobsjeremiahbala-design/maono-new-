'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from './Logo'
import { ENROLLMENT_OPEN } from '@/lib/flags'

const links = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Keep the bar sticky (always visible/clickable) but condense it once the user
  // scrolls — the bar and logo shrink so it reclaims screen real estate.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The dashboard and admin portal have their own standalone app shells + nav.
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) return null

  const isLoggedIn = status === 'authenticated' && session?.user
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-navy-100 shadow-sm">
      <nav
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-14 md:h-16 lg:h-[68px]' : 'h-[58px] md:h-[88px] lg:h-[104px]'
        }`}
      >
        <Logo compact={scrolled} />

        <ul className="hidden md:flex items-center gap-6 lg:gap-7">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[15px] font-bold uppercase tracking-wide text-navy-900 hover:text-gold-600 transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <Link
                href="/dashboard"
                className="text-[15px] font-bold uppercase tracking-wide text-gold-600 hover:text-gold-500 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="text-[15px] font-bold uppercase tracking-wide text-purple-700 hover:text-purple-500 transition-colors"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-navy-600 mr-1">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-300 text-navy-900 hover:border-navy-900 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="press px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-md bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"
              >
                Login
              </Link>
              {ENROLLMENT_OPEN && (
                <Link
                  href="/register"
                  className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md text-navy-900 border border-navy-300 hover:bg-navy-50 transition-colors"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-navy-900 p-2"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-navy-100 px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-4">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-navy-900 font-bold uppercase tracking-wide text-sm hover:text-gold-600"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  className="text-gold-600 hover:text-gold-500 text-sm font-bold uppercase tracking-wide"
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
                  className="text-purple-700 hover:text-purple-500 text-sm font-bold uppercase tracking-wide"
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
                  className="press w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-300 text-navy-900"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md bg-gold-500 text-navy-950"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  {ENROLLMENT_OPEN && (
                    <Link
                      href="/register"
                      className="press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-navy-300 text-navy-900"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  )}
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
