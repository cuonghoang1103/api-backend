/**
 * ============================================================
 * TERMINAL THẬT (PTY) — agent gõ tiếp được, người dùng gõ được mật khẩu
 * ============================================================
 *
 * Người dùng 26/09/2026: *"toàn quyền làm, lâu cũng được — AI Code của app tôi
 * sẽ dùng lâu dài cho dự án lớn"*, về điểm yếu lớn nhất còn lại của agent.
 *
 * ─── ĐIỂM YẾU NÀY LÀ GÌ ───
 * `run_command` và lệnh nền chạy qua `child_process` với stdin ĐÓNG (xem chú
 * thích dài ở `lenhNen.ts`): lệnh nào hỏi lại — `ssh` hỏi mật khẩu, `sudo`,
 * `npm init`, `git` mở trình soạn thảo, bộ cài hỏi "Continue? [y/N]" — đều treo
 * tới hết giờ. Đóng stdin là ĐÚNG cho hai đường đó (mở ra thì treo vĩnh viễn),
 * nhưng nó có nghĩa là agent không bao giờ làm được một việc cần hỏi-đáp.
 *
 * Mở stdin cũng không đủ: `ssh`, `sudo`, `passwd` đọc mật khẩu từ `/dev/tty`
 * chứ KHÔNG từ stdin, và chúng biết mình không có terminal thật. Chỉ một PTY
 * (terminal giả lập đúng nghĩa, cái VS Code dùng) mới làm chúng hỏi và chờ.
 *
 * ─── HAI NGƯỜI CÙNG GÕ VÀO MỘT TERMINAL ───
 * Agent gõ lệnh, đọc đầu ra, trả lời "y". Người dùng NHÌN thấy cùng terminal đó
 * trong khung ở đáy màn hình và gõ thẳng vào — đó là cách mật khẩu đi vào: qua
 * bàn phím của người dùng, không bao giờ qua model (model không biết mật khẩu,
 * và không được biết). App phát hiện dấu hiệu "đang hỏi mật khẩu" (`choNhap`)
 * để agent dừng lại nhờ người dùng thay vì đoán.
 *
 * ─── AN TOÀN ───
 *  · Trần số phiên cho cả app; dọn theo CUỘC và lúc thoát app (cùng lý do lệnh
 *    nền: tiến trình sống lâu hơn cuộc hội thoại sinh ra nó).
 *  · Đệm có trần; phần đưa cho model đã gỡ mã màu ANSI và cắt đuôi.
 *  · Mọi thứ AGENT gõ đều đi qua thẻ duyệt ở `tools.ts` (terminal_mo/gui) —
 *    tệp này không tự quyết gì về quyền.
 *
 * ─── KHÔNG CÓ PTY THÌ SAO ───
 * `@lydell/node-pty` là module native có sẵn bản dựng cho 6 tổ hợp hệ điều
 * hành × kiến trúc. Nạp hỏng (thiếu bản dựng cho máy lạ) ⇒ lùi về ỐNG thường
 * (`child_process` với stdin MỞ): vẫn trả lời được "y/n" của phần lớn công cụ,
 * chỉ không có `/dev/tty`. `coPty()` cho biết đang ở chế độ nào để nói thật với
 * người dùng thay vì hứa một thứ không có.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import os from 'node:os';

/** Giao diện tối thiểu của một phiên — PTY thật và ống lùi cùng khớp. */
interface TienTrinh {
  ghi(du: string): void;
  coLai(cot: number, dong: number): void;
  giet(): void;
  pid: number;
}

interface PtyModule {
  spawn(
    file: string,
    args: string[],
    opts: { name: string; cols: number; rows: number; cwd: string; env: NodeJS.ProcessEnv; useConpty?: boolean },
  ): {
    pid: number;
    onData(cb: (d: string) => void): unknown;
    onExit(cb: (e: { exitCode: number; signal?: number }) => void): unknown;
    write(d: string): void;
    resize(c: number, r: number): void;
    kill(sig?: string): void;
  };
}

let ptyMod: PtyModule | null | undefined;
let loiNapPty: string | null = null;

/** Nạp PTY một lần, lười — module native chỉ đụng tới khi thật sự mở terminal. */
function napPty(): PtyModule | null {
  if (ptyMod !== undefined) return ptyMod;
  try {
    // `require` động: để vite KHÔNG gói module native vào bundle (nó phải nằm
    // ngoài asar, xem `asarUnpack` trong electron-builder.yml).
    /* Bản dựng là CJS nên có sẵn `require`; bộ kiểm (vitest, ESM) thì không —
       khi đó tạo một `require` từ vị trí tệp này. */
    const nap = typeof require === 'function' ? require : createRequire(import.meta.url);
    ptyMod = nap('@lydell/node-pty') as PtyModule;
  } catch (e) {
    ptyMod = null;
    loiNapPty = (e as Error).message;
  }
  return ptyMod;
}

