-- CT Language — đồng bộ sổ tay theo tài khoản (15/11/2026). CHỈ THÊM: một bảng (+ dãy số của cột phien_ban) + một chỉ mục.
CREATE TABLE "ctl_so_tu_muc" (
    "user_id" INTEGER NOT NULL,
    "loai" VARCHAR(8) NOT NULL,
    "khoa" VARCHAR(100) NOT NULL,
    "du_lieu" JSONB,
    "cap_nhat" TIMESTAMPTZ(3) NOT NULL,
    "xoa" BOOLEAN NOT NULL DEFAULT false,
    "phien_ban" BIGSERIAL NOT NULL,

    CONSTRAINT "ctl_so_tu_muc_pkey" PRIMARY KEY ("user_id","loai","khoa")
);

CREATE INDEX "idx_ctl_so_tu_phien_ban" ON "ctl_so_tu_muc"("user_id", "phien_ban");

ALTER TABLE "ctl_so_tu_muc" ADD CONSTRAINT "ctl_so_tu_muc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
