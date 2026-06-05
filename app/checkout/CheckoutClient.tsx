'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { enroll } from '@/lib/enrollment'

type Item = {
  label: string
  sub: string
  price: number
  period?: 'month' | 'once'
}

const CATALOG: Record<string, Item> = {
  'path-beginner': {
    label: 'Beginner Path',
    sub: 'Forex foundations + trading psychology + tools (3 courses)',
    price: 2499,
    period: 'once',
  },
  'path-intermediate': {
    label: 'Intermediate Path',
    sub: 'Price action + strategies + psychology (3 courses)',
    price: 3499,
    period: 'once',
  },
  'path-advanced': {
    label: 'Advanced Path',
    sub: 'Institutional concepts + strategies + price action (3 courses)',
    price: 4999,
    period: 'once',
  },
  'tier-bronze': { label: 'Bronze Membership', sub: 'Signals + community', price: 499, period: 'month' },
  'tier-silver': { label: 'Silver Membership', sub: 'Signals + beginner course', price: 899, period: 'month' },
  'tier-gold': { label: 'Gold Membership', sub: 'All courses + live sessions', price: 1499, period: 'month' },
  'tier-platinum': { label: 'Platinum Membership', sub: '1-on-1 + everything in Gold', price: 2499, period: 'month' },
  'course-forex-trading-introduction': {
    label: 'Forex Trading Introduction',
    sub: 'Beginner course',
    price: 999,
    period: 'once',
  },
  'course-institutional-trading-concepts': {
    label: 'Institutional Trading Concepts',
    sub: 'Advanced course',
    price: 1999,
    period: 'once',
  },
  'course-price-action-trading': { label: 'Price Action Trading', sub: 'Intermediate course', price: 1499, period: 'once' },
  'course-trading-psychology': { label: 'Trading Psychology', sub: 'All levels', price: 1299, period: 'once' },
  'course-trading-strategies': { label: 'Trading Strategies', sub: 'Intermediate course', price: 1499, period: 'once' },
  'course-trading-tools': { label: 'Trading Tools', sub: 'Beginner course', price: 999, period: 'once' },

  // Course bundles (linked from /memberships). Gold = the "Recommended" promo at R1999.
  'bundle-bronze': { label: 'Bronze Bundle', sub: 'Forex Intro, Price Action & Trading Tools — lifetime access', price: 899, period: 'once' },
  'bundle-silver': { label: 'Silver Bundle', sub: 'Adds risk & money management — lifetime access', price: 1299, period: 'once' },
  'bundle-gold': { label: 'Gold Bundle', sub: 'Full course library — lifetime access', price: 1999, period: 'once' },
  'bundle-platinum': { label: 'Platinum Bundle', sub: 'Full library + 1-on-1 mentorship', price: 6499, period: 'once' },
}

const FORMSPREE_ID = 'xpwzeygk'

const COURSES_WITH_PLAYER = new Set(['forex-trading-introduction', 'trading-psychology'])

// Every paid course slug on the site.
const ALL_COURSES = [
  'forex-trading-introduction',
  'price-action-trading',
  'trading-tools',
  'trading-strategies',
  'trading-psychology',
  'institutional-trading-concepts',
]

// Which course(s) each purchasable item unlocks on the learner's dashboard.
const ENROLL_SLUGS: Record<string, string[]> = {
  'bundle-bronze': ['forex-trading-introduction', 'price-action-trading', 'trading-tools'],
  'bundle-silver': ['forex-trading-introduction', 'price-action-trading', 'trading-tools', 'trading-strategies'],
  'bundle-gold': ALL_COURSES,
  'bundle-platinum': ALL_COURSES,
  'path-beginner': ['forex-trading-introduction', 'trading-psychology', 'trading-tools'],
  'path-intermediate': ['price-action-trading', 'trading-strategies', 'trading-psychology'],
  'path-advanced': ['institutional-trading-concepts', 'trading-strategies', 'price-action-trading'],
  'tier-bronze': ['forex-trading-introduction'],
  'tier-silver': ['forex-trading-introduction', 'price-action-trading'],
  'tier-gold': ALL_COURSES,
  'tier-platinum': ALL_COURSES,
}

function enrollSlugsForItem(itemKey: string): string[] {
  if (itemKey.startsWith('course-')) return [itemKey.slice('course-'.length)]
  return ENROLL_SLUGS[itemKey] ?? []
}

