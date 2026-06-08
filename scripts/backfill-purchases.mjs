// Back-fill historical COMPLETED WooCommerce orders into the purchases table so
// the admin dashboard ("Paid Orders" / Revenue) and Purchases page reflect real
// payment history. Idempotent: each order becomes purchase id `wc_<order_id>`.
//
// Rules: only status=completed AND amount > 0 (skips R0 comps/tests). Each order
// is matched to a user by email (case-insensitive); orders with no matching user
// are skipped and reported. Also removes the fake demo purchase.
//
// Usage: node --env-file=.env.local scripts/backfill-purchases.mjs [--commit]
//   (dry-run by default; pass --commit to write)

import { readFileSync } from 'node:fs'
import pg from 'pg'

const COMMIT = process.argv.includes('--commit')
const CSV = 'C:\\Users\\Nqobile Bala\\Downloads\\wpwy_posts.csv'

const bundleFor = (item) =>
  /platinum/i.test(item) ? 'bundle-platinum'
  : /gold/i.test(item) ? 'bundle-gold'
  : /silver/i.test(item) ? 'bundle-silver'
  : /bronze/i.test(item) ? 'bundle-bronze'
  : `legacy:${item.slice(0, 40)}`

function parseCsv(text) {
  const rows = []
  let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false } else field += c }
    else if (c === '"') q = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') {}
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()

// email(lower) -> userId
const { rows: users } = await c.query('select id, email from users')
const byEmail = new Map(users.map((u) => [u.email.trim().toLowerCase(), u.id]))

const rows = parseCsv(readFileSync(CSV, 'utf8'))
rows.shift() // header

let created = 0, skippedNoUser = 0, skippedZero = 0, revenue = 0
const noUserEmails = []
for (const r of rows) {
  if (!r || r.length < 7) continue
  const [orderId, date, status, email, , total, items] = r
  if (status !== 'completed') continue
  const amount = parseFloat(total) || 0
  if (amount <= 0) { skippedZero++; continue }

  const userId = byEmail.get((email || '').trim().toLowerCase())
  if (!userId) { skippedNoUser++; noUserEmails.push(email); continue }

  const amountCents = Math.round(amount * 100)
  if (COMMIT) {
    await c.query(
      `insert into purchases (id, "userId", "itemKey", "amountCents", status, gateway, "paymentMethod", "paidAt", "createdAt", "updatedAt")
       values ($1,$2,$3,$4,'COMPLETE','woocommerce','woocommerce',$5,$5,now())
       on conflict (id) do update set "amountCents"=excluded."amountCents", status='COMPLETE',
         gateway='woocommerce', "paymentMethod"='woocommerce', "paidAt"=excluded."paidAt"`,
      [`wc_${orderId}`, userId, bundleFor(items), amountCents, new Date(date)],
    )
  }
  created++
  revenue += amount
}

let demoRemoved = 0
if (COMMIT) {
  const del = await c.query(`delete from purchases where "paymentMethod" = 'demo'`)
  demoRemoved = del.rowCount
}

console.log(`${COMMIT ? 'COMMITTED' : 'DRY RUN (pass --commit to write)'}`)
console.log(`Paid orders to back-fill: ${created}  (revenue R${revenue.toLocaleString('en-ZA')})`)
console.log(`Skipped — R0 comp/test orders: ${skippedZero}`)
console.log(`Skipped — no matching user account: ${skippedNoUser}`)
if (noUserEmails.length) console.log(`  (${noUserEmails.slice(0, 12).join(', ')}${noUserEmails.length > 12 ? '…' : ''})`)
if (COMMIT) console.log(`Demo purchases removed: ${demoRemoved}`)

if (COMMIT) {
  const { rows: tot } = await c.query(`select count(*)::int n, coalesce(sum("amountCents"),0)::bigint cents from purchases where status='COMPLETE'`)
  console.log(`\nNow in DB → Paid Orders: ${tot[0].n}  |  Revenue: R${(Number(tot[0].cents) / 100).toLocaleString('en-ZA')}`)
}
await c.end()
