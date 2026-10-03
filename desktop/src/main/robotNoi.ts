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
import {
  hutMep, nenHienRobot, type Vung, type Co, type Diem, type ManHinh, type BoCuc, type HopTrongCuaSo,
  coHop, phanTramTuThietDat, chuanPhanTram, vungDung, manHinhChoDiem, neoKhiKeo, doiCoGiuNeo,
  tinhBoCuc, hopTheoCuaSo, taoViTriLuu, docViTriLuu, viTriKhoiDong, viTriMacDinh, kep,
} from './robotViTri';
import { getSettings, setSetting } from './store';

/*
 * ════════════════════════════════════════════════════════════════════
 * VỊ TRÍ + CỠ — xem chú thích dài "BẢN 03/10/2026" trong `robotViTri.ts`
 * ════════════════════════════════════════════════════════════════════
 *
 * Main giữ ĐÚNG HAI con số quyết định chỗ đứng của robot:
 *   • `neo` — góc trái-trên của HỘP robot trên màn hình (toạ độ DIP);
 *   • `pt`  — cỡ % (20–100, bước 5).
 * Cửa sổ là hệ quả: `tinhBoCuc(neo, coHop(pt), nội dung, vùng)`. Bong bóng,
 * bảng chỉnh hay khung chat chỉ làm cửa sổ phình quanh neo — neo không đổi.
 * Neo chỉ đổi khi NGƯỜI DÙNG kéo, đổi cỡ, bấm "về góc mặc định", hoặc khi màn
 * hình chứa nó biến mất.
 */

/** Khung chat mini ở 100%: rộng 400, cao nội dung 520 (thêm hộp robot ở dưới). */
const CO_KHUNG_CHAT: Co = { width: 400, height: 520 };

let pt = 100;
let neo: Diem | null = null;
/** Nội dung đang bày cạnh robot, để đổi cỡ / đổi màn hình dựng lại được. */
let noiDung: { loai: LoaiNoiDung; co: Co } | null = null;
/** Phía nội dung đang mở — giữ lại khi kéo khung chat để không lật bố cục. */
let phia: { phai: boolean; tren: boolean } | undefined;

export type LoaiNoiDung = 'bong' | 'bang' | 'chat';

function nenTang(): string { return process.platform; }

/**
 * Wayland THUẦN (không qua XWayland): compositor KHÔNG cho app tự đặt vị trí
 * cửa sổ, và không cho đọc toạ độ con trỏ toàn màn hình. `setBounds` chỉ đổi
 * được cỡ. Electron 33 mặc định chạy X11/XWayland — nhánh này chỉ bật khi
 * người dùng tự ép `--ozone-platform=wayland` (hoặc hint `auto` trên phiên
 * Wayland).
 */
export function laWaylandThuan(): boolean {
  if (process.platform !== 'linux') return false;
  const cong = app.commandLine?.getSwitchValue?.('ozone-platform') ?? '';
  if (cong === 'wayland') return true;
  if (cong === 'x11') return false;
  const goiY = `${app.commandLine?.getSwitchValue?.('ozone-platform-hint') ?? ''} ${process.env.ELECTRON_OZONE_PLATFORM_HINT ?? ''}`;
  return /wayland|auto/.test(goiY) && process.env.XDG_SESSION_TYPE === 'wayland';
}

export function thongTinNenTang(): { heDieuHanh: string; waylandThuan: boolean; xWayland: boolean } {
  const wl = laWaylandThuan();
  return {
    heDieuHanh: process.platform,
    waylandThuan: wl,
    xWayland: process.platform === 'linux' && !wl && process.env.XDG_SESSION_TYPE === 'wayland',
  };
}

function cacManHinh(): ManHinh[] {
  return screen.getAllDisplays().map((d, i) => ({
    id: typeof d.id === 'number' ? d.id : i,
    bounds: d.bounds ?? d.workArea,
    workArea: d.workArea,
    scaleFactor: d.scaleFactor,
  }));
}

