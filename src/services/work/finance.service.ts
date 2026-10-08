/**
 * CT Work — đợt S4 (04/10/2026): TÀI CHÍNH DỰ ÁN (mô-đun `finance`).
 *
 * CHỈ THEO DÕI: đơn giá, timesheet tuần, ngân sách, chi phí, mốc thanh toán. KHÔNG xuất hoá đơn —
 * hoá đơn điện tử ở Việt Nam phải phát hành qua nhà cung cấp được cấp phép; ở đây chỉ ghi lại SỐ
 * hoá đơn của hệ thống bên ngoài. Công thức + quyền là hàm thuần ở financeRules.ts.
 *
 * Luật giữ dự án cũ: mọi tuyến gọi `finCtx` ⇒ assertModule('finance') ⇒ dự án không có khoá ⇒ 403
 * MODULE_DISABLED. Khoá tuần (`assertWeekOpen`) cũng chỉ chạy khi mô-đun bật — dự án cũ ghi giờ y như trước.
 *
 * Timesheet: không có bảng "nháp" — tuần chưa nộp = các worklog đang có. Nộp ⇒ dòng SUBMITTED (khoá ghi/
 * xoá giờ của tuần), duyệt ⇒ APPROVED + CHỤP từng dòng giờ kèm đơn giá (work_timesheet_lines), trả lại
 * ⇒ RETURNED (mở khoá). Mở khoá tuần đã duyệt: chỉ ADMIN, bắt buộc lý do, ghi audit, xoá dòng chụp.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import type { BudgetCategory, Currency, ExpenseCategory, PaymentStatus, PaymentTrigger, RateScope } from './constants.js';
import { xlsxWorkbook } from './exchange.service.js';
import {
  alertToSend, budgetSummary, EAC_FORMULA, financeAccess, isWeekStart, lineCost, milestoneAmount, milestonesTriggeredBy,
  paymentTransitionOk, percentComplete, pickRate, round2, timesheetTransitionOk, vnWeekRange, weekEndOf, weekIsOver, weekLocked, weekStartOf,
  type FinanceAccess, type RateRow,
} from './financeRules.js';
import { dayOf } from './governanceDb.js';
import { loadProjectAccess, requireProject, type ProjectAccess, assertHumanActor } from './permissions.js';
import { vnDay } from './sprints.service.js';
import { assertModule, modulesOf } from './studio.js';

type Tx = Prisma.TransactionClient;
const DAY = 86_400_000;
const dateOf = (day: string) => new Date(`${day}T00:00:00.000Z`);

export const NO_INVOICE_NOTICE = 'CT Work only tracks project money. It does not issue invoices — in Vietnam, e-invoices must be issued through a licensed e-invoice provider. Record the invoice number from that system here.';

// ─── Ngữ cảnh + quyền ─────────────────────────────────────────────

export interface FinCtx {
  access: ProjectAccess;
  fa: FinanceAccess;
  userId: number;
  /** Bộ phận mà người xem là trưởng (để duyệt giờ người trong bộ phận). */
  leadTeamIds: number[];
}

async function leadTeamIdsOf(userId: number, workspaceId: number): Promise<number[]> {
  const rows = await prisma.workTeamMember.findMany({
    where: { userId, role: 'LEAD', team: { workspaceId, archivedAt: null } },
    select: { teamId: true },
  });
  return rows.map((r) => r.teamId);
}

/** Cổng của mọi tuyến tài chính nội bộ: dự án (404) → mô-đun (403 MODULE_DISABLED) → người của đội. */
export async function finCtx(userId: number, projectId: number): Promise<FinCtx> {
  await assertHumanActor(userId, 'see or change project finances (rates, timesheets, budget, expenses, payments)'); // CTW-28: tầng hành động — agent bị chặn bất kể gọi từ tuyến nào
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'finance');
  const leadTeamIds = access.workspaceRole === 'GUEST' || access.role === 'CLIENT' ? [] : await leadTeamIdsOf(userId, access.workspaceId);
  const fa = financeAccess(access.role, access.workspaceRole, leadTeamIds.length > 0);
  if (!fa.manage && !fa.ownTimesheet && !fa.review) {
    throw new AppError('Project finance is only available to the project team', 403, 'WORK_FINANCE_FORBIDDEN');
  }
  return { access, fa, userId, leadTeamIds };
}

function assertManage(ctx: FinCtx) {
  if (!ctx.fa.manage) throw new AppError('Only project admins can see rates, budgets and costs', 403, 'WORK_FINANCE_FORBIDDEN');
}

/** Người trong các bộ phận mà người xem dẫn (TEAM review). */
async function teamMemberIds(teamIds: number[]): Promise<Set<number>> {
  if (!teamIds.length) return new Set();
  const rows = await prisma.workTeamMember.findMany({ where: { teamId: { in: teamIds } }, select: { userId: true } });
  return new Set(rows.map((r) => r.userId));
}

/** Người xem có duyệt/xem được giờ của `targetUserId` không. */
async function canReviewUser(ctx: FinCtx, targetUserId: number): Promise<boolean> {
  if (ctx.fa.review === 'ALL') return true;
  if (ctx.fa.review === 'TEAM') return (await teamMemberIds(ctx.leadTeamIds)).has(targetUserId);
  return false;
}

// ─── Cấu hình ─────────────────────────────────────────────────────

async function settingsRow(projectId: number) {
  const s = await prisma.workFinanceSettings.findUnique({ where: { projectId } });
  return { currency: (s?.currency ?? 'VND') as Currency, contractValue: s?.contractValue ?? null, budgetTotal: s?.budgetTotal ?? null, alertLevel: s?.alertLevel ?? 0 };
}

export async function getSettings(userId: number, projectId: number) {
  const ctx = await finCtx(userId, projectId);
  const s = await settingsRow(projectId);
  return {
    // MEMBER chỉ cần đơn vị tiền? Không — MEMBER không thấy tiền nào cả: chỉ trả quyền + thông báo.
    ...(ctx.fa.manage ? s : { currency: null, contractValue: null, budgetTotal: null, alertLevel: 0 }),
    access: { manage: ctx.fa.manage, ownTimesheet: ctx.fa.ownTimesheet, review: ctx.fa.review },
    notice: NO_INVOICE_NOTICE,
    formula: EAC_FORMULA,
  };
}

export async function updateSettings(userId: number, projectId: number, input: { currency?: Currency; contractValue?: number | null; budgetTotal?: number | null }) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const data = {
    ...(input.currency ? { currency: input.currency } : {}),
    ...(input.contractValue !== undefined ? { contractValue: input.contractValue } : {}),
    ...(input.budgetTotal !== undefined ? { budgetTotal: input.budgetTotal } : {}),
    updatedById: userId,
  };
  await prisma.workFinanceSettings.upsert({ where: { projectId }, create: { projectId, ...data }, update: data });
  await auditProject(projectId, { actorId: userId, action: 'finance.settings', targetType: 'project', targetId: projectId, summary: 'Updated finance settings', detail: { ...input } });
  await checkBudgetAlerts(projectId, userId);
  return getSettings(userId, projectId);
}

// ─── Đơn giá (chỉ ADMIN) ──────────────────────────────────────────

const RATE_SELECT = { id: true, scope: true, projectRole: true, teamId: true, userId: true, hourlyRate: true, effectiveFrom: true, note: true, createdAt: true, team: { select: { id: true, key: true, name: true } } } satisfies Prisma.WorkRateSelect;

export async function listRates(userId: number, projectId: number) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const rows = await prisma.workRate.findMany({ where: { projectId }, orderBy: [{ scope: 'asc' }, { effectiveFrom: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }], select: RATE_SELECT });
  const userIds = [...new Set(rows.map((r) => r.userId).filter((x): x is number => !!x))];
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: PUBLIC_USER }) : [];
  const byId = new Map(users.map((u) => [u.id, u]));
  return {
    currency: (await settingsRow(projectId)).currency,
    rates: rows.map((r) => ({ ...r, effectiveFrom: dayOf(r.effectiveFrom), user: r.userId ? byId.get(r.userId) ?? null : null })),
  };
}

