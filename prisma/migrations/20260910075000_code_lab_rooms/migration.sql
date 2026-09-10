-- ============================================================
-- PHÒNG LAB — chọn một nhóm bài, đặt mục tiêu LOC, làm từng bài có AI kèm
-- ============================================================
--
-- Ba bảng chứ không phải một, và lý do nằm ở chỗ chúng bị xoá khác nhau:
--
--   code_lab_rooms          cái phòng — mục tiêu LOC, bài đang mở
--   code_lab_room_items     một bài đã chọn — trạng thái, LOC, kết quả chấm
--   code_lab_room_messages  hội thoại với gia sư, gắn với ĐÚNG một bài
--
-- ⚠️ VIẾT TAY, KHÔNG PHẢI `prisma migrate dev` SINH RA. Trong kho này
-- `migrate dev` không chạy được: migration 20260706130000_add_music_and_profile
-- tạo một UNIQUE constraint tên `post_music_post_id_key` rồi tạo tiếp một index
-- thường TRÙNG TÊN, nên nó không bao giờ replay được trên shadow database
-- (P3006). Nó đã deploy rồi nên không được sửa. Đường đi là viết SQL tay rồi
-- `prisma migrate deploy` (không dùng shadow DB).
--
-- Kiểm không lệch schema sau khi chạy:
--   npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \
--     --to-schema-datamodel prisma/schema.prisma --script     # rỗng = khớp

CREATE TYPE "code_lab_room_item_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'PASSED');

CREATE TABLE "code_lab_rooms" (
    "id"             SERIAL       NOT NULL,
    "user_id"        INTEGER      NOT NULL,
    "track_id"       INTEGER      NOT NULL,
    "name"           VARCHAR(200) NOT NULL,
    -- 750 là mặc định theo đúng yêu cầu tính năng, người dùng đổi được trong phòng.
    "loc_goal"       INTEGER      NOT NULL DEFAULT 750,
    "active_item_id" INTEGER,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_lab_rooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "code_lab_room_items" (
    "id"          SERIAL       NOT NULL,
    "room_id"     INTEGER      NOT NULL,
    "exercise_id" INTEGER      NOT NULL,
    -- LOC CHỐT tại lúc chọn, không đọc lại từ đề. Người học đã nhìn con số này
    -- và dựa vào nó để chọn đủ bài; sửa tiêu đề một bài mà tổng LOC của một
    -- phòng đang làm dở nhảy theo là thứ không giải thích được với họ.
    "loc"         INTEGER      NOT NULL DEFAULT 0,
    "sort_order"  INTEGER      NOT NULL DEFAULT 0,
    "status"      "code_lab_room_item_status" NOT NULL DEFAULT 'PENDING',
    "intro_json"  JSONB,
    "review_json" JSONB,
    "guide_json"  JSONB,
    "passed_at"   TIMESTAMP(3),
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_lab_room_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "code_lab_room_messages" (
    "id"         SERIAL       NOT NULL,
    "room_id"    INTEGER      NOT NULL,
    "item_id"    INTEGER      NOT NULL,
    "role"       VARCHAR(16)  NOT NULL,
    "content"    TEXT         NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_lab_room_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_lab_room_active_item" ON "code_lab_rooms"("active_item_id");
CREATE INDEX "idx_lab_room_user" ON "code_lab_rooms"("user_id", "updated_at" DESC);

CREATE UNIQUE INDEX "uk_lab_room_item" ON "code_lab_room_items"("room_id", "exercise_id");
CREATE INDEX "idx_lab_room_item_order" ON "code_lab_room_items"("room_id", "sort_order");
CREATE INDEX "idx_lab_room_item_exercise" ON "code_lab_room_items"("exercise_id");

CREATE INDEX "idx_lab_room_msg_item" ON "code_lab_room_messages"("item_id", "created_at");

ALTER TABLE "code_lab_rooms"
  ADD CONSTRAINT "code_lab_rooms_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_lab_rooms"
  ADD CONSTRAINT "code_lab_rooms_track_id_fkey"
  FOREIGN KEY ("track_id") REFERENCES "code_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- SetNull chứ không Cascade: bỏ một bài ra khỏi phòng thì phòng vẫn còn, chỉ là
-- không còn bài nào đang mở. Cascade ở đây sẽ XOÁ CẢ PHÒNG khi bỏ đúng cái bài
-- đang mở — mất toàn bộ tiến độ vì một thao tác người dùng tưởng là vô hại.
ALTER TABLE "code_lab_rooms"
  ADD CONSTRAINT "code_lab_rooms_active_item_id_fkey"
  FOREIGN KEY ("active_item_id") REFERENCES "code_lab_room_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "code_lab_room_items"
  ADD CONSTRAINT "code_lab_room_items_room_id_fkey"
  FOREIGN KEY ("room_id") REFERENCES "code_lab_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_lab_room_items"
  ADD CONSTRAINT "code_lab_room_items_exercise_id_fkey"
  FOREIGN KEY ("exercise_id") REFERENCES "code_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_lab_room_messages"
  ADD CONSTRAINT "code_lab_room_messages_room_id_fkey"
  FOREIGN KEY ("room_id") REFERENCES "code_lab_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "code_lab_room_messages"
  ADD CONSTRAINT "code_lab_room_messages_item_id_fkey"
  FOREIGN KEY ("item_id") REFERENCES "code_lab_room_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
