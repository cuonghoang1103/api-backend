-- Migration: add_block_and_report
-- Description: Add UserBlock + ThreadReport models so users can block
-- each other from DMs and report chat threads to moderators.
--
-- UserBlock: per-user blocklist. blocker_id is the actor, blocked_id
-- is the target. Cascades on user delete so the blocklist never
-- references a non-existent user.
--
-- ThreadReport: a row per (reporter, thread) with a free-form
-- reason. resolved_at / resolved_by stay null until a moderator
-- picks it up.

CREATE TABLE IF NOT EXISTS "user_blocks" (
  "id"          SERIAL PRIMARY KEY,
  "blocker_id"  INTEGER NOT NULL,
  "blocked_id"  INTEGER NOT NULL,
  "reason"      VARCHAR(200),
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "uk_block_pair" UNIQUE ("blocker_id", "blocked_id")
);

CREATE INDEX IF NOT EXISTS "idx_block_blocker" ON "user_blocks" ("blocker_id");
CREATE INDEX IF NOT EXISTS "idx_block_blocked" ON "user_blocks" ("blocked_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_block_blocker') THEN
    ALTER TABLE "user_blocks"
      ADD CONSTRAINT "fk_block_blocker" FOREIGN KEY ("blocker_id")
      REFERENCES "users"("id") ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_block_blocked') THEN
    ALTER TABLE "user_blocks"
      ADD CONSTRAINT "fk_block_blocked" FOREIGN KEY ("blocked_id")
      REFERENCES "users"("id") ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "thread_reports" (
  "id"           SERIAL PRIMARY KEY,
  "reporter_id"  INTEGER NOT NULL,
  "thread_id"    INTEGER NOT NULL,
  "reason"       VARCHAR(200) NOT NULL,
  "category"     VARCHAR(30),
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "resolved_at"  TIMESTAMPTZ,
  "resolved_by"  INTEGER,
  "resolution"   VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS "idx_report_reporter" ON "thread_reports" ("reporter_id");
CREATE INDEX IF NOT EXISTS "idx_report_thread"   ON "thread_reports" ("thread_id");
CREATE INDEX IF NOT EXISTS "idx_report_resolved" ON "thread_reports" ("resolved_at");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_report_reporter') THEN
    ALTER TABLE "thread_reports"
      ADD CONSTRAINT "fk_report_reporter" FOREIGN KEY ("reporter_id")
      REFERENCES "users"("id") ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_report_thread') THEN
    ALTER TABLE "thread_reports"
      ADD CONSTRAINT "fk_report_thread" FOREIGN KEY ("thread_id")
      REFERENCES "message_threads"("id") ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_report_resolver') THEN
    ALTER TABLE "thread_reports"
      ADD CONSTRAINT "fk_report_resolver" FOREIGN KEY ("resolved_by")
      REFERENCES "users"("id") ON DELETE SET NULL;
  END IF;
END $$;
