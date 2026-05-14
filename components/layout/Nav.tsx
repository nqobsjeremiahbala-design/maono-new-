'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <Logo size={36} />

        <ul className="hidden md:flex items-center gap-7">
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
          {hasEnrollments && (
            <li>
              <Link
                href="/dashboard"
                className="text-[15px] font-bold uppercase tracking-wide text-gold-400 hover:text-gold-300 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="press inline-flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-wide text-white border border-navy-700 rounded-md hover:bg-navy-800 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="press inline-flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-wide bg-gold-500 text-navy-950 rounded-md hover:bg-gold-400 transition-colors"
          >
            Register
          </Link>
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
            {hasEnrollments && (
              <li>
                <Link
                  href="/dashboard"
                  className="text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wide text-sm"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="press inline-flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-wide text-white border border-navy-700 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="press inline-flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-wide bg-gold-500 text-navy-950 rounded-md"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
