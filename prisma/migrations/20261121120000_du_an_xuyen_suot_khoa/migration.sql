-- Dự án xuyên suốt khoá (21/11/2026) — docs/du-an-hop-dong.md §4, docs/du-an-xuyen-suot-khoa.md.
-- VIẾT TAY (repo không chạy được `migrate dev`, xem CLAUDE.md). Chỉ THÊM bốn bảng mới — không đụng bảng/dữ liệu cũ.
-- Áp bằng `npx prisma migrate deploy`.
--   course_project_specs       khối `duAn` của tệp khoá (seed ghi; 1:1 với courses — KHÔNG làm cột courses để
--                              không kéo jsonb lớn theo mọi truy vấn danh sách khoá)
--   course_project_choices     đề tài người học đang làm (+ AI duyệt, lịch sử) — 1 dòng / người / khoá
--   course_project_milestones  tiến độ mốc — 1 dòng / người / khoá / mốc
--   course_project_defences    phiên bảo vệ với hội đồng AI

CREATE TABLE "course_project_specs" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "noi_dung" JSONB NOT NULL,
    "van_tay" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_project_specs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "course_project_choices" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "de_tai_slug" VARCHAR(80),
    "tu_chon" JSONB,
    "ai_duyet" JSONB,
    "luot_duyet" JSONB NOT NULL DEFAULT '[]',
    "lich_su" JSONB NOT NULL DEFAULT '[]',
    "chot_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_project_choices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "course_project_milestones" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "moc_slug" VARCHAR(120) NOT NULL,
    "moc_so" INTEGER NOT NULL,
    "trang_thai" VARCHAR(16) NOT NULL DEFAULT 'DANG_LAM',
    "repo_url" VARCHAR(500),
    "demo_url" VARCHAR(500),
    "anh_url" VARCHAR(500),
    "ghi_chu" TEXT,
    "tu_kiem" JSONB NOT NULL DEFAULT '[]',
    "de_tai_ten" VARCHAR(255),
    "nop_luc" TIMESTAMP(3),
    "xong_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_project_milestones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "course_project_defences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "trang_thai" VARCHAR(16) NOT NULL DEFAULT 'DANG_HOI',
    "de_tai" JSONB NOT NULL,
    "phien" JSONB NOT NULL DEFAULT '[]',
    "so_cau" INTEGER NOT NULL DEFAULT 6,
    "diem" DECIMAL(4,2),
    "diem_chi_tiet" JSONB,
    "nhan_xet" JSONB,
    "model" VARCHAR(80),
    "bat_dau_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ket_thuc_luc" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_project_defences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_course_project_spec_course" ON "course_project_specs"("course_id");
CREATE INDEX "idx_course_project_choices_course" ON "course_project_choices"("course_id");
CREATE UNIQUE INDEX "uk_course_project_choice" ON "course_project_choices"("user_id", "course_id");
CREATE INDEX "idx_course_project_milestones_course" ON "course_project_milestones"("course_id", "trang_thai");
CREATE UNIQUE INDEX "uk_course_project_milestone" ON "course_project_milestones"("user_id", "course_id", "moc_slug");
CREATE INDEX "idx_course_project_defences_user_course" ON "course_project_defences"("user_id", "course_id", "bat_dau_luc" DESC);

ALTER TABLE "course_project_specs" ADD CONSTRAINT "course_project_specs_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_choices" ADD CONSTRAINT "course_project_choices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_choices" ADD CONSTRAINT "course_project_choices_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_milestones" ADD CONSTRAINT "course_project_milestones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_milestones" ADD CONSTRAINT "course_project_milestones_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_defences" ADD CONSTRAINT "course_project_defences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_project_defences" ADD CONSTRAINT "course_project_defences_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
