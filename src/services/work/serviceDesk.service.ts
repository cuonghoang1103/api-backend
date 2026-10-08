/**
 * CT Work — đợt S5a (04/10/2026): SERVICE DESK & SLA (mô-đun `serviceDesk`). Luật thuần ở slaRules.ts.
 *
 * Mô hình:
 *   - Một thẻ đi qua service desk ⇔ có MỘT dòng work_desk_tickets (loại yêu cầu, Impact × Urgency ⇒ P1–P4,
 *     người yêu cầu, câu trả lời form, chờ khách, first response, CSAT, Problem). Thẻ cũ không có dòng ⇒ y nguyên.
 *   - Ưu tiên P1–P4 là cột RIÊNG (work_desk_tickets.priority) — TÁCH khỏi work_issues.priority (1–5). Lý do (ít
 *     rủi ro nhất): ánh xạ hai chiều thì mọi thao tác đổi ưu tiên cũ (kéo board, sửa hàng loạt, luật tự động, AI,
 *     nhập Jira) sẽ ÂM THẦM đổi mục tiêu SLA, và 5 mức không chia đều cho 4. Lúc TẠO thẻ qua desk, ưu tiên cũ
 *     được GIEO một lần theo P (P1→1 … P4→4) để board sắp xếp hợp lý; sau đó hai trường độc lập.
 *   - Đồng hồ SLA LUÔN tính lại từ work_sla_events (computeSla). Các cột frStatus/resStatus… chỉ là bản chụp cho hàng đợi.
 *   - Móc nối: issueChange.applyIssueChange (sau commit, đổi trạng thái) ⇒ `onIssueChanged`; issues.addComment
 *     (sau commit) ⇒ `onComment`. Gọi TRỰC TIẾP (await) chứ không qua bus sự kiện: một thay đổi luôn có đúng một
 *     sự kiện SLA ngay khi lệnh trả về — test và giao diện không phải đợi listener.
 *   - Cron 5 phút (`runSlaChecks`, KHÔNG LLM): tính lại thẻ đang mở, cảnh báo nội bộ AT_RISK / BREACHED — mỗi mốc
 *     ĐÚNG MỘT LẦN (frAlert/resAlert chỉ tăng; đổi mức P mới được hạ — slaRules.lowerAlertOnPriorityChange).
 *
 * Quyền: phần nội bộ qua `deskCtx` (permissions.deskAccess — khách/GUEST ⇒ 403 WORK_INTERNAL_ONLY; khách bị cách ly
 * còn bị chốt tuyến CLIENT_PORTAL_ONLY trước đó). Khách chỉ đi qua /portal/desk/** (portalCtx): xem MỤC TIÊU
 * ("We'll respond within …"), không bao giờ thấy thời gian đã chạy, vi phạm, sự kiện, Problem hay ghi chú nội bộ.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import type { PortalRequestKind } from './constants.js';
import type { FieldChange, WorkActor } from './events.js';
import { emitWorkEvent } from './events.js';
import { xlsxWorkbook } from './exchange.service.js';
import { markdownDoc, nextNumber as govNextNumber } from './governanceDb.js';
import { applyIssueChange, createIssue } from './issueChange.js';
import { can, deskAccess, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import {
  DEFAULT_CALENDAR, DESK_LEVELS, DESK_PRIORITIES, IMPACT_TEXT, URGENCY_TEXT, alertLevelOf, alertToSend, calendarUsable, cleanFieldAnswers,
  compactMinutes, computeSla, durationText, goalsOf, localStamp, lowerAlertOnPriorityChange, matrixOf, monthOf, overallMetPercent, priorityOf,
  reportCell, requestTypesOf, validTimezone,
  type DeskLevel, type DeskPriority, type PriorityMatrix, type ProblemStatus, type ReportRow, type RequestTypeConfig, type RequestTypeKey,
  type SlaEvent, type SlaEventKind, type SlaGoals, type SlaResult, type TargetResult, type WorkCalendar,
} from './slaRules.js';
import { assertModule, modulesOf } from './studio.js';
import { projectLanguage } from './projectLanguage.js';

type Tx = Prisma.TransactionClient;
const DAY = 86_400_000;
const SYSTEM: WorkActor = { kind: 'SYSTEM', userId: null };

// ═══ Cấu hình ═══════════════════════════════════════════════════════

export interface DeskConfig {
  calendar: WorkCalendar;
  goals: SlaGoals;
  matrix: PriorityMatrix;
  requestTypes: RequestTypeConfig[];
  pauseStatusIds: number[];
  responseStatusIds: number[];
  atRiskPercent: number;
  /** Đã lưu cấu hình chưa (chưa ⇒ đang dùng mặc định). */
  saved: boolean;
}

const ids = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x): x is number => Number.isInteger(x) && x > 0))] : []);
const dayRe = /^\d{4}-\d{2}-\d{2}$/;

/** Đọc cấu hình của dự án (thiếu dòng ⇒ mặc định; trạng thái "Waiting for customer" đoán theo TÊN chỉ khi chưa lưu). */
export async function loadDeskConfig(projectId: number, tx: Tx | typeof prisma = prisma): Promise<DeskConfig> {
  const row = await tx.workDeskSettings.findUnique({ where: { projectId } });
  let pause = ids(row?.pauseStatusIds);
  if (!row) {
    const st = await tx.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true } });
    pause = st.filter((s) => /waiting (for|on) (the )?(customer|client)|pending (customer|client)|chờ khách/i.test(s.name)).map((s) => s.id);
  }
  const calendar: WorkCalendar = row
    ? {
      timezone: validTimezone(row.timezone) ? row.timezone : DEFAULT_CALENDAR.timezone,
      workDays: ids(row.workDays).filter((d) => d <= 7),
      startMin: row.workStart, endMin: row.workEnd,
      holidays: Array.isArray(row.holidays) ? (row.holidays as unknown[]).filter((d): d is string => typeof d === 'string' && dayRe.test(d)) : [],
    }
    : { ...DEFAULT_CALENDAR };
  return {
    calendar: calendarUsable(calendar) ? calendar : { ...DEFAULT_CALENDAR, holidays: calendar.holidays },
    goals: goalsOf(row?.goals),
    matrix: matrixOf(row?.matrix),
    requestTypes: requestTypesOf(row?.requestTypes, await projectLanguage(projectId)), // CTW-14
    pauseStatusIds: pause,
    responseStatusIds: ids(row?.responseStatusIds),
    atRiskPercent: row?.atRiskPercent ?? 75,
    saved: !!row,
  };
}

// ═══ Ngữ cảnh + quyền ════════════════════════════════════════════════

export interface DeskCtx { access: ProjectAccess; canWork: boolean; canConfigure: boolean }

/**
 * Cổng của mọi tuyến NỘI BỘ: dự án vào được (404), mô-đun bật (403 MODULE_DISABLED — dự án cũ y nguyên), người
 * của đội (khách/GUEST ⇒ 403 WORK_INTERNAL_ONLY), lệnh xử lý cần MEMBER+, cấu hình cần ADMIN.
 */
export async function deskCtx(userId: number, projectId: number, opts: { work?: boolean; configure?: boolean } = {}): Promise<DeskCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, 'serviceDesk');
  const d = deskAccess(access.role, access.workspaceRole);
  if (!d.view) throw new AppError('The service desk queues are only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  if (opts.work && !d.work) throw new ForbiddenError('You can view the service desk but not work on requests in this project');
  if (opts.configure && !d.configure) throw new ForbiddenError('Only a project admin can change service desk settings');
  return { access, canWork: d.work, canConfigure: d.configure };
}

// ═══ Cấu hình — đọc / ghi ════════════════════════════════════════════

export async function getSettings(userId: number, projectId: number) {
  const ctx = await deskCtx(userId, projectId);
  const cfg = await loadDeskConfig(projectId);
  const statuses = await prisma.workStatus.findMany({
    where: { workflow: { projectId } }, orderBy: [{ workflowId: 'asc' }, { position: 'asc' }],
    select: { id: true, name: true, category: true, workflow: { select: { name: true, isDefault: true } } },
  });
  return {
    ...cfg,
    canConfigure: ctx.canConfigure,
    statuses: statuses.map((s) => ({ id: s.id, name: s.name, category: s.category, workflow: s.workflow.name, isDefault: s.workflow.isDefault })),
    targetsText: targetsText(cfg),
    rules: SLA_RULE_TEXT,
  };
}

export interface DeskSettingsPatch {
  timezone?: string;
  workDays?: number[];
  workStart?: number;
  workEnd?: number;
  holidays?: string[];
  goals?: Record<string, { firstResponseMin?: number; resolutionMin?: number; calendar?: 'BUSINESS' | 'ALWAYS' }>;
  matrix?: Record<string, Record<string, string>>;
  requestTypes?: unknown[];
  pauseStatusIds?: number[];
  responseStatusIds?: number[];
  atRiskPercent?: number;
}

export async function updateSettings(userId: number, projectId: number, patch: DeskSettingsPatch) {
  await deskCtx(userId, projectId, { configure: true });
  const cur = await loadDeskConfig(projectId);
  const tz = patch.timezone ?? cur.calendar.timezone;
  if (!validTimezone(tz)) throw new BadRequestError('Unknown time zone', 'WORK_BAD_TIMEZONE');
  const workDays = patch.workDays ? [...new Set(patch.workDays)].filter((d) => d >= 1 && d <= 7).sort() : cur.calendar.workDays;
  const start = patch.workStart ?? cur.calendar.startMin;
  const end = patch.workEnd ?? cur.calendar.endMin;
  const cal: WorkCalendar = { timezone: tz, workDays, startMin: start, endMin: end, holidays: patch.holidays ?? cur.calendar.holidays };
  if (!workDays.length) throw new BadRequestError('Pick at least one working day', 'WORK_BAD_CALENDAR');
  if (!calendarUsable(cal)) throw new BadRequestError('Working hours must start before they end, within one day', 'WORK_BAD_CALENDAR');
  const holidays = [...new Set((patch.holidays ?? cur.calendar.holidays).filter((d) => dayRe.test(d)))].sort().slice(0, 400);
  const statusIds = new Set((await prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true } })).map((s) => s.id));
  const pause = patch.pauseStatusIds ? ids(patch.pauseStatusIds).filter((i) => statusIds.has(i)) : cur.pauseStatusIds;
  const resp = patch.responseStatusIds ? ids(patch.responseStatusIds).filter((i) => statusIds.has(i)) : cur.responseStatusIds;
  const goals = patch.goals ? goalsOf({ ...cur.goals, ...Object.fromEntries(Object.entries(patch.goals).map(([k, v]) => [k, { ...(cur.goals as Record<string, object>)[k], ...v }])) }) : cur.goals;
  for (const p of DESK_PRIORITIES) {
    if (goals[p].firstResponseMin > goals[p].resolutionMin) throw new BadRequestError(`${p}: time to first response cannot be longer than time to resolution`, 'WORK_BAD_GOALS');
  }
  const matrix = patch.matrix ? matrixOf({ ...cur.matrix, ...patch.matrix }) : cur.matrix;
  const requestTypes = patch.requestTypes ? requestTypesOf(patch.requestTypes) : cur.requestTypes;
  if (!requestTypes.some((t) => t.enabled)) throw new BadRequestError('Keep at least one request type turned on', 'WORK_BAD_REQUEST_TYPES');
  const atRisk = patch.atRiskPercent ?? cur.atRiskPercent;
  if (!Number.isInteger(atRisk) || atRisk < 10 || atRisk > 99) throw new BadRequestError('The at-risk threshold must be 10–99%', 'WORK_BAD_GOALS');
  const data = {
    timezone: tz, workDays, workStart: start, workEnd: end, holidays,
    goals: goals as unknown as Prisma.InputJsonValue, matrix: matrix as unknown as Prisma.InputJsonValue,
    requestTypes: requestTypes as unknown as Prisma.InputJsonValue,
    pauseStatusIds: pause, responseStatusIds: resp, atRiskPercent: atRisk, updatedById: userId,
  };
  await prisma.workDeskSettings.upsert({ where: { projectId }, create: { projectId, ...data }, update: data });
  await auditProject(projectId, { actorId: userId, action: 'desk.settings', targetType: 'project', targetId: projectId, summary: 'Updated service desk settings (request types, priorities, SLA goals, working hours)' });
  // Mục tiêu/lịch đổi ⇒ tính lại ngay các yêu cầu đang mở (đồng hồ trên hàng đợi khớp cấu hình mới).
  const open = await prisma.workDeskTicket.findMany({ where: { issue: { projectId, deletedAt: null, resolvedAt: null } }, select: { id: true }, take: 2000 });
  for (const t of open) await refreshTicket(t.id).catch(() => undefined);
  return getSettings(userId, projectId);
}

