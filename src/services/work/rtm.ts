/**
 * CT Work — CTW đợt 4 (09/10/2026): MA TRẬN TRUY VẾT YÊU CẦU (RTM, A19) — phần THUẦN (không DB, test ở ctw4.test.ts).
 *
 * Một dòng = một yêu cầu: Use Case (UC-nn) hoặc thẻ REQUIREMENT/STORY chưa có UC nào. Chuỗi truy vết đủ như hướng dẫn
 * `scripts/labflow-seed/out-huong-dan/11-Truy-vet-yeu-cau-RTM.md` (cột Req ID · Requirement · Feature · Related BR ·
 * SRS UC § · Screen · SDS § · Class.method · Unit Test · Integration Test · System Test · Iteration · Status · Notes) cộng
 * phần CT Work biết thêm: commit/PR (WorkDevActivity), test case Xray + lần chạy gần nhất, Bug (mở/đóng, Severity).
 *
 * Chỗ hở (gap) — ô trống mà theo trạng thái lẽ ra phải có:
 *   UC_INCOMPLETE  đặc tả UC thiếu ô bắt buộc            NO_ISSUE   UC chưa gắn thẻ yêu cầu (không truy được xuống việc)
 *   NO_SRS         không thấy mục SRS nào                NO_SDS     không thấy mục SDS (thiết kế) nào
 *   NO_CODE        chưa có commit/PR                     NO_TEST    không có test nào (Xray / 5.1 / 5.2 / 5.3)
 *   NOT_RUN        có test nhưng chưa chạy lần nào        FAILING    test gần nhất trượt
 *   OPEN_BUGS      còn Bug chưa đóng
 * "Status" suy như hướng dẫn RTM: Planned → Analyzed (đặc tả đủ) → Designed (có SDS) → Coded (có commit/PR hoặc thẻ xong)
 * → Tested (có test và mọi test đã chạy đều đạt).
 */

import { XSheet, type XStyle } from './xlsxStyled.js';

export const GAP_CODES = ['UC_INCOMPLETE', 'NO_ISSUE', 'NO_SRS', 'NO_SDS', 'NO_CODE', 'NO_TEST', 'NOT_RUN', 'FAILING', 'OPEN_BUGS', 'NO_SEQUENCE'] as const;
export type GapCode = (typeof GAP_CODES)[number];
export const GAP_LABEL: Record<GapCode, string> = {
  UC_INCOMPLETE: 'UC spec incomplete', NO_ISSUE: 'No linked requirement issue', NO_SRS: 'No SRS section', NO_SDS: 'No SDS section',
  NO_CODE: 'No commit / PR', NO_TEST: 'No test', NOT_RUN: 'Tests not run', FAILING: 'Tests failing', OPEN_BUGS: 'Open bugs',
  // CTW Diagram (10/10/2026): UC chưa có sequence diagram nào (DRAFT/APPROVED) trong Diagram Studio.
  NO_SEQUENCE: 'No sequence diagram',
};
export const RTM_STATUSES = ['Planned', 'Analyzed', 'Designed', 'Coded', 'Tested'] as const;

export interface TestSet { name: string; ref?: string; cases: number; passed: number; failed: number; notRun: number }
export interface RtmRow {
  reqId: string;
  kind: 'UC' | 'REQ';
  ucNumber: number | null;
  issueNumber: number | null;
  issueKey: string | null;
  requirement: string;
  feature: string;
  rules: string[];
  /** "2.1.3" (mục sinh từ dữ liệu) và/hoặc "Doc 5 › 1.3.2 Use Cases (UC)" (trang SRS nhắc tới yêu cầu). */
  srs: string[];
  screens: string[];
  sds: string[];
  code: { commits: number; prs: number; branches: number; latest: { title: string; url: string } | null };
  classMethod: string[];
  unit: TestSet[];
  integration: TestSet[];
  system: TestSet[];
  xray: Array<{ key: string; title: string; last: string | null }>;
  bugs: Array<{ key: string; title: string; open: boolean; severity: string | null }>;
  iteration: string;
  issueDone: boolean;
  ucMissing: string[];
  status: (typeof RTM_STATUSES)[number];
  gaps: GapCode[];
  /** CTW Diagram: sequence diagram của UC ("D-4", "D-7 (draft)"). undefined = không xét (dòng REQ / dữ liệu cũ). */
  sequence?: string[];
}

