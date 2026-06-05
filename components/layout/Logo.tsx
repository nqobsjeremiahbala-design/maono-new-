import Image from 'next/image'
import Link from 'next/link'

export function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  // Footer logo can be a fixed size; the header logo scales with the viewport
  // so the brand reads on desktop without breaking the mobile nav height.
  const heightClass =
    variant === 'footer'
      ? 'h-[128px]'
      : 'h-[64px] md:h-[92px] lg:h-[108px]'

  return (
    <Link href="/" className="inline-flex items-center" aria-label="Maono Forex Trading">
      <Image
        src="/images/logo/logov2.svg"
        alt="Maono Forex Trading"
        width={420}
        height={140}
        priority={variant === 'default'}
        className={`${heightClass} w-auto object-contain`}
      />
    </Link>
  )
}
