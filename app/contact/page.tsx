import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { faqJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'
import { TELEGRAM_BOT_URL, TELEGRAM_CHANNEL_URL } from '@/lib/links'

export const metadata = generatePageMetadata({
  title: 'Contact Maono Forex Trading',
  description: 'Reach the Maono team via our Telegram bot. Instant FAQ answers, with escalation to a coach when you need it.',
  path: '/contact',
})

const FAQ = [
  { question: 'How do I get in touch?', answer: 'All support runs through our Telegram bot. It answers common questions instantly and escalates anything trickier directly to Jody and the team.' },
  { question: 'Where is Maono based?', answer: 'We are based in Tyger Waterfront, Western Cape, South Africa, serving traders across the country and beyond.' },
  { question: 'Do I need prior trading experience?', answer: 'No. Our beginner path and Forex Introduction course are designed for people with zero prior experience.' },
  { question: 'What payment methods do you accept?', answer: 'EFT, major credit/debit cards, and mobile payment methods. Details are shown at checkout.' },
  { question: 'How quickly will I see results?', answer: 'Trading is a skill that takes time. We do not promise specific returns. Most students see meaningful improvement within 3–6 months of consistent practice.' },
  { question: 'Is the Telegram channel really free?', answer: 'Yes. The Telegram channel is completely free. Course and bundle upgrades are entirely optional.' },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">Talk to Maono</h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Support runs through our Telegram bot. Instant answers, with a real coach behind it when you need one.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-4">Message us on Telegram</h2>
            <p className="text-navy-600 text-sm mb-6">
              Tap below to start a conversation with our Telegram bot. It handles common questions instantly and
              loops in Jody when you need a coach.
            </p>
            <Link
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              Open Telegram bot →
            </Link>
            <p className="mt-6 text-sm text-navy-500">
              Prefer the main feed?{' '}
              <Link href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-navy-900 underline hover:text-gold-600">
                Join the Telegram channel
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">FAQ</h2>
            <div className="space-y-6">
              {FAQ.map(item => (
                <div key={item.question}>
                  <p className="font-semibold text-navy-900 text-sm mb-1">{item.question}</p>
                  <p className="text-sm text-navy-500">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