function manHinhChinh(): ManHinh {
  const d = screen.getPrimaryDisplay();
  return { id: typeof d.id === 'number' ? d.id : 0, bounds: d.bounds ?? d.workArea, workArea: d.workArea };
}

function hop(): Co { return coHop(pt); }

/** Màn hình đang chứa TÂM hộp robot. */
function manHinhCuaNeo(n: Diem): ManHinh {
  const h = hop();
  return manHinhChoDiem({ x: n.x + h.width / 2, y: n.y + h.height / 2 }, cacManHinh()) ?? manHinhChinh();
}

function neoHienTai(): Diem {
  if (!neo) neo = viTriKhoiDong(docViTriLuu(getSettings()), hop(), cacManHinh(), nenTang()) ?? viTriMacDinh(hop(), manHinhChinh());
  return neo;
}

/**
 * Ghi vị trí xuống đĩa — CHỈ sau thao tác của người dùng (thả tay, đổi cỡ,
 * về mặc định). Không bao giờ ghi khi màn hình tự đổi: rút màn ngoài ra rồi cắm
 * lại thì robot phải về đúng chỗ cũ trên màn ngoài.
 */
function luuViTri(): void {
  const n = neoHienTai();
  const m = manHinhCuaNeo(n);
  setSetting('robotViTri', JSON.stringify(taoViTriLuu(n, hop(), m, nenTang())));
  setSetting('robotX', n.x);
  setSetting('robotY', n.y);
}

/**
 * `setBounds` rồi KIỂM cỡ. Windows với hai màn khác tỉ lệ (100% / 150%) đổi cỡ
 * cửa sổ khi nó vượt ranh giới màn hình — `setBounds` trả về một cửa sổ to/nhỏ
 * hơn yêu cầu. Đặt lại cỡ ngay thì robot không phình xẹp khi kéo qua màn.
 */
function datKhung(w: BrowserWindow, r: Vung): void {
  w.setBounds(r);
  const b = w.getBounds();
  if (b.width !== r.width || b.height !== r.height) w.setSize(r.width, r.height);
}

let cuaSo: BrowserWindow | null = null;
let dangRong = false;

export function robotDangMo(): boolean {
  return !!cuaSo && !cuaSo.isDestroyed();
}

export function cuaSoRobot(): BrowserWindow | null {
  return robotDangMo() ? cuaSo : null;
}

let ngheManHinh = false;

/**
 * Màn hình đổi (cắm/rút, đổi độ phân giải, đổi tỉ lệ) ⇒ dựng lại neo TỪ VỊ TRÍ
 * ĐÃ LƯU, không từ toạ độ đang có — toạ độ đang có có thể đã bị hệ điều hành
 * đẩy đi. Không ghi đè vị trí đã lưu.
 */
function batNgheManHinh(): void {
  if (ngheManHinh || typeof screen.on !== 'function') return;
  ngheManHinh = true;
  const dungLai = (): void => {
    if (!robotDangMo() || gocKeo) return;
    neo = null;
    neoHienTai();
    baoBoCucLai();
  };
  screen.on('display-added', dungLai);
  screen.on('display-removed', dungLai);
  screen.on('display-metrics-changed', dungLai);
}

/** Bảo renderer dựng lại bố cục (hai nhịp, xem `apBoCuc`). */
function baoBoCucLai(): void {
  const w = cuaSoRobot();
  if (w) w.webContents.send('robot:boCucLai', { phanTram: pt });
}

