// Netcash Pay Now — outbound form fields + inbound postback shapes.

// Hidden form the browser POSTs (target="_top") to the Pay Now page.
export type NetcashFormFields = {
  m1: string // service key
  m2: string // software vendor key
  p2: string // our unique reference (<=25 chars, used once)
  p3: string // description (<=50 chars)
  p4: string // amount, ZAR, 2dp, no symbol/separator
  Budget: 'Y'
  m4?: string // Extra1 — our tier id
  m5?: string // Extra2 — our user id
  m6?: string // Extra3 — our purchase id
  m9?: string // customer email (Netcash receipt)
  m11?: string // customer mobile (digits only)
}

// Inbound Notify/Accept/Decline/Redirect bodies (x-www-form-urlencoded).
// Field names can vary in case across rails — read them case-insensitively.
export type NetcashPostback = {
  TransactionAccepted?: string // "true" | "false"
  CardHolderIpAddr?: string
  RequestTrace?: string
  Reference?: string // = our p2
  Extra1?: string
  Extra2?: string
  Extra3?: string
  Amount?: string
  Method?: string // numeric code
  Reason?: string // decline / pending reason
}

export type PostbackKind = 'notify' | 'accept' | 'decline' | 'redirect'