/** Có terminal thật (PTY) không. `false` ⇒ đang dùng ống lùi. */
export function coPty(): { co: boolean; loi: string | null } {
  return { co: napPty() !== null, loi: loiNapPty };
}

/** Tối đa mấy terminal cùng lúc, tính cho CẢ APP. */
const MAX_PHIEN = 10;
/** Giữ bấy nhiêu ký tự đầu ra THÔ gần nhất (để khung xterm vẽ lại khi mở lại). */
const TRAN_DEM = 400_000;

export type NguonTerminal = 'agent' | 'nguoiDung';

export interface PhienTerminal {
  id: string;
  cuocId: string;
  cwd: string;
  tieuDe: string;
  nguon: NguonTerminal;
  pty: boolean;
  dangChay: boolean;
  ma: number | null;
  batDau: number;
}

interface PhienNoi extends PhienTerminal {
  tt: TienTrinh;
  dem: string;
  /** Chỉ số trong `dem` mà agent đã đọc tới — lần đọc sau chỉ trả phần mới. */
  daDocAgent: number;
  /** Lần cuối có đầu ra — để đo "đã im" (lệnh đang chờ nhập hoặc đã xong). */
  lanCuoi: number;
  /**
   * Lần cuối có ai GÕ vào. "Đã lắng" chỉ tính khi có đầu ra SAU lần gõ này —
   * nếu không, shell đăng nhập khởi động chậm (nạp nvm/conda mất cả giây) làm
   * ta kết luận "im rồi" trước cả khi lệnh kịp chạy. Đo thật khi viết bộ kiểm.
   */
  lanGhi: number;
  cho: Set<() => void>;
}

const bang = new Map<string, PhienNoi>();
let dem = 0;

type NgheDuLieu = (e: { id: string; du: string }) => void;
type NgheTrangThai = (p: PhienTerminal & { choNhap?: ChoNhap }) => void;
let phatDuLieu: NgheDuLieu = () => {};
let phatTrangThai: NgheTrangThai = () => {};

/** Main gắn hàm phát sự kiện tới mọi cửa sổ (xem `ipc/terminal.ts`). */
export function ganPhatSuKien(du: NgheDuLieu, tt: NgheTrangThai): void {
  phatDuLieu = du;
  phatTrangThai = tt;
}

function congKhai(p: PhienNoi): PhienTerminal {
  const { id, cuocId, cwd, tieuDe, nguon, pty, dangChay, ma, batDau } = p;
  return { id, cuocId, cwd, tieuDe, nguon, pty, dangChay, ma, batDau };
}

/**
 * Shell cho từng hệ điều hành.
 *
 * Windows: PowerShell — có sẵn trên mọi máy từ Windows 7, và là thứ người dùng
 * Windows mở khi nghe "terminal". `-NoLogo` bỏ dòng quảng cáo đầu phiên.
 * macOS/Linux: shell ĐĂNG NHẬP của người dùng (`-l`) để nạp `.zprofile`/
 * `.bash_profile` — nếu không, PATH thiếu nvm/Homebrew/pyenv và `node` báo
 * "command not found" dù người dùng gõ ở Terminal thì chạy.
 */
export function shellMacDinh(): { file: string; args: string[] } {
  if (process.platform === 'win32') {
    return { file: 'powershell.exe', args: ['-NoLogo'] };
  }
  const sh = process.env.SHELL && process.env.SHELL.startsWith('/') ? process.env.SHELL : '/bin/bash';
  return { file: sh, args: ['-l'] };
}

function moiTruong(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' };
  /* Biến riêng của Electron lọt vào shell con làm `electron`/`node` trong dự
     của người dùng chạy sai chế độ. */
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.ELECTRON_NO_ATTACH_CONSOLE;
  return env;
}

