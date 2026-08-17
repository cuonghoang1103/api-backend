/**
 * Cập nhật tự động qua GitHub Releases.
 *
 * ─── Nguyên tắc ───
 * KHÔNG tự cài đè khi người dùng đang làm việc. Bản mới được áp lúc THOÁT
 * (`autoInstallOnAppQuit`), thời điểm duy nhất không cắt ngang việc của ai.
 *
 * ─── Tự kiểm tra, không đợi người dùng đi tìm ───
 * Kiểm một lần sau khi mở app 15 giây, rồi mỗi 6 tiếng. Không ai vào Cài đặt
 * mỗi ngày để hỏi xem có bản mới không — bắt họ làm vậy nghĩa là phần lớn người
 * dùng sẽ mắc kẹt ở bản cũ vĩnh viễn mà không biết.
 *
 * 15 giây chứ không phải ngay lập tức: lúc khởi động app còn đang khôi phục
 * phiên và nạp dữ liệu, thêm một lời gọi mạng vào đúng lúc đó chỉ làm chậm thứ
 * người dùng đang chờ.
 */
import { app, BrowserWindow } from 'electron';
import type { UpdateStatus } from '../../shared/ipc';
import { IS_DEV } from '../config';
import { handle } from './index';

/**
 * Trần thời gian cho một lần kiểm tra.
 *
 * Có nó vì một lý do cụ thể: nếu `app-update.yml` trỏ vào repo không tồn tại
 * (đã xảy ra thật với bản 0.1.0 — sai `owner`), lời gọi có thể không bao giờ
 * trả về và giao diện quay vòng mãi mãi. Người dùng nhìn thấy "Đang kiểm tra…"
 * vô tận và không có cách nào biết chuyện gì hỏng.
 *
 * Thà báo "không kiểm tra được" sau 30 giây còn hơn quay mãi.
 */
const CHECK_TIMEOUT_MS = 30_000;

/** Tự kiểm sau khi mở app, rồi định kỳ. */
const FIRST_CHECK_DELAY_MS = 15_000;
const PERIODIC_CHECK_MS = 6 * 60 * 60 * 1000;

let lastStatus: UpdateStatus = { state: 'idle' };

function broadcast(status: UpdateStatus): void {
  lastStatus = status;
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send('update:status', status);
  }
}

/** Trạng thái biết lần cuối — để cửa sổ mở sau vẫn thấy đúng. */
export function currentUpdateStatus(): UpdateStatus {
  return lastStatus;
}

/**
 * Nạp `electron-updater` chậm (lazy): import ở đầu file sẽ kéo cả thư viện vào
 * lúc khởi động, kể cả ở bản dev nơi nó không bao giờ được dùng.
 */
async function getUpdater() {
  /**
   * ⛔⛔ PHẢI lấy qua `default` — và đây là một lỗi ĐÃ SỐNG QUA MỌI BẢN PHÁT HÀNH.
   *
   * `electron-updater` là gói CommonJS. Trong bản đóng gói, dòng này biên dịch
   * thành `import()` THẬT của Node, và Node dựng namespace cho gói CJS bằng bộ
   * dò export tĩnh (`cjs-module-lexer`). Thư viện này phơi `autoUpdater` qua
   * một GETTER (nó chọn provider theo nền tảng lúc đọc), mà getter thì bộ dò
   * tĩnh không thấy — nên `ns.autoUpdater` là `undefined`, còn
   * `ns.default.autoUpdater` mới là thật.
   *
   * Hậu quả: `autoUpdater.autoDownload = …` ném `TypeError`, lời hứa bị nuốt ở
   * `void scheduleUpdateChecks()`, và app IM LẶNG không bao giờ kiểm bản mới.
   * Không có gì đỏ, không có thông báo — chỉ là người dùng mắc kẹt ở bản cũ
   * mãi mãi. Đo được 17/08/2026 bằng cách CHẠY bản đã đóng gói; đọc mã không
   * bao giờ ra, và ở dev thì đường này gần như không ai đi tới.
   */
  const mod = await import('electron-updater');
  const autoUpdater = mod.autoUpdater
    ?? (mod as unknown as { default?: { autoUpdater?: typeof mod.autoUpdater } }).default?.autoUpdater;
  if (!autoUpdater) throw new Error('Không nạp được electron-updater (thiếu autoUpdater).');
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = false;
  return autoUpdater;
}

