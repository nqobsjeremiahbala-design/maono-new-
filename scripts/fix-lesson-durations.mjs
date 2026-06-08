// Probe the real duration of every lesson video and rewrite the hardcoded
// `duration` strings in lib/courseLessons.ts to match (rounded to the minute).
// Uses ffmpeg-static (parses the Duration line from stderr).
//
// Usage: node scripts/fix-lesson-durations.mjs [--write]   (dry-run by default)

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ffmpeg = require('ffmpeg-static')
const WRITE = process.argv.includes('--write')
const FILE = 'lib/courseLessons.ts'
const VIDEO_ROOT = 'uploads/videos/'

function probeMinutes(file) {
  let out = ''
  try {
    execFileSync(ffmpeg, ['-hide_banner', '-i', file], { stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    out = (e.stderr || '').toString()
  }
  const m = out.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/)
  if (!m) return null
  const secs = +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 100
  return { secs, label: `${Math.max(1, Math.round(secs / 60))} min` }
}

let content = readFileSync(FILE, 'utf8')

// Match each lesson's duration immediately followed by its description + videoUrl.
const re = /(duration: ')[^']*(',\s*description: '(?:[^'\\]|\\.)*?',\s*videoUrl: ')([^']+)(')/g

const changes = []
content = content.replace(re, (full, pre, mid, videoUrl, post) => {
  const path = VIDEO_ROOT + videoUrl
  if (!existsSync(path)) {
    changes.push({ videoUrl, status: 'MISSING FILE' })
    return full
  }
  const d = probeMinutes(path)
  if (!d) {
    changes.push({ videoUrl, status: 'PROBE FAILED' })
    return full
  }
  const oldDur = full.match(/duration: '([^']*)'/)[1]
  changes.push({ videoUrl, old: oldDur, new: d.label, secs: d.secs })
  return `${pre}${d.label}${mid}${videoUrl}${post}`
})

console.log(`${WRITE ? 'WRITING' : 'DRY RUN (pass --write to apply)'}\n`)
for (const c of changes) {
  if (c.status) console.log(`  ⚠ ${c.videoUrl} — ${c.status}`)
  else {
    const mark = c.old === c.new ? '·' : '→'
    console.log(`  ${mark} ${c.videoUrl.padEnd(52)} ${String(c.old).padStart(7)} ${mark} ${c.new}`)
  }
}
const changed = changes.filter((c) => !c.status && c.old !== c.new).length
console.log(`\n${changes.length} videos probed, ${changed} durations corrected.`)

if (WRITE) {
  writeFileSync(FILE, content, 'utf8')
  console.log(`Wrote ${FILE}`)
}
