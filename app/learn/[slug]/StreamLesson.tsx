'use client'

import { useEffect, useRef, useState } from 'react'
import { Stream, type StreamPlayerApi } from '@cloudflare/stream-react'

type Props = {
  courseSlug: string
  lessonSlug: string
  onWatchProgress: (fraction: number) => void
}

// Plays a lesson via Cloudflare Stream with a short-lived signed token (DRM +
// non-downloadable). The Stream player negotiates EME — Widevine (Chrome/
// Android/Edge), FairPlay (Safari/iOS), PlayReady (Edge/Windows) — itself, which
// is why we use it instead of hls.js (hls.js can't do FairPlay).
//
// Until a lesson is migrated to Stream (no stream_uid yet → token endpoint 404s)
// it falls back to the existing signed-URL R2 player.
export function StreamLesson({ courseSlug, lessonSlug, onWatchProgress }: Props) {
  const [state, setState] = useState<'loading' | 'stream' | 'fallback'>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [customerCode, setCustomerCode] = useState<string | undefined>(undefined)
  const playerRef = useRef<StreamPlayerApi | undefined>(undefined)

  useEffect(() => {
    let active = true
    setState('loading')
    fetch(`/api/stream-token/${courseSlug}/${lessonSlug}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ token?: string; customerCode?: string }>) : Promise.reject(r.status)))
      .then((d) => {
        if (!active) return
        if (d.token) {
          setToken(d.token)
          setCustomerCode(d.customerCode)
          setState('stream')
        } else setState('fallback')
      })
      .catch(() => active && setState('fallback'))
    return () => {
      active = false
    }
  }, [courseSlug, lessonSlug])

  if (state === 'loading') {
    return <div className="grid h-full w-full place-items-center text-sm text-navy-400">Loading secure video…</div>
  }

  // Fallback: signed-URL R2 player (non-downloadable) for un-migrated lessons.
  if (state === 'fallback' || !token) {
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

  return (
    <Stream
      streamRef={playerRef}
      src={token}
      customerCode={customerCode}
      controls
      height="100%"
      width="100%"
      className="h-full w-full"
      onTimeUpdate={() => {
        const p = playerRef.current
        if (p && p.duration > 0) onWatchProgress(p.currentTime / p.duration)
      }}
      onEnded={() => onWatchProgress(1)}
    />
  )
}
