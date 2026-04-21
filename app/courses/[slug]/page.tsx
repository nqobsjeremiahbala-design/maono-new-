import { notFound } from 'next/navigation'
import { getCourse, getCourses } from '@/lib/content'
import { CTABanner } from '@/components/layout/CTABanner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/shared/JsonLd'
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export async function generateStaticParams() {
  return getCourses().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getCourse(slug)
    return generatePageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/courses/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let meta, content
  try {
    const result = getCourse(slug)
    meta = result.meta
    content = result.content
  } catch {
    notFound()
  }

  return (
    <>
      <JsonLd data={courseJsonLd(meta!)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: 'https://maonoforextrading.co.za' },
        { name: 'Courses', url: 'https://maonoforextrading.co.za/courses' },
        { name: meta!.title, url: `https://maonoforextrading.co.za/courses/${slug}` },
      ])} />
      <section className="bg-navy-950 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge>{meta!.level}</Badge>
            <span className="text-navy-400 text-sm">{meta!.duration} · {meta!.lessons} lessons</span>
          </div>
          <h1 className="font-serif text-4xl text-cream-50 mb-4">{meta!.title}</h1>
          <p className="text-navy-300 text-lg mb-8">{meta!.description}</p>
          <div className="flex items-center gap-6">
            <span className="font-serif text-3xl text-gold-400">R{meta!.price.toLocaleString()}</span>
            <Button size="lg">
              <Link href="/signals">Start free with signals group first →</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-6">What you&apos;ll learn</h2>
          <ul className="grid sm:grid-cols-2 gap-3 mb-10">
            {meta!.topics.map(t => (
              <li key={t} className="flex items-start gap-2 text-sm text-navy-600">
                <span className="text-gold-500 mt-0.5 shrink-0">✓</span> {t}
              </li>
            ))}
          </ul>
          <div className="prose prose-slate max-w-none">
            {content}
          </div>
        </div>
      </section>
      <CTABanner
        headline="Not ready to buy? Start free."
        sub="Join the signals group first — get a feel for how we teach before committing to a course."
      />
    </>
  )
}
