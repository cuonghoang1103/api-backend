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
 *  4. (tuỳ chọn) mở Terminal/iTerm/Windows Terminal ở thư mục dự án và chạy luôn.
 *
 * WINDOWS (sửa 18/10/2026 — người dùng: "ấn nút trên app desktop không được"):
 *  Bản cũ ghi install.ps1 ra file (UTF-8 KHÔNG BOM) rồi `powershell -File`. Windows PowerShell 5.1 đọc file không
 *  BOM theo bảng mã ANSI ⇒ byte 0x93/0x94 trong "—", "✓" thành dấu nháy kép ⇒ ParserError, thoát mã 1 trên MỌI máy
 *  Windows (đo thật trên runner windows-latest). Nay chạy đúng lệnh một dòng người dùng gõ tay
 *  (`irm … | iex` — web trả `charset=utf-8` nên chữ đọc đúng), ép đầu ra UTF-8, và đọc đầu ra bằng StringDecoder
 *  (một ký tự tiếng Việt có thể bị cắt đôi giữa hai mẩu dữ liệu).
 */
import { spawn as spawnGoc } from 'node:child_process';
import { existsSync } from 'node:fs';
import { StringDecoder } from 'node:string_decoder';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { net, type WebContents } from 'electron';
import { API_ORIGIN, WEB_ORIGIN } from '../config';
import { readStoredSession } from './auth';
import { handle } from './index';

const laWin = process.platform === 'win32';

/** Cho test thay `spawn` bằng bản giả (máy dev là macOS — hành vi Windows chỉ kiểm được bằng spawn giả). */
let spawn = spawnGoc;
export function _datSpawnChoTest(f: typeof spawnGoc): void { spawn = f; }

/**
 * Lệnh cài trên Windows — ĐÚNG lệnh hướng dẫn cho người dùng cmd, cộng hai dòng mở đầu:
 *  • `[Console]::OutputEncoding = UTF8`: đầu ra đi qua ống về app, mặc định là bảng mã OEM ⇒ chữ Việt thành "?";
 *  • TLS 1.2 TRƯỚC `irm`: script tự bật TLS 1.2 nhưng lúc đó nó đã phải được tải về rồi.
 * `CUONGMINI_TU_APP=1`: trình cài bỏ đoạn hướng dẫn PATH dành cho người gõ tay (app tự nói, và tự mở terminal).
 */
export function lenhCaiWindows(url: string): { file: string; args: string[]; env: NodeJS.ProcessEnv } {
  const ps = [
    '[Console]::OutputEncoding = New-Object Text.UTF8Encoding $false',
    '[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072',
    `irm '${url.replace(/'/g, "''")}' | iex`,
  ].join('; ');
  return {
    file: 'powershell.exe',
    args: ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', ps],
    env: { CUONGMINI_TU_APP: '1' },
  };
}

/** Nháy đơn PowerShell: `a'b` ⇒ `'a''b'`. */
const nhayPs = (s: string): string => `'${s.replace(/'/g, "''")}'`;

/**
 * Lệnh mở terminal MỚI chạy `cuongmini` (Windows): thử Windows Terminal (`wt.exe`) trước, không có thì cửa sổ
 * PowerShell riêng. Lệnh PowerShell đi bằng `-EncodedCommand` (UTF-16LE base64): `wt` tự cắt dòng lệnh ở dấu `;`,
 * còn `cmd /c start` hiểu `&` là nối lệnh — mã hoá thì đường dẫn có dấu cách, dấu nháy, chữ Việt đều đi nguyên vẹn.
 * Dòng đầu nạp lại PATH từ registry: cửa sổ mới kế thừa môi trường CỦA APP (mở trước khi cài, chưa có thư mục lệnh).
 */
