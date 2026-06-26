# Netcash Pay Now — setup, staging & UAT

## How it works (recap)
1. Our server creates a PENDING `purchase` with a unique `p2` reference and returns hidden form fields.
2. The browser does a **real top‑level POST** (`target="_top"`) to `https://paynow.netcash.co.za/site/paynow.aspx` — **not** fetch/XHR, **not** in an iframe.
3. Netcash hosts the payment, then posts results back to our endpoints. **`notify` is the only source of truth for fulfillment** (it's called for every transaction, including delayed EFT/Retail, and is retried). Accept/Decline/Redirect are UI‑only.
4. The notify handler verifies the amount against our stored tier price, is idempotent, grants access, sets the plan tier, and emails the buyer. Every postback is logged raw in **Admin → Netcash Log**.

## Environment config

| Var | Staging | Production |
|---|---|---|
| `NETCASH_SERVICE_KEY` | staging Pay Now key | live Pay Now key |
| `NETCASH_VENDOR_KEY` | *(blank → ISV default)* | *(blank → ISV default)* |
| `NETCASH_TEST_MODE` | `true` | `false` |
| `NEXT_PUBLIC_BASE_URL` | staging URL | `https://maonoforextrading.co.za` |
| `NEXT_PUBLIC_ENROLLMENT_OPEN` | `true` (for UAT) | `false` until go‑live, then `true` |
| `DATABASE_URL` / `DIRECT_URL` | **separate staging Supabase DB** | live Supabase DB |

> Service/vendor keys are server‑side secrets only — never sent to the browser.

## Netcash portal — postback URLs (per service key)
In the Netcash merchant portal, set the staging service key's URLs to the **staging** host, and the live key's to production:
```
Notify   →  {BASE_URL}/api/payments/netcash/notify
Accept   →  {BASE_URL}/api/payments/netcash/accept
Decline  →  {BASE_URL}/api/payments/netcash/decline
Redirect →  {BASE_URL}/api/payments/netcash/redirect
```

## Staging setup (one‑time, before UAT)
1. Create a **separate staging Supabase project** (Option 1, approved) and run `npx prisma migrate deploy` against its `DIRECT_URL`.
2. Deploy a **staging Worker** (separate from production) with the staging env vars above + a staging URL.
3. In the Netcash portal, point the **staging service key's** postback URLs at the staging host.
4. Open `/memberships` → pick a tier → `/checkout` → complete a test payment.

## UAT test matrix
Run each tier (Bronze R899 / Silver R1499 / Gold R1999 / Platinum R6499) across the enabled rails. After each, confirm in **Admin → Purchases** (status `COMPLETE`, gateway `netcash`, correct plan) and **Admin → Netcash Log** (the raw `notify`), and that the buyer got the right email.

| Rail | Success test | Decline test |
|---|---|---|
| **Card (Visa)** | card `4000000000000002`, any future expiry, CVC `123` | card `4000000000000036` |
| **Instant EFT (Ozow)** | simulated on Netcash's hosted page (choose "successful") — no card needed | choose "failed/cancel" on the page |
| **Capitec Pay** | simulated on Netcash's hosted page | simulated decline |

Per tier × rail, verify:
- ✅ Success → purchase `COMPLETE`, courses granted, plan tier set, **success email** (with courses + Telegram link).
- ✅ Decline → purchase `CANCELLED`, no access, **failed email**.
- ✅ Amounts: the `p4` sent and the `Amount` in notify both equal the tier price (mismatch must NOT grant — check the log).

## ⚠️ Cannot be tested in test mode (Netcash limitation)
- **Bank EFT** and **Retail** payments, and subscriptions, **cannot be tested in test mode** — only live. Plan a small real‑money live test for the EFT/Retail (pending → `redirect` "pending" email → later `notify` success) flow after card/Ozow UAT passes.

## Idempotency / safety checks to confirm during UAT
- Re‑sending the same `notify` (Netcash retries) does **not** double‑grant (handler returns 200 and no‑ops on already‑COMPLETE).
- An unknown `Reference` returns 200 (no retry loop).
- Accept/Decline alone never grant access (kill power after Accept but before Notify in a card test → access only appears once Notify lands).
