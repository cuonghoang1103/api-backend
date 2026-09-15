/**
 * Hai trang tư vấn của Học viện — DÙNG LẠI nguyên của web:
 *   • `/academy/tu-van-nganh`   (650 dòng) — cây hỏi đáp chọn ngành hẹp
 *   • `/academy/so-do-mon-hoc`  (262 dòng) — sơ đồ khung chương trình
 *
 * Người dùng 15/09/2026: *"chưa có chọn ngành, tư vấn ngành hẹp, sơ đồ, lọc
 * ngành đúng với ngành hẹp"*. Đúng — app chưa từng có hai màn này.
 *
 * ⚠️ KHÔNG THAY màn Học viện chính (`HocVienPage`). Nó có thứ bản web không
 * có: đọc được khi NGOẠI TUYẾN (`swr` + cache theo kỳ). Đổi nó lấy bản web là
 * đánh mất khả năng học lúc mất mạng — cùng đánh đổi mà `TechTrendsWebPage`
 * đã chấp nhận, nhưng ở đây cái mất lớn hơn hẳn: sinh viên mở Học viện chính
 * là lúc đang ngồi học.
 *
 * Thay vào đó `HocVienPage` mượn đúng hai thứ cần từ web — robot chọn ngành và
 * phép lọc theo ngành hẹp — còn hai màn tư vấn thì mở nguyên bản web ở đây.
 *
 * Dính Next đúng `next/link` + `next/navigation`, cả hai đã có shim từ lâu.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function TuVanNganhPage() {
  return <TrangWebTheoTuyen ten="Học viện" />;
}
