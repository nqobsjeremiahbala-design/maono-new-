import type { MetadataRoute } from 'next'
import { getCourses, getBlogPosts, getResources } from '@/lib/content'

const BASE = 'https://maonoforextrading.co.za'

export default function sitemap(): MetadataRoute.Sitemap {
  const highPriorityRoutes = [
    '', '/courses', '/memberships',
    '/about', '/resources', '/blog', '/seminars', '/contact',
    '/mentorship', '/signals',
    '/paths/beginner', '/paths/intermediate', '/paths/advanced',
  ].map(path => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const legalRoutes = ['/privacy', '/terms', '/risk-disclosure'].map(path => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }))

  const staticRoutes = [...highPriorityRoutes, ...legalRoutes]

  const courses = getCourses().map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const posts = getBlogPosts().map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const resources = getResources().map(r => ({
    url: `${BASE}/resources/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...courses, ...posts, ...resources]
}
