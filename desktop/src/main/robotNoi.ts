/**
 * ============================================================
 * ROBOT NỔI — trợ lý đứng ngoài app, luôn thấy
 * ============================================================
 *
 * Một cửa sổ RIÊNG: không khung, nền trong suốt, luôn nổi trên mọi thứ, không
 * hiện trong thanh tác vụ. Nó sống chừng nào app chưa thoát hẳn — kể cả khi cửa
 * sổ chính đã đóng hoặc người dùng đang ở app khác.
 *
 * ─── VÌ SAO PHẢI LÀ CỬA SỔ RIÊNG, KHÔNG PHẢI MỘT GÓC CỦA CỬA SỔ CHÍNH ───
 * Con robot cũ (`OdinDock`) vẽ BÊN TRONG trang, nên nó biến mất ngay khi người
 * dùng chuyển sang Chrome — đúng lúc họ cần một thứ nhắc "có tin nhắn mới".
 * Một widget nổi thật thì bắt buộc phải là cửa sổ hệ điều hành riêng.
 *
 * ─── BỐN CHI TIẾT KHÔNG ĐƯỢC LÀM SAI ───
 *
 *  1. **CỬA SỔ ÔM SÁT CON ROBOT.** Cách dễ viết hơn là một cửa sổ to trong suốt
 *     rồi vẽ robot vào góc — nhưng phần trong suốt VẪN NUỐT chuột, tức là một
 *     mảng màn hình chết mà người dùng không hiểu vì sao bấm không được. Ôm sát
 *     thì không cần trò `setIgnoreMouseEvents` nào cả.
 *  2. **`type: 'panel'` trên macOS.** Cửa sổ thường không nổi được trên app
 *     toàn màn hình, và `alwaysOnTop` một mình không đủ. Panel + mức
 *     `screen-saver` mới thật sự luôn thấy.
 *  3. **KHÔNG cướp tiêu điểm.** Bấm vào robot không được kéo cả app CuongThai
 *     lên trước — người dùng đang gõ ở app khác thì đó là cắt ngang thô bạo.
 *  4. **KHÔNG giữ app sống một mình.** Trên Windows/Linux, `window-all-closed`
 *     đếm mọi cửa sổ; nếu robot cũng tính thì đóng cửa sổ chính KHÔNG thoát app
 *     được nữa và người dùng phải giết tiến trình.
 */
import { BrowserWindow, screen, app } from 'electron';
import path from 'node:path';
import { IS_DEV, DEV_SERVER_URL, RENDERER_SOURCE, APP_ORIGIN } from './config';

/** Kích thước lúc thu gọn — vừa đúng con robot cộng một chút bóng đổ. */
const GON = { width: 150, height: 190 };

/**
 * Hệ số cỡ theo nấc người dùng chọn. Nấc 0 = 100% (mặc định), nhỏ dần.
 *
 * Cửa sổ PHẢI co theo, không chỉ co hình: `WebContentsView` trong suốt vẫn
 * chặn chuột ở phần rỗng, nên thu nhỏ mỗi con robot mà giữ cửa sổ 150×190 là
 * để lại một mảng vô hình nuốt cú bấm của người dùng vào thứ nằm dưới.
 */
const HE_SO = [1, 0.82, 0.66, 0.52] as const;
let nacCo = 0;

export function datNacCo(nac: number): void {
  nacCo = Math.max(0, Math.min(HE_SO.length - 1, Math.round(nac)));
  doiCo(coHienTai);
}

function nhan(kt: { width: number; height: number }): { width: number; height: number } {
  const h = HE_SO[nacCo] ?? 1;
  return { width: Math.round(kt.width * h), height: Math.round(kt.height * h) };
}
/** Lúc mở khung chat mini. */
const RONG = { width: 380, height: 520 };
/**
 * Cỡ khi robot đang NÓI một câu — vừa đủ cho bong bóng chữ.
 *
 * ⚠️ VÌ SAO PHẢI CÓ CỠ THỨ BA. Cửa sổ Electron CẮT mọi thứ tràn ra ngoài
 * biên nó. Bong bóng rộng 230px nằm bên trái robot, mà cửa sổ gọn chỉ 150px
 * — nên mỗi câu trả lời dài đều bị xén mất phần đầu, và người dùng thấy
 * những mẩu chữ cụt như "ux", "với", "Dev". Không có lỗi nào để thấy, chỉ
 * có chữ mất.
 *
 * Cao 250 vì bong bóng cao bao nhiêu là tuỳ câu trả lời; ngần này chứa được
 * khoảng 10 dòng, dài hơn thì bong bóng tự cuộn (xem `.rb-bong` trong CSS).
 */
const NOI = { width: 300, height: 250 };
/** Chừa mép màn hình. */
const LE = 24;

let cuaSo: BrowserWindow | null = null;
let dangRong = false;

function viTriGocDuoi(w: number, h: number): { x: number; y: number } {
  // `workArea` chứ không phải `bounds`: nó đã trừ dock/taskbar, nên robot không
  // nằm nửa dưới thanh dock.
  const { workArea } = screen.getPrimaryDisplay();
  return {
    x: Math.round(workArea.x + workArea.width - w - LE),
    y: Math.round(workArea.y + workArea.height - h - LE),
  };
}

