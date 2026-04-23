import { notFound } from 'next/navigation'
import { getCurriculum } from '@/lib/courseLessons'
import { getCourse } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'
import { LearnClient } from './LearnClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { meta } = getCourse(slug)
    return {
      ...generatePageMetadata({
        title: `${meta.title} · Player`,
        description: meta.description,
        path: `/learn/${slug}`,
      }),
      robots: { index: false, follow: false },
    }
  } catch {
    return { robots: { index: false, follow: false } }
  }
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const curriculum = getCurriculum(slug)
  if (!curriculum) notFound()

  let course
  try {
    course = getCourse(slug).meta
  } catch {
    notFound()
  }

  return <LearnClient courseSlug={slug} courseTitle={course!.title} curriculum={curriculum!} />
}
