'use client'

import { useState, useRef } from 'react'

const inputClass =
  'w-full rounded border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-1 focus:ring-gold-500'

export function LessonForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadedKey, setUploadedKey] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [fileName, setFileName] = useState('')
  const [lessonType, setLessonType] = useState<'video' | 'text'>('video')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')
    setUploading(true)
    setFileName(file.name)

    const body = new FormData()
    body.append('video', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })

      if (!res.ok) {
        const data = await res.json()
        setUploadError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      const { fileKey } = await res.json()
      setUploadedKey(fileKey)
      setUploading(false)
    } catch {
      setUploadError('Upload failed — check your connection')
      setUploading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    if (lessonType === 'video' && uploadedKey) {
      formData.set('videoUrl', uploadedKey)
    }
    await action(formData)
  }

  return (
    <form action={handleSubmit} className="mt-3 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="title" required placeholder="Lesson title" className={inputClass} />
        <input name="slug" required placeholder="lesson-slug" className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <select
          name="type"
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value as 'video' | 'text')}
          className={inputClass}
        >
          <option value="video">Video</option>
          <option value="text">Text</option>
        </select>
        <input name="duration" required placeholder="5 min" className={inputClass} />

        {lessonType === 'video' && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`${inputClass} text-left cursor-pointer ${
                uploadedKey ? 'border-green-600 text-green-400' : ''
              }`}
            >
              {uploading
                ? 'Uploading…'
                : uploadedKey
                ? `✓ ${fileName}`
                : 'Choose video file'}
            </button>
            <input type="hidden" name="videoUrl" value={uploadedKey} />
          </div>
        )}
      </div>

      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}

      <input
        name="description"
        required
        placeholder="Brief lesson description"
        className={inputClass}
      />

      {lessonType === 'text' && (
        <textarea
          name="content"
          rows={3}
          placeholder="Markdown content (for text lessons)"
          className={`${inputClass} resize-none`}
        />
      )}

      <button
        type="submit"
        disabled={uploading || (lessonType === 'video' && !uploadedKey)}
        className="px-4 py-1.5 text-sm bg-gold-500 text-navy-950 font-semibold rounded hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Lesson
      </button>
    </form>
  )
}