/** Gộp số liệu kiểm thử của một dòng: có test không, đã chạy chưa, có trượt không. */
export function testSummary(r: Pick<RtmRow, 'unit' | 'integration' | 'system' | 'xray'>) {
  const sets = [...r.unit, ...r.integration, ...r.system];
  const total = sets.reduce((a, s) => a + s.cases, 0) + r.xray.length;
  const failed = sets.reduce((a, s) => a + s.failed, 0) + r.xray.filter((x) => x.last === 'FAIL' || x.last === 'BLOCKED').length;
  const passed = sets.reduce((a, s) => a + s.passed, 0) + r.xray.filter((x) => x.last === 'PASS').length;
  const notRun = sets.reduce((a, s) => a + s.notRun, 0) + r.xray.filter((x) => !x.last || x.last === 'TODO' || x.last === 'RETEST').length;
  return { total, passed, failed, notRun, run: total - notRun };
}

/** Trạng thái + chỗ hở của một dòng (gọi sau khi điền đủ các cột). */
export function evaluateRow(r: Omit<RtmRow, 'status' | 'gaps'>): Pick<RtmRow, 'status' | 'gaps'> {
  const t = testSummary(r);
  const coded = r.code.commits + r.code.prs > 0 || r.issueDone;
  const gaps: GapCode[] = [];
  if (r.kind === 'UC' && r.ucMissing.length) gaps.push('UC_INCOMPLETE');
  if (r.kind === 'UC' && !r.issueNumber) gaps.push('NO_ISSUE');
  if (!r.srs.length) gaps.push('NO_SRS');
  if (!r.sds.length) gaps.push('NO_SDS');
  if (r.code.commits + r.code.prs === 0) gaps.push('NO_CODE');
  if (!t.total) gaps.push('NO_TEST');
  else if (!t.run) gaps.push('NOT_RUN');
  if (t.failed) gaps.push('FAILING');
  if (r.bugs.some((b) => b.open)) gaps.push('OPEN_BUGS');
  if (r.kind === 'UC' && r.sequence && !r.sequence.length) gaps.push('NO_SEQUENCE');
  const analyzed = r.kind === 'UC' ? !r.ucMissing.length : r.srs.length > 0;
  const status: RtmRow['status'] = t.total && t.run && !t.failed && t.notRun === 0 && coded ? 'Tested'
    : coded ? 'Coded' : r.sds.length ? 'Designed' : analyzed ? 'Analyzed' : 'Planned';
  return { status, gaps };
}

export interface RuleCoverage { key: string; name: string; usedIn: string[]; unit: string[]; integration: string[]; system: string[]; covered: boolean }
export interface Orphan { kind: 'XRAY' | 'UNIT' | 'IT' | 'ST'; ref: string; name: string }

/**
 * dm5 G2 (B13): 4 chỉ số phủ người chấm SEP490 soi (bài s04/b6 · s11/b1):
 *   ucCodedNoSds  UC đã có code (commit/PR hoặc thẻ xong) mà KHÔNG có mục SDS nào (thiết kế bị bỏ qua)
 *   ucTestedNoSt  UC đã có test (Unit/IT/Xray) mà KHÔNG có System Test (5.3) nào
 *   brCoveredPct  % Business Rule có ít nhất một test (Unit/IT/ST)
 *   orphanTests   số test không truy ngược được về yêu cầu nào
 */
export interface RtmCoverage {
  ucCodedNoSds: string[]; ucTestedNoSt: string[];
  brTotal: number; brCovered: number; brCoveredPct: number; brUncovered: string[];
  orphanTests: number;
}

