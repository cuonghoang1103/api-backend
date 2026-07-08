-- Add a pin flag to note chapters (mirrors NoteSubject/Note isPinned).
-- Pinned chapters sort first within their subject.
ALTER TABLE "note_chapters" ADD COLUMN "is_pinned" BOOLEAN NOT NULL DEFAULT false;
