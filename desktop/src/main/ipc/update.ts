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
import { app, BrowserWindow, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
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

  handle('update:taiThuCong', () => taiFileCai());
  handle('update:tuCapNhat', () => tuCapNhat());
  handle('update:noiDangChay', () => noiDangChay());
  handle('update:moThuMuc', () => {
    if (duongFileCai) shell.showItemInFolder(duongFileCai);
  });
}

// ════════════════════════════════════════════════════════════
// macOS — TỰ TẢI FILE CÀI
// ════════════════════════════════════════════════════════════

/**
 * Vì sao có phần này.
 *
 * Trên macOS app không tự cài đè được (chưa ký số), nên trước đây nút cập nhật
 * chỉ mở trang phát hành trên GitHub. Trang đó có 15 tệp — arm64/x64, dmg/zip,
 * kèm `.blockmap` và `.yml` — và chọn nhầm là tải 140MB rồi không mở được gì.
 * App thì biết chính xác nó đang chạy trên kiến trúc nào. Để nó chọn.
 *
 * Tải xong KHÔNG tự mở file: mở `.dmg` là gắn một ổ đĩa vào máy người dùng, đó
 * là việc của họ. Chỉ hiện file trong Finder.
 */
const REPO_PHAT_HANH = 'https://github.com/cuonghoang1103/cuongthai-desktop/releases';

let duongFileCai: string | null = null;

/**
 * Tên file `.zip` của bản macOS.
 *
 * arm64 → `CuongThai-<v>-arm64-mac.zip` · x64 → `CuongThai-<v>-mac.zip`
 * (electron-builder bỏ hậu tố kiến trúc ở bản x64 — không phải lỗi đánh máy).
 */
export function tenFileZip(version: string, arch: string = process.arch): string {
  return arch === 'x64' ? `CuongThai-${version}-mac.zip` : `CuongThai-${version}-arm64-mac.zip`;
}

export function tenFileCai(version: string, arch: string = process.arch): string {
  // Khớp `artifactName` của electron-builder: '${productName}-${version}-${arch}.${ext}'
  const a = arch === 'x64' ? 'x64' : 'arm64';
  return `CuongThai-${version}-${a}.dmg`;
}

async function taiFileCai(): Promise<void> {
  const tt = lastStatus;
  if (tt.state !== 'manual') throw new Error('Chưa có bản mới nào để tải.');
  const { version } = tt;
  const ten = tenFileCai(version);
  const url = `${REPO_PHAT_HANH}/download/v${version}/${ten}`;
  const dich = path.join(app.getPath('downloads'), ten);

  broadcast({ state: 'taiTay', version, percent: 0 });
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok || !res.body) throw new Error(`Máy chủ trả về ${res.status}`);

    const tong = Number(res.headers.get('content-length') || 0);
    // Ghi ra file TẠM rồi mới đổi tên. Đứt mạng giữa chừng mà đã ghi thẳng vào
    // tên thật thì người dùng có một file `.dmg` cụt trong Downloads trông y
    // như file thật, và nó hỏng theo cách khó hiểu lúc mở.
    const tam = `${dich}.tai`;
    const ra = fs.createWriteStream(tam);
    let da = 0;
    let phanTramCu = -1;

    for await (const mau of res.body as unknown as AsyncIterable<Uint8Array>) {
      ra.write(mau);
      da += mau.byteLength;
      if (tong) {
        const p = Math.round((da / tong) * 100);
        // Chỉ phát khi số thật sự đổi — 140MB chia theo từng mẩu là hàng nghìn
        // lần gửi IPC cho cùng một con số.
        if (p !== phanTramCu) { phanTramCu = p; broadcast({ state: 'taiTay', version, percent: p }); }
      }
    }
    await new Promise<void>((xong, hong) => ra.end((e?: Error) => (e ? hong(e) : xong())));
    await fs.promises.rename(tam, dich);

    duongFileCai = dich;
    broadcast({ state: 'taiXong', version, duong: dich });
  } catch (err) {
    // Tải hỏng KHÔNG được để người dùng cụt đường: quay về `manual` để nút "mở
    // trang tải" hiện lại, kèm lý do.
    broadcast({ state: 'error', message: `Không tải được bản cài: ${(err as Error).message}. Mở ${REPO_PHAT_HANH}/latest để tải tay.` });
  }
}

