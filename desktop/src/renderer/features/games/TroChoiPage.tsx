/**
 * Trò chơi — DÙNG LẠI nguyên cây `/games` của web.
 *
 * Đo thật 22/08/2026: 8 tệp · 1335 dòng · dính Next.js 8 chỗ
 * (5 link · 3 navigation) — shim đã có sẵn, không phải viết thêm.
 *
 * ⚠️ HAI đường TĨNH (`/games/leaderboard`, `/games/love-me`) cùng hình dạng
 * với `/games/:slug`. Trò chơi chạy bằng canvas trong máy, không cần mạng.
 *
 * Mã chạy NGAY TRONG app (Electron renderer), không phải mở trang web: chỉ dữ
 * liệu đi qua `/api/v1/**`. Xem `TrangWeb.tsx` để biết cầu nối phiên đăng nhập.
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function TroChoiPage() {
  return <TrangWebTheoTuyen ten="Trò chơi" />;
}
