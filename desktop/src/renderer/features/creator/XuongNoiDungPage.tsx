/**
 * Xưởng nội dung — DÙNG LẠI nguyên cây `/creator` của web.
 *
 * Đo thật 22/08/2026: 7 tệp · 2878 dòng · dính Next.js 8 chỗ
 * (4 link · 4 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Sáu màn: bảng chính, lịch, ý tưởng, danh sách, đường ống, và chi tiết dự án.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function XuongNoiDungPage() {
  return <TrangWebTheoTuyen ten="Xưởng nội dung" />;
}
