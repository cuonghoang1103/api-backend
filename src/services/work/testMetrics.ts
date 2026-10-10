/**
 * CT Work đợt 6 — TST-1: SỐ ĐO KIỂM THỬ, ƯỚC LƯỢNG, KIỂM THỬ THEO RỦI RO, TIÊU CHÍ VÀO/RA, TEST SUMMARY REPORT (IEEE 829).
 * Hàm thuần — test được không cần DB; testMgmt.service.ts gom dữ liệu rồi gọi.
 *
 * Định nghĩa (ghi rõ để báo cáo khớp số, theo ISTQB CTFL 4.0 ch.5 + SWT301 Ch7):
 *   - pass rate của vòng   = PASS / số lần chạy ĐÃ THỰC THI (PASS+FAIL+BLOCKED) — TODO/SKIP không tính.
 *   - execution progress   = đã thực thi / tổng lần chạy trong vòng.
 *   - retest rate          = số test case được chạy lại ở vòng SAU sau khi FAIL ở vòng trước (hoặc đang RETEST)
 *                            / số test case từng FAIL.
 *   - leakage (defect)     = bug phát hiện ở pha nghiệm thu (activity AT) / tổng bug có pha phát hiện.
 *     DRE = 1 − leakage.
 *   - độ phủ yêu cầu       = REQ có ≥1 test liên kết (TESTS) / tổng REQ; "đã xác minh" = REQ có test PASS ở lần chạy mới nhất.
 */

export const TEST_LEVELS = ['COMPONENT', 'INTEGRATION', 'SYSTEM', 'ACCEPTANCE'] as const;
export const TEST_TYPES = ['FUNCTIONAL', 'NON_FUNCTIONAL', 'STRUCTURAL', 'CONFIRMATION', 'REGRESSION', 'SMOKE'] as const;
export const ROOT_CAUSES = ['REQUIREMENT', 'DESIGN', 'CODING', 'ENVIRONMENT', 'DATA', 'TEST', 'THIRD_PARTY', 'OTHER'] as const;
export const PHASES = ['REQUIREMENT', 'DESIGN', 'CODING', 'UNIT_TEST', 'INTEGRATION', 'SYSTEM_TEST', 'ACCEPTANCE', 'PRODUCTION'] as const;
export type TestLevel = (typeof TEST_LEVELS)[number];

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);

// ─── Số đo vòng chạy ─────────────────────────────────────────────

export interface RunRow { cycleId: number; testCaseId: number; status: string; executedAt: Date | null }
export interface CycleRow { id: number; name: string; state: string; startAt: Date | null; endAt: Date | null; createdAt: Date }

export const EXECUTED = new Set(['PASS', 'FAIL', 'BLOCKED']);

export function cycleStats(cycles: CycleRow[], runs: RunRow[]) {
  return [...cycles].sort((a, b) => +(a.startAt ?? a.createdAt) - +(b.startAt ?? b.createdAt)).map((c, i) => {
    const rs = runs.filter((r) => r.cycleId === c.id);
    const n = (s: string) => rs.filter((r) => r.status === s).length;
    const executed = rs.filter((r) => EXECUTED.has(r.status)).length;
    return {
      cycleId: c.id, round: i + 1, name: c.name, state: c.state, total: rs.length, executed,
      pass: n('PASS'), fail: n('FAIL'), blocked: n('BLOCKED'), retest: n('RETEST'), todo: n('TODO') + n('IN_PROGRESS'), skip: n('SKIP'),
      passRate: pct(n('PASS'), executed), progress: pct(executed, rs.length),
    };
  });
}

/** Retest rate: case FAIL ở vòng k rồi được chạy lại (thực thi) ở vòng > k, hoặc đang RETEST. */
export function retestStats(cycles: CycleRow[], runs: RunRow[]) {
  const order = new Map([...cycles].sort((a, b) => +(a.startAt ?? a.createdAt) - +(b.startAt ?? b.createdAt)).map((c, i) => [c.id, i]));
  const byCase = new Map<number, RunRow[]>();
  for (const r of runs) { if (!byCase.has(r.testCaseId)) byCase.set(r.testCaseId, []); byCase.get(r.testCaseId)!.push(r); }
  let failedEver = 0, retested = 0, fixedOnRetest = 0;
  for (const rs of byCase.values()) {
    const sorted = rs.sort((a, b) => (order.get(a.cycleId) ?? 0) - (order.get(b.cycleId) ?? 0));
    const firstFail = sorted.findIndex((r) => r.status === 'FAIL');
    if (firstFail < 0 && !sorted.some((r) => r.status === 'RETEST')) continue;
    failedEver++;
    const later = sorted.slice(firstFail < 0 ? 0 : firstFail + 1);
    if (sorted.some((r) => r.status === 'RETEST') || later.some((r) => EXECUTED.has(r.status))) retested++;
    if (later.some((r) => r.status === 'PASS')) fixedOnRetest++;
  }
  return { failedCases: failedEver, retested, fixedOnRetest, retestRate: pct(retested, failedEver), fixRate: pct(fixedOnRetest, retested) };
}

