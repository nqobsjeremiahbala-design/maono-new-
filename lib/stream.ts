// Cloudflare Stream helpers — used by the migration script (copy from R2) and
// the Worker token endpoint (mint short-lived signed playback tokens).
//
// Required secrets:
//   CF_ACCOUNT_ID         — your Cloudflare account id
//   CF_STREAM_API_TOKEN   — API token with Stream:Read + Stream:Edit
//   CF_STREAM_CUSTOMER_CODE — the "customer-<code>" subdomain for playback URLs
//                             (shown on any video's embed URL; also returned as
//                              the host of result.playback.hls)
//
// Goal: students can't download or extract a playable file. Every video is
// uploaded with requireSignedURLs:true (no public/raw URL) and locked to our
// domain; playback needs a short-lived token minted only after auth+enrollment.
// DRM (segment encryption) is layered on top — see docs/stream-drm-coverage.md.

const API = 'https://api.cloudflare.com/client/v4'

function cfg() {
  const accountId = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_STREAM_API_TOKEN
  if (!accountId || !token) throw new Error('Cloudflare Stream not configured (CF_ACCOUNT_ID / CF_STREAM_API_TOKEN)')
  return { accountId, token }
}

function authHeaders() {
  return { Authorization: `Bearer ${cfg().token}`, 'Content-Type': 'application/json' }
}

export function isStreamConfigured(): boolean {
  return Boolean(process.env.CF_ACCOUNT_ID && process.env.CF_STREAM_API_TOKEN)
}

type CfResult<T> = { success: boolean; errors?: unknown; result: T }

// ── Migration: pull a video into Stream from a (presigned) source URL ───────
// Uses the "copy" endpoint so Stream fetches the file itself — handles large
// files server-side, no local re-upload. requireSignedURLs makes it
// non-downloadable; allowedOrigins locks playback to our domain.
export async function copyFromUrl(opts: {
  url: string
  name: string
  allowedOrigins: string[]
}): Promise<{ uid: string }> {
  const { accountId } = cfg()
  const res = await fetch(`${API}/accounts/${accountId}/stream/copy`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      url: opts.url,
      meta: { name: opts.name },
      requireSignedURLs: true,
      allowedOrigins: opts.allowedOrigins,
    }),
  })
  const body = (await res.json()) as CfResult<{ uid: string }>
  if (!res.ok || !body.success) throw new Error(`Stream copy failed: ${res.status} ${JSON.stringify(body.errors)}`)
  return { uid: body.result.uid }
}

// Poll a video until it has finished processing.
export async function getVideoStatus(uid: string): Promise<{ state: string; pctComplete?: string }> {
  const { accountId } = cfg()
  const res = await fetch(`${API}/accounts/${accountId}/stream/${uid}`, { headers: authHeaders() })
  const body = (await res.json()) as CfResult<{ status: { state: string; pctComplete?: string } }>
  if (!res.ok || !body.success) throw new Error(`Stream status failed: ${res.status}`)
  return body.result.status
}

// ── Playback: mint a short-lived signed token for one video ─────────────────
// Called by the Worker AFTER it has verified session + enrollment. The token is
// scoped to the video uid and expires quickly, so a leaked token is near-useless.
export async function mintPlaybackToken(uid: string, ttlSeconds = 3600): Promise<string> {
  const { accountId } = cfg()
  const res = await fetch(`${API}/accounts/${accountId}/stream/${uid}/token`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      // exp is a unix timestamp; keep it short so tokens can't be shared for long.
      exp: Math.floor(Date.now() / 1000) + ttlSeconds,
      // never allow the MP4 download endpoint
      downloadable: false,
    }),
  })
  const body = (await res.json()) as CfResult<{ token: string }>
  if (!res.ok || !body.success) throw new Error(`Stream token mint failed: ${res.status} ${JSON.stringify(body.errors)}`)
  return body.result.token
}

// The customer subdomain used to build playback/iframe URLs.
export function streamCustomerCode(): string | undefined {
  return process.env.CF_STREAM_CUSTOMER_CODE
}
