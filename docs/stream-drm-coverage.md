# Cloudflare Stream + DRM — what it protects and the realistic gaps

**Goal (in scope):** stop students downloading or extracting a *playable video file*.
**Out of scope (explicitly):** stopping screen recording. DRM does **not** prevent
screen/camera recording on most platforms, and nothing in this setup claims to.

## What actually protects the content

1. **Signed URLs (`requireSignedURLs: true`) + `allowedOrigins`** — there is no
   public/raw MP4 URL, playback only works with a short-lived token minted by the
   Worker *after* auth + enrollment, and only on our domain. This alone defeats
   downloading/extracting the file.
2. **DRM (EME segment encryption)** — Widevine/FairPlay/PlayReady. Media segments
   are encrypted; a network capture yields encrypted bytes that aren't playable
   without a per-session license. This is the part that defeats *extraction of a
   playable file* even from a captured stream.

Token TTL is 1 hour and tokens are per-lesson, so a leaked token is near-useless.

## Key system per browser (which DRM is used where)

| Browser / OS | Key system | Notes |
|---|---|---|
| Chrome (desktop, Android, ChromeOS) | **Widevine** | Reliable. L3 (software) almost everywhere; L1 on some devices. |
| Edge (Chromium, Windows/Mac) | **Widevine** (PlayReady on some Win builds) | Reliable. |
| Firefox (Win/Mac) | **Widevine** (plugin) | Usually fine; downloaded on first use. |
| Safari (macOS) | **FairPlay** | Reliable; requires HTTPS. |
| Safari / all browsers on iOS & iPadOS | **FairPlay** | iOS forces WebKit, so Chrome/Edge on iOS also use FairPlay. |
| Windows UWP / Xbox / legacy Edge | **PlayReady** | Niche for a web course. |

The Cloudflare **Stream player negotiates the right key system automatically** —
this is why we use it instead of `hls.js`. **`hls.js` cannot do FairPlay**, so a
custom hls.js player would leave Safari/iOS with no DRM playback at all.

## Realistic coverage gaps — where DRM license acquisition can FAIL

Because DRM is *required*, a browser/device that can't acquire a license **can't
play the video at all** — this can block legitimate students, not just pirates.
Watch for:

- **Brave** — ships with Widevine **disabled by default**; the user must enable it. Until they do, playback fails.
- **Linux + Chromium/Firefox** — some distros/builds lack the Widevine CDM; those users can't play. (Chrome stable on Linux is usually fine.)
- **In-app / embedded webviews** — Instagram, Facebook, TikTok, some Android WebViews: EME is frequently unavailable → playback fails. (Common on mobile when opening a link from a social app.)
- **Firefox private windows / hardened privacy setups** — Widevine can be disabled.
- **Very old devices/OS** — old Android WebView or old iOS may lack a supported FairPlay/Widevine version.
- **Non-HTTPS** — EME requires a secure context. We're HTTPS-only, so fine, but worth knowing.

### Mitigations in this implementation
- **Fallback player:** any lesson without a `stream_uid` (not yet migrated) plays via the existing signed-URL R2 player, so nothing breaks mid-migration.
- **Graceful failure:** if the Stream player can't get a license, show a short message ("Your browser/device can't play protected video — try Chrome or Safari") rather than a blank box. *(TODO once we see real failures — wire the player's error event.)*
- **Decision to make:** decide whether DRM is **required** (max protection, some legit users blocked) or **best-effort** (Stream falls back to non-DRM signed playback where DRM is unavailable — fewer blocked users, slightly weaker). Confirm which mode your Stream account uses.

## Setup checklist (one-time)
1. Cloudflare dashboard → **Stream** → enable; confirm **DRM** is available/active on your plan (signed-URL protection works regardless).
2. Create an API token: **Stream:Read + Stream:Edit**. Note your **Account ID** and **customer code** (`customer-<code>` from any embed URL).
3. Set Worker secrets: `CF_ACCOUNT_ID`, `CF_STREAM_API_TOKEN`, `CF_STREAM_CUSTOMER_CODE`.
4. Run `node --env-file=.env.local scripts/migrate-to-stream.mjs --commit --poll`.
5. Test playback in Chrome, Safari (Mac + iPhone), and Edge before announcing.

> **Verify points (couldn't be tested without the live Stream account):** the exact
> signed-token `src`/`customerCode` props on `@cloudflare/stream-react`, and whether
> your account requires DRM to be explicitly enabled vs. on-by-default for signed
> videos. Both are confirmed with a single test playthrough once secrets are set.
