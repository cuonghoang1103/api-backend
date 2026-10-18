/**
 * Thay `desktop/src/main/browser.ts` khi AI Code chạy NGOÀI app (extension VS
 * Code "CuongMini Code", CuongMini CLI).
 *
 * App có `WebContentsView` nằm ngay cạnh khung chat. Ở đây không có cửa sổ nào
 * của ta để nhúng, nên lái một trình duyệt THẬT có sẵn trên máy (Chrome / Edge /
 * Brave / Chromium) qua `puppeteer-core` — y như "Browser connected" của Claude
 * Code: một cửa sổ hiện lên, người dùng nhìn thấy AI đang mở trang nào, bấm gì.
 *
 * ⭐ 19/10/2026 — MẶC ĐỊNH CHẠY NGẦM. Chủ app: "khi CuongMini dùng trình duyệt nó mở Google đè và thao tác lên việc
 * tôi đang làm". Nay: `headless` + viewport cố định 1280×800 (ảnh chụp ổn định), không cửa sổ, không cướp focus,
 * cùng hồ sơ riêng nên đăng nhập vẫn được nhớ. Cần người dùng THẤY / tự đăng nhập ⇒ `/browser show` (hoặc nút ở
 * VS Code, hoặc tool `trinh_duyet_hien` model gọi khi gặp trang đăng nhập/captcha) mở lại CÙNG hồ sơ ở chế độ có
 * cửa sổ; `/browser hide` quay về ngầm. Chrome khoá thư mục hồ sơ ⇒ đổi chế độ = đóng bản này, bật bản kia.
 * Cửa sổ do MODEL xin (không phải người dùng bấm) ⇒ cố KHÔNG đưa lên trước: macOS bật bằng `open -g` (không kích
 * hoạt app) rồi nối qua cổng gỡ lỗi; Windows/Linux `--start-minimized`; không `bringToFront`. Cài đặt bền:
 * `trinhDuyetCheDo: 'ngam' | 'hien'` (mặc định `ngam`; `hien` = kiểu cũ, luôn có cửa sổ).
 *
 * CÙNG export, CÙNG ngữ nghĩa với bản Electron, vì `agent/tools.ts` gọi thẳng
 * vào đây (esbuild tráo module lúc dựng — xem `esbuildLoi.mjs`). Sửa chữ ký ở
 * bản app thì phải sửa ở đây.
 *
 * ─── NHỮNG CHỖ GIỮ NGUYÊN RANH GIỚI CỦA BẢN APP ───
 *  • HỒ SƠ RIÊNG `~/.cuongmini/trinh-duyet` — không đụng hồ sơ Chrome chính của
 *    người dùng (cookie ngân hàng, mật khẩu đã lưu…). Đăng nhập trong cửa sổ này
 *    thì được nhớ cho lần sau, như phân vùng `persist:browser-ngoai` của app.
 *  • CHỈ http/https cho `diToi`/tải file.
 *  • Bấm/gõ chạy bằng `Runtime.evaluate` với `userGesture` — cùng nghĩa với
 *    `executeJavaScript(ma, true)` của Electron (không giả chuột theo toạ độ).
 */
import type { Browser, CDPSession, Page } from 'puppeteer-core';

import { spawn } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { MA_LIET_KE_ANH, maCuonTrang } from '../../../desktop/src/main/trangScript';
import { LOI_KHONG_CO_TRINH_DUYET, timTrinhDuyet } from './timTrinhDuyet';

/** Thư mục hồ sơ riêng của trình duyệt AI. Đổi được bằng env (chạy thử, CI). */
export function thuMucHoSo(): string {
  const ep = process.env.CUONGMINI_HO_SO_TRINH_DUYET?.trim();
  return ep && hoSoAnToan(ep) ? ep : path.join(os.homedir(), '.cuongmini', 'trinh-duyet');
}

/**
 * ⛔ KHÔNG BAO GIỜ dùng hồ sơ CHÍNH của người dùng (cookie ngân hàng, mật khẩu đã lưu). Env trỏ vào thư mục
 * hồ sơ mặc định của Chrome/Edge/Brave/Chromium ⇒ bỏ qua, dùng hồ sơ riêng.
 */
export function hoSoAnToan(duong: string): boolean {
  const d = duong.replace(/\\/g, '/').toLowerCase();
  return !/(google\/chrome|chrome\/user data|microsoft edge|microsoft\/edge|bravesoftware|brave-browser|\/chromium|google-chrome|\.config\/chromium)(\/|$)/.test(d);
}

// ═══════════════════════════════════════════════════════════
// CHẾ ĐỘ: NGẦM (mặc định) / HIỆN
// ═══════════════════════════════════════════════════════════

export type CheDoTrinhDuyet = 'ngam' | 'hien';
/** Lõi này phân biệt ngầm/hiện (bản app nhúng trong cửa sổ app thì không) — loop khai capability `trinh_duyet_hien`. */
export const HO_TRO_CHE_DO_NGAM = true;
export const VIEWPORT_NGAM = { width: 1280, height: 800 } as const;

