/**
 * ============================================================
 * ĐỒNG BỘ GIT VỚI GITHUB — phần THUẦN dùng chung (đợt 2 CuongMini ↔ CT Work, 28/10/2026)
 * ============================================================
 *
 * Chủ app 27/10/2026: "CuongMini làm trong thư mục dự án thì tự kiểm bản trên máy đang SAU hay TRƯỚC bản mới nhất
 * trên GitHub, so với repo của dự án (`project_repos`), hỏi có kéo về không, và giúp nhóm dùng git cho chuyên nghiệp."
 *
 * Module này KHÔNG import Electron/vscode/React — CLI, extension VS Code và app desktop (qua `agent:ctworkHe`) cùng gọi.
 *
 *   • `kiemDongBo`   — `git fetch` lặng lẽ có hạn giờ (mất mạng vẫn chạy, so với bản đã tải lần trước), rồi đếm
 *                      trước/sau so với upstream VÀ so với nhánh mặc định, thay đổi chưa commit, phân kỳ, đang giữa
 *                      rebase/merge. CHỈ ĐỌC — ngoài `fetch` (chỉ cập nhật `refs/remotes/*`) không ghi gì.
 *   • `chuanHoaRemote` / `khopRepoCtw` — ssh / https / `.git` / cổng 443 ⇒ cùng một khoá `host/owner/repo`.
 *   • `veDongBo`     — câu thông báo ngắn (vi/en) + câu hỏi (nếu đáng hỏi) + các lựa chọn.
 *   • `keoVe`        — kéo về AN TOÀN, chỉ được gọi SAU KHI người dùng bấm đồng ý:
 *                      mặc định `merge --ff-only`; rebase/merge chỉ khi người dùng chọn; KHÔNG BAO GIỜ `--force`,
 *                      `reset`, `checkout --`, `stash drop`, `clean`. Xung đột ⇒ `--abort` (về đúng như trước) + liệt kê file.
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

// ─── Chạy git (tiêm được cho test) ─────────────────────────────

export interface KqGit { ok: boolean; ra: string; loi: string; hetGio: boolean }
export type ChayGit = (args: string[], cwd: string, o?: { hanMs?: number; env?: Record<string, string> }) => Promise<KqGit>;

/** Không bao giờ để git/ssh/GCM mở hộp hỏi mật khẩu hay trình soạn thảo — lệnh chạy ngầm mà treo là treo luôn. */
const ENV_KHONG_HOI: Record<string, string> = {
  GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never', GIT_EDITOR: 'true', GIT_MERGE_AUTOEDIT: 'no', LC_ALL: 'C', LANG: 'C',
};

export const chayGit: ChayGit = (args, cwd, o = {}) => new Promise((xong) => {
  execFile('git', args, {
    cwd, timeout: o.hanMs ?? 30_000, maxBuffer: 8 * 1024 * 1024, windowsHide: true,
    env: { ...process.env, ...ENV_KHONG_HOI, ...(o.env ?? {}) },
  }, (err, stdout, stderr) => {
    const e = err as (NodeJS.ErrnoException & { killed?: boolean; signal?: string | null }) | null;
    xong({
      ok: !e, ra: String(stdout ?? ''), loi: String(stderr || (e ? e.message : '') || '').trim(),
      hetGio: Boolean(e && (e.killed || e.signal === 'SIGTERM')),
    });
  });
});

// ─── Chuẩn hoá URL remote ─────────────────────────────────────

/** Host phụ của cùng một dịch vụ (GitHub SSH qua cổng 443…). */
const HOST_GOP: Record<string, string> = { 'ssh.github.com': 'github.com', 'altssh.gitlab.com': 'gitlab.com', 'altssh.bitbucket.org': 'bitbucket.org' };

/**
 * `git@github.com:Org/Repo.git`, `ssh://git@ssh.github.com:443/org/repo`, `https://user@github.com/org/repo.git/`
 * ⇒ `github.com/org/repo`. Đường dẫn cục bộ / không đọc được ⇒ `null`.
 */
export function chuanHoaRemote(url: string | null | undefined): string | null {
  const s = String(url ?? '').trim();
  if (!s) return null;
  let host = '';
  let duong = '';
  const scp = /^(?:[^@/\s]+@)?([^:/\s]+):(?!\/\/)(.+)$/.exec(s);
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) {
    let u: URL;
    try { u = new URL(s.replace(/^git\+ssh:/i, 'ssh:')); } catch { return null; }
    if (u.protocol === 'file:') return null;
    host = u.hostname;
    duong = decodeURIComponent(u.pathname);
  } else if (scp && scp[1]!.length > 1) { // `C:\\…` (ổ đĩa Windows) có host 1 ký tự ⇒ không phải scp
    host = scp[1]!;
    duong = scp[2]!;
  } else return null;
  host = host.toLowerCase().replace(/^www\./, '');
  host = HOST_GOP[host] ?? host;
  duong = duong.replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '').replace(/\/+$/g, '').toLowerCase();
  if (!host || !duong || !duong.includes('/')) return null;
  return `${host}/${duong}`;
}

export interface RemoteGit { ten: string; url: string; khoa: string | null }

