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

/**
 * Mã CŨ → mã MỚI thay thế nó, khi HAI MÃ NẰM Ở HAI KỲ KHÁC NHAU.
 *
 * Luật dò theo TÊN ở `locMonMotKy` chỉ so trong PHẠM VI MỘT KỲ (tham số `ds`
 * là môn của đúng một kỳ), nên nó bắt được CSI104 ↔ CSI106 (cùng Kỳ 1) nhưng
 * KHÔNG bắt được cặp nào bị chuyển kỳ. Bảng này vá đúng chỗ đó.
 *
 * SSG104 → SSG105: cùng một môn "Kỹ năng giao tiếp và cộng tác". FLM:
 * SSG104 = syllabus 11845, QĐ 862/QĐ-ĐHFPT ngày 16/08/2024; SSG105 =
 * syllabus 14127, QĐ 377/QĐ-ĐHFPT ngày 09/04/2026 (bản thay thế). Khung
 * BIT_SE_K20B xếp SSG105 ở Kỳ 5, còn SSG104 ở Kỳ 2 của chương trình cũ —
 * khác kỳ nên luật tên không bao giờ khớp, và SSG104 biến mất khỏi danh sách
 * kỳ dù tìm kiếm vẫn ra. Người dùng báo 20/09/2026.
 *
 * ⚠️ Thêm cặp vào đây thì KHÔNG cần đụng `fptuCurriculum.ts`: môn mã cũ vẫn
 * hiện ở ĐÚNG KỲ của nó, kèm nhãn "mã cũ", nên sinh viên chương trình mới
 * không tưởng phải học hai môn.
 */
export const MA_CU_THAY_THE: Record<string, string> = {
  SSG104: 'SSG105',
};

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

/** Một nhóm kỳ để hiển thị — hình dạng đủ dùng thay cho bản ghi `Semester`. */
export interface NhomKy {
  id: number;
  name: string;
  /** Nhãn dự phòng khi một môn không có mã (trang dùng `course.courseCode || code`). */
  code?: string;
  description?: string;
  mon: MonHien[];
}

/** Id giả cho nhóm dựng từ khung, tránh đụng id thật của bảng `semesters`. */
const ID_KHUNG = 10_000;
const ID_PROJECT = 19_999;

/**
 * Xếp môn theo KỲ TRONG KHUNG NGÀNH, thay vì theo ô `semester` của bản ghi môn.
 *
 * ⚠️ VÌ SAO CẦN: mỗi bản ghi môn chỉ giữ ĐƯỢC MỘT kỳ, trong khi cùng một môn
 * lại nằm ở kỳ khác nhau tuỳ ngành — `SSG105` là Kỳ 5 với SE/GD/DX nhưng Kỳ 4
 * với IA/IS/IC/AS/RA. Xếp theo ô `semester` thì luôn có ngành thấy sai, và
 * sửa ô đó cho ngành này là làm sai cho ngành kia. Đo thật 20/09/2026: riêng
 * khung SE đã có **9 môn** lệch giữa khung và DB (OTP101, WED201c, MAS291,
 * CSD201, SWR302, SSG105, WDU203c, EXE101, ITE302c). Người dùng báo sau khi
 * không thấy SSG104/SSG105 ở kỳ nào.
 *
 * Trả `null` khi KHÔNG lọc (chưa chọn ngành hẹp) — lúc đó gọi vẫn dùng danh
 * sách kỳ của DB như cũ.
 *
 * Môn mã CŨ được gắn vào kỳ của **môn mới thay thế nó**, kèm `isOld` — nên
 * `NWC203c` nằm ngay cạnh `NWC204` ở Kỳ 2, `SSG104` cạnh `SSG105` ở Kỳ 5.
 */
export function xepTheoKhung(tatCaMon: Course[], ho: HoSoNganh, coLoc: boolean): NhomKy[] | null {
  if (!coLoc) return null;
  const plan = leafSemesterPlan(ho.faculty ?? null, ho.major ?? null, ho.combo ?? null);
  if (!plan.length) return null;

  const daXep = new Set<number>();
  const nhom: NhomKy[] = [];

  for (const { semester, codes } of plan) {
    const ma = new Set(
      codes.filter((c) => !isPlaceholderCode(c)).map((c) => c.trim().toUpperCase()),
    );
    const trongKhung = tatCaMon.filter((c) => ma.has(maCua(c)));
    const tenTrongKhung = new Set(trongKhung.map((c) => tenChuan(c.title)).filter(Boolean));
    const maCu = tatCaMon.filter((c) => {
      if (ma.has(maCua(c))) return false;
      const thay = MA_CU_THAY_THE[maCua(c)];
      if (thay && ma.has(thay)) return true;
      return !!tenChuan(c.title) && tenTrongKhung.has(tenChuan(c.title));
    });

    const mon: MonHien[] = [
      ...trongKhung.map((c) => ({ course: c, isOld: false, isProject: laMaProject(c) })),
      ...maCu.map((c) => ({ course: c, isOld: true, isProject: false })),
    ].filter((m) => !daXep.has(m.course.id));
    mon.forEach((m) => daXep.add(m.course.id));

    nhom.push({
      id: ID_KHUNG + semester,
      name: semester === 0 ? 'Kỳ chuẩn bị' : 'Kỳ ' + semester,
      code: 'KY' + semester,
      description: 'Xếp theo khung chương trình của ngành bạn đã chọn',
      mon,
    });
  }

  /* Project OJT nằm NGOÀI khung nên không có kỳ — gom thành một nhóm cuối,
     và chỉ cho đúng SE + hai combo web/app như luật cũ. */
  const hienProject = ho.faculty === 'it' && ho.major === 'se'
    && (ho.combo === 'react-nodejs' || ho.combo === 'dotnet');
  if (hienProject) {
    const pj = tatCaMon.filter((c) => laMaProject(c) && !daXep.has(c.id));
    if (pj.length) {
      nhom.push({
        id: ID_PROJECT,
        name: 'Project gợi ý',
        code: 'OJT',
        description: 'Nằm ngoài khung giáo trình — gợi ý theo combo bạn chọn',
        mon: pj.map((c) => ({ course: c, isOld: false, isProject: true })),
      });
    }
  }
  return nhom;
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
  /* Hai đường nhận ra "mã cũ của môn đang có trong khung":
     1. cùng TÊN với một môn trong khung Ở CÙNG KỲ này (CSI104 ↔ CSI106);
     2. có trong bảng MA_CU_THAY_THE và mã mới nằm trong khung — dùng khi hai
        mã bị xếp ở HAI KỲ KHÁC NHAU nên đường 1 không thể khớp (SSG104 ↔ SSG105).
     Lọc trùng để một môn không bị thêm hai lần. */
  const maCu = ds.filter((c) => {
    if (khung.has(maCua(c))) return false;
    const thay = MA_CU_THAY_THE[maCua(c)];
    if (thay && khung.has(thay)) return true;
    return !!tenChuan(c.title) && tenTrongKhung.has(tenChuan(c.title));
  });

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