export interface RateInput { scope: RateScope; projectRole?: string | null; teamId?: number | null; userId?: number | null; hourlyRate: number; effectiveFrom?: string | null; note?: string | null }

async function normalizeRate(ctx: FinCtx, input: RateInput) {
  const out = { scope: input.scope, projectRole: null as string | null, teamId: null as number | null, userId: null as number | null };
  if (input.scope === 'ROLE') {
    if (!input.projectRole || !['ADMIN', 'MEMBER', 'VIEWER'].includes(input.projectRole)) throw new BadRequestError('Pick the project role this rate applies to', 'WORK_BAD_RATE');
    out.projectRole = input.projectRole;
  } else if (input.scope === 'TEAM') {
    const t = input.teamId ? await prisma.workTeam.findFirst({ where: { id: input.teamId, workspaceId: ctx.access.workspaceId }, select: { id: true } }) : null;
    if (!t) throw new BadRequestError('Pick a team of this workspace', 'WORK_BAD_RATE');
    out.teamId = t.id;
  } else if (input.scope === 'USER') {
    const a = input.userId ? await loadProjectAccess(input.userId, ctx.access.projectId) : null;
    if (!a || a.role === 'CLIENT' || a.role === 'TEACHER') throw new BadRequestError('Pick a member of this project team', 'WORK_BAD_RATE');
    out.userId = input.userId!;
  }
  return out;
}

export async function createRate(userId: number, projectId: number, input: RateInput) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const scope = await normalizeRate(ctx, input);
  const r = await prisma.workRate.create({
    data: { projectId, ...scope, hourlyRate: round2(input.hourlyRate), effectiveFrom: input.effectiveFrom ? dateOf(input.effectiveFrom) : null, note: input.note?.trim() || null, createdById: userId },
    select: { id: true },
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.rate', targetType: 'rate', targetId: r.id, summary: `Added a ${input.scope.toLowerCase()} rate`, detail: { ...scope, hourlyRate: input.hourlyRate, effectiveFrom: input.effectiveFrom ?? null } });
  return listRates(userId, projectId);
}

export async function updateRate(userId: number, projectId: number, rateId: number, input: Partial<RateInput>) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const cur = await prisma.workRate.findFirst({ where: { id: rateId, projectId } });
  if (!cur) throw new NotFoundError('Rate not found');
  const scope = input.scope ? await normalizeRate(ctx, { ...(cur as unknown as RateInput), ...input, scope: input.scope, hourlyRate: input.hourlyRate ?? cur.hourlyRate } as RateInput) : {};
  await prisma.workRate.update({
    where: { id: rateId },
    data: {
      ...scope,
      ...(input.hourlyRate !== undefined ? { hourlyRate: round2(input.hourlyRate) } : {}),
      ...(input.effectiveFrom !== undefined ? { effectiveFrom: input.effectiveFrom ? dateOf(input.effectiveFrom) : null } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.rate', targetType: 'rate', targetId: rateId, summary: 'Changed a rate', detail: { from: cur.hourlyRate, to: input.hourlyRate ?? cur.hourlyRate } });
  return listRates(userId, projectId);
}

export async function deleteRate(userId: number, projectId: number, rateId: number) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const n = await prisma.workRate.deleteMany({ where: { id: rateId, projectId } });
  if (!n.count) throw new NotFoundError('Rate not found');
  await auditProject(projectId, { actorId: userId, action: 'finance.rate', targetType: 'rate', targetId: rateId, summary: 'Removed a rate' });
  return listRates(userId, projectId);
}

const addDay = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) + DAY).toISOString().slice(0, 10);

// ─── Khoá tuần (gọi từ planning.service khi ghi/xoá worklog) ─────

/**
 * Chặn ghi/xoá giờ của tuần đã NỘP hoặc đã DUYỆT (chỉ khi dự án bật finance). `startedAt` là
 * thời điểm của dòng giờ; tuần tính theo giờ VN.
 */
export async function assertWeekOpen(projectId: number, userId: number, startedAt: Date, settings?: unknown): Promise<void> {
  const s = settings !== undefined ? settings : (await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } }))?.settings;
  if (!modulesOf(s).finance) return;
  const week = weekStartOf(vnDay(startedAt));
  const ts = await prisma.workTimesheet.findUnique({ where: { uk_work_timesheet: { projectId, userId, weekStart: dateOf(week) } }, select: { id: true, status: true } });
  if (ts && weekLocked(ts.status)) {
    // CTW-38: lỗi 423 chỉ đường — ai mở được, gọi gì.
    const base = `/api/v1/work/projects/${projectId}/finance/timesheets/${ts.id}`;
    throw new AppError(
      ts.status === 'APPROVED'
        ? `The week of ${week} is approved and locked. Ask a project admin to reopen it (Finance → Timesheets → Reopen, or POST ${base}/reopen {"reason":"…"}) before time is changed.`
        : `The week of ${week} is submitted for approval. Withdraw it first (POST ${base}/withdraw) to change its time, or ask the reviewer to return it.`,
      423, 'WORK_TIMESHEET_LOCKED', {
        weekStart: week, status: ts.status, timesheetId: ts.id,
        hint: ts.status === 'APPROVED'
          ? { who: 'project admin', method: 'POST', path: `${base}/reopen`, body: { reason: '(at least 5 characters)' } }
          : { who: 'you', method: 'POST', path: `${base}/withdraw` },
      },
    );
  }
}

// ─── Timesheet tuần ───────────────────────────────────────────────

const TS_SELECT = {
  id: true, userId: true, userName: true, weekStart: true, status: true, totalMinutes: true, note: true, submittedAt: true, decidedAt: true,
  decidedById: true, returnReason: true, reopenedAt: true, reopenReason: true, approvedCost: true, version: true,
} satisfies Prisma.WorkTimesheetSelect;

type TsRow = Prisma.WorkTimesheetGetPayload<{ select: typeof TS_SELECT }>;

function presentTs(t: TsRow, manage: boolean) {
  const { approvedCost, ...rest } = t;
  return { ...rest, weekStart: dayOf(t.weekStart)!, weekEnd: weekEndOf(dayOf(t.weekStart)!), ...(manage ? { approvedCost } : {}) };
}

async function weekLogs(projectId: number, userId: number, week: string) {
  const { since, until } = vnWeekRange(week);
  return prisma.workWorklog.findMany({
    where: { userId, startedAt: { gte: since, lt: until }, issue: { projectId } },
    orderBy: { startedAt: 'asc' },
    select: { id: true, minutes: true, startedAt: true, note: true, issue: { select: { id: true, number: true, title: true, teamId: true, stageId: true, deletedAt: true } } },
  });
}

