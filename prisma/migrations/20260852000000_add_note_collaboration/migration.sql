-- Notes Business Phase 3: typed permissions + page discussions.

-- Preserve all existing shares while moving the vocabulary to the
-- professional owner/editor/commenter/viewer model.
UPDATE "note_subject_shares"
SET "permission" = CASE
  WHEN LOWER("permission") = 'edit' THEN 'editor'
  WHEN LOWER("permission") = 'view' THEN 'viewer'
  WHEN LOWER("permission") IN ('editor', 'commenter', 'viewer') THEN LOWER("permission")
  ELSE 'viewer'
END;

ALTER TABLE "note_subject_shares"
  ALTER COLUMN "permission" SET DEFAULT 'viewer';

CREATE TABLE "note_comments" (
  "id" SERIAL NOT NULL,
  "note_id" INTEGER NOT NULL,
  "author_id" INTEGER NOT NULL,
  "parent_id" INTEGER,
  "content" VARCHAR(4000) NOT NULL,
  "resolved_at" TIMESTAMP(3),
  "resolved_by_id" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "note_comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "note_comment_mentions" (
  "comment_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  CONSTRAINT "pk_note_comment_mentions" PRIMARY KEY ("comment_id", "user_id")
);

CREATE INDEX "idx_note_comments_thread"
  ON "note_comments"("note_id", "parent_id", "created_at");
CREATE INDEX "idx_note_comments_author"
  ON "note_comments"("author_id");
CREATE INDEX "idx_note_comment_mentions_user"
  ON "note_comment_mentions"("user_id");

ALTER TABLE "note_comments" ADD CONSTRAINT "note_comments_note_id_fkey"
  FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_comments" ADD CONSTRAINT "note_comments_author_id_fkey"
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_comments" ADD CONSTRAINT "note_comments_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "note_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_comments" ADD CONSTRAINT "note_comments_resolved_by_id_fkey"
  FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "note_comment_mentions" ADD CONSTRAINT "note_comment_mentions_comment_id_fkey"
  FOREIGN KEY ("comment_id") REFERENCES "note_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_comment_mentions" ADD CONSTRAINT "note_comment_mentions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