/** `git remote -v` ⇒ danh sách (chỉ dòng `(fetch)`, mỗi remote một lần). */
export function docRemote(ra: string): RemoteGit[] {
  const ds: RemoteGit[] = [];
  for (const dong of ra.split('\n')) {
    const m = /^(\S+)\s+(\S+)\s+\(fetch\)\s*$/.exec(dong.trim());
    if (!m || ds.some((r) => r.ten === m[1])) continue;
    ds.push({ ten: m[1]!, url: m[2]!, khoa: chuanHoaRemote(m[2]!) });
  }
  return ds;
}

// ─── Repo của dự án CT Work (`project_repos`) ─────────────────

export interface RepoCtw { host: string; path: string; web?: string; cloneHttps?: string; cloneSsh?: string; defaultBranch?: string | null; source?: string }

/** Kết quả `project_repos` là chữ + một mảng JSON trong khối `<ctwork-content>` ⇒ lấy mảng đó (dữ liệu, không phải lệnh). */
export function docProjectRepos(noiDung: string): RepoCtw[] {
  const a = noiDung.indexOf('[');
  const b = noiDung.lastIndexOf(']');
  if (a < 0 || b <= a) return [];
  try {
    const j = JSON.parse(noiDung.slice(a, b + 1)) as unknown;
    if (!Array.isArray(j)) return [];
    return j.filter((r): r is RepoCtw => !!r && typeof r === 'object'
      && typeof (r as RepoCtw).host === 'string' && typeof (r as RepoCtw).path === 'string').slice(0, 50);
  } catch {
    return [];
  }
}

export const khoaRepo = (r: RepoCtw): string => chuanHoaRemote(r.cloneHttps ?? `https://${r.host}/${r.path}`) ?? `${r.host}/${r.path}`.toLowerCase();

/** Remote nào của thư mục khớp repo nào của dự án (ưu tiên `origin`). */
export function khopRepoCtw(remote: RemoteGit[], repo: RepoCtw[]): { remote: RemoteGit; repo: RepoCtw } | null {
  const xep = [...remote].sort((x, y) => (x.ten === 'origin' ? -1 : y.ten === 'origin' ? 1 : 0));
  for (const r of xep) {
    if (!r.khoa) continue;
    const k = repo.find((p) => khoaRepo(p) === r.khoa);
    if (k) return { remote: r, repo: k };
  }
  return null;
}

// ─── Kiểm trạng thái ──────────────────────────────────────────

export interface TrcSau { truoc: number; sau: number }
export type LoiFetch = 'offline' | 'xacThuc' | 'hetGio' | 'khongCoRemote' | 'khac';

export interface TrangThaiDongBo {
  laKho: boolean;
  goc: string | null;
  /** `null` = HEAD tách rời. */
  nhanh: string | null;
  remote: RemoteGit[];
  /** Remote đã fetch (upstream của nhánh, không thì `origin`). */
  remoteChinh: string | null;
  /** `origin/main` — `null` khi nhánh chưa đẩy lần nào. */
  upstream: string | null;
  /** Nhánh có cấu hình upstream nhưng nhánh đó đã bị xoá trên remote. */
  upstreamMat: boolean;
  soVoiUpstream: TrcSau | null;
  /** `origin/main` — nhánh mặc định của remote chính. */
  macDinh: string | null;
  laNhanhMacDinh: boolean;
  /** So nhánh hiện tại với nhánh mặc định (chỉ khi đang ở nhánh khác). */
  soVoiMacDinh: TrcSau | null;
  thayDoi: { daTheoDoi: number; chuaTheoDoi: number; file: string[] };
  dangDo: 'rebase' | 'merge' | 'cherry-pick' | 'revert' | null;
  fetch: { ok: boolean; loi: LoiFetch | null; chiTiet: string; boQua: boolean };
  phanKy: boolean;
}

const RONG: TrangThaiDongBo = {
  laKho: false, goc: null, nhanh: null, remote: [], remoteChinh: null, upstream: null, upstreamMat: false, soVoiUpstream: null,
  macDinh: null, laNhanhMacDinh: false, soVoiMacDinh: null, thayDoi: { daTheoDoi: 0, chuaTheoDoi: 0, file: [] }, dangDo: null,
  fetch: { ok: false, loi: null, chiTiet: '', boQua: true }, phanKy: false,
};

