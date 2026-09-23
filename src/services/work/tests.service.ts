/**
 * CT Work — quản lý kiểm thử (thay plugin Xray của Jira).
 *
 * Mô hình:
 *   - Test case = thẻ loại TEST + dòng WorkTestCase (điều kiện trước, các bước
 *     hoặc Gherkin). Nhờ là thẻ nên có sẵn bình luận, người phụ trách, nhãn,
 *     liên kết TESTS sang yêu cầu (dùng cho ma trận truy vết).
 *   - Test plan = tập test case. Test cycle = một đợt chạy. Mỗi lần chạy (run)
 *     CHỤP LẠI các bước lúc tạo — sửa test về sau không làm sai kết quả cũ.
 *   - Trạng thái lần chạy suy ra từ kết quả từng bước (có bước FAIL ⇒ FAIL…),
 *     người chạy vẫn đặt tay được.
 *   - Bug tìm ra khi chạy gắn vào lần chạy (WorkTestRunDefect). Bug chuyển sang
 *     trạng thái "Retest" ⇒ các lần chạy FAIL gắn với nó thành RETEST.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import { emitWorkEvent, onWorkEvent, type WorkActor } from './events.js';
import { addLink, createIssueAs, updateIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';
import { logger } from '../../utils/logger.js';

const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });

export const RUN_STATUSES = ['TODO', 'IN_PROGRESS', 'PASS', 'FAIL', 'BLOCKED', 'SKIP', 'RETEST'] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];
export const STEP_STATUSES = ['TODO', 'PASS', 'FAIL', 'BLOCKED', 'SKIP'] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];
export const CYCLE_STATES = ['PLANNED', 'IN_PROGRESS', 'DONE'] as const;

export interface StepInput { action: string; data?: string | null; expected?: string | null }

const MAX_STEPS = 100;

/** Nhắc client tải lại: dùng sự kiện dự án (không cần kiểu sự kiện mới). */
function touch(projectId: number, userId: number) {
  emitWorkEvent({ type: 'project.updated', projectId, actor: userActor(userId) });
}

function cleanSteps(steps: StepInput[] | undefined): StepInput[] {
  const out = (steps ?? [])
    .map((s) => ({ action: (s.action ?? '').trim(), data: s.data?.trim() || null, expected: s.expected?.trim() || null }))
    .filter((s) => s.action || s.expected);
  if (out.length > MAX_STEPS) throw new BadRequestError(`A test can have at most ${MAX_STEPS} steps`, 'WORK_LIMIT');
  for (const s of out) if (!s.action) throw new BadRequestError('Every step needs an action', 'WORK_BAD_STEP');
  return out;
}

// ─── Bật kiểm thử cho dự án ──────────────────────────────────────

async function testTypeId(projectId: number): Promise<number | null> {
  const t = await prisma.workIssueType.findFirst({ where: { projectId, key: 'TEST', archived: false }, select: { id: true } });
  return t?.id ?? null;
}

/** Dự án tạo từ mẫu không có loại TEST (vd SWP391) thì thêm vào khi bật. */
export async function enableTesting(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const existing = await prisma.workIssueType.findFirst({ where: { projectId, key: 'TEST' } });
  if (existing) {
    if (existing.archived) await prisma.workIssueType.update({ where: { id: existing.id }, data: { archived: false } });
  } else {
    const wf = await prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } });
    const pos = await prisma.workIssueType.count({ where: { projectId } });
    await prisma.workIssueType.create({
      data: { projectId, key: 'TEST', name: 'Test', icon: 'test', color: '#ca8a04', level: 0, workflowId: wf?.id ?? null, position: pos },
    });
  }
  touch(projectId, userId);
  return { enabled: true };
}

// ─── Test case ───────────────────────────────────────────────────

async function findTest(projectId: number, number: number) {
  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null, type: { key: 'TEST' } },
    select: { id: true, number: true, title: true, testCase: { select: { id: true } } },
  });
  if (!issue) throw new NotFoundError('Test not found');
  // Thẻ TEST tạo từ board (không qua trang Tests) chưa có dòng test case — tạo lười.
  // upsert chứ không create: hai lượt đọc song song cùng tạo sẽ đụng khoá duy nhất.
  const tc = issue.testCase ?? (await prisma.workTestCase.upsert({ where: { issueId: issue.id }, create: { issueId: issue.id }, update: {}, select: { id: true } }));
  return { issueId: issue.id, number: issue.number, title: issue.title, testCaseId: tc.id };
}

