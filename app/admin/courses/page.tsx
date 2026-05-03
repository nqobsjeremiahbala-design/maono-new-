/**
 * Admin Course List — /admin/courses
 *
 * Non-technical course management:
 * - View all courses with status (published/draft)
 * - Click to edit (modules, lessons, pricing)
 * - Create new course
 *
 * TODO: Wire to Prisma queries. For now, shows static courses from MDX.
 */

import Link from 'next/link'
import { getCourses } from '@/lib/content'

export default function AdminCoursesPage() {
  const courses = getCourses()

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
              <th className="px-4 py-3 text-navy-400 font-medium">Price</th>
              <th className="px-4 py-3 text-navy-400 font-medium">Lessons</th>
              <th className="px-4 py-3 text-navy-400 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.slug}
                className="border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-white">{course.title}</td>
                <td className="px-4 py-3 text-navy-300 capitalize">{course.level}</td>
                <td className="px-4 py-3 text-navy-300">
                  R{course.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-navy-300">{course.lessons}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-navy-500 text-xs">
                    {/* TODO: Link to /admin/courses/[id] once DB is live */}
                    Edit →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-navy-500 text-xs mt-4">
        Currently showing courses from MDX files. Once the database is connected,
        this page will manage DB-backed courses with full CRUD.
      </p>
    </>
  )
}
