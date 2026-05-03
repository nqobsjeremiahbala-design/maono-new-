import { createCourse } from '../actions'

export default function NewCoursePage() {
  return (
    <>
      <h1 className="font-serif text-3xl text-white mb-8">Create Course</h1>

      <form action={createCourse} className="max-w-2xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Title</label>
            <input
              name="title"
              required
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              placeholder="Forex Trading Introduction"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Slug</label>
            <input
              name="slug"
              required
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              placeholder="forex-trading-introduction"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-300 mb-1.5">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition resize-none"
            placeholder="A comprehensive introduction to forex trading..."
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Level</label>
            <select
              name="level"
              required
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
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              placeholder="999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-300 mb-1.5">Duration</label>
            <input
              name="duration"
              required
              className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
              placeholder="6 hours"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-300 mb-1.5">Image URL (optional)</label>
          <input
            name="image"
            type="url"
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-3 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy-300">
            <input name="published" type="checkbox" defaultChecked className="accent-gold-500" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-300">
            <input name="featured" type="checkbox" className="accent-gold-500" />
            Featured
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gold-500 text-navy-950 font-semibold rounded-md hover:bg-gold-400 transition-colors"
        >
          Create Course
        </button>
      </form>
    </>
  )
}
