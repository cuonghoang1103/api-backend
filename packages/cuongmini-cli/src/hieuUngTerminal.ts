/**
 * HIỆU ỨNG TERMINAL khi CuongMini đang làm (đợt 8C, 19/10/2026) — kiểu Claude Code trên iTerm2 /
 * Windows Terminal, nhưng nhẹ và không nháy:
 *   • TIÊU ĐỀ tab/cửa sổ (OSC 0): `◐ <tên phiên> · đang làm` (biểu tượng xoay 4 khung, ~3 lần/giây,
 *     chỉ ghi khi đổi), `◉ … · chờ duyệt`, `✓ … · xong`, `✗ … · lỗi`; rảnh = `CuongMini · <tên phiên>`.
 *     Lúc mở lưu tiêu đề cũ (XTWINOPS `CSI 22;0 t`), lúc thoát trả lại (`CSI 23;0 t`) — terminal không
 *     hiểu thì bỏ qua, và tiêu đề rỗng trước đó để terminal tự về mặc định.
 *   • TIẾN ĐỘ OSC 9;4 (ConEmu/Windows Terminal — tab xoay + thanh taskbar; iTerm2 ≥ 3.6.6 — tab phát sáng;
 *     ghostty ≥ 1.2): `3` đang chạy (không xác định), `4` chờ duyệt (vàng), `2` lỗi (đỏ, tự xoá sau 8 giây),
 *     `0` xoá khi xong / dừng / thoát. CHỈ phát ở terminal biết chắc hiểu nó: ở iTerm2 cũ / WezTerm / kitty,
 *     OSC 9 nghĩa là "đăng thông báo" ⇒ `9;4;3` sẽ thành một thông báo rác "4;3".
 *   • iTerm2: user var `cuongmini` (OSC 1337 SetUserVar, base64) = working | waiting | done | error | idle —
 *     vô hình nếu không dùng; muốn thấy thì đặt Badge = `\(user.cuongmini)`. KHÔNG đặt badge/màu tab giùm
 *     (đè cấu hình của người dùng).
 * Không phát gì khi: không phải TTY, chế độ in (`-p`), CI, TERM=dumb, `CUONGMINI_HIEU_UNG=0`, hoặc
 * `/config` → Hiệu ứng terminal = Tắt.
 */
import { L } from './i18n';
import { laAscii } from './kyTu';

export interface KhaNang {
  tieuDe: boolean;
  tienDo: boolean;
  bienIterm: boolean;
  /** Thông báo GỐC của terminal: iTerm2 = OSC 9; ghostty/WezTerm = OSC 777. */
  thongBao: 'osc9' | 'osc777' | null;
}

const KHONG: KhaNang = { tieuDe: false, tienDo: false, bienIterm: false, thongBao: null };

const soPhienBan = (s: string | undefined): number[] => String(s ?? '').split(/[.\-+]/).map((x) => Number.parseInt(x, 10)).filter((n) => !Number.isNaN(n));
/** a ≥ b theo từng số (3.6.10 ≥ 3.6.6). Không đọc được ⇒ false (an toàn: không phát). */
export function phienBanToi(a: string | undefined, b: number[]): boolean {
  const x = soPhienBan(a);
  if (!x.length) return false;
  for (let i = 0; i < b.length; i += 1) {
    const u = x[i] ?? 0;
    if (u !== b[i]) return u > b[i]!;
  }
  return true;
}

/** Dò terminal ⇒ được phát gì. Thuần (test được). */
export function doKhaNang(env: NodeJS.ProcessEnv, o: { tty: boolean; cheDoIn?: boolean; tat?: boolean }): KhaNang {
  if (!o.tty || o.cheDoIn || o.tat) return KHONG;
  if (env.CUONGMINI_HIEU_UNG === '0') return KHONG;
  if (env.CI || env.GITHUB_ACTIONS || env.TF_BUILD || env.BUILD_NUMBER) return KHONG;
  if ((env.TERM ?? '') === 'dumb') return KHONG;
  const tp = env.TERM_PROGRAM ?? '';
  // Trong tmux/screen: chuỗi OSC lạ bị nuốt hoặc chuyển sai chỗ ⇒ chỉ giữ tiêu đề (tmux đổi thành tên pane).
  const trongMux = Boolean(env.TMUX || env.STY) || tp === 'tmux' || /^screen/.test(env.TERM ?? '');
  const iterm = tp === 'iTerm.app';
  const ghostty = tp === 'ghostty';
  const tienDo = !trongMux && (Boolean(env.WT_SESSION) || env.ConEmuANSI === 'ON'
    || (iterm && phienBanToi(env.TERM_PROGRAM_VERSION, [3, 6, 6]))
    || (ghostty && phienBanToi(env.TERM_PROGRAM_VERSION, [1, 2])));
  return {
    tieuDe: env.CUONGMINI_KHONG_DAT_TIEU_DE !== '1',
    tienDo,
    bienIterm: iterm && !trongMux,
    thongBao: trongMux ? null : iterm ? 'osc9' : (ghostty || tp === 'WezTerm') ? 'osc777' : null,
  };
}