/** Luật bằng chữ — trả kèm API để giao diện hiện "How is SLA computed?" (giống slaRules.ts). */
export const SLA_RULE_TEXT = [
  'The clock starts when the request is created and only runs during the project’s working hours (working days, hours and holidays, in the project time zone) — unless that priority is set to 24/7.',
  'Waiting for customer pauses the clock; it resumes when the customer replies (or someone takes the request off waiting). Pauses can happen many times.',
  'Time to first response stops at the first PUBLIC reply from the team (or a move into a status configured as a response). Resolving also stops it.',
  'Time to resolution stops when the issue reaches a Done status. Reopening continues the same clock — it does not restart from zero.',
  'Changing the priority recomputes the goal of the NEW priority over the whole time since the request was created.',
  'At risk = at least the configured share (default 75%) of the goal used. Breached = more than the goal used.',
];

/** Mục tiêu theo mức P, bằng chữ — khách chỉ thấy đúng chữ này. */
function targetsText(cfg: DeskConfig) {
  return Object.fromEntries(DESK_PRIORITIES.map((p) => [p, {
    respond: durationText(cfg.goals[p].firstResponseMin, cfg.goals[p].calendar, cfg.calendar),
    resolve: durationText(cfg.goals[p].resolutionMin, cfg.goals[p].calendar, cfg.calendar),
  }])) as Record<DeskPriority, { respond: string; resolve: string }>;
}

// ═══ Sự kiện + tính lại ══════════════════════════════════════════════

async function addEvent(tx: Tx | typeof prisma, ticketId: number, kind: SlaEventKind, at: Date, actorId: number | null, value?: string | null, note?: string | null) {
  await tx.workSlaEvent.create({ data: { ticketId, kind, at, actorId, value: value ?? null, note: note?.slice(0, 200) ?? null } });
}

/** Đồng hồ SLA của một yêu cầu tại `now` — chỉ từ sự kiện + cấu hình. */
export function slaOf(t: { priority: string; events: Array<{ kind: string; at: Date; value: string | null }> }, cfg: DeskConfig, now = Date.now()): SlaResult {
  const events: SlaEvent[] = t.events.map((e) => ({ kind: e.kind as SlaEventKind, at: e.at, value: e.value }));
  return computeSla(events, t.priority as DeskPriority, cfg.goals, cfg.calendar, now, cfg.atRiskPercent);
}

const iso = (n: number | null) => (n === null ? null : new Date(n));

/** Tính lại + chụp bản trạng thái vào các cột frStatus/resStatus… (hàng đợi sắp xếp theo đó). */
export async function refreshTicket(ticketId: number, now = new Date(), cfgIn?: DeskConfig): Promise<SlaResult | null> {
  const t = await prisma.workDeskTicket.findUnique({
    where: { id: ticketId },
    select: { id: true, priority: true, issue: { select: { projectId: true } }, events: { orderBy: [{ at: 'asc' }, { id: 'asc' }], select: { kind: true, at: true, value: true } } },
  });
  if (!t) return null;
  const cfg = cfgIn ?? (await loadDeskConfig(t.issue.projectId));
  const r = slaOf(t, cfg, now.getTime());
  await prisma.workDeskTicket.update({
    where: { id: ticketId },
    data: {
      frStatus: r.firstResponse.status, resStatus: r.resolution.status,
      frDueAt: iso(r.firstResponse.dueAt), resDueAt: iso(r.resolution.dueAt),
      frBreachedAt: iso(r.firstResponse.breachedAt), resBreachedAt: iso(r.resolution.breachedAt),
      slaCheckedAt: now,
    },
  });
  return r;
}

// ═══ Tạo yêu cầu ═════════════════════════════════════════════════════

const KIND_FOR_TYPE: Record<RequestTypeKey, PortalRequestKind> = { INCIDENT: 'BUG', SERVICE_REQUEST: 'QUESTION', QUESTION: 'QUESTION', CHANGE: 'CHANGE' };
const TYPE_FOR_KIND: Record<PortalRequestKind, RequestTypeKey> = { BUG: 'INCIDENT', CHANGE: 'CHANGE', QUESTION: 'QUESTION', FEEDBACK: 'QUESTION' };
const P_TO_ISSUE_PRIORITY: Record<DeskPriority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };

interface TicketInput {
  requestType: RequestTypeKey;
  impact: DeskLevel;
  urgency: DeskLevel;
  /** Ghi đè mức P (nhân viên); không có ⇒ theo ma trận. */
  priority?: DeskPriority | null;
  channel: 'PORTAL' | 'STAFF';
  requesterId: number | null;
  fields: Record<string, string>;
  /** Đồng hồ bắt đầu lúc nào (thẻ mới: lúc tạo thẻ; thẻ cũ đưa vào desk: bây giờ). */
  startAt: Date;
  actorId: number | null;
}

async function attachTicket(issueId: number, cfg: DeskConfig, input: TicketInput) {
  const priority = input.priority ?? priorityOf(input.impact, input.urgency, cfg.matrix);
  const ticket = await prisma.$transaction(async (tx) => {
    if (await tx.workDeskTicket.findUnique({ where: { issueId }, select: { id: true } })) throw new ConflictError('This issue is already a service desk request');
    const t = await tx.workDeskTicket.create({
      data: {
        issueId, requestType: input.requestType, impact: input.impact, urgency: input.urgency, priority, channel: input.channel,
        requesterId: input.requesterId, fields: input.fields as Prisma.InputJsonValue,
      },
      select: { id: true },
    });
    await addEvent(tx, t.id, 'START', input.startAt, input.actorId, priority);
    return t;
  });
  await refreshTicket(ticket.id, new Date(), cfg);
  return { id: ticket.id, priority };
}

function fieldsText(t: RequestTypeConfig, values: Record<string, string>): string | null {
  const lines = t.fields.filter((f) => values[f.key]).map((f) => `${f.label}\n${values[f.key]}`);
  return lines.length ? lines.join('\n\n') : null;
}

/** Change từ khách: tạo CR nháp (mô-đun changeRequests) trỏ về thẻ gốc. Không kiểm quyền govCtx — đây là đường hệ thống. */
async function draftChangeRequest(projectId: number, issueId: number, actorId: number, title: string, reason: string | null) {
  const cr = await prisma.$transaction(async (tx) => {
    const number = await govNextNumber(tx, 'cr', projectId);
    const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { leadId: true } });
    return tx.workChangeRequest.create({
      data: { projectId, number, title: title.slice(0, 255), status: 'DRAFT', reason: reason?.slice(0, 20_000) || null, requesterId: actorId, createdById: actorId, ownerId: p.leadId, sourceIssueId: issueId },
      select: { id: true, number: true },
    });
  });
  await prisma.workChangeRequestLink.create({ data: { changeRequestId: cr.id, issueId, role: 'AFFECTED', createdById: actorId } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'cr', number: cr.number, action: 'created', actor: { kind: 'USER', userId: actorId } });
  await auditProject(projectId, { actorId, action: 'cr.create', targetType: 'change_request', targetId: cr.id, summary: `Draft CR-${cr.number} from a service desk change request: ${title}`.slice(0, 300) });
  return cr.number;
}

/**
 * Đường portal cũ (S2b `POST /portal/requests`, loại BUG/CHANGE/QUESTION/FEEDBACK) khi mô-đun serviceDesk BẬT:
 * thẻ vẫn tạo như cũ, thêm dòng desk với tác động/khẩn cấp MẶC ĐỊNH của loại tương ứng ⇒ mọi yêu cầu của khách
 * đều có SLA. Lỗi chỉ ghi log — không làm hỏng lệnh gửi của khách.
 */
export async function attachFromLegacyPortal(projectId: number, issueId: number, kind: PortalRequestKind, requesterId: number): Promise<void> {
  try {
    const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
    if (!p || !modulesOf(p.settings).serviceDesk) return;
    const cfg = await loadDeskConfig(projectId);
    const type = cfg.requestTypes.find((t) => t.key === TYPE_FOR_KIND[kind])!;
    const issue = await prisma.workIssue.findUniqueOrThrow({ where: { id: issueId }, select: { createdAt: true } });
    await attachTicket(issueId, cfg, { requestType: type.key, impact: type.defaultImpact, urgency: type.defaultUrgency, channel: 'PORTAL', requesterId, fields: {}, startAt: issue.createdAt, actorId: requesterId });
  } catch (err) {
    logger.warn('[work] desk: gắn SLA cho yêu cầu cổng cũ lỗi', { issueId, err: (err as Error).message });
  }
}

export interface PortalDeskInput {
  requestType: RequestTypeKey;
  title: string;
  description?: string | null;
  impact?: DeskLevel | null;
  urgency?: DeskLevel | null;
  fields?: Record<string, unknown> | null;
}