function taoTienTrinh(cwd: string, cot: number, dong: number, khiRa: (d: string) => void, khiThoat: (ma: number) => void): { tt: TienTrinh; pty: boolean } {
  const { file, args } = shellMacDinh();
  const mod = napPty();
  if (mod) {
    const p = mod.spawn(file, args, {
      name: 'xterm-256color', cols: cot, rows: dong, cwd, env: moiTruong(),
      // ConPTY: đường chính thức của Windows 10+; winpty cũ hay vỡ tiếng Việt.
      ...(process.platform === 'win32' ? { useConpty: true } : {}),
    });
    p.onData(khiRa);
    p.onExit((e) => khiThoat(e.exitCode));
    return {
      pty: true,
      tt: {
        pid: p.pid,
        ghi: (d) => p.write(d),
        coLai: (c, r) => { try { p.resize(Math.max(20, c), Math.max(5, r)); } catch { /* đã thoát */ } },
        giet: () => { try { p.kill(); } catch { /* đã thoát */ } },
      },
    };
  }
  /* ── Ống lùi ── stdin MỞ để trả lời được y/n. Không có tty nên shell không
     tương tác: mỗi dòng gõ vào được thực thi như script. */
  const con: ChildProcess = spawn(file, process.platform === 'win32' ? ['-NoLogo', '-NoExit', '-Command', '-'] : ['-s'], {
    cwd, env: moiTruong(), windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
  });
  con.stdout?.on('data', (b: Buffer) => khiRa(b.toString('utf8')));
  con.stderr?.on('data', (b: Buffer) => khiRa(b.toString('utf8')));
  con.on('close', (ma) => khiThoat(ma ?? -1));
  con.on('error', (e) => { khiRa(`\r\n[không mở được shell: ${e.message}]\r\n`); khiThoat(-1); });
  return {
    pty: false,
    tt: {
      pid: con.pid ?? -1,
      ghi: (d) => { try { con.stdin?.write(d.replace(/\r(?!\n)/g, '\n')); } catch { /* đã đóng */ } },
      coLai: () => {},
      giet: () => { try { con.kill(); } catch { /* đã thoát */ } },
    },
  };
}

export interface KetQuaMo { ok: boolean; phien?: PhienTerminal; loi?: string }

/**
 * Mở một terminal ở `cwd`. Có `lenh` ⇒ gõ lệnh đó vào ngay (như người dùng gõ
 * rồi Enter) — shell vẫn SỐNG sau khi lệnh xong, nên agent gõ tiếp được.
 */
export function moTerminal(o: {
  cuocId: string; cwd: string; nguon: NguonTerminal; tieuDe?: string; lenh?: string; cot?: number; dong?: number;
}): KetQuaMo {
  const song = [...bang.values()].filter((p) => p.dangChay);
  if (song.length >= MAX_PHIEN) {
    return { ok: false, loi: `Đã mở ${MAX_PHIEN} terminal. Đóng bớt (terminal_dong) rồi mở lại.` };
  }
  const id = `t${++dem}`;
  const cwd = o.cwd || os.homedir();
  let p!: PhienNoi;
  const khiRa = (d: string): void => {
    if (!p) return;
    p.dem = p.dem + d;
    if (p.dem.length > TRAN_DEM) {
      const bo = p.dem.length - TRAN_DEM;
      p.dem = p.dem.slice(bo);
      p.daDocAgent = Math.max(0, p.daDocAgent - bo);
    }
    p.lanCuoi = Date.now();
    phatDuLieu({ id, du: d });
    for (const f of p.cho) f();
  };
  const khiThoat = (ma: number): void => {
    if (!p) return;
    p.dangChay = false;
    p.ma = ma;
    phatTrangThai(congKhai(p));
    for (const f of p.cho) f();
  };
  let tao: { tt: TienTrinh; pty: boolean };
  try {
    tao = taoTienTrinh(cwd, o.cot ?? 120, o.dong ?? 30, khiRa, khiThoat);
  } catch (e) {
    return { ok: false, loi: `Không mở được terminal: ${(e as Error).message}` };
  }
  p = {
    id, cuocId: o.cuocId, cwd, nguon: o.nguon, pty: tao.pty,
    tieuDe: (o.tieuDe || o.lenh || (o.nguon === 'agent' ? 'Agent' : 'Terminal')).slice(0, 60),
    dangChay: true, ma: null, batDau: Date.now(),
    tt: tao.tt, dem: '', daDocAgent: 0, lanCuoi: 0, lanGhi: Date.now(), cho: new Set(),
  };
  bang.set(id, p);
  phatTrangThai(congKhai(p));
  if (o.lenh) {
    /* Chờ shell in DẤU NHẮC (byte đầu tiên) rồi mới gõ — gõ lúc shell còn
       đang nạp `.zprofile` thì ký tự bị nuốt hoặc in lặp. Lưới đỡ 3 giây cho
       shell cấu hình không in gì. */
    const lenh = o.lenh;
    const batDauCho = Date.now();
    const thuGo = (): void => {
      if (!p.dangChay) return;
      if (p.dem.length === 0 && Date.now() - batDauCho < 3000) { setTimeout(thuGo, 60); return; }
      setTimeout(() => { if (p.dangChay) { p.lanGhi = Date.now(); p.tt.ghi(`${lenh}\r`); } }, 120);
    };
    p.lanGhi = Date.now() + 60_000; // chưa gõ: chặn "đã lắng" cho tới lúc gõ thật
    setTimeout(thuGo, 60);
  }
  return { ok: true, phien: congKhai(p) };
}

