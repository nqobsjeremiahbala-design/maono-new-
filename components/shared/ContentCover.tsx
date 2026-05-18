import Image from 'next/image'

const PALETTES = [
  { from: 'from-navy-900', via: 'via-navy-800', to: 'to-navy-950', accent: 'text-gold-400' },
  { from: 'from-navy-950', via: 'via-navy-900', to: 'to-navy-800', accent: 'text-gold-400' },
  { from: 'from-gold-500/20', via: 'via-navy-900', to: 'to-navy-950', accent: 'text-gold-400' },
  { from: 'from-navy-900', via: 'via-navy-950', to: 'to-gold-500/20', accent: 'text-gold-400' },
  { from: 'from-navy-800', via: 'via-navy-900', to: 'to-gold-500/15', accent: 'text-gold-400' },
]

function pickPalette(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return PALETTES[hash % PALETTES.length]
}

type Props = {
  slug: string
  title: string
  type?: string
  image?: string
  className?: string
  priority?: boolean
  sizes?: string
  footer?: string
}

// Known stop-gap paths we treat as "no real image" so we fall back to the gradient cover.
// Adjust this list (or remove the prefix entries) once real cover art lands in /public.
const MISSING_PATHS = [
  '/images/resources/',
  '/images/blog/default.jpg',
  '/images/blog/welcome.jpg',
]

function hasUsableImage(image?: string) {
  if (!image) return false
  if (MISSING_PATHS.some((p) => image === p || image.startsWith(p))) return false
  return true
}

export function ContentCover({ slug, title, type, image, className, priority, sizes, footer }: Props) {
  if (hasUsableImage(image)) {
    return (
      <Image
        src={image!}
        alt={title}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    )
  }

  const palette = pickPalette(slug)

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${palette.from} ${palette.via} ${palette.to} flex flex-col justify-end p-6 sm:p-8`}
      role="img"
      aria-label={title}
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full bg-gold-400/10 blur-2xl" />
      {type && (
        <p className={`relative text-[11px] font-semibold tracking-[0.2em] uppercase mb-2 ${palette.accent}`}>
          {type}
        </p>
      )}
      <p className="relative font-serif text-white text-xl sm:text-2xl leading-tight line-clamp-3">
        {title}
      </p>
      <p className="relative text-[10px] tracking-[0.2em] uppercase text-navy-300 mt-3">
        {footer ?? 'Maono · Forex Trading'}
      </p>
    </div>
  )
}
