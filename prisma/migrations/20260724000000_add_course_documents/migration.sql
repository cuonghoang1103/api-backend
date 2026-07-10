-- Course-level documents: a CourseDocument can now belong to the whole
-- course (course_id) instead of a single lesson (lesson_id). This backs the
-- fixed "Tài liệu" area shown at the top of a course, alongside chapters.
--
-- Widening only (lesson_id becomes nullable, a new nullable column + FK +
-- index) so it's safe on existing rows. Idempotent guards let it re-run.

ALTER TABLE "course_documents" ALTER COLUMN "lesson_id" DROP NOT NULL;

ALTER TABLE "course_documents" ADD COLUMN IF NOT EXISTS "course_id" INTEGER;

DO $$ BEGIN
  ALTER TABLE "course_documents"
    ADD CONSTRAINT "course_documents_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "idx_documents_course" ON "course_documents"("course_id");
