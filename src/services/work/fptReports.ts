/**
 * CT Work — báo cáo Excel nộp trường theo MẪU FPT (đợt 3B, 09/10/2026): phần THUẦN (không DB).
 *
 * Mẫu đối chiếu (chỉ tái tạo CẤU TRÚC — tên sheet, tiêu đề cột, danh sách thả xuống; chữ hướng dẫn là lời CT Work):
 *   • A3  WBS + bảng quy đổi độ phức tạp: sheet WBS của SEP490 `Report2_Project Tracking.xlsx`
 *         (Simple ≤7 field/≤3 transaction = 3 man-day · Medium ≤15/≤7 = 5 · Complex = 7).
 *   • A23 Project Tracking:
 *         SEP490      = Scope · WBS · Q&A · TimeLogs · Defects · Issues
 *         SWP391 T1   = Project · Iter1…Iter4 (Template1_Project Tracking.xlsx)
 *         SWP391 T4   = Issues Report (Template4_Issues Report.xlsx, kiểu GitLab)
 *   • A21 Weekly Report SEP490: mỗi tuần một sheet "Week n" — I. Status Report · II. Project Issues ·
 *         III. Next Week Plan · IV. Other Project Matters/Suggestions · V. Personal Grade.
 *   • A29 AI Usage Report SWP391 Template0: 0.Overview · "n. Week n" · Instruction.
 *
 * Phần DB (đọc thẻ/worklog/RAID/provenance, quyền, lưu kỳ báo cáo) ở fptReports.service.ts.
 */

import { colName, safeSheetName, XSheet, type XStyle } from './xlsxStyled.js';

// ─── A3: bảng quy đổi độ phức tạp → effort ───────────────────────

export const COMPLEXITIES = ['Simple', 'Medium', 'Complex'] as const;
export type Complexity = (typeof COMPLEXITIES)[number];
export const WBS_KINDS = ['Screen', 'Function', 'Non-UI'] as const;
export type WbsKind = (typeof WBS_KINDS)[number];
export const WBS_STATUSES = ['Pending', 'Planned', 'Analyzed', 'Coded', 'Integrated', 'Tested', 'Cancelled'] as const;
export type WbsStatus = (typeof WBS_STATUSES)[number];

export interface EstimationLevel {
  name: Complexity;
  /** Trần số trường dữ liệu (null = không giới hạn — mức cao nhất). */
  maxFields: number | null;
  /** Trần số giao dịch (null = không giới hạn). */
  maxTransactions: number | null;
  /** Effort quy đổi (man-day / pds). */
  manDays: number;
}
export interface EstimationMatrix { levels: EstimationLevel[]; hoursPerDay: number }

/** Mặc định = đúng bảng của mẫu SEP490 (WBS!B2:D6 + công thức cột Est. Effort 3/5/7). */
export const DEFAULT_MATRIX: EstimationMatrix = {
  levels: [
    { name: 'Simple', maxFields: 7, maxTransactions: 3, manDays: 3 },
    { name: 'Medium', maxFields: 15, maxTransactions: 7, manDays: 5 },
    { name: 'Complex', maxFields: null, maxTransactions: null, manDays: 7 },
  ],
  hoursPerDay: 8,
};

const finiteOr = (v: unknown, d: number | null) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : d);

/** settings.estimationMatrix (JSON tự do) ⇒ bảng hợp lệ, thiếu mức nào lấy mặc định mức đó. */
export function normalizeMatrix(raw: unknown): EstimationMatrix {
  const r = (raw && typeof raw === 'object' ? raw : {}) as { levels?: unknown; hoursPerDay?: unknown };
  const given = Array.isArray(r.levels) ? (r.levels as Array<Record<string, unknown>>) : [];
  const levels = DEFAULT_MATRIX.levels.map((d) => {
    const g = given.find((x) => x && x.name === d.name);
    if (!g) return { ...d };
    return {
      name: d.name,
      maxFields: g.maxFields === null ? null : finiteOr(g.maxFields, d.maxFields),
      maxTransactions: g.maxTransactions === null ? null : finiteOr(g.maxTransactions, d.maxTransactions),
      manDays: finiteOr(g.manDays, d.manDays) ?? d.manDays,
    };
  });
  const hpd = finiteOr(r.hoursPerDay, 8);
  return { levels, hoursPerDay: hpd && hpd > 0 && hpd <= 24 ? hpd : 8 };
}

/** Phân loại theo tiêu chí mẫu: mức THẤP NHẤT mà cả field lẫn transaction đều không vượt trần. Không có số nào ⇒ null. */
export function classify(fields: number | null | undefined, transactions: number | null | undefined, m: EstimationMatrix): Complexity | null {
  const f = typeof fields === 'number' ? fields : null;
  const t = typeof transactions === 'number' ? transactions : null;
  if (f === null && t === null) return null;
  for (const lv of m.levels) {
    const okF = f === null || lv.maxFields === null || f <= lv.maxFields;
    const okT = t === null || lv.maxTransactions === null || t <= lv.maxTransactions;
    if (okF && okT) return lv.name;
  }
  return m.levels[m.levels.length - 1]?.name ?? null;
}

export function asComplexity(v: unknown): Complexity | null {
  if (typeof v !== 'string') return null;
  const s = v.trim().toLowerCase();
  return (COMPLEXITIES.find((c) => c.toLowerCase() === s) ?? (s === 'low' ? 'Simple' : s === 'high' ? 'Complex' : null)) as Complexity | null;
}

/** "iter1" | "Iteration 1" | "I1" ⇒ "Iteration 1" (chữ của mẫu); tên khác giữ nguyên. */
export function iterationLabel(raw: string | null | undefined): string {
  const s = (raw ?? '').trim();
  const m = /^(?:iter(?:ation)?|i|sprint)\s*[-_ ]?\s*(\d+)$/i.exec(s);
  return m ? `Iteration ${Number(m[1])}` : s;
}

// ─── A3: cây WBS ─────────────────────────────────────────────────

