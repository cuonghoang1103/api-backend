-- 003_shared_state.sql — trạng thái mà MỌI instance phải thấy giống nhau (bài 12.4)
-- Bài 8.3 từng tạo bảng này lúc khởi động (CREATE TABLE IF NOT EXISTS trong code) — nay nó có lịch sử như mọi bảng khác.
CREATE TABLE IF NOT EXISTS idempotency_keys (
  scope      text NOT NULL,
  key        text NOT NULL,
  fp         text NOT NULL,
  state      text NOT NULL CHECK (state IN ('running', 'done')),
  status     int,
  body       jsonb,
  location   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key)
);
CREATE INDEX IF NOT EXISTS idempotency_keys_created ON idempotency_keys (created_at);
-- Số phiên bản của bộ sưu tập cho ETag danh sách (bài 9.1). SEQUENCE: tăng không khoá dòng nào, mọi instance đọc chung.
CREATE SEQUENCE bookings_list_version;
-- Bài 10.5 từng tạo hai bảng webhook lúc khởi động — chuyển vào migration
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id text PRIMARY KEY, owner_id text NOT NULL, url text NOT NULL, events text[] NOT NULL, secret text NOT NULL,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id bigserial PRIMARY KEY, msg_id text NOT NULL, subscription_id text NOT NULL, event_type text NOT NULL,
  attempt int NOT NULL, status_code int, error text, duration_ms int, at timestamptz NOT NULL DEFAULT now());