/** Tuần của một người: giờ theo thẻ × ngày + trạng thái nộp/duyệt. MEMBER chỉ xem của mình. */
export async function weekView(userId: number, projectId: number, q: { week?: string; userId?: number }) {
  const ctx = await finCtx(userId, projectId);
  const target = q.userId ?? userId;
  if (target !== userId && !(await canReviewUser(ctx, target))) throw new ForbiddenError('You can only see your own timesheet');
  if (target === userId && !ctx.fa.ownTimesheet && !ctx.fa.review) throw new ForbiddenError('Your role does not log time in this project');
  const week = q.week ? (isWeekStart(q.week) ? q.week : weekStartOf(q.week)) : weekStartOf(vnDay());
  const [logs, ts, project, user] = await Promise.all([
    weekLogs(projectId, target, week),
    prisma.workTimesheet.findUnique({ where: { uk_work_timesheet: { projectId, userId: target, weekStart: dateOf(week) } }, select: TS_SELECT }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } }),
    prisma.user.findUnique({ where: { id: target }, select: PUBLIC_USER }),
  ]);
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.parse(`${week}T00:00:00Z`) + i * DAY).toISOString().slice(0, 10));
  const rows = new Map<number, { issueId: number; key: string; title: string; byDay: Record<string, number>; totalMin: number }>();
  for (const l of logs) {
    const d = vnDay(l.startedAt);
    const r = rows.get(l.issue.id) ?? { issueId: l.issue.id, key: `${project.key}-${l.issue.number}`, title: l.issue.title, byDay: {}, totalMin: 0 };
    r.byDay[d] = (r.byDay[d] ?? 0) + l.minutes;
    r.totalMin += l.minutes;
    rows.set(l.issue.id, r);
  }
  const totalMin = logs.reduce((s, l) => s + l.minutes, 0);
  const status = ts?.status ?? null;
  return {
    weekStart: week, weekEnd: weekEndOf(week), days, user,
    rows: [...rows.values()],
    logs: logs.map((l) => ({ id: l.id, minutes: l.minutes, startedAt: l.startedAt, day: vnDay(l.startedAt), note: l.note, issueKey: `${project.key}-${l.issue.number}`, issueNumber: l.issue.number, issueTitle: l.issue.title })),
    totalMin,
    byDay: Object.fromEntries(days.map((d) => [d, logs.filter((l) => vnDay(l.startedAt) === d).reduce((s, l) => s + l.minutes, 0)])),
    timesheet: ts ? presentTs(ts, ctx.fa.manage) : null,
    locked: weekLocked(status),
    can: {
      submit: target === userId && ctx.fa.ownTimesheet && timesheetTransitionOk(status, 'submit') && totalMin > 0,
      withdraw: target === userId && timesheetTransitionOk(status, 'withdraw'),
      review: status === 'SUBMITTED' && (target !== userId || ctx.fa.manage) && (await canReviewUser(ctx, target)),
      // CTW-38: Return vẫn được ngay; Approve chỉ khi tuần đã hết (theo ngày VN).
      approve: status === 'SUBMITTED' && weekIsOver(week, vnDay()) && (target !== userId || ctx.fa.manage) && (await canReviewUser(ctx, target)),
      reopen: ctx.fa.manage && status === 'APPROVED',
    },
  };
}

/** Danh sách timesheet (hàng đợi duyệt + lịch sử). MEMBER thường: chỉ của mình. */
export async function listTimesheets(userId: number, projectId: number, q: { status?: string; week?: string }) {
  const ctx = await finCtx(userId, projectId);
  let userFilter: Prisma.WorkTimesheetWhereInput = {};
  if (ctx.fa.review === 'TEAM') userFilter = { userId: { in: [...(await teamMemberIds(ctx.leadTeamIds)), userId] } };
  else if (!ctx.fa.review) userFilter = { userId };
  const rows = await prisma.workTimesheet.findMany({
    where: { projectId, ...userFilter, ...(q.status ? { status: q.status } : {}), ...(q.week ? { weekStart: dateOf(weekStartOf(q.week)) } : {}) },
    orderBy: [{ weekStart: 'desc' }, { userName: 'asc' }],
    take: 500,
    select: TS_SELECT,
  });
  return { items: rows.map((r) => presentTs(r, ctx.fa.manage)), access: ctx.fa };
}

export async function submitWeek(userId: number, projectId: number, input: { weekStart: string; note?: string | null }) {
  const ctx = await finCtx(userId, projectId);
  if (!ctx.fa.ownTimesheet) throw new ForbiddenError('Your role does not log time in this project');
  if (!isWeekStart(input.weekStart)) throw new BadRequestError('weekStart must be a Monday (YYYY-MM-DD)', 'WORK_BAD_WEEK');
  if (input.weekStart > weekStartOf(vnDay())) throw new BadRequestError('You cannot submit a future week', 'WORK_BAD_WEEK');
  const logs = await weekLogs(projectId, userId, input.weekStart);
  const total = logs.reduce((s, l) => s + l.minutes, 0);
  if (!total) throw new BadRequestError('Log some time in this week before submitting it', 'WORK_EMPTY_WEEK');
  const me = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: PUBLIC_USER });
  const ts = await prisma.$transaction(async (tx) => {
    const cur = await tx.workTimesheet.findUnique({ where: { uk_work_timesheet: { projectId, userId, weekStart: dateOf(input.weekStart) } }, select: { id: true, status: true } });
    if (!timesheetTransitionOk(cur?.status ?? null, 'submit')) throw new ConflictError(`This week is already ${cur!.status.toLowerCase()}`);
    const data = { status: 'SUBMITTED', totalMinutes: total, note: input.note?.trim().slice(0, 1000) || null, submittedAt: new Date(), decidedAt: null, decidedById: null, returnReason: null, userName: displayName(me).slice(0, 120) };
    return cur
      ? tx.workTimesheet.update({ where: { id: cur.id }, data: { ...data, version: { increment: 1 } }, select: TS_SELECT })
      : tx.workTimesheet.create({ data: { projectId, userId, weekStart: dateOf(input.weekStart), ...data }, select: TS_SELECT });
  });
  await auditProject(projectId, { actorId: userId, action: 'timesheet.submit', targetType: 'timesheet', targetId: ts.id, summary: `Submitted timesheet for week ${input.weekStart} (${round2(total / 60)} h)` });
  await notifyReviewers(projectId, userId, ts.id, input.weekStart, displayName(me));
  return presentTs(ts, ctx.fa.manage);
}

export async function withdrawWeek(userId: number, projectId: number, timesheetId: number) {
  await finCtx(userId, projectId);
  const ts = await prisma.workTimesheet.findFirst({ where: { id: timesheetId, projectId }, select: { id: true, userId: true, status: true, weekStart: true } });
  if (!ts) throw new NotFoundError('Timesheet not found');
  if (ts.userId !== userId) throw new ForbiddenError('Only the person who submitted can withdraw');
  if (!timesheetTransitionOk(ts.status, 'withdraw')) throw new ConflictError(`This week is ${ts.status.toLowerCase()} and cannot be withdrawn`);
  await prisma.workTimesheet.delete({ where: { id: ts.id } });
  await auditProject(projectId, { actorId: userId, action: 'timesheet.withdraw', targetType: 'timesheet', targetId: ts.id, summary: `Withdrew timesheet for week ${dayOf(ts.weekStart)}` });
  return { withdrawn: true };
}

async function lockTs(tx: Tx, projectId: number, timesheetId: number) {
  await tx.$queryRaw`SELECT id FROM work_timesheets WHERE id = ${timesheetId} FOR UPDATE`;
  const ts = await tx.workTimesheet.findFirst({ where: { id: timesheetId, projectId }, select: { id: true, userId: true, status: true, weekStart: true, userName: true } });
  if (!ts) throw new NotFoundError('Timesheet not found');
  return ts;
}

/** Định giá từng dòng giờ của tuần với đơn giá HIỆN HÀNH (chụp lại lúc duyệt). */
async function priceLines(tx: Tx, projectId: number, userId: number, week: string) {
  const [logs, rates, project, member, teams] = await Promise.all([
    weekLogs(projectId, userId, week),
    tx.workRate.findMany({ where: { projectId } }),
    tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspaceId: true } }),
    loadProjectAccess(userId, projectId),
    tx.workTeamMember.findMany({ where: { userId }, select: { teamId: true, team: { select: { workspaceId: true } } } }),
  ]);
  const rateRows: RateRow[] = rates.map((r) => ({ id: r.id, scope: r.scope, projectRole: r.projectRole, teamId: r.teamId, userId: r.userId, hourlyRate: r.hourlyRate, effectiveFrom: dayOf(r.effectiveFrom) }));
  const userTeamIds = teams.filter((t) => t.team.workspaceId === project.workspaceId).map((t) => t.teamId);
  return logs.map((l) => {
    const day = vnDay(l.startedAt);
    const picked = pickRate(rateRows, { userId, issueTeamId: l.issue.teamId, userTeamIds, projectRole: member?.role ?? null, day });
    return {
      worklogId: l.id, issueId: l.issue.id, issueKey: `${project.key}-${l.issue.number}`.slice(0, 24), issueTitle: l.issue.title.slice(0, 255),
      teamId: l.issue.teamId, stageId: l.issue.stageId, day: dateOf(day), minutes: l.minutes,
      rate: picked?.rate ?? null, rateSource: picked?.source ?? null, cost: lineCost(l.minutes, picked?.rate ?? null), note: l.note,
    };
  });
}

