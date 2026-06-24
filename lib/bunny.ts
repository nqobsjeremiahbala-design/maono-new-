// Bunny Stream helpers — used by the Worker token endpoint (sign a short-lived
// embed token after auth+enrollment). The migration script (scripts/migrate-to-
// bunny.mjs) talks to the upload API directly.
//
// Goal: students can't download or extract a playable file. The Bunny library is
// configured with Token Authentication + DRM (MediaCage) + allowed referrers, so
// playback needs a signed token and there is no public file URL.
//
// Worker secrets:
//   BUNNY_STREAM_LIBRARY_ID    — the Stream video library id
//   BUNNY_STREAM_TOKEN_KEY     — the library's "Token Authentication Key"
//   (upload-only, used by the migration script, not the Worker:
//    BUNNY_STREAM_API_KEY      — the library API key)
//
// ⚠️ VERIFY ON FIRST PLAYBACK: Bunny's exact embed-token recipe (the string that
// gets SHA-256'd and its order). This implementation uses the documented
// `SHA256(tokenKey + videoId + expires)` (hex). If Bunny rejects it, it's a
// one-line fix here — we'll read the 403 like we did with the R2 signature.

const IFRAME_BASE = 'https://iframe.mediadelivery.net/embed'

export function isBunnyConfigured(): boolean {
  return Boolean(process.env.BUNNY_STREAM_LIBRARY_ID && process.env.BUNNY_STREAM_TOKEN_KEY)
}

export function bunnyLibraryId(): string {
  const id = process.env.BUNNY_STREAM_LIBRARY_ID
  if (!id) throw new Error('BUNNY_STREAM_LIBRARY_ID not set')
  return id
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Sign a short-lived embed token for one video.
export async function signEmbedToken(
  videoId: string,
  ttlSeconds = 3600,
): Promise<{ token: string; expires: number }> {
  const key = process.env.BUNNY_STREAM_TOKEN_KEY
  if (!key) throw new Error('BUNNY_STREAM_TOKEN_KEY not set')
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds
  const token = await sha256Hex(`${key}${videoId}${expires}`)
  return { token, expires }
}

// Build the tokenised iframe URL for the DRM player.
export function embedUrl(videoId: string, token: string, expires: number): string {
  const lib = bunnyLibraryId()
  // autoplay off; the player negotiates DRM (Widevine/FairPlay/PlayReady) itself.
  return `${IFRAME_BASE}/${lib}/${videoId}?token=${token}&expires=${expires}`
}
