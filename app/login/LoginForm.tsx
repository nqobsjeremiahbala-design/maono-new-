'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

/** Allow only same-origin path-based redirects to prevent open-redirect phishing. */
function safeCallbackUrl(raw: string | null): string {
  if (!raw) return '/dashboard'
  // Must start with a single slash and must not be a protocol-relative URL.
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  return '/dashboard'
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  async function resendVerification() {
    if (!unverified) return
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverified }),
      })
    } finally {
      setResent(true)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setUnverified(null)
    setResent(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if ((result as { code?: string }).code === 'EmailNotVerified') {
        setUnverified(email)
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    } else {
      // If no explicit callbackUrl was provided, route admins to /admin
      if (!searchParams.get('callbackUrl')) {
        const res = await fetch('/api/auth/session')
        const session = (await res.json()) as { user?: { role?: string } } | null
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
          router.refresh()
          return
        }
      }
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-navy-700 mb-1.5">
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-navy-700">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs font-medium text-gold-600 hover:text-gold-700">
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {unverified && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-medium">Please confirm your email first.</p>
          <p className="mt-1">We sent a confirmation link to {unverified}.</p>
          {resent ? (
            <p className="mt-2 font-medium">✓ Sent again — check your inbox (and spam).</p>
          ) : (
            <button type="button" onClick={resendVerification} className="mt-2 font-medium underline">
              Resend confirmation email
            </button>
          )}
        </div>
      )}

      <Button type="submit" size="md" className="w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-navy-500 pt-2">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-gold-600 hover:text-gold-500 font-medium underline underline-offset-2">
          Create one
        </Link>
      </p>
    </form>
  )
}
