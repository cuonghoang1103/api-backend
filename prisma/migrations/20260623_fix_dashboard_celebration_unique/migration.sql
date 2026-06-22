-- Fix multi-user data bug: the celebration uniqueness must be PER USER,
-- not global. Previously "dashboard_celebrations_celebrated_date_key" was a
-- global UNIQUE on (celebrated_date), so the first user to celebrate on a
-- given day won the row and every other user's celebrate request failed with
-- a unique-violation (surfaced as a 500). Replace it with a composite UNIQUE
-- on (user_id, celebrated_date). The old non-unique lookup index becomes
-- redundant once the composite unique exists, so drop it too.

DROP INDEX IF EXISTS "dashboard_celebrations_celebrated_date_key";
DROP INDEX IF EXISTS "idx_dashboard_celeb_user_date";

CREATE UNIQUE INDEX "uniq_dashboard_celeb_user_date"
  ON "dashboard_celebrations"("user_id", "celebrated_date");
