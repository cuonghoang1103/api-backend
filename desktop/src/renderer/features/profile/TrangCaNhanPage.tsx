/**
 * Trang cá nhân — DÙNG LẠI nguyên cây `/profile` của web.
 *
 * Đo thật 22/08/2026: 6 tệp · 286 dòng · dính Next.js 2 chỗ
 * (0 link · 2 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Ba màn: hồ sơ của mình, hồ sơ người khác theo `:id`, và bản v2.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function TrangCaNhanPage() {
  return <TrangWebTheoTuyen ten="Trang cá nhân" />;
}
