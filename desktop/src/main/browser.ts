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
import { BrowserWindow, WebContentsView, shell } from 'electron';

const PHAN_VUNG = 'persist:browser-ngoai';

let khung: WebContentsView | null = null;
let cuaSoChu: BrowserWindow | null = null;
let vungHienTai = { x: 0, y: 0, width: 0, height: 0 };
let dangHien = false;

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

/** Hiện trình duyệt ở một vùng của cửa sổ. Tạo mới nếu chưa có. */
export function mo(cuaSo: BrowserWindow, vung: typeof vungHienTai, url?: string): void {
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
  if (sach) void khung.webContents.loadURL(sach);
  batTrangThai();
}

export function datVung(vung: typeof vungHienTai): void {
  vungHienTai = vung;
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
export function an(): void {
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
export function huy(): void {
  an();
  khung?.webContents.close();
  khung = null;
  cuaSoChu = null;
}
