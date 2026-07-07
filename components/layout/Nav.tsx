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

const SCROLL_THRESHOLD = 80

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Every page opens on a navy section (hero or otherwise), so the nav
  // starts transparent with light text. Past the threshold it flips to a
  // solid/blurred light background with dark text, since content further
  // down the page (course cards, bundle pricing, etc.) is white.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The dashboard and admin portal have their own standalone app shells + nav.
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) return null

  const isLoggedIn = status === 'authenticated' && session?.user
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'
  const isHome = pathname === '/'

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          className={`w-full px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ease-out ${
            scrolled ? 'h-[68px] md:h-[80px] lg:h-[88px]' : 'h-[80px] md:h-[116px] lg:h-[136px]'
          }`}
        >
          <Logo onDark={!scrolled} compact={scrolled} />

          <ul className="hidden md:flex items-center gap-7 lg:gap-8">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-[17px] font-bold uppercase tracking-wide transition-colors duration-300 ${
                    scrolled ? 'text-navy-900 hover:text-gold-600' : 'text-white hover:text-gold-400'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  className={`text-[17px] font-bold uppercase tracking-wide transition-colors duration-300 ${
                    scrolled ? 'text-gold-600 hover:text-gold-500' : 'text-gold-400 hover:text-gold-300'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`text-[17px] font-bold uppercase tracking-wide transition-colors duration-300 ${
                    scrolled ? 'text-purple-700 hover:text-purple-600' : 'text-purple-300 hover:text-purple-200'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className={`text-sm mr-1 transition-colors duration-300 ${scrolled ? 'text-navy-600' : 'text-white/80'}`}>
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={`press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border transition-colors duration-300 ${
                    scrolled
                      ? 'border-navy-300 text-navy-900 hover:border-navy-900'
                      : 'border-white/50 text-white hover:border-white'
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="press px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-md bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors duration-300"
                >
                  Login
                </Link>
                {ENROLLMENT_OPEN && (
                  <Link
                    href="/register"
                    className={`press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border transition-colors duration-300 ${
                      scrolled
                        ? 'border-navy-300 text-navy-900 hover:bg-navy-50'
                        : 'border-white/50 text-white hover:bg-white/10'
                    }`}
                  >
                    Register
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 transition-colors duration-300 ${scrolled ? 'text-navy-900' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </nav>

        {open && (
          <div
            className={`md:hidden px-4 pb-4 transition-colors duration-300 ${
              scrolled ? 'bg-white border-t border-navy-100' : 'bg-navy-950/95 backdrop-blur-md'
            }`}
          >
            <ul className="flex flex-col gap-3 pt-4">
              {links.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`font-bold uppercase tracking-wide text-sm transition-colors ${
                      scrolled ? 'text-navy-900 hover:text-gold-600' : 'text-white hover:text-gold-400'
                    }`}
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
                    className={`text-sm font-bold uppercase tracking-wide ${scrolled ? 'text-gold-600 hover:text-gold-500' : 'text-gold-400 hover:text-gold-300'}`}
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
                    className={`text-sm font-bold uppercase tracking-wide ${scrolled ? 'text-purple-700 hover:text-purple-600' : 'text-purple-300 hover:text-purple-200'}`}
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
                    className={`press w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border ${
                      scrolled ? 'border-navy-300 text-navy-900' : 'border-white/50 text-white'
                    }`}
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
                        className={`press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border ${
                          scrolled ? 'border-navy-300 text-navy-900' : 'border-white/50 text-white'
                        }`}
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

      {/* Reserves the nav's height in normal-page flow so the fixed nav doesn't
          hide content underneath it. Home skips this: its hero is full-bleed
          navy art starting at y=0, and its own top padding already clears
          the heading text. */}
      {!isHome && <div aria-hidden className="h-[80px] md:h-[116px] lg:h-[136px] bg-navy-950" />}
    </>
  )
}
