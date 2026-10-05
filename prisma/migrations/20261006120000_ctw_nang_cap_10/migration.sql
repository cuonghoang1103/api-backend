-- CT Work nâng cấp theo lần dùng thật đầu tiên (06/10/2026, dự án CTW). CHỈ THÊM cột + đổi mặc định.

-- CTW-1: phê duyệt cổng giai đoạn — lời nhắn HIỆN VỚI KHÁCH (description vẫn là ghi chú nội bộ)
-- + bằng chứng {issueIds, pageNumbers, attachmentIds, openIssues, openReason} (CTW-13).
ALTER TABLE "work_approvals" ADD COLUMN "client_note" TEXT;
ALTER TABLE "work_approvals" ADD COLUMN "evidence" JSONB;

-- CTW-3: báo cáo tuần cho khách mặc định TẮT; bật lần đầu phải xem trước + xác nhận.
ALTER TABLE "work_report_schedules" ALTER COLUMN "enabled" SET DEFAULT false;
ALTER TABLE "work_report_schedules" ADD COLUMN "confirmed_at" TIMESTAMP(3);
ALTER TABLE "work_report_schedules" ADD COLUMN "confirmed_by_id" INTEGER;
-- Giữ nguyên hành vi cũ: lịch đang BẬT coi như đã xác nhận; dự án chưa có dòng lịch mà ĐÃ từng
-- tự gửi báo cáo (dựa vào mặc định cũ = bật) ⇒ tạo dòng bật sẵn, không lặng lẽ ngừng gửi.
UPDATE "work_report_schedules" SET "confirmed_at" = "updated_at" WHERE "enabled" = true AND "confirmed_at" IS NULL;
INSERT INTO "work_report_schedules" ("project_id", "enabled", "weekday", "hour", "timezone", "include_risks", "include_changes", "confirmed_at", "created_at", "updated_at")
SELECT DISTINCT r."project_id", true, 5, 16, 'Asia/Ho_Chi_Minh', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "work_client_reports" r
WHERE r."source" = 'AUTO' AND NOT EXISTS (SELECT 1 FROM "work_report_schedules" s WHERE s."project_id" = r."project_id");

-- CTW-6: tìm không phân biệt dấu tiếng Việt — cột SINH TỰ ĐỘNG (lower + bỏ dấu), không ai phải ghi.
-- Bảng thay ký tự phải khớp src/services/work/fold.ts.
ALTER TABLE "work_issues" ADD COLUMN "title_fold" TEXT GENERATED ALWAYS AS (lower(translate(coalesce("title", ''), 'àÀáÁảẢãÃạẠăĂằẰắẮẳẲẵẴặẶâÂầẦấẤẩẨẫẪậẬèÈéÉẻẺẽẼẹẸêÊềỀếẾểỂễỄệỆìÌíÍỉỈĩĨịỊòÒóÓỏỎõÕọỌôÔồỒốỐổỔỗỖộỘơƠờỜớỚởỞỡỠợỢùÙúÚủỦũŨụỤưƯừỪứỨửỬữỮựỰỳỲýÝỷỶỹỸỵỴđĐ̛̣̀́̃̉̆̂', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeiiiiiiiiiioooooooooooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyydd'))) STORED;
ALTER TABLE "work_issues" ADD COLUMN "description_fold" TEXT GENERATED ALWAYS AS (lower(translate(coalesce("description_text", ''), 'àÀáÁảẢãÃạẠăĂằẰắẮẳẲẵẴặẶâÂầẦấẤẩẨẫẪậẬèÈéÉẻẺẽẼẹẸêÊềỀếẾểỂễỄệỆìÌíÍỉỈĩĨịỊòÒóÓỏỎõÕọỌôÔồỒốỐổỔỗỖộỘơƠờỜớỚởỞỡỠợỢùÙúÚủỦũŨụỤưƯừỪứỨửỬữỮựỰỳỲýÝỷỶỹỸỵỴđĐ̛̣̀́̃̉̆̂', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeiiiiiiiiiioooooooooooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyydd'))) STORED;
ALTER TABLE "work_pages" ADD COLUMN "title_fold" TEXT GENERATED ALWAYS AS (lower(translate(coalesce("title", ''), 'àÀáÁảẢãÃạẠăĂằẰắẮẳẲẵẴặẶâÂầẦấẤẩẨẫẪậẬèÈéÉẻẺẽẼẹẸêÊềỀếẾểỂễỄệỆìÌíÍỉỈĩĨịỊòÒóÓỏỎõÕọỌôÔồỒốỐổỔỗỖộỘơƠờỜớỚởỞỡỠợỢùÙúÚủỦũŨụỤưƯừỪứỨửỬữỮựỰỳỲýÝỷỶỹỸỵỴđĐ̛̣̀́̃̉̆̂', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeiiiiiiiiiioooooooooooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyydd'))) STORED;
ALTER TABLE "work_pages" ADD COLUMN "content_fold" TEXT GENERATED ALWAYS AS (lower(translate(coalesce("content_text", ''), 'àÀáÁảẢãÃạẠăĂằẰắẮẳẲẵẴặẶâÂầẦấẤẩẨẫẪậẬèÈéÉẻẺẽẼẹẸêÊềỀếẾểỂễỄệỆìÌíÍỉỈĩĨịỊòÒóÓỏỎõÕọỌôÔồỒốỐổỔỗỖộỘơƠờỜớỚởỞỡỠợỢùÙúÚủỦũŨụỤưƯừỪứỨửỬữỮựỰỳỲýÝỷỶỹỸỵỴđĐ̛̣̀́̃̉̆̂', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeeeeeiiiiiiiiiioooooooooooooooooooooooooooooooooouuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyydd'))) STORED;

-- CTW-11: cờ "Bị chặn" trên thẻ (lý do + hạn + mục RAID).
ALTER TABLE "work_issues" ADD COLUMN "flagged_at" TIMESTAMP(3);
ALTER TABLE "work_issues" ADD COLUMN "flag_reason" VARCHAR(500);
ALTER TABLE "work_issues" ADD COLUMN "flagged_by_id" INTEGER;

-- CTW-23: nhận diện dự án (ảnh, emoji, màu) + logo không gian.
ALTER TABLE "work_projects" ADD COLUMN "avatar_url" VARCHAR(500);
ALTER TABLE "work_projects" ADD COLUMN "icon_emoji" VARCHAR(16);
ALTER TABLE "work_projects" ADD COLUMN "color" VARCHAR(16);
ALTER TABLE "work_spaces" ADD COLUMN "logo_url" VARCHAR(500);
