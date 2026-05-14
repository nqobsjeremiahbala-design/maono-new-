import Link from 'next/link'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_CHANNEL_URL, TELEGRAM_BOT_URL } from '@/lib/links'

export const metadata = generatePageMetadata({
  title: 'Your Dashboard',
  description: 'Your Maono Forex Trading dashboard. Revisit purchased courses, view your plan, and join Telegram.',
  path: '/dashboard',
})

export default function DashboardPage() {
  return (
    <section className="bg-navy-950 min-h-dvh">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-gold-400 text-xs font-bold tracking-[0.25em] uppercase mb-2">
            Wireframe preview · Auth coming soon
          </p>
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl text-white leading-tight">
            Welcome back, Trader.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mt-2">
            Pick up where you left off, manage your plan, and stay plugged into the Telegram channel.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-10">
          <div className="lg:col-span-2 rounded-2xl bg-navy-900 border border-navy-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl text-white">Your courses</h2>
              <Link href="/my-courses" className="text-gold-400 hover:text-gold-300 text-sm font-semibold">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Forex Introduction', progress: 64 },
                { title: 'Risk Management Mastery', progress: 28 },
                { title: 'Institutional Concepts', progress: 12 },
              ].map(c => (
                <div key={c.title} className="rounded-xl bg-navy-950 border border-navy-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{c.title}</p>
                    <p className="text-navy-300 text-sm">{c.progress}%</p>
                  </div>
                  <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-6">
            <h2 className="font-serif text-2xl text-white mb-4">Your plan</h2>
            <div className="rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-700/5 border border-gold-500/40 p-5 mb-5">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-wide mb-1">
                Active membership
              </p>
              <p className="font-serif text-2xl text-white mb-1">Gold</p>
              <p className="text-navy-300 text-sm">Renews 12 May 2026</p>
            </div>
            <Link
              href="/memberships"
              className="block text-center px-4 py-3 rounded-md border border-navy-700 text-white hover:bg-navy-800 text-sm font-semibold"
            >
              Manage plan
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 border border-gold-500/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">
              Telegram access
            </p>
            <h3 className="font-serif font-bold text-2xl text-white mb-1">
              Get into the daily flow.
            </h3>
            <p className="text-navy-300 text-sm">
              Live setups, market context, and member chat — straight to your phone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400"
            >
              Join Telegram Channel
            </Link>
            <Link
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-6 py-3 min-h-[44px] border border-navy-700 text-white font-semibold rounded-md hover:bg-navy-800"
            >
              Open Bot
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
