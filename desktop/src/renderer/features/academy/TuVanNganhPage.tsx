/**
 * Học viện + Courses trong app desktop — DÙNG LẠI NGUYÊN trang web (08/11/2026).
 *
 * Trước 08/11/2026 chỉ hai trang tư vấn (`/academy/tu-van-nganh`, `/academy/so-do-mon-hoc`) đi đường này;
 * `/academy` và `/courses` là màn native viết riêng (`HocVienPage`, `KhoaHocPage`) và tụt lại xa so với web.
 * Người dùng 08/11/2026: *"giao diện và bố cục giống trên web 100%… trên web đã update nhiều rồi mà trên
 * app vẫn như cũ"* ⇒ cả cây đi qua `TrangWebTheoTuyen` (bảng tuyến: `features/web/dinhTuyenWeb.ts`).
 *
 * Đánh đổi đã chấp nhận: mất phần đọc NGOẠI TUYẾN của màn Học viện native.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function HocVienWebPage() {
  return <TrangWebTheoTuyen ten="Học viện" />;
}

/** Tên cũ — giữ cho chỗ nào còn import. */
export const TuVanNganhPage = HocVienWebPage;
