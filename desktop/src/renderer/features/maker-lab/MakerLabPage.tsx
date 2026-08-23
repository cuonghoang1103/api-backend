/**
 * Maker Lab — DÙNG LẠI nguyên cây `/maker-lab` của web.
 *
 * Đo thật 22/08/2026: 3 tệp · 743 dòng · dính Next.js 3 chỗ
 * (2 link · 1 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Hai màn: danh sách dự án phần cứng và chi tiết theo `:slug`.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function MakerLabPage() {
  return <TrangWebTheoTuyen ten="Maker Lab" />;
}
