/**
 * Netcash "Pay Now" — payment gateway integration layer
 *
 * Netcash is a South African payment provider. "Pay Now" is its hosted-page
 * product (the client is redirected to Netcash to pay, like Ozow):
 * - Instant EFT, card (Visa/Mastercard), and other SA methods
 *
 * Flow:
 * 1. Server creates a PENDING Purchase, then renders a form that POSTs to the
 *    Netcash Pay Now URL (buildPayNowForm) → client lands on the Netcash page.
 * 2. Client pays on Netcash.
 * 3. Netcash sends a server-to-server POST to our Notify URL
 *    (/api/webhooks/netcash) with the result.
 * 4. We match the reference + amount, mark the Purchase paid, and grant access.
 *
 * Docs: https://api.netcash.co.za/inbound-payments/pay-now/
 *
 * Worker secrets required:
 *   NETCASH_SERVICE_KEY  — the Pay Now "service key" (GUID) for this account
 *   NETCASH_VENDOR_KEY   — the Netcash software/vendor key (GUID)
 *
 * Return + Notify URLs are configured ONCE in the Netcash dashboard
 * (Netcash Connect → Account profile → Pay Now):
 *   Accept / Redirect → https://maonoforextrading.co.za/checkout?status=success
 *   Decline           → https://maonoforextrading.co.za/checkout?status=declined
 *   Notify            → https://maonoforextrading.co.za/api/webhooks/netcash
 */

// Netcash Pay Now hosted payment URL (same for test + live; test uses test keys).
const PAY_NOW_URL = 'https://paynow.netcash.co.za/site/paynow.aspx'

function getConfig() {
  const serviceKey = process.env.NETCASH_SERVICE_KEY
  const vendorKey = process.env.NETCASH_VENDOR_KEY
  if (!serviceKey || !vendorKey) {
    throw new Error('Netcash not configured: set NETCASH_SERVICE_KEY and NETCASH_VENDOR_KEY')
  }
  return { serviceKey, vendorKey }
}

export function isNetcashConfigured(): boolean {
  return Boolean(process.env.NETCASH_SERVICE_KEY && process.env.NETCASH_VENDOR_KEY)
}

export type PayNowRequest = {
  /** Internal reference for this transaction (Purchase.id) — returned as p2/Reference */
  reference: string
  /** Amount in ZAR rands (e.g. 1999 → "1999.00") */
  amount: number
  /** What the customer sees on the Netcash page */
  description: string
  /** Echoed back in the notification (Extra1) — used to cross-check the buyer */
  userId: string
  /** Echoed back in the notification (Extra2) — used to cross-check the item */
  itemKey: string
  /** Buyer email for the Netcash receipt (Extra3) */
  email?: string
}

/**
 * Build the Netcash Pay Now POST target + hidden form fields. The browser
 * submits these to PAY_NOW_URL to land the customer on the Netcash page.
 */
export function buildPayNowForm(req: PayNowRequest): {
  url: string
  fields: Record<string, string>
} {
  const { serviceKey, vendorKey } = getConfig()
  const fields: Record<string, string> = {
    m1: serviceKey, // Pay Now service key
    m2: vendorKey, // software/vendor key
    p2: req.reference, // unique reference (our Purchase.id)
    p3: req.description.slice(0, 50), // order description
    p4: req.amount.toFixed(2), // amount in rands
    // Extra fields are echoed back verbatim in the notification:
    m4: req.userId, // Extra1
    m5: req.itemKey, // Extra2
    m6: req.email || '', // Extra3
    Budget: 'N', // no budget/instalments for once-off course purchases
  }
  return { url: PAY_NOW_URL, fields }
}

// ─── Notification (server-to-server POST from Netcash) ───────

export type PayNowNotification = {
  TransactionAccepted?: string // "true" | "false"
  Amount?: string // rands
  Reference?: string // our p2 (Purchase.id)
  Extra1?: string // m4 — userId
  Extra2?: string // m5 — itemKey
  Extra3?: string // m6 — email
  RequestTrace?: string // Netcash unique trace for reconciliation
  Reason?: string // decline reason
  Method?: string // payment method used
  [key: string]: string | undefined
}

export function parseNotification(form: Record<string, string>): PayNowNotification {
  // Netcash field names vary in casing across products; normalise the ones we use.
  const pick = (...names: string[]) => {
    for (const n of names) {
      const hit = Object.keys(form).find((k) => k.toLowerCase() === n.toLowerCase())
      if (hit && form[hit] != null) return form[hit]
    }
    return undefined
  }
  return {
    TransactionAccepted: pick('TransactionAccepted'),
    Amount: pick('Amount', 'p4'),
    Reference: pick('Reference', 'p2'),
    Extra1: pick('Extra1', 'm4'),
    Extra2: pick('Extra2', 'm5'),
    Extra3: pick('Extra3', 'm6'),
    RequestTrace: pick('RequestTrace', 'RequestId'),
    Reason: pick('Reason', 'TransactionReason'),
    Method: pick('Method', 'PaymentMethod'),
  }
}

export function isAccepted(n: PayNowNotification): boolean {
  return String(n.TransactionAccepted).toLowerCase() === 'true'
}
