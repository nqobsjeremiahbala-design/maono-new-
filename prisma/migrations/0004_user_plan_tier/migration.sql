-- Explicit bundle tier on the user (Bronze/Silver/Gold/Platinum); null = derive from course count
ALTER TABLE "users" ADD COLUMN     "planTier" TEXT;
