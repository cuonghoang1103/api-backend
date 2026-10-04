/**
 * Thanh tiêu đề.
 *
 * Trên macOS cửa sổ dùng `titleBarStyle: 'hiddenInset'`, nên ba nút hệ thống
 * nằm đè lên vùng này — phải chừa lề trái, nếu không nút giao thoa với nội
 * dung. Trên Windows/Linux thanh tiêu đề gốc vẫn còn, thanh này chỉ là hàng
 * công cụ bình thường.
 *
 * `-webkit-app-region: drag` biến vùng này thành chỗ kéo cửa sổ. Mọi thứ bấm
 * được BÊN TRONG nó phải khai báo `no-drag`, nếu không con trỏ kéo cửa sổ thay
 * vì bấm nút — lỗi này rất hay gặp và trông như nút bị hỏng.
 */
import { Bell, Search } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAppState } from '../app-state';
import { findRoute, INTERNAL_ROUTES } from '../routes';
import { useDich } from '../i18n';

/* ⚠️ Tiếng Việt Ở ĐÂY, dịch tại chỗ dựng — đây là hằng tầm mô-đun, tính đúng
   một lần lúc nạp tệp. Gọi `t()` ngay đây thì tiêu đề cửa sổ kẹt ở ngôn ngữ
   lúc khởi động. Cùng bẫy với `MODE_LABEL` bên `Sidebar.tsx`. */
const TITLES: Record<string, string> = {
  [INTERNAL_ROUTES.settings]: 'Cài đặt',
  [INTERNAL_ROUTES.about]: 'Giới thiệu',
};

export function TitleBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { dich } = useDich();
  const { route, navigate } = useAppState();
  const chuaDoc = useNotificationStore((st) => st.unreadCount);
  /* Trang CON của một cây (`/maker-lab/odin`, `/work/acme/WEB/board`) không có
     mục riêng trong `ROUTES` — lấy nhãn của đoạn cha gần nhất, thay vì rơi về
     "CuongThai" như thể người dùng vừa rời khỏi mục đó. */
  const nhan = TITLES[route] ?? (() => {
    for (let d = route; d.includes('/'); d = d.slice(0, d.lastIndexOf('/'))) {
      const r = findRoute(d);
      if (r) return r.label;
    }
    return undefined;
  })();
  const title = nhan ? dich(nhan) : 'CuongThai';

  const isMac = navigator.userAgent.includes('Mac');

  return (
    <header className="ct-titlebar" data-mac={isMac}>
      <div className="ct-titlebar-title">{title}</div>

      {/* Chuông thông báo (04/10/2026): số chưa đọc từ kho thông báo của web
          (`ThongBaoHost` gắn realtime), bấm là mở trang Thông báo. */}
      <button
        type="button"
        className="ct-titlebar-chuong"
        data-active={route === '/notifications'}
        onClick={() => navigate('/notifications')}
        aria-label={chuaDoc ? `${dich('Thông báo')} · ${chuaDoc}` : dich('Thông báo')}
        title={dich('Thông báo')}
      >
        <Bell size={15} aria-hidden />
        {chuaDoc > 0 && <span className="ct-titlebar-chuong-so">{chuaDoc > 99 ? '99+' : chuaDoc}</span>}
      </button>

      <button
        type="button"
        className="ct-titlebar-search"
        onClick={onOpenPalette}
        aria-label={dich('Mở bảng lệnh')}
      >
        <Search size={14} aria-hidden />
        <span>{dich('Tìm kiếm hoặc chạy lệnh')}</span>
        <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
    </header>
  );
}
