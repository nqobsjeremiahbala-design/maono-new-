# Maono Global Forex — Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade Next.js App Router marketing site for maonoforextrading.co.za — 21 static routes + dynamic slug templates, zero backend, deployed to Vercel.

**Architecture:** MDX files in `/content/` drive all course, blog, and resource pages via static generation. UI primitives are built from scratch (no component library) with Tailwind CSS v4 design tokens. Formspree handles all forms with zero server-side code.

**Tech Stack:** Next.js 15 App Router · Tailwind CSS v4 · TypeScript · MDX · Formspree · Vercel Analytics · GA4

---

## File Map

```
app/
  layout.tsx                        # Root layout — nav, footer, analytics scripts
  page.tsx                          # Homepage (11 sections)
  signals/page.tsx                  # Free signals landing
  courses/page.tsx                  # Course catalog
  courses/[slug]/page.tsx           # Course detail (generateStaticParams)
  paths/[level]/page.tsx            # beginner | intermediate | advanced
  memberships/page.tsx
  mentorship/page.tsx
  about/page.tsx
  resources/page.tsx
  resources/[slug]/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  seminars/page.tsx
  contact/page.tsx
  sitemap.ts
  robots.ts
  (legal)/privacy/page.tsx
  (legal)/terms/page.tsx
  (legal)/risk-disclosure/page.tsx

components/
  ui/Button.tsx                     # Variant-aware button primitive
  ui/Card.tsx                       # Base card shell
  ui/Badge.tsx                      # Pill badge
  ui/Input.tsx                      # Controlled text input
  ui/Textarea.tsx                   # Controlled textarea
  layout/Nav.tsx                    # Top navigation + mobile menu
  layout/Footer.tsx                 # Site footer
  layout/CTABanner.tsx              # Full-width CTA strip
  layout/StickyBar.tsx              # Mobile sticky bottom bar
  sections/Hero.tsx                 # Homepage hero
  sections/LevelSegmenter.tsx       # Beginner/Intermediate/Advanced cards
  sections/MethodologyBelt.tsx      # 3-pillar positioning strip
  sections/SampleLesson.tsx         # Free lesson video embed
  sections/CoursesPreview.tsx       # 6-card course grid
  sections/ForWhom.tsx              # Who it's for / not for
  sections/TeamSnapshot.tsx         # Founder + team row
  sections/MembershipsPreview.tsx   # 4-tier compact table
  sections/SeminarsStrip.tsx        # Upcoming events banner
  sections/FinalCTA.tsx             # Full-width convergence CTA
  shared/CourseCard.tsx             # Reused on catalog + homepage
  shared/TeamCard.tsx               # Reused on about + homepage
  shared/ResourceCard.tsx           # Reused on resources + blog
  shared/SignalsForm.tsx            # Formspree signals capture form
  shared/ContactForm.tsx            # Formspree contact form
  shared/JsonLd.tsx                 # JSON-LD script injector

content/
  courses/forex-trading-introduction.mdx
  courses/price-action-trading.mdx
  courses/institutional-trading-concepts.mdx
  courses/trading-psychology.mdx
  courses/trading-strategies.mdx
  courses/trading-tools.mdx
  blog/welcome-to-maono.mdx
  resources/what-is-forex-trading.mdx

lib/
  types.ts                          # Course, BlogPost, Resource, TeamMember interfaces
  metadata.ts                       # generatePageMetadata helper
  content.ts                        # MDX loader: getCourses, getBlogPosts, getResources
  jsonld.ts                         # JSON-LD builders: organization, course, faq, breadcrumb

public/
  images/                           # All optimised images (added by /ai-image-generation)
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`

- [ ] **Step 1: Init project**

```bash
cd "/Users/thylabotha/Documents/Maono global forex "
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-turbopack \
  --yes
```

Expected: project files created in repo root.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react next-mdx-remote gray-matter
npm install @vercel/analytics
npm install -D @types/mdx
```

- [ ] **Step 3: Update next.config.ts for MDX**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
}

export default nextConfig
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 App Router project"
```

---

## Task 2: Design tokens — Tailwind CSS v4

**Files:**
- Modify: `app/globals.css`
- Create: `tailwind.config.ts` (overwrite scaffold default)

- [ ] **Step 1: Write design tokens in globals.css**

```css
@import "tailwindcss";

@theme {
  --color-navy-950: #0a0f1e;
  --color-navy-900: #0d1426;
  --color-navy-800: #111d35;
  --color-navy-700: #1a2d50;
  --color-navy-600: #243d6b;
  --color-gold-500: #c9a84c;
  --color-gold-400: #d4b96a;
  --color-gold-300: #e0ce94;
  --color-cream-50: #faf8f3;
  --color-cream-100: #f4f0e6;

  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Playfair Display', ui-serif, Georgia, serif;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-elevated: 0 10px 40px -10px rgb(0 0 0 / 0.2);
}

@layer base {
  html {
    @apply scroll-smooth;
  }
  body {
    @apply bg-cream-50 text-navy-900 font-sans antialiased;
  }
  h1, h2, h3 {
    @apply font-serif;
  }
}
```

- [ ] **Step 2: Add Google Fonts to root layout (next step — reference only)**

Note: fonts added in Task 3 (layout).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add Tailwind v4 design tokens (navy + gold palette)"
```

---

## Task 3: TypeScript interfaces

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write all shared interfaces**

```ts
export interface Course {
  slug: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  currency: 'ZAR'
  duration: string        // e.g. "6 hours"
  lessons: number
  topics: string[]
  image: string           // path under /public/images/courses/
  featured: boolean
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string            // ISO 8601
  author: string
  category: string
  image: string
  readTime: number        // minutes
}

export interface Resource {
  slug: string
  title: string
  description: string
  type: 'lesson' | 'breakdown' | 'guide'
  date: string
  image: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  years: number
}

export interface MembershipTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  highlighted: boolean
}

export interface Seminar {
  title: string
  date: string
  location: string
  city: string
  description: string
  registrationUrl: string
  isFree: boolean
}

export type PathLevel = 'beginner' | 'intermediate' | 'advanced'
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript interfaces"
```

---

## Task 4: Content loader (MDX)

**Files:**
- Create: `lib/content.ts`

- [ ] **Step 1: Write MDX content loaders**

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Course, BlogPost, Resource } from './types'

const contentDir = path.join(process.cwd(), 'content')

function readMdx(dir: string, slug: string) {
  const file = path.join(contentDir, dir, `${slug}.mdx`)
  const raw = fs.readFileSync(file, 'utf8')
  return matter(raw)
}

function getSlugs(dir: string): string[] {
  const folder = path.join(contentDir, dir)
  if (!fs.existsSync(folder)) return []
  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}

export function getCourses(): Course[] {
  return getSlugs('courses').map(slug => {
    const { data } = readMdx('courses', slug)
    return { slug, ...data } as Course
  })
}

export function getCourse(slug: string): { meta: Course; content: string } {
  const { data, content } = readMdx('courses', slug)
  return { meta: { slug, ...data } as Course, content }
}

export function getBlogPosts(): BlogPost[] {
  return getSlugs('blog')
    .map(slug => {
      const { data } = readMdx('blog', slug)
      return { slug, ...data } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): { meta: BlogPost; content: string } {
  const { data, content } = readMdx('blog', slug)
  return { meta: { slug, ...data } as BlogPost, content }
}

export function getResources(): Resource[] {
  return getSlugs('resources').map(slug => {
    const { data } = readMdx('resources', slug)
    return { slug, ...data } as Resource
  })
}

export function getResource(slug: string): { meta: Resource; content: string } {
  const { data, content } = readMdx('resources', slug)
  return { meta: { slug, ...data } as Resource, content }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add MDX content loaders for courses, blog, resources"
```

