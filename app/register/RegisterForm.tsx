'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
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

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Account created but sign-in failed. Please go to the login page.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-navy-700 mb-1.5">
          Full name
        </label>
        <Input
          id="reg-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Thabo Nkosi"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-navy-700 mb-1.5">
          Email
        </label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-phone" className="block text-sm font-medium text-navy-700 mb-1.5">
          WhatsApp number <span className="text-navy-400 font-normal">(optional)</span>
        </label>
        <Input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+27 81 000 0000"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-navy-700 mb-1.5">
          Password
        </label>
        <Input
          id="reg-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <p className="text-xs text-navy-400 mt-1.5">At least 8 characters</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button type="submit" size="md" className="w-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-navy-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-navy-400">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: callbackUrl })}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </button>

      <p className="text-center text-sm text-navy-500 pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-600 hover:text-gold-500 font-medium underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  )
}