export interface WbsAttrs {
  kind: string | null; complexity: string | null; fields: number | null; transactions: number | null;
  feature: string | null; subFeature: string | null; plannedDays: number | null; note: string | null;
}
export interface WbsSourceIssue {
  id: number; number: number; key: string; title: string; typeKey: string; parentId: number | null; rank: string;
  /** Dòng đầu của mô tả (cột "Function/Screen Description"). */
  description: string;
  category: string; statusName: string; resolution: string | null; assignee: string; iteration: string;
  estimateMin: number | null; spentMin: number;
  /** Trường tuỳ chỉnh "Complexity" (đọc theo tên) — dùng khi chưa khai WBS. */
  fieldComplexity: string | null;
  /** Tiến độ 5 việc con của mẫu Req (SRS, SDS, Coding, Test, Integrate) — '' | 'To do' | 'Doing' | 'Done'. */
  phases: string[];
  wbs: WbsAttrs | null;
  /** UX-C: tầng loại thẻ (epic 1 · thường 0 · sub-task −1) + ngày — cho kéo-thả và Gantt nhỏ theo nhánh. */
  level?: number;
  startDate?: string | null;
  dueDate?: string | null;
}
export interface WbsRow {
  wbs: string; depth: number; issueId: number; number: number; key: string; title: string; typeKey: string; description: string;
  kind: string; feature: string; subFeature: string;
  complexity: Complexity | null; complexitySource: 'set' | 'derived' | 'field' | null;
  fields: number | null; transactions: number | null;
  /** Effort dự kiến CỦA RIÊNG thẻ (man-day) — tổng chỉ cộng cột này nên không đếm trùng cha + con. */
  plannedDays: number | null; plannedSource: 'override' | 'matrix' | 'estimate' | null;
  /** Gồm cả cây con (để xem ở dòng cha). */
  plannedTotal: number; actualDays: number; actualTotal: number;
  iteration: string; status: WbsStatus; statusName: string; assignee: string; note: string; childCount: number;
  /** UX-C: số của thẻ cha trong WBS (null = gốc), tầng loại thẻ, ngày bắt đầu/hạn (YYYY-MM-DD). */
  parentNumber: number | null; level: number; start: string | null; due: string | null;
}
export interface WbsResult {
  rows: WbsRow[];
  totals: {
    plannedDays: number; actualDays: number; functions: number; unestimated: number;
    byIteration: Array<{ iteration: string; functions: number; plannedDays: number; actualDays: number }>;
    byComplexity: Array<{ complexity: Complexity; count: number; plannedDays: number }>;
  };
}

/** 5 việc con của mẫu Req (giống projectTracking.service) — đọc tiến độ từng pha theo tiêu đề. */
export const REQ_PHASES: Array<[label: string, prefix: RegExp]> = [
  ['SRS', /^write srs\b/i], ['SDS', /^write sds\b/i], ['Coding', /^code\b/i], ['Test', /^test cases?\b/i], ['Integrate', /^integrate\b/i],
];
const CATEGORY_TEXT: Record<string, string> = { TODO: 'To do', IN_PROGRESS: 'Doing', DONE: 'Done' };
export function phasesOf(children: Array<{ title: string; category: string }>): string[] {
  return REQ_PHASES.map(([, re]) => {
    const sub = children.find((c) => re.test(c.title.trim()));
    return sub ? CATEGORY_TEXT[sub.category] ?? sub.category : '';
  });
}

/** Loại thẻ KHÔNG vào WBS: lỗi (sheet Defects) và test case (Report 5.x). */
export const WBS_EXCLUDED_TYPES = new Set(['BUG', 'TEST']);
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Trạng thái theo danh sách của mẫu (Pending, Planned, Analyzed, Coded, Integrated, Tested, Cancelled). */
export function wbsStatusOf(i: Pick<WbsSourceIssue, 'category' | 'resolution' | 'phases' | 'iteration'>): WbsStatus {
  if (i.resolution && /won.?t|cancel|duplicate|reject|obsolete/i.test(i.resolution)) return 'Cancelled';
  if (i.category === 'DONE') return 'Tested';
  const done = (k: number) => i.phases[k] === 'Done';
  if (done(3)) return 'Tested';
  if (done(4)) return 'Integrated';
  if (done(2)) return 'Coded';
  if (done(0) || done(1) || i.category === 'IN_PROGRESS') return 'Analyzed';
  return i.iteration ? 'Planned' : 'Pending';
}

