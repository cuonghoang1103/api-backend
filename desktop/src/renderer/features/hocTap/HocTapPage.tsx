/**
 * Huấn luyện học kỳ — DÙNG LẠI nguyên cây `/hoc-tap` của web (2 màn: tổng
 * quan + một môn). Chỉ dính `next/link` — shim đã có.
 * Dữ liệu đi qua `/api/v1/hoc-tap`, nên tiến độ/điểm đồng bộ với web và iOS.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function HocTapPage() {
  return <TrangWebTheoTuyen ten="Huấn luyện học kỳ" />;
}