let docCaiDat: () => unknown = () => undefined;
/** `loi.ts` bơm cách đọc cài đặt `trinhDuyetCheDo` (file này không import kho cài đặt của app). */
export function datNguonCheDo(f: () => unknown): void { docCaiDat = f; }

/** Chế độ BỀN: env `CUONGMINI_TRINH_DUYET_CHE_DO` > cài đặt `trinhDuyetCheDo` > `ngam`. */
export function cheDoMacDinh(): CheDoTrinhDuyet {
  const e = process.env.CUONGMINI_TRINH_DUYET_CHE_DO?.trim().toLowerCase();
  if (e === 'hien' || e === 'ngam') return e;
  let c: unknown;
  try { c = docCaiDat(); } catch { c = undefined; }
  return c === 'hien' ? 'hien' : 'ngam';
}

/** Ghi đè TẠM trong phiên (`/browser show` · `trinh_duyet_hien`). `null` = theo cài đặt. */
let cheDoTam: CheDoTrinhDuyet | null = null;
/** Cửa sổ hiện ra do NGƯỜI DÙNG bấm/gõ (được đưa lên trước) hay do model xin (không cướp focus). */
let doNguoiDung = false;
/** Chế độ của trình duyệt ĐANG chạy (để biết có phải bật lại không). */
let cheDoDangChay: CheDoTrinhDuyet | null = null;

export function cheDoHienTai(): CheDoTrinhDuyet { return cheDoTam ?? cheDoMacDinh(); }

/** Tham số `puppeteer.launch` cho một chế độ — hàm thuần, test kiểm. */
export function thamSoKhoiDong(cheDo: CheDoTrinhDuyet, chay: string, hoSo: string, o: { nguoiDungYeuCau?: boolean; nenTang?: NodeJS.Platform } = {}) {
  const chung = ['--no-first-run', '--no-default-browser-check', '--mute-audio'];
  if (cheDo === 'ngam') {
    return {
      executablePath: chay, headless: true as const, userDataDir: hoSo,
      // Viewport CỐ ĐỊNH: ảnh chụp cho model luôn cùng cỡ, không phụ thuộc màn hình người dùng.
      defaultViewport: { ...VIEWPORT_NGAM }, protocolTimeout: 60_000,
      args: [...chung, `--window-size=${VIEWPORT_NGAM.width},${VIEWPORT_NGAM.height}`],
    };
  }
  const nenTang = o.nenTang ?? process.platform;
  return {
    executablePath: chay, headless: false as const, userDataDir: hoSo,
    // Có cửa sổ: trang theo cỡ cửa sổ thật — người dùng kéo to/nhỏ để đăng nhập cho thoải mái.
    defaultViewport: null, protocolTimeout: 60_000,
    args: [...chung, '--window-size=1280,900', ...(!o.nguoiDungYeuCau && nenTang !== 'darwin' ? ['--start-minimized'] : [])],
  };
}

/**
 * macOS + cửa sổ do MODEL xin ⇒ bật bằng `open -g` (Launch Services KHÔNG kích hoạt app) thay vì puppeteer.launch
 * (cái đó đưa Chrome lên trước, cướp bàn phím giữa lúc người dùng đang gõ). Trả `null` = dùng puppeteer.launch.
 */
export function lenhMoKhongCuopFocus(chay: string, hoSo: string, o: { nguoiDungYeuCau?: boolean; nenTang?: NodeJS.Platform } = {}): { lenh: string; args: string[] } | null {
  const nenTang = o.nenTang ?? process.platform;
  if (nenTang !== 'darwin' || o.nguoiDungYeuCau) return null;
  const app = /^(.*?\.app)\//.exec(chay)?.[1];
  if (!app) return null;
  return {
    lenh: 'open',
    args: ['-g', '-n', '-a', app, '--args', `--user-data-dir=${hoSo}`, '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', '--window-size=1280,900', 'about:blank'],
  };
}

type Pp = typeof import('puppeteer-core');
let ppTest: Pp | null = null;
let chayLenhTest: ((lenh: string, args: string[]) => void) | null = null;
/** CHỈ cho test: puppeteer giả + bắt lệnh `open -g`. */
export function __datChoTest(pp: unknown, chayLenh: ((lenh: string, args: string[]) => void) | null = null): void {
  ppTest = pp as Pp | null;
  chayLenhTest = chayLenh;
}
async function napPp(): Promise<Pp> { return ppTest ?? await import('puppeteer-core'); }
function chayLenhNen(lenh: string, args: string[]): void {
  if (chayLenhTest) { chayLenhTest(lenh, args); return; }
  const c = spawn(lenh, args, { detached: true, stdio: 'ignore' });
  c.on('error', () => undefined);
  c.unref();
}

