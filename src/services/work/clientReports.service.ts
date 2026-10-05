/**
 * CT Work — đợt S4 (04/10/2026): BÁO CÁO & THUYẾT TRÌNH (mô-đun `reports`).
 *
 *   - Báo cáo tuần cho KHÁCH, dựng XÁC ĐỊNH từ dữ liệu ĐÃ CHIA SẺ (thẻ clientVisible, giai đoạn, phê
 *     duyệt chờ khách, version có hạng mục đã chia sẻ, mốc thanh toán clientVisible, CR đã duyệt
 *     clientVisible, rủi ro RAID clientVisible khi lịch bật "include risks"). Theo lịch (thứ + giờ +
 *     múi giờ) cron gửi email cho KHÁCH của dự án + lưu lịch sử đọc được trong cổng.
 *     ⛔ Job nền KHÔNG gọi LLM (LLM_BACKGROUND_ENABLED mặc định tắt — job phải chạy được không cần nó).
 *     File này KHÔNG import tĩnh ai.service/llm; "AI polish" chỉ khi người bấm tay (`polishClientReport`,
 *     import động, dùng `weeklyReport` audience client có sẵn).
 *   - Steering (nội bộ): cùng nguồn + tài chính (chỉ người thấy tiền) + RAID + khối lượng việc.
 *   - Thuyết trình: dữ liệu slide (`presentData`), chế độ "client-safe" = đúng dữ liệu báo cáo khách.
 *
 * Quyền: phần nội bộ = người của đội (governanceAccess.view; khách/GUEST ⇒ 403 WORK_INTERNAL_ONLY);
 * gửi tay = MEMBER+; đổi lịch = ADMIN. Khách chỉ đọc lịch sử qua /portal/reports (đã thuộc `/portal/**`).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { projectLanguage } from './projectLanguage.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl, sendWorkEmail } from './common.js';
import { actionableSteps, can, governanceAccess, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import { approvalForClient } from './approvals.service.js';
import { computeFinance } from './finance.service.js';
import { financeAccess, isoWeekKey, reportDue } from './financeRules.js';
import { RAID_PREFIX, riskLevel, riskScore } from './governance.js';
import { dayOf } from './governanceDb.js';
import { clientMemberIds } from './portalNotify.js';
import { reportEmailLines, reportMarkdown, type ReportData } from './reportRender.js';
import { vnDay } from './sprints.service.js';
import { assertModule, modulesOf, type ModuleMap } from './studio.js';
import type { RaidType } from './constants.js';

const DAY = 86_400_000;
const dateOf = (day: string) => new Date(`${day}T00:00:00.000Z`);
const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

// ─── Ngữ cảnh ─────────────────────────────────────────────────────

async function staffCtx(userId: number, projectId: number, opts: { edit?: boolean } = {}) {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'reports');
  const g = governanceAccess(access.role, access.workspaceRole);
  if (!g.view) throw new AppError('Reports are only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  if (opts.edit && !g.edit) throw new ForbiddenError('You can view but not send reports in this project');
  return access;
}

/** Người xem có thấy TIỀN không (đơn giá/chi phí) — một luật với trang Finance. */
async function seesMoney(access: ProjectAccess, userId: number): Promise<boolean> {
  if (!access.modules.finance) return false;
  const lead = (await prisma.workTeamMember.count({ where: { userId, role: 'LEAD', team: { workspaceId: access.workspaceId } } })) > 0;
  return financeAccess(access.role, access.workspaceRole, lead).manage;
}

// ─── Lịch ─────────────────────────────────────────────────────────

/**
 * CTW-3 (06/10/2026): mặc định TẮT. Gửi email cho khách là hành động đối ngoại — dự án vừa dựng,
 * dữ liệu còn dở thì không được tự gửi. Bật LẦN ĐẦU phải kèm `confirm: true` (sau khi người bấm đã
 * xem trước đúng bản khách sẽ nhận); thiếu ⇒ 409 WORK_REPORT_CONFIRM_REQUIRED.
 */
const DEFAULT_SCHEDULE = { enabled: false, weekday: 5, hour: 16, timezone: 'Asia/Ho_Chi_Minh', includeRisks: false, includeChanges: true };
type ScheduleFields = typeof DEFAULT_SCHEDULE;

