import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { RegisterForm } from './RegisterForm'
import { ENROLLMENT_OPEN } from '@/lib/flags'

export const metadata: Metadata = {
  title: 'Create Account — Maono Forex Trading',
  description: 'Create your Maono account to start learning.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  // Registration is closed during the existing-clients launch — only the
  // migrated WordPress clients (and staff/admin) have accounts and access.
  if (!ENROLLMENT_OPEN) {
    return (
      <section className="bg-navy-950 min-h-dvh py-16 md:py-24 px-5 sm:px-6">
        <div className="max-w-md mx-auto text-center hero-reveal">
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Registration is currently closed
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mb-8">
            We&apos;re not taking new sign-ups right now. If you&apos;re an existing
            client, sign in with the email and password you already use.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login?forgot=1"
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </section>
    )
  }

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