/** Gõ vào terminal. Trả `false` nếu phiên không còn. */
export function guiVao(id: string, du: string): boolean {
  const p = bang.get(id);
  if (!p || !p.dangChay) return false;
  p.lanGhi = Date.now();
  p.tt.ghi(du);
  return true;
}

export function coLai(id: string, cot: number, dong: number): void {
  bang.get(id)?.tt.coLai(Math.floor(cot), Math.floor(dong));
}

export function dongTerminal(id: string): boolean {
  const p = bang.get(id);
  if (!p) return false;
  p.tt.giet();
  bang.delete(id);
  p.dangChay = false;
  phatTrangThai({ ...congKhai(p), dangChay: false });
  return true;
}

export function dsTerminal(cuocId?: string): PhienTerminal[] {
  return [...bang.values()].filter((p) => !cuocId || p.cuocId === cuocId).map(congKhai);
}

export function layPhien(id: string): PhienTerminal | null {
  const p = bang.get(id);
  return p ? congKhai(p) : null;
}

/** Toàn bộ đệm THÔ — khung xterm dùng để vẽ lại khi vừa mở. */
export function docDemTho(id: string): string {
  return bang.get(id)?.dem ?? '';
}

/** Dọn mọi terminal của một cuộc (đóng tab). */
export function dongTerminalCua(cuocId: string): number {
  let n = 0;
  for (const p of [...bang.values()]) if (p.cuocId === cuocId) { dongTerminal(p.id); n++; }
  return n;
}

/** Dọn tất cả (thoát app). */
export function dongMoiTerminal(): void {
  for (const id of [...bang.keys()]) dongTerminal(id);
}

// ─── Phần dành cho AGENT ─────────────────────────────────────────────

/**
 * Gỡ mã điều khiển ANSI và dựng lại dòng như MẮT NGƯỜI thấy.
 *
 * Thanh tiến trình vẽ đè bằng `\r` — để nguyên thì model đọc 300 bản sao của
 * cùng một dòng "Downloading 12%… 13%…". Lấy phần SAU `\r` cuối mỗi dòng là
 * đúng thứ terminal đang hiện.
 */
export function lamSach(tho: string): string {
  const khongMau = tho
    // CSI … (màu, di chuyển con trỏ, xoá dòng), OSC … BEL/ST (tiêu đề cửa sổ), và mã đơn.
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b[@-Z\\-_]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, (c) => (c === '\x08' ? '\x08' : ''));
  return khongMau
    .split('\n')
    .map((dong) => {
      const d = dong.endsWith('\r') ? dong.slice(0, -1) : dong;
      const sau = d.lastIndexOf('\r');
      let s = sau >= 0 ? d.slice(sau + 1) : d;
      // Backspace: xoá ký tự trước nó.
      while (s.includes('\x08')) s = s.replace(/[^\x08]\x08/, '').replace(/^\x08+/, '');
      return s;
    })
    .join('\n');
}

export type ChoNhap = 'matKhau' | 'xacNhan' | null;

/**
 * Terminal có đang CHỜ người gõ gì không — đọc từ vài dòng cuối.
 *
 * Chỉ là phỏng đoán theo chữ, nên nó chỉ dùng để NHẮC: agent thấy `matKhau`
 * thì phải dừng lại nhờ người dùng gõ (model không biết mật khẩu và không được
 * đoán), thấy `xacNhan` thì tự quyết có trả lời hay hỏi lại.
 */
export function doChoNhap(sach: string): ChoNhap {
  const cuoi = sach.trimEnd().split('\n').slice(-3).join('\n');
  const dongCuoi = cuoi.split('\n').pop() ?? '';
  if (/(password|passphrase|mật khẩu|pin)[^\n]*[:：]\s*$/i.test(dongCuoi)
    || /\[sudo\] password for/i.test(cuoi)
    || /Enter passphrase/i.test(cuoi)) return 'matKhau';
  if (/\[y\/n\]|\(y\/n\)|\[Y\/n\]|\[y\/N\]|\(yes\/no(\/\[fingerprint\])?\)|\? \(Y\/n\)|\(Y\/n\)|Proceed\?|Continue\?|Ok to proceed\?/i.test(dongCuoi)) return 'xacNhan';
  return null;
}