// ════════════════════════════════════════════════════════════
// macOS — TỰ CẬP NHẬT THẬT (không qua Squirrel)
// ════════════════════════════════════════════════════════════

/**
 * Vì sao phải TỰ VIẾT thay vì dùng electron-updater.
 *
 * Squirrel.Mac bắt buộc bản mới phải qua `SecStaticCodeCheckValidity` với yêu
 * cầu suy ra từ chữ ký của app ĐANG CHẠY. Đo thật trên bản đã phát hành:
 *
 *   codesign -dv /Applications/CuongThai.app
 *   → Identifier=Electron · Signature=adhoc · flags=0x20002(adhoc,linker-signed)
 *
 * Đó là chữ ký ad-hoc mà chính nhị phân Electron mang sẵn — electron-builder
 * không ký lại gì cả (`identity: null`). Chữ ký ad-hoc KHÔNG có danh tính ổn
 * định: "designated requirement" của nó gắn vào `cdhash` của đúng bản nhị phân
 * đó, mà cdhash đổi ở MỌI lần dựng. Nên bản N không bao giờ thoả yêu cầu của
 * bản N+1 — ký ad-hoc kiểu gì cũng vậy. Không phải chuyện cấu hình sai; muốn
 * Squirrel chạy thì phải có chứng chỉ Developer ID thật (99 $/năm).
 *
 * NHƯNG bản thân việc thay app thì không cần chữ ký nào. App nằm ở
 * `/Applications/CuongThai.app`, người dùng là chủ và ghi được không cần mật
 * khẩu. Vậy thì: tải `.zip`, bung ra, TRÁO cả bó, mở lại. Đúng thứ người dùng
 * làm bằng tay, chỉ là app tự làm.
 *
 * ─── BỐN CHỖ KHÔNG ĐƯỢC LÀM SAI ───
 *
 *  1. **Bung bằng `ditto -xk`, KHÔNG dùng `unzip`.** Bó `.app` chứa symlink và
 *     cờ quyền; `unzip` làm phẳng chúng và cho ra một app không mở nổi.
 *  2. **Kiểm bản vừa bung TRƯỚC khi tráo.** Tải hụt hay bung lỗi mà đã xoá bản
 *     cũ thì người dùng mất luôn app — hỏng nặng hơn hẳn việc không cập nhật.
 *  3. **Đổi tên bản cũ, đừng xoá.** Tráo xong mới xoá; giữa chừng có sự cố thì
 *     còn đường lùi.
 *  4. **Không tự cập nhật khi app KHÔNG chạy từ nơi ghi được** (ví dụ bản dựng
 *     thử trong thư mục mã nguồn, hoặc app còn nằm trong ảnh đĩa `.dmg`). Ghi
 *     đè ở đó hoặc thất bại, hoặc "thành công" vào một chỗ người dùng không
 *     bao giờ mở tới.
 */

/** App đang chạy từ đâu, và có tráo được tại chỗ không. */
export function noiDangChay(): { duong: string; trongApplications: boolean; ghiDuoc: boolean } {
  // `/Applications/X.app/Contents/MacOS/X` → lùi 3 cấp là bó ứng dụng.
  const duong = path.resolve(path.dirname(app.getPath('exe')), '..', '..');
  let ghiDuoc = false;
  try {
    fs.accessSync(path.dirname(duong), fs.constants.W_OK);
    fs.accessSync(duong, fs.constants.W_OK);
    ghiDuoc = true;
  } catch { ghiDuoc = false; }
  return { duong, trongApplications: duong.startsWith('/Applications/'), ghiDuoc };
}

