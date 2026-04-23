import Image from 'next/image'
import Link from 'next/link'

export function Logo({
  variant = 'default',
  size = 40,
}: {
  variant?: 'default' | 'footer'
  size?: number
}) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Maono Forex Trading">
      <Image
        src="/images/logo/logov2.svg"
        alt="Maono Forex Trading"
        width={size * 3}
        height={size}
        priority={variant === 'default'}
        className="h-[88px] w-auto object-contain"
      />
    </Link>
  )
}