let trinhDuyet: Browser | null = null;
/** Ta tự bật trình duyệt (đóng được) hay chỉ nối vào một cái đang chạy (chỉ ngắt). */
let taTuBat = false;
let trang: Page | null = null;
let cdp: CDPSession | null = null;
let khungChinh = '';
let khoiDong: Promise<void> | null = null;
let loiKhoiDong: Error | null = null;
/** Lời gọi `goto` gần nhất — `choTai` đợi nó (có hạn). */
let dieuHuong: Promise<void> | null = null;
let dangTai = false;
let choDungTai: Array<() => void> = [];
let uaCache = '';

export interface TrangThaiTrinhDuyet {
  url: string; tieuDe: string; dangTai: boolean; luiDuoc: boolean; toiDuoc: boolean; loi: string | null;
}

function hopLe(url: string): string | null {
  try {
    const u = new URL(url.includes('://') ? url : `https://${url}`);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// BẬT / NỐI TRÌNH DUYỆT
// ═══════════════════════════════════════════════════════════

/**
 * Nối vào trình duyệt AI ĐANG CHẠY (vd. extension VS Code đã bật, giờ CLI cũng
 * cần). Chrome khoá thư mục hồ sơ — bật cái thứ hai trên cùng hồ sơ là hỏng —
 * nhưng bản do puppeteer bật có cổng gỡ lỗi và ghi nó vào `DevToolsActivePort`.
 */
async function thuNoiVao(pp: typeof import('puppeteer-core'), hoSo: string): Promise<Browser | null> {
  const f = path.join(hoSo, 'DevToolsActivePort');
  if (!existsSync(f)) return null;
  try {
    const [cong, duong] = readFileSync(f, 'utf8').split('\n').map((x) => x.trim());
    if (!cong || !duong) return null;
    return await pp.connect({
      browserWSEndpoint: `ws://127.0.0.1:${cong}${duong}`,
      defaultViewport: null,
      protocolTimeout: 30_000,
    });
  } catch {
    return null; // file cũ của lần chạy trước — bật mới
  }
}

async function ganTrang(p: Page): Promise<void> {
  trang = p;
  dangTai = false;
  nhatKy.length = 0;
  p.on('console', (m) => {
    const t = m.type();
    const loc = m.location();
    themNhatKy({
      loai: t === 'error' ? 'loi' : t === 'warn' ? 'canh-bao' : 'log',
      chu: m.text().slice(0, 2000),
      ...(loc?.url ? { nguon: `${loc.url}:${loc.lineNumber ?? 0}` } : {}),
    });
  });
  // Lỗi JS không bắt — Electron đưa chúng vào `console-message`, puppeteer tách riêng.
  p.on('pageerror', (e) => themNhatKy({ loai: 'loi', chu: String((e as Error)?.message ?? e).slice(0, 2000) }));
  p.on('close', () => { if (trang === p) { trang = null; cdp = null; dangTai = false; xaChoTai(); } });

  /* Phiên CDP riêng: theo dõi "đang tải" như `isLoading()` của Electron, và
     chạy JS có `userGesture`. */
  const s = await p.createCDPSession();
  await s.send('Page.enable');
  const cay = await s.send('Page.getFrameTree');
  khungChinh = cay.frameTree.frame.id;
  s.on('Page.frameStartedLoading', (e) => { if (e.frameId === khungChinh) dangTai = true; });
  s.on('Page.frameStoppedLoading', (e) => { if (e.frameId === khungChinh) { dangTai = false; xaChoTai(); } });
  // Xoá nhật ký mỗi lần sang TÀI LIỆU khác (không tính đổi #hash/pushState) — như `did-navigate`.
  s.on('Page.frameNavigated', (e) => { if (!e.frame.parentId) nhatKy.length = 0; });
  cdp = s;
}

function xaChoTai(): void {
  const ds = choDungTai;
  choDungTai = [];
  for (const f of ds) f();
}

/**
 * Bật (hoặc nối vào) trình duyệt và có MỘT tab cho AI. Gọi nhiều lần không sao:
 * đang bật thì trả lại cùng lời hứa.
 */
export function batDau(): Promise<void> {
  if (trang && !trang.isClosed()) return Promise.resolve();
  if (khoiDong) return khoiDong;
  loiKhoiDong = null;
  khoiDong = (async () => {
    const pp = await napPp();
    if (!trinhDuyet || !trinhDuyet.connected) {
      const hoSo = thuMucHoSo();
      mkdirSync(hoSo, { recursive: true });
      const cheDo = cheDoHienTai();
      // Đang ở chế độ HIỆN (người dùng đăng nhập dở) mà một tiến trình khác (VS Code ↔ CLI) giữ trình duyệt ⇒ nối vào.
      // Chế độ NGẦM thì không nối vào cửa sổ đang hiện của người khác: mỗi tiến trình một bản ngầm là đủ — nhưng Chrome
      // khoá hồ sơ, nên vẫn phải nối khi có bản đang chạy (bật bản thứ hai trên cùng hồ sơ sẽ hỏng).
      const noi = await thuNoiVao(pp, hoSo);
      if (noi) {
        trinhDuyet = noi;
        taTuBat = false;
        cheDoDangChay = null; // không biết chắc — để chuyenCheDo tự bật lại khi cần
      } else {
        const chay = timTrinhDuyet();
        if (!chay) throw new Error(LOI_KHONG_CO_TRINH_DUYET);
        const ngamFocus = cheDo === 'hien' ? lenhMoKhongCuopFocus(chay, hoSo, { nguoiDungYeuCau: doNguoiDung }) : null;
        try {
          if (ngamFocus) {
            // macOS, cửa sổ do model xin: `open -g` rồi nối qua DevToolsActivePort (file cũ xoá trước để chờ đúng file mới).
            rmSync(path.join(hoSo, 'DevToolsActivePort'), { force: true });
            chayLenhNen(ngamFocus.lenh, ngamFocus.args);
            const het = Date.now() + 15_000;
            let b: Browser | null = null;
            while (!b && Date.now() < het) {
              await new Promise((x) => { setTimeout(x, 250); });
              b = await thuNoiVao(pp, hoSo);
            }
            if (!b) throw new Error('trình duyệt không mở cổng gỡ lỗi trong 15 giây');
            trinhDuyet = b;
          } else {
            trinhDuyet = await pp.launch(thamSoKhoiDong(cheDo, chay, hoSo, { nguoiDungYeuCau: doNguoiDung }));
          }
        } catch (e) {
          throw new Error(`Không bật được trình duyệt (${path.basename(chay)}): ${(e as Error).message.split('\n')[0]}`);
        }
        // `open -g` cũng do TA bật ⇒ đóng được (Browser.close qua CDP).
        taTuBat = true;
        cheDoDangChay = cheDo;
      }
      const b = trinhDuyet;
      b.on('disconnected', () => {
        if (trinhDuyet !== b) return;
        // Người dùng đóng hẳn cửa sổ ⇒ lần `web_mo` sau bật lại từ đầu.
        trinhDuyet = null; trang = null; cdp = null; dangTai = false; xaChoTai();
      });
    }
    const b = trinhDuyet;
    if (!b) throw new Error('Trình duyệt vừa bị đóng.');
    // Tab trống sẵn của lần bật đầu thì dùng luôn; nối vào trình duyệt có sẵn thì mở tab mới.
    const ds = taTuBat ? await b.pages() : [];
    const trong = ds.find((p) => p.url() === 'about:blank' || p.url() === 'chrome://newtab/');
    const p = trong ?? await b.newPage();
    // Ngầm: viewport cố định cả với tab có sẵn (defaultViewport chỉ áp cho tab puppeteer tạo).
    if (cheDoDangChay === 'ngam') await p.setViewport({ ...VIEWPORT_NGAM }).catch(() => undefined);
    await ganTrang(p);
    // Người dùng tự bấm "hiện" ⇒ đưa cửa sổ lên trước. Model xin ⇒ KHÔNG (xem lenhMoKhongCuopFocus).
    if (cheDoDangChay === 'hien' && doNguoiDung) await p.bringToFront().catch(() => undefined);
  })()
    .catch((e: unknown) => { loiKhoiDong = e instanceof Error ? e : new Error(String(e)); })
    .finally(() => { khoiDong = null; });
  return khoiDong;
}

// ═══════════════════════════════════════════════════════════
// MỞ / ĐIỀU HƯỚNG — cùng chữ ký với bản app
// ═══════════════════════════════════════════════════════════

/**
 * Có trình duyệt cho agent không. Trả `true` cả khi ĐANG BẬT hoặc VỪA BẬT HỎNG:
 * `web_mo` chỉ chờ 6 giây cho cờ này, mà bật Chrome lần đầu với hồ sơ mới có
 * thể lâu hơn — để nó đi tiếp vào `diToi`, nơi lỗi (nếu có) được nói rõ.
 */
export function dangMo(): boolean {
  return !!(trang && !trang.isClosed()) || !!khoiDong || !!loiKhoiDong;
}

export function urlHienTai(): string {
  try { return trang && !trang.isClosed() ? trang.url() : ''; } catch { return ''; }
}

/** Bản app nhận cửa sổ + vùng hiển thị; ở đây cửa sổ là của trình duyệt, nên chỉ cần URL. */
export function mo(_cuaSo: unknown, _vung: unknown, url?: string, ep = true): void {
  void batDau();
  const sach = url ? hopLe(url) : null;
  if (sach && (ep || !urlHienTai() || urlHienTai() === 'about:blank')) diToi(sach);
}

export function datVung(): void { /* cửa sổ riêng — không có vùng để đặt */ }
/** Không giấu cửa sổ của người dùng: họ tự thu nhỏ/đóng khi muốn. */
export function an(): void { /* không */ }
export function tiaYouTube(): void { /* chỉ có nghĩa với khung nhúng trong bài học */ }
export function dungVideo(): void { void trang?.goto('about:blank').catch(() => undefined); }

export function diToi(url: string): { ok: boolean; loi?: string } {
  const sach = hopLe(url);
  if (!sach) return { ok: false, loi: 'Chỉ mở được địa chỉ http:// hoặc https://' };
  if (loiKhoiDong) {
    const l = loiKhoiDong;
    loiKhoiDong = null;
    return { ok: false, loi: l.message };
  }
  if (!dangMo()) return { ok: false, loi: 'Trình duyệt chưa mở.' };
  const bat = khoiDong ?? Promise.resolve();
  dieuHuong = bat.then(async () => {
    if (loiKhoiDong) {
      const l = loiKhoiDong;
      loiKhoiDong = null;
      throw l;
    }
    const p = trang;
    if (!p) throw new Error('Trình duyệt vừa bị đóng.');
    try {
      // 19/10/2026: KHÔNG `bringToFront` khi điều hướng — đó chính là chỗ cửa sổ Chrome nhảy lên đè việc người dùng.
      // timeout 0: hạn chờ là việc của `choTai` (trang websocket không bao giờ "xong").
      await p.goto(sach, { waitUntil: 'load', timeout: 0 });
    } catch (e) {
      const m = (e as Error).message;
      // Bị điều hướng chồng lên giữa chừng = người dùng/agent tự làm, không phải lỗi.
      if (!/ERR_ABORTED|frame was detached|Navigating frame was detached/i.test(m)) {
        themNhatKy({ loai: 'loi', chu: `Không mở được ${sach} (${m.split('\n')[0]}). Kiểm tra địa chỉ, hoặc dev server đã chạy chưa.` });
      }
    }
  });
  // Không để lời hứa bị từ chối mà không ai nghe (Node in cảnh báo/thoát).
  dieuHuong.catch(() => undefined);
  return { ok: true };
}

export function lui(): void { void trang?.goBack().catch(() => undefined); }
export function toi(): void { void trang?.goForward().catch(() => undefined); }
export function napLai(): void { void trang?.reload().catch(() => undefined); }
export function moNgoai(): void { /* trang ĐÃ nằm trong trình duyệt thật */ }

/**
 * Chờ trang tải xong — CÓ HẠN CHÓT (trang websocket/polling không bao giờ xong).
 *
 * Khác bản app một chỗ: trình duyệt bật hỏng ngay trong lượt `web_mo` thì NÉM
 * lỗi ở đây — `chayToolAgent` biến nó thành "LỖI khi chạy web_mo: …" cho model
 * đọc, thay vì báo "Đã mở " với một địa chỉ rỗng.
 */
export async function choTai(hanMs = 12_000): Promise<void> {
  const dh = dieuHuong;
  if (dh) {
    let loi: Error | null = null;
    await Promise.race([
      dh.catch((e: unknown) => { loi = e as Error; }),
      new Promise((x) => { setTimeout(x, hanMs).unref?.(); }),
    ]);
    if (dieuHuong === dh) dieuHuong = null;
    if (loi) throw loi;
    return;
  }
  if (!trang) return;
  /* Bấm nút làm trang chuyển đi — điều hướng bắt đầu SAU cú bấm vài nhịp. Chờ
     một chút rồi mới hỏi "đang tải không", nếu không câu trả lời luôn là không. */
  if (!dangTai) await new Promise((x) => { setTimeout(x, 150); });
  if (!dangTai) return;
  await new Promise<void>((xong) => {
    const gio = setTimeout(xong, hanMs);
    choDungTai.push(() => { clearTimeout(gio); xong(); });
  });
}

/** Chạy JS trong trang, như `executeJavaScript(ma, true)` của Electron. */
async function chayJs(ma: string): Promise<unknown> {
  const s = cdp;
  if (!s) throw new Error('chưa mở trình duyệt');
  const r = await s.send('Runtime.evaluate', {
    expression: ma, returnByValue: true, awaitPromise: true, userGesture: true,
  });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description?.split('\n')[0] ?? r.exceptionDetails.text);
  }
  return r.result.value;
}

