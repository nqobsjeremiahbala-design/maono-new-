# Maono Global Forex — Full Site Rebuild Design Spec
**Date:** 2026-04-21
**Domain:** maonoforextrading.co.za
**Stack:** Next.js App Router · Tailwind CSS v4 · TypeScript · Vercel
**Scope:** v1 — Marketing only (no checkout, no LMS, no auth)

---

## 1. Project Brief

### What we're building
A full marketing site rebuild for Maono Forex Trading — a South African forex education company offering courses, memberships, live seminars, and 1-on-1 mentorship. v1 ships marketing pages only; e-commerce, LMS, and auth are Phase 2.

### The problem with the current site
The existing WordPress/WooCommerce/MasterStudy LMS site mixes too many audiences, lacks clear conversion funnels, has no trust infrastructure, and reads as generic forex guru content. It does not differentiate Maono in a high-scam-risk niche.

### What success looks like
- Clear, single-minded funnel from cold traffic → free signals group → paid courses/memberships/mentorship
- Institutional, restrained visual identity that signals legitimacy without claiming it
- All audiences (beginner/intermediate/advanced) served without confusion
- SEO-ready from day one (targeting SA forex education keywords)
- Lighthouse 95+ across all categories

---

## 2. Positioning

### Primary positioning
**Legitimacy through restraint + institutional-grade education + real community**

Differentiated from the SA forex guru landscape by:
- What we don't say (no overnight wealth promises, no Lamborghinis, no fake urgency)
- What we prove (real named team + real sample lesson — our two pre-launch proof commitments)
- How we look (institutional craft, not hype-marketing aesthetics)

### Positioning pillars
1. **Legit by default** — Real humans, real methodology, transparent about what trading actually is
2. **Institutional approach** — "We teach how banks and funds trade, not retail indicator hype"
3. **Community, not content library** — "Trade alongside others, not a pre-recorded ghost town"

### What we never say
- "Get rich trading forex"
- "Passive income"
- "Limited spots" (fake urgency)
- Any claims we cannot back with evidence in v1

---

## 3. Audience

### All levels served, segmented by self-identification
Four audience segments, all served via a skill-level segmenter on the homepage:

| Segment | Description | Primary hook |
|---|---|---|
| Complete beginners | Heard about forex on social media, never traded, need trust + hand-holding | Free signals group → Forex Intro course |
| Self-taught strugglers | Lost money on YouTube strategies, want structure | Free signals → structured course path |
| Intermediate traders | Know basics, want institutional/advanced concepts | Institutional Concepts course |
| Aspiring pro/full-time traders | Treating forex as career | Mentorship + Advanced path |

### Primary conversion sequence (universal)
Free signals group → nurture via signals/resources → course purchase → membership upgrade → mentorship inquiry

---

## 4. Conversion Architecture

### Primary CTA (everywhere)
**"Join the free signals group"** — lowest friction, highest perceived value, email + WhatsApp capture

### Funnel stack
```
Cold traffic (SEO / social / referral)
        ↓
Homepage → Free Signals CTA
        ↓
/signals — email + WhatsApp capture form
        ↓
Nurture: signals, free resources, sample lesson
        ↓
Learning path → Course detail → "Buy course" CTA (Phase 2 checkout)
        ↓
/memberships → Tier upgrade
        ↓
/mentorship → 1-on-1 inquiry
```

### Universal fallback
Every page that doesn't convert to purchase falls back to the free signals group. Sticky bottom bar on mobile: "Free signals group — join [n] traders. Zero cost."

### Lead capture tech (v1 — zero backend)
- **Formspree** for signals + contact forms
- **WhatsApp deep link** as instant backup: `wa.me/27814369770`
- **Vercel Analytics** + **GA4** for conversion tracking

---

## 5. Proof Strategy

We ship v1 with exactly two proof assets. Nothing else is claimed.

| Asset | Where it lives | What it proves |
|---|---|---|
| **D — Free sample lesson / market breakdown video** | /resources hub, Homepage section 4 | Teaching quality |
| **E — Founder + team bios with real names and photos** | /about, Homepage section 7 | Real humans, real credentials |

### What we do not claim in v1 (until we have evidence)
- Student numbers / community size
- Testimonials
- Verified trading track record
- Press mentions or partnerships

---

## 6. Sitemap (21 static routes + dynamic [slug] templates)

