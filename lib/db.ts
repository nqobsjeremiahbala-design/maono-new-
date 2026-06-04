import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { cache } from 'react'

// Prisma on Cloudflare Workers (via @opennextjs/cloudflare):
// the native query engine can't run on workerd, so we use the `pg` driver adapter.
// The connection must be request-scoped — connections cannot be reused across
// requests on Workers — so the client is built per request and memoised with
// React `cache()` (one client per request, fresh client across requests).
//
// In production the connection string comes from the Hyperdrive binding; locally
// (plain `next dev`, seed/migrate scripts) it falls back to DATABASE_URL.

function resolveConnectionString(): string {
  // Avoid a static import of @opennextjs/cloudflare so this module still loads
  // in non-Worker contexts (tsx scripts, tests). Resolved lazily at call time.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    const hyperdrive = getCloudflareContext()?.env?.HYPERDRIVE
    if (hyperdrive?.connectionString) return hyperdrive.connectionString
  } catch {
    // Not running inside a Cloudflare context — fall through to DATABASE_URL.
  }

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'No database connection string: set the HYPERDRIVE binding (production) or DATABASE_URL (local).',
    )
  }
  return url
}

function createClient(): PrismaClient {
  // maxUses: 1 — never reuse a connection across requests (forbidden on Workers).
  const adapter = new PrismaPg({ connectionString: resolveConnectionString(), maxUses: 1 })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

// One client per request. `cache()` scopes memoisation to the current request.
const getDb = cache(createClient)

// Backwards-compatible singleton-style export: every property access resolves the
// request-scoped client, so existing `import { prisma } from '@/lib/db'` call sites
// keep working unchanged without instantiating a client at module load.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getDb()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
