import Link from 'next/link'
import Image from 'next/image'
import { CTABanner } from '@/components/layout/CTABanner'
import { getBlogPosts } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Blog',
  description: 'Market analysis, trading insights, and education from the Maono team.',
  path: '/blog',
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BlogPage() {
  const posts = getBlogPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-gold-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="hero-reveal max-w-3xl">
            <p className="text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-6">
              Journal
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
              Market analysis.<br />
              <span className="text-gold-400">Trader insights.</span>
            </h1>
            <p className="text-navy-200 text-lg md:text-xl max-w-xl">
              Writings from the Maono desk, methodology, risk, psychology, and what we see in the market each week.
            </p>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="py-24 px-6 bg-white text-center">
          <p className="text-navy-400">First post coming soon.</p>
        </section>
      ) : (
        <>
          {featured && (
            <section className="bg-white pt-20 md:pt-28 px-6 md:px-12">
              <div className="max-w-6xl mx-auto">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center"
                >
                  <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50 order-2 md:order-1">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="(min-width: 768px) 55vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="order-1 md:order-2">
                    <p className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                      Featured · {featured.category}
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy-900 leading-[1.1] mb-5 group-hover:text-navy-700 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-navy-600 text-lg leading-relaxed mb-6 max-w-md">
                      {featured.description}
                    </p>
                    <p className="text-sm text-navy-400">
                      {formatDate(featured.date)} · {featured.readTime} min read
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                  {rest.map(post => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-navy-100 via-white to-navy-50 mb-6">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="text-gold-600 text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                        {post.category}
                      </p>
                      <h3 className="font-serif text-xl md:text-2xl text-navy-900 leading-[1.2] mb-3 group-hover:text-navy-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-navy-600 text-[15px] leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <p className="text-xs text-navy-400 mt-auto">
                        {formatDate(post.date)} · {post.readTime} min read
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <CTABanner />
    </>
  )
}
