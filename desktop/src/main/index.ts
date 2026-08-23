/**
 * Điểm vào của main process.
 *
 * Thứ tự trong file này quan trọng hơn vẻ ngoài của nó:
 *   1. đăng ký scheme đặc quyền  (PHẢI trước `whenReady`)
 *   2. chốt một-thực-thể-duy-nhất (trước khi dựng cửa sổ)
 *   3. ready → chính sách session → protocol → IPC → cửa sổ
 * Đảo thứ tự sẽ sinh ra lỗi câm: storage rỗng, CSP không áp, hoặc hai bản app
 * cùng ghi vào một file cấu hình.
 */
import { app, BrowserWindow, net } from 'electron';
import path from 'node:path';
import { DEEP_LINK_SCHEME, IS_DEV } from './config';
import {
  applySessionPolicies,
  forbidChildProcesses,
  registerAppProtocol,
  registerSchemesAsPrivileged,
} from './security';
import { registerIpcHandlers } from './ipc';
import { createMainWindow } from './window';

registerSchemesAsPrivileged();

/**
 * Cờ GPU cho sân chơi 3D — PHẢI đặt trước `app.whenReady()`.
 *
 * Sân chơi vẽ bằng `three/webgpu`. Đặt muộn hơn thì Chromium đã chốt cấu hình
 * GPU rồi và cờ im lặng không có tác dụng nào — không lỗi, chỉ là game rơi về
 * WebGL2 và chạy chậm hơn mà không ai biết vì sao.
 *
 * `enable-unsafe-webgpu` chỉ PHƠI RA `navigator.gpu`; nó không tắt sandbox và
 * không đụng tới renderer chính. Trên Linux cần thêm `Vulkan` vì đó là backend
 * duy nhất Dawn dùng được ở đó.
 *
 * ⚠️ Thiếu WebGPU KHÔNG làm game chết: `Rendering.js` đặt `forceWebGL: false`
 * nên three tự lùi về WebGL2, và bảng Cài đặt của game hiện sẵn cảnh báo
 * "performance loss". Đo thật xem máy có ăn cờ này không: `npm run do:webgpu`.
 */
app.commandLine.appendSwitch('enable-unsafe-webgpu');
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-features', 'Vulkan');
}

let mainWindow: BrowserWindow | null = null;

/**
 * Một thực thể duy nhất.
 *
 * Hai bản app cùng chạy sẽ cùng ghi `cuongthai-desktop.json` và cùng ghi hàng
 * đợi đồng bộ trong IndexedDB — bản ghi sau đè bản ghi trước, và người dùng
 * mất nháp mà không có thông báo nào. Deep-link cũng cần điều này: OS gửi URL
 * tới thực thể ĐANG chạy.
 */
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // Windows/Linux đưa deep-link vào dòng lệnh của thực thể thứ hai.
    const deepLink = argv.find((arg) => arg.startsWith(`${DEEP_LINK_SCHEME}://`));
    if (deepLink) handleDeepLink(deepLink);
  });

  void bootstrap();
}

/**
 * Deep-link `cuongthai://` — dùng cho vòng OAuth quay lại app (Phase 4).
 * Ở đây mới nối đường ống; renderer sẽ nhận qua sự kiện `app:navigate`.
 */
function handleDeepLink(rawUrl: string): void {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return;
  }
  if (parsed.protocol !== `${DEEP_LINK_SCHEME}:`) return;

  // Chỉ chuyển phần đường dẫn + query sang renderer. KHÔNG chuyển nguyên URL —
  // renderer không có việc gì phải biết về scheme, và một URL đầy đủ dễ bị
  // dùng nhầm làm đích điều hướng.
  mainWindow?.webContents.send('app:navigate', {
    path: parsed.pathname || '/',
    query: parsed.search,
  });
}

