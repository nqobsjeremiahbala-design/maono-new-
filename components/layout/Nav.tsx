'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from './Logo'
import { getAllEnrollments } from '@/lib/enrollment'

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/memberships', label: 'Memberships' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
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

        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-navy-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
          {hasEnrollments && (
            <li>
              <Link
                href="/my-courses"
                className="text-sm text-gold-400 hover:text-gold-300 transition-colors font-medium"
              >
                My Courses
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:block">
          <Button size="sm">
            <Link href="/signals">Free Signals</Link>
          </Button>
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
                  className="text-navy-200 hover:text-white text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {hasEnrollments && (
              <li>
                <Link
                  href="/my-courses"
                  className="text-gold-400 hover:text-gold-300 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  My Courses
                </Link>
              </li>
            )}
            <li className="pt-2">
              <Button size="sm" className="w-full">
                <Link href="/signals">Free Signals</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