export function phanLoaiLoiFetch(chu: string, hetGio: boolean): LoiFetch {
  if (hetGio) return 'hetGio';
  if (/Authentication failed|Permission denied \(publickey|could not read (?:Username|Password)|terminal prompts disabled|Repository not found|\b40[13]\b|Host key verification failed/i.test(chu)) return 'xacThuc';
  if (/Could not resolve host|Failed to connect|Network is unreachable|Connection refused|Connection timed out|Operation timed out|Temporary failure in name resolution|ssh: connect to host|Could not resolve hostname|unable to access|Couldn't connect/i.test(chu)) return 'offline';
  return 'khac';
}

const demSo = (ra: string): TrcSau | null => {
  const m = /^(\d+)\s+(\d+)/.exec(ra.trim());
  return m ? { truoc: Number(m[1]), sau: Number(m[2]) } : null;
};

/** Tên ref an toàn để đưa vào lệnh git (không bắt đầu bằng `-`, không ký tự lạ). */
export const refAnToan = (r: string | null | undefined): r is string => !!r && /^[A-Za-z0-9._\/-]{1,200}$/.test(r) && !r.startsWith('-') && !r.includes('..');

export interface TuyChonKiem {
  /** Có `git fetch` không (mặc định có). */
  fetch?: boolean;
  /** Hạn giờ cho fetch (mặc định 10 s). */
  hanFetchMs?: number;
  /** Nhánh mặc định biết từ CT Work (`project_repos.defaultBranch`) khi remote chưa có `HEAD`. */
  goiYMacDinh?: string | null;
  git?: ChayGit;
}

export async function kiemDongBo(cwd: string, o: TuyChonKiem = {}): Promise<TrangThaiDongBo> {
  const git = o.git ?? chayGit;
  const r0 = await git(['rev-parse', '--show-toplevel'], cwd, { hanMs: 10_000 });
  if (!r0.ok) return { ...RONG, thayDoi: { ...RONG.thayDoi, file: [] }, fetch: { ...RONG.fetch } };
  const goc = r0.ra.trim();
  const tt: TrangThaiDongBo = { ...RONG, laKho: true, goc, thayDoi: { daTheoDoi: 0, chuaTheoDoi: 0, file: [] }, fetch: { ok: false, loi: null, chiTiet: '', boQua: true } };

  const nh = await git(['symbolic-ref', '--quiet', '--short', 'HEAD'], goc);
  tt.nhanh = nh.ok && nh.ra.trim() ? nh.ra.trim() : null;
  tt.remote = docRemote((await git(['remote', '-v'], goc)).ra);

  // Đang giữa rebase/merge? (đọc thẳng thư mục .git — không chạy lệnh nào đổi trạng thái)
  const gp = async (p: string) => { const r = await git(['rev-parse', '--git-path', p], goc); return r.ok ? path.resolve(goc, r.ra.trim()) : ''; };
  if (existsSync(await gp('rebase-merge')) || existsSync(await gp('rebase-apply'))) tt.dangDo = 'rebase';
  else if (existsSync(await gp('MERGE_HEAD'))) tt.dangDo = 'merge';
  else if (existsSync(await gp('CHERRY_PICK_HEAD'))) tt.dangDo = 'cherry-pick';
  else if (existsSync(await gp('REVERT_HEAD'))) tt.dangDo = 'revert';

  // Upstream của nhánh hiện tại
  let remoteUp: string | null = null;
  if (tt.nhanh) {
    const cauHinh = await git(['config', '--get', `branch.${tt.nhanh}.remote`], goc);
    remoteUp = cauHinh.ok ? cauHinh.ra.trim() || null : null;
  }
  tt.remoteChinh = remoteUp && tt.remote.some((r) => r.ten === remoteUp) ? remoteUp
    : tt.remote.some((r) => r.ten === 'origin') ? 'origin' : tt.remote[0]?.ten ?? null;

  // FETCH lặng lẽ, có hạn giờ, không bao giờ hỏi mật khẩu.
  if (o.fetch !== false && tt.remoteChinh) {
    const env: Record<string, string> = {};
    const sshCauHinh = await git(['config', '--get', 'core.sshCommand'], goc);
    if (!process.env.GIT_SSH_COMMAND && !(sshCauHinh.ok && sshCauHinh.ra.trim())) env.GIT_SSH_COMMAND = 'ssh -o BatchMode=yes -o ConnectTimeout=8';
    const f = await git(['-c', 'fetch.recurseSubmodules=false', 'fetch', '--quiet', '--prune', '--no-tags', tt.remoteChinh], goc, { hanMs: o.hanFetchMs ?? 10_000, env });
    tt.fetch = f.ok ? { ok: true, loi: null, chiTiet: '', boQua: false }
      : { ok: false, loi: phanLoaiLoiFetch(f.loi, f.hetGio), chiTiet: f.loi.split('\n').filter(Boolean).slice(-2).join(' ').slice(0, 240), boQua: false };
  } else if (!tt.remoteChinh) {
    tt.fetch = { ok: false, loi: 'khongCoRemote', chiTiet: '', boQua: true };
  }

  if (tt.nhanh) {
    const up = await git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], goc);
    if (up.ok && up.ra.trim()) {
      tt.upstream = up.ra.trim();
      tt.soVoiUpstream = demSo((await git(['rev-list', '--left-right', '--count', 'HEAD...@{u}'], goc)).ra);
    } else {
      const merge = await git(['config', '--get', `branch.${tt.nhanh}.merge`], goc);
      tt.upstreamMat = merge.ok && !!merge.ra.trim();
    }
  }

  // Nhánh mặc định của remote chính: refs/remotes/<r>/HEAD ⇒ gợi ý CT Work ⇒ main ⇒ master.
  if (tt.remoteChinh) {
    const r = tt.remoteChinh;
    const hd = await git(['symbolic-ref', '--quiet', '--short', `refs/remotes/${r}/HEAD`], goc);
    const ung = [hd.ok ? hd.ra.trim() : '', o.goiYMacDinh ? `${r}/${o.goiYMacDinh}` : '', `${r}/main`, `${r}/master`].filter(Boolean);
    for (const u of ung) {
      if (!refAnToan(u)) continue;
      if ((await git(['rev-parse', '--verify', '--quiet', `refs/remotes/${u}`], goc)).ok) { tt.macDinh = u; break; }
    }
  }
  if (tt.macDinh && tt.nhanh) {
    const tenMd = tt.macDinh.slice(tt.macDinh.indexOf('/') + 1);
    tt.laNhanhMacDinh = tt.nhanh === tenMd;
    if (!tt.laNhanhMacDinh) tt.soVoiMacDinh = demSo((await git(['rev-list', '--left-right', '--count', `HEAD...refs/remotes/${tt.macDinh}`], goc)).ra);
  }

  // Thay đổi chưa commit (đã theo dõi vs file mới).
  const st = await git(['status', '--porcelain=v1', '-z', '--untracked-files=normal'], goc);
  if (st.ok) {
    const muc = st.ra.split('\0');
    for (let i = 0; i < muc.length; i += 1) {
      const d = muc[i]!;
      if (d.length < 4) continue;
      if (d.startsWith('??')) tt.thayDoi.chuaTheoDoi += 1; else tt.thayDoi.daTheoDoi += 1;
      if (tt.thayDoi.file.length < 8) tt.thayDoi.file.push(d.slice(3));
      if (d[0] === 'R' || d[0] === 'C') i += 1;
    }
  }
  tt.phanKy = Boolean(tt.soVoiUpstream && tt.soVoiUpstream.truoc > 0 && tt.soVoiUpstream.sau > 0);
  return tt;
}

