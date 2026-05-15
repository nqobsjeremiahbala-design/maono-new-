import { TeamCard } from '@/components/shared/TeamCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { TeamMember } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'About Maono Forex Trading',
  description: 'Maono Forex Trading was founded by Jody Francis on transparency and integrity. Over 7 years of trading and mentoring experience, structured online courses, and live 3-day training.',
  path: '/about',
})

const TEAM: TeamMember[] = [
  {
    name: 'Jody Francis',
    role: 'Founder & Head Trader',
    bio: 'Visionary and founder of Maono Forex Trading. 7+ years of live trading and mentoring, focused on smart money order flow and institutional concepts.',
    image: '/images/team/placeholder.jpg',
    years: 7,
  },
]

const PILLARS = [
  {
    title: 'Mission',
    body: 'Enhancing financially independent traders through proven methods and concepts to master trading of currencies, stocks and synthetic indices, majoring in smart money order flow concepts.',
  },
  {
    title: 'Vision',
    body: 'To be a leading virtual and live training platform with result-oriented trading strategies.',
  },
]

const VALUES = [
  {
    title: 'Empowerment',
    body: 'Equipping traders with the skills and knowledge to take ownership of their decisions and their results.',
  },
  {
    title: 'Financial Innovation',
    body: 'Bringing institutional thinking and modern tools to retail traders, with continuous research and refinement.',
  },
  {
    title: 'Relationships & Teamwork',
    body: 'Trading is lonely, mentorship should not be. We build a community of accountable traders who level up together.',
  },
  {
    title: 'Market Relevance',
    body: 'We teach the market that exists today, reflecting current institutional flow, liquidity, and structure.',
  },
]

const COURSES = [
  'Technical Analysis',
  'Fundamental Analysis',
  'Money Management',
  'Mastering Smart Money Order Flow Concepts',
  'Generating your own trading signals',
  'The Psychology of Trading',
  'Setting up your Demo and Live Trading Accounts',
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
            From humble beginnings to a leading South African forex education platform. Built on transparency,
            integrity, and a relentless focus on the trader&apos;s growth.
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

      <section className="py-14 md:py-20 px-5 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-5">Maono Forex Trading</h2>
          <div className="space-y-5 text-navy-600 leading-relaxed">
            <p>
              From humble beginnings, the company was born from the mind of visionary and founder,{' '}
              <strong className="text-navy-900">Jody Francis</strong>, who grew a passion and grasped an
              understanding for the foreign exchange market. Built on the backbone of transparency and
              integrity, Jody felt it necessary to educate new and existing traders with key fundamentals
              and analysis, thus establishing Maono Forex Trading.
            </p>
            <p>
              Comprised of an excellent management team with more than 7 years of trading and mentoring
              experience, we have created an intensive online and live trading course to help you master
              trading concepts which are applicable to any trading instrument such as currencies, stocks,
              CFDs and synthetic indices.
            </p>
            <p>
              Maono&apos;s vision and mission is one of empowering individuals with the necessary
              fundamental and financial innovation that is relevant to the current market structure, whilst
              building and fostering teamwork and relationships well into the future.
            </p>
            <p>
              What is so amazing about our online trading course is that it is self-paced and we have
              created a system where you can track your progress, continue where you ended the last time
              you logged in, access unlimited one-on-one refresher webinars, receive training course
              certification after completion and, above all, be given access to one-on-one interactions
              with our trainers for any further assistance. Our visual and literature methods are
              educational blocks that enhance the learning process and simplify mastering effective and
              profitable trading concepts in the shortest time possible. We also offer a live 3-day course
              for those who prefer face-to-face interaction with our professional traders.
            </p>
            <p>
              So what are you waiting for? Start your journey to{' '}
              <strong className="text-navy-900 uppercase tracking-wide">financial freedom</strong> with
              trainers who are highly skilled traders, market makers, and business leaders. Each one is
              experienced in forex trading, actively trades their own accounts, and takes tremendous
              pleasure in teaching, hosting, and passing on the skill and knowledge of forex trading.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-6">
            {PILLARS.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-7 border border-navy-100 shadow-sm">
                <p className="text-gold-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">{p.title}</p>
                <p className="text-navy-700 text-sm sm:text-base leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-6 mt-12 text-center">Our core values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-5 border border-navy-100 shadow-sm">
                <p className="text-gold-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{v.title}</p>
                <p className="text-navy-700 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Professional Certificate Courses · Online
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-900 leading-tight">
              What you&apos;ll master
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {COURSES.map(course => (
              <li
                key={course}
                className="flex items-start gap-3 bg-navy-50 rounded-xl px-5 py-4 border border-navy-100"
              >
                <span className="text-gold-500 font-bold shrink-0 mt-0.5" aria-hidden>✓</span>
                <span className="text-navy-800 text-sm sm:text-base">{course}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-50">
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
