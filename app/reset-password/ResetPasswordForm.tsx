'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ResetPasswordForm({ token, email }: { token?: string; email?: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  if (!token || !email) {
    return (
      <p className="text-navy-300">
        This reset link is invalid or incomplete.{' '}
        <Link href="/forgot-password" className="font-semibold text-gold-400 hover:text-gold-300">Request a new one</Link>.
      </p>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const password = String(fd.get('password') || '')
    const confirm = String(fd.get('confirm') || '')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirm) return setError('Passwords don’t match')

    setStatus('sending')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setError(data.error || 'Reset failed — please request a new link.')
      setStatus('idle')
      return
    }
    setStatus('done')
    setTimeout(() => router.push('/login'), 1500)
  }

  if (status === 'done') {
    return <p className="text-navy-200">Password updated ✓ — taking you to sign in…</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="rp-pw" className="mb-1.5 block text-sm font-medium text-navy-200">New password</label>
        <Input id="rp-pw" name="password" type="password" placeholder="At least 8 characters" required />
      </div>
      <div>
        <label htmlFor="rp-confirm" className="mb-1.5 block text-sm font-medium text-navy-200">Confirm new password</label>
        <Input id="rp-confirm" name="confirm" type="password" placeholder="Re-enter your password" required />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  )
}
