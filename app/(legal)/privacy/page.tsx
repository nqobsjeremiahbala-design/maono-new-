import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Maono Forex Trading privacy policy.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-20 px-5 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-navy-900 mb-2">Privacy Policy</h1>
        <p className="text-navy-400 text-sm mb-8">Last updated: 2026-04-27</p>

        <div className="space-y-8 text-sm text-navy-600 leading-relaxed">
          <div>
            <h2 className="font-semibold text-navy-900 mb-2">1. Introduction</h2>
            <p>Maono Forex Trading (PTY) LTD (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), registration number 2021/363728/07, is committed to protecting your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable South African legislation. This policy explains how we collect, use, store, and share your personal information.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">2. Information We Collect</h2>
            <p>We may collect the following categories of personal information:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Name and contact details (email address, phone number)</li>
              <li>Account credentials (username, encrypted password)</li>
              <li>Payment information (processed securely by third-party payment providers; we do not store card details)</li>
              <li>Usage data (pages visited, courses accessed, progress data)</li>
              <li>Communications you send us via email, contact form, or Telegram</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Create and manage your account</li>
              <li>Process payments and deliver purchased courses or memberships</li>
              <li>Send transactional emails (receipts, password resets, course updates)</li>
              <li>Improve our platform and tailor content to your learning needs</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">4. Lawful Basis for Processing</h2>
            <p>We process your personal information on the basis of: (a) contract performance — to fulfil your subscription or course purchase; (b) legitimate interests — to operate and improve our educational platform; and (c) legal compliance — where required by South African law.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">5. Sharing of Information</h2>
            <p>We do not sell your personal information to third parties. We may share your information with:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Payment processors (e.g. PayFast, Stripe) solely to process transactions</li>
              <li>Hosting and infrastructure providers bound by confidentiality obligations</li>
              <li>Regulators or law enforcement where required by law</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time by contacting us.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">7. Security</h2>
            <p>We use commercially reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. Passwords are stored using industry-standard hashing (bcrypt). However, no internet transmission is 100% secure and we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">8. Your Rights Under POPIA</h2>
            <p>You have the right to: access the personal information we hold about you; request correction of inaccurate information; request deletion of your information (subject to legal obligations); object to processing; and lodge a complaint with the Information Regulator of South Africa at <a href="https://www.justice.gov.za/inforeg/" className="text-gold-600 underline" target="_blank" rel="noopener noreferrer">www.justice.gov.za/inforeg/</a>.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">9. Cookies</h2>
            <p>Our website uses cookies and similar technologies to maintain your session, remember preferences, and gather anonymised analytics. You may disable cookies in your browser settings; however, some site functionality may be affected.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">10. Third-Party Links</h2>
            <p>Our site may contain links to third-party websites (including Telegram, TradingView, and broker platforms). We are not responsible for the privacy practices of those sites and encourage you to review their policies.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </div>

          <div>
            <h2 className="font-semibold text-navy-900 mb-2">12. Contact</h2>
            <p>To exercise your rights or raise a privacy concern, contact our Information Officer at:</p>
            <div className="mt-2 space-y-0.5">
              <p><strong className="text-navy-700">Email:</strong> accounts@maonoforextrading.co.za</p>
              <p><strong className="text-navy-700">Address:</strong> 57 Barnard Street, Oakdale, Bellville, Western Cape, 7530</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
