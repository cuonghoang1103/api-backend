/**
 * CT Work — CTW đợt 5 (10/10/2026): VIỆC ĐỊNH KỲ (C12) — họp mentor hằng tuần, nộp Weekly Report thứ Sáu, daily stand-up…
 *
 * Lưu NGAY trong bảng luật tự động (`work_automation_rules`, trigger `scheduled.recurring`) ⇒ bật/tắt, nhật ký chạy
 * (`work_automation_logs`) và chốt quyền đi chung với Automation. Cấu hình:
 *   config = { recurrence: Recurrence (teachingRules.ts), issue: { title, typeId, description?, assigneeId?, priority?,
 *              labelIds?, dueInDays?, addToActiveSprint? }, actions: [{ kind: 'create_issue' }] }
 *
 * Chạy: cron HẰNG GIỜ (cron.service.ts) gọi `runRecurringRules()`. Mỗi luật: đổi "bây giờ" sang NGÀY + GIỜ theo múi giờ
 * của dự án (`projectTimezone`), lấy lần lặp đã tới giờ (bù được 36 giờ nếu máy chủ tắt), rồi GIÀNH khoá
 * `work_recurring_runs.dedup_key = rec:<ruleId>:<ngày>` (UNIQUE) TRƯỚC khi tạo thẻ — hai tiến trình chạy cùng lúc / chạy lại
 * không bao giờ tạo trùng. Tạo thẻ hỏng ⇒ trả khoá để giờ sau thử lại; nhật ký ghi FAILED kèm lý do.
 * Thẻ đi qua cửa ghi chung (`createIssue`) với actor AUTOMATION ⇒ có lịch sử, sự kiện, thông báo như người tạo.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { createIssue } from './issueChange.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { addDays, dayInZone, projectTimezone, zonedMidnight } from './projectTime.js';
import {
  RecurrenceError, dueOccurrence, fireTime, nextOccurrences, normalizeRecurrence, recurringDedupKey, renderRecurringTitle, toRrule, type Recurrence,
} from './teachingRules.js';

export const RECURRING_TRIGGER = 'scheduled.recurring';
const MAX_RULES_PER_PROJECT = 30;

export interface RecurringIssue {
  title: string;
  typeId: number;
  description?: string | null;
  assigneeId?: number | null;
  priority?: number | null;
  labelIds?: number[];
  /** Hạn = ngày lặp + n ngày (0 = cùng ngày). null = không đặt hạn. */
  dueInDays?: number | null;
  addToActiveSprint?: boolean;
}
export interface RecurringConfig { recurrence: Recurrence; issue: RecurringIssue; actions: Array<{ kind: 'create_issue' }> }
export interface RecurringInput { id?: number; name: string; enabled?: boolean; recurrence: unknown; issue: RecurringIssue }

function wrapRec<T>(fn: () => T): T {
  try { return fn(); } catch (e) {
    if (e instanceof RecurrenceError) throw new BadRequestError(e.message, 'WORK_RULE_BAD');
    throw e;
  }
}

const cfgOf = (raw: unknown) => raw as RecurringConfig;

/** n lần lặp SẮP TỚI: lần của hôm nay đã qua giờ chạy thì không tính (đã/đang được tạo). */
function upcoming(rec: Recurrence, tz: string, now: Date, n: number): string[] {
  const today = dayInZone(now, tz);
  return nextOccurrences(rec, today, n + 1).filter((d) => d !== today || fireTime(rec, zonedMidnight(d, tz)).getTime() > now.getTime()).slice(0, n);
}

function view(r: { id: number; name: string; enabled: boolean; config: unknown; runCount: number; lastRunAt: Date | null; createdAt: Date }, tz: string) {
  const cfg = cfgOf(r.config);
  let next: string[] = [];
  let rrule = '';
  try {
    const rec = normalizeRecurrence(cfg.recurrence);
    next = upcoming(rec, tz, new Date(), 5);
    rrule = toRrule(rec);
  } catch { /* cấu hình hỏng: vẫn hiện để sửa / xoá */ }
  return { id: r.id, name: r.name, enabled: r.enabled, recurrence: cfg.recurrence, issue: cfg.issue, rrule, next, timezone: tz, runCount: r.runCount, lastRunAt: r.lastRunAt, createdAt: r.createdAt };
}

