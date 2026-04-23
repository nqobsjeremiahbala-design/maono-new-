import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout, Maono Forex Trading',
  description: 'Complete your purchase securely.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-navy-950 min-h-screen py-20 px-4 text-center">
          <p className="text-white">Loading checkout…</p>
        </section>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