async function bootstrap(): Promise<void> {
  // Đăng ký app làm trình xử lý `cuongthai://`. Ở dev, Electron chạy qua
  // binary trong node_modules nên phải chỉ đường tường minh, nếu không HĐH sẽ
  // ghi nhận sai chương trình và deep-link im lặng không tới đâu.
  if (IS_DEV && process.platform === 'win32') {
    app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME, process.execPath, [
      path.resolve(process.argv[1] ?? ''),
    ]);
  } else {
    app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME);
  }

  forbidChildProcesses();

  await app.whenReady();

  applySessionPolicies();
  registerAppProtocol(path.join(__dirname, '../renderer'));
  await registerIpcHandlers();

  mainWindow = createMainWindow();
  watchNetwork();

  // Robot nổi — bật sau cửa sổ chính. Nó là cửa sổ hệ điều hành RIÊNG, sống
  // chừng nào app chưa thoát hẳn, kể cả khi cửa sổ chính đã đóng.
  const { moRobot, cuaSoChinh, dongRobot, robotTheoTieuDiem } = await import('./robotNoi');
  moRobot();

  /**
   * Một lúc chỉ MỘT con robot trên màn hình.
   *
   * App đã có dock robot vẽ trong trang, cũng ở góc dưới-phải; cửa sổ nổi cũng
   * neo góc dưới-phải màn hình. Cửa sổ chính mở to là hai con chồng lên nhau —
   * người dùng nhìn thấy ngay và hỏi "sao lại có 2 con robot".
   *
   * `blur`/`hide`/`minimize` ⇒ hiện con nổi; quay vào app ⇒ ẩn nó đi.
   */
  const theoDoiTieuDiem = (w: BrowserWindow): void => {
    w.on('focus', () => robotTheoTieuDiem(true));
    w.on('show', () => robotTheoTieuDiem(true));
    w.on('blur', () => robotTheoTieuDiem(false));
    w.on('hide', () => robotTheoTieuDiem(false));
    w.on('minimize', () => robotTheoTieuDiem(false));
    w.on('closed', () => robotTheoTieuDiem(false));
  };
  theoDoiTieuDiem(mainWindow);
  // Cửa sổ chính vừa mở là đang có tiêu điểm — ẩn con nổi ngay, đừng để nó
  // nháy lên một cái rồi mới biến mất.
  robotTheoTieuDiem(mainWindow.isFocused());

  // Nguồn tin cho robot: hỏi thăm tin nhắn/thông báo chưa đọc ở MAIN, độc lập
  // với mọi cửa sổ — vì cửa sổ chính có thể đã đóng trong khi app vẫn chạy.
  const { batTheoDoiTin, dungTheoDoiTin } = await import('./robotTin');
  batTheoDoiTin();
  app.on('will-quit', () => dungTheoDoiTin());

  /**
   * Đóng cửa sổ CHÍNH trên Windows/Linux ⇒ thoát app.
   *
   * ⚠️ Không có nhánh này thì robot nổi GIỮ APP SỐNG MÃI: `window-all-closed`
   * không bao giờ bắn vì robot vẫn còn đó, nên người dùng đóng cửa sổ chính và
   * app biến thành một tiến trình ma chỉ giết được bằng Task Manager.
   *
   * (Electron KHÔNG có sự kiện `browser-window-closed` ở cấp app — chỉ có
   * `closed` trên từng cửa sổ. Nên gắn vào đúng cửa sổ chính.)
   *
   * macOS thì KHÔNG thoát: ở đó đóng cửa sổ không đồng nghĩa thoát app, và
   * robot đứng lại chính là điều người dùng muốn.
   */
  mainWindow.on('closed', () => {
    if (process.platform === 'darwin') return;
    if (!cuaSoChinh()) { dungTheoDoiTin(); dongRobot(); app.quit(); }
  });

  // Tự kiểm bản mới. Không ai vào Cài đặt mỗi ngày để hỏi — bắt họ làm vậy
  // nghĩa là phần lớn người dùng mắc kẹt ở bản cũ mà không hề biết.
  const { scheduleUpdateChecks } = await import('./ipc/update');
  scheduleUpdateChecks();

  // Bật server MCP ở NỀN, không `await`. Chờ ở đây nghĩa là một server MCP hỏng
  // giữ cửa sổ trắng thêm 10 giây — mà MCP là tính năng phần lớn người dùng
  // không cắm gì vào. Chưa cấu hình gì thì đây chỉ là một lần đọc file nhỏ.
  void import('./agent/mcp').then(({ napLaiMcp }) => napLaiMcp()).catch(() => {});
  app.on('will-quit', () => {
    void import('./agent/mcp').then(({ tatHet }) => tatHet()).catch(() => {});
    void import('./browser').then(({ huy }) => huy()).catch(() => {});
    // Lệnh nền SỐNG LÂU HƠN lượt sinh ra nó — đó là điểm của nó. Nhưng nó không
    // được sống lâu hơn cả app: thiếu dòng này là để lại `npm run dev` mồ côi.
    void import('./agent/lenhNen').then(({ dungMoiLenhNen }) => dungMoiLenhNen()).catch(() => {});
  });

  app.on('activate', () => {
    /**
     * macOS: bấm icon ở Dock.
     *
     * ⚠️ KHÔNG đếm `getAllWindows().length` nữa. Robot nổi LUÔN là một cửa sổ,
     * nên con số đó không bao giờ về 0 — và người dùng bấm icon Dock sẽ chẳng
     * thấy gì xảy ra, mãi mãi. Phải hỏi đúng "còn cửa sổ CHÍNH không".
     */
    void import('./robotNoi').then(({ cuaSoChinh }) => {
      const w = cuaSoChinh();
      /**
       * ⚠️ Có cửa sổ chính rồi thì vẫn phải ĐƯA NÓ RA TRƯỚC.
       *
       * Trước đây nhánh này chỉ tạo cửa sổ khi CHƯA có, còn có rồi thì không
       * làm gì. Trên macOS, `activate` bắn cả khi ⌘Tab sang app — và vì robot
       * nổi là một cửa sổ luôn hiện ở mức `screen-saver`, hệ điều hành coi như
       * app đã có cửa sổ trên màn hình nên KHÔNG tự nâng cửa sổ chính lên.
       * Người dùng ⌘Tab sang CuongThai và chỉ thấy… con robot; phải bấm tay
       * vào cửa sổ hoặc vào robot mới vào được app.
       */
      if (w) {
        if (w.isMinimized()) w.restore();
        w.show();
        w.focus();
        return;
      }
      mainWindow = createMainWindow();
      theoDoiTieuDiem(mainWindow);
    });
  });
}

/**
 * Theo dõi trạng thái mạng ở MAIN chứ không tin `navigator.onLine` của renderer.
 *
 * `navigator.onLine` chỉ nói "có giao diện mạng nào đang bật" — cắm WiFi vào
 * một router không có internet thì nó vẫn báo online. `net.isOnline()` của
 * Electron dựa trên phán đoán kết nối thật của Chromium, sát thực tế hơn.
 * Renderer vẫn cần một lần xác nhận thật bằng chính lời gọi API trước khi
 * tuyên bố với người dùng là đã có mạng — xem Phase 3.
 */
function watchNetwork(): void {
  let previous = net.isOnline();

  setInterval(() => {
    const current = net.isOnline();
    if (current === previous) return;
    previous = current;
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send('app:networkChanged', { online: current });
    }
  }, 3000);
}

// macOS gửi deep-link qua sự kiện này chứ không qua dòng lệnh.
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

app.on('window-all-closed', () => {
  // macOS giữ app sống khi đóng hết cửa sổ — đó là quy ước của nền tảng.
  if (process.platform !== 'darwin') app.quit();
});


