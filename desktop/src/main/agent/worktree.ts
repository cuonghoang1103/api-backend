/**
 * ============================================================
 * WORKTREE — cho agent một bản sao riêng của repo để nghịch
 * ============================================================
 *
 * `git worktree` cho phép nhiều thư mục làm việc cùng trỏ vào MỘT kho git.
 * Mỗi thư mục ở một nhánh khác nhau, sửa độc lập, chung lịch sử.
 *
 * ─── VÌ SAO NÓ ĐÁNG CÓ Ở ĐÂY ───
 * Từ khi mỗi tab một thư mục dự án, hai tab CÓ THỂ chạy song song — nhưng nếu
 * cả hai trỏ vào cùng một repo và cùng được phép ghi thì chúng vẫn đè lên nhau,
 * nên `chayLuot` phải chặn. Worktree gỡ đúng nút đó: hai tab, hai worktree, hai
 * đường dẫn khác nhau ⇒ khoá không còn phải chặn, và không ai đè ai.
 *
 * Nó cũng trả lời một nỗi sợ rất thật: "để agent sửa thẳng vào chỗ tôi đang
 * làm dở thì sao?". Với worktree thì câu trả lời là nó KHÔNG sửa — cây làm
 * việc của bạn không bị đụng tới, agent nghịch ở bản sao, xong thì merge hoặc
 * vứt.
 *
 * ─── NƠI ĐẶT: THƯ MỤC ANH EM, KHÔNG NẰM TRONG REPO ───
 * `<repo>/../<tên-repo>-worktrees/<nhánh>`. Đặt bên trong repo thì mọi
 * `git status`, mọi `grep -r`, mọi bộ dựng đều phải học cách bỏ qua nó — và cái
 * nào quên thì hỏng theo kiểu rất khó lần.
 *
 * ⛔ `execFile` chứ KHÔNG phải `exec`. `exec` đưa chuỗi cho shell; tên nhánh ở
 * đây do người dùng gõ, và một dấu `;` là đủ để nó thành lệnh khác.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const chay = promisify(execFile);

export interface Worktree {
  duongDan: string;
  nhanh: string | null;
  /** Đây có phải cây làm việc CHÍNH của repo không (cái người dùng tự mở). */
  laChinh: boolean;
  /** Worktree này do app tạo ra — chỉ những cái này mới cho xoá từ trong app. */
  cuaApp: boolean;
}

/** Tên nhánh app tạo luôn mang tiền tố này, để phân biệt với nhánh của người dùng. */
const TIEN_TO = 'agent/';

async function git(goc: string, args: string[]): Promise<string> {
  const { stdout } = await chay('git', args, { cwd: goc, timeout: 20_000, windowsHide: true });
  return stdout;
}

/** Thư mục chứa mọi worktree app tạo cho repo này. */
function thuMucChua(gocChinh: string): string {
  return path.join(path.dirname(gocChinh), `${path.basename(gocChinh)}-worktrees`);
}

/**
 * Thư mục gốc của KHO git chứa đường dẫn này.
 *
 * Cần nó vì `goc` của một tab có thể ĐANG LÀ một worktree; mọi thao tác quản lý
 * phải quy về cây chính, nếu không "danh sách worktree" của hai tab lại khác
 * nhau tuỳ tab nào đang đứng ở đâu.
 */
export async function gocChinhCua(goc: string): Promise<string | null> {
  try {
    // `--path-format=absolute` để không phải tự nối đường dẫn tương đối.
    const ra = (await git(goc, ['rev-parse', '--path-format=absolute', '--git-common-dir'])).trim();
    if (!ra) return null;
    // `<repo>/.git` → `<repo>`. Với worktree thì `--git-common-dir` đã trỏ về
    // `.git` của cây CHÍNH, nên chỉ cần bỏ đuôi.
    return path.basename(ra) === '.git' ? path.dirname(ra) : null;
  } catch {
    return null; // không phải kho git, hoặc máy không có git
  }
}

/**
 * Liệt kê worktree của repo.
 *
 * Đọc `git worktree list --porcelain` chứ không đọc thư mục: thư mục có thể còn
 * đó trong khi git đã quên nó (người dùng xoá tay), và ngược lại. Git mới là
 * bên nói đúng.
 */
