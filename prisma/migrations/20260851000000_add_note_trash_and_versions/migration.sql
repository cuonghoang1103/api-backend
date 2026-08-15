-- Notes Business Phase 2: recoverable trash + immutable version history.

ALTER TABLE "notes"
  ADD COLUMN "deleted_at" TIMESTAMP(3),
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE "note_versions" (
  "id" SERIAL NOT NULL,
  "note_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "version" INTEGER NOT NULL,
  "title" VARCHAR(300) NOT NULL,
  "content_json" JSONB,
  "content_html" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "origin" VARCHAR(24) NOT NULL DEFAULT 'AUTO_SAVE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "note_versions_pkey" PRIMARY KEY ("id")
);

-- Every existing note starts with a real v1 snapshot, so history is
-- complete immediately after deploy rather than only after its next edit.
INSERT INTO "note_versions" (
  "note_id", "user_id", "version", "title", "content_json",
  "content_html", "tags", "origin", "created_at"
)
SELECT
  "id", "user_id", 1, "title", "content_json",
  "content_html", "tags", 'INITIAL', "created_at"
FROM "notes";

CREATE UNIQUE INDEX "uk_note_version_note_number"
  ON "note_versions"("note_id", "version");
CREATE INDEX "idx_note_versions_note_created"
  ON "note_versions"("note_id", "created_at" DESC);
CREATE INDEX "idx_note_versions_user"
  ON "note_versions"("user_id");
CREATE INDEX "idx_notes_user_deleted"
  ON "notes"("user_id", "deleted_at");

ALTER TABLE "note_versions"
  ADD CONSTRAINT "note_versions_note_id_fkey"
  FOREIGN KEY ("note_id") REFERENCES "notes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "note_versions"
  ADD CONSTRAINT "note_versions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
