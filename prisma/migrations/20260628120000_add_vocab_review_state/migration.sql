-- Notes Phase 3b: flashcard review state on vocab rows.
-- Additive: 4 new columns with safe defaults, one new index.
-- All existing rows get isKnown=false, reviewCount=0, knownStreak=0,
-- lastReviewedAt=NULL — matches the new model defaults.
--
-- Idempotent guard: each ALTER adds the column only if missing so this
-- can be replayed safely if `prisma migrate deploy` runs twice.

ALTER TABLE "note_vocab_entries" ADD COLUMN IF NOT EXISTS "is_known" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "note_vocab_entries" ADD COLUMN IF NOT EXISTS "review_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "note_vocab_entries" ADD COLUMN IF NOT EXISTS "known_streak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "note_vocab_entries" ADD COLUMN IF NOT EXISTS "last_reviewed_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "idx_note_vocab_known" ON "note_vocab_entries"("user_id", "note_id", "is_known");
