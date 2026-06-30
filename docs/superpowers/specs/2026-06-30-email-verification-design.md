# Email verification + forgot-password — design

**Date:** 2026-06-30
**Status:** Approved (design)

## Goal

Require **new** users to confirm their email address before they can log in, and
ensure the existing self-service **forgot/reset-password** flow is working and
visible. The site is live with 500+ migrated WordPress users (all with
`emailVerified = null`) who must **never** be locked out.

## Decisions (confirmed)

- **What verification gates:** **login**. A new user cannot sign in until they
  click the verification link. (Not checkout-gating, not banner-only.)
- **Existing users:** **grandfathered** via a one-time backfill so they are never
  asked to verify and cannot be locked out.
- **Mechanism:** custom token link emailed via Resend, stored in the existing
  `verification_tokens` table (NextAuth standard). No new dependencies.

## Stack context

Next.js (App Router) on Cloudflare Workers (OpenNext), NextAuth v5 (Credentials,
JWT, `trustHost`), Prisma + Supabase (via Hyperdrive), Resend for email. Deploys
are Linux-only via GitHub Actions (`cf-deploy.yml`) → preview version → promote.
Use Web-standard APIs only (Web Crypto), no `node:` modules.

## Data model

Reuse existing tables — **no schema change**.

- `users.emailVerified DateTime?` — already present. `null` = unverified.
- `verification_tokens (identifier, token UNIQUE, expires)` — already present.

**Token namespacing (collision fix):**
- Password reset tokens use `identifier = "<email>"` (existing behaviour).
- Email verification tokens use `identifier = "verify:<email>"`.

This keeps the two flows independent — the reset flow's
`deleteMany({ where: { identifier: email } })` only clears reset tokens, never a
pending verification token, and vice-versa.

## Flow

### 1. Registration (`POST /api/auth/register`)
1. Validate + create the user with `emailVerified = null` (unchanged).
2. Generate a random token (`crypto.randomUUID()` x2, dashes stripped), expiry
   **24h**, stored as `identifier = "verify:<email>"`.
3. Email a **"Confirm your email"** message (new `sendVerificationEmail`) with link:
   `{NEXT_PUBLIC_APP_URL}/verify-email?token=…&email=…`.
4. The existing immediate "welcome" email is **deferred** — a welcome line is
   folded into the post-verification confirmation (no duplicate emails on signup).
5. Register UI: on success, show a **"Check your email to confirm your account"**
   state instead of redirecting/auto-logging-in.

### 2. Verify (`/verify-email` page → `POST /api/auth/verify-email`)
1. Read `token` + `email` from the query.
2. Validate: token exists, `identifier === "verify:<email>"`, not expired.
3. On success: `users.emailVerified = now()`, delete the verify token(s) for that
   identifier. Show **"Email confirmed — you can log in now"** + link to `/login`.
4. On invalid/expired: friendly error + a **Resend verification email** button.

### 3. Login gate (`authorize()` in `lib/auth.ts`)
After the password is confirmed valid, if `user.emailVerified === null`:
- Do **not** return the user. Surface a specific `EMAIL_NOT_VERIFIED` signal
  (throw a typed error / coded `CredentialsSignin`) so the login form can
  distinguish it from a bad password.
- The "record lastLoginAt" write only happens on a fully successful sign-in.

Login UI: when it sees `EMAIL_NOT_VERIFIED`, show **"Please confirm your email
first"** + a **Resend verification email** action. (Plain bad credentials keep the
existing generic message.)

### 4. Resend verification (`POST /api/auth/resend-verification`)
- Input: `email`. If a user exists **and** is unverified, regenerate the token and
  resend the email. Always return `{ ok: true }` (no email enumeration).
- Light abuse guard: deleting+recreating the token per request is naturally
  single-outstanding; optionally ignore if a token was issued < 60s ago.

### 5. Grandfather backfill (one-time, ops step)
Run **before** the login-gate build is promoted to production:
```sql
UPDATE users SET "emailVerified" = now() WHERE "emailVerified" IS NULL;
```
Run against the prod DB (via `.env.local.PROD-BACKUP` connection), verify the
count of `emailVerified IS NULL` is 0, **then** promote. Order matters: backfill
first, gate second, so no existing user is ever blocked.

### 6. Forgot / reset password (already built — verify + surface)
- `/forgot-password` → `POST /api/auth/forgot-password` issues a **1h** reset
  token (`identifier = "<email>"`) and emails a `/reset-password?token=…&email=…`
  link; `POST /api/auth/reset-password` validates + sets the new `passwordHash`,
  clears `legacyPasswordHash`, deletes tokens. Confirmed functional.
- Action items: (a) confirm a real reset email arrives end-to-end; (b) ensure the
  **"Forgot password?"** link is prominent on `/login`.

## Edge cases

- Existing user (grandfathered) resets password → still verified → logs in fine.
- New unverified user uses forgot-password → reset succeeds but `emailVerified`
  stays null → still cannot log in (must verify). Reset never sets verification.
- Re-registering an existing email → generic 201 success, no new account, no token.
- Expired/invalid token (verify or reset) → friendly error + resend path.
- Admin "Reset password" (admin Users page) unchanged; admins are grandfathered.

## Files affected

- `prisma/schema.prisma` — none (reuse existing fields/table).
- `lib/email.ts` — add `sendVerificationEmail(to, verifyUrl)`.
- `lib/auth/verification.ts` (new) — token create/validate helpers (namespaced).
- `app/api/auth/register/route.ts` — create unverified + send verification email.
- `app/api/auth/verify-email/route.ts` (new) — validate token, set verified.
- `app/api/auth/resend-verification/route.ts` (new) — resend.
- `app/verify-email/page.tsx` (+ client) (new) — verify result + resend UI.
- `lib/auth.ts` — login gate on `emailVerified`.
- `app/login/LoginForm.tsx` — handle `EMAIL_NOT_VERIFIED` + resend; surface
  "Forgot password?".
- `app/register/*` — "check your email" success state.
- Ops: prod SQL backfill (one-time).

## Testing / verification

- Build on a **preview version** (never the live domain) and verify:
  - New signup → user is `emailVerified = null`, gets the verification email,
    cannot log in yet.
  - Click verify link → `emailVerified` set → can log in.
  - Resend works; expired/invalid token shows the friendly path.
  - A **grandfathered** existing account still logs in normally.
  - Forgot-password end-to-end still works (token namespacing intact).
- Backfill applied + verified (0 null) on prod before promote.
- Use throwaway accounts; clean up after.

## Out of scope

- Changing the password-reset mechanism (already works).
- Checkout-gating or banner-only verification (explicitly rejected).
- SMS/phone verification.
