/**
 * ============================================================
 * GIT GHI — commit, đẩy nhánh, mở PR
 * ============================================================
 *
 * Cho tới bản này agent chỉ ĐỌC được git (`git_status`, `git_diff`). Nó sửa
 * xong mười file rồi người dùng phải tự mở terminal gõ lại từ đầu.
 *
 * ─── BỐN RÀNG BUỘC CỨNG, KHÔNG CÓ CỜ NÀO TẮT ĐƯỢC ───
 *
 *  1. **KHÔNG BAO GIỜ commit hay đẩy lên `main`/`master`.** Đây là nhánh chung;
 *     một agent ghi thẳng vào đó là hỏng việc của tất cả mọi người. Muốn làm
 *     việc thì tạo nhánh — hoặc dùng worktree, vốn đã luôn ở nhánh riêng.
 *  2. **KHÔNG `--force`, không `--amend`.** Cả hai viết lại lịch sử đã có; sai
 *     ở đó là mất commit của người khác, và không có nút hoàn tác nào.
 *  3. **KHÔNG bao giờ `git add .`** — thêm từng đường dẫn một. `add .` cuốn cả
 *     file tạm, thư mục build, và những file bí mật mà `.gitignore` lỡ sót.
 *  4. **Chặn lại danh sách file bí mật** trước khi stage, dù `.gitignore` nói
 *     gì. Cùng danh sách với nhà tù đường dẫn — xem `jail.ts`.
 *
 * Cộng thêm: MỌI lời gọi ở đây đều phải người dùng duyệt, và thẻ duyệt hiện
 * đúng những gì sắp xảy ra (nhánh nào, file nào, lời nhắn gì).
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileBiCam } from './jail';

const chay = promisify(execFile);

const NHANH_CAM = new Set(['main', 'master', 'trunk', 'develop', 'production', 'release']);

async function git(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await chay('git', args, { cwd, timeout: 60_000, windowsHide: true });
  return stdout;
}

export interface KetQuaGit { ok: boolean; noi: string; loi?: string }

async function nhanhHienTai(cwd: string): Promise<string | null> {
  try {
    const s = (await git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD'])).trim();
    return s && s !== 'HEAD' ? s : null;
  } catch {
    return null;
  }
}

/**
 * Đường dẫn đang có thay đổi (đã stage hoặc chưa), theo `git status --porcelain`.
 *
 * ⚠️ `--untracked-files=all` (16/10/2026): mặc định git GỘP một thư mục chưa
 * theo dõi thành MỘT dòng `src/` — rồi `git add -- src/` cuốn sạch mọi thứ
 * bên trong, kể cả `src/.env` mà bộ lọc bí mật chưa từng thấy tên. Liệt kê
 * từng file thì bộ lọc soi được từng cái.
 * ⚠️ Đổi tên (`R`) / chép (`C`) với `-z` cho ra HAI mục: đích rồi NGUỒN, và
 * mục nguồn KHÔNG có tiền tố trạng thái — cắt 3 ký tự đầu của nó là ra một
 * đường dẫn sai. Bỏ qua mục nguồn.
 */
