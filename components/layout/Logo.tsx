import Image from 'next/image'
import Link from 'next/link'

export function Logo({
  variant = 'default',
  compact = false,
}: {
  variant?: 'default' | 'footer'
  compact?: boolean
}) {
  const isFooter = variant === 'footer'

  // Transparent brand marks — light (navy bull) for the white header, dark
  // (white bull) for the navy footer — so there's never a white box behind it.
  // The header scales with the viewport but stays within the existing nav
  // height so the bar never grows.
  const src = isFooter
    ? '/images/logo/maono_forex_trading_logo_transparent_dark_site.png'
    : '/images/logo/maono_forex_trading_logo_transparent_light_site.png'

  const heightClass = isFooter
    ? 'h-[120px]'
    : compact
      ? 'h-[40px] md:h-[52px] lg:h-[56px]' // scrolled: condensed
      : 'h-[52px] md:h-[80px] lg:h-[96px]' // top: full size

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
