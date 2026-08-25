/**
 * Tài chính — DÙNG LẠI nguyên cây `/finance` của web.
 *
 * Đo thật 22/08/2026: 14 tệp · 2225 dòng · dính Next.js 11 chỗ
 * (8 link · 3 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * Cây LỚN NHẤT đợt này: 13 màn (ví, thu, chi, nợ, tiết kiệm, đầu tư, ngoại tệ,
 * báo cáo…).
 * ⚠️ `/finance/debts/calendar` là đường TĨNH ba đoạn, cùng hình dạng với
 * `/finance/debts/:id`.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function TaiChinhPage() {
  return <TrangWebTheoTuyen ten="Tài chính" />;
}
