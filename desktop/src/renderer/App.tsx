import { useEffect, useState } from 'react';
import { AppStateProvider, useAppState } from './app-state';
import { LoginScreen } from './auth/LoginScreen';
import { SessionProvider, useSession } from './auth/session';
import { batDauDoNhac } from './features/dashboard/nhacNho';
import { datBatAm } from './features/dashboard/amThanh';
import { CommandPalette } from './components/CommandPalette';
import { MusicPlayerProvider } from './features/music/player';
import { PlayerBar } from './features/music/PlayerBar';
import { OdinDock } from './features/odin/OdinDock';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { TitleBar } from './components/TitleBar';
import { UpdateToast } from './components/UpdateToast';
import { About } from './pages/About';
import { NotPorted } from './pages/NotPorted';
import { Settings } from './pages/Settings';
import { nativePageFor } from './page-registry';
import { findRoute, INTERNAL_ROUTES } from './routes';
import { Toaster } from 'sonner';

function Content() {
  const { route } = useAppState();

  if (route === INTERNAL_ROUTES.settings) return <Settings />;
  if (route === INTERNAL_ROUTES.about) return <About />;

  /*
   * ⚠️ HỎI `nativePageFor` BẰNG CHÍNH `route`, KHÔNG PHẢI `definition.path`.
   *
   * `findRoute` khớp CHÍNH XÁC, mà `ROUTES` chỉ liệt kê gốc của mỗi cây. Bản
   * trước bỏ cuộc ngay khi `findRoute` trả `undefined`, nên MỌI đường con của
   * cây web rơi vào màn "Không tìm thấy" dù sổ đăng ký dựng được chúng:
   *   `/language/ja` · `/roadmap/frontend` (hỏng từ 20/08/2026)
   *   `/interview/drill` · `/interview/history` · `/interview/session/:id`
   *   `/interview/report/:id` (hỏng từ v0.5.63)
   *
   * Bộ đo bố cục KHÔNG BAO GIỜ bắt được: `scripts/bo-cuc/trang-thu.tsx` gọi
   * thẳng `nativePageFor(duong)` nên nó đo sổ đăng ký, không đo đường mà app
   * thật đi qua. Xem [[feedback_verify_the_checker_before_the_content]] — và
   * `App.test.ts` nay canh đúng chỗ này.
   */
  const definition = findRoute(route);
  const NativePage = nativePageFor(definition?.path ?? route);
  if (NativePage) return <NativePage />;

  // Có trong bảng nhưng chưa có màn hình native → lời mời mở trên web.
  if (definition) return <NotPorted route={definition} />;

  // Không thuộc bảng và cũng không thuộc cây web nào — deep link hỏng.
  // Không dựng trang trống: nói thẳng ra là app không biết đường này.
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

function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { settings, setSetting, resolvedTheme } = useAppState();

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
    /* Nhạc bọc NGOÀI cả shell.
     *
     * Thẻ <audio> sống trong provider này, nên chuyển trang — thậm chí một
     * trang nổ và ErrorBoundary thay nó bằng màn báo lỗi — cũng không làm đứt
     * bài đang nghe. Đặt nó bên trong `ct-content` thì mỗi lần đổi route là
     * React tháo nó ra, và đó chính là lỗi "chuyển mục là tắt nhạc, quay lại
     * thì mất bài đang nghe dở". */
    <MusicPlayerProvider>
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
          {/* Thanh phát ở đây, giữa nội dung và thanh trạng thái: thấy ở MỌI
              trang, và tự biến mất khi chưa nghe gì. */}
          <PlayerBar />
          <StatusBar />
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        {/* Chỉ hiện khi bản mới đã TẢI XONG và chờ một cú bấm. Ngoài vùng nội
            dung nên thấy ở mọi trang, và không chặn thao tác. */}
        <UpdateToast />
        {/*
         * ⚠️ TOAST CỦA CÂY WEB — thiếu nó thì 226 lời gọi `toast.*` IM LẶNG.
         *
         * Đo 24/08/2026 trên các cây desktop dùng lại: 46 tệp gọi `toast.*`,
         * tổng 226 lời gọi — trong đó **143 là `toast.error`**. Không mount
         * `<Toaster>` thì sonner không có chỗ vẽ, và MỌI phản hồi đó biến mất:
         * người dùng bấm Lưu, việc hỏng, và màn hình không nói gì cả. Hỏng câm
         * đúng nghĩa — không lỗi, không cảnh báo, chỉ là im lặng.
         *
         * `sonner` đã nằm sẵn trong `dependencies` của desktop từ trước; chỉ
         * chưa ai dựng nó.
         *
         * ⛔ Đặt ở ĐÂY chứ không trong `VoWeb`: Notes dùng host riêng
         * (`ct-notes-host`), không đi qua `VoWeb`, mà riêng cây Notes đã có 11
         * tệp gọi toast. Ở `Shell` thì phủ mọi trang, kể cả trang native sau
         * này, và chỉ có ĐÚNG MỘT bản — mount trong `VoWeb` là mỗi lần đổi
         * route lại dựng lại một cái.
         *
         * ⚠️ KHÔNG chép nguyên cấu hình của web (`ToasterProvider.tsx`). Bản
         * đó đặt cứng `theme="dark"` và nền `--darkcard`, hợp lý trên web vì
         * web luôn tối; app thì có cả chủ đề SÁNG, và toast tối cố định trên
         * nền sáng là đúng họ lỗi 02/07/2026. Nên theo `resolvedTheme` và dùng
         * biến màu của app.
         *
         * Lề tính theo `--ct-titlebar-h` (44px) chứ không phải `--app-nav-h`
         * của web — app không có thanh nav đó, để nguyên thì toast rơi lên
         * thanh tiêu đề.
         */}
        <Toaster
          position="top-right"
          offset="calc(var(--ct-titlebar-h) + 12px)"
          theme={resolvedTheme}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'var(--ct-surface)',
              border: '1px solid var(--ct-border)',
              color: 'var(--ct-text)',
            },
          }}
        />
        {/* Odin nằm NGOÀI vùng nội dung để không bị cuộn theo trang, và ngoài
            ErrorBoundary của nội dung để một trang hỏng không kéo nó chết theo. */}
        <OdinDock />
      </div>
    </MusicPlayerProvider>
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
  const { phase, api } = useSession();
  const { online } = useAppState();

  /*
   * NHẮC NHỞ chạy ở đây chứ không ở trang Tổng quan.
   *
   * Một lời nhắc chỉ kêu khi người dùng đang mở đúng trang chứa nó thì vô dụng
   * — người ta đặt nhắc CHÍNH VÌ họ sẽ không nhìn vào đó. Đặt ở `Gate` nghĩa là
   * nó sống suốt phiên đăng nhập, bất kể đang xem trang nào.
   */
  useEffect(() => {
    if (phase !== 'da-dang-nhap' || !api) return;
    void window.cuongthai?.settings.getAll().then((t) => {
      // Mặc định BẬT tiếng: người dùng xin âm thanh, nên im lặng mặc định là
      // giao tính năng ở trạng thái tắt và để họ tự đi tìm công tắc.
      datBatAm((t as Record<string, unknown>).tqAmThanh !== false);
    });
    return batDauDoNhac(api, () => { /* thẻ trong app do trang Tổng quan lo */ });
  }, [phase, api]);

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
