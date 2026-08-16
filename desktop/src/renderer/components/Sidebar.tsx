/**
 * Sidebar cố định.
 *
 * Điều hướng bằng bàn phím dùng `roving tabindex`: cả danh sách chỉ có MỘT ô
 * nhận Tab, còn mũi tên lên/xuống di chuyển bên trong. Đây là khuôn mẫu ARIA
 * cho danh sách điều hướng — nếu để cả 14 mục cùng nhận Tab thì người dùng bàn
 * phím phải bấm Tab 14 lần mới ra khỏi sidebar.
 */
import { useCallback, useRef } from 'react';
import { PanelLeft, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { useAppState } from '../app-state';
import { UpdateBanner } from './UpdateBanner';
import { UserMenu } from './UserMenu';
import { GROUP_LABELS, GROUP_ORDER, INTERNAL_ROUTES, ROUTES, isPorted } from '../routes';

/**
 * Ba trạng thái thay vì hai.
 *
 * `icons` hữu ích ở phần lớn màn hình — vẫn thấy được mình đang ở đâu mà không
 * tốn chỗ. Nhưng những trang có SIDEBAR RIÊNG (Ghi chú, và sau này Nhạc) thì
 * hai thanh cạnh nhau vẫn quá chật, nên cần ẩn hẳn.
 *
 * Vòng lặp `full → icons → hidden → full` chứ không phải hai nút riêng: hai
 * điều khiển cho cùng một thứ buộc người dùng phải nhớ nút nào làm gì.
 */
export type SidebarMode = 'full' | 'icons' | 'hidden';

const NEXT_MODE: Record<SidebarMode, SidebarMode> = {
  full: 'icons',
  icons: 'hidden',
  hidden: 'full',
};

const MODE_LABEL: Record<SidebarMode, string> = {
  full: 'Thu gọn thành biểu tượng',
  icons: 'Ẩn hẳn thanh bên',
  hidden: 'Hiện lại thanh bên',
};

export function Sidebar() {
  const { route, navigate, settings, setSetting } = useAppState();
  const mode: SidebarMode =
    settings.sidebarMode === 'icons' || settings.sidebarMode === 'hidden'
      ? settings.sidebarMode
      : 'full';
  const collapsed = mode === 'icons';
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();

    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-nav-item]') ?? [],
    );
    const current = items.findIndex((item) => item === document.activeElement);
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    // Vòng lại đầu/cuối thay vì dừng — người dùng bàn phím không phải đếm xem
    // mình đang ở mục thứ mấy.
    const next = items[(current + delta + items.length) % items.length];
    next?.focus();
  }, []);

  // Ẩn hẳn: trả về một nút mảnh để mở lại. KHÔNG trả về `null` — ẩn mà không
  // chừa đường quay lại thì người dùng mất luôn điều hướng và chỉ còn cách
  // khởi động lại app.
  if (mode === 'hidden') {
    return (
      <button
        type="button"
        className="ct-sidebar-peek"
        onClick={() => setSetting('sidebarMode', 'full')}
        aria-label="Hiện lại thanh bên"
        title="Hiện lại thanh bên  (⌘B)"
      >
        <PanelLeft size={15} aria-hidden />
      </button>
    );
  }

  return (
    <nav
      className="ct-sidebar"
      data-collapsed={collapsed}
      aria-label="Điều hướng chính"
    >
      <div className="ct-sidebar-scroll" ref={listRef} onKeyDown={onKeyDown}>
        {GROUP_ORDER.map((group) => {
          const items = ROUTES.filter((r) => r.group === group);
          return (
            <div className="ct-nav-group" key={group}>
              {/* Khi thu gọn, nhãn nhóm bị ẩn khỏi mắt nhưng vẫn ở lại cho
                  trình đọc màn hình — cấu trúc không nên biến mất chỉ vì
                  giao diện hẹp lại. */}
              <div className="ct-nav-group-label" aria-hidden={collapsed}>
                {GROUP_LABELS[group]}
              </div>
              {items.map((item) => {
                const active = route === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    data-nav-item
                    className="ct-nav-item"
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                    // `title` cho tooltip gốc của HĐH khi sidebar thu gọn.
                    title={collapsed ? item.label : undefined}
                    tabIndex={active ? 0 : -1}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="ct-nav-icon" size={17} aria-hidden />
                    <span className="ct-nav-label">{item.label}</span>
                    {/* Chấm nhỏ = đã có màn hình native trong app. Route chưa
                        port vẫn vào được, chỉ là hiện màn "mở trên web". */}
                    {isPorted(item.path) && (
                      <span className="ct-native-dot" title="Có màn hình riêng trong app" />
                    )}
                    {item.pro && (
                      <span className="ct-pro-badge" aria-label="Cần tài khoản Pro">
                        Pro
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="ct-sidebar-footer">
        {/* Trên tài khoản, không dưới: mắt đi từ trên xuống nên thứ cần hành
            động phải nằm trước thứ chỉ để xem. */}
        <UpdateBanner collapsed={collapsed} />
        <UserMenu collapsed={collapsed} />

        <button
          type="button"
          className="ct-nav-item"
          data-active={route === INTERNAL_ROUTES.settings}
          title={collapsed ? 'Cài đặt' : undefined}
          onClick={() => navigate(INTERNAL_ROUTES.settings)}
        >
          <Settings className="ct-nav-icon" size={17} aria-hidden />
          <span className="ct-nav-label">Cài đặt</span>
        </button>

        <button
          type="button"
          className="ct-nav-item"
          onClick={() => setSetting('sidebarMode', NEXT_MODE[mode])}
          aria-label={MODE_LABEL[mode]}
          title={`${MODE_LABEL[mode]}  (⌘B)`}
        >
          {mode === 'full' ? (
            <PanelLeftClose className="ct-nav-icon" size={17} aria-hidden />
          ) : (
            <PanelLeftOpen className="ct-nav-icon" size={17} aria-hidden />
          )}
          <span className="ct-nav-label">Thu gọn</span>
        </button>
      </div>
    </nav>
  );
}