export interface RtmSummary {
  rows: number; useCases: number; requirements: number;
  withTests: number; testedPct: number; passing: number; withGaps: number;
  gaps: Record<GapCode, number>;
  coverage: RtmCoverage;
}

export function coverageOf(rows: RtmRow[], rules: RuleCoverage[] = [], orphans: Orphan[] = []): RtmCoverage {
  const ucs = rows.filter((r) => r.kind === 'UC');
  const coded = (r: RtmRow) => r.code.commits + r.code.prs > 0 || r.issueDone;
  const anyTest = (r: RtmRow) => r.unit.length + r.integration.length + r.system.length + r.xray.length > 0;
  const brCovered = rules.filter((r) => r.covered).length;
  return {
    ucCodedNoSds: ucs.filter((r) => coded(r) && !r.sds.length).map((r) => r.reqId),
    ucTestedNoSt: ucs.filter((r) => anyTest(r) && !r.system.length).map((r) => r.reqId),
    brTotal: rules.length, brCovered, brCoveredPct: rules.length ? Math.round((brCovered / rules.length) * 100) : 0,
    brUncovered: rules.filter((r) => !r.covered).map((r) => r.key),
    orphanTests: orphans.length,
  };
}

export function summarize(rows: RtmRow[], extra: { rules?: RuleCoverage[]; orphans?: Orphan[] } = {}): RtmSummary {
  const gaps = Object.fromEntries(GAP_CODES.map((g) => [g, rows.filter((r) => r.gaps.includes(g)).length])) as Record<GapCode, number>;
  const withTests = rows.filter((r) => !r.gaps.includes('NO_TEST')).length;
  return {
    rows: rows.length, useCases: rows.filter((r) => r.kind === 'UC').length, requirements: rows.filter((r) => r.kind === 'REQ').length,
    withTests, testedPct: rows.length ? Math.round((withTests / rows.length) * 100) : 0,
    passing: rows.filter((r) => r.status === 'Tested').length, withGaps: rows.filter((r) => r.gaps.length).length, gaps,
    coverage: coverageOf(rows, extra.rules, extra.orphans),
  };
}

// ─── dm5 G2 (B13): NFR → Đo lường → Test ─────────────────────────

export interface NfrTraceRow {
  key: string; title: string; characteristic: string; sub: string | null; scale: string; meter: string;
  must: string; plan: string; wish: string; verification: string; tests: string[]; result: string;
}

const COMP: Record<string, string> = { '<=': '≤', '>=': '≥', '=': '=' };
const nval = (comparator: string, v: number | null, unit: string | null) => (v === null ? '' : `${COMP[comparator] ?? comparator} ${Number.isInteger(v) ? v : Math.round(v * 1000) / 1000}${unit ? ` ${unit}` : ''}`);

/** NFR có số đo (WorkNfrSpec) + dòng RTM của chính thẻ NFR (test gắn vào thẻ) ⇒ một dòng sheet NFR. */
export function nfrTraceRows(nfrs: Array<{ key: string; number: number; title: string; spec: { characteristic: string; subCharacteristic: string | null; scale: string; meter: string; unit: string | null; comparator: string; mustValue: number | null; planValue: number | null; wishValue: number | null; verification: string } }>, rows: RtmRow[]): NfrTraceRow[] {
  return nfrs.map((n) => {
    const r = rows.find((x) => x.issueNumber === n.number);
    const tests = r ? [
      ...r.xray.map((x) => `${x.key}${x.last ? ` [${x.last}]` : ' [not run]'}`), ...r.unit.map(setText), ...r.integration.map(setText), ...r.system.map(setText),
    ] : [];
    const t = r ? testSummary(r) : null;
    const result = !t || !t.total ? (n.spec.verification === 'TEST' ? 'No test yet' : `Verify by ${n.spec.verification.toLowerCase()}`)
      : t.failed ? `${t.failed} failing` : t.notRun ? `${t.run}/${t.total} run` : `All ${t.total} passed`;
    return {
      key: n.key, title: n.title, characteristic: n.spec.characteristic, sub: n.spec.subCharacteristic, scale: n.spec.scale, meter: n.spec.meter,
      must: nval(n.spec.comparator, n.spec.mustValue, n.spec.unit), plan: nval(n.spec.comparator, n.spec.planValue, n.spec.unit), wish: nval(n.spec.comparator, n.spec.wishValue, n.spec.unit),
      verification: n.spec.verification, tests, result,
    };
  });
}