/** Đường S thực thi: số lần chạy đã thực thi cộng dồn theo ngày, so với kế hoạch tuyến tính từ startAt → endAt. */
export function sCurve(cycle: CycleRow, runs: RunRow[], today = new Date()) {
  const rs = runs.filter((r) => r.cycleId === cycle.id);
  const start = cycle.startAt ?? cycle.createdAt;
  const end = cycle.endAt ?? new Date(Math.max(+today, +start + 86400_000));
  const days = Math.max(1, Math.round((+end - +start) / 86400_000));
  const pts: Array<{ day: string; planned: number; actual: number | null }> = [];
  const executedAt = rs.filter((r) => EXECUTED.has(r.status) && r.executedAt).map((r) => +r.executedAt!).sort((a, b) => a - b);
  for (let d = 0; d <= Math.min(days, 120); d++) {
    const t = +start + d * 86400_000;
    const dayEnd = t + 86400_000;
    pts.push({
      day: new Date(t).toISOString().slice(0, 10),
      planned: Math.round((rs.length * d) / days),
      actual: t > +today ? null : executedAt.filter((x) => x < dayEnd).length,
    });
  }
  return pts;
}

// ─── Số đo defect ────────────────────────────────────────────────

export interface DefectRow {
  severity: string | null; activity: string | null; module: string | null; open: boolean; createdAt: Date; resolvedAt: Date | null;
  rootCause: string | null; injectedPhase: string | null; reopened: boolean;
}

export function defectStats(defects: DefectRow[]) {
  const count = <K extends string>(key: (d: DefectRow) => K | null, list = defects) => {
    const m = new Map<string, { total: number; open: number }>();
    for (const d of list) { const k = key(d) ?? '—'; const v = m.get(k) ?? { total: 0, open: 0 }; v.total++; if (d.open) v.open++; m.set(k, v); }
    return [...m.entries()].map(([k, v]) => ({ key: k, ...v })).sort((a, b) => b.total - a.total);
  };
  const withPhase = defects.filter((d) => d.activity);
  const escaped = withPhase.filter((d) => d.activity === 'AT').length;
  const closed = defects.filter((d) => !d.open && d.resolvedAt);
  const ages = closed.map((d) => (+d.resolvedAt! - +d.createdAt) / 86400_000);
  return {
    total: defects.length, open: defects.filter((d) => d.open).length,
    bySeverity: count((d) => d.severity), byModule: count((d) => d.module), byActivity: count((d) => d.activity),
    byRootCause: count((d) => d.rootCause), byInjectedPhase: count((d) => d.injectedPhase),
    leakage: pct(escaped, withPhase.length), dre: withPhase.length ? Math.round((1 - escaped / withPhase.length) * 1000) / 10 : null,
    reopenRate: pct(defects.filter((d) => d.reopened).length, defects.length),
    avgAgeDays: ages.length ? Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10 : null,
  };
}

/** Bug mở/đóng theo ngày (đường đồ thị "defect arrival vs closure"). */
export function defectTrend(defects: DefectRow[], days = 30, today = new Date()) {
  const start = new Date(today); start.setUTCHours(0, 0, 0, 0); start.setUTCDate(start.getUTCDate() - days + 1);
  return Array.from({ length: days }, (_, i) => {
    const d0 = +start + i * 86400_000, d1 = d0 + 86400_000;
    return {
      day: new Date(d0).toISOString().slice(0, 10),
      opened: defects.filter((d) => +d.createdAt >= d0 && +d.createdAt < d1).length,
      closed: defects.filter((d) => d.resolvedAt && +d.resolvedAt >= d0 && +d.resolvedAt < d1).length,
      openTotal: defects.filter((d) => +d.createdAt < d1 && (!d.resolvedAt || +d.resolvedAt >= d1)).length,
    };
  });
}

