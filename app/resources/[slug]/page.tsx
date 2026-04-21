import { notFound } from 'next/navigation'
import { getResources, getResource } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  return getResources().map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getResource(slug)
    return generatePageMetadata({ title: meta.title, description: meta.description, path: `/resources/${slug}` })
  } catch {
    return {}
  }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const r = getResource(slug)
    meta = r.meta
    content = r.content
  } catch {
    notFound()
  }

  return (
    <>
      <section className="bg-navy-950 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold-500 text-sm uppercase tracking-widest mb-4">{meta!.type}</p>
          <h1 className="font-serif text-3xl text-cream-50">{meta!.title}</h1>
        </div>
      </section>
      <section className="py-12 px-4 bg-cream-50">
        <div className="max-w-2xl mx-auto prose prose-slate max-w-none">
          {content}
        </div>
      </section>
      <CTABanner
        headline="Found this useful?"
        sub="Join the signals group for daily analysis like this, direct to your WhatsApp."
      />
    </>
  )
}