export function lenhMoTerminalWindows(noi: string, duongLenhCli: string): Array<{ file: string; args: string[] }> {
  const ps = [
    "$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')",
    `Set-Location -LiteralPath ${nhayPs(noi)}`,
    `& ${nhayPs(duongLenhCli)}`,
  ].join('\n');
  const ma = Buffer.from(ps, 'utf16le').toString('base64');
  const powershell = ['powershell.exe', '-NoExit', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', ma];
  return [
    { file: 'wt.exe', args: ['-d', noi, ...powershell] },
    { file: powershell[0]!, args: powershell.slice(1) },
  ];
}

/**
 * Lỗi THẬT để hiện cho người dùng: dòng `✗ …` cuối cùng của trình cài, không có thì lỗi PowerShell
 * (`… : The term … is not recognized`, `At line:…`), không có nữa thì vài dòng cuối.
 */
export function loiThat(chu: string): string | null {
  const dong = chu.split(/\r?\n/).map((d) => d.trimEnd()).filter((d) => d.trim());
  const x = [...dong].reverse().find((d) => d.trimStart().startsWith('✗'));
  if (x) return x.trim();
  const ps = dong.findIndex((d) => /(is not recognized|ParserError|Exception|Could not|Không thể|cannot|denied)/i.test(d));
  if (ps >= 0) return dong.slice(Math.max(0, ps - 1), ps + 2).join('\n');
  return dong.length ? dong.slice(-3).join('\n') : null;
}

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
export function chay(
  lenh: string, thamSo: string[], o: { hanMs: number; env?: NodeJS.ProcessEnv; moiDong?: (d: string) => void },
): Promise<{ ma: number | null; chu: string; loi?: string }> {
  return new Promise((xong) => {
    let chu = '';
    let du = '';
    let da = false;
    const ket = (kq: { ma: number | null; chu: string; loi?: string }) => { if (!da) { da = true; xong(kq); } };
    const con = spawn(lenh, thamSo, { windowsHide: true, env: { ...process.env, NO_COLOR: '1', ...o.env } });
    // Mỗi luồng một bộ giải mã: một ký tự UTF-8 (chữ Việt, ✓) có thể bị cắt đôi giữa hai mẩu dữ liệu.
    const gom = (giai: StringDecoder) => (b: Buffer) => {
      const s = giai.write(b);
      chu = (chu + s).slice(-16_000);
      du += s;
      const dong = du.split(/\r?\n/);
      du = dong.pop() ?? '';
      for (const d of dong) if (d.trim()) o.moiDong?.(d);
    };
    con.stdout?.on('data', gom(new StringDecoder('utf8')));
    con.stderr?.on('data', gom(new StringDecoder('utf8')));
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
  if (laWin) return existsSync(join(process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local'), 'Microsoft', 'WindowsApps', 'wt.exe')) ? 'Windows Terminal' : 'PowerShell';
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
      // 1+2. Chạy script cài chính thức — nó tự lo Node, gói CLI, PATH. Mỗi dòng log ⇒ giao diện.
      let kq: Awaited<ReturnType<typeof chay>>;
      if (laWin) {
        // Windows: đúng lệnh một dòng người dùng gõ (PowerShell tự tải script, đọc đúng UTF-8). KHÔNG `-File`
        // một file tải về — xem chú thích đầu file.
        bao('tai', 'Đang mở PowerShell để tải trình cài…');
        const l = lenhCaiWindows(`${WEB_ORIGIN}/cli/install.ps1?t=${Date.now()}`);
        bao('cai', 'Đang cài (máy chưa có Node thì tải luôn — có thể mất 1–2 phút)…');
        kq = await chay(l.file, l.args, { hanMs: 15 * 60_000, env: l.env, moiDong: (d) => bao('cai', d) });
      } else {
        // macOS/Linux: tải bằng mạng của Electron (máy Linux tối giản có thể thiếu curl) rồi chạy bằng bash.
        bao('tai', 'Đang tải trình cài…');
        const r = await net.fetch(`${WEB_ORIGIN}/cli/install.sh?t=${Date.now()}`);
        if (!r.ok) throw new Error(`Không tải được trình cài (HTTP ${r.status}).`);
        const file = join(tam, 'install.sh');
        await writeFile(file, Buffer.from(await r.arrayBuffer()));
        bao('cai', 'Đang cài (máy chưa có Node thì tải luôn — có thể mất 1–2 phút)…');
        kq = await chay('/bin/bash', [file], { hanMs: 15 * 60_000, moiDong: (d) => bao('cai', d) });
      }
      if (kq.ma !== 0) {
        const that = loiThat(kq.chu);
        const loi = kq.loi ?? (laWin && kq.ma === null ? 'Không chạy được powershell.exe — máy bị chặn PowerShell?' : `Trình cài thoát với mã ${kq.ma}.`);
        return { ok: false as const, loi: that ? `${loi}\n${that}` : loi, log: kq.chu };
      }

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
      // detached ⇒ Windows cấp cho tiến trình con một CỬA SỔ console riêng; -NoExit giữ cửa sổ sau khi cuongmini thoát.
      for (const l of lenhMoTerminalWindows(noi, p)) {
        const ok = await new Promise<boolean>((xong) => {
          const con = spawn(l.file, l.args, { cwd: noi, detached: true, stdio: 'ignore', windowsHide: false });
          con.on('error', () => xong(false));
          con.on('spawn', () => { con.unref(); xong(true); });
        });
        if (ok) return { ok: true as const };
      }
      return { ok: false as const, loi: `Không mở được PowerShell — mở PowerShell rồi chạy: & '${p}'` };
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