export function moRobot(): BrowserWindow {
  if (cuaSo && !cuaSo.isDestroyed()) return cuaSo;

  /* Cỡ đọc TỪ THIẾT ĐẶT ngay — không đợi renderer. Không có dòng này thì cửa
     sổ mở ở 100% rồi mới co lại sau vài trăm mili giây ("hai con khác cỡ"). */
  pt = phanTramTuThietDat(getSettings());
  neo = null;
  noiDung = null;
  phia = undefined;
  const n = neoHienTai();
  const h = hop();
  batNgheManHinh();
  cuaSo = new BrowserWindow({
    ...h,
    x: n.x,
    y: n.y,
    frame: false,
    transparent: true,
    // Bóng của HỆ ĐIỀU HÀNH vẽ theo hình chữ nhật cửa sổ — với nền trong suốt
    // nó thành một khối bóng vuông quanh con robot tròn. Bóng thật do CSS vẽ.
    hasShadow: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    /**
     * ⚠️⚠️ DỰNG TRONG TRẠNG THÁI ẨN, rồi mới `showInactive()`.
     * Không có dòng này thì cửa sổ robot tự hiện VÀ TỰ LẤY TIÊU ĐIỂM lúc dựng —
     * gốc của lỗi "vào app thấy HAI con robot" (đo thật 16/09/2026).
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

  cuaSo.setAlwaysOnTop(true, 'screen-saver');
  cuaSo.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  /* ⚠️ `RENDERER_SOURCE`, KHÔNG PHẢI `IS_DEV` — chạy bản dựng bằng `electron
     dist/main/index.cjs` mà dùng `IS_DEV` là robot nạp dev server không tồn
     tại và thành một trang TRẮNG câm. */
  const duong = RENDERER_SOURCE === 'dev'
    ? `${DEV_SERVER_URL}/robot.html`
    : `${APP_ORIGIN}/robot.html`;
  void cuaSo.loadURL(duong);

  cuaSo.once('ready-to-show', () => {
    /* `!dangAn` bắt buộc: cửa sổ có thể vừa dựng đúng lúc app đang ở trước mặt
       và `dongBoRobotNoi()` đã quyết định PHẢI ẨN. */
    if (cuaSo && !cuaSo.isDestroyed() && !dangAn) cuaSo.showInactive();
  });

  cuaSo.on('closed', () => { cuaSo = null; dangRong = false; dangAn = false; });

  return cuaSo;
}

export interface KetQuaBoCuc {
  boCuc: BoCuc;
  /** Robot theo góc của bố cục MỚI, đo trong cửa sổ HIỆN TẠI — đặt trước khi đổi cỡ. */
  hopTruoc: HopTrongCuaSo;
  phanTram: number;
}

/**
 * Tính (và tuỳ chọn ÁP) bố cục cửa sổ cho một nội dung.
 *
 * HAI NHỊP để robot không giật một khung hình nào:
 *   1. renderer gọi với `apDung: false`, nhận `hopTruoc` và đặt robot neo vào
 *      góc của bố cục mới — với khoảng cách đúng cho cửa sổ CŨ;
 *   2. renderer gọi lại với `apDung: true` ⇒ main đổi cỡ cửa sổ; robot neo ở
 *      góc không đổi nên đứng yên; renderer đặt `boCuc.hop` cuối cùng.
 */
export function apBoCuc(nd: { loai: LoaiNoiDung; co: Co } | null, apDung: boolean): KetQuaBoCuc | null {
  const w = cuaSoRobot();
  if (!w) return null;
  const n = neoHienTai();
  const h = hop();
  const m = manHinhCuaNeo(n);
  const vung = vungDung(m, nenTang());
  /* Khung chat giữ phía cũ (kéo khung đi rồi thả không lật bố cục); bong bóng
     và bảng chỉnh thì luôn mở về phía còn chỗ. */
  const giuPhia = nd?.loai === 'chat' && noiDung?.loai === 'chat' ? phia : undefined;
  const co = nd ? { width: nd.co.width, height: nd.co.height } : null;
  const bc = tinhBoCuc(n, h, co, vung, giuPhia);
  const hopTruoc = hopTheoCuaSo(n, h, w.getBounds(), bc.hop);
  if (apDung) {
    noiDung = nd;
    dangRong = nd?.loai === 'chat';
    phia = nd ? { phai: bc.hop.gocX === 'phai', tren: bc.noiDung === 'tren' } : phia;
    datKhung(w, bc.cuaSo);
  }
  return { boCuc: bc, hopTruoc, phanTram: pt };
}

/* ── API cũ, giữ cho tương thích — giờ đi qua `apBoCuc` ── */

/** Ba cỡ cửa sổ, theo việc robot đang làm. */
export type CoRobot = 'gon' | 'noi' | 'rong';

export function doiCo(co: CoRobot, bong?: { rong: number; cao: number }): void {
  if (co === 'gon') { apBoCuc(null, true); return; }
  if (co === 'rong') { apBoCuc({ loai: 'chat', co: CO_KHUNG_CHAT }, true); return; }
  // Đang mở khung chat thì KHÔNG thu nhỏ vì một bong bóng.
  if (noiDung?.loai === 'chat') return;
  apBoCuc({ loai: 'bong', co: { width: Math.min(bong?.rong ?? 300, 300) + 16, height: Math.min(bong?.cao ?? 240, 240) } }, true);
}

export function doiKichThuoc(rong: boolean): void {
  doiCo(rong ? 'rong' : 'gon');
}

export const KHUNG_CHAT = CO_KHUNG_CHAT;

/**
 * Đổi cỡ % — GIỮ chỗ người dùng đặt (xem `doiCoGiuNeo`), rồi bảo renderer
 * dựng lại. KHÔNG hút mép nữa: bản cũ gọi `hutLaiVaoMep()` sau mỗi lần đổi cỡ,
 * và đó là một trong những lần robot "tự chạy".
 */
export function datPhanTram(moi: number): number {
  const ptMoi = chuanPhanTram(moi);
  if (ptMoi === pt && neo) return pt;
  const n = neoHienTai();
  const cu = hop();
  const vung = vungDung(manHinhCuaNeo(n), nenTang());
  pt = ptMoi;
  neo = doiCoGiuNeo(n, cu, hop(), vung);
  luuViTri();
  baoBoCucLai();
  return pt;
}

/** Nấc cũ 0–3 (menu cũ / con trong app bản cũ). */
export function datNacCo(nac: number): void {
  datPhanTram([100, 80, 65, 50][Math.max(0, Math.min(3, Math.round(nac)))] ?? 100);
}

export function phanTramHienTai(): number { return pt; }

/** Về góc dưới-phải màn chính — lối thoát khi robot đứng chỗ khó với. */
export function veGocMacDinh(): void {
  neo = viTriMacDinh(hop(), manHinhChinh());
  luuViTri();
  baoBoCucLai();
}

/**
 * ============================================================
 * KÉO — main tự đọc con trỏ, renderer chỉ "gõ nhịp"
 * ============================================================
 *
 * Vì sao không cộng `screenX` của renderer như bản cũ: ở Windows hai màn khác
 * tỉ lệ, `screenX` của Chromium và toạ độ `setBounds` của Electron KHÔNG cùng
 * một hệ khi cửa sổ vượt ranh giới màn — robot nhảy một đoạn đúng lúc qua màn.
 * `screen.getCursorScreenPoint()` và `setBounds` cùng là DIP của Electron.
 *
 * Renderer gửi `keoToi` theo `requestAnimationFrame` (gộp mọi `pointermove`
 * trong một khung hình thành một lời gọi) — bản cũ gửi mỗi `pointermove`, 120
 * lời gọi IPC/giây trên chuột 120Hz, xếp hàng sau nhau ⇒ "kéo không mượt".
 *
 * Wayland thuần không có toạ độ con trỏ toàn cục ⇒ lùi về độ lệch renderer gửi.
 */
let gocKeo: {
  kieu: 'hop' | 'caKhung';
  troDau: Diem;
  /** Con trỏ − neo (kéo hộp) hoặc con trỏ − góc cửa sổ (kéo cả khung). */
  lech: Diem;
  /** Neo − góc cửa sổ, chỉ dùng khi kéo cả khung. */
  neoTrongKhung: Diem;
  co: Co;
} | null = null;

function troChuot(): Diem | null {
  if (laWaylandThuan() || typeof screen.getCursorScreenPoint !== 'function') return null;
  return screen.getCursorScreenPoint();
}

export function keoBatDau(kieu: 'hop' | 'caKhung' = 'hop'): void {
  const w = cuaSoRobot();
  if (!w) return;
  if (henHut) { clearInterval(henHut); henHut = null; }
  const n = neoHienTai();
  const b = w.getBounds();
  const p = troChuot() ?? { x: n.x, y: n.y };
  gocKeo = {
    kieu,
    troDau: p,
    lech: kieu === 'hop' ? { x: p.x - n.x, y: p.y - n.y } : { x: p.x - b.x, y: p.y - b.y },
    neoTrongKhung: { x: n.x - b.x, y: n.y - b.y },
    co: { width: b.width, height: b.height },
  };
}

export function keoToi(dx: number, dy: number): void {
  const w = cuaSoRobot();
  const g = gocKeo;
  if (!w || !g) return;
  const p = troChuot() ?? { x: g.troDau.x + dx, y: g.troDau.y + dy };
  const ds = cacManHinh();
  if (g.kieu === 'hop') {
    neo = neoKhiKeo(p, g.lech, hop(), ds, nenTang());
    datKhung(w, { ...neo, ...hop() });
    return;
  }
  /* Kéo CẢ khung chat: dời cứng cả cửa sổ, neo đi theo. Kẹp cả cửa sổ trong
     màn hình đang chứa con trỏ. */
  const m = manHinhChoDiem(p, ds) ?? manHinhChinh();
  const r = kep({ x: Math.round(p.x - g.lech.x), y: Math.round(p.y - g.lech.y), ...g.co }, vungDung(m, nenTang()));
  neo = { x: r.x + g.neoTrongKhung.x, y: r.y + g.neoTrongKhung.y };
  datKhung(w, r);
}

/** Lề khi robot dính mép — 0 thì nó trông như bị cắt mất một nửa cái bóng. */
const LE_MEP = 6;

let henHut: ReturnType<typeof setInterval> | null = null;

/**
 * Trượt hộp robot về đích trong ~180ms (chỉ dùng khi người dùng BẬT "tự dính
 * mép"). `setBounds` không có hoạt ảnh trên Windows/Linux nên tự nội suy.
 */
function truotToi(dich: Diem): void {
  if (henHut) { clearInterval(henHut); henHut = null; }
  const dau = neoHienTai();
  const dx = dich.x - dau.x;
  const dy = dich.y - dau.y;
  if (dx === 0 && dy === 0) { luuViTri(); return; }
  const KHUNG = 12;
  let i = 0;
  henHut = setInterval(() => {
    i += 1;
    const w2 = cuaSoRobot();
    if (!w2) { if (henHut) clearInterval(henHut); henHut = null; return; }
    const t = 1 - Math.pow(1 - i / KHUNG, 3);   // easeOutCubic
    neo = { x: Math.round(dau.x + dx * t), y: Math.round(dau.y + dy * t) };
    datKhung(w2, { ...neo, ...hop() });
    if (i >= KHUNG) {
      if (henHut) clearInterval(henHut);
      henHut = null;
      luuViTri();
      baoBoCucLai();
    }
  }, 15);
}

/** Người dùng có BẬT "tự dính mép" không. MẶC ĐỊNH TẮT (03/10/2026). */
export function batTuDinhMep(): boolean {
  return getSettings().robotBamMep === true;
}

/** Hút vào mép ngay — chỉ khi người dùng đã bật tuỳ chọn. */
export function hutLaiVaoMep(): void {
  const w = cuaSoRobot();
  if (!w || !batTuDinhMep()) return;
  const n = neoHienTai();
  const m = manHinhCuaNeo(n);
  const r = hutMep({ ...n, ...hop() }, m.workArea, LE_MEP);
  truotToi({ x: r.x, y: r.y });
}

export function keoXong(): void {
  const g = gocKeo;
  gocKeo = null;
  const w = cuaSoRobot();
  if (!w || !g) return;
  /* THẢ Ở ĐÂU ĐỨNG Ở ĐÓ. Hút mép chỉ khi người dùng tự bật — trước 03/10/2026
     nó mặc định BẬT và là thủ phạm chính của "tự chạy qua chỗ khác". */
  if (g.kieu === 'hop' && batTuDinhMep()) { hutLaiVaoMep(); return; }
  luuViTri();
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
