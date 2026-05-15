import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPost } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'
import { Markdown } from '@/lib/markdown'

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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
      <article>
        <header className="relative bg-navy-950 overflow-hidden">
          <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-6 md:px-12 pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-20">
            <div className="hero-reveal">
              <Link
                href="/blog"
                className="text-navy-400 hover:text-gold-400 text-sm transition-colors inline-flex items-center gap-1 mb-6 sm:mb-10"
              >
                <span aria-hidden>←</span> Back to journal
              </Link>
              <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6">
                {meta!.category}
              </p>
              <h1 className="font-serif text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] mb-6 sm:mb-8">
                {meta!.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-300">
                <span className="font-medium text-navy-100">{meta!.author}</span>
                <span className="text-navy-500" aria-hidden>·</span>
                <span>{formatDate(meta!.date)}</span>
                <span className="text-navy-500" aria-hidden>·</span>
                <span>{meta!.readTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {meta!.image && (
          <div className="bg-white">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-12 -mt-8 md:-mt-16">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50 shadow-elevated">
                <Image
                  src={meta!.image}
                  alt={meta!.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-12 md:py-24 px-5 sm:px-6 md:px-12">
          <div className="max-w-2xl mx-auto prose-maono">
            <Markdown source={content} />
          </div>
        </div>
      </article>

      <CTABanner
        headline="Found this useful?"
        sub="Join the Telegram channel for daily analysis."
      />
    </>
  )
}
