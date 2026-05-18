import Link from 'next/link'
import { CTABanner } from '@/components/layout/CTABanner'
import { ContentCover } from '@/components/shared/ContentCover'
import { getBlogPosts } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Market News & Insights',
  description: 'Market analysis, trading insights, and news from the Maono Forex Trading desk.',
  path: '/news',
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function NewsPage() {
  const posts = getBlogPosts()

  return (
    <>
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-12 pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Market News
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05] mb-4">
              Insights from the desk
            </h1>
            <p className="text-navy-300 text-base sm:text-lg max-w-2xl">
              Daily and weekly market commentary, trade ideas, and education from the Maono coaches.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-navy-500">No articles yet, check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="press group bg-white rounded-2xl overflow-hidden border border-navy-100 hover:border-gold-400 hover:shadow-elevated transition-all"
                >
                  <div className="relative aspect-[16/10] bg-navy-100 overflow-hidden">
                    <ContentCover
                      slug={post.slug}
                      title={post.title}
                      type={post.category}
                      image={post.image}
                      footer="Maono · Market News"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600 mb-2">
                      {post.category}
                    </p>
                    <h2 className="font-serif text-lg text-navy-900 leading-snug mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-navy-500 line-clamp-2 mb-3">{post.description}</p>
                    <p className="text-[11px] text-navy-400">
                      {formatDate(post.date)} · {post.readTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  )
}
