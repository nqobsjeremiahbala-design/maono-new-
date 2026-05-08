/**
 * WordPress → Maono Global migration script
 *
 * Reads the MySQL dump exported from AfriHost/phpMyAdmin and imports:
 *   • Users        (wpwy_users + wpwy_usermeta)    → users table
 *   • Enrollments  (wpwy_stm_lms_user_courses)     → enrollments table
 *
 * Passwords are stored in legacyPasswordHash and verified transparently
 * on first login, then re-hashed to bcrypt (see lib/auth.ts).
 *
 * Usage:
 *   WP_DUMP=/path/to/maonofv8q9t1_wp336.sql npx tsx scripts/migrate-wordpress.ts
 *
 * Safe to re-run — uses upsert on email, skips existing enrollments.
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import readline from 'readline'

const prisma = new PrismaClient()

// ── WordPress course ID → new site slug ──────────────────────────────────────
const COURSE_MAP: Record<number, string> = {
  868:  'forex-trading-introduction',
  5404: 'institutional-trading-concepts',
  5405: 'trading-psychology',
  5406: 'trading-strategies',
  5407: 'trading-tools',
  5408: 'price-action-trading',
}

// Skip these system/test accounts (server IP emails)
const SKIP_EMAILS = new Set(['webmaster@45.32.207.151', 'web@45.32.207.151'])

// ── SQL row parser ────────────────────────────────────────────────────────────
// Handles: integers, NULL, and single-quoted strings with \' and '' escapes.
function parseSQLRow(line: string): (string | null)[] {
  const inner = line.replace(/^\(/, '').replace(/[,;)]\s*$/, '')
  const values: (string | null)[] = []
  let current = ''
  let inStr = false
  let i = 0

  while (i < inner.length) {
    const ch = inner[i]

    if (!inStr) {
      if (ch === "'") {
        inStr = true
        i++
        continue
      }
      if (ch === ',') {
        const v = current.trim()
        values.push(v === 'NULL' ? null : v)
        current = ''
        i++
        continue
      }
      current += ch
    } else {
      if (ch === '\\' && i + 1 < inner.length) {
        current += inner[i + 1]
        i += 2
        continue
      }
      if (ch === "'" && inner[i + 1] === "'") {
        current += "'"
        i += 2
        continue
      }
      if (ch === "'") {
        inStr = false
        i++
        continue
      }
      current += ch
    }
    i++
  }

  const last = current.trim()
  values.push(last === 'NULL' ? null : last)
  return values
}

// ── Read all INSERT rows for a given table from the dump ─────────────────────
async function extractTable(
  dumpPath: string,
  tableName: string,
): Promise<(string | null)[][]> {
  const rows: (string | null)[][] = []
  const rl = readline.createInterface({
    input: fs.createReadStream(dumpPath),
    crlfDelay: Infinity,
  })

  let inBlock = false
  for await (const line of rl) {
    if (line.startsWith(`INSERT INTO \`${tableName}\``)) {
      inBlock = true
      continue
    }
    if (inBlock) {
      if (line.startsWith('(')) {
        rows.push(parseSQLRow(line))
      } else if (line === ';' || (!line.startsWith('(') && !line.startsWith(','))) {
        inBlock = false
      }
    }
  }
  return rows
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dumpPath = process.env.WP_DUMP
  if (!dumpPath || !fs.existsSync(dumpPath)) {
    console.error('Set WP_DUMP=/path/to/maonofv8q9t1_wp336.sql')
    process.exit(1)
  }

  console.log('Reading SQL dump…')

  // 1. Extract raw data
  const [userRows, metaRows, enrollRows] = await Promise.all([
    extractTable(dumpPath, 'wpwy_users'),
    extractTable(dumpPath, 'wpwy_usermeta'),
    extractTable(dumpPath, 'wpwy_stm_lms_user_courses'),
  ])

  console.log(`Found: ${userRows.length} users, ${enrollRows.length} enrollments`)

  // 2. Build wp_user_id → role map from usermeta capabilities
  //    meta_key = 'wpwy_capabilities', meta_value = 'a:1:{s:13:"administrator";b:1;}'
  const adminWpIds = new Set<number>()
  for (const row of metaRows) {
    // umeta_id, user_id, meta_key, meta_value
    const userId = Number(row[1])
    const metaKey = row[2]
    const metaValue = row[3] ?? ''
    if (metaKey === 'wpwy_capabilities' && metaValue.includes('administrator')) {
      adminWpIds.add(userId)
    }
  }

  // 3. Build wp_user_id → new Prisma user id map (for enrollment linking)
  const wpIdToNewId = new Map<number, string>()

  // 4. Upsert users
  console.log('\nImporting users…')
  let imported = 0
  let skipped = 0

  for (const row of userRows) {
    // ID, user_login, user_pass, user_nicename, user_email, user_url,
    // user_registered, user_activation_key, user_status, display_name
    const wpId = Number(row[0])
    const userPass = row[2] ?? ''
    const email = (row[4] ?? '').toLowerCase().trim()
    const displayName = row[9] ?? row[1] ?? ''
    const registeredAt = row[6] ? new Date(row[6]) : new Date()

    if (!email || SKIP_EMAILS.has(email)) {
      skipped++
      continue
    }

    const role = adminWpIds.has(wpId) ? 'ADMIN' : 'STUDENT'

    // Determine password storage:
    // - $wp$2y$ = WP6+ bcrypt wrapper → goes into legacyPasswordHash as-is
    //   (auth.ts strips $wp$ prefix before bcrypt.compare)
    // - $P$     = phpass → goes into legacyPasswordHash
    // - anything else    → skip (invalid)
    const isValidHash =
      userPass.startsWith('$wp$2y$') ||
      userPass.startsWith('$P$') ||
      userPass.startsWith('$H$') ||
      /^[0-9a-f]{32}$/.test(userPass)

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          // Don't overwrite an already-bcrypt passwordHash if user already exists
          name: displayName || undefined,
        },
        create: {
          email,
          name: displayName,
          role,
          legacyPasswordHash: isValidHash ? userPass : null,
          createdAt: registeredAt,
        },
      })
      wpIdToNewId.set(wpId, user.id)
      imported++
    } catch (e) {
      console.warn(`  Skipped user ${email}:`, (e as Error).message)
      skipped++
    }
  }

  console.log(`  Imported: ${imported}, Skipped: ${skipped}`)

  // Re-fetch any users that already existed (upsert update path skips create)
  // so we still have their IDs for enrollment linking.
  for (const row of userRows) {
    const wpId = Number(row[0])
    if (wpIdToNewId.has(wpId)) continue
    const email = (row[4] ?? '').toLowerCase().trim()
    if (!email || SKIP_EMAILS.has(email)) continue
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (existing) wpIdToNewId.set(wpId, existing.id)
  }

  // 5. Build course slug → Prisma course id map
  const courseSlugToId = new Map<string, string>()
  for (const [, slug] of Object.entries(COURSE_MAP)) {
    const course = await prisma.course.findUnique({ where: { slug }, select: { id: true } })
    if (course) {
      courseSlugToId.set(slug, course.id)
    } else {
      console.warn(`  Course not found in DB: ${slug} — run prisma db seed first`)
    }
  }

  // 6. Import enrollments
  console.log('\nImporting enrollments…')
  let enrolled = 0
  let enrollSkipped = 0

  for (const row of enrollRows) {
    // user_course_id, user_id, course_id, current_lesson_id, progress_percent,
    // status, lng_code, subscription_id, enterprise_id, instructor_id,
    // bundle_id, start_time, end_time, for_points, final_grade, is_gradable
    const wpUserId = Number(row[1])
    const wpCourseId = Number(row[2])
    const startTime = Number(row[11]) || 0

    const newUserId = wpIdToNewId.get(wpUserId)
    const slug = COURSE_MAP[wpCourseId]
    const newCourseId = slug ? courseSlugToId.get(slug) : undefined

    if (!newUserId || !newCourseId) {
      enrollSkipped++
      continue
    }

    const enrolledAt = startTime > 0 ? new Date(startTime * 1000) : new Date()

    try {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: newUserId, courseId: newCourseId } },
        update: {},
        create: { userId: newUserId, courseId: newCourseId, enrolledAt },
      })
      enrolled++
    } catch {
      enrollSkipped++
    }
  }

  console.log(`  Enrolled: ${enrolled}, Skipped: ${enrollSkipped}`)
  console.log('\nMigration complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
