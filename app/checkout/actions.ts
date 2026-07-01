'use server'

import { auth } from '@/lib/auth'
import { canEnroll } from '@/lib/flags'
import { isNetcashConfigured } from '@/lib/netcash/config'
import { buildPaymentForm } from '@/lib/netcash/buildPaymentForm'

// Start a real Netcash "Pay Now" payment: create a PENDING purchase (with a
// unique p2) and return the hosted-page form fields for the browser to POST
// (target="_top"). Access is granted later by /api/payments/netcash/notify.
export async function startNetcashCheckout(
  tierId: string,
  contact: { country?: string; email?: string; name?: string; phone?: string } = {},
): Promise<{ ok: boolean; url?: string; fields?: Record<string, string>; error?: string }> {
  const session = await auth()
  if (!session?.user) return { ok: false, error: 'Not authenticated' }

  const role = (session.user as { role?: string }).role
  if (!canEnroll(role)) {
    return { ok: false, error: 'Enrolment is currently closed to new students.' }
  }
  if (!isNetcashConfigured()) {
    return { ok: false, error: 'Online payment is not configured yet. Please contact support.' }
  }

  const userId = (session.user as { id: string }).id
  const res = await buildPaymentForm({
    tierId,
    userId,
    email: contact.email ?? session.user.email,
    name: contact.name ?? session.user.name,
    phone: contact.phone,
    country: contact.country,
  })
  if (!res.ok) return { ok: false, error: res.error }
  return { ok: true, url: res.url, fields: res.fields }
}
