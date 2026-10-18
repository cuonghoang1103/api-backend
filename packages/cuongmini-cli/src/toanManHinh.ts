/**
 * TOÀN MÀN HÌNH (0.3.1) — alternate screen như Claude Code: ô nhập + chân trang
 * ghim ĐÁY cửa sổ, hội thoại tự cuộn phía trên (con lăn chuột / PgUp / PgDn /
 * Home / End). Thoát thì trả lại màn hình cũ.
 *
 * Vì sao cần: ở chế độ in nối tiếp (0.3.0), terminal tự "reflow" các dòng đã in
 * khi đổi cỡ cửa sổ — dòng rộng bị gãy thành hai — mà Ink chỉ xoá đúng SỐ DÒNG nó
 * nhớ ⇒ sót lại bản cũ của ô nhập (ảnh "trùng nhau" của người dùng, iTerm2).
 * Trong alternate screen ta vẽ cả khung mỗi lần, đổi cỡ thì xoá sạch rồi vẽ lại.
 */

/** Vào alternate screen + xoá + về góc. */
export const VAO_MAN_PHU = '\x1b[?1049h\x1b[2J\x1b[H';
/** Ra khỏi alternate screen (terminal trả lại màn hình trước đó). */
export const RA_MAN_PHU = '\x1b[?1049l';
/**
 * Báo chuột: 1000 = nhấn/nhả + con lăn (KHÔNG báo rê chuột — đỡ tốn), 1006 = dạng SGR
 * (`ESC[<b;x;yM`) không giới hạn 223 cột. Bật báo chuột thì bôi đen phải giữ phím:
 * Option (iTerm2) · Fn (Terminal của macOS) · Shift (Windows Terminal, Linux).
 */
export const BAT_CHUOT = '\x1b[?1000h\x1b[?1006h';
export const TAT_CHUOT = '\x1b[?1000l\x1b[?1006l';
/** Xoá màn hình đang hiện (không đụng scrollback) — dùng trong alternate screen. */
export const XOA_KHUNG = '\x1b[2J\x1b[H';

/**
 * Xoá màn hình VÀ lịch sử cuộn. `ESC[2J` của iTerm2 đẩy màn hình cũ vào scrollback,
 * nên in lại bảng ghi sau nó là để lại một bản trùng phía trên (lỗi 0.3.0 của /language) —
 * thêm `ESC[3J` và lệnh riêng của iTerm2 (`OSC 1337;ClearScrollback`; terminal khác bỏ qua).
 */
export function xoaSach(_env: NodeJS.ProcessEnv = process.env): string {
  /* KHÔNG còn mã riêng `OSC 1337;ClearScrollback` của iTerm2 (18/10/2026): iTerm2 hiện thanh hỏi
     "A control sequence attempted to clear scrollback history. Allow?" — người dùng thấy như lỗi.
     Chỉ dùng cho việc NGƯỜI DÙNG chủ động xoá (ctrl+l, /clear) ở chế độ in nối tiếp — mở khoá bộ lọc
     một lần. Đổi cỡ cửa sổ KHÔNG dùng hàm này (đợt 4 — dùng `XOA_KHUNG`). */
  choPhep3J += 1;
  return '\x1b[2J\x1b[3J\x1b[H';
}

/** Số lần `ESC[3J` được PHÉP đi qua (do người dùng chủ động xoá). */
let choPhep3J = 0;

/**
 * Chặn MỌI lệnh xoá scrollback (`ESC[3J`, `OSC 1337;ClearScrollback`) — ở toàn màn hình LUÔN chặn; ở chế độ
 * in nối tiếp chỉ cho qua đúng những lần người dùng chủ động xoá (`xoaSach`). Thủ phạm thật: Ink tự ghi
 * `ansiEscapes.clearTerminal` (= `ESC[2J ESC[3J ESC[H`) mỗi khi khung động cao ≥ số dòng terminal hoặc
 * lúc đổi cỡ — iTerm2 hỏi "clear scrollback?" (đợt 4: cả chế độ in nối tiếp).
 */
export function locXoaScrollback(chunk: unknown): unknown {
  if (typeof chunk !== 'string') return chunk;
  if (!chunk.includes('\x1b[3J') && !chunk.includes('ClearScrollback')) return chunk;
  if (!dangBat && choPhep3J > 0) { choPhep3J -= 1; return chunk; }
  return chunk.replace(/\x1b\[3J/g, '').replace(/\x1b\]1337;ClearScrollback\x07/g, '');
}

