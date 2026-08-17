import { useEffect, useState } from 'react';
import { AppStateProvider, useAppState } from './app-state';
import { LoginScreen } from './auth/LoginScreen';
import { SessionProvider, useSession } from './auth/session';
import { CommandPalette } from './components/CommandPalette';
import { OdinDock } from './features/odin/OdinDock';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { TitleBar } from './components/TitleBar';
import { About } from './pages/About';
import { NotPorted } from './pages/NotPorted';
import { Settings } from './pages/Settings';
import { nativePageFor } from './page-registry';
import { findRoute, INTERNAL_ROUTES } from './routes';

function Content() {
  const { route } = useAppState();

  if (route === INTERNAL_ROUTES.settings) return <Settings />;
  if (route === INTERNAL_ROUTES.about) return <About />;

  const definition = findRoute(route);
  if (!definition) {
    // Route lạ — chỉ xảy ra nếu deep link trỏ vào đường dẫn không có trong
    // bảng. Không dựng trang trống: nói thẳng ra là app không biết đường này.
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <h1>Không tìm thấy</h1>
          <p>
            Ứng dụng không có trang cho đường dẫn <code>{route}</code>.
          </p>
        </div>
      </div>
    );
  }

  // Một tra cứu duy nhất. Không có bảng `if` nào để quên cập nhật.
  const NativePage = nativePageFor(definition.path);
  if (NativePage) return <NativePage />;

  return <NotPorted route={definition} />;
}

function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { settings, setSetting } = useAppState();

  // Phím tắt chỉ đảo giữa 'full' và 'hidden' — bỏ qua 'icons'. Người bấm ⌘B
  // muốn CHỖ, không muốn đi qua một trạng thái trung gian rồi phải bấm tiếp.
  const toggleSidebar = () => {
    setSetting('sidebarMode', settings.sidebarMode === 'hidden' ? 'full' : 'hidden');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Cmd trên macOS, Ctrl ở nơi khác. Dùng `metaKey || ctrlKey` thay vì rẽ
      // nhánh theo nền tảng: bàn phím ngoài cắm chéo nền tảng là chuyện thường.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === 'Escape') setPaletteOpen(false);

      // ⌘B / Ctrl+B — ẩn/hiện thanh bên. Quy ước chung của mọi app có sidebar
      // (VS Code, Notion, Slack), nên người dùng thử phím này trước khi đi tìm nút.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settings.sidebarMode, setSetting]);

  return (
    <div className="ct-shell">
      <Sidebar />
      <div className="ct-main">
        <TitleBar onOpenPalette={() => setPaletteOpen(true)} />
        <div className="ct-content">
          {/* Boundary bọc RIÊNG phần nội dung, không bọc cả shell: lỗi ở một
              trang thì sidebar và thanh trạng thái phải còn sống để người dùng
              đi chỗ khác. Bọc cả shell là mất luôn đường thoát. */}
          <ErrorBoundary>
            <Content />
          </ErrorBoundary>
        </div>
        <StatusBar />
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {/* Odin nằm NGOÀI vùng nội dung để không bị cuộn theo trang, và ngoài
          ErrorBoundary của nội dung để một trang hỏng không kéo nó chết theo. */}
      <OdinDock />
    </div>
  );
}

/**
 * Chọn màn hình theo trạng thái phiên.
 *
 * `dang-khoi-phuc` phải có màn hình riêng, không được rơi vào nhánh đăng nhập:
 * nhấp nháy màn đăng nhập rồi nhảy vào app là trải nghiệm tệ, và tệ hơn nữa là
 * người dùng kịp bắt đầu gõ mật khẩu trước khi màn hình biến mất.
 */
function Gate() {
  const { phase } = useSession();
  const { online } = useAppState();

  if (phase === 'dang-khoi-phuc') {
    return (
      <div className="ct-boot">
        <div className="ct-loading" role="status">
          Đang khôi phục phiên…
        </div>
      </div>
    );
  }

  if (phase === 'chua-dang-nhap') return <LoginScreen online={online} />;

  // `da-dang-nhap` và `chua-xac-minh-duoc` đều vào app. Trạng thái thứ hai
  // nghĩa là có phiên đã lưu nhưng mất mạng nên chưa xác minh được — chặn ở đây
  // sẽ khoá người dùng khỏi chính dữ liệu ngoại tuyến của họ, đúng vào lúc
  // ngoại tuyến là thứ duy nhất họ cần.
  return <Shell />;
}

/**
 * Gốc API do MAIN quyết, lấy qua `app:getInfo`. Renderer không tự đặt: nếu nó
 * tự đặt được thì một đoạn mã bị chèn có thể trỏ mọi lời gọi sang máy chủ khác
 * mà vẫn mang theo token.
 */
function WithApiOrigin() {
  const [apiOrigin, setApiOrigin] = useState<string | null>(null);

  useEffect(() => {
    const bridge = window.cuongthai;
    if (!bridge) return;
    void bridge.app.getInfo().then((info) => {
      setApiOrigin(info.apiBase);
      /**
       * Đặt gốc web lên global cho mã DÙNG CHUNG với frontend đọc.
       *
       * Notes lấy nguyên các component của web, và `collaborationUrl()` ở đó
       * dựng địa chỉ websocket từ `window.location.origin`. Trong app đó là
       * `app://cuongthai` ⇒ ra `ws://cuongthai/...` không tồn tại, và Notes
       * luôn báo "Không nối được máy chủ cộng tác". Một biến global là cách
       * rẻ nhất để mã dùng chung biết mình đang chạy trong app.
       */
      (globalThis as { __ctWebOrigin?: string }).__ctWebOrigin = info.webOrigin;
    });
  }, []);

  return (
    <SessionProvider apiOrigin={apiOrigin}>
      <Gate />
    </SessionProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <WithApiOrigin />
      </AppStateProvider>
    </ErrorBoundary>
  );
}
