/**
 * CT Work đợt 6 — TST-1 QUẢN LÝ TEST CHUYÊN SÂU (T1, T5–T9, T12, B2, B6, B9) + phiên kiểm thử thăm dò.
 *
 *   - Thiết kế test có công cụ (testDesign.ts): lưu bảng thiết kế, sinh case, đổ vào Xray (thẻ Test + bước, liên kết
 *     TESTS tới yêu cầu) hoặc ma trận 5.1 (một hàm mới, UTCID theo case).
 *   - Thuộc tính test case: cấp / loại / kỹ thuật / phút ước lượng (T1, T5).
 *   - Kế hoạch có cấu trúc IEEE 829 + tiêu chí ra tự đánh giá + tham số ước lượng (T6, T5).
 *   - Giám sát & kiểm soát: pass rate theo vòng, đường S, defect theo severity/module/root cause, leakage, retest rate,
 *     độ phủ yêu cầu (T7, T8, B9).
 *   - Kiểm thử theo rủi ro: RAID RISK (PRODUCT) khả năng × tác động ⇒ mức ⇒ ưu tiên/độ sâu, liên kết REQ/TEST (T9).
 *   - Test Summary Report IEEE 829 tự điền, xuất docx/pdf (B6); báo cáo lỗi Lab 2.5 theo người (T12).
 *   - Phiên exploratory: charter, hộp thời gian, ghi chú theo thời gian, ghi chú ⇒ Bug.
 *
 * Quyền: đọc = project.view + người của đội (khách ⇒ 403); ghi = issue.edit; tạo Bug = issue.create.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { nextNumber } from './governanceDb.js';
import { isClientScoped, requireProject, type ProjectAccess } from './permissions.js';
import { projectLanguage } from './projectLanguage.js';
import { generateDesign, toUnitMatrix, toXray, type DesignCase, type Technique, TECHNIQUE_SHORT } from './testDesign.js';
import {
  cycleStats, defectStats, defectTrend, DEFAULT_CRITERIA, DEFAULT_ESTIMATION, estimateTesting, evaluateEntry, evaluateExit, isLeakage, normalizeEntry,
  retestStats, riskLevel, RISK_TEST_POLICY, sCurve, SUGGESTED_ENTRY, tsrMarkdown, type DefectRow, type EntryCriterion, type EstimationInput, type ExitCriteria,
} from './testMetrics.js';
import { qualitySettingsOf, type TestGateMode } from './qualitySettings.js';
import { trashGraph } from './trashBin.service.js'; // 22/10/2026: thùng rác dữ liệu 30 ngày

type Tx = Prisma.TransactionClient;

async function ctx(userId: number, projectId: number, action: 'project.view' | 'issue.edit' | 'issue.create' = 'project.view'): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, action);
  if (isClientScoped(access) || access.role === 'CLIENT') throw new AppError('This part of the project is only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  return access;
}

async function nextNo(tx: Tx, table: 'design' | 'explore', projectId: number) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${table === 'design' ? 31063 : 31064}::int, ${projectId}::int)`;
  const agg = table === 'design'
    ? await tx.workTestDesign.aggregate({ where: { projectId }, _max: { number: true } })
    : await tx.workExploratorySession.aggregate({ where: { projectId }, _max: { number: true } });
  return (agg._max.number ?? 0) + 1;
}

// ═══ THIẾT KẾ TEST (B2) ══════════════════════════════════════════

const designView = (d: { number: number; name: string; technique: string; requirementKey: string | null; input: unknown; cases: unknown; exported: unknown; createdAt: Date; updatedAt: Date }) => ({
  number: d.number, key: `TD-${d.number}`, name: d.name, technique: d.technique, requirementKey: d.requirementKey,
  input: d.input, cases: d.cases as DesignCase[], exported: d.exported as unknown[], createdAt: d.createdAt, updatedAt: d.updatedAt,
});

/** Sinh thử (không lưu) — giao diện gọi mỗi lần sửa mô hình. Lỗi dữ liệu ⇒ 400 có thông điệp đọc được. */
export function previewDesign(technique: Technique, input: unknown) {
  try {
    return generateDesign(technique, input);
  } catch (err) {
    const msg = err instanceof Error && 'issues' in err ? (err as { issues: Array<{ path: unknown[]; message: string }> }).issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') : (err as Error).message;
    throw new BadRequestError(msg || 'Invalid design input', 'WORK_DESIGN_INVALID');
  }
}

export async function listDesigns(userId: number, projectId: number) {
  await ctx(userId, projectId);
  const rows = await prisma.workTestDesign.findMany({ where: { projectId }, orderBy: { number: 'desc' }, take: 300 });
  return rows.map((d) => ({ ...designView(d), input: undefined, caseCount: (d.cases as unknown[]).length, cases: undefined }));
}

export async function getDesign(userId: number, projectId: number, number: number) {
  await ctx(userId, projectId);
  const d = await prisma.workTestDesign.findFirst({ where: { projectId, number } });
  if (!d) throw new NotFoundError('Test design not found');
  return { ...designView(d), result: previewDesign(d.technique as Technique, d.input) };
}

export async function saveDesign(userId: number, projectId: number, input: { number?: number | null; name: string; technique: Technique; requirementKey?: string | null; input: unknown }) {
  await ctx(userId, projectId, 'issue.edit');
  const result = previewDesign(input.technique, input.input);
  const data = { name: input.name.trim().slice(0, 160), technique: input.technique, requirementKey: input.requirementKey?.trim() || null, input: input.input as Prisma.InputJsonValue, cases: result.cases as unknown as Prisma.InputJsonValue };
  let number = input.number ?? null;
  if (number) {
    const r = await prisma.workTestDesign.updateMany({ where: { projectId, number }, data });
    if (!r.count) throw new NotFoundError('Test design not found');
  } else {
    number = await prisma.$transaction(async (tx) => {
      const n = await nextNo(tx, 'design', projectId);
      await tx.workTestDesign.create({ data: { ...data, projectId, number: n, createdById: userId } });
      return n;
    });
  }
  return getDesign(userId, projectId, number);
}

export async function deleteDesign(userId: number, projectId: number, number: number) {
  await ctx(userId, projectId, 'issue.edit');
  // 22/10/2026: thiết kế test vào thùng rác 30 ngày trước khi xoá.
  const trashId = await prisma.$transaction(async (tx) => {
    const d = await tx.workTestDesign.findFirst({ where: { projectId, number }, select: { id: true, name: true } });
    if (!d) return null;
    const t = await trashGraph(tx, { projectId, userId, kind: 'graph.work_test_designs', label: `Test design TD-${number} "${d.name}"`, roots: [{ table: 'work_test_designs', ids: [d.id] }] });
    await tx.workTestDesign.deleteMany({ where: { projectId, number } });
    return t.trashId;
  });
  return { ok: true, trashId };
}