// ─── Chữ cho người dùng ───────────────────────────────────────

export type CachKeo = 'ff' | 'rebase' | 'merge';
export type MucTieuKeo = 'upstream' | 'macDinh';
export interface LuaChonDongBo { giaTri: string; nhan: string; mo?: string }
export interface HoiDongBo {
  loai: 'keo' | 'phanKy' | 'capNhatMacDinh';
  cauHoi: string;
  moTa: string;
  luaChon: LuaChonDongBo[];
}
export interface BoiCanhCtw {
  /** Key dự án đã gắn (`NT`). */
  key?: string | null;
  /** true = remote khớp repo dự án · false = không khớp · null = không biết (chưa nối / dự án chưa khai repo). */
  khop?: boolean | null;
  /** Repo khớp (`github.com/org/repo`) hoặc danh sách repo của dự án khi không khớp. */
  repo?: string | null;
  dsRepo?: string[];
  /** Thẻ đang làm (từ nhánh). */
  the?: string | null;
}
export interface ThongBaoDongBo {
  /** 'im' = không có gì đáng nói (lúc mở thì im) · 'info' = chỉ một dòng · 'hoi' = có câu hỏi. */
  muc: 'im' | 'info' | 'hoi';
  dong: string[];
  hoi: HoiDongBo | null;
}

const soCommit = (n: number, en: boolean) => (en ? `${n} commit${n === 1 ? '' : 's'}` : `${n} commit`);

/**
 * Câu thông báo + câu hỏi. Ưu tiên MỘT câu hỏi: đang dở rebase/merge (chỉ báo) ⇒ phân kỳ với upstream ⇒ sau upstream
 * ⇒ nhánh tính năng thiếu commit mới của nhánh mặc định. Còn lại (đi trước, chưa đẩy, sửa thẳng trên main, mất mạng,
 * remote không khớp dự án) là dòng thông tin.
 */
