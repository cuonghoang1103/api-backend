-- Đối kháng realtime (05/10/2026). CHỈ THÊM bảng mới.
CREATE TABLE "doi_khang_van" (
    "id" SERIAL NOT NULL,
    "tro" VARCHAR(12) NOT NULL,
    "ma_phong" VARCHAR(8) NOT NULL,
    "nguoi_choi" INTEGER[],
    "co_bot" BOOLEAN NOT NULL DEFAULT false,
    "ket_qua" JSONB NOT NULL,
    "so_nuoc" INTEGER NOT NULL DEFAULT 0,
    "lich_su" JSONB NOT NULL,
    "bat_dau" TIMESTAMP(3) NOT NULL,
    "ket_thuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "doi_khang_van_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "idx_doi_khang_van_nguoi" ON "doi_khang_van" USING GIN ("nguoi_choi");
CREATE INDEX "idx_doi_khang_van_tro" ON "doi_khang_van"("tro", "ket_thuc");

CREATE TABLE "doi_khang_hang" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tro" VARCHAR(12) NOT NULL,
    "elo" INTEGER NOT NULL DEFAULT 1200,
    "thang" INTEGER NOT NULL DEFAULT 0,
    "thua" INTEGER NOT NULL DEFAULT 0,
    "hoa" INTEGER NOT NULL DEFAULT 0,
    "chuoi" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "doi_khang_hang_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_doi_khang_hang" ON "doi_khang_hang"("user_id", "tro");
CREATE INDEX "idx_doi_khang_hang_elo" ON "doi_khang_hang"("tro", "elo");