### Top navigation
`Free Signals` (CTA button) · `Courses` · `Memberships` · `Mentorship` · `Resources` · `About` · `Blog`

### Full page list

**Conversion-critical**
- `/` — Homepage
- `/signals` — Free signals landing page
- `/paths/beginner` — Beginner learning path hub
- `/paths/intermediate` — Intermediate learning path hub
- `/paths/advanced` — Advanced learning path hub

**Product pages**
- `/courses` — Course catalog overview
- `/courses/forex-trading-introduction`
- `/courses/price-action-trading`
- `/courses/institutional-trading-concepts`
- `/courses/trading-psychology`
- `/courses/trading-strategies`
- `/courses/trading-tools`
- `/memberships` — Tier comparison (Bronze / Silver / Gold / Platinum)
- `/mentorship` — 1-on-1 high-ticket page

**Trust & content**
- `/about` — Team, story, methodology (proof asset E)
- `/resources` — Free content hub (proof asset D)
- `/resources/[slug]` — Individual resource template
- `/seminars` — Live events
- `/blog` — Blog index
- `/blog/[slug]` — Blog post template

**Utility**
- `/contact` — Contact + FAQ combined
- `/privacy`, `/terms`, `/risk-disclosure` — Legal (route group, no nav)

---

## 7. Homepage Design

Scroll order — each section is a conversion beat.

| # | Section | Job |
|---|---|---|
| 1 | **Hero** | Hook, primary CTA (free signals), micro-credibility strip |
| 2 | **Skill-level segmenter** | Route Beginner / Intermediate / Advanced to their path |
| 3 | **Methodology belt** | Encode 3 positioning pillars with icons + headlines |
| 4 | **Free sample lesson** | Proof asset D — "See how we teach before you pay" |
| 5 | **Courses preview** | Grid of 6 course cards, secondary signals fallback CTA |
| 6 | **Who it's for / not for** | Anti-scam trust play — radical honesty section |
| 7 | **Team snapshot** | Proof asset E — named humans with photos |
| 8 | **Memberships preview** | Compact 4-tier table |
| 9 | **Seminars / events** | Upcoming live events if active |
| 10 | **Final CTA banner** | Full-width convergence — signals group, nothing else |
| 11 | **Footer** | Utility nav + newsletter/signals signup |

### What the homepage deliberately excludes
- Student count badges (no numbers yet)
- Testimonial carousel (no testimonials yet)
- Fake urgency ("limited spots!")
- Floating popups or exit-intent overlays
- "As seen in" press logos
- Myfxbook / trading track record widgets

---

## 8. Visual Direction

Deep work handled in `/ui-ux-pro-max` and `/impeccable` phases. These are the guardrails.

### Tone
Institutional restraint with warmth. Bloomberg editorial meets human educator. Not fintech robot. Not forex guru.

### Colour direction
- **Primary:** Deep navy or near-black (trust, authority)
- **Accent:** Gold / amber (precision, value, SA cultural resonance)
- **Base:** Clean white space (confidence, breathing room)
- **Never:** Red/green candle palette near any hero section

### Typography direction
- **Headlines:** Serif or semi-serif (authority, editorial weight)
- **Body:** Clean sans-serif (readability, modernity)
- **Avoid:** All-caps shouting, gradient text, decorative fonts

### Imagery principles
- Real team photos over stock imagery (always)
- Charts used sparingly, never as decoration
- Abstract geometric/grid motifs for section backgrounds
- `/ai-image-generation` fills hero + course card visual gaps

### Anti-patterns (never use)
- Lamborghinis, Rolexes, luxury signalling
- Explosion graphics, neon green profit screenshots
- "Confident businessman" stock photo clichés
- Wall-of-text sections with no breathing room

---

## 9. SEO Strategy

### Primary keyword clusters
- `forex trading courses south africa`
- `forex education south africa`
- `learn forex trading south africa`
- `forex signals south africa free`
- `forex mentorship south africa`

### Long-tail (blog + resources)
- `how to start forex trading south africa`
- `institutional trading concepts explained`
- `forex trading psychology tips`
- `price action trading strategy south africa`
- `is forex trading legal in south africa`

### Technical SEO (every page)
- Unique `<title>` + `<meta description>` via `generateMetadata()`
- OpenGraph + Twitter Card (critical for WhatsApp link previews)
- JSON-LD structured data: `Organization`, `Course`, `FAQPage`, `BreadcrumbList`
- Auto-generated `sitemap.xml` via `app/sitemap.ts`
- `robots.txt` via `app/robots.ts` — index all except `/api/`
- Canonical URLs on all pages
- Alt text on every image

