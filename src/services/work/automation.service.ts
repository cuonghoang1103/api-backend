/**
 * CT Work — luật tự động "khi… nếu… thì…" (đợt 6.5).
 *
 * Khi (trigger): thẻ được tạo · đổi trạng thái · được giao · một trường đổi ·
 * có bình luận · lịch chạy hằng ngày (08:00 giờ VN) trên các thẻ khớp JQL.
 * Nếu (conditions): danh sách JQL — thẻ phải khớp TẤT CẢ.
 * Thì (actions): chuyển trạng thái, giao việc, đổi ưu tiên, gắn nhãn, bình
 * luận, đưa vào sprint đang chạy, gửi thông báo, tạo việc con.
 *
 * Mọi hành động đi qua cửa ghi chung (applyIssueChange/createIssue) nên vẫn
 * có lịch sử, sự kiện, và kiểm dữ liệu hợp lệ như người thật bấm.
 *
 * ⚠️ CHỐNG VÒNG LẶP VÔ HẠN — ba lớp:
 *   1. Mỗi thay đổi do luật gây ra mang actor.ruleChain = các luật đã dẫn tới
 *      nó. Luật thấy chính mình trong chuỗi ⇒ LOOP_BLOCKED (A → A).
 *   2. Chuỗi dài quá MAX_CHAIN ⇒ LOOP_BLOCKED (A → B → C → A…).
 *   3. Mỗi luật tối đa MAX_RUNS_PER_HOUR lần/giờ ⇒ THROTTLED (bắt những vòng
 *      lọt qua hai lớp trên, vd hai luật đẩy nhau qua lại qua webhook).
 * Mọi lần chạy (kể cả bị chặn) đều ghi nhật ký để người dùng thấy vì sao.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { notifyWork } from './notify.js';
import { emitWorkEvent, onWorkEvent, type WorkActor, type WorkEvent } from './events.js';
import { applyIssueChange, createIssue } from './issueChange.js';
import { loadProjectAccess, requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { compileForSystem } from './search.service.js';

export const TRIGGERS = ['issue.created', 'issue.transitioned', 'issue.assigned', 'field.changed', 'comment.added', 'scheduled.daily'] as const;
export type Trigger = (typeof TRIGGERS)[number];
export const ACTION_KINDS = ['transition', 'assign', 'set_priority', 'add_label', 'comment', 'move_to_active_sprint', 'notify', 'create_subtask'] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export interface RuleAction {
  kind: ActionKind;
  statusId?: number;
  /** assign: số id người, 'reporter', hoặc null = bỏ giao. */
  assignee?: number | 'reporter' | null;
  priority?: number;
  labelId?: number;
  text?: string;
  /** notify: gửi cho ai. */
  to?: Array<'assignee' | 'reporter' | 'watchers' | number>;
  title?: string;
}
export interface RuleConfig {
  /** issue.transitioned: chỉ khi đi VÀO một trong các trạng thái này (rỗng = mọi). */
  toStatusIds?: number[];
  fromStatusIds?: number[];
  /** field.changed: tên trường (priority, dueDate, storyPoints, sprintId, …). */
  fields?: string[];
  /** scheduled.daily: chọn thẻ nào để chạy. */
  jql?: string;
  conditions?: Array<{ jql: string }>;
  actions: RuleAction[];
}

const MAX_CHAIN = 3;
const MAX_RUNS_PER_HOUR = 200;
const MAX_ACTIONS = 10;
const SCHEDULED_BATCH = 200;
const TRACKED_FIELDS = ['priority', 'assigneeId', 'storyPoints', 'dueDate', 'startDate', 'sprintId', 'fixVersionId', 'parentId', 'title', 'description'];

// ─── CRUD ────────────────────────────────────────────────────────

