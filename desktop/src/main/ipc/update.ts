/**
 * Cập nhật tự động qua GitHub Releases.
 *
 * ─── Nguyên tắc ───
 * KHÔNG tự cài đè khi người dùng đang làm việc. Bản mới được áp lúc THOÁT
 * (`autoInstallOnAppQuit`), thời điểm duy nhất không cắt ngang việc của ai.
 *
 * ─── Tự kiểm tra, không đợi người dùng đi tìm ───
 * Kiểm một lần sau khi mở app 15 giây, mỗi 45 phút sau đó, VÀ mỗi lần người
 * dùng quay lại cửa sổ (chốt 10 phút). Không ai vào Cài đặt mỗi ngày để hỏi xem
 * có bản mới không — bắt họ làm vậy nghĩa là phần lớn người dùng sẽ mắc kẹt ở
 * bản cũ vĩnh viễn mà không biết.
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
import { baoBanMoi } from '../robotTin';
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
/**
 * 45 phút, KHÔNG phải 6 tiếng.
 *
 * 6 tiếng nghĩa là: phát hành lúc 10h thì người mở app từ 9h sáng tới 15h mới
 * biết — và trong lúc đó họ phải tự vào Cài đặt bấm "Kiểm tra bản mới", đúng
 * cái phiền mà tự-cập-nhật sinh ra để xoá bỏ. Một lời gọi HTTP nhỏ mỗi 45 phút
 * là cái giá không đáng kể.
 */
const PERIODIC_CHECK_MS = 45 * 60 * 1000;
/** Quay lại app sau khi bỏ đi lâu thì kiểm luôn — nhưng không dày hơn mức này. */
const FOCUS_CHECK_MIN_GAP_MS = 10 * 60 * 1000;
let lanKiemCuoi = 0;

let lastStatus: UpdateStatus = { state: 'idle' };

/** Đã đẩy thông báo ngoài app cho bản nào rồi — để không lải nhải mỗi 45 phút. */
let daBaoRaNgoai: string | null = null;

