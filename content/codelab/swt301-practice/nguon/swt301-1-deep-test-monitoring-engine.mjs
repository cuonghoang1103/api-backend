/**
 * SWT301 · DEEP LAB CHƯƠNG 1 — Tự viết "bộ não" của test monitoring & control: kết quả mới nhất, độ phủ yêu cầu/rủi ro cao,
 * lỗi mở theo mức, điểm nóng lỗi (phân cụm), test "thuốc trừ sâu", quyết định GO/NO-GO theo tiêu chí ra.
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

/* Dữ liệu mẫu + hàm tham chiếu dùng trong kiểm (tự chứa, nhúng bằng chuỗi). */
const MAU = `function __mau() {
  return {
    requirements: [
      { id: 'R1', risk: 'High' }, { id: 'R2', risk: 'Low' }, { id: 'R3', risk: 'High' },
      { id: 'R4', risk: 'High' }, { id: 'R5', risk: 'Medium' }, { id: 'R6', risk: 'Low' },
    ],
    matrix: { TC1: ['R1'], TC2: ['R1', 'R2'], TC3: ['R3'], TC4: ['R3', 'R4'], TC5: ['R5'], TC6: ['R4'], TC7: ['R6', 'X9'] },
    runs: [
      { tc: 'TC1', build: '1.0', result: 'PASS' }, { tc: 'TC2', build: '1.0', result: 'FAIL' },
      { tc: 'TC3', build: '1.0', result: 'BLOCKED' }, { tc: 'TC4', build: '1.0', result: 'PASS' },
      { tc: 'TC1', build: '1.1', result: 'PASS' }, { tc: 'TC2', build: '1.1', result: 'PASS' },
      { tc: 'TC3', build: '1.1', result: 'FAIL' }, { tc: 'TC5', build: '1.1', result: 'BLOCKED' },
      { tc: 'TC1', build: '1.2', result: 'PASS' }, { tc: 'TC4', build: '1.2', result: 'FAIL' },
      { tc: 'TC3', build: '1.2', result: 'BLOCKED' },
    ],
    defects: [
      { id: 'D1', severity: 'Critical', status: 'Closed', module: 'booking' },
      { id: 'D2', severity: 'Major', status: 'Open', module: 'booking' },
      { id: 'D3', severity: 'Critical', status: 'Open', module: 'cancel' },
      { id: 'D4', severity: 'Minor', status: 'Fixed', module: 'booking' },
      { id: 'D5', severity: 'Major', status: 'Rejected', module: 'ui' },
      { id: 'D6', severity: 'Trivial', status: 'Reopened', module: 'booking' },
      { id: 'D7', severity: 'Major', status: 'Open', module: 'cancel' },
      { id: 'D8', severity: 'Minor', status: 'Closed', module: 'auth' },
    ],
    exit: { minReqCoverage: 80, minHighRiskCoverage: 100, maxOpenCritical: 0, maxOpenMajor: 2 },
    staleAfter: 3,
  };
}`;