/** Kết quả gần nhất của mỗi test (theo lần chạy được cập nhật sau cùng). */
async function latestRuns(testCaseIds: number[]) {
  if (!testCaseIds.length) return new Map<number, { status: string; executedAt: Date | null; cycleName: string }>();
  const runs = await prisma.workTestRun.findMany({
    where: { testCaseId: { in: testCaseIds }, status: { not: 'TODO' } },
    orderBy: [{ updatedAt: 'desc' }],
    select: { testCaseId: true, status: true, executedAt: true, cycle: { select: { name: true } } },
  });
  const m = new Map<number, { status: string; executedAt: Date | null; cycleName: string }>();
  for (const r of runs) if (!m.has(r.testCaseId)) m.set(r.testCaseId, { status: r.status, executedAt: r.executedAt, cycleName: r.cycle.name });
  return m;
}

export async function listTests(userId: number, projectId: number, q?: string) {
  await requireProject(userId, projectId, 'project.view');
  const term = q?.trim();
  const num = term ? Number(term.replace(/^[A-Za-z][A-Za-z0-9]*-/, '')) : NaN;
  const issues = await prisma.workIssue.findMany({
    where: {
      projectId, deletedAt: null, type: { key: 'TEST' },
      ...(term ? { OR: [{ title: { contains: term, mode: 'insensitive' } }, ...(Number.isInteger(num) && num > 0 ? [{ number: num }] : [])] } : {}),
    },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    take: 1000,
    select: {
      id: true, number: true, title: true, priority: true, statusId: true, assigneeId: true, updatedAt: true,
      labels: { select: { labelId: true } },
      testCase: { select: { id: true, kind: true, _count: { select: { steps: true } } } },
      linksOut: { where: { type: 'TESTS' }, select: { toIssue: { select: { number: true, title: true, deletedAt: true } } } },
    },
  });
  const latest = await latestRuns(issues.map((i) => i.testCase?.id).filter((x): x is number => !!x));
  return issues.map((i) => ({
    id: i.id, number: i.number, title: i.title, priority: i.priority, statusId: i.statusId, assigneeId: i.assigneeId,
    updatedAt: i.updatedAt, labelIds: i.labels.map((l) => l.labelId),
    kind: i.testCase?.kind ?? 'MANUAL',
    stepCount: i.testCase?._count.steps ?? 0,
    requirements: i.linksOut.filter((l) => !l.toIssue.deletedAt).map((l) => ({ number: l.toIssue.number, title: l.toIssue.title })),
    lastRun: i.testCase ? latest.get(i.testCase.id) ?? null : null,
  }));
}

export async function getTest(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const t = await findTest(projectId, number);
  const tc = await prisma.workTestCase.findUniqueOrThrow({
    where: { id: t.testCaseId },
    select: {
      id: true, kind: true, preconditions: true, gherkin: true, updatedAt: true,
      steps: { orderBy: { position: 'asc' }, select: { id: true, position: true, action: true, data: true, expected: true } },
      runs: {
        orderBy: { updatedAt: 'desc' }, take: 30,
        select: {
          id: true, status: true, executedAt: true, comment: true,
          executedBy: { select: PUBLIC_USER },
          cycle: { select: { id: true, name: true, environment: true } },
          defects: { select: { issue: { select: { number: true, title: true, statusId: true, deletedAt: true } } } },
        },
      },
      plans: { select: { plan: { select: { id: true, name: true } } } },
    },
  });
  return {
    number: t.number, title: t.title, testCaseId: tc.id, kind: tc.kind, preconditions: tc.preconditions, gherkin: tc.gherkin,
    updatedAt: tc.updatedAt, steps: tc.steps,
    runs: tc.runs.map((r) => ({ ...r, defects: r.defects.filter((d) => !d.issue.deletedAt).map((d) => d.issue) })),
    plans: tc.plans.map((p) => p.plan),
  };
}

export interface TestInput {
  title?: string;
  preconditions?: string | null;
  kind?: 'MANUAL' | 'GHERKIN';
  gherkin?: string | null;
  steps?: StepInput[];
  requirementKeys?: string[];
  priority?: number;
  labelIds?: number[];
  assigneeId?: number | null;
}