/** Khách gửi yêu cầu qua cổng: chọn loại + mô tả tác động/khẩn cấp dễ hiểu ⇒ hệ thống ra P ⇒ thẻ clientVisible có SLA. */
export async function portalSubmit(userId: number, projectId: number, input: PortalDeskInput) {
  const { portalCtx, createClientIssue, notifyTeamOfRequest } = await import('./portal.service.js');
  const ctx = await portalCtx(userId, projectId);
  assertModule(ctx.access, 'serviceDesk');
  if (ctx.preview) throw new ForbiddenError('Preview as client is read-only');
  if (!can(ctx.access.role, 'issue.create')) throw new ForbiddenError('You cannot submit requests in this project');
  const cfg = await loadDeskConfig(projectId);
  const type = cfg.requestTypes.find((t) => t.key === input.requestType && t.enabled);
  if (!type) throw new BadRequestError('This type of request is not available', 'WORK_BAD_REQUEST_TYPE');
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Give your request a short title', 'WORK_TITLE_REQUIRED');
  const { values, missing } = cleanFieldAnswers(type, input.fields ?? {});
  if (missing.length) throw new BadRequestError(`Please fill in: ${missing.join(', ')}`, 'WORK_DESK_FIELDS');
  // Khách chỉ chọn mô tả; loại không hỏi tác động ⇒ dùng mặc định của loại (khách không tự nâng mức được).
  const impact = type.askImpact && input.impact ? input.impact : type.defaultImpact;
  const urgency = type.askImpact && input.urgency ? input.urgency : type.defaultUrgency;
  const priority = priorityOf(impact, urgency, cfg.matrix);
  const created = await createClientIssue(projectId, userId, {
    kind: KIND_FOR_TYPE[type.key], title, description: input.description ?? null, priority: P_TO_ISSUE_PRIORITY[priority], extraText: fieldsText(type, values),
  });
  const issue = await prisma.workIssue.findUniqueOrThrow({ where: { id: created.id }, select: { createdAt: true } });
  await attachTicket(created.id, cfg, { requestType: type.key, impact, urgency, channel: 'PORTAL', requesterId: userId, fields: values, startAt: issue.createdAt, actorId: userId });
  let crNumber: number | null = null;
  if (type.key === 'CHANGE' && type.useChangeRequest && ctx.access.modules.changeRequests) {
    crNumber = await draftChangeRequest(projectId, created.id, userId, title, [input.description?.trim(), fieldsText(type, values)].filter(Boolean).join('\n\n') || null).catch((err) => {
      logger.warn('[work] desk: tạo CR nháp lỗi', { err: (err as Error).message });
      return null;
    });
  }
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: created.id, actor: { kind: 'USER', userId }, changes: [{ field: 'clientVisible', from: 'false', to: 'true' }] });
  await auditProject(projectId, { actorId: userId, action: 'desk.request', targetType: 'issue', targetId: created.id, summary: `Client request ${ctx.access.key}-${created.number} (${type.name}, ${priority}): ${title.slice(0, 120)}` });
  await notifyTeamOfRequest(projectId, userId, created, title, `New ${priority} ${type.name.toLowerCase()} from the client portal`);
  const tt = targetsText(cfg)[priority];
  return { number: created.number, key: `${ctx.access.key}-${created.number}`, respondWithin: tt.respond, resolveWithin: tt.resolve, changeRequest: crNumber };
}

export interface StaffTicketInput {
  requestType: RequestTypeKey;
  impact: DeskLevel;
  urgency: DeskLevel;
  priority?: DeskPriority | null;
  requesterId?: number | null;
  fields?: Record<string, unknown> | null;
  /** Đưa một thẻ CÓ SẴN vào service desk (đồng hồ bắt đầu từ bây giờ). */
  issueNumber?: number | null;
  /** …hoặc tạo thẻ mới. */
  title?: string | null;
  description?: string | null;
}

/** Nhân viên tạo yêu cầu (thay khách gọi điện/nhắn) hoặc đưa thẻ có sẵn vào service desk. */
export async function staffCreate(userId: number, projectId: number, input: StaffTicketInput) {
  const ctx = await deskCtx(userId, projectId, { work: true });
  const cfg = await loadDeskConfig(projectId);
  const type = cfg.requestTypes.find((t) => t.key === input.requestType);
  if (!type) throw new BadRequestError('Unknown request type', 'WORK_BAD_REQUEST_TYPE');
  if (input.requesterId) {
    const a = await loadProjectAccess(input.requesterId, projectId);
    if (!a) throw new BadRequestError('The requester must be a member of this project', 'WORK_BAD_REQUESTER');
  }
  const values = cleanFieldAnswers(type, input.fields ?? {}).values;
  let issueId: number;
  let number: number;
  let startAt: Date;
  if (input.issueNumber) {
    const i = await prisma.workIssue.findFirst({ where: { projectId, number: input.issueNumber, deletedAt: null }, select: { id: true, number: true } });
    if (!i) throw new NotFoundError('Issue not found');
    issueId = i.id; number = i.number; startAt = new Date();
  } else {
    const title = input.title?.trim();
    if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
    const priority = input.priority ?? priorityOf(input.impact, input.urgency, cfg.matrix);
    const types = await prisma.workIssueType.findMany({ where: { projectId, archived: false, level: 0 }, select: { id: true, key: true } });
    const want = type.key === 'INCIDENT' ? ['BUG', 'TASK'] : type.key === 'CHANGE' ? ['STORY', 'TASK'] : ['TASK', 'STORY'];
    const it = want.map((k) => types.find((t) => t.key === k)).find(Boolean) ?? types[0];
    if (!it) throw new BadRequestError('This project has no issue type for requests', 'WORK_BAD_TYPE');
    const body = [input.description?.trim(), fieldsText(type, values)].filter(Boolean).join('\n\n');
    const doc = body ? { type: 'doc', content: body.split(/\n{2,}/).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })) } : undefined;
    const created = await createIssue({
      projectId, typeId: it.id, title, priority: P_TO_ISSUE_PRIORITY[priority], descriptionJson: doc as Prisma.InputJsonValue | undefined,
      reporterId: input.requesterId ?? userId,
    }, { kind: 'USER', userId });
    issueId = created.id; number = created.number; startAt = created.createdAt;
  }
  const t = await attachTicket(issueId, cfg, {
    requestType: type.key, impact: input.impact, urgency: input.urgency, priority: input.priority ?? null, channel: 'STAFF',
    requesterId: input.requesterId ?? null, fields: values, startAt, actorId: userId,
  });
  await auditProject(projectId, { actorId: userId, action: 'desk.create', targetType: 'issue', targetId: issueId, summary: `${ctx.access.key}-${number} is a service desk request (${type.name}, ${t.priority})` });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId, actor: { kind: 'USER', userId }, changes: [{ field: 'desk', from: null, to: t.priority }] });
  // CTW-19: số + khoá + SLA của ticket ở CẤP ĐẦU (trước đây chỉ có cấu hình form — phải GET /desk/queue mới biết số).
  const d = await issueDesk(userId, projectId, number);
  return { ...d, number, key: `${ctx.access.key}-${number}`, priority: t.priority };
}

// ═══ Móc nối từ cửa ghi chung ════════════════════════════════════════

/** Người được coi là "khách" của yêu cầu: người yêu cầu + mọi vai CLIENT của dự án. */
async function customerIds(projectId: number, requesterId: number | null): Promise<Set<number>> {
  const rows = await prisma.workProjectMember.findMany({ where: { projectId, role: 'CLIENT' }, select: { userId: true } });
  const s = new Set(rows.map((r) => r.userId));
  if (requesterId) s.add(requesterId);
  return s;
}

/**
 * Sau khi một bình luận được ghi (issues.addComment). Khách trả lời ⇒ hết "chờ khách" (RESUME, đưa thẻ về
 * trạng thái trước nếu được). Nhân viên trả lời PUBLIC (dự án không bật cổng khách: mọi bình luận) đầu tiên ⇒
 * FIRST_RESPONSE. Bình luận AI và ghi chú nội bộ KHÔNG tính là trả lời khách.
 */
export async function onComment(issueId: number, c: { authorId: number | null; visibility: string; isAi: boolean; createdAt: Date }): Promise<void> {
  const t = await prisma.workDeskTicket.findUnique({
    where: { issueId },
    select: { id: true, requesterId: true, waiting: true, statusBeforeWait: true, firstResponseAt: true, issue: { select: { projectId: true, resolvedAt: true, statusId: true, project: { select: { settings: true } } } } },
  });
  if (!t || !c.authorId || c.isAi) return;
  const modules = modulesOf(t.issue.project.settings);
  if (!modules.serviceDesk) return;
  const customers = await customerIds(t.issue.projectId, t.requesterId);
  if (customers.has(c.authorId)) {
    if (t.waiting) await resume(t.id, t.issue.projectId, issueId, c.createdAt, c.authorId, 'Customer replied');
    return;
  }
  const isReply = modules.clientPortal ? c.visibility === 'PUBLIC' : true;
  if (isReply && !t.firstResponseAt) {
    await prisma.$transaction(async (tx) => {
      const n = await tx.workDeskTicket.updateMany({ where: { id: t.id, firstResponseAt: null }, data: { firstResponseAt: c.createdAt, firstResponseById: c.authorId } });
      if (n.count) await addEvent(tx, t.id, 'FIRST_RESPONSE', c.createdAt, c.authorId, null, 'Public reply');
    });
    await refreshTicket(t.id);
  }
}

async function resume(ticketId: number, projectId: number, issueId: number, at: Date, actorId: number | null, note: string) {
  const t = await prisma.$transaction(async (tx) => {
    const cur = await tx.workDeskTicket.findUniqueOrThrow({ where: { id: ticketId }, select: { waiting: true, statusBeforeWait: true } });
    if (!cur.waiting) return null;
    await tx.workDeskTicket.update({ where: { id: ticketId }, data: { waiting: false, waitingSince: null, statusBeforeWait: null } });
    await addEvent(tx, ticketId, 'RESUME', at, actorId, null, note);
    return cur;
  });
  if (!t) return;
  // Thẻ đang đứng ở trạng thái "chờ khách" ⇒ đưa về trạng thái trước (nếu luồng cho phép; không thì để người làm).
  const cfg = await loadDeskConfig(projectId);
  const issue = await prisma.workIssue.findUnique({ where: { id: issueId }, select: { statusId: true } });
  if (issue && t.statusBeforeWait && cfg.pauseStatusIds.includes(issue.statusId) && t.statusBeforeWait !== issue.statusId) {
    await applyIssueChange(issueId, { statusId: t.statusBeforeWait }, SYSTEM).catch((err) => logger.info('[work] desk: không đưa thẻ về trạng thái trước', { issueId, err: (err as Error).message }));
  }
  await refreshTicket(ticketId);
}

/**
 * Sau khi applyIssueChange commit (mọi đường: kéo board, sửa, hàng loạt, AI, luật tự động). Chỉ quan tâm đổi
 * trạng thái: vào DONE ⇒ RESOLVE (+ mời CSAT) · rời DONE ⇒ REOPEN · vào trạng thái "chờ khách" ⇒ PAUSE · rời nó
 * ⇒ RESUME · vào trạng thái được tính là trả lời ⇒ FIRST_RESPONSE.
 */
