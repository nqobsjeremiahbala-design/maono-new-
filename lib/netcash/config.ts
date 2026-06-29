// Netcash Pay Now eCommerce — tier config + env-driven settings.
// Service/vendor keys live ONLY in server-side env (never sent to the browser
// except the non-secret form fields at submit time).
import { BUNDLE_BY_ID, type Bundle } from '@/lib/checkout'

// Netcash's hosted payment page (a real top-level form POSTs here).
export const NETCASH_PAY_NOW_URL = 'https://paynow.netcash.co.za/site/paynow.aspx'

// Netcash's default ISV software-vendor key (m2). Overridable via env.
export const NETCASH_VENDOR_KEY_DEFAULT = '24ade73c-98cf-47b3-99be-cc7b867b3080'

// The 4 purchasable tiers ARE the existing bundles; their price is the source of
// truth used to verify the Notify amount.
// 'bundle-test' is a hidden R5 admin-only tier for live PSP smoke tests (see lib/checkout.ts).
export const TIER_IDS = ['bundle-bronze', 'bundle-silver', 'bundle-gold', 'bundle-platinum', 'bundle-test'] as const
export type TierId = (typeof TIER_IDS)[number]

export function getTier(id: string): Bundle | null {
  return (TIER_IDS as readonly string[]).includes(id) ? (BUNDLE_BY_ID[id] ?? null) : null
}

export function netcashConfig() {
  return {
    serviceKey: process.env.NETCASH_SERVICE_KEY, // m1 — REQUIRED (set per environment)
    vendorKey: process.env.NETCASH_VENDOR_KEY || NETCASH_VENDOR_KEY_DEFAULT, // m2
    testMode: (process.env.NETCASH_TEST_MODE ?? 'true').toLowerCase() === 'true',
    // Base URL of THIS deployment — Netcash portal postback URLs must point here.
    baseUrl: (process.env.NEXT_PUBLIC_BASE_URL || 'https://maonoforextrading.co.za').replace(/\/$/, ''),
  }
}

export function isNetcashConfigured(): boolean {
  return Boolean(process.env.NETCASH_SERVICE_KEY)
}

// Human label for a Netcash Method code (for the admin Purchases view).
export const NETCASH_METHOD_LABELS: Record<string, string> = {
  '1': 'Credit card', '2': 'Bank EFT', '3': 'Retail', '4': 'Instant EFT (Ozow)',
  '5': 'MasterPass', '6': 'Visa Checkout', '7': 'Masterpass QR', '9': 'Payflex',
  '10': 'Flash/1Voucher', '11': 'PayMyWay',
}
