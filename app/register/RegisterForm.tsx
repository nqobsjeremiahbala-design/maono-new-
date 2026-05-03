'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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

      <p className="text-center text-sm text-navy-500 pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-600 hover:text-gold-500 font-medium underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  )
}
