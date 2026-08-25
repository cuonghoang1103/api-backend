/**
 * Đã lưu — DÙNG LẠI nguyên cây `/saved` của web.
 *
 * Đo thật 22/08/2026: 2 tệp · 502 dòng · dính Next.js 0 chỗ
 * (KHÔNG dính chỗ nào) — shim đã có sẵn, không phải viết thêm.
 *
 * Cây SẠCH NHẤT đợt này — React thuần, không link, không navigation.
 * Một màn duy nhất, không có trang con.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function DaLuuPage() {
  return <TrangWebTheoTuyen ten="Đã lưu" />;
}
