/**
 * Hồ sơ & tên đăng nhập (04/10/2026) — DÙNG LẠI trang `/settings/profile` của web:
 * đổi tên đăng nhập (người vào bằng Google/GitHub/Apple chê tên tự đặt), tên hiển
 * thị, ảnh đại diện (tải từ máy lên R2), tiểu sử. Lưu là đồng bộ luôn với web.
 * App đặt ở `/ho-so` vì `/settings` là màn Cài đặt native, nuốt mọi đường con.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function HoSoPage() {
  return <div className="ct-ho-so"><TrangWebTheoTuyen ten="Hồ sơ" /></div>;
}
