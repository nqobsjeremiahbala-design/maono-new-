// Import migrated WordPress (MasterStudy LMS) clients + their course access from
// the two phpMyAdmin CSV exports.
//
//   clients.csv     : wp_user_id,user_login,user_email,user_pass,display_name,user_registered
//   enrollments.csv : wp_user_id,user_email,course_id,status
//
// Only users who appear in enrollments.csv (i.e. have real course access) are
// imported — this drops the spam/bot signups that have no courses. Each user is
// created with their original WP password hash in legacyPasswordHash, so they
// sign in with their existing password (auth.ts handles phpass $P$ and $wp$bcrypt).
// Imported as STUDENT. Idempotent: safe to re-run (ON CONFLICT DO NOTHING).
//
// Usage:
//   node --env-file=.env.local scripts/import-wp-csv.mjs clients.csv enrollments.csv
//   DRY_RUN=1 node --env-file=.env.local scripts/import-wp-csv.mjs clients.csv enrollments.csv

import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import pg from 'pg'

const [clientsPath, enrollmentsPath] = process.argv.slice(2)
if (!clientsPath || !enrollmentsPath) {
  console.error('Usage: node --env-file=.env.local scripts/import-wp-csv.mjs <clients.csv> <enrollments.csv>')
  process.exit(1)
}
const DRY_RUN = process.env.DRY_RUN === '1'

// WordPress stm-courses post ID -> our course slug
const COURSE_MAP = {
  '868': 'forex-trading-introduction',
  '5404': 'institutional-trading-concepts',
  '5405': 'trading-psychology',
  '5406': 'trading-strategies',
  '5407': 'trading-tools',
  '5408': 'price-action-trading',
}

// RFC-4180-ish CSV parser: handles quoted fields, "" escapes, commas, CRLF.
function parseCSV(text) {
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
function toObjects(rows) {
  const header = rows[0]
  return rows.slice(1).filter((r) => r.length === header.length).map((r) =>
    Object.fromEntries(header.map((h, i) => [h, r[i]])),
  )
}

const clients = toObjects(parseCSV(readFileSync(clientsPath, 'utf8')))
const enrolls = toObjects(parseCSV(readFileSync(enrollmentsPath, 'utf8')))

const clientByEmail = new Map()
for (const c of clients) {
  const email = (c.user_email || '').trim().toLowerCase()
  if (email) clientByEmail.set(email, c)
}

// email -> set of our slugs
const enrollByEmail = new Map()
let unmappedCourses = 0
for (const e of enrolls) {
  const email = (e.user_email || '').trim().toLowerCase()
  const slug = COURSE_MAP[String(e.course_id).trim()]
  if (!email) continue
  if (!slug) { unmappedCourses++; continue }
  if (!enrollByEmail.has(email)) enrollByEmail.set(email, new Set())
  enrollByEmail.get(email).add(slug)
}

console.log(`Parsed: ${clients.length} client rows, ${enrolls.length} enrolment rows`)
console.log(`Distinct enrolled clients to import: ${enrollByEmail.size}`)
if (unmappedCourses) console.log(`(skipped ${unmappedCourses} enrolment rows with an unmapped course_id)`)
if (DRY_RUN) console.log('\n*** DRY RUN — no database writes ***\n')

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
const { rows: courseRows } = await db.query('select id, slug from courses')
const slugToId = Object.fromEntries(courseRows.map((c) => [c.slug, c.id]))

let usersImported = 0, usersExisting = 0, usersMissingRow = 0
let enrollsCreated = 0, enrollsExisting = 0
const missing = []

for (const [email, slugs] of enrollByEmail) {
  const c = clientByEmail.get(email)
  if (!c) { usersMissingRow++; missing.push(email); continue }

  const name = (c.display_name || c.user_login || '').trim() || null
  const pass = c.user_pass || null
  const reg = c.user_registered && !/^0000-/.test(c.user_registered) ? c.user_registered : null

  let userId
  if (DRY_RUN) {
    usersImported++ // assume new for counting
  } else {
    const res = await db.query(
      `insert into users (id, name, email, "passwordHash", "legacyPasswordHash", role, "emailVerified", "createdAt", "updatedAt")
       values ($1, $2, $3, NULL, $4, 'STUDENT', $5, now(), now())
       on conflict (email) do nothing returning id`,
      [randomUUID(), name, email, pass, reg],
    )
    if (res.rowCount > 0) { usersImported++; userId = res.rows[0].id }
    else {
      usersExisting++
      const r = await db.query('select id from users where lower(email) = lower($1)', [email])
      userId = r.rows[0]?.id
    }
    if (!userId) continue
  }

  for (const slug of slugs) {
    const courseId = slugToId[slug]
    if (!courseId) continue
    if (DRY_RUN) { enrollsCreated++; continue }
    const er = await db.query(
      `insert into enrollments (id, "userId", "courseId", "enrolledAt")
       values ($1, $2, $3, now()) on conflict ("userId", "courseId") do nothing returning id`,
      [randomUUID(), userId, courseId],
    )
    if (er.rowCount > 0) enrollsCreated++; else enrollsExisting++
  }
}

console.log(`\nUsers   : imported ${usersImported}, already-existing ${usersExisting}, missing client row ${usersMissingRow}`)
console.log(`Enrolments: created ${enrollsCreated}, already-existing ${enrollsExisting}`)
if (missing.length) {
  console.log(`\nEnrolled emails with no matching client row (${missing.length}):`)
  missing.slice(0, 20).forEach((m) => console.log('  - ' + m))
}
await db.end()
console.log('\nDone.')
