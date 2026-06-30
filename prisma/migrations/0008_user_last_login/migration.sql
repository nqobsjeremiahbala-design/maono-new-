-- Track the last successful sign-in, shown in the admin Users view.
ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