async function writeTestBody(tx: Prisma.TransactionClient, testCaseId: number, input: TestInput) {
  const data: Prisma.WorkTestCaseUpdateInput = {};
  if (input.kind !== undefined) data.kind = input.kind;
  if (input.preconditions !== undefined) data.preconditions = input.preconditions?.trim() || null;
  if (input.gherkin !== undefined) data.gherkin = input.gherkin?.trim() || null;
  if (Object.keys(data).length) await tx.workTestCase.update({ where: { id: testCaseId }, data });
  if (input.steps !== undefined) {
    const steps = cleanSteps(input.steps);
    await tx.workTestStep.deleteMany({ where: { testCaseId } });
    if (steps.length) {
      await tx.workTestStep.createMany({ data: steps.map((s, i) => ({ testCaseId, position: i, action: s.action, data: s.data, expected: s.expected })) });
    }
  }
}

export async function createTest(userId: number, projectId: number, input: TestInput & { title: string }) {
  const typeId = await testTypeId(projectId);
  if (!typeId) throw new BadRequestError('Test management is not enabled for this project', 'WORK_TESTS_DISABLED');
  cleanSteps(input.steps); // kiểm TRƯỚC khi tạo thẻ, để bước hỏng không để lại thẻ rỗng
  const issue = await createIssueAs(userId, projectId, {
    typeId, title: input.title, priority: input.priority, labelIds: input.labelIds, assigneeId: input.assigneeId ?? undefined,
  });
  const tc = await prisma.workTestCase.upsert({ where: { issueId: issue.id }, create: { issueId: issue.id }, update: {}, select: { id: true } });
  await prisma.$transaction((tx) => writeTestBody(tx, tc.id, input));
  const failedLinks: string[] = [];
  for (const key of input.requirementKeys ?? []) {
    try { await addLink(userId, projectId, issue.number, { type: 'TESTS', targetKey: key }); } catch { failedLinks.push(key); }
  }
  touch(projectId, userId);
  return { number: issue.number, failedLinks };
}

export async function updateTest(userId: number, projectId: number, number: number, input: TestInput) {
  await requireProject(userId, projectId, 'issue.edit');
  const t = await findTest(projectId, number);
  if (input.title !== undefined) await updateIssueAs(userId, projectId, number, { title: input.title });
  await prisma.$transaction(async (tx) => {
    await writeTestBody(tx, t.testCaseId, input);
    if (input.steps !== undefined || input.gherkin !== undefined || input.preconditions !== undefined) {
      await tx.workHistory.create({
        data: { issueId: t.issueId, actorId: userId, actorKind: 'USER', field: 'test', toValue: input.steps ? `${cleanSteps(input.steps).length} steps` : 'updated' },
      });
    }
  });
  touch(projectId, userId);
  return getTest(userId, projectId, number);
}

/** Nhập hàng loạt (từ CSV client đã đọc). Dòng hỏng báo riêng, dòng khác vẫn vào. */
export async function importTests(userId: number, projectId: number, rows: Array<TestInput & { title: string }>) {
  await requireProject(userId, projectId, 'issue.create');
  if (rows.length > 500) throw new BadRequestError('Import at most 500 tests at a time', 'WORK_LIMIT');
  const created: number[] = [];
  const failed: Array<{ row: number; title: string; error: string }> = [];
  for (const [i, r] of rows.entries()) {
    try {
      if (!r.title?.trim()) throw new Error('Title is required');
      created.push((await createTest(userId, projectId, r)).number);
    } catch (err) {
      failed.push({ row: i + 1, title: r.title ?? '', error: err instanceof Error ? err.message : 'Failed' });
    }
  }
  return { created, failed };
}

// ─── Test plan ───────────────────────────────────────────────────

export async function listPlans(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const plans = await prisma.workTestPlan.findMany({
    where: { projectId },
    orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }],
    select: {
      id: true, name: true, description: true, archivedAt: true, createdAt: true,
      cases: { select: { testCase: { select: { issue: { select: { number: true, deletedAt: true } } } } } },
      _count: { select: { cycles: true } },
    },
  });
  return plans.map((p) => ({
    id: p.id, name: p.name, description: p.description, archivedAt: p.archivedAt, createdAt: p.createdAt, cycleCount: p._count.cycles,
    testNumbers: p.cases.filter((c) => !c.testCase.issue.deletedAt).map((c) => c.testCase.issue.number).sort((a, b) => a - b),
  }));
}

async function testCaseIdsFor(projectId: number, numbers: number[]) {
  const ids: number[] = [];
  for (const n of [...new Set(numbers)]) ids.push((await findTest(projectId, n)).testCaseId);
  return ids;
}