/** Đổ case vào Xray (thẻ Test) hoặc ma trận 5.1 (hàm mới). `caseIds` rỗng ⇒ mọi case. */
export async function exportDesign(
  userId: number, projectId: number, number: number,
  input: { target: 'XRAY' | 'UNIT'; caseIds?: string[]; level?: string | null; testType?: string | null; moduleName?: string | null; methodName?: string | null },
) {
  const access = await ctx(userId, projectId, 'issue.edit');
  const d = await prisma.workTestDesign.findFirst({ where: { projectId, number } });
  if (!d) throw new NotFoundError('Test design not found');
  const all = previewDesign(d.technique as Technique, d.input).cases;
  const cases = input.caseIds?.length ? all.filter((c) => input.caseIds!.includes(c.id)) : all;
  if (!cases.length) throw new BadRequestError('No cases selected', 'VALIDATION_ERROR');
  let record: Record<string, unknown>;
  if (input.target === 'XRAY') {
    const { createTest } = await import('./tests.service.js');
    if (cases.length > 200) throw new BadRequestError('Send at most 200 cases to the test library at a time', 'WORK_LIMIT');
    const created: number[] = [];
    const failed: Array<{ id: string; error: string }> = [];
    for (const c of cases) {
      const x = toXray(c, d.name);
      try {
        const r = await createTest(userId, projectId, { title: x.title, preconditions: x.preconditions, steps: x.steps, requirementKeys: d.requirementKey ? [d.requirementKey] : undefined });
        created.push(r.number);
      } catch (err) {
        failed.push({ id: c.id, error: (err as Error).message });
      }
    }
    if (created.length) {
      await prisma.workTestCase.updateMany({
        where: { issue: { projectId, number: { in: created } } },
        data: { technique: TECHNIQUE_SHORT[d.technique as Technique], level: input.level ?? null, testType: input.testType ?? null },
      });
    }
    record = { target: 'XRAY', at: new Date().toISOString(), numbers: created, keys: created.map((n) => `${access.key}-${n}`), failed };
  } else {
    const { createFunction, saveMatrix } = await import('./fptTests.service.js');
    const m = toUnitMatrix(cases);
    const fn = await createFunction(userId, projectId, {
      moduleName: (input.moduleName?.trim() || d.name).slice(0, 120), methodName: (input.methodName?.trim() || d.name.replace(/\W+/g, '') || 'function').slice(0, 120),
      description: `Generated from ${`TD-${d.number}`} (${TECHNIQUE_SHORT[d.technique as Technique]}) — ${d.name}`, testRequirement: d.requirementKey ?? null, starter: false,
    });
    await saveMatrix(userId, projectId, (fn as { id: number }).id, { rows: m.rows, cases: m.cases, marks: m.marks });
    record = { target: 'UNIT', at: new Date().toISOString(), functionId: (fn as { id: number }).id, cases: m.cases.length };
  }
  await prisma.workTestDesign.update({ where: { id: d.id }, data: { exported: [...(d.exported as unknown[]), record] as Prisma.InputJsonValue } });
  await auditProject(projectId, { actorId: userId, action: 'tests.design.export', targetType: 'testDesign', targetId: d.id, summary: `TD-${d.number}: ${cases.length} case(s) → ${input.target === 'XRAY' ? 'test library' : 'unit test 5.1'}` });
  return record;
}

// ═══ THUỘC TÍNH TEST CASE (T1, T5) ═══════════════════════════════

export async function caseAttributes(userId: number, projectId: number) {
  await ctx(userId, projectId);
  const rows = await prisma.workTestCase.findMany({
    where: { issue: { projectId, deletedAt: null } },
    select: { level: true, testType: true, technique: true, estimateMin: true, issue: { select: { number: true, title: true } } },
    orderBy: { issue: { number: 'asc' } }, take: 5000,
  });
  return rows.map((r) => ({ number: r.issue.number, title: r.issue.title, level: r.level, testType: r.testType, technique: r.technique, estimateMin: r.estimateMin }));
}

export async function setCaseAttributes(userId: number, projectId: number, numbers: number[], input: { level?: string | null; testType?: string | null; technique?: string | null; estimateMin?: number | null }) {
  await ctx(userId, projectId, 'issue.edit');
  const data: Prisma.WorkTestCaseUpdateManyMutationInput = {};
  for (const k of ['level', 'testType', 'technique', 'estimateMin'] as const) if (input[k] !== undefined) (data as Record<string, unknown>)[k] = input[k];
  const r = await prisma.workTestCase.updateMany({ where: { issue: { projectId, number: { in: numbers }, deletedAt: null } }, data });
  return { updated: r.count };
}

// ═══ KẾ HOẠCH IEEE 829 (T6) ══════════════════════════════════════

export interface PlanSettings {
  scopeIn?: string; scopeOut?: string; approach?: string; environment?: string; suspension?: string; resumption?: string;
  deliverables?: string; schedule?: string; risks?: string; variances?: string;
  criteria?: ExitCriteria; estimation?: Partial<EstimationInput>;
  /** dm5 G3 (D2): tiêu chí VÀO (bắt đầu vòng test) + version mà kế hoạch này kiểm (cổng Release đọc). */
  entry?: EntryCriterion[]; versionId?: number | null;
}

export async function getPlanSettings(userId: number, projectId: number, planId: number) {
  await ctx(userId, projectId);
  const p = await prisma.workTestPlan.findFirst({ where: { id: planId, projectId }, select: { id: true, name: true, settings: true } });
  if (!p) throw new NotFoundError('Test plan not found');
  const s = (p.settings ?? {}) as PlanSettings;
  let entry: EntryCriterion[] = [];
  try { entry = normalizeEntry(s.entry); } catch { entry = []; }
  return {
    id: p.id, name: p.name,
    settings: { ...s, entry, versionId: s.versionId ?? null, criteria: { ...DEFAULT_CRITERIA, ...(s.criteria ?? {}) }, estimation: { ...DEFAULT_ESTIMATION, ...(s.estimation ?? {}) } },
    suggestedEntry: SUGGESTED_ENTRY,
    gate: await planGate(prisma, projectId, p.id),
  };
}

