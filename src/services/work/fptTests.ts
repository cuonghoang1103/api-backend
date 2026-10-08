/**
 * CT Work — tài liệu kiểm thử chuẩn FPT (đợt 1b, 08/10/2026): phần THUẦN (không DB).
 *
 *   • Thống kê: mỗi hàm Passed/Failed/Untested/N/A/B/Total; chỉ tiêu "Normal number of Test cases/KLOC"
 *     (mặc định 100) ⇒ số test case tối thiểu theo LOC; integration theo module Passed/Failed/Pending/N/A.
 *   • Xuất Excel ĐÚNG CẤU TRÚC mẫu trường:
 *       Report 5.1 Unit Test   = Guideline · Cover · Functions · Statistics · 1 sheet/hàm (ma trận UTCID).
 *       Report 5.2 Integration = Cover · Test Cases · Test Statistics · 1 sheet/module.
 *     Vị trí ô, tiêu đề cột, gộp ô, màu (xanh navy 000080 / 333399 / xanh ô liu 76923C), công thức
 *     COUNTIF/SUM như mẫu (sửa luôn lỗi dải SUM lệch của bản mẫu) + giá trị tính sẵn.
 *   • Nhập lại từ đúng mẫu đó (tệp nhóm đang làm bằng Excel/Google Sheets) — đọc theo NHÃN chứ không cứng toạ độ,
 *     vì mỗi nhóm kéo lệch vài cột/dòng.
 *
 * Bản quyền: chỉ tái tạo CẤU TRÚC mẫu; chữ hướng dẫn trong sheet Guideline là lời của CT Work.
 */

import { cellRef, colName, excelSerial, fromExcelSerial, quoteSheet, safeSheetName, XSheet, type RSheet, type XStyle } from './xlsxStyled.js';

// ─── Kiểu dữ liệu ────────────────────────────────────────────────

export const UNIT_SECTIONS = ['COND', 'CONFIRM'] as const;
export type UnitSection = (typeof UNIT_SECTIONS)[number];
export const CASE_TYPES = ['N', 'A', 'B'] as const;
export type CaseType = (typeof CASE_TYPES)[number];
export const CASE_RESULTS = ['P', 'F'] as const;
export type CaseResult = (typeof CASE_RESULTS)[number];
export const IT_STATUSES = ['Passed', 'Failed', 'Pending', 'N/A'] as const;
export type ItStatus = (typeof IT_STATUSES)[number];
export const MAX_ROUNDS = 4;
export const CHANGE_ACTIONS = ['A', 'D', 'M'] as const;

export interface DocMeta {
  projectName: string;
  projectCode: string;
  creator: string | null;
  reviewer: string | null;
  version: string;
  unitIssueDate: string | null;
  intIssueDate: string | null;
  environment: string | null;
  tcPerKloc: number;
  unitNotes: string | null;
  intNotes: string | null;
}
export interface ChangeData {
  effectiveDate: string;
  version: string;
  changeItem: string | null;
  action: string;
  description: string | null;
  reference: string | null;
}
export interface UnitRowData { key: string; section: UnitSection; groupName: string; label: string | null; value: string | null }
export interface UnitCaseData { key: string; type: CaseType; result: CaseResult | null; executedAt: string | null; defectId: string | null; note: string | null }
export interface UnitFunctionData {
  moduleName: string;
  methodName: string;
  sheetName: string | null;
  description: string | null;
  preCondition: string | null;
  testRequirement: string | null;
  codeRef: string | null;
  loc: number | null;
  createdBy: string | null;
  executedBy: string | null;
  rows: UnitRowData[];
  cases: UnitCaseData[];
  /** [rowKey, caseKey] — ô có dấu "O". */
  marks: Array<[string, string]>;
}
export interface ItRound { status: ItStatus | null; date: string | null; tester: string | null }
export interface ItCaseData {
  section: string | null;
  description: string;
  procedure: string | null;
  testData: string | null;
  expected: string | null;
  actual: string | null;
  preConditions: string | null;
  evidence: string | null;
  note: string | null;
  rounds: ItRound[];
}
export interface ItModuleData {
  name: string;
  sheetName: string | null;
  idPrefix: string;
  description: string | null;
  preCondition: string | null;
  testRequirement: string | null;
  cases: ItCaseData[];
}

// ─── Thống kê ────────────────────────────────────────────────────

export interface UnitStats { passed: number; failed: number; untested: number; n: number; a: number; b: number; total: number }

export function unitStats(cases: Array<{ type: string; result: string | null }>): UnitStats {
  const s: UnitStats = { passed: 0, failed: 0, untested: 0, n: 0, a: 0, b: 0, total: cases.length };
  for (const c of cases) {
    if (c.result === 'P') s.passed++;
    else if (c.result === 'F') s.failed++;
    if (c.type === 'N') s.n++;
    else if (c.type === 'A') s.a++;
    else if (c.type === 'B') s.b++;
  }
  s.untested = s.total - s.passed - s.failed;
  return s;
}

const pct = (x: number, total: number) => (total > 0 ? Math.round((x * 1000) / total) / 10 : 0);

/** Số test case tối thiểu theo LOC: ceil(LOC/1000 × chỉ tiêu). LOC trống ⇒ null (không đánh giá được). */
export function requiredCases(loc: number | null | undefined, tcPerKloc: number): number | null {
  if (!loc || loc <= 0 || tcPerKloc <= 0) return null;
  return Math.ceil((loc / 1000) * tcPerKloc);
}

export interface UnitSummary extends UnitStats {
  functions: number;
  coverage: number;
  successCoverage: number;
  normalPct: number;
  abnormalPct: number;
  boundaryPct: number;
  totalLoc: number;
  kloc: number;
  /** Tổng số test case tối thiểu của các hàm CÓ khai LOC. */
  requiredCases: number;
  /** Số test case thực có của các hàm có khai LOC (so cùng tập với requiredCases). */
  casesWithLoc: number;
  functionsWithoutLoc: number;
  /** Hàm có LOC nhưng ít test case hơn chỉ tiêu. */
  belowNorm: number;
  meetsNorm: boolean | null;
}

export function unitSummary(fns: Array<{ loc: number | null; cases: Array<{ type: string; result: string | null }> }>, tcPerKloc: number): UnitSummary {
  const all = unitStats(fns.flatMap((f) => f.cases));
  let totalLoc = 0, required = 0, withLoc = 0, noLoc = 0, below = 0;
  for (const f of fns) {
    const r = requiredCases(f.loc, tcPerKloc);
    if (r === null) { noLoc++; continue; }
    totalLoc += f.loc ?? 0;
    required += r;
    withLoc += f.cases.length;
    if (f.cases.length < r) below++;
  }
  return {
    ...all,
    functions: fns.length,
    coverage: pct(all.passed + all.failed, all.total),
    successCoverage: pct(all.passed, all.total),
    normalPct: pct(all.n, all.total),
    abnormalPct: pct(all.a, all.total),
    boundaryPct: pct(all.b, all.total),
    totalLoc,
    kloc: Math.round(totalLoc) / 1000,
    requiredCases: required,
    casesWithLoc: withLoc,
    functionsWithoutLoc: noLoc,
    belowNorm: below,
    meetsNorm: fns.length - noLoc === 0 ? null : below === 0 && withLoc >= required,
  };
}

/** Trạng thái hiện tại của integration case = vòng gần nhất có kết quả; chưa vòng nào ⇒ Pending. */
export function itCurrentStatus(rounds: ItRound[]): ItStatus {
  for (let i = rounds.length - 1; i >= 0; i--) if (rounds[i]?.status) return rounds[i].status!;
  return 'Pending';
}

export interface ItStats { passed: number; failed: number; pending: number; na: number; total: number; rounds: Array<{ passed: number; failed: number; pending: number; na: number }>; lastRound: number }

export function itStats(cases: Array<{ rounds: ItRound[] }>): ItStats {
  const s: ItStats = { passed: 0, failed: 0, pending: 0, na: 0, total: cases.length, rounds: [], lastRound: 0 };
  for (let i = 0; i < MAX_ROUNDS; i++) s.rounds.push({ passed: 0, failed: 0, pending: 0, na: 0 });
  const bump = (o: { passed: number; failed: number; pending: number; na: number }, st: ItStatus) => {
    if (st === 'Passed') o.passed++; else if (st === 'Failed') o.failed++; else if (st === 'Pending') o.pending++; else o.na++;
  };
  for (const c of cases) {
    bump(s, itCurrentStatus(c.rounds));
    c.rounds.slice(0, MAX_ROUNDS).forEach((r, i) => {
      if (!r?.status) return;
      bump(s.rounds[i], r.status);
      s.lastRound = Math.max(s.lastRound, i + 1);
    });
  }
  return s;
}

export function itCoverage(s: { passed: number; failed: number; na: number; total: number }) {
  const base = s.total - s.na;
  return { coverage: pct(s.passed + s.failed, base), successCoverage: pct(s.passed, base) };
}

/** Tên sheet mặc định của hàm: methodName viết thường chữ đầu (giống mẫu: Login ⇒ login). */
export function defaultSheetName(methodName: string): string {
  const s = methodName.trim();
  return s ? s[0].toLowerCase() + s.slice(1) : 'function';
}

