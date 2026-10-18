/**
 * ============================================================
 * AGENT PHỤ GHI ĐƯỢC — khu làm việc riêng (đợt 3, 18/10/2026)
 * ============================================================
 *
 * `giao_viec_ghi` cho một agent phụ SỬA FILE / CHẠY LỆNH — nhưng KHÔNG ở cây làm
 * việc của người dùng. Nó làm trong một KHU riêng:
 *   • kho git ⇒ `git worktree add --detach` tại TRẠNG THÁI HIỆN TẠI của cây
 *     (`git stash create` chụp cả thay đổi chưa commit, không đụng cây gốc) +
 *     chép thêm file chưa theo dõi (không bị .gitignore). Mốc so sánh là một
 *     TREE (`git write-tree` sau `add -A`) — không commit, không nhánh rác.
 *   • không phải kho git ⇒ chép sang thư mục tạm (bỏ node_modules/.git/dist…,
 *     trần 5000 file / 100MB) và nhớ băm từng file làm mốc.
 * Xong việc: liệt kê thay đổi (thêm/sửa/xoá) + diff rút gọn trả cho agent chính.
 * GỘP (`gop_viec_phu`) là một bước RIÊNG có thẻ duyệt: chép từng file về cây
 * gốc qua sổ hoàn tác (`ghiSoTruoc` ⇒ /undo, lùi file phủ được), và TỪ CHỐI file
 * mà cây gốc đã đổi kể từ lúc tạo khu (xung đột — không đè việc của ai).
 *
 * Mọi lần sửa/lệnh TRONG khu vẫn đi qua thẻ duyệt như agent chính (loop.ts).
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, rmSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { soSanhDong } from './diff';
import { ghiSoTruoc, type SoCuoc } from './so';

const chay = promisify(execFile);

export interface KhuPhu {
  id: string;
  loai: 'worktree' | 'tam';
  /** Thư mục agent phụ làm việc. */
  thuMuc: string;
  /** Cây gốc (thư mục dự án của cuộc). */
  goc: string;
  /** git: thư mục gốc kho (để `worktree remove`). */
  khoChinh?: string;
  /** git: thư mục gốc của worktree khu (thuMuc có thể là thư mục con của nó). */
  gocKhu?: string;
  /** git: mốc so sánh (tree sha). */
  baseTree?: string;
  /** git (đợt 4): commit mốc (HEAD lúc giao việc) + mốc có ĐÚNG là HEAD sạch không (merge chỉ khi đúng). */
  mocCommit?: string;
  mocLaHead?: boolean;
  /** tạm: rel ⇒ sha1 nội dung lúc chép. */
  bam?: Map<string, string>;
}

export interface ThayDoi {
  rel: string;
  kieu: 'them' | 'sua' | 'xoa';
  /** Nội dung mốc (null = chưa có). `undefined` khi nhị phân. */
  base: string | null;
  moi: string | null;
  nhiPhan?: boolean;
  /** Nhị phân (đợt 4): mã nội dung MỐC để kiểm xung đột — blob sha (git) hoặc sha1 (thư mục tạm). */
  maBase?: string | null;
}

const BO_QUA = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'target', '.venv', 'venv', '__pycache__', '.cache', 'coverage', '.turbo', '.gradle', 'Pods', 'DerivedData']);
const TRAN_FILE_TAM = 5000;
const TRAN_BYTE_TAM = 100 * 1024 * 1024;
const TRAN_UNTRACKED = 2000;

async function git(cwd: string, args: string[], env?: NodeJS.ProcessEnv): Promise<string> {
  const { stdout } = await chay('git', args, { cwd, timeout: 60_000, windowsHide: true, maxBuffer: 64 * 1024 * 1024, ...(env ? { env: { ...process.env, ...env } } : {}) });
  return stdout;
}

const khuDangCo = new Map<string, KhuPhu>();
process.once('exit', () => {
  for (const k of khuDangCo.values()) { try { rmSync(k.thuMuc, { recursive: true, force: true }); } catch { /* */ } }
});

function goc_tam(): string { return path.join(os.tmpdir(), 'cuongmini-phu'); }

function bamChu(b: Buffer): string { return createHash('sha1').update(b).digest('hex'); }
function laNhiPhan(b: Buffer): boolean { return b.subarray(0, 8000).includes(0); }

