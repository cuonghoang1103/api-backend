-- 002_outbox.sql — bài 10.3 hứa, Chương 12 làm: sự kiện ghi CÙNG transaction với lượt đặt (hết ghi kép)
CREATE TABLE outbox (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type         text  NOT NULL,                -- labflow.booking.created.v1
  subject      text  NOT NULL,                -- bk_42
  data         jsonb NOT NULL,
  created_at   timestamptz(3) NOT NULL DEFAULT now(),
  published_at timestamptz(3)                 -- NULL = chưa chuyển sang Redis Stream
);
CREATE INDEX outbox_pending ON outbox (id) WHERE published_at IS NULL;
