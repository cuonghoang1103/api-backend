/**
 * Kho mã — DÙNG LẠI nguyên cây `/repos` của web.
 *
 * Đo thật 22/08/2026: 7 tệp · 1642 dòng · dính Next.js 5 chỗ
 * (3 link · 2 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Ba màn: danh sách kho, chi tiết theo `:id`, và lọc theo thẻ.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function KhoMaPage() {
  return <TrangWebTheoTuyen ten="Kho mã" />;
}
