/**
 * FPTU curriculum catalogue — the source of truth for the Academy onboarding
 * (robot asks "are you an FPTU student?" → major → combo).
 *
 * WHERE THE DATA COMES FROM
 *  · Majors: flm.fpt.edu.vn → View Curriculum (guest). FPTU has ONE degree
 *    (Information Technology) split into 8 majors; the curriculum codes are
 *    BIT_<major>_<intake>, e.g. BIT_SE_K20B = 145 credits, decision
 *    577/QĐ-ĐHFPT 15/05/2026. 156 curricula = the 8 majors × intakes K18–K21.
 *  · SE combos: the faculty slide "Khung chương trình kỳ 5 sau khi chọn
 *    chuyên sâu (combo)" — students choose 1 of 9. FLM does NOT publish the
 *    combo → subject mapping publicly (it lives in the admin-only "Curriculum
 *    Subject Grouping"), so the gateway subject of each combo is taken from
 *    that slide and is the only combo subject we can state with certainty. Subject names and
 *    credits were then checked against the FAP subject-fee catalogue (fap.fpt.edu.vn →
 *    Subject Fees, 1,487 subjects): HSF302 is officially "Working with Spring Framework" and
 *    FGU301 "Fundamental Game Development" — the slide's wording for those two was informal.
 *
 * WHAT WE DELIBERATELY DO NOT CLAIM
 *  Only semester-5 gateway subjects are listed per combo. The later combo
 *  subjects (semesters 7–9) are not published on FLM, so a combo shows its
 *  gateway plus whatever Academy courses genuinely exist — never a guess.
 *  `academyCourses` therefore holds course codes that EXIST in this Academy;
 *  anything else renders as "đang xây dựng", which is the honest state.
 */

export interface FptuCombo {
  id: string;
  name: string;
  nameVi: string;
  /** Semester-5 gateway subject from the faculty slide. */
  gateway: { code: string; name: string; credits: number; prereq?: string };
  /** Course codes that exist in this Academy and belong to the combo. */
  academyCourses: string[];
  icon: string;
}

export interface FptuMajor {
  id: string;
  /** FLM curriculum code prefix, e.g. BIT_SE. */
  curriculumCode: string;
  name: string;
  nameVi: string;
  icon: string;
  /** How many curricula FLM lists for this major (intakes K18–K21). */
  curricula: number;
  combos: FptuCombo[];
  /** False → Academy has no major-specific courses yet; the student still
   *  gets every shared university subject. */
  hasOwnCourses: boolean;
}

/** The 9 SE combos. A student picks exactly one, starting in semester 5
 *  (note on the slide: "Combo KS sẽ bắt đầu học các môn combo vào kỳ 7 sau
 *  khi đi thực tập về, kì 5 chưa học môn combo"). */
export const SE_COMBOS: FptuCombo[] = [
  {
    id: 'react-nodejs',
    name: 'React / NodeJS',
    nameVi: 'React / NodeJS',
    gateway: { code: 'FER202', name: 'Front-End web development with React', credits: 3, prereq: 'WED201c' },
    academyCourses: ['FER202', 'SDN302', 'MMA301', 'WDP301'],
    icon: '⚛️',
  },
  {
    id: 'dotnet',
    name: '.NET Programming',
    nameVi: 'Lập trình .NET',
    gateway: { code: 'PRN212', name: 'Basic Cross-Platform Application Programming with .NET', credits: 3, prereq: 'PRO192 & DBI202' },
    academyCourses: [],
    icon: '🟣',
  },
  {
    id: 'java',
    name: 'Topic on Java',
    nameVi: 'Chuyên sâu Java',
    gateway: { code: 'HSF302', name: 'Working with Spring Framework', credits: 3, prereq: 'PRJ301' },
    academyCourses: [],
    icon: '☕',
  },
  {
    id: 'jbse',
    name: 'Japanese Bridge Software Engineer',
    nameVi: 'Kỹ sư cầu nối Nhật Bản',
    gateway: { code: 'JPD133', name: 'Elementary Japanese 1-A1/A2', credits: 3, prereq: 'JPD123' },
    academyCourses: [],
    icon: '🇯🇵',
  },
  {
    id: 'ai',
    name: 'AI',
    nameVi: 'Trí tuệ nhân tạo',
    gateway: { code: 'PRP201c', name: 'Python programming', credits: 3 },
    academyCourses: [],
    icon: '🤖',
  },
  {
    id: 'it-korean',
    name: 'Information Technology — Korean',
    nameVi: 'CNTT — tiếng Hàn',
    gateway: { code: 'WDU203c', name: 'UI/UX Design', credits: 3 },
    academyCourses: ['WDU203c'],
    icon: '🇰🇷',
  },
  {
    id: 'ic-design',
    name: 'Topic on IC design',
    nameVi: 'Thiết kế vi mạch',
    gateway: { code: 'ECI101', name: 'Introduction to Electronic Components and Circuits', credits: 3 },
    academyCourses: [],
    icon: '🔌',
  },
  {
    id: 'game-dev',
    name: 'Topic on Game Development',
    nameVi: 'Phát triển game',
    gateway: { code: 'FGU301', name: 'Fundamental Game Development', credits: 3 },
    academyCourses: [],
    icon: '🎮',
  },
  {
    id: 'devsecops',
    name: 'Topic on DevSecOps for cloud',
    nameVi: 'DevSecOps cho cloud',
    gateway: { code: 'IAO201c', name: 'Introduction to Information Assurance', credits: 3 },
    academyCourses: [],
    icon: '🛡️',
  },
];

