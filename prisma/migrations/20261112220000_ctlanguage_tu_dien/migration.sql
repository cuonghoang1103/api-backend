-- CT Language — từ điển (mục từ, khoá tra, chữ Hán). docs/ct-language-app.md bước 3. Viết tay (migrate dev hỏng, P3006).
-- CHỈ THÊM bảng mới. Dữ liệu nạp bằng scripts/ctlanguage/nhap-tu-dien.mts.
CREATE TABLE "ctl_tu" (
    "id" SERIAL NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "chu" VARCHAR(160) NOT NULL,
    "chu_phu" VARCHAR(160),
    "doc" VARCHAR(240),
    "doc_latin" VARCHAR(240),
    "han_viet" VARCHAR(160),
    "nghia_vi" TEXT,
    "nghia_en" TEXT,
    "loai" VARCHAR(120),
    "thong_dung" BOOLEAN NOT NULL DEFAULT false,
    "uu_tien" INTEGER NOT NULL DEFAULT 0,
    "nguon" VARCHAR(12) NOT NULL,
    CONSTRAINT "ctl_tu_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "idx_ctl_tu_nn_chu" ON "ctl_tu"("nn", "chu");

CREATE TABLE "ctl_khoa_tra" (
    "id" SERIAL NOT NULL,
    "tu_id" INTEGER NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "khoa" VARCHAR(200) NOT NULL,
    CONSTRAINT "ctl_khoa_tra_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "idx_ctl_khoa_tra_tu" ON "ctl_khoa_tra"("tu_id");
-- Tra tiền tố `khoa LIKE 'q%'` — text_pattern_ops để chỉ mục dùng được với mọi collation. Prisma không khai được ⇒ chỉ ở đây
-- (migrate diff sẽ KHÔNG báo lệch vì Prisma không quản chỉ mục này — đừng xoá).
CREATE INDEX "idx_ctl_khoa_tra_tien_to" ON "ctl_khoa_tra"("nn", "khoa" text_pattern_ops);
ALTER TABLE "ctl_khoa_tra" ADD CONSTRAINT "ctl_khoa_tra_tu_id_fkey" FOREIGN KEY ("tu_id") REFERENCES "ctl_tu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ctl_chu_han" (
    "chu" VARCHAR(4) NOT NULL,
    "han_viet" VARCHAR(120),
    "pinyin" VARCHAR(120),
    "on_yomi" VARCHAR(160),
    "kun_yomi" VARCHAR(240),
    "nghia_en" TEXT,
    "bo_thu" INTEGER,
    "so_net" INTEGER,
    "jlpt_cu" INTEGER,
    "lop" INTEGER,
    "tan_suat" INTEGER,
    "phon_the" VARCHAR(16),
    "gian_the" VARCHAR(16),
    CONSTRAINT "ctl_chu_han_pkey" PRIMARY KEY ("chu")
);
