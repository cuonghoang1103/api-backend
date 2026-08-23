/**
 * Dự án — DÙNG LẠI nguyên cây `/projects` của web.
 *
 * Đo thật 22/08/2026: 7 tệp · 1928 dòng · dính Next.js 5 chỗ
 * (2 link · 3 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * ⚠️ `/projects/search` là đường TĨNH cùng hình dạng với `/projects/:slug` —
 * xem chú thích thứ tự trong `dinhTuyenWeb.ts`.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function DuAnPage() {
  return <TrangWebTheoTuyen ten="Dự án" />;
}
