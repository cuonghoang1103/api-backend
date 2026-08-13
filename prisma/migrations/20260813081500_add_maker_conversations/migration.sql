-- Trí nhớ hội thoại của robot Maker Lab.
--
-- Viết TAY chứ không phải `prisma migrate dev` sinh ra: migration
-- 20260706130000_add_music_and_profile tạo một UNIQUE constraint và một
-- index TRÙNG TÊN (`post_music_post_id_key`), nên shadow database không
-- replay được và `migrate dev` luôn chết P3006. Áp bằng `migrate deploy`.

CREATE TABLE "maker_conversations" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "role" VARCHAR(12) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maker_conversations_pkey" PRIMARY KEY ("id")
);

-- Truy vấn duy nhất chạy trên bảng này là "lấy N lượt gần nhất của MỘT
-- thiết bị", nằm trên đường nói của robot nên phải nhanh. Cột thời gian
-- để DESC vì luôn đọc từ mới nhất lùi lại.
CREATE INDEX "idx_maker_conv_device_time" ON "maker_conversations"("device_id", "created_at" DESC);

ALTER TABLE "maker_conversations"
    ADD CONSTRAINT "maker_conversations_device_id_fkey"
    FOREIGN KEY ("device_id") REFERENCES "maker_devices"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