export async function onIssueChanged(issueId: number, changes: FieldChange[], actor: WorkActor): Promise<void> {
  const st = changes.find((c) => c.field === 'statusId');
  if (!st) return;
  const t = await prisma.workDeskTicket.findUnique({
    where: { issueId },
    select: { id: true, waiting: true, firstResponseAt: true, csatRequestedAt: true, requesterId: true, channel: true, issue: { select: { projectId: true, resolvedAt: true, number: true, title: true, project: { select: { settings: true } } } } },
  });
  if (!t || !modulesOf(t.issue.project.settings).serviceDesk) return;
  const projectId = t.issue.projectId;
  const cfg = await loadDeskConfig(projectId);
  const from = Number(st.from);
  const to = Number(st.to);
  const cats = new Map((await prisma.workStatus.findMany({ where: { id: { in: [from, to].filter(Number.isInteger) } }, select: { id: true, category: true } })).map((s) => [s.id, s.category]));
  const now = new Date();
  const actorId = actor.userId;
  const wasDone = cats.get(from) === 'DONE';
  const isDone = cats.get(to) === 'DONE';
  await prisma.$transaction(async (tx) => {
    if (isDone && !wasDone) {
      await addEvent(tx, t.id, 'RESOLVE', now, actorId);
      if (t.waiting) await tx.workDeskTicket.update({ where: { id: t.id }, data: { waiting: false, waitingSince: null, statusBeforeWait: null } });
    } else if (wasDone && !isDone) {
      await addEvent(tx, t.id, 'REOPEN', now, actorId);
    }
    if (!isDone && cfg.pauseStatusIds.includes(to) && !t.waiting) {
      await tx.workDeskTicket.update({ where: { id: t.id }, data: { waiting: true, waitingSince: now, statusBeforeWait: Number.isInteger(from) ? from : null } });
      await addEvent(tx, t.id, 'PAUSE', now, actorId, null, 'Waiting for customer');
    } else if (cfg.pauseStatusIds.includes(from) && !cfg.pauseStatusIds.includes(to) && t.waiting && !isDone) {
      await tx.workDeskTicket.update({ where: { id: t.id }, data: { waiting: false, waitingSince: null, statusBeforeWait: null } });
      await addEvent(tx, t.id, 'RESUME', now, actorId, null, 'Moved out of waiting');
    }
    if (cfg.responseStatusIds.includes(to) && !t.firstResponseAt && actor.kind !== 'SYSTEM') {
      const n = await tx.workDeskTicket.updateMany({ where: { id: t.id, firstResponseAt: null }, data: { firstResponseAt: now, firstResponseById: actorId } });
      if (n.count) await addEvent(tx, t.id, 'FIRST_RESPONSE', now, actorId, null, 'Status counts as a response');
    }
  });
  await refreshTicket(t.id, now, cfg);
  if (isDone && !wasDone && !t.csatRequestedAt && t.requesterId) await requestCsat(t.id, projectId, t.requesterId, t.issue, actorId);
}

/** Mời khách chấm CSAT (một lần) — chỉ người yêu cầu, chỉ qua cổng khách (email + chuông của khách). */
async function requestCsat(ticketId: number, projectId: number, requesterId: number, issue: { number: number; title: string }, actorId: number | null) {
  const n = await prisma.workDeskTicket.updateMany({ where: { id: ticketId, csatRequestedAt: null }, data: { csatRequestedAt: new Date() } });
  if (!n.count) return;
  const { clientMemberIds, notifyClientsOfProject } = await import('./portalNotify.js');
  const clients = await clientMemberIds(projectId);
  if (!clients.includes(requesterId)) return;
  const sender = actorId && actorId !== requesterId ? actorId : await otherUser(projectId, requesterId);
  if (!sender) return;
  await notifyClientsOfProject(projectId, sender, {
    kind: 'csat', title: issue.title, section: 'requests', issueNumber: issue.number,
    message: 'Your request was resolved. How did we do? Rate it from 1 to 5 in the client portal.',
  }, [requesterId]);
}

/** Người "gửi" chuông khác người nhận (chuông bỏ qua tự báo cho mình): lead → ADMIN dự án → chủ/ADMIN không gian. */
async function otherUser(projectId: number, receiver: number): Promise<number | null> {
  const p = await prisma.workProject.findUnique({
    where: { id: projectId },
    select: {
      leadId: true,
      members: { where: { role: 'ADMIN' }, select: { userId: true } },
      workspace: { select: { members: { where: { role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true } } } },
    },
  });
  const cands = [p?.leadId ?? null, ...(p?.members.map((m) => m.userId) ?? []), ...(p?.workspace.members.map((m) => m.userId) ?? [])];
  return cands.find((u): u is number => !!u && u !== receiver) ?? null;
}

// ═══ Thao tác của nhân viên trên một yêu cầu ═════════════════════════

async function ticketByNumber(projectId: number, number: number) {
  const t = await prisma.workDeskTicket.findFirst({
    where: { issue: { projectId, number, deletedAt: null } },
    select: { id: true, issueId: true, priority: true, impact: true, urgency: true, requestType: true, waiting: true, statusBeforeWait: true, frAlert: true, resAlert: true, issue: { select: { statusId: true, resolvedAt: true } } },
  });
  if (!t) throw new NotFoundError('This issue is not a service desk request');
  return t;
}

/** Chờ khách: bật ⇒ PAUSE (+ chuyển thẻ vào trạng thái "chờ khách" đầu tiên được cấu hình, nếu có); tắt ⇒ RESUME. */
export async function setWaiting(userId: number, projectId: number, number: number, waiting: boolean) {
  await deskCtx(userId, projectId, { work: true });
  const t = await ticketByNumber(projectId, number);
  if (t.issue.resolvedAt) throw new BadRequestError('This request is already resolved', 'WORK_DESK_RESOLVED');
  const now = new Date();
  if (waiting) {
    if (t.waiting) return issueDesk(userId, projectId, number);
    await prisma.$transaction(async (tx) => {
      await tx.workDeskTicket.update({ where: { id: t.id }, data: { waiting: true, waitingSince: now, statusBeforeWait: t.issue.statusId } });
      await addEvent(tx, t.id, 'PAUSE', now, userId, null, 'Waiting for customer');
    });
    const cfg = await loadDeskConfig(projectId);
    const target = cfg.pauseStatusIds.find((id) => id !== t.issue.statusId);
    if (target && !cfg.pauseStatusIds.includes(t.issue.statusId)) {
      await applyIssueChange(t.issueId, { statusId: target }, { kind: 'USER', userId }).catch((err) => logger.info('[work] desk: không chuyển được sang trạng thái chờ khách', { err: (err as Error).message }));
    }
    await refreshTicket(t.id);
  } else {
    await resume(t.id, projectId, t.issueId, now, userId, 'Taken off waiting');
  }
  await auditProject(projectId, { actorId: userId, action: waiting ? 'desk.wait' : 'desk.resume', targetType: 'issue', targetId: t.issueId, summary: `${waiting ? 'Waiting for customer' : 'Resumed'} on request #${number}` });
  return issueDesk(userId, projectId, number);
}

export interface TicketPatch { requestType?: RequestTypeKey; impact?: DeskLevel; urgency?: DeskLevel; priority?: DeskPriority | null }

/**
 * Đổi loại / tác động / khẩn cấp / mức P. Mức P đổi ⇒ sự kiện PRIORITY; mục tiêu MỚI áp từ lúc tạo (slaRules luật 4).
 * Mức cảnh báo đã gửi được hạ theo trạng thái mới để mục tiêu mới có cảnh báo riêng.
 */
export async function updateTicket(userId: number, projectId: number, number: number, patch: TicketPatch) {
  await deskCtx(userId, projectId, { work: true });
  const t = await ticketByNumber(projectId, number);
  const cfg = await loadDeskConfig(projectId);
  const impact = patch.impact ?? (t.impact as DeskLevel);
  const urgency = patch.urgency ?? (t.urgency as DeskLevel);
  const next: DeskPriority = patch.priority ?? (patch.impact || patch.urgency ? priorityOf(impact, urgency, cfg.matrix) : (t.priority as DeskPriority));
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.workDeskTicket.update({ where: { id: t.id }, data: { impact, urgency, priority: next, ...(patch.requestType ? { requestType: patch.requestType } : {}) } });
    if (next !== t.priority) await addEvent(tx, t.id, 'PRIORITY', now, userId, next, `${t.priority} → ${next}`);
  });
  const r = await refreshTicket(t.id, now, cfg);
  if (r && next !== t.priority) {
    await prisma.workDeskTicket.update({
      where: { id: t.id },
      data: { frAlert: lowerAlertOnPriorityChange(t.frAlert, alertLevelOf(r.firstResponse)), resAlert: lowerAlertOnPriorityChange(t.resAlert, alertLevelOf(r.resolution)) },
    });
    await auditProject(projectId, { actorId: userId, action: 'desk.priority', targetType: 'issue', targetId: t.issueId, summary: `Request #${number} priority ${t.priority} → ${next} (SLA goals recomputed from creation)` });
  }
  return issueDesk(userId, projectId, number);
}

// ═══ Đọc: chi tiết một yêu cầu (nhân viên) ═══════════════════════════

const TICKET_SELECT = {
  id: true, issueId: true, requestType: true, impact: true, urgency: true, priority: true, channel: true, requesterId: true, fields: true,
  waiting: true, waitingSince: true, firstResponseAt: true, firstResponseById: true, problemId: true,
  csatRequestedAt: true, csatRating: true, csatComment: true, csatAt: true, createdAt: true,
  events: { orderBy: [{ at: 'asc' as const }, { id: 'asc' as const }], select: { id: true, kind: true, at: true, value: true, actorId: true, note: true } },
  problem: { select: { number: true, title: true, status: true } },
} satisfies Prisma.WorkDeskTicketSelect;

function presentTarget(t: TargetResult) {
  return {
    goalMin: t.goalMin, calendar: t.calendar, elapsedMin: t.elapsedMin, remainingMin: t.remainingMin, status: t.status,
    stopped: t.stopped, paused: t.paused,
    dueAt: t.dueAt ? new Date(t.dueAt).toISOString() : null,
    atRiskAt: t.atRiskAt ? new Date(t.atRiskAt).toISOString() : null,
    breachedAt: t.breachedAt ? new Date(t.breachedAt).toISOString() : null,
    stoppedAt: t.stoppedAt ? new Date(t.stoppedAt).toISOString() : null,
    label: t.stopped ? (t.status === 'MET' ? 'Met' : 'Breached') : t.paused ? 'Paused' : t.remainingMin >= 0 ? `${compactMinutes(t.remainingMin)} left` : `${compactMinutes(-t.remainingMin)} over`,
  };
}