const RULE_SELECT = {
  id: true, name: true, enabled: true, trigger: true, config: true, createdById: true, runCount: true, lastRunAt: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WorkAutomationRuleSelect;

export async function listRules(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const rules = await prisma.workAutomationRule.findMany({ where: { projectId }, orderBy: { id: 'asc' }, select: RULE_SELECT });
  // Lần chạy gần nhất có lỗi — hiện chấm đỏ bên cạnh luật.
  const failing = await prisma.workAutomationLog.groupBy({
    by: ['ruleId'],
    where: { rule: { projectId }, status: { in: ['FAILED', 'LOOP_BLOCKED', 'THROTTLED'] }, createdAt: { gte: new Date(Date.now() - 86_400_000) } },
    _count: { _all: true },
  });
  return rules.map((r) => ({ ...r, recentProblems: failing.find((f) => f.ruleId === r.id)?._count._all ?? 0 }));
}

/** Kiểm cấu hình luật khớp với dự án (trạng thái, nhãn, người… có thật) trước khi lưu. */
async function validateConfig(projectId: number, trigger: Trigger, cfg: RuleConfig, actorUserId: number): Promise<RuleConfig> {
  if (!Array.isArray(cfg.actions) || !cfg.actions.length) throw new BadRequestError('Add at least one action', 'WORK_RULE_NO_ACTION');
  if (cfg.actions.length > MAX_ACTIONS) throw new BadRequestError(`A rule can have at most ${MAX_ACTIONS} actions`, 'WORK_LIMIT');
  const [statuses, labels] = await Promise.all([
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true } }),
    prisma.workLabel.findMany({ where: { projectId }, select: { id: true } }),
  ]);
  const statusIds = new Set(statuses.map((s) => s.id));
  for (const id of [...(cfg.toStatusIds ?? []), ...(cfg.fromStatusIds ?? [])]) {
    if (!statusIds.has(id)) throw new BadRequestError('The rule refers to a status that does not exist', 'WORK_RULE_BAD');
  }
  if (trigger === 'field.changed') {
    if (!cfg.fields?.length) throw new BadRequestError('Pick which field changes trigger the rule', 'WORK_RULE_BAD');
    for (const f of cfg.fields) if (!TRACKED_FIELDS.includes(f)) throw new BadRequestError(`Unsupported field "${f}"`, 'WORK_RULE_BAD');
  }
  if (trigger === 'scheduled.daily' && !cfg.jql?.trim()) throw new BadRequestError('A scheduled rule needs a JQL query to pick issues', 'WORK_RULE_BAD');
  if (cfg.jql) await compileForSystem(projectId, cfg.jql, actorUserId);
  for (const c of cfg.conditions ?? []) await compileForSystem(projectId, c.jql, actorUserId);
  const members = new Set((await projectMembers(projectId)).map((m) => m.id));
  for (const a of cfg.actions) {
    if (!ACTION_KINDS.includes(a.kind)) throw new BadRequestError(`Unknown action "${a.kind}"`, 'WORK_RULE_BAD');
    if (a.kind === 'transition' && !statusIds.has(a.statusId ?? -1)) throw new BadRequestError('Pick the status to move to', 'WORK_RULE_BAD');
    if (a.kind === 'assign' && typeof a.assignee === 'number' && !members.has(a.assignee)) throw new BadRequestError('The assignee is not a member of this project', 'WORK_RULE_BAD');
    if (a.kind === 'set_priority' && !(Number.isInteger(a.priority) && a.priority! >= 1 && a.priority! <= 5)) throw new BadRequestError('Priority must be 1–5', 'WORK_RULE_BAD');
    if (a.kind === 'add_label' && !labels.some((l) => l.id === a.labelId)) throw new BadRequestError('Pick a label', 'WORK_RULE_BAD');
    if ((a.kind === 'comment' || a.kind === 'notify') && !a.text?.trim()) throw new BadRequestError('Write the message', 'WORK_RULE_BAD');
    if (a.kind === 'notify' && !a.to?.length) throw new BadRequestError('Pick who gets notified', 'WORK_RULE_BAD');
    if (a.kind === 'create_subtask' && !a.title?.trim()) throw new BadRequestError('Give the sub-task a title', 'WORK_RULE_BAD');
  }
  return {
    ...cfg,
    actions: cfg.actions.map((a) => ({ ...a, text: a.text?.slice(0, 2000), title: a.title?.slice(0, 255) })),
  };
}

export async function saveRule(userId: number, projectId: number, input: { id?: number; name: string; enabled?: boolean; trigger: Trigger; config: RuleConfig }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Rule name is required', 'WORK_NAME_REQUIRED');
  if (!TRIGGERS.includes(input.trigger)) throw new BadRequestError('Unknown trigger', 'WORK_RULE_BAD');
  const config = await validateConfig(projectId, input.trigger, input.config, userId);
  const data = { name, trigger: input.trigger, config: config as unknown as Prisma.InputJsonValue, enabled: input.enabled ?? true };
  if (input.id) {
    const r = await prisma.workAutomationRule.findFirst({ where: { id: input.id, projectId } });
    if (!r) throw new NotFoundError('Rule not found');
    return prisma.workAutomationRule.update({ where: { id: r.id }, data, select: RULE_SELECT });
  }
  const count = await prisma.workAutomationRule.count({ where: { projectId } });
  if (count >= 50) throw new BadRequestError('A project can have at most 50 rules', 'WORK_LIMIT');
  return prisma.workAutomationRule.create({ data: { ...data, projectId, createdById: userId }, select: RULE_SELECT });
}