// ─── Kiểm thử theo rủi ro ────────────────────────────────────────

export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/** Ma trận 5×5 khả năng × tác động ⇒ mức (1–4 thấp · 5–9 vừa · 10–16 cao · 20–25 nghiêm trọng). */
export function riskLevel(likelihood: number | null, impact: number | null): { score: number | null; level: RiskLevel | null } {
  if (!likelihood || !impact) return { score: null, level: null };
  const score = likelihood * impact;
  return { score, level: score >= 20 ? 'CRITICAL' : score >= 10 ? 'HIGH' : score >= 5 ? 'MEDIUM' : 'LOW' };
}

/** Mức rủi ro ⇒ ưu tiên + độ sâu kiểm thử (ISTQB 5.2.3 "risk-based testing"). */
export const RISK_TEST_POLICY: Record<RiskLevel, { priority: 'P1' | 'P2' | 'P3' | 'P4'; depth: string; techniques: string[]; order: number }> = {
  CRITICAL: { priority: 'P1', depth: 'Exhaustive: every cycle, first, independent review', techniques: ['EP_BVA', 'DECISION_TABLE', 'STATE_TRANSITION', 'EXPLORATORY'], order: 1 },
  HIGH: { priority: 'P2', depth: 'Thorough: every cycle, formal techniques + negative tests', techniques: ['EP_BVA', 'DECISION_TABLE', 'STATE_TRANSITION'], order: 2 },
  MEDIUM: { priority: 'P3', depth: 'Standard: main + alternative flows, regression on change', techniques: ['EP_BVA', 'PAIRWISE'], order: 3 },
  LOW: { priority: 'P4', depth: 'Light: smoke / exploratory when time allows', techniques: ['EXPLORATORY'], order: 4 },
};

// ─── Ước lượng test ──────────────────────────────────────────────

export interface EstimationInput {
  method: 'TEST_CASES' | 'FUNCTION_POINTS';
  /** TEST_CASES: số TC (mặc định = số TC hiện có); FUNCTION_POINTS: số điểm chức năng */
  size: number;
  /** TC thiết kế được / người-ngày */
  designPerDay: number;
  /** TC thực thi được / người-ngày */
  executePerDay: number;
  cycles: number;
  /** % TC phải chạy lại (retest/regression) mỗi vòng sau vòng 1 */
  retestPct: number;
  /** % công quản lý/báo cáo/môi trường cộng thêm */
  overheadPct: number;
  testers: number;
  hoursPerDay: number;
}

export const DEFAULT_ESTIMATION: EstimationInput = { method: 'TEST_CASES', size: 0, designPerDay: 25, executePerDay: 40, cycles: 2, retestPct: 30, overheadPct: 20, testers: 1, hoursPerDay: 8 };

/** TC từ điểm chức năng: quy tắc Capers Jones TC ≈ FP^1.2. */
export const tcFromFp = (fp: number) => Math.round(Math.max(0, fp) ** 1.2);

export function estimateTesting(raw: Partial<EstimationInput>) {
  const p = { ...DEFAULT_ESTIMATION, ...raw };
  const tc = p.method === 'FUNCTION_POINTS' ? tcFromFp(p.size) : Math.max(0, Math.round(p.size));
  const design = p.designPerDay > 0 ? tc / p.designPerDay : 0;
  const executions = tc * (1 + Math.max(0, p.cycles - 1) * (p.retestPct / 100));
  const execute = p.executePerDay > 0 ? executions / p.executePerDay : 0;
  const base = design + execute;
  const overhead = base * (p.overheadPct / 100);
  const total = base + overhead;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return {
    params: p, testCases: tc, executions: Math.round(executions),
    effort: { designDays: r1(design), executeDays: r1(execute), overheadDays: r1(overhead), totalDays: r1(total), totalHours: r1(total * p.hoursPerDay) },
    durationDays: r1(total / Math.max(1, p.testers)),
    formula: p.method === 'FUNCTION_POINTS'
      ? `TC = FP^1.2 = ${p.size}^1.2 ≈ ${tc}; effort = TC/${p.designPerDay} + TC×(1+(${p.cycles}−1)×${p.retestPct}%)/${p.executePerDay}, +${p.overheadPct}% overhead`
      : `effort = ${tc}/${p.designPerDay} + ${tc}×(1+(${p.cycles}−1)×${p.retestPct}%)/${p.executePerDay}, +${p.overheadPct}% overhead`,
  };
}

