/**
 * Tạo và khôi phục cửa sổ chính.
 */
import { BrowserWindow, screen, nativeTheme } from 'electron';
import path from 'node:path';
import { APP_ORIGIN, DEV_SERVER_URL, IS_DEV, RENDERER_SOURCE } from './config';
import { hardenWebContents } from './security';
import { getSettings, getWindowState, setWindowState } from './store';

/**
 * Kiểm tra cửa sổ có nằm trong một màn hình đang tồn tại không.
 *
 * Người dùng rút màn hình ngoài ra là toạ độ đã lưu trỏ vào khoảng không —
 * app mở lên "mất tích", thực ra nó đang ở ngoài vùng nhìn thấy. Triệu chứng
 * y hệt app không khởi động được.
 */
function isVisibleOnSomeDisplay(x: number, y: number, width: number, height: number): boolean {
  return screen.getAllDisplays().some((display) => {
    const b = display.workArea;
    // Chỉ cần thấy được một góc là đủ để người dùng kéo nó về.
    return x < b.x + b.width && x + width > b.x && y < b.y + b.height && y + height > b.y;
  });
}

export function createMainWindow(): BrowserWindow {
  const state = getWindowState();
  const positionIsUsable =
    state.x !== undefined &&
    state.y !== undefined &&
    isVisibleOnSomeDisplay(state.x, state.y, state.width, state.height);

  const window = new BrowserWindow({
    width: state.width,
    height: state.height,
    ...(positionIsUsable ? { x: state.x, y: state.y } : {}),
    minWidth: 940,
    minHeight: 600,
    // Không hiện cho tới khi render xong khung đầu tiên. Bỏ qua bước này thì
    // người dùng thấy một ô trắng nhấp nháy trước khi giao diện xuất hiện.
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0b0b12' : '#f7f7fb',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    // Trên macOS `hiddenInset` giữ lại ba nút hệ thống ở đúng chỗ người dùng
    // quen tay. Windows/Linux dùng thanh tiêu đề gốc: thanh tự vẽ ở đó phải tự
    // làm lại snap, maximize, và menu chuột phải — làm dở thì tệ hơn là không làm.
    ...(process.platform === 'darwin'
      ? { trafficLightPosition: { x: 16, y: 18 } }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      // Không cho renderer mở DevTools bằng phím tắt ở bản đóng gói; ở dev thì
      // cần. DevTools trong tay người dùng cuối là một kênh chạy mã tuỳ ý ngay
      // trong ngữ cảnh đã đăng nhập.
      devTools: IS_DEV,
      spellcheck: true,
    },
  });

  hardenWebContents(window);

  if (state.maximized) window.maximize();

  window.once('ready-to-show', () => {
    window.show();

    const zoom = getSettings().zoomLevel;
    if (typeof zoom === 'number') window.webContents.setZoomFactor(zoom);
  });

  const persistBounds = () => {
    // Khi cửa sổ đang phóng to, `getBounds()` trả kích thước phóng to. Lưu số
    // đó thì lần sau bỏ phóng to sẽ ra một cửa sổ to bằng cả màn hình. Lấy
    // `getNormalBounds()` — kích thước "bình thường" mà Electron giữ riêng.
    const bounds = window.getNormalBounds();
    setWindowState({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: window.isMaximized(),
    });
  };

  window.on('resize', persistBounds);
  window.on('move', persistBounds);
  window.on('maximize', persistBounds);
  window.on('unmaximize', persistBounds);

  if (RENDERER_SOURCE === 'dev') {
    void window.loadURL(DEV_SERVER_URL);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    void window.loadURL(`${APP_ORIGIN}/index.html`);
  }

  return window;
}