export async function issueDesk(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (!access.modules.serviceDesk) return { enabled: false as const, ticket: null };
  const ctx = await deskCtx(userId, projectId);
  const cfg = await loadDeskConfig(projectId);
  const t = await prisma.workDeskTicket.findFirst({ where: { issue: { projectId, number, deletedAt: null } }, select: TICKET_SELECT });
  const base = {
    enabled: true as const, canWork: ctx.canWork,
    requestTypes: cfg.requestTypes.map((r) => ({ key: r.key, name: r.name, enabled: r.enabled })),
    matrix: cfg.matrix, targets: targetsText(cfg),
  };
  if (!t) return { ...base, ticket: null };
  const sla = slaOf(t, cfg);
  const people = await prisma.user.findMany({ where: { id: { in: [t.requesterId, t.firstResponseById, ...t.events.map((e) => e.actorId)].filter((x): x is number => !!x) } }, select: PUBLIC_USER });
  const name = (id: number | null) => { const u = people.find((p) => p.id === id); return u ? displayName(u) : null; };
  const cr = await prisma.workChangeRequest.findFirst({ where: { sourceIssueId: t.issueId, deletedAt: null }, select: { number: true, title: true, status: true } });
  const type = cfg.requestTypes.find((r) => r.key === t.requestType);
  return {
    ...base,
    ticket: {
      requestType: t.requestType, requestTypeName: type?.name ?? t.requestType, impact: t.impact, urgency: t.urgency, priority: sla.priority, channel: t.channel,
      requester: people.find((p) => p.id === t.requesterId) ?? null,
      fields: (type?.fields ?? []).filter((f) => (t.fields as Record<string, string>)[f.key]).map((f) => ({ key: f.key, label: f.label, value: (t.fields as Record<string, string>)[f.key] })),
      waiting: t.waiting, waitingSince: t.waitingSince,
      firstResponseAt: t.firstResponseAt, firstResponseBy: name(t.firstResponseById),
      paused: sla.paused,
      firstResponse: presentTarget(sla.firstResponse),
      resolution: presentTarget(sla.resolution),
      problem: t.problem,
      changeRequest: cr,
      csat: { requestedAt: t.csatRequestedAt, rating: t.csatRating, comment: t.csatComment, at: t.csatAt },
      events: t.events.map((e) => ({ id: e.id, kind: e.kind, at: e.at, value: e.value, note: e.note, actor: name(e.actorId) })),
      createdAt: t.createdAt,
    },
  };
}

// ═══ Hàng đợi ═════════════════════════════════════════════════════════

export const QUEUE_VIEWS = ['open', 'unassigned', 'mine', 'at_risk', 'breached', 'waiting', 'team', 'resolved'] as const;
export type QueueView = (typeof QUEUE_VIEWS)[number];

export interface QueueQuery {
  view?: QueueView;
  teamId?: number;
  requestType?: RequestTypeKey;
  priority?: DeskPriority;
  q?: string;
  sort?: 'sla' | 'priority' | 'created' | 'updated';
}

/** Mức "nguy" của một yêu cầu để sắp xếp: vi phạm trước, rồi gần hạn nhất. */
function urgencyKey(s: SlaResult): number {
  const live = [s.firstResponse, s.resolution].filter((t) => !t.stopped);
  if (!live.length) return Number.MAX_SAFE_INTEGER;
  if (live.some((t) => t.status === 'BREACHED')) return -1e12 + Math.min(...live.map((t) => t.remainingMin));
  if (live.every((t) => t.paused)) return 1e12;
  return Math.min(...live.map((t) => t.remainingMin));
}

export async function queue(userId: number, projectId: number, q: QueueQuery = {}) {
  const ctx = await deskCtx(userId, projectId);
  const cfg = await loadDeskConfig(projectId);
  const view = q.view ?? 'open';
  const rows = await prisma.workDeskTicket.findMany({
    where: { issue: { projectId, deletedAt: null } },
    take: 3000,
    orderBy: { id: 'desc' },
    select: {
      id: true, requestType: true, priority: true, waiting: true, requesterId: true, channel: true, createdAt: true, problemId: true, csatRating: true,
      events: { orderBy: [{ at: 'asc' }, { id: 'asc' }], select: { kind: true, at: true, value: true } },
      issue: {
        select: {
          id: true, number: true, title: true, updatedAt: true, resolvedAt: true, teamId: true, assigneeId: true, clientVisible: true,
          assignee: { select: PUBLIC_USER },
          status: { select: { id: true, name: true, category: true, color: true } },
          team: { select: { id: true, key: true, name: true, color: true } },
        },
      },
    },
  });
  const now = Date.now();
  const all = rows.map((r) => ({ r, sla: slaOf(r, cfg, now) }));
  const isOpen = (x: (typeof all)[number]) => !x.r.issue.resolvedAt;
  const breached = (x: (typeof all)[number]) => isOpen(x) && [x.sla.firstResponse, x.sla.resolution].some((t) => !t.stopped && t.status === 'BREACHED');
  const atRisk = (x: (typeof all)[number]) => isOpen(x) && !breached(x) && [x.sla.firstResponse, x.sla.resolution].some((t) => !t.stopped && t.status === 'AT_RISK');
  const filters: Record<QueueView, (x: (typeof all)[number]) => boolean> = {
    open: isOpen,
    unassigned: (x) => isOpen(x) && !x.r.issue.assigneeId,
    mine: (x) => isOpen(x) && x.r.issue.assigneeId === userId,
    at_risk: atRisk,
    breached,
    waiting: (x) => isOpen(x) && x.r.waiting,
    team: (x) => isOpen(x) && (q.teamId ? x.r.issue.teamId === q.teamId : !!x.r.issue.teamId),
    resolved: (x) => !isOpen(x),
  };
  const counts = Object.fromEntries(QUEUE_VIEWS.map((v) => [v, all.filter(filters[v]).length])) as Record<QueueView, number>;
  const needle = q.q?.trim().toLowerCase();
  let list = all.filter(filters[view])
    .filter((x) => !q.requestType || x.r.requestType === q.requestType)
    .filter((x) => !q.priority || x.sla.priority === q.priority)
    .filter((x) => !needle || x.r.issue.title.toLowerCase().includes(needle) || `${ctx.access.key}-${x.r.issue.number}`.toLowerCase().includes(needle));
  const sort = q.sort ?? 'sla';
  list = list.sort((a, b) => {
    if (sort === 'priority') return a.sla.priority.localeCompare(b.sla.priority) || urgencyKey(a.sla) - urgencyKey(b.sla);
    if (sort === 'created') return b.r.createdAt.getTime() - a.r.createdAt.getTime();
    if (sort === 'updated') return b.r.issue.updatedAt.getTime() - a.r.issue.updatedAt.getTime();
    return urgencyKey(a.sla) - urgencyKey(b.sla) || a.sla.priority.localeCompare(b.sla.priority);
  });
  const requesterIds = [...new Set(list.slice(0, 500).map((x) => x.r.requesterId).filter((x): x is number => !!x))];
  const requesters = await prisma.user.findMany({ where: { id: { in: requesterIds } }, select: PUBLIC_USER });
  const typeName = new Map(cfg.requestTypes.map((t) => [t.key, t.name]));
  const teams = await prisma.workTeam.findMany({ where: { workspaceId: ctx.access.workspaceId, archivedAt: null }, select: { id: true, key: true, name: true, color: true }, orderBy: { key: 'asc' } });
  return {
    view, counts, canWork: ctx.canWork, now: new Date(now).toISOString(),
    teams: ctx.access.modules.teams ? teams : [],
    items: list.slice(0, 500).map(({ r, sla }) => ({
      number: r.issue.number, key: `${ctx.access.key}-${r.issue.number}`, title: r.issue.title,
      requestType: r.requestType, requestTypeName: typeName.get(r.requestType as RequestTypeKey) ?? r.requestType,
      priority: sla.priority, waiting: r.waiting, paused: sla.paused, channel: r.channel, shared: r.issue.clientVisible,
      status: r.issue.status, team: r.issue.team, assignee: r.issue.assignee,
      requester: requesters.find((u) => u.id === r.requesterId) ?? null,
      createdAt: r.createdAt, updatedAt: r.issue.updatedAt, resolvedAt: r.issue.resolvedAt,
      firstResponse: presentTarget(sla.firstResponse), resolution: presentTarget(sla.resolution),
      problemId: r.problemId, csat: r.csatRating,
    })),
    truncated: list.length > 500,
  };
}

// ═══ Cổng khách ═══════════════════════════════════════════════════════

/** Form gửi yêu cầu cho khách: loại đang bật + trường riêng + mô tả tác động/khẩn cấp + mục tiêu (bằng chữ). */
export async function portalForm(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const { portalCtx } = await import('./portal.service.js');
  const ctx = await portalCtx(userId, projectId, opts);
  if (!ctx.access.modules.serviceDesk) return { enabled: false as const };
  const cfg = await loadDeskConfig(projectId);
  const targets = targetsText(cfg);
  return {
    enabled: true as const,
    canSubmit: !ctx.preview && can(ctx.access.role, 'issue.create'),
    requestTypes: cfg.requestTypes.filter((t) => t.enabled).map((t) => ({
      key: t.key, name: t.name, description: t.description, askImpact: t.askImpact, fields: t.fields,
      defaultImpact: t.defaultImpact, defaultUrgency: t.defaultUrgency,
    })),
    impact: DESK_LEVELS.map((l) => ({ value: l, ...IMPACT_TEXT[l] })),
    urgency: DESK_LEVELS.map((l) => ({ value: l, ...URGENCY_TEXT[l] })),
    // Khách thấy mục tiêu theo lựa chọn của mình (để form báo trước "We'll respond within …").
    matrix: cfg.matrix,
    targets,
  };
}

/**
 * Một yêu cầu "như khách thấy" — CHỈ: loại, mục tiêu bằng chữ, đã có trả lời chưa, đã giải quyết chưa, CSAT
 * (người yêu cầu mới chấm được). KHÔNG: thời gian đã chạy, vi phạm, sự kiện, Problem, mức cảnh báo.
 */
export async function portalTicket(userId: number, projectId: number, number: number, opts: { asClient?: boolean } = {}) {
  const { portalCtx } = await import('./portal.service.js');
  const ctx = await portalCtx(userId, projectId, opts);
  if (!ctx.access.modules.serviceDesk) return { enabled: false as const, ticket: null };
  const t = await prisma.workDeskTicket.findFirst({
    where: { issue: { projectId, number, deletedAt: null, clientVisible: true } },
    select: { requestType: true, priority: true, requesterId: true, firstResponseAt: true, csatRequestedAt: true, csatRating: true, csatComment: true, csatAt: true, issue: { select: { resolvedAt: true } } },
  });
  if (!t) return { enabled: true as const, ticket: null };
  const cfg = await loadDeskConfig(projectId);
  const tt = targetsText(cfg)[t.priority as DeskPriority] ?? targetsText(cfg).P3;
  const mine = t.requesterId === userId && !ctx.preview;
  return {
    enabled: true as const,
    ticket: {
      requestTypeName: cfg.requestTypes.find((r) => r.key === t.requestType)?.name ?? 'Request',
      respondWithin: tt.respond,
      resolveWithin: tt.resolve,
      responded: !!t.firstResponseAt,
      resolved: !!t.issue.resolvedAt,
      mine,
      csat: {
        canAnswer: mine && !!t.issue.resolvedAt && t.csatRating === null,
        rating: mine || !ctx.clientView ? t.csatRating : null,
        comment: mine || !ctx.clientView ? t.csatComment : null,
        at: mine || !ctx.clientView ? t.csatAt : null,
      },
    },
  };
}

