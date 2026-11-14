-- CT Language — Thi thử chuẩn (Đợt B, 14/11/2026): lượt thi + điểm (bảng Vinh danh tuần, lịch sử, lượt free).
CREATE TABLE "ctl_luot_thi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "de_id" VARCHAR(40) NOT NULL,
    "ky_thi" VARCHAR(12) NOT NULL,
    "cap" VARCHAR(16) NOT NULL,
    "bat_dau_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nop_luc" TIMESTAMP(3),
    "diem" INTEGER,
    "diem_toi_da" INTEGER,
    "dung" INTEGER,
    "tong" INTEGER,
    "dat" BOOLEAN,
    "giay" INTEGER,
    "xep_hang" BOOLEAN NOT NULL DEFAULT false,
    "chi_tiet" JSONB,

    CONSTRAINT "ctl_luot_thi_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_ctl_luot_thi_user" ON "ctl_luot_thi"("user_id", "nn", "nop_luc");
CREATE INDEX "idx_ctl_luot_thi_luot" ON "ctl_luot_thi"("user_id", "cap", "bat_dau_luc");
CREATE INDEX "idx_ctl_luot_thi_bang" ON "ctl_luot_thi"("nn", "cap", "xep_hang", "nop_luc");

ALTER TABLE "ctl_luot_thi" ADD CONSTRAINT "ctl_luot_thi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
