// Batch-migrate course videos from R2 → Cloudflare Stream.
//
// For each video lesson it: presigns the R2 object, tells Stream to COPY it
// (requireSignedURLs:true + allowedOrigins → non-downloadable, domain-locked),
// captures the returned `uid`, and stores it on lessons.stream_uid. Idempotent:
// lessons that already have a stream_uid are skipped.
//
// Env (in .env.local / .dev.vars):
//   CF_ACCOUNT_ID, CF_STREAM_API_TOKEN          (Stream:Read + Stream:Edit)
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY   (Object Read)
//   DATABASE_URL
//
// Usage:
//   node --env-file=.env.local scripts/migrate-to-stream.mjs          (dry run)
//   node --env-file=.env.local scripts/migrate-to-stream.mjs --commit (do it)
//   add --poll to wait for each video to finish processing.

import pg from 'pg'
import { AwsClient } from 'aws4fetch'

const COMMIT = process.argv.includes('--commit')
const POLL = process.argv.includes('--poll')
const R2_BUCKET = 'maono-media'
const ALLOWED_ORIGINS = ['maonoforextrading.co.za', 'www.maonoforextrading.co.za']

const need = (k) => {
  const v = process.env[k]
  if (!v) { console.error(`Missing env: ${k}`); process.exit(1) }
  return v
}
const CF_ACCOUNT_ID = need('CF_ACCOUNT_ID')
const CF_STREAM_API_TOKEN = need('CF_STREAM_API_TOKEN')
const R2_ACCOUNT_ID = need('R2_ACCOUNT_ID')
const R2_ACCESS_KEY_ID = need('R2_ACCESS_KEY_ID')
const R2_SECRET_ACCESS_KEY = need('R2_SECRET_ACCESS_KEY')

const aws = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: 's3', region: 'auto' })

async function presignR2(key) {
  const encoded = key.split('/').map(encodeURIComponent).join('/')
  const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${encoded}?X-Amz-Expires=7200`
  const signed = await aws.sign(url, { method: 'GET', aws: { signQuery: true } })
  return signed.url
}

async function streamCopy(sourceUrl, name) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/copy`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_STREAM_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: sourceUrl, meta: { name }, requireSignedURLs: true, allowedOrigins: ALLOWED_ORIGINS }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.success) throw new Error(`copy ${res.status}: ${JSON.stringify(body.errors || body)}`)
  return body.result.uid
}

async function streamStatus(uid) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`, {
    headers: { Authorization: `Bearer ${CF_STREAM_API_TOKEN}` },
  })
  const body = await res.json().catch(() => ({}))
  return body?.result?.status ?? { state: 'unknown' }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const { rows: lessons } = await c.query(
  `select l.id, l.slug as lesson, co.slug as course, l."videoUrl" as key, l."streamUid" as uid
   from lessons l join modules m on m.id = l."moduleId" join courses co on co.id = m."courseId"
   where l.type = 'video' and l."videoUrl" is not null
   order by co.slug, l.position`,
)

console.log(`${COMMIT ? 'COMMIT' : 'DRY RUN'} — ${lessons.length} video lessons\n`)
let done = 0, skipped = 0, failed = 0
for (const l of lessons) {
  if (l.uid) { console.log(`  · ${l.course}/${l.lesson} already on Stream (${l.uid}) — skip`); skipped++; continue }
  const name = `${l.course}/${l.lesson}`
  if (!COMMIT) { console.log(`  → would copy ${name}  (key: ${l.key})`); continue }
  try {
    const src = await presignR2(l.key)
    const uid = await streamCopy(src, name)
    await c.query('update lessons set "streamUid" = $1 where id = $2', [uid, l.id])
    let state = 'queued'
    if (POLL) {
      for (let i = 0; i < 60; i++) { const s = await streamStatus(uid); state = s.state; if (state === 'ready' || state === 'error') break; await sleep(5000) }
    }
    console.log(`  ✓ ${name} → ${uid}${POLL ? ` (${state})` : ''}`)
    done++
  } catch (e) {
    console.error(`  ✗ ${name} — ${e.message}`)
    failed++
  }
}
console.log(`\nCopied: ${done}  Skipped: ${skipped}  Failed: ${failed}`)
if (!COMMIT) console.log('Re-run with --commit to perform the migration (add --poll to wait for processing).')
await c.end()
