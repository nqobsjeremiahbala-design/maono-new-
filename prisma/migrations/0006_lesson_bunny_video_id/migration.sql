-- Switch video host to Bunny Stream: rename the (unused) Cloudflare column.
ALTER TABLE "lessons" RENAME COLUMN "streamUid" TO "bunnyVideoId";