export async function setRuleEnabled(userId: number, projectId: number, ruleId: number, enabled: boolean) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workAutomationRule.updateMany({ where: { id: ruleId, projectId }, data: { enabled } });
  if (!r.count) throw new NotFoundError('Rule not found');
}

export async function deleteRule(userId: number, projectId: number, ruleId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workAutomationRule.deleteMany({ where: { id: ruleId, projectId } });
  if (!r.count) throw new NotFoundError('Rule not found');
}

export async function ruleLogs(userId: number, projectId: number, ruleId?: number) {
  await requireProject(userId, projectId, 'project.view');
  const logs = await prisma.workAutomationLog.findMany({
    where: { rule: { projectId }, ...(ruleId ? { ruleId } : {}) },
    orderBy: { id: 'desc' },
    take: 100,
    select: { id: true, ruleId: true, issueId: true, status: true, message: true, durationMs: true, createdAt: true, rule: { select: { name: true } } },
  });
  const ids = [...new Set(logs.map((l) => l.issueId).filter((x): x is number => !!x))];
  const issues = ids.length ? await prisma.workIssue.findMany({ where: { id: { in: ids } }, select: { id: true, number: true, title: true } }) : [];
  return logs.map((l) => {
    const i = issues.find((x) => x.id === l.issueId);
    return { ...l, ruleName: l.rule.name, rule: undefined, issue: i ? { number: i.number, title: i.title } : null };
  });
}

// ─── Engine ──────────────────────────────────────────────────────

type Rule = { id: number; projectId: number; name: string; trigger: string; config: unknown; createdById: number | null };

/** Đếm lần chạy theo luật trong giờ hiện tại (bộ nhớ tiến trình — đủ cho một backend). */
const runWindow = new Map<number, { hour: number; n: number }>();
function throttled(ruleId: number): boolean {
  const hour = Math.floor(Date.now() / 3_600_000);
  const w = runWindow.get(ruleId);
  if (!w || w.hour !== hour) { runWindow.set(ruleId, { hour, n: 1 }); return false; }
  w.n += 1;
  return w.n > MAX_RUNS_PER_HOUR;
}

async function log(ruleId: number, issueId: number | null, status: string, message: string, started: number) {
  await prisma.workAutomationLog.create({ data: { ruleId, issueId, status, message: message.slice(0, 2000), durationMs: Date.now() - started } });
}

/** Thẻ có khớp một JQL không — dịch JQL rồi hỏi DB đúng thẻ đó. */
async function issueMatches(projectId: number, issueId: number, jql: string, actorUserId: number | null): Promise<boolean> {
  const { where } = await compileForSystem(projectId, jql, actorUserId);
  return (await prisma.workIssue.count({ where: { AND: [{ id: issueId, projectId, deletedAt: null }, where] } })) > 0;
}

/** Luật có bắt sự kiện này không (chưa xét điều kiện JQL). */
export function triggerMatches(rule: { trigger: string; config: RuleConfig }, e: WorkEvent): boolean {
  const c = rule.config;
  switch (rule.trigger) {
    case 'issue.created': return e.type === 'issue.created';
    case 'comment.added': return e.type === 'comment.created';
    case 'issue.transitioned': {
      if (e.type !== 'issue.updated') return false;
      const ch = e.changes.find((x) => x.field === 'statusId');
      if (!ch) return false;
      if (c.toStatusIds?.length && !c.toStatusIds.includes(Number(ch.to))) return false;
      if (c.fromStatusIds?.length && !c.fromStatusIds.includes(Number(ch.from))) return false;
      return true;
    }
    case 'issue.assigned': {
      if (e.type !== 'issue.updated') return false;
      const ch = e.changes.find((x) => x.field === 'assigneeId');
      return !!ch && ch.to !== null;
    }
    case 'field.changed':
      return e.type === 'issue.updated' && e.changes.some((x) => c.fields?.includes(x.field));
    default:
      return false;
  }
}

