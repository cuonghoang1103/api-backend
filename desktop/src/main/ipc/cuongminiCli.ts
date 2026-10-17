/**
 * ============================================================
 * CÀI CUONGMINI CLI CHO NGƯỜI DÙNG — một nút, máy mới tinh cũng xong
 * ============================================================
 *
 * Người dùng 17/10/2026: *"thay nút Cài CuongMini trên OpenCode thành setup
 * CuongMini CLI … từ một máy mới mua về chưa cài gì, tự kiểm tra và cài full
 * để user chỉ việc vào cmd, iTerm, terminal gõ `cuongmini` là dùng"*.
 *
 * Chạy ở TIẾN TRÌNH CHÍNH, không nhờ agent — cùng lý do như bản OpenCode
 * (`opencode.ts`): cài một công cụ toàn cục không cần thư mục dự án, không tốn
 * lượt gọi model, và chạy y hệt nhau mọi lần.
 *
 * Bốn bước, đều có thể làm lại an toàn:
 *  1. chạy script cài CHÍNH THỨC (`/cli/install.sh` · `/cli/install.ps1`) — nó tự
 *     tải Node nếu máy chưa có/quá cũ (kiểm SHA-256), tải gói CLI (kiểm SHA-256),
 *     tạo lệnh `cuongmini` + thêm PATH. Một nguồn sự thật với người cài tay.
 *  2. ĐĂNG NHẬP SẴN: đổi phiên của app lấy một token mới (`/auth/refresh`) rồi ghi
 *     `~/.cuongmini/phien.json` quyền 0600 — đúng định dạng CLI đọc. Token không
 *     đi qua hội thoại AI, không vào log nào.
 *  3. kiểm `cuongmini --version` bằng ĐƯỜNG TUYỆT ĐỐI (PATH của app GUI không phải
 *     PATH của terminal — xem chú thích ở `opencode.ts`).
 *  4. (tuỳ chọn) mở Terminal/iTerm/PowerShell ở thư mục dự án và chạy luôn.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { net, type WebContents } from 'electron';
import { API_ORIGIN, WEB_ORIGIN } from '../config';
import { readStoredSession } from './auth';
import { handle } from './index';

const laWin = process.platform === 'win32';

/** Thư mục gốc của CLI — trùng `packages/cuongmini-cli/src/phien.ts`. */
function thuMucGoc(): string {
  return join(homedir(), '.cuongmini');
}

