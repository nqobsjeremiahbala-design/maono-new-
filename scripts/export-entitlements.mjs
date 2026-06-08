// Exports the authoritative list of every client who has at least one course:
// email, name, course count, plan tier, and the exact courses they're entitled to.
// This is the SOURCE OF TRUTH — it mirrors the migrated WordPress entitlements.
//
// Plan tier is derived from the number of courses (Bronze=3, Silver=5, Gold=6):
//   6 -> Gold | 5 -> Silver | 3-4 -> Bronze | 1-2 -> Individual (below a bundle)
// (Platinum can't be derived — it's Gold + a mentorship service, not a course set.)
//
// Usage: node --env-file=.env.local scripts/export-entitlements.mjs [output.csv]

import { writeFileSync } from 'node:fs'
import pg from 'pg'

const OUT = process.argv[2] || 'C:\\Users\\Nqobile Bala\\Downloads\\maono-client-entitlements.csv'

const ORDER = [
  'forex-trading-introduction',
  'price-action-trading',
  'trading-tools',
  'trading-strategies',
  'institutional-trading-concepts',
  'trading-psychology',
]
const TITLE = {
  'forex-trading-introduction': 'Forex Trading Introduction',
  'price-action-trading': 'Price Action Trading',
  'trading-tools': 'Trading Tools',
  'trading-strategies': 'Trading Strategies',
  'institutional-trading-concepts': 'Institutional Trading Concepts',
  'trading-psychology': 'Trading Psychology',
}
const rank = (s) => { const i = ORDER.indexOf(s); return i === -1 ? 999 : i }
function planFor(n) {
  if (n >= 6) return 'Gold'
  if (n === 5) return 'Silver'
  if (n >= 3) return 'Bronze'
  return 'Individual'
}
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const { rows } = await c.query(
  `select u.email, u.name, u.role, co.slug
   from enrollments en
   join users u on u.id = en."userId"
   join courses co on co.id = en."courseId"`,
)

// group by email
const byEmail = new Map()
for (const r of rows) {
  const key = r.email.toLowerCase()
  if (!byEmail.has(key)) byEmail.set(key, { email: r.email, name: r.name, role: r.role, slugs: [] })
  byEmail.get(key).slugs.push(r.slug)
}

const records = [...byEmail.values()]
  .map((u) => {
    const slugs = [...new Set(u.slugs)].sort((a, b) => rank(a) - rank(b))
    return { email: u.email, name: u.name, role: u.role, count: slugs.length, plan: planFor(slugs.length), slugs }
  })
  .sort((a, b) => b.count - a.count || a.email.toLowerCase().localeCompare(b.email.toLowerCase()))

// CSV
const header = ['email', 'name', 'role', 'num_courses', 'plan', 'courses']
const lines = [header.join(',')]
for (const r of records) {
  lines.push([
    csvCell(r.email),
    csvCell(r.name),
    csvCell(r.role),
    r.count,
    csvCell(r.plan),
    csvCell(r.slugs.map((s) => TITLE[s] || s).join('; ')),
  ].join(','))
}
writeFileSync(OUT, lines.join('\r\n'), 'utf8')

// summary
const byPlan = {}
const byCount = {}
for (const r of records) {
  byPlan[r.plan] = (byPlan[r.plan] || 0) + 1
  byCount[r.count] = (byCount[r.count] || 0) + 1
}
console.log(`Wrote ${records.length} clients to:\n  ${OUT}\n`)
console.log('By plan tier:')
for (const p of ['Gold', 'Silver', 'Bronze', 'Individual']) if (byPlan[p]) console.log(`  ${p.padEnd(11)} ${byPlan[p]}`)
console.log('\nBy course count:')
for (let n = 6; n >= 1; n--) if (byCount[n]) console.log(`  ${n} course(s): ${byCount[n]} clients`)

// spot-check jamesfw81
const j = records.find((r) => r.email.toLowerCase() === 'jamesfw81@gmail.com')
if (j) console.log(`\njamesfw81@gmail.com -> ${j.count} courses (${j.plan}): ${j.slugs.map((s) => TITLE[s]).join(', ')}`)

await c.end()