/** Lọc như màn hình: chỗ hở, trạng thái, chữ (mã/tên/feature). */
export function filterRows(rows: RtmRow[], q: { gap?: GapCode | 'ANY' | null; status?: string | null; text?: string | null; kind?: 'UC' | 'REQ' | null }): RtmRow[] {
  const text = (q.text ?? '').trim().toLowerCase();
  return rows.filter((r) => (!q.gap || (q.gap === 'ANY' ? r.gaps.length > 0 : r.gaps.includes(q.gap)))
    && (!q.status || r.status === q.status) && (!q.kind || r.kind === q.kind)
    && (!text || `${r.reqId} ${r.issueKey ?? ''} ${r.requirement} ${r.feature}`.toLowerCase().includes(text)));
}

// ─── Chữ hiển thị một ô (màn hình + Excel) ───────────────────────

export const setText = (s: TestSet) => `${s.ref ? `${s.ref} ` : ''}${s.name} (${s.cases} case${s.cases === 1 ? '' : 's'}${s.cases ? `: ${s.passed} passed${s.failed ? `, ${s.failed} failed` : ''}${s.notRun ? `, ${s.notRun} not run` : ''}` : ''})`;
export const codeText = (c: RtmRow['code']) => (c.commits + c.prs + c.branches ? [c.commits ? `${c.commits} commit${c.commits > 1 ? 's' : ''}` : '', c.prs ? `${c.prs} PR${c.prs > 1 ? 's' : ''}` : '', c.branches ? `${c.branches} branch${c.branches > 1 ? 'es' : ''}` : ''].filter(Boolean).join(', ') : '');

// ─── Excel ───────────────────────────────────────────────────────

const CAL = (sz = 11, b = false): XStyle['font'] => ({ name: 'Calibri', sz, b });
const HEAD: XStyle = { font: CAL(11, true), fill: 'D9E2F3', border: 'thin', align: { h: 'center', v: 'center', wrap: true } };
const CELL: XStyle = { font: CAL(), border: 'thin', align: { v: 'top', wrap: true } };
const CENTER: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top', wrap: true } };
const GAP: XStyle = { font: { name: 'Calibri', sz: 11, color: '9C0006' }, fill: 'FFC7CE', border: 'thin', align: { v: 'top', wrap: true } };

/** Cột của sheet RTM — 14 cột của hướng dẫn RTM + 4 cột CT Work biết thêm (Issue, Commits/PRs, Xray tests, Bugs, Gaps). */
export const RTM_HEADERS = [
  'Req ID', 'Requirement', 'Feature', 'Related BR/NFR', 'SRS UC §', 'Screen (SRS §3)', 'SDS §', 'Class.method',
  'Unit Test', 'Integration Test', 'System Test', 'Iteration', 'Status', 'Notes',
  'Issue', 'Commits / PRs', 'Test cases (Xray)', 'Bugs', 'Gaps',
] as const;

