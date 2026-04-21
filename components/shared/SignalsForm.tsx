'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const FORMSPREE_SIGNALS_ID = 'xpwzeygk'

export function SignalsForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_SIGNALS_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="text-gold-500 font-semibold text-lg mb-2">You&apos;re in.</p>
        <p className="text-navy-300 text-sm">Check WhatsApp — we&apos;ll add you to the group shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" type="text" placeholder="Your name" required />
      <Input name="email" type="email" placeholder="Email address" required />
      <Input name="whatsapp" type="tel" placeholder="WhatsApp number (+27...)" required />
      <input type="hidden" name="_subject" value="New signals group signup" />
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Try WhatsApp directly instead.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Joining...' : 'Join the free signals group →'}
      </Button>
      <p className="text-center text-xs text-navy-400">
        Or{' '}
        <a
          href="https://wa.me/27814369770?text=Hi+Maono%2C+I%27d+like+to+join+the+free+signals+group"
          className="underline hover:text-navy-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          message us on WhatsApp
        </a>{' '}
        directly.
      </p>
    </form>
  )
}
