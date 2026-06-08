// Exports the authoritative client-entitlement spreadsheet: one row per client
// who has at least one course, with a clean column per course, their plan tier,
// course count, and access source (migrated vs purchased in-app).
// This is the SOURCE OF TRUTH — it mirrors the migrated WordPress entitlements.
//
// Plan tier (derived from course count): 6=Gold, 5=Silver, 3-4=Bronze, 1-2=Individual.
// Usage: node --env-file=.env.local scripts/export-entitlements.mjs [output.csv]

import { writeFileSync } from 'node:fs'
import pg from 'pg'

const OUT = process.argv[2] || 'C:\\Users\\Nqobile Bala\\Downloads\\maono-client-entitlements.csv'

// Course display order = learning sequence. Each becomes its own column.
const COURSES = [
  ['forex-trading-introduction', 'Forex Introduction'],
  ['price-action-trading', 'Price Action'],
  ['trading-tools', 'Trading Tools'],
  ['trading-strategies', 'Trading Strategies'],
  ['institutional-trading-concepts', 'Institutional Concepts'],
  ['trading-psychology', 'Trading Psychology'],
]
const planFor = (n) => (n >= 6 ? 'Gold' : n === 5 ? 'Silver' : n >= 3 ? 'Bronze' : 'Individual')
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()

const { rows } = await c.query(
  `select u.id, u.email, u.name, co.slug
   from enrollments en
   join users u on u.id = en."userId"
   join courses co on co.id = en."courseId"`,
)
// userIds that have a COMPLETE in-app purchase (vs migrated access)
const { rows: paid } = await c.query(`select distinct "userId" from purchases where status = 'COMPLETE'`)
const paidIds = new Set(paid.map((p) => p.userId))

const byId = new Map()
for (const r of rows) {
  if (!byId.has(r.id)) byId.set(r.id, { id: r.id, email: r.email, name: r.name, slugs: new Set() })
  byId.get(r.id).slugs.add(r.slug)
}

const records = [...byId.values()]
  .map((u) => ({
    email: u.email,
    name: u.name || '',
    count: u.slugs.size,
    plan: planFor(u.slugs.size),
    slugs: u.slugs,
    source: paidIds.has(u.id) ? 'Purchased (in-app)' : 'Migrated',
  }))
  .sort((a, b) => b.count - a.count || a.email.toLowerCase().localeCompare(b.email.toLowerCase()))

const header = ['Email', 'Name', 'Plan', 'Total Courses', ...COURSES.map(([, t]) => t), 'Access Source']
const lines = [header.map(cell).join(',')]
for (const r of records) {
  lines.push([
    cell(r.email),
    cell(r.name),
    cell(r.plan),
    r.count,
    ...COURSES.map(([slug]) => cell(r.slugs.has(slug) ? 'Yes' : '')),
    cell(r.source),
  ].join(','))
}
// UTF-8 BOM so Excel opens columns cleanly
writeFileSync(OUT, '﻿' + lines.join('\r\n'), 'utf8')

const byPlan = {}
for (const r of records) byPlan[r.plan] = (byPlan[r.plan] || 0) + 1
console.log(`Wrote ${records.length} clients to:\n  ${OUT}\n`)
console.log('Columns:', header.join(' | '))
console.log('\nBy plan:', ['Gold', 'Silver', 'Bronze', 'Individual'].map((p) => `${p}=${byPlan[p] || 0}`).join('  '))
console.log('In-app purchases:', records.filter((r) => r.source !== 'Migrated').length, '| Migrated:', records.filter((r) => r.source === 'Migrated').length)
await c.end()
