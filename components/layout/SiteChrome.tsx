'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function SiteChrome() {
  const pathname = usePathname()
  const hideAll =
    pathname?.startsWith('/learn/') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/dashboard')
  if (hideAll) return null

  return <Footer />
}
