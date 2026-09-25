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
import { kep, doiCoGiuGoc, vungChoDiem, hutMep, nenHienRobot, type Vung } from './robotViTri';
import { getSettings, setSetting } from './store';

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
  // Truyền lại số đo gần nhất: không có nó thì `coNoi()` lấy trần, và đổi nấc
  // giữa lúc robot đang nói sẽ làm cửa sổ giật phình ra rồi co lại.
  doiCo(coHienTai, bongCuoi ?? undefined);
}

function nhan(kt: { width: number; height: number }): { width: number; height: number } {
  const h = HE_SO[nacCo] ?? 1;
  return { width: Math.round(kt.width * h), height: Math.round(kt.height * h) };
}
/** Lúc mở khung chat mini. */
const RONG = { width: 420, height: 600 };

/**
 * Cỡ khi robot đang NÓI — tính TỪ SỐ ĐO THẬT của bong bóng, không phải hằng số.
 *
 * ⚠️ Cỡ `noi` cũ là hằng `300×250`, và nó KHÔNG chữa được gì. Nguyên nhân thật
 * nằm ở CSS: bong bóng `position: absolute` trong một khối chứa co vừa con
 * robot chỉ còn bề rộng khả dụng ÂM, nên trình duyệt lùi về từ dài nhất. Đo
 * thật 20/08/2026: bong bóng rộng **71px ở CẢ BA cỡ cửa sổ** — 150×190,
 * 300×250, 380×520 đều ra 71px. Phình cửa sổ không đụng gì tới nó.
 *
 * Nay bong bóng nằm trong dòng chảy và renderer gửi sang cỡ thật của nó, nên
 * cửa sổ ôm vừa đúng chữ. Điều đó quan trọng vì cửa sổ này TRONG SUỐT mà vẫn
 * CHẶN CHUỘT ở phần rỗng: mỗi pixel thừa là một pixel người dùng bấm vào app
 * bên dưới không ăn. Tin ngắn ("♪ Sơn Tùng M-TP") nay còn NHỎ HƠN cỡ cũ.
 *
 * Chỉ CAO là co theo nấc; BỀ RỘNG chữ thì không — người dùng thu nhỏ con
 * robot, không phải thu nhỏ chữ họ cần đọc.
 */
const BONG_RONG_TOI_DA = 300;
const BONG_CAO_TOI_DA = 240;
/** `.rb` đệm 8px mỗi bên, và cách robot 8px. Khớp với `robot.css`. */
const DEM = 16;
const KHE = 8;

function coNoi(bong?: { rong: number; cao: number }): { width: number; height: number } {
  const g = nhan(GON);
  // Không có số đo (lượt đầu, trước khi renderer kịp đo) thì lấy trần — thà
  // rộng một nhịp còn hơn cắt mất chữ rồi mới chỉnh lại.
  const rong = Math.min(bong?.rong ?? BONG_RONG_TOI_DA, BONG_RONG_TOI_DA);
  const cao = Math.min(bong?.cao ?? BONG_CAO_TOI_DA, BONG_CAO_TOI_DA);
  return {
    width: Math.max(g.width, Math.ceil(rong) + DEM),
    height: g.height + KHE + Math.ceil(cao),
  };
}
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

/**
 * Vùng làm việc của màn hình ĐANG CHỨA cửa sổ robot.
 *
 * ⚠️ KHÔNG dùng `getPrimaryDisplay()` cho việc kẹp. Người dùng kéo robot sang
 * màn ngoài rồi thu nhỏ nó, mà kẹp theo màn CHÍNH thì cửa sổ bị lôi ngược về
 * màn chính — trông y như robot tự nhảy chỗ.
 */
function vungHienTai(w: BrowserWindow): Vung {
  return screen.getDisplayMatching(w.getBounds()).workArea;
}

/** Vị trí đã lưu, nếu nó còn nằm trên một màn hình đang cắm. */
function viTriDaLuu(w: number, h: number): { x: number; y: number } | null {
  const c = getSettings();
  if (typeof c.robotX !== 'number' || typeof c.robotY !== 'number') return null;
  const cacVung = screen.getAllDisplays().map((d) => d.workArea);
  const vung = vungChoDiem({ x: c.robotX, y: c.robotY }, cacVung, screen.getPrimaryDisplay().workArea);
  const o = kep({ x: c.robotX, y: c.robotY, width: w, height: h }, vung);
  return { x: o.x, y: o.y };
}