/** CSAT 1–5 + bình luận: CHỈ người gửi yêu cầu, chỉ khi đã giải quyết, một lần. */
export async function submitCsat(userId: number, projectId: number, number: number, input: { rating: number; comment?: string | null }) {
  const { portalCtx } = await import('./portal.service.js');
  const ctx = await portalCtx(userId, projectId);
  assertModule(ctx.access, 'serviceDesk');
  if (ctx.preview) throw new ForbiddenError('Preview as client is read-only');
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new BadRequestError('Rate from 1 to 5', 'WORK_BAD_CSAT');
  const t = await prisma.workDeskTicket.findFirst({
    where: { issue: { projectId, number, deletedAt: null } },
    select: { id: true, issueId: true, requesterId: true, csatRating: true, issue: { select: { resolvedAt: true, clientVisible: true } } },
  });
  if (!t || (ctx.clientView && !t.issue.clientVisible)) throw new NotFoundError('Request not found');
  if (t.requesterId !== userId) throw new AppError('Only the person who raised this request can rate it', 403, 'WORK_CSAT_NOT_REQUESTER');
  if (!t.issue.resolvedAt) throw new BadRequestError('You can rate a request once it is resolved', 'WORK_CSAT_NOT_RESOLVED');
  const n = await prisma.workDeskTicket.updateMany({
    where: { id: t.id, csatRating: null },
    data: { csatRating: input.rating, csatComment: input.comment?.trim().slice(0, 2000) || null, csatAt: new Date() },
  });
  if (!n.count) throw new ConflictError('You already rated this request');
  await auditProject(projectId, { actorId: userId, action: 'desk.csat', targetType: 'issue', targetId: t.issueId, summary: `CSAT ${input.rating}/5 on request #${number}` });
  return portalTicket(userId, projectId, number);
}

// ═══ Cron 5 phút: tính lại + cảnh báo nội bộ (KHÔNG LLM) ═══════════════

/** Người nhận cảnh báo: người làm; chưa có ⇒ trưởng bộ phận của thẻ; chưa có ⇒ ADMIN dự án (tường minh) + lead. */
async function alertReceivers(projectId: number, assigneeId: number | null, teamId: number | null): Promise<number[]> {
  if (assigneeId) return [assigneeId];
  if (teamId) {
    const leads = (await prisma.workTeamMember.findMany({ where: { teamId, role: 'LEAD' }, select: { userId: true } })).map((m) => m.userId);
    if (leads.length) return leads;
  }
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { leadId: true, members: { where: { role: 'ADMIN' }, select: { userId: true } }, workspace: { select: { members: { where: { role: 'OWNER' }, select: { userId: true } } } } } });
  const out = new Set<number>([...(p?.members.map((m) => m.userId) ?? []), ...(p?.leadId ? [p.leadId] : [])]);
  if (!out.size) for (const m of p?.workspace.members ?? []) out.add(m.userId);
  return [...out];
}

async function emailOnly(userId: number, subject: string, url: string, line: string) {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false') return;
  const { getNotifySettings } = await import('./notify.js');
  if ((await getNotifySettings(userId)).emailMode === 'OFF') return;
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, enabled: true } });
  if (!u?.enabled || !u.email) return;
  const { frontendUrl, sendWorkEmail } = await import('./common.js');
  await sendWorkEmail({ to: u.email, subject: `CT Work: ${subject}`.slice(0, 240), heading: subject, lines: [line], cta: { label: 'Open the service desk', url: frontendUrl(url) } });
}

/**
 * Cron mỗi 5 phút: mọi yêu cầu CHƯA giải quyết của dự án bật serviceDesk — tính lại, chụp bản trạng thái, và
 * cảnh báo nội bộ khi một mục tiêu sang AT_RISK hoặc BREACHED. Mỗi mốc ĐÚNG MỘT LẦN (frAlert/resAlert chỉ tăng,
 * tăng trong cùng câu lệnh có điều kiện ⇒ hai lượt cron chồng nhau cũng không báo đôi). Không LLM.
 */
export async function runSlaChecks(now = new Date()): Promise<{ checked: number; alerts: number }> {
  const rows = await prisma.workDeskTicket.findMany({
    where: { issue: { deletedAt: null, resolvedAt: null, project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } } } },
    take: 5000,
    select: {
      id: true, priority: true, frAlert: true, resAlert: true,
      events: { orderBy: [{ at: 'asc' }, { id: 'asc' }], select: { kind: true, at: true, value: true } },
      issue: { select: { id: true, number: true, title: true, projectId: true, assigneeId: true, teamId: true, project: { select: { key: true, settings: true, workspace: { select: { slug: true } } } } } },
    },
  });
  const cfgs = new Map<number, DeskConfig>();
  const { notifyWork } = await import('./notify.js');
  let alerts = 0;
  let checked = 0;
  for (const t of rows) {
    if (!modulesOf(t.issue.project.settings).serviceDesk) continue;
    try {
      let cfg = cfgs.get(t.issue.projectId);
      if (!cfg) { cfg = await loadDeskConfig(t.issue.projectId); cfgs.set(t.issue.projectId, cfg); }
      const r = await refreshTicket(t.id, now, cfg);
      if (!r) continue;
      checked += 1;
      for (const [which, target, sent] of [['firstResponse', r.firstResponse, t.frAlert], ['resolution', r.resolution, t.resAlert]] as const) {
        const level = alertToSend(alertLevelOf(target), sent);
        if (!level) continue;
        const col = which === 'firstResponse' ? 'frAlert' : 'resAlert';
        // Ghi mức TRƯỚC khi báo, có điều kiện ⇒ báo đúng một lần kể cả khi hai tiến trình chạy cùng lúc.
        const claimed = await prisma.workDeskTicket.updateMany({ where: { id: t.id, [col]: { lt: level } }, data: { [col]: level } });
        if (!claimed.count) continue;
        const key = `${t.issue.project.key}-${t.issue.number}`;
        const what = which === 'firstResponse' ? 'first response' : 'resolution';
        const message = level === 2
          ? `SLA breached: ${what} (${r.priority}, goal ${compactMinutes(target.goalMin)})`
          : `SLA at risk: ${what} due in ${compactMinutes(Math.max(0, target.remainingMin))} (${r.priority})`;
        const url = `/work/${t.issue.project.workspace.slug}/${t.issue.project.key}/issue/${t.issue.number}`;
        for (const receiver of await alertReceivers(t.issue.projectId, t.issue.assigneeId, t.issue.teamId)) {
          const sender = await otherUser(t.issue.projectId, receiver);
          const payload = { issueKey: key, title: t.issue.title, message, url, sla: true };
          if (sender) await notifyWork({ receiverId: receiver, senderId: sender, type: 'WORK_ALERT', entityId: t.issue.id, payload });
          else await emailOnly(receiver, `${key}: ${message}`, url, t.issue.title);
          alerts += 1;
        }
      }
    } catch (err) {
      logger.warn('[work] desk: kiểm SLA lỗi', { ticketId: t.id, err: (err as Error).message });
    }
  }
  return { checked, alerts };
}

// ═══ Problem + postmortem ═════════════════════════════════════════════

const PROBLEM_SELECT = {
  id: true, number: true, title: true, description: true, status: true, rootCause: true, workaround: true, ownerId: true,
  postmortemPageId: true, createdById: true, resolvedAt: true, createdAt: true, updatedAt: true,
  postmortem: { select: { number: true, title: true, deletedAt: true } },
  _count: { select: { incidents: true } },
} satisfies Prisma.WorkDeskProblemSelect;

export async function listProblems(userId: number, projectId: number) {
  const ctx = await deskCtx(userId, projectId);
  const rows = await prisma.workDeskProblem.findMany({ where: { projectId, deletedAt: null }, orderBy: { number: 'desc' }, take: 500, select: PROBLEM_SELECT });
  const owners = await prisma.user.findMany({ where: { id: { in: rows.map((r) => r.ownerId).filter((x): x is number => !!x) } }, select: PUBLIC_USER });
  return {
    canWork: ctx.canWork,
    items: rows.map(({ _count, postmortem, ...r }) => ({
      ...r, key: `PRB-${r.number}`, incidentCount: _count.incidents,
      owner: owners.find((o) => o.id === r.ownerId) ?? null,
      postmortem: postmortem && !postmortem.deletedAt ? { number: postmortem.number, title: postmortem.title } : null,
    })),
  };
}

export interface ProblemInput { title?: string; description?: string | null; status?: ProblemStatus; rootCause?: string | null; workaround?: string | null; ownerId?: number | null; incidentNumbers?: number[] }

export async function createProblem(userId: number, projectId: number, input: ProblemInput & { title: string }) {
  await deskCtx(userId, projectId, { work: true });
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  const p = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${31501}::int, ${projectId}::int)`;
    const agg = await tx.workDeskProblem.aggregate({ where: { projectId }, _max: { number: true } });
    return tx.workDeskProblem.create({
      data: {
        projectId, number: (agg._max.number ?? 0) + 1, title: title.slice(0, 255), description: input.description?.trim() || null,
        rootCause: input.rootCause?.trim() || null, workaround: input.workaround?.trim() || null, ownerId: input.ownerId ?? userId, createdById: userId,
      },
      select: { id: true, number: true },
    });
  });
  if (input.incidentNumbers?.length) await linkIncidentsTx(projectId, p.id, input.incidentNumbers);
  await auditProject(projectId, { actorId: userId, action: 'desk.problem', targetType: 'problem', targetId: p.id, summary: `Created PRB-${p.number}: ${title}`.slice(0, 300) });
  return getProblem(userId, projectId, p.number);
}

async function findProblem(projectId: number, number: number) {
  const p = await prisma.workDeskProblem.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true, title: true, status: true, postmortemPageId: true, ownerId: true, createdAt: true, rootCause: true, workaround: true, description: true } });
  if (!p) throw new NotFoundError('Problem not found');
  return p;
}

async function linkIncidentsTx(projectId: number, problemId: number, numbers: number[]) {
  const nums = [...new Set(numbers)].slice(0, 200);
  const tickets = await prisma.workDeskTicket.findMany({ where: { issue: { projectId, number: { in: nums }, deletedAt: null } }, select: { id: true, issue: { select: { number: true } } } });
  const found = new Set(tickets.map((t) => t.issue.number));
  const missing = nums.filter((n) => !found.has(n));
  if (missing.length) throw new BadRequestError(`Only service desk requests can be linked to a problem: #${missing.slice(0, 10).join(', #')}`, 'WORK_DESK_NOT_REQUEST');
  await prisma.workDeskTicket.updateMany({ where: { id: { in: tickets.map((t) => t.id) } }, data: { problemId } });
}