function rtmSheet(rows: RtmRow[], projectName: string): XSheet {
  const sh = new XSheet('RTM');
  const widths = [10, 34, 16, 18, 22, 24, 24, 24, 30, 28, 28, 14, 11, 30, 11, 18, 28, 28, 30];
  widths.forEach((w, i) => sh.width(i + 1, w));
  sh.set(1, 1, `Requirement Traceability Matrix — ${projectName}`, { font: CAL(13, true) });
  sh.merge(1, 1, 1, 6);
  RTM_HEADERS.forEach((h, i) => sh.set(2, i + 1, h, HEAD));
  sh.height(2, 32);
  rows.forEach((r, k) => {
    const row = 3 + k;
    const notes = [
      r.ucMissing.length ? `UC spec missing: ${r.ucMissing.join(', ')}` : '',
      r.bugs.filter((b) => b.open).length ? `Open: ${r.bugs.filter((b) => b.open).map((b) => b.key).join(', ')}` : '',
    ].filter(Boolean).join('\n');
    const vals: Array<[string, XStyle]> = [
      [r.reqId, CENTER], [r.requirement, CELL], [r.feature, CELL], [r.rules.join(', '), CELL],
      [r.srs.join('\n'), r.gaps.includes('NO_SRS') ? GAP : CELL], [r.screens.join('\n') || (r.kind === 'UC' ? '' : ''), CELL],
      [r.sds.join('\n'), r.gaps.includes('NO_SDS') ? GAP : CELL], [r.classMethod.join('\n'), CELL],
      [r.unit.map(setText).join('\n'), CELL], [r.integration.map(setText).join('\n'), CELL], [r.system.map(setText).join('\n'), CELL],
      [r.iteration, CENTER], [r.status, CENTER], [notes, CELL],
      [r.issueKey ?? '', r.gaps.includes('NO_ISSUE') ? GAP : CENTER], [codeText(r.code), r.gaps.includes('NO_CODE') ? GAP : CELL],
      [r.xray.map((x) => `${x.key}${x.last ? ` [${x.last}]` : ' [not run]'}`).join('\n'), r.gaps.includes('NO_TEST') || r.gaps.includes('FAILING') ? GAP : CELL],
      [r.bugs.map((b) => `${b.key}${b.severity ? ` (${b.severity.toLowerCase()})` : ''}${b.open ? ' — open' : ''}`).join('\n'), r.gaps.includes('OPEN_BUGS') ? GAP : CELL],
      [r.gaps.map((g) => GAP_LABEL[g]).join('\n'), r.gaps.length ? GAP : CELL],
    ];
    vals.forEach(([v, s], i) => sh.set(row, i + 1, v, s));
  });
  sh.freeze = { col: 2, row: 3 };
  sh.listValidation(`M3:M${3 + Math.max(rows.length, 1) + 49}`, [...RTM_STATUSES]);
  return sh;
}

function rulesSheet(rules: RuleCoverage[]): XSheet {
  const sh = new XSheet('BR Coverage');
  [10, 40, 22, 30, 30, 30, 12].forEach((w, i) => sh.width(i + 1, w));
  ['BR ID', 'Rule', 'Used in', 'Unit Test', 'Integration Test', 'System Test', 'Covered'].forEach((h, i) => sh.set(1, i + 1, h, HEAD));
  rules.forEach((r, k) => {
    const row = 2 + k;
    [[r.key, CENTER], [r.name, CELL], [r.usedIn.join(', '), CELL], [r.unit.join('\n'), CELL], [r.integration.join('\n'), CELL], [r.system.join('\n'), CELL], [r.covered ? 'Yes' : 'No', r.covered ? CENTER : GAP]]
      .forEach(([v, s], i) => sh.set(row, i + 1, v as string, s as XStyle));
  });
  sh.freeze = { col: 1, row: 2 };
  return sh;
}

function orphanSheet(orphans: Orphan[]): XSheet {
  const sh = new XSheet('Untraced Tests');
  [14, 22, 60].forEach((w, i) => sh.width(i + 1, w));
  ['Level', 'Test', 'Name'].forEach((h, i) => sh.set(1, i + 1, h, HEAD));
  const LV: Record<Orphan['kind'], string> = { XRAY: 'Test case', UNIT: 'Unit (5.1)', IT: 'Integration (5.2)', ST: 'System (5.3)' };
  orphans.forEach((o, k) => [LV[o.kind], o.ref, o.name].forEach((v, i) => sh.set(2 + k, i + 1, v, CELL)));
  if (!orphans.length) sh.set(2, 1, 'Every test traces back to a requirement.', CELL);
  return sh;
}