/** Tạo khu cho agent phụ `id`. Không ném. */
export async function taoKhuPhu(goc: string, id: string): Promise<{ ok: true; khu: KhuPhu } | { ok: false; loi: string }> {
  const ten = id.replace(/[^a-zA-Z0-9_-]/g, '').slice(-24) || `phu${Date.now()}`;
  let khoChinh: string | null = null;
  try {
    const top = (await git(goc, ['rev-parse', '--show-toplevel'])).trim();
    if (top) khoChinh = top;
  } catch { /* không phải git */ }

  await fs.mkdir(goc_tam(), { recursive: true });
  const dich = path.join(goc_tam(), `${path.basename(goc)}-${ten}`);
  await fs.rm(dich, { recursive: true, force: true }).catch(() => {});

  if (khoChinh) {
    try {
      let moc = '';
      try { moc = (await git(khoChinh, ['stash', 'create'])).trim(); } catch { /* */ }
      const mocLaHead = !moc;
      const mocCommit = (await git(khoChinh, ['rev-parse', '--verify', 'HEAD']).catch(() => '')).trim();
      if (!moc) moc = mocCommit;
      await git(khoChinh, ['worktree', 'prune']).catch(() => '');
      await git(khoChinh, ['worktree', 'add', '--detach', dich, moc]);
      // File chưa theo dõi (không bị ignore) — agent phụ phải thấy đúng cây người dùng đang có.
      const ds = (await git(khoChinh, ['ls-files', '--others', '--exclude-standard', '-z'])).split('\0').filter(Boolean);
      for (const rel of ds.slice(0, TRAN_UNTRACKED)) {
        const tu = path.join(khoChinh, rel);
        const st = await fs.stat(tu).catch(() => null);
        if (!st?.isFile() || st.size > 10 * 1024 * 1024) continue;
        await fs.mkdir(path.dirname(path.join(dich, rel)), { recursive: true });
        await fs.copyFile(tu, path.join(dich, rel)).catch(() => {});
      }
      const env = { GIT_INDEX_FILE: `${dich}.index` };
      await git(dich, ['read-tree', moc], env);
      await git(dich, ['add', '-A'], env);
      const baseTree = (await git(dich, ['write-tree'], env)).trim();
      // Thư mục con của kho (goc ≠ khoChinh) ⇒ agent phụ làm ở đúng thư mục con tương ứng.
      const con = path.relative(khoChinh, goc);
      const thuMuc = con && !con.startsWith('..') ? path.join(dich, con) : dich;
      const khu: KhuPhu = { id, loai: 'worktree', thuMuc, goc, khoChinh, baseTree, gocKhu: dich, ...(mocCommit ? { mocCommit, mocLaHead } : {}) };
      khuDangCo.set(id, khu);
      return { ok: true, khu };
    } catch (e) {
      await fs.rm(dich, { recursive: true, force: true }).catch(() => {});
      await fs.rm(`${dich}.index`, { force: true }).catch(() => {});
      await git(khoChinh, ['worktree', 'prune']).catch(() => '');
      const m = String((e as { stderr?: string }).stderr || (e as Error).message).split('\n')[0]?.slice(0, 200);
      return { ok: false, loi: `không tạo được worktree cho agent phụ: ${m}` };
    }
  }

  // Không phải git ⇒ chép.
  const bam = new Map<string, string>();
  let soFile = 0;
  let soByte = 0;
  const chep = async (tu: string, den: string, rel: string): Promise<string | null> => {
    const ds = await fs.readdir(tu, { withFileTypes: true });
    await fs.mkdir(den, { recursive: true });
    for (const d of ds) {
      if (BO_QUA.has(d.name)) continue;
      const r = rel ? `${rel}/${d.name}` : d.name;
      if (d.isDirectory()) { const l = await chep(path.join(tu, d.name), path.join(den, d.name), r); if (l) return l; }
      else if (d.isFile()) {
        const b = await fs.readFile(path.join(tu, d.name));
        soFile += 1; soByte += b.length;
        if (soFile > TRAN_FILE_TAM || soByte > TRAN_BYTE_TAM) return `thư mục quá lớn để sao chép (>${TRAN_FILE_TAM} file hoặc >100MB) — hãy \`git init\` + commit để agent phụ ghi chạy trong worktree.`;
        await fs.writeFile(path.join(den, d.name), b);
        bam.set(r, bamChu(b));
      }
    }
    return null;
  };
  try {
    const loi = await chep(goc, dich, '');
    if (loi) { await fs.rm(dich, { recursive: true, force: true }).catch(() => {}); return { ok: false, loi }; }
  } catch (e) {
    await fs.rm(dich, { recursive: true, force: true }).catch(() => {});
    return { ok: false, loi: `không sao chép được dự án: ${(e as Error).message}` };
  }
  const khu: KhuPhu = { id, loai: 'tam', thuMuc: dich, goc, bam };
  khuDangCo.set(id, khu);
  return { ok: true, khu };
}

