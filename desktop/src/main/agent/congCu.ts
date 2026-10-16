/**
 * ============================================================
 * TỰ CÀI CÔNG CỤ + KẾT NỐI GITHUB — người mới không phải gõ lệnh nào
 * ============================================================
 *
 * Chủ app 16/10/2026: *"người mới dùng chưa cài git chẳng hạn, bạn tự chủ động
 * cho AI code cài sẵn luôn đi đừng để user cài tay hay ra lệnh. Và user chưa
 * bao giờ dùng github muốn commit push project đang làm cũng chủ động commit
 * push giúp."*
 *
 * Trước bản này: máy thiếu git thì mọi tool git trả lỗi; `tao_pr` bảo "cài
 * `gh` rồi chạy `gh auth login`" — tức là đẩy đúng việc khó nhất về cho người
 * không biết terminal là gì.
 *
 * ─── CÀI VÀO ĐÂU ───
 * `<userData>/cong-cu/` — thư mục RIÊNG của app, không cần quyền quản trị,
 * không đụng cài đặt hệ thống, gỡ app là sạch. Thư mục `bin` được nối vào
 * PATH của chính app lúc khởi động (`napPathCongCu`), nên `run_command`,
 * terminal, lệnh nền của agent đều thấy `git`/`gh` vừa cài.
 *
 *   • gh (GitHub CLI) — tải bản chạy sẵn chính thức từ github.com/cli/cli, cả
 *     ba hệ điều hành.
 *   • git trên Windows — MinGit chính thức của git-for-windows (bản gọn, đủ
 *     mọi lệnh git, không kèm bash).
 *   • git trên macOS — Apple không cho phát hành git rời: gọi
 *     `xcode-select --install` để hiện hộp cài của Apple (người dùng bấm "Cài
 *     đặt" một lần). Máy Mac đã có Command Line Tools thì git có sẵn.
 *   • git trên Linux — trình quản lý gói của máy, qua hộp mật khẩu hệ thống.
 *
 * ─── ĐĂNG NHẬP GITHUB ───
 * `gh auth login --web`: GitHub cấp một mã 8 ký tự, app TỰ CHÉP mã vào bộ nhớ
 * tạm và TỰ MỞ trang github.com/login/device — người dùng chỉ dán mã và bấm
 * "Authorize". Token nằm trong kho khoá của hệ điều hành (gh tự lo), app và
 * model KHÔNG BAO GIỜ thấy nó. Xong thì `gh auth setup-git` để `git push`
 * dùng luôn phiên đó, và đặt tên/email commit nếu máy chưa có.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { createWriteStream, existsSync } from 'node:fs';
import { chmod, mkdir, mkdtemp, readdir, rename, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { app, clipboard, net, shell } from 'electron';

const LA_WIN = process.platform === 'win32';

export function thuMucCongCu(): string {
  return path.join(app.getPath('userData'), 'cong-cu');
}
function thuMucBin(): string {
  return path.join(thuMucCongCu(), 'bin');
}
function thuMucGitWin(): string {
  return path.join(thuMucCongCu(), 'git');
}

/** Nối thư mục công cụ của app vào ĐẦU PATH (một lần, không trùng). */
export function napPathCongCu(): void {
  const them = [thuMucBin(), ...(LA_WIN ? [path.join(thuMucGitWin(), 'cmd')] : [])];
  const cu = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);
  const moi = [...them.filter((d) => !cu.includes(d)), ...cu];
  process.env.PATH = moi.join(path.delimiter);
}

interface KetQuaChay { ma: number | null; ra: string }