export const FPTU_MAJORS: FptuMajor[] = [
  {
    id: 'se', curriculumCode: 'BIT_SE', name: 'Software Engineering', nameVi: 'Kỹ thuật phần mềm',
    icon: '💻', curricula: 23, combos: SE_COMBOS, hasOwnCourses: true,
  },
  {
    id: 'ia', curriculumCode: 'BIT_IA', name: 'Information Assurance', nameVi: 'An toàn thông tin',
    icon: '🔐', curricula: 25, combos: [], hasOwnCourses: false,
  },
  {
    id: 'gd', curriculumCode: 'BIT_GD', name: 'Digital Art & Design', nameVi: 'Thiết kế mỹ thuật số',
    icon: '🎨', curricula: 24, combos: [], hasOwnCourses: false,
  },
  {
    id: 'is', curriculumCode: 'BIT_IS', name: 'Information System', nameVi: 'Hệ thống thông tin',
    icon: '🗄️', curricula: 20, combos: [], hasOwnCourses: false,
  },
  {
    id: 'ic', curriculumCode: 'BIT_IC', name: 'Integrated Circuit Design', nameVi: 'Thiết kế vi mạch bán dẫn',
    icon: '🔬', curricula: 7, combos: [], hasOwnCourses: false,
  },
  {
    id: 'as', curriculumCode: 'BIT_AS', name: 'Automotive Software Engineering', nameVi: 'Kỹ thuật phần mềm ô tô',
    icon: '🚗', curricula: 7, combos: [], hasOwnCourses: false,
  },
  {
    id: 'ra', curriculumCode: 'BIT_RA', name: 'Robotics & AI', nameVi: 'Robotics & AI',
    icon: '🦾', curricula: 4, combos: [], hasOwnCourses: false,
  },
  {
    id: 'dx', curriculumCode: 'BIT_DX', name: 'Digital Transformation', nameVi: 'Chuyển đổi số',
    icon: '🔄', curricula: 4, combos: [], hasOwnCourses: false,
  },
];

/**
 * Subjects every FPTU IT student takes regardless of major — taken from the
 * BIT_SE_K20B curriculum's shared rows (maths, politics, Japanese, soft
 * skills, entrepreneurship, core programming). A student of a major whose
 * specialised courses are not written yet still gets all of these.
 */
export const SHARED_COURSE_CODES = [
  // Semester 1–2 foundation
  'CEA201', 'CSI104', 'MAE101', 'PRF192', 'SSL101c',
  'MAD101', 'NWC203c', 'OSG202', 'PRO192', 'WED201c',
  // Semester 3–4 core
  'DBI202', 'JPD113', 'LAB211', 'MAS291', 'SWE201c',
  'CSD201', 'IOT102', 'JPD123', 'PRJ301',
  // Skills / politics / entrepreneurship (semesters 5–9)
  'SSG104', 'WDU203c', 'ENW492c', 'EXE101', 'PMG201c', 'EXE201',
  'ITE302c', 'MLN111', 'MLN122', 'HCM202', 'MLN131', 'VNR202',
] as const;

/** Codes that belong to a specific major, so another major does not see them
 *  presented as required. SE-only subjects of the standard curriculum. */
export const MAJOR_ONLY_CODES: Record<string, string[]> = {
  se: ['SWR302', 'SWT301', 'SWP391', 'SWD392', 'PRM392', 'FER202', 'SDN302', 'MMA301', 'WDP301'],
};

export const getMajor = (id: string | null | undefined): FptuMajor | undefined =>
  FPTU_MAJORS.find((m) => m.id === id);

export const getCombo = (majorId: string | null | undefined, comboId: string | null | undefined): FptuCombo | undefined =>
  getMajor(majorId)?.combos.find((c) => c.id === comboId);

/** Course codes to highlight for a student, most specific first. */
export function relevantCourseCodes(majorId: string | null, comboId: string | null): {
  combo: string[];
  major: string[];
  shared: string[];
} {
  const combo = getCombo(majorId, comboId)?.academyCourses ?? [];
  const major = (MAJOR_ONLY_CODES[majorId ?? ''] ?? []).filter((c) => !combo.includes(c));
  const shared = (SHARED_COURSE_CODES as readonly string[]).filter(
    (c) => !combo.includes(c) && !major.includes(c),
  );
  return { combo, major, shared };
}
