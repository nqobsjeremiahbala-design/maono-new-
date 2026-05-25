# Maono Global Forex — Full Audit

Date: 2026-05-25
Reviewed by: 4 parallel specialists (architect, security, code review, SEO/perf/UX)
Stack: Next.js 16.2.4 · React 19.2.4 · Tailwind 4 · Prisma 6 · Auth.js v5-beta · Ozow

---

## Executive summary

| Severity | Count |
|---|---|
| Critical (ship-blocking) | 6 |
| High | 16 |
| Medium | 14 |
| Low | 11 |

The site has solid bones — Next 16 conventions are mostly correct, server/client split is disciplined, metadata helper is centralized. But there are **three ship-blockers right now**:

1. **Footer.tsx will not compile** — the uncommitted refactor references deleted symbols (`columns`, `Image`). `tsc --noEmit` fails with 5 errors. Vercel build will fail on next deploy.
2. **Enrollment is fake** — paid users don't actually get DB enrollment. `lib/enrollment.ts` (localStorage) is the live system; `lib/enrollment-db.ts` (Prisma) has zero callers. Anyone can flip a key in DevTools to "buy" a course.
3. **Default admin password `admin123456`** is hardcoded in `prisma/seed.ts` and documented in `README.md`. Public repo + public README = pre-auth admin compromise.

---

## CRITICAL

### C1. Footer.tsx is broken — build will fail
`components/layout/Footer.tsx`
- Line 3: `import Image from "next/image"` was removed during the refactor
- Line 5–13: `primaryLinks` / `legalLinks` arrays defined but never rendered
- Line 36: still calls `columns.map(...)` — `columns` no longer exists
- Line 61–67: still calls `<Image src="/images/logo/maono-logo.png" />` — `Image` no longer imported, and the path doesn't exist (only `logo.svg` / `logov2.svg` exist in `public/images/logo/`)
- Result: 5 TS errors. Vercel build fails.

**Fix:** finish the rewrite — render `primaryLinks` and `legalLinks`, swap the brand row to `<Logo variant="footer" />` (already imported).

### C2. Enrollment system is fake — paid courses don't grant access
`lib/enrollment.ts` (localStorage) vs `lib/enrollment-db.ts` (Prisma, zero callers)
- `app/checkout/CheckoutClient.tsx:130` writes to localStorage even after Ozow payment
- `app/learn/[slug]/LearnClient.tsx:33` gates lessons on `isEnrolled()` (localStorage) → anyone can grant themselves access via DevTools
- `app/api/webhooks/ozow/route.ts` updates `Purchase` status on payment but **never calls `enrollUser()`** — the DB enrollment count stays at 0
- `app/admin/page.tsx:7` shows `prisma.enrollment.count()` which will read 0 forever

**Fix:** route enrollment through `enrollUser()` from the Ozow webhook on `COMPLETE`, gate `/learn/[slug]` server-side via `auth()` + `isUserEnrolled()`, retire `lib/enrollment.ts`.

### C3. Default admin password `admin123456` hardcoded + documented publicly
`prisma/seed.ts:20`, `README.md:62-63,130`
- Seed falls back to `admin123456` if `ADMIN_PASSWORD` unset
- README documents this credential for every developer who clones the repo
- Combined with login at `/login` — any production env that ran the seed without setting the env var is pre-auth admin RCE

**Fix:** remove the fallback; throw if `ADMIN_PASSWORD` is missing. Strip the credential from README. Rotate the production admin password immediately.

### C4. Ozow webhook: non-timing-safe compare, no idempotency, no amount re-validation
`lib/payments/ozow.ts:136`, `app/api/webhooks/ozow/route.ts:20-54`
- `expected === payload.Hash.toLowerCase()` is timing-leaky (replace with `crypto.timingSafeEqual`)
- Webhook runs `prisma.purchase.update` on every POST — Ozow retries succeed forever, can downgrade a `COMPLETE` purchase to `CANCELLED` or replay a captured webhook to grant free enrollment
- `payload.Amount` is never compared to `purchase.amountCents` — defense in depth missing

