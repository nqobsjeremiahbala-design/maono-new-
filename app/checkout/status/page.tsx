import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

const COPY = {
  success: {
    tag: 'Payment received',
    title: 'Thank you — you’re all set.',
    body: 'Your payment is confirmed and we’ve emailed your receipt. Your courses will appear in your dashboard within a minute.',
    primary: { label: 'Go to my courses', href: '/my-courses' },
    secondary: { label: 'My dashboard', href: '/dashboard' },
  },
  pending: {
    tag: 'Payment pending',
    title: 'We’re confirming your payment.',
    body: 'Thanks — your order is being confirmed. Some methods (EFT, retail) take a little while. We’ll unlock your courses and email you the moment it clears — no action needed.',
    primary: { label: 'My dashboard', href: '/dashboard' },
    secondary: { label: 'Browse plans', href: '/memberships' },
  },
  declined: {
    tag: 'Payment not completed',
    title: 'That didn’t go through.',
    body: 'Your payment was not completed and no money was taken. You can try again.',
    primary: { label: 'Try again', href: '/memberships' },
    secondary: { label: 'My dashboard', href: '/dashboard' },
  },
}

export default async function CheckoutStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const { state } = await searchParams
  const c = COPY[(state as keyof typeof COPY) ?? 'pending'] ?? COPY.pending

  return (
    <section className="bg-navy-950 min-h-dvh py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-xl mx-auto text-center hero-reveal">
        <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">{c.tag}</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-5 leading-[1.08]">{c.title}</h1>
        <p className="text-navy-300 text-lg mb-8">{c.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={c.primary.href}
            className="press inline-flex items-center justify-center px-7 py-4 rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
          >
            {c.primary.label}
          </Link>
          <Link
            href={c.secondary.href}
            className="press inline-flex items-center justify-center px-7 py-4 rounded-md border border-navy-700 text-white hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            {c.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
