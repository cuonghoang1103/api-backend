-- CT Language (app iOS) — CỘNG ĐỒNG kiểu mạng xã hội học tập (14/11/2026). docs/ct-language-app.md mục "Cộng đồng".
-- Viết tay (`migrate dev` hỏng trong repo này — P3006). CHỈ THÊM: cột mới (đều có mặc định / cho phép null) trên
-- ctl_bai + ctl_tra_loi, và 6 bảng mới (thích bài, thích trả lời, lưu bài, theo dõi, lượt xem, thông báo).
-- Xoá tài khoản ⇒ xoá theo (FK CASCADE). Không đụng dữ liệu cũ.

-- AlterTable
ALTER TABLE "ctl_bai" ADD COLUMN     "ai_luc" TIMESTAMP(3),
ADD COLUMN     "btv_boi" INTEGER,
ADD COLUMN     "btv_luc" TIMESTAMP(3),
ADD COLUMN     "so_thich" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "so_xem" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sua_luc" TIMESTAMP(3),
ADD COLUMN     "the" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tieu_de" VARCHAR(150);

-- AlterTable
ALTER TABLE "ctl_tra_loi" ADD COLUMN     "hay_nhat_luc" TIMESTAMP(3),
ADD COLUMN     "la_ai" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "so_thich" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ctl_thich_bai" (
    "user_id" INTEGER NOT NULL,
    "bai_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_thich_bai_pkey" PRIMARY KEY ("user_id","bai_id")
);

-- CreateTable
CREATE TABLE "ctl_thich_tra_loi" (
    "user_id" INTEGER NOT NULL,
    "tra_loi_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_thich_tra_loi_pkey" PRIMARY KEY ("user_id","tra_loi_id")
);

-- CreateTable
CREATE TABLE "ctl_luu_bai" (
    "user_id" INTEGER NOT NULL,
    "bai_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_luu_bai_pkey" PRIMARY KEY ("user_id","bai_id")
);

-- CreateTable
CREATE TABLE "ctl_theo_doi" (
    "nguoi_id" INTEGER NOT NULL,
    "duoc_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_theo_doi_pkey" PRIMARY KEY ("nguoi_id","duoc_id")
);

-- CreateTable
CREATE TABLE "ctl_luot_xem" (
    "bai_id" INTEGER NOT NULL,
    "nguoi" VARCHAR(40) NOT NULL,
    "ngay" DATE NOT NULL,

    CONSTRAINT "ctl_luot_xem_pkey" PRIMARY KEY ("bai_id","nguoi","ngay")
);

-- CreateTable
CREATE TABLE "ctl_thong_bao" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tu_id" INTEGER,
    "loai" VARCHAR(16) NOT NULL,
    "bai_id" INTEGER,
    "tra_loi_id" INTEGER,
    "da_doc" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_thong_bao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ctl_thich_bai_bai" ON "ctl_thich_bai"("bai_id");

-- CreateIndex
CREATE INDEX "idx_ctl_thich_tl" ON "ctl_thich_tra_loi"("tra_loi_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_ctl_luu_bai_bai" ON "ctl_luu_bai"("bai_id");

-- CreateIndex
CREATE INDEX "idx_ctl_theo_doi_duoc" ON "ctl_theo_doi"("duoc_id");

-- CreateIndex
CREATE INDEX "idx_ctl_luot_xem_ngay" ON "ctl_luot_xem"("ngay");

-- CreateIndex
CREATE INDEX "idx_ctl_thong_bao_user" ON "ctl_thong_bao"("user_id", "id");

-- CreateIndex
CREATE INDEX "idx_ctl_thong_bao_chua_doc" ON "ctl_thong_bao"("user_id", "da_doc");

-- AddForeignKey
ALTER TABLE "ctl_thich_bai" ADD CONSTRAINT "ctl_thich_bai_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thich_bai" ADD CONSTRAINT "ctl_thich_bai_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thich_tra_loi" ADD CONSTRAINT "ctl_thich_tra_loi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thich_tra_loi" ADD CONSTRAINT "ctl_thich_tra_loi_tra_loi_id_fkey" FOREIGN KEY ("tra_loi_id") REFERENCES "ctl_tra_loi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_luu_bai" ADD CONSTRAINT "ctl_luu_bai_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_luu_bai" ADD CONSTRAINT "ctl_luu_bai_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_theo_doi" ADD CONSTRAINT "ctl_theo_doi_nguoi_id_fkey" FOREIGN KEY ("nguoi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_theo_doi" ADD CONSTRAINT "ctl_theo_doi_duoc_id_fkey" FOREIGN KEY ("duoc_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_luot_xem" ADD CONSTRAINT "ctl_luot_xem_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thong_bao" ADD CONSTRAINT "ctl_thong_bao_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thong_bao" ADD CONSTRAINT "ctl_thong_bao_tu_id_fkey" FOREIGN KEY ("tu_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thong_bao" ADD CONSTRAINT "ctl_thong_bao_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_thong_bao" ADD CONSTRAINT "ctl_thong_bao_tra_loi_id_fkey" FOREIGN KEY ("tra_loi_id") REFERENCES "ctl_tra_loi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
