-- Bring the runtime-created trigram index into migration history so the
-- schema, migrations, and database all agree (previously this index was
-- created only at app startup in src/index.ts, which left `prisma migrate
-- diff` wanting to DROP it).
--
-- Both statements are idempotent: on environments where the app already
-- created the extension/index at startup this is a no-op; on a fresh DB it
-- creates them. pg_trgm ships with the project's Postgres image
-- (ankane/pgvector), so CREATE EXTENSION succeeds.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "idx_social_posts_content_trgm"
  ON "social_posts" USING gin (content gin_trgm_ops);