/** Tiền tố mã integration: nhiều từ ⇒ chữ cái đầu mỗi từ (UserManagement ⇒ UM); một từ ⇒ chữ đầu + phụ âm kế (Authentication ⇒ AT). */
export function defaultIdPrefix(name: string): string {
  const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length >= 2) return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
  const w = (words[0] ?? 'IT').toUpperCase();
  const cons = w.slice(1).replace(/[AEIOU]/g, '');
  return (w[0] + (cons[0] ?? w[1] ?? 'T')).slice(0, 2);
}

// ─── Kiểu ô Excel (theo mẫu) ─────────────────────────────────────

const NAVY = '000080';
const INDIGO = '333399';
const OLIVE = '76923C';
const MINT = 'CCFFCC';
const AQUA = 'CCFFFF';
const WHITE = 'FFFFFF';
const DATE_FMT = 'dd/mm/yyyy';

const S = {
  title: { font: { name: 'Tahoma', sz: 20, b: true, color: '000000' } } as XStyle,
  label: { font: { name: 'Tahoma', sz: 10, b: true }, fill: WHITE, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  value: { font: { name: 'Tahoma', sz: 10 }, fill: WHITE, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  valueDate: { font: { name: 'Tahoma', sz: 10 }, fill: WHITE, border: 'thin', align: { h: 'left', v: 'top' }, numFmt: DATE_FMT } as XStyle,
  navyHead: { font: { name: 'Tahoma', sz: 10, b: true, color: WHITE }, fill: NAVY, border: 'thin', align: { h: 'center', v: 'center', wrap: true } } as XStyle,
  indigoHead: { font: { name: 'Tahoma', sz: 10, b: true, color: WHITE }, fill: INDIGO, border: 'thin', align: { h: 'center', v: 'center', wrap: true } } as XStyle,
  oliveHead: { font: { name: 'Tahoma', sz: 10, b: true, color: WHITE }, fill: OLIVE, border: 'thin', align: { h: 'center', v: 'center', wrap: true } } as XStyle,
  cell: { font: { name: 'Tahoma', sz: 10 }, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  cellCenter: { font: { name: 'Tahoma', sz: 10 }, border: 'thin', align: { h: 'center', v: 'top' } } as XStyle,
  cellDate: { font: { name: 'Tahoma', sz: 10 }, border: 'thin', align: { h: 'center', v: 'top' }, numFmt: DATE_FMT } as XStyle,
  cellBold: { font: { name: 'Tahoma', sz: 10, b: true }, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  link: { font: { name: 'Tahoma', sz: 10, u: true, color: '0000FF' }, border: 'thin', align: { v: 'top' } } as XStyle,
  subtotal: { font: { name: 'Tahoma', sz: 10, b: true, color: WHITE }, fill: NAVY, border: 'thin', align: { h: 'center' } } as XStyle,
  pctLabel: { font: { name: 'Tahoma', sz: 10, b: true }, align: { v: 'center' } } as XStyle,
  pctValue: { font: { name: 'Tahoma', sz: 10, b: true }, align: { h: 'right' }, numFmt: '0.0' } as XStyle,
  guideline: { font: { name: 'Tahoma', sz: 10 }, fill: MINT, align: { v: 'top', wrap: true } } as XStyle,
  guidelineB: { font: { name: 'Tahoma', sz: 10, b: true }, fill: MINT, align: { v: 'top', wrap: true } } as XStyle,
  // Sheet ma trận: chữ Tahoma 8 như mẫu.
  m: { font: { name: 'Tahoma', sz: 8 }, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  mB: { font: { name: 'Tahoma', sz: 8, b: true }, border: 'thin', align: { v: 'top', wrap: true } } as XStyle,
  mHead: { font: { name: 'Tahoma', sz: 8, b: true }, fill: WHITE, border: 'thin', align: { v: 'center', wrap: true } } as XStyle,
  mHeadVal: { font: { name: 'Tahoma', sz: 8 }, fill: WHITE, border: 'thin', align: { v: 'center', wrap: true } } as XStyle,
  mCount: { font: { name: 'Tahoma', sz: 8 }, fill: WHITE, border: 'thin', align: { h: 'center', v: 'center' } } as XStyle,
  mSection: { font: { name: 'Tahoma', sz: 8, b: true, color: WHITE }, fill: NAVY, border: 'thin', align: { v: 'top' } } as XStyle,
  mUtc: { font: { name: 'Tahoma', sz: 8, b: true, color: WHITE }, fill: NAVY, border: 'thin', align: { h: 'center', v: 'bottom', rot: 90 } } as XStyle,
  mValue: { font: { name: 'Tahoma', sz: 8 }, border: 'thin', align: { h: 'right', v: 'top', wrap: true } } as XStyle,
  mMark: { font: { name: 'Tahoma', sz: 12, b: true }, border: 'thin', align: { h: 'center', v: 'center' } } as XStyle,
  mType: { font: { name: 'Courier New', sz: 8 }, border: 'thin', align: { h: 'center', v: 'center' } } as XStyle,
  mDate: { font: { name: 'Tahoma', sz: 8 }, border: 'thin', align: { h: 'center', v: 'center', rot: 90 }, numFmt: DATE_FMT } as XStyle,
};

const dateVal = (iso: string | null | undefined): Date | null => {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};

function coverSheet(title: string, meta: DocMeta, issueDate: string | null, docSuffix: string, changes: ChangeData[], defaultChange: string): XSheet {
  const sh = new XSheet('Cover');
  sh.showGrid = false;
  [28.1, 10, 18.4, 14.8, 44, 48.1].forEach((w, i) => sh.width(i + 1, w));
  sh.set(2, 2, title, { ...S.title, align: { h: 'center' } }).merge(2, 2, 2, 6);
  sh.height(2, 30);
  const row = (r: number, l1: string, v1: unknown, l2: string, v2: unknown, v2Date = false) => {
    sh.set(r, 1, l1, S.label);
    sh.set(r, 2, v1 as never, S.value).merge(r, 2, r, 4, S.value);
    sh.set(r, 5, l2, S.label);
    sh.set(r, 6, v2 as never, v2Date ? S.valueDate : S.value);
  };
  row(4, 'Project Name', meta.projectName, 'Creator', meta.creator ?? '');
  row(5, 'Project Code', meta.projectCode, 'Issue Date', dateVal(issueDate), true);
  const versionNum = Number(meta.version);
  row(6, 'Document Code', { f: `B5&"_"&"${docSuffix}"&"_"&"v${meta.version.replace(/"/g, '')}"`, v: `${meta.projectCode}_${docSuffix}_v${meta.version}` },
    'Version', Number.isFinite(versionNum) && /^\d+(\.\d+)?$/.test(meta.version) ? versionNum : meta.version);
  sh.set(9, 1, 'Record of change', { font: { name: 'Tahoma', sz: 10, b: true } });
  ['Effective Date', 'Version', 'Change Item', '*A,D,M', 'Change description', 'Reference'].forEach((h, i) => sh.set(10, i + 1, h, S.navyHead));
  const list = changes.length ? changes : [{ effectiveDate: issueDate ?? new Date().toISOString().slice(0, 10), version: meta.version, changeItem: null, action: 'A', description: defaultChange, reference: null }];
  list.forEach((c, i) => {
    const r = 11 + i;
    sh.set(r, 1, dateVal(c.effectiveDate), S.cellDate);
    sh.set(r, 2, c.version, S.cellCenter);
    sh.set(r, 3, c.changeItem ?? '', S.cell);
    sh.set(r, 4, c.action, S.cellCenter);
    sh.set(r, 5, c.description ?? '', S.cell);
    sh.set(r, 6, c.reference ?? '', S.cell);
  });
  return sh;
}

// ─── Report 5.1 — Unit Test ──────────────────────────────────────

const GUIDELINE: Array<[string, boolean?]> = [
  ['Guideline to make and understand Unit Test Case', true],
  [''],
  ['1. Overview', true],
  [' - Unit test cases are organised by FUNCTION: every function has its own sheet holding a matrix of test cases (UTCID01, UTCID02, …).'],
  [' - Cover: general information about the project and the document, plus the Record of change (A = Added, D = Deleted, M = Modified).'],
  [' - Functions: the list of classes/modules and functions covered. Click a Sheet Name to jump to that function\'s test cases.'],
  [' - Statistics: overall result of the unit test — Passed / Failed / Untested and Normal / Abnormal / Boundary counts per function, with coverage.'],
  ['     Note: totals are formulas — if you add functions by hand in Excel, extend the "Sub total" ranges.'],
  [''],
  ['2. Content of a function sheet', true],
  ['2.1 Number of test cases', true],
  [' - "Normal number of Test cases/KLOC" on the Functions sheet is the minimum density required (100 by default). Required test cases = KLOC × that number.'],
  [' - If a function has fewer test cases than required, explain the reason in the Notes of the Statistics sheet.'],
  [''],
  ['2.2 Condition and Confirmation', true],
  [' Every test case (column) is a combination of Conditions and Confirmations; an "O" in a cell means the row applies to that test case.'],
  ['a. Condition', true],
  ['     - Precondition: the state that must exist before the function runs (server connected, record exists…).'],
  ['     - Input values: one group per parameter, one row per value used. Values are Normal (typical), Boundary (limits such as min/max length) or Abnormal (invalid, null, wrong type).'],
  ['     - Example: for 5 <= input <= 10 — 6, 7, 8, 9 are normal; 5 and 10 are boundary; -1, 11 are abnormal.'],
  ['b. Confirmation', true],
  ['     - The expected outcome of the function: Return value, Exception thrown, Log message / screen message.'],
  ['c. Type and result', true],
  ['     - Type: N (Normal), A (Abnormal), B (Boundary).'],
  ['     - Passed/Failed: P when the actual output matches the Confirmation, F otherwise (record the Defect ID). Empty = untested.'],
  [''],
  ['2.3 Other items', true],
  [' - Code Module / Method: the class and function under test. Created By / Executed By: author and executor of the test cases.'],
  [' - Test requirement: short description of what the function must do. Lines of code (Functions sheet) drive the KLOC check.'],
  [''],
  ['Generated by CT Work — the structure follows the FPT University unit test report template.'],
];

/** Ma trận một hàm. `first` = hàng UTCID (7). Trả về các hàng quan trọng cho công thức Statistics. */
function unitFunctionSheet(name: string, fn: UnitFunctionData): XSheet {
  const sh = new XSheet(name);
  sh.showGrid = false;
  const nCases = fn.cases.length;
  const lastCaseCol = 4 + Math.max(nCases, 1);
  const wideCol = Math.max(lastCaseCol, 18); // mẫu gộp tới cột R
  sh.width(1, 9).width(2, 11).width(3, 18.7).width(4, 22);
  for (let c = 5; c <= Math.max(lastCaseCol, 18); c++) sh.width(c, 4.9);

  // Hàng 1–3: đầu sheet.
  sh.set(1, 1, 'Code Module', S.mHead).merge(1, 1, 1, 2, S.mHead);
  sh.set(1, 3, fn.moduleName, S.mHeadVal).merge(1, 3, 1, 4, S.mHeadVal);
  sh.set(1, 5, 'Method', S.mHead).merge(1, 5, 1, 13, S.mHead);
  sh.set(1, 14, fn.methodName, S.mHeadVal).merge(1, 14, 1, wideCol, S.mHeadVal);
  sh.set(2, 1, 'Created By', S.mHead).merge(2, 1, 2, 2, S.mHead);
  sh.set(2, 3, fn.createdBy ?? '', S.mHeadVal).merge(2, 3, 2, 4, S.mHeadVal);
  sh.set(2, 5, 'Executed By', S.mHead).merge(2, 5, 2, 13, S.mHead);
  sh.set(2, 14, fn.executedBy ?? '', S.mHeadVal).merge(2, 14, 2, wideCol, S.mHeadVal);
  sh.set(3, 1, 'Test requirement', S.mHead).merge(3, 1, 3, 2, S.mHead);
  sh.set(3, 3, fn.testRequirement ?? fn.description ?? '', S.mHeadVal).merge(3, 3, 3, wideCol, S.mHeadVal);
  sh.height(3, 30);

  // Bố cục thân: Condition → Confirm → Result.
  const utcRow = 7;
  let r = utcRow + 1;
  const markCol = new Map(fn.cases.map((c, i) => [c.key, 5 + i]));
  const marks = new Set(fn.marks.map(([rk, ck]) => `${rk}|${ck}`));
  const firstBody = r;
  for (const section of UNIT_SECTIONS) {
    const rows = fn.rows.filter((x) => x.section === section);
    const groups: string[] = [];
    for (const x of rows) if (!groups.includes(x.groupName)) groups.push(x.groupName);
    const secStart = r;
    const blankCases = (row: number) => { for (let c = 5; c <= lastCaseCol; c++) sh.style(row, c, S.mMark); };
    if (!groups.length) {
      sh.set(r, 1, section === 'COND' ? 'Condition' : 'Confirm', S.mSection);
      sh.style(r, 2, S.mB).style(r, 3, S.m).style(r, 4, S.m);
      blankCases(r);
      r++;
    }
    for (const g of groups) {
      sh.set(r, 1, r === secStart ? (section === 'COND' ? 'Condition' : 'Confirm') : null, S.mSection);
      sh.set(r, 2, g, S.mB).style(r, 3, S.m).style(r, 4, S.m);
      blankCases(r);
      r++;
      for (const x of rows.filter((y) => y.groupName === g)) {
        sh.set(r, 1, null, S.mSection);
        sh.style(r, 2, S.m);
        sh.set(r, 3, x.label ?? '', S.m);
        sh.set(r, 4, x.value ?? '', S.mValue);
        for (const c of fn.cases) sh.set(r, markCol.get(c.key)!, marks.has(`${x.key}|${c.key}`) ? 'O' : null, S.mMark);
        for (let c = 5 + nCases; c <= lastCaseCol; c++) sh.style(r, c, S.mMark);
        r++;
      }
    }
  }
  const lastBody = r - 1;
  const typeRow = r, resultRow = r + 1, dateRow = r + 2, defectRow = r + 3;
  const resultLabels = ['Type(N : Normal, A : Abnormal, B : Boundary)', 'Passed/Failed', 'Executed Date', 'Defect ID'];
  resultLabels.forEach((l, i) => {
    sh.set(r + i, 1, i === 0 ? 'Result' : null, S.mSection);
    sh.set(r + i, 2, l, S.m).merge(r + i, 2, r + i, 4, S.m);
  });
  fn.cases.forEach((c, i) => {
    const col = 5 + i;
    sh.set(typeRow, col, c.type, S.mType);
    sh.set(resultRow, col, c.result ?? null, S.mType);
    sh.set(dateRow, col, dateVal(c.executedAt), S.mDate);
    sh.set(defectRow, col, c.defectId ?? null, { ...S.m, align: { h: 'center', v: 'center', wrap: true, rot: 90 } });
  });
  for (let c = 5 + nCases; c <= lastCaseCol; c++) [typeRow, resultRow, dateRow, defectRow].forEach((rr) => sh.style(rr, c, S.mType));
  sh.height(dateRow, 48);
  sh.height(defectRow, 40);

  // UTCID.
  for (let c = 1; c <= 4; c++) sh.style(utcRow, c, { ...S.m, border: 'thin' });
  fn.cases.forEach((_, i) => sh.set(utcRow, 5 + i, `UTCID${String(i + 1).padStart(2, '0')}`, S.mUtc));
  sh.height(utcRow, 48);

  // Hàng 4–5: bộ đếm (công thức như mẫu + giá trị tính sẵn).
  const st = unitStats(fn.cases);
  const span = (row: number) => `E${row}:IV${row}`;
  sh.set(4, 1, 'Passed', S.mHead).merge(4, 1, 4, 2, S.mHead);
  sh.set(4, 3, 'Failed', S.mHead).merge(4, 3, 4, 4, S.mHead);
  sh.set(4, 5, 'Untested', S.mHead).merge(4, 5, 4, 9, S.mHead);
  sh.set(4, 10, 'N/A/B', S.mHead).merge(4, 10, 4, 12, S.mHead);
  sh.set(4, 13, 'Total Test Cases', S.mHead).merge(4, 13, 4, wideCol, S.mHead);
  sh.set(5, 1, { f: `COUNTIF(${span(resultRow)},"P")`, v: st.passed }, S.mCount).merge(5, 1, 5, 2, S.mCount);
  sh.set(5, 3, { f: `COUNTIF(${span(resultRow)},"F")`, v: st.failed }, S.mCount).merge(5, 3, 5, 4, S.mCount);
  sh.set(5, 5, { f: 'SUM(M5,-A5,-C5)', v: st.untested }, S.mCount).merge(5, 5, 5, 9, S.mCount);
  sh.set(5, 10, { f: `COUNTIF(${span(typeRow)},"N")`, v: st.n }, S.mCount);
  sh.set(5, 11, { f: `COUNTIF(${span(typeRow)},"A")`, v: st.a }, S.mCount);
  sh.set(5, 12, { f: `COUNTIF(${span(typeRow)},"B")`, v: st.b }, S.mCount);
  sh.set(5, 13, { f: `COUNTA(${span(utcRow)})`, v: st.total }, S.mCount).merge(5, 13, 5, wideCol, S.mCount);

  // Danh sách thả xuống như mẫu: "O" trong thân, N/A/B, P/F. Chừa 10 cột cho người thêm tay trong Excel.
  const dvEnd = colName(lastCaseCol + 10);
  if (lastBody >= firstBody) sh.listValidation(`E${firstBody}:${dvEnd}${lastBody}`, ['O']);
  sh.listValidation(`E${typeRow}:${dvEnd}${typeRow}`, ['N', 'A', 'B']);
  sh.listValidation(`E${resultRow}:${dvEnd}${resultRow}`, ['P', 'F']);
  sh.freeze = { col: 5, row: utcRow + 1 };
  return sh;
}

export interface UnitExportInput { meta: DocMeta; changes: ChangeData[]; functions: UnitFunctionData[] }

export function buildUnitSheets(input: UnitExportInput): XSheet[] {
  const { meta } = input;
  const taken = new Set(['guideline', 'cover', 'functions', 'statistics']);
  // Thứ tự theo module như sheet Functions (gộp ô theo module).
  const fns = [...input.functions];
  const order: string[] = [];
  for (const f of fns) if (!order.includes(f.moduleName)) order.push(f.moduleName);
  fns.sort((a, b) => order.indexOf(a.moduleName) - order.indexOf(b.moduleName));
  const names = fns.map((f) => safeSheetName(f.sheetName || defaultSheetName(f.methodName), taken, 'function'));

  // Guideline.
  const guide = new XSheet('Guideline');
  guide.showGrid = false;
  guide.width(1, 119.3);
  GUIDELINE.forEach(([t, b], i) => guide.set(i + 1, 1, t, b ? S.guidelineB : S.guideline));

  const cover = coverSheet('UNIT TEST DOCUMENT', meta, meta.unitIssueDate, 'TestReport', input.changes, 'Create unit test document');

  // Functions.
  const fsh = new XSheet('Functions');
  fsh.showGrid = false;
  [6.8, 19.4, 25.8, 30, 56.9, 63.9, 14, 14].forEach((w, i) => fsh.width(i + 1, w));
  fsh.set(2, 5, 'Function List', S.title);
  fsh.height(2, 30);
  const head = (r: number, label: string, v: unknown) => {
    fsh.set(r, 1, label, S.label).merge(r, 1, r, 4, S.label);
    fsh.set(r, 5, v as never, S.value).merge(r, 5, r, 8, S.value);
  };
  head(4, 'Project Name', { f: 'Cover!B4', v: meta.projectName });
  head(5, 'Project Code', { f: 'Cover!B5', v: meta.projectCode });
  head(6, 'Normal number of Test cases/KLOC ', meta.tcPerKloc);
  head(7, 'Test Environment Setup Description', meta.environment || '<List environment required by this system\n1. Server\n2. Database\n3. Web Browser\n...>');
  fsh.height(7, 75);
  ['No', 'Module Name', 'Method Name', 'Sheet Name', 'Description', 'Pre-Condition', 'Lines of code', 'Number of Test Cases'].forEach((h, i) => fsh.set(10, i + 1, h, S.indigoHead));
  fsh.height(10, 27);
  let r = 11;
  let groupStart = 11;
  fns.forEach((f, i) => {
    const next = fns[i + 1];
    fsh.set(r, 1, i + 1, S.cellCenter);
    fsh.set(r, 2, r === groupStart ? f.moduleName : null, S.cellBold);
    fsh.set(r, 3, f.methodName, S.cell);
    fsh.set(r, 4, names[i], S.link).link(r, 4, names[i], names[i]);
    fsh.set(r, 5, f.description ?? '', S.cell);
    fsh.set(r, 6, f.preCondition ?? '', S.cell);
    fsh.set(r, 7, f.loc ?? null, S.cellCenter);
    fsh.set(r, 8, { f: `COUNTA(${quoteSheet(names[i])}!E7:IV7)`, v: f.cases.length }, S.cellCenter);
    if (!next || next.moduleName !== f.moduleName) {
      if (r > groupStart) fsh.merge(groupStart, 2, r, 2, S.cellBold);
      groupStart = r + 1;
    }
    r++;
  });
  const lastFn = r - 1;
  const sum = unitSummary(fns, meta.tcPerKloc);
  r += 1;
  const kpi = (label: string, v: unknown) => {
    fsh.set(r, 3, label, S.label).merge(r, 3, r, 4, S.label);
    fsh.set(r, 5, v as never, S.value);
    r++;
  };
  const locRange = fns.length ? `G11:G${lastFn}` : 'G11:G11';
  const tcRange = fns.length ? `H11:H${lastFn}` : 'H11:H11';
  kpi('Total lines of code', { f: `SUM(${locRange})`, v: sum.totalLoc });
  kpi('KLOC', { f: `E${r - 1}/1000`, v: sum.kloc });
  kpi('Required test cases (KLOC × norm)', { f: `ROUNDUP(E${r - 1}*E6,0)`, v: Math.ceil(sum.kloc * meta.tcPerKloc) });
  kpi('Actual test cases', { f: `SUM(${tcRange})`, v: sum.total });
  kpi('Status', sum.meetsNorm === null
    ? 'Lines of code not filled in — cannot check the norm'
    : sum.meetsNorm ? 'Meets the norm' : `Below the norm (${sum.belowNorm} function(s)) — explain the reason in Statistics › Notes`);

  // Statistics.
  const ssh = new XSheet('Statistics');
  ssh.showGrid = false;
  ssh.width(1, 1).width(2, 14.3).width(3, 23).width(4, 14.4);
  for (let c = 5; c <= 10; c++) ssh.width(c, 12);
  ssh.set(2, 2, 'UNIT TEST REPORT', { ...S.title, fill: WHITE, align: { h: 'center' } }).merge(2, 2, 2, 10);
  ssh.height(2, 30);
  const sRow = (rr: number, l1: string, v1: unknown, l2: string, v2: unknown, date = false) => {
    ssh.set(rr, 2, l1, S.label);
    ssh.set(rr, 3, v1 as never, S.value).merge(rr, 3, rr, 4, S.value);
    ssh.set(rr, 5, l2, S.label).merge(rr, 5, rr, 6, S.label);
    ssh.set(rr, 7, v2 as never, date ? S.valueDate : S.value).merge(rr, 7, rr, 10, date ? S.valueDate : S.value);
  };
  sRow(4, 'Project Name', { f: 'Cover!B4', v: meta.projectName }, 'Creator', meta.creator ?? '');
  sRow(5, 'Project Code', { f: 'Cover!B5', v: meta.projectCode }, 'Reviewer/Approver', meta.reviewer ?? '');
  sRow(6, 'Document Code', { f: `C5&"_"&"Unit Test Report"&"_"&"v${meta.version.replace(/"/g, '')}"`, v: `${meta.projectCode}_Unit Test Report_v${meta.version}` }, 'Issue Date', dateVal(meta.unitIssueDate), true);
  ssh.set(7, 2, 'Notes', S.label);
  ssh.set(7, 3, meta.unitNotes ?? '', S.value).merge(7, 3, 7, 10, S.value);
  ssh.height(7, 30);
  ['No', 'Function code', 'Passed', 'Failed', 'Untested', 'N', 'A', 'B', 'Total Test Cases'].forEach((h, i) => ssh.set(9, i + 2, h, S.navyHead));
  const refs: Array<[string, keyof UnitStats]> = [['A5', 'passed'], ['C5', 'failed'], ['E5', 'untested'], ['J5', 'n'], ['K5', 'a'], ['L5', 'b'], ['M5', 'total']];
  fns.forEach((f, i) => {
    const rr = 10 + i;
    const st = unitStats(f.cases);
    ssh.set(rr, 2, i + 1, S.cellCenter);
    ssh.set(rr, 3, names[i], S.link).link(rr, 3, names[i], names[i]);
    refs.forEach(([ref, k], j) => ssh.set(rr, 4 + j, { f: `${quoteSheet(names[i])}!${ref}`, v: st[k] }, S.cellCenter));
  });
  const subRow = 10 + fns.length;
  const last = Math.max(subRow - 1, 10);
  ssh.set(subRow, 3, 'Sub total', S.subtotal);
  const subKeys: Array<keyof UnitStats> = ['passed', 'failed', 'untested', 'n', 'a', 'b', 'total'];
  subKeys.forEach((k, j) => ssh.set(subRow, 4 + j, { f: `SUM(${colName(4 + j)}10:${colName(4 + j)}${last})`, v: sum[k] as number }, S.subtotal));
  const pctRow = (rr: number, label: string, f: string, v: number) => {
    ssh.set(rr, 3, label, S.pctLabel);
    ssh.set(rr, 5, { f, v }, S.pctValue);
    ssh.set(rr, 6, '%', { font: { name: 'Tahoma', sz: 10 } });
  };
  const J = `J${subRow}`;
  pctRow(subRow + 2, 'Test coverage', `IF(${J}=0,0,(D${subRow}+E${subRow})*100/${J})`, sum.coverage);
  pctRow(subRow + 3, 'Test successful coverage', `IF(${J}=0,0,D${subRow}*100/${J})`, sum.successCoverage);
  pctRow(subRow + 4, 'Normal case', `IF(${J}=0,0,G${subRow}*100/${J})`, sum.normalPct);
  pctRow(subRow + 5, 'Abnormal case', `IF(${J}=0,0,H${subRow}*100/${J})`, sum.abnormalPct);
  pctRow(subRow + 6, 'Boundary case', `IF(${J}=0,0,I${subRow}*100/${J})`, sum.boundaryPct);

  return [guide, cover, fsh, ssh, ...fns.map((f, i) => unitFunctionSheet(names[i], f))];
}

// ─── Report 5.2 — Integration Test ───────────────────────────────

/** Ô Procedure/Note gói thêm Test data / Actual (mẫu không có cột riêng) — nhập lại tách ra được. */
const DATA_MARK = 'Test data:';
const ACTUAL_MARK = 'Actual:';
export function packProcedure(procedure: string | null, testData: string | null): string {
  const p = (procedure ?? '').trim(), d = (testData ?? '').trim();
  return d ? `${p}${p ? '\n\n' : ''}${DATA_MARK}\n${d}` : p;
}
export function unpackProcedure(text: string): { procedure: string | null; testData: string | null } {
  const i = text.indexOf(DATA_MARK);
  if (i < 0) return { procedure: text.trim() || null, testData: null };
  return { procedure: text.slice(0, i).trim() || null, testData: text.slice(i + DATA_MARK.length).trim() || null };
}
export function packNote(actual: string | null, note: string | null): string {
  const a = (actual ?? '').trim(), n = (note ?? '').trim();
  return a ? `${ACTUAL_MARK} ${a}${n ? `\n\n${n}` : ''}` : n;
}
export function unpackNote(text: string): { actual: string | null; note: string | null } {
  const t = text.trim();
  if (!t.startsWith(ACTUAL_MARK)) return { actual: null, note: t || null };
  const rest = t.slice(ACTUAL_MARK.length);
  const cut = rest.indexOf('\n\n');
  return cut < 0 ? { actual: rest.trim() || null, note: null } : { actual: rest.slice(0, cut).trim() || null, note: rest.slice(cut).trim() || null };
}

function itModuleSheet(name: string, m: ItModuleData): XSheet {
  const sh = new XSheet(name);
  sh.showGrid = false;
  [17, 34.4, 31.8, 28.3, 26.8, 24, 24, 9.3, 10.7, 9, 9.3, 10.7, 9, 9.3, 10.7, 9, 9.3, 10.7, 9, 40.3].forEach((w, i) => sh.width(i + 1, w));
  const lab = { ...S.label, align: { h: 'center' as const, v: 'top' as const, wrap: true } };
  sh.set(2, 1, 'Feature', lab);
  sh.set(2, 2, m.name, S.value).merge(2, 2, 2, 5, S.value);
  sh.set(3, 1, 'Test requirement', lab);
  sh.set(3, 2, m.testRequirement ?? m.description ?? '', S.value).merge(3, 2, 3, 5, S.value);
  sh.height(3, 64.5);
  const st = itStats(m.cases);
  const prefix = m.idPrefix.replace(/"/g, '');
  sh.set(4, 1, 'Number of TCs', lab);
  sh.set(4, 2, { f: `COUNTIF(A12:A1000,"*<${prefix}*")`, v: m.cases.length }, S.value).merge(4, 2, 4, 5, S.value);
  sh.set(5, 1, 'Testing Round', lab);
  IT_STATUSES.forEach((s, i) => sh.set(5, 2 + i, s, { ...lab, align: { h: 'center', v: 'top' } }));
  for (let rd = 0; rd < MAX_ROUNDS; rd++) {
    const col = colName(8 + rd * 3);
    sh.set(6 + rd, 1, `Round ${rd + 1}`, lab);
    const counts = st.rounds[rd];
    [counts.passed, counts.failed, counts.pending, counts.na].forEach((v, i) =>
      sh.set(6 + rd, 2 + i, { f: `COUNTIF($${col}12:$${col}1000,${colName(2 + i)}$5)`, v }, { ...S.value, align: { h: 'center', v: 'top' } }));
  }
  // Danh sách giá trị cho ô thả xuống — mẫu đặt ở cột W.
  IT_STATUSES.forEach((s, i) => sh.set(2 + i, 23, s, { font: { name: 'Tahoma', sz: 10 } }));

  const h = 11;
  const heads = ['Test Case ID', 'Test Case Description', 'Test Case Procedure', 'Expected Results', 'Pre-conditions ', 'Evidence'];
  heads.forEach((t, i) => sh.set(h, i + 1, t, S.oliveHead));
  sh.merge(h, 6, h, 7, S.oliveHead);
  for (let rd = 0; rd < MAX_ROUNDS; rd++) {
    sh.set(h, 8 + rd * 3, `Round ${rd + 1}`, S.oliveHead);
    sh.set(h, 9 + rd * 3, 'Test date', S.oliveHead);
    sh.set(h, 10 + rd * 3, 'Tester', S.oliveHead);
  }
  sh.set(h, 20, 'Note', S.oliveHead);
  sh.height(h, 25.5);

  let r = h + 1;
  let section: string | null | undefined;
  let n = 0;
  const statusRanges: string[] = [];
  const firstCaseRow = r;
  for (const c of m.cases) {
    if ((c.section ?? null) !== (section ?? null) && c.section) {
      sh.set(r, 1, c.section, { font: { name: 'Tahoma', sz: 10, b: true }, fill: AQUA, border: 'thin', align: { v: 'center' } });
      for (let col = 2; col <= 20; col++) sh.style(r, col, { fill: AQUA, border: 'thin' });
      r++;
    }
    section = c.section;
    n++;
    const wrap = { ...S.cell, font: { name: 'Tahoma', sz: 10 } };
    sh.set(r, 1, `<${prefix}${n}>`, wrap);
    sh.set(r, 2, c.description, wrap);
    sh.set(r, 3, packProcedure(c.procedure, c.testData), wrap);
    sh.set(r, 4, c.expected ?? '', wrap);
    sh.set(r, 5, c.preConditions ?? '', wrap);
    sh.set(r, 6, c.evidence ?? '', wrap).merge(r, 6, r, 7, wrap);
    for (let rd = 0; rd < MAX_ROUNDS; rd++) {
      const x = c.rounds[rd];
      sh.set(r, 8 + rd * 3, x?.status ?? null, wrap);
      sh.set(r, 9 + rd * 3, dateVal(x?.date), S.cellDate);
      sh.set(r, 10 + rd * 3, x?.tester ?? null, wrap);
    }
    sh.set(r, 20, packNote(c.actual, c.note), wrap);
    r++;
  }
  const lastRow = Math.max(r - 1, firstCaseRow);
  for (let rd = 0; rd < MAX_ROUNDS; rd++) statusRanges.push(`${colName(8 + rd * 3)}${firstCaseRow}:${colName(8 + rd * 3)}${lastRow + 50}`);
  sh.listValidation(statusRanges.join(' '), [...IT_STATUSES]);
  sh.freeze = { col: 2, row: h + 1 };
  return sh;
}

export interface IntegrationExportInput { meta: DocMeta; changes: ChangeData[]; modules: ItModuleData[] }

export function buildIntegrationSheets(input: IntegrationExportInput): XSheet[] {
  const { meta, modules } = input;
  const taken = new Set(['cover', 'test cases', 'test statistics']);
  const names = modules.map((m) => safeSheetName(m.sheetName || m.name, taken, 'Module'));
  const cover = coverSheet('TEST REPORT DOCUMENT', meta, meta.intIssueDate, 'TestReport5.2', input.changes, 'Create integration test document');

  const tc = new XSheet('Test Cases');
  tc.showGrid = false;
  [1.3, 12.3, 22, 22, 73, 40].forEach((w, i) => tc.width(i + 1, w));
  tc.set(1, 4, 'TEST CASE LIST', S.title);
  tc.height(1, 30);
  const head = (r: number, l: string, v: unknown) => {
    tc.set(r, 2, l, S.label).merge(r, 2, r, 3, S.label);
    tc.set(r, 4, v as never, S.value).merge(r, 4, r, 6, S.value);
  };
  head(3, 'Project Name', { f: 'Cover!B4', v: meta.projectName });
  head(4, 'Project Code', { f: 'Cover!B5', v: meta.projectCode });
  head(5, 'Test Environment Setup Description', meta.environment || '<List environment required by this system\n1. Server\n2. Database\n3. Web Browser\n...>');
  tc.height(5, 75);
  ['No', 'Function Name', 'Sheet Name', 'Description', 'Pre-Condition'].forEach((t, i) => tc.set(8, i + 2, t, S.indigoHead));
  modules.forEach((m, i) => {
    const r = 9 + i;
    tc.set(r, 2, i + 1, S.cellCenter);
    tc.set(r, 3, m.name, S.cell);
    tc.set(r, 4, names[i], S.link).link(r, 4, names[i], names[i]);
    tc.set(r, 5, m.description ?? '', S.cell);
    tc.set(r, 6, m.preCondition ?? '', S.cell);
  });

  const ts = new XSheet('Test Statistics');
  ts.showGrid = false;
  ts.width(1, 4.4).width(2, 14.3).width(3, 24);
  for (let c = 4; c <= 8; c++) ts.width(c, 13);
  ts.set(1, 2, 'INTEGRATION TEST REPORT', { ...S.title, fill: WHITE, align: { h: 'center' } }).merge(1, 2, 1, 8);
  ts.height(1, 30);
  const sRow = (r: number, l1: string, v1: unknown, l2: string, v2: unknown, date = false) => {
    ts.set(r, 2, l1, S.label);
    ts.set(r, 3, v1 as never, S.value).merge(r, 3, r, 4, S.value);
    ts.set(r, 5, l2, S.label).merge(r, 5, r, 7, S.label);
    ts.set(r, 8, v2 as never, date ? S.valueDate : S.value);
  };
  sRow(3, 'Project Name', { f: 'Cover!B4', v: meta.projectName }, 'Creator', meta.creator ?? '');
  sRow(4, 'Project Code', { f: 'Cover!B5', v: meta.projectCode }, 'Reviewer/Approver', meta.reviewer ?? '');
  sRow(5, 'Document Code', { f: `C4&"_"&"Integration Test Report"&"_"&"v${meta.version.replace(/"/g, '')}"`, v: `${meta.projectCode}_Integration Test Report_v${meta.version}` }, 'Issue Date', dateVal(meta.intIssueDate), true);
  ts.set(6, 2, 'Notes', S.label);
  ts.set(6, 3, meta.intNotes ?? '', S.value).merge(6, 3, 6, 8, S.value);
  ['No', 'Module code', 'Passed', 'Failed', 'Pending', 'N/A', 'Number of  test cases'].forEach((t, i) => ts.set(9, i + 2, t, S.navyHead));
  const tot = { passed: 0, failed: 0, pending: 0, na: 0, total: 0 };
  modules.forEach((m, i) => {
    const r = 10 + i;
    const st = itStats(m.cases);
    // Mẫu lấy số của vòng chạy cuối; module chưa chạy vòng nào ⇒ dùng trạng thái hiện tại (đều Pending).
    const round = Math.max(st.lastRound, 1);
    const roundRow = 5 + round;
    const counts = st.lastRound ? st.rounds[round - 1] : { passed: 0, failed: 0, pending: st.total, na: 0 };
    // Ca chưa có kết quả ở vòng cuối vẫn là Pending — cộng vào cột Pending cho khớp tổng.
    const pendingExtra = st.total - (counts.passed + counts.failed + counts.pending + counts.na);
    const q = quoteSheet(names[i]);
    ts.set(r, 2, i + 1, S.cellCenter);
    ts.set(r, 3, { f: `${q}!B2`, v: m.name }, S.link);
    ts.link(r, 3, names[i], m.name);
    ts.set(r, 4, { f: `${q}!B${roundRow}`, v: counts.passed }, S.cellCenter);
    ts.set(r, 5, { f: `${q}!C${roundRow}`, v: counts.failed }, S.cellCenter);
    ts.set(r, 6, { f: pendingExtra && st.lastRound ? `${q}!B4-${q}!B${roundRow}-${q}!C${roundRow}-${q}!E${roundRow}` : `${q}!D${roundRow}`, v: counts.pending + (st.lastRound ? pendingExtra : 0) }, S.cellCenter);
    ts.set(r, 7, { f: `${q}!E${roundRow}`, v: counts.na }, S.cellCenter);
    ts.set(r, 8, { f: `${q}!B4`, v: st.total }, S.cellCenter);
    tot.passed += counts.passed; tot.failed += counts.failed; tot.pending += counts.pending + (st.lastRound ? pendingExtra : 0); tot.na += counts.na; tot.total += st.total;
  });
  const sub = 10 + modules.length;
  const last = Math.max(sub - 1, 10);
  ts.set(sub, 3, 'Sub total', S.subtotal);
  [tot.passed, tot.failed, tot.pending, tot.na, tot.total].forEach((v, j) => ts.set(sub, 4 + j, { f: `SUM(${colName(4 + j)}10:${colName(4 + j)}${last})`, v }, S.subtotal));
  const cov = itCoverage(tot);
  const pRow = (r: number, l: string, f: string, v: number) => {
    ts.set(r, 3, l, S.pctLabel);
    ts.set(r, 5, { f, v }, S.pctValue);
    ts.set(r, 6, '%', { font: { name: 'Tahoma', sz: 10 } });
  };
  const base = `(H${sub}-G${sub})`;
  pRow(sub + 2, 'Test coverage', `IF(${base}=0,0,(D${sub}+E${sub})*100/${base})`, cov.coverage);
  pRow(sub + 3, 'Test successful coverage', `IF(${base}=0,0,D${sub}*100/${base})`, cov.successCoverage);

  return [cover, tc, ts, ...modules.map((m, i) => itModuleSheet(names[i], m))];
}

// ─── Nhập (đọc theo NHÃN) ────────────────────────────────────────

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

function find(sh: RSheet, test: RegExp, maxRow = 60, maxCol = 40): { row: number; col: number } | null {
  for (let r = 1; r <= Math.min(sh.maxRow, maxRow); r++) {
    for (let c = 1; c <= Math.min(sh.maxCol, maxCol); c++) {
      const v = sh.get(r, c);
      if (typeof v === 'string' && !v.startsWith('=') && test.test(norm(v))) return { row: r, col: c };
    }
  }
  return null;
}
/** Giá trị đầu tiên bên phải nhãn (bỏ ô trống do gộp). */
function rightOf(sh: RSheet, at: { row: number; col: number } | null, limit = 20): string {
  if (!at) return '';
  for (let c = at.col + 1; c <= at.col + limit; c++) {
    const t = cellText(sh, at.row, c);
    if (t) return t;
  }
  return '';
}
/** Chữ của ô; công thức không có giá trị tính sẵn ⇒ rỗng (tham chiếu Cover!B4 … không có nghĩa khi đứng riêng). */
function cellText(sh: RSheet, row: number, col: number): string {
  const t = sh.text(row, col);
  return t.startsWith('=') ? '' : t;
}
/** Ngày: ô ngày của Excel, số sê-ri, hoặc chữ dd/mm/yyyy | yyyy-mm-dd. */
function dateOf(sh: RSheet, row: number, col: number): string | null {
  const v = sh.get(row, col);
  if (typeof v === 'number') return v > 20000 && v < 80000 ? fromExcelSerial(v).toISOString().slice(0, 10) : null;
  if (typeof v !== 'string') return null;
  const s = v.trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/.exec(s);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return null;
}
const isoOrNull = (s: string | null) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null);

export interface ParsedCover { projectName: string | null; projectCode: string | null; creator: string | null; issueDate: string | null; version: string | null; changes: ChangeData[] }

function parseCover(sh: RSheet | undefined): ParsedCover {
  const out: ParsedCover = { projectName: null, projectCode: null, creator: null, issueDate: null, version: null, changes: [] };
  if (!sh) return out;
  out.projectName = rightOf(sh, find(sh, /^project name$/)) || null;
  out.projectCode = rightOf(sh, find(sh, /^project code$/)) || null;
  out.creator = rightOf(sh, find(sh, /^creator$/)) || null;
  const iss = find(sh, /^issue date$/);
  if (iss) for (let c = iss.col + 1; c <= iss.col + 6 && !out.issueDate; c++) out.issueDate = dateOf(sh, iss.row, c);
  out.version = rightOf(sh, find(sh, /^version$/)) || null;
  const hdr = find(sh, /^effective date$/, 80);
  if (hdr) {
    const col: Record<string, number> = {};
    for (let c = 1; c <= sh.maxCol; c++) {
      const t = norm(cellText(sh, hdr.row, c));
      if (t === 'effective date') col.date = c;
      else if (t === 'version') col.version = c;
      else if (t === 'change item') col.item = c;
      else if (t.includes('a,d,m') || t === 'a/d/m') col.action = c;
      else if (t === 'change description') col.desc = c;
      else if (t === 'reference') col.ref = c;
    }
    let blank = 0;
    for (let r = hdr.row + 1; r <= sh.maxRow && blank < 3; r++) {
      const date = col.date ? dateOf(sh, r, col.date) : null;
      const desc = col.desc ? cellText(sh, r, col.desc) : '';
      const item = col.item ? cellText(sh, r, col.item) : '';
      if (!date && !desc && !item) { blank++; continue; }
      blank = 0;
      const action = (col.action ? cellText(sh, r, col.action) : 'A').toUpperCase().slice(0, 1);
      out.changes.push({
        effectiveDate: date ?? new Date().toISOString().slice(0, 10),
        version: (col.version ? cellText(sh, r, col.version) : '') || '1.0',
        changeItem: item || null,
        action: (CHANGE_ACTIONS as readonly string[]).includes(action) ? action : 'A',
        description: desc || null,
        reference: (col.ref ? cellText(sh, r, col.ref) : '') || null,
      });
    }
  }
  return out;
}

function sheetByName(sheets: RSheet[], name: string): RSheet | undefined {
  const n = norm(name);
  return sheets.find((s) => s.name === name) ?? sheets.find((s) => norm(s.name) === n);
}

export interface ParsedUnit {
  cover: ParsedCover;
  reviewer: string | null;
  notes: string | null;
  tcPerKloc: number | null;
  environment: string | null;
  functions: UnitFunctionData[];
  warnings: string[];
}

const truthyMark = (v: string) => /^(o|x|✓|✔|v|1|true)$/i.test(v.trim());

function parseUnitFunctionSheet(sh: RSheet, base: Partial<UnitFunctionData>, warnings: string[]): UnitFunctionData | null {
  // Hàng UTCID.
  let utcRow = 0;
  const caseCols: number[] = [];
  for (let r = 1; r <= Math.min(sh.maxRow, 40) && !utcRow; r++) {
    for (let c = 1; c <= sh.maxCol; c++) {
      if (/^utcid\s*\d+/i.test(sh.text(r, c))) { utcRow = r; break; }
    }
  }
  if (!utcRow) { warnings.push(`Sheet "${sh.name}": no UTCID header row — skipped`); return null; }
  for (let c = 1; c <= sh.maxCol; c++) if (/^utcid\s*\d+/i.test(sh.text(utcRow, c))) caseCols.push(c);
  const firstCaseCol = caseCols[0];

  const fn: UnitFunctionData = {
    moduleName: rightOf(sh, find(sh, /^code module$/, 6)) || base.moduleName || 'Module',
    methodName: rightOf(sh, find(sh, /^method( name)?$/, 6), 30) || base.methodName || sh.name,
    sheetName: sh.name.slice(0, 31),
    description: base.description ?? null,
    preCondition: base.preCondition ?? null,
    testRequirement: rightOf(sh, find(sh, /^test requirement$/, 6), 30) || null,
    codeRef: null,
    loc: base.loc ?? null,
    createdBy: rightOf(sh, find(sh, /^created by$/, 6)) || null,
    executedBy: rightOf(sh, find(sh, /^executed by$/, 6), 30) || null,
    rows: [],
    cases: caseCols.map((_, i) => ({ key: `c${i}`, type: 'N' as CaseType, result: null, executedAt: null, defectId: null, note: null })),
    marks: [],
  };
  const locAt = find(sh, /^(lines of code|loc)$/, 6, 40);
  if (locAt && fn.loc === null) { const n = Number(rightOf(sh, locAt)); if (Number.isFinite(n) && n > 0) fn.loc = Math.round(n); }

  let section: UnitSection | 'RESULT' | null = null;
  let group = '';
  let pendingGroup: string | null = null;
  const flush = () => {
    if (pendingGroup && (section === 'COND' || section === 'CONFIRM')) fn.rows.push({ key: `r${fn.rows.length}`, section, groupName: pendingGroup, label: null, value: null });
    pendingGroup = null;
  };
  for (let r = utcRow + 1; r <= sh.maxRow; r++) {
    const a = norm(sh.text(r, 1));
    if (/^condition/.test(a)) { flush(); section = 'COND'; group = ''; }
    else if (/^confirm/.test(a)) { flush(); section = 'CONFIRM'; group = ''; }
    else if (/^result/.test(a)) { flush(); section = 'RESULT'; }
    if (!section) continue;
    const b = cellText(sh, r, 2);
    if (section === 'RESULT') {
      const lb = norm(b || cellText(sh, r, 3) || cellText(sh, r, 4));
      caseCols.forEach((col, i) => {
        const t = cellText(sh, r, col);
        const c = fn.cases[i];
        if (/^type/.test(lb)) { const x = t.toUpperCase().slice(0, 1); if ((CASE_TYPES as readonly string[]).includes(x)) c.type = x as CaseType; }
        else if (/passed|failed|^result|^status/.test(lb)) { const x = t.toUpperCase().slice(0, 1); c.result = x === 'P' ? 'P' : x === 'F' ? 'F' : null; }
        else if (/date/.test(lb)) c.executedAt = isoOrNull(dateOf(sh, r, col));
        else if (/defect|bug/.test(lb)) c.defectId = t ? t.slice(0, 60) : null;
      });
      continue;
    }
    if (b) {
      flush();
      group = b.slice(0, 120);
      pendingGroup = group;
    }
    const label = cellText(sh, r, 3);
    const raw = sh.get(r, 4);
    // Giữ NGUYÊN khoảng trắng của giá trị: ca kiểm "with space" ('admin@gmail.com    ') mất nghĩa nếu cắt.
    const value = raw === null ? '' : typeof raw === 'boolean' ? String(raw)
      : typeof raw === 'string' ? (raw.startsWith('=') || !raw.trim() ? '' : raw) : cellText(sh, r, 4);
    const marked = caseCols.filter((col) => truthyMark(sh.text(r, col)));
    // Cột C/D trống nhưng có dấu ở dòng nhóm (một số nhóm đánh dấu ngay dòng nhóm) ⇒ vẫn là một dòng.
    if (label || value || marked.length) {
      const key = `r${fn.rows.length}`;
      fn.rows.push({ key, section, groupName: group || (section === 'COND' ? 'Precondition' : 'Return'), label: label.slice(0, 200) || null, value: value || null });
      for (const col of marked) fn.marks.push([key, `c${caseCols.indexOf(col)}`]);
      pendingGroup = null;
    }
  }
  flush();
  if (!firstCaseCol) warnings.push(`Sheet "${sh.name}": no test case columns`);
  return fn;
}

export function parseUnitWorkbook(sheets: RSheet[]): ParsedUnit {
  const warnings: string[] = [];
  const cover = parseCover(sheetByName(sheets, 'Cover'));
  const out: ParsedUnit = { cover, reviewer: null, notes: null, tcPerKloc: null, environment: null, functions: [], warnings };
  const stat = sheetByName(sheets, 'Statistics') ?? sheets.find((s) => find(s, /^unit test report$/, 5));
  if (stat) {
    out.reviewer = rightOf(stat, find(stat, /^reviewer\/approver$/)) || null;
    out.notes = rightOf(stat, find(stat, /^notes$/)) || null;
    if (!cover.creator) cover.creator = rightOf(stat, find(stat, /^creator$/)) || null;
  }
  const fl = sheetByName(sheets, 'Functions') ?? sheetByName(sheets, 'FunctionList') ?? sheets.find((s) => find(s, /^method name$/, 30));
  const used = new Set<string>();
  if (fl) {
    const k = Number(rightOf(fl, find(fl, /^normal number of test cases/)));
    if (Number.isFinite(k) && k > 0) out.tcPerKloc = Math.round(k);
    out.environment = rightOf(fl, find(fl, /^test environment/)) || null;
    if (out.environment && /^<list envir/i.test(out.environment)) out.environment = null;
    const hdr = find(fl, /^method name$/, 40);
    if (hdr) {
      const col: Record<string, number> = {};
      for (let c = 1; c <= fl.maxCol; c++) {
        const t = norm(cellText(fl, hdr.row, c));
        if (t === 'module name' || t === 'class name') col.module = c;
        else if (t === 'method name') col.method = c;
        else if (t === 'sheet name') col.sheet = c;
        else if (t === 'description') col.desc = c;
        else if (t === 'pre-condition' || t === 'precondition') col.pre = c;
        else if (t === 'lines of code' || t === 'loc') col.loc = c;
      }
      let module = '';
      let blank = 0;
      for (let r = hdr.row + 1; r <= fl.maxRow && blank < 3; r++) {
        const m = col.module ? cellText(fl, r, col.module) : '';
        if (m) module = m;
        const method = col.method ? cellText(fl, r, col.method) : '';
        const sheetCell = col.sheet ? cellText(fl, r, col.sheet) : '';
        const linkTarget = col.sheet ? fl.links.get(cellRef(r, col.sheet)) : undefined;
        if (!method && !sheetCell) { blank++; if (out.functions.length) break; continue; }
        blank = 0;
        // Dòng tổng kết KLOC của CT Work nằm dưới bảng (sau một dòng trống) — chặn thêm cho chắc.
        if (/^(total lines of code|kloc|required test cases|actual test cases|status)/i.test(method)) break;
        const target = (sheetCell && sheetByName(sheets, sheetCell)) || (linkTarget && sheetByName(sheets, linkTarget)) || (method && sheetByName(sheets, defaultSheetName(method)));
        const locRaw = col.loc ? Number(cellText(fl, r, col.loc)) : NaN;
        const base: Partial<UnitFunctionData> = {
          moduleName: module || 'Module', methodName: method || sheetCell,
          description: (col.desc ? cellText(fl, r, col.desc) : '') || null,
          preCondition: (col.pre ? cellText(fl, r, col.pre) : '') || null,
          loc: Number.isFinite(locRaw) && locRaw > 0 ? Math.round(locRaw) : null,
        };
        if (!target) {
          warnings.push(`Function "${method || sheetCell}": sheet "${sheetCell || linkTarget || '?'}" not found — imported without test cases`);
          out.functions.push({ ...(base as UnitFunctionData), sheetName: sheetCell.slice(0, 31) || null, testRequirement: null, codeRef: null, createdBy: null, executedBy: null, rows: [], cases: [], marks: [] });
          continue;
        }
        used.add(target.name);
        const fn = parseUnitFunctionSheet(target, base, warnings);
        if (fn) {
          // Sheet Functions là nguồn chính cho tên module/hàm; sheet hàm chỉ bổ sung khi Functions trống.
          fn.moduleName = (module || fn.moduleName).slice(0, 120);
          fn.methodName = (method || fn.methodName).slice(0, 120);
          out.functions.push(fn);
        }
      }
    }
  }
  // Sheet ma trận không có trong danh sách Functions vẫn nhập (nhóm hay quên cập nhật danh sách).
  for (const s of sheets) {
    if (used.has(s.name) || ['guideline', 'cover', 'functions', 'functionlist', 'statistics'].includes(norm(s.name))) continue;
    if (!find(s, /^utcid\s*\d+/, 40, 80)) continue;
    const fn = parseUnitFunctionSheet(s, {}, warnings);
    if (fn) { out.functions.push(fn); warnings.push(`Sheet "${s.name}" is not listed on the Functions sheet — imported anyway`); }
  }
  return out;
}

export interface ParsedIntegration {
  cover: ParsedCover;
  reviewer: string | null;
  notes: string | null;
  environment: string | null;
  modules: ItModuleData[];
  warnings: string[];
}

const IT_STATUS_OF = (t: string): ItStatus | null => {
  const s = t.trim().toLowerCase();
  if (!s) return null;
  if (s.startsWith('pass')) return 'Passed';
  if (s.startsWith('fail')) return 'Failed';
  if (s.startsWith('pend') || s === 'untested' || s === 'not run') return 'Pending';
  if (/^n\/?a$/.test(s) || s === 'not applicable') return 'N/A';
  return null;
};

function parseItModuleSheet(sh: RSheet, warnings: string[]): ItModuleData | null {
  const hdr = find(sh, /^test case id$/, 40);
  if (!hdr) return null;
  const col: Record<string, number> = {};
  const rounds: Array<{ status: number; date?: number; tester?: number }> = [];
  for (let c = 1; c <= sh.maxCol; c++) {
    const t = norm(cellText(sh, hdr.row, c));
    if (t === 'test case id') col.id = c;
    else if (t === 'test case description' || t === 'description') col.desc = c;
    else if (t === 'test case procedure' || t === 'procedure' || t === 'test steps') col.proc = c;
    else if (t === 'expected results' || t === 'expected result') col.exp = c;
    else if (t.startsWith('pre-condition') || t.startsWith('precondition')) col.pre = c;
    else if (t === 'evidence') col.ev = c;
    else if (t === 'note' || t === 'notes') col.note = c;
    else if (t === 'actual result' || t === 'actual results') col.actual = c;
    else if (t === 'test data') col.data = c;
    else if (/^round\s*\d+$/.test(t)) rounds.push({ status: c });
    else if (t === 'test date' && rounds.length) rounds[rounds.length - 1].date = c;
    else if (t === 'tester' && rounds.length) rounds[rounds.length - 1].tester = c;
  }
  const name = rightOf(sh, find(sh, /^feature$/, 10)) || sh.name;
  const m: ItModuleData = {
    name: name.slice(0, 120), sheetName: sh.name.slice(0, 31), idPrefix: '',
    description: null, preCondition: null,
    testRequirement: rightOf(sh, find(sh, /^test requirement$/, 10)) || null,
    cases: [],
  };
  let section: string | null = null;
  const txt = (r: number, c?: number) => (c ? cellText(sh, r, c) : '');
  for (let r = hdr.row + 1; r <= sh.maxRow; r++) {
    const idRaw = col.id ? String(sh.get(r, col.id) ?? '') : '';
    const desc = txt(r, col.desc), proc = txt(r, col.proc), exp = txt(r, col.exp);
    if (!desc && !proc && !exp) {
      const a = txt(r, col.id ?? 1);
      if (a && !/^<\s*[a-z]+\s*\d*\s*>$/i.test(a)) section = a.slice(0, 200);
      continue;
    }
    if (!m.idPrefix) {
      const pm = /<\s*([A-Za-z]+)/.exec(idRaw);
      if (pm) m.idPrefix = pm[1].toUpperCase().slice(0, 10);
    }
    const { procedure, testData } = unpackProcedure(proc);
    const { actual, note } = unpackNote(txt(r, col.note));
    m.cases.push({
      section,
      description: desc || proc.split('\n')[0] || `Case ${m.cases.length + 1}`,
      procedure,
      testData: txt(r, col.data) || testData,
      expected: exp || null,
      actual: txt(r, col.actual) || actual,
      preConditions: txt(r, col.pre) || null,
      evidence: txt(r, col.ev) || null,
      note,
      rounds: rounds.slice(0, MAX_ROUNDS).map((rc) => ({
        status: IT_STATUS_OF(txt(r, rc.status)),
        date: rc.date ? isoOrNull(dateOf(sh, r, rc.date)) : null,
        tester: (rc.tester ? txt(r, rc.tester) : '').slice(0, 120) || null,
      })),
    });
  }
  // Bỏ các vòng rỗng ở đuôi cho gọn.
  for (const c of m.cases) while (c.rounds.length && !c.rounds[c.rounds.length - 1].status && !c.rounds[c.rounds.length - 1].date && !c.rounds[c.rounds.length - 1].tester) c.rounds.pop();
  if (!m.idPrefix) m.idPrefix = defaultIdPrefix(m.name);
  if (!m.cases.length) warnings.push(`Sheet "${sh.name}": no test cases found`);
  return m;
}

export function parseIntegrationWorkbook(sheets: RSheet[]): ParsedIntegration {
  const warnings: string[] = [];
  const cover = parseCover(sheetByName(sheets, 'Cover'));
  const out: ParsedIntegration = { cover, reviewer: null, notes: null, environment: null, modules: [], warnings };
  const stat = sheetByName(sheets, 'Test Statistics') ?? sheets.find((s) => find(s, /^integration test report$/, 5));
  if (stat) {
    out.reviewer = rightOf(stat, find(stat, /^reviewer\/approver$/)) || null;
    out.notes = rightOf(stat, find(stat, /^notes$/)) || null;
    if (!cover.creator) cover.creator = rightOf(stat, find(stat, /^creator$/)) || null;
  }
  const list: Array<{ name: string; sheet: string; link?: string; description: string | null; pre: string | null }> = [];
  const tc = sheetByName(sheets, 'Test Cases') ?? sheets.find((s) => find(s, /^test case list$/, 5));
  if (tc) {
    out.environment = rightOf(tc, find(tc, /^test environment/)) || null;
    if (out.environment && /^<list envir/i.test(out.environment)) out.environment = null;
    if (!cover.projectName) cover.projectName = rightOf(tc, find(tc, /^project name$/)) || null;
    const hdr = find(tc, /^sheet name$/, 40);
    if (hdr) {
      const col: Record<string, number> = {};
      for (let c = 1; c <= tc.maxCol; c++) {
        const t = norm(cellText(tc, hdr.row, c));
        if (t === 'function name' || t === 'module name' || t === 'feature') col.name = c;
        else if (t === 'sheet name') col.sheet = c;
        else if (t === 'description') col.desc = c;
        else if (t === 'pre-condition' || t === 'precondition') col.pre = c;
      }
      let blank = 0;
      for (let r = hdr.row + 1; r <= tc.maxRow && blank < 3; r++) {
        const name = col.name ? cellText(tc, r, col.name) : '';
        const sheet = col.sheet ? cellText(tc, r, col.sheet) : '';
        if (!name && !sheet) { blank++; continue; }
        blank = 0;
        list.push({ name: name || sheet, sheet, link: col.sheet ? tc.links.get(cellRef(r, col.sheet)) : undefined, description: (col.desc ? cellText(tc, r, col.desc) : '') || null, pre: (col.pre ? cellText(tc, r, col.pre) : '') || null });
      }
    }
  }
  const skip = new Set(['cover', 'test cases', 'test statistics', 'guideline']);
  const parsed = new Map<string, ItModuleData>();
  for (const s of sheets) {
    if (skip.has(norm(s.name))) continue;
    const m = parseItModuleSheet(s, warnings);
    if (m) parsed.set(s.name, m);
  }
  const used = new Set<string>();
  for (const it of list) {
    const free = (n?: string) => { const sh = n ? sheetByName(sheets, n) : undefined; return sh && parsed.has(sh.name) && !used.has(sh.name) ? sh : undefined; };
    const byFeature = [...parsed.entries()].find(([k, v]) => !used.has(k) && norm(v.name) === norm(it.name))?.[0];
    const target = free(it.sheet) ?? free(it.link) ?? free(it.name) ?? free(byFeature);
    if (!target) { warnings.push(`Test Cases row "${it.name}": sheet "${it.sheet}" not found — skipped`); continue; }
    used.add(target.name);
    const m = parsed.get(target.name)!;
    m.name = it.name.slice(0, 120);
    m.description = it.description;
    m.preCondition = it.pre;
    out.modules.push(m);
  }
  for (const [k, m] of parsed) {
    if (used.has(k)) continue;
    warnings.push(`Sheet "${k}" is not listed on the Test Cases sheet — imported anyway`);
    out.modules.push(m);
  }
  return out;
}

/** Đoán loại tệp: 5.1 có UTCID, 5.2 có "Test Case ID". */
export function detectReport(sheets: RSheet[]): 'unit' | 'integration' | null {
  if (sheets.some((s) => find(s, /^utcid\s*\d+/, 40, 80))) return 'unit';
  if (sheets.some((s) => find(s, /^test case id$/, 40))) return 'integration';
  return null;
}

/** Excel serial helper xuất ra cho test. */
export const _excelSerial = excelSerial;
