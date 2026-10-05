/**
 * CT Work — chuẩn hoá chữ để tìm KHÔNG phân biệt dấu tiếng Việt (CTW-6, 06/10/2026).
 *
 * Phía CSDL: cột sinh tự động `title_fold` / `description_fold` (work_issues) và
 * `title_fold` / `content_fold` (work_pages) = lower(translate(cột, VI_FROM, VI_TO)) —
 * migration 20261006120000_ctw_nang_cap_10. Hàm `foldVi` ở đây PHẢI cho ra đúng chuỗi
 * đó cho câu người dùng gõ, không thì "dia cau" không khớp "Địa cầu".
 *
 * Cố ý KHÔNG dùng normalize('NFD') + bỏ mọi dấu kết hợp: CSDL chỉ bỏ dấu tiếng Việt
 * (bảng dưới), nên "ü" phải giữ nguyên ở cả hai phía.
 */

const GROUPS: Record<string, string> = {
  a: 'àáảãạăằắẳẵặâầấẩẫậ',
  e: 'èéẻẽẹêềếểễệ',
  i: 'ìíỉĩị',
  o: 'òóỏõọôồốổỗộơờớởỡợ',
  u: 'ùúủũụưừứửữự',
  y: 'ỳýỷỹỵ',
  d: 'đ',
};

/** Dấu kết hợp (chữ gõ dạng tổ hợp NFD) — CSDL xoá chúng (translate với chuỗi đích ngắn hơn). */
const COMBINING = '̛̣̀́̃̉̆̂';

const MAP = new Map<string, string>();
for (const [base, chars] of Object.entries(GROUPS)) {
  for (const c of chars) {
    MAP.set(c, base);
    MAP.set(c.toUpperCase(), base);
  }
}
for (const c of COMBINING) MAP.set(c, '');

/** "Địa Cầu" ⇒ "dia cau" — khớp cột *_fold của CSDL. */
export function foldVi(s: string): string {
  let out = '';
  for (const ch of s) out += MAP.has(ch) ? MAP.get(ch)! : ch;
  return out.toLowerCase();
}

/**
 * Cột SINH TỰ ĐỘNG (GENERATED ALWAYS … STORED): Postgres từ chối mọi INSERT/UPDATE có giá trị cho
 * chúng (428C9). Chỗ nào chép dòng theo DMMF (xuất/nhập dự án) phải bỏ qua các cột này.
 */
export const GENERATED_FIELDS = new Set(['WorkIssue.titleFold', 'WorkIssue.descriptionFold', 'WorkPage.titleFold', 'WorkPage.contentFold']);
