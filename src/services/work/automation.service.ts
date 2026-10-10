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
import crypto from 'node:crypto';
import { onAutomationSignal, SIGNALS, type AutomationSignal } from './automationSignals.js';

export const TRIGGERS = [
  'issue.created', 'issue.transitioned', 'issue.assigned', 'field.changed', 'comment.added', 'scheduled.daily',
  // CTW đợt 7c (C13): sắp tới hạn (lịch hằng ngày) + tín hiệu ngoài thẻ (automationSignals.ts).
  'issue.due_soon', ...SIGNALS,
] as const;
export type Trigger = (typeof TRIGGERS)[number];
export const ACTION_KINDS = [
  'transition', 'assign', 'set_priority', 'add_label', 'comment', 'move_to_active_sprint', 'notify', 'create_subtask',
  // CTW đợt 7c (C13): gửi chat kênh dự án · gọi webhook (ký HMAC, chốt SSRF chung) · gán theo vòng · tạo thẻ con theo mẫu.
  'post_chat', 'webhook', 'assign_round_robin', 'create_subtasks',
] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];
/** Hành động CẦN một thẻ — luật chạy theo tín hiệu không gắn thẻ (vd baseline đổi) thì bỏ qua các hành động này. */
const NEEDS_ISSUE: ReadonlySet<ActionKind> = new Set<ActionKind>(['transition', 'assign', 'set_priority', 'add_label', 'comment', 'move_to_active_sprint', 'create_subtask', 'assign_round_robin', 'create_subtasks']);

/** CTW đợt 7c: mẫu thẻ con cho action create_subtasks (đồ án sinh viên). Lưu luật ⇒ mở thành danh sách tiêu đề. */
export const SUBTASK_TEMPLATES: Record<string, string[]> = {
  dod: ['Clarify acceptance criteria', 'Implement', 'Write unit tests', 'Code review', 'Update docs / SRS'],
  bugfix: ['Reproduce the bug', 'Fix the root cause', 'Add a regression test', 'Retest and close'],
  release: ['Freeze scope', 'Run regression tests', 'Write release notes', 'Deploy', 'Smoke-test production'],
  report: ['Write the draft', 'Peer review', 'Address review comments', 'Submit to supervisor'],
  usecase: ['Write the use case specification', 'Draw the sequence diagram', 'Design the screen', 'Write test cases'],
};

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
  /** post_chat: tên kênh (null/'' = #general). */
  channel?: string | null;
  /** webhook: URL https công khai + bí mật ký HMAC (không trả về client — listRules che). */
  url?: string;
  secret?: string;
  /** assign_round_robin: danh sách người xoay vòng (2–20). */
  pool?: number[];
  /** create_subtasks: tiêu đề thẻ con (mẫu SUBTASK_TEMPLATES đã mở sẵn lúc lưu). */
  titles?: string[];
  template?: string;
}
export interface RuleConfig {
  /** issue.transitioned: chỉ khi đi VÀO một trong các trạng thái này (rỗng = mọi). */
  toStatusIds?: number[];
  fromStatusIds?: number[];
  /** field.changed: tên trường (priority, dueDate, storyPoints, sprintId, …). */
  fields?: string[];
  /** scheduled.daily: chọn thẻ nào để chạy. */
  jql?: string;
  /** issue.due_soon: báo trước bao nhiêu ngày (1–30, mặc định 2). */
  dueInDays?: number;
  /** assign_round_robin: con trỏ vòng do máy chủ giữ (client gửi lên bị bỏ). */
  _rr?: Record<string, number>;
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
  // CTW đợt 5: việc định kỳ (trigger scheduled.recurring) có trang riêng (recurring.service.ts) — không hiện ở đây.
  const rules = await prisma.workAutomationRule.findMany({ where: { projectId, trigger: { not: 'scheduled.recurring' } }, orderBy: { id: 'asc' }, select: RULE_SELECT });
  // Lần chạy gần nhất có lỗi — hiện chấm đỏ bên cạnh luật.
  const failing = await prisma.workAutomationLog.groupBy({
    by: ['ruleId'],
    where: { rule: { projectId }, status: { in: ['FAILED', 'LOOP_BLOCKED', 'THROTTLED'] }, createdAt: { gte: new Date(Date.now() - 86_400_000) } },
    _count: { _all: true },
  });
  return rules.map((r) => ({ ...r, config: publicConfig(r.config as unknown as RuleConfig), recentProblems: failing.find((f) => f.ruleId === r.id)?._count._all ?? 0 }));
}