/** Bỏ ký tự điều khiển (ESC/BEL/C1 kết thúc sớm chuỗi OSC ⇒ phần còn lại in ra màn hình). */
export const sachOsc = (s: string, toiDa = 120): string => s.replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, toiDa);

export const OSC_TIEU_DE = (s: string): string => `\x1b]0;${sachOsc(s)}\x07`;
export const LUU_TIEU_DE = '\x1b[22;0t';
export const TRA_TIEU_DE = '\x1b[23;0t';
export type TrangThaiTienDo = 'chay' | 'cho' | 'loi' | 'xoa';
export function oscTienDo(t: TrangThaiTienDo): string {
  if (t === 'chay') return '\x1b]9;4;3;0\x07';
  if (t === 'cho') return '\x1b]9;4;4;100\x07';
  if (t === 'loi') return '\x1b]9;4;2;100\x07';
  return '\x1b]9;4;0;0\x07';
}
export const oscBienIterm = (ten: string, giaTri: string): string => `\x1b]1337;SetUserVar=${ten}=${Buffer.from(giaTri, 'utf8').toString('base64')}\x07`;
/** Thông báo gốc của terminal. `;` trong OSC 777 là dấu tách trường ⇒ thay bằng `,`. */
export function oscThongBao(kieu: 'osc9' | 'osc777', tieuDe: string, noiDung: string): string {
  if (kieu === 'osc9') return `\x1b]9;${sachOsc(`${tieuDe} · ${noiDung}`, 240)}\x07`;
  return `\x1b]777;notify;${sachOsc(tieuDe, 60).replace(/;/g, ',')};${sachOsc(noiDung, 240).replace(/;/g, ',')}\x07`;
}

export const KHUNG_XOAY = ['◐', '◓', '◑', '◒'];
const KHUNG_XOAY_ASCII = ['|', '/', '-', '\\'];

export type Pha = 'nghi' | 'chay' | 'duyet' | 'xong' | 'loi';
const BIEN: Record<Pha, string> = { nghi: 'idle', chay: 'working', duyet: 'waiting', xong: 'done', loi: 'error' };

/** Tiêu đề tab theo pha. Thuần. */
export function tieuDeTheoPha(pha: Pha, tenPhien: string, khung = 0, ascii = false): string {
  const ten = sachOsc(tenPhien, 60);
  if (pha === 'nghi') return ten ? `CuongMini · ${ten}` : 'CuongMini';
  const ky = pha === 'chay' ? (ascii ? KHUNG_XOAY_ASCII : KHUNG_XOAY)[khung % 4]
    : pha === 'duyet' ? (ascii ? '*' : '◉') : pha === 'xong' ? (ascii ? 'v' : '✓') : (ascii ? 'x' : '✗');
  const chu = pha === 'chay' ? L('đang làm', 'working') : pha === 'duyet' ? L('chờ duyệt', 'needs approval') : pha === 'xong' ? L('xong', 'done') : L('lỗi', 'error');
  return `${ky} ${ten || 'CuongMini'} · ${chu}`;
}

/**
 * Bộ phát: giữ trạng thái, CHỈ ghi khi đổi (không vẽ lại vô ích), tự xoay biểu tượng bằng hẹn giờ `unref`
 * (không giữ tiến trình sống), và dọn sạch ĐỒNG BỘ khi tiến trình thoát (kể cả crash).
 */
export class BoHieuUng {
  private kn: KhaNang;
  private pha: Pha = 'nghi';
  private ten = '';
  private khung = 0;
  private tieuDeCuoi = '';
  private tienDoCuoi: TrangThaiTienDo = 'xoa';
  private bienCuoi = '';
  private xoay: NodeJS.Timeout | null = null;
  private henXoaLoi: NodeJS.Timeout | null = null;
  private daBatDau = false;
  private daDon = false;
  private readonly donKhiThoat = () => this.ketThuc();

  constructor(kn: KhaNang, private readonly ghi: (s: string) => void = (s) => { try { if (process.stdout.writable) process.stdout.write(s); } catch { /* đã đóng */ } }, private readonly nhipMs = 330) {
    this.kn = kn;
  }

  get khaNang(): KhaNang { return this.kn; }
  get phaHienTai(): Pha { return this.pha; }

  /** Bật/tắt giữa phiên (`/config`). Tắt ⇒ dọn ngay (xoá tiến độ, trả tiêu đề). */
  datKhaNang(kn: KhaNang): void {
    const cu = this.kn;
    if (cu.tienDo && !kn.tienDo && this.tienDoCuoi !== 'xoa') { this.ghi(oscTienDo('xoa')); this.tienDoCuoi = 'xoa'; }
    if (cu.tieuDe && !kn.tieuDe && this.tieuDeCuoi) { this.ghi(`\x1b]0;\x07${TRA_TIEU_DE}`); this.tieuDeCuoi = ''; this.daBatDau = false; }
    this.kn = kn;
    this.ve();
  }