// ═══════════════════════════════════════════════════════════
// ĐỌC / CHỤP / CUỘN / BẤM / GÕ
// ═══════════════════════════════════════════════════════════

export interface MucNhatKy { loai: 'log' | 'canh-bao' | 'loi'; chu: string; nguon?: string }
const nhatKy: MucNhatKy[] = [];
function themNhatKy(m: MucNhatKy): void {
  nhatKy.push(m);
  if (nhatKy.length > 200) nhatKy.shift();
}
export function docNhatKy(): MucNhatKy[] { return [...nhatKy]; }

export async function docTrang(tranKyTu = 40_000): Promise<string> {
  return (await docTrangDayDu()).slice(0, tranKyTu);
}

export async function docTrangDayDu(vung?: string): Promise<string> {
  if (!cdp) return '';
  const chu = await chayJs(
    `(() => { const e = ${vung ? `document.querySelector(${JSON.stringify(vung)})` : 'null'} || document.body;`
    + ' return e ? e.innerText : ""; })()',
  );
  return typeof chu === 'string' ? chu : '';
}

/** Ảnh phần ĐANG HIỆN. PNG nếu vừa trần 2,5MB, không thì JPEG 85% — cùng lý do bản app. */
export async function chupTrang(): Promise<{ data: string; kieu: 'image/png' | 'image/jpeg' } | null> {
  const p = trang;
  if (!p) return null;
  try {
    const png = Buffer.from(await p.screenshot({ type: 'png' }));
    if (png.length <= 2_500_000) return { data: png.toString('base64'), kieu: 'image/png' };
    const jpg = Buffer.from(await p.screenshot({ type: 'jpeg', quality: 85 }));
    return { data: jpg.toString('base64'), kieu: 'image/jpeg' };
  } catch {
    return null;
  }
}