function nfrSheet(nfrs: NfrTraceRow[]): XSheet {
  const sh = new XSheet('NFR');
  [11, 30, 20, 34, 34, 14, 14, 14, 14, 40, 16].forEach((w, i) => sh.width(i + 1, w));
  ['NFR ID', 'Requirement', 'Characteristic', 'Scale', 'Meter (how it is measured)', 'Must', 'Plan', 'Wish', 'Verification', 'Tests / measurements', 'Result'].forEach((h, i) => sh.set(1, i + 1, h, HEAD));
  nfrs.forEach((n, k) => {
    const noTest = n.verification === 'TEST' && !n.tests.length;
    [[n.key, CENTER], [n.title, CELL], [`${n.characteristic.replace(/_/g, ' ').toLowerCase()}${n.sub ? ` — ${n.sub}` : ''}`, CELL], [n.scale, CELL], [n.meter, CELL],
      [n.must, CENTER], [n.plan, CENTER], [n.wish, CENTER], [n.verification.charAt(0) + n.verification.slice(1).toLowerCase(), CENTER],
      [n.tests.join('\n'), noTest ? GAP : CELL], [n.result, /failing|No test/.test(n.result) ? GAP : CENTER]]
      .forEach(([v, s], i) => sh.set(2 + k, i + 1, v as string, s as XStyle));
  });
  if (!nfrs.length) sh.set(2, 1, 'No measurable NFR yet — add one under Requirements › Quality (NFR) with scale, meter and Must/Plan values.', CELL);
  sh.freeze = { col: 2, row: 2 };
  return sh;
}

function summarySheet(s: RtmSummary, projectName: string, generated: string): XSheet {
  const sh = new XSheet('Summary');
  sh.width(1, 40); sh.width(2, 14);
  sh.set(1, 1, `RTM summary — ${projectName}`, { font: CAL(13, true) });
  sh.set(2, 1, `Generated ${generated} by CT Work`, { font: { name: 'Calibri', sz: 10, i: true, color: '595959' } });
  const lines: Array<[string, number | string]> = [
    ['Requirements in the matrix', s.rows], ['  of which use cases', s.useCases], ['  of which requirement issues without a use case', s.requirements],
    ['Requirements with at least one test', s.withTests], ['Test coverage (%)', s.testedPct], ['Requirements fully tested', s.passing],
    ['Requirements with gaps', s.withGaps],
    ...GAP_CODES.map((g) => [`  ${GAP_LABEL[g]}`, s.gaps[g]] as [string, number]),
    // dm5 G2 (B13): 4 chỉ số phủ.
    ['Coverage indicators', ''],
    ['  UC coded but without an SDS section', s.coverage.ucCodedNoSds.length],
    ['  UC tested but without a System Test (5.3)', s.coverage.ucTestedNoSt.length],
    ['  Business rules covered by a test (%)', s.coverage.brTotal ? s.coverage.brCoveredPct : 'n/a'],
    ['  Untraced (orphan) tests', s.coverage.orphanTests],
  ];
  ['Measure', 'Value'].forEach((h, i) => sh.set(4, i + 1, h, HEAD));
  lines.forEach(([k, v], i) => { sh.set(5 + i, 1, k, CELL); sh.set(5 + i, 2, v, CENTER); });
  return sh;
}

export function buildRtmSheets(input: { projectName: string; rows: RtmRow[]; rules: RuleCoverage[]; orphans: Orphan[]; generated: string; nfrs?: NfrTraceRow[] }): XSheet[] {
  return [
    rtmSheet(input.rows, input.projectName), rulesSheet(input.rules), nfrSheet(input.nfrs ?? []), orphanSheet(input.orphans),
    summarySheet(summarize(input.rows, { rules: input.rules, orphans: input.orphans }), input.projectName, input.generated),
  ];
}

/** Một sheet "RTM" để gắn vào CUỐI Project Tracking SEP490 (hướng dẫn RTM: không chèn giữa 6 sheet mẫu). */
export const rtmTrackingSheet = (rows: RtmRow[], projectName: string) => rtmSheet(rows, projectName);

