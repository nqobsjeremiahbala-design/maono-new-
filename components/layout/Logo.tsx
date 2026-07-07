import Image from 'next/image'
import Link from 'next/link'

export function Logo({
  variant = 'default',
  onDark = false,
  compact = false,
}: {
  variant?: 'default' | 'footer'
  /** True when the logo sits over a navy background (e.g. the home nav
   * before scroll) — swaps in the white-bull mark so it stays visible. */
  onDark?: boolean
  compact?: boolean
}) {
  const isFooter = variant === 'footer'

  // Transparent brand marks — light (navy bull) for a white background, dark
  // (white bull) for a navy background — so there's never a white box behind it.
  // The header scales with the viewport but stays within the existing nav
  // height so the bar never grows.
  const src = isFooter || onDark
    ? '/images/logo/maono_forex_trading_logo_transparent_dark_site.png'
    : '/images/logo/maono_forex_trading_logo_transparent_light_site.png'

  const heightClass = isFooter
    ? 'h-[120px]'
    : compact
      ? 'h-[46px] md:h-[58px] lg:h-[64px]' // scrolled: condensed
      : 'h-[60px] md:h-[92px] lg:h-[108px]' // top: full size

  return (
    <Link href="/" className="inline-flex items-center" aria-label="Maono Forex Trading">
      <Image
        src={src}
        alt="Maono Forex Trading"
        width={525}
        height={463}
        priority={!isFooter}
        className={`${heightClass} w-auto object-contain transition-all duration-300`}
      />
    </Link>
  )
}
