import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Maono Forex Trading terms of service.',
  path: '/terms',
})

const sections = [
  {
    heading: '1. Content Ownership & License',
    body: 'The portal\'s content — including videos, training materials, products, services, and their presentation — belongs to Maono Forex Trading (PTY) LTD. Users receive a limited license, which is non-exclusive, non-transferable, and non-sublicensable, for personal use only.',
  },
  {
    heading: '2. Proprietary Content',
    body: 'Company Content includes proprietary Videos, Graphics, voice, and sound recordings, artwork, photos, documents, and text, excluding user-provided materials.',
  },
  {
    heading: '3. Usage Restrictions',
    body: 'No Company Content may be copied, reproduced, republished, uploaded, posted, transmitted, distributed, used for public or commercial purposes, or downloaded in any way unless written permission is expressly granted by the Company. Modification or commercial use violates copyright rights and may result in damages.',
  },
  {
    heading: '4. Copyright Claims',
    body: 'All Content is copyrighted unless noted otherwise and belongs to the Company or its suppliers.',
  },
  {
    heading: '5. Trademarks & Intellectual Property',
    body: 'All trade names, trademarks, images, and biographical information are Company property or used with permission, including "MAONO FOREX TRADING (PTY) LTD."',
  },
  {
    heading: '6. Unauthorised Use Prohibited',
    body: 'Unauthorised Content use violates copyright, trademark, privacy, and publicity laws.',
  },
  {
    heading: '7. No Implied Licence',
    body: 'Nothing herein grants any licence to use trademarks or proprietary information without express written consent.',
  },
  {
    heading: '8. Content Removal Rights',
    body: 'The Company may remove content and accounts deemed unlawful, offensive, threatening, libellous, defamatory, pornographic, obscene or otherwise objectionable.',
  },
  {
    heading: '9. Intellectual Property Complaints',
    body: 'Users claiming IP violations should contact info@maonotrading.com with details including name, content description, location/URL, and registration information.',
  },
  {
    heading: '10. Accuracy Disclaimer',
    body: 'The Company makes no warranties or representations as to the accuracy of the content and assumes no liability or responsibility for any errors or omissions.',
  },
  {
    heading: '11. Electronic Communications',
    body: 'Registration constitutes consent to receive notices and communications electronically via email.',
  },
  {
    heading: '12. User Submissions',
    body: 'Comments, suggestions, drawings, designs, or programs submitted to the Company become the sole property of the Company.',
  },
  {
    heading: '13. Security Acknowledgment',
    body: 'While the Company uses commercially reasonable efforts to restrict unauthorised access, no system is entirely impenetrable. Use of this site is completely at your own risk.',
  },
  {
    heading: '14. Privacy & Data Disclosure',
    body: 'The Company will not intentionally disclose identifying information except when required by law or to enforce these terms. Users accept the Privacy Policy by using this site.',
  },
  {
    heading: '15. Registration & Accounts',
    body: 'Users must not allow others to use their account, must notify the Company of unauthorised use, cannot use other accounts without permission, must use non-misleading usernames, must keep passwords confidential, and must notify the Company of password disclosure. Users are responsible for all account activity arising from password negligence.',
  },
  {
    heading: '16. Suspension & Termination',
    body: 'Maono Forex Trading (PTY) LTD reserves the right to suspend or terminate your subscription if you breach these terms and conditions, with or without notice. No refund applies.',
  },
  {
    heading: '17. Subscription Renewal & Cancellation',
    body: 'Monthly or annual subscriptions continue until cancelled via the payment gateway. The Company notifies users of price changes in advance. Users cannot cancel once a service has begun except in limited refund policy circumstances. Cancellation takes effect at the end of the subscription period.',
  },
  {
    heading: '18. Trading / Investment Guidance Limitation',
    body: 'Maono Forex Trading (PTY) LTD is not intended to provide legal, tax, or investment advice. Users are solely responsible for determining whether any strategy suits their situation and should consult qualified professionals.',
  },
  {
    heading: '19. No Warranty on Information',
    body: 'The Company gives no representation, warranty, or guarantee as to the accuracy or completeness of information. Users are responsible for the effects of their own trades.',
  },
  {
    heading: '20. No Liability for Damages',
    body: 'Neither the Company nor any associated parties are liable under any circumstances for any direct, incidental, consequential, indirect, or punitive damages. All content is provided "as is" without warranties of any kind.',
  },
  {
    heading: '21. No Earnings Guarantees',
    body: 'The Company does not warrant that users will earn any money using the site. Earning potential depends on individual products, execution, time, finances, knowledge, and skills.',
  },
  {
    heading: '22. No Uninterrupted Service Guarantee',
    body: 'The Company does not warrant that use will be uninterrupted or error free, or that defects will be corrected. Users assume responsibility for any costs arising from use.',
  },
  {
    heading: '23. Right to Refuse Access',
    body: 'The Company reserves the right to refuse access to the site and/or the company\'s content, products and/or services to anyone in its sole discretion.',
  },
  {
    heading: '24. Refund Limitation',
    body: 'The Company may refund initial fees or pro-rata amounts at its discretion. No refunds are permitted thirty days after payment.',
  },
  {
    heading: '25. Indemnification',
    body: 'Users agree to indemnify the Company and its directors, officers, and employees for liabilities arising from: breach of this Agreement, violation of law or third-party rights, posted materials, site use, or conduct with other users.',
  },
  {
    heading: '26. Terms Revision',
    body: 'Terms may be revised by updating this posting. Users are bound by revisions and should periodically review the current Terms.',
  },
  {
    heading: '27. Statutory & Regulatory Disclosures',
    body: 'Registered with South Africa\'s Companies Commission under registration number 2021/363728/07. Registry available at https://eservices.cipc.co.za/search.aspx.',
  },
]

export default function TermsPage() {
  return (
    <section className="py-16 md:py-20 px-5 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-navy-900 mb-2">Terms of Service</h1>
        <p className="text-navy-400 text-sm mb-2">Last updated: 2026-04-27</p>
        <div className="mb-8 p-4 bg-navy-50 rounded-lg border border-navy-100">
          <p className="text-navy-600 text-sm">
            Please read these terms carefully before using this website. By accessing the site, you consent to these terms.
            If you do not agree, you should not use this website.
          </p>
        </div>
        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.heading}>
              <h2 className="font-semibold text-navy-900 mb-2">{s.heading}</h2>
              <p className="text-navy-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-navy-100 text-sm text-navy-500 space-y-1">
          <p><strong className="text-navy-700">Owner/Operator:</strong> Maono Forex Trading (PTY) LTD</p>
          <p><strong className="text-navy-700">Registration:</strong> 2021/363728/07 (South Africa)</p>
          <p><strong className="text-navy-700">Address:</strong> 57 Barnard Street, Oakdale, Bellville, Western Cape, 7530</p>
          <p><strong className="text-navy-700">Contact:</strong> accounts@maonoforextrading.co.za</p>
        </div>
      </div>
    </section>
  )
}
