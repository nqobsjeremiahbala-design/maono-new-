import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/content'

export function NewsFeed() {
  const posts = getBlogPosts().slice(0, 6)
  if (posts.length === 0) return null

  return (
    <section className="py-20 md:py-24 px-5 sm:px-6 bg-navy-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-2">
              News Feed
            </p>
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              Market analysis and trading insights.
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center text-gold-400 hover:text-gold-300 font-semibold text-sm whitespace-nowrap"
          >
            View all news →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-navy-950 border border-navy-800 rounded-xl overflow-hidden hover:border-gold-500/60 transition-colors"
            >
              {post.image && (
                <div className="relative aspect-[16/9] bg-navy-800 overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {post.category}
                </p>
                <h3 className="font-serif font-bold text-lg text-white mb-2 leading-snug group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-navy-300 text-sm flex-1 mb-3 line-clamp-2">{post.description}</p>
                <p className="text-navy-500 text-xs">
                  {new Date(post.date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  · {post.readTime} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
