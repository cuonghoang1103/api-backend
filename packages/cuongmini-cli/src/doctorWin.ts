/**
 * `cuongmini doctor` — phần RIÊNG Windows (18/10/2026).
 *
 * Người dùng thật: "cài trên Windows lỗi nhiều lắm"; một bạn gõ `cuongmini` trong Windows Terminal (PowerShell)
 * nhận `CommandNotFoundException`. Đo trên runner windows-latest: trình cài thêm PATH NGƯỜI DÙNG đúng, nhưng
 * cửa sổ/terminal mở TRƯỚC khi cài (và Windows Terminal giữ môi trường của chính nó) không thấy thư mục lệnh;
 * Git Bash không gọi được `cuongmini.cmd` bằng tên trần; mintty không cho Node thấy TTY.
 * Doctor nói thẳng đang ở trường hợp nào và lệnh sửa cho ĐÚNG shell đang dùng.
 *
 * Phần thuần (nhận env/registry/danh sách tiến trình làm tham số) để test được trên macOS.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { L } from './i18n';
import type { MucKiem } from './doctor';

export type ShellWin = 'pwsh' | 'powershell' | 'cmd' | 'gitbash' | 'khac';

/** Thư mục lệnh mà install.ps1 tạo (mặc định `%LOCALAPPDATA%\CuongMini\bin`). */
export function thuMucLenhWin(env: NodeJS.ProcessEnv): string {
  return env.CUONGMINI_BIN_DIR || path.win32.join(env.LOCALAPPDATA || path.win32.join(env.USERPROFILE || 'C:\\Users\\Default', 'AppData', 'Local'), 'CuongMini', 'bin');
}

/** Mở rộng `%BIẾN%` như Windows (không phân biệt hoa thường); biến lạ giữ nguyên. */
export function moRongBien(s: string, env: NodeJS.ProcessEnv): string {
  const thuong = new Map(Object.entries(env).map(([k, v]) => [k.toLowerCase(), v]));
  return s.replace(/%([^%;]+)%/g, (cu, ten: string) => thuong.get(ten.toLowerCase()) ?? cu);
}

const cungThuMuc = (a: string, b: string): boolean => a.replace(/[\\/]+$/, '').toLowerCase() === b.replace(/[\\/]+$/, '').toLowerCase();

/** Danh sách PATH có chứa thư mục `dir` không (so như Windows: bỏ `\` cuối, không phân biệt hoa thường). */
export function pathCo(pathChuoi: string | undefined, dir: string, env: NodeJS.ProcessEnv): boolean {
  return (pathChuoi ?? '').split(';').filter(Boolean).some((m) => cungThuMuc(moRongBien(m, env), dir));
}

/** Đọc PATH NGƯỜI DÙNG trong registry (`reg query HKCU\Environment /v Path`). null = không đọc được. */
export function docPathNguoiDung(): string | null {
  const r = spawnSync('reg', ['query', 'HKCU\\Environment', '/v', 'Path'], { encoding: 'utf8', windowsHide: true, timeout: 5000 });
  if (r.status !== 0 || !r.stdout) return null;
  const m = /^\s*Path\s+REG_(?:EXPAND_)?SZ\s+(.*)$/im.exec(r.stdout);
  return m ? m[1]!.trim() : '';
}

/**
 * Shell đang gõ lệnh: đi NGƯỢC chuỗi tiến trình cha từ node. Chạy `cuongmini` trong PowerShell ⇒
 * node ← cmd.exe (chạy cuongmini.cmd) ← powershell/pwsh; trong cmd ⇒ node ← cmd (file .cmd chạy ngay trong cmd);
 * trong Git Bash ⇒ node ← bash (lệnh không đuôi) hoặc ← winpty.
 */
export function doShell(env: NodeJS.ProcessEnv, chuoiCha: readonly string[]): ShellWin {
  const ten = chuoiCha.map((t) => t.toLowerCase().replace(/\.exe$/, ''));
  for (let i = 0; i < ten.length; i++) {
    const t = ten[i]!;
    if (t === 'pwsh') return 'pwsh';
    if (t === 'powershell') return 'powershell';
    if (t === 'bash' || t === 'sh' || t === 'mintty' || t === 'winpty' || t === 'winpty-agent') return 'gitbash';
    if (t === 'cmd') {
      // cmd ngay trên node có thể chỉ là cmd chạy cuongmini.cmd cho PowerShell — xem tiếp tầng trên.
      const tren = ten[i + 1];
      if (tren === 'pwsh' || tren === 'powershell') return tren;
      if (tren === 'bash' || tren === 'sh') return 'gitbash';
      return 'cmd';
    }
  }
  if (env.MSYSTEM) return 'gitbash';
  return 'khac';
}

/** Tên tiến trình cha, ông, … của tiến trình này (một lần gọi PowerShell, tối đa 6 tầng). */
export function chuoiTienTrinhCha(pid: number = process.pid): string[] {
  const r = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
    'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId)|$($_.ParentProcessId)|$($_.Name)" }'],
  { encoding: 'utf8', windowsHide: true, timeout: 8000 });
  if (r.status !== 0 || !r.stdout) return [];
  const bang = new Map<number, { cha: number; ten: string }>();
  for (const d of r.stdout.split(/\r?\n/)) {
    const [a, b, ...c] = d.trim().split('|');
    if (a && b) bang.set(Number(a), { cha: Number(b), ten: c.join('|') });
  }
  const ra: string[] = [];
  let p = bang.get(pid)?.cha;
  for (let i = 0; i < 6 && p && bang.has(p); i++) {
    ra.push(bang.get(p)!.ten);
    p = bang.get(p)!.cha;
  }
  return ra;
}

