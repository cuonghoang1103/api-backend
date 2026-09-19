-- Video do người dùng tự thêm (dán link YouTube/TikTok, hoặc chia sẻ từ app).
--
-- Viết TAY theo quy tắc của repo: `prisma migrate dev` không chạy được ở đây
-- (migration 20260706130000 có UNIQUE và INDEX trùng tên nên shadow DB luôn
-- P3006). Áp bằng `npx prisma migrate deploy`.
CREATE TABLE IF NOT EXISTS "video_nguoi_dung" (
    "id"         SERIAL       PRIMARY KEY,
    "user_id"    INTEGER      NOT NULL,
    "nguon"      VARCHAR(16)  NOT NULL,
    "video_id"   VARCHAR(64)  NOT NULL,
    "tieuDe"     VARCHAR(300) NOT NULL,
    "tac_gia"    VARCHAR(200),
    "anh_bia"    VARCHAR(600),
    "giay"       INTEGER,
    "cues"       JSONB        NOT NULL,
    "so_cau"     INTEGER      NOT NULL,
    "so_tu"      INTEGER      NOT NULL,
    "dich_vi"    JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_nguoi_dung_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Một người thêm cùng một video hai lần thì lần sau là CẬP NHẬT, không phải
-- hàng mới — nếu không, bấm chia sẻ hai lần là màn hình có hai ô giống nhau.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_video_nguoi_dung"
    ON "video_nguoi_dung"("user_id", "nguon", "video_id");

CREATE INDEX IF NOT EXISTS "idx_video_nguoi_dung_user"
    ON "video_nguoi_dung"("user_id");