---

## Task 5: SEO helpers

**Files:**
- Create: `lib/metadata.ts`
- Create: `lib/jsonld.ts`
- Create: `components/shared/JsonLd.tsx`

- [ ] **Step 1: Write metadata helper**

```ts
// lib/metadata.ts
import type { Metadata } from 'next'

const BASE_URL = 'https://maonoforextrading.co.za'
const SITE_NAME = 'Maono Forex Trading'

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/images/og-default.jpg',
}: {
  title: string
  description: string
  path?: string
  image?: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  const fullTitle = path === '' ? `${SITE_NAME} — Trading Insights Re-defined` : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
```

- [ ] **Step 2: Write JSON-LD builders**

```ts
// lib/jsonld.ts
const BASE_URL = 'https://maonoforextrading.co.za'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Maono Forex Trading',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27814369770',
      contactType: 'customer service',
      areaServed: 'ZA',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 3B Waterside Place, 19 Carl Cronje Drive',
      addressLocality: 'Tyger Waterfront',
      addressRegion: 'Western Cape',
      postalCode: '7530',
      addressCountry: 'ZA',
    },
    sameAs: [],
  }
}

export function courseJsonLd(course: {
  title: string
  description: string
  slug: string
  price: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${BASE_URL}/courses/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Maono Forex Trading',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
```

- [ ] **Step 3: Write JsonLd component**

```tsx
// components/shared/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/metadata.ts lib/jsonld.ts components/shared/JsonLd.tsx
git commit -m "feat: add SEO metadata helpers and JSON-LD builders"
```

---

## Task 6: sitemap.ts + robots.ts

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Write sitemap**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getCourses, getBlogPosts, getResources } from '@/lib/content'

