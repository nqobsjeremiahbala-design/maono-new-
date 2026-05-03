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
    <section className="bg-navy-950 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">Welcome back</h1>
          <p className="text-navy-400">Sign in to access your courses</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  )
}
