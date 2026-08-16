/**
 * Cập nhật tự động qua GitHub Releases.
 *
 * Nguyên tắc: KHÔNG tự cài đè khi người dùng đang làm việc. `electron-updater`
 * mặc định `autoInstallOnAppQuit = true`, nghĩa là bản mới được áp lúc thoát —
 * đúng thời điểm duy nhất không cắt ngang việc của ai. App chỉ báo "đã có bản
 * mới" và để người dùng chọn khởi động lại ngay hay để lần sau.
 *
 * Tải tự động cũng TẮT: người dùng bấm "Kiểm tra" mới tải. Tải nền vài trăm MB
 * trên mạng di động mà không hỏi là chuyện không nên làm.
 *
 * Bản chạy từ mã nguồn không có gì để so — `checkForUpdates` trên bản chưa đóng
 * gói sẽ ném lỗi, nên nhánh dev trả `none` ngay và nói thật, thay vì hiện một
 * lỗi khó hiểu cho người đang phát triển.
 */
import { app, BrowserWindow } from 'electron';
import type { UpdateStatus } from '../../shared/ipc';
import { IS_DEV } from '../config';
import { handle } from './index';

function broadcast(status: UpdateStatus): void {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send('update:status', status);
  }
}

/**
 * Nạp `electron-updater` chậm (lazy).
 *
 * Import ở đầu file sẽ kéo cả thư viện vào lúc khởi động, kể cả ở bản dev nơi
 * nó không bao giờ được dùng — chậm khởi động vì một tính năng phần lớn thời
 * gian không chạy.
 */
async function getUpdater() {
  const { autoUpdater } = await import('electron-updater');

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  // Cho phép hạ cấp khi cần gỡ một bản lỗi: không có cờ này thì việc rút bản
  // hỏng phải chờ phát hành một phiên bản cao hơn.
  autoUpdater.allowDowngrade = false;

  return autoUpdater;
}

let listenersAttached = false;

export function registerUpdateHandlers(): void {
  handle('update:check', async () => {
    if (IS_DEV || !app.isPackaged) {
      // Bản chạy từ mã nguồn không có phiên bản phát hành để đối chiếu.
      broadcast({ state: 'none' });
      return;
    }

    const autoUpdater = await getUpdater();

    if (!listenersAttached) {
      listenersAttached = true;

      autoUpdater.on('checking-for-update', () => broadcast({ state: 'checking' }));
      autoUpdater.on('update-not-available', () => broadcast({ state: 'none' }));
      autoUpdater.on('update-available', (info) => {
        broadcast({ state: 'available', version: info.version });
        // Có bản mới thì tải luôn — người dùng vừa chủ động bấm "Kiểm tra", nên
        // họ đang chờ kết quả chứ không phải đang bị làm phiền.
        void autoUpdater.downloadUpdate();
      });
      autoUpdater.on('download-progress', (progress) => {
        broadcast({ state: 'downloading', percent: Math.round(progress.percent) });
      });
      autoUpdater.on('update-downloaded', (info) => {
        broadcast({ state: 'ready', version: info.version });
      });
      autoUpdater.on('error', (error) => {
        // KHÔNG để lỗi cập nhật làm app chết. Không nối được GitHub là chuyện
        // thường (mạng công ty chặn, đang offline) và nó không cản trở gì.
        broadcast({
          state: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      });
    }

    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      broadcast({
        state: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  handle('update:install', async () => {
    if (IS_DEV || !app.isPackaged) {
      throw new Error('Bản chạy từ mã nguồn không cài cập nhật được.');
    }
    const autoUpdater = await getUpdater();
    // `isSilent = false` để người dùng thấy trình cài chạy; `isForceRunAfter`
    // để app tự mở lại sau khi cài xong.
    autoUpdater.quitAndInstall(false, true);
  });
}
