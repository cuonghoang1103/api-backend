-- CT Language (app iOS) — CỘNG ĐỒNG hỏi đáp theo ngôn ngữ (bước 6, 13/11/2026). docs/ct-language-app.md.
-- Viết tay: `migrate dev` hỏng trong repo này (P3006). CHỈ THÊM bảng mới; không đụng bảng cũ.
-- Kiểm duyệt (Apple 1.2): lọc từ xấu lúc đăng, báo cáo ⇒ hộp BAO_CAO của admin (gỡ trong 24 giờ), đủ 3 người báo
-- cáo ⇒ tự ẩn chờ admin, chặn người (dùng lại `user_blocks`). Xoá tài khoản ⇒ xoá theo (FK CASCADE).
CREATE TABLE "ctl_bai" (
    "id" SERIAL NOT NULL,
    "nn" VARCHAR(2) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "loai" VARCHAR(12) NOT NULL DEFAULT 'hoi',
    "noi_dung" TEXT NOT NULL,
    "so_tra_loi" INTEGER NOT NULL DEFAULT 0,
    "so_bao_cao" INTEGER NOT NULL DEFAULT 0,
    "an_luc" TIMESTAMP(3),
    "an_boi" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_bai_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ctl_tra_loi" (
    "id" SERIAL NOT NULL,
    "bai_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "noi_dung" TEXT NOT NULL,
    "so_bao_cao" INTEGER NOT NULL DEFAULT 0,
    "an_luc" TIMESTAMP(3),
    "an_boi" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_tra_loi_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_ctl_bai_nn_id" ON "ctl_bai"("nn", "id");
CREATE INDEX "idx_ctl_bai_user" ON "ctl_bai"("user_id");
CREATE INDEX "idx_ctl_tra_loi_bai" ON "ctl_tra_loi"("bai_id", "id");
CREATE INDEX "idx_ctl_tra_loi_user" ON "ctl_tra_loi"("user_id");

ALTER TABLE "ctl_bai" ADD CONSTRAINT "ctl_bai_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ctl_tra_loi" ADD CONSTRAINT "ctl_tra_loi_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ctl_tra_loi" ADD CONSTRAINT "ctl_tra_loi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