async function fileDaDoi(cwd: string): Promise<string[]> {
  const tho = await git(cwd, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  const muc = tho.split('\0');
  const ra: string[] = [];
  for (let i = 0; i < muc.length; i += 1) {
    const d = muc[i]!;
    if (d.length < 4) continue;
    // `XY <đường dẫn>` — 2 ký tự trạng thái, một khoảng trắng, rồi đường dẫn.
    ra.push(d.slice(3));
    if (d[0] === 'R' || d[0] === 'C') i += 1;
  }
  return ra;
}

/** Chủ của repo `origin` trên GitHub (`owner` trong github.com/owner/repo), hoặc `null`. */
export async function chuRepoGithub(cwd: string): Promise<string | null> {
  try {
    const url = (await git(cwd, ['remote', 'get-url', 'origin'])).trim();
    const m = url.match(/github\.com[:/]([^/]+)\/[^/]+?(?:\.git)?\/?$/i);
    return m ? m[1]! : null;
  } catch {
    return null;
  }
}

/**
 * Repo này là của RIÊNG người dùng không — `origin` thuộc đúng tài khoản GitHub
 * đang đăng nhập.
 *
 * Luật "không bao giờ ghi vào main" sinh ra để bảo vệ NHÁNH CHUNG của một
 * nhóm. Với người mới (chủ app 16/10/2026: "user chưa bao giờ dùng github
 * muốn commit push project đang làm"), repo của họ chỉ có mỗi `main` và chỉ
 * mình họ dùng — chặn ở đó là chặn đúng người cần giúp nhất. Nên `main`/
 * `master` được mở CHỈ KHI repo thuộc chính tài khoản đang đăng nhập; repo
 * của tổ chức hay của người khác thì luật cũ giữ nguyên.
 */
export async function laRepoCuaToi(cwd: string): Promise<boolean> {
  const chu = await chuRepoGithub(cwd);
  if (!chu) return false;
  try {
    const { taiKhoanGithub } = await import('./congCu');
    const tk = await taiKhoanGithub();
    return !!tk && tk.toLowerCase() === chu.toLowerCase();
  } catch {
    return false;
  }
}

const NHANH_CA_NHAN_DUOC = new Set(['main', 'master']);

/** Nhánh này có bị cấm ghi không — tính cả ngoại lệ repo cá nhân. */
async function nhanhBiCam(cwd: string, nhanh: string): Promise<boolean> {
  if (!NHANH_CAM.has(nhanh)) return false;
  return !(NHANH_CA_NHAN_DUOC.has(nhanh) && await laRepoCuaToi(cwd));
}

export interface ChuanBiCommit {
  ok: boolean;
  loi?: string;
  nhanh?: string;
  file?: string[];
  /** File bị chặn vì nằm trong danh sách bí mật — hiện cho người dùng thấy. */
  daChan?: string[];
}

/**
 * Xem trước một commit: nhánh nào, những file nào sẽ vào.
 *
 * Tách khỏi lúc commit thật để thẻ duyệt hiện được đúng nội dung — người dùng
 * duyệt cái họ ĐỌC, không phải duyệt một cái tên hàm.
 */
export async function chuanBiCommit(cwd: string): Promise<ChuanBiCommit> {
  const nhanh = await nhanhHienTai(cwd);
  if (!nhanh) return { ok: false, loi: 'Không xác định được nhánh (HEAD đang tách rời?).' };
  if (await nhanhBiCam(cwd, nhanh)) {
    return {
      ok: false,
      loi: `Đang ở nhánh "${nhanh}" — agent KHÔNG commit vào nhánh chung. `
        + 'Hãy tạo nhánh mới (hoặc dùng worktree) rồi làm lại. Nếu đây là dự án CỦA RIÊNG người dùng chưa lên GitHub '
        + 'thì dùng `github_dang_du_an` (nó commit lần đầu + tạo repo riêng của họ).',
    };
  }

  let tatCa: string[];
  try {
    tatCa = await fileDaDoi(cwd);
  } catch (err) {
    return { ok: false, loi: `Không đọc được trạng thái git: ${(err as Error).message}` };
  }
  if (tatCa.length === 0) return { ok: false, loi: 'Không có thay đổi nào để commit.' };

  const daChan = tatCa.filter((p) => fileBiCam(p));
  const file = tatCa.filter((p) => !fileBiCam(p));
  if (file.length === 0) {
    return { ok: false, loi: 'Mọi file đang đổi đều nằm trong danh sách cấm (.env, khoá…). Không commit gì cả.' };
  }
  return { ok: true, nhanh, file, ...(daChan.length ? { daChan } : {}) };
}

export async function commit(cwd: string, loiNhan: string, file: string[]): Promise<KetQuaGit> {
  const nhanh = await nhanhHienTai(cwd);
  // Kiểm LẠI ngay trước khi ghi. Giữa lúc dựng thẻ duyệt và lúc người dùng bấm
  // có thể là vài phút, và họ có thể đã đổi nhánh trong terminal.
  if (!nhanh || await nhanhBiCam(cwd, nhanh)) {
    return { ok: false, noi: '', loi: `Không commit được: nhánh hiện tại là "${nhanh ?? 'HEAD tách rời'}".` };
  }
  await damBaoDanhTinh(cwd);
  const sach = file.filter((p) => !fileBiCam(p));
  if (sach.length === 0) return { ok: false, noi: '', loi: 'Không còn file hợp lệ nào để commit.' };

  try {
    // `--` ngăn một đường dẫn bắt đầu bằng `-` bị hiểu thành tuỳ chọn.
    await git(cwd, ['add', '--', ...sach]);
    await git(cwd, ['commit', '-m', loiNhan]);
    const bam = (await git(cwd, ['rev-parse', '--short', 'HEAD'])).trim();
    return { ok: true, noi: `Đã commit ${bam} trên nhánh ${nhanh} (${sach.length} file).` };
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    return { ok: false, noi: '', loi: m.split('\n').slice(0, 3).join(' ').slice(0, 300) };
  }
}

/**
 * Máy chưa từng đặt tên/email commit ⇒ `git commit` chết với "Please tell me
 * who you are" — câu tiếng Anh người mới không hiểu. Đặt hộ: theo tài khoản
 * GitHub nếu đã kết nối, không thì theo tên người dùng của máy (chỉ trong repo này).
 */
async function damBaoDanhTinh(cwd: string): Promise<void> {
  const co = async (k: string) => { try { return (await git(cwd, ['config', k])).trim(); } catch { return ''; } };
  if (await co('user.name') && await co('user.email')) return;
  try {
    const { datDanhTinhGit } = await import('./congCu');
    await datDanhTinhGit();
  } catch { /* không có gh — đặt cục bộ ở dưới */ }
  if (!(await co('user.name'))) await git(cwd, ['config', 'user.name', os.userInfo().username]).catch(() => '');
  if (!(await co('user.email'))) await git(cwd, ['config', 'user.email', `${os.userInfo().username}@users.noreply.github.com`]).catch(() => '');
}

export interface ChuanBiPr {
  ok: boolean;
  loi?: string;
  nhanh?: string;
  /** Nhánh đã có trên remote chưa — quyết định lần đẩy này là tạo mới hay cập nhật. */
  daCoTrenRemote?: boolean;
  soCommit?: number;
}

export async function chuanBiPr(cwd: string): Promise<ChuanBiPr> {
  const nhanh = await nhanhHienTai(cwd);
  if (!nhanh) return { ok: false, loi: 'Không xác định được nhánh.' };
  if (NHANH_CAM.has(nhanh)) {
    return { ok: false, loi: `Đang ở nhánh "${nhanh}" — không mở PR từ nhánh chung.` };
  }
  try {
    await chay('gh', ['--version'], { timeout: 10_000, windowsHide: true });
  } catch {
    return { ok: false, loi: 'Máy chưa cài `gh` (GitHub CLI), hoặc chưa đăng nhập. Cài rồi chạy `gh auth login`.' };
  }
  let daCo = false;
  try {
    const r = await git(cwd, ['ls-remote', '--heads', 'origin', nhanh]);
    daCo = r.trim().length > 0;
  } catch { /* không có remote — `push -u` bên dưới sẽ nói lý do rõ hơn */ }

  let soCommit = 0;
  try {
    const r = await git(cwd, ['rev-list', '--count', daCo ? `origin/${nhanh}..HEAD` : 'HEAD', '--']);
    soCommit = Number(r.trim()) || 0;
  } catch { /* nhánh mới chưa có gốc so sánh */ }

  return { ok: true, nhanh, daCoTrenRemote: daCo, soCommit };
}

/**
 * Đẩy nhánh rồi mở PR.
 *
 * ⚠️ ĐÂY LÀ HÀNH ĐỘNG RA NGOÀI — nó tạo một thứ người khác nhìn thấy và nhận
 * thông báo. Vì thế nó phải qua thẻ duyệt riêng, và thẻ đó hiện tên nhánh cùng
 * tiêu đề PR để người dùng đọc trước khi bấm.
 *
 * `push -u origin <nhánh>` KHÔNG kèm `--force`: nhánh đã tồn tại mà lịch sử đã
 * phân kỳ thì git từ chối, và từ chối là đúng.
 */
export async function taoPr(
  cwd: string,
  tieuDe: string,
  than: string,
): Promise<KetQuaGit> {
  const nhanh = await nhanhHienTai(cwd);
  if (!nhanh || NHANH_CAM.has(nhanh)) {
    return { ok: false, noi: '', loi: `Không mở PR từ nhánh "${nhanh ?? 'HEAD tách rời'}".` };
  }
  try {
    await git(cwd, ['push', '-u', 'origin', nhanh]);
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    return { ok: false, noi: '', loi: `Đẩy nhánh hỏng: ${m.split('\n').slice(0, 2).join(' ').slice(0, 250)}` };
  }
  try {
    const { stdout } = await chay(
      'gh', ['pr', 'create', '--title', tieuDe, '--body', than, '--head', nhanh],
      { cwd, timeout: 60_000, windowsHide: true },
    );
    const url = stdout.trim().split('\n').filter((l) => l.startsWith('http')).pop() ?? stdout.trim();
    return { ok: true, noi: `Đã mở PR: ${url}` };
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    // Nhánh đã đẩy lên rồi — nói rõ, vì đó là một thay đổi ĐÃ xảy ra ngoài máy
    // người dùng dù PR không tạo được.
    return {
      ok: false,
      noi: `Nhánh "${nhanh}" ĐÃ được đẩy lên origin.`,
      loi: `Nhưng không mở được PR: ${m.split('\n').slice(0, 2).join(' ').slice(0, 250)}`,
    };
  }
}

// ─── ĐẨY lên origin, và ĐƯA DỰ ÁN LÊN GITHUB lần đầu (16/10/2026) ────────

export interface ChuanBiDay { ok: boolean; loi?: string; nhanh?: string; soCommit?: number; coUpstream?: boolean }

export async function chuanBiDay(cwd: string): Promise<ChuanBiDay> {
  const nhanh = await nhanhHienTai(cwd);
  if (!nhanh) return { ok: false, loi: 'Không xác định được nhánh.' };
  if (await nhanhBiCam(cwd, nhanh)) {
    return { ok: false, loi: `Nhánh "${nhanh}" là nhánh chung của một repo KHÔNG thuộc tài khoản đang đăng nhập — không đẩy thẳng. Tạo nhánh riêng rồi \`tao_pr\`.` };
  }
  try { await git(cwd, ['remote', 'get-url', 'origin']); } catch {
    return { ok: false, loi: 'Repo chưa có origin. Dự án chưa lên GitHub thì dùng `github_dang_du_an`.' };
  }
  let coUpstream = true;
  let soCommit = 0;
  try {
    soCommit = Number((await git(cwd, ['rev-list', '--count', '@{u}..HEAD'])).trim()) || 0;
  } catch {
    coUpstream = false;
    try { soCommit = Number((await git(cwd, ['rev-list', '--count', 'HEAD'])).trim()) || 0; } catch { /* repo rỗng */ }
  }
  if (coUpstream && soCommit === 0) return { ok: false, loi: 'Không có commit nào mới để đẩy — mọi thứ đã nằm trên GitHub.' };
  return { ok: true, nhanh, soCommit, coUpstream };
}

/** `git push -u origin <nhánh>` — KHÔNG BAO GIỜ `--force`. */
export async function dayNhanh(cwd: string): Promise<KetQuaGit> {
  const cb = await chuanBiDay(cwd);
  if (!cb.ok) return { ok: false, noi: '', loi: cb.loi ?? 'Không đẩy được.' };
  try {
    await git(cwd, ['push', '-u', 'origin', cb.nhanh!]);
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    const goiY = /rejected|non-fast-forward|fetch first/i.test(m)
      ? ' (trên GitHub có commit mà máy chưa có — chạy `git pull --rebase` qua run_command rồi đẩy lại; KHÔNG đẩy ép)'
      : /Authentication|could not read Username|403/i.test(m) ? ' (chưa đăng nhập GitHub — gọi `github_ket_noi`)' : '';
    return { ok: false, noi: '', loi: `Đẩy hỏng: ${m.split('\n').slice(0, 2).join(' ').slice(0, 250)}${goiY}` };
  }
  return { ok: true, noi: `Đã đẩy ${cb.soCommit} commit của nhánh ${cb.nhanh} lên GitHub.` };
}

export interface KeHoachDangDuAn {
  ok: boolean;
  loi?: string;
  canInit: boolean;
  taoGitignore: boolean;
  file: string[];
  daChan: string[];
  quaLon: string[];
  coOrigin: boolean;
}

/** Xem trước: sẽ init không, sẽ tạo .gitignore không, những file nào sẽ lên. */
export async function keHoachDangDuAn(cwd: string): Promise<KeHoachDangDuAn> {
  const canInit = !existsSync(path.join(cwd, '.git'));
  const taoGitignore = !existsSync(path.join(cwd, '.gitignore'));
  const rong: KeHoachDangDuAn = { ok: true, canInit, taoGitignore, file: [], daChan: [], quaLon: [], coOrigin: false };
  if (canInit) {
    // Chưa phải repo: liệt kê bằng một repo TẠM trong bộ nhớ thì phiền — init
    // thật luôn ở bước thực hiện; ở đây chỉ báo trước là sẽ init.
    return rong;
  }
  try { await git(cwd, ['remote', 'get-url', 'origin']); rong.coOrigin = true; } catch { /* chưa có */ }
  const tatCa = await fileDaDoi(cwd);
  rong.daChan = tatCa.filter((p) => fileBiCam(p));
  rong.file = tatCa.filter((p) => !fileBiCam(p));
  const { fileQuaLon } = await import('./congCu');
  rong.quaLon = await fileQuaLon(cwd, rong.file);
  rong.file = rong.file.filter((f) => !rong.quaLon.includes(f));
  return rong;
}

/**
 * Đưa dự án lên GitHub: init (nếu cần) → .gitignore an toàn (nếu chưa có) →
 * commit mọi file trừ file bí mật / quá lớn → tạo repo trên tài khoản của
 * người dùng (riêng tư mặc định) → đẩy. Dự án ĐÃ có origin thì chỉ commit + đẩy.
 */
export async function dangDuAn(
  cwd: string,
  opts: { tenRepo: string; riengTu: boolean; moTa?: string; loiNhan: string },
): Promise<KetQuaGit & { url?: string }> {
  const { GITIGNORE_MAC_DINH, fileQuaLon } = await import('./congCu');
  try {
    if (!existsSync(path.join(cwd, '.git'))) await git(cwd, ['init', '-b', 'main']);
    if (!existsSync(path.join(cwd, '.gitignore'))) await writeFile(path.join(cwd, '.gitignore'), GITIGNORE_MAC_DINH, 'utf8');
    await damBaoDanhTinh(cwd);
    // Repo ĐÃ có origin: luật nhánh chung vẫn áp — tool này không phải cửa sau
    // để ghi thẳng vào main của một repo nhóm.
    {
      let coOriginSan = true;
      try { await git(cwd, ['remote', 'get-url', 'origin']); } catch { coOriginSan = false; }
      const nh = await nhanhHienTai(cwd);
      if (coOriginSan && nh && await nhanhBiCam(cwd, nh)) {
        return { ok: false, noi: '', loi: `Repo này đã có trên GitHub nhưng KHÔNG thuộc tài khoản đang đăng nhập, và đang ở nhánh chung "${nh}". Tạo nhánh riêng, \`git_commit\`, rồi \`tao_pr\`.` };
      }
    }

    const tatCa = await fileDaDoi(cwd);
    const lon = await fileQuaLon(cwd, tatCa);
    const sach = tatCa.filter((p) => !fileBiCam(p) && !lon.includes(p));
    if (sach.length) {
      await git(cwd, ['add', '--', ...sach]);
      await git(cwd, ['commit', '-m', opts.loiNhan]);
    }
    let coCommit = true;
    try { await git(cwd, ['rev-parse', 'HEAD']); } catch { coCommit = false; }
    if (!coCommit) return { ok: false, noi: '', loi: 'Dự án chưa có file nào để đưa lên.' };

    let coOrigin = true;
    try { await git(cwd, ['remote', 'get-url', 'origin']); } catch { coOrigin = false; }
    if (!coOrigin) {
      const tham = ['repo', 'create', opts.tenRepo, opts.riengTu ? '--private' : '--public',
        '--source', '.', '--remote', 'origin', '--push'];
      if (opts.moTa) tham.push('--description', opts.moTa.slice(0, 300));
      await chay('gh', tham, { cwd, timeout: 180_000, windowsHide: true });
    } else {
      const nhanh = await nhanhHienTai(cwd);
      await git(cwd, ['push', '-u', 'origin', nhanh ?? 'HEAD']);
    }
    let url = '';
    try { url = (await chay('gh', ['repo', 'view', '--json', 'url', '-q', '.url'], { cwd, timeout: 30_000, windowsHide: true })).stdout.trim(); } catch { /* bỏ */ }
    const ghi = [
      `Đã đưa dự án lên GitHub${url ? `: ${url}` : ''} (${opts.riengTu ? 'RIÊNG TƯ — chỉ người dùng thấy' : 'CÔNG KHAI'}).`,
      sach.length ? `Commit ${sach.length} file.` : 'Không có thay đổi mới — chỉ đẩy các commit có sẵn.',
      lon.length ? `BỎ QUA vì quá 95MB (GitHub từ chối): ${lon.join(', ')}.` : '',
    ].filter(Boolean).join(' ');
    return { ok: true, noi: ghi, ...(url ? { url } : {}) };
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    const goiY = /Name already exists/i.test(m) ? ' (tên repo đã có trên tài khoản — chọn tên khác)'
      : /auth|login|401|403/i.test(m) ? ' (chưa đăng nhập GitHub — gọi `github_ket_noi`)' : '';
    return { ok: false, noi: '', loi: `${m.split('\n').slice(0, 3).join(' ').slice(0, 300)}${goiY}` };
  }
}
