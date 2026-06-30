'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export function VerifyEmailClient({ token, email }: { token: string; email: string }) {
  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [resent, setResent] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // avoid the React strict-mode double-invoke
    ran.current = true
    if (!token || !email) {
      setState('error')
      return
    }
    ;(async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        })
        setState(res.ok ? 'success' : 'error')
      } catch {
        setState('error')
      }
    })()
  }, [token, email])

  async function resend() {
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setResent(true)
    }
  }

  if (state === 'verifying') {
    return <p className="text-navy-300 text-lg">Confirming your email…</p>
  }

  if (state === 'success') {
    return (
      <>
        <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
        <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">Email confirmed 🎉</h1>
        <p className="text-navy-300 text-base sm:text-lg mb-8">
          Your account is now active. Sign in to start learning and browse the course bundles.
        </p>
        <Link
          href="/login"
          className="press inline-flex items-center justify-center px-6 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
        >
          Go to sign in
        </Link>
      </>
    )
  }

  // error / invalid / expired
  return (
    <>
      <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">Link invalid or expired</h1>
      <p className="text-navy-300 text-base sm:text-lg mb-8">
        This confirmation link is invalid or has expired.{email ? ' We can send you a fresh one.' : ''}
      </p>
      {email &&
        (resent ? (
          <p className="text-green-400">✓ A new confirmation email is on its way — check your inbox (and spam).</p>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="press inline-flex items-center justify-center px-6 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
          >
            Resend confirmation email
          </button>
        ))}
    </>
  )
}
