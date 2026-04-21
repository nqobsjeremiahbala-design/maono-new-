import { CourseCard } from '@/components/shared/CourseCard'
import { CTABanner } from '@/components/layout/CTABanner'
import { getCourses } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Forex Trading Courses',
  description: 'Structured forex courses from beginner to institutional level. Learn price action, trading psychology, strategies, and more.',
  path: '/courses',
})

export default function CoursesPage() {
  const courses = getCourses()
  return (
    <>
      <section className="bg-navy-950 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-cream-50 mb-4">All courses</h1>
          <p className="text-navy-300 text-lg">
            From your first chart to institutional mastery — every course built for real-world application.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 bg-cream-50">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