export function buildWbs(issues: WbsSourceIssue[], matrix: EstimationMatrix): WbsResult {
  const kept = issues.filter((i) => !WBS_EXCLUDED_TYPES.has(i.typeKey));
  const byId = new Map(kept.map((i) => [i.id, i]));
  const kids = new Map<number | null, WbsSourceIssue[]>();
  for (const i of kept) {
    const p = i.parentId && byId.has(i.parentId) ? i.parentId : null;
    if (!kids.has(p)) kids.set(p, []);
    kids.get(p)!.push(i);
  }
  const order = (a: WbsSourceIssue, b: WbsSourceIssue) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : a.number - b.number);
  for (const list of kids.values()) list.sort(order);
  // Epic đứng trước (đúng thứ tự đọc của WBS: tính năng → chức năng → việc con).
  const roots = (kids.get(null) ?? []).sort((a, b) => Number(b.typeKey === 'EPIC') - Number(a.typeKey === 'EPIC') || order(a, b));
  const manDays = (c: Complexity | null) => (c ? matrix.levels.find((l) => l.name === c)?.manDays ?? null : null);

  const rows: WbsRow[] = [];
  const visit = (i: WbsSourceIssue, num: number[], parentFeature: string, seen: Set<number>): { planned: number; actual: number } => {
    if (seen.has(i.id)) return { planned: 0, actual: 0 }; // phòng vòng cha–con hỏng dữ liệu
    seen.add(i.id);
    const w = i.wbs;
    const set = asComplexity(w?.complexity);
    const derived = set ? null : classify(w?.fields, w?.transactions, matrix);
    const fromField = set || derived ? null : asComplexity(i.fieldComplexity);
    const complexity = set ?? derived ?? fromField;
    let plannedDays: number | null = null;
    let plannedSource: WbsRow['plannedSource'] = null;
    if (typeof w?.plannedDays === 'number') { plannedDays = w.plannedDays; plannedSource = 'override'; }
    else if (complexity) { plannedDays = manDays(complexity); plannedSource = 'matrix'; }
    else if (i.estimateMin) { plannedDays = round2(i.estimateMin / 60 / matrix.hoursPerDay); plannedSource = 'estimate'; }
    const actualDays = round2(i.spentMin / 60 / matrix.hoursPerDay);
    const feature = w?.feature?.trim() || (i.typeKey === 'EPIC' ? i.title : parentFeature);
    const row: WbsRow = {
      wbs: num.length === 1 ? `${num[0]}.0` : num.join('.'), depth: num.length - 1,
      issueId: i.id, number: i.number, key: i.key, title: i.title, typeKey: i.typeKey, description: i.description,
      kind: w?.kind ?? '', feature, subFeature: w?.subFeature ?? '',
      complexity, complexitySource: set ? 'set' : derived ? 'derived' : fromField ? 'field' : null,
      fields: w?.fields ?? null, transactions: w?.transactions ?? null,
      plannedDays, plannedSource, plannedTotal: 0, actualDays, actualTotal: 0,
      iteration: iterationLabel(i.iteration), status: wbsStatusOf(i), statusName: i.statusName, assignee: i.assignee, note: w?.note ?? '',
      childCount: kids.get(i.id)?.length ?? 0,
      parentNumber: i.parentId && byId.has(i.parentId) ? byId.get(i.parentId)!.number : null,
      level: i.level ?? (i.typeKey === 'EPIC' ? 1 : i.typeKey === 'SUBTASK' ? -1 : 0),
      start: i.startDate ?? null, due: i.dueDate ?? null,
    };
    rows.push(row);
    let p = plannedDays ?? 0, a = actualDays;
    (kids.get(i.id) ?? []).forEach((c, k) => {
      const sub = visit(c, [...num, k + 1], feature, seen);
      p += sub.planned; a += sub.actual;
    });
    row.plannedTotal = round2(p);
    row.actualTotal = round2(a);
    return { planned: p, actual: a };
  };
  const seen = new Set<number>();
  roots.forEach((r, k) => visit(r, [k + 1], '', seen));

  const iters = new Map<string, { functions: number; plannedDays: number; actualDays: number }>();
  const cx = new Map<Complexity, { count: number; plannedDays: number }>();
  let planned = 0, actual = 0, functions = 0, unestimated = 0;
  for (const r of rows) {
    planned += r.plannedDays ?? 0;
    actual += r.actualDays;
    if (r.plannedDays !== null) functions++;
    // Việc con (sub-task) cộng effort vào thẻ cha — không tính là "chưa ước lượng".
    else if (!r.childCount && r.typeKey !== 'SUBTASK') unestimated++;
    const it = r.iteration || '(no iteration)';
    const cur = iters.get(it) ?? { functions: 0, plannedDays: 0, actualDays: 0 };
    if (r.plannedDays !== null) cur.functions++;
    cur.plannedDays += r.plannedDays ?? 0;
    cur.actualDays += r.actualDays;
    iters.set(it, cur);
    if (r.complexity) {
      const c = cx.get(r.complexity) ?? { count: 0, plannedDays: 0 };
      c.count++; c.plannedDays += r.plannedDays ?? 0;
      cx.set(r.complexity, c);
    }
  }
  const iterOrder = (a: string, b: string) => (a === '(no iteration)' ? 1 : b === '(no iteration)' ? -1 : a.localeCompare(b, undefined, { numeric: true }));
  return {
    rows,
    totals: {
      plannedDays: round2(planned), actualDays: round2(actual), functions, unestimated,
      byIteration: [...iters.entries()].sort(([a], [b]) => iterOrder(a, b)).map(([iteration, v]) => ({ iteration, functions: v.functions, plannedDays: round2(v.plannedDays), actualDays: round2(v.actualDays) })),
      byComplexity: COMPLEXITIES.filter((c) => cx.has(c)).map((c) => ({ complexity: c, count: cx.get(c)!.count, plannedDays: round2(cx.get(c)!.plannedDays) })),
    },
  };
}

// ─── Kiểu ô dùng chung ───────────────────────────────────────────

const CAL = (sz = 11, b = false): XStyle['font'] => ({ name: 'Calibri', sz, b });
const DATE = 'dd/mm/yyyy';
const dateVal = (iso: string | null | undefined): Date | null => {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};
export const ddmmyyyy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

function headerRow(sh: XSheet, row: number, labels: string[], fill: string, startCol = 1, extra: XStyle = {}) {
  labels.forEach((l, i) => sh.set(row, startCol + i, l, { font: CAL(11, true), fill, border: 'thin', align: { v: 'center', wrap: true }, ...extra }));
}

// ─── A23: SEP490 Report2_Project Tracking ────────────────────────

export const SCOPE_STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'] as const;
export const QA_STATUSES = ['Open', 'Closed', 'Cancelled'] as const;
export const PRIORITIES3 = ['Low', 'Medium', 'High'] as const;
export const TL_ACTIVITIES = ['Training', 'Analyzing', 'Designing', 'Coding', 'Testing', 'Deploying'] as const;
export const TL_TYPES = ['Newly-Create', 'Reviewing', 'Updating'] as const;
export const TL_STATUSES = ['Submitted', 'Approved', 'Rejected'] as const;
export const PRODUCTS = ['Software Package', 'Report1 (Intro)', 'Report2 (Plan)', 'Report3 (SRS)', 'Report4 (SDS)', 'Report5 (Test)', 'Report6 (Guides)', 'Report7 (Final)'] as const;
export const DEFECT_ACTIVITIES = ['Review', 'UT', 'IT', 'ST', 'AT'] as const;
export const DEFECT_STATUSES = ['Pending', 'Assigned', 'Fixing', 'Fixed', 'Closed', 'Cancelled'] as const;
export const ISSUE_STATUSES = ['Open', 'In Progress', 'Closed', 'Cancelled'] as const;

/** "Report 3 …" / "SRS" trong chữ ⇒ sản phẩm theo danh sách của mẫu; còn lại = Software Package. */
export function productOf(text: string): string {
  const t = text.toLowerCase();
  const n = /\breport\s*([1-7])(?:\b|[._])/i.exec(text)?.[1];
  if (n) return PRODUCTS[Number(n)];
  if (/\bsrs\b|requirement spec/.test(t)) return PRODUCTS[3];
  if (/\bsds\b|design spec/.test(t)) return PRODUCTS[4];
  if (/user guide|installation guide|user manual/.test(t)) return PRODUCTS[6];
  if (/project management plan|\bpmp\b/.test(t)) return PRODUCTS[2];
  if (/test (plan|report|case)/.test(t)) return PRODUCTS[5];
  return PRODUCTS[0];
}
/** Hoạt động của dòng TimeLogs theo tiêu đề việc (mẫu Req: Write SRS / Write SDS / Code / Test cases / Integrate). */
export function activityOf(title: string, typeKey: string): string {
  const t = title.toLowerCase();
  if (/train|learn|study|tutorial|research/.test(t)) return 'Training';
  if (/deploy|release|install|ci\/cd|docker|server/.test(t)) return 'Deploying';
  if (typeKey === 'TEST' || /\btest|\bqa\b|verify/.test(t)) return 'Testing';
  if (/\bsds\b|design|diagram|erd|mockup|ui\/ux|figma|architecture/.test(t)) return 'Designing';
  if (/\bsrs\b|requirement|use ?case|analy|user stor|report\s*[13]\b|spec/.test(t) || typeKey === 'REQUIREMENT') return 'Analyzing';
  return 'Coding';
}
export function workTypeOf(title: string): string {
  const t = title.toLowerCase();
  if (/review|check|audit|soát/.test(t)) return 'Reviewing';
  if (/update|fix|revise|refactor|improve|sửa|cập nhật/.test(t)) return 'Updating';
  return 'Newly-Create';
}

