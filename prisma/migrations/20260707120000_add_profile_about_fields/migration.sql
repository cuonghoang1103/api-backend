-- ─── Extended "About" profile fields (FB-style profile) ────
-- Adds optional detail columns to user_profiles so the redesigned
-- profile page can persist hometown / work title / workplace /
-- school / college / relationship status / hobbies / languages.
-- All nullable & additive → backward-compatible, no data loss.
-- IF NOT EXISTS guards keep this idempotent across re-runs.

ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "hometown" VARCHAR(255);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "job_title" VARCHAR(255);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "workplace" VARCHAR(255);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "school" VARCHAR(255);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "college" VARCHAR(255);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "relationship_status" VARCHAR(50);
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "hobbies" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "languages" VARCHAR(255);
