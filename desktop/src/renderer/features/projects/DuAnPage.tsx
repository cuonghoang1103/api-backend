/**
 * Dự án.
 *
 *  • `/projects` (danh sách) → bản DỰNG RIÊNG cho app (`DuAnNative.tsx`): cột lọc,
 *    lưới/danh sách, bảng chi tiết mở tại chỗ. Bản web phủ hai lớp nền
 *    `position: fixed` lên cả vỏ app — xem đầu `DuAnNative.tsx`.
 *  • `/projects/:slug`, `/projects/search` → DÙNG LẠI nguyên cây web
 *    (`TrangWebTheoTuyen`): bài case-study dài, mục lục, sơ đồ, mã — viết lại
 *    là nhân đôi 768 dòng để được đúng thứ đã có.
 *
 * ⚠️ `/projects/search` là đường TĨNH cùng hình dạng với `/projects/:slug` —
 * xem chú thích thứ tự trong `dinhTuyenWeb.ts`.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { useAppState } from '../../app-state';
import { TrangWebTheoTuyen } from '../web/TrangWeb';
import { DuAnNative } from './DuAnNative';

export function DuAnPage() {
  const { route } = useAppState();
  if (route === '/projects' || route === '/projects/') return <DuAnNative />;
  return <TrangWebTheoTuyen ten="Dự án" />;
}
