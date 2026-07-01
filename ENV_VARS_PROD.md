# Production Environment Variables — maonoforextrading.co.za

Runtime host: **Cloudflare Worker `maono-new`** (OpenNext). Two places matter:
- **Worker Secrets** (encrypted; `wrangler secret put NAME` or dashboard → Workers → maono-new → Settings → Variables & Secrets → *Secret*). Never in git, never in the client bundle.
- **Worker Vars** (plain; in `wrangler.jsonc` `"vars"` or dashboard as *Text*). Non‑secret runtime config.
- The **database** connection is a **Hyperdrive binding** (`HYPERDRIVE`, id `cf503cb8…`), not an env var.

> ⚠️ OpenNext gotcha: `NEXT_PUBLIC_*` is inlined into the **client** bundle at build, but **server** code reads it at **runtime**. Anything read server‑side must be a Worker **var**, not only a build value. (This bit us on `ENROLLMENT_OPEN`, now hardcoded in `lib/flags.ts`.)

## SECRETS (encrypted Worker secrets — required)

| Name | Purpose |
|---|---|
| `NETCASH_SERVICE_KEY` | Live Netcash Pay Now service key (`m1`). **Server‑only.** |
| `AUTH_SECRET` | NextAuth v5 JWT signing/encryption secret (read implicitly by NextAuth). Generate: `npx auth secret`. |
| `RESEND_API_KEY` | Resend transactional email API key. |
| `BUNNY_STREAM_TOKEN_KEY` | Bunny Stream signing key for embed tokens. **Server‑only.** |
| `R2_ACCESS_KEY_ID` | R2 S3 access key (video presigning). |
| `R2_SECRET_ACCESS_KEY` | R2 S3 secret key. **Server‑only.** |
| `DATABASE_URL` | Only needed for Prisma **migrations/seeds** and local dev; prod runtime uses the Hyperdrive binding. Keep out of the Worker if only migrating from CI. |

## VARS (non‑secret runtime config)

| Name | Value (prod) | Notes |
|---|---|---|
| `NETCASH_TEST_MODE` | `false` | Live mode. |
| `NETCASH_VENDOR_KEY` | *(unset)* | Optional; defaults to Netcash's public ISV key (`m2`). |
| `NEXT_PUBLIC_BASE_URL` | `https://maonoforextrading.co.za` | Also needs to be a runtime var (server reads it). |
| `NEXT_PUBLIC_APP_URL` | `https://maonoforextrading.co.za` | Same. Used for email links. |
| `BUNNY_STREAM_LIBRARY_ID` | Bunny library id | Not secret. |
| `R2_ACCOUNT_ID` | Cloudflare account id | Not secret. |
| `EMAIL_FROM` | `Maono Forex Trading <…@maonoforextrading.co.za>` | Verified Resend sender. |
| `EMAIL_REPLY_TO` | `support@maonoforextrading.co.za` | |
| `NEXT_PUBLIC_GA_ID` | GA4 id (e.g. `G-…`) | Public analytics id. |
| `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` | `https://t.me/…` | Public. |
| `NEXT_PUBLIC_{FACEBOOK,INSTAGRAM,TIKTOK,X,YOUTUBE,TELEGRAM_BOT,BROKER,BROKER_SIGNUP}_URL` | public URLs | Optional socials/broker links. |

## Superseded / not needed in prod
- `NEXT_PUBLIC_ENROLLMENT_OPEN` — **superseded**; enrollment is now hardcoded open in `lib/flags.ts`. (Still present in `wrangler.jsonc`; harmless.)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth is disabled.
- `WP_DB_*`, `WP_DUMP`, `WP_LMS`, `DRY_RUN` — one‑time WordPress migration scripts only. **Never set in production.**

## Rules
1. No secret is ever `NEXT_PUBLIC_*`.
2. Secrets live only as Worker **secrets** — not in `wrangler.jsonc`, not in git, not in the client bundle.
3. `wrangler versions deploy` promotes; secrets persist across deploys. Vars in `wrangler.jsonc` are applied on deploy.