export async function createPlan(userId: number, projectId: number, input: { name: string; description?: string | null; numbers?: number[] }) {
  await requireProject(userId, projectId, 'issue.edit');
  const name = input.name.trim();
  if (!name) throw new BadRequestError('Plan name is required', 'WORK_NAME_REQUIRED');
  const caseIds = await testCaseIdsFor(projectId, input.numbers ?? []);
  const plan = await prisma.workTestPlan.create({
    data: {
      projectId, name: name.slice(0, 120), description: input.description?.trim() || null, createdById: userId,
      cases: { create: caseIds.map((testCaseId) => ({ testCaseId })) },
    },
    select: { id: true },
  });
  touch(projectId, userId);
  return plan;
}

async function findPlan(projectId: number, planId: number) {
  const p = await prisma.workTestPlan.findFirst({ where: { id: planId, projectId }, select: { id: true } });
  if (!p) throw new NotFoundError('Test plan not found');
  return p;
}

export async function updatePlan(userId: number, projectId: number, planId: number, input: { name?: string; description?: string | null; archived?: boolean; addNumbers?: number[]; removeNumbers?: number[] }) {
  await requireProject(userId, projectId, 'issue.edit');
  await findPlan(projectId, planId);
  const data: Prisma.WorkTestPlanUpdateInput = {};
  if (input.name !== undefined) {
    if (!input.name.trim()) throw new BadRequestError('Plan name is required', 'WORK_NAME_REQUIRED');
    data.name = input.name.trim().slice(0, 120);
  }
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.archived !== undefined) data.archivedAt = input.archived ? new Date() : null;
  const add = await testCaseIdsFor(projectId, input.addNumbers ?? []);
  const remove = await testCaseIdsFor(projectId, input.removeNumbers ?? []);
  await prisma.$transaction([
    prisma.workTestPlan.update({ where: { id: planId }, data }),
    prisma.workTestPlanCase.createMany({ data: add.map((testCaseId) => ({ planId, testCaseId })), skipDuplicates: true }),
    prisma.workTestPlanCase.deleteMany({ where: { planId, testCaseId: { in: remove } } }),
  ]);
  touch(projectId, userId);
}

export async function deletePlan(userId: number, projectId: number, planId: number) {
  await requireProject(userId, projectId, 'issue.edit');
  await findPlan(projectId, planId);
  // Cycle của plan vẫn giữ (lịch sử chạy test quý hơn plan), chỉ mất liên kết.
  await prisma.workTestPlan.delete({ where: { id: planId } });
  touch(projectId, userId);
}

// ─── Test cycle & lần chạy ───────────────────────────────────────

async function createRun(tx: Prisma.TransactionClient, cycleId: number, testCaseId: number) {
  const tc = await tx.workTestCase.findUniqueOrThrow({
    where: { id: testCaseId },
    select: { kind: true, gherkin: true, steps: { orderBy: { position: 'asc' } }, issue: { select: { assigneeId: true } } },
  });
  const exists = await tx.workTestRun.findUnique({ where: { uk_work_test_run: { cycleId, testCaseId } }, select: { id: true } });
  if (exists) return exists.id;
  const run = await tx.workTestRun.create({
    data: {
      cycleId, testCaseId, assigneeId: tc.issue.assigneeId,
      gherkin: tc.kind === 'GHERKIN' ? tc.gherkin : null,
      steps: { create: tc.steps.map((s) => ({ position: s.position, action: s.action, data: s.data, expected: s.expected })) },
    },
    select: { id: true },
  });
  return run.id;
}

export async function createCycle(
  userId: number,
  projectId: number,
  input: { name: string; environment?: string | null; build?: string | null; planId?: number | null; numbers?: number[] },
) {
  await requireProject(userId, projectId, 'issue.edit');
  const name = input.name.trim();
  if (!name) throw new BadRequestError('Cycle name is required', 'WORK_NAME_REQUIRED');
  let caseIds = await testCaseIdsFor(projectId, input.numbers ?? []);
  if (input.planId) {
    await findPlan(projectId, input.planId);
    const fromPlan = await prisma.workTestPlanCase.findMany({
      where: { planId: input.planId, testCase: { issue: { deletedAt: null } } },
      select: { testCaseId: true },
    });
    caseIds = [...new Set([...caseIds, ...fromPlan.map((c) => c.testCaseId)])];
  }
  const cycle = await prisma.$transaction(async (tx) => {
    const c = await tx.workTestCycle.create({
      data: {
        projectId, name: name.slice(0, 120), environment: input.environment?.trim() || null, build: input.build?.trim() || null,
        planId: input.planId ?? null, createdById: userId,
      },
      select: { id: true },
    });
    for (const id of caseIds) await createRun(tx, c.id, id);
    return c;
  });
  touch(projectId, userId);
  return cycle;
}