export function layKhu(id: string): KhuPhu | null { return khuDangCo.get(id) ?? null; }

async function docBuf(p: string): Promise<Buffer | null> { return fs.readFile(p).catch(() => null); }

/** Liệt kê thay đổi trong khu so với mốc. */
export async function thayDoiCuaKhu(khu: KhuPhu): Promise<ThayDoi[]> {
  const ra: ThayDoi[] = [];
  if (khu.loai === 'worktree') {
    const gocKhu = khu.gocKhu!;
    const env = { GIT_INDEX_FILE: `${gocKhu}.index` };
    await git(gocKhu, ['add', '-A'], env);
    const moiTree = (await git(gocKhu, ['write-tree'], env)).trim();
    const ns = (await git(gocKhu, ['diff', '--name-status', '--no-renames', '-z', khu.baseTree!, moiTree])).split('\0').filter(Boolean);
    const con = path.relative(gocKhu, khu.thuMuc);
    for (let i = 0; i + 1 < ns.length; i += 2) {
      const tt = ns[i]!;
      const relKho = ns[i + 1]!;
      // Chỉ file trong thư mục dự án (khi dự án là thư mục con của kho).
      if (con && !relKho.startsWith(`${con.split(path.sep).join('/')}/`)) continue;
      const rel = con ? relKho.slice(con.length + 1) : relKho;
      const base = tt === 'A' ? null : await git(gocKhu, ['show', `${khu.baseTree}:${relKho}`]).catch(() => null);
      const buf = tt === 'D' ? null : await docBuf(path.join(gocKhu, relKho));
      const nhiPhan = (buf && laNhiPhan(buf)) || (base !== null && base.includes('\0'));
      const maBase = nhiPhan && tt !== 'A' ? (await git(gocKhu, ['rev-parse', `${khu.baseTree}:${relKho}`]).catch(() => '')).trim() || null : null;
      ra.push({
        rel, kieu: tt === 'A' ? 'them' : tt === 'D' ? 'xoa' : 'sua',
        base: nhiPhan ? null : base, moi: buf && !nhiPhan ? buf.toString('utf8') : null,
        ...(nhiPhan ? { nhiPhan: true, maBase } : {}),
      });
    }
    return ra;
  }
  // tạm: duyệt lại cây, so băm.
  const thay = new Set<string>();
  const duyet = async (dir: string, rel: string): Promise<void> => {
    const ds = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const d of ds) {
      if (BO_QUA.has(d.name)) continue;
      const r = rel ? `${rel}/${d.name}` : d.name;
      if (d.isDirectory()) await duyet(path.join(dir, d.name), r);
      else if (d.isFile()) thay.add(r);
    }
  };
  await duyet(khu.thuMuc, '');
  for (const r of thay) {
    const b = (await docBuf(path.join(khu.thuMuc, r)))!;
    const cu = khu.bam!.get(r);
    if (cu === bamChu(b)) continue;
    const nhiPhan = laNhiPhan(b);
    const base = cu === undefined ? null : await fs.readFile(path.join(khu.goc, r), 'utf8').catch(() => null);
    ra.push({ rel: r, kieu: cu === undefined ? 'them' : 'sua', base: nhiPhan ? null : base, moi: nhiPhan ? null : b.toString('utf8'), ...(nhiPhan ? { nhiPhan: true, maBase: cu ?? null } : {}) });
  }
  for (const r of khu.bam!.keys()) if (!thay.has(r)) ra.push({ rel: r, kieu: 'xoa', base: await fs.readFile(path.join(khu.goc, r), 'utf8').catch(() => null), moi: null });
  return ra.sort((a, b) => a.rel.localeCompare(b.rel));
}

