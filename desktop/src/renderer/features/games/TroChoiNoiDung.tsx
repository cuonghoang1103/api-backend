/**
 * Nội dung mục Trò chơi (05/10/2026), nạp qua TrangWebDon (TroChoiPage.tsx).
 *
 * `/games` của web là SERVER component (async) nên app không dựng được — xem ghi chú
 * "TÁM TRANG BỊ GỠ" ở dinhTuyenWeb.ts. Ghép bằng hai mảnh CLIENT của web:
 *   /games          → GameHub (trang chính sôi động, bảng vàng)
 *   /games/<slug>   → ChoiGameClient (tải game qua API → khung chơi + xếp hạng)
 *
 * ⚠️ Ngôn ngữ: khung chơi của web (`useTranslation`) đọc cookie `locale`, mà app chạy
 * ở `app://` không giữ cookie ⇒ mặc định TIẾNG ANH ("Play now"). Ghi localStorage (+ cookie) theo
 * ngôn ngữ đang chọn của app TRƯỚC khi dựng, và báo `locale-changed` khi người dùng đổi.
 */
import { useLayoutEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import GameHub from '@/components/games/hub/GameHub';
import ChoiGameClient from '@/components/games/hub/ChoiGameClient';
import DoiKhangClient from '@/app/games/doi-khang/DoiKhangClient';
import { useAppState } from '../../app-state';
import TrangFlyingPencil from './flyingPencil/TrangFlyingPencil';
import { KhuNoiBat } from './flyingPencil/KhuNoiBat';
import { useDich } from '../../i18n';

export default function TroChoiNoiDung() {
  const { route, navigate } = useAppState();
  const { nn } = useDich();
  useLayoutEffect(() => {
    try { localStorage.setItem('locale', nn); } catch { /* bỏ qua */ } // app:// không giữ cookie
    document.cookie = `locale=${nn}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event('locale-changed'));
  }, [nn]);
  const slug = /^\/games\/([^/?#]+)/.exec(route)?.[1];
  // Đối kháng (05/10/2026): sảnh + bàn chơi cờ/bài realtime; tham số ?phong=/?choi= qua shim useSearchParams.
  // Flying Pencil (08/10/2026): game CÀI RIÊNG, không qua API game của web — trang cửa hàng của app.
  if (slug === 'flying-pencil') return <div key="cua-hang" className="ct-tro-choi" data-cua-hang=""><TrangFlyingPencil /></div>;
  if (slug === 'doi-khang') return <div className="ct-tro-choi" data-choi=""><DoiKhangClient /></div>;
  if (slug && slug !== 'leaderboard') {
    return (
      <div className="ct-tro-choi" data-choi="">
        <button type="button" className="ct-tro-choi-ve" onClick={() => navigate('/games')}>
          <ArrowLeft size={16} aria-hidden /> {nn === 'vi' ? 'Tất cả trò chơi' : 'All games'}
        </button>
        <ChoiGameClient slug={decodeURIComponent(slug)} />
      </div>
    );
  }
  return (
    // `key` riêng mỗi nhánh: cùng một <div> bị React dùng lại thì giữ nguyên scrollTop của trang trước.
    <div key="sanh" className="ct-tro-choi" data-sanh="">
      <KhuNoiBat />
      <GameHub locale={nn === 'en' ? 'en' : 'vi'} />
    </div>
  );
}