export async function getProblem(userId: number, projectId: number, number: number) {
  const ctx = await deskCtx(userId, projectId);
  const p = await prisma.workDeskProblem.findFirst({ where: { projectId, number, deletedAt: null }, select: PROBLEM_SELECT });
  if (!p) throw new NotFoundError('Problem not found');
  const cfg = await loadDeskConfig(projectId);
  const incidents = await prisma.workDeskTicket.findMany({
    where: { problemId: p.id, issue: { deletedAt: null } },
    select: {
      requestType: true, priority: true, events: { orderBy: [{ at: 'asc' }, { id: 'asc' }], select: { kind: true, at: true, value: true } },
      issue: { select: { number: true, title: true, resolvedAt: true, createdAt: true, status: { select: { name: true, category: true, color: true } } } },
    },
    orderBy: { id: 'asc' },
  });
  const owner = p.ownerId ? await prisma.user.findUnique({ where: { id: p.ownerId }, select: PUBLIC_USER }) : null;
  const { _count, postmortem, ...rest } = p;
  return {
    ...rest, key: `PRB-${p.number}`, canWork: ctx.canWork, owner, incidentCount: _count.incidents,
    postmortem: postmortem && !postmortem.deletedAt ? { number: postmortem.number, title: postmortem.title } : null,
    docsEnabled: ctx.access.modules.docs,
    incidents: incidents.map((t) => {
      const sla = slaOf(t, cfg);
      return {
        number: t.issue.number, key: `${ctx.access.key}-${t.issue.number}`, title: t.issue.title, status: t.issue.status, requestType: t.requestType,
        priority: sla.priority, createdAt: t.issue.createdAt, resolvedAt: t.issue.resolvedAt,
        firstResponse: presentTarget(sla.firstResponse), resolution: presentTarget(sla.resolution),
      };
    }),
  };
}

export async function updateProblem(userId: number, projectId: number, number: number, input: ProblemInput) {
  await deskCtx(userId, projectId, { work: true });
  const p = await findProblem(projectId, number);
  const data: Prisma.WorkDeskProblemUncheckedUpdateInput = {};
  if (input.title !== undefined) {
    if (!input.title.trim()) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
    data.title = input.title.trim().slice(0, 255);
  }
  for (const k of ['description', 'rootCause', 'workaround'] as const) if (input[k] !== undefined) data[k] = input[k]?.trim() || null;
  if (input.ownerId !== undefined) data.ownerId = input.ownerId;
  if (input.status !== undefined && input.status !== p.status) {
    data.status = input.status;
    data.resolvedAt = input.status === 'RESOLVED' || input.status === 'CLOSED' ? new Date() : null;
  }
  await prisma.workDeskProblem.update({ where: { id: p.id }, data });
  if (input.incidentNumbers?.length) await linkIncidentsTx(projectId, p.id, input.incidentNumbers);
  return getProblem(userId, projectId, number);
}

export async function linkIncidents(userId: number, projectId: number, number: number, issueNumbers: number[]) {
  await deskCtx(userId, projectId, { work: true });
  const p = await findProblem(projectId, number);
  await linkIncidentsTx(projectId, p.id, issueNumbers);
  return getProblem(userId, projectId, number);
}

export async function unlinkIncident(userId: number, projectId: number, number: number, issueNumber: number) {
  await deskCtx(userId, projectId, { work: true });
  const p = await findProblem(projectId, number);
  await prisma.workDeskTicket.updateMany({ where: { problemId: p.id, issue: { projectId, number: issueNumber } }, data: { problemId: null } });
  return getProblem(userId, projectId, number);
}

export async function deleteProblem(userId: number, projectId: number, number: number) {
  const ctx = await deskCtx(userId, projectId, { work: true });
  const p = await findProblem(projectId, number);
  if (ctx.access.role !== 'ADMIN') throw new ForbiddenError('Only a project admin can delete a problem');
  await prisma.$transaction([
    prisma.workDeskTicket.updateMany({ where: { problemId: p.id }, data: { problemId: null } }),
    prisma.workDeskProblem.update({ where: { id: p.id }, data: { deletedAt: new Date() } }),
  ]);
  return { number, deleted: true };
}

const cellText = (s: string) => s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

/**
 * Dòng thời gian từ sự kiện của các incident (giờ địa phương của dự án): tạo, trả lời đầu tiên, chờ khách /
 * tiếp tục, đổi mức P, giải quyết / mở lại, vượt mục tiêu (tính từ slaRules — không ghi tay).
 */
export function postmortemTimeline(
  incidents: Array<{ key: string; title: string; priority: string; createdAt: Date; events: Array<{ kind: string; at: Date; value: string | null; actor: string | null; note: string | null }>; sla: SlaResult }>,
  problem: { key: string; title: string; createdAt: Date; createdBy: string | null },
  tz: string,
): Array<{ at: number; stamp: string; text: string; who: string }> {
  const out: Array<{ at: number; text: string; who: string }> = [];
  const label: Record<string, string> = {
    START: 'opened', PAUSE: 'waiting for customer', RESUME: 'resumed', FIRST_RESPONSE: 'first response to the customer',
    RESOLVE: 'resolved', REOPEN: 'reopened', PRIORITY: 'priority changed',
  };
  for (const i of incidents) {
    for (const e of i.events) {
      const extra = e.kind === 'START' ? ` (${i.priority}): ${i.title}` : e.kind === 'PRIORITY' ? ` to ${e.value}${e.note ? ` (${e.note})` : ''}` : '';
      out.push({ at: e.at.getTime(), text: `${i.key} ${label[e.kind] ?? e.kind.toLowerCase()}${extra}`, who: e.actor ?? '—' });
    }
    if (i.sla.firstResponse.breachedAt) out.push({ at: i.sla.firstResponse.breachedAt, text: `${i.key} first-response SLA breached (goal ${compactMinutes(i.sla.firstResponse.goalMin)})`, who: 'SLA' });
    if (i.sla.resolution.breachedAt) out.push({ at: i.sla.resolution.breachedAt, text: `${i.key} resolution SLA breached (goal ${compactMinutes(i.sla.resolution.goalMin)})`, who: 'SLA' });
  }
  out.push({ at: problem.createdAt.getTime(), text: `${problem.key} problem recorded: ${problem.title}`, who: problem.createdBy ?? '—' });
  out.sort((a, b) => a.at - b.at);
  return out.map((x) => ({ ...x, stamp: localStamp(x.at, tz) }));
}

