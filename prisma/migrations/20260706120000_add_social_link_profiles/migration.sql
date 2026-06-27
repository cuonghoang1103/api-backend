-- ─── Social Link Profiles (Phase 3 add) ─────────────────────
-- Adds the social_link_profiles table that mobile.routes.ts
-- expects (it was broken since some earlier deploy — the model
-- was missing from the schema but the route still referenced
-- prisma.socialLink, causing backend `tsc` to fail at build).
--
-- Schema is intentionally minimal: one row per (user, platform)
-- with url + optional username + sort order. The legacy JSON
-- column on User (socialLinks) is kept for backward compat
-- with the existing /profile page (which renders it as
-- Record<string, string>); the new relation is the source of
-- truth for the mobile app.
--
-- ADD COLUMN with default is metadata-only in Postgres 11+ so
-- the migration is safe on a hot table.

CREATE TABLE "social_link_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(32) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "username" VARCHAR(64),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_link_profiles_pkey" PRIMARY KEY ("id")
);

-- Unique (user, platform) — a user can have one link per platform
CREATE UNIQUE INDEX "uk_social_link_user_platform" ON "social_link_profiles"("user_id", "platform");

-- Fast lookup by user (for the mobile app's "get my links" query)
CREATE INDEX "idx_social_links_user" ON "social_link_profiles"("user_id");

-- FK to users with CASCADE so links are deleted with the user
ALTER TABLE "social_link_profiles" ADD CONSTRAINT "social_link_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
