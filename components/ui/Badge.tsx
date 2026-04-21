type BadgeVariant = 'default' | 'gold' | 'navy'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-cream-100 text-navy-700',
  gold: 'bg-gold-300 text-navy-900',
  navy: 'bg-navy-800 text-cream-50',
}

export function Badge({
  variant = 'default',
  className = '',
  children,
}: {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