async function scheduleOf(projectId: number) {
  const s = await prisma.workReportSchedule.findUnique({ where: { projectId } });
  return s
    ? { enabled: s.enabled, weekday: s.weekday, hour: s.hour, timezone: s.timezone, includeRisks: s.includeRisks, includeChanges: s.includeChanges, confirmedAt: s.confirmedAt }
    : { ...DEFAULT_SCHEDULE, confirmedAt: null as Date | null };
}

const WEEKDAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function getSchedule(userId: number, projectId: number) {
  const access = await staffCtx(userId, projectId);
  const s = await scheduleOf(projectId);
  return {
    ...s,
    /** Lần đầu bật cần xem trước + xác nhận. */
    needsConfirmation: !s.confirmedAt,
    /** "Every Friday at 16:00 (Asia/Ho_Chi_Minh)" — cho banner "Reports go to your client …". */
    cadence: `Every ${WEEKDAY_NAMES[s.weekday] ?? 'week'} at ${String(s.hour).padStart(2, '0')}:00 (${s.timezone})`,
    clientPortal: access.modules.clientPortal,
    recipients: (await clientMemberIds(projectId)).length,
    canEdit: can(access.role, 'project.settings'),
  };
}

export async function updateSchedule(userId: number, projectId: number, input: Partial<ScheduleFields> & { confirm?: boolean }) {
  const access = await staffCtx(userId, projectId);
  if (!can(access.role, 'project.settings')) throw new ForbiddenError('Only project admins can change the report schedule');
  if (input.timezone) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: input.timezone }); } catch { throw new BadRequestError('Unknown time zone', 'WORK_BAD_TIMEZONE'); }
  }
  const { confirm, ...fields } = input;
  const cur = await scheduleOf(projectId);
  if (fields.enabled === true && !cur.enabled && !cur.confirmedAt && confirm !== true) {
    throw new AppError(
      'Preview the report your client will receive, then confirm to turn on automatic weekly emails',
      409, 'WORK_REPORT_CONFIRM_REQUIRED', { recipients: (await clientMemberIds(projectId)).length },
    );
  }
  const confirmData = fields.enabled === true && confirm === true ? { confirmedAt: new Date(), confirmedById: userId } : {};
  const data = { ...fields, ...confirmData, updatedById: userId };
  await prisma.workReportSchedule.upsert({ where: { projectId }, create: { projectId, ...DEFAULT_SCHEDULE, ...data }, update: data });
  await auditProject(projectId, {
    actorId: userId, action: 'report.schedule', targetType: 'project', targetId: projectId,
    summary: fields.enabled === true && !cur.enabled ? 'Turned on automatic client weekly reports (previewed and confirmed)' : fields.enabled === false && cur.enabled ? 'Turned off automatic client weekly reports' : 'Changed the client weekly report schedule',
    detail: { ...input },
  });
  return getSchedule(userId, projectId);
}

// ─── Dựng dữ liệu báo cáo (xác định) ─────────────────────────────

interface BuildOpts {
  audience: 'client' | 'internal';
  from: string;
  to: string;
  includeRisks: boolean;
  includeChanges: boolean;
  /** Steering/present nội bộ của người thấy tiền. */
  includeFinance?: boolean;
}

/**
 * MỘT hàm dựng cho cả ba nơi (báo cáo khách, steering, thuyết trình). audience 'client' ⇒ CHỈ dữ liệu
 * đã chia sẻ: thẻ clientVisible, mốc clientVisible, CR clientVisible, rủi ro clientVisible, không tên
 * người, không giờ/đơn giá. Không kiểm quyền — người gọi kiểm.
 */
