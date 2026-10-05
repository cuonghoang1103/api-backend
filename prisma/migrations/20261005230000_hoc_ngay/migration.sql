-- Chuỗi ngày học các khoá kiểu sách (05/10/2026). CHỈ THÊM bảng mới.
CREATE TABLE "hoc_ngay" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stage" VARCHAR(12) NOT NULL,
    "day" VARCHAR(10) NOT NULL,
    "so_viec" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "hoc_ngay_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "uk_hoc_ngay" ON "hoc_ngay"("user_id", "stage", "day");
