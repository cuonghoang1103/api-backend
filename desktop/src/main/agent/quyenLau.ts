/**
 * ============================================================
 * QUYỀN SỐNG LÂU — "đừng hỏi lại lệnh này, kể cả lần sau"
 * ============================================================
 *
 * `so.quyenDaCap` chỉ sống trong MỘT cuộc: đóng tab là mất, mở lại dự án cũ là
 * hỏi lại từ đầu. Với `npm test`, `npx tsc --noEmit`, `git status` — những thứ
 * gõ hai chục lần một buổi — điều đó nghĩa là hai chục lần bấm duyệt.
 *
 * ─── VÌ SAO ĐÂY LÀ VIỆC AN TOÀN, KHÔNG PHẢI NỚI LỎNG ───
 * Cách hỏng của mọi tầng xin phép không phải bị vượt qua, mà là hỏi nhiều tới
 * mức người ta bấm theo phản xạ. Từ 09/09/2026 app còn có cả chế độ "Bỏ qua
 * tất cả" — nên một người bị hỏi phát mệt giờ có sẵn một cái nút tắt SẠCH mọi
 * chốt chặn. Giảm số lần hỏi VÔ ÍCH chính là thứ giữ cho họ không bấm cái nút
 * đó. Xem chú thích đầu `XinPhep.tsx`.
 *
 * ─── BỐN RÀNG BUỘC ───
 *  1. THEO DỰ ÁN. Khoá lưu dưới đường dẫn gốc. Cho phép `npm test` ở dự án A
 *     không mở đường cho `npm test` ở dự án B — hai `package.json` khác nhau
 *     thì `npm test` là hai lệnh khác nhau.
 *  2. CHỈ thứ được phép nhớ. `choNho === false` (lệnh `nguyhiem`/`cankiem`,
 *     commit, PR, tải file) KHÔNG bao giờ vào đây. Chốt nằm ở `traLoi`, không
 *     ở giao diện — app bị sửa vẫn không ghi được.
 *  3. KHÔNG ghi vào kho của người dùng. File nằm ở `userData`, không phải
 *     `.claude/settings.local.json` trong repo: agent có quyền ghi trong repo,
 *     nên để danh sách quyền ở đó là để agent tự cấp quyền cho chính nó.
 *  4. XEM VÀ THU HỒI ĐƯỢC. Một danh sách cho phép không xoá được là một cái
 *     bẫy: người dùng cho phép một lần lúc vội, rồi không bao giờ tìm lại
 *     được. Lệnh `/quyen` trong app liệt kê và xoá.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';

/** Trần mỗi dự án. Quá con số này thì danh sách không còn ai đọc nổi nữa. */
const MAX_MOI_DU_AN = 200;
/** Trần số dự án nhớ. Cắt cái cũ nhất khi vượt. */
const MAX_DU_AN = 50;

interface Kho {
  /** `<đường dẫn gốc dự án>` → danh sách khoá. */
  duAn: Record<string, { khoa: string[]; luc: number }>;
}

export function duongDanKho(): string {
  return path.join(app.getPath('userData'), 'quyen-lau.json');
}

let dem: Kho | null = null;

async function doc(): Promise<Kho> {
  if (dem) return dem;
  try {
    const j = JSON.parse(await fs.readFile(duongDanKho(), 'utf8')) as Partial<Kho>;
    dem = { duAn: j.duAn && typeof j.duAn === 'object' ? j.duAn : {} };
  } catch {
    // Chưa có file là trạng thái BÌNH THƯỜNG, không phải lỗi.
    dem = { duAn: {} };
  }
  return dem;
}

async function ghi(k: Kho): Promise<void> {
  dem = k;
  /* Ghi qua file tạm rồi `rename`: mất điện giữa chừng `writeFile` để lại một
     file JSON cụt, và lần mở sau `JSON.parse` ném ⇒ MẤT SẠCH danh sách. Đổi
     tên là thao tác nguyên tử trên cùng một phân vùng. */
  const p = duongDanKho();
  const tam = `${p}.tam`;
  await fs.writeFile(tam, JSON.stringify(k, null, 2), 'utf8');
  await fs.rename(tam, p);
}

/** Danh sách khoá đã cho phép lâu dài ở dự án này. Rỗng khi chưa mở dự án nào. */
export async function napQuyenLau(goc: string | null): Promise<Set<string>> {
  if (!goc) return new Set();
  const k = await doc();
  return new Set(k.duAn[goc]?.khoa ?? []);
}

/**
 * Thêm một khoá. Trả về `false` khi không ghi được — bên gọi vẫn cho lượt này
 * đi qua, chỉ là lần sau hỏi lại; thà thế còn hơn chặn công việc vì lỗi đĩa.
 */
export async function themQuyenLau(goc: string | null, khoa: string): Promise<boolean> {
  if (!goc || !khoa) return false;
  try {
    const k = await doc();
    const cu = k.duAn[goc]?.khoa ?? [];
    if (cu.includes(khoa)) return true;
    const moi = [...cu, khoa].slice(-MAX_MOI_DU_AN);
    k.duAn[goc] = { khoa: moi, luc: Date.now() };

    // Cắt bớt dự án cũ khi vượt trần — theo lần dùng gần nhất.
    const ten = Object.keys(k.duAn);
    if (ten.length > MAX_DU_AN) {
      const giu = ten
        .sort((a, b) => (k.duAn[b]!.luc ?? 0) - (k.duAn[a]!.luc ?? 0))
        .slice(0, MAX_DU_AN);
      k.duAn = Object.fromEntries(giu.map((t) => [t, k.duAn[t]!]));
    }
    await ghi(k);
    return true;
  } catch {
    return false;
  }
}

/** Xoá một khoá, hoặc CẢ dự án khi không truyền khoá. Trả về số khoá đã xoá. */
export async function xoaQuyenLau(goc: string | null, khoa?: string): Promise<number> {
  if (!goc) return 0;
  try {
    const k = await doc();
    const cu = k.duAn[goc]?.khoa ?? [];
    if (cu.length === 0) return 0;
    if (khoa === undefined) {
      delete k.duAn[goc];
      await ghi(k);
      return cu.length;
    }
    const moi = cu.filter((x) => x !== khoa);
    if (moi.length === cu.length) return 0;
    k.duAn[goc] = { khoa: moi, luc: Date.now() };
    await ghi(k);
    return 1;
  } catch {
    return 0;
  }
}

/** Quên nhớ đệm — cho bộ kiểm, và cho lúc người dùng sửa file bằng tay. */
export function quenDem(): void {
  dem = null;
}