async function findCycle(projectId: number, cycleId: number) {
  const c = await prisma.workTestCycle.findFirst({ where: { id: cycleId, projectId }, select: { id: true, state: true, startAt: true } });
  if (!c) throw new NotFoundError('Test cycle not found');
  return c;
}

function countStatuses(statuses: string[]) {
  const counts: Record<string, number> = Object.fromEntries(RUN_STATUSES.map((s) => [s, 0]));
  for (const s of statuses) counts[s] = (counts[s] ?? 0) + 1;
  const executed = statuses.length - counts.TODO - counts.RETEST - counts.IN_PROGRESS;
  return {
    counts, total: statuses.length, executed,
    passRate: executed ? Math.round((counts.PASS / executed) * 100) : null,
    progress: statuses.length ? Math.round((executed / statuses.length) * 100) : 0,
  };
}

export async function listCycles(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const cycles = await prisma.workTestCycle.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, environment: true, build: true, state: true, startAt: true, endAt: true, createdAt: true,
      plan: { select: { id: true, name: true } },
      runs: { select: { status: true } },
    },
  });
  return cycles.map(({ runs, ...c }) => ({ ...c, ...countStatuses(runs.map((r) => r.status)) }));
}

export async function getCycle(userId: number, projectId: number, cycleId: number) {
  await requireProject(userId, projectId, 'project.view');
  await findCycle(projectId, cycleId);
  const c = await prisma.workTestCycle.findUniqueOrThrow({
    where: { id: cycleId },
    select: {
      id: true, name: true, environment: true, build: true, state: true, startAt: true, endAt: true, createdAt: true,
      plan: { select: { id: true, name: true } },
      runs: {
        orderBy: { id: 'asc' },
        select: {
          id: true, status: true, executedAt: true, comment: true, assigneeId: true,
          executedBy: { select: PUBLIC_USER },
          testCase: { select: { issue: { select: { number: true, title: true, priority: true, deletedAt: true } } } },
          _count: { select: { steps: true } },
          defects: { select: { issue: { select: { number: true, title: true, statusId: true, deletedAt: true } } } },
        },
      },
    },
  });
  const runs = c.runs.filter((r) => !r.testCase.issue.deletedAt).map((r) => ({
    id: r.id, status: r.status, executedAt: r.executedAt, comment: r.comment, assigneeId: r.assigneeId, executedBy: r.executedBy,
    stepCount: r._count.steps,
    test: { number: r.testCase.issue.number, title: r.testCase.issue.title, priority: r.testCase.issue.priority },
    defects: r.defects.filter((d) => !d.issue.deletedAt).map((d) => d.issue),
  }));
  return { ...c, runs, ...countStatuses(runs.map((r) => r.status)) };
}

export async function updateCycle(
  userId: number,
  projectId: number,
  cycleId: number,
  input: { name?: string; environment?: string | null; build?: string | null; state?: (typeof CYCLE_STATES)[number]; addNumbers?: number[]; removeRunIds?: number[] },
) {
  await requireProject(userId, projectId, 'issue.edit');
  const c = await findCycle(projectId, cycleId);
  const data: Prisma.WorkTestCycleUpdateInput = {};
  if (input.name !== undefined) {
    if (!input.name.trim()) throw new BadRequestError('Cycle name is required', 'WORK_NAME_REQUIRED');
    data.name = input.name.trim().slice(0, 120);
  }
  if (input.environment !== undefined) data.environment = input.environment?.trim() || null;
  if (input.build !== undefined) data.build = input.build?.trim() || null;
  if (input.state !== undefined) {
    data.state = input.state;
    if (input.state !== 'PLANNED' && !c.startAt) data.startAt = new Date();
    data.endAt = input.state === 'DONE' ? new Date() : null;
  }
  const add = await testCaseIdsFor(projectId, input.addNumbers ?? []);
  await prisma.$transaction(async (tx) => {
    await tx.workTestCycle.update({ where: { id: cycleId }, data });
    for (const id of add) await createRun(tx, cycleId, id);
    if (input.removeRunIds?.length) await tx.workTestRun.deleteMany({ where: { cycleId, id: { in: input.removeRunIds } } });
  });
  touch(projectId, userId);
}