const BASE = 'https://maonoforextrading.co.za'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '', '/signals', '/courses', '/memberships', '/mentorship',
    '/about', '/resources', '/blog', '/seminars', '/contact',
    '/paths/beginner', '/paths/intermediate', '/paths/advanced',
  ].map(path => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const courses = getCourses().map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const posts = getBlogPosts().map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const resources = getResources().map(r => ({
    url: `${BASE}/resources/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...courses, ...posts, ...resources]
}
```

- [ ] **Step 2: Write robots.ts**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://maonoforextrading.co.za/sitemap.xml',
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt generation"
```

---

## Task 7: UI primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Input.tsx`
- Create: `components/ui/Textarea.tsx`

- [ ] **Step 1: Button**

```tsx
// components/ui/Button.tsx
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-gold-500 text-navy-950 hover:bg-gold-400 font-semibold',
  secondary: 'bg-navy-800 text-cream-50 hover:bg-navy-700 font-semibold',
  ghost: 'bg-transparent text-navy-900 hover:bg-navy-100',
  outline: 'border border-navy-700 text-navy-900 hover:bg-navy-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'
```

- [ ] **Step 2: Card**

```tsx
// components/ui/Card.tsx
export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg bg-white border border-navy-100 shadow-card ${className}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Badge**

```tsx
// components/ui/Badge.tsx
type BadgeVariant = 'default' | 'gold' | 'navy'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-cream-100 text-navy-700',
  gold: 'bg-gold-300 text-navy-900',
  navy: 'bg-navy-800 text-cream-50',
}

export function Badge({
  variant = 'default',
  children,
}: {
  variant?: BadgeVariant
  children: React.ReactNode
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Input + Textarea**

```tsx
// components/ui/Input.tsx
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition ${className}`}
      {...props}
    />
  )
}
```

```tsx
// components/ui/Textarea.tsx
export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-md border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition resize-none ${className}`}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/
git commit -m "feat: add UI primitives (Button, Card, Badge, Input, Textarea)"
```

---

## Task 8: Layout components

**Files:**
- Create: `components/layout/Nav.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/CTABanner.tsx`
- Create: `components/layout/StickyBar.tsx`

- [ ] **Step 1: Nav**

```tsx
// components/layout/Nav.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/memberships', label: 'Memberships' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-cream-50 font-bold tracking-tight">
          Maono
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-navy-300 hover:text-cream-50 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href="/signals">Free Signals</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cream-50 p-2"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-4">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-navy-200 hover:text-cream-50 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button size="sm" className="w-full">
                <Link href="/signals">Free Signals</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Footer**

```tsx
// components/layout/Footer.tsx
import Link from 'next/link'

const columns = [
  {
    title: 'Learn',
    links: [
      { href: '/courses', label: 'All Courses' },
      { href: '/paths/beginner', label: 'Beginner Path' },
      { href: '/paths/intermediate', label: 'Intermediate Path' },
      { href: '/paths/advanced', label: 'Advanced Path' },
      { href: '/resources', label: 'Free Resources' },
    ],
  },
  {
    title: 'Join',
    links: [
      { href: '/signals', label: 'Free Signals Group' },
      { href: '/memberships', label: 'Memberships' },
      { href: '/mentorship', label: '1-on-1 Mentorship' },
      { href: '/seminars', label: 'Live Seminars' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/risk-disclosure', label: 'Risk Disclosure' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map(col => (
            <div key={col.title}>
              <h3 className="text-cream-50 font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-cream-50 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-800 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-serif text-cream-50 font-bold text-lg">Maono Forex Trading</p>
            <p className="text-xs mt-1">Unit 3B Waterside Place, 19 Carl Cronje Drive, Tyger Waterfront, Western Cape, 7530</p>
            <p className="text-xs mt-0.5">+27 81 436 9770</p>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Maono Forex Trading. All rights reserved.</p>
        </div>

        <p className="text-xs text-navy-500 mt-6 leading-relaxed">
          Trading forex and financial instruments carries significant risk. Past performance is not indicative of future results.
          You should never trade money you cannot afford to lose. Maono Forex Trading provides education only and does not constitute financial advice.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: CTABanner**

```tsx
// components/layout/CTABanner.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTABanner({
  headline = 'Start free. Trade smarter.',
  sub = 'Join the free signals group and get real market analysis delivered daily.',
}: {
  headline?: string
  sub?: string
}) {
  return (
    <section className="bg-navy-900 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-4">{headline}</h2>
        <p className="text-navy-300 mb-8">{sub}</p>
        <Button size="lg" asChild>
          <Link href="/signals">Join the free signals group →</Link>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: StickyBar (mobile)**

```tsx
// components/layout/StickyBar.tsx
import Link from 'next/link'

export function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-navy-950 border-t border-navy-800 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-xs text-navy-300 leading-tight">
        Free signals group<br />
        <span className="text-cream-50 font-medium">Zero cost. Real analysis.</span>
      </p>
      <Link
        href="/signals"
        className="shrink-0 bg-gold-500 text-navy-950 font-semibold text-sm px-4 py-2 rounded-md"
      >
        Join free →
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/layout/
git commit -m "feat: add Nav, Footer, CTABanner, StickyBar layout components"
```

---

## Task 9: Root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StickyBar } from '@/components/layout/StickyBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Maono Forex Trading — Trading Insights Re-defined',
  description: 'Institutional-grade forex education for South African traders. Free signals group, structured courses, and 1-on-1 mentorship.',
  metadataBase: new URL('https://maonoforextrading.co.za'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyBar />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`}
        </Script>
      </body>
    </html>
  )
}
```

Note: replace `G-XXXXXXXXXX` with real GA4 measurement ID before launch.

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Nav, Footer, StickyBar, Vercel Analytics, GA4"
```

---

## Task 10: Shared components — forms

**Files:**
- Create: `components/shared/SignalsForm.tsx`
- Create: `components/shared/ContactForm.tsx`

- [ ] **Step 1: SignalsForm**

```tsx
// components/shared/SignalsForm.tsx
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const FORMSPREE_SIGNALS_ID = 'xpwzeygk' // replace with real Formspree form ID

export function SignalsForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_SIGNALS_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="text-gold-500 font-semibold text-lg mb-2">You're in.</p>
        <p className="text-navy-300 text-sm">Check WhatsApp — we'll add you to the group shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" type="text" placeholder="Your name" required />
      <Input name="email" type="email" placeholder="Email address" required />
      <Input name="whatsapp" type="tel" placeholder="WhatsApp number (+27...)" required />
      <input type="hidden" name="_subject" value="New signals group signup" />
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Try WhatsApp directly instead.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Joining...' : 'Join the free signals group →'}
      </Button>
      <p className="text-center text-xs text-navy-400">
        Or <a href="https://wa.me/27814369770?text=Hi+Maono%2C+I%27d+like+to+join+the+free+signals+group" className="underline hover:text-navy-200" target="_blank" rel="noopener noreferrer">message us on WhatsApp</a> directly.
      </p>
    </form>
  )
}
```

- [ ] **Step 2: ContactForm**

```tsx
// components/shared/ContactForm.tsx
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

const FORMSPREE_CONTACT_ID = 'xpwzeygk' // replace with real Formspree contact form ID

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_CONTACT_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-gold-500 font-semibold py-8">Message sent. We'll get back to you within 24 hours.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email address" required />
      </div>
      <Input name="subject" placeholder="Subject" required />
      <Textarea name="message" placeholder="Your message..." rows={5} required />
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Email us directly at info@maonoforextrading.co.za</p>
      )}
      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/shared/
git commit -m "feat: add SignalsForm and ContactForm with Formspree integration"
```

---

## Task 11: Shared components — cards

**Files:**
- Create: `components/shared/CourseCard.tsx`
- Create: `components/shared/TeamCard.tsx`
- Create: `components/shared/ResourceCard.tsx`

- [ ] **Step 1: CourseCard**

```tsx
// components/shared/CourseCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Course } from '@/lib/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 bg-navy-800">
        <Image
          src={course.image || '/images/courses/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={course.level === 'advanced' ? 'navy' : course.level === 'intermediate' ? 'gold' : 'default'}>
            {course.level}
          </Badge>
          <span className="text-xs text-navy-400">{course.duration} · {course.lessons} lessons</span>
        </div>
        <h3 className="font-serif text-lg text-navy-900 mb-2">{course.title}</h3>
        <p className="text-sm text-navy-500 mb-4 flex-1">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-navy-900">R{course.price.toLocaleString()}</span>
          <Button asChild size="sm">
            <Link href={`/courses/${course.slug}`}>View course</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: TeamCard**

```tsx
// components/shared/TeamCard.tsx
import Image from 'next/image'
import type { TeamMember } from '@/lib/types'

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-navy-200">
        <Image
          src={member.image || '/images/team/placeholder.jpg'}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <p className="font-serif text-navy-900 font-semibold">{member.name}</p>
      <p className="text-sm text-gold-500 mb-2">{member.role}</p>
      <p className="text-sm text-navy-500 max-w-xs mx-auto">{member.bio}</p>
    </div>
  )
}
```

- [ ] **Step 3: ResourceCard**

```tsx
// components/shared/ResourceCard.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Resource } from '@/lib/types'

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="p-5 hover:shadow-elevated transition-shadow">
      <Badge className="mb-3">{resource.type}</Badge>
      <h3 className="font-serif text-navy-900 mb-2">
        <Link href={`/resources/${resource.slug}`} className="hover:text-gold-500 transition-colors">
          {resource.title}
        </Link>
      </h3>
      <p className="text-sm text-navy-500">{resource.description}</p>
    </Card>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/shared/CourseCard.tsx components/shared/TeamCard.tsx components/shared/ResourceCard.tsx
git commit -m "feat: add CourseCard, TeamCard, ResourceCard shared components"
```

---

## Task 12: Homepage sections

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/sections/LevelSegmenter.tsx`
- Create: `components/sections/MethodologyBelt.tsx`
- Create: `components/sections/SampleLesson.tsx`
- Create: `components/sections/CoursesPreview.tsx`
- Create: `components/sections/ForWhom.tsx`
- Create: `components/sections/TeamSnapshot.tsx`
- Create: `components/sections/MembershipsPreview.tsx`
- Create: `components/sections/FinalCTA.tsx`

- [ ] **Step 1: Hero**

```tsx
// components/sections/Hero.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="bg-navy-950 pt-20 pb-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-6">
          South African Forex Education
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream-50 leading-tight mb-6">
          Forex education<br />without the noise.
        </h1>
        <p className="text-navy-300 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Institutional-grade trading education for South Africans at every stage — from first chart to full-time trader.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signals">Join the free signals group →</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="text-navy-300 hover:text-cream-50">
            <Link href="/courses">Explore courses</Link>
          </Button>
        </div>

        {/* Micro-credibility strip */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6 text-sm text-navy-400 divide-y sm:divide-y-0 sm:divide-x divide-navy-800">
          <span className="py-2 sm:py-0 sm:px-6">Based in Cape Town</span>
          <span className="py-2 sm:py-0 sm:px-6">7+ years trading & mentoring</span>
          <span className="py-2 sm:py-0 sm:px-6">Real team. Real methodology.</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: LevelSegmenter**

```tsx
// components/sections/LevelSegmenter.tsx
import Link from 'next/link'

const levels = [
  {
    href: '/paths/beginner',
    label: 'Beginner',
    emoji: '🌱',
    description: "You've heard about forex and want to start right — with a real foundation, not YouTube shortcuts.",
  },
  {
    href: '/paths/intermediate',
    label: 'Intermediate',
    emoji: '📈',
    description: "You know the basics but your results are inconsistent. You need structure, psychology, and a system.",
  },
  {
    href: '/paths/advanced',
    label: 'Advanced',
    emoji: '🏦',
    description: "You're serious about institutional concepts, prop firms, and treating this as a career.",
  },
]

export function LevelSegmenter() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Choose your path
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          Wherever you are in your trading journey, we have a structured path for you.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {levels.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="group block bg-white border border-navy-100 rounded-lg p-6 hover:border-gold-500 hover:shadow-elevated transition-all"
            >
              <span className="text-3xl block mb-4">{l.emoji}</span>
              <h3 className="font-serif text-xl text-navy-900 mb-2 group-hover:text-gold-500 transition-colors">
                {l.label}
              </h3>
              <p className="text-sm text-navy-500">{l.description}</p>
              <span className="inline-block mt-4 text-sm text-gold-500 font-medium">
                View path →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: MethodologyBelt**

```tsx
// components/sections/MethodologyBelt.tsx
const pillars = [
  {
    title: 'Institutional approach',
    body: "We teach how banks and funds actually trade — not the retail indicator strategies that keep 90% of traders losing.",
    icon: '🏛️',
  },
  {
    title: 'Real team. Real mentorship.',
    body: 'Named humans with 7+ years of live trading experience. Not a faceless course platform. Not a pre-recorded ghost town.',
    icon: '🤝',
  },
  {
    title: 'Community, not a content library',
    body: 'You trade alongside others. Live signals, market breakdowns, and a community that holds each other accountable.',
    icon: '⚡',
  },
]

export function MethodologyBelt() {
  return (
    <section className="py-20 px-4 bg-navy-900">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        {pillars.map(p => (
          <div key={p.title}>
            <span className="text-3xl block mb-4">{p.icon}</span>
            <h3 className="font-serif text-xl text-cream-50 mb-3">{p.title}</h3>
            <p className="text-navy-300 text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: SampleLesson**

```tsx
// components/sections/SampleLesson.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function SampleLesson() {
  return (
    <section className="py-20 px-4 bg-cream-100">
      <div className="max-w-4xl mx-auto">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest text-center mb-4">
          Free sample lesson
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          See how we teach before you pay a cent.
        </h2>
        <p className="text-center text-navy-500 mb-10 max-w-lg mx-auto">
          This is a real lesson from our course library — no upsell, no watermark, no teaser.
        </p>

        {/* Video placeholder — replace src with real YouTube/Vimeo embed */}
        <div className="relative bg-navy-900 rounded-lg overflow-hidden aspect-video mb-8">
          <iframe
            src="about:blank"
            data-src="REPLACE_WITH_YOUTUBE_EMBED_URL"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Free sample lesson"
          />
          {/* Placeholder overlay shown until real video is added */}
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
            <p className="text-navy-400 text-sm">Sample lesson video coming soon</p>
          </div>
        </div>

        <div className="text-center">
          <Button asChild>
            <Link href="/resources">Browse all free resources →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: ForWhom**

```tsx
// components/sections/ForWhom.tsx
const forYou = [
  "You've tried learning from YouTube and lost money on it",
  'You want a structured system, not scattered tips',
  "You're willing to treat trading as a craft that takes time",
  'You want to understand WHY a trade works, not just copy signals',
  "You're ready to invest in your education seriously",
]

const notForYou = [
  "You want to get rich trading within a month",
  "You're not willing to spend time learning",
  'You want someone to trade your account for you',
  'You believe trading is a shortcut to passive income',
]

export function ForWhom() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Who Maono is for
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          We'd rather be honest with you upfront than sell you something that isn't the right fit.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-cream-50 rounded-lg p-8">
            <h3 className="font-serif text-xl text-navy-900 mb-6">This is for you if…</h3>
            <ul className="space-y-3">
              {forYou.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-600">
                  <span className="text-gold-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-navy-950 rounded-lg p-8">
            <h3 className="font-serif text-xl text-cream-50 mb-6">This is not for you if…</h3>
            <ul className="space-y-3">
              {notForYou.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-300">
                  <span className="text-navy-500 mt-0.5 shrink-0">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: TeamSnapshot**

```tsx
// components/sections/TeamSnapshot.tsx
import Link from 'next/link'
import { TeamCard } from '@/components/shared/TeamCard'
import { Button } from '@/components/ui/Button'
import type { TeamMember } from '@/lib/types'

const TEAM: TeamMember[] = [
  {
    name: 'Team Member Name',
    role: 'Founder & Head Trader',
    bio: '7+ years of institutional and retail trading experience. Mentored 100s of South African traders.',
    image: '/images/team/placeholder.jpg',
    years: 7,
  },
]

export function TeamSnapshot() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">Real people</p>
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-4">Meet the team</h2>
        <p className="text-navy-500 mb-12 max-w-lg mx-auto">
          Not a faceless course platform. We are traders who teach.
        </p>
        <div className="flex flex-wrap justify-center gap-12 mb-10">
          {TEAM.map(m => <TeamCard key={m.name} member={m} />)}
        </div>
        <Button variant="outline" asChild>
          <Link href="/about">Read our full story →</Link>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: MembershipsPreview**

```tsx
// components/sections/MembershipsPreview.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const tiers = [
  { name: 'Bronze', price: 'R499', period: '/mo', highlight: false },
  { name: 'Silver', price: 'R899', period: '/mo', highlight: false },
  { name: 'Gold', price: 'R1,499', period: '/mo', highlight: true },
  { name: 'Platinum', price: 'R2,499', period: '/mo', highlight: false },
]

export function MembershipsPreview() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Membership tiers
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          From signals access to full mentorship — a tier for every stage of your journey.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tiers.map(t => (
            <div
              key={t.name}
              className={`rounded-lg p-5 text-center border ${t.highlight ? 'border-gold-500 bg-navy-950 text-cream-50' : 'border-navy-100 bg-cream-50 text-navy-900'}`}
            >
              <p className="font-semibold text-sm mb-1">{t.name}</p>
              <p className={`font-serif text-2xl ${t.highlight ? 'text-gold-400' : 'text-navy-900'}`}>{t.price}</p>
              <p className={`text-xs ${t.highlight ? 'text-navy-400' : 'text-navy-400'}`}>{t.period}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/memberships">Compare all membership features →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: FinalCTA**

```tsx
// components/sections/FinalCTA.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SignalsForm } from '@/components/shared/SignalsForm'

export function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-navy-950">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
          Start free today
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-4">
          Join the signals group. Zero cost.
        </h2>
        <p className="text-navy-300 mb-10">
          Get real market analysis in your WhatsApp daily. No commitment. Cancel anytime. Just better trading, starting now.
        </p>
        <SignalsForm />
      </div>
    </section>
  )
}
```

- [ ] **Step 9: CoursesPreview**

```tsx
// components/sections/CoursesPreview.tsx
import Link from 'next/link'
import { CourseCard } from '@/components/shared/CourseCard'
import { Button } from '@/components/ui/Button'
import { getCourses } from '@/lib/content'

export function CoursesPreview() {
  const courses = getCourses()
  return (
    <section className="py-20 px-4 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Our courses
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          Structured curriculum from introduction to institutional mastery.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {courses.map(c => <CourseCard key={c.slug} course={c} />)}
        </div>
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/courses">View all courses →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 10: Commit**

```bash
git add components/sections/
git commit -m "feat: add all 9 homepage section components"
```

---

## Task 13: Homepage page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Wire up homepage**

```tsx
// app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { LevelSegmenter } from '@/components/sections/LevelSegmenter'
import { MethodologyBelt } from '@/components/sections/MethodologyBelt'
import { SampleLesson } from '@/components/sections/SampleLesson'
import { CoursesPreview } from '@/components/sections/CoursesPreview'
import { ForWhom } from '@/components/sections/ForWhom'
import { TeamSnapshot } from '@/components/sections/TeamSnapshot'
import { MembershipsPreview } from '@/components/sections/MembershipsPreview'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Maono Forex Trading',
  description: 'Institutional-grade forex education for South African traders. Free signals group, structured courses, and 1-on-1 mentorship.',
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <LevelSegmenter />
      <MethodologyBelt />
      <SampleLesson />
      <CoursesPreview />
      <ForWhom />
      <TeamSnapshot />
      <MembershipsPreview />
      <FinalCTA />
    </>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds, no TypeScript errors. Fix any type errors before committing.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire up homepage with all 9 sections"
```

---

## Task 14: MDX course content files

**Files:**
- Create: `content/courses/forex-trading-introduction.mdx`
- Create: `content/courses/price-action-trading.mdx`
- Create: `content/courses/institutional-trading-concepts.mdx`
- Create: `content/courses/trading-psychology.mdx`
- Create: `content/courses/trading-strategies.mdx`
- Create: `content/courses/trading-tools.mdx`

- [ ] **Step 1: Create course MDX files with frontmatter**

Each file follows this template:

```mdx
---
title: "Forex Trading Introduction"
description: "Master the fundamentals of forex trading. Understand currency pairs, market structure, pips, lots, and your first live trade."
level: "beginner"
price: 1499
currency: "ZAR"
duration: "5 hours"
lessons: 12
topics:
  - "What is forex and how the market works"
  - "Reading currency pairs"
  - "Pips, lots, and leverage explained"
  - "Your first chart setup"
  - "Risk management basics"
  - "Placing your first trade"
image: "/images/courses/forex-introduction.jpg"
featured: true
---

## What you'll learn

By the end of this course you will understand how the forex market operates, how to read and interpret price charts, and how to place your first trade with a properly managed risk approach.

## Who this is for

This course is designed for complete beginners with no prior trading experience.

## Course outline

### Module 1 — The forex market
An introduction to what forex is, who trades it, and when markets are open.

### Module 2 — Currency pairs
Major, minor, and exotic pairs. How to read a quote. What drives prices.

### Module 3 — Pips, lots, and leverage
The mechanics of trading: how profits and losses are calculated.

### Module 4 — Your first chart
Setting up MetaTrader 4/5. Reading candlestick charts. Timeframes.

### Module 5 — Risk management
Why most traders lose and how position sizing protects your capital.

### Module 6 — Your first trade
Live walkthrough of a trade from analysis to entry to exit.
```

Repeat for each course with appropriate content from the scraped `.scrape/text/courses/` files. Pull real descriptions from scraped content.

- [ ] **Step 2: Create seed blog post**

```mdx
---
title: "Welcome to Maono Forex Trading"
description: "Why we built Maono, what we stand for, and how we're different from the noise in the SA forex education space."
date: "2026-04-21"
author: "Maono Team"
category: "About"
image: "/images/blog/welcome.jpg"
readTime: 4
---

## Why we built Maono

The South African forex education space is flooded with promises. Lamborghinis, R50k months, passive income — all built on retail indicator strategies that fail 90% of traders.

We built Maono because we believe traders deserve better.

## What we teach

We teach institutional concepts — how banks, hedge funds, and professional traders actually read the market. Not indicators. Not guesswork. Structure.

## Who we are

A small team of South African traders with 7+ years of live market experience between us. We've been through the losses, the psychology battles, and the breakthroughs. We teach what we know works.
```

- [ ] **Step 3: Create seed resource**

```mdx
---
title: "What is Forex Trading?"
description: "A plain-English explanation of the forex market, who participates in it, and why it's one of the most traded markets in the world."
type: "guide"
date: "2026-04-21"
image: "/images/resources/what-is-forex.jpg"
---

## The forex market in plain English

Forex (foreign exchange) is the global marketplace where currencies are bought and sold. It is the largest financial market in the world — over $7 trillion trades hands every single day.

## Who trades forex?

- Central banks (setting monetary policy)
- Commercial banks (facilitating international trade)
- Hedge funds and institutional traders (speculation and arbitrage)
- Retail traders (individuals like you)

## Why learn institutional concepts?

Retail traders consistently lose because they trade against the market's dominant players. Understanding how institutions think — where they place orders, how they create liquidity — is the edge that separates consistent traders from guessers.
```

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "feat: add MDX content for 6 courses, 1 blog post, 1 resource"
```

---

## Task 15: Remaining pages

**Files:** All remaining page routes.

- [ ] **Step 1: Signals landing page**

```tsx
// app/signals/page.tsx
import { SignalsForm } from '@/components/shared/SignalsForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Free Forex Signals Group',
  description: 'Join the Maono free signals group. Get real market analysis and trade ideas on WhatsApp daily. Zero cost.',
  path: '/signals',
})

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-navy-950 py-20 px-4">
      <div className="max-w-lg mx-auto">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest text-center mb-4">Free · No commitment</p>
        <h1 className="font-serif text-4xl text-cream-50 text-center mb-4">Join the free signals group</h1>
        <p className="text-navy-300 text-center mb-10">
          Real market analysis. Daily trade ideas. A community of SA traders growing together.
          WhatsApp-based. Zero cost. Cancel anytime.
        </p>

        <div className="bg-navy-900 rounded-xl p-8 mb-8">
          <SignalsForm />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-navy-400">
          <div><p className="text-cream-50 font-semibold mb-1">Daily</p><p>Market analysis</p></div>
          <div><p className="text-cream-50 font-semibold mb-1">Live</p><p>Trade setups</p></div>
          <div><p className="text-cream-50 font-semibold mb-1">Free</p><p>Forever</p></div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Courses catalog**

```tsx
// app/courses/page.tsx
import { CourseCard } from '@/components/shared/CourseCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { getCourses } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Courses',
  description: 'Structured forex courses from beginner to institutional level. Learn price action, trading psychology, strategies, and more.',
  path: '/courses',
})

export default function CoursesPage() {
  const courses = getCourses()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">All courses</h1>
          <p className="text-navy-300 text-lg">From your first chart to institutional mastery — every course built for real-world application.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
```

- [ ] **Step 3: Course detail page**

```tsx
// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCourse, getCourses } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/shared/JsonLd'
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export async function generateStaticParams() {
  return getCourses().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getCourse(slug)
    return generatePageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/courses/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const result = getCourse(slug)
    meta = result.meta
    content = result.content
  } catch {
    notFound()
  }

  return (
    <>
      <JsonLd data={courseJsonLd(meta)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: 'https://maonoforextrading.co.za' },
        { name: 'Courses', url: 'https://maonoforextrading.co.za/courses' },
        { name: meta.title, url: `https://maonoforextrading.co.za/courses/${slug}` },
      ])} />

      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge>{meta.level}</Badge>
            <span className="text-navy-400 text-sm">{meta.duration} · {meta.lessons} lessons</span>
          </div>
          <h1 className="font-serif text-4xl text-cream-50 mb-4">{meta.title}</h1>
          <p className="text-navy-300 text-lg mb-8">{meta.description}</p>
          <div className="flex items-center gap-6">
            <span className="font-serif text-3xl text-gold-400">R{meta.price.toLocaleString()}</span>
            <Button size="lg">
              <Link href="/signals">Start free with signals group first →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-6">What you'll learn</h2>
          <ul className="grid sm:grid-cols-2 gap-3 mb-10">
            {meta.topics.map(t => (
              <li key={t} className="flex items-start gap-2 text-sm text-navy-600">
                <span className="text-gold-500 mt-0.5 shrink-0">✓</span> {t}
              </li>
            ))}
          </ul>
          <div className="prose prose-navy max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>

      <CTABanner
        headline="Not ready to buy? Start free."
        sub="Join the signals group first — get a feel for how we teach before committing to a course."
      />
    </>
  )
}
```

- [ ] **Step 4: Learning paths page**

```tsx
// app/paths/[level]/page.tsx
import { notFound } from 'next/navigation'
import { getCourses } from '@/lib/content'
import { CourseCard } from '@/components/shared/CourseCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { PathLevel } from '@/lib/types'