export interface ScopeRow { wbs: string; title: string; bold: boolean; estDays: number | null; inCharge: string; deadline: string; status: string; actualDays: number | null; notes: string }
export interface QaRow { date: string | null; question: string; by: string; to: string; priority: string; due: string | null; status: string; notes: string }
export interface TimeLogRow { date: string; reporter: string; task: string; hours: number; activity: string; type: string; product: string; workProduct: string; status: string; updated: string | null; notes: string }
export interface DefectRow { date: string; description: string; activity: string; product: string; productDetails: string; assigner: string; assignee: string; status: string; updated: string | null; notes: string }
export interface IssueLogRow { date: string; issue: string; type: string; priority: string; created: string; owner: string; due: string | null; status: string; notes: string }

export interface Sep490Input {
  matrix: EstimationMatrix;
  scope: ScopeRow[];
  wbs: WbsRow[];
  qa: QaRow[];
  timelogs: TimeLogRow[];
  defects: DefectRow[];
  issues: IssueLogRow[];
}

const SCOPE_FILL = 'FFE8E1';
const LOG_FILL = 'FEE1CC';
const SUM_FILL = 'D9E7FD';
const cellS: XStyle = { font: CAL(), border: 'thin', align: { v: 'top', wrap: true } };
const cellC: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top' } };
const cellD: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top' }, numFmt: DATE };
const cellN: XStyle = { font: CAL(), border: 'thin', align: { h: 'right', v: 'top' }, numFmt: '0.0#' };

/** Sheet nhật ký kiểu mẫu (Q&A/TimeLogs/Defects/Issues): A1 tiêu đề đậm, hàng 2 tiêu đề cột, dữ liệu từ hàng 3. */
function logSheet(name: string, title: string, headers: string[], widths: number[], rows: unknown[][], kinds: Array<'s' | 'c' | 'd' | 'n'>): XSheet {
  const sh = new XSheet(name);
  widths.forEach((w, i) => sh.width(i + 1, w));
  sh.set(1, 1, title, { font: CAL(11, true) });
  headerRow(sh, 2, headers, LOG_FILL);
  rows.forEach((r, ri) => r.forEach((v, ci) => {
    const k = kinds[ci] ?? 's';
    const st = k === 'c' ? cellC : k === 'd' ? cellD : k === 'n' ? cellN : cellS;
    sh.set(3 + ri, ci + 1, (k === 'd' ? dateVal(v as string | null) : v) as never, st);
  }));
  sh.freeze = { col: 1, row: 3 };
  return sh;
}
/** Vùng danh sách thả xuống: dữ liệu + 50 dòng chừa cho người thêm tay trong Excel. */
const dvRange = (col: number, first: number, count: number) => `${colName(col)}${first}:${colName(col)}${first + Math.max(count, 1) + 49}`;

