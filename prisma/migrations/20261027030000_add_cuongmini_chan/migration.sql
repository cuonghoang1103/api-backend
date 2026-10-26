-- Danh sách chặn CuongMini (27/10/2026): admin chặn / mở khoá người dùng lạm dụng.
-- pham_vi: 'AI_CODE' (app AI Code + extension VS Code + CLI) | 'CTWORK' (CuongMini trong CT Work).
CREATE TABLE "cuongmini_chan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pham_vi" VARCHAR(12) NOT NULL,
    "ly_do" VARCHAR(500),
    "chan_boi_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuongmini_chan_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_cuongmini_chan_user_pham_vi" ON "cuongmini_chan"("user_id", "pham_vi");
CREATE INDEX "idx_cuongmini_chan_pham_vi" ON "cuongmini_chan"("pham_vi", "created_at");
