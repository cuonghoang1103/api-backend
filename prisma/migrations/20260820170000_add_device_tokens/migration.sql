-- Thẻ định danh thiết bị cho thông báo đẩy (APNs).
--
-- `sandbox` phân biệt bản chạy thẳng từ Xcode (máy chủ push sandbox) với bản
-- TestFlight/App Store (máy chủ production). Gửi nhầm máy chủ thì Apple trả
-- `BadDeviceToken` và thông báo im lặng không tới nơi.
CREATE TABLE "device_tokens" (
    "id"           SERIAL       NOT NULL,
    "user_id"      INTEGER      NOT NULL,
    "token"        VARCHAR(200) NOT NULL,
    "platform"     VARCHAR(20)  NOT NULL DEFAULT 'ios',
    "sandbox"      BOOLEAN      NOT NULL DEFAULT false,
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- Một thẻ chỉ thuộc về một người. Người dùng đăng xuất rồi người khác đăng
-- nhập trên cùng máy thì thẻ phải CHUYỂN CHỦ, không được nhân đôi — nếu không
-- thông báo của người cũ vẫn bay tới máy người mới.
CREATE UNIQUE INDEX "uk_device_token" ON "device_tokens"("token");
CREATE INDEX "idx_device_token_user" ON "device_tokens"("user_id");

ALTER TABLE "device_tokens"
  ADD CONSTRAINT "device_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
