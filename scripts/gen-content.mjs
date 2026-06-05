// Bakes content/*.mdx into lib/__content.generated.json so content ships inside the
// JS bundle (no runtime filesystem needed — Cloudflare Workers have no fs, and
// OpenNext's file tracer doesn't reliably copy content/ into the bundle on CI).
// Runs in postinstall and at the start of cf:build.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const dirs = ['courses', 'blog', 'resources']
const out = {}

for (const dir of dirs) {
  const folder = path.join(root, 'content', dir)
  out[dir] = {}
  if (!fs.existsSync(folder)) continue
  for (const file of fs.readdirSync(folder).filter(f => f.endsWith('.mdx'))) {
    const slug = file.replace(/\.mdx$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(folder, file), 'utf8'))
    out[dir][slug] = { data, content }
  }
}

const target = path.join(root, 'lib', '__content.generated.json')
fs.writeFileSync(target, JSON.stringify(out))
console.log(
  `[gen-content] courses=${Object.keys(out.courses).length} ` +
    `blog=${Object.keys(out.blog).length} resources=${Object.keys(out.resources).length} -> ${target}`,
)