/** Chạy một lệnh, gom cả stdout lẫn stderr. Không qua shell — đường dẫn có dấu cách vẫn đúng. */
export function chayLenh(
  lenh: string, thamSo: string[], opts: { cwd?: string; giay?: number; env?: NodeJS.ProcessEnv } = {},
): Promise<KetQuaChay> {
  return new Promise((xong) => {
    let ra = '';
    let da = false;
    const ket = (k: KetQuaChay) => { if (!da) { da = true; xong(k); } };
    let p: ChildProcess;
    try {
      p = spawn(lenh, thamSo, { cwd: opts.cwd, windowsHide: true, env: opts.env ?? process.env });
    } catch (e) {
      ket({ ma: null, ra: (e as Error).message });
      return;
    }
    p.stdout?.on('data', (d) => { ra = (ra + String(d)).slice(-20_000); });
    p.stderr?.on('data', (d) => { ra = (ra + String(d)).slice(-20_000); });
    p.on('error', (e) => ket({ ma: null, ra: e.message }));
    p.on('close', (ma) => ket({ ma, ra }));
    const h = setTimeout(() => { try { p.kill(); } catch { /* đã chết */ } ket({ ma: null, ra: `${ra}\n(quá ${opts.giay ?? 60} giây)` }); }, (opts.giay ?? 60) * 1000);
    h.unref?.();
  });
}

/** Phiên bản của một lệnh, hoặc `null` nếu máy chưa có. */
export async function coLenh(lenh: 'git' | 'gh'): Promise<string | null> {
  // macOS: `/usr/bin/git` là cái VỎ — chưa có Command Line Tools thì nó bật hộp
  // cài của Apple và thoát mã 1. Hỏi `xcode-select -p` trước để không tự bật hộp.
  if (lenh === 'git' && process.platform === 'darwin') {
    const clt = await chayLenh('/usr/bin/xcode-select', ['-p'], { giay: 10 });
    if (clt.ma !== 0 && !existsSync('/opt/homebrew/bin/git') && !existsSync('/usr/local/bin/git')) return null;
  }
  const r = await chayLenh(lenh, ['--version'], { giay: 15 });
  return r.ma === 0 ? r.ra.trim().split('\n')[0] ?? 'có' : null;
}

async function taiVe(url: string, dich: string): Promise<void> {
  const r = await net.fetch(url);
  if (!r.ok || !r.body) throw new Error(`Tải thất bại: HTTP ${r.status}`);
  const ghi = createWriteStream(dich);
  const doc = r.body.getReader();
  try {
    for (;;) {
      const { done, value } = await doc.read();
      if (done) break;
      if (!ghi.write(value)) await new Promise<void>((x) => { ghi.once('drain', () => x()); });
    }
  } finally {
    await new Promise<void>((x, loi) => ghi.end((e?: Error | null) => (e ? loi(e) : x())));
  }
}

async function giaiNen(goi: string, vao: string): Promise<void> {
  let r: KetQuaChay;
  if (process.platform === 'darwin') r = await chayLenh('/usr/bin/ditto', ['-xk', goi, vao], { giay: 120 });
  else if (LA_WIN) {
    const tar = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe');
    r = existsSync(tar) ? await chayLenh(tar, ['-xf', goi, '-C', vao], { giay: 180 }) : { ma: 1, ra: '' };
    if (r.ma !== 0) {
      r = await chayLenh('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
        'Expand-Archive -LiteralPath $env:CT_GOI -DestinationPath $env:CT_VAO -Force'], {
        giay: 300, env: { ...process.env, CT_GOI: goi, CT_VAO: vao },
      });
    }
  } else r = await chayLenh('tar', ['-xzf', goi, '-C', vao], { giay: 120 });
  if (r.ma !== 0) throw new Error(`Không giải nén được: ${r.ra.trim().slice(0, 200) || 'lỗi không rõ'}`);
}

async function timFile(goc: string, ten: string): Promise<string | null> {
  for (const m of await readdir(goc, { withFileTypes: true })) {
    const p = path.join(goc, m.name);
    if (m.isFile() && m.name === ten) return p;
    if (m.isDirectory()) { const x = await timFile(p, ten); if (x) return x; }
  }
  return null;
}

/** Tài sản mới nhất của một kho phát hành trên GitHub khớp mẫu. */
async function taiSanMoiNhat(kho: string, mau: RegExp): Promise<{ ten: string; url: string }> {
  const r = await net.fetch(`https://api.github.com/repos/${kho}/releases/latest`, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': 'CuongThai-desktop' },
  });
  if (!r.ok) throw new Error(`Không hỏi được bản mới nhất của ${kho} (HTTP ${r.status}).`);
  const j = await r.json() as { assets?: Array<{ name: string; browser_download_url: string }> };
  const a = j.assets?.find((x) => mau.test(x.name));
  if (!a) throw new Error(`Chưa có bản ${kho} cho ${process.platform}/${process.arch}.`);
  return { ten: a.name, url: a.browser_download_url };
}

