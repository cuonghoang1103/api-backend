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
import { Search } from 'lucide-react';
import { useAppState } from '../app-state';
import { findRoute, INTERNAL_ROUTES } from '../routes';

const TITLES: Record<string, string> = {
  [INTERNAL_ROUTES.settings]: 'Cài đặt',
  [INTERNAL_ROUTES.about]: 'Giới thiệu',
};

export function TitleBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { route } = useAppState();
  const title = TITLES[route] ?? findRoute(route)?.label ?? 'CuongThai';

  const isMac = navigator.userAgent.includes('Mac');

  return (
    <header className="ct-titlebar" data-mac={isMac}>
      <div className="ct-titlebar-title">{title}</div>

      <button
        type="button"
        className="ct-titlebar-search"
        onClick={onOpenPalette}
        aria-label="Mở bảng lệnh"
      >
        <Search size={14} aria-hidden />
        <span>Tìm kiếm hoặc chạy lệnh</span>
        <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
    </header>
  );
}
