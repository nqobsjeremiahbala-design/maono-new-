// Batch-migrate course videos from R2 → Bunny Stream.
//
// For each video lesson: create a Bunny video object, tell Bunny to FETCH the
// file from a presigned R2 URL (no local re-upload, handles big files), and
// store the returned guid on lessons.bunny_video_id. Idempotent: lessons that
// already have a bunny_video_id are skipped.
//
// Bunny library must have Token Authentication + DRM (MediaCage) + allowed
// referrers configured in the dashboard BEFORE you rely on protection.
//
// Env (.env.local):
//   BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY   (library API key)
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
//   DATABASE_URL
//
// Usage:
//   node --env-file=.env.local scripts/migrate-to-bunny.mjs           (dry run)
//   node --env-file=.env.local scripts/migrate-to-bunny.mjs --commit

import pg from 'pg'
import { AwsClient } from 'aws4fetch'

const COMMIT = process.argv.includes('--commit')
const R2_BUCKET = 'maono-media'
const BUNNY_BASE = 'https://video.bunnycdn.com'

const need = (k) => { const v = process.env[k]; if (!v) { console.error(`Missing env: ${k}`); process.exit(1) } return v }
const LIBRARY_ID = need('BUNNY_STREAM_LIBRARY_ID')
const API_KEY = need('BUNNY_STREAM_API_KEY')
const R2_ACCOUNT_ID = need('R2_ACCOUNT_ID')
const aws = new AwsClient({ accessKeyId: need('R2_ACCESS_KEY_ID'), secretAccessKey: need('R2_SECRET_ACCESS_KEY'), service: 's3', region: 'auto' })

const bunnyHeaders = { AccessKey: API_KEY, 'Content-Type': 'application/json', accept: 'application/json' }

async function presignR2(key) {
  const encoded = key.split('/').map(encodeURIComponent).join('/')
  const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${encoded}?X-Amz-Expires=7200`
  const signed = await aws.sign(url, { method: 'GET', aws: { signQuery: true } })
  return signed.url
}

async function createVideo(title) {
  const res = await fetch(`${BUNNY_BASE}/library/${LIBRARY_ID}/videos`, {
    method: 'POST', headers: bunnyHeaders, body: JSON.stringify({ title }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.guid) throw new Error(`create ${res.status}: ${JSON.stringify(body)}`)
  return body.guid
}

async function fetchInto(videoId, sourceUrl) {
  const res = await fetch(`${BUNNY_BASE}/library/${LIBRARY_ID}/videos/${videoId}/fetch`, {
    method: 'POST', headers: bunnyHeaders, body: JSON.stringify({ url: sourceUrl }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.success === false) throw new Error(`fetch ${res.status}: ${JSON.stringify(body)}`)
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const { rows: lessons } = await c.query(
  `select l.id, l.slug as lesson, co.slug as course, l."videoUrl" as key, l."bunnyVideoId" as vid
   from lessons l join modules m on m.id = l."moduleId" join courses co on co.id = m."courseId"
   where l.type = 'video' and l."videoUrl" is not null
   order by co.slug, l.position`,
)

console.log(`${COMMIT ? 'COMMIT' : 'DRY RUN'} — ${lessons.length} video lessons\n`)
let done = 0, skipped = 0, failed = 0
for (const l of lessons) {
  if (l.vid) { console.log(`  · ${l.course}/${l.lesson} already on Bunny (${l.vid}) — skip`); skipped++; continue }
  const title = `${l.course}/${l.lesson}`
  if (!COMMIT) { console.log(`  → would migrate ${title}  (key: ${l.key})`); continue }
  try {
    const src = await presignR2(l.key)
    const guid = await createVideo(title)
    await fetchInto(guid, src)
    await c.query('update lessons set "bunnyVideoId" = $1 where id = $2', [guid, l.id])
    console.log(`  ✓ ${title} → ${guid}`)
    done++
  } catch (e) {
    console.error(`  ✗ ${title} — ${e.message}`)
    failed++
  }
}
console.log(`\nMigrated: ${done}  Skipped: ${skipped}  Failed: ${failed}`)
console.log('Bunny is fetching + encoding the files asynchronously — check the library dashboard for "ready" status.')
if (!COMMIT) console.log('Re-run with --commit to perform the migration.')
await c.end()