function kienTruc(): 'arm64' | 'amd64' {
  return process.arch === 'arm64' ? 'arm64' : 'amd64';
}

async function caiGh(): Promise<string> {
  const os_ = process.platform === 'darwin' ? 'macOS' : LA_WIN ? 'windows' : 'linux';
  const duoi = process.platform === 'linux' ? '\\.tar\\.gz' : '\\.zip';
  const ts = await taiSanMoiNhat('cli/cli', new RegExp(`^gh_[\\d.]+_${os_}_${kienTruc()}${duoi}$`));
  await mkdir(thuMucBin(), { recursive: true });
  const tam = await mkdtemp(path.join(thuMucCongCu(), 'tai-'));
  try {
    const goi = path.join(tam, ts.ten);
    await taiVe(ts.url, goi);
    await giaiNen(goi, tam);
    const ten = LA_WIN ? 'gh.exe' : 'gh';
    const moi = await timFile(tam, ten);
    if (!moi) throw new Error('Gói tải về không có file gh bên trong.');
    const dich = path.join(thuMucBin(), ten);
    await rm(dich, { force: true });
    await rename(moi, dich);
    if (!LA_WIN) await chmod(dich, 0o755);
    if (process.platform === 'darwin') await chayLenh('/usr/bin/xattr', ['-d', 'com.apple.quarantine', dich]);
  } finally {
    await rm(tam, { recursive: true, force: true }).catch(() => undefined);
  }
  napPathCongCu();
  const pb = await coLenh('gh');
  if (!pb) throw new Error('Đã tải gh nhưng nó không chạy được trên máy này.');
  return pb;
}

async function caiGitWindows(): Promise<string> {
  const ts = await taiSanMoiNhat('git-for-windows/git',
    process.arch === 'arm64' ? /^MinGit-[\d.]+(\.windows\.\d+)?-arm64\.zip$/ : /^MinGit-[\d.]+(\.windows\.\d+)?-64-bit\.zip$/);
  const tam = await mkdtemp(path.join(thuMucCongCu(), 'tai-'));
  try {
    const goi = path.join(tam, ts.ten);
    await taiVe(ts.url, goi);
    const giai = path.join(tam, 'git');
    await mkdir(giai, { recursive: true });
    await giaiNen(goi, giai);
    await rm(thuMucGitWin(), { recursive: true, force: true });
    await rename(giai, thuMucGitWin());
  } finally {
    await rm(tam, { recursive: true, force: true }).catch(() => undefined);
  }
  napPathCongCu();
  const pb = await coLenh('git');
  if (!pb) throw new Error('Đã tải MinGit nhưng git chưa chạy được.');
  return pb;
}

export interface KetQuaCai { ok: boolean; noi: string }

/**
 * Cài một công cụ. Đã có thì trả về luôn — gọi thừa không tốn gì.
 * `chayQuyenCao` chỉ dùng cho git trên Linux (trình quản lý gói cần root).
 */
