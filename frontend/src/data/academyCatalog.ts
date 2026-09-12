/**
 * academyCatalog.ts — MỘT danh mục hợp nhất cho onboarding /academy 3 cấp:
 *   Khối ngành (faculty) → Ngành chính (major) → Ngành hẹp (combo) → khung 9 kỳ.
 *
 * Vì sao có file này: khối CNTT đã được mô hình rất kỹ ở fptuCurriculum.ts
 * (FPTU_MAJORS + combo + pool + note, khớp curid FLM). Các khối MỚI (Kinh doanh,
 * Truyền thông, Ngôn ngữ, KHMT) sinh tự động ở fptuFaculties.ts. Adapter này gộp
 * cả hai thành một hình dạng CHUNG để onboarding và trang /academy dùng, mà
 * KHÔNG phải viết lại mô hình IT.
 *
 * Điểm mấu chốt người dùng yêu cầu: khi chọn tới NGÀNH HẸP, trang chỉ hiện đúng
 * ~40 môn của ngành đó (leafSemesterPlan), không đổ hết môn ra.
 */
import {
  FPTU_MAJORS,
  semesterPlan as itSemesterPlan,
  type FptuMajor,
} from './fptuCurriculum';
import { EXTRA_FACULTIES, type Faculty } from './fptuFaculties';

export interface CatCombo {
  id: string;
  /** Mã khung FLM của ngành hẹp (chỉ khối mới), vd BBA_MKT. */
  code?: string;
  nameVi: string;
  name: string;
  icon: string;
}
export interface CatMajor {
  id: string;
  nameVi: string;
  name: string;
  icon: string;
  combos: CatCombo[];
  /** Ghi chú combo (chỉ khối IT có, vd "trường chưa công bố combo"). */
  comboNote?: string;
  /** Khối IT: mã khung + tín chỉ để hiện "nguồn FLM". */
  curriculumCode?: string;
  curriculumId?: number;
  credits?: number;
}
export interface CatFaculty {
  id: string;
  nameVi: string;
  name: string;
  icon: string;
  majors: CatMajor[];
}

const IT_FACULTY: CatFaculty = {
  id: 'it',
  nameVi: 'Công nghệ Thông tin',
  name: 'Information Technology',
  icon: '💻',
  majors: FPTU_MAJORS.map((m: FptuMajor): CatMajor => ({
    id: m.id,
    nameVi: m.nameVi,
    name: m.name,
    icon: m.icon,
    comboNote: m.comboNote,
    curriculumCode: m.curriculumCode,
    curriculumId: m.curriculumId,
    credits: m.credits,
    combos: m.combos.map((c) => ({ id: c.id, nameVi: c.nameVi, name: c.name, icon: c.icon })),
  })),
};

const EXTRA: CatFaculty[] = (EXTRA_FACULTIES as Faculty[]).map((f): CatFaculty => ({
  id: f.id,
  nameVi: f.nameVi,
  name: f.name,
  icon: f.icon,
  majors: f.majors.map((mj): CatMajor => ({
    id: mj.id,
    nameVi: mj.nameVi,
    name: mj.name,
    icon: mj.icon,
    combos: mj.combos.map((c) => ({ id: c.id, code: c.code, nameVi: c.nameVi, name: c.name, icon: c.icon })),
  })),
}));

/** CNTT trước (nhiều người học nhất), rồi các khối mới. */
export const CATALOG: CatFaculty[] = [IT_FACULTY, ...EXTRA];

export const getFaculty = (id: string | null | undefined): CatFaculty | undefined =>
  CATALOG.find((f) => f.id === id);

export const getCatMajor = (facultyId: string | null | undefined, majorId: string | null | undefined): CatMajor | undefined =>
  getFaculty(facultyId)?.majors.find((m) => m.id === majorId);

export const getCatCombo = (
  facultyId: string | null | undefined,
  majorId: string | null | undefined,
  comboId: string | null | undefined,
): CatCombo | undefined =>
  getCatMajor(facultyId, majorId)?.combos.find((c) => c.id === comboId);

/**
 * Khung 9 kỳ của ĐÚNG ngành hẹp đã chọn (kỳ → mã môn). Đây là thứ trang dùng để
 * CHỈ hiện môn của ngành hẹp đó. Khối IT tái dùng semesterPlan() (điền combo vào
 * ô trống của khung ngành); khối mới trả thẳng khung riêng của ngành hẹp.
 */
export function leafSemesterPlan(
  facultyId: string | null,
  majorId: string | null,
  comboId: string | null,
): { semester: number; codes: string[] }[] {
  if (facultyId === 'it') return itSemesterPlan(majorId, comboId);
  const fac = (EXTRA_FACULTIES as Faculty[]).find((f) => f.id === facultyId);
  const mj = fac?.majors.find((m) => m.id === majorId);
  const combo = mj?.combos.find((c) => c.id === comboId);
  if (!combo) return [];
  return Object.keys(combo.semesters)
    .map(Number)
    .sort((a, b) => a - b)
    .map((semester) => ({ semester, codes: combo.semesters[semester] ?? [] }));
}

/** Mọi mã môn (không trùng) của ngành hẹp đã chọn. */
export function leafCourseCodes(facultyId: string | null, majorId: string | null, comboId: string | null): string[] {
  const seen = new Set<string>();
  for (const s of leafSemesterPlan(facultyId, majorId, comboId)) {
    for (const c of s.codes) seen.add(c);
  }
  return [...seen];
}
