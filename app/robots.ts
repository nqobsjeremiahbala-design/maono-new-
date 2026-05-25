import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/learn/', '/checkout/', '/my-courses/', '/login', '/register'],
    },
    sitemap: 'https://maonoforextrading.co.za/sitemap.xml',
  }
}