export async function savePlanSettings(userId: number, projectId: number, planId: number, settings: PlanSettings) {
  await ctx(userId, projectId, 'issue.edit');
  const p = await prisma.workTestPlan.findFirst({ where: { id: planId, projectId }, select: { id: true, settings: true } });
  if (!p) throw new NotFoundError('Test plan not found');
  if (settings.entry !== undefined) {
    try { settings = { ...settings, entry: normalizeEntry(settings.entry) }; } catch (err) { throw new BadRequestError((err as Error).message, 'VALIDATION_ERROR'); }
  }
  if (settings.versionId !== undefined && settings.versionId !== null && !(await prisma.workVersion.count({ where: { id: settings.versionId, projectId } }))) {
    throw new BadRequestError('Version not found in this project', 'WORK_BAD_VERSION');
  }
  const merged = { ...((p.settings ?? {}) as PlanSettings), ...settings };
  await prisma.workTestPlan.update({ where: { id: p.id }, data: { settings: merged as Prisma.InputJsonValue } });
  return getPlanSettings(userId, projectId, planId);
}

// ═══ GIÁM SÁT & KIỂM SOÁT (T7, T8, B9) ═══════════════════════════

type Db = Tx | typeof prisma;

async function gather(projectId: number, planId: number | null, db: Db = prisma) {
  const plan = planId ? await db.workTestPlan.findFirst({ where: { id: planId, projectId }, select: { id: true, name: true, settings: true, cases: { select: { testCaseId: true } } } }) : null;
  if (planId && !plan) throw new NotFoundError('Test plan not found');
  const cycles = await db.workTestCycle.findMany({ where: { projectId, ...(plan ? { planId: plan.id } : {}) }, select: { id: true, name: true, state: true, startAt: true, endAt: true, createdAt: true } });
  const runs = cycles.length ? await db.workTestRun.findMany({ where: { cycleId: { in: cycles.map((c) => c.id) } }, select: { cycleId: true, testCaseId: true, status: true, executedAt: true } }) : [];
  const bugs = await db.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'BUG' } }, take: 5000,
    select: {
      id: true, number: true, title: true, createdAt: true, resolvedAt: true, defectInfo: true,
      components: { select: { component: { select: { name: true } } }, take: 1 },
      parent: { select: { title: true } },
      labels: { select: { label: { select: { name: true } } } },
    },
  });
  // Mở lại = lịch sử trạng thái có lần đi khỏi DONE (resolution bị xoá).
  const reopenedIds = new Set((await db.workHistory.findMany({ where: { issueId: { in: bugs.map((b) => b.id) }, field: 'resolution', toValue: null, fromValue: { not: null } }, select: { issueId: true } })).map((h) => h.issueId));
  const defects: Array<DefectRow & { number: number; title: string }> = bugs.map((b) => ({
    number: b.number, title: b.title,
    severity: b.defectInfo?.severity ?? null, activity: b.defectInfo?.activity ?? null,
    module: b.components[0]?.component.name ?? b.defectInfo?.product ?? b.parent?.title ?? null,
    open: !b.resolvedAt, createdAt: b.createdAt, resolvedAt: b.resolvedAt,
    rootCause: b.defectInfo?.rootCause ?? null, injectedPhase: b.defectInfo?.injectedPhase ?? null, reopened: reopenedIds.has(b.id),
    leakage: isLeakage({ leakage: b.defectInfo?.leakage, activity: b.defectInfo?.activity, labels: b.labels.map((l) => l.label.name) }),
  }));
  return { plan, cycles, runs, defects };
}

async function requirementCoverage(projectId: number, db: Db = prisma) {
  const reqs = await db.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: { in: ['REQUIREMENT', 'STORY'] } } },
    select: { id: true, linksIn: { where: { type: 'TESTS', fromIssue: { deletedAt: null } }, select: { fromIssue: { select: { testCase: { select: { id: true } } } } } } },
  });
  const caseIds = [...new Set(reqs.flatMap((r) => r.linksIn.map((l) => l.fromIssue.testCase?.id).filter((x): x is number => !!x)))];
  // Lần chạy mới nhất của mỗi case (theo updatedAt).
  const latest = new Map<number, string>();
  if (caseIds.length) {
    const runs = await db.workTestRun.findMany({ where: { testCaseId: { in: caseIds } }, orderBy: { updatedAt: 'desc' }, select: { testCaseId: true, status: true } });
    for (const r of runs) if (!latest.has(r.testCaseId)) latest.set(r.testCaseId, r.status);
  }
  const covered = reqs.filter((r) => r.linksIn.length).length;
  const verified = reqs.filter((r) => {
    const st = r.linksIn.map((l) => (l.fromIssue.testCase ? latest.get(l.fromIssue.testCase.id) : undefined));
    return st.length && st.some((s) => s === 'PASS') && !st.some((s) => s === 'FAIL' || s === 'BLOCKED');
  }).length;
  const pct = (a: number) => (reqs.length ? Math.round((a / reqs.length) * 1000) / 10 : null);
  return { requirements: reqs.length, covered, verified, pct: pct(covered), verifiedPct: pct(verified) };
}

// ═══ CỔNG KIỂM THỬ — dm5 G3 (D2) ═════════════════════════════════

/** Tiêu chí VÀO + RA của một kế hoạch, tính trên dữ liệu thật (đọc qua `db` — dùng được trong transaction của Release). */
export async function planGate(db: Db, projectId: number, planId: number | null) {
  const { plan, cycles, runs, defects } = await gather(projectId, planId, db);
  const settings = (plan?.settings ?? {}) as PlanSettings;
  const coverage = await requirementCoverage(projectId, db);
  const openSev = (sv: string) => defects.filter((d) => d.open && d.severity === sv).length;
  const stats = cycleStats(cycles, runs);
  const last = stats[stats.length - 1] ?? null;
  const exit = evaluateExit(settings.criteria ?? {}, { passRate: last?.passRate ?? null, openCritical: openSev('CRITICAL'), openMajor: openSev('MAJOR'), reqCoverage: coverage.pct, executed: last?.progress ?? null });
  let entryList: EntryCriterion[] = [];
  try { entryList = normalizeEntry(settings.entry); } catch { entryList = []; }
  // Smoke: case loại SMOKE của kế hoạch — lần chạy mới nhất phải PASS cả, không FAIL.
  const caseIds = plan ? plan.cases.map((c) => c.testCaseId) : [];
  const smokeCases = caseIds.length ? await db.workTestCase.findMany({ where: { id: { in: caseIds }, testType: 'SMOKE', issue: { deletedAt: null } }, select: { id: true } }) : [];
  const latest = new Map<number, string>();
  if (smokeCases.length) for (const r of await db.workTestRun.findMany({ where: { testCaseId: { in: smokeCases.map((c) => c.id) } }, orderBy: { updatedAt: 'desc' }, select: { testCaseId: true, status: true } })) if (!latest.has(r.testCaseId)) latest.set(r.testCaseId, r.status);
  const planReviewed = (await db.workReviewSession.count({ where: { projectId, deletedAt: null, checklistKey: 'TEST_PLAN', status: 'CLOSED', decision: { in: ['ACCEPT', 'ACCEPT_WITH_CHANGES'] } } })) > 0;
  const entry = evaluateEntry(entryList, {
    cases: caseIds.length, reqCoverage: coverage.pct, openCritical: openSev('CRITICAL'),
    smoke: { cases: smokeCases.length, passed: smokeCases.filter((c) => latest.get(c.id) === 'PASS').length, failed: smokeCases.filter((c) => latest.get(c.id) === 'FAIL').length },
    planReviewed,
  });
  return { planId: plan?.id ?? null, planName: plan?.name ?? null, versionId: settings.versionId ?? null, entry, exit };
}

