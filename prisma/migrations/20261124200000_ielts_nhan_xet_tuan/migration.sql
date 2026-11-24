-- 24/11/2026: Nhận xét học tập hằng tuần của CuongMini (tiếng Anh) — báo cáo theo người + tuần, và tuỳ chọn gửi email.
-- Chỉ THÊM hai bảng mới — không đụng bảng cũ.
-- CreateTable
CREATE TABLE "ielts_nhan_xet_tuan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tuan" VARCHAR(10) NOT NULL,
    "tu_luc" TIMESTAMP(3) NOT NULL,
    "den_luc" TIMESTAMP(3) NOT NULL,
    "so_lieu" JSONB NOT NULL,
    "diem_yeu" JSONB NOT NULL,
    "ke_hoach" JSONB NOT NULL,
    "nhan_xet" JSONB NOT NULL,
    "nguon" VARCHAR(8) NOT NULL,
    "model" VARCHAR(60),
    "lan_tao" INTEGER NOT NULL DEFAULT 1,
    "email_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ielts_nhan_xet_tuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_nhan_xet_cai_dat" (
    "user_id" INTEGER NOT NULL,
    "gui_email" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ielts_nhan_xet_cai_dat_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "idx_ielts_nhan_xet_tuan_tuan" ON "ielts_nhan_xet_tuan"("tuan");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ielts_nhan_xet_tuan" ON "ielts_nhan_xet_tuan"("user_id", "tuan");

-- AddForeignKey
ALTER TABLE "ielts_nhan_xet_tuan" ADD CONSTRAINT "ielts_nhan_xet_tuan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ielts_nhan_xet_cai_dat" ADD CONSTRAINT "ielts_nhan_xet_cai_dat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

