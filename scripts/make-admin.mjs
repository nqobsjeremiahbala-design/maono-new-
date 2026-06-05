// Promote an existing user to ADMIN (or back to STUDENT) by email.
// Admins bypass the go-live enrollment gate, so this is how you create the
// account that can run the demo checkout and watch courses play.
//
// Usage:
//   node scripts/make-admin.mjs someone@example.com           -> ADMIN
//   node scripts/make-admin.mjs someone@example.com STUDENT   -> back to STUDENT
//
// The person must already have registered an account. Requires DATABASE_URL
// in the environment (.env / .env.local).

import pg from 'pg'

const email = process.argv[2]
const role = (process.argv[3] || 'ADMIN').toUpperCase()

if (!email) {
  console.error('Usage: node scripts/make-admin.mjs <email> [ADMIN|STUDENT]')
  process.exit(1)
}
if (role !== 'ADMIN' && role !== 'STUDENT') {
  console.error('Role must be ADMIN or STUDENT')
  process.exit(1)
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const r = await c.query('update users set role = $1 where lower(email) = lower($2) returning email, role', [
  role,
  email,
])
if (r.rowCount === 0) {
  console.error(`No user found with email ${email}. They must register first.`)
} else {
  console.log(`✓ ${r.rows[0].email} is now ${r.rows[0].role}`)
}
await c.end()
