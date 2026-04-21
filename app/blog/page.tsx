import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { CTABanner } from '@/components/layout/CTABanner'
import { getBlogPosts } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Blog',
  description: 'Market analysis, trading insights, and education from the Maono team.',
  path: '/blog',
})

export default function BlogPage() {
  const posts = getBlogPosts()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl text-cream-50 mb-4">Blog</h1>
          <p className="text-navy-300">Market analysis and trading insights from the Maono team.</p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map(post => (
            <Card key={post.slug} className="p-6">
              <p className="text-xs text-navy-400 mb-2">{post.category} · {post.readTime} min read</p>
              <h2 className="font-serif text-xl text-navy-900 mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-gold-500 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-navy-500">{post.description}</p>
            </Card>
          ))}
          {posts.length === 0 && (
            <p className="text-navy-400 text-center py-10">First post coming soon.</p>
          )}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
