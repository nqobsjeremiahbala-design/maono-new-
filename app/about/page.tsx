import { TeamCard } from '@/components/shared/TeamCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { TeamMember } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'About Maono Forex Trading',
  description: 'Meet the team behind Maono Forex Trading. Institutional-grade education built on market relevance, teamwork, empowerment, and financial innovation.',
  path: '/about',
})

const TEAM: TeamMember[] = [
  {
    name: 'Jody',
    role: 'Founder & Head Trader',
    bio: 'Lead mentor at Maono. 7+ years of live trading and coaching, focused on institutional concepts and risk-first execution.',
    image: '/images/team/placeholder.jpg',
    years: 7,
  },
]

const VALUES = [
  {
    title: 'Market Relevance',
    body: 'We trade the market that exists today, not the one we wish existed. Every lesson reflects current institutional flow, liquidity, and structure.',
  },
  {
    title: 'Relationships & Teamwork',
    body: 'Trading is lonely, mentorship should not be. We build a community of accountable traders who level up together.',
  },
  {
    title: 'Empowerment',
    body: 'We do not sell signals you can rent. We teach skills you own, so you can analyse, decide, and act independently.',
  },
  {
    title: 'Financial Innovation',
    body: 'We bring institutional thinking to retail traders, with continuous research into new tools, models, and approaches.',
  },
]

const STATS = [
  { value: '712+', label: 'Learners' },
  { value: '30', label: 'Lectures' },
  { value: '5', label: 'Coaches' },
  { value: '52', label: 'Reviews' },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">About Maono</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            Trading insights, redefined.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            We are South African traders who got tired of watching good people lose money to bad education.
            Maono Forex Trading exists to change that.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-950 border-t border-navy-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="font-serif text-3xl sm:text-4xl text-gold-400 mb-1">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-navy-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-4">Our story</h2>
          <p className="text-navy-600 mb-6">
            Maono started inside a small group of traders trying to make sense of a market dominated by
            misinformation. What began as private chats and shared charts grew into a structured education
            programme, a Telegram channel, and a community of hundreds of South African traders.
          </p>
          <h2 className="font-serif text-2xl text-navy-900 mb-4 mt-10">Our methodology</h2>
          <p className="text-navy-600 mb-2">
            We teach institutional concepts: how banks, hedge funds, and professional participants actually
            read and use price. Not retail indicators. Not automated signals. Structure, liquidity, and order flow.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-8 text-center">Our core values</h2>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm">
                <p className="text-gold-600 text-xs font-bold uppercase tracking-wider mb-2">{v.title}</p>
                <p className="text-navy-700 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-navy-900 mb-10 md:mb-12">The team</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {TEAM.map(m => <TeamCard key={m.name} member={m} />)}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
