import Link from 'next/link'
import { ContentCover } from '@/components/shared/ContentCover'
import { getBlogPosts } from '@/lib/content'

export function NewsFeed() {
  const posts = getBlogPosts().slice(0, 4)
  if (posts.length === 0) return null

  return (
    <section className="bg-navy-50 py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Market News
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 leading-tight">
              Insights from the desk
            </h2>
          </div>
          <Link
            href="/news"
            className="press text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors"
          >
            All articles →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600 mb-2">
                  {post.category}
                </p>
                <h3 className="font-serif text-lg text-navy-900 leading-snug mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-navy-500 line-clamp-2">{post.description}</p>
                <p className="text-[11px] text-navy-400 mt-3">{post.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
