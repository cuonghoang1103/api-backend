-- Huấn luyện học kỳ (/hoc-tap) — docs/hoc-tap-coach-plan.md

CREATE TABLE "mon_hoc_ky" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hoc_ky_id" INTEGER NOT NULL,
    "ma_mon" VARCHAR(30) NOT NULL,
    "ten" VARCHAR(200) NOT NULL,
    "course_id" INTEGER,
    "course_slug" VARCHAR(255),
    "trinh_do" TEXT,
    "muc_tieu" VARCHAR(200),
    "nen_tang" JSONB,
    "mau" VARCHAR(20),
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mon_hoc_ky_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nhiem_vu_hoc" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mon_id" INTEGER NOT NULL,
    "tuan" INTEGER NOT NULL,
    "loai" VARCHAR(16) NOT NULL,
    "tieu_de" VARCHAR(255) NOT NULL,
    "huong_dan" TEXT,
    "yeu_cau_bang_chung" TEXT,
    "lien_ket" VARCHAR(500),
    "thoi_luong_phut" INTEGER NOT NULL DEFAULT 30,
    "han_chot" TIMESTAMP(3) NOT NULL,
    "trong_so" INTEGER NOT NULL DEFAULT 1,
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "trang_thai" VARCHAR(12) NOT NULL DEFAULT 'CHUA_LAM',
    "bat_dau_luc" TIMESTAMP(3),
    "nop_luc" TIMESTAMP(3),
    "diem" DOUBLE PRECISION,
    "nhan_xet" TEXT,
    "loi_can_sua" JSONB,
    "nguoi_cham" VARCHAR(10),
    "cham_luc" TIMESTAMP(3),
    "nguon" VARCHAR(12) NOT NULL DEFAULT 'AI',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nhiem_vu_hoc_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bang_chung_hoc" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nhiem_vu_id" INTEGER NOT NULL,
    "lan_nop" INTEGER NOT NULL DEFAULT 1,
    "noi_dung" TEXT,
    "lien_ket" JSONB,
    "tep" JSONB,
    "ketQua" JSONB,
    "diem" DOUBLE PRECISION,
    "dat" BOOLEAN,
    "nguoi_cham" VARCHAR(10),
    "cham_luc" TIMESTAMP(3),
    "nop_tre" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bang_chung_hoc_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rui_ro_hoc_ngay" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mon_id" INTEGER,
    "ngay" DATE NOT NULL,
    "ty_le" INTEGER NOT NULL,
    "tien_do" INTEGER NOT NULL,
    "chi_tiet" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rui_ro_hoc_ngay_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_mon_hoc_ky_user" ON "mon_hoc_ky"("user_id");

CREATE UNIQUE INDEX "uk_mon_hoc_ky_ma" ON "mon_hoc_ky"("hoc_ky_id", "ma_mon");

CREATE INDEX "idx_nhiem_vu_hoc_user_han" ON "nhiem_vu_hoc"("user_id", "han_chot");

CREATE INDEX "idx_nhiem_vu_hoc_mon_tuan" ON "nhiem_vu_hoc"("mon_id", "tuan");

CREATE INDEX "idx_bang_chung_hoc_nv" ON "bang_chung_hoc"("nhiem_vu_id");

CREATE INDEX "idx_rui_ro_hoc_user_ngay" ON "rui_ro_hoc_ngay"("user_id", "ngay");

ALTER TABLE "mon_hoc_ky" ADD CONSTRAINT "mon_hoc_ky_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mon_hoc_ky" ADD CONSTRAINT "mon_hoc_ky_hoc_ky_id_fkey" FOREIGN KEY ("hoc_ky_id") REFERENCES "hoc_ky"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "nhiem_vu_hoc" ADD CONSTRAINT "nhiem_vu_hoc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "nhiem_vu_hoc" ADD CONSTRAINT "nhiem_vu_hoc_mon_id_fkey" FOREIGN KEY ("mon_id") REFERENCES "mon_hoc_ky"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bang_chung_hoc" ADD CONSTRAINT "bang_chung_hoc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bang_chung_hoc" ADD CONSTRAINT "bang_chung_hoc_nhiem_vu_id_fkey" FOREIGN KEY ("nhiem_vu_id") REFERENCES "nhiem_vu_hoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rui_ro_hoc_ngay" ADD CONSTRAINT "rui_ro_hoc_ngay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rui_ro_hoc_ngay" ADD CONSTRAINT "rui_ro_hoc_ngay_mon_id_fkey" FOREIGN KEY ("mon_id") REFERENCES "mon_hoc_ky"("id") ON DELETE CASCADE ON UPDATE CASCADE;
