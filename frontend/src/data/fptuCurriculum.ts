/**
 * FPTU curriculum catalogue — the source of truth for the Academy onboarding
 * (robot asks "are you an FPTU student?" → major → combo) and for the
 * per-semester roadmap shown on /academy afterwards.
 *
 * WHERE EVERY NUMBER BELOW COMES FROM (harvested 12/09/2026)
 *  · Majors + the 9-semester layout: flm.fpt.edu.vn → View Curriculum, guest
 *    role, one page per curriculum: /gui/role/guest/CurriculumDetails?curid=N.
 *    FPTU has ONE degree (Information Technology) split into 8 majors; 156
 *    curricula = those 8 × intakes K15–K23. We pin ONE curriculum per major
 *    (the K20B generation, or the earliest intake for majors that opened
 *    later) and record its `curriculumId` so anyone can re-check the source.
 *  · Combos: /gui/role/guest/Syllabuses?subCode=<MAJOR>_COM*N&curriculumID=N
 *    — the page behind each combo slot in the curriculum table. It lists every
 *    combo offered at that slot and the subjects inside it. This is the page
 *    that was previously assumed to be admin-only; it is not.
 *
 * WHAT THE COMBO SLOTS MEAN
 *  A curriculum row like `SE_COM*1` is not a subject — it is a SLOT the
 *  student fills with a subject from the combo they chose. SE has slots at
 *  semesters 5, 7 (×2), 8 and 9; other majors differ. `isPlaceholderCode()`
 *  in fptuSubjects.ts recognises them so the UI never prints `SE_COM*1` as if
 *  it were a course.
 *
 * WHAT WE DELIBERATELY DO NOT CLAIM
 *  Four majors (IA, AS, RA, DX) have combo slots in their curriculum but FLM
 *  publishes NO combo list for them — the "Comboes" section of those pages is
 *  empty. They get `combos: []` plus `comboNote`, and the UI says the school
 *  has not published it rather than inventing one. Same for IC, where only
 *  the semester-5 subject of each combo is published.
 */

import { isPlaceholderCode, placeholderLabel, subjectName } from './fptuSubjects';

export type { };

/** One combo (chuyên ngành hẹp). `bySemester` holds the subjects FLM lists
 *  for that combo at each curriculum slot — never a guess. */
export interface FptuCombo {
  id: string;
  /** FLM's own combo code, e.g. SE_COM4.1 — so a claim can be traced back. */
  code: string;
  name: string;
  nameVi: string;
  icon: string;
  /** semester number → subject codes FLM publishes for this combo. */
  bySemester: Record<number, string[]>;
  /** Course codes that EXIST in this Academy and belong to the combo. */
  academyCourses: string[];
  /** Shown when the combo carries an extra rule from FLM. */
  note?: string;
}

export interface FptuMajor {
  id: string;
  /** FLM curriculum code of the pinned intake, e.g. BIT_SE_K20B. */
  curriculumCode: string;
  /** curid of that page on FLM — the receipt for every code below. */
  curriculumId: number;
  name: string;
  nameVi: string;
  icon: string;
  credits: number;
  /** How many curricula FLM lists for this major across all intakes. */
  curricula: number;
  /** semester (0–9) → subject codes, exactly as the curriculum table lists
   *  them, combo slots included. */
  semesters: Record<number, string[]>;
  combos: FptuCombo[];
  /** Why the combo list is empty or partial, when it is. */
  comboNote?: string;
}

/* ─────────────────────────── SE — Kỹ thuật phần mềm ─────────────────────── */

/** Semester-8 elective pool shared by every SE combo (SE_COM*4_ELE). */
export const SE_SEM8_POOL = ['PRN232', 'JIS401', 'JIT401', 'MMA301', 'WDP301', 'DPL303m', 'PRU221m'];
/** Graduation elective (SE_GRA_ELE). */
export const SE_SEM9_POOL = ['SEP490', 'EXE401'];