export async function buildReportData(projectId: number, modules: ModuleMap, o: BuildOpts): Promise<ReportData> {
  const client = o.audience === 'client';
  const since = new Date(Date.parse(`${o.from}T00:00:00+07:00`));
  const until = new Date(Date.parse(`${o.to}T00:00:00+07:00`) + DAY);
  const shared: Prisma.WorkIssueWhereInput = client ? { clientVisible: true } : {};
  const notEpic: Prisma.WorkIssueWhereInput = { type: { level: { not: 1 } } };
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } });
  const k = (n: number) => `${project.key}-${n}`;

  const [stages, stageTotals, stageDone, completed, inProgress, versions, pending, nextDue] = await Promise.all([
    modules.stages ? prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true, status: true } }) : Promise.resolve([]),
    prisma.workIssue.groupBy({ by: ['stageId'], where: { projectId, deletedAt: null, stageId: { not: null } }, _count: { _all: true } }),
    prisma.workIssue.groupBy({ by: ['stageId'], where: { projectId, deletedAt: null, stageId: { not: null }, resolvedAt: { not: null } }, _count: { _all: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, ...shared, ...notEpic, resolvedAt: { gte: since, lt: until } }, orderBy: { resolvedAt: 'asc' }, take: 60, select: { number: true, title: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, ...shared, ...notEpic, resolvedAt: null, status: { category: 'IN_PROGRESS' } }, orderBy: { updatedAt: 'desc' }, take: 40, select: { number: true, title: true } }),
    prisma.workVersion.findMany({
      where: { projectId, status: 'UNRELEASED', ...(client ? { OR: [{ issues: { some: { clientVisible: true, deletedAt: null } } }, { uatRequests: { some: {} } }] } : {}) },
      orderBy: [{ releaseDate: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }], take: 5,
      select: { name: true, releaseDate: true, issues: { where: { deletedAt: null, ...shared }, select: { resolvedAt: true } } },
    }),
    prisma.workApproval.findMany({
      where: { projectId, status: 'PENDING' },
      select: {
        id: true, title: true, description: true, targetType: true, issueId: true, pageId: true, dueAt: true, mode: true,
        issue: { select: { number: true, title: true, clientVisible: true } }, page: { select: { number: true, title: true, visibility: true } }, stage: { select: { n: true, name: true } },
        changeRequestId: true, changeRequest: { select: { number: true, title: true, clientVisible: true } },
        steps: { select: { id: true, approverId: true, position: true, decision: true } },
      },
    }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, ...shared, ...notEpic, resolvedAt: null, dueDate: { not: null, lte: dateOf(addDays(o.to, 14)) } },
      orderBy: [{ dueDate: 'asc' }, { number: 'asc' }], take: 8, select: { number: true, title: true },
    }),
  ]);

  const totals = new Map(stageTotals.map((r) => [r.stageId, r._count._all]));
  const dones = new Map(stageDone.map((r) => [r.stageId, r._count._all]));
  const stageRows = stages.map((s) => {
    const t = totals.get(s.id) ?? 0;
    const d = dones.get(s.id) ?? 0;
    return { n: s.n, name: s.name, status: s.status, percent: s.status === 'DONE' ? 100 : t ? Math.round((d / t) * 100) : 0 };
  });
  const current = stageRows.find((s) => s.status === 'ACTIVE' || s.status === 'GATE_REVIEW') ?? null;
  const overall = stageRows.length ? Math.round(stageRows.reduce((a, s) => a + s.percent, 0) / stageRows.length) : null;

  // Chờ khách: bước đang tới lượt thuộc về một KHÁCH của dự án (như cổng khách S2b).
  const clientIds = new Set(await clientMemberIds(projectId));
  const waiting = pending
    .filter((a) => actionableSteps(a.mode, a.steps).some((s) => clientIds.has(s.approverId)))
    .map((a) => ({ title: (client ? approvalForClient(a) : a).title, kind: (a.targetType === 'UAT' ? 'UAT' : 'APPROVAL') as 'UAT' | 'APPROVAL', dueAt: a.dueAt?.toISOString() ?? null }));

  // Mốc thanh toán: khách ⇒ chỉ mốc clientVisible; nội bộ ⇒ chỉ khi được xem tiền.
  let payments: ReportData['upcoming']['payments'] = null;
  let currency: string | null = null;
  if (modules.finance && (client || o.includeFinance)) {
    const s = await prisma.workFinanceSettings.findUnique({ where: { projectId }, select: { currency: true, contractValue: true } });
    currency = s?.currency ?? 'VND';
    const { milestoneAmount } = await import('./financeRules.js');
    const ms = await prisma.workPaymentMilestone.findMany({
      where: { projectId, ...(client ? { clientVisible: true } : {}), status: { in: ['PLANNED', 'DUE', 'INVOICED'] } },
      orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { number: 'asc' }], take: 6,
      select: { number: true, name: true, amount: true, percent: true, dueDate: true, status: true },
    });
    payments = ms.map((m) => ({ number: m.number, name: m.name, amount: milestoneAmount(m, s?.contractValue ?? null), dueDate: dayOf(m.dueDate), status: m.status }));
  }

  // CR đã duyệt trong kỳ (khách ⇒ chỉ CR đã chia sẻ).
  let changes: ReportData['changes'] = null;
  if (modules.changeRequests && o.includeChanges) {
    const crs = await prisma.workChangeRequest.findMany({
      where: { projectId, deletedAt: null, status: { in: ['APPROVED', 'IMPLEMENTED'] }, decidedAt: { gte: since, lt: until }, ...(client ? { clientVisible: true } : {}) },
      orderBy: { number: 'asc' }, take: 20,
      select: { number: true, title: true, status: true, scheduleDays: true, costAmount: true, costCurrency: true },
    });
    changes = crs;
  }

  // Rủi ro: khách ⇒ chỉ dòng RISK đánh dấu clientVisible, chỉ khi lịch bật includeRisks.
  let risks: ReportData['risks'] = null;
  if (modules.raid && o.includeRisks) {
    const rs = await prisma.workRaidItem.findMany({
      where: { projectId, deletedAt: null, type: 'RISK', status: { in: ['OPEN', 'MONITORING'] }, ...(client ? { clientVisible: true } : {}) },
      take: 30, select: { number: true, type: true, title: true, probability: true, impact: true, response: true, mitigation: true },
    });
    risks = rs
      .map((r) => ({ score: riskScore(r.probability, r.impact), r }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 8)
      .map(({ score, r }) => ({ key: `${RAID_PREFIX[r.type as RaidType]}-${r.number}`, title: r.title, level: riskLevel(score), response: r.response, mitigation: r.mitigation ? r.mitigation.slice(0, 240) : null }));
  }

  const nextSteps = nextDue.map((i) => ({ key: k(i.number), title: i.title }));
  if (current) {
    const following = stageRows.find((s) => s.n > current.n && s.status === 'NOT_STARTED');
    if (following) nextSteps.push({ key: `Stage ${following.n}`, title: `Prepare ${following.name}` });
  }
  const open = await prisma.workIssue.count({ where: { projectId, deletedAt: null, ...shared, ...notEpic, resolvedAt: null } });

  const data: ReportData = {
    formatVersion: 1,
    audience: o.audience,
    project: { key: project.key, name: project.name },
    period: { from: o.from, to: o.to },
    generatedAt: new Date().toISOString(),
    stages: modules.stages ? stageRows : null,
    currentStage: current,
    overallPercent: overall,
    completed: completed.map((i) => ({ key: k(i.number), title: i.title })),
    inProgress: inProgress.map((i) => ({ key: k(i.number), title: i.title })),
    waitingOnClient: waiting,
    upcoming: {
      versions: versions.map((v) => ({ name: v.name, releaseDate: dayOf(v.releaseDate), items: v.issues.length, done: v.issues.filter((i) => i.resolvedAt).length })),
      payments,
    },
    currency,
    changes,
    risks,
    nextSteps,
    counts: { completed: completed.length, inProgress: inProgress.length, open },
  };
  // Đợt S5a: chỉ số tổng của service desk trong kỳ (khách: chỉ yêu cầu đã chia sẻ — periodSummary tự lọc).
  if (modules.serviceDesk) {
    data.serviceDesk = await (await import('./serviceDesk.service.js')).periodSummary(projectId, since, until, client ? 'client' : 'internal').catch(() => null);
  }
  if (!client) data.internal = await internalExtras(projectId, modules, o, k);
  return data;
}