/** Lệnh `cuongmini` mà script cài tạo ra. */
function duongLenh(): string {
  if (laWin) return join(process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local'), 'CuongMini', 'bin', 'cuongmini.cmd');
  return join(homedir(), '.local', 'bin', 'cuongmini');
}

/** Chạy một lệnh, gom đầu ra; từng dòng bắn ra `moiDong` để giao diện hiện tiến độ. */
function chay(
  lenh: string, thamSo: string[], o: { hanMs: number; env?: NodeJS.ProcessEnv; moiDong?: (d: string) => void },
): Promise<{ ma: number | null; chu: string; loi?: string }> {
  return new Promise((xong) => {
    let chu = '';
    let du = '';
    let da = false;
    const ket = (kq: { ma: number | null; chu: string; loi?: string }) => { if (!da) { da = true; xong(kq); } };
    const con = spawn(lenh, thamSo, { windowsHide: true, env: { ...process.env, NO_COLOR: '1', ...o.env } });
    const gom = (b: Buffer) => {
      const s = b.toString();
      chu = (chu + s).slice(-16_000);
      du += s;
      const dong = du.split(/\r?\n/);
      du = dong.pop() ?? '';
      for (const d of dong) if (d.trim()) o.moiDong?.(d);
    };
    con.stdout?.on('data', gom);
    con.stderr?.on('data', gom);
    const hen = setTimeout(() => { try { con.kill(); } catch { /* đã thoát */ } ket({ ma: null, chu, loi: 'Quá thời gian chờ — mạng chậm?' }); }, o.hanMs);
    hen.unref?.();
    con.on('error', (e) => { clearTimeout(hen); ket({ ma: null, chu, loi: e.message }); });
    con.on('close', (ma) => { clearTimeout(hen); if (du.trim()) o.moiDong?.(du); ket({ ma, chu }); });
  });
}

async function phienBanCli(): Promise<string | null> {
  const p = duongLenh();
  if (!existsSync(p)) return null;
  const r = laWin
    ? await chay('cmd.exe', ['/d', '/c', p, '--version'], { hanMs: 20_000 })
    : await chay(p, ['--version'], { hanMs: 20_000 });
  const v = /\d+\.\d+\.\d+/.exec(r.chu)?.[0];
  return r.ma === 0 && v ? v : null;
}

/** Terminal sẽ mở: iTerm nếu có (người dùng hay dùng), không thì Terminal của máy. */
function tenTerminal(): string {
  if (process.platform === 'darwin') return existsSync('/Applications/iTerm.app') ? 'iTerm' : 'Terminal';
  if (laWin) return 'PowerShell';
  return 'Terminal';
}

/** Nháy đơn cho shell POSIX: `a'b` ⇒ `'a'\''b'`. */
const nhayShell = (s: string): string => `'${s.replace(/'/g, `'\\''`)}'`;
/** Chuỗi trong AppleScript: thoát `\` và `"`. */
const nhayApple = (s: string): string => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function registerCuongMiniCliHandlers(): void {
  handle('cli:doMay', async () => ({
    heDieuHanh: process.platform,
    duongLenh: duongLenh(),
    phienBan: await phienBanCli(),
    daDangNhap: existsSync(join(thuMucGoc(), 'phien.json')),
    terminal: tenTerminal(),
  }));

  handle('cli:cai', async (_input, event) => {
    const gui: WebContents = event.sender;
    const bao = (buoc: string, dong?: string) => { if (!gui.isDestroyed()) gui.send('cli:tienDo', { buoc, dong }); };
    const tam = await mkdtemp(join(tmpdir(), 'cuongmini-cai-'));
    try {
      // 1. Tải script cài chính thức bằng mạng của Electron (máy Linux tối giản có thể thiếu curl).
      bao('tai', 'Đang tải trình cài…');
      const ten = laWin ? 'install.ps1' : 'install.sh';
      const r = await net.fetch(`${WEB_ORIGIN}/cli/${ten}?t=${Date.now()}`);
      if (!r.ok) throw new Error(`Không tải được trình cài (HTTP ${r.status}).`);
      const file = join(tam, ten);
      await writeFile(file, Buffer.from(await r.arrayBuffer()));

      // 2. Chạy nó — script tự lo Node, gói CLI, PATH. Mỗi dòng log ⇒ giao diện.
      bao('cai', 'Đang cài (máy chưa có Node thì tải luôn — có thể mất 1–2 phút)…');
      const kq = laWin
        ? await chay('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', file], { hanMs: 15 * 60_000, moiDong: (d) => bao('cai', d) })
        : await chay('/bin/bash', [file], { hanMs: 15 * 60_000, moiDong: (d) => bao('cai', d) });
      if (kq.ma !== 0) return { ok: false as const, loi: kq.loi ?? `Trình cài thoát với mã ${kq.ma}.`, log: kq.chu };

      // 3. Đăng nhập sẵn bằng phiên của app.
      bao('dangNhap', 'Đang đăng nhập CLI bằng tài khoản của app…');
      const dn = await dangNhapCli().catch((e: Error) => ({ ok: false as const, loi: e.message }));

      // 4. Kiểm bằng đường tuyệt đối.
      bao('kiem', 'Đang kiểm lệnh cuongmini…');
      const v = await phienBanCli();
      if (!v) return { ok: false as const, loi: 'Đã chạy trình cài nhưng lệnh cuongmini chưa chạy được.', log: kq.chu };
      return {
        ok: true as const, phienBan: v, duongLenh: duongLenh(), terminal: tenTerminal(),
        daDangNhap: dn.ok, ...(dn.ok ? {} : { loiDangNhap: dn.loi }), log: kq.chu,
      };
    } catch (e) {
      return { ok: false as const, loi: (e as Error).message };
    } finally {
      await rm(tam, { recursive: true, force: true }).catch(() => undefined);
    }
  });

  handle('cli:dangNhap', () => dangNhapCli());

  handle('cli:moTerminal', async ({ thuMuc }) => {
    const p = duongLenh();
    if (!existsSync(p)) return { ok: false as const, loi: 'Chưa cài CuongMini CLI.' };
    const noi = thuMuc && existsSync(thuMuc) ? thuMuc : homedir();
    if (process.platform === 'darwin') {
      const lenh = `cd ${nhayShell(noi)} && ${nhayShell(p)}`;
      const kich = tenTerminal() === 'iTerm'
        ? ['-e', 'tell application "iTerm"', '-e', 'activate', '-e', `create window with default profile command ${nhayApple(`/bin/zsh -lc ${nhayShell(`${lenh}; exec /bin/zsh -l`)}`)}`, '-e', 'end tell']
        : ['-e', `tell application "Terminal" to do script ${nhayApple(lenh)}`, '-e', 'tell application "Terminal" to activate'];
      const r = await chay('/usr/bin/osascript', kich, { hanMs: 15_000 });
      return r.ma === 0 ? { ok: true as const } : { ok: false as const, loi: r.loi ?? r.chu.slice(-300) };
    }
    if (laWin) {
      // `start` mở cửa sổ mới; PowerShell giữ cửa sổ sau khi cuongmini thoát (-NoExit).
      const ps = `Set-Location -LiteralPath '${noi.replace(/'/g, "''")}'; & '${p.replace(/'/g, "''")}'`;
      const con = spawn('cmd.exe', ['/d', '/c', 'start', '""', 'powershell.exe', '-NoExit', '-Command', ps], { windowsHide: false, detached: true, stdio: 'ignore' });
      con.unref();
      return { ok: true as const };
    }
    // Linux: thử lần lượt các terminal phổ biến.
    for (const [t, a] of [
      ['x-terminal-emulator', ['-e']], ['gnome-terminal', ['--']], ['konsole', ['-e']], ['xfce4-terminal', ['-x']], ['xterm', ['-e']],
    ] as Array<[string, string[]]>) {
      const ok = await new Promise<boolean>((xong) => {
        const con = spawn(t, [...a, 'bash', '-lc', `cd ${nhayShell(noi)} && ${nhayShell(p)}; exec bash`], { cwd: noi, detached: true, stdio: 'ignore' });
        con.on('error', () => xong(false));
        con.on('spawn', () => { con.unref(); xong(true); });
      });
      if (ok) return { ok: true as const };
    }
    return { ok: false as const, loi: 'Không tìm thấy ứng dụng terminal nào — mở terminal rồi gõ cuongmini.' };
  });
}

