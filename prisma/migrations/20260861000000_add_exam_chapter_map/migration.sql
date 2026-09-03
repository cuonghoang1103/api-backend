-- Bản đồ BỀN câu hỏi → chương theo NỘI DUNG (prompt_hash), sống sót qua re-seed
-- đề (id câu đổi nhưng nội dung giữ). Khoá chương = course_sections.sort_order.
-- ADDITIVE + idempotent (IF NOT EXISTS). Viết tay, áp bằng `migrate deploy`.

CREATE TABLE IF NOT EXISTS "exam_chapter_map" (
    "id" SERIAL NOT NULL,
    "course_code" VARCHAR(40) NOT NULL,
    "prompt_hash" VARCHAR(64) NOT NULL,
    "section_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_chapter_map_pkey" PRIMARY KEY ("id")
);

-- Mỗi (khoá, nội dung câu) chỉ một chương.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_exam_chapter_map"
    ON "exam_chapter_map"("course_code", "prompt_hash");

CREATE INDEX IF NOT EXISTS "idx_exam_chapter_map_course"
    ON "exam_chapter_map"("course_code");