async function internalExtras(projectId: number, modules: ModuleMap, o: BuildOpts, k: (n: number) => string): Promise<NonNullable<ReportData['internal']>> {
  const today = vnDay();
  const [overdue, pendingApprovals, openIssues] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: null, dueDate: { lt: dateOf(today) }, type: { level: { not: 1 } } },
      orderBy: { dueDate: 'asc' }, take: 10,
      select: { number: true, title: true, dueDate: true, assignee: { select: { username: true, displayName: true, fullName: true } } },
    }),
    prisma.workApproval.count({ where: { projectId, status: 'PENDING' } }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: null, assigneeId: { not: null }, type: { level: { not: 1 } } },
      select: { remainingEstimateMin: true, originalEstimateMin: true, timeSpentMin: true, assignee: { select: { id: true, username: true, displayName: true, fullName: true } } },
    }),
  ]);
  const load = new Map<number, { name: string; open: number; min: number }>();
  for (const i of openIssues) {
    if (!i.assignee) continue;
    const w = load.get(i.assignee.id) ?? { name: displayName(i.assignee), open: 0, min: 0 };
    w.open += 1;
    w.min += i.remainingEstimateMin ?? Math.max(0, (i.originalEstimateMin ?? 0) - i.timeSpentMin);
    load.set(i.assignee.id, w);
  }
  let raid: NonNullable<ReportData['internal']>['raid'] = null;
  if (modules.raid) {
    const rows = await prisma.workRaidItem.findMany({
      where: { projectId, deletedAt: null, status: { notIn: ['CLOSED', 'VALIDATED', 'INVALID', 'MITIGATED'] } },
      select: { number: true, type: true, title: true, probability: true, impact: true, owner: { select: { username: true, displayName: true, fullName: true } } },
    });
    const openBy: Record<string, number> = { RISK: 0, ASSUMPTION: 0, ISSUE: 0, DEPENDENCY: 0 };
    for (const r of rows) openBy[r.type] = (openBy[r.type] ?? 0) + 1;
    raid = {
      open: openBy,
      top: rows.filter((r) => r.type === 'RISK').map((r) => ({ r, score: riskScore(r.probability, r.impact) }))
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5)
        .map(({ r, score }) => ({ key: `R-${r.number}`, title: r.title, score, level: riskLevel(score), owner: r.owner ? displayName(r.owner) : null })),
    };
  }
  let finance: NonNullable<ReportData['internal']>['finance'] = null;
  if (modules.finance && o.includeFinance) {
    const f = await computeFinance(projectId);
    finance = {
      currency: f.currency, bac: f.summary.bac, actual: f.summary.actual, percentUsed: f.summary.percentUsed, burnRatePerWeek: f.summary.burnRatePerWeek,
      eac: f.summary.eac, eacMethod: f.summary.eacMethod, alerts: f.summary.alerts, pendingHours: Math.round((f.pendingMinutes / 60) * 10) / 10, payments: f.payments,
    };
  }
  return {
    overdue: overdue.map((i) => ({ key: k(i.number), title: i.title, dueDate: dayOf(i.dueDate), assignee: i.assignee ? displayName(i.assignee) : null })),
    pendingApprovals,
    raid,
    workload: [...load.values()].sort((a, b) => b.min - a.min).slice(0, 10).map((w) => ({ name: w.name, open: w.open, remainingHours: Math.round((w.min / 60) * 10) / 10 })),
    finance,
  };
}