async function gateMode(db: Db, projectId: number): Promise<TestGateMode | null> {
  const p = await db.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  return qualitySettingsOf(p?.settings).testGate;
}

const failedRows = (rows: Array<{ met: boolean; kind?: string; key?: string; target: string; actual: string; text?: string | null }>) =>
  rows.filter((r) => !r.met).map((r) => ({ criterion: r.kind ?? r.key ?? '', target: r.target, actual: r.actual, text: r.text ?? null }));

/**
 * Cycle PLANNED → bắt đầu chạy (đổi trạng thái tay hoặc ghi kết quả lần chạy đầu tiên). settings.testGate='block' và tiêu
 * chí VÀO của kế hoạch chưa đạt ⇒ 409 WORK_TEST_GATE. Cycle không gắn kế hoạch / kế hoạch không khai entry ⇒ qua.
 */
export async function assertCycleEntryGate(projectId: number, cycleId: number) {
  const mode = await gateMode(prisma, projectId);
  if (!mode) return { mode, met: true, failed: [] as ReturnType<typeof failedRows> };
  const c = await prisma.workTestCycle.findFirst({ where: { id: cycleId, projectId }, select: { planId: true, state: true, name: true } });
  if (!c?.planId || c.state !== 'PLANNED') return { mode, met: true, failed: [] as ReturnType<typeof failedRows> };
  const g = await planGate(prisma, projectId, c.planId);
  const failed = failedRows(g.entry.rows);
  if (failed.length && mode === 'block') {
    throw new AppError(`Entry criteria of test plan "${g.planName}" are not met (${failed.map((f) => f.criterion).join(', ')}) — the cycle "${c.name}" cannot start yet`, 409, 'WORK_TEST_GATE', { gate: 'ENTRY', planId: g.planId, failed });
  }
  return { mode, met: !failed.length, failed };
}

/**
 * Cổng phát hành cho planning.service › releaseVersion (G4 gọi — G3 KHÔNG sửa releaseVersion). settings.testGate='block'
 * ⇒ mọi kế hoạch kiểm version này (settings.versionId) phải đạt tiêu chí RA; không kế hoạch nào nhắm version ⇒ xét các
 * kế hoạch còn mở có vòng chạy; dự án chưa có kế hoạch nào ⇒ xét toàn dự án với tiêu chí mặc định. Chưa đạt ⇒ 409
 * WORK_TEST_GATE. 'warn' ⇒ trả danh sách cảnh báo, không ném. Đọc qua `tx` ⇒ gọi được trong transaction của Release.
 */
export async function assertTestGate(tx: Db, versionId: number) {
  const v = await tx.workVersion.findUnique({ where: { id: versionId }, select: { id: true, projectId: true, name: true } });
  if (!v) throw new NotFoundError('Version not found');
  const mode = await gateMode(tx, v.projectId);
  if (!mode) return { mode, met: true, plans: [] as Array<{ planId: number | null; planName: string | null; failed: ReturnType<typeof failedRows> }> };
  const plans = await tx.workTestPlan.findMany({ where: { projectId: v.projectId, archivedAt: null }, select: { id: true, settings: true, _count: { select: { cycles: true } } } });
  const targeted = plans.filter((p) => ((p.settings ?? {}) as PlanSettings).versionId === v.id);
  const scope: Array<number | null> = targeted.length ? targeted.map((p) => p.id) : plans.filter((p) => p._count.cycles > 0).map((p) => p.id);
  if (!scope.length) scope.push(null);
  const out: Array<{ planId: number | null; planName: string | null; failed: ReturnType<typeof failedRows> }> = [];
  for (const pid of scope) {
    const g = await planGate(tx, v.projectId, pid);
    out.push({ planId: g.planId, planName: g.planName, failed: failedRows(g.exit.rows) });
  }
  const bad = out.filter((p) => p.failed.length);
  if (bad.length && mode === 'block') {
    throw new AppError(`Exit criteria are not met for ${v.name}: ${bad.map((p) => `${p.planName ?? 'all tests'} (${p.failed.map((f) => f.criterion).join(', ')})`).join('; ')} — finish testing or switch the test gate to "warn"`, 409, 'WORK_TEST_GATE', { gate: 'EXIT', versionId: v.id, plans: bad });
  }
  return { mode, met: !bad.length, plans: out };
}

