// Uploads every real video under uploads/videos/** to the R2 bucket `maono-media`
// at key `videos/<relative-path>`, matching what the /api/video route serves in
// production. Skips Git LFS pointer stubs (run `git lfs pull` first).
//
// Usage: node scripts/upload-videos-to-r2.mjs
// Requires: an authenticated wrangler (`npx wrangler whoami`).

import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = process.cwd()
const VIDEO_DIR = join(ROOT, 'uploads', 'videos')
const BUCKET = 'maono-media'
const WRANGLER_BIN = join(ROOT, 'node_modules', 'wrangler', 'bin', 'wrangler.js')

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(mp4|m4v|webm|mov)$/i.test(entry.name)) out.push(full)
  }
  return out
}

const files = walk(VIDEO_DIR)
console.log(`Found ${files.length} video files under uploads/videos/\n`)

let uploaded = 0
let skipped = 0
for (const file of files) {
  const rel = relative(VIDEO_DIR, file).split('\\').join('/')
  const key = `videos/${rel}`
  const size = statSync(file).size

  // Git LFS pointer files are tiny text stubs.
  if (size < 1024) {
    console.warn(`SKIP (LFS pointer, run \`git lfs pull\`): ${rel}`)
    skipped++
    continue
  }

  const ext = rel.split('.').pop().toLowerCase()
  const contentType = ext === 'webm' ? 'video/webm' : ext === 'mov' ? 'video/quicktime' : 'video/mp4'

  process.stdout.write(`Uploading ${rel} (${(size / 1024 / 1024).toFixed(1)} MB) … `)
  try {
    // Invoke wrangler's JS entry directly with `node` and shell:false so paths
    // containing spaces (this project lives under "Maono Global Forex Trading")
    // are passed through verbatim instead of being split by the shell.
    execFileSync(
      process.execPath, // the current node binary
      [
        WRANGLER_BIN,
        'r2',
        'object',
        'put',
        `${BUCKET}/${key}`,
        `--file=${file}`,
        `--content-type=${contentType}`,
        '--remote',
      ],
      { stdio: ['ignore', 'ignore', 'inherit'], shell: false },
    )
    console.log('done')
    uploaded++
  } catch (err) {
    console.log('FAILED')
    console.error(err.message)
  }
}

console.log(`\nUploaded ${uploaded}, skipped ${skipped} of ${files.length}.`)