function periodOf(q: { from?: string; to?: string }) {
  const to = q.to ?? vnDay();
  const from = q.from ?? addDays(to, -6);
  if (from > to) throw new BadRequestError('"From" must be before "to"', 'WORK_BAD_DATES');
  if (Date.parse(to) - Date.parse(from) > 92 * DAY) throw new BadRequestError('Pick a period of at most 3 months', 'WORK_BAD_DATES');
  return { from, to };
}

// ─── Báo cáo tuần cho khách ──────────────────────────────────────

/** Xem trước ĐÚNG bản khách sẽ nhận (nhân viên). */
export async function previewClientWeekly(userId: number, projectId: number, q: { from?: string; to?: string }) {
  const access = await staffCtx(userId, projectId);
  const s = await scheduleOf(projectId);
  const data = await buildReportData(projectId, access.modules, { audience: 'client', ...periodOf(q), includeRisks: s.includeRisks, includeChanges: s.includeChanges });
  return { data, markdown: reportMarkdown(data), recipients: (await clientMemberIds(projectId)).length, clientPortal: access.modules.clientPortal };
}

async function nextReportNumber(tx: Prisma.TransactionClient, projectId: number) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(31005::int, ${projectId}::int)`;
  const agg = await tx.workClientReport.aggregate({ where: { projectId }, _max: { number: true } });
  return (agg._max.number ?? 0) + 1;
}

/** Gửi email cho KHÁCH của dự án (không ai ngoài clientMemberIds). Trả số người đã gửi. */
async function emailClients(projectId: number, reportId: number, data: ReportData): Promise<number> {
  const ids = await clientMemberIds(projectId);
  if (!ids.length) return 0;
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true, workspace: { select: { slug: true } } } });
  const users = await prisma.user.findMany({ where: { id: { in: ids }, enabled: true }, select: { id: true, email: true, workNotifySetting: { select: { emailMode: true } } } });
  let n = 0;
  for (const u of users) {
    if (!u.email || u.workNotifySetting?.emailMode === 'OFF') continue;
    await sendWorkEmail({
      to: u.email,
      subject: `${p.name}: weekly update ${data.period.from} → ${data.period.to}`.slice(0, 240),
      heading: `Weekly update — ${p.name}`,
      lines: reportEmailLines(data),
      cta: { label: 'Open the report', url: frontendUrl(`/work/${p.workspace.slug}/${p.key}/portal?tab=reports&report=${reportId}`) },
      brand: `${p.name} · Client portal`,
      footer: 'You received this email because you are a client on this project. Your project team sends it every week.',
    });
    n += 1;
  }
  return n;
}

/** Nhân viên gửi tay (có thể kèm bản "AI polish" đã sửa). Lưu lịch sử + email khách. */
export async function sendClientWeekly(userId: number, projectId: number, input: { from?: string; to?: string; bodyMarkdown?: string | null; aiPolished?: boolean }) {
  const access = await staffCtx(userId, projectId, { edit: true });
  if (!access.modules.clientPortal) throw new BadRequestError('Turn on the client portal to send reports to your client', 'WORK_NO_CLIENT_PORTAL');
  if (!(await clientMemberIds(projectId)).length) throw new BadRequestError('Invite your client to the portal first — nobody would receive this report', 'WORK_NO_CLIENTS');
  const s = await scheduleOf(projectId);
  const period = periodOf(input);
  const data = await buildReportData(projectId, access.modules, { audience: 'client', ...period, includeRisks: s.includeRisks, includeChanges: s.includeChanges });
  const body = input.bodyMarkdown?.trim() ? input.bodyMarkdown.trim().slice(0, 50_000) : reportMarkdown(data);
  const r = await prisma.$transaction(async (tx) => tx.workClientReport.create({
    data: {
      projectId, number: await nextReportNumber(tx, projectId), kind: 'CLIENT_WEEKLY', source: 'MANUAL', periodStart: dateOf(period.from), periodEnd: dateOf(period.to),
      title: `Weekly update ${period.from} → ${period.to}`, data: data as unknown as Prisma.InputJsonValue, bodyMarkdown: body,
      aiPolished: input.aiPolished === true && !!input.bodyMarkdown?.trim(), clientVisible: true, createdById: userId,
    },
    select: { id: true, number: true },
  }));
  const sent = await emailClients(projectId, r.id, data);
  await prisma.workClientReport.update({ where: { id: r.id }, data: { sentAt: new Date(), recipientCount: sent } });
  await auditProject(projectId, { actorId: userId, action: 'report.send', targetType: 'report', targetId: r.id, summary: `Sent client weekly report #${r.number} to ${sent} client${sent === 1 ? '' : 's'}` });
  return getReport(userId, projectId, r.id);
}