let listenersAttached = false;

async function runCheck(): Promise<void> {
  if (IS_DEV || !app.isPackaged) {
    broadcast({ state: 'none' });
    return;
  }

  broadcast({ state: 'checking' });
  const autoUpdater = await getUpdater();

  if (!listenersAttached) {
    listenersAttached = true;

    autoUpdater.on('update-not-available', () => broadcast({ state: 'none' }));
    autoUpdater.on('update-available', (info) => {
      broadcast({ state: 'available', version: info.version });
      /**
       * ⛔ TRÊN macOS: KHÔNG tải, chỉ BÁO.
       *
       * Squirrel.Mac bắt buộc bản cập nhật phải có chữ ký hợp lệ, mà app này cố
       * ý KHÔNG ký số (xem `identity: null` trong electron-builder.yml — người
       * dùng đã cân nhắc giá và quyết định hoãn). Đo thật 17/08/2026: nó tải
       * xong 130MB rồi chết ở bước cuối với
       *
       *   Code signature ... did not pass validation: code has no resources
       *   but signature indicates they must be present
       *
       * Nên tải về là ném 130MB băng thông của người dùng vào thùng rác, MỖI
       * LẦN có bản mới. Thà nói thẳng "có bản mới, bấm để tải" và để họ cài tay
       * — mất một phút, nhưng thật sự lên được bản mới.
       *
       * Windows (NSIS) và Linux (AppImage) KHÔNG có ràng buộc này nên vẫn tự
       * cập nhật đầy đủ. Ký được app macOS (Apple Developer, 99 $/năm) thì xoá
       * nhánh này đi là đường tự động quay lại ngay.
       */
      if (process.platform === 'darwin') {
        broadcast({ state: 'manual', version: info.version });
        return;
      }
      // Có bản mới thì tải luôn. Người dùng không phải bấm thêm một nút nữa —
      // và khi tải xong họ mới được hỏi có khởi động lại không.
      void autoUpdater.downloadUpdate();
    });
    autoUpdater.on('download-progress', (progress) => {
      broadcast({ state: 'downloading', percent: Math.round(progress.percent) });
    });
    autoUpdater.on('update-downloaded', (info) => {
      broadcast({ state: 'ready', version: info.version });
    });
    autoUpdater.on('error', (error) => {
      // Lỗi cập nhật KHÔNG được làm app chết. Không nối được GitHub là chuyện
      // thường (mạng công ty chặn, đang offline).
      broadcast({
        state: 'error',
        message: error instanceof Error ? error.message : String(error),
      });
    });
  }

  try {
    // Chạy đua với đồng hồ. `checkForUpdates()` có thể treo vô hạn khi cấu hình
    // trỏ sai chỗ, và một lời hứa không bao giờ hoàn thành thì không có `catch`
    // nào bắt được.
    await Promise.race([
      autoUpdater.checkForUpdates(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Máy chủ cập nhật không phản hồi sau 30 giây.')),
          CHECK_TIMEOUT_MS,
        ),
      ),
    ]);
  } catch (error) {
    broadcast({
      state: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Bật lịch tự kiểm tra. Gọi một lần sau khi cửa sổ đầu tiên đã mở.
 */
export function scheduleUpdateChecks(): void {
  if (IS_DEV || !app.isPackaged) return;

  setTimeout(() => void runCheck(), FIRST_CHECK_DELAY_MS);
  setInterval(() => void runCheck(), PERIODIC_CHECK_MS);
}

export function registerUpdateHandlers(): void {
  handle('update:check', () => runCheck());

  handle('update:getStatus', () => currentUpdateStatus());

  handle('update:install', async () => {
    if (IS_DEV || !app.isPackaged) {
      throw new Error('Bản chạy từ mã nguồn không cài cập nhật được.');
    }
    const autoUpdater = await getUpdater();
    autoUpdater.quitAndInstall(false, true);
  });
}
