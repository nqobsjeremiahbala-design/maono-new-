import Link from 'next/link'
import { prisma } from '@/lib/db'
import { bundlesForCourse } from '@/lib/checkout'

export const dynamic = 'force-dynamic'

// Canonical learning sequence (module 1 → 6), used everywhere courses are listed.
const COURSE_ORDER = [
  'forex-trading-introduction',
  'price-action-trading',
  'trading-tools',
  'trading-strategies',
  'institutional-trading-concepts',
  'trading-psychology',
]
const courseRank = (slug: string) => {
  const i = COURSE_ORDER.indexOf(slug)
  return i === -1 ? COURSE_ORDER.length : i
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: { _count: { select: { lessons: true } } },
      },
      _count: { select: { enrollments: true } },
    },
  })
  courses.sort((a, b) => courseRank(a.slug) - courseRank(b.slug))

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-white">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="px-4 py-2 bg-gold-500 text-navy-950 text-sm font-semibold rounded-md hover:bg-gold-400 transition-colors"
        >
          + New Course
        </Link>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-800 text-left">
              <th className="px-4 py-3 text-navy-400 font-medium">Title</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Level</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Bundles</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Modules</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Enrollments</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Status</th>
              <th className="px-4 py-3 text-navy-400 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const lessonCount = course.modules.reduce((acc, m) => acc + m._count.lessons, 0)
              return (
                <tr
                  key={course.id}
                  className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-white">{course.title}</td>
                  <td className="px-4 py-3 text-navy-300 capitalize">{course.level}</td>
                  <td className="px-4 py-3 text-navy-300">
                    {bundlesForCourse(course.slug).map((b) => b.name).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-navy-300">
                    {course.modules.length} modules, {lessonCount} lessons
                  </td>
                  <td className="px-4 py-3 text-navy-300">{course._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      course.published
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-gold-400 hover:text-gold-300 text-xs"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <p className="text-navy-500 text-sm mt-4 text-center">
          No courses yet. Click &ldquo;+ New Course&rdquo; to create your first one.
        </p>
      )}
    </>
  )
}
