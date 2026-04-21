import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  return getBlogPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getBlogPost(slug)
    return generatePageMetadata({ title: meta.title, description: meta.description, path: `/blog/${slug}` })
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const p = getBlogPost(slug)
    meta = p.meta
    content = p.content
  } catch {
    notFound()
  }

  return (
    <>
      <section className="bg-navy-950 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-500 text-sm uppercase tracking-widest mb-4">{meta!.category}</p>
          <h1 className="font-serif text-3xl text-cream-50 mb-4">{meta!.title}</h1>
          <p className="text-navy-400 text-sm">By {meta!.author} · {meta!.readTime} min read</p>
        </div>
      </section>
      <section className="py-12 px-4 bg-cream-50">
        <div className="max-w-2xl mx-auto prose prose-slate max-w-none">
          {content}
        </div>
      </section>
      <CTABanner
        headline="Found this useful?"
        sub="Join the free signals group for daily analysis delivered to your WhatsApp."
      />
    </>
  )
}
