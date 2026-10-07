-- IELTS đợt 1 (07/10/2026): flashcard SRS, sổ lỗi, phòng thi máy tính. CHỈ THÊM bảng/chỉ mục mới.

-- CreateTable
CREATE TABLE "ielts_vocab_cards" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tu" VARCHAR(80) NOT NULL,
    "ease" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "khoang" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lan" INTEGER NOT NULL DEFAULT 0,
    "quen" INTEGER NOT NULL DEFAULT 0,
    "han_luc" TIMESTAMP(3) NOT NULL,
    "lan_cuoi" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_vocab_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_vocab_reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tu" VARCHAR(80) NOT NULL,
    "diem" SMALLINT NOT NULL,
    "cach_ngay" DOUBLE PRECISION,
    "moi" BOOLEAN NOT NULL DEFAULT false,
    "ngay" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_vocab_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_daily_goals" (
    "user_id" INTEGER NOT NULL,
    "tu_moi" INTEGER NOT NULL DEFAULT 100,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ielts_daily_goals_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ielts_mistakes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nguon" VARCHAR(160) NOT NULL,
    "ky_nang" VARCHAR(12) NOT NULL,
    "dang" VARCHAR(48) NOT NULL,
    "cau_hoi" TEXT NOT NULL,
    "da_chon" TEXT NOT NULL,
    "dap_an" TEXT NOT NULL,
    "giai_thich" TEXT,
    "ly_do" VARCHAR(24),
    "cong_thuc" TEXT,
    "du_lieu" JSONB,
    "lan_sai" INTEGER NOT NULL DEFAULT 1,
    "buoc" INTEGER NOT NULL DEFAULT 0,
    "han_on" TIMESTAMP(3) NOT NULL,
    "da_xong" BOOLEAN NOT NULL DEFAULT false,
    "lan_on_cuoi" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ielts_mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ielts_cdt_attempts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "de_id" VARCHAR(40) NOT NULL,
    "ky_nang" VARCHAR(12) NOT NULL,
    "che_do" VARCHAR(12) NOT NULL,
    "dung" INTEGER,
    "tong" INTEGER,
    "band" DOUBLE PRECISION,
    "giay" INTEGER NOT NULL DEFAULT 0,
    "chi_tiet" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ielts_cdt_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ielts_the_tu_han" ON "ielts_vocab_cards"("user_id", "han_luc");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ielts_the_tu" ON "ielts_vocab_cards"("user_id", "tu");

-- CreateIndex
CREATE INDEX "idx_ielts_on_tu_ngay" ON "ielts_vocab_reviews"("user_id", "ngay");

-- CreateIndex
CREATE INDEX "idx_ielts_so_loi_han" ON "ielts_mistakes"("user_id", "han_on");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ielts_so_loi" ON "ielts_mistakes"("user_id", "nguon");

-- CreateIndex
CREATE INDEX "idx_ielts_cdt_user_de" ON "ielts_cdt_attempts"("user_id", "de_id");