export async function dsWorktree(goc: string): Promise<Worktree[]> {
  const chinh = await gocChinhCua(goc);
  if (!chinh) return [];
  let tho: string;
  try {
    tho = await git(chinh, ['worktree', 'list', '--porcelain']);
  } catch {
    return [];
  }

  const chua = thuMucChua(chinh);
  const ra: Worktree[] = [];
  let hienTai: { duongDan?: string; nhanh?: string | null } = {};
  const chot = (): void => {
    if (!hienTai.duongDan) return;
    const p = hienTai.duongDan;
    ra.push({
      duongDan: p,
      nhanh: hienTai.nhanh ?? null,
      laChinh: path.resolve(p) === path.resolve(chinh),
      // "Của app" = nằm trong thư mục app quản lý. Không suy từ tên nhánh:
      // người dùng hoàn toàn có thể tự tạo một nhánh tên `agent/…`, và xoá
      // nhầm worktree của họ là mất việc.
      cuaApp: path.resolve(p).startsWith(path.resolve(chua) + path.sep),
    });
    hienTai = {};
  };

  for (const dong of tho.split('\n')) {
    if (dong.startsWith('worktree ')) { chot(); hienTai.duongDan = dong.slice(9).trim(); }
    else if (dong.startsWith('branch ')) hienTai.nhanh = dong.slice(7).trim().replace(/^refs\/heads\//, '');
    else if (dong.trim() === 'detached') hienTai.nhanh = null;
  }
  chot();
  return ra;
}

/**
 * Tên nhánh người dùng gõ → tên an toàn.
 *
 * Git từ chối rất nhiều thứ trong tên nhánh (khoảng trắng, `..`, `~`, `^`, `:`,
 * dấu `/` ở cuối…). Lọc ở đây để người dùng nhận lỗi dễ hiểu thay vì một thông
 * báo của git, VÀ để không có ký tự nào lọt xuống thành đường dẫn.
 */
export function donTenNhanh(tho: string): string {
  return tho
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // bỏ dấu tiếng Việt
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 40);
}

export interface KetQuaTao {
  ok: boolean;
  duongDan?: string;
  nhanh?: string;
  loi?: string;
}

/**
 * Tạo một worktree mới, tách từ HEAD hiện tại.
 *
 * Trả về lỗi dạng chuỗi thay vì ném: đây là thao tác người dùng bấm, và mọi
 * cách hỏng (không phải repo git, tên trùng, repo chưa có commit nào) đều cần
 * một câu giải thích chứ không phải một vết stack.
 */
export async function taoWorktree(goc: string, tenTho: string): Promise<KetQuaTao> {
  const chinh = await gocChinhCua(goc);
  if (!chinh) return { ok: false, loi: 'Thư mục này không phải kho git (hoặc máy chưa cài git).' };

  const ten = donTenNhanh(tenTho);
  if (!ten) return { ok: false, loi: 'Tên không hợp lệ. Dùng chữ, số, dấu gạch ngang.' };

  const nhanh = `${TIEN_TO}${ten}`;
  const chua = thuMucChua(chinh);
  const dich = path.join(chua, ten);

  try {
    // Repo chưa có commit nào thì `worktree add` hỏng với một thông báo khó
    // hiểu ("invalid reference: HEAD"). Nói trước cho rõ.
    await git(chinh, ['rev-parse', '--verify', 'HEAD']);
  } catch {
    return { ok: false, loi: 'Repo chưa có commit nào — hãy commit lần đầu rồi mới tạo worktree.' };
  }

  try {
    await fs.mkdir(chua, { recursive: true });
    // `-b` tạo nhánh mới. Trùng tên thì git từ chối, và đó là hành vi ĐÚNG:
    // dùng lại một nhánh đang có nghĩa là ghi đè lên việc dở của lần trước.
    await git(chinh, ['worktree', 'add', '-b', nhanh, dich]);
    return { ok: true, duongDan: dich, nhanh };
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    if (/already exists/i.test(m)) {
      return { ok: false, loi: `Đã có worktree hoặc nhánh tên "${ten}". Chọn tên khác.` };
    }
    return { ok: false, loi: m.split('\n')[0]?.slice(0, 200) || 'Không tạo được worktree.' };
  }
}

/**
 * Xoá một worktree do app tạo.
 *
 * ⛔ KHÔNG `--force`, và không xoá nhánh.
 *
 * `git worktree remove` từ chối khi còn thay đổi chưa commit — đó là tính năng,
 * không phải trở ngại. Ép `--force` ở đây nghĩa là một cú bấm xoá sạch việc
 * agent vừa làm mà người dùng chưa kịp xem. Nhánh cũng giữ lại: commit trong đó
 * là thứ duy nhất còn lại sau khi thư mục biến mất.
 */
export async function xoaWorktree(goc: string, duongDan: string): Promise<{ ok: boolean; loi?: string }> {
  const chinh = await gocChinhCua(goc);
  if (!chinh) return { ok: false, loi: 'Không tìm thấy kho git.' };

  const ds = await dsWorktree(chinh);
  const muc = ds.find((w) => path.resolve(w.duongDan) === path.resolve(duongDan));
  if (!muc) return { ok: false, loi: 'Không có worktree nào ở đường dẫn đó.' };
  if (muc.laChinh) return { ok: false, loi: 'Đây là cây làm việc chính, không xoá được.' };
  if (!muc.cuaApp) {
    return { ok: false, loi: 'Worktree này không do app tạo — hãy xoá bằng git để tránh nhầm.' };
  }

  try {
    await git(chinh, ['worktree', 'remove', duongDan]);
    return { ok: true };
  } catch (err) {
    const m = String((err as { stderr?: string }).stderr || (err as Error).message).trim();
    if (/contains modified|untracked|is dirty/i.test(m)) {
      return {
        ok: false,
        loi: 'Worktree còn thay đổi chưa commit. Hãy commit hoặc bỏ chúng trước — app cố ý KHÔNG xoá ép.',
      };
    }
    return { ok: false, loi: m.split('\n')[0]?.slice(0, 200) || 'Không xoá được worktree.' };
  }
}
