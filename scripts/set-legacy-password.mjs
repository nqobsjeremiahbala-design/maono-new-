// Sets a KNOWN password on a user using the WordPress phpass ($P$) format, so
// you can log in and exercise the exact legacy-WordPress verification path that
// real migrated clients use (verifyPhpass → re-hash to bcrypt on first login).
// Mainly for testing the migration. Generates a hash matching lib/phpass.ts.
//
// Usage: node --env-file=.env.local scripts/set-legacy-password.mjs <email> <password>

import { createHash, randomBytes } from 'node:crypto'
import pg from 'pg'

const ITOA64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function encode64(input) {
  let out = ''
  let i = 0
  const len = 16
  do {
    let v = input[i++]
    out += ITOA64[v & 0x3f]
    if (i < len) v |= input[i] << 8
    out += ITOA64[(v >> 6) & 0x3f]
    if (i++ >= len) break
    if (i < len) v |= input[i] << 16
    out += ITOA64[(v >> 12) & 0x3f]
    if (i++ >= len) break
    out += ITOA64[(v >> 18) & 0x3f]
  } while (i < len)
  return out
}
const md5 = (b) => createHash('md5').update(b).digest()

function phpassHash(password, countLog2 = 13) {
  let salt = ''
  for (let i = 0; i < 8; i++) salt += ITOA64[randomBytes(1)[0] & 0x3f]
  const pass = Buffer.from(password, 'utf8')
  const saltBuf = Buffer.from(salt, 'utf8')
  let count = 1 << countLog2
  let h = md5(Buffer.concat([saltBuf, pass]))
  do {
    h = md5(Buffer.concat([h, pass]))
  } while (--count)
  return '$P$' + ITOA64[countLog2] + salt + encode64(h)
}

const [email, password] = process.argv.slice(2)
if (!email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/set-legacy-password.mjs <email> <password>')
  process.exit(1)
}

const hash = phpassHash(password)

// Cross-check against our actual login verifier so we KNOW it'll pass at login.
const { verifyPhpass } = await import('../lib/phpass.ts')
if (!verifyPhpass(password, hash)) {
  console.error('Self-check FAILED — generated hash does not verify. Aborting.')
  process.exit(1)
}
console.log('phpass hash self-verifies against lib/phpass.ts ✓')

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const r = await c.query(
  `update users set "legacyPasswordHash" = $1, "passwordHash" = null, "updatedAt" = now()
   where lower(email) = lower($2) returning email, role`,
  [hash, email],
)
if (r.rowCount === 0) console.error(`No user with email ${email}`)
else console.log(`✓ Set WordPress-format password on ${r.rows[0].email} (${r.rows[0].role})`)
await c.end()
