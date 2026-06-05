import type { Course, BlogPost, Resource } from './types'
// Content is baked into a JSON module at build time (scripts/gen-content.mjs) so it
// ships inside the JS bundle — Cloudflare Workers have no filesystem at runtime.
import contentData from './__content.generated.json'

type Entry = { data: Record<string, unknown>; content: string }
const CONTENT = contentData as unknown as Record<string, Record<string, Entry>>

function readMdx(dir: string, slug: string): Entry {
  const entry = CONTENT[dir]?.[slug]
  if (!entry) throw new Error(`Content file not found: ${dir}/${slug}.mdx`)
  return entry
}

function getSlugs(dir: string): string[] {
  return Object.keys(CONTENT[dir] ?? {})
}

export function getCourses(): Course[] {
  return getSlugs('courses').map(slug => {
    const { data } = readMdx('courses', slug)
    return { slug, ...data } as Course
  })
}

export function getCourse(slug: string): { meta: Course; content: string } {
  const { data, content } = readMdx('courses', slug)
  return { meta: { slug, ...data } as Course, content }
}

export function getBlogPosts(): BlogPost[] {
  return getSlugs('blog')
    .map(slug => {
      const { data } = readMdx('blog', slug)
      return { slug, ...data } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): { meta: BlogPost; content: string } {
  const { data, content } = readMdx('blog', slug)
  return { meta: { slug, ...data } as BlogPost, content }
}

export function getResources(): Resource[] {
  return getSlugs('resources').map(slug => {
    const { data } = readMdx('resources', slug)
    return { slug, ...data } as Resource
  })
}

export function getResource(slug: string): { meta: Resource; content: string } {
  const { data, content } = readMdx('resources', slug)
  return { meta: { slug, ...data } as Resource, content }
}
