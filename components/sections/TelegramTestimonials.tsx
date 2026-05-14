import Link from 'next/link'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

const SCREENSHOTS = [
  {
    handle: '@SibahleM',
    body: 'EUR/USD short call hit TP3 last night. R4 200 profit. This channel is the only thing that\'s actually moved my account forward in 6 months.',
    pl: '+R4 200',
    time: '2h ago',
  },
  {
    handle: '@TraderNkosi',
    body: 'Joined the channel 3 weeks ago. Caught the Gold setup yesterday — R12k green day. The breakdowns are gold (no pun intended).',
    pl: '+R12 800',
    time: '5h ago',
  },
  {
    handle: '@KeaganV',
    body: 'I was sceptical at first. Now I just trust the process. USDJPY long was textbook. Risk management makes the difference.',
    pl: '+R2 350',
    time: '1d ago',
  },
  {
    handle: '@LeratoT',
    body: 'Honestly the only signal channel I\'ve ever stuck with. They explain WHY, not just where to enter. That\'s why I\'m profitable now.',
    pl: '+R6 700',
    time: '1d ago',
  },
  {
    handle: '@MphoZ',
    body: 'GBP/USD swing — entry, SL, TP all clear. Locked in 3R while I was at work. Set and forget. Best decision I made this year.',
    pl: '+R8 100',
    time: '2d ago',
  },
  {
    handle: '@JadenP',
    body: 'Year-to-date my account is up 38%. I follow the channel signals + the courses. Combo is unbeatable for SA traders.',
    pl: '+38% YTD',
    time: '3d ago',
  },
]

export function TelegramTestimonials() {
  return (
    <section className="py-20 md:py-24 px-5 sm:px-6 bg-navy-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">
            From the Telegram Channel
          </p>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            Real wins. Real members.
          </h2>
          <p className="text-navy-300 text-base sm:text-lg max-w-xl mx-auto">
            A glimpse at what members are saying inside the channel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCREENSHOTS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0E1A2B] border border-navy-800 p-5 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold text-xs">
                    {s.handle.replace('@', '').charAt(0)}
                  </div>
                  <p className="text-white font-semibold text-sm">{s.handle}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {s.pl}
                </span>
              </div>
              <p className="text-navy-200 text-sm leading-relaxed mb-3">{s.body}</p>
              <p className="text-navy-500 text-xs">{s.time}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-8 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 transition-colors"
          >
            Join Telegram Channel →
          </Link>
        </div>
      </div>
    </section>
  )
}
