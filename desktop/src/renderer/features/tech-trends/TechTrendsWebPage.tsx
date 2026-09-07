/**
 * Tech Trends — DÙNG LẠI nguyên cây `/tech-trends` của web (8 màn).
 *
 * ─── Vì sao thay màn native cũ ───
 * `TechTrendsPage.tsx` (322 dòng, ngay cạnh) chỉ có một danh sách phẳng. Cây
 * web là 1.441 dòng riêng cho trang danh sách, cộng bảy màn nữa, và có những
 * thứ bản native không hề có: lọc theo danh mục, ô tìm kiếm, lưu trữ theo
 * năm, đánh dấu bài (bookmark), thẻ mở rộng đọc ngay, khối tài nguyên, bản
 * tin AI, và sáu trang chuyên đề (Việc làm Claude Code, IELTS, học SQL,
 * JPD113, tiếng Anh giao tiếp, tin tức).
 *
 * Dính Next đúng 12 `next/link` + 2 `next/dynamic` — cả hai đều đã có shim,
 * nên không phải sửa một dòng mã web nào.
 *
 * ⚠️ CÁI MẤT: ĐỌC OFFLINE. Bản native cache từng bài người dùng ĐÃ MỞ
 * (`swr` + `readCache`), nên mất mạng vẫn đọc lại được, và nó gắn nhãn "Đọc
 * được offline" lên những bài đó. Cây web gọi API thẳng, không qua cache —
 * mất mạng là trang trắng.
 *
 * Đây là đánh đổi CÓ CHỦ ĐÍCH và giống hệt `CvWebPage.tsx`: toàn bộ tính năng
 * đổi lấy khả năng offline. Muốn lấy lại thì `TechTrendsPage.tsx` vẫn nằm
 * nguyên đây — hoặc thêm một lớp cache cho các lời gọi GET của tech-trends
 * trong `shims/web-api-adapter.ts`, chỗ duy nhất mọi mã web đi qua.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function TechTrendsWebPage() {
  return <TrangWebTheoTuyen ten="Tech Trends" />;
}
