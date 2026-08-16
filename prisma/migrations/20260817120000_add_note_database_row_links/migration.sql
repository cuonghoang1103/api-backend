-- Liên kết hai chiều giữa các dòng của hai database ("relation" của Notion).
--
-- Viết TAY chứ không phải `prisma migrate dev` sinh ra — migration
-- `20260706130000_add_music_and_profile` tạo một UNIQUE và một index TRÙNG
-- TÊN nên không bao giờ replay được trên shadow database (P3006). Xem
-- CLAUDE.md. Áp bằng `npx prisma migrate deploy`.
--
-- MỘT hàng phục vụ CẢ HAI chiều: chiều xuôi tra `from_row_id`, chiều ngược
-- tra `to_row_id`. Vì thế có hai index, và ràng buộc UNIQUE gồm cả
-- `property_id` để hai cột quan hệ khác nhau giữa cùng cặp database không
-- giẫm lên nhau.
--
-- ON DELETE CASCADE ở cả ba khoá ngoại: xoá cột quan hệ, hoặc xoá một dòng ở
-- bất kỳ đầu nào, đều phải kéo theo liên kết. Để lại liên kết mồ côi thì
-- rollup sẽ đếm cả những dòng không còn tồn tại.

-- CreateTable
CREATE TABLE "note_database_row_links" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "from_row_id" INTEGER NOT NULL,
    "to_row_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_database_row_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_note_row_link" ON "note_database_row_links"("property_id", "from_row_id", "to_row_id");
CREATE INDEX "idx_note_row_link_from" ON "note_database_row_links"("property_id", "from_row_id");
CREATE INDEX "idx_note_row_link_to" ON "note_database_row_links"("property_id", "to_row_id");

-- AddForeignKey
ALTER TABLE "note_database_row_links" ADD CONSTRAINT "note_database_row_links_property_id_fkey"
  FOREIGN KEY ("property_id") REFERENCES "note_database_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_row_links" ADD CONSTRAINT "note_database_row_links_from_row_id_fkey"
  FOREIGN KEY ("from_row_id") REFERENCES "note_database_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_row_links" ADD CONSTRAINT "note_database_row_links_to_row_id_fkey"
  FOREIGN KEY ("to_row_id") REFERENCES "note_database_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
