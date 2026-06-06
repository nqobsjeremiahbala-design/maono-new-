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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
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
      setError('Invalid email or password')
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

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
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
