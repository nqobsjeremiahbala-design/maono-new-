'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

const FORMSPREE_CONTACT_ID = 'xpwzeygk'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_CONTACT_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-gold-500 font-semibold py-8">
        Message sent. We&apos;ll get back to you within 24 hours.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email address" required />
      </div>
      <Input name="subject" placeholder="Subject" required />
      <Textarea name="message" placeholder="Your message..." rows={5} required />
      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Something went wrong. Email us directly at info@maonoforextrading.co.za
        </p>
      )}
      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}
