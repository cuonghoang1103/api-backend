-- Kỳ học (10 tuần, tuần 8 thi) + lịch thi từng buổi.
-- Viết tay theo CLAUDE.md; DDL lấy THẲNG từ `prisma migrate diff --from-empty`
-- rồi cắt đúng hai bảng, nên không thể lệch kiểu cột với model.

CREATE TABLE "hoc_ky" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ten" VARCHAR(120) NOT NULL,
    "bat_dau" DATE NOT NULL,
    "so_tuan" INTEGER NOT NULL DEFAULT 10,
    "tuan_thi" INTEGER NOT NULL DEFAULT 8,
    "dang_hoc" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoc_ky_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lich_thi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hoc_ky_id" INTEGER,
    "mon_hoc" VARCHAR(200) NOT NULL,
    "ma_mon" VARCHAR(50),
    "loai" VARCHAR(16) NOT NULL,
    "ngay" DATE NOT NULL,
    "bat_dau" VARCHAR(5) NOT NULL,
    "ket_thuc" VARCHAR(5) NOT NULL,
    "phong" VARCHAR(100),
    "so_bao_danh" VARCHAR(50),
    "ghi_chu" TEXT,
    "nhac_truoc" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lich_thi_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_hoc_ky_user" ON "hoc_ky"("user_id", "dang_hoc");
CREATE INDEX "idx_lich_thi_user_ngay" ON "lich_thi"("user_id", "ngay");

ALTER TABLE "hoc_ky" ADD CONSTRAINT "hoc_ky_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lich_thi" ADD CONSTRAINT "lich_thi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lich_thi" ADD CONSTRAINT "lich_thi_hoc_ky_id_fkey" FOREIGN KEY ("hoc_ky_id") REFERENCES "hoc_ky"("id") ON DELETE SET NULL ON UPDATE CASCADE;
