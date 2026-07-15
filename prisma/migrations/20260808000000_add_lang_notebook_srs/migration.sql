-- Migration: add_lang_notebook_srs
-- Adds simplified SM-2 spaced-repetition columns to notebook entries so saved
-- items can be reviewed on a schedule. Fully additive (ADD COLUMN + one index).

-- AlterTable
ALTER TABLE "lang_notebook_entries"
  ADD COLUMN "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  ADD COLUMN "interval_days" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "repetitions" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "next_review_at" TIMESTAMP(3),
  ADD COLUMN "last_reviewed_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "idx_lang_nb_entry_due" ON "lang_notebook_entries"("user_id", "next_review_at");