export async function caiCongCu(
  ten: 'git' | 'gh',
  chayQuyenCao?: (lenh: string) => Promise<{ ok: boolean; ra: string }>,
): Promise<KetQuaCai> {
  napPathCongCu();
  const co = await coLenh(ten);
  if (co) return { ok: true, noi: `${ten} đã có sẵn: ${co}` };
  try {
    if (ten === 'gh') return { ok: true, noi: `Đã cài GitHub CLI: ${await caiGh()}` };
    if (LA_WIN) return { ok: true, noi: `Đã cài git (MinGit): ${await caiGitWindows()}` };
    if (process.platform === 'darwin') {
      await chayLenh('/usr/bin/xcode-select', ['--install'], { giay: 20 });
      return {
        ok: false,
        noi: 'macOS vừa hiện hộp "Cài đặt công cụ dòng lệnh" của Apple (git nằm trong đó). Nói người dùng bấm '
          + '**Cài đặt** rồi chờ vài phút cho xong; sau đó gọi lại tool này để kiểm. Không cần gõ lệnh nào.',
      };
    }
    if (!chayQuyenCao) return { ok: false, noi: 'Linux cần quyền quản trị để cài git qua trình quản lý gói.' };
    const lenh = existsSync('/usr/bin/apt-get') ? 'apt-get install -y git'
      : existsSync('/usr/bin/dnf') ? 'dnf install -y git'
        : existsSync('/usr/bin/pacman') ? 'pacman -S --noconfirm git'
          : existsSync('/usr/bin/zypper') ? 'zypper --non-interactive install git' : null;
    if (!lenh) return { ok: false, noi: 'Không nhận ra trình quản lý gói của máy Linux này.' };
    const r = await chayQuyenCao(lenh);
    const pb = await coLenh('git');
    return pb ? { ok: true, noi: `Đã cài git: ${pb}` } : { ok: false, noi: `Cài git chưa xong: ${r.ra.slice(-300)}` };
  } catch (e) {
    return { ok: false, noi: `Không cài được ${ten}: ${(e as Error).message}` };
  }
}

// ─── GitHub ────────────────────────────────────────────────────────

/** Tài khoản GitHub đang đăng nhập qua gh, hoặc `null`. */
export async function taiKhoanGithub(): Promise<string | null> {
  if (!(await coLenh('gh'))) return null;
  const r = await chayLenh('gh', ['api', 'user', '--jq', '.login'], { giay: 20 });
  return r.ma === 0 ? r.ra.trim().split('\n').pop() || null : null;
}

/** Đặt tên/email commit TOÀN CỤC nếu máy chưa có — theo tài khoản GitHub (email noreply). */
export async function datDanhTinhGit(): Promise<string | null> {
  const ten = (await chayLenh('git', ['config', '--global', 'user.name'], { giay: 10 })).ra.trim();
  const mail = (await chayLenh('git', ['config', '--global', 'user.email'], { giay: 10 })).ra.trim();
  if (ten && mail) return null;
  let login = '';
  let id = '';
  const r = await chayLenh('gh', ['api', 'user', '--jq', '[.login, (.id|tostring)] | join(" ")'], { giay: 20 });
  if (r.ma === 0) [login = '', id = ''] = r.ra.trim().split('\n').pop()!.split(' ');
  const tenMoi = ten || login || os.userInfo().username;
  // Email noreply của GitHub: commit hiện đúng avatar mà không lộ email thật.
  const mailMoi = mail || (login && id ? `${id}+${login}@users.noreply.github.com` : `${tenMoi}@users.noreply.github.com`);
  if (!ten) await chayLenh('git', ['config', '--global', 'user.name', tenMoi], { giay: 10 });
  if (!mail) await chayLenh('git', ['config', '--global', 'user.email', mailMoi], { giay: 10 });
  return `${tenMoi} <${mailMoi}>`;
}

let dangNhap: { p: ChildProcess; ma: string; xong: Promise<boolean> } | null = null;

/**
 * Bắt đầu (hoặc kiểm) đăng nhập GitHub. KHÔNG chờ người dùng bấm xong — trả
 * mã ngay để model nói cho người dùng; gọi lại để biết đã xong chưa.
 */