export async function listRecurring(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const tz = await projectTimezone(projectId);
  const today = dayInZone(new Date(), tz);
  const rules = await prisma.workAutomationRule.findMany({
    where: { projectId, trigger: RECURRING_TRIGGER }, orderBy: { id: 'asc' },
    select: { id: true, name: true, enabled: true, config: true, runCount: true, lastRunAt: true, createdAt: true },
  });
  const runs = rules.length
    ? await prisma.workRecurringRun.findMany({ where: { ruleId: { in: rules.map((r) => r.id) } }, orderBy: { id: 'desc' }, take: 50, select: { ruleId: true, occurrence: true, issueId: true, createdAt: true } })
    : [];
  const issueNums = runs.length
    ? new Map((await prisma.workIssue.findMany({ where: { id: { in: runs.map((r) => r.issueId).filter((x): x is number => !!x) } }, select: { id: true, number: true } })).map((i) => [i.id, i.number]))
    : new Map<number, number>();
  return {
    timezone: tz, today, canEdit: access.role === 'ADMIN',
    rules: rules.map((r) => ({
      ...view(r, tz),
      recent: runs.filter((x) => x.ruleId === r.id).slice(0, 5).map((x) => ({ occurrence: x.occurrence, issueNumber: x.issueId ? issueNums.get(x.issueId) ?? null : null, at: x.createdAt })),
    })),
  };
}

async function validateIssue(projectId: number, i: RecurringIssue): Promise<RecurringIssue> {
  const title = String(i?.title ?? '').trim().slice(0, 255);
  if (!title) throw new BadRequestError('Give the issue a title', 'WORK_RULE_BAD');
  const type = await prisma.workIssueType.findFirst({ where: { id: Number(i.typeId), projectId, archived: false }, select: { id: true, level: true } });
  if (!type) throw new BadRequestError('Pick an issue type of this project', 'WORK_RULE_BAD');
  if (type.level === -1) throw new BadRequestError('A recurring issue cannot be a sub-task', 'WORK_RULE_BAD');
  if (i.assigneeId) {
    const members = new Set((await projectMembers(projectId)).filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => m.id));
    if (!members.has(i.assigneeId)) throw new BadRequestError('The assignee is not a member of this project', 'WORK_RULE_BAD');
  }
  if (i.priority !== undefined && i.priority !== null && !(Number.isInteger(i.priority) && i.priority >= 1 && i.priority <= 5)) throw new BadRequestError('Priority must be 1–5', 'WORK_RULE_BAD');
  const labelIds = [...new Set((i.labelIds ?? []).map(Number))].slice(0, 10);
  if (labelIds.length && (await prisma.workLabel.count({ where: { projectId, id: { in: labelIds } } })) !== labelIds.length) throw new BadRequestError('A label does not exist in this project', 'WORK_RULE_BAD');
  const dueInDays = i.dueInDays === null || i.dueInDays === undefined ? null : Number(i.dueInDays);
  if (dueInDays !== null && (!Number.isInteger(dueInDays) || dueInDays < 0 || dueInDays > 60)) throw new BadRequestError('Due in 0–60 days', 'WORK_RULE_BAD');
  return {
    title, typeId: type.id, description: i.description?.trim().slice(0, 4000) || null, assigneeId: i.assigneeId ?? null,
    priority: i.priority ?? null, labelIds, dueInDays, addToActiveSprint: i.addToActiveSprint === true,
  };
}