export interface KetQuaCuon { ok: boolean; loi?: string; y?: number; cao?: number; tong?: number; trongKhung?: boolean }

export async function cuonTrang(huong: 'xuong' | 'len' | 'dau' | 'cuoi' | null, den?: string): Promise<KetQuaCuon> {
  if (!cdp) return { ok: false, loi: 'chưa mở trình duyệt' };
  try {
    const kq = await chayJs(maCuonTrang(huong, den)) as KetQuaCuon;
    await new Promise((r) => { setTimeout(r, 450); });
    return kq;
  } catch (e) {
    return { ok: false, loi: (e as Error).message };
  }
}

export interface AnhTrenTrang { src: string; alt: string; rong: number; cao: number; dangHien: boolean }

export async function lietKeAnh(toiDa = 40): Promise<AnhTrenTrang[]> {
  if (!cdp) return [];
  try {
    const ds = await chayJs(MA_LIET_KE_ANH) as AnhTrenTrang[];
    return (Array.isArray(ds) ? ds : []).sort((a, b) => b.rong * b.cao - a.rong * a.cao).slice(0, toiDa);
  } catch {
    return [];
  }
}

export async function bamVao(boChon: string): Promise<{ ok: boolean; loi?: string }> {
  if (!cdp) return { ok: false, loi: 'chưa mở trình duyệt' };
  const kq = await chayJs(`(() => { const e = document.querySelector(${JSON.stringify(boChon)});
    if (!e) return 'khong-thay';
    e.scrollIntoView({ block: 'center' });
    e.click();
    return 'ok'; })()`);
  return kq === 'ok' ? { ok: true } : { ok: false, loi: `không thấy phần tử "${boChon}"` };
}

