-- WordPress migration: add legacyPasswordHash column.
-- Populated by scripts/migrate-wordpress.ts for imported WP users.
-- auth.ts clears this automatically on first successful login
-- by re-hashing the verified password with bcrypt.

ALTER TABLE "users" ADD COLUMN "legacyPasswordHash" TEXT;