export function CheckoutClient() {
  const sp = useSearchParams()
  const itemKey = sp.get('item') || ''
  const item = CATALOG[itemKey]
  const { data: session, status: authStatus } = useSession()
  const [method, setMethod] = useState<'card' | 'eft'>('card')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [enrolledSlug, setEnrolledSlug] = useState<string | null>(null)

  if (authStatus === 'loading') {
    return (
      <section className="bg-navy-950 min-h-screen py-20 px-4 text-center">
        <p className="text-white">Loading…</p>
      </section>
    )
  }

  if (!session?.user) {
    return (
      <section className="bg-navy-950 min-h-dvh py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-md mx-auto text-center hero-reveal">
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-6" />
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Sign in to continue
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mb-8">
            You need an account to purchase courses. Sign in or create one to continue to checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/checkout?item=${itemKey}`)}`}
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(`/checkout?item=${itemKey}`)}`}
              className="press inline-flex items-center justify-center px-6 py-3 rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!item) return
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    data.append('item', itemKey)
    data.append('label', item.label)
    data.append('price', String(item.price))
    data.append('payment_method', method)

    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')

    const slugs = enrollSlugsForItem(itemKey)
    if (slugs.length) {
      slugs.forEach(s => enroll(s, { name, email }))
      setEnrolledSlug(slugs[0])
    }

    // Never transmit the (demo) card fields anywhere.
    data.delete('card_number')
    data.delete('card_expiry')
    data.delete('card_cvc')

    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      }).catch(() => null)
    } catch {
      // Demo mode: form submission is best-effort, don't block the journey.
    }

    setStatus('success')
  }

  if (!item) {
    return (
      <section className="bg-navy-950 min-h-screen py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="font-serif text-3xl text-white mb-4">Nothing selected</h1>
          <p className="text-navy-300 mb-8">Pick a course, path, or membership tier to continue.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg"><Link href="/courses">Browse courses</Link></Button>
            <Button size="lg" variant="outline"><Link href="/memberships">See memberships</Link></Button>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'success') {
    const hasPlayer = enrolledSlug && COURSES_WITH_PLAYER.has(enrolledSlug)
    return (
      <section className="bg-navy-950 min-h-dvh py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-xl mx-auto text-center hero-reveal">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            {enrolledSlug ? 'You’re enrolled' : 'Order received'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-5 leading-[1.08]">
            {enrolledSlug
              ? 'Welcome to the course.'
              : 'Thanks, we’ll be in touch.'}
          </h1>
          <p className="text-navy-300 text-lg mb-8">
            {enrolledSlug ? (
              <>You now have access to <strong className="text-white">{item.label}</strong>. Jump straight in — your progress saves automatically.</>
            ) : (
              <>We’ve received your order for <strong className="text-white">{item.label}</strong>. Our team will reach out within 24 hours with next steps.</>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasPlayer && enrolledSlug ? (
              <>
                <Link
                  href={`/learn/${enrolledSlug}`}
                  className="press inline-flex items-center justify-center px-7 py-4 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
                >
                  Start the course <span aria-hidden className="ml-2">→</span>
                </Link>
                <Link
                  href="/my-courses"
                  className="press inline-flex items-center justify-center px-7 py-4 rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
                >
                  Go to my courses
                </Link>
              </>
            ) : enrolledSlug ? (
              <Link
                href="/my-courses"
                className="press inline-flex items-center justify-center px-7 py-4 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
              >
                Go to my courses
              </Link>
            ) : (
              <Link
                href="/"
                className="press inline-flex items-center justify-center px-7 py-4 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
              >
                Back to home
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  const periodSuffix = item.period === 'month' ? ' / month' : ''

  return (
    <section className="bg-white min-h-screen py-12 md:py-16 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-sm text-navy-500 hover:text-navy-900 mb-8 inline-block">
          ← Back
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl text-navy-900 mb-2">Checkout</h1>
        <p className="text-navy-500 mb-10">Secure your spot. We&apos;ll confirm payment details by email within 24 hours.</p>

        <div className="grid md:grid-cols-[1fr_320px] gap-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="font-serif text-xl text-navy-900 mb-4">Your details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="co-name" className="block text-sm font-medium text-navy-700 mb-1.5">Full name</label>
                  <Input id="co-name" name="name" placeholder="Thabo Nkosi" required />
                </div>
                <div>
                  <label htmlFor="co-email" className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                  <Input id="co-email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-phone" className="block text-sm font-medium text-navy-700 mb-1.5">WhatsApp number</label>
                  <Input id="co-phone" name="phone" type="tel" placeholder="+27 81 000 0000" required />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy-900 mb-4">Payment method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(['card', 'eft'] as const).map(m => (
                  <label
                    key={m}
                    className={`block border rounded-md p-4 cursor-pointer transition ${
                      method === m ? 'border-gold-500 bg-white' : 'border-navy-200 bg-white hover:border-navy-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m}
                      checked={method === m}
                      onChange={() => setMethod(m)}
                      className="sr-only"
                    />
                    <p className="font-semibold text-navy-900 text-sm">
                      {m === 'card' ? 'Card' : 'EFT / Bank Transfer'}
                    </p>
                    <p className="text-xs text-navy-500 mt-1">
                      {m === 'card' ? 'Visa, Mastercard, debit & credit' : 'Manual EFT, we send banking details'}
                    </p>
                  </label>
                ))}
              </div>

              {method === 'card' && (
                <div className="mt-4 grid sm:grid-cols-2 gap-4 rounded-md border border-navy-100 bg-navy-50/40 p-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="co-card" className="block text-sm font-medium text-navy-700 mb-1.5">Card number</label>
                    <Input id="co-card" name="card_number" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" required />
                  </div>
                  <div>
                    <label htmlFor="co-exp" className="block text-sm font-medium text-navy-700 mb-1.5">Expiry (MM/YY)</label>
                    <Input id="co-exp" name="card_expiry" autoComplete="off" placeholder="08/28" required />
                  </div>
                  <div>
                    <label htmlFor="co-cvc" className="block text-sm font-medium text-navy-700 mb-1.5">CVC</label>
                    <Input id="co-cvc" name="card_cvc" inputMode="numeric" autoComplete="off" placeholder="123" required />
                  </div>
                  <p className="sm:col-span-2 text-xs text-navy-400">
                    Demo checkout — no real payment is processed. Enter any numbers to complete the order.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="co-notes" className="block text-sm font-medium text-navy-700 mb-1.5">
                Anything we should know? <span className="text-navy-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="co-notes"
                name="notes"
                rows={3}
                placeholder="Questions, accessibility needs, timing preferences…"
                className="w-full rounded-md border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">
                Something went wrong. WhatsApp us at +27 81 436 9770 and we&apos;ll finish the order for you.
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Submitting…' : `Place order, R${item.price.toLocaleString()}${periodSuffix}`}
            </Button>

            <p className="text-xs text-navy-400 text-center">
              By placing this order you agree to our{' '}
              <Link href="/terms" className="underline hover:text-navy-600">Terms</Link>,{' '}
              <Link href="/privacy" className="underline hover:text-navy-600">Privacy Policy</Link> and{' '}
              <Link href="/risk-disclosure" className="underline hover:text-navy-600">Risk Disclosure</Link>.
            </p>
          </form>

          <aside className="bg-white border border-navy-100 rounded-lg p-6 h-fit md:sticky md:top-24">
            <p className="text-xs text-navy-400 uppercase tracking-widest font-semibold mb-4">Order summary</p>
            <div className="border-b border-navy-100 pb-4 mb-4">
              <p className="font-serif text-lg text-navy-900">{item.label}</p>
              <p className="text-sm text-navy-500 mt-1">{item.sub}</p>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-navy-600">Subtotal</span>
              <span className="text-navy-900 font-semibold">R{item.price.toLocaleString()}{periodSuffix}</span>
            </div>
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-navy-600">VAT included</span>
              <span className="text-xs text-navy-500">,</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-navy-100 pt-4">
              <span className="font-semibold text-navy-900">Total</span>
              <span className="font-serif text-2xl text-navy-900">R{item.price.toLocaleString()}{periodSuffix}</span>
            </div>
            <div className="mt-6 space-y-2 text-xs text-navy-500">
              <p>✓ 7-day access guarantee</p>
              <p>✓ Cancel membership any time</p>
              <p>✓ Support from a real human</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
