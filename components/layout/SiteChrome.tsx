'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'
import { SignalsPopup } from './SignalsPopup'

export function SiteChrome() {
  const pathname = usePathname()
  const hideAll = pathname?.startsWith('/learn/')
  if (hideAll) return null

  const suppressPopup =
    pathname?.startsWith('/signals') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/my-courses')

  return (
    <>
      <Footer />
      {!suppressPopup && <SignalsPopup />}
    </>
  )
}
