// Imports the course videos you downloaded from Google Drive into uploads/videos/
// with the exact filenames the app expects. Matches each source file to its
// destination by EXACT byte size (every course video has a unique size), so the
// original Drive names ("1 forexterminology intro.m4v", etc.) don't matter.
//
// Usage:  node scripts/import-drive-videos.mjs "C:\\path\\to\\downloaded\\course files"
// Then:   node scripts/upload-videos-to-r2.mjs

import { readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'

// size (bytes) -> destination relative to uploads/videos/
const BY_SIZE = {
  54306566: 'forex-trading-introduction/01-forex-terminology-intro.m4v',
  47353311: 'forex-trading-introduction/02-order-types.m4v',
  22397787: 'forex-trading-introduction/03-types-of-trading.m4v',
  64223967: 'forex-trading-introduction/04-types-of-charts.mp4',
  36175340: 'forex-trading-introduction/05-candlestick-patterns.m4v',
  31726066: 'price-action-trading/01-intro-to-price-action.m4v',
  46818992: 'price-action-trading/02-trendlines-and-structure.m4v',
  64111081: 'price-action-trading/03-market-structure-part2.m4v',
  87028900: 'price-action-trading/04-impulse-moves.mp4',
  102971822: 'price-action-trading/05-support-and-resistance.m4v',
  46247909: 'price-action-trading/06-chart-patterns.m4v',
  94090438: 'trading-tools/01-tradingview-setup.mp4',
  145923588: 'trading-tools/02-tradingview-tools.mp4',
  66297213: 'trading-tools/03-fib-retracement.m4v',
  58697414: 'trading-tools/04-fib-expansion.m4v',
  72772384: 'trading-tools/05-fib-with-structure.m4v',
  48039838: 'trading-tools/06-fib-channel.m4v',
  68483918: 'trading-tools/07-fib-fan.mp4',
  245939482: 'trading-strategies/01-box-breakout.mp4',
  236360028: 'trading-strategies/02-trendline-breakout.mp4',
  215099624: 'trading-strategies/03-abcd-pattern.mp4',
  67557961: 'institutional-trading-concepts/01-intro-to-smart-money.m4v',
  174561899: 'institutional-trading-concepts/02-order-blocks.mp4',
}

const sourceDir = process.argv[2]
if (!sourceDir) {
  console.error('Usage: node scripts/import-drive-videos.mjs "<folder you downloaded from Drive>"')
  process.exit(1)
}

const DEST_ROOT = join(process.cwd(), 'uploads', 'videos')

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(full))
    else if (/\.(mp4|m4v|webm|mov)$/i.test(e.name)) out.push(full)
  }
  return out
}

const found = walk(resolve(sourceDir))
const matchedSizes = new Set()
let imported = 0

for (const src of found) {
  const size = statSync(src).size
  const dest = BY_SIZE[size]
  if (!dest) {
    console.warn(`?  No match for ${src} (${size} bytes) — skipping`)
    continue
  }
  if (matchedSizes.has(size)) {
    console.warn(`!  Duplicate for ${dest} (${size} bytes) at ${src} — skipping`)
    continue
  }
  const destPath = join(DEST_ROOT, dest)
  mkdirSync(dirname(destPath), { recursive: true })
  copyFileSync(src, destPath)
  matchedSizes.add(size)
  imported++
  console.log(`✓  ${dest}`)
}

const missing = Object.entries(BY_SIZE).filter(([s]) => !matchedSizes.has(Number(s)))
console.log(`\nImported ${imported}/23.`)
if (missing.length) {
  console.log('Still missing:')
  for (const [, dest] of missing) console.log('  - ' + dest)
} else {
  console.log('All 23 videos imported. Next: node scripts/upload-videos-to-r2.mjs')
}
