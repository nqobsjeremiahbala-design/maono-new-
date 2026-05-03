'use client'

export function DeleteCourseButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Delete this course and all its modules/lessons?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 text-sm text-red-400 border border-red-800 rounded-md hover:bg-red-900/30 transition-colors"
      >
        Delete Course
      </button>
    </form>
  )
}
