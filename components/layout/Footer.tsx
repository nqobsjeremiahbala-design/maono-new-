import Link from 'next/link'
import Image from 'next/image'
import { TELEGRAM_CHANNEL_URL, SOCIAL_LINKS } from '@/lib/links'

const columns = [
  {
    title: 'Learn',
    links: [
      { href: '/courses', label: 'All Courses' },
      { href: '/paths/beginner', label: 'Beginner Path' },
      { href: '/paths/intermediate', label: 'Intermediate Path' },
      { href: '/paths/advanced', label: 'Advanced Path' },
      { href: '/resources', label: 'Free Resources' },
    ],
  },
  {
    title: 'Join',
    links: [
      { href: TELEGRAM_CHANNEL_URL, label: 'Telegram Channel', external: true },
      { href: '/memberships', label: 'Memberships' },
      { href: '/seminars', label: 'Live Seminars' },
      { href: '/news', label: 'Market News' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/risk-disclosure', label: 'Risk Disclosure' },
    ],
  },
] as const

const socials = [
  { href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { href: SOCIAL_LINKS.youtube, label: 'YouTube' },
  { href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
  { href: SOCIAL_LINKS.x, label: 'X' },
  { href: TELEGRAM_CHANNEL_URL, label: 'Telegram' },
]

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map(col => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      target={'external' in l && l.external ? '_blank' : undefined}
                      rel={'external' in l && l.external ? 'noopener noreferrer' : undefined}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-800 pt-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/images/logo/maono-logo.png"
                  alt="Maono Forex Trading"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <p className="font-serif text-white font-bold text-lg">Maono Forex Trading</p>
              </div>
              <p className="text-xs mt-1">Unit 3B Waterside Place, 19 Carl Cronje Drive, Tyger Waterfront, Western Cape, 7530</p>
              <p className="text-xs mt-0.5">+27 81 436 9770</p>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {socials.map(s => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wide text-navy-300 hover:text-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Maono Forex Trading. All rights reserved.</p>
        </div>

        <p className="text-xs text-navy-500 mt-6 leading-relaxed">
          Trading forex and financial instruments carries significant risk. Past performance is not indicative of future results.
          You should never trade money you cannot afford to lose. Maono Forex Trading provides education only and does not constitute financial advice.
        </p>
      </div>
    </footer>
  )
}