// ─── Tiêu chí ra (exit criteria) ─────────────────────────────────

export interface ExitCriteria { passRate?: number | null; maxOpenCritical?: number | null; maxOpenMajor?: number | null; reqCoverage?: number | null; minExecuted?: number | null }
export const DEFAULT_CRITERIA: Required<ExitCriteria> = { passRate: 95, maxOpenCritical: 0, maxOpenMajor: 2, reqCoverage: 100, minExecuted: 100 };

export function evaluateExit(c: ExitCriteria, actual: { passRate: number | null; openCritical: number; openMajor: number; reqCoverage: number | null; executed: number | null }) {
  const k = { ...DEFAULT_CRITERIA } as Record<keyof ExitCriteria, number>;
  for (const [key, v] of Object.entries(c) as Array<[keyof ExitCriteria, number | null | undefined]>) if (typeof v === 'number') k[key] = v;
  const rows = [
    { key: 'passRate', target: `≥ ${k.passRate}%`, actual: actual.passRate == null ? '—' : `${actual.passRate}%`, met: actual.passRate != null && actual.passRate >= k.passRate },
    { key: 'executed', target: `≥ ${k.minExecuted}%`, actual: actual.executed == null ? '—' : `${actual.executed}%`, met: actual.executed != null && actual.executed >= k.minExecuted },
    { key: 'openCritical', target: `≤ ${k.maxOpenCritical}`, actual: String(actual.openCritical), met: actual.openCritical <= k.maxOpenCritical },
    { key: 'openMajor', target: `≤ ${k.maxOpenMajor}`, actual: String(actual.openMajor), met: actual.openMajor <= k.maxOpenMajor },
    { key: 'reqCoverage', target: `≥ ${k.reqCoverage}%`, actual: actual.reqCoverage == null ? '—' : `${actual.reqCoverage}%`, met: actual.reqCoverage != null && actual.reqCoverage >= k.reqCoverage },
  ];
  return { criteria: k, rows, met: rows.every((r) => r.met) };
}

// ─── Test Summary Report (IEEE 829-2008 §11 / ISO 29119-3) ───────

export interface TsrData {
  language: 'vi' | 'en';
  project: { name: string; key: string };
  planName: string | null;
  identifier: string;
  preparedBy: string;
  date: Date;
  scopeIn: string; scopeOut: string; environment: string;
  cycles: ReturnType<typeof cycleStats>;
  retest: ReturnType<typeof retestStats>;
  defects: ReturnType<typeof defectStats>;
  coverage: { requirements: number; covered: number; verified: number; pct: number | null; verifiedPct: number | null };
  exit: ReturnType<typeof evaluateExit>;
  variances: string;
  risks: Array<{ key: string; title: string; level: string | null; tests: number }>;
  openCritical: Array<{ key: string; title: string; severity: string | null }>;
  approvers: Array<{ name: string; role: string }>;
  levels: Array<{ level: string; cases: number }>;
  exploratory: { sessions: number; bugs: number; minutes: number };
}

const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');