export async function goChu(boChon: string, chu: string): Promise<{ ok: boolean; loi?: string }> {
  if (!cdp) return { ok: false, loi: 'chưa mở trình duyệt' };
  const kq = await chayJs(`(() => { const e = document.querySelector(${JSON.stringify(boChon)});
    if (!e) return 'khong-thay';
    if (e instanceof HTMLInputElement && e.type === 'password') return 'mat-khau';
    e.focus();
    const dat = Object.getOwnPropertyDescriptor(
      e instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value')?.set;
    if (dat) dat.call(e, ${JSON.stringify(chu)}); else e.value = ${JSON.stringify(chu)};
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return 'ok'; })()`);
  /* 19/10/2026: KHÔNG BAO GIỜ gõ vào ô mật khẩu — người dùng tự đăng nhập (`/browser show` · `trinh_duyet_hien`). */
  if (kq === 'mat-khau') return { ok: false, loi: 'đây là ô MẬT KHẨU — CuongMini không gõ mật khẩu. Nhờ người dùng tự đăng nhập (trinh_duyet_hien / /browser show).' };
  return kq === 'ok' ? { ok: true } : { ok: false, loi: `không thấy ô nhập "${boChon}"` };
}

export interface LienKet { href: string; chu: string }

/** Lấy `a.href` (đã giải tuyệt đối) — xem lý do ở bản app. */
export async function lietKeLienKet(): Promise<LienKet[]> {
  if (!cdp) return [];
  const tho = await chayJs(`(() => {
    const ra = [];
    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.href;
      if (typeof h !== 'string' || !/^https?:/i.test(h)) continue;
      const chu = (a.innerText || a.getAttribute('title') || a.getAttribute('aria-label') || '')
        .replace(/\\s+/g, ' ').trim().slice(0, 140);
      ra.push({ href: h, chu });
    }
    return ra;
  })()`);
  if (!Array.isArray(tho)) return [];
  const theoHref = new Map<string, LienKet>();
  for (const m of tho as LienKet[]) {
    if (!m || typeof m.href !== 'string') continue;
    const cu = theoHref.get(m.href);
    if (!cu || (m.chu?.length ?? 0) > cu.chu.length) theoHref.set(m.href, { href: m.href, chu: String(m.chu ?? '') });
    if (theoHref.size >= 600) break;
  }
  return [...theoHref.values()];
}