export function veDongBo(tt: TrangThaiDongBo, ngonNgu: 'vi' | 'en' = 'vi', ctw: BoiCanhCtw = {}): ThongBaoDongBo {
  const en = ngonNgu === 'en';
  const L = (vi: string, e: string) => (en ? e : vi);
  if (!tt.laKho) return { muc: 'info', dong: [L('Thư mục này không phải repo git — không có gì để đồng bộ.', 'This folder is not a git repository — nothing to sync.')], hoi: null };
  const dong: string[] = [];
  const nh = tt.nhanh ?? L('(HEAD tách rời)', '(detached HEAD)');
  const ban = tt.thayDoi.daTheoDoi + tt.thayDoi.chuaTheoDoi;

  // CT Work: thư mục này thuộc dự án nào
  if (ctw.key && ctw.khop === true) dong.push(L(`⬡ Repo của dự án CT Work ${ctw.key}${ctw.repo ? ` (${ctw.repo})` : ''}.`, `⬡ Repository of CT Work project ${ctw.key}${ctw.repo ? ` (${ctw.repo})` : ''}.`));
  else if (ctw.key && ctw.khop === false) {
    dong.push(L(`⚠ Remote của thư mục này KHÔNG khớp repo nào của dự án ${ctw.key}${ctw.dsRepo?.length ? ` (repo dự án: ${ctw.dsRepo.slice(0, 2).join(', ')})` : ''} — có thể bạn mở nhầm thư mục, hoặc đây là bản fork.`,
      `⚠ This folder's remote does NOT match any repository of project ${ctw.key}${ctw.dsRepo?.length ? ` (project repos: ${ctw.dsRepo.slice(0, 2).join(', ')})` : ''} — wrong folder, or a fork?`));
  }

  if (tt.fetch.loi && tt.fetch.loi !== 'khongCoRemote') {
    const ly = tt.fetch.loi === 'offline' ? L('mất mạng?', 'offline?') : tt.fetch.loi === 'hetGio' ? L('quá lâu', 'timed out')
      : tt.fetch.loi === 'xacThuc' ? L('chưa đăng nhập GitHub / không có quyền repo', 'not signed in to GitHub / no access') : L('lỗi', 'error');
    dong.push(L(`· Không tải được bản mới từ ${tt.remoteChinh ?? 'remote'} (${ly}) — số liệu dưới đây so với lần tải trước.`,
      `· Could not fetch from ${tt.remoteChinh ?? 'the remote'} (${ly}) — figures below compare with the last fetch.`));
  }
  if (!tt.remote.length) dong.push(L('· Repo chưa có remote nào (chưa lên GitHub). Nhờ CuongMini "đưa dự án lên GitHub" khi cần.', '· No remote yet (not on GitHub). Ask CuongMini to "put this project on GitHub" when ready.'));

  if (tt.dangDo) {
    const viec = tt.dangDo === 'rebase' ? 'rebase' : tt.dangDo === 'merge' ? 'merge' : tt.dangDo;
    dong.push(L(`⚠ Repo đang dở một lần ${viec} (có thể còn xung đột). Giải xong rồi \`git ${viec} --continue\`, hoặc quay về như trước: \`git ${viec} --abort\`. Nhờ CuongMini: "giúp mình giải xung đột".`,
      `⚠ A ${viec} is in progress (conflicts may remain). Finish it then \`git ${viec} --continue\`, or go back: \`git ${viec} --abort\`. Ask CuongMini: "help me resolve the conflicts".`));
    return { muc: 'info', dong, hoi: null };
  }

  const bannote = ban
    ? L(` Bạn đang có ${tt.thayDoi.daTheoDoi ? `${tt.thayDoi.daTheoDoi} file đã sửa` : ''}${tt.thayDoi.daTheoDoi && tt.thayDoi.chuaTheoDoi ? ' + ' : ''}${tt.thayDoi.chuaTheoDoi ? `${tt.thayDoi.chuaTheoDoi} file mới` : ''} chưa commit — git giữ nguyên chúng; đụng file đang sửa thì git từ chối, không mất gì.`,
      ` You have ${tt.thayDoi.daTheoDoi ? `${tt.thayDoi.daTheoDoi} modified` : ''}${tt.thayDoi.daTheoDoi && tt.thayDoi.chuaTheoDoi ? ' + ' : ''}${tt.thayDoi.chuaTheoDoi ? `${tt.thayDoi.chuaTheoDoi} new` : ''} uncommitted file(s) — git keeps them; if an incoming change touches one, git refuses and nothing is lost.`)
    : '';

  let hoi: HoiDongBo | null = null;
  const up = tt.soVoiUpstream;
  if (tt.upstream && up && tt.phanKy) {
    hoi = {
      loai: 'phanKy',
      cauHoi: L(`Nhánh ${nh} đã PHÂN KỲ với ${tt.upstream}: bạn có ${soCommit(up.truoc, en)} chưa đẩy, trên GitHub có ${soCommit(up.sau, en)} bạn chưa có.`,
        `Branch ${nh} has DIVERGED from ${tt.upstream}: ${soCommit(up.truoc, true)} of yours not pushed, ${soCommit(up.sau, true)} on GitHub you don't have.`),
      moTa: L('Không kéo kiểu fast-forward được. Rebase = đặt commit của bạn lên SAU bản mới (lịch sử thẳng; commit của bạn chưa đẩy nên không phải đẩy ép). Merge = tạo một commit gộp (giữ nguyên lịch sử, an toàn khi nhiều người cùng đẩy nhánh này). Xung đột ⇒ CuongMini huỷ về như cũ và liệt kê file.',
        "A fast-forward is impossible. Rebase = replay your commits ON TOP of the new ones (linear history; yours aren't pushed, so no force push needed). Merge = create a merge commit (keeps history, safe when several people push this branch). On conflict CuongMini aborts back to where you were and lists the files.") + (ban ? L(' Cần commit/stash thay đổi đang dở trước.', ' Commit/stash your pending changes first.') : ''),
      luaChon: [
        { giaTri: 'rebase:upstream', nhan: L(`Rebase lên ${tt.upstream} (khuyên)`, `Rebase onto ${tt.upstream} (recommended)`), mo: L('git rebase — lịch sử thẳng', 'git rebase — linear history') },
        { giaTri: 'merge:upstream', nhan: L(`Merge ${tt.upstream}`, `Merge ${tt.upstream}`), mo: L('git merge --no-edit — tạo commit gộp', 'git merge --no-edit — merge commit') },
        { giaTri: 'xem:upstream', nhan: L('Xem commit hai bên', 'Show both sides') },
        { giaTri: 'khong', nhan: L('Để sau', 'Later') },
      ],
    };
  } else if (tt.upstream && up && up.sau > 0) {
    hoi = {
      loai: 'keo',
      cauHoi: L(`Nhánh ${nh} đang sau ${tt.upstream} ${soCommit(up.sau, en)} — pull không?`, `Branch ${nh} is ${soCommit(up.sau, true)} behind ${tt.upstream} — pull now?`),
      moTa: L('Kéo kiểu fast-forward (`git merge --ff-only`): chỉ tiến lên, không tạo commit gộp, không ghi đè thay đổi của bạn.', 'Fast-forward only (`git merge --ff-only`): moves forward, no merge commit, never overwrites your changes.') + bannote,
      luaChon: [
        { giaTri: 'ff:upstream', nhan: L('Có — pull (fast-forward)', 'Yes — pull (fast-forward)') },
        { giaTri: 'xem:upstream', nhan: L(`Xem ${soCommit(up.sau, en)} mới trước`, `Show the ${soCommit(up.sau, true)} first`) },
        { giaTri: 'khong', nhan: L('Không', 'No') },
      ],
    };
  } else if (tt.macDinh && tt.soVoiMacDinh && tt.soVoiMacDinh.sau > 0 && !tt.laNhanhMacDinh && tt.nhanh) {
    const md = tt.macDinh;
    const daDay = Boolean(tt.upstream);
    const n = tt.soVoiMacDinh.sau;
    hoi = {
      loai: 'capNhatMacDinh',
      cauHoi: L(`Nhánh ${nh} thiếu ${soCommit(n, en)} mới của ${md} — cập nhật nhánh không?`, `Branch ${nh} is missing ${soCommit(n, true)} from ${md} — update your branch?`),
      moTa: (daDay
        ? L(`Nhánh đã đẩy lên GitHub ⇒ dùng MERGE (rebase sẽ viết lại commit đã đẩy và buộc phải đẩy ép — CuongMini không làm).`, 'This branch is already on GitHub ⇒ use MERGE (rebasing would rewrite pushed commits and require a force push — CuongMini never does that).')
        : L('Nhánh chưa đẩy ⇒ REBASE cho lịch sử thẳng, PR dễ đọc. Merge cũng được.', 'Branch not pushed yet ⇒ REBASE for a linear history and a cleaner PR. Merge also works.'))
        + L(' Xung đột ⇒ huỷ về như cũ và liệt kê file.', ' On conflict: abort back and list the files.') + (ban ? L(' Cần commit/stash thay đổi đang dở trước.', ' Commit/stash your pending changes first.') : ''),
      luaChon: [
        ...(daDay ? [] : [{ giaTri: 'rebase:macDinh', nhan: L(`Rebase lên ${md} (khuyên)`, `Rebase onto ${md} (recommended)`) }]),
        { giaTri: 'merge:macDinh', nhan: L(`Merge ${md} vào ${nh}${daDay ? ' (khuyên)' : ''}`, `Merge ${md} into ${nh}${daDay ? ' (recommended)' : ''}`) },
        { giaTri: 'xem:macDinh', nhan: L('Xem commit mới', 'Show the new commits') },
        { giaTri: 'khong', nhan: L('Để sau', 'Later') },
      ],
    };
  }

  // Dòng thông tin (không hỏi)
  if (up && up.truoc > 0 && !tt.phanKy) {
    dong.push(L(`· Nhánh ${nh} có ${soCommit(up.truoc, en)} chưa đẩy lên ${tt.upstream}. Nhờ CuongMini "đẩy nhánh" / "mở PR" khi xong.`,
      `· Branch ${nh} has ${soCommit(up.truoc, true)} not pushed to ${tt.upstream}. Ask CuongMini to "push the branch" / "open a PR" when done.`));
  }
  if (tt.nhanh && !tt.upstream && tt.remote.length) {
    dong.push(tt.upstreamMat
      ? L(`· Nhánh ${nh} từng có trên GitHub nhưng nhánh đó đã bị xoá (thường là PR đã merge). Về ${tt.macDinh ?? 'nhánh chính'} và pull; nhánh cũ xoá khi chắc không cần.`,
        `· Branch ${nh} used to be on GitHub but was deleted there (usually the PR was merged). Switch to ${tt.macDinh ?? 'the main branch'} and pull; delete the old branch when sure.`)
      : L(`· Nhánh ${nh} chưa có trên GitHub (chưa đẩy lần nào).`, `· Branch ${nh} is not on GitHub yet (never pushed).`));
  }
  if (tt.laNhanhMacDinh && tt.thayDoi.daTheoDoi > 0) {
    const goiY = ctw.the ? goiYTenNhanh(ctw.the, '') : ctw.key ? `feature/${ctw.key}-<số thẻ>-<mô-tả>` : 'feature/<KEY>-<số>-<mô-tả>';
    dong.push(L(`· Bạn đang sửa thẳng trên ${nh} (nhánh chung). Làm việc nhóm nên tạo nhánh theo thẻ trước khi commit: \`git switch -c ${goiY}\`${ctw.key ? ` hoặc \`/ctwork bat-dau ${ctw.key}-<số>\`` : ''} — thay đổi đang dở đi theo sang nhánh mới.`,
      `· You are editing ${nh} (the shared branch) directly. For team work create a branch per issue before committing: \`git switch -c ${goiY}\`${ctw.key ? ` or \`/ctwork start ${ctw.key}-<n>\`` : ''} — pending changes move with you.`));
  }
  if (!tt.nhanh) dong.push(L('· HEAD đang tách rời (không ở nhánh nào) — tạo nhánh trước khi commit: `git switch -c <tên>`.', '· Detached HEAD (not on a branch) — create a branch before committing: `git switch -c <name>`.'));

  if (hoi) return { muc: 'hoi', dong, hoi };
  const dongTot = !dong.length && tt.upstream && up && up.sau === 0 && up.truoc === 0;
  if (dongTot) dong.push(L(`✓ Nhánh ${nh} đã khớp ${tt.upstream}${tt.fetch.ok ? '' : ' (theo lần tải trước)'}.`, `✓ Branch ${nh} is up to date with ${tt.upstream}${tt.fetch.ok ? '' : ' (as of the last fetch)'}.`));
  const chiTot = dong.length === 1 && dong[0]!.startsWith('✓');
  const chiCtwTot = dong.every((d) => d.startsWith('✓') || d.startsWith('⬡'));
  return { muc: !dong.length || chiTot || chiCtwTot ? 'im' : 'info', dong, hoi: null };
}

// ─── Tên nhánh / lời nhắn commit theo thẻ ─────────────────────

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

/** `NT-24` + "Login form" ⇒ `feature/NT-24-login-form`; thẻ Bug ⇒ `fix/…`. Tối đa ~60 ký tự, không dấu. */
export function goiYTenNhanh(theKey: string, tieuDe: string, loaiThe?: string | null): string {
  const tien = /bug|lỗi|loi|defect|hotfix/i.test(loaiThe ?? '') ? 'fix' : /doc/i.test(loaiThe ?? '') ? 'docs' : /chore|config/i.test(loaiThe ?? '') ? 'chore' : 'feature';
  const slug = boDau(tieuDe).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const day = `${tien}/${theKey.toUpperCase()}${slug ? `-${slug}` : ''}`;
  return day.slice(0, 60).replace(/-+$/, '');
}

/** Lời nhắn commit dẫn chiếu thẻ: `feat(NT-24): thêm form đăng nhập`. Đã có key trong câu thì giữ nguyên. */
export function goiYLoiNhanCommit(theKey: string, moTa: string, loai: 'feat' | 'fix' | 'docs' | 'refactor' | 'test' | 'chore' = 'feat'): string {
  const m = moTa.trim().replace(/\s+/g, ' ');
  if (new RegExp(`\\b${theKey}\\b`, 'i').test(m)) return m;
  return `${loai}(${theKey.toUpperCase()}): ${m}`.slice(0, 100);
}

// ─── Kéo về an toàn ───────────────────────────────────────────

export interface KqKeo {
  ok: boolean;
  /** Câu cho người dùng (vi/en). */
  noi: string;
  /** File xung đột (đã `--abort`, repo về đúng như trước). */
  xungDot?: string[];
  /** Mã ngắn của HEAD sau khi kéo. */
  head?: string;
}

/**
 * Kéo về — CHỈ gọi sau khi người dùng đã bấm đồng ý. Kiểm LẠI ngay trước khi ghi (người dùng có thể đã đổi nhánh
 * trong terminal giữa lúc đọc thẻ và lúc bấm). Không bao giờ `--force`/`reset`/`checkout --`/`clean`/`stash`.
 */
export async function keoVe(cwd: string, o: { cach: CachKeo; mucTieu: MucTieuKeo; nhanh: string; ngonNgu?: 'vi' | 'en'; git?: ChayGit }): Promise<KqKeo> {
  const git = o.git ?? chayGit;
  const en = o.ngonNgu === 'en';
  const L = (vi: string, e: string) => (en ? e : vi);
  const tt = await kiemDongBo(cwd, { fetch: false, git });
  if (!tt.laKho || !tt.goc) return { ok: false, noi: L('Không phải repo git.', 'Not a git repository.') };
  const goc = tt.goc;
  if (tt.nhanh !== o.nhanh) return { ok: false, noi: L(`Nhánh đã đổi (giờ là ${tt.nhanh ?? 'HEAD tách rời'}) — không làm gì. Chạy lại /dong-bo.`, `The branch changed (now ${tt.nhanh ?? 'detached HEAD'}) — nothing done. Run /sync again.`) };
  if (tt.dangDo) return { ok: false, noi: L(`Repo đang dở một lần ${tt.dangDo} — giải xong hoặc \`git ${tt.dangDo} --abort\` trước.`, `A ${tt.dangDo} is in progress — finish it or \`git ${tt.dangDo} --abort\` first.`) };
  const dich = o.mucTieu === 'upstream' ? tt.upstream : tt.macDinh;
  if (!refAnToan(dich)) return { ok: false, noi: L('Không xác định được nhánh để kéo về.', 'No branch to pull from.') };
  const dem = o.mucTieu === 'upstream' ? tt.soVoiUpstream : tt.soVoiMacDinh;
  if (!dem || dem.sau === 0) return { ok: true, noi: L(`Không có gì mới trên ${dich} — đã khớp.`, `Nothing new on ${dich} — already up to date.`) };
  const ref = `refs/remotes/${dich}`;
  const tomLoi = (s: string) => s.split('\n').filter((d) => d.trim() && !/^hint:/i.test(d)).slice(0, 3).join(' ').slice(0, 300);
  const xong = async (viec: string): Promise<KqKeo> => {
    const h = (await git(['rev-parse', '--short', 'HEAD'], goc)).ra.trim();
    return { ok: true, noi: L(`✓ ${viec} ${soCommit(dem.sau, en)} từ ${dich} vào ${o.nhanh} — HEAD giờ là ${h}.`, `✓ ${viec} ${soCommit(dem.sau, true)} from ${dich} into ${o.nhanh} — HEAD is now ${h}.`), head: h };
  };

  if (o.cach === 'ff') {
    const r = await git(['merge', '--ff-only', ref], goc, { hanMs: 120_000 });
    if (r.ok) return xong(L('Đã kéo', 'Pulled'));
    if (/would be overwritten|untracked working tree files/i.test(r.loi)) {
      return { ok: false, noi: L(`Git TỪ CHỐI kéo vì sẽ đè lên file bạn đang sửa — không có gì bị mất. Commit (hoặc \`git stash\`) thay đổi đó rồi chạy lại /dong-bo. Chi tiết: ${tomLoi(r.loi)}`,
        `Git REFUSED to pull because it would overwrite files you are editing — nothing was lost. Commit (or \`git stash\`) them and run /sync again. Details: ${tomLoi(r.loi)}`) };
    }
    if (/Not possible to fast-forward|not possible to fast-forward|diverg/i.test(r.loi)) {
      return { ok: false, noi: L('Không fast-forward được (hai bên đã phân kỳ). Chạy lại /dong-bo để chọn rebase hoặc merge.', 'Cannot fast-forward (the branches diverged). Run /sync again to pick rebase or merge.') };
    }
    return { ok: false, noi: L(`Kéo về hỏng: ${tomLoi(r.loi)}`, `Pull failed: ${tomLoi(r.loi)}`) };
  }

  // rebase / merge: cần cây làm việc sạch (file đã theo dõi) — không tự stash thay người dùng.
  if (tt.thayDoi.daTheoDoi > 0) {
    return { ok: false, noi: L(`Đang có ${tt.thayDoi.daTheoDoi} file sửa dở chưa commit — ${o.cach} cần cây làm việc sạch. Commit (hoặc \`git stash\`) trước rồi chạy lại /dong-bo. Không có gì bị đổi.`,
      `${tt.thayDoi.daTheoDoi} modified file(s) not committed — ${o.cach} needs a clean tree. Commit (or \`git stash\`) first, then run /sync again. Nothing was changed.`) };
  }
  if (o.cach === 'rebase' && o.mucTieu === 'macDinh' && tt.upstream) {
    return { ok: false, noi: L('Nhánh này đã đẩy lên GitHub — rebase lên nhánh chính sẽ buộc phải đẩy ép, CuongMini không làm. Chọn merge.', 'This branch is already on GitHub — rebasing onto the main branch would need a force push, which CuongMini never does. Use merge.') };
  }
  const env = { GIT_EDITOR: 'true', GIT_SEQUENCE_EDITOR: 'true' };
  const r = o.cach === 'rebase'
    ? await git(['-c', 'core.editor=true', 'rebase', ref], goc, { hanMs: 180_000, env })
    : await git(['merge', '--no-edit', ref], goc, { hanMs: 180_000, env });
  if (r.ok) return xong(o.cach === 'rebase' ? L('Đã rebase, nhận', 'Rebased, taking') : L('Đã merge', 'Merged'));
  const xd = (await git(['-c', 'core.quotePath=false', 'diff', '--name-only', '--diff-filter=U'], goc)).ra.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 30);
  // Về đúng như trước — `--abort` chỉ trả repo về trạng thái trước lệnh, không vứt thay đổi nào đã commit.
  const huy = await git([o.cach === 'rebase' ? 'rebase' : 'merge', '--abort'], goc, { hanMs: 60_000 });
  const ve = huy.ok ? L('đã huỷ, repo về đúng như trước', 'aborted, the repo is back where it was') : L(`CHƯA huỷ được (${tomLoi(huy.loi)}) — chạy \`git ${o.cach} --abort\``, `could NOT abort (${tomLoi(huy.loi)}) — run \`git ${o.cach} --abort\``);
  if (xd.length) {
    return {
      ok: false, xungDot: xd,
      noi: L(`Xung đột ở ${xd.length} file (${ve}): ${xd.slice(0, 8).join(', ')}${xd.length > 8 ? '…' : ''}. Nhờ CuongMini "giúp mình ${o.cach} lên ${dich} và giải xung đột từng bước" — nó đọc bản gốc + ý định hai bên, không chọn bừa.`,
        `Conflicts in ${xd.length} file(s) (${ve}): ${xd.slice(0, 8).join(', ')}${xd.length > 8 ? '…' : ''}. Ask CuongMini: "help me ${o.cach} onto ${dich} and resolve the conflicts step by step".`),
    };
  }
  return { ok: false, noi: L(`${o.cach} hỏng (${ve}): ${tomLoi(r.loi)}`, `${o.cach} failed (${ve}): ${tomLoi(r.loi)}`) };
}

/** Danh sách commit một phía (`HEAD..ref`), tối đa `n` dòng — cho lựa chọn "Xem commit mới". */
export async function dsCommitMoi(cwd: string, mucTieu: MucTieuKeo, o: { n?: number; git?: ChayGit } = {}): Promise<{ moi: string[]; cuaToi: string[]; dich: string | null }> {
  const git = o.git ?? chayGit;
  const tt = await kiemDongBo(cwd, { fetch: false, git });
  const dich = mucTieu === 'upstream' ? tt.upstream : tt.macDinh;
  if (!tt.goc || !refAnToan(dich)) return { moi: [], cuaToi: [], dich: null };
  const n = String(Math.min(Math.max(o.n ?? 15, 1), 50));
  const dong = async (pham: string) => (await git(['log', '--no-color', `--max-count=${n}`, '--format=%h %s (%an, %ar)', pham], tt.goc!)).ra.split('\n').filter(Boolean);
  return { moi: await dong(`HEAD..refs/remotes/${dich}`), cuaToi: await dong(`refs/remotes/${dich}..HEAD`), dich };
}
