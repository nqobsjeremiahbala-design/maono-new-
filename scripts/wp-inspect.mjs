// Recon for the WordPress import. Connects to the WP MySQL/MariaDB (e.g. the one
// the partner's docker-compose brings up) and prints everything we need to write
// the exact user + enrollment import: table prefix, row counts, a sample of
// users (with password-hash type), which LMS plugin is in use, and how course
// access is stored.
//
// Run this FIRST, before scripts/import-wp.mjs.
//
// 1. Bring up the WP database (from the partner's docker-compose):
//      docker compose up -d db        # or whatever the db service is named
// 2. Point these env vars at it (defaults match a typical WP compose):
//      WP_DB_HOST (127.0.0.1)  WP_DB_PORT (3306)
//      WP_DB_USER (root)       WP_DB_PASSWORD       WP_DB_NAME (wordpress)
// 3. node scripts/wp-inspect.mjs

import mysql from 'mysql2/promise'

const cfg = {
  host: process.env.WP_DB_HOST || '127.0.0.1',
  port: Number(process.env.WP_DB_PORT || 3306),
  user: process.env.WP_DB_USER || 'root',
  password: process.env.WP_DB_PASSWORD || '',
  database: process.env.WP_DB_NAME || 'wordpress',
  multipleStatements: false,
}

const log = (...a) => console.log(...a)
const hr = (t) => log(`\n${'─'.repeat(8)} ${t} ${'─'.repeat(8)}`)

const db = await mysql.createConnection(cfg)
log(`Connected to ${cfg.user}@${cfg.host}:${cfg.port}/${cfg.database}`)

// All tables + row counts
hr('TABLES')
const [tables] = await db.query(
  'SELECT table_name AS t, table_rows AS rows FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
  [cfg.database],
)
const names = tables.map((r) => r.t || r.T)
for (const r of tables) log(`  ${String(r.t || r.T).padEnd(40)} ~${r.rows ?? r.ROWS ?? '?'} rows`)

// Detect the table prefix from the *users table
const usersTable = names.find((n) => /users$/i.test(n))
const prefix = usersTable ? usersTable.replace(/users$/i, '') : 'wp_'
hr('PREFIX')
log(`  Detected table prefix: "${prefix}"  (users table: ${usersTable || 'NOT FOUND'})`)

if (usersTable) {
  hr('SAMPLE USERS')
  const [users] = await db.query(
    `SELECT ID, user_login, user_email, display_name,
            LEFT(user_pass, 4) AS hash_prefix, user_registered
     FROM \`${usersTable}\` ORDER BY ID LIMIT 8`,
  )
  for (const u of users) {
    log(`  #${u.ID}  ${String(u.user_email).padEnd(32)} hash=${u.hash_prefix}  ${u.display_name}`)
  }
  const [[{ c }]] = await db.query(`SELECT COUNT(*) c FROM \`${usersTable}\``)
  log(`  total users: ${c}`)
  log('  (hash_prefix $P$/$H$ = phpass, $wp$ = WP6.8+ bcrypt, $2y$ = bcrypt — all handled by our auth)')
}

// Distinct usermeta keys (helps spot LMS access keys)
const usermetaTable = names.find((n) => /usermeta$/i.test(n))
if (usermetaTable) {
  hr('USERMETA KEYS (course/access/enroll related)')
  const [keys] = await db.query(
    `SELECT meta_key, COUNT(*) c FROM \`${usermetaTable}\`
     WHERE meta_key LIKE '%course%' OR meta_key LIKE '%enroll%'
        OR meta_key LIKE '%access%' OR meta_key LIKE 'learndash%'
        OR meta_key LIKE '%capabilities%'
     GROUP BY meta_key ORDER BY c DESC LIMIT 40`,
  )
  if (keys.length === 0) log('  (none found — access is probably stored in a posts/LMS table, see below)')
  for (const k of keys) log(`  ${String(k.meta_key).padEnd(44)} ${k.c}`)
}

// Detect the LMS via post types / known tables
const postsTable = names.find((n) => /posts$/i.test(n))
if (postsTable) {
  hr('POST TYPES (find the "course" post type)')
  const [types] = await db.query(
    `SELECT post_type, COUNT(*) c FROM \`${postsTable}\` GROUP BY post_type ORDER BY c DESC`,
  )
  for (const t of types) log(`  ${String(t.post_type).padEnd(28)} ${t.c}`)

  // Likely course post types across LMS plugins
  const courseTypes = ['sfwd-courses', 'courses', 'course', 'llms_course', 'stm-courses', 'product']
  for (const ct of courseTypes) {
    const [rows] = await db.query(
      `SELECT ID, post_title FROM \`${postsTable}\` WHERE post_type = ? AND post_status IN ('publish','private') LIMIT 30`,
      [ct],
    )
    if (rows.length) {
      hr(`COURSES (post_type=${ct})`)
      for (const r of rows) log(`  #${r.ID}  ${r.post_title}`)
    }
  }
}

// Known LMS marker tables
hr('LMS MARKER TABLES PRESENT')
const markers = {
  'LearnDash (usermeta course_*_access)': names.some((n) => /learndash/i.test(n)) || true,
  'Tutor LMS (posts: tutor_enrolled)': names.includes(`${prefix}posts`),
  'LifterLMS (lifterlms_user_postmeta)': names.some((n) => /lifterlms/i.test(n)),
  'MemberPress (mepr_*)': names.some((n) => /mepr_/i.test(n)),
  'WooCommerce (woocommerce_order_items)': names.some((n) => /woocommerce_order_items/i.test(n)),
}
for (const [k, v] of Object.entries(markers)) log(`  ${v ? '•' : ' '} ${k}`)

// Tutor LMS enrolment sample (very common)
if (postsTable) {
  const [enr] = await db.query(
    `SELECT post_author AS student_id, post_parent AS course_id, COUNT(*) c
     FROM \`${postsTable}\` WHERE post_type='tutor_enrolled' GROUP BY post_author, post_parent LIMIT 10`,
  ).catch(() => [[]])
  if (enr && enr.length) {
    hr('TUTOR LMS ENROLMENTS (sample: student_id -> course_id)')
    for (const e of enr) log(`  student #${e.student_id} -> course #${e.course_id}`)
  }
}

log('\nDone. Paste this output back and I will finalise scripts/import-wp.mjs (the course-id → our-slug map + the exact enrolment query).')
await db.end()