export const SE_COMBOS: FptuCombo[] = [
  {
    id: 'react-nodejs', code: 'SE_COM4.1', name: 'React / NodeJS', nameVi: 'React / NodeJS', icon: '⚛️',
    bySemester: { 5: ['FER202'], 7: ['SDN302', 'MMA301'], 8: ['WDP301'], 9: SE_SEM9_POOL },
    academyCourses: ['FER202', 'SDN302', 'MMA301', 'WDP301'],
  },
  {
    id: 'dotnet', code: 'SE_COM3.3', name: '.NET Programming', nameVi: 'Lập trình .NET', icon: '🟣',
    bySemester: { 5: ['PRN212'], 7: ['PRN222', 'PRU213'], 8: ['PRN232'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'java', code: 'SE_COM10.2', name: 'Intensive Java', nameVi: 'Java chuyên sâu', icon: '☕',
    bySemester: { 5: ['HSF302'], 7: ['SBA301'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'ai', code: 'SE_COM (AI)', name: 'Artificial Intelligence', nameVi: 'Trí tuệ nhân tạo', icon: '🤖',
    bySemester: { 5: ['PRP201c'], 7: ['AIL304m', 'DBM301'], 8: ['DPL303m'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'data-science', code: 'SE_COM14', name: 'Applied Data Science', nameVi: 'Khoa học dữ liệu ứng dụng', icon: '📊',
    bySemester: { 5: ['PDS301m'], 7: ['DHV301', 'MDS301'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'jbse', code: 'SE_COM5.2', name: 'Japanese Bridge Engineer (advanced Japanese)', nameVi: 'Kỹ sư cầu nối Nhật Bản (tiếng Nhật nâng cao)', icon: '🇯🇵',
    bySemester: { 5: ['JPD133'], 7: ['JPD316'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'jbse-it', code: 'SE_COM5.1.1', name: 'Japanese Bridge Engineer (IT Japanese)', nameVi: 'Kỹ sư cầu nối Nhật Bản (tiếng Nhật CNTT)', icon: '🗾',
    bySemester: { 5: ['JPD133'], 7: ['JPD316'], 8: ['JIS401', 'JIT401'], 9: SE_SEM9_POOL },
    academyCourses: [],
    note: 'Kỳ 8 học JFE301 và chọn 1 trong 2 học phần JIS401 / JIT401.',
  },
  {
    id: 'it-korean', code: 'SE_COM6', name: 'Information Technology — Korean', nameVi: 'CNTT — tiếng Hàn', icon: '🇰🇷',
    bySemester: { 7: ['KOR311'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'ic-design', code: 'SE_COM11', name: 'IC design', nameVi: 'Thiết kế vi mạch', icon: '🔌',
    bySemester: { 5: ['ECI101'], 7: ['MIP201', 'DCD301'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'game-dev', code: 'SE_COM12', name: 'Game Development', nameVi: 'Phát triển game', icon: '🎮',
    bySemester: { 5: ['FGU301'], 7: ['GDC301', 'AGU301'], 9: SE_SEM9_POOL },
    academyCourses: [],
  },
];

/* ─────────────────────────── IS — Hệ thống thông tin ────────────────────── */

const IS_SEM9_POOL = ['SAP490', 'ISP490', 'EXE401'];

export const IS_COMBOS: FptuCombo[] = [
  {
    id: 'sap', code: 'IS_COM2.1', name: 'SAP', nameVi: 'SAP', icon: '🏢',
    bySemester: { 5: ['ACC101'], 7: ['SAP321', 'SAP311'], 8: ['SAP341'], 9: ['SAP490'] },
    academyCourses: [],
    note: 'Chọn combo SAP thì đồ án tốt nghiệp bắt buộc là SAP490.',
  },
  {
    id: 'software-quality', code: 'IS_COM3', name: 'Software System Quality', nameVi: 'Chất lượng hệ thống phần mềm', icon: '🧪',
    bySemester: { 5: ['SWR302'], 7: ['SWT301'], 9: IS_SEM9_POOL },
    academyCourses: ['SWR302', 'SWT301'],
  },
  {
    id: 'is-cybersecurity', code: 'IS_COM4', name: 'Cybersecurity for Information Systems', nameVi: 'Bảo mật cho hệ thống thông tin', icon: '🔐',
    bySemester: { 5: ['IAO201c'], 9: IS_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'enterprise-is', code: 'IS_COM1.2', name: 'Enterprise Information System', nameVi: 'Hệ thống thông tin doanh nghiệp', icon: '🗂️',
    bySemester: { 7: ['DSS301', 'KMS301'], 8: ['BPS301'], 9: IS_SEM9_POOL },
    academyCourses: [],
  },
  {
    id: 'is-data-science', code: 'IS_COM5.1', name: 'Applied Data Science', nameVi: 'Khoa học dữ liệu ứng dụng', icon: '📈',
    bySemester: { 7: ['BDI302c', 'DBM302m'], 8: ['DSP391m'], 9: IS_SEM9_POOL },
    academyCourses: [],
  },
];

/* ──────────────────────── GD — Thiết kế mỹ thuật số ─────────────────────── */

export const GD_COMBOS: FptuCombo[] = [
  {
    id: 'animation-2d', code: 'GD_COM1.1', name: 'Animation 2D', nameVi: 'Hoạt hình 2D', icon: '🎞️',
    bySemester: { 5: ['ANS301', 'ANB402'], 7: ['ANO301', 'ANT401'], 8: ['2DP491'] },
    academyCourses: [],
  },
  {
    id: 'animation-3d', code: 'GD_COM2.1', name: 'Animation 3D', nameVi: 'Hoạt hình 3D', icon: '🧊',
    bySemester: { 5: ['ANM322', 'ANM313'], 7: ['ANA401', 'ANR402'], 8: ['3DP491'] },
    academyCourses: [],
  },
  {
    id: 'interactive-design', code: 'GD_COM3.1', name: 'Interactive Design', nameVi: 'Thiết kế tương tác', icon: '🖱️',
    bySemester: { 7: ['ADH301', 'DID301'], 8: ['ADT401'] },
    academyCourses: [],
  },
  {
    id: 'communication-design', code: 'GD_COM4.1', name: 'Communication Design', nameVi: 'Thiết kế truyền thông', icon: '📣',
    bySemester: { 7: ['ADB201', 'ADP301'], 8: ['ADE301'] },
    academyCourses: [],
  },
  {
    id: 'multimedia-design', code: 'GD_COM6', name: 'Multimedia Communication Design', nameVi: 'Thiết kế truyền thông đa phương tiện', icon: '🎬',
    bySemester: { 7: ['ADE301', 'DID301'], 8: ['ADM401'] },
    academyCourses: [],
  },
];

/* ─────────────────────── IC — Thiết kế vi mạch bán dẫn ──────────────────── */

export const IC_COMBOS: FptuCombo[] = [
  { id: 'ic-robotics', code: 'IC_COM1', name: 'Robotics', nameVi: 'Công nghệ Robot', icon: '🦿', bySemester: { 5: ['ROI201'] }, academyCourses: [] },
  { id: 'ic-iot', code: 'IC_COM2', name: 'IoT', nameVi: 'IoT', icon: '📡', bySemester: { 5: ['PCI201'] }, academyCourses: [] },
  { id: 'ic-packaging', code: 'IC_COM3', name: 'Packaging and Testing', nameVi: 'Đóng gói và kiểm thử', icon: '📦', bySemester: { 5: ['COS201'] }, academyCourses: [] },
  { id: 'ic-optimization', code: 'IC_COM4', name: 'IC Design Optimization', nameVi: 'Tối ưu hoá thiết kế IC', icon: '⚙️', bySemester: { 5: ['COS201'] }, academyCourses: [] },
];

/* ───────────────────────────── The 8 majors ─────────────────────────────── */

const KHONG_CONG_BO = 'Ngành này có chỗ cho chuyên ngành hẹp trong khung chương trình, nhưng FLM chưa công bố danh sách combo — mục "Comboes" của trường để trống, nên Academy không đoán hộ.';

export const FPTU_MAJORS: FptuMajor[] = [
  {
    id: 'se', curriculumCode: 'BIT_SE_K20B', curriculumId: 3005,
    name: 'Software Engineering', nameVi: 'Kỹ thuật phần mềm', icon: '💻',
    credits: 145, curricula: 23, combos: SE_COMBOS,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE1', 'TMI'],
      1: ['CEA201', 'CSI106', 'MAE101', 'PHE2', 'PRF192', 'SSL101c'],
      2: ['MAD101', 'NWC204', 'OSG202', 'PHE3', 'PRO192', 'WED201c'],
      3: ['DBI202', 'JPD113', 'LAB211', 'MAS291', 'SWE202c'],
      4: ['CSD201', 'IOT102', 'JPD123', 'PRJ301', 'SWR302'],
      5: ['SE_COM*1', 'SSG105', 'SWP391', 'SWT301', 'WDU203c'],
      6: ['ENW493c', 'OJT202'],
      7: ['EXE101', 'PMG201c', 'SE_COM*2', 'SE_COM*3', 'SWD392'],
      8: ['EXE201', 'ITE302c', 'MLN111', 'MLN122', 'PRM393', 'SE_COM*4_ELE'],
      9: ['HCM202', 'MLN131', 'SE_GRA_ELE', 'VNR202'],
    },
  },
  {
    id: 'ia', curriculumCode: 'BIT_IA_K20B', curriculumId: 2883,
    name: 'Information Assurance', nameVi: 'An toàn thông tin', icon: '🔐',
    credits: 145, curricula: 25, combos: [], comboNote: KHONG_CONG_BO,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['CEA201', 'CSI106', 'MAE101', 'PFP191', 'PHE_COM*2', 'SSL101c'],
      2: ['APO201c', 'IOT102', 'MAD101', 'NWC204', 'OSG20x', 'PHE_COM*3'],
      3: ['CSD203', 'DBI202', 'IA_ELE2', 'JPD113', 'NWC303'],
      4: ['AIC211', 'ITE302c', 'JPD123', 'MAS291', 'SSG105'],
      5: ['CRY303c', 'FRS301', 'IAA202', 'IAM302', 'PWD301'],
      6: ['ENW493c', 'OJT202'],
      7: ['EXE101', 'HOD402', 'IA_COM*1', 'IA_COM*2', 'IAP301'],
      8: ['EXE201', 'IA_COM*3', 'IA_COM*4', 'MLN111', 'MLN122', 'PMG201c'],
      9: ['HCM202', 'IA_GRA_ELE', 'MLN131', 'VNR202'],
    },
  },
  {
    id: 'gd', curriculumCode: 'BIT_GD_K20B', curriculumId: 2978,
    name: 'Digital Art & Design', nameVi: 'Thiết kế mỹ thuật số', icon: '🎨',
    credits: 146, curricula: 24, combos: GD_COMBOS,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['DRP101', 'DRS102', 'DTG102', 'PHE_COM*2', 'SSL101c', 'VCM202'],
      2: ['GD_ELE1.1', 'GD_ELE2.1', 'HOA102', 'PFD201', 'PHE_COM*3', 'PST202'],
      3: ['ANS201', 'DGP201', 'JPD113', 'RMD301', 'TPG203'],
      4: ['ANC302', 'DTG303', 'JPD123', 'TPG302', 'WDU202c'],
      5: ['CAA201', 'DTG304', 'GD_COM*1', 'GD_COM*2', 'SSG105'],
      6: ['ENW492c', 'OJT202'],
      7: ['EXE101', 'GD_COM*3', 'GD_COM*4', 'SDP201', 'VNC104'],
      8: ['AET102c', 'EXE201', 'GD_COM*5', 'HOD102c', 'IPR102', 'MLN111', 'MLN122'],
      9: ['GD_GRA_ELE1.1', 'HCM202', 'MLN131', 'VNR202'],
    },
  },
  {
    id: 'is', curriculumCode: 'BIT_IS_K20B', curriculumId: 3031,
    name: 'Information System', nameVi: 'Hệ thống thông tin', icon: '🗄️',
    credits: 145, curricula: 20, combos: IS_COMBOS,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['CEA201', 'CSI106', 'MAE101', 'PHE_COM*2', 'PRF192', 'SSL101c'],
      2: ['JPD113', 'MAD101', 'NWC204', 'OSG202', 'PHE_COM*3', 'PRO192'],
      3: ['CSD201', 'DBI202', 'ITA203c', 'JPD123', 'LAB211'],
      4: ['MAS291', 'PRC392c', 'PRJ302', 'SSG105', 'SWE201c'],
      5: ['IS_COM*1', 'ISM302', 'ISP392', 'ITA301', 'ITE302c'],
      6: ['ENW493c', 'OJT202'],
      7: ['EXE101', 'IS_COM*2', 'IS_COM*3', 'ISC301', 'ITB302c'],
      8: ['DTA301', 'EXE201', 'IS_COM*4', 'MLN111', 'MLN122', 'PMG201c'],
      9: ['HCM202', 'IS_GRA_ELE', 'MLN131', 'VNR202'],
    },
  },
  {
    id: 'ic', curriculumCode: 'BIT_IC_K20B', curriculumId: 2947,
    name: 'Integrated Circuit Design', nameVi: 'Thiết kế vi mạch bán dẫn', icon: '🔬',
    credits: 145, curricula: 7, combos: IC_COMBOS,
    comboNote: 'FLM mới công bố môn kỳ 5 của từng combo; các kỳ sau trường chưa đưa lên.',
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['CEA201', 'MAE101', 'PHE_COM*2', 'PRF193', 'SDI101m', 'SSL101c'],
      2: ['CHN113', 'ELC201', 'MAD101', 'NWC204', 'OSG202', 'PHE_COM*3'],
      3: ['CHN123', 'CSD202', 'DIC201', 'MAS291', 'MCP201'],
      4: ['CDP301', 'EMF301c', 'FAP201', 'MCE201', 'SSG105'],
      5: ['DGT302', 'IC_COM*1', 'ICI211', 'LOS201', 'SWE201c'],
      6: ['OJT202', 'PMG201c'],
      7: ['AIC301', 'DIC301', 'ENW493c', 'EXE101', 'IC_COM*2'],
      8: ['EXE201', 'IC_COM*3', 'IC_COM*4', 'MIC301', 'MLN111', 'MLN122'],
      9: ['HCM202', 'IC_GRA_ELE', 'MLN131', 'VNR202'],
    },
  },
  {
    id: 'as', curriculumCode: 'BIT_AS_K20B', curriculumId: 2834,
    name: 'Automotive Software Engineering', nameVi: 'Kỹ thuật phần mềm ô tô', icon: '🚗',
    credits: 145, curricula: 7, combos: [], comboNote: KHONG_CONG_BO,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['ASI101', 'EEI101', 'MAE101', 'PHE_COM*2', 'PRF192', 'SSL101c'],
      2: ['JPD113', 'MAD101', 'NWC204', 'OSG202', 'PCP291', 'PHE_COM*3'],
      3: ['CSD202', 'DIC201', 'EBS211', 'JPD123', 'MAS291'],
      4: ['AEE301', 'EBS311', 'MCE201', 'PEB301', 'SSG105'],
      5: ['AS_COM*1', 'DGT302', 'LOS201', 'MSA201', 'SWE201c'],
      6: ['OJT202', 'PMG201c'],
      7: ['ACS201', 'AS_COM*2', 'AS_COM*3', 'ENW493c', 'EXE101'],
      8: ['AS_COM*4', 'EXE201', 'MLN111', 'MLN122', 'OCC301', 'SPS301'],
      9: ['AS_GRA_ELE', 'HCM202', 'MLN131', 'VNR202'],
    },
  },
  {
    id: 'ra', curriculumCode: 'BIT_RA_K22A', curriculumId: 3010,
    name: 'Robotics & AI', nameVi: 'Robotics & AI', icon: '🦾',
    credits: 145, curricula: 4, combos: [], comboNote: KHONG_CONG_BO,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['JPD113', 'MAC103', 'PHE_COM*2', 'PRF193', 'RAI101', 'SSA101'],
      2: ['ELC201', 'EMM201c', 'JPD123', 'MAA102', 'PFP191', 'PHE_COM*3'],
      3: ['DIC201', 'LOS201', 'MAO303', 'MAS291', 'MCP201'],
      4: ['AIL304m', 'CDP301', 'DGT302', 'SEA301', 'SSG105'],
      5: ['COS201c', 'CPV301', 'DCO301', 'RA-COM1', 'RRC301'],
      6: ['NLP301c', 'OJT202'],
      7: ['DPL303m', 'ENW493c', 'EXE101', 'RA-COM2', 'RA-COM3'],
      8: ['CDR301', 'EXE201', 'MLN111', 'MLN122', 'RA-COM4', 'REL301m'],
      9: ['HCM202', 'MLN131', 'RA_GRA_ELE', 'VNR202'],
    },
  },
  {
    id: 'dx', curriculumCode: 'BIT_DX_K21A', curriculumId: 2880,
    name: 'Digital Transformation', nameVi: 'Chuyển đổi số', icon: '🔄',
    credits: 145, curricula: 4, combos: [], comboNote: KHONG_CONG_BO,
    semesters: {
      0: ['OTP101', 'PEN', 'PHE_COM*1', 'TMI_ELE'],
      1: ['CSI106', 'MAE101', 'PFP191', 'PHE_COM*2', 'SSA101'],
      2: ['DBI202', 'DXE291c', 'JPD113', 'MAD101', 'NWC204', 'PHE_COM*3'],
      3: ['CSD203', 'ISD201', 'JPD123', 'MAS291', 'SWE201c'],
      4: ['AIL304m', 'IAO202', 'IOT102', 'ITA301', 'PWD301'],
      5: ['BDI302c', 'DX_COM*1', 'DXP391', 'EGA301', 'SSG105', 'SWT301'],
      6: ['ENW493c', 'OJT202'],
      7: ['DX_COM*2', 'DX_COM*3', 'EXE101', 'ITE304', 'PRC392c'],
      8: ['DX_COM*4', 'EXE201', 'ISM302', 'MLN111', 'MLN122', 'PIM201c'],
      // FLM lists the last block as semester 10 for this curriculum.
      9: ['DX_GRA_ELE', 'HCM202', 'MLN131', 'VNR202'],
    },
  },
];

/* ─────────────────────────────── Helpers ───────────────────────────────── */

export const getMajor = (id: string | null | undefined): FptuMajor | undefined =>
  FPTU_MAJORS.find((m) => m.id === id);

export const getCombo = (majorId: string | null | undefined, comboId: string | null | undefined): FptuCombo | undefined =>
  getMajor(majorId)?.combos.find((c) => c.id === comboId);

/** Codes the student's own curriculum contains, semester by semester, with the
 *  combo slots already replaced by the subjects of the combo they picked.
 *  A slot with no combo chosen stays a slot — that is the honest state. */
export function semesterPlan(majorId: string | null, comboId: string | null): { semester: number; codes: string[] }[] {
  const major = getMajor(majorId);
  if (!major) return [];
  const combo = getCombo(majorId, comboId);
  return Object.keys(major.semesters)
    .map(Number)
    .sort((a, b) => a - b)
    .map((semester) => {
      const raw = major.semesters[semester] ?? [];
      const fromCombo = combo?.bySemester[semester] ?? [];
      const codes: string[] = [];
      let used = 0;
      raw.forEach((code) => {
        // A combo slot is filled by the combo's subject for that semester; if
        // the combo has fewer subjects than slots, the extra slot is dropped
        // rather than shown twice.
        if (isPlaceholderCode(code) && /_(COM|GRA)/.test(code) && fromCombo.length) {
          const pick = fromCombo[used++];
          if (pick && !codes.includes(pick)) codes.push(pick);
          return;
        }
        codes.push(code);
      });
      // Subjects the combo adds at this semester beyond the slots counted above.
      fromCombo.slice(used).forEach((c) => { if (!codes.includes(c)) codes.push(c); });
      return { semester, codes };
    });
}

/** Flat list of every real (non-placeholder) code in the student's plan. */
export function relevantCourseCodes(majorId: string | null, comboId: string | null): {
  combo: string[];
  major: string[];
  shared: string[];
} {
  const combo = getCombo(majorId, comboId);
  const comboCodes = combo ? Object.values(combo.bySemester).flat() : [];
  const plan = semesterPlan(majorId, comboId).flatMap((s) => s.codes).filter((c) => !isPlaceholderCode(c));
  const inCombo = (c: string) => comboCodes.includes(c);
  // "Shared" = taught to every FPTU IT student regardless of major.
  const shared = plan.filter((c) => SHARED_COURSE_CODES.includes(c) && !inCombo(c));
  const major = plan.filter((c) => !inCombo(c) && !shared.includes(c));
  return {
    combo: [...new Set(comboCodes)],
    major: [...new Set(major)],
    shared: [...new Set(shared)],
  };
}

/** Subjects that appear in EVERY one of the 8 curricula above — computed once
 *  from the tables themselves rather than typed by hand, so it cannot drift. */
export const SHARED_COURSE_CODES: string[] = (() => {
  const lists = FPTU_MAJORS.map((m) => new Set(Object.values(m.semesters).flat()));
  const [first, ...rest] = lists;
  return [...first].filter((c) => !isPlaceholderCode(c) && rest.every((s) => s.has(c))).sort();
})();

export { isPlaceholderCode, placeholderLabel, subjectName };