/**
 * "AI polish" — CHỈ khi người bấm tay. Dùng `weeklyReport` audience client có sẵn (chỉ thẻ đã chia sẻ,
 * hạn mức AI của người bấm). Không lưu gì: trả Markdown để người sửa rồi gửi.
 */
export async function polishClientReport(userId: number, projectId: number, input: { language?: 'en' | 'vi' } = {}) {
  await staffCtx(userId, projectId, { edit: true });
  const { weeklyReport } = await import('./ai.service.js');
  // CTW-8: cùng ngôn ngữ với dự án/khách (settings.language hoặc đoán từ dữ liệu) — trước đây luôn ra tiếng Anh.
  const language = input.language ?? (await projectLanguage(projectId));
  const r = await weeklyReport(userId, projectId, { audience: 'client', language });
  return { markdown: r.report, quota: r.quota, language };
}

const REPORT_LIST_SELECT = { id: true, number: true, kind: true, source: true, periodStart: true, periodEnd: true, title: true, aiPolished: true, clientVisible: true, sentAt: true, recipientCount: true, createdAt: true } satisfies Prisma.WorkClientReportSelect;

const presentRow = <T extends { periodStart: Date; periodEnd: Date }>(r: T) => ({ ...r, periodStart: dayOf(r.periodStart), periodEnd: dayOf(r.periodEnd) });

