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
export function xoaSach(env: NodeJS.ProcessEnv = process.env): string {
  return `\x1b[2J\x1b[3J\x1b[H${env.TERM_PROGRAM === 'iTerm.app' ? '\x1b]1337;ClearScrollback\x07' : ''}`;
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
export const nenBatChuot = (platform: NodeJS.Platform = process.platform, env: NodeJS.ProcessEnv = process.env): boolean =>
  platform !== 'win32' && env.CUONGMINI_CHUOT !== '0';

/** Vào toàn màn hình (gọi TRƯỚC khi Ink vẽ). Tiến trình chết kiểu gì cũng trả lại màn hình. */
export function batDauToanManHinh(out: NodeJS.WriteStream, chuot = nenBatChuot()): void {
  if (dangBat) return;
  dangBat = true;
  phaiTatChuot = chuot;
  out.write(VAO_MAN_PHU + (chuot ? BAT_CHUOT : ''));
  process.once('exit', () => ketThucToanManHinh(out));
}

export function ketThucToanManHinh(out: NodeJS.WriteStream): void {
  if (!dangBat) return;
  dangBat = false;
  try { out.write((phaiTatChuot ? TAT_CHUOT : '') + '\x1b[?25h' + RA_MAN_PHU); } catch { /* ống đã đóng */ }
}

export const dangToanManHinh = (): boolean => dangBat;

/** Đổi chế độ GIỮA phiên (/fullscreen): trả chuỗi phải ghi (qua kênh ghi của Ink để không lệch khung). */
export function chuoiDoiCheDo(bat: boolean, env: NodeJS.ProcessEnv = process.env): string {
  if (bat) { dangBat = true; phaiTatChuot = nenBatChuot(); return VAO_MAN_PHU + (phaiTatChuot ? BAT_CHUOT : ''); }
  dangBat = false;
  const tat = phaiTatChuot ? TAT_CHUOT : '';
  phaiTatChuot = false;
  return tat + RA_MAN_PHU + xoaSach(env);
}

/** Tóm tắt in ra màn hình thường khi thoát toàn màn hình (alternate screen mất hết nội dung). */
let tomTat: (() => string) | null = null;
export function datTomTatPhien(f: (() => string) | null): void { tomTat = f; }
export function layTomTatPhien(): string { try { return tomTat?.() ?? ''; } catch { return ''; } }
