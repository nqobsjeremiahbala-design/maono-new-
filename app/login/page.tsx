import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — Maono Forex Trading',
  description: 'Sign in to your Maono account.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto hero-reveal">
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-tight">
            Welcome back
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Sign in to access your courses and continue learning.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-md mx-auto">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