**Fix:** timing-safe hash compare, `updateMany({ where: { id, status: 'PENDING' } })` for atomic state transition, verify amount before granting enrollment.

### C5. Next.js 16.2.4 has known High CVEs (middleware bypass + DoS)
`package.json:21`
- GHSA-26hh-7cqf-hhc6 (middleware bypass) defeats the only rate limiter
- Bump to latest patched 16.x and re-audit

### C6. `unsafe-inline` and `unsafe-eval` in script-src CSP
`next.config.ts:24`
- Defeats most XSS protection. Combined with `next-mdx-remote` rendering admin-authored MDX, any compromised admin → arbitrary JS
- Inline GA snippet at `app/layout.tsx:36-38` is the only thing forcing `unsafe-inline`

**Fix:** drop `unsafe-eval` (Next 16 App Router doesn't need it), move to nonce-based CSP, use `next/third-parties` GoogleAnalytics.

---

## HIGH

### H1. Hero `poster` removed — LCP regression
`components/sections/Hero.tsx:16` — uncommitted diff dropped `poster="/images/hero/hero-main.jpg"`. The poster image still exists in `public/`. Without it the LCP candidate is blank navy until the video buffers. Also set `preload="metadata"` not `auto` (858 KB video on home page).

### H2. Open redirect on auth callbackUrl
`app/login/LoginForm.tsx:13,47`, `app/register/RegisterForm.tsx:13,57,140` — `callbackUrl` from query string passed unchecked to `router.push()`. `/login?callbackUrl=https://evil.example` redirects authenticated users to attacker host. Allowlist same-origin only:
```ts
const raw = searchParams.get('callbackUrl') || '/dashboard'
const callbackUrl = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard'
```

### H3. `/admin/*` protection is layout-only, not middleware-level
`app/admin/layout.tsx:10-13` is the only guard; `middleware.ts` matcher is `'/api/auth/:path*'`. Combined with C5 (middleware bypass CVE), `/admin/users.json?_rsc=...` may leak data. Add `/admin/:path*` to matcher.

### H4. Rate limit Map is per-instance, ineffective on Vercel
`middleware.ts:3-25` — in-process `Map` resets on cold start, not shared across lambdas. Use Vercel KV / Upstash. Also `x-forwarded-for` is spoofable as written.

### H5. Admin video upload trusts content-type, allows path-traversal in ext
`app/api/admin/upload/route.ts:28-42` — `file.type` is browser-supplied; `file.name.split('.').pop()` is unsanitized (could contain `..` or `/`); writes to repo-relative `uploads/` which doesn't work on Vercel (read-only outside `/tmp`).

### H6. GA4 ID is placeholder `G-XXXXXXXXXX`
`app/layout.tsx:33,37` — production ships a broken tracking ID, emits failed requests every page load, dirties CSP. Read from `process.env.NEXT_PUBLIC_GA_ID`, skip rendering if unset.

### H7. Three sources of truth for course content
- `content/courses/*.mdx` (MDX)
- `lib/courseLessons.ts` (404 lines of hand-coded curriculum)
- Prisma `Module` / `Lesson` tables (defined, seeded, never queried by any page)

Pick one. Recommend Prisma as canonical, retire the others.

### H8. `middleware.ts` uses Next 15 naming — should be `proxy.ts`
Next 16 renames Middleware to Proxy. The file still works in 16.2.4 as a compat shim but is a deprecation tripwire. Rename to `proxy.ts`, export `proxy` function.

### H9. CSP blocks TradingView widget in production
`next.config.ts:22-30` `script-src` doesn't include `s3.tradingview.com`. `components/sections/TradingViewTicker.tsx:11` will be blocked by CSP. Add `https://s3.tradingview.com https://*.tradingview.com` to script-src + connect/frame-src.

### H10. No `viewport` / `themeColor` export
`app/layout.tsx` has metadata but no `viewport` export. Browser chrome stays default grey instead of brand navy. Add:
```ts
export const viewport: Viewport = { themeColor: '#0a0f1e', width: 'device-width', initialScale: 1 }
```

### H11. Sitemap excludes legal routes, includes login/register
`app/sitemap.ts:7-11` — missing `/privacy`, `/terms`, `/risk-disclosure`, `/signals`, `/mentorship`. Includes `/login` and `/register` which are `noindex` — drop them.

### H12. Heavy unoptimized images in /public
36 MB total in `/public/images/`, many JPGs 1.5–2.5 MB each. `lifestyle/structured-v2.jpg` 2.1 MB, `paths/advanced.jpg` 2.0 MB, `courses/trading-tools.jpg` 2.4 MB. Pre-compress to ~300 KB at 1800px or convert to AVIF.

### H13. Article JSON-LD missing on blog posts
`lib/jsonld.ts` defines Organization, Course, Breadcrumb, FAQ but no `Article`. `/blog/[slug]` doesn't inject structured data despite being high-SEO-value journal content.

### H14. `next-mdx-remote` renders untrusted admin MDX with no allowlist
Admin can author arbitrary JSX/JS via lesson `content`. Compromised admin → XSS even with CSP fix (H6 / C6).

### H15. Heading `<title>` defined twice (root layout + page)
`app/layout.tsx:16-20` sets title; `app/page.tsx` re-sets via `generatePageMetadata`. Page wins on home but layout becomes fallback for routes that don't set metadata. Pick one.

### H16. Fabricated testimonials with specific Rand amounts
`components/sections/Testimonials.tsx`, `components/sections/TelegramTestimonials.tsx` — hardcoded "Praveen K. +R8,400 on GBP/JPY today" style quotes. SA forex education is FAIS/FSCA regulated — false-advertising risk. Replace with real consented quotes or label as illustrative; at minimum strip specific Rand figures.

---

## MEDIUM

### M1. `lib/enrollment.ts` couples `Nav.tsx` to localStorage
`components/layout/Nav.tsx:25` reads `getAllEnrollments()` on every page → layout shift on hydration. Tied to C2.

### M2. `Logo` component ignores its `variant`/`size` props
`components/layout/Logo.tsx:14-19` — `width`/`height` props are passed but className `h-[88px] w-auto` always wins. Either drop the props or wire them up.

### M3. Duplicate metadata in news layout
`app/news/layout.tsx` defines metadata that conflicts with `app/news/page.tsx`. Delete one.

### M4. `bcrypt.compare` user-enumeration timing oracle
`lib/auth.ts:36` — if user not found, returns immediately (no bcrypt). ~200ms vs ~0ms reveals user existence. Run dummy `bcrypt.compare` against a known hash to equalize.

### M5. WP migration accepts raw MD5 hashes
`lib/phpass.ts:43-46` — accepts and validates MD5-only stored creds. Trivially crackable if DB ever leaks. Force a password reset for these users.

### M6. Hero CTA cluster wraps to 4 lines on mobile
`Hero.tsx:59-86` — three buttons (Start learning, Explore courses, Join Telegram) stack full-width on 360px. Downgrade Telegram to a tertiary link.

### M7. BrokerOfChoice rewrite collapsed visual hierarchy
`components/sections/BrokerOfChoice.tsx` uncommitted diff removed the two-column layout with broker logo. The logo asset (`public/images/brokers/maono-global-markets-logo.jpg`) was added in commit `d57b949` and is now unused.

### M8. Mobile nav button missing `aria-expanded`/`aria-controls`
`Nav.tsx:108-116` — has `aria-label` but no `aria-expanded={open}` / `aria-controls`.

### M9. Inconsistent card aspect ratios
Courses: `aspect-[4/3]`. Blog: `aspect-[4/3]`. News: `aspect-[16/10]`. Pick one.

### M10. `font-serif` token is set to the same font as `font-sans`
`globals.css:19-20` — both set to Rubik. Brand voice wants real serif headings.

### M11. Footer disclaimer in lowest-contrast color
Once C1 fixed: `text-navy-500` (`#485a7f` on `#0a0f1e`) is ~4.0:1, below WCAG AA for small text. Brighten the disclaimer.

### M12. `Nav.tsx` is fully `'use client'` for one badge
Static link list, logo, login/register CTAs could be server-rendered. Split into server shell + small client islands.

### M13. `BROKER_OF_CHOICE.url` mismatch across files
`components/sections/BrokerSection.tsx` hardcodes `maonoforextrading.co.za` but `BROKER_OF_CHOICE.url` points to `maonoglobalmarkets.com`. Delete the unused file.

### M14. Black Friday copy hardcoded mid-year
`components/sections/MembershipsPreview.tsx:26-31` — "BF Special" badge and strike-through pricing. Today is 2026-05-25. Either gate by date or remove.

---

## LOW

- **L1.** `serverExternalPackages: ['fs']` in `next.config.ts:9` is a no-op (`fs` is core, not a package). Remove.
- **L2.** `tsconfig.json` `target: ES2017` — bump to ES2022.
- **L3.** `vercel.json` duplicates security headers from `next.config.ts` and omits CSP/HSTS. Delete the duplicate.
- **L4.** Phone/email on `/contact` not wrapped in `tel:` / `mailto:`.
- **L5.** `CheckoutClient.tsx:322` renders a stray comma in the VAT row.
- **L6.** Trailing space in repo directory name. Cosmetic.
- **L7.** Robots only disallows `/api`. Add `/admin`, `/dashboard`, `/learn`, `/checkout`, `/my-courses`.
- **L8.** `JsonLd.tsx` `sameAs` is empty — populate with `SOCIAL_LINKS`.
- **L9.** `enrollment.ts` `JSON.parse(raw) as State` has no runtime validation. Tied to C2.
- **L10.** `TradingViewTicker` injects third-party script with no SRI / error boundary.
- **L11.** Privacy policy `Last updated: 2026-04-27` — date is in the future-ish; verify accuracy.

---

## Notes / Non-issues
- Async params, route handlers, metadata helpers all use current Next 16 conventions.
- Server/client split is disciplined — only 4 `'use client'` boundaries in shared chrome.
- Markdown component uses React nodes, not `dangerouslySetInnerHTML` — safe.
- `prefers-reduced-motion` block in `globals.css` is comprehensive.
- No `<img>` tags (good, all `next/image`).
- No raw Prisma queries — SQL injection surface is clean.

---

## Fix order (recommended)

1. **Footer.tsx compile fix** — unblocks all builds (C1).
2. **Hero poster restore** — quick LCP win (H1).
3. **Remove `admin123456` fallback + strip from README** — credential rotation (C3).
4. **Ozow webhook hardening** — idempotency, timing-safe, amount check (C4).
5. **Open redirect fix** — callbackUrl allowlist (H2).
6. **GA placeholder gate** — env-driven render (H6).
7. **CSP fix** — drop `unsafe-eval`, allow TradingView (C6, H9).
8. **Viewport export** — themeColor (H10).
9. **Sitemap cleanup** — legal in, login out (H11).
10. **Delete `BrokerSection.tsx`** — dead duplicate (M13).
11. **`next.config.ts` no-op cleanup** — remove `serverExternalPackages: ['fs']` (L1).
12. **Bump Next.js** — patched 16.x (C5).
13. **Verify build** — `tsc --noEmit`, `npm run build`.
14. **Bigger refactors** (separate PRs): enrollment unification (C2), middleware→proxy rename (H8), course content single-source (H7), MDX sanitization (H14), image optimization (H12), testimonials compliance (H16).

Items 1–13 are mechanical and safe in one PR. Item 14 items each need product sign-off.