let daCaiLoc = false;
/** Gắn bộ lọc vào `stdout.write` (một lần). */
export function caiLocXoaScrollback(out: NodeJS.WriteStream): void {
  if (daCaiLoc) return;
  daCaiLoc = true;
  const goc = out.write.bind(out) as (...a: unknown[]) => boolean;
  (out as unknown as { write: (...a: unknown[]) => boolean }).write = (chunk: unknown, ...con: unknown[]) => goc(locXoaScrollback(chunk), ...con);
}

/** Có bật toàn màn hình không: cờ thắng cài đặt; không TTY / CI / -p thì không bao giờ. */
export function nenToanManHinh(o: {
  caiDat: 'bat' | 'tat'; co?: boolean; cheDoIn: boolean; tty: boolean; env: NodeJS.ProcessEnv;
}): boolean {
  if (o.cheDoIn || !o.tty) return false;
  if (o.env.CI && o.env.CI !== '0' && o.env.CI !== 'false') return false;
  if (o.env.TERM === 'dumb') return false;
  if (o.env.CUONGMINI_TOAN_MAN_HINH === '0') return false;
  if (o.co !== undefined) return o.co;
  if (o.env.CUONGMINI_TOAN_MAN_HINH === '1') return true;
  return o.caiDat !== 'tat';
}

export type SuKienChuot = { kieu: 'cuonLen' | 'cuonXuong' | 'khac'; x: number; y: number };

/**
 * Một sự kiện chuột SGR mà Ink chuyển lên `useInput` (đã bỏ ESC): `[<64;12;5M`.
 * 64/65 = con lăn lên/xuống (cộng 4/8/16 khi giữ shift/meta/ctrl). Không phải chuột ⇒ `null`.
 */
