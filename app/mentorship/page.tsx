import { ContactForm } from '@/components/shared/ContactForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: '1-on-1 Forex Mentorship',
  description: 'Work directly with a Maono mentor. Personalised forex coaching for serious traders in South Africa.',
  path: '/mentorship',
})

export default function MentorshipPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 leading-tight">1-on-1 Mentorship</h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Direct access to a Maono mentor. Personalised, accountable, results-focused.
          </p>
        </div>
      </section>
      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">What mentorship includes</h2>
            <ul className="space-y-4 text-sm text-navy-600">
              {[
                'Monthly 1-on-1 video sessions with your assigned mentor',
                'Personalised trading plan built for your goals and risk profile',
                'Trade review, your mentor reviews your setups and gives structured feedback',
                'Priority WhatsApp support between sessions',
                'Full access to the Gold membership tier (all courses + live sessions)',
              ].map(item => (
                <li key={item} className="flex gap-3">
                  <span className="text-gold-500 shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white rounded-lg border border-navy-100">
              <p className="text-xs text-navy-400 mb-1">Monthly investment</p>
              <p className="font-serif text-3xl text-navy-900">
                R2,499 <span className="text-sm text-navy-400">/month</span>
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Apply for mentorship</h2>
            <p className="text-sm text-navy-500 mb-6">
              Tell us where you are in your trading journey and what you want to achieve.
              We&apos;ll get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
