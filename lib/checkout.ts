// Single source of truth for what's purchasable on the site.
//
// The ONLY purchasable unit is a bundle. Each bundle is a cumulative tier that
// unlocks a set of real courses (no individual course sales, no paths, no
// monthly tiers). Home preview, the plans page, checkout, and enrollment all
// read from BUNDLES, so what a customer is shown always matches what they get.

export type Bundle = {
  id: string // e.g. 'bundle-gold' — also the checkout itemKey
  name: string // 'Gold'
  tagline: string // 'Complete'
  price: number // once-off, ZAR
  recommended?: boolean
  courseSlugs: string[] // real courses unlocked on purchase
  perks?: string[] // extra non-course perks (e.g. Platinum mentorship)
}

// Every real course slug, in learning order. Gold/Platinum unlock all of them.
export const ALL_COURSES = [
  'forex-trading-introduction',
  'trading-tools',
  'trading-psychology',
  'price-action-trading',
  'trading-strategies',
  'institutional-trading-concepts',
] as const

// Display titles for the course slugs (used on bundle cards + checkout).
export const COURSE_TITLES: Record<string, string> = {
  'forex-trading-introduction': 'Forex Trading Introduction',
  'trading-tools': 'Trading Tools',
  'trading-psychology': 'Trading Psychology',
  'price-action-trading': 'Price Action Trading',
  'trading-strategies': 'Trading Strategies',
  'institutional-trading-concepts': 'Institutional Trading Concepts',
}

// Cumulative bundle ladder. Each tier is a strict superset of the previous one.
export const BUNDLES: Bundle[] = [
  {
    id: 'bundle-bronze',
    name: 'Bronze',
    tagline: 'Foundations',
    price: 899,
    courseSlugs: ['forex-trading-introduction', 'trading-tools', 'trading-psychology'],
  },
  {
    id: 'bundle-silver',
    name: 'Silver',
    tagline: 'Trader',
    price: 1499,
    courseSlugs: [
      'forex-trading-introduction',
      'trading-tools',
      'trading-psychology',
      'price-action-trading',
      'trading-strategies',
    ],
  },
  {
    id: 'bundle-gold',
    name: 'Gold',
    tagline: 'Complete',
    price: 1999,
    recommended: true,
    courseSlugs: [...ALL_COURSES],
  },
  {
    id: 'bundle-platinum',
    name: 'Platinum',
    tagline: 'Mentorship',
    price: 6499,
    courseSlugs: [...ALL_COURSES],
    perks: [
      'Monthly 1-on-1 mentorship session',
      'Priority Telegram support',
      'Personalised trade-plan review',
    ],
  },
]

export const BUNDLE_BY_ID: Record<string, Bundle> = Object.fromEntries(
  BUNDLES.map((b) => [b.id, b]),
)

// All six courses ship with a video player.
export const COURSES_WITH_PLAYER = new Set<string>(ALL_COURSES)

// The courses a purchasable item unlocks. Bundles only.
export function enrollSlugsForItem(itemKey: string): string[] {
  return BUNDLE_BY_ID[itemKey]?.courseSlugs ?? []
}

// Which bundles include a given course — used on course pages to show
// "Included in: Silver, Gold, Platinum" instead of an individual price.
export function bundlesForCourse(slug: string): Bundle[] {
  return BUNDLES.filter((b) => b.courseSlugs.includes(slug))
}

// Back-compat summary shape for the checkout order summary (bundles only).
export type CheckoutItem = { label: string; sub: string; price: number; period: 'once' }

export const CATALOG: Record<string, CheckoutItem> = Object.fromEntries(
  BUNDLES.map((b) => [
    b.id,
    {
      label: `${b.name} — ${b.tagline}`,
      sub: `${b.courseSlugs.length} courses · lifetime access`,
      price: b.price,
      period: 'once' as const,
    },
  ]),
)