export async function saveRecurring(userId: number, projectId: number, input: RecurringInput) {
  await requireProject(userId, projectId, 'project.settings');
  const name = String(input.name ?? '').trim().slice(0, 100);
  if (!name) throw new BadRequestError('Name the recurring work', 'WORK_NAME_REQUIRED');
  const recurrence = wrapRec(() => normalizeRecurrence(input.recurrence));
  const issue = await validateIssue(projectId, input.issue);
  const config: RecurringConfig = { recurrence, issue, actions: [{ kind: 'create_issue' }] };
  const data = { name, enabled: input.enabled ?? true, config: config as unknown as Prisma.InputJsonValue };
  if (input.id) {
    const r = await prisma.workAutomationRule.findFirst({ where: { id: input.id, projectId, trigger: RECURRING_TRIGGER }, select: { id: true } });
    if (!r) throw new NotFoundError('Recurring work not found');
    await prisma.workAutomationRule.update({ where: { id: r.id }, data });
    return { id: r.id };
  }
  if ((await prisma.workAutomationRule.count({ where: { projectId, trigger: RECURRING_TRIGGER } })) >= MAX_RULES_PER_PROJECT) {
    throw new BadRequestError(`A project can have at most ${MAX_RULES_PER_PROJECT} recurring items`, 'WORK_LIMIT');
  }
  const r = await prisma.workAutomationRule.create({ data: { projectId, trigger: RECURRING_TRIGGER, createdById: userId, ...data }, select: { id: true } });
  return { id: r.id };
}

export async function deleteRecurring(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workAutomationRule.deleteMany({ where: { id, projectId, trigger: RECURRING_TRIGGER } });
  if (!r.count) throw new NotFoundError('Recurring work not found');
}

/** Xem trước 8 lần lặp kế tiếp (không ghi gì) — form dùng khi người dùng đổi lịch. */
export async function previewRecurring(userId: number, projectId: number, input: { recurrence: unknown; title?: string }) {
  await requireProject(userId, projectId, 'project.view');
  const rec = wrapRec(() => normalizeRecurrence(input.recurrence));
  const tz = await projectTimezone(projectId);
  const next = upcoming(rec, tz, new Date(), 8);
  return { rrule: toRrule(rec), timezone: tz, next: next.map((d) => ({ day: d, title: input.title ? renderRecurringTitle(input.title, d, rec) : null })) };
}

// ─── Chạy theo lịch ──────────────────────────────────────────────

async function log(ruleId: number, issueId: number | null, status: string, message: string, started: number) {
  await prisma.workAutomationLog.create({ data: { ruleId, issueId, status, message: message.slice(0, 2000), durationMs: Date.now() - started } }).catch(() => undefined);
}

/** Tạo thẻ cho MỘT lần lặp (đã giành khoá). Trả id thẻ. */
async function createOccurrence(rule: { id: number; projectId: number; createdById: number | null }, cfg: RecurringConfig, day: string): Promise<{ id: number; number: number }> {
  const i = cfg.issue;
  const sprint = i.addToActiveSprint ? await prisma.workSprint.findFirst({ where: { projectId: rule.projectId, state: 'ACTIVE' }, select: { id: true } }) : null;
  // Người được giao đã rời dự án ⇒ vẫn tạo thẻ, bỏ trống người giao (không làm hỏng cả lần lặp).
  let assigneeId = i.assigneeId ?? null;
  if (assigneeId && !(await projectMembers(rule.projectId)).some((m) => m.id === assigneeId && (m.role === 'ADMIN' || m.role === 'MEMBER'))) assigneeId = null;
  const descriptionJson = i.description ? { type: 'doc', content: i.description.split(/\n{2,}/).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })) } : null;
  const issue = await createIssue({
    projectId: rule.projectId, typeId: i.typeId, title: renderRecurringTitle(i.title, day, cfg.recurrence),
    ...(descriptionJson ? { descriptionJson } : {}),
    assigneeId, ...(i.priority ? { priority: i.priority } : {}),
    dueDate: i.dueInDays === null || i.dueInDays === undefined ? null : new Date(`${addDays(day, i.dueInDays)}T00:00:00Z`),
    sprintId: sprint?.id ?? null, reporterId: rule.createdById,
  }, { kind: 'AUTOMATION', userId: rule.createdById, ruleChain: [rule.id] });
  const created = issue as unknown as { id: number; number: number };
  if (i.labelIds?.length) await prisma.workIssueLabel.createMany({ data: i.labelIds.map((labelId) => ({ issueId: created.id, labelId })), skipDuplicates: true });
  return { id: created.id, number: created.number };
}

