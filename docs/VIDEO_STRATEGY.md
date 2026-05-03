# Video & Storage Strategy

## Current State

- Hero videos: self-hosted MP4/WebM in `/public/videos/` (small, fine as-is)
- Course lesson videos: placeholder URL pointing to Google sample video
- Player: native HTML5 `<video>` element in `LearnClient.tsx`

## Recommended Approach: Mux (primary) or Vercel Blob (budget)

### Option A: Mux (recommended for production)

**Why:** Mux is purpose-built for video education platforms. Handles encoding,
adaptive bitrate (HLS), signed URLs for access control, thumbnails, and analytics.

**Integration points:**
- Upload: Admin uploads via Mux direct upload API → stores `playbackId` on Lesson
- Playback: `<MuxPlayer>` React component (from `@mux/mux-player-react`)
- Access control: Signed playback tokens (JWT) tied to enrollment status
- Storage: Mux hosts all video — no need for separate blob storage

**Lesson schema field:** `videoUrl` stores Mux `playbackId` (e.g., `"a4nOgR00qDeLaj"`)

**Cost:** ~$0.007/min watched + $0.02/min encoded. For 6 courses × 2hr avg = 12hr
of content, encoding cost is ~$14.40 one-time; streaming scales with students.

### Option B: Vercel Blob (budget/MVP)

**Why:** Simpler, cheaper for low-traffic MVP. No adaptive bitrate.

**Integration points:**
- Upload: Admin uploads MP4 via `@vercel/blob` put()
- Playback: Native `<video>` element with Blob URL
- Access control: Signed URLs with expiry (via Blob read tokens)
- Limitation: No HLS, no quality switching, no built-in analytics

**Cost:** $0.15/GB stored + $0.06/GB transferred.

### Option C: YouTube/Vimeo (simplest, least control)

Embed via iframe. Cheapest, but no access control (unlisted links are guessable),
no custom player, and platform-dependent availability.

## Recommendation

Start with **Mux** for the real product. The cost is modest for a paid education
platform, and it solves access control, encoding, and adaptive streaming in one
integration. The `<MuxPlayer>` component drops into the existing `LearnClient.tsx`
layout with minimal changes.

## TODO Boundaries

These are the implementation tasks for the next phase:

1. **Install Mux SDK:** `npm install @mux/mux-node @mux/mux-player-react`
2. **Admin video upload:** Add upload widget to `/admin/courses/[id]` lesson editor
3. **Signed playback:** Create `/api/video/token` route that checks enrollment and
   returns a signed Mux playback token
4. **Replace `<video>`:** Swap native player in `LearnClient.tsx` for `<MuxPlayer>`
5. **Migration script:** Upload existing placeholder content to Mux and update
   Lesson records with real `playbackId` values
6. **Hero videos:** Keep self-hosted in `/public/videos/` — these are small,
   public marketing assets. No change needed.
