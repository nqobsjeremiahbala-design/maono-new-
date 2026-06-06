// Remux every video under uploads/videos/** to "fast-start" (moov atom moved to
// the front) so they begin playback on mobile / iOS Safari without downloading
// the whole file. Lossless: copies codecs (-c copy), only rewrites the layout.
// Replaces the files in place. Run scripts/upload-videos-to-r2.mjs afterwards.
//
// Usage: node scripts/faststart-videos.mjs

import { readdirSync, statSync, openSync, readSync, closeSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const ROOT = process.cwd()
const VIDEO_DIR = join(ROOT, 'uploads', 'videos')
const TMP = join(ROOT, '.faststart')

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(full))
    else if (/\.(mp4|m4v)$/i.test(e.name)) out.push(full)
  }
  return out
}

// Returns true if the first top-level atom after ftyp is moov (already faststart).
function isFaststart(file) {
  const fd = openSync(file, 'r')
  const buf = Buffer.alloc(4096)
  readSync(fd, buf, 0, buf.length, 0)
  closeSync(fd)
  let off = 0
  for (let k = 0; k < 5 && off + 8 <= buf.length; k++) {
    const size = buf.readUInt32BE(off)
    const type = buf.toString('ascii', off + 4, off + 8)
    if (type === 'moov') return true
    if (type === 'mdat') return false
    if (size <= 0 || size > 2e9) return false
    off += size
  }
  return false
}

const files = walk(VIDEO_DIR)
console.log(`Found ${files.length} videos.\n`)
let done = 0, skipped = 0

for (const src of files) {
  const rel = relative(VIDEO_DIR, src)
  if (statSync(src).size < 1024) { console.warn(`SKIP (stub): ${rel}`); skipped++; continue }
  if (isFaststart(src)) { console.log(`already faststart: ${rel}`); skipped++; continue }

  const tmp = join(TMP, rel)
  mkdirSync(dirname(tmp), { recursive: true })
  process.stdout.write(`remux ${rel} … `)
  try {
    execFileSync(ffmpegPath, ['-y', '-i', src, '-c', 'copy', '-movflags', '+faststart', tmp], {
      stdio: ['ignore', 'ignore', 'ignore'],
    })
    if (!isFaststart(tmp)) throw new Error('output still not faststart')
    renameSync(tmp, src) // replace original in place
    console.log('done')
    done++
  } catch (e) {
    console.log('FAILED:', e.message)
  }
}

try { rmSync(TMP, { recursive: true, force: true }) } catch {}
console.log(`\nFast-start: ${done} remuxed, ${skipped} skipped, of ${files.length}.`)
console.log('Next: node scripts/upload-videos-to-r2.mjs')
