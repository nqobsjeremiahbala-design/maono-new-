import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { faqJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_BOT_URL, TELEGRAM_CHANNEL_URL } from '@/lib/links'

export const metadata = generatePageMetadata({
  title: 'Contact Maono Forex Trading',
  description: 'Chat with the Maono Telegram bot. Instant answers on memberships, courses, and trading. Escalate to Jody for complex queries.',
  path: '/contact',
})

const FAQ = [
  { question: 'Where is Maono based?', answer: 'We are based in Tyger Waterfront, Western Cape, South Africa. We serve traders across all of South Africa remotely.' },
  { question: 'Do I need prior trading experience?', answer: 'No. Our beginner path and Forex Introduction course are designed for people with zero prior experience.' },
  { question: 'What payment methods do you accept?', answer: 'We accept EFT, major credit/debit cards, and mobile payment methods. Details provided at checkout.' },
  { question: 'How quickly will I see results?', answer: 'Trading is a skill that takes time to develop. We do not promise specific returns. Most students see meaningful improvement in their analytical ability within 3-6 months of consistent practice.' },
  { question: 'Is the Telegram channel really free?', answer: 'Yes. The Telegram channel is completely free with no strings attached. We offer it as a starting point, upgrades to courses and memberships are entirely optional.' },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="bg-navy-950 py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Talk to us on Telegram
          </p>
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Chat with our Telegram bot.
          </h1>
          <p className="text-navy-300 text-base sm:text-lg mb-10">
            Instant answers on memberships, courses, and trading basics — 24/7. Complex inquiries are escalated directly to Jody.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-8 py-4 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md hover:bg-gold-400 transition-colors"
            >
              Open Telegram Bot →
            </Link>
            <Link
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center px-8 py-4 min-h-[48px] border-2 border-gold-500 text-gold-400 font-bold rounded-md hover:bg-gold-500 hover:text-navy-950 transition-colors"
            >
              Join the Channel
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl bg-navy-900 border border-navy-800 p-5">
              <p className="text-gold-400 font-bold text-xs uppercase tracking-wide mb-2">Instant</p>
              <p className="text-navy-200 text-sm">FAQs and membership info answered immediately.</p>
            </div>
            <div className="rounded-xl bg-navy-900 border border-navy-800 p-5">
              <p className="text-gold-400 font-bold text-xs uppercase tracking-wide mb-2">Smart escalation</p>
              <p className="text-navy-200 text-sm">Complex questions go straight to Jody.</p>
            </div>
            <div className="rounded-xl bg-navy-900 border border-navy-800 p-5">
              <p className="text-gold-400 font-bold text-xs uppercase tracking-wide mb-2">No email gates</p>
              <p className="text-navy-200 text-sm">Just open Telegram and start typing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-5 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-8 text-center">
            Frequently asked
          </h2>
          <div className="space-y-6">
            {FAQ.map(item => (
              <div
                key={item.question}
                className="border-b border-navy-100 pb-6 last:border-b-0"
              >
                <p className="font-semibold text-navy-900 text-base mb-2">{item.question}</p>
                <p className="text-sm text-navy-500 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
