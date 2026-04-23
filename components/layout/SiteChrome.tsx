'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'
import { StickyBar } from './StickyBar'

export function SiteChrome() {
  const pathname = usePathname()
  const hide = pathname?.startsWith('/learn/')
  if (hide) return null
  return (
    <>
      <Footer />
      <StickyBar />
    </>
  )
}
