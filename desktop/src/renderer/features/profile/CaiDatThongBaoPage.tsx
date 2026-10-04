/**
 * Cài đặt thông báo (04/10/2026) — DÙNG LẠI trang `/settings/notifications` của web
 * (bật/tắt từng loại thông báo, âm báo, tiếng tuỳ chọn). Trang Thông báo có nút dẫn
 * tới đây; trước đó app báo "Không có trang cho đường dẫn /settings/notifications".
 * Khớp CHÍNH XÁC trong NATIVE_PAGES nên không đụng màn Cài đặt native ở `/settings`.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function CaiDatThongBaoPage() {
  return <div className="ct-ho-so"><TrangWebTheoTuyen ten="Cài đặt thông báo" /></div>;
}
