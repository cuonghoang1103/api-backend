/**
 * Phòng lab mô phỏng — DÙNG LẠI nguyên cây web `/cpu-lab` (+ `/cpu-lab/3d`), `/os-lab`, `/net-lab`.
 * Tuyến đã khai trong `TUYEN_WEB` (dinhTuyenWeb.ts) từ 28/10, nhưng gốc chưa nằm trong `GOC_WEB`/`CHU_CAY`
 * ⇒ app rơi vào "Không tìm thấy" (App.test bắt được 01/11/2026). `TrangWebTheoTuyen` tự chọn trang theo route.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function PhongLabWebPage() {
  return <TrangWebTheoTuyen ten="Phòng lab mô phỏng" />;
}
