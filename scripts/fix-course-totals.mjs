// Recompute each course's total duration from the (now-correct) per-lesson
// durations in lib/courseLessons.ts and update the `duration:` frontmatter in
// content/courses/<slug>.mdx. Trading Psychology is intentionally skipped.
//
// Usage: node scripts/fix-course-totals.mjs [--write]   (dry-run by default)

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const WRITE = process.argv.includes('--write')
const SKIP = new Set(['trading-psychology'])

const fmt = (min) => {
  if (min >= 60) {
    const h = (min / 60).toFixed(1).replace(/\.0$/, '')
    return `${h} ${h === '1' ? 'hour' : 'hours'}`
  }
  return `${min} min`
}

// Sum lesson durations per course out of courseLessons.ts.
const src = readFileSync('lib/courseLessons.ts', 'utf8')
const blocks = src.split(/const \w+: CourseCurriculum =/).slice(1)
const totals = {}
for (const b of blocks) {
  const slug = b.match(/slug:\s*'([^']+)'/)?.[1]
  if (!slug) continue
  const mins = [...b.matchAll(/duration:\s*'(\d+)\s*min'/g)].reduce((a, m) => a + +m[1], 0)
  totals[slug] = mins
}

for (const [slug, mins] of Object.entries(totals)) {
  const path = `content/courses/${slug}.mdx`
  if (SKIP.has(slug)) { console.log(`  · ${slug.padEnd(34)} (skipped)`); continue }
  if (!existsSync(path)) { console.log(`  ⚠ ${slug} — no mdx`); continue }
  let mdx = readFileSync(path, 'utf8')
  const oldM = mdx.match(/^duration:\s*"([^"]*)"/m)
  const newVal = fmt(mins)
  console.log(`  ${oldM?.[1] === newVal ? '·' : '→'} ${slug.padEnd(34)} ${String(oldM?.[1] ?? '?').padStart(10)} → ${newVal}  (${mins} min)`)
  mdx = mdx.replace(/^(duration:\s*)"[^"]*"/m, `$1"${newVal}"`)
  if (WRITE) writeFileSync(path, mdx, 'utf8')
}
console.log(`\n${WRITE ? 'WROTE mdx frontmatter.' : 'DRY RUN — pass --write to apply.'}`)
