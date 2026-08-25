/**
 * Diễn đàn — DÙNG LẠI nguyên cây `/forum` của web.
 *
 * Đo thật 22/08/2026: 3 tệp · 1095 dòng · dính Next.js 3 chỗ
 * (1 link · 2 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Hai màn: danh sách chủ đề và chi tiết theo `:id`.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function DienDanPage() {
  return <TrangWebTheoTuyen ten="Diễn đàn" />;
}
