-- dm5 G2 (27/11/2026): hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết.
-- B6: Q&A có đề xuất + 2 phương án + mã đích (BR/UC/SM). Chỉ THÊM cột NULL.
ALTER TABLE "work_raid_questions" ADD COLUMN "proposal" TEXT;
ALTER TABLE "work_raid_questions" ADD COLUMN "option_a" TEXT;
ALTER TABLE "work_raid_questions" ADD COLUMN "option_b" TEXT;
ALTER TABLE "work_raid_questions" ADD COLUMN "target_ref" VARCHAR(60);

-- B9: sổ System Messages (SM-xx) — bảng "5.2 System Messages" của Report 3.
CREATE TABLE "work_system_messages" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "msg_type" VARCHAR(16) NOT NULL DEFAULT 'ERROR',
    "context" TEXT,
    "text" TEXT NOT NULL,
    "text_en" TEXT,
    "http_status" INTEGER,
    "use_case_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "ai_model" VARCHAR(80),
    "created_by_id" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_system_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_work_system_message_number" ON "work_system_messages"("project_id", "number");

ALTER TABLE "work_system_messages" ADD CONSTRAINT "work_system_messages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
