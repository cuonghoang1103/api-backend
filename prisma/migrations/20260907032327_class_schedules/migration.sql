-- Thời khoá biểu: buổi học LẶP hằng tuần.
--
-- Viết tay theo CLAUDE.md: `prisma migrate dev` không chạy được trong kho này
-- (migration 20260706130000 tạo UNIQUE rồi tạo INDEX trùng tên nên không bao
-- giờ replay được trên shadow DB → P3006). Áp bằng `prisma migrate deploy`.

CREATE TABLE "class_schedules" (
    "id"             SERIAL       NOT NULL,
    "user_id"        INTEGER      NOT NULL,
    "subject"        VARCHAR(200) NOT NULL,
    "class_code"     VARCHAR(50),
    "teacher"        VARCHAR(150),
    "room"           VARCHAR(100),
    -- 2..8 theo lối gọi Việt: 2 = thứ Hai … 8 = Chủ nhật.
    "weekday"        INTEGER      NOT NULL,
    -- "HH:mm" 24 giờ. Buổi học không có NGÀY, chỉ có giờ trong tuần.
    "start_time"     VARCHAR(5)   NOT NULL,
    "end_time"       VARCHAR(5)   NOT NULL,
    "color"          VARCHAR(20),
    "note"           TEXT,
    "remind_minutes" INTEGER      NOT NULL DEFAULT 30,
    "start_date"     DATE,
    "end_date"       DATE,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_class_schedule_user_day" ON "class_schedules"("user_id", "weekday");

ALTER TABLE "class_schedules"
    ADD CONSTRAINT "class_schedules_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
