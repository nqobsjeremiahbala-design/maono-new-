import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Course, BlogPost, Resource } from './types'

const contentDir = path.join(process.cwd(), 'content')

function readMdx(dir: string, slug: string) {
  const file = path.join(contentDir, dir, `${slug}.mdx`)
  try {
    const raw = fs.readFileSync(file, 'utf8')
    return matter(raw)
  } catch {
    throw new Error(`Content file not found: ${dir}/${slug}.mdx`)
  }
}

function getSlugs(dir: string): string[] {
  const folder = path.join(contentDir, dir)
  if (!fs.existsSync(folder)) return []
  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
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
