import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// Makes Cloudflare bindings (Hyperdrive, R2, etc.) available via getCloudflareContext()
// during `next dev`. Gated to dev so `next build` (CI/prod) needs no DB/binding access.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev()
}

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Keep Prisma + the pg driver external so the OpenNext adapter can patch them for
  // workerd and so pg's runtime `require('pg-cloudflare')` survives bundling intact.
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@prisma/adapter-pg', 'pg', 'pg-cloudflare'],
  // pg lazily require()s pg-cloudflare only on Workers; that dynamic require isn't
  // followed by the file tracer, so force-include the package in the bundle.
  // (Content is baked into a JSON module via scripts/gen-content.mjs, so it no longer
  // needs filesystem tracing.)
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/pg-cloudflare/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            // 'unsafe-inline' is still required for the GA bootstrap snippet and a few inline style attributes.
            // 'unsafe-eval' has been removed — Next 16 App Router does not require it in production.
            // TradingView and Telegram embeds need their script/frame origins allowlisted.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://s3.tradingview.com https://*.tradingview.com https://embed.cloudflarestream.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob: https://*.r2.cloudflarestorage.com https://*.cloudflarestream.com https://*.videodelivery.net",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://www.google.com https://*.tradingview.com https://*.cloudflarestream.com https://*.videodelivery.net",
              "frame-src 'self' https://*.tradingview.com https://www.youtube.com https://t.me https://*.cloudflarestream.com https://embed.cloudflarestream.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