export async function deleteCycle(userId: number, projectId: number, cycleId: number) {
  await requireProject(userId, projectId, 'issue.edit');
  await findCycle(projectId, cycleId);
  await prisma.workTestCycle.delete({ where: { id: cycleId } });
  touch(projectId, userId);
}

async function findRun(projectId: number, runId: number) {
  const r = await prisma.workTestRun.findFirst({
    where: { id: runId, cycle: { projectId } },
    select: { id: true, cycleId: true, status: true, cycle: { select: { state: true, name: true, environment: true, build: true } }, testCaseId: true },
  });
  if (!r) throw new NotFoundError('Test run not found');
  return r;
}

export async function getRun(userId: number, projectId: number, runId: number) {
  await requireProject(userId, projectId, 'project.view');
  await findRun(projectId, runId);
  const r = await prisma.workTestRun.findUniqueOrThrow({
    where: { id: runId },
    select: {
      id: true, status: true, comment: true, gherkin: true, executedAt: true, assigneeId: true,
      executedBy: { select: PUBLIC_USER },
      cycle: { select: { id: true, name: true, environment: true, build: true, state: true } },
      testCase: { select: { preconditions: true, kind: true, issue: { select: { number: true, title: true, priority: true } } } },
      steps: { orderBy: { position: 'asc' }, select: { id: true, position: true, action: true, data: true, expected: true, status: true, actual: true } },
      defects: { select: { issue: { select: { number: true, title: true, statusId: true, deletedAt: true } } } },
      evidence: { orderBy: { createdAt: 'asc' }, select: { id: true, fileName: true, mime: true, size: true, createdAt: true, uploader: { select: PUBLIC_USER } } },
    },
  });
  return { ...r, defects: r.defects.filter((d) => !d.issue.deletedAt).map((d) => d.issue) };
}

/** Trạng thái lần chạy suy từ các bước. */
export function deriveRunStatus(steps: string[]): RunStatus {
  if (!steps.length) return 'TODO';
  if (steps.includes('FAIL')) return 'FAIL';
  if (steps.includes('BLOCKED')) return 'BLOCKED';
  if (steps.every((s) => s === 'PASS' || s === 'SKIP')) return steps.includes('PASS') ? 'PASS' : 'SKIP';
  if (steps.some((s) => s !== 'TODO')) return 'IN_PROGRESS';
  return 'TODO';
}

async function markExecuted(tx: Prisma.TransactionClient, runId: number, cycleId: number, userId: number, status: string) {
  await tx.workTestRun.update({ where: { id: runId }, data: { status, executedById: userId, executedAt: new Date() } });
  // Chạy test đầu tiên của một cycle đang PLANNED ⇒ cycle tự sang IN_PROGRESS.
  await tx.workTestCycle.updateMany({ where: { id: cycleId, state: 'PLANNED' }, data: { state: 'IN_PROGRESS', startAt: new Date() } });
}

export async function updateRun(userId: number, projectId: number, runId: number, input: { status?: RunStatus; comment?: string | null; assigneeId?: number | null; reset?: boolean }) {
  await requireProject(userId, projectId, 'issue.transition');
  const r = await findRun(projectId, runId);
  await prisma.$transaction(async (tx) => {
    if (input.reset) {
      // "Chạy lại": xoá kết quả từng bước, giữ bug đã ghi nhận (lịch sử).
      await tx.workTestStepResult.updateMany({ where: { runId }, data: { status: 'TODO', actual: null } });
      await tx.workTestRun.update({ where: { id: runId }, data: { status: 'TODO', executedAt: null, executedById: null } });
    }
    if (input.status !== undefined) await markExecuted(tx, runId, r.cycleId, userId, input.status);
    const data: Prisma.WorkTestRunUncheckedUpdateInput = {};
    if (input.comment !== undefined) data.comment = input.comment?.trim() || null;
    if (input.assigneeId !== undefined) data.assigneeId = input.assigneeId;
    if (Object.keys(data).length) await tx.workTestRun.update({ where: { id: runId }, data });
  });
  touch(projectId, userId);
  return getRun(userId, projectId, runId);
}

