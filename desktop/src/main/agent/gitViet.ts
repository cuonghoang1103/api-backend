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

/** Đường dẫn đang có thay đổi (đã stage hoặc chưa), theo `git status --porcelain`. */
async function fileDaDoi(cwd: string): Promise<string[]> {
  const tho = await git(cwd, ['status', '--porcelain=v1', '-z']);
  return tho
    .split('\0')
    .filter(Boolean)
    // `XY <đường dẫn>` — 2 ký tự trạng thái, một khoảng trắng, rồi đường dẫn.
    .map((d) => d.slice(3))
    .filter(Boolean);
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
  if (NHANH_CAM.has(nhanh)) {
    return {
      ok: false,
      loi: `Đang ở nhánh "${nhanh}" — agent KHÔNG commit vào nhánh chung. `
        + 'Hãy tạo nhánh mới (hoặc dùng worktree) rồi làm lại.',
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
  if (!nhanh || NHANH_CAM.has(nhanh)) {
    return { ok: false, noi: '', loi: `Không commit được: nhánh hiện tại là "${nhanh ?? 'HEAD tách rời'}".` };
  }
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
