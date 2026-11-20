-- "Lệnh & code trong video" (20/11/2026): lệnh terminal + khối code hiện trong video riêng của bài, kèm mốc + giải thích.
-- Bảng MỚI, chỉ THÊM — không đụng bảng nào sẵn có. Viết tay (migrate dev vỡ P3006 trong repo này, xem CLAUDE.md).
CREATE TABLE "lesson_video_commands" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "track" VARCHAR(4) NOT NULL DEFAULT 'VI',
    "video_url" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "so_muc" INTEGER NOT NULL,
    "van_tay" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_video_commands_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_lesson_video_command_track" ON "lesson_video_commands"("lesson_id", "track");

ALTER TABLE "lesson_video_commands" ADD CONSTRAINT "lesson_video_commands_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
