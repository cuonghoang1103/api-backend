-- Góp ý & báo lỗi của người dùng (08/11/2026). CHỈ THÊM, không phá:
--   * user_feedback — trang /gop-y + hộp đánh giá 5 sao tự hiện; admin xử lý ở /admin/gop-y.
-- Viết tay + `npx prisma migrate deploy` (CLAUDE.md: `migrate dev` hỏng P3006 ở repo này).

CREATE TABLE "user_feedback" (
    "id"             SERIAL NOT NULL,
    "user_id"        INTEGER,
    "loai"           VARCHAR(12) NOT NULL,
    "so_sao"         SMALLINT,
    "tieu_de"        VARCHAR(200),
    "noi_dung"       TEXT,
    "muc_do"         VARCHAR(8),
    "trang"          VARCHAR(500),
    "nguon"          VARCHAR(8) NOT NULL DEFAULT 'PAGE',
    "email_lien_he"  VARCHAR(200),
    "thiet_bi"       VARCHAR(400),
    "anh_urls"       TEXT[] DEFAULT ARRAY[]::TEXT[],
    "trang_thai"     VARCHAR(10) NOT NULL DEFAULT 'MOI',
    "tra_loi"        TEXT,
    "tra_loi_boi_id" INTEGER,
    "tra_loi_luc"    TIMESTAMP(3),
    "ghi_chu_noi_bo" TEXT,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_gop_y_trang_thai" ON "user_feedback"("trang_thai", "created_at" DESC);
CREATE INDEX "idx_gop_y_user" ON "user_feedback"("user_id", "created_at" DESC);
CREATE INDEX "idx_gop_y_loai" ON "user_feedback"("loai", "created_at" DESC);

ALTER TABLE "user_feedback"
  ADD CONSTRAINT "user_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