  batDau(): void {
    if (this.daBatDau) return;
    this.daBatDau = true;
    if (this.kn.tieuDe) this.ghi(LUU_TIEU_DE);
    process.on('exit', this.donKhiThoat);
    this.ve();
  }

  /** Đổi pha / tên phiên. Gọi thoải mái — không đổi gì thì không ghi gì. */
  dat(pha: Pha, tenPhien: string): void {
    const doiPha = pha !== this.pha;
    this.pha = pha;
    this.ten = tenPhien;
    if (doiPha) {
      if (this.henXoaLoi) { clearTimeout(this.henXoaLoi); this.henXoaLoi = null; }
      if (pha === 'loi') {
        this.henXoaLoi = setTimeout(() => { this.henXoaLoi = null; if (this.pha === 'loi' && this.kn.tienDo) { this.ghi(oscTienDo('xoa')); this.tienDoCuoi = 'xoa'; } }, 8000);
        this.henXoaLoi.unref?.();
      }
      if (pha === 'chay' && !this.xoay) {
        this.xoay = setInterval(() => { this.khung += 1; this.ve(); }, this.nhipMs);
        this.xoay.unref?.();
      } else if (pha !== 'chay' && this.xoay) { clearInterval(this.xoay); this.xoay = null; }
    }
    this.ve();
  }

  /** Người dùng đã quay lại (focus / gõ phím) ⇒ "✓ xong" / "✗ lỗi" về tiêu đề rảnh. */
  daXem(): void {
    if (this.pha === 'xong' || this.pha === 'loi') this.dat('nghi', this.ten);
  }

  private ve(): void {
    if (!this.daBatDau || this.daDon) return;
    if (this.kn.tieuDe) {
      const t = OSC_TIEU_DE(tieuDeTheoPha(this.pha, this.ten, this.khung, laAscii()));
      if (t !== this.tieuDeCuoi) { this.ghi(t); this.tieuDeCuoi = t; }
    }
    if (this.kn.tienDo) {
      const muon: TrangThaiTienDo = this.pha === 'chay' ? 'chay' : this.pha === 'duyet' ? 'cho' : this.pha === 'loi' ? (this.henXoaLoi ? 'loi' : 'xoa') : 'xoa';
      if (muon !== this.tienDoCuoi) { this.ghi(oscTienDo(muon)); this.tienDoCuoi = muon; }
    }
    if (this.kn.bienIterm) {
      const b = BIEN[this.pha];
      if (b !== this.bienCuoi) { this.ghi(oscBienIterm('cuongmini', b)); this.bienCuoi = b; }
    }
  }

  /** Thông báo gốc của terminal (iTerm2/ghostty/WezTerm). `false` = terminal không có ⇒ người gọi dùng thông báo hệ điều hành. */
  thongBao(tieuDe: string, noiDung: string): boolean {
    if (!this.kn.thongBao || this.daDon) return false;
    this.ghi(oscThongBao(this.kn.thongBao, tieuDe, noiDung));
    return true;
  }

  /** Dọn: xoá tiến độ, xoá user var, trả tiêu đề. Idempotent, ĐỒNG BỘ (chạy được trong `process.on('exit')`). */
  ketThuc(): void {
    if (this.daDon) return;
    this.daDon = true;
    if (this.xoay) { clearInterval(this.xoay); this.xoay = null; }
    if (this.henXoaLoi) { clearTimeout(this.henXoaLoi); this.henXoaLoi = null; }
    process.off('exit', this.donKhiThoat);
    if (!this.daBatDau) return;
    let s = '';
    if (this.kn.tienDo && this.tienDoCuoi !== 'xoa') s += oscTienDo('xoa');
    if (this.kn.bienIterm && this.bienCuoi) s += oscBienIterm('cuongmini', '');
    if (this.kn.tieuDe) s += `\x1b]0;\x07${TRA_TIEU_DE}`;
    if (s) this.ghi(s);
  }
}

/** Mô tả cho `/terminal-setup`. */
export function moTaKhaNang(kn: KhaNang): string[] {
  const co = (b: boolean) => (b ? L('có', 'yes') : L('không', 'no'));
  return [
    `${L('Tiêu đề tab xoay + trạng thái', 'Spinning tab title + status')}: ${co(kn.tieuDe)}`,
    `${L('Tiến độ OSC 9;4 (tab phát sáng / taskbar)', 'OSC 9;4 progress (tab glow / taskbar)')}: ${co(kn.tienDo)}`,
    `${L('Thông báo gốc của terminal', 'Native terminal notifications')}: ${kn.thongBao ? (kn.thongBao === 'osc9' ? 'OSC 9' : 'OSC 777') : L('không — dùng thông báo hệ điều hành', 'no — using OS notifications')}`,
    `${L('Biến iTerm2 `user.cuongmini` (đặt Badge = \\(user.cuongmini) để thấy)', 'iTerm2 variable `user.cuongmini` (set Badge = \\(user.cuongmini) to see it)')}: ${co(kn.bienIterm)}`,
  ];
}
