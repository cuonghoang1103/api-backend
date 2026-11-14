-- Góp ý & bổ sung cho MỌI khoá học (14/11/2026) — docs/gop-y-khoa-hoc.md.
-- Viết tay: `migrate dev` hỏng trong repo này (P3006). CHỈ THÊM hai bảng mới; không đụng bảng cũ.
-- Xoá khoá ⇒ xoá góp ý (CASCADE); xoá bài ⇒ góp ý giữ, mất liên kết bài (SET NULL); xoá tài khoản ⇒ góp ý giữ
-- (ẩn danh), phiếu của người đó xoá theo.

-- CreateTable
CREATE TABLE "course_suggestions" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "lesson_id" INTEGER,
    "user_id" INTEGER,
    "vai_tro" VARCHAR(20) NOT NULL DEFAULT 'HOC_VIEN',
    "ten_ai" VARCHAR(100),
    "loai" VARCHAR(24) NOT NULL,
    "noi_dung" TEXT NOT NULL,
    "nguon" VARCHAR(1000),
    "trang_thai" VARCHAR(24) NOT NULL DEFAULT 'MOI',
    "ket_qua_doi_chieu" TEXT,
    "bang_chung" JSONB,
    "nguoi_doi_chieu" VARCHAR(100),
    "doi_chieu_luc" TIMESTAMP(3),
    "so_phieu" INTEGER NOT NULL DEFAULT 0,
    "van_tay" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_suggestion_votes" (
    "id" SERIAL NOT NULL,
    "suggestion_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_suggestion_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_course_suggestions_course_trang_thai" ON "course_suggestions"("course_id", "trang_thai", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_course_suggestions_trang_thai" ON "course_suggestions"("trang_thai", "created_at");

-- CreateIndex
CREATE INDEX "idx_course_suggestions_van_tay" ON "course_suggestions"("course_id", "van_tay");

-- CreateIndex
CREATE INDEX "idx_course_suggestions_lesson" ON "course_suggestions"("lesson_id");

-- CreateIndex
CREATE INDEX "idx_course_suggestions_user" ON "course_suggestions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_course_suggestion_votes_user" ON "course_suggestion_votes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_course_suggestion_vote" ON "course_suggestion_votes"("suggestion_id", "user_id");

-- AddForeignKey
ALTER TABLE "course_suggestions" ADD CONSTRAINT "course_suggestions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_suggestions" ADD CONSTRAINT "course_suggestions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_suggestions" ADD CONSTRAINT "course_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_suggestion_votes" ADD CONSTRAINT "course_suggestion_votes_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "course_suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_suggestion_votes" ADD CONSTRAINT "course_suggestion_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