function broadcast(status: UpdateStatus): void {
  lastStatus = status;
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send('update:status', status);
  }

  /* Tin "có bản mới" phải tới được người dùng KỂ CẢ khi họ đang ở app khác.
   * Ba trạng thái này là ba đường "sẵn sàng cài" của ba nền tảng:
   *   ready   → Windows/Linux, Squirrel đã tải xong
   *   sanSang → macOS, gói .zip đã tải sẵn
   *   manual  → macOS, chưa tải được sẵn nhưng bấm một nút là xong
   * Chỉ báo MỘT LẦN cho mỗi số phiên bản. */
  if (status.state === 'ready' || status.state === 'sanSang' || status.state === 'manual') {
    if (daBaoRaNgoai !== status.version) {
      daBaoRaNgoai = status.version;
      baoBanMoi(status.version);
    }
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
  lanKiemCuoi = Date.now();
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
        // Tải SẴN ở nền, rồi mới hỏi. Người dùng bấm "Khởi động lại" là thay
        // ngay trong vài giây, không phải đứng nhìn thanh tải 150MB — đúng kiểu
        // app Claude. Tải hỏng thì rơi về `manual` để còn bấm thử lại.
        void taiSanBanMac(info.version);
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
 * Dọn rác cập nhật của MỌI nền tảng. Chạy lúc khởi động, im lặng, không chặn gì.
 *
 * macOS: bó `CuongThai.app.cu-*` còn sót sau một lần tráo (~176MB mỗi cái —
 * bản 0.5.8 để lại hai cái vì bước dọn ném ENOTDIR, xem `tuCapNhat`).
 * Windows/Linux: gói cài `electron-updater` tải về rồi bỏ quên.
 */
export function donRacCapNhat(): void {
  if (!app.isPackaged) return;
  donRacMac();
  donRacTaiVe();
}

/** Bó `.app` cũ còn sót sau một lần tráo trên macOS. */
function donRacMac(): void {
  if (process.platform !== 'darwin') return;
  try {
    const noi = noiDangChay();
    const thuMuc = path.dirname(noi.duong);
    const ten = path.basename(noi.duong);
    const noAsarCu = process.noAsar;
    try {
      process.noAsar = true;
      for (const muc of fs.readdirSync(thuMuc)) {
        if (!muc.startsWith(`${ten}.cu-`)) continue;
        fs.rmSync(path.join(thuMuc, muc), { recursive: true, force: true });
      }
    } finally {
      process.noAsar = noAsarCu;
    }
  } catch {
    /* không dọn được cũng không sao — đây là việc phụ */
  }
}

/**
 * Gói cài mà `electron-updater` tải về rồi bỏ quên — Windows và Linux.
 *
 * Nó cất bản tải xuống ở `<cache>/<tên app>-updater/pending`, mỗi gói 130-170MB.
 * Cài xong thường tự dọn, nhưng cài lỡ dở, mất điện, hay người dùng bấm "để
 * sau" rồi gỡ app ra thì gói nằm lại vĩnh viễn.
 *
 * ⚠️ CHỈ xoá thứ đã hơn BẢY NGÀY. Trong thư mục đó có thể đang là gói của một
 * bản cập nhật CHƯA cài xong — người dùng bấm "để sau" và nó sẽ được cài lúc
 * thoát app. Xoá đi là bắt họ tải lại 170MB mà không hiểu vì sao.
 */
function donRacTaiVe(): void {
  if (process.platform === 'darwin') return;
  const BAY_NGAY = 7 * 24 * 60 * 60 * 1000;
  try {
    const goc = path.join(app.getPath('userData'), '..', `${app.getName()}-updater`, 'pending');
    if (!fs.existsSync(goc)) return;
    for (const ten of fs.readdirSync(goc)) {
      const duong = path.join(goc, ten);
      try {
        if (Date.now() - fs.statSync(duong).mtimeMs < BAY_NGAY) continue;
        fs.rmSync(duong, { recursive: true, force: true });
      } catch { /* file đang bị khoá — bỏ qua, lần sau dọn */ }
    }
  } catch {
    /* không có thư mục đó cũng là chuyện bình thường */
  }
}

/** Bật lịch tự kiểm tra. Gọi một lần sau khi cửa sổ đầu tiên đã mở. */
export function scheduleUpdateChecks(): void {
  if (IS_DEV || !app.isPackaged) return;

  donRacCapNhat();
  setTimeout(() => void runCheck(), FIRST_CHECK_DELAY_MS);
  setInterval(() => void runCheck(), PERIODIC_CHECK_MS);

  /* Kiểm thêm mỗi khi người dùng quay lại app.
   *
   * Người để app chạy nền cả ngày rồi quay lại lúc chiều là trường hợp thường
   * gặp nhất, và đó cũng đúng lúc họ sẵn sàng khởi động lại. Có chốt 10 phút để
   * bấm qua bấm lại giữa các cửa sổ không thành một tràng lời gọi. */
  app.on('browser-window-focus', () => {
    const gio = Date.now();
    if (gio - lanKiemCuoi < FOCUS_CHECK_MIN_GAP_MS) return;
    lanKiemCuoi = gio;
    void runCheck();
  });
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

/** Bản `.zip` đã tải sẵn, đang chờ tráo. Giữ giữa các lần kiểm. */
let zipDaTai: { version: string; fileZip: string; thuMuc: string } | null = null;

/** Tải `.zip` của một phiên bản về thư mục tạm, có báo tiến độ. */
async function taiZipVe(version: string): Promise<{ fileZip: string; thuMuc: string }> {
  const ten = tenFileZip(version);
  const url = `${REPO_PHAT_HANH}/download/v${version}/${ten}`;
  const thuMuc = fs.mkdtempSync(path.join(app.getPath('temp'), 'ct-update-'));
  const fileZip = path.join(thuMuc, ten);

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
      // Chỉ phát khi số thật sự đổi — 150MB chia theo từng mẩu là hàng nghìn
      // lần gửi IPC cho cùng một con số.
      if (p !== cu) { cu = p; broadcast({ state: 'taiTay', version, percent: p }); }
    }
  }
  await new Promise<void>((xong, hong) => ra.end((e?: Error) => (e ? hong(e) : xong())));
  return { fileZip, thuMuc };
}

/**
 * macOS: tải sẵn bản mới ở NỀN ngay khi phát hiện, chưa cài.
 *
 * Để người dùng bấm "Khởi động lại" là xong trong vài giây, thay vì bấm rồi
 * đứng nhìn thanh tải 150MB. Tải hỏng thì rơi về `manual` — vẫn còn nút để bấm
 * thử lại, không mất đường.
 *
 * KHÔNG tải khi app đang chạy từ chỗ không ghi đè được (bản dựng thử, hoặc app
 * còn nằm trong ảnh đĩa `.dmg`): tải về cũng không tráo được, chỉ tổ ngốn băng
 * thông của người ta.
 */
async function taiSanBanMac(version: string): Promise<void> {
  if (zipDaTai?.version === version && fs.existsSync(zipDaTai.fileZip)) {
    broadcast({ state: 'sanSang', version });
    return;
  }
  const noi = noiDangChay();
  if (!noi.ghiDuoc) {
    broadcast({ state: 'manual', version });
    return;
  }
  try {
    broadcast({ state: 'taiTay', version, percent: 0 });
    // Bản tải dở của lần trước không còn dùng được nữa — dọn đi trước.
    if (zipDaTai) { fs.rmSync(zipDaTai.thuMuc, { recursive: true, force: true }); zipDaTai = null; }
    const { fileZip, thuMuc } = await taiZipVe(version);
    zipDaTai = { version, fileZip, thuMuc };
    broadcast({ state: 'sanSang', version });
  } catch {
    broadcast({ state: 'manual', version });
  }
}