async function runActions(rule: Rule, issueId: number, actor: WorkActor): Promise<string[]> {
  const cfg = rule.config as RuleConfig;
  const done: string[] = [];
  for (const a of cfg.actions) {
    const issue = await prisma.workIssue.findFirst({
      where: { id: issueId, deletedAt: null },
      select: { id: true, number: true, title: true, projectId: true, reporterId: true, assigneeId: true, statusId: true, typeId: true, type: { select: { level: true } }, project: { select: { key: true, workspace: { select: { slug: true } } } } },
    });
    if (!issue) break;
    switch (a.kind) {
      case 'transition':
        if (issue.statusId !== a.statusId) { await applyIssueChange(issueId, { statusId: a.statusId! }, actor); done.push('moved'); }
        break;
      case 'assign': {
        const to = a.assignee === 'reporter' ? issue.reporterId : (a.assignee ?? null);
        if (to !== issue.assigneeId) { await applyIssueChange(issueId, { assigneeId: to }, actor); done.push(to ? 'assigned' : 'unassigned'); }
        break;
      }
      case 'set_priority':
        await applyIssueChange(issueId, { priority: a.priority! }, actor); done.push('priority set');
        break;
      case 'add_label': {
        const r = await prisma.workIssueLabel.createMany({ data: [{ issueId, labelId: a.labelId! }], skipDuplicates: true });
        if (r.count) {
          const l = await prisma.workLabel.findUnique({ where: { id: a.labelId! }, select: { name: true } });
          await prisma.workHistory.create({ data: { issueId, actorId: actor.userId, actorKind: 'AUTOMATION', field: 'labels', toValue: l?.name ?? null } });
          done.push('label added');
        }
        break;
      }
      case 'comment': {
        const text = a.text!;
        const bodyJson = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] };
        // Bình luận của luật: authorId null (hiện "Automation"), không ai bị tính là người viết.
        const c = await prisma.workComment.create({ data: { issueId, authorId: null, bodyJson, bodyText: text } });
        emitWorkEvent({ type: 'comment.created', projectId: issue.projectId, issueId, commentId: c.id, actor });
        done.push('commented');
        break;
      }
      case 'move_to_active_sprint': {
        if (issue.type.level !== 0) break;
        const sp = await prisma.workSprint.findFirst({ where: { projectId: issue.projectId, state: 'ACTIVE' }, select: { id: true } });
        if (sp) { await applyIssueChange(issueId, { sprintId: sp.id }, actor); done.push('added to sprint'); }
        break;
      }
      case 'notify': {
        const receivers = new Set<number>();
        for (const t of a.to ?? []) {
          if (t === 'assignee' && issue.assigneeId) receivers.add(issue.assigneeId);
          else if (t === 'reporter' && issue.reporterId) receivers.add(issue.reporterId);
          else if (t === 'watchers') (await prisma.workWatcher.findMany({ where: { issueId }, select: { userId: true } })).forEach((w) => receivers.add(w.userId));
          else if (typeof t === 'number') receivers.add(t);
        }
        // Chỉ gửi cho người còn vào được dự án.
        const sender = rule.createdById ?? issue.reporterId;
        for (const uid of receivers) {
          if (!sender || !(await loadProjectAccess(uid, issue.projectId))) continue;
          await notifyWork({
            receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: issueId,
            payload: {
              issueKey: `${issue.project.key}-${issue.number}`, title: issue.title, message: a.text!.slice(0, 300), rule: rule.name,
              url: `/work/${issue.project.workspace.slug}/${issue.project.key}/issue/${issue.number}`,
            },
          });
        }
        done.push(`notified ${receivers.size}`);
        break;
      }
      case 'create_subtask': {
        if (issue.type.level !== 0) break;
        const sub = await prisma.workIssueType.findFirst({ where: { projectId: issue.projectId, level: -1, archived: false }, select: { id: true } });
        if (!sub) throw new Error('This project has no sub-task type');
        await createIssue({ projectId: issue.projectId, typeId: sub.id, title: a.title!, parentId: issueId, reporterId: rule.createdById }, actor);
        done.push('sub-task created');
        break;
      }
    }
  }
  return done;
}

