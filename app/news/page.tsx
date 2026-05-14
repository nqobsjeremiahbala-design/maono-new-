import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Market News & Analysis',
  description: 'Forex market news, daily analysis, and trading commentary from the Maono team.',
  path: '/news',
})

export default function NewsPage() {
  const posts = getBlogPosts()

  return (
    <>
      <section className="bg-navy-950 py-16 md:py-20 px-5 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">
            News Feed
          </p>
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Market news &amp; analysis
          </h1>
          <p className="text-navy-300 text-base sm:text-lg">
            Daily commentary, breakdowns, and trading insights from the Maono team.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 sm:px-6 bg-navy-900">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </section>
    </>
  )
}