/** CTW đợt 7c: cấu hình trả về client — che bí mật webhook, bỏ con trỏ vòng (người XEM dự án cũng đọc được luật). */
function publicConfig(cfg: RuleConfig): RuleConfig & { actions: Array<RuleAction & { secretSet?: boolean }> } {
  const { _rr: _ignored, ...rest } = cfg ?? ({ actions: [] } as RuleConfig);
  return { ...rest, actions: (rest.actions ?? []).map((a) => (a.kind === 'webhook' ? { ...a, secret: undefined, secretSet: !!a.secret } : a)) };
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
  if (trigger === 'issue.due_soon' && cfg.dueInDays !== undefined && !(Number.isInteger(cfg.dueInDays) && cfg.dueInDays >= 1 && cfg.dueInDays <= 30)) {
    throw new BadRequestError('"Due soon" must be 1–30 days', 'WORK_RULE_BAD');
  }
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
    await validateNewAction(projectId, a, members);
  }
  const { _rr: _ignored, ...clean } = cfg;
  return {
    ...clean,
    ...(trigger === 'issue.due_soon' ? { dueInDays: cfg.dueInDays ?? 2 } : {}),
    actions: cfg.actions.map((a) => ({
      ...a, text: a.text?.slice(0, 2000), title: a.title?.slice(0, 255),
      ...(a.kind === 'create_subtasks' ? { titles: expandTitles(a), template: a.template } : {}),
      ...(a.kind === 'post_chat' ? { channel: a.channel?.trim() || null } : {}),
    })),
  };
}

function expandTitles(a: RuleAction): string[] {
  const list = a.titles?.length ? a.titles : a.template ? SUBTASK_TEMPLATES[a.template] ?? [] : [];
  return list.map((t) => t.trim().slice(0, 255)).filter(Boolean).slice(0, 15);
}

