# Security Hardening Audit — maonoforextrading.co.za

Date: 2026-06-30 · App: Next.js 16 (App Router, TS) on **Cloudflare Workers** (OpenNext), **Prisma + Supabase Postgres via Hyperdrive**, **NextAuth v5** (Credentials/JWT, bcrypt), Netcash Pay Now (form‑POST), Resend (email), **Bunny Stream + R2** (video).

## Stack corrections to the audit brief (materially change several phases)

| Brief assumes | Reality | Effect |
|---|---|---|
| Supabase **Auth** | **NextAuth v5** (Credentials/JWT, bcrypt) | Phase 3 auth → NextAuth + Supabase dashboard |
| Client‑side **Supabase JS** + **anon key** + **RLS** as the access boundary | **No** Supabase JS client, **no** anon key; DB reached **only server‑side via Prisma** over a Hyperdrive binding | **Phase 3 (RLS / anon‑key exposure) is largely N/A** — there is no client‑side DB access to exploit. Access control is the application layer (NextAuth session + server checks). RLS remains recommended defence‑in‑depth but is not load‑bearing here. |
| **Cloudflare Stream** | **Bunny Stream + R2** | Phase 5 Stream items → Bunny/R2 equivalents (both verified) |
| Cloudflare **Pages** | Cloudflare **Workers** (OpenNext) | Env/headers via `wrangler.jsonc` + Worker secrets |

Severity legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low · ⚪ Info

---

## Phase 1 — Secret & Key Audit — ✅ PASS
- No hardcoded secrets / connection strings in source (only `process.env.*`).
- No secret is `NEXT_PUBLIC_` (13 vars: URLs, GA id, socials, `ENROLLMENT_OPEN`).
- No client‑bundle leak: `NETCASH_SERVICE_KEY` only in `lib/netcash/config.ts` (server). `createClient` hits were a Prisma factory + a same‑named server action.
- Git history clean: only `.env.example` (empty placeholders) ever committed; all real `.env*`/`.dev.vars*` gitignored.
- `24ade73c‑…` = Netcash **public** ISV vendor key (`m2`), by design in the browser form — ⚪ not a secret.

**Actions:** F1.1 🟡 rotate the *staging* DB password + *staging* Netcash key that were shared in chat during setup (staging‑only, not in repo) — **manual**. F1.2 🔵 gitignored the untracked `scripts/db-check.mjs` — **✅ fixed**.

## Phase 2 — Netcash webhook hardening — ⏸ DEFERRED (your decision)
Already in place: reference lookup, **amount verification** vs stored tier price, **idempotency** (`updateMany where status=PENDING`), one‑way state transitions, content parsing.
**Open decision (🔴):** the Accept handler currently **grants access** (a reliability fix for lost Notify). Accept is browser‑facing and forgeable, so an attacker who starts a real checkout can POST a forged Accept and self‑grant without paying. Options: **(A)** fulfil only on Notify + **Netcash IP allowlist** (needs their egress IPs); **(C)** hybrid (Accept = claim only, Notify grants, manual reconcile). Also pending: IP allowlist, content‑type enforcement, `/api/payments/netcash/*` rate‑limit (WAF). **Parked at your request.**

## Phase 3 — Supabase — mostly N/A (see stack correction)
- No anon key / no client‑side Supabase → **no RLS bypass surface**. ✅
- DB credential is the Hyperdrive binding (server‑only). ✅
- **Recommended defence‑in‑depth (manual, optional):** enable RLS on all `public` tables in Supabase anyway, so a future accidental anon‑key use can't leak data. Documented in the manual checklist.
- Admin `is_admin`/`role` self‑escalation: **not possible** — `role` lives in `users` and is only written server‑side via Prisma (no client DB writes). ✅

## Phase 4 — Next.js / Cloudflare — ✅ mostly PASS
- **CVE‑2025‑29927** (middleware bypass): Next **16.2.7** — not affected (fix landed in 15.2.4). ✅ Still add the WAF header block (defence‑in‑depth) — **manual**.
- **Admin route protection**: `app/admin/layout.tsx` enforces `getServerSession` + `isAdmin` server‑side → redirect; every admin server action re‑checks `isAdmin`. ✅ (not client‑only)
- **Server Actions**: `startNetcashCheckout` checks session + `canEnroll`; admin actions check `isAdmin`. ✅ Removed the dead `completeCheckout` demo free‑grant action (🟠, **✅ fixed** — see below).
- **Security headers**: HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, CSP, `Permissions-Policy` already set in `next.config.ts`. Added `payment=()` to Permissions‑Policy; set **`poweredByHeader: false`**. ✅
  - 🟡 CSP uses `script-src 'unsafe-inline'` (needed for the GA snippet + a few inline styles). Nonce‑based CSP is a larger, breakage‑prone change on a live site — **documented as a follow‑up**, not done blind.
- **CORS**: no permissive CORS on API routes; Netcash handlers are server‑POST, no CORS headers. ✅