/**
 * Đăng nhập CLI bằng phiên của app: đổi lấy token MỚI (không dùng chung chuỗi
 * token với app — đăng xuất một bên không kéo bên kia) rồi ghi file phiên của CLI.
 */
async function dangNhapCli(): Promise<{ ok: true; ten: string } | { ok: false; loi: string }> {
  const phien = readStoredSession();
  if (!phien?.sessionToken) return { ok: false, loi: 'App chưa đăng nhập.' };
  const r = await fetch(`${API_ORIGIN}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { authorization: `Bearer ${phien.sessionToken}` },
    signal: AbortSignal.timeout(20_000),
  });
  const j = await r.json().catch(() => ({})) as { data?: { userId?: number; username?: string; fullName?: string; email?: string; token?: string } };
  const d = j.data;
  if (!r.ok || !d?.token || typeof d.userId !== 'number') return { ok: false, loi: `Máy chủ trả HTTP ${r.status}.` };
  const goc = thuMucGoc();
  await mkdir(goc, { recursive: true, mode: 0o700 });
  const file = join(goc, 'phien.json');
  const noiDung = { userId: d.userId, username: d.username, fullName: d.fullName, email: d.email, token: d.token, luu: new Date().toISOString() };
  await writeFile(file, `${JSON.stringify(noiDung, null, 2)}\n`, { mode: 0o600 });
  await chmod(file, 0o600).catch(() => undefined); // Windows: quyền POSIX không áp dụng
  return { ok: true, ten: d.fullName || d.username || 'bạn' };
}
