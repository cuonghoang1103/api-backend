-- CT Language — TRÒ CHƠI (16/11/2026): bảng điểm từng ván (bảng xếp hạng) + thách đấu bất đồng bộ. CHỈ THÊM: hai bảng.
-- Viết tay (prisma migrate dev hỏng trong repo — CLAUDE.md mục Pre-Push).
CREATE TABLE "ctl_thach_dau" (
    "id" SERIAL NOT NULL,
    "ma" VARCHAR(8) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game" VARCHAR(24) NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "cach_hien" VARCHAR(8) NOT NULL,
    "seed" INTEGER NOT NULL,
    "ten_bo" VARCHAR(60) NOT NULL,
    "de" JSONB NOT NULL,
    "het_han" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_thach_dau_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ctl_thach_dau_ma_key" ON "ctl_thach_dau"("ma");
CREATE INDEX "idx_ctl_thach_dau_nguoi" ON "ctl_thach_dau"("user_id", "created_at");

CREATE TABLE "ctl_tro_choi_diem" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game" VARCHAR(24) NOT NULL,
    "che_do" VARCHAR(12) NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "diem" INTEGER NOT NULL,
    "dung" INTEGER NOT NULL DEFAULT 0,
    "sai" INTEGER NOT NULL DEFAULT 0,
    "chang" INTEGER NOT NULL DEFAULT 0,
    "thoi_gian_ms" INTEGER NOT NULL DEFAULT 0,
    "ma_van" VARCHAR(40) NOT NULL,
    "thach_dau_id" INTEGER,
    "khung" VARCHAR(24),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_tro_choi_diem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ctl_tro_choi_diem_user_id_ma_van_key" ON "ctl_tro_choi_diem"("user_id", "ma_van");
CREATE INDEX "idx_ctl_tro_choi_bang" ON "ctl_tro_choi_diem"("game", "che_do", "nn", "created_at");
CREATE INDEX "idx_ctl_tro_choi_thach_dau" ON "ctl_tro_choi_diem"("thach_dau_id");

ALTER TABLE "ctl_thach_dau" ADD CONSTRAINT "ctl_thach_dau_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ctl_tro_choi_diem" ADD CONSTRAINT "ctl_tro_choi_diem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ctl_tro_choi_diem" ADD CONSTRAINT "ctl_tro_choi_diem_thach_dau_id_fkey" FOREIGN KEY ("thach_dau_id") REFERENCES "ctl_thach_dau"("id") ON DELETE CASCADE ON UPDATE CASCADE;
