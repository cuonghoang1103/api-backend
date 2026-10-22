-- Chương trình đào tạo /courses: khoá thuộc kỳ nào (1–15) và thứ tự trong kỳ.
-- Hai cột NULL được ⇒ thêm vào không khoá bảng lâu, không đụng dữ liệu cũ.
ALTER TABLE "courses" ADD COLUMN "lo_trinh_ky" INTEGER;
ALTER TABLE "courses" ADD COLUMN "lo_trinh_thu_tu" INTEGER;

CREATE INDEX "idx_courses_lo_trinh_ky" ON "courses"("lo_trinh_ky");
