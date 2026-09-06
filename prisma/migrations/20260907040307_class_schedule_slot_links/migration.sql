-- Slot của FAP + link phòng học trực tuyến + link tài liệu.
-- Thuần THÊM CỘT, đều nullable ⇒ không đụng dòng nào đang có.
ALTER TABLE "class_schedules" ADD COLUMN "slot"           INTEGER;
ALTER TABLE "class_schedules" ADD COLUMN "meet_url"       VARCHAR(500);
ALTER TABLE "class_schedules" ADD COLUMN "materials_url"  VARCHAR(500);
