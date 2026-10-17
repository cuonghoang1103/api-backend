-- Cổng Claude chính hãng (17/10/2026): kho key mã hoá, sổ đo dùng, trần riêng theo người.
-- Viết tay (migrate dev hỏng P3006 trong repo này — xem CLAUDE.md). Chỉ TẠO bảng mới, không đụng bảng cũ.

-- CreateTable
CREATE TABLE "anthropic_keys" (
    "id" SERIAL NOT NULL,
    "nhan" VARCHAR(80) NOT NULL,
    "khoa_ma_hoa" TEXT NOT NULL,
    "duoi_khoa" VARCHAR(8) NOT NULL,
    "van_tay" VARCHAR(64) NOT NULL,
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "ngan_sach_thang_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ngay_lam_moi" INTEGER NOT NULL DEFAULT 1,
    "het_han_luc" TIMESTAMP(3),
    "trang_thai" VARCHAR(20) NOT NULL DEFAULT 'hoatDong',
    "loi_cuoi" VARCHAR(500),
    "loi_cuoi_luc" TIMESTAMP(3),
    "het_credit_luc" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anthropic_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anthropic_usage_logs" (
    "id" SERIAL NOT NULL,
    "key_id" INTEGER,
    "user_id" INTEGER,
    "viec" VARCHAR(30) NOT NULL,
    "hang" VARCHAR(10) NOT NULL DEFAULT 'cao',
    "model" VARCHAR(80) NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "cache_doc_tokens" INTEGER NOT NULL DEFAULT 0,
    "cache_ghi_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "thanh_cong" BOOLEAN NOT NULL DEFAULT true,
    "ma_loi" VARCHAR(60),
    "thoi_gian_ms" INTEGER NOT NULL DEFAULT 0,
    "ttfb_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anthropic_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anthropic_user_caps" (
    "user_id" INTEGER NOT NULL,
    "tran_thang_usd" DOUBLE PRECISION,
    "tran_ngay_usd" DOUBLE PRECISION,
    "free_thang_usd" DOUBLE PRECISION,
    "free_ngay_usd" DOUBLE PRECISION,
    "ghi_chu" VARCHAR(200),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anthropic_user_caps_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_anthropic_key_van_tay" ON "anthropic_keys"("van_tay");

-- CreateIndex
CREATE INDEX "idx_anthropic_key_thu_tu" ON "anthropic_keys"("thu_tu");

-- CreateIndex
CREATE INDEX "idx_anthropic_usage_key" ON "anthropic_usage_logs"("key_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_anthropic_usage_user" ON "anthropic_usage_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_anthropic_usage_created" ON "anthropic_usage_logs"("created_at");

-- AddForeignKey
ALTER TABLE "anthropic_usage_logs" ADD CONSTRAINT "anthropic_usage_logs_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "anthropic_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;