/**
 * Ghi vị trí xuống đĩa.
 *
 * Gọi ở `keoXong`, KHÔNG gọi trong `keoToi`: `keoToi` chạy mỗi khung hình lúc
 * kéo, và `setSetting` ghi cả tệp cấu hình bằng `writeFileSync` đồng bộ ngay
 * trên tiến trình main. Ghi 120 lần mỗi giây ở đó là tự làm cửa sổ giật.
 */
function luuViTri(): void {
  const w = cuaSoRobot();
  if (!w) return;
  const b = w.getBounds();
  setSetting('robotX', b.x);
  setSetting('robotY', b.y);
}

export function robotDangMo(): boolean {
  return !!cuaSo && !cuaSo.isDestroyed();
}

export function cuaSoRobot(): BrowserWindow | null {
  return robotDangMo() ? cuaSo : null;
}

export function moRobot(): BrowserWindow {
  if (cuaSo && !cuaSo.isDestroyed()) return cuaSo;

  /* Lấy nấc cỡ từ THIẾT ĐẶT ngay, đừng đợi renderer của robot gọi `datCo`.
     Không có dòng này thì cửa sổ mở ở 100% rồi mới co lại sau vài trăm mili
     giây — và trong khoảng đó con nổi to hơn hẳn con trong app, đúng cái
     "hai con robot khác cỡ" người dùng chụp lại. */
  const nacLuu = getSettings().odinCo;
  if (typeof nacLuu === 'number') nacCo = Math.max(0, Math.min(HE_SO.length - 1, Math.round(nacLuu)));

  /* Vị trí đã lưu trước, mặc định góc dưới-phải sau. Trước bản này `moRobot`
     LUÔN lấy góc dưới-phải: đo thật 10/09/2026 — kéo robot tới (154,61), thoát
     app, mở lại thì nó về (1554,841). Người dùng đặt robot ở đâu cũng vô nghĩa
     sau lần khởi động kế tiếp. */
  const kt = nhan(GON);
  const { x, y } = viTriDaLuu(kt.width, kt.height) ?? viTriGocDuoi(kt.width, kt.height);
  cuaSo = new BrowserWindow({
    ...GON,
    ...kt,
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
    /**
     * ⚠️⚠️ DỰNG TRONG TRẠNG THÁI ẨN, rồi mới `showInactive()`.
     *
     * Không có dòng này thì `BrowserWindow` tự hiện VÀ TỰ LẤY TIÊU ĐIỂM ngay
     * khi dựng — và đó là gốc của lỗi "vào app thấy HAI con robot".
     *
     * Cơ chế ẩn con robot nổi dựa vào `dangOTrongApp()`, tức "có cửa sổ nào
     * KHÁC robot đang giữ tiêu điểm không". Lúc khởi động, cửa sổ robot cướp
     * tiêu điểm nên câu trả lời là KHÔNG, robot nổi ở lại — trong khi người
     * dùng đang nhìn thẳng vào app và đã thấy con robot trong app.
     *
     * Đo thật 16/09/2026, ba mốc:
     *   ① vừa khởi động   robot.html HIỆN và CÓ tiêu điểm · index.html không
     *   ② app mất tiêu điểm  robot vẫn hiện (đúng)
     *   ③ app có tiêu điểm   robot ẩn ✓ (cơ chế vốn chạy đúng)
     * Tức máy móc không sai; chỉ mốc ① không bao giờ xảy ra như thiết kế.
     *
     * `showInactive()` là thứ cả tệp này đã dùng ở chỗ khác vì đúng lý do ấy.
     */
    show: false,
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

  /* Hiện KHÔNG lấy tiêu điểm, và chỉ sau khi vẽ xong — hiện sớm là một ô
     trong suốt nhấp nháy ở góc màn hình. Xem chú thích `show: false` trên. */
  cuaSo.once('ready-to-show', () => {
    /* ⚠️ `!dangAn` là bắt buộc, không phải phòng xa. Cửa sổ có thể vừa được
       dựng ĐÚNG LÚC app đang ở trước mặt (người dùng bật lại robot từ Cài
       đặt) — khi ấy `dongBoRobotNoi()` đã gọi `robotTheoTieuDiem()` và quyết
       định là PHẢI ẨN, nhưng quyết định đó xảy ra TRƯỚC khi trang vẽ xong.
       Thiếu chốt này thì `showInactive()` lật ngược nó, và người dùng lại
       thấy hai con robot — đúng lỗi vừa sửa, tới bằng một cửa khác. */
    if (cuaSo && !cuaSo.isDestroyed() && !dangAn) cuaSo.showInactive();
  });

  cuaSo.on('closed', () => { cuaSo = null; dangRong = false; dangAn = false; });

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
/** Số đo bong bóng gần nhất, để `datNacCo` đổi nấc mà không phình cửa sổ. */
let bongCuoi: { rong: number; cao: number } | null = null;

export function doiCo(co: CoRobot, bong?: { rong: number; cao: number }): void {
  const w = cuaSoRobot();
  if (!w) return;
  // Đang mở khung chat thì KHÔNG thu nhỏ vì một bong bóng — người dùng đang
  // gõ dở, cửa sổ co lại giữa chừng là mất chỗ gõ.
  if (coHienTai === 'rong' && co === 'noi') return;
  coHienTai = co;
  if (bong) bongCuoi = bong;
  dangRong = co === 'rong';
  // Khung chat mini KHÔNG co theo nấc: nó chứa chữ để đọc, thu nhỏ là
  // không đọc nổi. Chỉ con robot mới co.
  const kt = co === 'rong' ? RONG : co === 'noi' ? coNoi(bong) : nhan(GON);
  /* Neo theo góc GẦN NHẤT, không phải cứng góc dưới-phải.
     Đo thật 10/09/2026, cả hai đều hỏng ở góc trên-trái:
       • thu về nấc 52% ở (10,43) ⇒ nhảy tới (82,134) — rời khỏi góc đã chọn;
       • mở khung chat 380×520 ở (10,43) ⇒ (-220,-287), văng hẳn khỏi màn hình.
     Neo dưới-phải chỉ đúng khi robot ĐANG ở góc dưới-phải. */
  w.setBounds(doiCoGiuGoc(w.getBounds(), kt, vungHienTai(w)));
}

export function doiKichThuoc(rong: boolean): void {
  const w = cuaSoRobot();
  if (!w) return;
  dangRong = rong;
  coHienTai = rong ? 'rong' : 'gon';
  // `nhan(GON)` chứ không phải `GON`: người dùng đã chọn nấc cỡ, đóng khung
  // chat mà trả về 100% là xoá mất lựa chọn của họ.
  const kt = rong ? RONG : nhan(GON);
  /* Cùng luật neo-góc-gần-nhất với `doiCo`. ⚠️ Đây là đường RIÊNG: vá mỗi
     `doiCo` rồi đo lại vẫn thấy khung chat văng tới (-230,-297) khi robot
     đứng ở góc trên-trái — hai hàm cùng chép một phép tính neo sai. */
  w.setBounds(doiCoGiuGoc(w.getBounds(), kt, vungHienTai(w)));
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
  /* KẸP trong màn hình. Đo thật trước khi vá: `keoToi(9000,9000)` cho ra
     x=1688 trên vùng 1728 rộng — robot 150px chỉ còn 40px thò vào. macOS chặn
     hờ một phần; **Windows không chặn gì**, `x` nhận đúng -5000 và cửa sổ
     không khung + `skipTaskbar` ấy không còn đường nào lôi lại. */
  w.setBounds(kep({ ...b, x: Math.round(g.x + dx), y: Math.round(g.y + dy) }, vungHienTai(w)));
}

/** Lề khi robot dính mép — 0 thì nó trông như bị cắt mất một nửa cái bóng. */
const LE_MEP = 6;

let henHut: ReturnType<typeof setInterval> | null = null;

/**
 * Trượt cửa sổ về đích trong ~180ms.
 *
 * ⚠️ KHÔNG nhảy một phát tới đích. `setBounds` không có hoạt ảnh trên Windows
 * lẫn Linux (macOS có tham số `animate` nhưng nó chỉ chạy cho cửa sổ thường),
 * nên nhảy thẳng là robot biến mất ở chỗ này rồi hiện ra chỗ kia — mắt đọc nó
 * là "lỗi", không phải "hút vào mép". Tự nội suy từng khung là cách duy nhất
 * trông có chủ đích trên cả ba nền tảng.
 */
function truotToi(w: BrowserWindow, dich: { x: number; y: number }): void {
  if (henHut) { clearInterval(henHut); henHut = null; }
  const dau = w.getBounds();
  const dx = dich.x - dau.x;
  const dy = dich.y - dau.y;
  if (dx === 0 && dy === 0) return;
  const KHUNG = 12;
  let i = 0;
  henHut = setInterval(() => {
    i += 1;
    const w2 = cuaSoRobot();
    if (!w2) { if (henHut) clearInterval(henHut); henHut = null; return; }
    // easeOutCubic: nhanh lúc đầu, êm lúc chạm mép.
    const t = 1 - Math.pow(1 - i / KHUNG, 3);
    const b = w2.getBounds();
    w2.setBounds({ ...b, x: Math.round(dau.x + dx * t), y: Math.round(dau.y + dy * t) });
    if (i >= KHUNG) {
      if (henHut) clearInterval(henHut);
      henHut = null;
      luuViTri();
    }
  }, 15);
}

/** Nấc cỡ đang dùng — menu chuột phải cần biết để chấm dấu đúng mục. */
export function nacCoHienTai(): number { return nacCo; }

/** Hút lại vào mép ngay, không cần kéo — dùng sau khi đổi cỡ từ menu. */
export function hutLaiVaoMep(): void {
  const w = cuaSoRobot();
  if (!w || getSettings().robotBamMep === false) return;
  truotToi(w, hutMep(w.getBounds(), vungHienTai(w), LE_MEP));
}

export function keoXong(): void {
  gocKeo = null;
  const w = cuaSoRobot();
  if (!w) return;
  /* HÚT VÀO MÉP kiểu bong bóng chat. Tắt được bằng `robotBamMep: false` —
     có người muốn đặt robot đúng một chỗ giữa màn hình, và ép hút là cướp mất
     lựa chọn đó. Mặc định BẬT: mép là chỗ ít che nội dung nhất. */
  if (getSettings().robotBamMep === false) { luuViTri(); return; }
  const dich = hutMep(w.getBounds(), vungHienTai(w), LE_MEP);
  truotToi(w, dich);
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
/**
 * Ta TỰ NHỚ đang ẩn hay hiện, không hỏi `isVisible()`.
 *
 * ⚠️ Người dùng Windows báo 10/09/2026: hai con robot cùng hiện trong lúc họ
 * đang gõ TRONG app. Trên macOS luật này chạy đúng (đo thật: có tiêu điểm ⇒
 * ẩn, mất tiêu điểm ⇒ hiện, lấy lại ⇒ ẩn), nên chỗ hỏng nằm ở phần phụ thuộc
 * nền tảng — và `isVisible()` của một cửa sổ `alwaysOnTop` + `skipTaskbar`
 * vừa `showInactive()` là đúng loại câu hỏi mỗi hệ trả lời một kiểu.
 *
 * Bỏ hẳn nó đi: `hide()` trên cửa sổ đã ẩn là không làm gì, `showInactive()`
 * trên cửa sổ đã hiện cũng thế. Cái `if` ấy không tiết kiệm được gì mà lại
 * thêm một cách hỏng.
 */
let dangAn = false;

export function robotTheoTieuDiem(dangOTrongApp: boolean): void {
  const w = cuaSoRobot();
  if (!w) return;
  const nenAn = dangOTrongApp && !dangRong;
  if (nenAn === dangAn) return;
  dangAn = nenAn;
  // `showInactive`: hiện lại KHÔNG cướp tiêu điểm. `show()` sẽ kéo app
  // CuongThai lên trước mặt người đang gõ ở app khác.
  if (nenAn) w.hide(); else w.showInactive();
}

/**
 * Mở hay đóng cửa sổ robot nổi theo thiết đặt `robotEnabled`.
 *
 * ⚠️ 14/09/2026 — người dùng tắt công tắc "Trợ lý Odin" trong Cài đặt mà con
 * robot NỔI vẫn hiện. Lý do: `robotEnabled` chỉ được con robot TRONG APP đọc
 * (`OdinDock`), còn cửa sổ nổi thì `index.ts` gọi `moRobot()` VÔ ĐIỀU KIỆN lúc
 * khởi động và không ai bảo nó ẩn. Hai con robot, một công tắc, mà chỉ một con
 * nghe.
 *
 * Gọi hàm này ở hai chỗ: lúc khởi động, và mỗi khi `robotEnabled` đổi.
 */
export function dongBoRobotNoi(): void {
  if (nenHienRobot(getSettings())) {
    if (!robotDangMo()) {
      moRobot();
      /* ⚠️ Áp luật MỘT-CON-ROBOT NGAY, đừng đợi sự kiện tiêu điểm kế tiếp.
         Bật lại robot từ Cài đặt là lúc cửa sổ chính ĐANG có tiêu điểm, nên
         sẽ chẳng có `browser-window-focus` nào bắn ra nữa — con nổi hiện lên
         cạnh con trong app và ngồi đó cho tới khi người dùng bấm sang app
         khác rồi bấm về. Đo thật 16/09/2026: đúng như vậy. */
      robotTheoTieuDiem(dangOTrongApp());
    }
  } else if (robotDangMo()) {
    dongRobot();
  }
}

/**
 * Có cửa sổ nào của app (KHÔNG tính con robot) đang giữ tiêu điểm không?
 *
 * Tính lại từ trạng thái thật của mọi cửa sổ mỗi lần hỏi, không giữ cờ: cửa sổ
 * chính có thể bị đóng rồi dựng lại (macOS), và một cờ nhớ sẵn sẽ mô tả cửa sổ
 * đã chết.
 */
export function dangOTrongApp(): boolean {
  return BrowserWindow.getAllWindows().some(
    (w) => !w.isDestroyed()
      && !w.webContents.getURL().endsWith('/robot.html')
      && w.isFocused(),
  );
}

export function dongRobot(): void {
  if (cuaSo && !cuaSo.isDestroyed()) cuaSo.destroy();
  cuaSo = null;
  dangRong = false;
}

/**
 * ============================================================
 * MỘT CÔNG TẮC, BỐN CÁI NÚT
 * ============================================================
 *
 * Bật/tắt robot có BỐN lối vào, và tất cả phải đi qua đây:
 *
 *  1. công tắc "Trợ lý Odin" trong Cài đặt   → `settings:set`
 *  2. mục "Tắt robot" ở menu chuột phải      → `robot:menu`
 *  3. **bốn cú bấm** lên con robot nổi       → `robot:batTat`
 *  4. **phím tắt toàn cục**                  → `phimRobot.ts`
 *
 * Mỗi lối phải làm ĐỦ BA việc, và thiếu bất cứ việc nào cũng ra một lỗi người
 * dùng đã gặp thật:
 *
 *  • **ghi thiết đặt** — thiếu thì tắt xong mở app lần sau robot quay về, và
 *    người dùng kết luận nút tắt không ăn (báo cáo 14/09/2026);
 *  • **đóng/mở cửa sổ nổi** — thiếu thì tắt ở Cài đặt mà con nổi vẫn đứng đó;
 *  • **báo cho các cửa sổ khác** — thiếu thì tắt bằng phím tắt xong, vào Cài
 *    đặt vẫn thấy ô đang tick, và con robot TRONG app vẫn ngồi đó.
 *
 * Trả về trạng thái MỚI để nơi gọi khỏi phải đọc lại thiết đặt.
 */
export function batTatRobot(bat?: boolean): boolean {
  const moi = bat ?? !nenHienRobot(getSettings());
  setSetting('robotEnabled', moi);
  baoMoiCuaSo(moi);
  dongBoRobotNoi();
  return moi;
}

/**
 * Báo công tắc vừa lật cho MỌI cửa sổ.
 *
 * Tách riêng vì `settings:set` cũng phải gọi (người dùng gạt công tắc trong
 * Cài đặt ⇒ con robot trong app ở cửa sổ đó tự biết, nhưng cửa sổ robot nổi
 * thì không, và ngược lại).
 */
export function baoMoiCuaSo(bat: boolean): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send('robot:congTac', { bat });
  }
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