export async function updateStepResult(userId: number, projectId: number, runId: number, stepId: number, input: { status?: StepStatus; actual?: string | null }) {
  await requireProject(userId, projectId, 'issue.transition');
  const r = await findRun(projectId, runId);
  const step = await prisma.workTestStepResult.findFirst({ where: { id: stepId, runId }, select: { id: true } });
  if (!step) throw new NotFoundError('Step not found');
  await prisma.$transaction(async (tx) => {
    await tx.workTestStepResult.update({
      where: { id: stepId },
      data: { ...(input.status !== undefined ? { status: input.status } : {}), ...(input.actual !== undefined ? { actual: input.actual?.trim() || null } : {}) },
    });
    if (input.status !== undefined) {
      const all = await tx.workTestStepResult.findMany({ where: { runId }, select: { status: true } });
      await markExecuted(tx, runId, r.cycleId, userId, deriveRunStatus(all.map((s) => s.status)));
    }
  });
  touch(projectId, userId);
  return getRun(userId, projectId, runId);
}

// ─── Bug từ lần chạy ─────────────────────────────────────────────

const para = (text: string) => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] });
const heading = (text: string) => ({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text }] });

/**
 * Tạo Bug điền sẵn từ lần chạy: các bước tái hiện (tới bước lỗi), kết quả
 * mong đợi / thực tế của bước lỗi, môi trường. Gắn bug vào lần chạy và liên
 * kết với test case để ma trận truy vết thấy được.
 */
export async function createDefect(
  userId: number,
  projectId: number,
  runId: number,
  input: { title?: string; stepResultId?: number | null; priority?: number; assigneeId?: number | null },
) {
  const access = await requireProject(userId, projectId, 'issue.create');
  await findRun(projectId, runId);
  const bugType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } });
  if (!bugType) throw new BadRequestError('This project has no Bug issue type', 'WORK_NO_BUG_TYPE');
  const run = await getRun(userId, projectId, runId);
  const failed = input.stepResultId
    ? run.steps.find((s) => s.id === input.stepResultId)
    : run.steps.find((s) => s.status === 'FAIL') ?? run.steps.find((s) => s.status === 'BLOCKED');
  const upTo = failed ? run.steps.filter((s) => s.position <= failed.position) : run.steps;
  const env = [run.cycle.environment && `Environment: ${run.cycle.environment}`, run.cycle.build && `Build: ${run.cycle.build}`].filter(Boolean).join(' · ');
  const doc = {
    type: 'doc',
    content: [
      para(`Found while running ${run.testCase.issue.title} in test cycle "${run.cycle.name}".${env ? ` ${env}.` : ''}`),
      ...(run.testCase.preconditions ? [heading('Preconditions'), para(run.testCase.preconditions)] : []),
      heading('Steps to reproduce'),
      upTo.length
        ? { type: 'orderedList', content: upTo.map((s) => ({ type: 'listItem', content: [para(s.data ? `${s.action} (data: ${s.data})` : s.action)] })) }
        : para('See the test case.'),
      heading('Expected result'),
      para(failed?.expected ?? ''),
      heading('Actual result'),
      para(failed?.actual ?? run.comment ?? ''),
    ],
  };
  const title = input.title?.trim() || (failed ? `${run.testCase.issue.title} — step ${failed.position + 1} fails` : `${run.testCase.issue.title} fails`);
  const bug = await createIssueAs(userId, projectId, {
    typeId: bugType.id,
    title: title.slice(0, 255),
    descriptionJson: doc as unknown as Prisma.InputJsonValue,
    priority: input.priority ?? 2,
    assigneeId: input.assigneeId ?? undefined,
  });
  await prisma.workTestRunDefect.create({ data: { runId, issueId: bug.id } });
  try {
    await addLink(userId, projectId, run.testCase.issue.number, { type: 'RELATES', targetKey: `${access.key}-${bug.number}` });
  } catch { /* liên kết là phụ (vd khách hàng không có quyền sửa) — bug vẫn đã gắn vào lần chạy */ }
  touch(projectId, userId);
  return { number: bug.number };
}

/** Gắn một bug đã có vào lần chạy (vd lỗi đã được báo từ trước). */
export async function linkDefect(userId: number, projectId: number, runId: number, number: number) {
  await requireProject(userId, projectId, 'issue.edit');
  await findRun(projectId, runId);
  const bug = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!bug) throw new NotFoundError('Issue not found');
  await prisma.workTestRunDefect.createMany({ data: [{ runId, issueId: bug.id }], skipDuplicates: true });
  touch(projectId, userId);
}

