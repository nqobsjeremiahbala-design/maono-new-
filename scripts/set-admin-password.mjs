// Create or update an ADMIN account with a specific password (bcrypt-hashed).
// Only this email + password can log in as that user. Admins bypass the go-live
// enrollment gate, so this account can run the demo checkout and watch courses.
//
// Usage:
//   node --env-file=.env.local scripts/set-admin-password.mjs <email> <password> ["Full Name"]
//
// The password is taken as an argument and only the bcrypt HASH is stored — the
// plaintext is never written to disk or committed.

import pg from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'

const email = process.argv[2]
const password = process.argv[3]
const name = process.argv[4] || 'Admin'

if (!email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/set-admin-password.mjs <email> <password> ["Full Name"]')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()

const upd = await c.query(
  `update users set "passwordHash" = $1, "legacyPasswordHash" = null, role = 'ADMIN', "updatedAt" = now()
   where lower(email) = lower($2) returning email`,
  [hash, email],
)

if (upd.rowCount === 0) {
  await c.query(
    `insert into users (id, name, email, "passwordHash", role, "createdAt", "updatedAt")
     values ($1, $2, $3, $4, 'ADMIN', now(), now())`,
    [randomUUID(), name, email, hash],
  )
  console.log(`✓ Created ADMIN ${email}`)
} else {
  console.log(`✓ Updated ADMIN ${email} (password set)`)
}

await c.end()