// ═══════════════════════════════════════════════════════════
// TẢI FILE — bằng COOKIE của trình duyệt AI
// ═══════════════════════════════════════════════════════════
/*
 * Bản app dùng `session.downloadURL` rồi lùi về `net.request` trên cùng phiên.
 * Ở đây làm thẳng phần "lùi": lấy cookie của đúng địa chỉ từ trình duyệt AI
 * (`Network.getCookies`) rồi tải bằng `fetch` của Node. Tự đi theo chuyển hướng
 * TỪNG BƯỚC để mỗi máy chủ chỉ nhận cookie của chính nó — để `fetch` tự theo
 * thì header Cookie của trang A bị gửi luôn sang trang B mà A chuyển tới.
 */

export interface KetQuaTai { ok: boolean; duongDan?: string; byte?: number; loi?: string }
export interface KetQuaTaiBoNho { ok: boolean; byte?: Buffer; kieu?: string; ten?: string; loi?: string }

const TRAN_BYTE_TAI = 300 * 1024 * 1024;
const HET_GIO_TAI_MS = 180_000;

/**
 * Tên file an toàn để ghi xuống đĩa — CHÉP từ `desktop/src/main/browser.ts`
 * (file đó import `electron` nên tsc của lõi không nạp được). Sửa một chỗ thì
 * sửa cả hai.
 */
export function tenSach(tho: string): string {
  let t = String(tho ?? '')
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

function tenTuUrl(url: string): string {
  try {
    const cuoi = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() ?? '');
    return cuoi || 'tai-ve.bin';
  } catch {
    return 'tai-ve.bin';
  }
}

/** Đường dẫn chưa bị chiếm — KHÔNG ghi đè (chép từ bản app). */
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

async function cookieCho(url: string): Promise<string> {
  if (!cdp) return '';
  try {
    const r = await cdp.send('Network.getCookies', { urls: [url] });
    return r.cookies.map((c) => `${c.name}=${c.value}`).join('; ');
  } catch {
    return '';
  }
}

async function layVoiCookie(url: string, signal: AbortSignal): Promise<{ res: Response; url: string }> {
  if (!uaCache && trinhDuyet?.connected) uaCache = await trinhDuyet.userAgent().catch(() => '');
  let u = url;
  for (let i = 0; i < 10; i += 1) {
    const ck = await cookieCho(u);
    const res = await fetch(u, {
      redirect: 'manual',
      signal,
      headers: {
        ...(ck ? { cookie: ck } : {}),
        ...(uaCache ? { 'user-agent': uaCache } : {}),
        ...(hopLe(urlHienTai()) ? { referer: urlHienTai() } : {}),
      },
    });
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const toi = res.headers.get('location');
      if (!toi) return { res, url: u };
      const sau = hopLe(new URL(toi, u).toString());
      if (!sau) throw new Error('máy chủ chuyển hướng sang địa chỉ không phải http/https');
      await res.body?.cancel().catch(() => undefined);
      u = sau;
      continue;
    }
    return { res, url: u };
  }
  throw new Error('chuyển hướng quá 10 lần');
}

/** Tải VÀO BỘ NHỚ (để agent đọc/nhìn một file theo link) — không ghi đĩa. */
export async function taiVaoBoNho(url: string, tranByte: number): Promise<KetQuaTaiBoNho> {
  const sach = hopLe(url);
  if (!sach) return { ok: false, loi: 'chỉ đọc được địa chỉ http:// hoặc https://' };
  try {
    const { res, url: cuoi } = await layVoiCookie(sach, AbortSignal.timeout(45_000));
    if (res.status >= 400) return { ok: false, loi: `máy chủ trả ${res.status}` };
    const kieu = String(res.headers.get('content-type') ?? '').split(';')[0]!.trim().toLowerCase();
    const cuc: Buffer[] = [];
    let tong = 0;
    for await (const c of (res.body ?? []) as unknown as AsyncIterable<Uint8Array>) {
      tong += c.length;
      if (tong > tranByte) return { ok: false, loi: `file lớn hơn ${(tranByte / 1048576).toFixed(0)}MB` };
      cuc.push(Buffer.from(c));
    }
    return { ok: true, byte: Buffer.concat(cuc), kieu, ten: tenTuUrl(cuoi) };
  } catch (e) {
    const m = (e as Error).name === 'TimeoutError' ? 'quá 45s chưa tải xong' : (e as Error).message;
    return { ok: false, loi: m };
  }
}