export async function unlinkDefect(userId: number, projectId: number, runId: number, number: number) {
  await requireProject(userId, projectId, 'issue.edit');
  await findRun(projectId, runId);
  const bug = await prisma.workIssue.findFirst({ where: { projectId, number }, select: { id: true } });
  if (bug) await prisma.workTestRunDefect.deleteMany({ where: { runId, issueId: bug.id } });
  touch(projectId, userId);
}

// ─── Ma trận truy vết & báo cáo ──────────────────────────────────

/**
 * Yêu cầu (thẻ REQUIREMENT/STORY) ↔ test (liên kết TESTS) ↔ kết quả gần nhất
 * ↔ bug còn mở tìm ra từ các lần chạy đó.
 * coverage: NOT_COVERED · NOT_RUN · FAILING · BLOCKED · PASSING.
 */
export async function traceability(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const reqs = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: { in: ['REQUIREMENT', 'STORY'] } } },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    select: {
      id: true, number: true, title: true, statusId: true, typeId: true,
      linksIn: {
        where: { type: 'TESTS', fromIssue: { deletedAt: null, type: { key: 'TEST' } } },
        select: { fromIssue: { select: { number: true, title: true, testCase: { select: { id: true } } } } },
      },
    },
  });
  const caseIds = reqs.flatMap((r) => r.linksIn.map((l) => l.fromIssue.testCase?.id).filter((x): x is number => !!x));
  const latest = await latestRuns(caseIds);
  const defects = caseIds.length
    ? await prisma.workTestRunDefect.findMany({
      where: { run: { testCaseId: { in: caseIds } }, issue: { deletedAt: null, resolvedAt: null } },
      select: { run: { select: { testCaseId: true } }, issue: { select: { number: true, title: true, statusId: true } } },
    })
    : [];
  const openBugsByCase = new Map<number, Array<{ number: number; title: string; statusId: number }>>();
  for (const d of defects) {
    const list = openBugsByCase.get(d.run.testCaseId) ?? [];
    if (!list.some((x) => x.number === d.issue.number)) list.push(d.issue);
    openBugsByCase.set(d.run.testCaseId, list);
  }

  const rows = reqs.map((r) => {
    const tests = r.linksIn.map((l) => {
      const run = l.fromIssue.testCase ? latest.get(l.fromIssue.testCase.id) : undefined;
      return {
        number: l.fromIssue.number, title: l.fromIssue.title,
        lastStatus: run?.status ?? null,
        openBugs: l.fromIssue.testCase ? openBugsByCase.get(l.fromIssue.testCase.id) ?? [] : [],
      };
    });
    const statuses = tests.map((t) => t.lastStatus);
    const coverage = !tests.length ? 'NOT_COVERED'
      : statuses.some((s) => s === 'FAIL') ? 'FAILING'
        : statuses.some((s) => s === 'BLOCKED') ? 'BLOCKED'
          : statuses.every((s) => s === 'PASS' || s === 'SKIP') && statuses.some((s) => s === 'PASS') ? 'PASSING'
            : 'NOT_RUN';
    return { number: r.number, title: r.title, statusId: r.statusId, typeId: r.typeId, coverage, tests };
  });
  const total = rows.length;
  const covered = rows.filter((r) => r.coverage !== 'NOT_COVERED').length;
  const passing = rows.filter((r) => r.coverage === 'PASSING').length;
  return {
    rows,
    summary: {
      total, covered, passing,
      failing: rows.filter((r) => r.coverage === 'FAILING').length,
      coveragePct: total ? Math.round((covered / total) * 100) : 0,
      passingPct: total ? Math.round((passing / total) * 100) : 0,
    },
  };
}

// ─── Bug chuyển sang Retest ⇒ lần chạy cần chạy lại ──────────────

let registered = false;
export function registerTestingHooks(): void {
  if (registered) return;
  registered = true;
  onWorkEvent(async (e) => {
    if (e.type !== 'issue.updated') return;
    const ch = e.changes.find((c) => c.field === 'statusId');
    if (!ch?.to) return;
    const status = await prisma.workStatus.findUnique({ where: { id: Number(ch.to) }, select: { name: true } });
    if (status?.name.toLowerCase() !== 'retest') return;
    const r = await prisma.workTestRun.updateMany({
      where: { status: 'FAIL', defects: { some: { issueId: e.issueId } } },
      data: { status: 'RETEST' },
    });
    if (r.count) {
      logger.info('[work] bug sang Retest ⇒ lần chạy cần chạy lại', { issueId: e.issueId, runs: r.count });
      emitWorkEvent({ type: 'project.updated', projectId: e.projectId, actor: e.actor });
    }
  });
}
