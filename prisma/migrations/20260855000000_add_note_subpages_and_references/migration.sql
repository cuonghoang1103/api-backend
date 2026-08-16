-- Phase 6 Notes: sub-pages (nested notes) + wiki-style backlinks.
--
-- Both are additive. `parent_note_id` stays NULL for every existing note, so
-- the current flat tree renders exactly as before until someone nests a page.

ALTER TABLE "notes" ADD COLUMN "parent_note_id" INTEGER;

CREATE INDEX "idx_notes_parent" ON "notes"("parent_note_id", "sort_order");

-- ON DELETE CASCADE: deleting a parent removes its sub-pages. Notes are
-- soft-deleted through `deleted_at`, so this only fires on the permanent
-- purge (trash retention or explicit permanent delete), never on a normal
-- "move to trash".
ALTER TABLE "notes"
  ADD CONSTRAINT "notes_parent_note_id_fkey"
  FOREIGN KEY ("parent_note_id") REFERENCES "notes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "note_references" (
  "id" SERIAL NOT NULL,
  "source_note_id" INTEGER NOT NULL,
  "target_note_id" INTEGER NOT NULL,
  "label" VARCHAR(300) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "note_references_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_note_reference_pair"
  ON "note_references"("source_note_id", "target_note_id");
CREATE INDEX "idx_note_references_target"
  ON "note_references"("target_note_id");

ALTER TABLE "note_references"
  ADD CONSTRAINT "note_references_source_note_id_fkey"
  FOREIGN KEY ("source_note_id") REFERENCES "notes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "note_references"
  ADD CONSTRAINT "note_references_target_note_id_fkey"
  FOREIGN KEY ("target_note_id") REFERENCES "notes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