export async function taiFile(url: string, thuMuc: string, tenGoiY?: string): Promise<KetQuaTai> {
  if (!trang) return { ok: false, loi: 'chưa mở trình duyệt — gọi `web_mo` trước' };
  const sach = hopLe(url);
  if (!sach) return { ok: false, loi: 'chỉ tải được địa chỉ http:// hoặc https://' };
  let tam = '';
  try {
    const { res, url: cuoi } = await layVoiCookie(sach, AbortSignal.timeout(HET_GIO_TAI_MS));
    if (res.status >= 400) return { ok: false, loi: `máy chủ trả ${res.status}` };
    const khai = Number(res.headers.get('content-length') ?? 0);
    if (khai > TRAN_BYTE_TAI) {
      await res.body?.cancel().catch(() => undefined);
      return { ok: false, loi: `file ${(khai / 1048576).toFixed(1)}MB vượt trần ${TRAN_BYTE_TAI / 1048576}MB` };
    }
    const cd = String(res.headers.get('content-disposition') ?? '');
    const khop = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(cd);
    let ten = tenGoiY ?? '';
    if (!ten && khop?.[1]) { try { ten = decodeURIComponent(khop[1]); } catch { ten = khop[1]; } }
    if (!ten) ten = tenTuUrl(cuoi);
    const dich = duongDanChuaCo(path.join(thuMuc, tenSach(ten)));
    /* Ghi ra file TẠM rồi mới đổi tên: tải đứt giữa chừng không để lại một file
       đúng tên mà thiếu ruột (hỏng câm — trông như đã tải xong). */
    tam = `${dich}.dang-tai`;
    let tong = 0;
    const dem = new Transform({
      transform(c: Buffer, _e, xong) {
        tong += c.length;
        if (tong > TRAN_BYTE_TAI) { xong(new Error('vượt trần dung lượng')); return; }
        xong(null, c);
      },
    });
    if (!res.body) throw new Error('máy chủ không trả nội dung');
    await pipeline(Readable.fromWeb(res.body as never), dem, createWriteStream(tam));
    await fs.rename(tam, dich);
    tam = '';
    return { ok: true, duongDan: dich, byte: tong };
  } catch (e) {
    const m = (e as Error).name === 'TimeoutError' ? 'bị huỷ (quá lâu)' : (e as Error).message;
    return { ok: false, loi: m };
  } finally {
    if (tam) await fs.rm(tam, { force: true }).catch(() => undefined);
  }
}

/** Đóng: trình duyệt ta tự bật thì đóng hẳn; cái ta chỉ nối vào thì chỉ ngắt. */
export async function huy(): Promise<void> {
  const b = trinhDuyet;
  trinhDuyet = null; trang = null; cdp = null; dangTai = false; dieuHuong = null; xaChoTai();
  cheDoDangChay = null;
  if (!b) return;
  if (taTuBat) await b.close().catch(() => undefined);
  else await b.disconnect().catch(() => undefined);
}

export interface KetQuaCheDo { ok: boolean; cheDo: CheDoTrinhDuyet; url: string; loi?: string }

/**
 * Đổi NGẦM ↔ HIỆN cho phiên này (`/browser show|hide`, nút VS Code, tool `trinh_duyet_hien`).
 * Trình duyệt đang chạy khác chế độ ⇒ đóng (Chrome ghi cookie xuống hồ sơ) rồi bật lại cùng hồ sơ, mở lại trang
 * đang xem (hoặc `url`). Chưa chạy ⇒ chỉ ghi nhớ; `hien` thì bật ngay để người dùng thấy.
 * CuongMini KHÔNG BAO GIỜ tự gõ mật khẩu / giải captcha trong cửa sổ này — người dùng tự làm.
 */
export async function chuyenCheDo(cheDo: CheDoTrinhDuyet, o: { nguoiDungYeuCau?: boolean; url?: string } = {}): Promise<KetQuaCheDo> {
  const dangXem = urlHienTai();
  const dich = (o.url && hopLe(o.url)) || (dangXem && dangXem !== 'about:blank' ? dangXem : '');
  cheDoTam = cheDo === cheDoMacDinh() ? null : cheDo;
  doNguoiDung = cheDo === 'hien' && !!o.nguoiDungYeuCau;
  const dangChay = !!(trinhDuyet && trinhDuyet.connected);
  if (dangChay && cheDoDangChay === cheDo) {
    if (cheDo === 'hien' && doNguoiDung) await trang?.bringToFront().catch(() => undefined);
    if (o.url && dich) { diToi(dich); await choTai(8000).catch(() => undefined); }
    return { ok: true, cheDo, url: urlHienTai() };
  }
  if (dangChay) {
    if (khoiDong) await khoiDong.catch(() => undefined);
    await huy();
  }
  if (cheDo === 'ngam' && !dich) return { ok: true, cheDo, url: '' }; // bật ngầm lười — lần web_mo sau
  await batDau();
  if (loiKhoiDong) {
    const l = loiKhoiDong;
    loiKhoiDong = null;
    return { ok: false, cheDo, url: '', loi: l.message };
  }
  if (dich) {
    const kq = diToi(dich);
    if (kq.ok) await choTai(10_000).catch(() => undefined);
  }
  return { ok: true, cheDo, url: urlHienTai() };
}

/** Trạng thái cho giao diện (extension/CLI muốn hiện "Browser connected"). */
export function trangThai(): { ketNoi: boolean; url: string; trinhDuyet: string | null; cheDo: CheDoTrinhDuyet } {
  return { ketNoi: !!(trang && !trang.isClosed()), url: urlHienTai(), trinhDuyet: timTrinhDuyet(), cheDo: cheDoHienTai() };
}