export function robotDangMo(): boolean {
  return !!cuaSo && !cuaSo.isDestroyed();
}

export function cuaSoRobot(): BrowserWindow | null {
  return robotDangMo() ? cuaSo : null;
}

export function moRobot(): BrowserWindow {
  if (cuaSo && !cuaSo.isDestroyed()) return cuaSo;

  const { x, y } = viTriGocDuoi(GON.width, GON.height);
  cuaSo = new BrowserWindow({
    ...GON,
    x,
    y,
    frame: false,
    transparent: true,
    // `hasShadow: false` — bóng của HỆ ĐIỀU HÀNH vẽ theo hình chữ nhật cửa sổ,
    // nên với nền trong suốt nó thành một khối bóng vuông lơ lửng quanh con
    // robot tròn. Bóng thật do CSS vẽ.
    hasShadow: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    // macOS: panel mới nổi được trên app toàn màn hình.
    ...(process.platform === 'darwin' ? { type: 'panel' as const } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: IS_DEV,
    },
  });

  // 'screen-saver' là mức cao nhất còn dùng được — đủ để nổi trên cả app toàn
  // màn hình. `alwaysOnTop(true)` trần chỉ nổi trên cửa sổ thường.
  cuaSo.setAlwaysOnTop(true, 'screen-saver');
  // Theo người dùng qua mọi không gian làm việc (Spaces trên macOS). Không đặt
  // thì chuyển sang desktop khác là robot biến mất.
  cuaSo.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  /**
   * ⚠️ `RENDERER_SOURCE`, KHÔNG PHẢI `IS_DEV`.
   *
   * `IS_DEV` chỉ là `!app.isPackaged`, nên chạy bản dựng bằng
   * `electron dist/main/index.cjs` (đúng cách mọi phép kiểm chạy) sẽ khiến robot
   * đi tìm dev server không tồn tại và nạp về một trang TRẮNG — không lỗi nào,
   * không log nào, chỉ là con robot không bao giờ hiện. Cửa sổ chính dùng
   * `RENDERER_SOURCE`; robot phải dùng đúng cái đó.
   */
  const duong = RENDERER_SOURCE === 'dev'
    ? `${DEV_SERVER_URL}/robot.html`
    : `${APP_ORIGIN}/robot.html`;
  void cuaSo.loadURL(duong);

  cuaSo.on('closed', () => { cuaSo = null; dangRong = false; });

  return cuaSo;
}

/**
 * Đổi giữa thu gọn và mở rộng, GIỮ NGUYÊN góc dưới-phải.
 *
 * Phóng to từ góc trên-trái là hành vi mặc định của `setBounds`, và nó làm con
 * robot nhảy vào giữa màn hình. Neo theo góc dưới-phải thì khung chat mở ra
 * đúng chỗ mắt đang nhìn.
 */
/** Ba cỡ cửa sổ, theo việc robot đang làm. */
export type CoRobot = 'gon' | 'noi' | 'rong';

let coHienTai: CoRobot = 'gon';

export function doiCo(co: CoRobot): void {
  const w = cuaSoRobot();
  if (!w) return;
  // Đang mở khung chat thì KHÔNG thu nhỏ vì một bong bóng — người dùng đang
  // gõ dở, cửa sổ co lại giữa chừng là mất chỗ gõ.
  if (coHienTai === 'rong' && co === 'noi') return;
  coHienTai = co;
  dangRong = co === 'rong';
  // Khung chat mini KHÔNG co theo nấc: nó chứa chữ để đọc, thu nhỏ là
  // không đọc nổi. Chỉ con robot mới co.
  const kt = co === 'rong' ? RONG : nhan(co === 'noi' ? NOI : GON);
  const cu = w.getBounds();
  // Neo theo góc DƯỚI-PHẢI: robot đứng ở đó, và phình sang trái/lên trên thì
  // nó không nhảy chỗ dưới mắt người dùng.
  w.setBounds({
    x: cu.x + cu.width - kt.width,
    y: cu.y + cu.height - kt.height,
    ...kt,
  });
}

export function doiKichThuoc(rong: boolean): void {
  const w = cuaSoRobot();
  if (!w) return;
  dangRong = rong;
  coHienTai = rong ? 'rong' : 'gon';
  const kt = rong ? RONG : GON;
  const cu = w.getBounds();
  w.setBounds({
    x: cu.x + cu.width - kt.width,
    y: cu.y + cu.height - kt.height,
    ...kt,
  });
}