export interface DocAgent {
  moi: string;
  dangChay: boolean;
  ma: number | null;
  choNhap: ChoNhap;
  catBot: boolean;
}

/** Trần phần đưa cho model mỗi lần đọc. Giữ ĐUÔI — dòng mới nhất quan trọng nhất. */
const TRAN_DOC_AGENT = 12_000;

/**
 * Chờ terminal "lắng xuống" rồi trả phần đầu ra MỚI cho agent.
 *
 * Lắng = không có byte mới trong `imMs`, HOẶC shell đã thoát, HOẶC hết `toiDaMs`.
 * Đây là cách duy nhất biết một lệnh tương tác đã tới chỗ chờ nhập: nó in lời
 * hỏi rồi IM. Không có tín hiệu nào chính xác hơn từ phía ngoài một terminal.
 */
export async function choVaDoc(id: string, o: { imMs?: number; toiDaMs?: number; signal?: AbortSignal } = {}): Promise<DocAgent | null> {
  const p = bang.get(id);
  if (!p) return null;
  const imMs = o.imMs ?? 1500;
  const toiDaMs = Math.max(imMs, o.toiDaMs ?? 15_000);
  const batDau = Date.now();
  await new Promise<void>((xong) => {
    let hen: ReturnType<typeof setTimeout> | null = null;
    const ket = (): void => {
      if (hen) clearTimeout(hen);
      p.cho.delete(kiem);
      o.signal?.removeEventListener('abort', ket);
      xong();
    };
    const kiem = (): void => {
      if (!p.dangChay) { ket(); return; }
      const conToiDa = toiDaMs - (Date.now() - batDau);
      /* Chưa có đầu ra nào SAU lần gõ gần nhất ⇒ chưa được coi là lắng. */
      const coRaMoi = p.lanCuoi > p.lanGhi;
      const conIm = coRaMoi ? imMs - (Date.now() - p.lanCuoi) : imMs;
      if (conToiDa <= 0 || (coRaMoi && conIm <= 0)) { ket(); return; }
      if (hen) clearTimeout(hen);
      hen = setTimeout(kiem, Math.max(50, Math.min(conIm > 0 ? conIm : imMs, conToiDa)));
    };
    p.cho.add(kiem);
    o.signal?.addEventListener('abort', ket, { once: true });
    kiem();
  });
  const tho = p.dem.slice(p.daDocAgent);
  p.daDocAgent = p.dem.length;
  const choNhap = p.dangChay ? doChoNhap(lamSach(p.dem.slice(-2000))) : null;
  /* Báo giao diện: đang hỏi mật khẩu ⇒ khung Terminal tự mở và nhắc người dùng
     gõ. Không báo thì agent nói "gõ mật khẩu vào terminal" mà khung đang đóng. */
  if (choNhap) phatTrangThai({ ...congKhai(p), choNhap });
  let sach = lamSach(tho);
  const catBot = sach.length > TRAN_DOC_AGENT;
  if (catBot) sach = `…(bỏ ${sach.length - TRAN_DOC_AGENT} ký tự đầu)…\n${sach.slice(-TRAN_DOC_AGENT)}`;
  return {
    moi: sach,
    dangChay: p.dangChay,
    ma: p.ma,
    // Đo trên đuôi của TOÀN BỘ đệm, không chỉ phần mới: lời hỏi có thể đã in
    // ra từ lượt đọc trước mà người dùng vẫn chưa trả lời.
    choNhap,
    catBot,
  };
}

/**
 * Terminal có đang chờ nhập không — NHÌN TRỘM, không đẩy con trỏ đọc của
 * agent. Dùng trước khi gõ: một lần "kiểm" mà tiêu mất phần đầu ra chưa đọc
 * thì agent mất luôn đoạn đó.
 */
export function choNhapHienTai(id: string): ChoNhap {
  const p = bang.get(id);
  return p?.dangChay ? doChoNhap(lamSach(p.dem.slice(-2000))) : null;
}

/** Phím đặc biệt agent được gửi — chỉ những thứ cần để điều khiển chương trình tương tác. */
export const PHIM: Record<string, string> = {
  enter: '\r',
  ctrl_c: '\x03',
  ctrl_d: '\x04',
  ctrl_z: '\x1a',
  tab: '\t',
  esc: '\x1b',
  len: '\x1b[A',
  xuong: '\x1b[B',
  phai: '\x1b[C',
  trai: '\x1b[D',
  backspace: '\x7f',
  q: 'q',
};
