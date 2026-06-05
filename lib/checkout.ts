// Shared checkout catalog + course-unlock mapping, used by both the checkout UI
// (client) and the checkout server action that writes DB enrollments.

export type CheckoutItem = {
  label: string
  sub: string
  price: number
  period?: 'month' | 'once'
}

export const CATALOG: Record<string, CheckoutItem> = {
  'path-beginner': { label: 'Beginner Path', sub: 'Forex foundations + trading psychology + tools (3 courses)', price: 2499, period: 'once' },
  'path-intermediate': { label: 'Intermediate Path', sub: 'Price action + strategies + psychology (3 courses)', price: 3499, period: 'once' },
  'path-advanced': { label: 'Advanced Path', sub: 'Institutional concepts + strategies + price action (3 courses)', price: 4999, period: 'once' },

  'tier-bronze': { label: 'Bronze Membership', sub: 'Signals + community', price: 499, period: 'month' },
  'tier-silver': { label: 'Silver Membership', sub: 'Signals + beginner course', price: 899, period: 'month' },
  'tier-gold': { label: 'Gold Membership', sub: 'All courses + live sessions', price: 1499, period: 'month' },
  'tier-platinum': { label: 'Platinum Membership', sub: '1-on-1 + everything in Gold', price: 2499, period: 'month' },

  'course-forex-trading-introduction': { label: 'Forex Trading Introduction', sub: 'Beginner course', price: 999, period: 'once' },
  'course-institutional-trading-concepts': { label: 'Institutional Trading Concepts', sub: 'Advanced course', price: 1999, period: 'once' },
  'course-price-action-trading': { label: 'Price Action Trading', sub: 'Intermediate course', price: 1499, period: 'once' },
  'course-trading-psychology': { label: 'Trading Psychology', sub: 'All levels', price: 1299, period: 'once' },
  'course-trading-strategies': { label: 'Trading Strategies', sub: 'Intermediate course', price: 1499, period: 'once' },
  'course-trading-tools': { label: 'Trading Tools', sub: 'Beginner course', price: 999, period: 'once' },

  // Course bundles (linked from /memberships). Gold = the "Recommended" promo at R1999.
  'bundle-bronze': { label: 'Bronze Bundle', sub: 'Forex Intro, Price Action & Trading Tools — lifetime access', price: 899, period: 'once' },
  'bundle-silver': { label: 'Silver Bundle', sub: 'Adds risk & money management — lifetime access', price: 1299, period: 'once' },
  'bundle-gold': { label: 'Gold Bundle', sub: 'Full course library — lifetime access', price: 1999, period: 'once' },
  'bundle-platinum': { label: 'Platinum Bundle', sub: 'Full library + 1-on-1 mentorship', price: 6499, period: 'once' },
}

export const COURSES_WITH_PLAYER = new Set(['forex-trading-introduction', 'trading-psychology'])

// Every paid course slug on the site.
export const ALL_COURSES = [
  'forex-trading-introduction',
  'price-action-trading',
  'trading-tools',
  'trading-strategies',
  'trading-psychology',
  'institutional-trading-concepts',
]

// Which course(s) each purchasable item unlocks on the learner's dashboard.
export const ENROLL_SLUGS: Record<string, string[]> = {
  'bundle-bronze': ['forex-trading-introduction', 'price-action-trading', 'trading-tools'],
  'bundle-silver': ['forex-trading-introduction', 'price-action-trading', 'trading-tools', 'trading-strategies'],
  'bundle-gold': ALL_COURSES,
  'bundle-platinum': ALL_COURSES,
  'path-beginner': ['forex-trading-introduction', 'trading-psychology', 'trading-tools'],
  'path-intermediate': ['price-action-trading', 'trading-strategies', 'trading-psychology'],
  'path-advanced': ['institutional-trading-concepts', 'trading-strategies', 'price-action-trading'],
  'tier-bronze': ['forex-trading-introduction'],
  'tier-silver': ['forex-trading-introduction', 'price-action-trading'],
  'tier-gold': ALL_COURSES,
  'tier-platinum': ALL_COURSES,
}

export function enrollSlugsForItem(itemKey: string): string[] {
  if (itemKey.startsWith('course-')) return [itemKey.slice('course-'.length)]
  return ENROLL_SLUGS[itemKey] ?? []
}