/** Bản tóm tắt cho model/người dùng: thống kê + diff rút gọn (trần ký tự). */
export function tomTatThayDoi(ds: ThayDoi[], tranKyTu = 6000): string {
  if (!ds.length) return '(không có thay đổi nào)';
  const dong: string[] = [];
  let tongThem = 0; let tongBo = 0;
  const than: string[] = [];
  for (const t of ds) {
    if (t.nhiPhan) { dong.push(`  ${t.kieu === 'them' ? 'A' : t.kieu === 'xoa' ? 'D' : 'M'} ${t.rel} (nhị phân — gộp bằng chép nguyên tệp)`); continue; }
    const d = soSanhDong(t.base ?? '', t.moi ?? '');
    tongThem += d.soThem; tongBo += d.soBo;
    dong.push(`  ${t.kieu === 'them' ? 'A' : t.kieu === 'xoa' ? 'D' : 'M'} ${t.rel}  +${d.soThem} −${d.soBo}`);
    const doan = d.dong.filter((x) => x.loai !== 'giu').slice(0, 60)
      .map((x) => `${x.loai === 'them' ? '+' : '-'} ${x.text}`).join('\n');
    if (doan) than.push(`--- ${t.rel}\n${doan}`);
  }
  let diff = than.join('\n\n');
  if (diff.length > tranKyTu) diff = `${diff.slice(0, tranKyTu)}\n[… diff còn ${diff.length - tranKyTu} ký tự, đã cắt]`;
  return `${ds.length} file (+${tongThem} −${tongBo}):\n${dong.join('\n')}${diff ? `\n\n${diff}` : ''}`;
}

/**
 * GỘP về cây gốc. Chỉ file văn bản; file nào ở cây gốc đã KHÁC mốc ⇒ xung đột, bỏ qua.
 * `chiFile` (rel) để gộp một phần. Ghi qua `ghiSoTruoc` ⇒ /undo phủ được.
 */
export async function gopVaoGoc(khu: KhuPhu, ds: ThayDoi[], so: SoCuoc, chiFile?: string[]): Promise<{ ghi: string[]; xungDot: string[]; boQua: string[]; khongLui: string[] }> {
  const ghi: string[] = []; const xungDot: string[] = []; const boQua: string[] = []; const khongLui: string[] = [];
  const chon = chiFile?.length ? new Set(chiFile) : null;
  for (const t of ds) {
    if (chon && !chon.has(t.rel)) continue;
    const dich = path.resolve(khu.goc, t.rel);
    if (!dich.startsWith(path.resolve(khu.goc) + path.sep)) { boQua.push(t.rel); continue; }
    if (t.nhiPhan) {
      /* ĐỢT 4 — NHỊ PHÂN: so mã nội dung hiện tại ở dự án với mốc (blob sha / sha1); khớp ⇒ chép nguyên tệp. */
      const hienTai = await docBuf(dich);
      const maNay = hienTai === null ? null
        : khu.loai === 'worktree' ? (await git(khu.khoChinh!, ['hash-object', dich]).catch(() => '')).trim() || '?'
          : bamChu(hienTai);
      if ((maNay ?? null) !== (t.maBase ?? null)) { xungDot.push(t.rel); continue; }
      if (t.kieu === 'xoa') { await fs.rm(dich, { force: true }); khongLui.push(t.rel); }
      else {
        const moi = await docBuf(path.join(khu.thuMuc, t.rel));
        if (!moi) { boQua.push(t.rel); continue; }
        if (hienTai === null) ghiSoTruoc(so, dich, null); else khongLui.push(t.rel);
        await fs.mkdir(path.dirname(dich), { recursive: true });
        await fs.writeFile(dich, moi);
      }
      ghi.push(t.rel);
      continue;
    }
    const hienTai = await fs.readFile(dich, 'utf8').catch(() => null);
    if ((hienTai ?? null) !== (t.base ?? null)) { xungDot.push(t.rel); continue; }
    ghiSoTruoc(so, dich, hienTai);
    if (t.moi === null) await fs.rm(dich, { force: true });
    else { await fs.mkdir(path.dirname(dich), { recursive: true }); await fs.writeFile(dich, t.moi, 'utf8'); }
    ghi.push(t.rel);
  }
  return { ghi, xungDot, boQua, khongLui };
}

/**
 * ĐỢT 4 — GỘP BẰNG `git merge` (tuỳ chọn): giữ lịch sử — một commit của agent
 * phụ (cây khu, cha = HEAD lúc giao việc) trên nhánh `cuongmini/phu-<id>`, rồi
 * `git merge --no-ff` vào nhánh hiện tại. Chỉ chạy khi:
 *   • khu là worktree và lúc giao việc cây làm việc SẠCH (mốc = HEAD — nếu mốc
 *     là `stash create` thì commit sẽ chở luôn thay đổi chưa commit của bạn);
 *   • bây giờ cây làm việc (file đã theo dõi) cũng sạch — merge không được đè.
 * Xung đột ⇒ `git merge --abort`, trả danh sách file, không để repo dở dang.
 */