export async function approveWeek(userId: number, projectId: number, timesheetId: number) {
  const ctx = await finCtx(userId, projectId);
  const r = await prisma.$transaction(async (tx) => {
    const ts = await lockTs(tx, projectId, timesheetId);
    if (!(await canReviewUser(ctx, ts.userId))) throw new ForbiddenError('Only a project admin or the lead of this person’s team can approve');
    if (ts.userId === userId && !ctx.fa.manage) throw new ForbiddenError('You cannot approve your own timesheet');
    if (!timesheetTransitionOk(ts.status, 'approve')) throw new ConflictError(`This week is ${ts.status.toLowerCase()}`);
    const week = dayOf(ts.weekStart)!;
    // CTW-38: chặn duyệt tuần chưa kết thúc (lý do ở financeRules.weekIsOver).
    if (!weekIsOver(week, vnDay())) {
      const end = weekEndOf(week);
      throw new AppError(
        `The week of ${week} is not over yet (it ends on Sunday ${end}). Approve it from ${addDay(end)} — approving now would lock days that have not happened yet. Return it if something needs fixing now.`,
        409, 'WORK_WEEK_NOT_OVER', { weekStart: week, weekEnd: end, approvableFrom: addDay(end) },
      );
    }
    const lines = await priceLines(tx, projectId, ts.userId, week);
    await tx.workTimesheetLine.deleteMany({ where: { timesheetId: ts.id } });
    if (lines.length) await tx.workTimesheetLine.createMany({ data: lines.map((l) => ({ ...l, timesheetId: ts.id })) });
    const cost = round2(lines.reduce((s, l) => s + (l.cost ?? 0), 0));
    const minutes = lines.reduce((s, l) => s + l.minutes, 0);
    await tx.workTimesheet.update({ where: { id: ts.id }, data: { status: 'APPROVED', decidedAt: new Date(), decidedById: userId, totalMinutes: minutes, approvedCost: cost, version: { increment: 1 } } });
    return { ts, week, minutes, cost, unpriced: lines.filter((l) => l.rate === null).reduce((s, l) => s + l.minutes, 0) };
  });
  await auditProject(projectId, {
    actorId: userId, action: 'timesheet.approve', targetType: 'timesheet', targetId: timesheetId,
    summary: `Approved ${r.ts.userName}'s timesheet for week ${r.week} (${round2(r.minutes / 60)} h)${r.ts.userId === userId ? ' — self-approved by a project admin' : ''}`,
    detail: { minutes: r.minutes, unpricedMinutes: r.unpriced },
  });
  await notifyPerson(projectId, userId, r.ts.userId, `Timesheet for week ${r.week} approved`);
  await checkBudgetAlerts(projectId, userId);
  return { approved: true, minutes: r.minutes, unpricedMinutes: r.unpriced };
}

export async function returnWeek(userId: number, projectId: number, timesheetId: number, reason: string) {
  const ctx = await finCtx(userId, projectId);
  const why = reason.trim();
  if (!why) throw new BadRequestError('Say why you are returning this timesheet', 'WORK_RETURN_REASON');
  const ts = await prisma.$transaction(async (tx) => {
    const t = await lockTs(tx, projectId, timesheetId);
    if (!(await canReviewUser(ctx, t.userId))) throw new ForbiddenError('Only a project admin or the lead of this person’s team can return it');
    if (!timesheetTransitionOk(t.status, 'return')) throw new ConflictError(`This week is ${t.status.toLowerCase()}`);
    await tx.workTimesheet.update({ where: { id: t.id }, data: { status: 'RETURNED', decidedAt: new Date(), decidedById: userId, returnReason: why.slice(0, 2000), version: { increment: 1 } } });
    return t;
  });
  const week = dayOf(ts.weekStart);
  await auditProject(projectId, { actorId: userId, action: 'timesheet.return', targetType: 'timesheet', targetId: timesheetId, summary: `Returned ${ts.userName}'s timesheet for week ${week}: ${why.slice(0, 200)}` });
  await notifyPerson(projectId, userId, ts.userId, `Timesheet for week ${week} returned: ${why.slice(0, 120)}`);
  return { returned: true };
}

/** Mở khoá tuần ĐÃ DUYỆT: chỉ ADMIN, bắt buộc lý do, audit; dòng chụp bị xoá tới khi duyệt lại. */
export async function reopenWeek(userId: number, projectId: number, timesheetId: number, reason: string) {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const why = reason.trim();
  if (why.length < 5) throw new BadRequestError('Give a reason (at least 5 characters) — it is kept in the audit log', 'WORK_REOPEN_REASON');
  const r = await prisma.$transaction(async (tx) => {
    const t = await lockTs(tx, projectId, timesheetId);
    if (!timesheetTransitionOk(t.status, 'reopen')) throw new ConflictError('Only an approved week can be reopened');
    const before = await tx.workTimesheet.findUniqueOrThrow({ where: { id: t.id }, select: { approvedCost: true, totalMinutes: true } });
    await tx.workTimesheetLine.deleteMany({ where: { timesheetId: t.id } });
    await tx.workTimesheet.update({ where: { id: t.id }, data: { status: 'REOPENED', reopenedAt: new Date(), reopenedById: userId, reopenReason: why.slice(0, 2000), approvedCost: null, version: { increment: 1 } } });
    return { t, before };
  });
  const week = dayOf(r.t.weekStart);
  await auditProject(projectId, {
    actorId: userId, action: 'timesheet.reopen', targetType: 'timesheet', targetId: timesheetId,
    summary: `Reopened ${r.t.userName}'s approved timesheet for week ${week}: ${why.slice(0, 200)}`,
    detail: { reason: why, approvedMinutesBefore: r.before.totalMinutes, approvedCostBefore: r.before.approvedCost },
  });
  await notifyPerson(projectId, userId, r.t.userId, `Timesheet for week ${week} reopened for changes: ${why.slice(0, 120)}`);
  return { reopened: true };
}

// ─── Ngân sách + chi phí (chỉ ADMIN) ─────────────────────────────

export interface BudgetLineInput { name: string; category?: BudgetCategory; stageId?: number | null; amount: number; note?: string | null }

async function assertStage(projectId: number, stageId: number | null | undefined) {
  if (!stageId) return;
  const s = await prisma.workStage.findFirst({ where: { id: stageId, projectId }, select: { id: true } });
  if (!s) throw new BadRequestError('Stage not found in this project', 'WORK_BAD_STAGE');
}

export async function createBudgetLine(userId: number, projectId: number, input: BudgetLineInput) {
  assertManage(await finCtx(userId, projectId));
  await assertStage(projectId, input.stageId);
  const pos = await prisma.workBudgetLine.count({ where: { projectId } });
  const b = await prisma.workBudgetLine.create({ data: { projectId, name: input.name.trim().slice(0, 160), category: input.category ?? 'LABOR', stageId: input.stageId ?? null, amount: round2(input.amount), position: pos, note: input.note?.trim() || null } });
  await auditProject(projectId, { actorId: userId, action: 'finance.budget', targetType: 'budget', targetId: b.id, summary: `Added budget line "${b.name}"` });
  await checkBudgetAlerts(projectId, userId);
  return b;
}

export async function updateBudgetLine(userId: number, projectId: number, id: number, input: Partial<BudgetLineInput>) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workBudgetLine.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Budget line not found');
  await assertStage(projectId, input.stageId);
  const b = await prisma.workBudgetLine.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim().slice(0, 160) } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.stageId !== undefined ? { stageId: input.stageId } : {}),
      ...(input.amount !== undefined ? { amount: round2(input.amount) } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.budget', targetType: 'budget', targetId: id, summary: `Changed budget line "${b.name}"`, detail: { amountFrom: cur.amount, amountTo: b.amount } });
  await checkBudgetAlerts(projectId, userId);
  return b;
}

