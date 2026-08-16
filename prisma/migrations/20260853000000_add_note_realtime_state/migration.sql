-- Phase 4 Notes: compacted Yjs state for conflict-free real-time editing.
-- The source Note row remains intact; the collaboration row is created lazily
-- on the first real-time session so this migration is safe for existing data.
CREATE TABLE "note_collaboration_documents" (
    "note_id" INTEGER NOT NULL,
    "state" BYTEA NOT NULL,
    "state_vector" BYTEA NOT NULL,
    "byte_size" INTEGER NOT NULL DEFAULT 0,
    "update_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_collaboration_documents_pkey" PRIMARY KEY ("note_id")
);

CREATE INDEX "idx_note_collaboration_updated"
    ON "note_collaboration_documents"("updated_at" DESC);

ALTER TABLE "note_collaboration_documents"
    ADD CONSTRAINT "note_collaboration_documents_note_id_fkey"
    FOREIGN KEY ("note_id") REFERENCES "notes"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
