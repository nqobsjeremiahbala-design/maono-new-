import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import {
  updateCourse,
  deleteCourse,
  createModule,
  deleteModule,
  createLesson,
  deleteLesson,
} from '../actions'
import { DeleteCourseButton } from './DeleteButton'
import { LessonForm } from './LessonForm'

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          lessons: { orderBy: { position: 'asc' } },
        },
      },
    },
  })

  if (!course) notFound()

  const updateCourseWithId = updateCourse.bind(null, course.id)
  const deleteCourseAction = deleteCourse.bind(null, course.id)
  const createModuleWithId = createModule.bind(null, course.id)

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-white">Edit: {course.title}</h1>
        <DeleteCourseButton action={deleteCourseAction} />
      </div>

      {/* Course details form */}
      <form action={updateCourseWithId} className="max-w-2xl space-y-6 mb-12">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Title</label>
            <input
              name="title"
              required
              defaultValue={course.title}
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Slug</label>
            <input
              name="slug"
              required
              defaultValue={course.slug}
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-300 mb-1.5">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={course.description}
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Level</label>
            <select
              name="level"
              required
              defaultValue={course.level}
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Price (ZAR)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={course.price / 100}
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Duration</label>
            <input
              name="duration"
              required
              defaultValue={course.duration}
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-300 mb-1.5">Image URL</label>
          <input
            name="image"
            type="url"
            defaultValue={course.image || ''}
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-300">
            <input name="published" type="checkbox" defaultChecked={course.published} className="accent-gold-500" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-300">
            <input name="featured" type="checkbox" defaultChecked={course.featured} className="accent-gold-500" />
            Featured
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors"
        >
          Save Changes
        </button>
      </form>

      {/* Modules + Lessons */}
      <div className="border-t border-navy-800 pt-8">
        <h2 className="font-serif text-2xl text-white mb-6">Modules &amp; Lessons</h2>

        <div className="space-y-6">
          {course.modules.map((mod) => {
            const deleteModAction = deleteModule.bind(null, mod.id, course.id)
            const createLessonWithIds = createLesson.bind(null, mod.id, course.id)

            return (
              <div key={mod.id} className="bg-navy-900 border border-navy-800 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-white font-medium">
                    Module {mod.position + 1}: {mod.title}
                  </h3>
                  <form action={deleteModAction}>
                    <button type="submit" className="text-xs text-red-400 hover:text-red-300">
                      Delete module
                    </button>
                  </form>
                </div>

                {/* Lessons */}
                {mod.lessons.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {mod.lessons.map((lesson) => {
                      const deleteLessonAction = deleteLesson.bind(null, lesson.id, course.id)
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between bg-navy-800/50 rounded px-4 py-2"
                        >
                          <div>
                            <span className="text-white text-sm">{lesson.title}</span>
                            <span className="ml-2 text-xs text-navy-400 capitalize">
                              ({lesson.type} · {lesson.duration})
                            </span>
                          </div>
                          <form action={deleteLessonAction}>
                            <button type="submit" className="text-xs text-red-400 hover:text-red-300">
                              Remove
                            </button>
                          </form>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Add lesson form */}
                <details className="group">
                  <summary className="text-xs text-gold-400 cursor-pointer hover:text-gold-300">
                    + Add lesson
                  </summary>
                  <LessonForm action={createLessonWithIds} />
                </details>
              </div>
            )
          })}
        </div>

        {/* Add module form */}
        <form action={createModuleWithId} className="mt-6 flex gap-3">
          <input
            name="title"
            required
            placeholder="New module title"
            className="flex-1 rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors whitespace-nowrap"
          >
            + Add Module
          </button>
        </form>
      </div>
    </>
  )
}