export async function ketNoiGithub(): Promise<{ ok: boolean; noi: string }> {
  const gh = await caiCongCu('gh');
  if (!gh.ok) return gh;

  const tk = await taiKhoanGithub();
  if (tk) {
    await chayLenh('gh', ['auth', 'setup-git'], { giay: 20 });
    const dt = await datDanhTinhGit();
    return { ok: true, noi: `Đã kết nối GitHub: tài khoản **${tk}**.${dt ? ` Đã đặt tên commit: ${dt}.` : ''} git push dùng luôn phiên này.` };
  }

  if (dangNhap) {
    return {
      ok: false,
      noi: `Đang chờ người dùng xác nhận trên trình duyệt. Mã: **${dangNhap.ma}** (đã chép sẵn, trang github.com/login/device đã mở). `
        + 'Bảo họ dán mã → Continue → Authorize, rồi gọi lại tool này.',
    };
  }

  const p = spawn('gh', ['auth', 'login', '--hostname', 'github.com', '--git-protocol', 'https', '--web',
    '--scopes', 'repo,workflow,read:org'], { windowsHide: true });
  let ra = '';
  const ma = await new Promise<string | null>((xong) => {
    const nghe = (d: Buffer) => {
      ra += String(d);
      const m = ra.match(/\b([A-Z0-9]{4}-[A-Z0-9]{4})\b/);
      if (m) xong(m[1]!);
    };
    p.stdout?.on('data', nghe);
    p.stderr?.on('data', nghe);
    p.on('error', () => xong(null));
    p.on('close', () => xong(null));
    setTimeout(() => xong(null), 30_000).unref?.();
    // gh hỏi "Press Enter to open github.com in your browser" — ta tự mở, nhưng gõ Enter cho nó đi tiếp.
    try { p.stdin?.write('\n'); } catch { /* bỏ */ }
  });
  if (!ma) {
    try { p.kill(); } catch { /* bỏ */ }
    return { ok: false, noi: `Không lấy được mã đăng nhập GitHub: ${ra.trim().slice(-300) || 'gh không trả lời'}` };
  }
  clipboard.writeText(ma);
  await shell.openExternal('https://github.com/login/device');
  const xong = new Promise<boolean>((x) => {
    p.on('close', async (code) => {
      dangNhap = null;
      if (code === 0) {
        await chayLenh('gh', ['auth', 'setup-git'], { giay: 20 });
        await datDanhTinhGit();
      }
      x(code === 0);
    });
  });
  // Bỏ cuộc sau 15 phút — mã của GitHub cũng hết hạn sau ~15 phút.
  setTimeout(() => { try { p.kill(); } catch { /* bỏ */ } }, 15 * 60_000).unref?.();
  dangNhap = { p, ma, xong };
  return {
    ok: false,
    noi: `ĐÃ MỞ trang github.com/login/device trên trình duyệt và ĐÃ CHÉP mã **${ma}** vào bộ nhớ tạm. `
      + 'Nói người dùng: dán mã (Ctrl/Cmd+V) → Continue → Authorize. Chưa có tài khoản thì bấm "Create an account" '
      + 'trên trang đó trước. Xong thì gọi lại `github_ket_noi` để xác nhận — đừng tự đoán là đã xong.',
  };
}

/** Chờ phiên đăng nhập đang mở (nếu có) xong, tối đa `giay`. */
export async function choDangNhap(giay: number): Promise<boolean> {
  if (!dangNhap) return !!(await taiKhoanGithub());
  const het = new Promise<boolean>((x) => setTimeout(() => x(false), giay * 1000).unref?.());
  return Promise.race([dangNhap.xong, het]);
}

// ─── Đưa dự án lên GitHub ──────────────────────────────────────────

/** .gitignore mặc định cho người mới — chặn rác build và file bí mật phổ biến. */
export const GITIGNORE_MAC_DINH = [
  '# Thư viện và bản build',
  'node_modules/', 'dist/', 'build/', 'out/', '.next/', '.nuxt/', 'target/', 'obj/', 'coverage/',
  '__pycache__/', '*.pyc', '.venv/', 'venv/', '.gradle/',
  '', '# Bí mật — KHÔNG BAO GIỜ đưa lên GitHub',
  '.env', '.env.*', '!.env.example', '*.pem', '*.key',
  '', '# Rác của máy',
  '.DS_Store', 'Thumbs.db', '*.log', '.idea/', '*.iml',
  '',
].join('\n');

/** File lớn hơn mức này GitHub từ chối (trần cứng 100MB). */
export const TRAN_FILE_GITHUB = 95 * 1024 * 1024;

export async function fileQuaLon(goc: string, ds: string[]): Promise<string[]> {
  const lon: string[] = [];
  for (const f of ds) {
    try { if ((await stat(path.join(goc, f))).size > TRAN_FILE_GITHUB) lon.push(f); } catch { /* đã xoá */ }
  }
  return lon;
}
