// Builds ONE neat master spreadsheet that joins:
//   (a) live course access from our DB (the source of truth for what a client
//       can watch today), and
//   (b) the WordPress/WooCommerce purchase history CSV (what they actually paid).
//
// One row per client. Every field is its own column with a heading.
// Usage: node --env-file=.env.local scripts/build-client-master.mjs [purchases.csv] [out.csv]

import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'

const PURCHASES_IN = process.argv[2] || 'C:\\Users\\Nqobile Bala\\Downloads\\wpwy_posts.csv'
const OUT = process.argv[3] || 'C:\\Users\\Nqobile Bala\\Downloads\\maono-clients-master.csv'

const COURSES = [
  ['forex-trading-introduction', 'Forex Introduction'],
  ['price-action-trading', 'Price Action'],
  ['trading-tools', 'Trading Tools'],
  ['trading-strategies', 'Trading Strategies'],
  ['institutional-trading-concepts', 'Institutional Concepts'],
  ['trading-psychology', 'Trading Psychology'],
]
const planFor = (n) => (n >= 6 ? 'Gold' : n === 5 ? 'Silver' : n >= 3 ? 'Bronze' : n >= 1 ? 'Individual' : '')
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
const norm = (e) => (e || '').trim().toLowerCase()

// Tier ranking for "highest plan purchased".
const TIERS = [
  [/platinum/i, 4, 'Platinum'],
  [/gold/i, 3, 'Gold'],
  [/silver/i, 2, 'Silver'],
  [/bronze/i, 1, 'Bronze'],
]
const tierOf = (item) => {
  for (const [re, rank, name] of TIERS) if (re.test(item)) return { rank, name }
  return { rank: 0, name: 'Other' }
}

// --- minimal RFC-4180 CSV line parser (handles quoted fields) ---
function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQ = false
      } else field += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') { /* skip */ }
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

// --- 1. live course access from DB ---
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const { rows: enr } = await c.query(
  `select u.email, u.name, co.slug
   from enrollments en
   join users u on u.id = en."userId"
   join courses co on co.id = en."courseId"`,
)
await c.end()

const clients = new Map() // emailLower -> { email, name, slugs:Set }
for (const r of enr) {
  const k = norm(r.email)
  if (!clients.has(k)) clients.set(k, { email: r.email, name: r.name || '', slugs: new Set() })
  clients.get(k).slugs.add(r.slug)
}

// --- 2. purchase history (aggregate per email) ---
const rows = parseCsv(readFileSync(PURCHASES_IN, 'utf8'))
const header = rows.shift() // order_id,order_date,status,email,name,total,items_purchased
const purchases = new Map() // emailLower -> aggregate
for (const r of rows) {
  if (!r || r.length < 7) continue
  const [, date, status, email, name, total, items] = r
  const k = norm(email)
  if (!k) continue
  if (!purchases.has(k))
    purchases.set(k, { email, name, total: 0, completed: 0, all: 0, bestTier: { rank: -1, name: '' }, bestItem: '', lastDate: '' })
  const p = purchases.get(k)
  p.all++
  if ((status || '').toLowerCase() === 'completed') {
    p.completed++
    p.total += parseFloat(total) || 0
    if (date > p.lastDate) p.lastDate = date
    const t = tierOf(items || '')
    if (t.rank > p.bestTier.rank) { p.bestTier = t; p.bestItem = items || '' }
  }
}

// --- 3. join: base = every client with access, then append paid-but-no-access ---
const out = []
for (const [k, cl] of clients) {
  const p = purchases.get(k)
  out.push({
    email: cl.email,
    name: cl.name || (p?.name ?? ''),
    plan: planFor(cl.slugs.size),
    count: cl.slugs.size,
    slugs: cl.slugs,
    completed: p ? (p.completed > 0 ? 'Yes' : 'No') : 'No',
    planPurchased: p && p.completed > 0 ? (p.bestTier.name === 'Other' ? p.bestItem : p.bestTier.name) : '',
    paid: p && p.completed > 0 ? p.total.toFixed(2) : '',
    lastDate: p ? p.lastDate : '',
    orders: p ? p.all : 0,
  })
}
// completed-purchase emails that have NO current access (paid but no course)
let paidNoAccess = 0
for (const [k, p] of purchases) {
  if (clients.has(k) || p.completed === 0) continue
  paidNoAccess++
  out.push({
    email: p.email, name: p.name, plan: 'NO ACCESS', count: 0, slugs: new Set(),
    completed: 'Yes',
    planPurchased: p.bestTier.name === 'Other' ? p.bestItem : p.bestTier.name,
    paid: p.total.toFixed(2), lastDate: p.lastDate, orders: p.all,
  })
}

out.sort((a, b) => b.count - a.count || a.email.toLowerCase().localeCompare(b.email.toLowerCase()))

const head = [
  'Email', 'Name', 'Current Plan (access)', 'Total Courses',
  ...COURSES.map(([, t]) => t),
  'Completed Purchase', 'Plan Purchased', 'Amount Paid (ZAR)', 'Last Purchase Date', 'Total Orders',
]
const lines = [head.map(cell).join(',')]
for (const r of out) {
  lines.push([
    cell(r.email), cell(r.name), cell(r.plan), r.count,
    ...COURSES.map(([slug]) => cell(r.slugs.has(slug) ? 'Yes' : '')),
    cell(r.completed), cell(r.planPurchased), cell(r.paid), cell(r.lastDate), r.orders,
  ].join(','))
}
writeFileSync(OUT, '﻿' + lines.join('\r\n'), 'utf8') // BOM for Excel

const withAccess = out.filter((r) => r.count > 0)
const paid = withAccess.filter((r) => r.completed === 'Yes').length
console.log(`Wrote ${out.length} rows to:\n  ${OUT}\n`)
console.log(`Columns (${head.length}): ${head.join(' | ')}\n`)
console.log(`Clients with course access: ${withAccess.length}`)
console.log(`  ...of those, with a COMPLETED WooCommerce purchase: ${paid}`)
console.log(`  ...with access but NO completed WooCommerce order (LMS/manual/migrated): ${withAccess.length - paid}`)
console.log(`Paid (completed) but NO current access — appended at bottom: ${paidNoAccess}`)
