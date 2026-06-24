# Bunny Stream + DRM — setup, what it protects, and the realistic gaps

**Goal (in scope):** stop students downloading or extracting a *playable video file*.
**Out of scope:** stopping screen recording — DRM does not prevent it and we make no such claim.

## What protects the content
1. **Token Authentication + allowed referrers** — no public file URL; the iframe
   player only loads with a short-lived token minted by the Worker *after*
   auth + enrollment, and only on our domain.
2. **MediaCage DRM (Widevine/FairPlay/PlayReady)** — media segments are
   encrypted; a network capture yields encrypted bytes that aren't playable
   without a per-session license. This is what defeats *extraction of a playable
   file*.

Tokens are per-video and expire in 1 hour.

## One-time setup (Bunny dashboard)
1. Create a **Stream Video Library**. Note the **Library ID** and **API key**.
2. In the library settings, enable:
   - **Token Authentication** → copy the **Token Authentication Key**.
   - **DRM (MediaCage)** → confirm the add-on/cost on your plan.
   - **Allowed referrers** → `maonoforextrading.co.za`, `www.maonoforextrading.co.za`.
   - **Block direct URL file access / disable MP4 download**.
3. Set Worker secrets: `BUNNY_STREAM_LIBRARY_ID`, `BUNNY_STREAM_TOKEN_KEY`, and
   (for the migration only) `BUNNY_STREAM_API_KEY`.
4. Run `node --env-file=.env.local scripts/migrate-to-bunny.mjs --commit`, then
   wait for the library dashboard to show every video **Ready/Encoded**.
5. Test playback in Chrome, Safari (Mac + iPhone), and Edge.

## DRM coverage gaps (same physics as any DRM)
Because DRM is *required*, a browser that can't get a license **can't play** — this
can block legitimate students:
- **Brave** — Widevine off by default until the user enables it.
- **In-app webviews** (Instagram/Facebook/TikTok links) — EME often unavailable.
- **Some Linux/Chromium builds** — no Widevine CDM.
- **Firefox private windows / hardened setups** — Widevine may be disabled.
- **Very old Android WebView / old iOS** — version gaps.
- Non-HTTPS — EME needs a secure context (we're HTTPS-only, fine).

**Decision:** run DRM as *required* (max protection, some legit users blocked) or
*best-effort* (Bunny falls back to non-DRM token-protected playback where DRM is
unavailable — fewer blocked users, slightly weaker). Set this in the library.

Mitigation in code: any lesson without a `bunny_video_id` (un-migrated) plays via
the signed-URL R2 fallback, so nothing breaks during/after migration.

## ⚠️ Verify on first playback (couldn't be tested without a live Bunny account)
- **The embed-token recipe** in `lib/bunny.ts` (`SHA256(tokenKey + videoId + expires)`,
  hex). If Bunny returns a 403/expired, read its error and adjust the concatenation
  order — a one-line fix (same approach that fixed the R2 SigV4).
- **player.js events** firing from the Bunny iframe (progress bar / auto-complete).
  The "Mark as complete" button is the guaranteed progress path regardless.
- **DRM availability/cost** on your Bunny plan.