export async function gopBangMerge(khu: KhuPhu, nhiemVu: string): Promise<{ ok: true; sha: string; nhanh: string } | { ok: false; loi: string; xungDot?: string[] }> {
  if (khu.loai !== 'worktree' || !khu.khoChinh || !khu.gocKhu || !khu.mocCommit) return { ok: false, loi: 'dự án không phải kho git (agent phụ chạy trên bản sao) — dùng cách chép file (mặc định).' };
  if (!khu.mocLaHead) return { ok: false, loi: 'lúc giao việc cây làm việc có thay đổi CHƯA commit — commit của agent phụ sẽ chở luôn chúng. Commit trước rồi giao lại, hoặc gộp bằng chép file.' };
  const ban = (await git(khu.khoChinh, ['status', '--porcelain', '--untracked-files=no']).catch(() => 'x')).trim();
  if (ban) return { ok: false, loi: `cây làm việc đang có thay đổi chưa commit (${ban.split('\n').length} file) — merge không được đè. Commit/stash trước, hoặc gộp bằng chép file.` };
  const env = { GIT_INDEX_FILE: `${khu.gocKhu}.index` };
  try {
    await git(khu.gocKhu, ['add', '-A'], env);
    const tree = (await git(khu.gocKhu, ['write-tree'], env)).trim();
    const tieuDe = `agent phụ: ${nhiemVu.replace(/\s+/g, ' ').slice(0, 60)}`;
    const commitSha = (await git(khu.gocKhu, ['commit-tree', tree, '-p', khu.mocCommit, '-m', tieuDe, '-m', `Do agent phụ CuongMini (${khu.id}) làm trong worktree riêng.`])).trim();
    const nhanh = `cuongmini/phu-${khu.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(-20)}`;
    await git(khu.khoChinh, ['branch', '-f', nhanh, commitSha]);
    try {
      await git(khu.khoChinh, ['merge', '--no-ff', '--no-edit', '-m', `Gộp ${tieuDe}`, nhanh]);
    } catch (e) {
      const xd = (await git(khu.khoChinh, ['diff', '--name-only', '--diff-filter=U']).catch(() => '')).split('\n').filter(Boolean);
      await git(khu.khoChinh, ['merge', '--abort']).catch(() => '');
      return { ok: false, loi: `git merge xung đột — đã huỷ merge, repo về như cũ. ${String((e as { stderr?: string }).stderr || (e as Error).message).split('\n')[0]?.slice(0, 160) ?? ''}`, xungDot: xd };
    }
    const sha = (await git(khu.khoChinh, ['rev-parse', 'HEAD'])).trim();
    await git(khu.khoChinh, ['branch', '-D', nhanh]).catch(() => '');
    return { ok: true, sha, nhanh };
  } catch (e) {
    const m = String((e as { stderr?: string }).stderr || (e as Error).message).split('\n')[0]?.slice(0, 200);
    return { ok: false, loi: `không tạo được commit/merge: ${m}${/identity|user\.email|user\.name/i.test(m ?? '') ? ' — đặt `git config user.name` / `user.email` trước.' : ''}` };
  }
}

/** Dọn khu (worktree remove --force: khu là của APP, thay đổi đã gộp hoặc bị bỏ). */
export async function donKhu(id: string): Promise<void> {
  const khu = khuDangCo.get(id);
  if (!khu) return;
  khuDangCo.delete(id);
  const gocKhu = khu.gocKhu ?? khu.thuMuc;
  if (khu.loai === 'worktree' && khu.khoChinh) {
    await git(khu.khoChinh, ['worktree', 'remove', '--force', gocKhu]).catch(() => '');
  }
  await fs.rm(gocKhu, { recursive: true, force: true }).catch(() => {});
  await fs.rm(`${gocKhu}.index`, { force: true }).catch(() => {});
  if (khu.loai === 'worktree' && khu.khoChinh) await git(khu.khoChinh, ['worktree', 'prune']).catch(() => '');
}

export async function donMoiKhu(ids?: Iterable<string>): Promise<void> {
  for (const id of [...(ids ?? khuDangCo.keys())]) await donKhu(id);
}

export function coKhu(): boolean { return khuDangCo.size > 0 || existsSync(goc_tam()); }
