// Import WordPress users (and their course enrolments) into our Postgres DB.
//
// USERS import works now: it copies each WP user with their original password
// hash into `legacyPasswordHash`, so they sign in with their existing WordPress
// password (our auth re-hashes to bcrypt on first login — handles phpass $P$ and
// WP6.8+ $wp$bcrypt). Users are imported as STUDENT (WP admins are listed but
// NOT auto-promoted — use scripts/make-admin.mjs for that).
//
// ENROLMENTS need one config block filled in after running scripts/wp-inspect.mjs
// (which LMS + the WP course-id → our-slug map). Until then, run with users only.
//
// Env:
//   Source (WP MySQL):  WP_DB_HOST WP_DB_PORT WP_DB_USER WP_DB_PASSWORD WP_DB_NAME
//   Dest (our Postgres): DATABASE_URL   (use: node --env-file=.env.local ...)
//   WP_LMS = none | tutor | learndash        (default: none)
//
// Usage:
//   node --env-file=.env.local scripts/import-wp.mjs              # users only
//   WP_LMS=tutor node --env-file=.env.local scripts/import-wp.mjs # users + enrolments

import mysql from 'mysql2/promise'
import pg from 'pg'
import { randomUUID } from 'node:crypto'

// ── CONFIG: fill in after wp-inspect ────────────────────────────────────────
// Map each WordPress course (post) ID to our course slug. Leave empty to skip
// enrolments. Example: { 42: 'forex-trading-introduction', 57: 'price-action-trading' }
const WP_COURSE_TO_SLUG = {}
const WP_LMS = (process.env.WP_LMS || 'none').toLowerCase() // none | tutor | learndash
// ────────────────────────────────────────────────────────────────────────────

const mysqlCfg = {
  host: process.env.WP_DB_HOST || '127.0.0.1',
  port: Number(process.env.WP_DB_PORT || 3306),
  user: process.env.WP_DB_USER || 'root',
  password: process.env.WP_DB_PASSWORD || '',
  database: process.env.WP_DB_NAME || 'wordpress',
}

const src = await mysql.createConnection(mysqlCfg)
const dst = new pg.Client({ connectionString: process.env.DATABASE_URL })
await dst.connect()
console.log(`Source: ${mysqlCfg.user}@${mysqlCfg.host}/${mysqlCfg.database}  →  Dest: Postgres`)

// Detect WP table prefix
const [[{ t: usersTable }]] = await src.query(
  `SELECT table_name t FROM information_schema.tables
   WHERE table_schema = ? AND table_name LIKE '%users' LIMIT 1`,
  [mysqlCfg.database],
)
const prefix = usersTable.replace(/users$/i, '')
const metaTable = `${prefix}usermeta`
console.log(`Prefix: ${prefix}`)

// ── 1. USERS ────────────────────────────────────────────────────────────────
const [wpUsers] = await src.query(
  `SELECT u.ID, u.user_login, u.user_email, u.user_pass, u.display_name, u.user_registered,
          (SELECT meta_value FROM \`${metaTable}\` m
           WHERE m.user_id = u.ID AND m.meta_key = '${prefix}capabilities' LIMIT 1) AS caps
   FROM \`${usersTable}\` u`,
)

let imported = 0
let skipped = 0
const wpIdToEmail = new Map()
const admins = []

for (const u of wpUsers) {
  const email = (u.user_email || '').trim().toLowerCase()
  if (!email) { skipped++; continue }
  wpIdToEmail.set(u.ID, email)
  if (u.caps && /"administrator"/.test(u.caps)) admins.push(email)

  const res = await dst.query(
    `INSERT INTO users (id, name, email, "passwordHash", "legacyPasswordHash", role, "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, NULL, $4, 'STUDENT', $5, now(), now())
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [randomUUID(), u.display_name || u.user_login || null, email, u.user_pass || null, u.user_registered || null],
  )
  if (res.rowCount > 0) imported++
  else skipped++
}
console.log(`\nUsers: imported ${imported}, skipped/existing ${skipped} of ${wpUsers.length}`)
if (admins.length) {
  console.log(`WP administrators (NOT auto-promoted — run make-admin.mjs if any should be ADMIN):`)
  admins.forEach((e) => console.log(`  - ${e}`))
}

// ── 2. ENROLMENTS ───────────────────────────────────────────────────────────
const slugs = Object.values(WP_COURSE_TO_SLUG)
if (WP_LMS === 'none' || slugs.length === 0) {
  console.log('\nEnrolments: skipped (WP_LMS=none or WP_COURSE_TO_SLUG empty). Run wp-inspect, fill the map, then re-run with WP_LMS set.')
} else {
  // our slug -> courseId
  const { rows: courseRows } = await dst.query('SELECT id, slug FROM courses')
  const slugToCourseId = Object.fromEntries(courseRows.map((c) => [c.slug, c.id]))
  // our email -> userId
  const { rows: userRows } = await dst.query('SELECT id, lower(email) email FROM users')
  const emailToUserId = Object.fromEntries(userRows.map((u) => [u.email, u.id]))

  // Pull (wp_student_id, wp_course_id) pairs from the LMS
  let pairs = []
  if (WP_LMS === 'tutor') {
    const [rows] = await src.query(
      `SELECT post_author AS student, post_parent AS course
       FROM \`${prefix}posts\` WHERE post_type = 'tutor_enrolled' AND post_status = 'completed'`,
    )
    pairs = rows.map((r) => [r.student, r.course])
  } else if (WP_LMS === 'learndash') {
    // LearnDash stores access as usermeta key `course_<id>_access_from`
    const [rows] = await src.query(
      `SELECT user_id AS student, meta_key FROM \`${metaTable}\`
       WHERE meta_key REGEXP '^course_[0-9]+_access_from'`,
    )
    pairs = rows.map((r) => [r.student, Number(/course_(\d+)_access_from/.exec(r.meta_key)[1])])
  }

  let enrolled = 0
  let enrSkipped = 0
  for (const [wpStudent, wpCourse] of pairs) {
    const slug = WP_COURSE_TO_SLUG[wpCourse]
    const email = wpIdToEmail.get(wpStudent)
    const userId = email && emailToUserId[email]
    const courseId = slug && slugToCourseId[slug]
    if (!userId || !courseId) { enrSkipped++; continue }
    const res = await dst.query(
      `INSERT INTO enrollments (id, "userId", "courseId", "enrolledAt")
       VALUES ($1, $2, $3, now())
       ON CONFLICT ("userId", "courseId") DO NOTHING RETURNING id`,
      [randomUUID(), userId, courseId],
    )
    if (res.rowCount > 0) enrolled++
    else enrSkipped++
  }
  console.log(`\nEnrolments: created ${enrolled}, skipped/existing ${enrSkipped} of ${pairs.length}`)
}

await src.end()
await dst.end()
console.log('\nDone.')
