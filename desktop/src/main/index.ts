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
  });

  app.on('activate', () => {
    // macOS: bấm icon ở Dock khi không còn cửa sổ nào.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
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
