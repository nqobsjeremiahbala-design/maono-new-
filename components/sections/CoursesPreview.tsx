import Link from 'next/link'
import { CourseCard } from '@/components/shared/CourseCard'
import { Button } from '@/components/ui/Button'
import { getCourses } from '@/lib/content'

export function CoursesPreview() {
  const courses = getCourses()
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Our courses
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          Structured curriculum from introduction to institutional mastery.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {courses.map(c => <CourseCard key={c.slug} course={c} />)}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-navy-400 py-10">Courses coming soon.</p>
        )}
        <div className="text-center">
          <Button variant="outline">
            <Link href="/courses">View all courses</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
