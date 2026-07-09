-- P2-10 / P2-11 — indexes for hot search + per-user language progress.
--
-- 1) Trigram (pg_trgm) GIN indexes so the user search used by
--    searchMentionableUsers() and discoverUsers() (username / display_name /
--    full_name matched with ILIKE '%q%', i.e. Prisma `contains` insensitive)
--    can use an index instead of a full sequential scan on `users` — which
--    otherwise runs on every keystroke of the @-mention and discover boxes.
-- 2) A composite btree index backing the per-user progress COUNTs in
--    getLanguages() (learned/mastered filter on user_id + status).
--
-- All statements are idempotent (IF NOT EXISTS). pg_trgm ships with the
-- project's Postgres image and is already enabled at app startup; declaring
-- it here brings these indexes into migration history so schema, migrations,
-- and the database agree. Plain (non-CONCURRENT) CREATE INDEX is fine: it
-- runs inside the migration transaction and these tables are small.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "idx_users_username_trgm"
  ON "users" USING gin ("username" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "idx_users_display_name_trgm"
  ON "users" USING gin ("display_name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "idx_users_full_name_trgm"
  ON "users" USING gin ("full_name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "idx_lang_progress_user_status"
  ON "lang_user_progress" ("user_id", "status");
