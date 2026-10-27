-- 27/10/2026: CuongMini "hỏi nhanh" chuyển trạng thái thẻ — lần hiện gần nhất + hoãn ("Chưa") theo người + thẻ.
CREATE TABLE "work_status_nudges" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "last_shown_at" TIMESTAMP(3),
    "snoozed_until" TIMESTAMP(3),
    "answer" VARCHAR(12),
    "answered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_status_nudges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_work_status_nudge" ON "work_status_nudges"("issue_id", "user_id");
CREATE INDEX "idx_work_status_nudge_user" ON "work_status_nudges"("project_id", "user_id");
