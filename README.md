# Maono Global Forex Trading

Institutional-grade forex education platform for the South African market. Structured courses, membership tiers, payment processing via Ozow, and a role-gated admin CMS.

**Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · PostgreSQL · Prisma · Auth.js v5 · Ozow Payments

---

## Table of Contents

- [Quick Start (Docker)](#quick-start-docker)
- [Quick Start (No Docker)](#quick-start-no-docker)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Authentication](#authentication)
- [Admin CMS](#admin-cms)
- [Payments (Ozow)](#payments-ozow)
- [Production Deployment](#production-deployment)
  - [1. Provision Supabase](#1-provision-supabase)
  - [2. Deploy Database](#2-deploy-database)
  - [3. Deploy to Vercel](#3-deploy-to-vercel)
  - [4. Configure Ozow](#4-configure-ozow)
  - [5. Set Up Video (Optional)](#5-set-up-video-optional)
  - [6. DNS & Domain](#6-dns--domain)
  - [7. Post-Deploy Checklist](#7-post-deploy-checklist)
- [Project Structure](#project-structure)
- [NPM Scripts](#npm-scripts)
- [Troubleshooting](#troubleshooting)

---

## Quick Start (Docker)

**Prerequisites:** Docker and Docker Compose installed.

```bash
# 1. Clone and enter the repo
git clone https://github.com/thyla-blip/maono-global-.git
cd maono-global-

# 2. Switch to the feature branch
git checkout feat/prod-ready-cms-auth-payments-video

# 3. Create your local env file
cp .env.example .env.local

# 4. Generate an auth secret and paste it into .env.local
npx auth secret
# Copy the AUTH_SECRET value into .env.local

# 5. Start everything (Postgres + Next.js)
npm run docker:up
```

This will:
- Start a Postgres 16 container on port 5432
- Run Prisma migrations automatically
- Seed the database (admin user + courses from MDX content)
- Start the Next.js dev server on **http://localhost:3000**

Default admin credentials (from seed):
- **Email:** `admin@maonoforextrading.co.za`
- **Password:** `admin123456`

Change these via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` before first run.

### Docker Commands

| Command | What it does |
|---|---|
| `npm run docker:up` | Build and start containers |
| `npm run docker:down` | Stop containers (keeps data) |
| `npm run docker:reset` | Stop, wipe database volume, rebuild from scratch |

---

## Quick Start (No Docker)

**Prerequisites:** Node.js 20+, PostgreSQL running locally.

```bash
# 1. Clone and setup
git clone https://github.com/thyla-blip/maono-global-.git
cd maono-global-
git checkout feat/prod-ready-cms-auth-payments-video

# 2. Install dependencies
npm ci

# 3. Create env file
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL to your local Postgres

# 4. Generate auth secret
npx auth secret
# Paste value into .env.local as AUTH_SECRET

# 5. Generate Prisma client
npx prisma generate

# 6. Run migrations
npm run db:migrate

# 7. Seed database
npm run db:seed

# 8. Start dev server
npm run dev
```

Open **http://localhost:3000**

---

## Environment Variables

Copy `.env.example` to `.env.local` for development. For production, set these in Vercel's dashboard.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string. For Supabase runtime, use the pooler URL (port 6543, `?pgbouncer=true`). |
| `DIRECT_URL` | Prod only | Supabase direct connection (port 5432, no pgbouncer). Used by Prisma for migrations. |
| `AUTH_SECRET` | Yes | NextAuth.js secret. Generate with `npx auth secret`. |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app's public URL. `http://localhost:3000` for dev. |
| `OZOW_SITE_CODE` | For payments | Your Ozow Site Code. |
| `OZOW_PRIVATE_KEY` | For payments | Your Ozow Private Key. |
| `OZOW_API_KEY` | For payments | Your Ozow API Key. |
| `OZOW_IS_TEST` | For payments | `"true"` for sandbox, `"false"` for production. |
| `ADMIN_EMAIL` | Seed only | Email for the seeded admin user. Default: `admin@maonoforextrading.co.za` |
| `ADMIN_PASSWORD` | Seed only | Password for the seeded admin user. Default: `admin123456` |

---

## Database

**ORM:** Prisma with PostgreSQL.

**Schema:** `prisma/schema.prisma` — models for Users, Courses, Modules, Lessons, Enrollments, Purchases, Subscriptions.

**Key commands:**

```bash
npm run db:migrate    # Create/apply migrations (dev)
npm run db:seed       # Seed admin user + courses
npm run db:studio     # Open Prisma Studio GUI (http://localhost:5555)
```

Migrations live in `prisma/migrations/` and are version-controlled. The initial migration (`0001_init`) creates all tables.

---

## Authentication

**Provider:** Auth.js v5 (NextAuth) with Credentials provider.

- **JWT strategy** — stateless, works with Vercel serverless
- **Prisma adapter** — users, accounts, sessions stored in Postgres
- **Roles:** `STUDENT` (default) and `ADMIN`
- **Pages:** `/login`, `/register`

Admin routes (`/admin/*`) are server-side protected — the layout checks the session and redirects non-admin users to `/login`.

---

## Admin CMS

Access at **http://localhost:3000/admin** (requires ADMIN role).

| Page | URL | Features |
|---|---|---|
| Dashboard | `/admin` | Live KPIs: users, enrollments, revenue, subscriptions, recent purchases |
| Courses | `/admin/courses` | List all courses with module/lesson counts, enrollment counts |
| New Course | `/admin/courses/new` | Create course with title, slug, level, price, duration |
| Edit Course | `/admin/courses/[id]` | Edit details, add/remove modules, add/remove lessons inline |
| Users | `/admin/users` | User list with roles, enrollment and purchase counts |
| Purchases | `/admin/purchases` | Purchase log with status breakdown and totals |
| Subscriptions | `/admin/subscriptions` | Active subscription management |

All admin forms use **Server Actions** — no client-side JavaScript for data mutations.

---

## Payments (Ozow)

**Provider:** [Ozow](https://ozow.com) — South African instant EFT + card payments.

**Flow:**
1. User clicks "Buy" → POST to `/api/checkout` creates a `Purchase` record
2. Server builds signed Ozow payment URL → redirects user to Ozow hosted page
3. User completes payment on Ozow
4. Ozow POST webhook to `/api/webhooks/ozow` with result
5. Server verifies SHA-512 hash, updates Purchase status
6. On `COMPLETE` → auto-creates Enrollment for the course

**Testing:** Set `OZOW_IS_TEST="true"` to use Ozow sandbox. No real money is charged.

---

## Production Deployment

### 1. Provision Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy:
   - **Connection string (pooler)** — port 6543, with `?pgbouncer=true` → this is `DATABASE_URL`
   - **Connection string (direct)** — port 5432, no pgbouncer → this is `DIRECT_URL`
3. Note your database password

### 2. Deploy Database

**Option A: Automated script**

```bash
# Set your Supabase credentials in .env.local or .env.production
# DATABASE_URL = pooler URL (port 6543)
# DIRECT_URL = direct URL (port 5432)

npm run deploy:supabase
# Or for production env file:
npm run deploy:supabase -- --prod
```

The script will:
- Auto-detect pooler vs direct URLs
- Run `prisma migrate deploy` (creates all tables)
- Seed admin user + courses from MDX
- Validate the database

**Option B: Manual**

```bash
# Set DATABASE_URL to the DIRECT connection (port 5432, no pgbouncer)
export DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres"

npx prisma migrate deploy
npx prisma db seed
```

### 3. Deploy to Vercel

1. Connect the repo to Vercel: [vercel.com/new](https://vercel.com/new)
2. Set the **root directory** to `/` and **framework** to Next.js
3. Add environment variables in the Vercel dashboard:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase **pooler** URL (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct** URL (port 5432) |
| `AUTH_SECRET` | Output of `npx auth secret` |
| `NEXT_PUBLIC_APP_URL` | `https://maonoforextrading.co.za` (your domain) |
| `OZOW_SITE_CODE` | From Ozow dashboard |
| `OZOW_PRIVATE_KEY` | From Ozow dashboard |
| `OZOW_API_KEY` | From Ozow dashboard |
| `OZOW_IS_TEST` | `false` for production |

4. Deploy:
```bash
vercel --prod
```

Or push to the branch connected to Vercel for automatic deploys.

### 4. Configure Ozow

1. Sign up at [ozow.com](https://ozow.com) and create a merchant account
2. In the Ozow dashboard:
   - Set **Notify URL** to `https://yourdomain.com/api/webhooks/ozow`
   - Set **Success URL** to `https://yourdomain.com/checkout?status=success`
   - Set **Cancel URL** to `https://yourdomain.com/checkout?status=cancelled`
   - Set **Error URL** to `https://yourdomain.com/checkout?status=error`
3. Copy your Site Code, Private Key, and API Key into Vercel env vars
4. Test with `OZOW_IS_TEST="true"` first, then switch to `"false"`

### 5. Set Up Video (Optional)

See `docs/VIDEO_STRATEGY.md` for details. Recommended: **Mux** for adaptive streaming with access control.

Quick version:
1. Sign up at [mux.com](https://mux.com)
2. Add `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` to env vars
3. Install: `npm install @mux/mux-node @mux/mux-player-react`
4. Upload course videos via admin CMS or Mux dashboard

### 6. DNS & Domain

1. In Vercel: **Settings → Domains** → add `maonoforextrading.co.za`
2. At your registrar, point DNS:
   - **A record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com` (for `www`)
3. Vercel auto-provisions SSL

### 7. Post-Deploy Checklist

- [ ] Visit `/login` — sign in with admin credentials
- [ ] Visit `/admin` — verify dashboard loads with real data
- [ ] Create a test course via `/admin/courses/new`
- [ ] Visit `/courses` — verify the public listing shows your courses
- [ ] Test the checkout flow end-to-end (Ozow test mode)
- [ ] Verify Ozow webhook delivery at `/api/webhooks/ozow`
- [ ] Register a test student account at `/register`
- [ ] Confirm enrollment grants access after successful payment
- [ ] Change the default admin password via direct DB update or Prisma Studio
- [ ] Set `OZOW_IS_TEST="false"` when ready for real payments
- [ ] Update `G-XXXXXXXXXX` in `app/layout.tsx` with your real GA4 measurement ID

---

## Project Structure

```
app/
├── admin/              # CMS (dashboard, courses CRUD, users, purchases, subscriptions)
├── api/
│   ├── auth/           # NextAuth route + registration endpoint
│   ├── checkout/       # Creates Purchase + Ozow redirect
│   └── webhooks/ozow/  # Ozow payment webhook
├── login/              # Sign-in page
├── register/           # Registration page
├── checkout/           # Checkout UI
├── courses/            # Public course listing + detail
├── learn/[slug]/       # Course player (enrolled users)
├── my-courses/         # Student's enrolled courses
├── blog/               # Blog listing + posts
├── memberships/        # Membership tiers
└── ...                 # About, contact, legal pages, etc.

lib/
├── auth.ts             # Auth.js configuration + helpers
├── db.ts               # Prisma client singleton
├── enrollment.ts       # Client-side enrollment (localStorage, legacy)
├── enrollment-db.ts    # Server-side enrollment (Prisma)
├── content.ts          # MDX content reader
├── payments/ozow.ts    # Ozow payment URL builder + webhook verifier
└── types.ts            # Shared TypeScript types

prisma/
├── schema.prisma       # Data model
├── seed.ts             # Database seeder
└── migrations/         # SQL migrations (version-controlled)

scripts/
└── deploy-supabase.sh  # One-command Supabase deployment

content/
├── courses/            # Course MDX files
├── blog/               # Blog post MDX files
└── resources/          # Resource MDX files
```

---

## NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run docker:up` | Start Docker dev environment |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:reset` | Wipe database and rebuild |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run deploy:supabase` | Deploy schema + seed to Supabase |

---

## Troubleshooting

**`Environment variable not found: DATABASE_URL`**
- Ensure `.env.local` exists with a valid `DATABASE_URL`
- Docker: the compose file sets this automatically, but other env vars must be in `.env.local`

**`prisma migrate deploy` fails with "prepared statement already exists"**
- You're using a pooled connection (port 6543). Migrations need the direct connection (port 5432). Set `DIRECT_URL` or use the deploy script which auto-fixes this.

**Admin login redirects back to `/login`**
- Check that you seeded the database (`npm run db:seed`)
- Verify `AUTH_SECRET` is set in `.env.local`
- Check the user has role `ADMIN` in the database

**Ozow webhook not hitting**
- Ensure `NEXT_PUBLIC_APP_URL` matches your deployment URL
- In Ozow dashboard, verify Notify URL is `https://yourdomain.com/api/webhooks/ozow`
- Check Vercel function logs for webhook errors

**Docker: "port 5432 already in use"**
- You have a local Postgres running. Stop it or change the port mapping in `docker-compose.yml`

**Build fails with type errors**
- Run `npx prisma generate` before building — the Prisma client types must be generated