export function buildSep490Sheets(input: Sep490Input): XSheet[] {
  const { matrix } = input;
  // Scope.
  const scope = new XSheet('Scope');
  [7.1, 50.8, 8.6, 14, 9.4, 17.4, 18.1, 42.4].forEach((w, i) => scope.width(i + 1, w));
  headerRow(scope, 1, ['#', 'Work Package', 'Est. Effort\n(pds)', 'In Charge', 'Deadline', 'Status', 'Actual Effort (pds)', 'Notes'], SCOPE_FILL);
  scope.height(1, 30);
  input.scope.forEach((r, i) => {
    const row = 2 + i;
    const b = r.bold ? { font: CAL(11, true) } : {};
    scope.set(row, 1, r.wbs, { ...cellS, ...b });
    scope.set(row, 2, r.title, { ...cellS, ...b });
    scope.set(row, 3, r.estDays, { ...cellN, ...b });
    scope.set(row, 4, r.inCharge, cellS);
    scope.set(row, 5, r.deadline, cellC);
    scope.set(row, 6, r.status, { ...cellC, ...b });
    scope.set(row, 7, r.actualDays, { ...cellN, ...b });
    scope.set(row, 8, r.notes, cellS);
  });
  scope.set(2 + input.scope.length, 1, '<<Insert new row above this row>>', { font: { name: 'Calibri', sz: 11, i: true, color: '808080' } });
  scope.listValidation(`F2:F${input.scope.length + 51}`, [...SCOPE_STATUSES]);
  scope.freeze = { col: 1, row: 2 };

  // WBS: hàng 1 tiêu đề, B2:D… bảng tiêu chí, H2:J… tổng theo iteration, dữ liệu sau đó (mẫu: hàng 7).
  const wbs = new XSheet('WBS');
  [6, 33.5, 11.4, 15.1, 10.5, 65, 10.2, 8, 15.4, 10.5, 24, 11, 10].forEach((w, i) => wbs.width(i + 1, w));
  const head = ['#', 'Function/Screen', 'Type', 'Feature', 'Sub Feature', 'Function/Screen Description', 'Level*', 'Est. Effort', 'Planned', 'Status', 'Notes', 'Actual Effort', 'Issue'];
  headerRow(wbs, 1, head, 'FFFFFF', 1, { font: CAL(11, true) });
  const iters = [...new Set(input.wbs.map((r) => r.iteration).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!iters.length) iters.push('Iteration 1', 'Iteration 2', 'Iteration 3');
  const crit = (lv: EstimationLevel, prev?: EstimationLevel) => [
    lv.maxFields === null ? `>${prev?.maxFields ?? 0} fields` : `<=${lv.maxFields} fields`,
    lv.maxTransactions === null ? `> ${prev?.maxTransactions ?? 0} transactions` : `<= ${lv.maxTransactions} transactions`,
  ];
  matrix.levels.forEach((lv, i) => {
    const [f, t] = crit(lv, matrix.levels[i - 1]);
    wbs.set(2 + i, 2, lv.name, { font: CAL(11, true) });
    wbs.set(2 + i, 3, f, { font: CAL() });
    wbs.set(2 + i, 4, t, { font: CAL() });
    wbs.set(2 + i, 5, `${lv.manDays} pds`, { font: CAL() });
  });
  const sumHead = 2;
  const sumStyle: XStyle = { font: CAL(11, true), fill: SUM_FILL, border: 'thin' };
  wbs.set(sumHead, 8, 'Planned', sumStyle).set(sumHead, 9, 'Functions', sumStyle).set(sumHead, 10, 'Total Effort', sumStyle);
  const dataStart = Math.max(7, sumHead + iters.length + 3);
  const dataEnd = dataStart + Math.max(input.wbs.length, 1) + 99;
  const I = `I${dataStart}:I${dataEnd}`, H = `H${dataStart}:H${dataEnd}`;
  iters.forEach((it, k) => {
    const r = sumHead + 1 + k;
    const rows = input.wbs.filter((x) => x.iteration === it && x.plannedDays !== null);
    wbs.set(r, 8, it, { font: CAL(), border: 'thin' });
    wbs.set(r, 9, { f: `COUNTIF(${I},H${r})`, v: input.wbs.filter((x) => x.iteration === it).length }, { ...cellC });
    wbs.set(r, 10, { f: `SUMIF(${I},H${r},${H})`, v: round2(rows.reduce((s, x) => s + (x.plannedDays ?? 0), 0)) }, cellN);
  });
  const gt = sumHead + 1 + iters.length;
  wbs.set(gt, 8, 'Grand Total', sumStyle);
  wbs.set(gt, 9, { f: `SUM(I${sumHead + 1}:I${gt - 1})`, v: input.wbs.filter((x) => iters.includes(x.iteration)).length }, { ...sumStyle, align: { h: 'center' } });
  wbs.set(gt, 10, { f: `SUM(J${sumHead + 1}:J${gt - 1})`, v: round2(input.wbs.filter((x) => iters.includes(x.iteration)).reduce((s, x) => s + (x.plannedDays ?? 0), 0)) }, { ...sumStyle, numFmt: '0.0#' });
  const lv = (n: Complexity) => matrix.levels.find((l) => l.name === n)?.manDays ?? 0;
  input.wbs.forEach((x, i) => {
    const r = dataStart + i;
    const b = x.depth === 0 ? { font: CAL(11, true) } : {};
    wbs.set(r, 1, x.wbs, { ...cellS, ...b });
    wbs.set(r, 2, `${'  '.repeat(x.depth)}${x.title}`, { ...cellS, ...b });
    wbs.set(r, 3, x.kind || null, cellC);
    wbs.set(r, 4, x.feature || null, cellS);
    wbs.set(r, 5, x.subFeature || null, cellS);
    wbs.set(r, 6, x.description || null, cellS);
    wbs.set(r, 7, x.complexity, cellC);
    // Công thức của mẫu khi effort theo bảng quy đổi; ghi đè/ước lượng giờ ⇒ số cứng.
    wbs.set(r, 8, x.plannedSource === 'matrix'
      ? { f: `IF(G${r}="Complex",${lv('Complex')},IF(G${r}="Medium",${lv('Medium')},IF(G${r}="Simple",${lv('Simple')},0)))`, v: x.plannedDays }
      : x.plannedDays, cellN);
    wbs.set(r, 9, x.iteration || null, cellC);
    wbs.set(r, 10, x.status, cellC);
    wbs.set(r, 11, [x.assignee, x.note].filter(Boolean).join(' — '), cellS);
    wbs.set(r, 12, x.actualDays || null, cellN);
    wbs.set(r, 13, x.key, cellC);
  });
  wbs.listValidation(`G${dataStart}:G${dataEnd}`, [...COMPLEXITIES]);
  wbs.listValidation(`J${dataStart}:J${dataEnd}`, [...WBS_STATUSES]);
  wbs.listValidation(`I${dataStart}:I${dataEnd}`, iters.slice(0, 12));
  wbs.listValidation(`C${dataStart}:C${dataEnd}`, [...WBS_KINDS]);
  wbs.freeze = { col: 1, row: 2 };

  const qa = logSheet('Q&A', 'Project Q&As',
    ['Date', 'Question', 'By', 'To', 'Priority', 'Due Date', 'Status', 'Notes (answers or any other notes)'],
    [11, 50, 12, 12, 9.6, 11, 14.6, 55.1],
    input.qa.map((q) => [q.date, q.question, q.by, q.to, q.priority, q.due, q.status, q.notes]), ['d', 's', 's', 's', 'c', 'd', 'c', 's']);
  qa.listValidation(dvRange(7, 3, input.qa.length), [...QA_STATUSES]);
  qa.listValidation(dvRange(5, 3, input.qa.length), [...PRIORITIES3]);

  const tl = logSheet('TimeLogs', 'Project Timesheets',
    ['Date', 'Reporter', 'Task', '# hours', 'Activity', 'Type', 'Product', 'Work Product', 'Status', 'Updated', 'Notes'],
    [11, 14, 37.8, 7.5, 11, 13, 17, 33.6, 11, 11, 46.4],
    input.timelogs.map((t) => [t.date, t.reporter, t.task, t.hours, t.activity, t.type, t.product, t.workProduct, t.status, t.updated, t.notes]),
    ['d', 's', 's', 'n', 'c', 'c', 's', 's', 'c', 'd', 's']);
  tl.listValidation(dvRange(5, 3, input.timelogs.length), [...TL_ACTIVITIES]);
  tl.listValidation(dvRange(6, 3, input.timelogs.length), [...TL_TYPES]);
  tl.listValidation(dvRange(7, 3, input.timelogs.length), [...PRODUCTS]);
  tl.listValidation(dvRange(9, 3, input.timelogs.length), [...TL_STATUSES]);

  const df = logSheet('Defects', 'Project Defects',
    ['Date', 'Defect Description', 'Activity', 'Product', 'Product Details', 'Assigner', 'Assignee', 'Status', 'Updated', 'Notes'],
    [11, 52.5, 10.5, 17, 20.5, 14, 14, 10, 11, 46.4],
    input.defects.map((d) => [d.date, d.description, d.activity, d.product, d.productDetails, d.assigner, d.assignee, d.status, d.updated, d.notes]),
    ['d', 's', 'c', 's', 's', 's', 's', 'c', 'd', 's']);
  df.listValidation(dvRange(3, 3, input.defects.length), [...DEFECT_ACTIVITIES]);
  df.listValidation(dvRange(4, 3, input.defects.length), [...PRODUCTS]);
  df.listValidation(dvRange(8, 3, input.defects.length), [...DEFECT_STATUSES]);

  const is = logSheet('Issues', 'Project Issues',
    ['Date', 'Issue', 'Type', 'Priority', 'Created', 'Owner', 'Due Date', 'Status', 'Notes'],
    [11, 40, 12, 11, 14, 14, 12.5, 11.8, 48.9],
    input.issues.map((x) => [x.date, x.issue, x.type, x.priority, x.created, x.owner, x.due, x.status, x.notes]),
    ['d', 's', 'c', 'c', 's', 's', 'd', 'c', 's']);
  is.listValidation(dvRange(8, 3, input.issues.length), [...ISSUE_STATUSES]);
  is.listValidation(dvRange(4, 3, input.issues.length), [...PRIORITIES3]);

  return [scope, wbs, qa, tl, df, is];
}

// ─── A23: SWP391 Template1 (Project + Iter1…Iter4) ───────────────

export interface T1Row { screen: string; feature: string; actor: string; description: string; inCharge: string; status: string; actual: string; updated: string; details: string; iteration: string; srs: string; sds: string; notes: string }
const T1_HEAD_FILL = 'B4C6E7';
const T1_PHASE_FILL = 'F7CAAC';
const arial = (b = false): XStyle['font'] => ({ name: 'Arial', sz: 10, b });

/** Tên iteration ⇒ số thứ tự Iter n (theo "iter3"/"Iteration 3"; tên khác xếp theo thứ tự xuất hiện). */
export function iterIndex(names: string[]): Map<string, number> {
  const out = new Map<string, number>();
  const named = names.filter(Boolean);
  const used = new Set<number>();
  for (const n of named) {
    const m = /(\d+)\s*$/.exec(n);
    if (m && /iter|sprint|^i\d/i.test(n) && !used.has(Number(m[1]))) { out.set(n, Number(m[1])); used.add(Number(m[1])); }
  }
  let k = 1;
  for (const n of named) {
    if (out.has(n)) continue;
    while (used.has(k)) k++;
    out.set(n, k); used.add(k);
  }
  return out;
}

export function buildTemplate1Sheets(rows: T1Row[]): XSheet[] {
  const project = new XSheet('Project');
  [4, 26, 16, 14, 50.7, 14, 9, 8, 9, 45.5].forEach((w, i) => project.width(i + 1, w));
  project.set(1, 1, 'Total Project Tracking', { font: arial(true) });
  project.set(2, 1, 'Information in the columns A-E are filled in the project initiation; columns F-J to be filled by the end of each development iteration', { font: { name: 'Arial', sz: 10, i: true } });
  ['#', 'Screen/Function', 'Feature', 'Actor', 'Screen/Function Description', 'In Charge', 'Status', 'Actual', 'Updated', 'Update Details']
    .forEach((h, i) => project.set(3, i + 1, h, { font: arial(true), fill: T1_HEAD_FILL, border: 'thin', align: { v: 'center', wrap: true } }));
  const c: XStyle = { font: arial(), border: 'thin', align: { v: 'top', wrap: true } };
  rows.forEach((r, i) => {
    const row = 4 + i;
    project.set(row, 1, { f: 'ROW()-3', v: i + 1 }, { ...c, align: { h: 'center', v: 'top' } });
    [r.screen, r.feature, r.actor, r.description, r.inCharge, r.status, r.actual, r.updated, r.details].forEach((v, j) => project.set(row, 2 + j, v || null, c));
  });
  const iterNames = [...new Set(rows.map((r) => r.iteration).filter(Boolean))];
  const idx = iterIndex(iterNames);
  const n = Math.max(4, ...[...idx.values()]);
  const iterList = Array.from({ length: n }, (_, i) => `iter${i + 1}`);
  project.listValidation(`G4:G${rows.length + 53}`, ['To Do', 'Doing', 'Done', 'Updated']);
  project.listValidation(`H4:H${rows.length + 53}`, iterList);
  project.listValidation(`I4:I${rows.length + 53}`, ['none', ...iterList.slice(1)]);
  project.freeze = { col: 1, row: 4 };

  const sheets = [project];
  for (let k = 1; k <= n; k++) {
    const sh = new XSheet(`Iter${k}`);
    [3.3, 26, 16, 38.5, 14, 10.3, 7, 7, 49.7].forEach((w, i) => sh.width(i + 1, w));
    sh.set(1, 1, `Iteration Tracking - Iteration ${k}`, { font: arial(true) });
    sh.set(2, 1, 'Information in the columns A-F must be provided as the planned scope for the iteration', { font: { name: 'Arial', sz: 10, i: true } });
    sh.set(3, 1, 'Columns B-D are copied from the sheet Project', { font: { name: 'Arial', sz: 10, i: true } });
    sh.set(4, 1, 'Columns E-I are updated/filled by the end of the iteration', { font: { name: 'Arial', sz: 10, i: true } });
    ['#', 'Screen / Function', 'Feature', 'Screen/Function Description', 'In Charge', 'Status', 'SRS', 'SDS', 'Notes'].forEach((h, i) =>
      sh.set(5, i + 1, h, { font: arial(true), fill: h === 'SRS' || h === 'SDS' ? T1_PHASE_FILL : T1_HEAD_FILL, border: 'thin', align: { v: 'center', wrap: true } }));
    const list = rows.filter((r) => r.iteration && idx.get(r.iteration) === k);
    list.forEach((r, i) => {
      const row = 6 + i;
      sh.set(row, 1, { f: 'ROW()-5', v: i + 1 }, { ...c, align: { h: 'center', v: 'top' } });
      [r.screen, r.feature, r.description, r.inCharge, r.status, r.srs, r.sds, r.notes].forEach((v, j) => sh.set(row, 2 + j, v || null, c));
    });
    sh.listValidation(`F6:F${list.length + 55}`, ['To Do', 'Doing', 'Done']);
    sh.listValidation(`G6:H${list.length + 55}`, ['Pending', 'Doing', 'Done']);
    sh.freeze = { col: 1, row: 6 };
    sheets.push(sh);
  }
  return sheets;
}

// ─── A23: SWP391 Template4 Issues Report (kiểu GitLab) ───────────

export interface T4Row { title: string; description: string; id: number; url: string; state: 'Open' | 'Closed'; assignee: string; createdAt: Date; dueDate: string | null; milestone: string; labels: string; functions: string }

export function buildTemplate4Sheet(rows: T4Row[]): XSheet {
  const sh = new XSheet('Issues Report');
  [40, 45, 8.3, 39.5, 10.8, 14, 18, 12, 12, 22, 22].forEach((w, i) => sh.width(i + 1, w));
  ['Title', 'Description', 'Issue ID', 'URL', 'State', 'Assignee', 'Created At', 'Due Date', 'Milestone', 'Labels', 'Functions/Screens']
    .forEach((h, i) => sh.set(1, i + 1, h, { font: { name: 'Helvetica Neue', sz: 10, b: true }, fill: 'DDEBF7', border: 'thin' }));
  const c: XStyle = { font: { name: 'Helvetica Neue', sz: 10 }, border: 'thin', align: { v: 'top', wrap: true } };
  rows.forEach((r, i) => {
    const row = 2 + i;
    sh.set(row, 1, r.title, c);
    sh.set(row, 2, r.description || null, c);
    sh.set(row, 3, r.id, { ...c, align: { h: 'center', v: 'top' } });
    sh.set(row, 4, r.url, { ...c, font: { name: 'Helvetica Neue', sz: 10, u: true, color: '0563C1' } });
    sh.set(row, 5, r.state, c);
    sh.set(row, 6, r.assignee || null, c);
    sh.set(row, 7, r.createdAt, { ...c, numFmt: 'yyyy-mm-dd hh:mm:ss' });
    sh.set(row, 8, dateVal(r.dueDate), { ...c, numFmt: 'yyyy-mm-dd' });
    sh.set(row, 9, r.milestone || null, c);
    sh.set(row, 10, r.labels || null, c);
    sh.set(row, 11, r.functions || null, c);
  });
  sh.freeze = { col: 1, row: 2 };
  return sh;
}

// ─── A21: Weekly Report SEP490 ───────────────────────────────────

export const WEEKLY_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export interface WeeklyData {
  status: Array<{ task: string; inCharge: string; status: string; notes: string }>;
  issues: Array<{ issue: string; owner: string; status: string; notes: string }>;
  plan: Array<{ task: string; inCharge: string; deadline: string; notes: string }>;
  matters: Array<{ matter: string; raisedBy: string; date: string; notes: string }>;
  grades: Array<{ name: string; grade: number | null }>;
}
export const emptyWeekly = (): WeeklyData => ({ status: [], issues: [], plan: [], matters: [], grades: [] });

/** Thứ Hai (YYYY-MM-DD) của tuần chứa ngày `day`. */
export function mondayOf(day: string): string {
  const d = new Date(`${day.slice(0, 10)}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - dow * 86_400_000).toISOString().slice(0, 10);
}
/** Số tuần học kỳ (1-based) của tuần bắt đầu `weekStart` so với tuần 1 — null khi chưa khai tuần 1. */
export function weekNumber(weekStart: string, week1Start: string | null | undefined): number | null {
  if (!week1Start) return null;
  const diff = Math.round((Date.parse(`${mondayOf(weekStart)}T00:00:00Z`) - Date.parse(`${mondayOf(week1Start)}T00:00:00Z`)) / (7 * 86_400_000));
  return diff + 1;
}

const WK_FILL = 'DAEEF3';
export function buildWeeklySheets(group: string, weeks: Array<{ weekStart: string; weekNo: number | null; data: WeeklyData }>): XSheet[] {
  const taken = new Set<string>();
  return weeks.map((w) => {
    const name = safeSheetName(w.weekNo ? `Week ${w.weekNo}` : `Week ${w.weekStart}`, taken, 'Week');
    const sh = new XSheet(name);
    [6.4, 59.6, 14, 14.3, 57.4].forEach((x, i) => sh.width(i + 1, x));
    const band = (r: number, text: string, bold = true) => {
      sh.set(r, 1, text, { font: CAL(11, bold), fill: WK_FILL });
      for (let c = 2; c <= 5; c++) sh.style(r, c, { fill: WK_FILL });
    };
    band(1, 'WEEKLY REPORT');
    sh.set(2, 1, 'Group', { font: CAL(), fill: WK_FILL });
    sh.set(2, 2, group || null, { font: CAL(), fill: WK_FILL });
    sh.set(3, 1, 'Week', { font: CAL(), fill: WK_FILL });
    const end = new Date(Date.parse(`${w.weekStart}T00:00:00Z`) + 6 * 86_400_000).toISOString().slice(0, 10);
    sh.set(3, 2, `${ddmmyyyy(w.weekStart)}-${ddmmyyyy(end)}`, { font: CAL(), fill: WK_FILL });
    for (let c = 3; c <= 5; c++) { sh.style(2, c, { fill: WK_FILL }); sh.style(3, c, { fill: WK_FILL }); }

    let r = 4;
    const section = <T,>(title: string, heads: string[], items: T[], cells: (x: T) => unknown[], minRows: number, statusCol?: boolean) => {
      band(r, title);
      r++;
      heads.forEach((h, i) => sh.set(r, i + 1, h, { font: CAL(11, true), fill: WK_FILL, border: 'thin' }));
      r++;
      const first = r;
      const n = Math.max(items.length, minRows);
      for (let i = 0; i < n; i++) {
        const vals = items[i] ? cells(items[i]) : [];
        sh.set(r, 1, items[i] ? i + 1 : null, { ...cellC });
        for (let c = 0; c < heads.length - 1; c++) sh.set(r, c + 2, (vals[c] ?? null) as never, vals[c] instanceof Date ? cellD : c === 2 ? cellC : cellS);
        r++;
      }
      if (statusCol) sh.listValidation(`D${first}:D${r - 1}`, [...WEEKLY_STATUSES]);
      r++; // dòng trống như mẫu
    };
    section('I. Status Report', ['#', 'Project Task', 'In-charge', 'Status', 'Notes (Work Item in Details)'], w.data.status, (x) => [x.task, x.inCharge, x.status, x.notes], 3, true);
    section('II. Project Issues', ['#', 'Project Issue', 'Owner', 'Status', 'Notes (Solution, Suggestion, etc.)'], w.data.issues, (x) => [x.issue, x.owner, x.status, x.notes], 2, true);
    section('III. Next Week Plan', ['#', 'Project Task', 'In-charge', 'Deadline', 'Notes (Task Details, etc.)'], w.data.plan, (x) => [x.task, x.inCharge, dateVal(x.deadline) ?? x.deadline, x.notes], 3);
    section('IV. Other Project Matters/Suggestions', ['#', 'Project Matter/Suggestions', 'Raised By', 'Date', 'Notes'], w.data.matters, (x) => [x.matter, x.raisedBy, x.date ? ddmmyyyy(x.date) : '', x.notes], 3);
    band(r, 'V. Personal Grade');
    r++;
    ['#', 'Name', 'Grade'].forEach((h, i) => sh.set(r, i + 1, h, { font: CAL(11, true), fill: WK_FILL, border: 'thin' }));
    r++;
    w.data.grades.forEach((g, i) => {
      sh.set(r, 1, i + 1, cellC);
      sh.set(r, 2, g.name, cellS);
      sh.set(r, 3, g.grade, cellC);
      r++;
    });
    return sh;
  });
}

// ─── A29: AI Usage Report SWP391 Template0 ───────────────────────

export const SDLC_PHASES = ['Requirement', 'Design', 'Implementation', 'Testing', 'Deployment', 'Maintenance', 'Project Management', 'Documentation'] as const;
export function phaseOf(title: string, typeKey: string): string {
  const t = title.toLowerCase();
  if (typeKey === 'TEST' || /\btest|\bqa\b/.test(t)) return 'Testing';
  if (/deploy|release|docker|ci\/cd|server/.test(t)) return 'Deployment';
  if (/\bsds\b|design|diagram|erd|mockup|architecture|class diagram/.test(t)) return 'Design';
  if (typeKey === 'REQUIREMENT' || /\bsrs\b|requirement|use ?case|user stor|spec/.test(t)) return 'Requirement';
  if (/report|plan|meeting|minutes|guide|document/.test(t)) return 'Documentation';
  return 'Implementation';
}

export interface AiUsageDocData {
  subjectCode: string | null; subjectName: string | null; classCode: string | null; semester: string | null;
  lecturer: string | null; groupCode: string | null; projectTitle: string | null;
  students: Array<{ code: string; name: string; role: string; aiTools: string }>;
}
export interface AiUsageRow { usedAt: string; phase: string; task: string; tool: string; output: string | null; validation: string | null; evidence: string | null; measure: string | null; value: number | null; risks: string | null }

const YELLOW = 'FFFF00';
const AI_HEAD = ['No.', 'SDLC Phase', 'Task / Activity', 'AI Tool Used', 'AI Output', 'Student’s Validation / Modification', 'Evidence / Link', 'Quantitative Measure', 'Value Added (1-5)', 'Risks / Limitations Observed'];
const AI_INSTRUCTION: Array<[string, string]> = [
  ['No.', 'Running number of the entry within the week (1, 2, 3…).'],
  ['SDLC Phase', 'The project phase the AI was used in: Requirement, Design, Implementation, Testing, Deployment, Maintenance, Project Management or Documentation.'],
  ['Task / Activity', 'What you used the AI for, as precisely as possible (e.g. "Draft use case UC-05 Checkout", "Write unit tests for CartService").'],
  ['AI Tool Used', 'The tool or model (e.g. ChatGPT, GitHub Copilot, Claude, Gemini, CT Work AI assistant).'],
  ['AI Output', 'A short summary of what the AI produced — not the full text.'],
  ['Student’s Validation / Modification', 'How you checked the output and what you changed, kept or rejected. This column matters most: it shows your own work.'],
  ['Evidence / Link', 'A link to proof: chat export, screenshot folder, commit, pull request or CT Work issue.'],
  ['Quantitative Measure', 'Numbers that show the contribution (e.g. "8 of 12 test cases kept", "3 classes generated, 1 rewritten").'],
  ['Value Added (1-5)', 'Your honest rating of how useful the AI was: 1 = not useful, 5 = very useful.'],
  ['Risks / Limitations Observed', 'Mistakes, made-up facts, security or licence concerns, or anything you had to correct.'],
  ['', ''],
  ['Generated by CT Work', 'Rows marked as auto-collected come from CT Work provenance (AI-assisted issues, AI agent runs, AI assistant conversations). Review and complete the validation, measure and value columns before you submit.'],
];

export function buildAiUsageSheets(doc: AiUsageDocData, weeks: Array<{ weekNo: number | null; label: string; rows: AiUsageRow[] }>): XSheet[] {
  const ov = new XSheet('0.Overview');
  [21.3, 32.9, 30.2, 18, 24].forEach((w, i) => ov.width(i + 1, w));
  ov.set(1, 1, 'SWP391- Project AI Usage Report ', { font: CAL(14, true), fill: YELLOW, align: { h: 'center' } }).merge(1, 1, 1, 5, { fill: YELLOW });
  const info: Array<[string, string | null]> = [
    ['Subject Code', doc.subjectCode], ['Subject Name', doc.subjectName], ['Class Code', doc.classCode], ['Semester', doc.semester],
    ['Lecturer Name', doc.lecturer], ['Group Code', doc.groupCode], [' Project Title', doc.projectTitle],
  ];
  info.forEach(([l, v], i) => {
    ov.set(2 + i, 1, l, { font: CAL(11, true), border: 'thin' });
    ov.set(2 + i, 2, v, { font: CAL(), border: 'thin' }).merge(2 + i, 2, 2 + i, 5, { border: 'thin' });
  });
  ov.set(10, 1, 'List of Student ', { font: CAL(11, true), fill: YELLOW, align: { h: 'center' } }).merge(10, 1, 10, 5, { fill: YELLOW });
  ['No', 'StudentCode', 'StudentName', 'Role In Group', 'AI Tool Usaged'].forEach((h, i) => ov.set(11, i + 1, h, { font: CAL(11, true), border: 'thin' }));
  const n = Math.max(doc.students.length, 5);
  for (let i = 0; i < n; i++) {
    const s = doc.students[i];
    ov.set(12 + i, 1, i + 1, cellC);
    [s?.code, s?.name, s?.role, s?.aiTools].forEach((v, j) => ov.set(12 + i, 2 + j, v || null, cellS));
  }

  const taken = new Set(['0.overview', 'instruction']);
  const out: XSheet[] = [ov];
  const list = weeks.length ? weeks : [{ weekNo: 1, label: 'Week 1', rows: [] }];
  list.forEach((w, k) => {
    const sh = new XSheet(safeSheetName(`${k + 1}. ${w.label}`, taken, `${k + 1}. Week`));
    [6, 18.9, 30, 16, 28, 32, 26, 20, 11, 28].forEach((x, i) => sh.width(i + 1, x));
    AI_HEAD.forEach((h, i) => sh.set(1, i + 1, h, { font: CAL(11, true), fill: YELLOW, border: 'thin', align: { v: 'center', wrap: true } }));
    sh.height(1, 32);
    w.rows.forEach((r, i) => {
      const row = 2 + i;
      [i + 1, r.phase, r.task, r.tool, r.output, r.validation, r.evidence, r.measure, r.value, r.risks].forEach((v, j) =>
        sh.set(row, j + 1, (v ?? null) as never, j === 0 || j === 8 ? cellC : cellS));
    });
    sh.listValidation(`B2:B${w.rows.length + 51}`, [...SDLC_PHASES]);
    sh.listValidation(`I2:I${w.rows.length + 51}`, ['1', '2', '3', '4', '5']);
    sh.freeze = { col: 1, row: 2 };
    out.push(sh);
  });

  const ins = new XSheet('Instruction ');
  ins.width(1, 27.1).width(2, 93);
  ins.set(1, 1, 'Column', { font: CAL(11, true), fill: YELLOW, border: 'thin' });
  ins.set(1, 2, 'Description & How to Fill', { font: CAL(11, true), fill: YELLOW, border: 'thin' });
  AI_INSTRUCTION.forEach(([a, b], i) => { ins.set(2 + i, 1, a, { ...cellS, font: CAL(11, !!a && i >= AI_INSTRUCTION.length - 1) }); ins.set(2 + i, 2, b, cellS); });
  out.push(ins);
  return out;
}