const GIAI = `// Test monitoring & control engine for LabBook (Deep Lab 1).
const OPEN_STATUSES_EXCLUDED = ['CLOSED', 'REJECTED'];
const SEVERITIES = ['Critical', 'Major', 'Minor', 'Trivial'];
const round2 = (x) => Math.round(x * 100) / 100;

function latestResults(runs) {
  const last = {};
  for (const r of runs) last[r.tc] = r.result; // runs are in chronological order
  return last;
}

function coverageOf(reqIds, matrix, executedTcs) {
  if (reqIds.length === 0) return 100;
  const want = new Set(reqIds);
  const hit = new Set();
  for (const tc of executedTcs) for (const r of matrix[tc] || []) if (want.has(r)) hit.add(r);
  return round2((hit.size / want.size) * 100);
}

function hotSpots(defects, share) {
  const count = {};
  for (const d of defects) count[d.module] = (count[d.module] || 0) + 1;
  const rows = Object.entries(count).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  const total = defects.length;
  const out = [];
  let sum = 0;
  for (const [m, n] of rows) {
    if (total === 0) break;
    out.push(m);
    sum += n;
    if (sum + 1e-9 >= share * total) break;
  }
  return out;
}

function testStatus(input) {
  const { requirements, matrix, runs, defects, exit, staleAfter } = input;
  const last = latestResults(runs);
  const executedTcs = Object.keys(last).filter((tc) => last[tc] === 'PASS' || last[tc] === 'FAIL');
  const passed = executedTcs.filter((tc) => last[tc] === 'PASS').length;

  const reqCoverage = coverageOf(requirements.map((r) => r.id), matrix, executedTcs);
  const highRiskCoverage = coverageOf(requirements.filter((r) => r.risk === 'High').map((r) => r.id), matrix, executedTcs);

  const openBySeverity = { Critical: 0, Major: 0, Minor: 0, Trivial: 0 };
  for (const d of defects) {
    if (OPEN_STATUSES_EXCLUDED.includes(String(d.status).toUpperCase())) continue;
    if (SEVERITIES.includes(d.severity)) openBySeverity[d.severity]++;
  }

  const byTc = {};
  for (const r of runs) (byTc[r.tc] = byTc[r.tc] || []).push(r.result);
  const staleTests = Object.keys(byTc)
    .filter((tc) => byTc[tc].length >= staleAfter && byTc[tc].slice(-staleAfter).every((x) => x === 'PASS'))
    .sort();

  const reasons = [];
  if (reqCoverage < exit.minReqCoverage) reasons.push('REQ_COVERAGE');
  if (highRiskCoverage < exit.minHighRiskCoverage) reasons.push('HIGH_RISK_COVERAGE');
  if (openBySeverity.Critical > exit.maxOpenCritical) reasons.push('OPEN_CRITICAL');
  if (openBySeverity.Major > exit.maxOpenMajor) reasons.push('OPEN_MAJOR');

  return {
    executed: executedTcs.length,
    passRate: executedTcs.length ? round2((passed / executedTcs.length) * 100) : 0,
    reqCoverage,
    highRiskCoverage,
    openBySeverity,
    hotSpots: hotSpots(defects, 0.8),
    staleTests,
    decision: reasons.length ? 'NO-GO' : 'GO',
    reasons,
  };
}
`;

const DAU = `// Deep Lab 1 — implement testStatus(input). Read the specification on the left carefully.
function testStatus(input) {
  const { requirements, matrix, runs, defects, exit, staleAfter } = input;
  // TODO 1: latest result of each test case (runs are in chronological order)
  // TODO 2: executed, passRate
  // TODO 3: reqCoverage, highRiskCoverage
  // TODO 4: openBySeverity
  // TODO 5: hotSpots (80%), staleTests
  // TODO 6: decision + reasons
  return {
    executed: 0,
    passRate: 0,
    reqCoverage: 0,
    highRiskCoverage: 0,
    openBySeverity: { Critical: 0, Major: 0, Minor: 0, Trivial: 0 },
    hotSpots: [],
    staleTests: [],
    decision: 'GO',
    reasons: [],
  };
}
`;

/* Một kiểm = dựng input (từ mẫu, có thể biến đổi) rồi so một trường với giá trị chờ. */
const ck = (moTa, bienDoi, truong, cho, nhom, an) => kiemTuy(moTa, new Function(`${MAU}
  const inp = __mau(); ${bienDoi}
  let out; try { out = testStatus(inp); } catch (e) { return 'testStatus threw: ' + e.message; }
  if (!out || typeof out !== 'object') return 'testStatus must return an object';
  const got = out[${JSON.stringify(truong)}];
  const want = ${JSON.stringify(cho)};
  return JSON.stringify(got) === JSON.stringify(want) ? 'OK' : '${truong}: expected ' + JSON.stringify(want) + ', got ' + JSON.stringify(got);`), { nhom, ...(an ? { an: true } : {}) });