/** "Create postmortem": trang Docs (S2a) từ mẫu bao-cao-su-co-postmortem.md, điền sẵn bảng đầu + dòng thời gian. */
export async function createPostmortem(userId: number, projectId: number, number: number) {
  const ctx = await deskCtx(userId, projectId, { work: true });
  assertModule(ctx.access, 'docs');
  const p = await findProblem(projectId, number);
  if (p.postmortemPageId) {
    const existing = await prisma.workPage.findFirst({ where: { id: p.postmortemPageId, deletedAt: null }, select: { number: true } });
    if (existing) throw new AppError('This problem already has a postmortem', 409, 'WORK_POSTMORTEM_EXISTS', { pageNumber: existing.number });
  }
  const cfg = await loadDeskConfig(projectId);
  const tz = cfg.calendar.timezone;
  const tickets = await prisma.workDeskTicket.findMany({
    where: { problemId: p.id, issue: { deletedAt: null } },
    orderBy: { id: 'asc' },
    select: {
      priority: true,
      events: { orderBy: [{ at: 'asc' }, { id: 'asc' }], select: { kind: true, at: true, value: true, actorId: true, note: true } },
      issue: { select: { number: true, title: true, createdAt: true, resolvedAt: true } },
    },
  });
  const userIdsAll = [...new Set([p.ownerId, ...tickets.flatMap((t) => t.events.map((e) => e.actorId))].filter((x): x is number => !!x))];
  const users = await prisma.user.findMany({ where: { id: { in: userIdsAll } }, select: PUBLIC_USER });
  const nm = (id: number | null) => { const u = users.find((x) => x.id === id); return u ? displayName(u) : null; };
  const incidents = tickets.map((t) => ({
    key: `${ctx.access.key}-${t.issue.number}`, title: t.issue.title, priority: t.priority, createdAt: t.issue.createdAt,
    events: t.events.map((e) => ({ kind: e.kind, at: e.at, value: e.value, actor: nm(e.actorId), note: e.note })),
    sla: slaOf(t, cfg), resolvedAt: t.issue.resolvedAt,
  }));
  const timeline = postmortemTimeline(incidents, { key: `PRB-${p.number}`, title: p.title, createdAt: p.createdAt, createdBy: nm(p.ownerId) }, tz);
  const first = incidents.length ? Math.min(...incidents.map((i) => i.createdAt.getTime())) : p.createdAt.getTime();
  const resolvedTimes = incidents.map((i) => i.resolvedAt?.getTime() ?? null);
  const lastResolved = resolvedTimes.length && resolvedTimes.every((x) => x !== null) ? Math.max(...(resolvedTimes as number[])) : null;
  const firstResponse = incidents.map((i) => i.sla.firstResponse.stoppedAt).filter((x): x is number => x !== null);
  const worst = incidents.map((i) => i.sla.priority).sort()[0] ?? '—';
  const dur = lastResolved ? compactMinutes((lastResolved - first) / 60_000) : 'ongoing';
  const t = await (await import('./docTemplates.js')).getTemplate('bao-cao-su-co-postmortem');
  let md = t.markdown.replace(/^# .*\n/, '');
  const head = `| ${cellText(`PRB-${p.number} (${incidents.map((i) => i.key).join(', ') || 'no incidents linked'})`)} | ${worst} | ${localStamp(first, tz)} | ${firstResponse.length ? localStamp(Math.min(...firstResponse), tz) : '—'} | ${lastResolved ? localStamp(lastResolved, tz) : '—'} | ${dur} | ${cellText(nm(p.ownerId) ?? '—')} |`;
  md = md.replace(/(\| Mã sự cố[^\n]*\n\|[-|]+\|\n)/, `$1${head}\n`);
  const rows = timeline.map((x) => `| ${x.stamp} | ${cellText(x.text)} | ${cellText(x.who)} |`).join('\n');
  md = md.replace(/(## 3\.[^\n]*\n\| Thời điểm[^\n]*\n\|[-|]+\|\n)/, `$1${rows}\n`);
  md = md.replace(/(## 3\. [^\n]*)/, `$1 — ${tz}`);
  const summary = [
    `**Problem:** PRB-${p.number} — ${p.title}`,
    p.rootCause ? `**Root cause (so far):** ${p.rootCause}` : '',
    p.workaround ? `**Workaround:** ${p.workaround}` : '',
    `**Linked incidents:** ${incidents.map((i) => `${i.key} ${i.title} (${i.sla.priority})`).join('; ') || 'none'}`,
  ].filter(Boolean).join('\n\n');
  md = md.replace(/(## 1\. [^\n]*\n)/, `$1${summary}\n\n`);
  const { createPage } = await import('./pages.service.js');
  const page = await createPage(userId, projectId, { title: `Postmortem — PRB-${p.number} ${p.title}`.slice(0, 255), templateKey: 'bao-cao-su-co-postmortem', contentJson: markdownDoc(md) });
  await prisma.workDeskProblem.update({ where: { id: p.id }, data: { postmortemPageId: (page as { id: number }).id } });
  await auditProject(projectId, { actorId: userId, action: 'desk.postmortem', targetType: 'problem', targetId: p.id, summary: `Postmortem for PRB-${p.number} created as document ${(page as { number: number }).number}` });
  return { pageNumber: (page as { number: number }).number, title: (page as { title: string }).title };
}

// ═══ Báo cáo ═════════════════════════════════════════════════════════

interface RowSrc {
  priority: string; csatRating: number | null; createdAt: Date; requestType: string;
  events: Array<{ kind: string; at: Date; value: string | null }>;
  issue: { number: number; title: string; resolvedAt: Date | null; createdAt: Date };
}

function rowOf(t: RowSrc, cfg: DeskConfig, now: number): ReportRow & { sla: SlaResult } {
  const sla = slaOf(t, cfg, now);
  return {
    priority: sla.priority, month: monthOf(t.createdAt, cfg.calendar.timezone),
    firstResponse: { stopped: sla.firstResponse.stopped, status: sla.firstResponse.status },
    resolution: { stopped: sla.resolution.stopped, status: sla.resolution.status },
    resolveWallMin: t.issue.resolvedAt ? (t.issue.resolvedAt.getTime() - t.createdAt.getTime()) / 60_000 : null,
    csat: t.csatRating, sla,
  };
}

function monthsBack(n: number, tz: string, now: number): string[] {
  const cur = monthOf(now, tz);
  const [y, m] = cur.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  });
}

const REPORT_SELECT = {
  priority: true, csatRating: true, createdAt: true, requestType: true, csatComment: true, csatAt: true,
  events: { orderBy: [{ at: 'asc' as const }, { id: 'asc' as const }], select: { kind: true, at: true, value: true } },
  issue: { select: { number: true, title: true, resolvedAt: true, createdAt: true } },
} satisfies Prisma.WorkDeskTicketSelect;

/** Báo cáo SLA: % đạt first response / resolution theo P và theo tháng, MTTR, số vi phạm, CSAT trung bình. */
export async function report(userId: number, projectId: number, q: { months?: number } = {}) {
  const ctx = await deskCtx(userId, projectId);
  const cfg = await loadDeskConfig(projectId);
  const n = Math.min(Math.max(q.months ?? 6, 1), 24);
  const now = Date.now();
  const months = monthsBack(n, cfg.calendar.timezone, now);
  const since = new Date(now - (n + 1) * 31 * DAY);
  const tickets = await prisma.workDeskTicket.findMany({ where: { issue: { projectId, deletedAt: null }, createdAt: { gte: since } }, take: 20_000, select: REPORT_SELECT });
  const rows = tickets.map((t) => ({ t, row: rowOf(t, cfg, now) })).filter((x) => months.includes(x.row.month));
  const cells: Record<string, Record<string, ReturnType<typeof reportCell>>> = {};
  for (const m of months) {
    const mr = rows.filter((x) => x.row.month === m).map((x) => x.row);
    cells[m] = { ALL: reportCell(mr), ...Object.fromEntries(DESK_PRIORITIES.map((p) => [p, reportCell(mr.filter((r) => r.priority === p))])) };
  }
  const allRows = rows.map((x) => x.row);
  const byPriority = { ALL: reportCell(allRows), ...Object.fromEntries(DESK_PRIORITIES.map((p) => [p, reportCell(allRows.filter((r) => r.priority === p))])) };
  const breaches = rows.flatMap(({ t, row }) => ([
    row.sla.firstResponse.breachedAt ? { key: `${ctx.access.key}-${t.issue.number}`, number: t.issue.number, title: t.issue.title, priority: row.priority, target: 'FIRST_RESPONSE', at: new Date(row.sla.firstResponse.breachedAt) } : null,
    row.sla.resolution.breachedAt ? { key: `${ctx.access.key}-${t.issue.number}`, number: t.issue.number, title: t.issue.title, priority: row.priority, target: 'RESOLUTION', at: new Date(row.sla.resolution.breachedAt) } : null,
  ])).filter(Boolean).sort((a, b) => b!.at.getTime() - a!.at.getTime()).slice(0, 30);
  const feedback = rows.filter((x) => x.t.csatRating !== null).sort((a, b) => (b.t.csatAt?.getTime() ?? 0) - (a.t.csatAt?.getTime() ?? 0)).slice(0, 20)
    .map(({ t }) => ({ key: `${ctx.access.key}-${t.issue.number}`, number: t.issue.number, title: t.issue.title, rating: t.csatRating, comment: t.csatComment, at: t.csatAt }));
  return { months, priorities: DESK_PRIORITIES, cells, byPriority, breaches, feedback, timezone: cfg.calendar.timezone, goals: cfg.goals, targets: targetsText(cfg) };
}

/** Xuất .xlsx (xlsxWorkbook có sẵn — không thêm thư viện): Summary theo tháng × P + danh sách yêu cầu. */
export async function reportXlsx(userId: number, projectId: number, q: { months?: number } = {}) {
  const ctx = await deskCtx(userId, projectId);
  const r = await report(userId, projectId, q);
  const cfg = await loadDeskConfig(projectId);
  const since = new Date(Date.now() - (r.months.length + 1) * 31 * DAY);
  const tickets = await prisma.workDeskTicket.findMany({ where: { issue: { projectId, deletedAt: null }, createdAt: { gte: since } }, take: 20_000, orderBy: { id: 'asc' }, select: REPORT_SELECT });
  const now = Date.now();
  const tz = cfg.calendar.timezone;
  const h = (min: number | null) => (min === null ? null : Math.round((min / 60) * 10) / 10);
  const summary: unknown[][] = [];
  for (const m of r.months) for (const p of ['ALL', ...DESK_PRIORITIES]) {
    const c = r.cells[m][p];
    summary.push([m, p, c.tickets, c.frPercent, c.resPercent, c.breaches, h(c.mttrMin), c.csatAvg, c.csatCount]);
  }
  const list = tickets.map((t) => {
    const row = rowOf(t, cfg, now);
    return [
      `${ctx.access.key}-${t.issue.number}`, t.issue.title, cfg.requestTypes.find((x) => x.key === t.requestType)?.name ?? t.requestType, row.priority,
      localStamp(t.createdAt, tz), row.sla.firstResponse.stoppedAt ? localStamp(row.sla.firstResponse.stoppedAt, tz) : '', row.sla.firstResponse.status,
      t.issue.resolvedAt ? localStamp(t.issue.resolvedAt, tz) : '', row.sla.resolution.status, h(row.resolveWallMin), t.csatRating, t.csatComment ?? '',
    ];
  });
  const buffer = xlsxWorkbook([
    {
      name: 'Summary',
      pre: [[`Service desk SLA — ${ctx.access.key}`], [`Time zone: ${tz}. % met counts targets that have an outcome (met, or breached). MTTR = mean wall-clock hours from creation to resolution.`]],
      headers: ['Month', 'Priority', 'Requests', 'First response met %', 'Resolution met %', 'Breaches', 'MTTR (h)', 'CSAT avg', 'CSAT answers'],
      data: summary as Array<Array<string | number | null>>,
      widths: [10, 9, 10, 20, 18, 10, 10, 10, 13],
    },
    {
      name: 'Requests',
      headers: ['Key', 'Title', 'Type', 'Priority', 'Created', 'First response', 'First response SLA', 'Resolved', 'Resolution SLA', 'Time to resolve (h)', 'CSAT', 'CSAT comment'],
      data: list as Array<Array<string | number | null>>,
      widths: [10, 40, 18, 9, 17, 17, 18, 17, 16, 18, 7, 40],
    },
  ] as Parameters<typeof xlsxWorkbook>[0]);
  return { file: `${ctx.access.key}-service-desk-sla.xlsx`, buffer };
}

/**
 * Chỉ số TỔNG cho báo cáo tuần của khách (S4) / steering: số nhận, số giải quyết, % đạt, CSAT TB trong kỳ.
 * Khách: chỉ yêu cầu đã chia sẻ (clientVisible) — không mã, không tên, không chi tiết vi phạm.
 */
export async function periodSummary(projectId: number, since: Date, until: Date, audience: 'client' | 'internal') {
  const cfg = await loadDeskConfig(projectId);
  const shared: Prisma.WorkIssueWhereInput = audience === 'client' ? { clientVisible: true } : {};
  const tickets = await prisma.workDeskTicket.findMany({
    where: { issue: { projectId, deletedAt: null, ...shared }, OR: [{ createdAt: { gte: since, lt: until } }, { issue: { resolvedAt: { gte: since, lt: until } } }] },
    take: 5000, select: REPORT_SELECT,
  });
  const now = Math.min(Date.now(), until.getTime());
  const rows = tickets.map((t) => rowOf(t, cfg, now));
  const received = tickets.filter((t) => t.createdAt >= since && t.createdAt < until).length;
  const resolved = tickets.filter((t) => t.issue.resolvedAt && t.issue.resolvedAt >= since && t.issue.resolvedAt < until).length;
  const c = reportCell(rows);
  const open = await prisma.workDeskTicket.count({ where: { issue: { projectId, deletedAt: null, resolvedAt: null, ...shared } } });
  return { received, resolved, open, firstResponsePercent: c.frPercent, resolutionPercent: c.resPercent, csatAvg: c.csatAvg, csatCount: c.csatCount };
}

/**
 * Cho Portfolio RAG (S3a): mỗi dự án bật serviceDesk ⇒ P1 đang mở đã vi phạm + % đạt THÁNG NÀY (theo múi giờ dự án).
 */
export async function portfolioSla(projectIds: number[], now = Date.now()): Promise<Map<number, { openP1Breached: Array<{ key: string; title: string }>; monthPercent: number | null; monthDone: number }>> {
  const out = new Map<number, { openP1Breached: Array<{ key: string; title: string }>; monthPercent: number | null; monthDone: number }>();
  if (!projectIds.length) return out;
  const tickets = await prisma.workDeskTicket.findMany({
    where: { issue: { projectId: { in: projectIds }, deletedAt: null }, OR: [{ issue: { resolvedAt: null } }, { createdAt: { gte: new Date(now - 32 * DAY) } }] },
    take: 20_000,
    select: { ...REPORT_SELECT, issue: { select: { number: true, title: true, resolvedAt: true, createdAt: true, projectId: true, project: { select: { key: true } } } } },
  });
  for (const pid of projectIds) {
    const cfg = await loadDeskConfig(pid);
    const month = monthOf(now, cfg.calendar.timezone);
    const mine = tickets.filter((t) => t.issue.projectId === pid).map((t) => ({ t, row: rowOf(t, cfg, now) }));
    const openP1Breached = mine.filter(({ t, row }) => !t.issue.resolvedAt && row.priority === 'P1' && (row.sla.firstResponse.status === 'BREACHED' || row.sla.resolution.status === 'BREACHED'))
      .map(({ t }) => ({ key: `${t.issue.project.key}-${t.issue.number}`, title: t.issue.title }));
    const c = reportCell(mine.filter((x) => x.row.month === month).map((x) => x.row));
    out.set(pid, { openP1Breached, monthPercent: overallMetPercent(c), monthDone: c.frDone + c.resDone });
  }
  return out;
}