const tenShell = (s: ShellWin): string => ({ pwsh: 'PowerShell 7', powershell: 'Windows PowerShell 5.1', cmd: 'cmd', gitbash: 'Git Bash', khac: L('không rõ', 'unknown') }[s]);

/** Lệnh nạp lại PATH NGAY trong cửa sổ đang mở, theo shell. */
export function lenhNapPath(shell: ShellWin, dir: string): string {
  if (shell === 'cmd') return `set "PATH=%PATH%;${dir}"`;
  if (shell === 'gitbash') return `export PATH="$PATH:/${dir.slice(0, 1).toLowerCase()}${dir.slice(2).replace(/\\/g, '/')}"`;
  return `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`;
}

export interface VaoKiemWin {
  env: NodeJS.ProcessEnv;
  /** Đường `cuongmini` mà `where` tìm thấy (nếu có) — cài vào thư mục tuỳ chỉnh thì kiểm thư mục đó. */
  lenhTimThay?: string | null;
  pathNguoiDung: string | null;
  chuoiCha: readonly string[];
  tty: { vao: boolean; ra: boolean };
}

/** Các dòng doctor riêng Windows: PATH (registry ↔ cửa sổ này), shell, TTY. Thuần. */
export function kiemWindowsThuan(v: VaoKiemWin): MucKiem[] {
  const ds: MucKiem[] = [];
  const dir = v.lenhTimThay && /cuongmini(\.cmd)?$/i.test(v.lenhTimThay) ? path.win32.dirname(v.lenhTimThay) : thuMucLenhWin(v.env);
  const shell = doShell(v.env, v.chuoiCha);
  const trongCuaSo = pathCo(v.env.Path ?? v.env.PATH, dir, v.env);
  const trongReg = v.pathNguoiDung === null ? null : pathCo(v.pathNguoiDung, dir, v.env);
  const ten = L('PATH (Windows)', 'PATH (Windows)');
  const duongDay = path.win32.join(dir, 'cuongmini.cmd');
  if (trongReg === false) {
    ds.push({ ten, muc: 'canh', chiTiet: L(`${dir} CHƯA có trong PATH người dùng — chạy lại lệnh cài: irm https://cuongthai.com/cli/install.ps1 | iex`, `${dir} is NOT on the user PATH — re-run the installer: irm https://cuongthai.com/cli/install.ps1 | iex`) });
  } else if (!trongCuaSo) {
    ds.push({
      ten, muc: 'canh',
      chiTiet: L(
        `PATH người dùng đã có ${dir}, nhưng cửa sổ này mở TRƯỚC khi cài nên chưa thấy lệnh. Đóng HẲN Windows Terminal (mọi cửa sổ) rồi mở lại, hoặc chạy ngay trong cửa sổ này: ${lenhNapPath(shell, dir)}  — hoặc gọi thẳng: "${duongDay}"`,
        `The user PATH has ${dir}, but this window was opened BEFORE the install. Fully close Windows Terminal (every window) and reopen, or run in this window: ${lenhNapPath(shell, dir)}  — or call it directly: "${duongDay}"`,
      ),
    });
  } else {
    ds.push({ ten, muc: 'ok', chiTiet: L(`${dir} có trong PATH người dùng và trong cửa sổ này`, `${dir} is on the user PATH and in this window`) });
  }

  const wt = v.env.WT_SESSION ? ' · Windows Terminal' : '';
  ds.push({ ten: 'Shell', muc: 'ok', chiTiet: `${tenShell(shell)}${wt}${v.chuoiCha.length ? ` (${v.chuoiCha.slice(0, 3).join(' ← ')})` : ''}` });

  const tenTty = 'TTY';
  if (v.tty.vao && v.tty.ra) ds.push({ ten: tenTty, muc: 'ok', chiTiet: L('có — phiên tương tác chạy được', 'yes — interactive mode works') });
  else if (shell === 'gitbash' && !v.env.WT_SESSION) {
    ds.push({ ten: tenTty, muc: 'canh', chiTiet: L('Git Bash (mintty) không cho Node thấy terminal. Gõ `cuongmini` (lệnh không đuôi tự dùng winpty), hoặc `winpty cuongmini.cmd`, hoặc mở Git Bash trong Windows Terminal / dùng PowerShell.', 'Git Bash (mintty) hides the terminal from Node. Type `cuongmini` (the extension-less command uses winpty), or `winpty cuongmini.cmd`, or run Git Bash inside Windows Terminal / use PowerShell.') });
  } else {
    ds.push({ ten: tenTty, muc: 'ok', chiTiet: L('lần chạy này không gắn terminal (qua ống/agent) — mở trực tiếp trong terminal thì phiên tương tác chạy được', 'this run is not attached to a terminal (piped/agent) — interactive mode works when run directly in a terminal') });
  }
  return ds;
}

/** Bản chạy thật (chỉ gọi trên Windows). */
export function kiemWindows(lenhTimThay?: string | null): MucKiem[] {
  return kiemWindowsThuan({
    env: process.env,
    lenhTimThay,
    pathNguoiDung: docPathNguoiDung(),
    chuoiCha: chuoiTienTrinhCha(),
    tty: { vao: Boolean(process.stdin.isTTY), ra: Boolean(process.stdout.isTTY) },
  });
}