async function tuCapNhat(): Promise<void> {
  const tt = lastStatus;
  if (tt.state !== 'manual') throw new Error('Chưa có bản mới nào để cài.');
  const { version } = tt;

  const noi = noiDangChay();
  if (!noi.ghiDuoc) {
    broadcast({
      state: 'error',
      message: `Không tự cập nhật được vì app đang chạy từ ${noi.duong} — chỗ này không ghi đè được. `
        + 'Nếu bạn đang mở một bản dựng thử trong thư mục mã nguồn thì hãy mở app từ thư mục Applications.',
    });
    return;
  }

  const ten = tenFileZip(version);
  const url = `${REPO_PHAT_HANH}/download/v${version}/${ten}`;
  const tmp = fs.mkdtempSync(path.join(app.getPath('temp'), 'ct-update-'));
  const fileZip = path.join(tmp, ten);

  try {
    broadcast({ state: 'taiTay', version, percent: 0 });
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok || !res.body) throw new Error(`Máy chủ trả về ${res.status}`);
    const tong = Number(res.headers.get('content-length') || 0);
    const ra = fs.createWriteStream(fileZip);
    let da = 0;
    let cu = -1;
    for await (const mau of res.body as unknown as AsyncIterable<Uint8Array>) {
      ra.write(mau);
      da += mau.byteLength;
      if (tong) {
        const p = Math.round((da / tong) * 100);
        if (p !== cu) { cu = p; broadcast({ state: 'taiTay', version, percent: p }); }
      }
    }
    await new Promise<void>((xong, hong) => ra.end((e?: Error) => (e ? hong(e) : xong())));

    broadcast({ state: 'dangCai', version });

    // `ditto -xk` là công cụ của Apple, hiểu đúng bó `.app`. `unzip` thì không.
    const { execFile } = await import('node:child_process');
    const bung = path.join(tmp, 'bung');
    await new Promise<void>((xong, hong) => {
      execFile('/usr/bin/ditto', ['-xk', fileZip, bung], (e) => (e ? hong(e) : xong()));
    });

    const appMoi = path.join(bung, 'CuongThai.app');
    // Kiểm TRƯỚC khi động vào bản đang chạy.
    const plist = path.join(appMoi, 'Contents', 'Info.plist');
    if (!fs.existsSync(path.join(appMoi, 'Contents', 'MacOS', 'CuongThai')) || !fs.existsSync(plist)) {
      throw new Error('Gói tải về không phải một app hợp lệ.');
    }

    const cuDoi = `${noi.duong}.cu-${Date.now()}`;
    fs.renameSync(noi.duong, cuDoi);          // đổi tên, KHÔNG xoá
    try {
      fs.renameSync(appMoi, noi.duong);
    } catch (e) {
      fs.renameSync(cuDoi, noi.duong);        // tráo hỏng ⇒ trả bản cũ về chỗ
      throw e;
    }
    fs.rmSync(cuDoi, { recursive: true, force: true });

    /**
     * Mở lại bản mới SAU KHI tiến trình này chết hẳn.
     *
     * `open` ngay lập tức thì macOS thấy app cùng bundle id đang chạy và chỉ
     * đưa cửa sổ CŨ ra trước — người dùng thấy "không có gì xảy ra". Một tiến
     * trình con tách rời đợi tiến trình cha biến mất rồi mới mở.
     */
    const { spawn } = await import('node:child_process');
    spawn('/bin/sh', ['-c', `while kill -0 ${process.pid} 2>/dev/null; do sleep 0.4; done; open -n "${noi.duong}"`], {
      detached: true, stdio: 'ignore',
    }).unref();

    broadcast({ state: 'caiXong', version });
    setTimeout(() => { app.relaunch(); app.exit(0); }, 900);
  } catch (err) {
    broadcast({
      state: 'error',
      message: `Không cài được bản mới: ${(err as Error).message}. Bấm "Tải bản cài" để cài tay.`,
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
