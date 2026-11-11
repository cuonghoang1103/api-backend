-- Xếp lớp sau test đầu vào IELTS (Đề 0) — docs/ielts-lo-trinh-0-8.md mục 4.3. Viết tay: `migrate dev` hỏng trong repo này (P3006).
-- CHỈ THÊM bảng mới; không đụng bảng cũ.
CREATE TABLE "ielts_xep_lop" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "de_id" VARCHAR(40),
    "sang_loc" INTEGER NOT NULL,
    "nghe" INTEGER,
    "doc" INTEGER,
    "viet" DOUBLE PRECISION,
    "noi" DOUBLE PRECISION,
    "overall" DOUBLE PRECISION,
    "tap" INTEGER NOT NULL,
    "ngay" INTEGER NOT NULL,
    "tap_hieu_luc" INTEGER NOT NULL,
    "ngay_hieu_luc" INTEGER NOT NULL,
    "ly_do" JSONB NOT NULL,
    "duong_on_kem" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_xep_lop_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_ielts_xep_lop_user" ON "ielts_xep_lop"("user_id", "created_at");
