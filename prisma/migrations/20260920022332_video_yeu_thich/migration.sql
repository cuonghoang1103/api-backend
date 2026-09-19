-- Video yêu thích của người dùng trong màn "Học bằng video".
--
-- Một bản ghi trỏ tới MỘT trong hai nguồn: bài giảng của web (`lesson_id`)
-- hoặc video người dùng tự thêm (`video_tu_them_id`). Không gộp thành một
-- cột số vì hai bảng khác nhau — gộp thì mất ràng buộc khoá ngoại, và khi
-- xoá video gốc sẽ còn lại mục yêu thích trỏ vào hư không.
CREATE TABLE IF NOT EXISTS "video_yeu_thich" (
    "id"               SERIAL       PRIMARY KEY,
    "user_id"          INTEGER      NOT NULL,
    "lesson_id"        INTEGER,
    "video_tu_them_id" INTEGER,
    "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_yeu_thich_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "video_yeu_thich_lesson_id_fkey" FOREIGN KEY ("lesson_id")
        REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "video_yeu_thich_video_tu_them_id_fkey" FOREIGN KEY ("video_tu_them_id")
        REFERENCES "video_nguoi_dung"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    -- Phải trỏ ĐÚNG MỘT nguồn. Thiếu chốt này thì một hàng trống cả hai cột
    -- vẫn ghi được, và nó sẽ nằm im trong danh sách yêu thích như một ô ma.
    CONSTRAINT "video_yeu_thich_mot_nguon" CHECK (
        ("lesson_id" IS NOT NULL AND "video_tu_them_id" IS NULL)
     OR ("lesson_id" IS NULL AND "video_tu_them_id" IS NOT NULL)
    )
);

-- Postgres coi các NULL là KHÁC nhau, nên hai chỉ mục này không cản trở
-- nhau: mỗi người chỉ thích một bài giảng / một video tự thêm đúng một lần.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_video_yeu_thich_bai"
    ON "video_yeu_thich"("user_id", "lesson_id") WHERE "lesson_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "uk_video_yeu_thich_tu_them"
    ON "video_yeu_thich"("user_id", "video_tu_them_id") WHERE "video_tu_them_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_video_yeu_thich_user"
    ON "video_yeu_thich"("user_id", "created_at" DESC);
