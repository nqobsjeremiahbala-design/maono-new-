-- Cloudflare Stream video UID per lesson (DRM-protected playback)
ALTER TABLE "lessons" ADD COLUMN     "streamUid" TEXT;
