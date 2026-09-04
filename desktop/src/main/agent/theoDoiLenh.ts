/**
 * ============================================================
 * THEO DÕI FILE BỊ LỆNH THAY ĐỔI
 * ============================================================
 *
 * `edit_file` và anh em ghi thẳng vào sổ hoàn tác, nên lùi được. Nhưng
 * `run_command` thì không: agent chạy `prettier --write`, `npm run build`, một
 * script sinh mã — đĩa đổi mà sổ không biết gì. Cả nút Hoàn tác lẫn nút lùi đều
 * bỏ sót đúng những file đó.
 *
 * ─── Cách làm: hỏi git, không tự chụp ảnh cả cây ───
 * Chụp nội dung cả kho trước mỗi lệnh là không dùng được (chậm và tốn đĩa).
 * Thay vào đó chạy `git status --porcelain` trước và sau; file nào MỚI bẩn (hoặc
 * đổi trạng thái) là file lệnh vừa đụng, và bản gốc của nó lấy được từ `HEAD`.
 *
 * ─── Ba trường hợp, và cái thứ ba là giới hạn thật ───
 *  1. File sạch → bẩn: bản gốc = nội dung ở `HEAD`. Lùi được.
 *  2. File chưa từng có → xuất hiện: bản gốc = `null`, tức lùi = xoá đi. Được.
 *  3. File ĐÃ bẩn từ trước và lệnh sửa tiếp mà không đổi ký hiệu trạng thái
 *     (`" M"` vẫn là `" M"`): KHÔNG phát hiện được. Chấp nhận, vì trong đa số
 *     trường hợp đó là file chính agent vừa sửa bằng `edit_file` — và sổ đã có
 *     bản gốc của nó rồi. Phần còn lại là file người dùng tự sửa dở từ trước,
 *     mà lùi hộ những thứ đó mới là điều KHÔNG nên làm.
 *
 * ⚠️ Cố ý KHÔNG dùng `--ignored`. File bị `.gitignore` (`dist/`, `node_modules/`)
 * không bao giờ vào sổ — nếu vào thì một lần lùi sẽ xoá sạch thư mục build, và
 * đó là thiệt hại lớn hơn nhiều so với thứ nó định sửa.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { ghiSoTruoc, type SoCuoc } from './so';

const chay = promisify(execFile);

/** Trần thời gian cho một lệnh git. Kho khổng lồ vẫn phải trả lời, hoặc chịu thua nhanh. */
const TRAN_MS = 10_000;
/**
 * Trần số file ghi vào sổ sau MỘT lệnh.
 *
 * `npm install` đổi hàng nghìn file. Nhét hết vào sổ là ăn hết bộ nhớ và làm
 * nút lùi thành một thao tác không ai dám bấm. Vượt trần thì bỏ qua cả lượt và
 * nói ra, thay vì ghi một nửa — một sổ ghi NỬA VỜI còn tệ hơn không ghi, vì nó
 * hứa lùi được rồi lùi thiếu.
 */
const MAX_FILE = 200;

export type AnhChup = Map<string, string>;

async function git(goc: string, thamSo: string[]): Promise<string | null> {
  try {
    const { stdout } = await chay('git', thamSo, {
      cwd: goc, timeout: TRAN_MS, maxBuffer: 8 * 1024 * 1024, windowsHide: true,
    });
    return stdout;
  } catch {
    return null;
  }
}

/** Ảnh chụp trạng thái bẩn hiện tại. `null` = không phải kho git ⇒ không theo dõi được. */
export async function chupTrangThai(goc: string): Promise<AnhChup | null> {
  const ra = await git(goc, ['status', '--porcelain=v1', '-z']);
  if (ra === null) return null;
  const m: AnhChup = new Map();
  /* `-z` phân tách bằng NUL và KHÔNG bọc nháy — bắt buộc, vì đường dẫn có dấu
     cách hoặc tiếng Việt sẽ bị `git` bọc nháy và escape ở chế độ mặc định, rồi
     mọi thứ lệch đi một cách âm thầm. */
  for (const muc of ra.split('\0')) {
    if (muc.length < 4) continue;
    m.set(muc.slice(3), muc.slice(0, 2));
  }
  return m;
}

/** Nội dung file ở `HEAD`, hoặc `null` nếu `HEAD` không có nó (file mới). */
async function banGoc(goc: string, duongTuongDoi: string): Promise<string | null> {
  return git(goc, ['show', `HEAD:${duongTuongDoi}`]);
}

export interface KetQuaTheoDoi {
  /** Số file đã ghi được bản gốc vào sổ ⇒ lùi được. */
  soGhi: number;
  /** Quá nhiều file (vd `npm install`) ⇒ KHÔNG ghi gì cả. */
  quaNhieu: boolean;
}

/**
 * So ảnh chụp trước/sau, ghi bản gốc của những file lệnh vừa đụng vào sổ.
 *
 * Bỏ qua file sổ ĐÃ có bản gốc: `ghiSoTruoc` chỉ giữ lần đụng đầu tiên trong
 * lượt, nên ghi đè bằng nội dung sau-khi-lệnh-chạy sẽ làm nút lùi khôi phục về
 * đúng cái trạng thái nó đang cố bỏ đi.
 */
export async function ghiThayDoiCuaLenh(
  goc: string,
  so: SoCuoc,
  truoc: AnhChup | null,
): Promise<KetQuaTheoDoi> {
  if (truoc === null) return { soGhi: 0, quaNhieu: false };
  const sau = await chupTrangThai(goc);
  if (sau === null) return { soGhi: 0, quaNhieu: false };

  const doi: string[] = [];
  for (const [duong, ky] of sau) {
    if (truoc.get(duong) !== ky) doi.push(duong);
  }
  if (doi.length === 0) return { soGhi: 0, quaNhieu: false };
  if (doi.length > MAX_FILE) return { soGhi: 0, quaNhieu: true };

  let soGhi = 0;
  for (const tuongDoi of doi) {
    const tuyetDoi = path.join(goc, tuongDoi);
    if (so.nhatKyHoanTac.has(tuyetDoi)) continue; // sổ đã có bản gốc, đừng đè
    soGhi++;
    ghiSoTruoc(so, tuyetDoi, await banGoc(goc, tuongDoi));
  }
  return { soGhi, quaNhieu: false };
}
