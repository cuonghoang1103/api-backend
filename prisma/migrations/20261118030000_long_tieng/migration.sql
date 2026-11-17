-- CT Lồng Tiếng (18/11/2026): việc lồng tiếng + mã kết nối app (chỉ ADMIN). Hợp đồng: docs/long-tieng-hop-dong.md
-- Chỉ THÊM hai bảng mới, không đụng bảng cũ.
-- CreateTable
CREATE TABLE "long_tieng_viec" (
    "id" VARCHAR(36) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "url" VARCHAR(2000),
    "tep" JSONB,
    "khoa_vao" VARCHAR(400),
    "ten_video" VARCHAR(300),
    "lang" VARCHAR(8) NOT NULL DEFAULT 'auto',
    "goc" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "nhip" VARCHAR(16) NOT NULL DEFAULT 'cho-giong',
    "nhac_nen" JSONB,
    "khoa_nhac" VARCHAR(400),
    "trang_thai" VARCHAR(16) NOT NULL DEFAULT 'cho',
    "buoc" VARCHAR(200),
    "phan_tram" INTEGER NOT NULL DEFAULT 0,
    "loi" TEXT,
    "ket_qua" JSONB,
    "thoi_luong" DOUBLE PRECISION,
    "so_lan_nhan" INTEGER NOT NULL DEFAULT 0,
    "nhip_tim" TIMESTAMP(3),
    "da_tai_ve" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "xong_luc" TIMESTAMP(3),

    CONSTRAINT "long_tieng_viec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "long_tieng_ma_ket_noi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ten" VARCHAR(100),
    "bam" VARCHAR(64) NOT NULL,
    "dau" VARCHAR(16) NOT NULL,
    "dung_lan_cuoi" TIMESTAMP(3),
    "thu_hoi" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "long_tieng_ma_ket_noi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_long_tieng_viec_trang_thai" ON "long_tieng_viec"("trang_thai", "created_at");

-- CreateIndex
CREATE INDEX "idx_long_tieng_viec_user" ON "long_tieng_viec"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_long_tieng_ma_bam" ON "long_tieng_ma_ket_noi"("bam");

-- CreateIndex
CREATE INDEX "idx_long_tieng_ma_user" ON "long_tieng_ma_ket_noi"("user_id");

-- AddForeignKey
ALTER TABLE "long_tieng_viec" ADD CONSTRAINT "long_tieng_viec_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "long_tieng_ma_ket_noi" ADD CONSTRAINT "long_tieng_ma_ket_noi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