export function tsrMarkdown(d: TsrData): string {
  const vi = d.language === 'vi';
  const T = (en: string, v: string) => (vi ? v : en);
  const last = d.cycles[d.cycles.length - 1];
  const totals = d.cycles.reduce((a, c) => ({ total: a.total + c.total, executed: a.executed + c.executed, pass: a.pass + c.pass, fail: a.fail + c.fail, blocked: a.blocked + c.blocked }), { total: 0, executed: 0, pass: 0, fail: 0, blocked: 0 });
  const recommendation = d.exit.met
    ? T('All exit criteria are met — testing can be closed and the build is recommended for release.', 'Mọi tiêu chí kết thúc đã đạt — có thể đóng kiểm thử và đề xuất phát hành bản build.')
    : T(`Exit criteria NOT met (${d.exit.rows.filter((r) => !r.met).map((r) => r.key).join(', ')}) — continue testing / fix before release, or record an approved deviation.`, `CHƯA đạt tiêu chí kết thúc (${d.exit.rows.filter((r) => !r.met).map((r) => r.key).join(', ')}) — tiếp tục kiểm thử / sửa lỗi trước khi phát hành, hoặc ghi nhận sai lệch được phê duyệt.`);
  const L: string[] = [];
  L.push(`# ${T('Test Summary Report', 'Báo cáo tổng kết kiểm thử')} — ${d.project.name}`);
  L.push('');
  L.push(`| ${T('Field', 'Mục')} | ${T('Value', 'Giá trị')} |`, '|---|---|');
  L.push(`| ${T('Identifier', 'Mã tài liệu')} | ${esc(d.identifier)} |`);
  L.push(`| ${T('Project', 'Dự án')} | ${esc(d.project.name)} (${d.project.key}) |`);
  L.push(`| ${T('Test plan', 'Kế hoạch kiểm thử')} | ${esc(d.planName ?? T('All tests', 'Toàn bộ test'))} |`);
  L.push(`| ${T('Prepared by', 'Người lập')} | ${esc(d.preparedBy)} |`);
  L.push(`| ${T('Date', 'Ngày')} | ${d.date.toISOString().slice(0, 10)} |`);
  L.push('');
  L.push(`## 1. ${T('Introduction & scope', 'Giới thiệu & phạm vi')}`);
  L.push(`**${T('In scope', 'Trong phạm vi')}:** ${d.scopeIn || T('All features covered by the test plan.', 'Mọi tính năng thuộc kế hoạch kiểm thử.')}`);
  L.push('');
  L.push(`**${T('Out of scope', 'Ngoài phạm vi')}:** ${d.scopeOut || '—'}`);
  L.push('');
  L.push(`**${T('Test environment', 'Môi trường kiểm thử')}:** ${d.environment || '—'}`);
  L.push('');
  L.push(`## 2. ${T('Summary of results', 'Tóm tắt kết quả')}`);
  L.push(T(
    `${totals.executed} of ${totals.total} test executions run across ${d.cycles.length} cycle(s); latest cycle pass rate ${last?.passRate ?? '—'}%. ${d.defects.total} defects logged, ${d.defects.open} still open.`,
    `Đã thực thi ${totals.executed}/${totals.total} lượt chạy qua ${d.cycles.length} vòng; tỷ lệ đạt vòng gần nhất ${last?.passRate ?? '—'}%. Ghi nhận ${d.defects.total} lỗi, còn mở ${d.defects.open}.`,
  ));
  L.push('');
  L.push(`| ${T('Round', 'Vòng')} | ${T('Cycle', 'Đợt chạy')} | ${T('Total', 'Tổng')} | ${T('Executed', 'Đã chạy')} | Pass | Fail | Blocked | ${T('Pass rate', 'Tỷ lệ đạt')} |`, '|---|---|---|---|---|---|---|---|');
  for (const c of d.cycles) L.push(`| ${c.round} | ${esc(c.name)} | ${c.total} | ${c.executed} | ${c.pass} | ${c.fail} | ${c.blocked} | ${c.passRate ?? '—'}% |`);
  L.push('');
  if (d.levels.length) {
    L.push(`| ${T('Test level', 'Cấp kiểm thử')} | ${T('Test cases', 'Số test case')} |`, '|---|---|');
    for (const l of d.levels) L.push(`| ${l.level} | ${l.cases} |`);
    L.push('');
  }
  L.push(`## 3. ${T('Variances', 'Sai lệch so với kế hoạch')}`);
  L.push(d.variances || T('No variances from the test plan were recorded.', 'Không ghi nhận sai lệch so với kế hoạch kiểm thử.'));
  L.push('');
  L.push(`## 4. ${T('Comprehensiveness assessment', 'Đánh giá độ bao phủ')}`);
  L.push(T(
    `Requirement coverage: ${d.coverage.covered}/${d.coverage.requirements} requirements have at least one test (${d.coverage.pct ?? '—'}%); ${d.coverage.verified} verified by a passing latest run (${d.coverage.verifiedPct ?? '—'}%).`,
    `Độ phủ yêu cầu: ${d.coverage.covered}/${d.coverage.requirements} yêu cầu có ít nhất một test (${d.coverage.pct ?? '—'}%); ${d.coverage.verified} đã được xác minh bằng lần chạy gần nhất đạt (${d.coverage.verifiedPct ?? '—'}%).`,
  ));
  if (d.exploratory.sessions) L.push('', T(`Exploratory testing: ${d.exploratory.sessions} session(s), ${d.exploratory.minutes} minutes, ${d.exploratory.bugs} bug(s) found.`, `Kiểm thử thăm dò: ${d.exploratory.sessions} phiên, ${d.exploratory.minutes} phút, tìm ra ${d.exploratory.bugs} lỗi.`));
  if (d.risks.length) {
    L.push('', `| ${T('Product risk', 'Rủi ro sản phẩm')} | ${T('Level', 'Mức')} | ${T('Linked tests', 'Test liên kết')} |`, '|---|---|---|');
    for (const r of d.risks) L.push(`| ${r.key} ${esc(r.title)} | ${r.level ?? '—'} | ${r.tests} |`);
  }
  L.push('');
  L.push(`## 5. ${T('Defect summary & metrics', 'Tổng hợp lỗi & số đo')}`);
  L.push(`| ${T('Severity', 'Mức nghiêm trọng')} | ${T('Total', 'Tổng')} | ${T('Open', 'Còn mở')} |`, '|---|---|---|');
  for (const s of d.defects.bySeverity) L.push(`| ${s.key} | ${s.total} | ${s.open} |`);
  L.push('');
  L.push(`| ${T('Metric', 'Số đo')} | ${T('Value', 'Giá trị')} |`, '|---|---|');
  L.push(`| ${T('Retest rate', 'Tỷ lệ chạy lại')} | ${d.retest.retestRate ?? '—'}% (${d.retest.retested}/${d.retest.failedCases}) |`);
  L.push(`| ${T('Fixed on retest', 'Đạt khi chạy lại')} | ${d.retest.fixRate ?? '—'}% |`);
  L.push(`| ${T('Defect leakage to acceptance', 'Lỗi lọt sang nghiệm thu')} | ${d.defects.leakage ?? '—'}% |`);
  L.push(`| DRE | ${d.defects.dre ?? '—'}% |`);
  L.push(`| ${T('Reopen rate', 'Tỷ lệ mở lại')} | ${d.defects.reopenRate ?? '—'}% |`);
  L.push(`| ${T('Average defect age (days)', 'Tuổi lỗi trung bình (ngày)')} | ${d.defects.avgAgeDays ?? '—'} |`);
  if (d.openCritical.length) {
    L.push('', `**${T('Open critical/major defects', 'Lỗi Critical/Major còn mở')}:**`, '');
    for (const b of d.openCritical) L.push(`- ${b.key} [${b.severity ?? '—'}] ${b.title}`);
  }
  L.push('');
  L.push(`## 6. ${T('Exit criteria evaluation', 'Đánh giá tiêu chí kết thúc')}`);
  L.push(`| ${T('Criterion', 'Tiêu chí')} | ${T('Target', 'Mục tiêu')} | ${T('Actual', 'Thực tế')} | ${T('Met', 'Đạt')} |`, '|---|---|---|---|');
  const label: Record<string, [string, string]> = {
    passRate: ['Pass rate (latest cycle)', 'Tỷ lệ đạt (vòng gần nhất)'], executed: ['Executed (latest cycle)', 'Đã thực thi (vòng gần nhất)'],
    openCritical: ['Open Critical defects', 'Lỗi Critical còn mở'], openMajor: ['Open Major defects', 'Lỗi Major còn mở'], reqCoverage: ['Requirement coverage', 'Độ phủ yêu cầu'],
  };
  for (const r of d.exit.rows) L.push(`| ${T(...label[r.key])} | ${r.target} | ${r.actual} | ${r.met ? '✓' : '✗'} |`);
  L.push('');
  L.push(`## 7. ${T('Evaluation & recommendation', 'Đánh giá & đề xuất')}`);
  L.push(recommendation);
  L.push('');
  L.push(`## 8. ${T('Approvals', 'Phê duyệt')}`);
  L.push(`| ${T('Name', 'Họ tên')} | ${T('Role', 'Vai trò')} | ${T('Signature', 'Chữ ký')} | ${T('Date', 'Ngày')} |`, '|---|---|---|---|');
  for (const a of d.approvers.length ? d.approvers : [{ name: '', role: T('Test manager', 'Trưởng nhóm kiểm thử') }, { name: '', role: T('Project manager', 'Quản lý dự án') }]) L.push(`| ${esc(a.name)} | ${esc(a.role)} | | |`);
  return L.join('\n');
}