/** Chạy một luật trên một thẻ: kiểm vòng lặp, điều kiện, rồi hành động. Không bao giờ ném. */
export async function runRuleOnIssue(rule: Rule, issueId: number, cause: WorkActor | null): Promise<string> {
  const started = Date.now();
  const chain = cause?.ruleChain ?? [];
  try {
    if (chain.includes(rule.id)) {
      await log(rule.id, issueId, 'LOOP_BLOCKED', `Skipped: this change was caused by the same rule (chain ${chain.join(' → ')}).`, started);
      return 'LOOP_BLOCKED';
    }
    if (chain.length >= MAX_CHAIN) {
      await log(rule.id, issueId, 'LOOP_BLOCKED', `Skipped: ${chain.length} rules already fired in a row — possible loop.`, started);
      return 'LOOP_BLOCKED';
    }
    if (throttled(rule.id)) {
      await log(rule.id, issueId, 'THROTTLED', `Skipped: more than ${MAX_RUNS_PER_HOUR} runs in the last hour.`, started);
      return 'THROTTLED';
    }
    const cfg = rule.config as RuleConfig;
    for (const c of cfg.conditions ?? []) {
      if (!(await issueMatches(rule.projectId, issueId, c.jql, rule.createdById))) {
        await log(rule.id, issueId, 'NO_MATCH', `Condition not met: ${c.jql}`, started);
        return 'NO_MATCH';
      }
    }
    const actor: WorkActor = { kind: 'AUTOMATION', userId: rule.createdById, ruleChain: [...chain, rule.id] };
    const done = await runActions(rule, issueId, actor);
    await prisma.workAutomationRule.update({ where: { id: rule.id }, data: { runCount: { increment: 1 }, lastRunAt: new Date() } });
    await log(rule.id, issueId, 'SUCCESS', done.length ? done.join(', ') : 'Nothing to change', started);
    return 'SUCCESS';
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await log(rule.id, issueId, 'FAILED', msg, started).catch(() => undefined);
    return 'FAILED';
  }
}

/** Đầu vào từ bus sự kiện. */
export async function handleEvent(e: WorkEvent): Promise<void> {
  if (e.type !== 'issue.created' && e.type !== 'issue.updated' && e.type !== 'comment.created') return;
  const rules = await prisma.workAutomationRule.findMany({
    where: { projectId: e.projectId, enabled: true, trigger: { not: 'scheduled.daily' } },
    select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true },
  });
  for (const r of rules) {
    if (!triggerMatches({ trigger: r.trigger, config: r.config as unknown as RuleConfig }, e)) continue;
    await runRuleOnIssue(r, e.issueId, e.actor);
  }
}

/** Cron 08:00 giờ VN: mỗi luật lịch chạy trên tối đa SCHEDULED_BATCH thẻ khớp JQL. */
export async function runScheduledRules(): Promise<number> {
  const rules = await prisma.workAutomationRule.findMany({
    where: { enabled: true, trigger: 'scheduled.daily', project: { deletedAt: null, archivedAt: null } },
    select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true },
  });
  let runs = 0;
  for (const r of rules) {
    const cfg = r.config as unknown as RuleConfig;
    try {
      const { where } = await compileForSystem(r.projectId, cfg.jql ?? '', r.createdById);
      const issues = await prisma.workIssue.findMany({ where: { AND: [{ projectId: r.projectId, deletedAt: null }, where] }, select: { id: true }, take: SCHEDULED_BATCH, orderBy: { id: 'asc' } });
      for (const i of issues) { await runRuleOnIssue(r, i.id, null); runs += 1; }
    } catch (err) {
      await log(r.id, null, 'FAILED', err instanceof Error ? err.message : String(err), Date.now()).catch(() => undefined);
    }
  }
  return runs;
}

/** Chạy thử ngay một luật trên một thẻ (nút "Test rule" trong UI). */
export async function testRule(userId: number, projectId: number, ruleId: number, number: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workAutomationRule.findFirst({ where: { id: ruleId, projectId }, select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true } });
  if (!r) throw new NotFoundError('Rule not found');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const status = await runRuleOnIssue(r, issue.id, null);
  const last = await prisma.workAutomationLog.findFirst({ where: { ruleId: r.id }, orderBy: { id: 'desc' }, select: { status: true, message: true } });
  return { status, message: last?.message ?? '' };
}

let registered = false;
export function registerAutomation(): void {
  if (registered) return;
  registered = true;
  onWorkEvent((e) => handleEvent(e).catch((err) => logger.error('[work] automation lỗi', { err })));
}
