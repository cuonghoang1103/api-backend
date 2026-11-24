-- 24/11/2026: việc CÁ NHÂN (không thuộc môn) cho CT Work → Của tôi → Học tập & Lịch + lệnh /hoc của CuongMini.
-- Chỉ THÊM một bảng mới — không đụng bảng cũ.
CREATE TABLE "viec_ca_nhan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tieu_de" VARCHAR(255) NOT NULL,
    "ghi_chu" TEXT,
    "gio_bat_dau" TIMESTAMP(3),
    "ngay" DATE,
    "thoi_luong_phut" INTEGER NOT NULL DEFAULT 30,
    "xong_luc" TIMESTAMP(3),
    "da_nhac_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viec_ca_nhan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_viec_ca_nhan_user_ngay" ON "viec_ca_nhan"("user_id", "ngay");
CREATE INDEX "idx_viec_ca_nhan_user_gio" ON "viec_ca_nhan"("user_id", "gio_bat_dau");

ALTER TABLE "viec_ca_nhan" ADD CONSTRAINT "viec_ca_nhan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
