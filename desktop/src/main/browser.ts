/**
 * ============================================================
 * TRÌNH DUYỆT TRONG APP
 * ============================================================
 *
 * Để làm gì: xem trang dev server đang chạy (`localhost:3000`) ngay cạnh agent,
 * tra tài liệu, mở trang staging — mà không phải nhảy qua nhảy lại giữa app và
 * Chrome.
 *
 * ─── VÌ SAO KHÔNG DÙNG `<webview>` ───
 * `security.ts` chặn cứng `will-attach-webview`, và lớp chặn đó ĐÁNG GIỮ:
 * `<webview>` là một renderer lồng bên trong renderer của app, tức là nó đứng
 * cùng phía tin cậy với giao diện. `WebContentsView` thì do MAIN tạo và MAIN
 * giữ — renderer không với tới được nó, chỉ nhắn qua IPC.
 *
 * ─── BỐN THỨ KHÔNG ĐƯỢC PHÉP LỎNG ───
 *
 *  1. **PHIÊN RIÊNG.** `partition: 'browser-ngoai'` — cookie và bộ nhớ của
 *     trang ngoài KHÔNG dùng chung với app. Không có nó thì một trang bất kỳ
 *     đọc được cookie phiên đăng nhập của người dùng.
 *  2. **KHÔNG PRELOAD.** Không có `window.cuongthai`. Trang ngoài không được
 *     có một đường nào tới IPC — mà preload chính là đường đó.
 *  3. **CHỈ http/https.** `file:` đọc được ổ đĩa; `javascript:` chạy mã trong
 *     ngữ cảnh trang đang mở.
 *  4. **`window.open` ra TRÌNH DUYỆT HỆ THỐNG**, không mở view mới trong app.
 *     Một view mới sinh trong app là một cửa sổ không ai vẽ được khung, không
 *     ai đóng được, và người dùng không biết nó là gì.
 *
 * ─── ĐIỂM ĐAU CỐ HỮU: NÓ NỔI TRÊN DOM ───
 * `WebContentsView` KHÔNG nằm trong luồng bố cục của trang; nó là một lớp phủ
 * theo toạ độ tuyệt đối. Nghĩa là nếu quên gỡ nó khi người dùng chuyển trang,
 * nó sẽ che mất trang mới và trông y như app hỏng. Vì thế mọi đường ra đều
 * phải gọi `an()`.
 */
import { BrowserWindow, WebContentsView, session, shell } from 'electron';

import { existsSync } from 'node:fs';
import path from 'node:path';

const PHAN_VUNG = 'persist:browser-ngoai';

let khung: WebContentsView | null = null;
let cuaSoChu: BrowserWindow | null = null;
let vungHienTai = { x: 0, y: 0, width: 0, height: 0 };
let dangHien = false;
/**
 * Trang đang ở chế độ TOÀN MÀN HÌNH của HTML (người dùng bấm nút ⛶ của YouTube).
 *
 * ⚠️ KHÔNG có cờ này thì nút toàn màn hình CHẾT CÂM. `requestFullscreen()`
 * chạy bên trong `WebContentsView`, và view thì vẫn giữ nguyên khung 16:9 do
 * React đo — nên trang tưởng nó đã fullscreen và giãn trình phát ra 100vh của
 * view, còn người dùng thì "bấm mà không thấy gì xảy ra". Tệ hơn: trình phát
 * giãn rồi mà khung không giãn theo ⇒ khung hình LỆCH, thừa một dải đen.
 * Đúng hai thứ người dùng báo 20/08/2026.
 */
let toanManHinh = false;
/** Ta có tự bật fullscreen cho CỬA SỔ không — để lúc thoát trả lại đúng cũ. */
let taTuBatFullCuaSo = false;

export interface TrangThaiTrinhDuyet {
  url: string;
  tieuDe: string;
  dangTai: boolean;
  luiDuoc: boolean;
  toiDuoc: boolean;
  /** Lỗi tải gần nhất, đã dọn thành câu người đọc được. */
  loi: string | null;
}

