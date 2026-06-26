// Build the Netcash Pay Now form: create a PENDING purchase with a unique p2
// reference, then return the exact (non-secret-to-store) field set to render.
import { prisma } from '@/lib/db'
import { getTier, netcashConfig, NETCASH_PAY_NOW_URL } from './config'
import type { NetcashFormFields } from './types'

// p2: <=25 chars, alphanumeric, must be used exactly once.
function genReference(): string {
  const t = Date.now().toString(36)
  const r = Math.random().toString(36).slice(2, 9)
  return `gap${t}${r}`.replace(/[^a-z0-9]/gi, '').slice(0, 25)
}

export type BuildResult =
  | { ok: true; url: string; fields: NetcashFormFields; purchaseId: string }
  | { ok: false; error: string }

export async function buildPaymentForm(opts: {
  tierId: string
  userId: string
  email?: string | null
  name?: string | null
  phone?: string | null
  country?: string | null
}): Promise<BuildResult> {
  const tier = getTier(opts.tierId)
  if (!tier) return { ok: false, error: 'Unknown tier.' }

  const { serviceKey, vendorKey } = netcashConfig()
  if (!serviceKey) return { ok: false, error: 'Online payment is not configured yet.' }

  // Create the PENDING purchase + store the p2 (retry on the rare unique clash).
  let purchase: { id: string; netcashRef: string | null; amountCents: number } | undefined
  for (let i = 0; i < 5; i++) {
    try {
      purchase = await prisma.purchase.create({
        data: {
          userId: opts.userId,
          itemKey: tier.id,
          amountCents: Math.round(tier.price * 100), // our stored truth for amount verification
          status: 'PENDING',
          gateway: 'netcash',
          paymentMethod: 'netcash',
          country: opts.country ?? null,
          netcashRef: genReference(),
        },
        select: { id: true, netcashRef: true, amountCents: true },
      })
      break
    } catch {
      if (i === 4) return { ok: false, error: 'Could not start checkout.' }
    }
  }
  if (!purchase?.netcashRef) return { ok: false, error: 'Could not start checkout.' }

  const who = (opts.name || opts.email || 'order').slice(0, 24)
  const fields: NetcashFormFields = {
    m1: serviceKey,
    m2: vendorKey,
    p2: purchase.netcashRef,
    p3: `${tier.name} bundle (${who} ${purchase.id.slice(-6)})`.slice(0, 50),
    p4: (purchase.amountCents / 100).toFixed(2),
    Budget: 'Y',
    m4: tier.id, // Extra1 — tier id
    m5: opts.userId, // Extra2 — user id
    m6: purchase.id, // Extra3 — purchase id
  }
  if (opts.email) fields.m9 = opts.email
  if (opts.phone) {
    const digits = opts.phone.replace(/\D/g, '')
    if (digits) fields.m11 = digits
  }

  return { ok: true, url: NETCASH_PAY_NOW_URL, fields, purchaseId: purchase.id }
}
