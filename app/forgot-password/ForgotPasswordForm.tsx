'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const email = String(new FormData(e.currentTarget).get('email') || '')
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => null)
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-navy-800 bg-navy-900 p-6 text-center">
        <p className="mb-5 text-navy-200">
          If an account exists for that email, we&apos;ve sent a link to reset your password. Check your inbox (and spam).
        </p>
        <Link href="/login" className="font-semibold text-gold-400 hover:text-gold-300">← Back to sign in</Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-navy-200">Email</label>
        <Input id="fp-email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send reset link'}
      </Button>
      <p className="text-center text-sm text-navy-400">
        <Link href="/login" className="hover:text-gold-400">← Back to sign in</Link>
      </p>
    </form>
  )
}