function hopLe(url: string): string | null {
  try {
    const u = new URL(url.includes('://') ? url : `https://${url}`);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

function batTrangThai(): void {
  if (!khung || !cuaSoChu || cuaSoChu.isDestroyed()) return;
  const wc = khung.webContents;
  const tt: TrangThaiTrinhDuyet = {
    url: wc.getURL(),
    tieuDe: wc.getTitle(),
    dangTai: wc.isLoading(),
    luiDuoc: wc.navigationHistory.canGoBack(),
    toiDuoc: wc.navigationHistory.canGoForward(),
    loi: null,
  };
  cuaSoChu.webContents.send('browser:trangThai', tt);
}

function tao(): WebContentsView {
  const v = new WebContentsView({
    webPreferences: {
      partition: PHAN_VUNG,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      // KHÔNG preload. Xem điểm 2 ở đầu file.
      devTools: false,
      // Trang ngoài không được tự bật autoplay có tiếng hay chiếm con trỏ.
      autoplayPolicy: 'user-gesture-required',
    },
  });

  const wc = v.webContents;

  // `window.open` / target=_blank ⇒ ra trình duyệt hệ thống.
  wc.setWindowOpenHandler(({ url }) => {
    const sach = hopLe(url);
    if (sach) void shell.openExternal(sach);
    return { action: 'deny' };
  });

  // Điều hướng sang scheme lạ ⇒ chặn. Đây là lớp thứ hai: ô địa chỉ đã lọc,
  // nhưng trang tự đổi `location` thì không đi qua ô đó.
  wc.on('will-navigate', (e, url) => {
    if (!hopLe(url)) e.preventDefault();
  });

  /**
   * Gắn từng sự kiện MỘT, không gộp vào vòng lặp.
   *
   * Kiểu của `webContents.on` là một chồng overload, mỗi tên sự kiện một chữ ký
   * riêng. Duyệt một mảng tên rồi gọi `wc.on(su, …)` khiến TypeScript phải hợp
   * nhất cả chồng đó và nó chọn overload cuối (`'zoom-changed'`), rồi báo lỗi
   * cho mọi tên khác. Viết thẳng ra dài hơn nhưng đúng kiểu.
   */
  /*
   * NHẬT KÝ CONSOLE + LỖI MẠNG, cho agent đọc.
   *
   * Đây là thứ quyết định khi gỡ lỗi giao diện: "trang trắng" có thể là lỗi
   * JS, có thể là một request 500, và nhìn ảnh chụp thì hai cái giống hệt
   * nhau. Giữ vòng tròn 200 mục — đủ cho một lần tải trang, và không phình
   * theo thời gian nếu người dùng để trình duyệt mở cả buổi.
   */
  wc.on('console-message', (_e, muc, chu, dong, nguon) => {
    themNhatKy({
      loai: muc === 3 ? 'loi' : muc === 2 ? 'canh-bao' : 'log',
      chu: String(chu).slice(0, 2000),
      ...(nguon ? { nguon: `${nguon}:${dong}` } : {}),
    });
  });

  /* Nút ⛶ của trình phát. Chrome bắn hai sự kiện này; không nghe thì view
     đứng yên và người dùng thấy nút "không ăn". */
  wc.on('enter-html-full-screen', () => datToanManHinh(true));
  wc.on('leave-html-full-screen', () => datToanManHinh(false));

  wc.on('did-navigate', () => { nhatKy.length = 0; });

  const doi = (): void => batTrangThai();
  wc.on('did-navigate', doi);
  wc.on('did-navigate-in-page', doi);
  wc.on('did-finish-load', doi);
  wc.on('did-start-loading', doi);
  wc.on('did-stop-loading', doi);
  wc.on('page-title-updated', doi);

  wc.on('did-fail-load', (_e, ma, moTa, urlLoi, laKhungChinh) => {
    // -3 = ABORTED, xảy ra mỗi lần người dùng bấm sang trang khác giữa chừng.
    // Báo nó lên là báo một "lỗi" mà chính họ vừa gây ra một cách bình thường.
    if (!laKhungChinh || ma === -3) return;
    if (!cuaSoChu || cuaSoChu.isDestroyed()) return;
    cuaSoChu.webContents.send('browser:trangThai', {
      url: urlLoi, tieuDe: '', dangTai: false, luiDuoc: false, toiDuoc: false,
      loi: `Không mở được (${moTa || ma}). Kiểm tra địa chỉ, hoặc dev server đã chạy chưa.`,
    } satisfies TrangThaiTrinhDuyet);
  });

  return v;
}

/** Phủ kín vùng nội dung của cửa sổ chủ. */
function phuKinCuaSo(): void {
  if (!khung || !cuaSoChu || cuaSoChu.isDestroyed()) return;
  const b = cuaSoChu.getContentBounds();
  khung.setBounds({ x: 0, y: 0, width: b.width, height: b.height });
}

/**
 * Vào/ra toàn màn hình thật.
 *
 * Hai tầng, và cần cả hai: view phải phủ kín cửa sổ (nếu không thì trình phát
 * giãn mà khung không giãn), và cửa sổ phải vào fullscreen (nếu không thì
 * "toàn màn hình" chỉ to bằng cái cửa sổ đang mở).
 *
 * Chỉ trả cửa sổ về thường nếu CHÍNH TA đã bật nó: người dùng đang xem app ở
 * chế độ toàn màn hình sẵn thì thoát video không được kéo họ ra khỏi đó.
 */
function datToanManHinh(bat: boolean): void {
  if (!cuaSoChu || cuaSoChu.isDestroyed()) return;
  toanManHinh = bat;
  if (bat) {
    if (!cuaSoChu.isFullScreen() && cuaSoChu.isFullScreenable()) {
      taTuBatFullCuaSo = true;
      cuaSoChu.setFullScreen(true);
    }
    phuKinCuaSo();
  } else {
    if (taTuBatFullCuaSo) {
      taTuBatFullCuaSo = false;
      cuaSoChu.setFullScreen(false);
    }
    // Trả về đúng ô giữ chỗ mà React đang đo.
    khung?.setBounds({
      x: Math.round(vungHienTai.x),
      y: Math.round(vungHienTai.y),
      width: Math.max(0, Math.round(vungHienTai.width)),
      height: Math.max(0, Math.round(vungHienTai.height)),
    });
  }
}

/**
 * Hiện trình duyệt ở một vùng của cửa sổ. Tạo mới nếu chưa có.
 *
 * `ep` quyết định `url` là MỆNH LỆNH hay chỉ là MẶC ĐỊNH:
 *
 *  • `ep: true`  — điều hướng tới `url` cho bằng được. Đây là `web_mo` của
 *    agent và khung chia đôi: người dùng vừa bảo "mở trang này".
 *  • `ep: false` — chỉ hiện lại khung; `url` chỉ dùng khi CHƯA có trang nào.
 *
 * ⚠️ Tab "Trình duyệt" PHẢI dùng `ep: false`. 21/08/2026: nó gọi
 * `mo(vùng, 'http://localhost:3000')` mỗi lần component gắn lại, nên người
 * dùng đăng nhập FuOverflow xong, bấm sang tab Lập trình rồi quay lại là
 * trang đăng nhập bị cuốn phăng về localhost — trông y như app tự đăng xuất
 * họ. Trang không hề mất; nó bị NẠP ĐÈ.
 */
export function mo(cuaSo: BrowserWindow, vung: typeof vungHienTai, url?: string, ep = true): void {
  cuaSoChu = cuaSo;
  if (!khung) {
    khung = tao();
    cuaSo.contentView.addChildView(khung);
  } else if (!dangHien) {
    cuaSo.contentView.addChildView(khung);
  }
  dangHien = true;
  datVung(vung);
  const sach = url ? hopLe(url) : null;
  const dangCo = khung.webContents.getURL();
  const trong = !dangCo || dangCo === 'about:blank';
  if (sach && (ep || trong)) void khung.webContents.loadURL(sach);
  batTrangThai();
}

export function datVung(vung: typeof vungHienTai): void {
  vungHienTai = vung;
  /* Đang toàn màn hình thì GHI NHỚ vùng mới nhưng ĐỪNG áp dụng: ô giữ chỗ của
     React vẫn 16:9 và `ResizeObserver` của nó vẫn bắn mỗi lần kéo cửa sổ —
     áp vào là fullscreen bị bóp về 16:9 ngay khung hình kế tiếp. */
  if (toanManHinh) { phuKinCuaSo(); return; }
  // Làm tròn: `getBoundingClientRect()` trả số thực, còn `setBounds` cần số
  // nguyên. Truyền số thực vào thì Electron tự cắt và khung lệch một pixel so
  // với ô giữ chỗ — đủ để thấy một vệt nền lộ ra ở mép.
  khung?.setBounds({
    x: Math.round(vung.x),
    y: Math.round(vung.y),
    width: Math.max(0, Math.round(vung.width)),
    height: Math.max(0, Math.round(vung.height)),
  });
}

/**
 * Gỡ khỏi cửa sổ nhưng GIỮ trang đang mở.
 *
 * Gỡ chứ không huỷ: người dùng chuyển sang tab Lập trình rồi quay lại thì trang
 * vẫn còn đó, không phải tải lại từ đầu. Huỷ hẳn chỉ khi đóng app.
 */
/**
 * Tỉa gọn trang xem YouTube để nó vừa một ô 16:9 trong bài học.
 *
 * ─── Vì sao phải là TRANG XEM, không phải `/embed/` ───
 * Đo thật 20/08/2026, chụp chính lớp phủ bằng `capturePage()`:
 *   • `youtube.com/embed/<id>` nạp ở cấp cao nhất → **Error 153, Video player
 *     configuration error**. Khung nhúng chỉ chạy khi nằm TRONG một iframe của
 *     trang cha có origin thật; nạp thẳng nó là sai cách dùng.
 *   • `youtube.com/watch?v=<id>` → trình phát CHẠY, đủ nút, đúng thời lượng.
 * Trước đó tôi đã kết luận nhầm là "chạy" chỉ vì trạng thái báo `loi: null` và
 * tiêu đề "YouTube" — trang BÁO LỖI cũng là một trang YouTube nạp thành công.
 * Từ nay đo trình phát bằng ẢNH của chính lớp phủ, không bằng trạng thái nạp.
 *
 * ─── Cái giá của việc tỉa bằng CSS ───
 * Bộ chọn dưới đây bám vào tên thẻ của YouTube. Họ đổi tên thì phần tỉa mất
 * tác dụng và thanh đầu YouTube hiện lại — XẤU, nhưng video VẪN CHẠY. Đó là
 * kiểu hỏng chấp nhận được; đổi lại một ô xem sạch sẽ ở thời điểm này.
 */
const CSS_TIA_YOUTUBE = `
  /* 1. Bỏ mọi thứ quanh trình phát. */
  #masthead-container, ytd-masthead, #secondary, #secondary-inner, #comments,
  #below, #related, tp-yt-app-drawer, ytd-mini-guide-renderer, #chips-wrapper,
  ytd-merch-shelf-renderer, #donation-shelf { display: none !important; }

  /* 2. Bỏ khoảng đệm mà trang chừa cho thanh đầu vừa bị ẩn. */
  ytd-page-manager, #page-manager, ytd-watch-flexy #columns,
  #primary, #primary-inner { margin: 0 !important; padding: 0 !important; }

  /* 3. ÉP trình phát lấp đầy ô. Không có phần này thì nó chỉ chiếm ~60% chiều
        cao và phần còn lại là một mảng đen — đo bằng ảnh chụp lớp phủ. */
  ytd-watch-flexy #player, #player-container-outer, #player-container-inner,
  #player-container, #movie_player, .html5-video-container {
    height: 100vh !important;
    max-height: 100vh !important;
    min-height: 100vh !important;
    width: 100% !important;
    max-width: 100% !important;
    /* player-container-inner giữ tỉ lệ bằng padding-top — để nguyên là nó cộng
       thêm một khoảng trống bằng chiều cao khung.
       (Không dùng dấu huyền ở đây: cả khối này nằm TRONG template literal, một
       dấu huyền là cắt đứt chuỗi và hỏng cả file. Đã dẫm hai lần trong ngày.) */
    padding-top: 0 !important;
  }
  video.html5-main-video {
    height: 100% !important; width: 100% !important;
    top: 0 !important; left: 0 !important;
    object-fit: contain !important;
  }

  html, body { overflow: hidden !important; background: #000 !important; }
`;

/** Chèn CSS tỉa vào trang đang mở. Gọi sau khi trang nạp xong. */
export function tiaYouTube(): void {
  const wc = khung?.webContents;
  if (!wc) return;
  if (!/youtube\.com/.test(wc.getURL())) return;
  void wc.insertCSS(CSS_TIA_YOUTUBE).catch(() => {
    /* Tỉa hỏng thì thôi — video vẫn xem được, chỉ là có thêm thanh đầu. */
  });
}

/**
 * DỪNG HẲN video: tắt tiếng ngay rồi đưa trang về trắng.
 *
 * ⚠️ `an()` CỐ Ý không huỷ trang — người dùng rời tab Trình duyệt rồi quay lại
 * thì trang phải còn nguyên. Nhưng một `WebContentsView` đã gỡ khỏi cửa sổ vẫn
 * CHẠY: video vẫn phát, và tiếng vẫn ra loa. Người dùng báo 20/08/2026: thoát
 * bài học hay chuyển bài khác mà vẫn nghe tiếng video bài cũ.
 *
 * Tắt tiếng TRƯỚC rồi mới điều hướng: `loadURL` mất vài trăm mili giây, và
 * chừng đó vẫn đủ nghe. Bỏ tắt tiếng sau khi trang đã trắng, không thì tab
 * Trình duyệt câm vĩnh viễn ở lần dùng sau.
 *
 * Đổi bài thì lời gọi này chạy TRƯỚC `mo()` của bài mới (React chạy dọn dẹp
 * của lượt cũ xong mới gắn lượt mới), và `loadURL` sau huỷ `loadURL` trước —
 * nên không có chuyện xoá trắng mất video vừa mở.
 */
export function dungVideo(): void {
  const wc = khung?.webContents;
  if (!wc) return;
  wc.setAudioMuted(true);
  void wc.loadURL('about:blank')
    .catch(() => {})
    .finally(() => wc.setAudioMuted(false));
}

export function an(): void {
  // Đóng video giữa lúc đang toàn màn hình: phải hạ cờ, không thì lần mở sau
  // `datVung` vẫn nghĩ đang fullscreen và phủ kín cửa sổ.
  if (toanManHinh) datToanManHinh(false);
  if (khung && dangHien && cuaSoChu && !cuaSoChu.isDestroyed()) {
    cuaSoChu.contentView.removeChildView(khung);
  }
  dangHien = false;
}

export function diToi(url: string): { ok: boolean; loi?: string } {
  const sach = hopLe(url);
  if (!sach) return { ok: false, loi: 'Chỉ mở được địa chỉ http:// hoặc https://' };
  if (!khung) return { ok: false, loi: 'Trình duyệt chưa mở.' };
  void khung.webContents.loadURL(sach);
  return { ok: true };
}

export function lui(): void { khung?.webContents.navigationHistory.goBack(); }
export function toi(): void { khung?.webContents.navigationHistory.goForward(); }
export function napLai(): void { khung?.webContents.reload(); }

export function moNgoai(): void {
  const u = khung?.webContents.getURL();
  const sach = u ? hopLe(u) : null;
  if (sach) void shell.openExternal(sach);
}

/** Huỷ hẳn — gọi khi đóng app. */
// ═══════════════════════════════════════════════════════════
// LÁI TRÌNH DUYỆT — cho agent dùng
// ═══════════════════════════════════════════════════════════

export interface MucNhatKy { loai: 'log' | 'canh-bao' | 'loi'; chu: string; nguon?: string }

/** Vòng tròn 200 mục. Xoá mỗi lần điều hướng — log của trang trước gây hiểu nhầm. */
const nhatKy: MucNhatKy[] = [];
function themNhatKy(m: MucNhatKy): void {
  nhatKy.push(m);
  if (nhatKy.length > 200) nhatKy.shift();
}

export function docNhatKy(): MucNhatKy[] { return [...nhatKy]; }

/** Có trình duyệt đang mở không. Agent phải biết để nói "hãy mở trang trước". */
export function dangMo(): boolean { return !!khung && !khung.webContents.isDestroyed(); }

export function urlHienTai(): string { return khung?.webContents.getURL() ?? ''; }

/**
 * Chờ trang tải xong.
 *
 * ⚠️ CÓ HẠN CHÓT. Trang có websocket hoặc polling thì `did-stop-loading`
 * không bao giờ tới, và agent sẽ treo tới khi hết giờ cả lượt. Hết hạn ở đây
 * KHÔNG phải lỗi — đọc được nội dung dở còn hơn không đọc được gì.
 */
export async function choTai(hanMs = 12_000): Promise<void> {
  const wc = khung?.webContents;
  if (!wc || !wc.isLoading()) return;
  await new Promise<void>((xong) => {
    const gio = setTimeout(() => { wc.off('did-stop-loading', tay); xong(); }, hanMs);
    const tay = (): void => { clearTimeout(gio); xong(); };
    wc.once('did-stop-loading', tay);
  });
}

/**
 * Đọc trang SAU KHI JS chạy.
 *
 * Khác hẳn `doc_web` (lấy HTML thô qua HTTP): trang Next/React trả về một
 * `<div id="__next"></div>` rỗng, nên `doc_web` thấy trang trắng trong khi
 * người dùng nhìn thấy đầy chữ.
 */
export async function docTrang(tranKyTu = 40_000): Promise<string> {
  const wc = khung?.webContents;
  if (!wc) return '';
  const chu = await wc.executeJavaScript(
    '(() => { const e = document.querySelector("main,article,#root,#__next") || document.body;'
    + ' return e ? e.innerText : ""; })()',
    true,
  ) as string;
  return typeof chu === 'string' ? chu.slice(0, tranKyTu) : '';
}

/** Ảnh chụp trang, PNG base64. */
export async function chupTrang(): Promise<string | null> {
  const wc = khung?.webContents;
  if (!wc) return null;
  const anh = await wc.capturePage();
  return anh.isEmpty() ? null : anh.toPNG().toString('base64');
}

/**
 * Bấm vào một phần tử theo bộ chọn CSS.
 *
 * Dùng bộ chọn chứ không dùng toạ độ: toạ độ đúng ở một cỡ cửa sổ và sai ở
 * cỡ khác, mà agent không thấy cửa sổ. Cuộn phần tử vào tầm nhìn trước khi
 * bấm — phần tử ngoài màn hình vẫn bấm được bằng JS, nhưng người dùng đang
 * nhìn sẽ không thấy chuyện gì vừa xảy ra.
 */
export async function bamVao(boChon: string): Promise<{ ok: boolean; loi?: string }> {
  const wc = khung?.webContents;
  if (!wc) return { ok: false, loi: 'chưa mở trình duyệt' };
  const ma = `(() => { const e = document.querySelector(${JSON.stringify(boChon)});
    if (!e) return 'khong-thay';
    e.scrollIntoView({ block: 'center' });
    e.click();
    return 'ok'; })()`;
  const kq = await wc.executeJavaScript(ma, true) as string;
  return kq === 'ok' ? { ok: true } : { ok: false, loi: `không thấy phần tử "${boChon}"` };
}

/** Gõ chữ vào một ô nhập. Bắn cả `input` lẫn `change` để React nhận được. */
export async function goChu(boChon: string, chu: string): Promise<{ ok: boolean; loi?: string }> {
  const wc = khung?.webContents;
  if (!wc) return { ok: false, loi: 'chưa mở trình duyệt' };
  const ma = `(() => { const e = document.querySelector(${JSON.stringify(boChon)});
    if (!e) return 'khong-thay';
    e.focus();
    const dat = Object.getOwnPropertyDescriptor(
      e instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value')?.set;
    if (dat) dat.call(e, ${JSON.stringify(chu)}); else e.value = ${JSON.stringify(chu)};
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return 'ok'; })()`;
  const kq = await wc.executeJavaScript(ma, true) as string;
  return kq === 'ok' ? { ok: true } : { ok: false, loi: `không thấy ô nhập "${boChon}"` };
}

// ═══════════════════════════════════════════════════════════
// LIỆT KÊ LIÊN KẾT
// ═══════════════════════════════════════════════════════════

export interface LienKet { href: string; chu: string }

/**
 * Mọi liên kết trên trang đang mở.
 *
 * ─── VÌ SAO KHÔNG ĐỂ AGENT TỰ ĐOÁN LINK TỪ `web_doc` ───
 * `web_doc` trả về CHỮ, mà chữ thì không mang theo `href`. Một trang tài liệu
 * có 40 file đính kèm hiện ra thành 40 dòng tên file — agent đọc xong vẫn
 * không có địa chỉ nào để tải, nên nó sẽ dựng URL theo suy đoán. Suy đoán sai
 * thì server trả về một trang HTML báo lỗi, `web_tai` lưu đúng trang đó thành
 * một file `.pdf` hỏng, và không tầng nào kêu lên.
 *
 * Lấy thẳng `a.href` (thuộc tính DOM, đã được trình duyệt giải tuyệt đối) là
 * cách duy nhất chắc chắn đúng.
 */
export async function lietKeLienKet(): Promise<LienKet[]> {
  const wc = khung?.webContents;
  if (!wc) return [];
  /* ⚠️ `\\s` PHẢI nhân đôi. Đây là template literal của TypeScript, và trong
     chuỗi thì `\\s` rụng mất dấu chéo — mã chạy trên trang sẽ nhận `/s+/g`,
     tức là thay mọi chữ "s" bằng dấu cách. Build xanh, kiểu xanh, chỉ có chữ
     hiển thị của link là sai. ESLint bắt được cái này (`no-useless-escape`). */
  const ma = `(() => {
    const ra = [];
    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.href;
      if (typeof h !== 'string' || !/^https?:/i.test(h)) continue;
      const chu = (a.innerText || a.getAttribute('title') || a.getAttribute('aria-label') || '')
        .replace(/\\s+/g, ' ').trim().slice(0, 140);
      ra.push({ href: h, chu });
    }
    return ra;
  })()`;
  const tho = await wc.executeJavaScript(ma, true) as unknown;
  if (!Array.isArray(tho)) return [];

  // Gộp trùng: một trang forum hay lặp cùng một link ở đầu bài, cuối bài và
  // trong khối "tệp đính kèm". Giữ bản có CHỮ dài hơn — nó mô tả rõ hơn.
  const theoHref = new Map<string, LienKet>();
  for (const m of tho as LienKet[]) {
    if (!m || typeof m.href !== 'string') continue;
    const cu = theoHref.get(m.href);
    if (!cu || (m.chu?.length ?? 0) > cu.chu.length) {
      theoHref.set(m.href, { href: m.href, chu: String(m.chu ?? '') });
    }
    if (theoHref.size >= 600) break;
  }
  return [...theoHref.values()];
}

// ═══════════════════════════════════════════════════════════
// TẢI FILE — qua ĐÚNG phiên của trình duyệt trong app
// ═══════════════════════════════════════════════════════════

/**
 * ─── VÌ SAO PHẢI LÀ `session.downloadURL`, KHÔNG PHẢI `fetch`/`curl` ───
 * Cookie đăng nhập nằm trong phân vùng `persist:browser-ngoai` của view này.
 * Một `fetch` ở main hay một `curl` qua `run_command` đi ra bằng phiên KHÁC,
 * không có cookie đó — server trả về trang "vui lòng đăng nhập" với mã 200, và
 * ta lưu nguyên trang ấy thành file. Hỏng CÂM: đúng tên, đúng đuôi, sai ruột.
 * `downloadURL` trên chính session này thì mang theo cookie như người dùng tự
 * bấm.
 *
 * ─── VÌ SAO PHẢI `setSavePath` ───
 * Không đặt thì Electron bật hộp thoại lưu file của hệ điều hành. Agent không
 * với tới hộp thoại đó, nên lượt sẽ treo tới lúc hết giờ, còn người dùng thì
 * thấy một cửa sổ bật lên không rõ của ai.
 */
export interface KetQuaTai { ok: boolean; duongDan?: string; byte?: number; loi?: string }

/** Trần một file. Đủ cho video bài giảng, chặn được việc tải nhầm cả ổ đĩa. */
const TRAN_BYTE_TAI = 300 * 1024 * 1024;
/** Hạn cho MỘT file đang chảy. Mạng trường học chậm, nên rộng tay. */
const HET_GIO_TAI_MS = 180_000;
/**
 * Hạn chờ `will-download` BẮN.
 *
 * Đây là cái bẫy hay gặp nhất: đưa vào một URL là TRANG chứ không phải file
 * thì trình duyệt điều hướng bình thường và không có sự kiện tải nào cả. Thiếu
 * hạn này thì lời hứa treo vĩnh viễn và cả lượt agent chết theo — im lặng.
 */
const HET_GIO_BAN_MS = 20_000;

interface ChoTai {
  url: string;
  thuMuc: string;
  tenGoiY: string | undefined;
  xong: (kq: KetQuaTai) => void;
}

let choTaiHienTai: ChoTai | null = null;
let daGanBatTai = false;

/**
 * Tên file an toàn để ghi xuống đĩa.
 *
 * Nguồn của cái tên này là `Content-Disposition` của server hoặc `href` — tức
 * là CHỮ CỦA NGƯỜI KHÁC. `../../.ssh/authorized_keys` là một tên file hợp lệ
 * với server và là một thảm hoạ với ta, nên mọi dấu tách thư mục bị ĐỔI thành
 * gạch ngang chứ không phải bị bỏ (bỏ thì `..%2f..` gộp lại vẫn thành `....`).
 */
export function tenSach(tho: string): string {
  let t = String(tho ?? '')
    // Ký tự điều khiển: chúng vô hình trong tên file và làm hỏng mọi thứ đọc nó sau này.
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[/\\]/g, '-')
    .replace(/[<>:"|?*]/g, '-')
    .replace(/^[.\s]+/, '')
    .trim();
  if (!t) t = 'tai-ve.bin';
  if (t.length > 120) {
    const duoi = path.extname(t).slice(0, 12);
    t = t.slice(0, 120 - duoi.length) + duoi;
  }
  return t;
}

/** Tên rút từ URL khi server không nói tên. */
function tenTuUrl(url: string): string {
  try {
    const cuoi = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() ?? '');
    return cuoi || 'tai-ve.bin';
  } catch {
    return 'tai-ve.bin';
  }
}

/**
 * Đường dẫn chưa bị chiếm.
 *
 * KHÔNG ghi đè. Tải lại một file đã có thường là agent đang đi lặp vòng, và
 * ghi đè thì bản tốt của người dùng biến mất không dấu vết.
 */
export function duongDanChuaCo(dich: string): string {
  if (!existsSync(dich)) return dich;
  const thuMuc = path.dirname(dich);
  const duoi = path.extname(dich);
  const than = path.basename(dich, duoi);
  for (let i = 2; i < 500; i += 1) {
    const thu = path.join(thuMuc, `${than} (${i})${duoi}`);
    if (!existsSync(thu)) return thu;
  }
  return path.join(thuMuc, `${than}-${Date.now()}${duoi}`);
}

function ganBatTai(): void {
  if (daGanBatTai) return;
  daGanBatTai = true;
  session.fromPartition(PHAN_VUNG).on('will-download', (_e, muc) => {
    const cho = choTaiHienTai;
    /* KHÔNG phải ta gọi ⇒ để nguyên hành vi mặc định (hộp thoại lưu của hệ
       điều hành). Người dùng tự bấm nút tải trên trang là việc của họ; agent
       không được lặng lẽ ghi hộ vào một thư mục họ không chọn. */
    if (!cho) return;
    choTaiHienTai = null;

    const ten = tenSach(cho.tenGoiY || muc.getFilename() || tenTuUrl(muc.getURL()));
    const dich = duongDanChuaCo(path.join(cho.thuMuc, ten));
    muc.setSavePath(dich);

    const tong = muc.getTotalBytes();
    if (tong > TRAN_BYTE_TAI) {
      muc.cancel();
      cho.xong({
        ok: false,
        loi: `file ${(tong / 1048576).toFixed(1)}MB vượt trần ${TRAN_BYTE_TAI / 1048576}MB`,
      });
      return;
    }

    const gio = setTimeout(() => {
      try { muc.cancel(); } catch { /* đã xong trước đó */ }
    }, HET_GIO_TAI_MS);

    /* Server không khai `Content-Length` thì `getTotalBytes()` là 0 và lớp
       chặn ở trên vô hiệu — nên phải canh cả lúc đang chảy. */
    muc.on('updated', () => {
      if (muc.getReceivedBytes() > TRAN_BYTE_TAI) muc.cancel();
    });

    muc.once('done', (_ev, trangThai) => {
      clearTimeout(gio);
      if (trangThai === 'completed') {
        cho.xong({ ok: true, duongDan: dich, byte: muc.getReceivedBytes() });
      } else {
        cho.xong({
          ok: false,
          loi: trangThai === 'cancelled' ? 'bị huỷ (vượt trần dung lượng hoặc quá lâu)' : 'tải gián đoạn',
        });
      }
    });
  });
}

export async function taiFile(url: string, thuMuc: string, tenGoiY?: string): Promise<KetQuaTai> {
  const wc = khung?.webContents;
  if (!wc) return { ok: false, loi: 'chưa mở trình duyệt — gọi `web_mo` trước' };
  const sach = hopLe(url);
  if (!sach) return { ok: false, loi: 'chỉ tải được địa chỉ http:// hoặc https://' };
  /* Một file một lúc. `will-download` không nói được nó thuộc lời gọi nào, nên
     hai lời gọi chồng nhau là hai kết quả tráo chỗ cho nhau — mà tráo xong thì
     nhìn đâu cũng thấy "đã tải xong". */
  if (choTaiHienTai) return { ok: false, loi: 'đang tải một file khác, chờ nó xong rồi gọi lại' };
  ganBatTai();

  return await new Promise<KetQuaTai>((traLoi) => {
    let daXong = false;
    let gioBan: NodeJS.Timeout | null = null;
    const ketThuc = (kq: KetQuaTai): void => {
      if (daXong) return;
      daXong = true;
      if (gioBan) clearTimeout(gioBan);
      if (choTaiHienTai?.xong === ketThuc) choTaiHienTai = null;
      traLoi(kq);
    };
    gioBan = setTimeout(() => ketThuc({
      ok: false,
      loi:
        'máy chủ không trả về file nào để tải (chờ 20 giây). Địa chỉ này nhiều khả năng là một '
        + 'TRANG chứ không phải file: hãy `web_mo` nó rồi `web_lien_ket` để lấy đúng link tải.',
    }), HET_GIO_BAN_MS);
    choTaiHienTai = { url: sach, thuMuc, tenGoiY, xong: ketThuc };
    wc.session.downloadURL(sach);
  });
}

export function huy(): void {
  an();
  khung?.webContents.close();
  khung = null;
  cuaSoChu = null;
}
