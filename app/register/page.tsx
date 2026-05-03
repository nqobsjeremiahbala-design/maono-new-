import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — Maono Forex Trading',
  description: 'Create your Maono account to start learning.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <section className="bg-navy-950 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">Create your account</h1>
          <p className="text-navy-400">Start your trading education journey</p>
        </div>
        <RegisterForm />
      </div>
    </section>
  )
}