async function tuCapNhat(): Promise<void> {
  const tt = lastStatus;
  const version = (tt.state === 'manual' || tt.state === 'sanSang') ? tt.version : null;
  if (!version) throw new Error('Chưa có bản mới nào để cài.');

  const noi = noiDangChay();
  if (!noi.ghiDuoc) {
    broadcast({
      state: 'error',
      message: `Không tự cập nhật được vì app đang chạy từ ${noi.duong} — chỗ này không ghi đè được. `
        + 'Nếu bạn đang mở một bản dựng thử trong thư mục mã nguồn thì hãy mở app từ thư mục Applications.',
    });
    return;
  }

  // Dùng bản đã tải sẵn nếu có; không thì tải ngay bây giờ.
  const coSan = zipDaTai?.version === version && fs.existsSync(zipDaTai.fileZip) ? zipDaTai : null;
  let tmp = coSan?.thuMuc ?? '';
  let fileZip = coSan?.fileZip ?? '';

  try {
    if (!coSan) {
      broadcast({ state: 'taiTay', version, percent: 0 });
      const ket = await taiZipVe(version);
      tmp = ket.thuMuc;
      fileZip = ket.fileZip;
    }

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

    /* Tới đây bản mới ĐÃ NẰM ĐÚNG CHỖ. Mọi thứ còn lại chỉ là dọn rác, nên
     * KHÔNG được phép làm hỏng cả lần cập nhật.
     *
     * ⛔ Lỗi thật, bản 0.5.8, 18/08/2026:
     *     ENOTDIR: not a directory, rmdir '…/CuongThai.app.cu-…/Contents/Resources/app.asar'
     *
     * Electron VÁ `fs` để đọc được bên trong `.asar`: với mã chạy trong
     * Electron, `app.asar` trông như một THƯ MỤC. Nên `rmSync(recursive)` đi
     * vào trong nó rồi gọi `rmdir` — còn nhân hệ điều hành thì thấy đúng bản
     * chất: một FILE. Kết quả là ENOTDIR.
     *
     * `process.noAsar = true` tắt lớp vá đó, `fs` quay lại nhìn thấy file thật.
     * Trả lại giá trị cũ ở `finally` vì cờ này là TOÀN CỤC — để bật vĩnh viễn
     * là mọi chỗ khác đọc `.asar` sẽ hỏng theo.
     *
     * Và dù có hỏng thì vẫn đi tiếp: người dùng cần APP MỚI chạy được, không
     * cần thư mục cũ biến mất. Bản 0.5.8 ném lỗi ở đây nên app không bao giờ
     * khởi động lại — nhìn như "cập nhật thất bại", trong khi bản mới đã nằm
     * sẵn ở /Applications rồi. */
    const noAsarCu = process.noAsar;
    try {
      process.noAsar = true;
      fs.rmSync(cuDoi, { recursive: true, force: true });
    } catch {
      /* để lại thư mục cũ cũng được — lần mở sau `donRacCapNhat()` sẽ hốt */
    } finally {
      process.noAsar = noAsarCu;
    }

    /**
     * Mở lại bản mới SAU KHI tiến trình này chết hẳn.
     *
     * `open` ngay lập tức thì macOS thấy app cùng bundle id đang chạy và chỉ
     * đưa cửa sổ CŨ ra trước — người dùng thấy "không có gì xảy ra". Một tiến
     * trình con tách rời đợi tiến trình cha biến mất rồi mới mở.
     *
     * ⛔ KHÔNG dùng kèm `app.relaunch()`, và KHÔNG dùng `open -n`.
     *
     * App có `requestSingleInstanceLock()` (main/index.ts): thực thể thứ hai
     * xin khoá không được là `app.quit()` ngay. Nếu vừa `app.relaunch()` vừa
     * `open -n` thì có HAI thực thể cùng khởi động và đua nhau giành khoá —
     * cái thua tự thoát. Tuỳ lúc, cái thua lại chính là cái đã dựng xong cửa
     * sổ, và người dùng thấy app "nháy lên rồi tắt" hoặc "không khởi động lại".
     *
     * Giữ đúng MỘT đường: đợi tiến trình này chết, rồi `open` (không `-n`).
     * Lúc đó không còn thực thể nào nên không có ai để tranh khoá; mà nếu
     * người dùng đã tự mở lại trong lúc chờ thì `open` chỉ đưa cửa sổ đó ra
     * trước — đúng thứ họ muốn.
     */
    const { spawn } = await import('node:child_process');
    spawn('/bin/sh', ['-c', `while kill -0 ${process.pid} 2>/dev/null; do sleep 0.4; done; open "${noi.duong}"`], {
      detached: true, stdio: 'ignore',
    }).unref();

    broadcast({ state: 'caiXong', version });
    setTimeout(() => app.exit(0), 900);
  } catch (err) {
    broadcast({
      state: 'error',
      message: `Không cài được bản mới: ${(err as Error).message}. Bấm "Tải bản cài" để cài tay.`,
    });
  } finally {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    zipDaTai = null;   // thư mục tạm vừa bị xoá, đừng để lại con trỏ chết
  }
}
