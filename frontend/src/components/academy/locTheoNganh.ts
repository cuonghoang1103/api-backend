/**
 * ============================================================
 * LỌC MÔN THEO NGÀNH HẸP — dùng chung web ↔ app desktop
 * ============================================================
 *
 * Tách ra từ `app/academy/page.tsx` ngày 15/09/2026, khi app desktop cần đúng
 * cách lọc này. Người dùng: *"chưa có chọn ngành, tư vấn ngành hẹp, sơ đồ, lọc
 * ngành đúng với ngành hẹp"*.
 *
 * ⚠️ VÌ SAO TÁCH CHỨ KHÔNG CHÉP SANG APP. Đây không phải mã tầm thường mà là
 * KIẾN THỨC về chương trình đào tạo, và nó sẽ đổi theo từng khoá:
 *
 *  • Mã CŨ ↔ mã MỚI cùng một môn (CSI104 cạnh CSI106). Bỏ luật này là sinh
 *    viên khoá cũ mở Học viện ra và KHÔNG THẤY môn mình đang học — trong khi
 *    bài giảng có sẵn ở đó.
 *  • Project OJT (INT601–INT610) nằm NGOÀI khung giáo trình nên bị lọc mất,
 *    phải thêm lại — nhưng chỉ cho đúng ngành SE và đúng hai combo.
 *
 * Chép một bản thứ hai là hai bản sẽ lệch ở lần cập nhật chương trình kế tiếp,
 * và bản lệch hỏng CÂM: trang vẫn chạy, chỉ thiếu môn.
 */

import type { Course } from '@/types';
import { isPlaceholderCode } from '@/data/fptuCurriculum';
import { leafSemesterPlan } from '@/data/academyCatalog';

export interface HoSoNganh {
  isStudent?: boolean | null;
  faculty?: string | null;
  major?: string | null;
  combo?: string | null;
}

export interface MonHien {
  course: Course;
  /** Mã CŨ của cùng một môn — hiện kèm để sinh viên khoá cũ vẫn tìm ra. */
  isOld: boolean;
  /** Project OJT gợi ý, không nằm trong khung giáo trình. */
  isProject: boolean;
}

/** Tên môn chuẩn hoá (phần tiếng Anh trước `|||`) để dò mã CŨ ↔ mã MỚI cùng môn. */
export function tenChuan(t?: string | null): string {
  return (t || '').split('|||')[0]!.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const laMaProject = (c: Course): boolean => /^INT6\d\d$/i.test((c.courseCode || '').trim());
const maCua = (c: Course): string => (c.courseCode || '').trim().toUpperCase();

/**
 * Đã chọn tới NGÀNH HẸP chưa — tức có lọc hay không.
 *
 * Khối IT chưa chọn combo VẪN lọc theo khung ngành nền; khối khác thì mỗi
 * chuyên ngành là một khung riêng nên phải có combo mới biết lọc theo gì.
 */
export function daChonNganhHep(ho: HoSoNganh, coMajor: boolean, coCombo: boolean): boolean {
  return ho.isStudent === true && coMajor && (coCombo || ho.faculty === 'it');
}

/**
 * Tập mã môn của khung ngành đã chọn. `null` = không lọc (hiện tất cả).
 *
 * `isPlaceholderCode` loại những ô "môn tự chọn" chưa có mã thật — giữ lại là
 * chúng sẽ khớp bừa với một môn nào đó có mã rỗng.
 */
export function maCuaKhung(ho: HoSoNganh, coLoc: boolean): Set<string> | null {
  if (!coLoc) return null;
  const plan = leafSemesterPlan(ho.faculty ?? null, ho.major ?? null, ho.combo ?? null);
  const s = new Set<string>();
  for (const { codes } of plan) {
    for (const c of codes) if (!isPlaceholderCode(c)) s.add(c.trim().toUpperCase());
  }
  return s;
}

/**
 * Môn hiện cho MỘT kỳ, sau khi lọc theo ngành hẹp.
 *
 * Thứ tự trả về có chủ ý: môn trong khung trước, rồi mã cũ tương đương, rồi
 * project. Đảo thứ tự là môn chính bị đẩy xuống dưới những thứ phụ.
 */
export function locMonMotKy(
  ds: Course[],
  khung: Set<string> | null,
  ho: HoSoNganh,
): MonHien[] {
  if (!khung) return ds.map((c) => ({ course: c, isOld: false, isProject: laMaProject(c) }));

  const trongKhung = ds.filter((c) => khung.has(maCua(c)));
  const tenTrongKhung = new Set(trongKhung.map((c) => tenChuan(c.title)).filter(Boolean));
  const maCu = ds.filter((c) => !khung.has(maCua(c)) && tenChuan(c.title) && tenTrongKhung.has(tenChuan(c.title)));

  /* Project chỉ hiện cho SE (CNTT) + combo Node.JS hoặc C#/.NET — đúng loại
     project web/app/API này. Đổ vào ngành khác là gợi ý sai chuyên môn. */
  const hienProject = ho.faculty === 'it' && ho.major === 'se'
    && (ho.combo === 'react-nodejs' || ho.combo === 'dotnet');
  const project = hienProject ? ds.filter((c) => laMaProject(c) && !khung.has(maCua(c))) : [];

  return [
    ...trongKhung.map((c) => ({ course: c, isOld: false, isProject: laMaProject(c) })),
    ...maCu.map((c) => ({ course: c, isOld: true, isProject: false })),
    ...project.map((c) => ({ course: c, isOld: false, isProject: true })),
  ];
}