export async function deleteBudgetLine(userId: number, projectId: number, id: number) {
  assertManage(await finCtx(userId, projectId));
  const n = await prisma.workBudgetLine.deleteMany({ where: { id, projectId } });
  if (!n.count) throw new NotFoundError('Budget line not found');
  await auditProject(projectId, { actorId: userId, action: 'finance.budget', targetType: 'budget', targetId: id, summary: 'Removed a budget line' });
  await checkBudgetAlerts(projectId, userId);
  return { deleted: true };
}

export interface ExpenseInput { spentOn: string; category?: ExpenseCategory; description: string; vendor?: string | null; amount: number; budgetLineId?: number | null; stageId?: number | null }

const EXPENSE_SELECT = { id: true, spentOn: true, category: true, description: true, vendor: true, amount: true, budgetLineId: true, stageId: true, createdById: true, createdAt: true, budgetLine: { select: { id: true, name: true } }, stage: { select: { id: true, n: true, name: true } } } satisfies Prisma.WorkExpenseSelect;

export async function listExpenses(userId: number, projectId: number) {
  assertManage(await finCtx(userId, projectId));
  const rows = await prisma.workExpense.findMany({ where: { projectId }, orderBy: [{ spentOn: 'desc' }, { id: 'desc' }], take: 2000, select: EXPENSE_SELECT });
  return rows.map((e) => ({ ...e, spentOn: dayOf(e.spentOn) }));
}

async function assertBudgetLine(projectId: number, id: number | null | undefined) {
  if (!id) return;
  if (!(await prisma.workBudgetLine.findFirst({ where: { id, projectId }, select: { id: true } }))) throw new BadRequestError('Budget line not found in this project', 'WORK_BAD_BUDGET_LINE');
}

export async function createExpense(userId: number, projectId: number, input: ExpenseInput) {
  assertManage(await finCtx(userId, projectId));
  await assertStage(projectId, input.stageId);
  await assertBudgetLine(projectId, input.budgetLineId);
  const e = await prisma.workExpense.create({
    data: { projectId, spentOn: dateOf(input.spentOn), category: input.category ?? 'OTHER', description: input.description.trim().slice(0, 500), vendor: input.vendor?.trim() || null, amount: round2(input.amount), budgetLineId: input.budgetLineId ?? null, stageId: input.stageId ?? null, createdById: userId },
    select: EXPENSE_SELECT,
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.expense', targetType: 'expense', targetId: e.id, summary: `Recorded expense "${e.description}" (${e.amount})` });
  await checkBudgetAlerts(projectId, userId);
  return { ...e, spentOn: dayOf(e.spentOn) };
}

export async function updateExpense(userId: number, projectId: number, id: number, input: Partial<ExpenseInput>) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workExpense.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Expense not found');
  await assertStage(projectId, input.stageId);
  await assertBudgetLine(projectId, input.budgetLineId);
  const e = await prisma.workExpense.update({
    where: { id },
    data: {
      ...(input.spentOn ? { spentOn: dateOf(input.spentOn) } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.description !== undefined ? { description: input.description.trim().slice(0, 500) } : {}),
      ...(input.vendor !== undefined ? { vendor: input.vendor?.trim() || null } : {}),
      ...(input.amount !== undefined ? { amount: round2(input.amount) } : {}),
      ...(input.budgetLineId !== undefined ? { budgetLineId: input.budgetLineId } : {}),
      ...(input.stageId !== undefined ? { stageId: input.stageId } : {}),
    },
    select: EXPENSE_SELECT,
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.expense', targetType: 'expense', targetId: id, summary: `Changed expense "${e.description}"`, detail: { amountFrom: cur.amount, amountTo: e.amount } });
  await checkBudgetAlerts(projectId, userId);
  return { ...e, spentOn: dayOf(e.spentOn) };
}

export async function deleteExpense(userId: number, projectId: number, id: number) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workExpense.findFirst({ where: { id, projectId }, select: { description: true, amount: true } });
  if (!cur) throw new NotFoundError('Expense not found');
  await prisma.workExpense.delete({ where: { id } });
  await auditProject(projectId, { actorId: userId, action: 'finance.expense', targetType: 'expense', targetId: id, summary: `Removed expense "${cur.description}" (${cur.amount})` });
  await checkBudgetAlerts(projectId, userId);
  return { deleted: true };
}

// ─── Tổng hợp: ngân sách vs thực tế, tốc độ đốt, EAC ─────────────

const EXPENSE_TO_BUDGET: Record<string, BudgetCategory> = { EQUIPMENT: 'EQUIPMENT', SERVICES: 'SERVICES', LICENSE: 'SERVICES', TRAVEL: 'OTHER', OTHER: 'OTHER' };

/** Số liệu tài chính (KHÔNG kiểm quyền — người gọi phải kiểm: summary, steering, present, cảnh báo). */
export async function computeFinance(projectId: number, today = vnDay()) {
  const [settings, budgetLines, expenses, approved, pending, issues, versions, stages, milestones] = await Promise.all([
    settingsRow(projectId),
    prisma.workBudgetLine.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, category: true, stageId: true, amount: true, note: true } }),
    prisma.workExpense.findMany({ where: { projectId }, select: { id: true, amount: true, spentOn: true, category: true, stageId: true, budgetLineId: true, budgetLine: { select: { category: true } } } }),
    prisma.workTimesheetLine.findMany({ where: { timesheet: { projectId, status: 'APPROVED' } }, select: { minutes: true, cost: true, rate: true, day: true, stageId: true, teamId: true, timesheet: { select: { userId: true, userName: true } } } }),
    prisma.workTimesheet.aggregate({ where: { projectId, status: 'SUBMITTED' }, _sum: { totalMinutes: true }, _count: { _all: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { level: 0 } }, select: { originalEstimateMin: true, resolvedAt: true } }),
    prisma.workVersion.findMany({ where: { projectId, status: { not: 'ARCHIVED' }, releaseDate: { not: null } }, select: { releaseDate: true } }),
    prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true, status: true } }),
    prisma.workPaymentMilestone.findMany({ where: { projectId }, select: { amount: true, percent: true, status: true } }),
  ]);
  const laborCost = approved.reduce((s, l) => s + (l.cost ?? 0), 0);
  const expenseCost = expenses.reduce((s, e) => s + e.amount, 0);
  const since28 = new Date(Date.parse(`${today}T00:00:00Z`) - 27 * DAY);
  const last28 = approved.filter((l) => l.day >= since28).reduce((s, l) => s + (l.cost ?? 0), 0)
    + expenses.filter((e) => e.spentOn >= since28).reduce((s, e) => s + e.amount, 0);
  const plannedEnd = versions.map((v) => dayOf(v.releaseDate)!).sort().pop() ?? null;
  const pc = percentComplete(issues.map((i) => ({ originalEstimateMin: i.originalEstimateMin, done: !!i.resolvedAt })));
  const summary = budgetSummary({
    budgetTotal: settings.budgetTotal, budgetLinesSum: budgetLines.reduce((s, b) => s + b.amount, 0),
    laborCost, expenseCost, last28Cost: last28, percentComplete: pc, today, plannedEnd,
  });

  // Theo giai đoạn: ngân sách = dòng gắn giai đoạn; thực tế = giờ duyệt của thẻ thuộc giai đoạn + chi phí gắn giai đoạn.
  const stageRows = [...stages.map((s) => ({ id: s.id as number | null, label: `${s.n}. ${s.name}`, status: s.status })), { id: null, label: 'Not linked to a stage', status: null }]
    .map((s) => ({
      ...s,
      budget: round2(budgetLines.filter((b) => b.stageId === s.id).reduce((a, b) => a + b.amount, 0)),
      actual: round2(approved.filter((l) => l.stageId === s.id).reduce((a, l) => a + (l.cost ?? 0), 0) + expenses.filter((e) => e.stageId === s.id).reduce((a, e) => a + e.amount, 0)),
    }))
    .filter((s) => s.budget || s.actual);
  const categoryRows = (['LABOR', 'EQUIPMENT', 'SERVICES', 'OTHER'] as const).map((c) => ({
    category: c,
    budget: round2(budgetLines.filter((b) => b.category === c).reduce((a, b) => a + b.amount, 0)),
    actual: round2(c === 'LABOR' ? laborCost : expenses.filter((e) => ((e.budgetLine?.category as BudgetCategory | undefined) ?? EXPENSE_TO_BUDGET[e.category] ?? 'OTHER') === c).reduce((a, e) => a + e.amount, 0)),
  }));
  // Theo người (giờ + chi phí đã duyệt).
  const people = new Map<number, { userId: number; name: string; minutes: number; cost: number }>();
  for (const l of approved) {
    const p = people.get(l.timesheet.userId) ?? { userId: l.timesheet.userId, name: l.timesheet.userName, minutes: 0, cost: 0 };
    p.minutes += l.minutes;
    p.cost = round2(p.cost + (l.cost ?? 0));
    people.set(l.timesheet.userId, p);
  }
  // 12 tuần gần nhất: chi phí theo tuần (lao động theo ngày làm, chi phí theo ngày chi).
  const thisWeek = weekStartOf(today);
  const weeks = Array.from({ length: 12 }, (_, i) => new Date(Date.parse(`${thisWeek}T00:00:00Z`) - (11 - i) * 7 * DAY).toISOString().slice(0, 10));
  const weekly = weeks.map((w) => ({
    weekStart: w,
    labor: round2(approved.filter((l) => weekStartOf(dayOf(l.day)!) === w).reduce((a, l) => a + (l.cost ?? 0), 0)),
    expenses: round2(expenses.filter((e) => weekStartOf(dayOf(e.spentOn)!) === w).reduce((a, e) => a + e.amount, 0)),
  }));
  const pay = milestones.map((m) => ({ status: m.status, amount: milestoneAmount(m, settings.contractValue) ?? 0 }));
  return {
    currency: settings.currency, contractValue: settings.contractValue, budgetTotal: settings.budgetTotal, alertLevelSent: settings.alertLevel,
    summary,
    approvedMinutes: approved.reduce((s, l) => s + l.minutes, 0),
    unpricedMinutes: approved.filter((l) => l.rate === null).reduce((s, l) => s + l.minutes, 0),
    pendingMinutes: pending._sum.totalMinutes ?? 0,
    pendingTimesheets: pending._count._all,
    plannedEnd,
    byStage: stageRows,
    byCategory: categoryRows,
    byPerson: [...people.values()].sort((a, b) => b.cost - a.cost),
    weekly,
    budgetLines,
    payments: {
      planned: round2(pay.filter((p) => p.status === 'PLANNED').reduce((a, p) => a + p.amount, 0)),
      due: round2(pay.filter((p) => p.status === 'DUE').reduce((a, p) => a + p.amount, 0)),
      invoiced: round2(pay.filter((p) => p.status === 'INVOICED').reduce((a, p) => a + p.amount, 0)),
      paid: round2(pay.filter((p) => p.status === 'PAID').reduce((a, p) => a + p.amount, 0)),
    },
    formula: EAC_FORMULA,
  };
}

