// Postinstall patch for the OpenNext + Cloudflare Workers build.
//
// pg (via @prisma/adapter-pg) does `require('pg-cloudflare')` on Workers.
// pg-cloudflare's package.json `exports` sends the Node condition (followed by
// Next's file tracer at build time) to ./dist/empty.js, but the workerd condition
// (used by OpenNext's esbuild bundle) to ./dist/index.js. Result: the tracer copies
// empty.js, esbuild then can't resolve ./dist/index.js, and the build fails with
// "Could not resolve pg-cloudflare".
//
// Pointing the `default` condition at the real ./dist/index.js makes the tracer copy
// the real file so esbuild can bundle it. Safe on Node: pg only uses the Cloudflare
// socket when navigator.userAgent === 'Cloudflare-Workers', so this never changes
// local/Node behaviour.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const pkgPath = 'node_modules/pg-cloudflare/package.json'

if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const root = pkg.exports?.['.']
  if (root && root.default !== './dist/index.js') {
    root.default = './dist/index.js'
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    console.log('[patch-pg-cloudflare] exports["."].default -> ./dist/index.js')
  }
}