export async function listReports(userId: number, projectId: number, q: { kind?: string } = {}) {
  await staffCtx(userId, projectId);
  const rows = await prisma.workClientReport.findMany({ where: { projectId, ...(q.kind ? { kind: q.kind } : {}) }, orderBy: { createdAt: 'desc' }, take: 200, select: REPORT_LIST_SELECT });
  return rows.map(presentRow);
}

export async function getReport(userId: number, projectId: number, reportId: number) {
  await staffCtx(userId, projectId);
  const r = await prisma.workClientReport.findFirst({ where: { id: reportId, projectId }, select: { ...REPORT_LIST_SELECT, data: true, bodyMarkdown: true } });
  if (!r) throw new NotFoundError('Report not found');
  return presentRow(r);
}

// ─── Steering + thuyết trình ──────────────────────────────────────

export async function steeringReport(userId: number, projectId: number, q: { from?: string; to?: string }) {
  const access = await staffCtx(userId, projectId);
  const money = await seesMoney(access, userId);
  const data = await buildReportData(projectId, access.modules, { audience: 'internal', ...periodOf(q), includeRisks: true, includeChanges: true, includeFinance: money });
  return { data, markdown: reportMarkdown(data), financeIncluded: money };
}

/**
 * Dữ liệu slide. mode 'client' = client-safe (đúng dữ liệu báo cáo khách: chỉ thứ đã chia sẻ, không
 * tiền nội bộ); 'internal' = như steering (tài chính chỉ khi người xem thấy tiền). Ứng viên demo =
 * thẻ xong trong kỳ (client ⇒ chỉ thẻ đã chia sẻ) — người trình bày tự chọn trên giao diện.
 */
export async function presentData(userId: number, projectId: number, q: { mode?: 'client' | 'internal'; from?: string; to?: string }) {
  const access = await staffCtx(userId, projectId);
  const mode = q.mode === 'client' ? 'client' : 'internal';
  const period = q.from || q.to ? periodOf(q) : { from: addDays(vnDay(), -13), to: vnDay() };
  const money = mode === 'internal' && (await seesMoney(access, userId));
  const s = await scheduleOf(projectId);
  const data = await buildReportData(projectId, access.modules, {
    audience: mode === 'client' ? 'client' : 'internal', ...period,
    includeRisks: mode === 'client' ? s.includeRisks : true, includeChanges: true, includeFinance: money,
  });
  const since = new Date(Date.parse(`${period.from}T00:00:00+07:00`));
  const demo = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, resolvedAt: { gte: since }, type: { level: { not: 1 } }, ...(mode === 'client' ? { clientVisible: true } : {}) },
    orderBy: { resolvedAt: 'desc' }, take: 40,
    select: { number: true, title: true, descriptionText: true, type: { select: { name: true } } },
  });
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, description: true } });
  return {
    mode, financeIncluded: money, data,
    description: project.description,
    demoCandidates: demo.map((i) => ({ key: `${project.key}-${i.number}`, number: i.number, title: i.title, type: i.type.name, summary: i.descriptionText ? i.descriptionText.replace(/\s+/g, ' ').slice(0, 220) : null })),
  };
}

// ─── Cổng khách ───────────────────────────────────────────────────

/** Lịch sử báo cáo tuần trong cổng — CHỈ bản đã gửi cho khách (clientVisible). */
export async function portalReports(projectId: number) {
  const rows = await prisma.workClientReport.findMany({
    where: { projectId, kind: 'CLIENT_WEEKLY', clientVisible: true }, orderBy: { createdAt: 'desc' }, take: 100,
    select: { id: true, number: true, periodStart: true, periodEnd: true, title: true, sentAt: true, createdAt: true },
  });
  return rows.map(presentRow);
}