export async function summary(userId: number, projectId: number) {
  assertManage(await finCtx(userId, projectId));
  return { ...(await computeFinance(projectId)), notice: NO_INVOICE_NOTICE };
}

/** Cảnh báo vượt 80/100% ngân sách — báo ADMIN dự án + lead MỘT lần mỗi ngưỡng; ghi ngưỡng hiện tại. */
export async function checkBudgetAlerts(projectId: number, actorId: number | null): Promise<80 | 100 | null> {
  try {
    const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
    if (!modulesOf(p?.settings).finance) return null;
    const f = await computeFinance(projectId);
    const send = alertToSend(f.alertLevelSent, f.summary.alertLevel);
    if (f.summary.alertLevel !== f.alertLevelSent) {
      await prisma.workFinanceSettings.upsert({ where: { projectId }, create: { projectId, alertLevel: f.summary.alertLevel }, update: { alertLevel: f.summary.alertLevel } });
    }
    if (send) {
      const msg = send === 100
        ? `Budget exceeded: actual cost is ${f.summary.percentUsed}% of the budget`
        : `Budget warning: actual cost reached ${f.summary.percentUsed}% of the budget`;
      await notifyManagers(projectId, actorId, msg);
      await auditProject(projectId, { actorId, action: 'finance.alert', targetType: 'project', targetId: projectId, summary: msg });
    }
    return send;
  } catch (err) {
    logger.warn('[work] cảnh báo ngân sách lỗi', { projectId, err: (err as Error).message });
    return null;
  }
}

// ─── Mốc thanh toán ───────────────────────────────────────────────

const PAY_SELECT = {
  id: true, number: true, name: true, percent: true, amount: true, trigger: true, versionId: true, stageId: true, dueDate: true, status: true,
  becameDueAt: true, triggeredByApprovalId: true, invoiceNumber: true, invoicedAt: true, paidAt: true, clientVisible: true, note: true, position: true, createdAt: true,
  version: { select: { id: true, name: true } }, stage: { select: { id: true, n: true, name: true } },
} satisfies Prisma.WorkPaymentMilestoneSelect;

type PayRow = Prisma.WorkPaymentMilestoneGetPayload<{ select: typeof PAY_SELECT }>;

function presentPay(m: PayRow, contractValue: number | null, today: string) {
  const due = dayOf(m.dueDate);
  return { ...m, dueDate: due, computedAmount: milestoneAmount(m, contractValue), overdue: !!due && due < today && (m.status === 'PLANNED' || m.status === 'DUE' || m.status === 'INVOICED') };
}

export async function listPayments(userId: number, projectId: number) {
  assertManage(await finCtx(userId, projectId));
  const s = await settingsRow(projectId);
  const rows = await prisma.workPaymentMilestone.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }], select: PAY_SELECT });
  const today = vnDay();
  return { currency: s.currency, contractValue: s.contractValue, items: rows.map((m) => presentPay(m, s.contractValue, today)), notice: NO_INVOICE_NOTICE };
}

export interface PaymentInput {
  name: string; percent?: number | null; amount?: number | null; trigger?: PaymentTrigger; versionId?: number | null; stageId?: number | null;
  dueDate?: string | null; clientVisible?: boolean; note?: string | null;
}

async function assertPaymentTargets(projectId: number, input: Partial<PaymentInput>) {
  if (input.versionId) {
    if (!(await prisma.workVersion.findFirst({ where: { id: input.versionId, projectId }, select: { id: true } }))) throw new BadRequestError('Version not found in this project', 'WORK_BAD_VERSION');
  }
  await assertStage(projectId, input.stageId);
  if (input.trigger === 'STAGE_GATE' && !input.stageId) throw new BadRequestError('Pick the stage whose gate approval makes this milestone due', 'WORK_BAD_PAYMENT');
  if (input.trigger === 'UAT' && !input.versionId && !input.stageId) throw new BadRequestError('Pick the version or stage whose UAT sign-off makes this milestone due', 'WORK_BAD_PAYMENT');
  if (input.percent !== undefined && input.percent !== null && (input.percent <= 0 || input.percent > 100)) throw new BadRequestError('Percent must be between 0 and 100', 'WORK_BAD_PAYMENT');
}

