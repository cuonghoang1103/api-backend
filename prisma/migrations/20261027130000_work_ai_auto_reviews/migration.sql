-- 27/10/2026: CuongMini tự review thẻ ở cột Review (chế độ tự động, mặc định tắt) — nhật ký + hoàn tác.
CREATE TABLE "work_ai_auto_reviews" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "acting_user_id" INTEGER NOT NULL,
    "decision" VARCHAR(8) NOT NULL,
    "from_status_id" INTEGER,
    "to_status_id" INTEGER,
    "summary" TEXT,
    "issue_updated_at" TIMESTAMP(3) NOT NULL,
    "undone_at" TIMESTAMP(3),
    "undone_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_ai_auto_reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_ai_auto_review_project" ON "work_ai_auto_reviews"("project_id", "created_at");
CREATE INDEX "idx_work_ai_auto_review_issue" ON "work_ai_auto_reviews"("issue_id");
