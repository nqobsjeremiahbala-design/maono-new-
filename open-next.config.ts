import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// OpenNext adapter config for Cloudflare Workers.
// Start minimal. Once an R2 bucket exists we can wire ISR/incremental cache to it:
//   import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
//   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache })
export default defineCloudflareConfig({})