export async function qualityDashboard(userId: number, projectId: number, q: { planId?: number | null; days?: number } = {}) {
  const access = await ctx(userId, projectId);
  const { plan, cycles, runs, defects } = await gather(projectId, q.planId ?? null);
  const stats = cycleStats(cycles, runs);
  const last = stats[stats.length - 1] ?? null;
  const lastCycle = last ? cycles.find((c) => c.id === last.cycleId)! : null;
  const ds = defectStats(defects);
  const coverage = await requirementCoverage(projectId);
  const settings = (plan?.settings ?? {}) as PlanSettings;
  const openSev = (s: string) => defects.filter((d) => d.open && d.severity === s).length;
  const exit = evaluateExit(settings.criteria ?? {}, { passRate: last?.passRate ?? null, openCritical: openSev('CRITICAL'), openMajor: openSev('MAJOR'), reqCoverage: coverage.pct, executed: last?.progress ?? null });
  // Ước lượng: tham số của kế hoạch (hoặc mặc định) + số TC hiện có + phút ước lượng đã ghi trên case.
  const caseFilter = plan ? { id: { in: plan.cases.map((c) => c.testCaseId) } } : { issue: { projectId, deletedAt: null } };
  const [caseCount, estSum, levels] = await Promise.all([
    prisma.workTestCase.count({ where: caseFilter }),
    prisma.workTestCase.aggregate({ where: caseFilter, _sum: { estimateMin: true }, _count: { estimateMin: true } }),
    prisma.workTestCase.groupBy({ by: ['level'], where: caseFilter, _count: { _all: true } }),
  ]);
  const estimation = estimateTesting({ ...DEFAULT_ESTIMATION, size: caseCount, ...(settings.estimation ?? {}), ...(settings.estimation?.method === 'FUNCTION_POINTS' ? {} : { size: settings.estimation?.size || caseCount }) });
  return {
    projectKey: access.key, plan: plan ? { id: plan.id, name: plan.name } : null,
    cycles: stats, retest: retestStats(cycles, runs),
    sCurve: lastCycle ? { cycle: { id: lastCycle.id, name: lastCycle.name }, points: sCurve(lastCycle, runs) } : null,
    defects: ds, defectTrend: defectTrend(defects, Math.min(90, Math.max(7, q.days ?? 30))),
    coverage, exit,
    // dm5 G3 (D2): tiêu chí VÀO của kế hoạch + chế độ cổng (settings.testGate).
    entry: plan ? (await planGate(prisma, projectId, plan.id)).entry : null,
    testGate: await gateMode(prisma, projectId),
    estimation: { ...estimation, recordedMinutes: estSum._sum.estimateMin ?? 0, casesWithEstimate: estSum._count.estimateMin },
    levels: levels.map((l) => ({ level: l.level ?? 'UNSPECIFIED', cases: l._count._all })).sort((a, b) => b.cases - a.cases),
  };
}

// ═══ KIỂM THỬ THEO RỦI RO (T9) ═══════════════════════════════════

export async function riskMatrix(userId: number, projectId: number) {
  const access = await ctx(userId, projectId);
  const risks = await prisma.workRaidItem.findMany({
    where: { projectId, type: 'RISK', deletedAt: null, status: { not: 'CLOSED' } }, orderBy: { number: 'asc' }, take: 500,
    select: {
      number: true, title: true, category: true, probability: true, impact: true, riskKind: true, status: true, mitigation: true,
      links: { where: { issueId: { not: null } }, select: { issue: { select: { number: true, title: true, deletedAt: true, type: { select: { key: true } }, testCase: { select: { id: true } } } } } },
    },
  });
  const caseIds = risks.flatMap((r) => r.links.map((l) => l.issue?.testCase?.id).filter((x): x is number => !!x));
  const latest = new Map<number, string>();
  if (caseIds.length) for (const r of await prisma.workTestRun.findMany({ where: { testCaseId: { in: caseIds } }, orderBy: { updatedAt: 'desc' }, select: { testCaseId: true, status: true } })) if (!latest.has(r.testCaseId)) latest.set(r.testCaseId, r.status);
  const rows = risks.map((r) => {
    const { score, level } = riskLevel(r.probability, r.impact);
    const links = r.links.map((l) => l.issue).filter((i): i is NonNullable<typeof i> => !!i && !i.deletedAt);
    const tests = links.filter((i) => i.type.key === 'TEST').map((i) => ({ number: i.number, key: `${access.key}-${i.number}`, title: i.title, lastStatus: i.testCase ? latest.get(i.testCase.id) ?? null : null }));
    return {
      number: r.number, key: `RISK-${r.number}`, title: r.title, category: r.category, likelihood: r.probability, impact: r.impact, score, level,
      riskKind: r.riskKind, status: r.status, mitigation: r.mitigation, policy: level ? RISK_TEST_POLICY[level] : null,
      requirements: links.filter((i) => i.type.key !== 'TEST').map((i) => ({ number: i.number, key: `${access.key}-${i.number}`, title: i.title })),
      tests, covered: tests.length > 0, passing: tests.length > 0 && tests.every((t) => t.lastStatus === 'PASS'),
    };
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  // Lưới 5×5 (khả năng hàng, tác động cột) đếm rủi ro mỗi ô.
  const grid = Array.from({ length: 5 }, (_, li) => Array.from({ length: 5 }, (_, ii) => rows.filter((r) => r.likelihood === 5 - li && r.impact === ii + 1).map((r) => r.key)));
  const high = rows.filter((r) => r.level === 'HIGH' || r.level === 'CRITICAL');
  return { rows, grid, summary: { total: rows.length, product: rows.filter((r) => r.riskKind === 'PRODUCT').length, highUncovered: high.filter((r) => !r.covered).length, highCoveragePct: high.length ? Math.round((high.filter((r) => r.covered).length / high.length) * 100) : null } };
}

export async function saveRisk(
  userId: number, projectId: number,
  input: { number?: number | null; title?: string; likelihood?: number | null; impact?: number | null; riskKind?: 'PRODUCT' | 'PROJECT' | null; mitigation?: string | null; issueNumbers?: number[] },
) {
  await ctx(userId, projectId, 'issue.edit');
  const issueIds = input.issueNumbers ? (await prisma.workIssue.findMany({ where: { projectId, number: { in: input.issueNumbers }, deletedAt: null }, select: { id: true } })).map((i) => i.id) : null;
  if (input.issueNumbers && issueIds && issueIds.length !== new Set(input.issueNumbers).size) throw new BadRequestError('Some linked issues were not found', 'VALIDATION_ERROR');
  const number = await prisma.$transaction(async (tx) => {
    let id: number;
    let n = input.number ?? null;
    const data = {
      ...(input.title !== undefined ? { title: input.title.trim().slice(0, 255) } : {}),
      ...(input.likelihood !== undefined ? { probability: input.likelihood } : {}),
      ...(input.impact !== undefined ? { impact: input.impact } : {}),
      ...(input.riskKind !== undefined ? { riskKind: input.riskKind } : {}),
      ...(input.mitigation !== undefined ? { mitigation: input.mitigation?.trim() || null } : {}),
    };
    if (n) {
      const r = await tx.workRaidItem.findFirst({ where: { projectId, number: n, type: 'RISK', deletedAt: null }, select: { id: true } });
      if (!r) throw new NotFoundError('Risk not found');
      id = r.id;
      if (Object.keys(data).length) await tx.workRaidItem.update({ where: { id }, data: { ...data, version: { increment: 1 } } });
    } else {
      if (!input.title?.trim()) throw new BadRequestError('Give the risk a title', 'VALIDATION_ERROR');
      n = await nextNumber(tx, 'raid', projectId);
      id = (await tx.workRaidItem.create({ data: { projectId, number: n, type: 'RISK', status: 'OPEN', category: 'Product quality', createdById: userId, ownerId: userId, riskKind: 'PRODUCT', ...data, title: input.title.trim().slice(0, 255) }, select: { id: true } })).id;
    }
    if (issueIds) {
      await tx.workRaidLink.deleteMany({ where: { raidId: id, issueId: { not: null } } });
      if (issueIds.length) await tx.workRaidLink.createMany({ data: issueIds.map((issueId) => ({ raidId: id, issueId, createdById: userId })) });
    }
    return n;
  });
  await auditProject(projectId, { actorId: userId, action: 'tests.risk', targetType: 'raid', targetId: number, summary: `Risk-based testing: RISK-${number} updated` });
  return riskMatrix(userId, projectId);
}

// ═══ DEFECT: RCA + LAB 2.5 (T8, T12) ═════════════════════════════

export async function setDefectExtra(userId: number, projectId: number, number: number, input: { rootCause?: string | null; injectedPhase?: string | null; detectedByTool?: string | null; testLevel?: string | null; fixNote?: string | null }) {
  await ctx(userId, projectId, 'issue.edit');
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, type: { select: { key: true } } } });
  if (!i) throw new NotFoundError('Issue not found');
  if (i.type.key !== 'BUG') throw new BadRequestError('Root cause and defect fields are only for Bug issues', 'WORK_NOT_A_BUG');
  const data: Record<string, string | null> = {};
  for (const k of ['rootCause', 'injectedPhase', 'detectedByTool', 'testLevel', 'fixNote'] as const) if (input[k] !== undefined) data[k] = typeof input[k] === 'string' ? input[k]!.trim() || null : null;
  await prisma.workDefectInfo.upsert({ where: { issueId: i.id }, create: { issueId: i.id, projectId, ...data }, update: data });
  return defectTable(userId, projectId);
}

