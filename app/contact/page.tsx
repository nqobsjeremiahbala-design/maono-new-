import { ContactForm } from '@/components/shared/ContactForm'
import { JsonLd } from '@/components/shared/JsonLd'
import { faqJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Contact Maono Forex Trading',
  description: 'Get in touch with the Maono team. Based in Cape Town, serving all of South Africa.',
  path: '/contact',
})

const FAQ = [
  { question: 'Where is Maono based?', answer: 'We are based in Tyger Waterfront, Western Cape, South Africa. We serve traders across all of South Africa remotely.' },
  { question: 'Do I need prior trading experience?', answer: 'No. Our beginner path and Forex Introduction course are designed for people with zero prior experience.' },
  { question: 'What payment methods do you accept?', answer: 'We accept EFT, major credit/debit cards, and mobile payment methods. Details provided at checkout.' },
  { question: 'How quickly will I see results?', answer: 'Trading is a skill that takes time to develop. We do not promise specific returns. Most students see meaningful improvement in their analytical ability within 3-6 months of consistent practice.' },
  { question: 'Is the signals group really free?', answer: 'Yes. The signals group is completely free with no strings attached. We offer it as a starting point — upgrades to courses and memberships are entirely optional.' },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Contact us</h1>
          <p className="text-navy-300">We typically respond within 24 hours.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Get in touch</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Contact details</h2>
            <div className="space-y-4 text-sm text-navy-600 mb-10">
              <p><strong className="text-navy-900">Address:</strong><br />Unit 3B Waterside Place, 19 Carl Cronje Drive<br />Tyger Waterfront, Western Cape, 7530</p>
              <p><strong className="text-navy-900">Phone / WhatsApp:</strong><br />+27 81 436 9770</p>
              <p><strong className="text-navy-900">Hours:</strong><br />Mon – Sat, 08:00 – 18:00</p>
            </div>
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