/**
 * Một lượt (cron hằng giờ). Trả số thẻ đã tạo. `now` để test. `projectIds` giới hạn dự án (test).
 * Chống trùng: INSERT dedup_key trước — P2002 ⇒ lần lặp này đã có người tạo ⇒ bỏ qua im lặng.
 */
export async function runRecurringRules(now = new Date(), opts: { projectIds?: number[] } = {}): Promise<number> {
  const rules = await prisma.workAutomationRule.findMany({
    where: { enabled: true, trigger: RECURRING_TRIGGER, project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } }, ...(opts.projectIds ? { projectId: { in: opts.projectIds } } : {}) },
    select: { id: true, projectId: true, config: true, createdById: true },
  });
  const tzCache = new Map<number, string>();
  let created = 0;
  for (const r of rules) {
    const started = Date.now();
    let cfg: RecurringConfig;
    try { cfg = { ...cfgOf(r.config), recurrence: normalizeRecurrence(cfgOf(r.config).recurrence) }; } catch (err) {
      await log(r.id, null, 'FAILED', `Invalid schedule: ${(err as Error).message}`, started);
      continue;
    }
    const tz = tzCache.get(r.projectId) ?? await projectTimezone(r.projectId);
    tzCache.set(r.projectId, tz);
    const day = dueOccurrence(cfg.recurrence, now, dayInZone(now, tz), (d) => zonedMidnight(d, tz));
    if (!day) continue;
    const dedupKey = recurringDedupKey(r.id, day);
    let runId: number;
    try {
      runId = (await prisma.workRecurringRun.create({ data: { ruleId: r.id, dedupKey, occurrence: day }, select: { id: true } })).id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue; // đã tạo rồi
      throw err;
    }
    try {
      const issue = await createOccurrence(r, cfg, day);
      await prisma.workRecurringRun.update({ where: { id: runId }, data: { issueId: issue.id } });
      await prisma.workAutomationRule.update({ where: { id: r.id }, data: { runCount: { increment: 1 }, lastRunAt: new Date() } });
      await log(r.id, issue.id, 'SUCCESS', `Created #${issue.number} for ${day} (${tz})`, started);
      created += 1;
    } catch (err) {
      await prisma.workRecurringRun.delete({ where: { id: runId } }).catch(() => undefined);
      await log(r.id, null, 'FAILED', `${day}: ${(err as Error).message}`, started);
      logger.warn('[work] recurring: tạo thẻ lỗi', { ruleId: r.id, err: (err as Error).message });
    }
  }
  return created;
}

/**
 * Múi giờ của dự án (`settings.timezone`) — việc định kỳ, báo cáo tuần, AI đều đọc qua `projectTimezone`. Lịch báo cáo
 * khách (nếu có) vẫn thắng như cũ; ở đây chỉ đổi khoá chung của dự án. Ghi trong transaction đọc-lại: settings là JSON
 * dùng chung — không đè khoá của tính năng khác.
 */
export async function setProjectTimezone(userId: number, projectId: number, timezone: string) {
  await requireProject(userId, projectId, 'project.settings');
  const { validTz } = await import('./projectTime.js');
  if (!validTz(timezone)) throw new BadRequestError('Unknown time zone', 'WORK_BAD_TIMEZONE');
  await prisma.$transaction(async (tx) => {
    const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    await tx.workProject.update({ where: { id: projectId }, data: { settings: { ...((p.settings ?? {}) as Record<string, unknown>), timezone } as Prisma.InputJsonValue } });
  });
  return { timezone: await projectTimezone(projectId) };
}