export async function defectTable(userId: number, projectId: number) {
  const access = await ctx(userId, projectId);
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'BUG' } }, orderBy: { number: 'desc' }, take: 2000,
    select: {
      number: true, title: true, resolvedAt: true, createdAt: true, defectInfo: true,
      reporter: { select: PUBLIC_USER }, assignee: { select: PUBLIC_USER },
    },
  });
  return rows.map((r) => ({
    number: r.number, key: `${access.key}-${r.number}`, title: r.title, open: !r.resolvedAt, createdAt: r.createdAt,
    severity: r.defectInfo?.severity ?? null, activity: r.defectInfo?.activity ?? null,
    rootCause: r.defectInfo?.rootCause ?? null, injectedPhase: r.defectInfo?.injectedPhase ?? null,
    detectedByTool: r.defectInfo?.detectedByTool ?? null, testLevel: r.defectInfo?.testLevel ?? null, fixNote: r.defectInfo?.fixNote ?? null,
    reporter: r.reporter ? displayName(r.reporter) : null, reporterId: r.reporter?.id ?? null, assignee: r.assignee ? displayName(r.assignee) : null,
  }));
}

/** T12 — báo cáo lỗi Lab 2.5: mỗi người (người báo) các bug của mình — công cụ, cấp test, các bước/mong đợi/thực tế, cách sửa. */
export async function exportDefectReport(userId: number, projectId: number, format: 'docx' | 'pdf', language: 'vi' | 'en') {
  const access = await ctx(userId, projectId);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const bugs = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'BUG' } }, orderBy: [{ reporterId: 'asc' }, { number: 'asc' }], take: 1000,
    select: { number: true, title: true, descriptionText: true, resolvedAt: true, defectInfo: true, reporter: { select: PUBLIC_USER }, status: { select: { name: true } } },
  });
  const T = (en: string, vi: string) => (language === 'vi' ? vi : en);
  const groups = new Map<string, typeof bugs>();
  for (const b of bugs) { const k = b.reporter ? displayName(b.reporter) : T('Unknown', 'Không rõ'); groups.set(k, [...(groups.get(k) ?? []), b]); }
  const L: string[] = [`# ${T('Defect report by member', 'Báo cáo lỗi theo thành viên')} — ${project.name}`, ''];
  for (const [name, list] of groups) {
    L.push(`## ${name} (${list.length})`, '');
    for (const b of list) {
      const d = b.defectInfo;
      L.push(`### ${access.key}-${b.number}: ${b.title}`, '');
      L.push(`| ${T('Field', 'Mục')} | ${T('Value', 'Giá trị')} |`, '|---|---|');
      L.push(`| ${T('Detected by tool', 'Công cụ phát hiện')} | ${d?.detectedByTool ?? '—'} |`);
      L.push(`| ${T('Test level', 'Cấp kiểm thử')} | ${d?.testLevel ?? d?.activity ?? '—'} |`);
      L.push(`| ${T('Severity', 'Mức nghiêm trọng')} | ${d?.severity ?? '—'} |`);
      L.push(`| ${T('Status', 'Trạng thái')} | ${b.status.name} |`);
      L.push(`| ${T('Root cause', 'Nguyên nhân gốc')} | ${d?.rootCause ?? '—'} |`, '');
      L.push(`**${T('Description (steps / expected / actual)', 'Mô tả (các bước / mong đợi / thực tế)')}:**`, '', (b.descriptionText ?? '—').slice(0, 4000), '');
      L.push(`**${T('Fix & evidence after fix', 'Cách sửa & bằng chứng sau sửa')}:**`, '', d?.fixNote ?? T('Not fixed yet.', 'Chưa sửa.'), '');
    }
  }
  if (!bugs.length) L.push(T('No defects logged yet.', 'Chưa ghi nhận lỗi nào.'));
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const { renderDocx, renderPdf } = await import('./docExport.js');
  const doc = markdownToTiptap(L.join('\n')).doc;
  const meta = { title: T('Defect report by member', 'Báo cáo lỗi theo thành viên'), projectName: project.name, projectKey: project.key, docLabel: 'DEFECTS', version: null, date: new Date(), capstone: false };
  const opts = { stripGuides: true, toc: false, cover: false, resolveImage: async () => null };
  const buffer = format === 'docx' ? await renderDocx(doc, meta, opts) : await renderPdf(doc, meta, opts);
  return { buffer, file: `${project.key}_Defect_Report_by_Member.${format}` };
}

// ═══ TEST SUMMARY REPORT (B6) ════════════════════════════════════

