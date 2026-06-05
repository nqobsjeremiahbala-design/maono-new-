import Image from 'next/image'
import Link from 'next/link'

export function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const isFooter = variant === 'footer'

  // The brand mark is roughly square (442x382). In the header it scales with the
  // viewport but stays within the existing nav height so the bar never grows.
  // The wordmark stays legible because the source whitespace is trimmed tight.
  const heightClass = isFooter
    ? 'h-[112px]'
    : 'h-[52px] md:h-[80px] lg:h-[96px]'

  const img = (
    <Image
      src="/images/logo/maono-forex-trading-logo.png"
      alt="Maono Forex Trading"
      width={442}
      height={382}
      priority={!isFooter}
      className={`${heightClass} w-auto object-contain`}
    />
  )

  return (
    <Link href="/" className="inline-flex items-center" aria-label="Maono Forex Trading">
      {isFooter ? (
        // The logo art is navy; on the dark footer it sits in a clean white badge
        // so every part of the mark stays visible.
        <span className="inline-flex rounded-xl bg-white p-3 shadow-sm">{img}</span>
      ) : (
        img
      )}
    </Link>
  )
}