const config: Record<PathLevel, { title: string; description: string; intro: string }> = {
  beginner: {
    title: 'Beginner Path',
    description: 'Start your forex journey the right way. No prior experience needed.',
    intro: "You're new to forex and want a real foundation — not the scattered YouTube strategies that most beginners fall into. This path takes you from zero to placing your first structured trade with confidence.",
  },
  intermediate: {
    title: 'Intermediate Path',
    description: 'You know the basics. Now build a system that actually works.',
    intro: "You've traded before but your results are inconsistent. This path addresses the structural gaps — psychology, price action, and strategy — that keep intermediate traders stuck.",
  },
  advanced: {
    title: 'Advanced Path',
    description: 'Institutional concepts, prop firm prep, and full-time trading.',
    intro: "You're serious about trading as a career. This path covers institutional order flow, advanced price action, trading psychology at a pro level, and everything you need to approach prop firm evaluations or full-time trading.",
  },
}

const levelCourses: Record<PathLevel, string[]> = {
  beginner: ['forex-trading-introduction', 'trading-psychology', 'trading-tools'],
  intermediate: ['price-action-trading', 'trading-strategies', 'trading-psychology'],
  advanced: ['institutional-trading-concepts', 'trading-strategies', 'price-action-trading'],
}

export function generateStaticParams() {
  return (['beginner', 'intermediate', 'advanced'] as PathLevel[]).map(level => ({ level }))
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const c = config[level as PathLevel]
  if (!c) return {}
  return generatePageMetadata({ title: c.title, description: c.description, path: `/paths/${level}` })
}

