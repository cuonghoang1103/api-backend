-- App iOS CT Work riêng (17/10/2026): mỗi thẻ thiết bị thuộc MỘT app (apns-topic).
ALTER TABLE "device_tokens" ADD COLUMN "app" VARCHAR(60) NOT NULL DEFAULT 'com.cuongthai.app';
