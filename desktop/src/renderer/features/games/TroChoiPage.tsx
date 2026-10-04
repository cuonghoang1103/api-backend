/**
 * Trò chơi (05/10/2026) — mục Giải trí của app. Nội dung ở TroChoiNoiDung.tsx, nạp qua
 * TrangWebDon để có cầu nối API + phiên đăng nhập của cây web (gamesApi dùng axios web).
 */
import { TrangWebDon } from '../web/TrangWeb';

export function TroChoiPage() {
  return <TrangWebDon nap={() => import('./TroChoiNoiDung')} ten="Trò chơi" canPhien />;
}