export async function portalReport(projectId: number, reportId: number) {
  const r = await prisma.workClientReport.findFirst({
    where: { id: reportId, projectId, kind: 'CLIENT_WEEKLY', clientVisible: true },
    select: { id: true, number: true, periodStart: true, periodEnd: true, title: true, sentAt: true, createdAt: true, data: true, bodyMarkdown: true, aiPolished: true },
  });
  if (!r) throw new NotFoundError('Report not found');
  return presentRow(r);
}

// ─── Cron (KHÔNG LLM) ─────────────────────────────────────────────

/**
 * Mỗi giờ (cron.service.ts): dự án bật `reports` + `clientPortal`, chưa lưu trữ, tới thứ + giờ hẹn
 * (gửi bù trong ngày nếu lỡ giờ) ⇒ dựng báo cáo XÁC ĐỊNH, lưu lịch sử, email khách. Mỗi tuần ISO
 * đúng MỘT bản tự động (UNIQUE projectId + autoKey). Không có khách ⇒ bỏ qua (không lưu, không gửi).
 */
export async function runClientWeeklyReports(now = new Date(), opts: { projectIds?: number[] } = {}): Promise<number> {
  const projects = await prisma.workProject.findMany({
    where: {
      deletedAt: null, archivedAt: null, workspace: { deletedAt: null }, settings: { path: ['modules', 'reports'], equals: true },
      // Test chỉ chạy trên dự án của nó (không đụng dữ liệu khác trong CSDL dev).
      ...(opts.projectIds ? { id: { in: opts.projectIds } } : {}),
    },
    select: { id: true, settings: true, reportSchedule: true },
    take: 5000,
  });
  let sent = 0;
  for (const p of projects) {
    const modules = modulesOf(p.settings);
    if (!modules.reports || !modules.clientPortal) continue;
    const s = p.reportSchedule ?? { ...DEFAULT_SCHEDULE };
    const due = reportDue(s, now);
    if (!due.due) continue;
    const autoKey = isoWeekKey(due.day);
    try {
      if (await prisma.workClientReport.findUnique({ where: { uk_work_client_report_auto: { projectId: p.id, autoKey } }, select: { id: true } })) continue;
      if (!(await clientMemberIds(p.id)).length) continue;
      const period = { from: addDays(due.day, -6), to: due.day };
      const data = await buildReportData(p.id, modules, { audience: 'client', ...period, includeRisks: s.includeRisks, includeChanges: s.includeChanges });
      let created: { id: number; number: number };
      try {
        created = await prisma.$transaction(async (tx) => tx.workClientReport.create({
          data: {
            projectId: p.id, number: await nextReportNumber(tx, p.id), kind: 'CLIENT_WEEKLY', source: 'AUTO', autoKey,
            periodStart: dateOf(period.from), periodEnd: dateOf(period.to), title: `Weekly update ${period.from} → ${period.to}`,
            data: data as unknown as Prisma.InputJsonValue, bodyMarkdown: reportMarkdown(data), clientVisible: true,
          },
          select: { id: true, number: true },
        }));
      } catch (err) {
        if ((err as { code?: string }).code === 'P2002') continue; // tiến trình khác vừa tạo bản của tuần này
        throw err;
      }
      const n = await emailClients(p.id, created.id, data);
      await prisma.workClientReport.update({ where: { id: created.id }, data: { sentAt: new Date(), recipientCount: n } });
      await auditProject(p.id, { actorId: null, action: 'report.auto', targetType: 'report', targetId: created.id, summary: `Automatic client weekly report #${created.number} sent to ${n} client${n === 1 ? '' : 's'}` });
      sent += 1;
    } catch (err) {
      logger.warn('[work] báo cáo tuần tự động lỗi', { projectId: p.id, err: (err as Error).message });
    }
  }
  return sent;
}

/** Cho route portal: dự án có bật báo cáo không (khách thấy tab Reports). */
export async function reportsEnabledFor(userId: number, projectId: number): Promise<boolean> {
  const a = await loadProjectAccess(userId, projectId);
  return !!a?.modules.reports;
}