export function docChuot(input: string): SuKienChuot | null {
  const m = /^\x1b?\[<(\d+);(\d+);(\d+)([Mm])$/.exec(input);
  if (!m) return null;
  const b = Number(m[1]);
  const x = Number(m[2]);
  const y = Number(m[3]);
  if (b & 64) return { kieu: (b & 1) ? 'cuonXuong' : 'cuonLen', x, y };
  return { kieu: 'khac', x, y };
}

/** Vị trí cuộn của bảng ghi: `cuon` = số dòng đang nằm DƯỚI khung nhìn (0 = bám đáy). */
export interface ViTriCuon { cuon: number; tong: number; moi: number }

/**
 * Bảng ghi đổi số dòng. Đang cuộn lên đọc mà có dòng mới ⇒ giữ nguyên chỗ đang đọc
 * (đẩy `cuon` theo) và đếm "N dòng mới"; bám đáy thì cứ theo đáy.
 */
export function capNhatTong(v: ViTriCuon, tongMoi: number): ViTriCuon {
  if (tongMoi === v.tong) return v;
  if (v.cuon === 0) return { cuon: 0, tong: tongMoi, moi: 0 };
  const them = tongMoi - v.tong;
  // Bảng ghi bị xoá/thu lại (/clear, compact) ⇒ về đáy cho khỏi lạc.
  if (them < 0) return { cuon: 0, tong: tongMoi, moi: 0 };
  return { cuon: v.cuon + them, tong: tongMoi, moi: v.moi + them };
}

/** Cuộn `buoc` dòng (dương = lên). Không cuộn quá đầu (còn ít nhất `cao` dòng trên màn), không xuống dưới đáy. */
export function cuon(v: ViTriCuon, buoc: number, cao: number): ViTriCuon {
  const toiDa = Math.max(0, v.tong - Math.max(1, cao));
  const c = Math.max(0, Math.min(toiDa, v.cuon + buoc));
  return { ...v, cuon: c, moi: c === 0 ? 0 : v.moi };
}

/** Các dòng đặt vào khung nhìn: lấy `cao` dòng kết thúc ở `tong - cuon` (khung bám đáy, phần trên bị cắt). */
export function catKhung<T>(dong: readonly T[], v: Pick<ViTriCuon, 'cuon'>, cao: number): T[] {
  const cuoi = Math.max(0, dong.length - v.cuon);
  return dong.slice(Math.max(0, cuoi - Math.max(1, cao)), cuoi);
}

let dangBat = false;
let phaiTatChuot = false;

/**
 * Có bật báo chuột không. Windows: Node bật raw mode KHÔNG kèm "VT input" nên sự kiện chuột không
 * tới được tiến trình — bật chỉ làm hỏng bôi đen mà con lăn vẫn không cuộn được ⇒ chỉ PgUp/PgDn.
 */
export const nenBatChuot = (platform: NodeJS.Platform = process.platform, env: NodeJS.ProcessEnv = process.env, caiDat: 'bat' | 'tat' = chuotCaiDat): boolean =>
  platform !== 'win32' && env.CUONGMINI_CHUOT !== '0' && (env.CUONGMINI_CHUOT === '1' || caiDat === 'bat');

/** Cài đặt `chuot` (đọc lúc mở, đổi bằng `/mouse`). */
let chuotCaiDat: 'bat' | 'tat' = 'tat';
export function datChuotCaiDat(c: 'bat' | 'tat'): void { chuotCaiDat = c; }

/**
 * ALTERNATE SCROLL (DECSET 1007): KHÔNG bắt chuột nhưng con lăn trong alternate screen gửi phím
 * ↑/↓ (xterm, iTerm2, kitty, WezTerm…) ⇒ vẫn cuộn được bảng ghi, còn bôi đen chép chữ tự nhiên.
 * `ManChat` phân biệt con lăn (nhiều mũi tên dồn trong vài ms) với một lần bấm ↑ (lịch sử ô nhập).
 */
export const BAT_CUON_PHU = '\x1b[?1007h';
export const TAT_CUON_PHU = '\x1b[?1007l';

/** Vào toàn màn hình (gọi TRƯỚC khi Ink vẽ). Tiến trình chết kiểu gì cũng trả lại màn hình. */
export function batDauToanManHinh(out: NodeJS.WriteStream, chuot = nenBatChuot()): void {
  if (dangBat) return;
  dangBat = true;
  phaiTatChuot = chuot;
  out.write(VAO_MAN_PHU + (chuot ? BAT_CHUOT : BAT_CUON_PHU));
  process.once('exit', () => ketThucToanManHinh(out));
}

export function ketThucToanManHinh(out: NodeJS.WriteStream): void {
  if (!dangBat) return;
  dangBat = false;
  try { out.write((phaiTatChuot ? TAT_CHUOT : TAT_CUON_PHU) + '\x1b[?25h' + RA_MAN_PHU); } catch { /* ống đã đóng */ }
}

export const dangToanManHinh = (): boolean => dangBat;

/** Đổi chế độ GIỮA phiên (/fullscreen): trả chuỗi phải ghi (qua kênh ghi của Ink để không lệch khung). */
export function chuoiDoiCheDo(bat: boolean, env: NodeJS.ProcessEnv = process.env): string {
  if (bat) { dangBat = true; phaiTatChuot = nenBatChuot(); return VAO_MAN_PHU + (phaiTatChuot ? BAT_CHUOT : BAT_CUON_PHU); }
  dangBat = false;
  const tat = phaiTatChuot ? TAT_CHUOT : TAT_CUON_PHU;
  phaiTatChuot = false;
  /* Ra màn hình thường: ở đó CHƯA có gì của CuongMini (mọi thứ nằm ở alternate screen) ⇒ chỉ cần xoá khung, KHÔNG
     xoá scrollback — `ESC[3J` vừa làm iTerm2 hỏi "clear scrollback?" vừa xoá luôn lịch sử shell của người dùng
     từ trước khi mở CuongMini (QA 18/10, `/fullscreen off`). */
  void env;
  return tat + RA_MAN_PHU + XOA_KHUNG;
}

/** Đổi bắt chuột GIỮA phiên (`/mouse on|off`) — chuỗi phải ghi. */
export function chuoiDoiChuot(bat: boolean): string {
  chuotCaiDat = bat ? 'bat' : 'tat';
  if (!dangBat) return '';
  phaiTatChuot = bat && process.platform !== 'win32';
  return phaiTatChuot ? TAT_CUON_PHU + BAT_CHUOT : TAT_CHUOT + BAT_CUON_PHU;
}

/** Tóm tắt in ra màn hình thường khi thoát toàn màn hình (alternate screen mất hết nội dung). */
let tomTat: (() => string) | null = null;
export function datTomTatPhien(f: (() => string) | null): void { tomTat = f; }
export function layTomTatPhien(): string { try { return tomTat?.() ?? ''; } catch { return ''; } }
