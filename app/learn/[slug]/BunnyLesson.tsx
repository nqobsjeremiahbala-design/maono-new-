'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  courseSlug: string
  lessonSlug: string
  onWatchProgress: (fraction: number) => void
}

type TokenResponse = { libraryId: string; videoId: string; token: string; expires: number }

// Plays a lesson via Bunny Stream's DRM iframe player using a short-lived signed
// token (token auth + MediaCage DRM → non-downloadable). The iframe negotiates
// EME itself (Widevine/FairPlay/PlayReady). Progress is read via player.js
// (best-effort); the "Mark as complete" button is the guaranteed path.
//
// Falls back to the existing signed-URL R2 player for any lesson not yet
// migrated to Bunny (token endpoint 404s), so nothing breaks mid-migration.
export function BunnyLesson({ courseSlug, lessonSlug, onWatchProgress }: Props) {
  const [state, setState] = useState<'loading' | 'bunny' | 'fallback'>('loading')
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const progressRef = useRef(onWatchProgress)
  progressRef.current = onWatchProgress

  useEffect(() => {
    let active = true
    setState('loading')
    fetch(`/api/video-token/${courseSlug}/${lessonSlug}`)
      .then((r) => (r.ok ? (r.json() as Promise<TokenResponse>) : Promise.reject(r.status)))
      .then((d) => {
        if (!active) return
        if (d.videoId && d.token) {
          setSrc(`https://iframe.mediadelivery.net/embed/${d.libraryId}/${d.videoId}?token=${d.token}&expires=${d.expires}`)
          setState('bunny')
        } else setState('fallback')
      })
      .catch(() => active && setState('fallback'))
    return () => { active = false }
  }, [courseSlug, lessonSlug])

  // Wire player.js (browser-only → dynamic import) for live progress / auto-complete.
  useEffect(() => {
    if (state !== 'bunny' || !iframeRef.current) return
    let player: { off?: (e: string) => void } | undefined
    let cancelled = false
    import('player.js')
      .then((mod) => {
        const PJS = (mod as { default?: { Player?: unknown }; Player?: unknown }).default ?? mod
        const Player = (PJS as { Player?: unknown }).Player ??
          (window as unknown as { playerjs?: { Player?: unknown } }).playerjs?.Player
        if (cancelled || !iframeRef.current || typeof Player !== 'function') return
        const p = new (Player as new (el: HTMLIFrameElement) => typeof player & {
          on: (e: string, cb: (d: { seconds: number; duration: number }) => void) => void
        })(iframeRef.current)
        player = p
        p.on('timeupdate', (e) => { if (e?.duration > 0) progressRef.current(e.seconds / e.duration) })
        p.on('ended', () => progressRef.current(1))
      })
      .catch(() => {})
    return () => {
      cancelled = true
      try { player?.off?.('timeupdate'); player?.off?.('ended') } catch {}
    }
  }, [state, src])

  if (state === 'loading') {
    return <div className="grid h-full w-full place-items-center text-sm text-navy-400">Loading secure video…</div>
  }

  if (state === 'fallback' || !src) {
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
    <iframe
      ref={iframeRef}
      src={src}
      className="h-full w-full"
      // encrypted-media is required for DRM (EME) to work inside the iframe.
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowFullScreen
      title="Course video"
    />
  )
}
