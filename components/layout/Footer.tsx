import Link from 'next/link'
import { Logo } from './Logo'
import { TELEGRAM_CHANNEL_URL, SOCIAL_LINKS } from '@/lib/links'

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/risk-disclosure', label: 'Risk Disclosure' },
  { href: '/contact', label: 'Contact' },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Logo variant="footer" />
            <p className="text-xs mt-4 leading-relaxed">
              Unit 3B Waterside Place, 19 Carl Cronje Drive, Tyger Waterfront, Western Cape, 7530
            </p>
            <p className="text-xs mt-1">
              <a href="tel:+27814369770" className="hover:text-white transition-colors">
                +27 81 436 9770
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Explore</h3>
            <ul className="space-y-2">
              {primaryLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Follow</h3>
            <ul className="space-y-2">
              {socials.map(s => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8">
          <p className="text-xs">© {new Date().getFullYear()} Maono Forex Trading. All rights reserved.</p>
          <p className="text-xs text-navy-200 mt-4 leading-relaxed max-w-4xl">
            Trading forex and financial instruments carries significant risk. Past performance is not indicative of future results.
            You should never trade money you cannot afford to lose. Maono Forex Trading provides education only and does not constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