/** CTW đợt 7c: kiểm bốn action mới. */
async function validateNewAction(projectId: number, a: RuleAction, members: Set<number>): Promise<void> {
  if (a.kind === 'post_chat') {
    if (!a.text?.trim()) throw new BadRequestError('Write the chat message', 'WORK_RULE_BAD');
    const name = a.channel?.trim().replace(/^#/, '');
    if (name) {
      const ch = await prisma.workChannel.findFirst({ where: { projectId, name, archivedAt: null }, select: { id: true } });
      if (!ch) throw new BadRequestError(`Channel #${name} does not exist in this project`, 'WORK_RULE_BAD');
    }
  }
  if (a.kind === 'webhook') {
    if (!a.url?.trim()) throw new BadRequestError('Enter the webhook URL', 'WORK_RULE_BAD');
    const { assertWebhookTarget } = await import('./webhooks.service.js');
    a.url = await assertWebhookTarget(a.url);
  }
  if (a.kind === 'assign_round_robin') {
    const pool = [...new Set(a.pool ?? [])];
    if (pool.length < 2) throw new BadRequestError('Pick at least two people to rotate between', 'WORK_RULE_BAD');
    for (const uid of pool) if (!members.has(uid)) throw new BadRequestError('Everyone in the rotation must be a member of this project', 'WORK_RULE_BAD');
    a.pool = pool;
  }
  if (a.kind === 'create_subtasks') {
    if (a.template && !SUBTASK_TEMPLATES[a.template] && !a.titles?.length) throw new BadRequestError(`Unknown sub-task template "${a.template}"`, 'WORK_RULE_BAD');
    if (!expandTitles(a).length) throw new BadRequestError('Add at least one sub-task title or pick a template', 'WORK_RULE_BAD');
    const sub = await prisma.workIssueType.findFirst({ where: { projectId, level: -1, archived: false }, select: { id: true } });
    if (!sub) throw new BadRequestError('This project has no sub-task type', 'WORK_RULE_BAD');
  }
}

export async function saveRule(userId: number, projectId: number, input: { id?: number; name: string; enabled?: boolean; trigger: Trigger; config: RuleConfig }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new BadRequestError('Rule name is required', 'WORK_NAME_REQUIRED');
  if (!TRIGGERS.includes(input.trigger)) throw new BadRequestError('Unknown trigger', 'WORK_RULE_BAD');
  const config = await validateConfig(projectId, input.trigger, input.config, userId);
  const old = input.id ? await prisma.workAutomationRule.findFirst({ where: { id: input.id, projectId } }) : null;
  if (input.id && !old) throw new NotFoundError('Rule not found');
  // CTW đợt 7c: bí mật webhook không bao giờ về client ⇒ để trống = giữ bí mật cũ của CÙNG URL, chưa có thì sinh mới.
  const oldCfg = (old?.config ?? null) as RuleConfig | null;
  for (const a of config.actions) {
    if (a.kind !== 'webhook') continue;
    if (!a.secret?.trim()) {
      const prev = oldCfg?.actions?.find((x) => x.kind === 'webhook' && x.url === a.url && x.secret);
      a.secret = prev?.secret ?? crypto.randomBytes(24).toString('base64url');
    }
  }
  if (oldCfg?._rr) config._rr = oldCfg._rr;
  const data = { name, trigger: input.trigger, config: config as unknown as Prisma.InputJsonValue, enabled: input.enabled ?? true };
  if (old) {
    const saved = await prisma.workAutomationRule.update({ where: { id: old.id }, data, select: RULE_SELECT });
    return { ...saved, config: publicConfig(saved.config as unknown as RuleConfig) };
  }
  const count = await prisma.workAutomationRule.count({ where: { projectId } });
  if (count >= 50) throw new BadRequestError('A project can have at most 50 rules', 'WORK_LIMIT');
  const created = await prisma.workAutomationRule.create({ data: { ...data, projectId, createdById: userId }, select: RULE_SELECT });
  return { ...created, config: publicConfig(created.config as unknown as RuleConfig) };
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

async function writeLog(ruleId: number, issueId: number | null, status: string, message: string, started: number) {
  await prisma.workAutomationLog.create({ data: { ruleId, issueId, status, message: message.slice(0, 2000), durationMs: Date.now() - started } });
}
const log = writeLog;

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

/** Ngữ cảnh mẫu chữ {{…}} cho post_chat / webhook / notify (CTW đợt 7c). */
export interface RuleEventCtx { trigger: string; data?: Record<string, string | number | null> }

/** Thay {{issue.key}} {{issue.title}} {{issue.url}} {{project.key}} {{rule.name}} {{event.<khoá>}} — chữ thường, không HTML. */
export function renderTemplate(text: string, v: { issue?: { key: string; title: string; url: string } | null; projectKey: string; ruleName: string; event?: Record<string, string | number | null> }): string {
  return text.replace(/\{\{\s*([a-z]+)\.([a-zA-Z0-9_]+)\s*\}\}/g, (m, scope: string, k: string) => {
    if (scope === 'issue' && v.issue && (k === 'key' || k === 'title' || k === 'url')) return v.issue[k];
    if (scope === 'project' && k === 'key') return v.projectKey;
    if (scope === 'rule' && k === 'name') return v.ruleName;
    if (scope === 'event' && v.event && k in v.event) return String(v.event[k] ?? '');
    return scope === 'issue' && !v.issue ? '' : m;
  }).slice(0, 2000);
}

async function runActions(rule: Rule, issueId: number | null, actor: WorkActor, ev: RuleEventCtx | null = null): Promise<string[]> {
  const cfg = rule.config as RuleConfig;
  const done: string[] = [];
  const proj = await prisma.workProject.findUnique({ where: { id: rule.projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  for (const a of cfg.actions) {
    const issue = issueId ? await prisma.workIssue.findFirst({
      where: { id: issueId, deletedAt: null },
      select: { id: true, number: true, title: true, projectId: true, reporterId: true, assigneeId: true, statusId: true, typeId: true, type: { select: { level: true } }, project: { select: { key: true, workspace: { select: { slug: true } } } } },
    }) : null;
    if (issueId && !issue) break;
    const vars = {
      issue: issue ? { key: `${issue.project.key}-${issue.number}`, title: issue.title, url: `/work/${issue.project.workspace.slug}/${issue.project.key}/issue/${issue.number}` } : null,
      projectKey: proj?.key ?? '', ruleName: rule.name, event: ev?.data,
    };
    // CTW đợt 7c: luật chạy theo tín hiệu KHÔNG gắn thẻ (vd baseline đổi) ⇒ bỏ qua hành động cần thẻ.
    if (!issue) {
      if (NEEDS_ISSUE.has(a.kind)) { done.push(`${a.kind} skipped (no issue)`); continue; }
      done.push(...(await runIssueFreeAction(rule, a, actor, vars, ev, proj)));
      continue;
    }
    switch (a.kind) {
      case 'transition':
        if (issue.statusId !== a.statusId) { await applyIssueChange(issue.id, { statusId: a.statusId! }, actor); done.push('moved'); }
        break;
      case 'assign': {
        const to = a.assignee === 'reporter' ? issue.reporterId : (a.assignee ?? null);
        if (to !== issue.assigneeId) { await applyIssueChange(issue.id, { assigneeId: to }, actor); done.push(to ? 'assigned' : 'unassigned'); }
        break;
      }
      case 'set_priority':
        await applyIssueChange(issue.id, { priority: a.priority! }, actor); done.push('priority set');
        break;
      case 'add_label': {
        const r = await prisma.workIssueLabel.createMany({ data: [{ issueId: issue.id, labelId: a.labelId! }], skipDuplicates: true });
        if (r.count) {
          const l = await prisma.workLabel.findUnique({ where: { id: a.labelId! }, select: { name: true } });
          await prisma.workHistory.create({ data: { issueId: issue.id, actorId: actor.userId, actorKind: 'AUTOMATION', field: 'labels', toValue: l?.name ?? null } });
          done.push('label added');
        }
        break;
      }
      case 'comment': {
        const text = renderTemplate(a.text!, vars);
        const bodyJson = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] };
        // Bình luận của luật: authorId null (hiện "Automation"), không ai bị tính là người viết.
        const c = await prisma.workComment.create({ data: { issueId: issue.id, authorId: null, bodyJson, bodyText: text } });
        emitWorkEvent({ type: 'comment.created', projectId: issue.projectId, issueId: issue.id, commentId: c.id, actor });
        done.push('commented');
        break;
      }
      case 'move_to_active_sprint': {
        if (issue.type.level !== 0) break;
        const sp = await prisma.workSprint.findFirst({ where: { projectId: issue.projectId, state: 'ACTIVE' }, select: { id: true } });
        if (sp) { await applyIssueChange(issue.id, { sprintId: sp.id }, actor); done.push('added to sprint'); }
        break;
      }
      case 'notify': {
        const receivers = new Set<number>();
        for (const t of a.to ?? []) {
          if (t === 'assignee' && issue.assigneeId) receivers.add(issue.assigneeId);
          else if (t === 'reporter' && issue.reporterId) receivers.add(issue.reporterId);
          else if (t === 'watchers') (await prisma.workWatcher.findMany({ where: { issueId: issue.id }, select: { userId: true } })).forEach((w) => receivers.add(w.userId));
          else if (typeof t === 'number') receivers.add(t);
        }
        // Chỉ gửi cho người còn vào được dự án.
        const sender = rule.createdById ?? issue.reporterId;
        for (const uid of receivers) {
          if (!sender || !(await loadProjectAccess(uid, issue.projectId))) continue;
          await notifyWork({
            receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: issue.id,
            payload: {
              issueKey: `${issue.project.key}-${issue.number}`, title: issue.title, message: renderTemplate(a.text!, vars).slice(0, 300), rule: rule.name,
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
        await createIssue({ projectId: issue.projectId, typeId: sub.id, title: a.title!, parentId: issue.id, reporterId: rule.createdById }, actor);
        done.push('sub-task created');
        break;
      }
      // ── CTW đợt 7c ──
      case 'create_subtasks': {
        if (issue.type.level !== 0) { done.push('sub-tasks skipped (not a standard issue)'); break; }
        const sub = await prisma.workIssueType.findFirst({ where: { projectId: issue.projectId, level: -1, archived: false }, select: { id: true } });
        if (!sub) throw new Error('This project has no sub-task type');
        // Chạy lại trên cùng thẻ không nhân đôi: bỏ tiêu đề đã có thẻ con trùng tên.
        const have = new Set((await prisma.workIssue.findMany({ where: { parentId: issue.id, deletedAt: null }, select: { title: true } })).map((x) => x.title.trim().toLowerCase()));
        let n = 0;
        for (const t of a.titles ?? []) {
          if (have.has(t.trim().toLowerCase())) continue;
          await createIssue({ projectId: issue.projectId, typeId: sub.id, title: renderTemplate(t, vars).slice(0, 255), parentId: issue.id, reporterId: rule.createdById }, actor);
          n += 1;
        }
        done.push(`${n} sub-task${n === 1 ? '' : 's'} created`);
        break;
      }
      case 'assign_round_robin': {
        const next = await nextInRotation(rule, a, issue.projectId);
        if (next === null) { done.push('nobody in the rotation can access the project'); break; }
        if (next !== issue.assigneeId) { await applyIssueChange(issue.id, { assigneeId: next }, actor); done.push(`assigned (rotation) to #${next}`); }
        break;
      }
      case 'post_chat':
      case 'webhook':
        done.push(...(await runIssueFreeAction(rule, a, actor, vars, ev, proj)));
        break;
    }
  }
  return done;
}

/** Người kế tiếp trong vòng (bỏ người đã mất quyền vào dự án). Con trỏ lưu trong config._rr theo vị trí action. */
async function nextInRotation(rule: Rule, a: RuleAction, projectId: number): Promise<number | null> {
  const pool = a.pool ?? [];
  if (!pool.length) return null;
  const fresh = await prisma.workAutomationRule.findUnique({ where: { id: rule.id }, select: { config: true } });
  const cfg = (fresh?.config ?? rule.config) as RuleConfig;
  const slot = String(cfg.actions.findIndex((x) => x.kind === 'assign_round_robin' && JSON.stringify(x.pool) === JSON.stringify(a.pool)));
  let idx = cfg._rr?.[slot] ?? 0;
  for (let tries = 0; tries < pool.length; tries += 1) {
    const uid = pool[idx % pool.length];
    idx += 1;
    const acc = await loadProjectAccess(uid, projectId);
    if (acc && (acc.role === 'ADMIN' || acc.role === 'MEMBER')) {
      await prisma.workAutomationRule.update({ where: { id: rule.id }, data: { config: { ...cfg, _rr: { ...(cfg._rr ?? {}), [slot]: idx % pool.length } } as unknown as Prisma.InputJsonValue } });
      return uid;
    }
  }
  return null;
}

/** Hành động không cần thẻ: gửi chat kênh, gọi webhook, báo người cụ thể. */
async function runIssueFreeAction(
  rule: Rule, a: RuleAction, actor: WorkActor,
  vars: Parameters<typeof renderTemplate>[1], ev: RuleEventCtx | null, proj: { key: string; workspace: { slug: string } } | null,
): Promise<string[]> {
  switch (a.kind) {
    case 'post_chat': {
      if (!rule.createdById) return ['chat skipped (rule has no owner)'];
      const { postAutomationNotice } = await import('./chat.service.js');
      await postAutomationNotice(rule.projectId, a.channel ?? null, rule.createdById, renderTemplate(a.text ?? '', vars), {
        type: 'automation', rule: rule.name, ...(vars.issue ? { key: vars.issue.key, url: vars.issue.url } : {}),
      });
      return [`posted to #${a.channel || 'general'}`];
    }
    case 'webhook': {
      const { postSignedWebhook } = await import('./webhooks.service.js');
      const text = renderTemplate(a.text?.trim() || (vars.issue ? `[${vars.projectKey}] ${rule.name}: ${vars.issue.key} ${vars.issue.title}` : `[${vars.projectKey}] ${rule.name}`), vars);
      const payload = {
        // `text` (Slack) + `content` (Discord) ⇒ dán thẳng URL incoming webhook của Slack/Discord cũng chạy.
        text, content: text,
        event: ev?.trigger ?? rule.trigger, rule: { id: rule.id, name: rule.name },
        project: { key: vars.projectKey, url: proj ? `/work/${proj.workspace.slug}/${proj.key}` : null },
        issue: vars.issue, data: ev?.data ?? null, sentAt: new Date().toISOString(),
      };
      const r = await postSignedWebhook(a.url ?? '', a.secret ?? '', `automation.${ev?.trigger ?? rule.trigger}`, `rule-${rule.id}-${Date.now()}`, payload);
      if (!r.ok) throw new Error(`Webhook failed: ${r.error ?? `HTTP ${r.status}`}`);
      return [`webhook ${r.status ?? 'ok'}`];
    }
    case 'notify': {
      const people = (a.to ?? []).filter((t): t is number => typeof t === 'number');
      const sender = rule.createdById;
      let n = 0;
      for (const uid of people) {
        if (!sender || !(await loadProjectAccess(uid, rule.projectId))) continue;
        await notifyWork({
          receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: rule.projectId,
          payload: { issueKey: vars.projectKey, title: rule.name, message: renderTemplate(a.text ?? '', vars).slice(0, 300), rule: rule.name, url: proj ? `/work/${proj.workspace.slug}/${proj.key}` : '/work' },
        });
        n += 1;
      }
      return [`notified ${n}`];
    }
    default:
      return [];
  }
}

/** Chạy một luật trên một thẻ: kiểm vòng lặp, điều kiện, rồi hành động. Không bao giờ ném. */
export async function runRuleOnIssue(rule: Rule, issueId: number | null, cause: WorkActor | null, opts: { test?: boolean; event?: RuleEventCtx } = {}): Promise<string> {
  const started = Date.now();
  const chain = cause?.ruleChain ?? [];
  // CTW-7: lần chạy thật bấm từ nút "Test" ghi rõ trong nhật ký.
  const log = (ruleId: number, iid: number | null, status: string, message: string, t: number) => writeLog(ruleId, iid, status, opts.test ? `Test run — ${message}` : message, t);
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
      // CTW đợt 7c: tín hiệu không gắn thẻ ⇒ điều kiện JQL (luôn nói về một thẻ) không thể đúng.
      if (issueId === null) {
        await log(rule.id, null, 'NO_MATCH', `Condition not met (no issue for this event): ${c.jql}`, started);
        return 'NO_MATCH';
      }
      if (!(await issueMatches(rule.projectId, issueId, c.jql, rule.createdById))) {
        await log(rule.id, issueId, 'NO_MATCH', `Condition not met: ${c.jql}`, started);
        return 'NO_MATCH';
      }
    }
    const actor: WorkActor = { kind: 'AUTOMATION', userId: rule.createdById, ruleChain: [...chain, rule.id] };
    const done = await runActions(rule, issueId, actor, opts.event ?? null);
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
    where: { projectId: e.projectId, enabled: true, trigger: { notIn: ['scheduled.daily', 'issue.due_soon', ...SIGNALS] } },
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
  let runs = await runDueSoonRules();
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

export interface PlannedAction {
  kind: ActionKind;
  /** Câu mô tả việc SẼ làm (tiếng Anh như mọi chữ giao diện CT Work). */
  summary: string;
  /** false = thẻ đã ở đúng trạng thái đó / không áp dụng được ⇒ chạy thật cũng bỏ qua. */
  willChange: boolean;
}

/**
 * CTW-7: XEM TRƯỚC hành động của luật trên một thẻ — KHÔNG ghi gì (không bình luận, không thông báo,
 * không đổi thẻ). Tính trên trạng thái HIỆN TẠI của thẻ; khi chạy thật các hành động chạy lần lượt nên
 * hành động sau có thể thấy kết quả của hành động trước.
 */
export async function previewActions(rule: Rule, issueId: number): Promise<PlannedAction[]> {
  const cfg = rule.config as RuleConfig;
  const issue = await prisma.workIssue.findFirst({
    where: { id: issueId, deletedAt: null },
    select: { id: true, projectId: true, reporterId: true, assigneeId: true, statusId: true, priority: true, type: { select: { level: true } } },
  });
  if (!issue) return [];
  const userName = async (uid: number | null) => {
    if (!uid) return 'nobody';
    const u = await prisma.user.findUnique({ where: { id: uid }, select: { username: true } });
    return u ? `@${u.username}` : `user #${uid}`;
  };
  const out: PlannedAction[] = [];
  for (const a of cfg.actions) {
    switch (a.kind) {
      case 'transition': {
        const st = await prisma.workStatus.findUnique({ where: { id: a.statusId! }, select: { name: true } });
        const same = issue.statusId === a.statusId;
        out.push({ kind: a.kind, summary: same ? `Already in "${st?.name ?? 'unknown status'}" — no transition` : `Move to "${st?.name ?? 'unknown status'}"`, willChange: !same });
        break;
      }
      case 'assign': {
        const to = a.assignee === 'reporter' ? issue.reporterId : (a.assignee ?? null);
        const same = to === issue.assigneeId;
        out.push({ kind: a.kind, summary: same ? `Already assigned to ${await userName(to)}` : to ? `Assign to ${await userName(to)}` : 'Unassign', willChange: !same });
        break;
      }
      case 'set_priority':
        out.push({ kind: a.kind, summary: `Set priority to ${a.priority}`, willChange: issue.priority !== a.priority });
        break;
      case 'add_label': {
        const l = await prisma.workLabel.findUnique({ where: { id: a.labelId! }, select: { name: true } });
        const has = (await prisma.workIssueLabel.count({ where: { issueId, labelId: a.labelId! } })) > 0;
        out.push({ kind: a.kind, summary: has ? `Already has label "${l?.name ?? '?'}"` : `Add label "${l?.name ?? '?'}"`, willChange: !has });
        break;
      }
      case 'comment':
        out.push({ kind: a.kind, summary: `Post an automation comment: "${(a.text ?? '').slice(0, 200)}"`, willChange: true });
        break;
      case 'move_to_active_sprint': {
        if (issue.type.level !== 0) { out.push({ kind: a.kind, summary: 'Skipped — only standard issues go into sprints', willChange: false }); break; }
        const sp = await prisma.workSprint.findFirst({ where: { projectId: issue.projectId, state: 'ACTIVE' }, select: { name: true } });
        out.push({ kind: a.kind, summary: sp ? `Add to the active sprint "${sp.name}"` : 'Skipped — no active sprint', willChange: !!sp });
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
        const names: string[] = [];
        for (const uid of receivers) if (await loadProjectAccess(uid, issue.projectId)) names.push(await userName(uid));
        out.push({ kind: a.kind, summary: names.length ? `Notify ${names.join(', ')}: "${(a.text ?? '').slice(0, 200)}"` : 'Notify — nobody to notify', willChange: names.length > 0 });
        break;
      }
      case 'create_subtask': {
        if (issue.type.level !== 0) { out.push({ kind: a.kind, summary: 'Skipped — sub-tasks can only be created under a standard issue', willChange: false }); break; }
        out.push({ kind: a.kind, summary: `Create sub-task "${(a.title ?? '').slice(0, 200)}"`, willChange: true });
        break;
      }
      // ── CTW đợt 7c ──
      case 'create_subtasks': {
        if (issue.type.level !== 0) { out.push({ kind: a.kind, summary: 'Skipped — sub-tasks can only be created under a standard issue', willChange: false }); break; }
        const have = new Set((await prisma.workIssue.findMany({ where: { parentId: issueId, deletedAt: null }, select: { title: true } })).map((x) => x.title.trim().toLowerCase()));
        const todo = (a.titles ?? []).filter((t) => !have.has(t.trim().toLowerCase()));
        out.push({ kind: a.kind, summary: todo.length ? `Create ${todo.length} sub-task(s): ${todo.map((t) => `"${t}"`).join(', ').slice(0, 300)}` : 'All template sub-tasks already exist', willChange: todo.length > 0 });
        break;
      }
      case 'assign_round_robin': {
        const names = [];
        for (const uid of a.pool ?? []) names.push(await userName(uid));
        out.push({ kind: a.kind, summary: `Assign to the next person in the rotation (${names.join(' → ')})`, willChange: true });
        break;
      }
      case 'post_chat':
        out.push({ kind: a.kind, summary: `Post in #${a.channel || 'general'}: "${(a.text ?? '').slice(0, 200)}"`, willChange: true });
        break;
      case 'webhook':
        out.push({ kind: a.kind, summary: `POST a signed JSON payload to ${(() => { try { return new URL(a.url ?? '').host; } catch { return 'the webhook URL'; } })()}`, willChange: true });
        break;
    }
  }
  return out;
}

/**
 * Chạy thử một luật trên một thẻ (nút "Test rule" trong UI).
 * CTW-7: MẶC ĐỊNH là CHẠY THỬ (dry-run) — kiểm điều kiện JQL rồi trả danh sách hành động SẼ làm, không
 * bình luận/không gửi thông báo/không đổi thẻ. Chỉ `execute: true` mới chạy thật (nhật ký ghi "Test run").
 */
export async function testRule(userId: number, projectId: number, ruleId: number, number: number, opts: { execute?: boolean } = {}) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workAutomationRule.findFirst({ where: { id: ruleId, projectId }, select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true } });
  if (!r) throw new NotFoundError('Rule not found');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  if (opts.execute) {
    const status = await runRuleOnIssue(r, issue.id, null, { test: true });
    const last = await prisma.workAutomationLog.findFirst({ where: { ruleId: r.id }, orderBy: { id: 'desc' }, select: { status: true, message: true } });
    return { dryRun: false, status, message: last?.message ?? '', actions: [] as PlannedAction[] };
  }
  const started = Date.now();
  const cfg = r.config as unknown as RuleConfig;
  const conditions: Array<{ jql: string; matched: boolean }> = [];
  try {
    for (const c of cfg.conditions ?? []) conditions.push({ jql: c.jql, matched: await issueMatches(projectId, issue.id, c.jql, r.createdById) });
  } catch (err) {
    const message = `Dry run: ${err instanceof Error ? err.message : String(err)}`;
    await log(r.id, issue.id, 'DRY_RUN', message, started);
    return { dryRun: true, status: 'FAILED' as const, message, conditions, actions: [] as PlannedAction[] };
  }
  const failed = conditions.find((c) => !c.matched);
  const actions = failed ? [] : await previewActions(r, issue.id);
  const message = failed
    ? `Dry run — condition not met: ${failed.jql}. Nothing would run.`
    : `Dry run — nothing was changed. Would: ${actions.filter((a) => a.willChange).map((a) => a.summary).join('; ') || 'nothing (issue already matches every action)'}`;
  // Nhật ký vẫn ghi để thấy ai đã thử — trạng thái DRY_RUN, không đếm vào runCount.
  await log(r.id, issue.id, 'DRY_RUN', message, started);
  return { dryRun: true, status: failed ? ('NO_MATCH' as const) : ('DRY_RUN' as const), message, conditions, actions };
}

// ─── CTW đợt 7c: sắp tới hạn + tín hiệu ngoài thẻ ───────────────

const DAY = 86_400_000;
const startOfUtcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

/**
 * "Due soon": thẻ CHƯA xong có hạn trong [hôm nay, hôm nay + N ngày]. Mỗi HẠN chạy ĐÚNG MỘT LẦN — bỏ qua nếu luật đã có
 * nhật ký trên thẻ đó kể từ lúc thẻ bước vào cửa sổ (hạn − N − 1 ngày); dời hạn ra xa ⇒ cửa sổ mới ⇒ chạy lại.
 */
export async function runDueSoonRules(now = new Date()): Promise<number> {
  const rules = await prisma.workAutomationRule.findMany({
    where: { enabled: true, trigger: 'issue.due_soon', project: { deletedAt: null, archivedAt: null } },
    select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true },
  });
  let runs = 0;
  const today = startOfUtcDay(now);
  for (const r of rules) {
    const n = Math.min(Math.max((r.config as unknown as RuleConfig).dueInDays ?? 2, 1), 30);
    try {
      const issues = await prisma.workIssue.findMany({
        where: { projectId: r.projectId, deletedAt: null, resolvedAt: null, status: { category: { not: 'DONE' } }, dueDate: { gte: today, lt: new Date(today.getTime() + (n + 1) * DAY) } },
        select: { id: true, dueDate: true }, take: SCHEDULED_BATCH, orderBy: { dueDate: 'asc' },
      });
      for (const i of issues) {
        const windowStart = new Date(startOfUtcDay(i.dueDate!).getTime() - (n + 1) * DAY);
        const fired = await prisma.workAutomationLog.count({ where: { ruleId: r.id, issueId: i.id, createdAt: { gte: windowStart }, status: { not: 'DRY_RUN' } } });
        if (fired) continue;
        await runRuleOnIssue(r, i.id, null, { event: { trigger: 'issue.due_soon', data: { due: i.dueDate!.toISOString().slice(0, 10), days: n } } });
        runs += 1;
      }
    } catch (err) {
      await log(r.id, null, 'FAILED', err instanceof Error ? err.message : String(err), Date.now()).catch(() => undefined);
    }
  }
  return runs;
}

/** Tín hiệu (test đỏ, PR merge, SLA vỡ, baseline đổi) ⇒ chạy các luật đúng trigger của dự án. */
export async function handleSignal(sig: AutomationSignal): Promise<number> {
  const rules = await prisma.workAutomationRule.findMany({
    where: { projectId: sig.projectId, enabled: true, trigger: sig.signal, project: { deletedAt: null } },
    select: { id: true, projectId: true, name: true, trigger: true, config: true, createdById: true },
  });
  let runs = 0;
  const cause: WorkActor | null = sig.actorUserId ? { kind: 'USER', userId: sig.actorUserId } : null;
  for (const r of rules) {
    const targets = sig.issueIds.length ? [...new Set(sig.issueIds)].slice(0, 50) : [null];
    for (const iid of targets) {
      await runRuleOnIssue(r, iid, cause, { event: { trigger: sig.signal, data: sig.data } });
      runs += 1;
    }
  }
  return runs;
}

let registered = false;
export function registerAutomation(): void {
  if (registered) return;
  registered = true;
  onWorkEvent((e) => handleEvent(e).catch((err) => logger.error('[work] automation lỗi', { err })));
  onAutomationSignal((sig) => handleSignal(sig).then(() => undefined).catch((err) => logger.error('[work] automation (tín hiệu) lỗi', { signal: sig.signal, err })));
}