## Phase 5 — Course content / paywall — ✅ PASS
- **Bunny signed token route** (`/api/video-token/...`): requires auth **and** verifies enrollment for that exact course (admin bypass); mints a 1‑hour signed embed token server‑side; `no-store`. ✅
- **R2 fallback route** (`/api/video/...`): same auth + per‑course enrollment gate; short‑lived presigned URL; videoUrl never leaves server. ✅
- **Tier boundaries**: enforced by the per‑course enrollment check — a Bronze user has no enrollment row for a Gold course → 403. ✅
- **Manual (config):** verify Bunny videos require token auth (DRM) and R2 objects are **not public** — checklist below.

## Phase 6 — Input validation & injection — ✅ PASS
- No raw SQL / `queryRawUnsafe` / string‑built SQL — Prisma parameterised methods throughout (incl. admin Users search via `contains`/insensitive). ✅ (`' OR '1'='1` is treated as a literal search string.)
- `dangerouslySetInnerHTML`: single use in `components/shared/JsonLd.tsx`, which **escapes `</script>`** — the correct anti‑XSS pattern. ✅
- Netcash postback field validation: covered under Phase 2 (deferred) — recommend strict regex on `Reference`, numeric `Amount`, allowlisted `Method`, exact `TransactionAccepted`.

## Phase 7 — Dependency & build — ✅ PASS (highs fixed)
- `npm audit`: **9 → 3** after `npm audit fix`. **All 5 HIGH fixed** (`undici`, `ws`, `form-data`, `js-yaml` — transitive build‑time deps, not in the Worker runtime).
- Remaining 3 = **Accepted Risk (documented):** `esbuild` (dev‑server‑only file read, Windows — not prod), `postcss` (build‑time CSS‑stringify XSS; we process no untrusted CSS; upstream "fix" downgrades Next to v9 — breaking, refused), 1 low. None production‑exposed.
- `next` pinned `^16.2.7` (patched for CVE‑2025‑29927). ✅
- `.env.local` / `node_modules` gitignored. ✅
- Logging: no full request‑body/PII dumps in prod route handlers (only `console.error('...Error:', error)` and reference/status logs). The removed Ozow webhook is gone. ✅

## Attack‑surface reductions applied 🟠 → ✅
- **Removed the entire orphaned Ozow payment path** — `app/api/webhooks/ozow/route.ts` (a **live, deployed** payment webhook that granted course access), `app/api/checkout/route.ts` (old Ozow checkout), `lib/payments/ozow.ts`. Unused since the Netcash migration; a dead payment webhook is a needless attack surface.
- **Removed `completeCheckout`** — a demo "grant courses without payment" server action gated only by `canEnroll` (now `true` for everyone). It was not wired to any client (so not currently callable), but removed to eliminate the free‑grant path entirely.

---

## Manual actions checklist (dashboard / portal — code cannot automate)

### Netcash portal (production Pay Now service key)
- [ ] Test mode **off** (already done during go‑live).
- [ ] Accept/Decline/Notify/Redirect URLs → `https://maonoforextrading.co.za/...` (done).
- [ ] Ask your Netcash advisor to raise the transaction limit above **R6,499**.
- [ ] Enable only the intended rails (Card, Instant EFT/Ozow, Capitec).
- [ ] **F1.1:** rotate the *staging* service key that was shared in chat.

### Cloudflare dashboard (zone: maonoforextrading.co.za)
- [ ] **WAF custom rule** — block CVE‑2025‑29927 probe: Security → WAF → Custom rules → Create → Expression `(any(http.request.headers["x-middleware-subrequest"][*] ne ""))` (or "header exists") → Action **Block**. (Defence‑in‑depth; Next 16 isn't vulnerable.)
- [ ] **Rate limiting** on payment callbacks (do this when Phase 2 is decided): Security → WAF → Rate limiting rules → path `contains /api/payments/netcash/` → 60 req / 1 min / IP → Block. *(Note: this must NOT block Netcash's own Notify — scope it or exclude Netcash IPs once you have them.)*
- [ ] SSL/TLS → **Always Use HTTPS** on; **Minimum TLS 1.2** (1.3 preferred).
- [ ] Keep the existing **"Allow Netcash callbacks"** WAF skip rule (needed for Notify).
- [ ] **Supabase DB:** rotate the *staging* password (F1.1).

### Bunny / R2 (video)
- [ ] Bunny Stream library: **token authentication (signed URLs) required** on all videos — confirm no video plays without a token.
- [ ] R2 bucket `maono-media`: **not** public; served only via the Worker's authorized presigned URLs.

### Supabase (optional defence‑in‑depth)
- [ ] Enable RLS on all `public` tables (belt‑and‑suspenders — the app doesn't use the anon key, but this contains a future accidental exposure).
- [ ] Confirm no OAuth providers enabled that you don't use; auth redirect allowlist = prod + staging only.

---

## Verdict
No secret exposure; auth, admin, and video‑paywall boundaries are enforced **server‑side**; injection surface clean; dependency highs patched; two dead payment paths removed. **The one open, must‑decide item is Phase 2** (Netcash Accept‑grant vs IP‑gated Notify) — nothing else blocks production.
