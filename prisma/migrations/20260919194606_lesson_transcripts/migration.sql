-- Phụ đề tiếng Anh của video bài giảng, đã khử trùng lặp cuốn chiếu.
-- Viết TAY theo quy tắc của kho này: `prisma migrate dev` không chạy được
-- (migration 20260706130000 có UNIQUE và INDEX trùng tên ⇒ P3006 trên shadow DB).
CREATE TABLE "lesson_transcripts" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "video_id" VARCHAR(24) NOT NULL,
    "lang" VARCHAR(12) NOT NULL DEFAULT 'en',
    "cues" JSONB NOT NULL,
    "so_cau" INTEGER NOT NULL,
    "so_tu" INTEGER NOT NULL,
    "dich_vi" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lesson_transcripts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lesson_transcripts_lesson_id_key" ON "lesson_transcripts"("lesson_id");
CREATE INDEX "idx_lesson_transcripts_video" ON "lesson_transcripts"("video_id");

ALTER TABLE "lesson_transcripts"
    ADD CONSTRAINT "lesson_transcripts_lesson_id_fkey"
    FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
