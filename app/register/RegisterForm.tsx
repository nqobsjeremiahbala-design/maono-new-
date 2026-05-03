'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    // Auto sign in after registration
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Account created but sign-in failed. Please go to the login page.')
      setLoading(false)
    } else {
      router.push('/my-courses')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-navy-300 mb-1.5">
          Full name
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
          placeholder="Thabo Nkosi"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-navy-300 mb-1.5">
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-phone" className="block text-sm font-medium text-navy-300 mb-1.5">
          WhatsApp number
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
          placeholder="+27 81 000 0000"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-navy-300 mb-1.5">
          Password
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
          placeholder="••••••••"
        />
        <p className="text-xs text-navy-500 mt-1">At least 8 characters</p>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full press inline-flex items-center justify-center rounded-md px-8 py-4 text-lg bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-navy-400">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-400 hover:text-gold-300 underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
