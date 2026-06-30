'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function RegisterForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

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
      const data = (await res.json()) as { error?: string }
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    // No auto sign-in — the account must be confirmed by email first.
    setSubmittedEmail(email)
    setLoading(false)
  }

  async function resend() {
    if (!submittedEmail) return
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail }),
      })
    } finally {
      setResent(true)
    }
  }

  if (submittedEmail) {
    return (
      <div className="text-center">
        <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
        <h2 className="font-serif text-2xl text-navy-900 mb-3">Check your email</h2>
        <p className="text-navy-600 mb-2">
          We&apos;ve sent a confirmation link to <strong>{submittedEmail}</strong>.
        </p>
        <p className="text-navy-500 text-sm mb-6">
          Click it to activate your account, then sign in. (Check your spam folder if it&apos;s not there.)
        </p>
        {resent ? (
          <p className="text-green-600 text-sm mb-6">✓ Sent again — it&apos;s on its way.</p>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="mb-6 text-sm font-medium text-gold-600 underline hover:text-gold-700"
          >
            Didn&apos;t get it? Resend email
          </button>
        )}
        <p className="text-center text-sm text-navy-500">
          <Link href="/login" className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold-500">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-navy-700 mb-1.5">
          Full name
        </label>
        <Input id="reg-name" name="name" type="text" required autoComplete="name" placeholder="Thabo Nkosi" />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-navy-700 mb-1.5">
          Email
        </label>
        <Input id="reg-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="reg-phone" className="block text-sm font-medium text-navy-700 mb-1.5">
          WhatsApp number <span className="text-navy-400 font-normal">(optional)</span>
        </label>
        <Input id="reg-phone" name="phone" type="tel" autoComplete="tel" placeholder="+27 81 000 0000" />
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

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" size="md" className="w-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-navy-500 pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-600 hover:text-gold-500 font-medium underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  )
}
