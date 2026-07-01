'use client'

type Props = {
  courseSlug: string
  lessonSlug: string
  onWatchProgress: (fraction: number) => void
}

// Plays a lesson from Cloudflare R2 via the enrollment-gated /api/video route
// (server verifies the session + enrollment, then hands back a short-lived
// presigned URL — the storage key never reaches the client). Download-friction
// controls; progress is best-effort (the "Mark as complete" button is the
// guaranteed completion path).
export function LessonVideo({ courseSlug, lessonSlug, onWatchProgress }: Props) {
  return (
    <video
      src={`/api/video/${courseSlug}/${lessonSlug}`}
      controls
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      playsInline
      onTimeUpdate={(e) => {
        const v = e.currentTarget
        if (v.duration > 0) onWatchProgress(v.currentTime / v.duration)
      }}
      onEnded={() => onWatchProgress(1)}
      className="h-full w-full object-contain"
    />
  )
}
