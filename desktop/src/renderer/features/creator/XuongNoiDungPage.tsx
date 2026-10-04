/**
 * Content Creator (tên cũ "Xưởng nội dung") — DÙNG LẠI nguyên cây `/creator` của web.
 *
 * Đo thật 22/08/2026: 7 tệp · 2878 dòng · dính Next.js 8 chỗ
 * (4 link · 4 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Tám màn: bảng chính, Quay khoá học (AI soạn gói quay từ đúng nội dung bài),
 * Ý tưởng AI, lịch, kho ý tưởng, danh sách, dây chuyền, và chi tiết dự án (có
 * tab Trợ lý AI).
 *
 * 04/10/2026 — có KHUNG riêng (`KhungCreatorApp`): thanh công cụ studio + hai
 * hộp thoại toàn cục. Trước đó app chỉ dựng từng trang trơn: không có điều hướng
 * giữa các màn và nút "Dự án mới" bấm không ra gì (hộp thoại nằm ở layout của
 * Next, thứ app không chạy). `creator.css` ghim bảng màu tối của app cho cả
 * cây — studio là "phòng quay tối" ở mọi chủ đề.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { lazy, useEffect } from 'react';
import { TrangWebTheoTuyen } from '../web/TrangWeb';
import { useDich } from '../../i18n';
import './creator.css';

/** Khai ở TẦM MÔ-ĐUN — xem ghi chú của `khung` trong `TrangWebTheoTuyen`. */
const KhungCreator = lazy(() => import('@/components/studio/CreatorFrame'));

export function XuongNoiDungPage() {
  /* Studio theo NGÔN NGỮ CỦA APP (Cài đặt), không theo cookie `locale` của web —
     app không có LocaleProvider nên trước đây studio luôn hiện tiếng Anh. Gắn
     NGAY trong lượt vẽ (trang con đọc lúc dựng) + bắn sự kiện khi đổi. Xem
     `ngonNguApp()` trong frontend/src/lib/studio-i18n.ts. */
  const { nn } = useDich();
  (globalThis as { __CT_NGON_NGU_STUDIO__?: string }).__CT_NGON_NGU_STUDIO__ = nn;
  useEffect(() => { window.dispatchEvent(new Event('ct-ngon-ngu')); }, [nn]);
  return <TrangWebTheoTuyen ten="Content Creator" khung={KhungCreator} />;
}
