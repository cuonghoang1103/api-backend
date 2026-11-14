-- CT Language — Đợt C (trang chủ "khám phá") + Đợt E (bài học AI theo chủ đề + sự kiện tháng), 14/11/2026.
-- CHỈ THÊM bảng mới (không sửa bảng có sẵn). Viết tay theo CLAUDE.md (migrate dev hỏng ở repo này — P3006).
-- ctl_luot_tra: lượt mở mục từ điển ẨN DANH theo ngày (không có cột người dùng).
-- ctl_hoat_dong_ngay: phút học / thẻ ôn / cuộc gọi / đề thi mỗi ngày của một người (xếp hạng + trạm sự kiện).
-- ctl_xep_hang_an: người chọn ẩn mình khỏi bảng xếp hạng phút học.
-- ctl_bai_ai + ctl_bai_ai_hoc: bài học AI (gợi ý dùng chung + tự tạo) và "Bài của tôi".
-- ctl_su_kien + ctl_su_kien_thuong: sự kiện tháng + người đã nhận thưởng (trang phục Gấu).

-- CreateTable
CREATE TABLE "ctl_luot_tra" (
    "nn" VARCHAR(2) NOT NULL,
    "chu" VARCHAR(160) NOT NULL,
    "ngay" DATE NOT NULL,
    "so" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ctl_luot_tra_pkey" PRIMARY KEY ("nn","chu","ngay")
);

-- CreateTable
CREATE TABLE "ctl_hoat_dong_ngay" (
    "user_id" INTEGER NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "ngay" DATE NOT NULL,
    "giay" INTEGER NOT NULL DEFAULT 0,
    "the_on" INTEGER NOT NULL DEFAULT 0,
    "goi" INTEGER NOT NULL DEFAULT 0,
    "thi" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ctl_hoat_dong_ngay_pkey" PRIMARY KEY ("user_id","nn","ngay")
);

-- CreateTable
CREATE TABLE "ctl_xep_hang_an" (
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_xep_hang_an_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ctl_bai_ai" (
    "id" SERIAL NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "user_id" INTEGER,
    "goi_y_ma" VARCHAR(60),
    "chu_de" VARCHAR(160) NOT NULL,
    "trinh_do" VARCHAR(8) NOT NULL,
    "noi_dung" JSONB NOT NULL,
    "an_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_bai_ai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_bai_ai_hoc" (
    "user_id" INTEGER NOT NULL,
    "bai_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xong_luc" TIMESTAMP(3),
    "diem" INTEGER,

    CONSTRAINT "ctl_bai_ai_hoc_pkey" PRIMARY KEY ("user_id","bai_id")
);

-- CreateTable
CREATE TABLE "ctl_su_kien" (
    "id" SERIAL NOT NULL,
    "ma" VARCHAR(60) NOT NULL,
    "tieu_de" VARCHAR(120) NOT NULL,
    "mo_ta" TEXT NOT NULL,
    "nn" VARCHAR(2),
    "bat_dau" TIMESTAMP(3) NOT NULL,
    "ket_thuc" TIMESTAMP(3) NOT NULL,
    "tram" JSONB NOT NULL,
    "so_tram_can" INTEGER,
    "trang_phuc" VARCHAR(40) NOT NULL,
    "thuong_pro_ngay" INTEGER NOT NULL DEFAULT 0,
    "bat" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ctl_su_kien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctl_su_kien_thuong" (
    "su_kien_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trang_phuc" VARCHAR(40) NOT NULL,
    "pro_ngay" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_su_kien_thuong_pkey" PRIMARY KEY ("su_kien_id","user_id")
);

-- CreateIndex
CREATE INDEX "idx_ctl_luot_tra_nn_ngay" ON "ctl_luot_tra"("nn", "ngay");

-- CreateIndex
CREATE INDEX "idx_ctl_hoat_dong_nn_ngay" ON "ctl_hoat_dong_ngay"("nn", "ngay");

-- CreateIndex
CREATE INDEX "idx_ctl_bai_ai_user" ON "ctl_bai_ai"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ctl_bai_ai_goi_y" ON "ctl_bai_ai"("nn", "goi_y_ma");

-- CreateIndex
CREATE INDEX "idx_ctl_bai_ai_hoc_bai" ON "ctl_bai_ai_hoc"("bai_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ctl_su_kien_ma" ON "ctl_su_kien"("ma");

-- CreateIndex
CREATE INDEX "idx_ctl_su_kien_khoang" ON "ctl_su_kien"("bat_dau", "ket_thuc");

-- CreateIndex
CREATE INDEX "idx_ctl_su_kien_thuong_user" ON "ctl_su_kien_thuong"("user_id");

-- AddForeignKey
ALTER TABLE "ctl_hoat_dong_ngay" ADD CONSTRAINT "ctl_hoat_dong_ngay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_xep_hang_an" ADD CONSTRAINT "ctl_xep_hang_an_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_bai_ai" ADD CONSTRAINT "ctl_bai_ai_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_bai_ai_hoc" ADD CONSTRAINT "ctl_bai_ai_hoc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_bai_ai_hoc" ADD CONSTRAINT "ctl_bai_ai_hoc_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai_ai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_su_kien_thuong" ADD CONSTRAINT "ctl_su_kien_thuong_su_kien_id_fkey" FOREIGN KEY ("su_kien_id") REFERENCES "ctl_su_kien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_su_kien_thuong" ADD CONSTRAINT "ctl_su_kien_thuong_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