/**
 * ============================================================
 * KÉO CỬA SỔ ROBOT BẰNG JS, KHÔNG BẰNG `-webkit-app-region`
 * ============================================================
 *
 * Bản trước mở khoá kéo bằng cách đặt `-webkit-app-region: drag` lên thân
 * robot. Nó kéo được thật, nhưng đổi lại MẤT LỐI RA: thuộc tính đó nuốt sạch
 * sự kiện chuột của phần tử, nên sau khi mở khoá thì `onClick` không còn bắn
 * nữa và ba cú bấm để KHOÁ LẠI không bao giờ tới nơi. Người dùng mở khoá xong
 * là kẹt luôn ở chế độ kéo.
 *
 * Kéo bằng `setBounds` giữ được cả hai: chuột vẫn là chuột, và cửa sổ vẫn dời.
 *
 * ⚠️ CHỐT GỐC Ở MAIN, KHÔNG Ở RENDERER. Renderer chỉ gửi ĐỘ LỆCH so với chỗ
 * bấm xuống. Nếu renderer tự cộng dồn rồi gửi vị trí tuyệt đối thì mỗi lần
 * `setBounds` chạy, con trỏ trong cửa sổ vừa dời lại sinh một `pointermove`
 * mới — cửa sổ tự đẩy chính nó và trượt đi mất.
 */
let gocKeo: { x: number; y: number } | null = null;

export function keoBatDau(): void {
  const w = cuaSoRobot();
  if (!w) return;
  const b = w.getBounds();
  gocKeo = { x: b.x, y: b.y };
}

export function keoToi(dx: number, dy: number): void {
  const w = cuaSoRobot();
  const g = gocKeo;
  if (!w || !g) return;
  // Chỉ đổi x/y. Đưa cả width/height vào là ép cửa sổ vẽ lại toàn bộ mỗi
  // khung hình khi kéo, và trên máy chậm nó giật.
  const b = w.getBounds();
  w.setBounds({ ...b, x: Math.round(g.x + dx), y: Math.round(g.y + dy) });
}

export function keoXong(): void {
  gocKeo = null;
}

export function dangMoRong(): boolean {
  return dangRong;
}

/** Gửi một sự kiện cho robot (thông báo, nhạc đang phát…). */
export function baoRobot(kenh: string, du: unknown): void {
  const w = cuaSoRobot();
  if (w) w.webContents.send(kenh, du);
}

/**
 * Ẩn/hiện robot nổi theo việc người dùng có đang ở TRONG app hay không.
 *
 * App đã có sẵn một con robot vẽ BÊN TRONG trang (`.odin-dock`, cũng
 * `position: fixed` ở góc dưới-phải). Cửa sổ nổi cũng neo góc dưới-phải màn
 * hình, nên khi cửa sổ chính đang mở to thì hai con CHỒNG LÊN NHAU — đúng thứ
 * người dùng nhìn thấy và hỏi "sao lại có 2 con robot".
 *
 * Cách chữa không phải bỏ con nào: mỗi con phục vụ một lúc khác nhau. Dock
 * trong app có đủ mic và bảng trợ lý; con nổi chỉ để lúc người dùng đã đi chỗ
 * khác. Nên chỉ cần chúng ĐỪNG cùng xuất hiện.
 *
 * KHÔNG ẩn khi khung chat mini đang mở: người dùng vừa gõ dở trong đó mà cửa
 * sổ chính tình cờ nhận tiêu điểm thì khung biến mất giữa câu.
 */
export function robotTheoTieuDiem(dangOTrongApp: boolean): void {
  const w = cuaSoRobot();
  if (!w) return;
  if (dangOTrongApp && !dangRong) {
    if (w.isVisible()) w.hide();
  } else if (!w.isVisible()) {
    // `showInactive`: hiện lại KHÔNG cướp tiêu điểm. `show()` sẽ kéo app
    // CuongThai lên trước mặt người đang gõ ở app khác.
    w.showInactive();
  }
}

export function dongRobot(): void {
  if (cuaSo && !cuaSo.isDestroyed()) cuaSo.destroy();
  cuaSo = null;
  dangRong = false;
}

/**
 * Cửa sổ CHÍNH (không phải robot).
 *
 * Dùng ở hai chỗ quan trọng: `window-all-closed` phải bỏ qua robot, và
 * `activate` trên macOS phải mở lại cửa sổ chính chứ không được nghĩ là đã có
 * cửa sổ rồi chỉ vì robot đang mở.
 */
export function cuaSoChinh(): BrowserWindow | null {
  const r = cuaSoRobot();
  return BrowserWindow.getAllWindows().find((w) => w !== r && !w.isDestroyed()) ?? null;
}

/** Đưa cửa sổ chính ra trước và điều hướng tới một trang. */
export function moTrangChinh(duongDan: string, query = ''): void {
  const w = cuaSoChinh();
  if (!w) {
    // Cửa sổ chính đã đóng (macOS) ⇒ mở lại. Import động để tránh vòng phụ thuộc.
    void import('./window').then(({ createMainWindow }) => {
      const moi = createMainWindow();
      moi.webContents.once('did-finish-load', () => {
        moi.webContents.send('app:navigate', { path: duongDan, query });
      });
    });
    return;
  }
  if (w.isMinimized()) w.restore();
  w.show();
  w.focus();
  app.focus({ steal: true });
  w.webContents.send('app:navigate', { path: duongDan, query });
}