export async function createPayment(userId: number, projectId: number, input: PaymentInput) {
  assertManage(await finCtx(userId, projectId));
  if ((input.amount === null || input.amount === undefined) && (input.percent === null || input.percent === undefined)) throw new BadRequestError('Give an amount or a percent of the contract value', 'WORK_BAD_PAYMENT');
  await assertPaymentTargets(projectId, input);
  const m = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31004::int, ${projectId}::int)`;
    const agg = await tx.workPaymentMilestone.aggregate({ where: { projectId }, _max: { number: true } });
    const number = (agg._max.number ?? 0) + 1;
    return tx.workPaymentMilestone.create({
      data: {
        projectId, number, position: number, name: input.name.trim().slice(0, 160), percent: input.percent ?? null, amount: input.amount ?? null,
        trigger: input.trigger ?? 'MANUAL', versionId: input.versionId ?? null, stageId: input.stageId ?? null,
        dueDate: input.dueDate ? dateOf(input.dueDate) : null, clientVisible: input.clientVisible === true, note: input.note?.trim() || null, createdById: userId,
      },
      select: { id: true, number: true, name: true },
    });
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.payment', targetType: 'payment', targetId: m.id, summary: `Added payment milestone ${m.number}. ${m.name}` });
  return listPayments(userId, projectId);
}

export async function updatePayment(userId: number, projectId: number, number: number, input: Partial<PaymentInput>) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workPaymentMilestone.findFirst({ where: { projectId, number } });
  if (!cur) throw new NotFoundError('Payment milestone not found');
  await assertPaymentTargets(projectId, { trigger: input.trigger ?? (cur.trigger as PaymentTrigger), versionId: input.versionId !== undefined ? input.versionId : cur.versionId, stageId: input.stageId !== undefined ? input.stageId : cur.stageId, percent: input.percent });
  await prisma.workPaymentMilestone.update({
    where: { id: cur.id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim().slice(0, 160) } : {}),
      ...(input.percent !== undefined ? { percent: input.percent } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.trigger ? { trigger: input.trigger } : {}),
      ...(input.versionId !== undefined ? { versionId: input.versionId } : {}),
      ...(input.stageId !== undefined ? { stageId: input.stageId } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate ? dateOf(input.dueDate) : null } : {}),
      ...(input.clientVisible !== undefined ? { clientVisible: input.clientVisible } : {}),
      ...(input.note !== undefined ? { note: input.note?.trim() || null } : {}),
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.payment', targetType: 'payment', targetId: cur.id, summary: `Changed payment milestone ${number}. ${cur.name}` });
  return listPayments(userId, projectId);
}

export async function deletePayment(userId: number, projectId: number, number: number) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workPaymentMilestone.findFirst({ where: { projectId, number }, select: { id: true, name: true, status: true } });
  if (!cur) throw new NotFoundError('Payment milestone not found');
  if (cur.status === 'INVOICED' || cur.status === 'PAID') throw new ConflictError('An invoiced or paid milestone cannot be deleted');
  await prisma.workPaymentMilestone.delete({ where: { id: cur.id } });
  await auditProject(projectId, { actorId: userId, action: 'finance.payment', targetType: 'payment', targetId: cur.id, summary: `Removed payment milestone ${number}. ${cur.name}` });
  return listPayments(userId, projectId);
}

export async function setPaymentStatus(userId: number, projectId: number, number: number, input: { status: PaymentStatus; invoiceNumber?: string | null }) {
  assertManage(await finCtx(userId, projectId));
  const cur = await prisma.workPaymentMilestone.findFirst({ where: { projectId, number } });
  if (!cur) throw new NotFoundError('Payment milestone not found');
  if (!paymentTransitionOk(cur.status, input.status)) throw new ConflictError(`A ${cur.status.toLowerCase()} milestone cannot move to ${input.status.toLowerCase()}`);
  const invoice = input.invoiceNumber?.trim() || cur.invoiceNumber;
  if ((input.status === 'INVOICED' || input.status === 'PAID') && !invoice) {
    throw new BadRequestError('Enter the invoice number issued by your e-invoice provider — CT Work does not issue invoices', 'WORK_INVOICE_NUMBER');
  }
  const now = new Date();
  await prisma.workPaymentMilestone.update({
    where: { id: cur.id },
    data: {
      status: input.status,
      invoiceNumber: invoice ? invoice.slice(0, 80) : null,
      ...(input.status === 'DUE' && !cur.becameDueAt ? { becameDueAt: now } : {}),
      ...(input.status === 'INVOICED' ? { invoicedAt: cur.invoicedAt ?? now } : {}),
      ...(input.status === 'PAID' ? { paidAt: now, invoicedAt: cur.invoicedAt ?? now } : {}),
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'finance.payment', targetType: 'payment', targetId: cur.id, summary: `Payment milestone ${number}. ${cur.name}: ${cur.status} → ${input.status}${invoice && input.status !== cur.status ? ` (invoice ${invoice})` : ''}` });
  return listPayments(userId, projectId);
}

/**
 * Gọi TRONG transaction quyết định phê duyệt (approvals.service) khi yêu cầu UAT / cổng giai đoạn được
 * DUYỆT: mốc trigger tương ứng PLANNED ⇒ DUE. Trả id mốc vừa DUE để báo sau khi commit.
 */
export async function markMilestonesDueTx(tx: Tx, approvalId: number): Promise<{ projectId: number; ids: number[] }> {
  const a = await tx.workApproval.findUnique({ where: { id: approvalId }, select: { projectId: true, targetType: true, stageId: true, uat: { select: { versionId: true, stageId: true } }, project: { select: { settings: true } } } });
  if (!a || !modulesOf(a.project.settings).finance || (a.targetType !== 'UAT' && a.targetType !== 'STAGE_GATE')) return { projectId: a?.projectId ?? 0, ids: [] };
  const ms = await tx.workPaymentMilestone.findMany({ where: { projectId: a.projectId, status: 'PLANNED', trigger: { in: ['UAT', 'STAGE_GATE'] } }, select: { id: true, status: true, trigger: true, versionId: true, stageId: true } });
  const ids = milestonesTriggeredBy({ targetType: a.targetType, stageId: a.stageId, uat: a.uat ?? null }, ms);
  if (ids.length) await tx.workPaymentMilestone.updateMany({ where: { id: { in: ids }, status: 'PLANNED' }, data: { status: 'DUE', becameDueAt: new Date(), triggeredByApprovalId: approvalId } });
  return { projectId: a.projectId, ids };
}

/** Sau commit: báo PM/kế toán (ADMIN dự án + lead) mốc nào vừa tới hạn thanh toán. */
export async function notifyMilestonesDue(projectId: number, ids: number[], actorId: number | null) {
  if (!ids.length) return;
  const ms = await prisma.workPaymentMilestone.findMany({ where: { id: { in: ids } }, select: { id: true, number: true, name: true } });
  for (const m of ms) {
    const msg = `Payment milestone due: ${m.number}. ${m.name}`;
    await auditProject(projectId, { actorId, action: 'finance.payment', targetType: 'payment', targetId: m.id, summary: `${msg} (approval granted)` });
    await notifyManagers(projectId, actorId, msg, 'payments');
  }
}

// ─── Xuất cho kế toán (.xlsx) ─────────────────────────────────────

export async function accountingXlsx(userId: number, projectId: number): Promise<{ file: string; buffer: Buffer }> {
  const ctx = await finCtx(userId, projectId);
  assertManage(ctx);
  const [project, f, lines, expenses, pays] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } }),
    computeFinance(projectId),
    prisma.workTimesheetLine.findMany({
      where: { timesheet: { projectId, status: 'APPROVED' } },
      orderBy: [{ day: 'asc' }, { id: 'asc' }],
      select: { day: true, minutes: true, rate: true, rateSource: true, cost: true, issueKey: true, issueTitle: true, note: true, timesheet: { select: { userName: true, weekStart: true, decidedAt: true } } },
    }),
    prisma.workExpense.findMany({ where: { projectId }, orderBy: { spentOn: 'asc' }, select: { spentOn: true, category: true, description: true, vendor: true, amount: true, budgetLine: { select: { name: true } }, stage: { select: { n: true, name: true } } } }),
    prisma.workPaymentMilestone.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }], select: PAY_SELECT }),
  ]);
  const cur = f.currency;
  const s = f.summary;
  const today = vnDay();
  const buffer = xlsxWorkbook([
    {
      name: 'Summary', headers: ['Item', 'Value'], widths: [44, 30],
      pre: [[`${project.key} — ${project.name}`], [`Exported ${today}. Currency: ${cur}.`], [NO_INVOICE_NOTICE]],
      data: [
        ['Budget (BAC)', s.bac], ['Actual cost (AC)', s.actual], ['  Labor (approved hours × rate)', s.laborCost], ['  Other expenses', s.expenseCost],
        ['Remaining budget', s.remaining], ['% of budget used', s.percentUsed], ['Burn rate per week (last 28 days ÷ 4)', s.burnRatePerWeek],
        ['% complete', s.percentComplete === null ? null : Math.round(s.percentComplete * 1000) / 10], ['Earned value (EV)', s.ev], ['CPI', s.cpi],
        ['Forecast at completion (EAC)', s.eac], ['EAC method', s.eacMethod], ['Variance at completion (VAC)', s.vac], ['Formula', EAC_FORMULA],
        ['Approved hours', round2(f.approvedMinutes / 60)], ['Approved hours without a rate', round2(f.unpricedMinutes / 60)], ['Hours waiting for approval', round2(f.pendingMinutes / 60)],
        ['Payments planned', f.payments.planned], ['Payments due', f.payments.due], ['Payments invoiced', f.payments.invoiced], ['Payments paid', f.payments.paid],
      ],
    },
    {
      name: 'Approved timesheets', headers: ['Date', 'Week of', 'Person', 'Issue', 'Title', 'Hours', `Rate (${cur}/h)`, 'Rate source', `Cost (${cur})`, 'Approved at', 'Note'],
      widths: [12, 12, 22, 12, 40, 8, 14, 12, 14, 20, 30],
      data: lines.map((l) => [dayOf(l.day), dayOf(l.timesheet.weekStart), l.timesheet.userName, l.issueKey, l.issueTitle, round2(l.minutes / 60), l.rate, l.rateSource ?? 'NO RATE', l.cost, l.timesheet.decidedAt?.toISOString().slice(0, 16).replace('T', ' ') ?? '', l.note ?? '']),
    },
    {
      name: 'Expenses', headers: ['Date', 'Category', 'Description', 'Vendor', `Amount (${cur})`, 'Budget line', 'Stage'], widths: [12, 12, 44, 22, 14, 24, 24],
      data: expenses.map((e) => [dayOf(e.spentOn), e.category, e.description, e.vendor ?? '', e.amount, e.budgetLine?.name ?? '', e.stage ? `${e.stage.n}. ${e.stage.name}` : '']),
    },
    {
      name: 'Payment milestones', headers: ['#', 'Milestone', '%', `Amount (${cur})`, 'Due date', 'Status', 'Invoice number (external)', 'Invoiced', 'Paid', 'Trigger', 'Shared with client'],
      widths: [5, 32, 7, 14, 12, 10, 24, 12, 12, 12, 10],
      data: pays.map((m) => [m.number, m.name, m.percent, milestoneAmount(m, f.contractValue), dayOf(m.dueDate), m.status, m.invoiceNumber ?? '', m.invoicedAt?.toISOString().slice(0, 10) ?? '', m.paidAt?.toISOString().slice(0, 10) ?? '', m.trigger, m.clientVisible ? 'Yes' : 'No']),
    },
  ]);
  await auditProject(projectId, { actorId: userId, action: 'finance.export', targetType: 'project', targetId: projectId, summary: 'Exported finance data for accounting (.xlsx)' });
  return { file: `${project.key}-finance-${today}.xlsx`, buffer };
}

// ─── Cổng khách: mốc thanh toán đã chia sẻ ────────────────────────

/** CHỈ mốc `clientVisible`: tên, số tiền, đơn vị, hạn, trạng thái, số hoá đơn — không đơn giá/chi phí/ghi chú nội bộ. */
export async function portalPayments(projectId: number) {
  const s = await settingsRow(projectId);
  const rows = await prisma.workPaymentMilestone.findMany({
    where: { projectId, clientVisible: true }, orderBy: [{ position: 'asc' }, { number: 'asc' }],
    select: { number: true, name: true, percent: true, amount: true, dueDate: true, status: true, invoiceNumber: true, paidAt: true, becameDueAt: true },
  });
  return {
    currency: s.currency,
    items: rows.map((m) => ({
      number: m.number, name: m.name, percent: m.percent, amount: milestoneAmount(m, s.contractValue), dueDate: dayOf(m.dueDate), status: m.status as PaymentStatus,
      invoiceNumber: m.status === 'INVOICED' || m.status === 'PAID' ? m.invoiceNumber : null, paidAt: m.paidAt, becameDueAt: m.becameDueAt,
    })),
  };
}

// ─── Thông báo ────────────────────────────────────────────────────

async function projectRef(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, leadId: true, workspaceId: true, workspace: { select: { slug: true } } } });
}

/** ADMIN dự án (dòng tường minh + OWNER/ADMIN không gian) + lead dự án = "PM/kế toán". */
export async function financeManagerIds(projectId: number): Promise<number[]> {
  const p = await projectRef(projectId);
  const [pm, ws] = await Promise.all([
    prisma.workProjectMember.findMany({ where: { projectId, role: 'ADMIN' }, select: { userId: true } }),
    prisma.workMember.findMany({ where: { workspaceId: p.workspaceId, role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true } }),
  ]);
  return [...new Set([...pm.map((x) => x.userId), ...ws.map((x) => x.userId), ...(p.leadId ? [p.leadId] : [])])];
}

async function notifyManagers(projectId: number, actorId: number | null, message: string, tab: 'overview' | 'payments' | 'approvals' = 'overview') {
  try {
    const p = await projectRef(projectId);
    const { notifyWork } = await import('./notify.js');
    const ids = await financeManagerIds(projectId);
    for (const receiverId of ids) {
      if (actorId === receiverId) continue;
      await notifyWork({ receiverId, senderId: actorId ?? receiverId, type: 'WORK_ALERT', entityId: projectId, payload: { issueKey: `${p.key} · Finance`, title: message, message, url: `/work/${p.workspace.slug}/${p.key}/finance?tab=${tab}` } });
    }
  } catch (err) {
    logger.warn('[work] báo tài chính lỗi', { projectId, err: (err as Error).message });
  }
}

async function notifyPerson(projectId: number, actorId: number, receiverId: number, message: string) {
  if (actorId === receiverId) return;
  try {
    const p = await projectRef(projectId);
    const { notifyWork } = await import('./notify.js');
    await notifyWork({ receiverId, senderId: actorId, type: 'WORK_ALERT', entityId: projectId, payload: { issueKey: `${p.key} · Timesheet`, title: message, message, url: `/work/${p.workspace.slug}/${p.key}/finance?tab=timesheet` } });
  } catch (err) {
    logger.warn('[work] báo timesheet lỗi', { projectId, err: (err as Error).message });
  }
}

async function notifyReviewers(projectId: number, submitterId: number, timesheetId: number, week: string, name: string) {
  try {
    const p = await projectRef(projectId);
    const teams = await prisma.workTeamMember.findMany({ where: { userId: submitterId, team: { workspaceId: p.workspaceId, archivedAt: null } }, select: { teamId: true } });
    const leads = teams.length ? await prisma.workTeamMember.findMany({ where: { teamId: { in: teams.map((t) => t.teamId) }, role: 'LEAD' }, select: { userId: true } }) : [];
    const ids = [...new Set([...(await financeManagerIds(projectId)), ...leads.map((l) => l.userId)])].filter((u) => u !== submitterId);
    const { notifyWork } = await import('./notify.js');
    for (const receiverId of ids) {
      await notifyWork({ receiverId, senderId: submitterId, type: 'WORK_ALERT', entityId: timesheetId, payload: { issueKey: `${p.key} · Timesheet`, title: `${name} submitted week ${week}`, message: `${name} submitted the timesheet for week ${week}`, url: `/work/${p.workspace.slug}/${p.key}/finance?tab=approvals` } });
    }
  } catch (err) {
    logger.warn('[work] báo người duyệt timesheet lỗi', { projectId, err: (err as Error).message });
  }
}