### Content strategy (post-launch commitments)
- Blog: 1 market breakdown per week (short, sharp)
- Resources: 1 evergreen lesson per month minimum

---

## 10. Technical Architecture

### Directory structure
```
maono-global/
├── app/
│   ├── layout.tsx                    # Root layout (nav, footer, analytics)
│   ├── page.tsx                      # Homepage
│   ├── signals/page.tsx              # Free signals landing
│   ├── courses/
│   │   ├── page.tsx                  # Catalog overview
│   │   └── [slug]/page.tsx           # Course detail (6 static pages)
│   ├── paths/
│   │   └── [level]/page.tsx          # beginner / intermediate / advanced
│   ├── memberships/page.tsx
│   ├── mentorship/page.tsx
│   ├── about/page.tsx
│   ├── resources/
│   │   ├── page.tsx                  # Hub
│   │   └── [slug]/page.tsx           # Individual resource
│   ├── blog/
│   │   ├── page.tsx                  # Index
│   │   └── [slug]/page.tsx           # Post template
│   ├── seminars/page.tsx
│   ├── contact/page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── (legal)/
│       ├── privacy/page.tsx
│       ├── terms/page.tsx
│       └── risk-disclosure/page.tsx
├── components/
│   ├── ui/                           # Primitives: Button, Card, Badge, Input
│   ├── layout/                       # Nav, Footer, CTABanner, StickyBar
│   ├── sections/                     # Homepage section components
│   └── shared/                       # CourseCard, TeamCard, ResourceCard, PathCard
├── content/
│   ├── courses/                      # MDX or JSON per course
│   ├── blog/                         # MDX posts
│   └── resources/                    # MDX resources/lessons
├── lib/
│   ├── metadata.ts                   # Shared SEO helpers
│   ├── content.ts                    # MDX content loader helpers
│   └── types.ts                      # Shared TypeScript interfaces
└── public/
    └── images/                       # Optimised assets from /ai-image-generation
```

### Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Content layer | MDX files in `/content/` | No CMS cost, version-controlled, easy to migrate to Sanity/Contentful in Phase 2 |
| Styling | Tailwind CSS v4 + CSS variables | Design token layer without component library lock-in |
| Components | Built from scratch | Avoid AI-slop patterns; /ai-slop-cleaner enforced |
| Forms | Formspree | Zero backend, free tier sufficient for launch |
| Analytics | Vercel Analytics + GA4 | Zero config + full funnel tracking |
| Images | Next.js `<Image>` (WebP + AVIF) | Automatic optimisation, lazy loading below fold |

### Performance targets
- Lighthouse 95+ (performance, accessibility, best practices, SEO)
- LCP < 2.5s on mobile
- CLS = 0 on all above-fold sections
- All images lazy-loaded below fold

### Deployment
- Repo: `github.com/maono-global-forex-site/maono-global-`
- Auto-deploy to Vercel on push to `main`
- Preview deployments on all feature branches

---

## 11. Phase 2 (out of scope for v1)

- Checkout / payment processing (Payfast / Yoco / Stripe)
- Memberships with recurring billing
- LMS (course delivery, video lessons, progress tracking, certificates)
- User accounts (login, dashboard, wishlist)
- Email marketing automation (Mailchimp / Klaviyo)
- WhatsApp Business API
- CRM integration

---

## 12. Skill Pipeline

Implementation runs through the following skill sequence:

1. `/shape` — structured UX/UI design brief
2. `/ui-ux-pro-max` — IA, layouts, component system, user flows
3. `/critique` — design direction review
4. `/copywriting` — full copy overhaul, SEO-tuned
5. `/clarify` — microcopy, CTAs, labels
6. `/ai-image-generation` — hero, course cards, brand visuals
7. `/impeccable` — production Next.js build
8. `/typeset` — typography pass
9. `/colorize` — strategic colour application
10. `/layout` — spacing, rhythm, grid
11. `/animate` — motion + micro-interactions
12. `/adapt` — responsive, mobile-first
13. `/harden` — error states, SEO completeness
14. `/optimize` — performance
15. `/audit` — scored QA report
16. `/polish` — final pass
17. `/ai-slop-cleaner` — strip generic AI patterns
18. `/critique` — final UX review
19. Commit + push + Vercel deploy