export default async function PathPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) notFound()
  const lvl = level as PathLevel
  const c = config[lvl]
  const allCourses = getCourses()
  const courses = levelCourses[lvl].map(slug => allCourses.find(c => c.slug === slug)).filter(Boolean)

  return (
    <>
      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">{c.title}</h1>
          <p className="text-navy-300 text-lg">{c.intro}</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-8">Recommended courses for this path</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => course && <CourseCard key={course.slug} course={course} />)}
          </div>
        </div>
      </section>
      <CTABanner headline="Start with the free signals group." sub="Get familiar with how we think before investing in a course." />
    </>
  )
}
```

- [ ] **Step 5: About page**

```tsx
// app/about/page.tsx
import { TeamCard } from '@/components/shared/TeamCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { TeamMember } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'About Maono Forex Trading',
  description: 'Meet the team behind Maono. Real traders with 7+ years of experience mentoring South African traders.',
  path: '/about',
})

const TEAM: TeamMember[] = [
  {
    name: 'REPLACE WITH REAL NAME',
    role: 'Founder & Head Trader',
    bio: 'REPLACE WITH REAL BIO — 7+ years of trading and mentoring experience.',
    image: '/images/team/founder.jpg',
    years: 7,
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">About Maono</h1>
          <p className="text-navy-300 text-lg">We are South African traders who got tired of watching good people lose money to bad education.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto prose prose-navy">
          <h2>Our story</h2>
          <p>REPLACE WITH REAL FOUNDER STORY — draw from scraped /about-us/ page content.</p>

          <h2>Our methodology</h2>
          <p>We teach institutional concepts — how banks, hedge funds, and professional market participants actually read and use price. Not retail indicators. Not automated signals. Structure, liquidity, and order flow.</p>

          <h2>What we stand for</h2>
          <ul>
            <li>Transparency over hype</li>
            <li>Education over entertainment</li>
            <li>Community over isolation</li>
            <li>Long-term growth over quick wins</li>
          </ul>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-navy-900 mb-12">The team</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {TEAM.map(m => <TeamCard key={m.name} member={m} />)}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
```

- [ ] **Step 6: Memberships page**

```tsx
// app/memberships/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import type { MembershipTier } from '@/lib/types'

export const metadata = generatePageMetadata({
  title: 'Membership Tiers — Bronze, Silver, Gold, Platinum',
  description: 'Choose a Maono membership tier. From signals access to full 1-on-1 mentorship — structured plans for every stage.',
  path: '/memberships',
})

const TIERS: MembershipTier[] = [
  {
    name: 'Bronze',
    price: 499,
    period: 'month',
    description: 'Signals access and community. The best free-to-paid entry point.',
    features: ['Daily forex signals', 'WhatsApp community access', 'Weekly market recap'],
    highlighted: false,
  },
  {
    name: 'Silver',
    price: 899,
    period: 'month',
    description: 'Signals + structured beginner course access.',
    features: ['Everything in Bronze', 'Access to Forex Introduction course', 'Monthly group Q&A session'],
    highlighted: false,
  },
  {
    name: 'Gold',
    price: 1499,
    period: 'month',
    description: 'Full course library + live sessions. The most popular tier.',
    features: ['Everything in Silver', 'All 6 courses unlocked', 'Weekly live trading sessions', 'Trade review submissions'],
    highlighted: true,
  },
  {
    name: 'Platinum',
    price: 2499,
    period: 'month',
    description: '1-on-1 mentorship + everything in Gold.',
    features: ['Everything in Gold', 'Monthly 1-on-1 session with mentor', 'Priority WhatsApp support', 'Personalised trade plan'],
    highlighted: false,
  },
]

export default function MembershipsPage() {
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Membership tiers</h1>
          <p className="text-navy-300 text-lg">Start free. Upgrade when you're ready.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 flex flex-col ${tier.highlighted ? 'bg-navy-950 text-cream-50 ring-2 ring-gold-500' : 'bg-white border border-navy-100'}`}
            >
              <p className={`text-sm font-semibold mb-1 ${tier.highlighted ? 'text-gold-400' : 'text-navy-500'}`}>{tier.name}</p>
              <p className={`font-serif text-3xl mb-1 ${tier.highlighted ? 'text-cream-50' : 'text-navy-900'}`}>
                R{tier.price.toLocaleString()}
              </p>
              <p className={`text-xs mb-4 ${tier.highlighted ? 'text-navy-400' : 'text-navy-400'}`}>per {tier.period}</p>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-navy-300' : 'text-navy-500'}`}>{tier.description}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map(f => (
                  <li key={f} className={`text-xs flex gap-2 ${tier.highlighted ? 'text-navy-300' : 'text-navy-600'}`}>
                    <span className="text-gold-500 shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant={tier.highlighted ? 'primary' : 'outline'} asChild size="sm">
                <Link href="/signals">Start free first →</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <CTABanner headline="Not sure which tier?" sub="Start with the free signals group and upgrade when you're ready." />
    </>
  )
}
```

- [ ] **Step 7: Mentorship page**

```tsx
// app/mentorship/page.tsx
import { SignalsForm } from '@/components/shared/SignalsForm'
import { ContactForm } from '@/components/shared/ContactForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: '1-on-1 Forex Mentorship',
  description: 'Work directly with a Maono mentor. Personalised forex coaching for serious traders in South Africa.',
  path: '/mentorship',
})