const KIEM = [
  /* f1 — kết quả mới nhất, đã chạy, tỉ lệ đạt */
  ck({ en: 'f1 — executed counts the latest PASS/FAIL only (BLOCKED and never-run excluded)', vi: 'f1 — executed chỉ đếm kết quả mới nhất PASS/FAIL' }, '', 'executed', 3, 'f1'),
  ck({ en: 'f1 — passRate uses the latest result of each test case', vi: 'f1 — passRate dùng kết quả mới nhất' }, '', 'passRate', 66.67, 'f1'),
  ck({ en: 'f1 — the latest result wins (TC4 fails on 1.2, passes on 1.3)', vi: 'f1 — kết quả mới nhất thắng (TC4 trượt ở 1.2, đạt ở 1.3)' }, "inp.runs.push({ tc: 'TC4', build: '1.3', result: 'PASS' });", 'passRate', 100, 'f1'),
  ck({ en: 'f1 — a later BLOCKED replaces an earlier FAIL', vi: 'f1 — BLOCKED sau thay FAIL trước' }, "inp.runs.push({ tc: 'TC4', build: '1.3', result: 'BLOCKED' });", 'executed', 2, 'f1', true),
  ck({ en: 'f1 — no executed test ⇒ passRate 0', vi: 'f1 — không test nào chạy ⇒ passRate 0' }, 'inp.runs = [];', 'passRate', 0, 'f1', true),
  ck({ en: 'f1 — a newly run test case counts', vi: 'f1 — test case mới chạy được tính' }, "inp.runs.push({ tc: 'TC6', build: '1.2', result: 'PASS' });", 'passRate', 75, 'f1', true),
  ck({ en: 'f1 — 3 of 5 executed pass', vi: 'f1 — 3/5 test đã chạy đạt' }, "inp.runs.push({ tc: 'TC6', build: '1.2', result: 'FAIL' }, { tc: 'TC7', build: '1.2', result: 'PASS' });", 'passRate', 60, 'f1', true),
  /* f2 — độ phủ */
  ck({ en: 'f2 — reqCoverage: requirements linked to an executed test (unknown ids ignored)', vi: 'f2 — reqCoverage: yêu cầu nối với test đã chạy (bỏ mã lạ)' }, '', 'reqCoverage', 66.67, 'f2'),
  ck({ en: 'f2 — highRiskCoverage', vi: 'f2 — highRiskCoverage' }, '', 'highRiskCoverage', 100, 'f2'),
  ck({ en: 'f2 — a BLOCKED-only test does not cover its requirement', vi: 'f2 — test chỉ BLOCKED không phủ yêu cầu' }, "inp.runs = inp.runs.filter((r) => r.tc !== 'TC4');", 'highRiskCoverage', 33.33, 'f2', true),
  ck({ en: 'f2 — no high-risk requirement ⇒ 100', vi: 'f2 — không có yêu cầu rủi ro cao ⇒ 100' }, "inp.requirements.forEach((r) => { r.risk = 'Low'; });", 'highRiskCoverage', 100, 'f2', true),
  ck({ en: 'f2 — unknown requirement ids never push coverage over 100', vi: 'f2 — mã lạ không đẩy độ phủ quá 100' }, "inp.runs.push({ tc: 'TC7', build: '1.2', result: 'PASS' }); inp.requirements = [{ id: 'R6', risk: 'Low' }];", 'reqCoverage', 100, 'f2', true),
  /* f3 — lỗi mở, điểm nóng, test thuốc trừ sâu */
  ck({ en: 'f3 — openBySeverity (Closed and Rejected are not open; Fixed and Reopened are)', vi: 'f3 — openBySeverity (Closed, Rejected không mở; Fixed, Reopened vẫn mở)' }, '', 'openBySeverity', { Critical: 1, Major: 2, Minor: 1, Trivial: 1 }, 'f3'),
  ck({ en: 'f3 — status comparison ignores case', vi: 'f3 — so trạng thái không phân biệt hoa thường' }, "inp.defects.push({ id: 'D9', severity: 'Critical', status: 'closed', module: 'auth' });", 'openBySeverity', { Critical: 1, Major: 2, Minor: 1, Trivial: 1 }, 'f3', true),
  ck({ en: 'f3 — hotSpots over ALL defects (80%)', vi: 'f3 — hotSpots trên MỌI lỗi (80%)' }, '', 'hotSpots', ['booking', 'cancel', 'auth'], 'f3'),
  ck({ en: 'f3 — hotSpots stops at the first prefix reaching 80%', vi: 'f3 — hotSpots dừng ở tiền tố đầu tiên đạt 80%' }, "inp.defects = [1,2,3,4].map((i) => ({ id: 'X' + i, severity: 'Minor', status: 'Open', module: 'pay' })).concat([{ id: 'Y', severity: 'Minor', status: 'Open', module: 'ui' }]);", 'hotSpots', ['pay'], 'f3', true),
  ck({ en: 'f3 — staleTests: last N runs all PASS', vi: 'f3 — staleTests: N lần chạy cuối đều PASS' }, '', 'staleTests', ['TC1'], 'f3'),
  ck({ en: 'f3 — staleTests needs at least N runs and is sorted', vi: 'f3 — staleTests cần ≥ N lần chạy và được sắp' }, "inp.staleAfter = 1;", 'staleTests', ['TC1', 'TC2'], 'f3', true),
  /* f4 — quyết định */
  ck({ en: 'f4 — decision with the sample data', vi: 'f4 — quyết định với dữ liệu mẫu' }, '', 'decision', 'NO-GO', 'f4'),
  ck({ en: 'f4 — reasons in the fixed order', vi: 'f4 — lý do theo thứ tự cố định' }, '', 'reasons', ['REQ_COVERAGE', 'OPEN_CRITICAL'], 'f4'),
  ck({ en: 'f4 — limits are inclusive (≥ coverage, ≤ open defects)', vi: 'f4 — ngưỡng tính cả biên (≥ độ phủ, ≤ lỗi mở)' }, "inp.exit = { minReqCoverage: 66.67, minHighRiskCoverage: 100, maxOpenCritical: 1, maxOpenMajor: 2 };", 'decision', 'GO', 'f4', true),
  ck({ en: 'f4 — every criterion can fail at once', vi: 'f4 — mọi tiêu chí cùng trượt' }, "inp.exit = { minReqCoverage: 100, minHighRiskCoverage: 100, maxOpenCritical: 0, maxOpenMajor: 0 }; inp.runs = inp.runs.filter((r) => r.tc !== 'TC4');", 'reasons', ['REQ_COVERAGE', 'HIGH_RISK_COVERAGE', 'OPEN_CRITICAL', 'OPEN_MAJOR'], 'f4', true),
  kiemTuy({ en: 'f4 — testStatus does not modify its input', vi: 'f4 — testStatus không sửa đầu vào' }, new Function(`${MAU}
    const inp = __mau(); const s = JSON.stringify(inp); try { testStatus(inp); } catch (e) { return 'threw: ' + e.message; }
    return JSON.stringify(inp) === s ? 'OK' : 'the input was modified (sort a copy, never the original arrays)';`), { nhom: 'f4', an: true }),
];

