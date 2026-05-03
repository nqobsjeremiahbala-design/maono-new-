import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — Maono Forex Trading',
  description: 'Create your Maono account to start learning.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto hero-reveal">
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3 leading-tight">
            Start your trading journey
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Create your account and get access to structured forex education.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-md mx-auto">
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
