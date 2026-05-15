import Link from 'next/link'
import { TELEGRAM_CHANNEL_URL } from '@/lib/links'

type Message = {
  name: string
  initial: string
  time: string
  body: string
  badge?: string
}

const MESSAGES: Message[] = [
  {
    name: 'Praveen K.',
    initial: 'P',
    time: '14:02',
    body: '+R8,400 on GBP/JPY today. Took the bullish OB call-out from Jody this morning. Process > prediction.',
    badge: 'Gold student',
  },
  {
    name: 'Kyle F.',
    initial: 'K',
    time: '11:47',
    body: 'XAUUSD short hit TP overnight. Loving the structure-first approach, no more chasing candles.',
  },
  {
    name: 'Comforted P.',
    initial: 'C',
    time: '09:15',
    body: 'EU sell-side liquidity grab and reversal exactly where you said. 3R in the bag before breakfast.',
    badge: 'Platinum',
  },
  {
    name: 'Greg S.',
    initial: 'G',
    time: 'Yesterday',
    body: 'Two weeks in and I’m already trading with rules instead of feelings. Massive change. Thanks team.',
  },
  {
    name: 'Kelly F.',
    initial: 'K',
    time: 'Yesterday',
    body: 'First green week in 3 months. The risk management module changed everything for me.',
  },
  {
    name: 'Brady L.',
    initial: 'B',
    time: '2d',
    body: 'Just hit R12k on this NY session. Maono’s liquidity model is unreal. Honest mentorship makes the difference.',
    badge: 'Gold student',
  },
]

export function TelegramTestimonials() {
  return (
    <section className="bg-white py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            From the Telegram channel
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 leading-tight mb-4">
            What the community is saying
          </h2>
          <p className="text-navy-500 text-base sm:text-lg max-w-xl mx-auto">
            Snippets from real students inside our Telegram channel, after they put the process to work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MESSAGES.map(m => (
            <div
              key={`${m.name}-${m.time}`}
              className="bg-navy-50 rounded-2xl p-5 border border-navy-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 ring-1 ring-gold-500/40 flex items-center justify-center text-gold-600 font-bold">
                  {m.initial}
                </div>
                <div className="flex-1">
                  <p className="text-navy-900 font-semibold text-sm">{m.name}</p>
                  <p className="text-[11px] text-navy-400">{m.time}</p>
                </div>
                {m.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-2 py-1 rounded">
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-navy-700 text-sm leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-md bg-navy-950 text-white font-semibold hover:bg-navy-800 transition-colors"
          >
            Join the Telegram channel →
          </Link>
        </div>
      </div>
    </section>
  )
}
