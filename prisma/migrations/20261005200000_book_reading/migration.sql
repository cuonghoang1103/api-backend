-- Thư viện sách (05/10/2026): tiến độ đọc + phút đọc mỗi ngày. CHỈ THÊM bảng mới.
CREATE TABLE "book_readings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "chapter" INTEGER NOT NULL DEFAULT 0,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    CONSTRAINT "book_readings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_book_reading_user_slug" ON "book_readings"("user_id", "slug");
CREATE INDEX "idx_book_reading_user_last" ON "book_readings"("user_id", "last_read_at");

CREATE TABLE "book_reading_days" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "day" VARCHAR(10) NOT NULL,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "book_reading_days_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_book_reading_day" ON "book_reading_days"("user_id", "day");
