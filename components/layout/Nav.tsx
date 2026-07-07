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

  // Every page opens on a navy section, so the nav starts transparent with
  // light text. Past the threshold it gains a semi-opaque navy backdrop
  // (blurred) so it stays legible over whatever's beneath it further down
  // the page (white course cards, bundle pricing, etc.) without needing to
  // invert to light-on-dark — the navy backdrop itself carries the contrast.
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
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color] duration-300 ease-out ${
          scrolled ? 'bg-navy-950/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav
          className={`w-full px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ease-out ${
            scrolled ? 'h-[68px] md:h-[80px] lg:h-[88px]' : 'h-[80px] md:h-[116px] lg:h-[136px]'
          }`}
        >
          <Logo onDark compact={scrolled} />

          <ul className="hidden md:flex items-center gap-7 lg:gap-8">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[17px] font-bold uppercase tracking-wide text-white hover:text-gold-400 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  className="text-[17px] font-bold uppercase tracking-wide text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="text-[17px] font-bold uppercase tracking-wide text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm mr-1 text-white/80">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border border-white/50 text-white hover:border-white transition-colors"
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
                    className="press px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-md border border-white/50 text-white hover:bg-white/10 transition-colors"
                  >
                    Register
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </nav>

        {open && (
          <div className="md:hidden bg-navy-950/95 backdrop-blur-md px-4 pb-4">
            <ul className="flex flex-col gap-3 pt-4">
              {links.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-bold uppercase tracking-wide text-sm text-white hover:text-gold-400 transition-colors"
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
                    className="text-purple-300 hover:text-purple-200 text-sm font-bold uppercase tracking-wide"
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
                    className="press w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-white/50 text-white"
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
                        className="press flex-1 text-center px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md border border-white/50 text-white"
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
