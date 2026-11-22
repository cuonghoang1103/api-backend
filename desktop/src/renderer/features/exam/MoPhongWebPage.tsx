/**
 * Phòng thi mô phỏng (Exam Room › /exam/mo-phong, 22/11/2026) — app DÙNG LẠI nguyên trang web.
 *
 * Phòng thi chính của app là màn NATIVE (`PhongThiPage`: sảnh · làm đề · kết quả). Phần mô phỏng (đề FE
 * trộn theo chương, chế độ luyện, PE nộp zip + checklist rubric + máy chấm Code Lab trong trình duyệt)
 * chạy bằng chính component web qua `TrangWebTheoTuyen` — một nguồn mã, không viết lại lần hai.
 * Kết quả mỗi lượt mở `/exam/attempt/:id` ⇒ rơi về màn kết quả native như mọi lượt thi khác.
 *
 * `page.tsx` của web là server component (đọc cookie, chuyển hướng đăng nhập) nên tuyến app nạp thẳng
 * component client; hai trang làm bài nhận `attemptId` qua `useParams` (shim next/navigation).
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

/** Chủ cây `/exam/mo-phong` — trang con nạp chậm qua `TUYEN_WEB` (moPhongTuyen.tsx), không vào gói khởi động. */
export function MoPhongWebPage() {
  return <TrangWebTheoTuyen ten="Phòng thi mô phỏng" />;
}