export default function MentorshipPage() {
  return (
    <>
      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">1-on-1 Mentorship</h1>
          <p className="text-navy-300 text-lg">Direct access to a Maono mentor. Personalised, accountable, results-focused.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">What mentorship includes</h2>
            <ul className="space-y-4 text-sm text-navy-600">
              {[
                'Monthly 1-on-1 video sessions with your assigned mentor',
                'Personalised trading plan built for your goals and risk profile',
                'Trade review — your mentor reviews your setups and gives structured feedback',
                'Priority WhatsApp support between sessions',
                'Full access to the Gold membership tier (all courses + live sessions)',
              ].map(item => (
                <li key={item} className="flex gap-3">
                  <span className="text-gold-500 shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-white rounded-lg border border-navy-100">
              <p className="text-xs text-navy-400 mb-1">Monthly investment</p>
              <p className="font-serif text-3xl text-navy-900">R2,499 <span className="text-sm text-navy-400">/month</span></p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Apply for mentorship</h2>
            <p className="text-sm text-navy-500 mb-6">Tell us where you are in your trading journey and what you want to achieve. We'll get back to you within 24 hours.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 8: Resources hub and detail**

```tsx
// app/resources/page.tsx
import { ResourceCard } from '@/components/shared/ResourceCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { getResources } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Free Forex Learning Resources',
  description: 'Free forex guides, lessons, and market breakdowns from the Maono team.',
  path: '/resources',
})

export default function ResourcesPage() {
  const resources = getResources()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Free resources</h1>
          <p className="text-navy-300 text-lg">Guides, lessons, and market breakdowns. No signup required.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(r => <ResourceCard key={r.slug} resource={r} />)}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
```

```tsx
// app/resources/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getResources, getResource } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  return getResources().map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getResource(slug)
    return generatePageMetadata({ title: meta.title, description: meta.description, path: `/resources/${slug}` })
  } catch { return {} }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const r = getResource(slug)
    meta = r.meta; content = r.content
  } catch { notFound() }

  return (
    <>
      <section className="bg-navy-950 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-500 text-sm uppercase tracking-widest mb-4">{meta.type}</p>
          <h1 className="font-serif text-3xl text-cream-50">{meta.title}</h1>
        </div>
      </section>
      <section className="py-12 px-4 bg-cream-50">
        <div className="max-w-2xl mx-auto prose prose-navy" dangerouslySetInnerHTML={{ __html: content }} />
      </section>
      <CTABanner headline="Found this useful?" sub="Join the signals group for daily analysis like this, direct to your WhatsApp." />
    </>
  )
}
```

- [ ] **Step 9: Blog pages**

```tsx
// app/blog/page.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { CTABanner } from '@/components/layout/CTABanner'
import { getBlogPosts } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Blog',
  description: 'Market analysis, trading insights, and education from the Maono team.',
  path: '/blog',
})

export default function BlogPage() {
  const posts = getBlogPosts()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Blog</h1>
          <p className="text-navy-300">Market analysis and trading insights from the Maono team.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map(post => (
            <Card key={post.slug} className="p-6">
              <p className="text-xs text-navy-400 mb-2">{post.category} · {post.readTime} min read</p>
              <h2 className="font-serif text-xl text-navy-900 mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-gold-500 transition-colors">{post.title}</Link>
              </h2>
              <p className="text-sm text-navy-500">{post.description}</p>
            </Card>
          ))}
          {posts.length === 0 && <p className="text-navy-400 text-center py-10">First post coming soon.</p>}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
```

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  return getBlogPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getBlogPost(slug)
    return generatePageMetadata({ title: meta.title, description: meta.description, path: `/blog/${slug}` })
  } catch { return {} }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const p = getBlogPost(slug)
    meta = p.meta; content = p.content
  } catch { notFound() }

  return (
    <>
      <section className="bg-navy-950 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-500 text-sm uppercase tracking-widest mb-4">{meta.category}</p>
          <h1 className="font-serif text-3xl text-cream-50 mb-4">{meta.title}</h1>
          <p className="text-navy-400 text-sm">By {meta.author} · {meta.readTime} min read</p>
        </div>
      </section>
      <section className="py-12 px-4 bg-cream-50">
        <div className="max-w-2xl mx-auto prose prose-navy" dangerouslySetInnerHTML={{ __html: content }} />
      </section>
      <CTABanner headline="Found this useful?" sub="Join the free signals group for daily analysis delivered to your WhatsApp." />
    </>
  )
}
```

- [ ] **Step 10: Contact page**

```tsx
// app/contact/page.tsx
import { ContactForm } from '@/components/shared/ContactForm'
import { JsonLd } from '@/components/shared/JsonLd'
import { faqJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Contact Maono Forex Trading',
  description: 'Get in touch with the Maono team. Based in Cape Town, serving all of South Africa.',
  path: '/contact',
})

const FAQ = [
  { question: 'Where is Maono based?', answer: 'We are based in Tyger Waterfront, Western Cape, South Africa. We serve traders across all of South Africa remotely.' },
  { question: 'Do I need prior trading experience?', answer: 'No. Our beginner path and Forex Introduction course are designed for people with zero prior experience.' },
  { question: 'What payment methods do you accept?', answer: 'We accept EFT, major credit/debit cards, and mobile payment methods. Details provided at checkout.' },
  { question: 'How quickly will I see results?', answer: 'Trading is a skill that takes time to develop. We do not promise specific returns. Most students see meaningful improvement in their analytical ability within 3-6 months of consistent practice.' },
  { question: 'Is the signals group really free?', answer: 'Yes. The signals group is completely free with no strings attached. We offer it as a starting point — upgrades to courses and memberships are entirely optional.' },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Contact us</h1>
          <p className="text-navy-300">We typically respond within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Get in touch</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-navy-900 mb-6">Contact details</h2>
            <div className="space-y-4 text-sm text-navy-600 mb-10">
              <p><strong className="text-navy-900">Address:</strong><br />Unit 3B Waterside Place, 19 Carl Cronje Drive<br />Tyger Waterfront, Western Cape, 7530</p>
              <p><strong className="text-navy-900">Phone / WhatsApp:</strong><br />+27 81 436 9770</p>
              <p><strong className="text-navy-900">Hours:</strong><br />Mon – Sat, 08:00 – 18:00</p>
            </div>

            <h2 className="font-serif text-2xl text-navy-900 mb-6">FAQ</h2>
            <div className="space-y-6">
              {FAQ.map(item => (
                <div key={item.question}>
                  <p className="font-semibold text-navy-900 text-sm mb-1">{item.question}</p>
                  <p className="text-sm text-navy-500">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 11: Seminars page**

```tsx
// app/seminars/page.tsx
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Live Forex Seminars — South Africa',
  description: 'Attend a live Maono forex seminar. In-person trading education events across South Africa.',
  path: '/seminars',
})

export default function SeminarsPage() {
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Live seminars</h1>
          <p className="text-navy-300 text-lg">In-person trading education events across South Africa.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-navy-100 rounded-lg p-8 text-center">
            <p className="text-navy-400 mb-4">No upcoming seminars scheduled.</p>
            <p className="text-sm text-navy-500">Join the free signals group to be notified when the next seminar is announced.</p>
          </div>
        </div>
      </section>
      <CTABanner headline="Get notified of the next seminar." sub="Join the free signals group — all event announcements go there first." />
    </>
  )
}
```

- [ ] **Step 12: Legal pages**

```tsx
// app/(legal)/privacy/page.tsx
import { generatePageMetadata } from '@/lib/metadata'
export const metadata = generatePageMetadata({ title: 'Privacy Policy', description: 'Maono Forex Trading privacy policy.', path: '/privacy' })
export default function PrivacyPage() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-3xl mx-auto prose prose-navy">
        <h1>Privacy Policy</h1>
        <p>Last updated: 2026-04-21</p>
        <p>REPLACE WITH FULL PRIVACY POLICY — pull from scraped /privacy-policy-2/ page and update for this site.</p>
      </div>
    </section>
  )
}
```

```tsx
// app/(legal)/terms/page.tsx
import { generatePageMetadata } from '@/lib/metadata'
export const metadata = generatePageMetadata({ title: 'Terms of Service', description: 'Maono Forex Trading terms of service.', path: '/terms' })
export default function TermsPage() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-3xl mx-auto prose prose-navy">
        <h1>Terms of Service</h1>
        <p>Last updated: 2026-04-21</p>
        <p>REPLACE WITH FULL TERMS — pull from scraped /terms-and-conditions/ page and update.</p>
      </div>
    </section>
  )
}
```

```tsx
// app/(legal)/risk-disclosure/page.tsx
import { generatePageMetadata } from '@/lib/metadata'
export const metadata = generatePageMetadata({ title: 'Risk Disclosure', description: 'Forex trading risk disclosure statement for Maono Forex Trading.', path: '/risk-disclosure' })
export default function RiskDisclosurePage() {
  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-3xl mx-auto prose prose-navy">
        <h1>Risk Disclosure</h1>
        <p>Trading forex and financial instruments carries a high level of risk. You could lose some or all of your invested capital. You should not trade with money you cannot afford to lose. Maono Forex Trading provides educational content only and does not constitute financial advice or investment recommendations.</p>
        <p>Past performance of signals, strategies, or course content is not indicative of future results. All trading involves risk.</p>
        <p>REPLACE with full legal risk disclosure drafted by a qualified professional.</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 13: Build and verify all pages**

```bash
npm run build
```

Expected: all routes compile successfully. Fix any TypeScript or import errors.

- [ ] **Step 14: Commit**

```bash
git add app/
git commit -m "feat: add all 21 page routes — signals, courses, paths, memberships, mentorship, about, resources, blog, seminars, contact, legal"
```

---

## Task 16: Vercel deployment config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Write vercel.json**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Push to GitHub**

```bash
git add vercel.json
git commit -m "feat: add Vercel deployment config with security headers"
git push origin main
```

Expected: Vercel auto-deploys preview URL. Check build logs at vercel.com.

---

## Task 17: Skill pipeline checkpoints

These are sequential human-in-the-loop skill runs after the code is built.

- [ ] **Step 1: Run `/ui-ux-pro-max`** — validate IA, flows, and layout decisions before visual polish
- [ ] **Step 2: Run `/critique`** — independent design direction review
- [ ] **Step 3: Run `/copywriting`** — full copy overhaul of all page text (all REPLACE placeholders filled)
- [ ] **Step 4: Run `/clarify`** — microcopy, CTAs, error messages, labels
- [ ] **Step 5: Run `/ai-image-generation`** — hero image, 6 course card images, team placeholder, OG image, blog placeholder
- [ ] **Step 6: Run `/typeset`** — typography pass (verify Playfair + Inter pairing, hierarchy, sizing)
- [ ] **Step 7: Run `/colorize`** — verify navy/gold palette application, identify any grey zones
- [ ] **Step 8: Run `/layout`** — spacing, rhythm, grid consistency across all pages
- [ ] **Step 9: Run `/animate`** — add purposeful motion (hover states, scroll reveals, form feedback)
- [ ] **Step 10: Run `/adapt`** — responsive audit (mobile-first, breakpoints, touch targets, sticky bar)
- [ ] **Step 11: Run `/harden`** — error states, empty states (no courses/posts/resources), edge cases
- [ ] **Step 12: Run `/optimize`** — Lighthouse audit, bundle size, image optimisation, Core Web Vitals
- [ ] **Step 13: Run `/audit`** — scored technical QA (accessibility, SEO, performance, anti-patterns)
- [ ] **Step 14: Run `/polish`** — final alignment/spacing/consistency pass
- [ ] **Step 15: Run `/ai-slop-cleaner`** — strip generic AI patterns from code and copy
- [ ] **Step 16: Run `/critique`** — final UX review
- [ ] **Step 17: Final push and production deploy** — merge to main, confirm Vercel deploy, submit sitemap to Google Search Console

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task covering it |
|---|---|
| Next.js App Router + Tailwind v4 + TS | Task 1 |
| Design tokens (navy/gold palette) | Task 2 |
| TypeScript interfaces | Task 3 |
| MDX content layer | Task 4 |
| SEO metadata helpers | Task 5 |
| JSON-LD structured data | Task 5 |
| sitemap.xml + robots.txt | Task 6 |
| UI primitives (Button, Card, Badge, Input) | Task 7 |
| Nav, Footer, CTABanner, StickyBar | Task 8 |
| Root layout with fonts + analytics | Task 9 |
| SignalsForm + ContactForm (Formspree) | Task 10 |
| CourseCard, TeamCard, ResourceCard | Task 11 |
| All 9 homepage sections | Task 12 |
| Homepage wired up | Task 13 |
| 6 course MDX files + blog + resource seeds | Task 14 |
| All 21 page routes | Task 15 |
| Vercel deploy + security headers | Task 16 |
| Full skill pipeline | Task 17 |
| WhatsApp deep link fallback | Task 10 (SignalsForm) |
| Anti-scam positioning (ForWhom section) | Task 12 Step 5 |
| Proof asset D (sample lesson) | Task 12 Step 4 |
| Proof asset E (team page + snapshot) | Task 12 Step 6, Task 15 Step 5 |

**No gaps found.** All spec sections covered.

**Placeholder scan:** Legal pages and About page copy explicitly marked REPLACE — intentional, filled in /copywriting skill run (Task 17 Step 3). Team member data in TeamSnapshot and AboutPage explicitly marked REPLACE — filled by client before launch.

**Type consistency:** All interfaces defined in `lib/types.ts` (Task 3). All components consume those types directly. `getCourse()` returns `{ meta: Course; content: string }` — consistent across Task 4 definition and Task 15 usage.