export async function summaryReport(userId: number, projectId: number, q: { planId?: number | null; language?: 'vi' | 'en'; format?: 'md' | 'docx' | 'pdf' }) {
  const access = await ctx(userId, projectId);
  const dash = await qualityDashboard(userId, projectId, { planId: q.planId });
  const language = q.language ?? ((await projectLanguage(projectId)) === 'vi' ? 'vi' : 'en');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const me = await prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER });
  const settings = q.planId ? (await getPlanSettings(userId, projectId, q.planId)).settings : ({} as PlanSettings);
  const risk = await riskMatrix(userId, projectId);
  const bugs = await defectTable(userId, projectId);
  const explore = await prisma.workExploratorySession.findMany({ where: { projectId }, select: { startedAt: true, endedAt: true, notes: true } });
  const members = await prisma.workProjectMember.findMany({ where: { projectId, role: 'ADMIN' }, select: { user: { select: PUBLIC_USER } }, take: 3 });
  const md = tsrMarkdown({
    language, project, planName: dash.plan?.name ?? null, identifier: `${project.key}-TSR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
    preparedBy: me ? displayName(me) : '', date: new Date(),
    scopeIn: settings.scopeIn ?? '', scopeOut: settings.scopeOut ?? '', environment: settings.environment ?? '',
    cycles: dash.cycles, retest: dash.retest, defects: dash.defects, coverage: dash.coverage, exit: dash.exit, variances: settings.variances ?? '',
    risks: risk.rows.filter((r) => r.riskKind !== 'PROJECT').slice(0, 20).map((r) => ({ key: r.key, title: r.title, level: r.level, tests: r.tests.length })),
    openCritical: bugs.filter((b) => b.open && (b.severity === 'CRITICAL' || b.severity === 'MAJOR')).slice(0, 30).map((b) => ({ key: b.key, title: b.title, severity: b.severity })),
    approvers: members.map((m) => ({ name: displayName(m.user), role: language === 'vi' ? 'Quản lý dự án' : 'Project manager' })),
    levels: dash.levels,
    exploratory: {
      sessions: explore.length,
      bugs: explore.reduce((n, s) => n + (s.notes as Array<{ bugNumber?: number }>).filter((x) => x.bugNumber).length, 0),
      minutes: Math.round(explore.reduce((n, s) => n + (s.startedAt && s.endedAt ? (+s.endedAt - +s.startedAt) / 60000 : 0), 0)),
    },
  });
  if (!q.format || q.format === 'md') return { markdown: md, exitMet: dash.exit.met, projectKey: access.key };
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const { renderDocx, renderPdf } = await import('./docExport.js');
  const doc = markdownToTiptap(md).doc;
  const meta = { title: language === 'vi' ? 'Báo cáo tổng kết kiểm thử' : 'Test Summary Report', projectName: project.name, projectKey: project.key, docLabel: 'TSR', version: null, date: new Date(), capstone: false };
  const opts = { stripGuides: true, toc: false, cover: false, resolveImage: async () => null };
  const buffer = q.format === 'docx' ? await renderDocx(doc, meta, opts) : await renderPdf(doc, meta, opts);
  return { buffer, file: `${project.key}_Test_Summary_Report.${q.format}`, markdown: md };
}

// ═══ KIỂM THỬ THĂM DÒ ════════════════════════════════════════════

export const NOTE_KINDS = ['NOTE', 'BUG', 'QUESTION', 'IDEA', 'RISK'] as const;
interface ExploreNote { id: string; at: string; offsetMin: number | null; kind: (typeof NOTE_KINDS)[number]; text: string; bugNumber?: number; authorId: number }

async function exploreOf(projectId: number, number: number) {
  const s = await prisma.workExploratorySession.findFirst({ where: { projectId, number } });
  if (!s) throw new NotFoundError('Exploratory session not found');
  return s;
}

async function exploreView(projectId: number, s: Awaited<ReturnType<typeof exploreOf>>, key: string) {
  const tester = s.testerId ? await prisma.user.findUnique({ where: { id: s.testerId }, select: PUBLIC_USER }) : null;
  const notes = s.notes as unknown as ExploreNote[];
  const elapsedMin = s.startedAt ? Math.round(((s.endedAt ?? new Date()).getTime() - s.startedAt.getTime()) / 60000) : 0;
  return {
    number: s.number, key: `EXP-${s.number}`, charter: s.charter, area: s.area, timeboxMin: s.timeboxMin, tester, testerId: s.testerId, cycleId: s.cycleId,
    status: s.status, startedAt: s.startedAt, endedAt: s.endedAt, summary: s.summary, elapsedMin, overTime: elapsedMin > s.timeboxMin,
    notes: notes.map((n) => ({ ...n, bugKey: n.bugNumber ? `${key}-${n.bugNumber}` : null })),
    counts: Object.fromEntries(NOTE_KINDS.map((k) => [k, notes.filter((n) => n.kind === k).length])),
    bugs: notes.filter((n) => n.bugNumber).length, createdAt: s.createdAt,
  };
}

export async function listExploratory(userId: number, projectId: number) {
  const access = await ctx(userId, projectId);
  const rows = await prisma.workExploratorySession.findMany({ where: { projectId }, orderBy: { number: 'desc' }, take: 300 });
  return Promise.all(rows.map((s) => exploreView(projectId, s, access.key)));
}

export async function getExploratory(userId: number, projectId: number, number: number) {
  const access = await ctx(userId, projectId);
  return exploreView(projectId, await exploreOf(projectId, number), access.key);
}

export async function saveExploratory(userId: number, projectId: number, input: { number?: number | null; charter?: string; area?: string | null; timeboxMin?: number; testerId?: number | null; cycleId?: number | null; summary?: string | null }) {
  const access = await ctx(userId, projectId, 'issue.edit');
  if (input.cycleId && !(await prisma.workTestCycle.findFirst({ where: { id: input.cycleId, projectId }, select: { id: true } }))) throw new NotFoundError('Test cycle not found');
  const data = {
    ...(input.charter !== undefined ? { charter: input.charter.trim() } : {}),
    ...(input.area !== undefined ? { area: input.area?.trim() || null } : {}),
    ...(input.timeboxMin !== undefined ? { timeboxMin: input.timeboxMin } : {}),
    ...(input.testerId !== undefined ? { testerId: input.testerId } : {}),
    ...(input.cycleId !== undefined ? { cycleId: input.cycleId } : {}),
    ...(input.summary !== undefined ? { summary: input.summary?.trim() || null } : {}),
  };
  let number = input.number ?? null;
  if (number) {
    const r = await prisma.workExploratorySession.updateMany({ where: { projectId, number }, data });
    if (!r.count) throw new NotFoundError('Exploratory session not found');
  } else {
    if (!input.charter?.trim()) throw new BadRequestError('Write a charter: Explore <target> with <resources> to discover <information>', 'VALIDATION_ERROR');
    number = await prisma.$transaction(async (tx) => {
      const n = await nextNo(tx, 'explore', projectId);
      await tx.workExploratorySession.create({ data: { projectId, number: n, charter: input.charter!.trim(), area: input.area?.trim() || null, timeboxMin: input.timeboxMin ?? 60, testerId: input.testerId ?? userId, cycleId: input.cycleId ?? null, createdById: userId } });
      return n;
    });
  }
  return exploreView(projectId, await exploreOf(projectId, number), access.key);
}

export async function exploratoryAction(userId: number, projectId: number, number: number, action: 'start' | 'stop') {
  const access = await ctx(userId, projectId, 'issue.edit');
  const s = await exploreOf(projectId, number);
  if (action === 'start') {
    if (s.status !== 'PLANNED') throw new ConflictError('This session has already started');
    await prisma.workExploratorySession.update({ where: { id: s.id }, data: { status: 'RUNNING', startedAt: new Date() } });
  } else {
    if (s.status !== 'RUNNING') throw new ConflictError('This session is not running');
    await prisma.workExploratorySession.update({ where: { id: s.id }, data: { status: 'DONE', endedAt: new Date() } });
  }
  return exploreView(projectId, await exploreOf(projectId, number), access.key);
}

export async function addExploratoryNote(userId: number, projectId: number, number: number, input: { kind: (typeof NOTE_KINDS)[number]; text: string; logBug?: boolean; severity?: string | null }) {
  const access = await ctx(userId, projectId, input.logBug ? 'issue.create' : 'issue.edit');
  const s = await exploreOf(projectId, number);
  if (s.status !== 'RUNNING') throw new ConflictError('Start the session before taking notes');
  let bugNumber: number | undefined;
  if (input.logBug || input.kind === 'BUG') {
    const bugType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } });
    if (!bugType) throw new BadRequestError('This project has no Bug issue type — add one in the project settings', 'WORK_NO_BUG_TYPE');
    const { createIssueAs } = await import('./issues.service.js');
    const p = (text: string, bold = false) => ({ type: 'paragraph', content: text ? [bold ? { type: 'text', text, marks: [{ type: 'bold' }] } : { type: 'text', text }] : [] });
    const issue = await createIssueAs(userId, projectId, {
      typeId: bugType.id, title: `[EXP-${s.number}] ${input.text.replace(/\s+/g, ' ')}`.slice(0, 250),
      descriptionJson: { type: 'doc', content: [p(`Found in exploratory session EXP-${s.number}`, true), p(`Charter: ${s.charter}`), p(input.text)] } as Prisma.InputJsonValue,
    });
    await prisma.workDefectInfo.upsert({
      where: { issueId: issue.id },
      create: { issueId: issue.id, projectId, severity: input.severity ?? 'MINOR', activity: 'ST', detectedByTool: 'Exploratory testing', testLevel: 'SYSTEM' },
      update: {},
    });
    bugNumber = issue.number;
  }
  const note: ExploreNote = {
    id: Math.random().toString(36).slice(2, 10), at: new Date().toISOString(),
    offsetMin: s.startedAt ? Math.round((Date.now() - s.startedAt.getTime()) / 60000) : null,
    kind: bugNumber ? 'BUG' : input.kind, text: input.text.trim().slice(0, 2000), ...(bugNumber ? { bugNumber } : {}), authorId: userId,
  };
  // Ghi nối nguyên tử (hai người cùng ghi chú không đè nhau).
  await prisma.$executeRaw`UPDATE work_exploratory_sessions SET notes = notes || ${JSON.stringify([note])}::jsonb, updated_at = now() WHERE id = ${s.id}`;
  return exploreView(projectId, await exploreOf(projectId, number), access.key);
}

export async function deleteExploratory(userId: number, projectId: number, number: number) {
  await ctx(userId, projectId, 'issue.edit');
  await prisma.workExploratorySession.deleteMany({ where: { projectId, number } });
  return { ok: true };
}

// ═══ D4 — 6 nhóm ca kiểm thử của một yêu cầu + lint bước test (dm5 G3) ═══════════

/**
 * Panel "Test" của thẻ Req/Story: thẻ TEST liên kết (TESTS) chia theo 6 nhóm Happy · Empty · Boundary · Conflict · Security
 * · Adjacent (đếm theo NHÃN thẻ — `labels = Boundary` trong JQL ra đúng số này), nhóm còn thiếu, và lint từng thẻ TEST
 * (tiền điều kiện viết lẫn vào bước, bước thiếu kết quả mong đợi).
 */
export async function requirementTestGroups(userId: number, projectId: number, number: number) {
  const access = await ctx(userId, projectId);
  const { countTestGroups, lintTestSteps } = await import('./fptTests.js');
  const req = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      id: true, type: { select: { key: true } },
      linksIn: {
        where: { type: 'TESTS', fromIssue: { deletedAt: null } },
        select: {
          fromIssue: {
            select: {
              number: true, title: true, labels: { select: { label: { select: { name: true } } } },
              testCase: { select: { id: true, preconditions: true, testType: true, steps: { orderBy: { position: 'asc' }, select: { action: true, expected: true } } } },
            },
          },
        },
      },
    },
  });
  if (!req) throw new NotFoundError('Issue not found');
  const tests = req.linksIn.map((l) => l.fromIssue).filter((i) => i.testCase);
  const latest = new Map<number, string>();
  const ids = tests.map((t) => t.testCase!.id);
  if (ids.length) for (const r of await prisma.workTestRun.findMany({ where: { testCaseId: { in: ids } }, orderBy: { updatedAt: 'desc' }, select: { testCaseId: true, status: true } })) if (!latest.has(r.testCaseId)) latest.set(r.testCaseId, r.status);
  const rows = tests.map((t) => ({
    key: `${access.key}-${t.number}`, number: t.number, title: t.title, labels: t.labels.map((l) => l.label.name),
    testType: t.testCase!.testType, lastStatus: latest.get(t.testCase!.id) ?? null,
    lint: lintTestSteps({ preconditions: t.testCase!.preconditions, steps: t.testCase!.steps }),
  }));
  return { requirement: `${access.key}-${number}`, isRequirement: ['REQUIREMENT', 'STORY'].includes(req.type.key), tests: rows, ...countTestGroups(rows) };
}
