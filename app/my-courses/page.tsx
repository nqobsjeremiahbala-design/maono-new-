import { generatePageMetadata } from '@/lib/metadata'
import { MyCoursesClient } from './MyCoursesClient'
import { getCourses } from '@/lib/content'
import { getCurriculum } from '@/lib/courseLessons'

export const metadata = {
  ...generatePageMetadata({
    title: 'My Courses',
    description: 'Your enrolled courses and learning progress.',
    path: '/my-courses',
  }),
  robots: { index: false, follow: false },
}

export default function MyCoursesPage() {
  const courses = getCourses()
  const catalog = courses.map(c => {
    const curriculum = getCurriculum(c.slug)
    return {
      slug: c.slug,
      title: c.title,
      description: c.description,
      level: c.level,
      duration: c.duration,
      image: c.image ?? `/images/courses/${c.slug}.jpg`,
      totalLessons: curriculum ? curriculum.modules.reduce((n, m) => n + m.lessons.length, 0) : c.lessons ?? 0,
      hasPlayer: !!curriculum,
    }
  })

  return <MyCoursesClient catalog={catalog} />
}