const BAN_IN = {
  tieuDe: 'Deep Lab 1 — Build the Engine of Test Monitoring and Control',
  phu: { en: 'Chapter 1 deep lab · monitoring metrics, defect clustering, pesticide paradox and exit criteria in code · 10 marks', vi: 'Deep Lab chương 1 · số liệu giám sát, phân cụm lỗi, nghịch lý thuốc trừ sâu và tiêu chí ra bằng code · 10 điểm' },
  moTa: {
    en: `<p>Test monitoring compares progress with the plan; test control acts on it; the exit criteria decide when to stop (lesson 1.4). Test-management tools (Jira + Xray, TestRail, CT Work) compute all of this for you — here you build the engine yourself, so you know exactly what the numbers on a dashboard mean.</p>
<p>Write <code>testStatus(input)</code>. The input:</p>${preMa(`{
  requirements: [ { id: 'R1', risk: 'High' | 'Medium' | 'Low' }, … ],
  matrix:       { TC1: ['R1', 'R2'], … },              // traceability: test case → requirement ids
  runs:         [ { tc: 'TC1', build: '1.0', result: 'PASS' | 'FAIL' | 'BLOCKED' }, … ],   // chronological
  defects:      [ { id, severity: 'Critical'|'Major'|'Minor'|'Trivial', status, module }, … ],
  exit:         { minReqCoverage, minHighRiskCoverage, maxOpenCritical, maxOpenMajor },
  staleAfter:   3
}`)}
<p>Return <code>{ executed, passRate, reqCoverage, highRiskCoverage, openBySeverity, hotSpots, staleTests, decision, reasons }</code>:</p>
<ol>
<li><b>Latest result</b> of a test case = its last entry in <code>runs</code>. <code>executed</code> = number of test cases whose latest result is PASS or FAIL. <code>passRate</code> = latest PASS ÷ executed × 100 (0 when nothing is executed).</li>
<li><code>reqCoverage</code> = % of <code>requirements</code> linked to at least one executed test case; <code>highRiskCoverage</code> the same for <code>risk === 'High'</code>. Ids in the matrix that are not in <code>requirements</code> are ignored. An empty set of requirements ⇒ 100.</li>
<li><code>openBySeverity</code> = <code>{ Critical, Major, Minor, Trivial }</code> counting defects whose status is <b>not</b> Closed or Rejected (case-insensitive) — Fixed and Reopened are still open until confirmed.</li>
<li><code>hotSpots</code> (defect clustering) = over <b>all</b> defects, modules sorted by number of defects (descending, ties A→Z), the shortest prefix holding ≥ 80% of the defects.</li>
<li><code>staleTests</code> (pesticide paradox) = test cases (sorted A→Z) with at least <code>staleAfter</code> runs whose last <code>staleAfter</code> results are all PASS — candidates for review and new variants.</li>
<li><code>reasons</code> = the failed exit criteria in this order: <code>REQ_COVERAGE</code> (reqCoverage &lt; min), <code>HIGH_RISK_COVERAGE</code>, <code>OPEN_CRITICAL</code> (open &gt; max), <code>OPEN_MAJOR</code>. <code>decision</code> = <code>'GO'</code> when there is no reason, else <code>'NO-GO'</code>.</li>
</ol>
<p>All percentages are rounded with <code>Math.round(x * 100) / 100</code>. The function must not modify its input.</p>`,
    vi: `<p>Giám sát test so tiến độ với kế hoạch; kiểm soát test hành động theo đó; tiêu chí ra quyết định khi nào dừng (bài 1.4). Công cụ quản lý test (Jira + Xray, TestRail, CT Work) tính hết cho bạn — ở đây bạn tự dựng bộ máy để hiểu chính xác từng con số trên dashboard.</p>
<p>Viết <code>testStatus(input)</code> với đầu vào như khối mã ở trên. Trả về <code>{ executed, passRate, reqCoverage, highRiskCoverage, openBySeverity, hotSpots, staleTests, decision, reasons }</code>:</p>
<ol>
<li><b>Kết quả mới nhất</b> của một test case = mục cuối cùng của nó trong <code>runs</code>. <code>executed</code> = số test case có kết quả mới nhất là PASS hoặc FAIL. <code>passRate</code> = số PASS mới nhất ÷ executed × 100 (0 nếu chưa chạy gì).</li>
<li><code>reqCoverage</code> = % yêu cầu nối với ít nhất một test case đã chạy; <code>highRiskCoverage</code> tương tự cho <code>risk === 'High'</code>. Mã trong ma trận không có trong <code>requirements</code> bị bỏ qua. Tập yêu cầu rỗng ⇒ 100.</li>
<li><code>openBySeverity</code> = <code>{ Critical, Major, Minor, Trivial }</code> đếm lỗi có trạng thái <b>khác</b> Closed và Rejected (không phân biệt hoa thường) — Fixed và Reopened vẫn tính là mở tới khi xác nhận.</li>
<li><code>hotSpots</code> (phân cụm lỗi) = trên <b>mọi</b> lỗi, module sắp theo số lỗi (giảm dần, bằng nhau A→Z), tiền tố ngắn nhất chứa ≥ 80% số lỗi.</li>
<li><code>staleTests</code> (nghịch lý thuốc trừ sâu) = test case (sắp A→Z) có ít nhất <code>staleAfter</code> lần chạy và <code>staleAfter</code> kết quả cuối đều PASS — ứng viên để rà soát, viết biến thể mới.</li>
<li><code>reasons</code> = các tiêu chí ra không đạt theo thứ tự: <code>REQ_COVERAGE</code> (reqCoverage &lt; min), <code>HIGH_RISK_COVERAGE</code>, <code>OPEN_CRITICAL</code> (mở &gt; max), <code>OPEN_MAJOR</code>. <code>decision</code> = <code>'GO'</code> khi không có lý do nào, ngược lại <code>'NO-GO'</code>.</li>
</ol>
<p>Mọi phần trăm làm tròn bằng <code>Math.round(x * 100) / 100</code>. Hàm không được sửa đầu vào.</p>`,
  },
  chucNangChinh: [
    { en: 'f1 Latest results, executed count and pass rate.', vi: 'f1 Kết quả mới nhất, số đã chạy và tỉ lệ đạt.' },
    { en: 'f2 Requirement and high-risk coverage through the traceability matrix.', vi: 'f2 Độ phủ yêu cầu và rủi ro cao qua ma trận truy vết.' },
    { en: 'f3 Open defects by severity, defect hot spots, stale tests.', vi: 'f3 Lỗi mở theo mức, điểm nóng lỗi, test cũ mòn.' },
    { en: 'f4 Exit-criteria evaluation: decision and reasons.', vi: 'f4 Đánh giá tiêu chí ra: quyết định và lý do.' },
  ],
  yeuCauChung: [{ en: 'Hidden checks change the sample data (extra runs, other limits, empty sets) — handle every rule, not just the sample.', vi: 'Kiểm ẩn đổi dữ liệu mẫu (thêm lần chạy, đổi ngưỡng, tập rỗng) — xử lý đủ mọi luật, không chỉ mẫu.' }],
  cayThuMuc: `src/
└── test-status.js   ← function testStatus(input)`,
  moHinh: {
    ten: 'Return value of testStatus',
    truong: [
      ['executed · passRate', 'number', { en: 'test cases whose latest result is PASS/FAIL · % PASS among them', vi: 'số test case có kết quả mới nhất PASS/FAIL · % PASS trong số đó' }],
      ['reqCoverage · highRiskCoverage', 'number', { en: '% requirements (all / High) linked to an executed test case', vi: '% yêu cầu (tất cả / High) nối với test đã chạy' }],
      ['openBySeverity', '{ Critical, Major, Minor, Trivial }', { en: 'open = not Closed and not Rejected', vi: 'mở = không Closed và không Rejected' }],
      ['hotSpots · staleTests', 'string[]', { en: 'Pareto 80% modules · test cases passing in their last N runs', vi: 'module Pareto 80% · test case đạt N lần cuối' }],
      ['decision · reasons', "'GO' | 'NO-GO' · string[]", { en: 'REQ_COVERAGE, HIGH_RISK_COVERAGE, OPEN_CRITICAL, OPEN_MAJOR (in this order)', vi: 'REQ_COVERAGE, HIGH_RISK_COVERAGE, OPEN_CRITICAL, OPEN_MAJOR (theo thứ tự)' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Execution status', vi: 'f1 Trạng thái thực thi' }, diem: 2, yeuCau: [{ en: 'Latest result wins; BLOCKED is not executed; rounding.', vi: 'Kết quả mới nhất thắng; BLOCKED không tính đã chạy; làm tròn.' }], hook: ['test monitoring'] },
    { ten: { en: 'f2 Coverage', vi: 'f2 Độ phủ' }, diem: 3, yeuCau: [{ en: 'Requirement and high-risk coverage, unknown ids ignored, empty set = 100.', vi: 'Độ phủ yêu cầu và rủi ro cao, bỏ mã lạ, tập rỗng = 100.' }], hook: ['traceability'] },
    { ten: { en: 'f3 Defects and principles', vi: 'f3 Lỗi và nguyên tắc' }, diem: 3, yeuCau: [{ en: 'Open defects by severity, hot spots (clustering), stale tests (pesticide paradox).', vi: 'Lỗi mở theo mức, điểm nóng (phân cụm), test cũ mòn (thuốc trừ sâu).' }], hook: ['defect clustering', 'pesticide paradox'] },
    { ten: { en: 'f4 Exit criteria', vi: 'f4 Tiêu chí ra' }, diem: 2, yeuCau: [{ en: 'Inclusive limits, reasons in order, input untouched.', vi: 'Ngưỡng tính cả biên, lý do đúng thứ tự, không sửa đầu vào.' }], hook: ['test control'] },
  ],
  idBatBuoc: [['testStatus(input)', 'src/test-status.js']],
  truDiem: [
    { en: 'Using the FIRST result of a test case instead of the latest.', vi: 'Dùng kết quả ĐẦU TIÊN của test case thay vì mới nhất.' },
    { en: 'Treating Fixed defects as closed — a fix is not confirmed until re-tested.', vi: 'Coi lỗi Fixed là đã đóng — bản sửa chưa được xác nhận khi chưa test lại.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-1-deep-test-monitoring-engine',
  ten: 'Deep Lab 1 — Build the Engine of Test Monitoring and Control',
  moTaModule: 'Deep Lab chương 1: tự viết testStatus — kết quả mới nhất, độ phủ yêu cầu/rủi ro cao qua ma trận truy vết, lỗi mở theo mức, điểm nóng lỗi (phân cụm), test cũ mòn (thuốc trừ sâu), quyết định GO/NO-GO; kiểm ẩn đổi dữ liệu.',
  khoa: KHOA,
  baiHoc: 'swt301-test-process',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 1 — Build the Engine of Test Monitoring and Control',
    doKho: 'HARD', phut: 120, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'testStatus(sample)', output: "{ executed: 3, passRate: 66.67, reqCoverage: 66.67, highRiskCoverage: 100, openBySeverity: { Critical: 1, Major: 2, Minor: 1, Trivial: 1 }, hotSpots: ['booking', 'cancel', 'auth'], staleTests: ['TC1'], decision: 'NO-GO', reasons: ['REQ_COVERAGE', 'OPEN_CRITICAL'] }", explanation: 'Latest results: TC1 PASS, TC2 PASS, TC3 BLOCKED, TC4 FAIL, TC5 BLOCKED, TC6/TC7 never run ⇒ 3 executed, 2 pass.|||Kết quả mới nhất: TC1 PASS, TC2 PASS, TC3 BLOCKED, TC4 FAIL, TC5 BLOCKED, TC6/TC7 chưa chạy ⇒ 3 đã chạy, 2 đạt.' }],
    khaiNiem: ['test monitoring', 'test control', 'exit criteria', 'traceability', 'defect clustering', 'pesticide paradox'],
    tienQuyet: ['SWT301 lessons 1.3–1.4'],
    the: ['swt301', 'deep-lab', 'test-management'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'test monitoring / test control', vi: 'giám sát test / kiểm soát test' }, { en: 'latest result', vi: 'kết quả mới nhất' }, { en: 'blocked test', vi: 'test bị chặn — không chạy được' }, { en: 'stale test', vi: 'test cũ mòn — lâu không tìm ra lỗi' }, { en: 'dashboard', vi: 'bảng số liệu tổng hợp' }],
    goiY: [
      'Bước 1: duyệt runs một lần, ghi last[tc] = result (mục sau đè mục trước).',
      'Độ phủ: tập yêu cầu cần phủ (Set) ∩ yêu cầu chạm bởi test đã chạy; nhớ bỏ mã lạ.',
      'staleTests: gom kết quả theo tc rồi lấy slice(-staleAfter).',
      'Đừng sort trực tiếp input — dùng Object.entries / bản sao.',
    ],
    loiHayGap: ['Đếm BLOCKED là đã chạy.', 'Dùng > thay vì ≥ cho ngưỡng độ phủ (và < thay vì ≤ cho lỗi mở).', 'Tính hotSpots chỉ trên lỗi mở.', 'Coi Fixed là đã đóng.'],
    moTaNgan: 'Deep Lab chương 1: bộ máy giám sát & kiểm soát test.',
    giaiThich: {
      en: '<p>Sample: latest results TC1 PASS, TC2 PASS, TC3 BLOCKED, TC4 FAIL, TC5 BLOCKED ⇒ executed 3, pass rate 66.67. Executed tests touch R1–R4 ⇒ 4/6 = 66.67%, all three high-risk requirements ⇒ 100%. Open: Critical 1 (D3), Major 2 (D2, D7), Minor 1 (D4 Fixed), Trivial 1 (D6 Reopened). All defects: booking 4, cancel 2, auth 1, ui 1 ⇒ 4/8, 6/8, 7/8 ≥ 80% ⇒ booking, cancel, auth. TC1 passed in its last 3 runs ⇒ stale. 66.67 < 80 and 1 open Critical > 0 ⇒ NO-GO.</p>',
      vi: '<p>Lời giải tham chiếu: một vòng tính kết quả mới nhất, dùng chung cho executed/passRate/độ phủ; lỗi mở loại Closed/Rejected; hotSpots theo Pareto 80% trên mọi lỗi; staleTests theo N lần cuối; lý do theo thứ tự cố định.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['src/test-status.js'], kiem: KIEM },
    khoiDau: { 'src/test-status.js': DAU },
    loiGiai: { 'src/test-status.js': GIAI },
    boYeu: [
      { ten: 'kết quả đầu tiên thay vì mới nhất', tep: { 'src/test-status.js': GIAI.replace('for (const r of runs) last[r.tc] = r.result;', 'for (const r of runs) if (!(r.tc in last)) last[r.tc] = r.result;') }, phaiTruot: ['f1 — the latest result wins', 'f1 — a later BLOCKED'] },
      { ten: 'ngưỡng không tính biên', tep: { 'src/test-status.js': GIAI.replace('reqCoverage < exit.minReqCoverage', 'reqCoverage <= exit.minReqCoverage') }, phaiTruot: ['f4 — limits are inclusive'] },
      { ten: 'Fixed coi là đóng', tep: { 'src/test-status.js': GIAI.replace("['CLOSED', 'REJECTED']", "['CLOSED', 'REJECTED', 'FIXED']") }, phaiTruot: ['f3 — openBySeverity'] },
    ],
  }],
});
