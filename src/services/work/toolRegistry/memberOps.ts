/**
 * Registry lệnh — ĐỢT 8B (19/10/2026): THAO TÁC THÀNH VIÊN CÒN THIẾU. AI (CuongMini qua MCP, AI khác, Ask AI trên web)
 * làm được mọi việc hằng ngày của thành viên CT Work thay họ, ĐÚNG quyền của người đó:
 *
 *   Thẻ:        checklist_list / checklist_toggle (tích "Tự kiểm", tiêu chí chấp nhận — task list trong mô tả),
 *               issue_assign (nhận / thả / giao cho người khác — theo quyền như web; agent chỉ nhận/thả thẻ của mình), issue_move_sprint (nếu quyền cho phép).
 *   Giờ:        worklog_list, worklog_update (sửa phút/ghi chú/activity của giờ CỦA MÌNH), timesheet_submit. KHÔNG có lệnh xoá
 *               (registry.test: không lệnh nào mang tên phá huỷ) — xoá giờ làm trên web.
 *   Duyệt:      approval_list, approval_request (GỬI duyệt thẻ/trang Docs — không bao giờ tự duyệt).
 *   Docs:       docs_comment (bình luận trang; sửa mục đã có docs_update_section).
 *   Form:       form_list, form_submit (điền form nội bộ/công khai của dự án — như mở link form).
 *   Họp:        meeting_rsvp (thêm action đã có meeting_add_actions).
 *   Agile:      agile_rooms (phòng poker + retro), poker_vote, retro_card_add, retro_vote.
 *   Lớp học:    class_work (lớp/bài tập/bài nộp của tôi), class_submit (lưu nháp, đính kèm tệp, nhận xét, nộp), class_unsubmit.
 *   (Đính kèm vào BÌNH LUẬN / làm bằng chứng test run: tham số `for` / `testRun` mới của attach_file — src/mcp/tools/write.ts.)
 *
 * Luật (như mọi lệnh registry): lệnh ghi `write: true` (client hiện thẻ duyệt xem trước; MCP `readOnlyHint: false`),
 * `requireWrite` + `projectFor` với TUYẾN REST TƯƠNG ĐƯƠNG (phạm vi token, AGENT_DENIED_ROUTES, cổng khách), rồi gọi
 * THẲNG service sẵn có — không có đường ghi mới nào bỏ qua `can()` / `applyIssueChange` / chốt agent của service.
 * Tuyến ngoài dự án (lớp học, form theo token) ⇒ agent bị chặn như `agentTopRouteAllowed`.
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { issueIdOf, issueNumber, projectFor, requireWrite, touchLease, type McpCtx, type ProjectHit } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import * as approvals from '../approvals.service.js';
import * as classroom from '../classroom.service.js';
import * as classwork from '../classwork.service.js';
import { APPROVAL_STATUSES } from '../constants.js';
import { markdownToTiptap, type PmNode } from '../docMarkdown.js';
import * as finance from '../finance.service.js';
import * as forms from '../forms.service.js';
import * as issues from '../issues.service.js';
import * as meetingRec from '../meetingRec.service.js';
import { RSVPS } from '../meetingRules.js';
import * as pages from '../pages.service.js';
import { agentForbidden, agentTopRouteAllowed } from '../permissions.js';
import * as planning from '../planning.service.js';
import * as poker from '../poker.service.js';
import * as retro from '../retro.service.js';
import { listSprints } from '../sprints.service.js';
import * as timeActivity from '../timeActivity.service.js';
import { TL_ACTIVITIES } from '../fptReports.js';
import { defineTool, type ToolDef } from './types.js';
import { assigneeIdOf, assignIssue } from './personOps.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const INLINE_MAX = 6 * 1024 * 1024;
const fileArg = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100).optional(),
  base64: z.string().min(4).max(Math.ceil((INLINE_MAX * 4) / 3) + 8).describe('File bytes, base64 (≤ 6 MB)'),
});

function decodeB64(b64: string): Buffer {
  const clean = b64.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) throw new BadRequestError('base64 is not valid base64', 'VALIDATION_ERROR');
  const buf = Buffer.from(clean, 'base64');
  if (!buf.length) throw new BadRequestError('The file is empty', 'VALIDATION_ERROR');
  if (buf.length > INLINE_MAX) throw new BadRequestError('Files over 6 MB cannot be sent inline', 'WORK_FILE_TOO_LARGE');
  return buf;
}

/** Thẻ + chốt tầng tuyến (như issueCtx của write.ts). */
async function issueHit(ctx: McpCtx, project: string, issue: unknown, routes: (n: number) => Array<[string, string]>, write = true): Promise<{ p: ProjectHit; n: number; key: string }> {
  if (write) requireWrite(ctx);
  const head = String(project ?? '').trim();
  const n = issueNumber((head.includes('/') ? head.split('/')[1] : head).toUpperCase(), issue);
  const p = await projectFor(ctx, project, routes(n));
  return { p, n, key: `${p.key}-${n}` };
}

/** Tuyến ngoài /projects/:pid: token agent theo DANH SÁCH TRẮNG `agentTopRouteAllowed` (mặc định cấm). */
async function topRoute(ctx: McpCtx, method: string, path: string, verb: string): Promise<void> {
  if (ctx.agent && !agentTopRouteAllowed(method, path, !!ctx.agent.projectIds)) throw await agentForbidden(ctx.agent.userId, verb);
}

/** Người trong dự án theo username (để gửi duyệt) — id thật, không đoán. */
async function memberIdsByUsername(projectId: number, usernames: string[]): Promise<number[]> {
  const names = [...new Set(usernames.map((u) => u.trim().replace(/^@/, '').toLowerCase()).filter(Boolean))];
  const rows = await prisma.user.findMany({ where: { username: { in: names, mode: 'insensitive' } }, select: { id: true, username: true } });
  const missing = names.filter((n) => !rows.some((r) => r.username.toLowerCase() === n));
  if (missing.length) throw new AppError(`Unknown user(s): ${missing.join(', ')}`, 400, 'WORK_BAD_USER');
  const ids = rows.map((r) => r.id);
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  const inWs = await prisma.workMember.findMany({ where: { workspaceId: p?.workspaceId ?? -1, userId: { in: ids } }, select: { userId: true } });
  const out = rows.filter((r) => inWs.some((m) => m.userId === r.id));
  if (out.length !== rows.length) throw new AppError(`Not in this workspace: ${rows.filter((r) => !out.includes(r)).map((r) => r.username).join(', ')}`, 400, 'WORK_BAD_USER');
  return out.map((r) => r.id);
}

// ─── Checklist "Tự kiểm" / tiêu chí chấp nhận ────────────────────

export interface ChecklistItem { n: number; checked: boolean; text: string; section: string | null }

const textOf = (node: PmNode | undefined): string => {
  if (!node) return '';
  if (node.type === 'text') return String((node as { text?: string }).text ?? '');
  if (node.type === 'mention') return `@${String((node.attrs as { label?: string } | undefined)?.label ?? '')}`;
  return (node.content ?? []).map((c) => textOf(c)).join(node.type === 'paragraph' ? '' : ' ').trim();
};

/** Mọi taskItem trong tài liệu theo thứ tự đọc (kèm tiêu đề mục gần nhất phía trên). Hàm THUẦN. */
export function checklistOf(doc: unknown): ChecklistItem[] {
  const out: ChecklistItem[] = [];
  let section: string | null = null;
  const walk = (node: PmNode) => {
    if (node.type === 'heading') { section = textOf(node).slice(0, 120) || null; return; }
    if (node.type === 'taskItem') {
      const first = (node.content ?? []).find((c) => c.type === 'paragraph') ?? node.content?.[0];
      out.push({ n: out.length + 1, checked: (node.attrs as { checked?: boolean } | undefined)?.checked === true, text: textOf(first).slice(0, 300), section });
      for (const c of node.content ?? []) if (c.type !== 'paragraph') walk(c);
      return;
    }
    for (const c of node.content ?? []) walk(c);
  };
  if (doc && typeof doc === 'object') walk(doc as PmNode);
  return out;
}

/** Bản sao tài liệu với các mục `targets` (số thứ tự 1-based) đặt `checked`. Hàm THUẦN. */
export function setChecklist(doc: unknown, targets: Set<number>, checked: boolean): unknown {
  let i = 0;
  const clone = (node: PmNode): PmNode => {
    if (node.type === 'taskItem') {
      i += 1;
      const mine = targets.has(i);
      const content = (node.content ?? []).map((c) => (c.type === 'paragraph' ? c : clone(c)));
      return { ...node, attrs: { ...(node.attrs ?? {}), ...(mine ? { checked } : {}) }, content };
    }
    return node.content ? { ...node, content: node.content.map(clone) } : { ...node };
  };
  return clone(doc as PmNode);
}

/** Mục theo số (1-based) hoặc theo chữ (không phân biệt hoa thường, phải khớp DUY NHẤT một mục). Hàm THUẦN. */
export function pickItems(items: ChecklistItem[], refs: Array<number | string>): number[] {
  const out = new Set<number>();
  for (const r of refs) {
    if (typeof r === 'number') {
      if (!items.some((x) => x.n === r)) throw new BadRequestError(`Checklist item ${r} does not exist (there are ${items.length})`, 'WORK_BAD_CHECKLIST_ITEM');
      out.add(r);
      continue;
    }
    const q = r.trim().toLowerCase();
    const exact = items.filter((x) => x.text.trim().toLowerCase() === q);
    const hits = exact.length ? exact : items.filter((x) => x.text.toLowerCase().includes(q));
    if (hits.length !== 1) {
      throw new BadRequestError(hits.length ? `"${r}" matches ${hits.length} items — use the item number` : `No checklist item matches "${r}"`, 'WORK_BAD_CHECKLIST_ITEM');
    }
    out.add(hits[0].n);
  }
  return [...out];
}

async function issueDoc(projectId: number, n: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: n, deletedAt: null }, select: { descriptionJson: true, version: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

const checklistList = defineTool({
  name: 'checklist_list', title: 'List checklist items', group: 'issues',
  description: 'Numbered checklist items of an issue — the "- [ ]" task lists in its description ("Tự kiểm" self-check, acceptance criteria), with done state and section heading. Use the numbers with checklist_toggle.',
  write: false,
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['GET', `/issues/${n}`]], false);
    await issues.getIssueDetail(ctx.userId, p.id, n); // quyền đọc thẻ (khách cổng chỉ thẻ đã chia sẻ…)
    const items = checklistOf((await issueDoc(p.id, n)).descriptionJson);
    return `${key}: ${items.filter((x) => x.checked).length}/${items.length} checked\n${untrusted(`checklist of ${key}`, json(items))}`;
  },
});

const checklistToggle = defineTool({
  name: 'checklist_toggle', title: 'Tick checklist items', group: 'issues',
  description: 'Ticks (checked=true, default) or unticks checklist items in an issue description — self-check ("Tự kiểm") and acceptance criteria. Pick items by number from checklist_list or by their exact text. Saves like an edit of the description (your permissions; history + version check).',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    items: z.array(z.union([z.number().int().positive(), z.string().min(1).max(200)])).min(1).max(50).describe('Item numbers (1-based) or item texts'),
    checked: z.boolean().optional().describe('true = tick (default), false = untick'),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['PATCH', `/issues/${n}`]]);
    const cur = await issueDoc(p.id, n);
    const items = checklistOf(cur.descriptionJson);
    if (!items.length) throw new BadRequestError(`${key} has no checklist in its description`, 'WORK_NO_CHECKLIST');
    const picked = pickItems(items, a.items);
    const checked = a.checked !== false;
    const doc = setChecklist(cur.descriptionJson, new Set(picked), checked);
    await issues.updateIssueAs(ctx.userId, p.id, n, { descriptionJson: doc as never }, cur.version);
    await touchLease(ctx, await issueIdOf(p.id, n));
    const after = checklistOf(doc);
    return { issue: key, changed: picked.map((i) => ({ n: i, text: after[i - 1]?.text, checked })), done: after.filter((x) => x.checked).length, total: after.length };
  },
});

// ─── Nhận / thả thẻ · chuyển sprint ──────────────────────────────

const issueAssign = defineTool({
  name: 'issue_assign', title: 'Assign an issue', group: 'issues',
  description: 'Assigns an issue: to="me" (take it), "nobody" (unassign) or a username/email of a project member — whoever your role allows, like the web (editors and the issue\'s team lead can assign anyone; AI agent tokens only take/drop their own).',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, to: z.string().min(1).max(254).describe('"me" | "nobody" | username or email') }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['PATCH', `/issues/${n}`]]);
    const cur = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { assigneeId: true } });
    if (!cur) throw new NotFoundError('Issue not found');
    const to = await assigneeIdOf(ctx, p, a.to);
    // Agent: chỉ tự nhận / thả thẻ CỦA MÌNH (service chặn lần nữa) — giữ câu báo cũ cho trường hợp thả thẻ người khác.
    if (ctx.agent && to === null && cur.assigneeId !== ctx.userId) throw new AppError(`${key} is not assigned to you — only its assignee or the lead can drop it`, 403, 'WORK_NOT_YOURS');
    if (cur.assigneeId === to) return { issue: key, unchanged: true };
    await assignIssue(ctx, p, n, to);
    await touchLease(ctx, await issueIdOf(p.id, n));
    const who = to === null ? 'nobody' : to === ctx.userId ? 'me' : (await prisma.user.findUnique({ where: { id: to }, select: { username: true } }))?.username ?? a.to;
    return { issue: key, assignee: who };
  },
});

const issueMoveSprint = defineTool({
  name: 'issue_move_sprint', title: 'Move issues to a sprint', group: 'planning',
  description: 'Moves issues to a sprint: "active", "next" (first future sprint), "backlog", a sprint name or id. Only if your role may edit the issues (AI agents never plan sprints).',
  write: true, surfaces: { builtin: false },
  input: z.object({
    project: projectArg,
    issues: z.array(issueArg).min(1).max(30),
    sprint: z.union([z.string().min(1).max(120), z.number().int().positive()]).describe('"active" | "next" | "backlog" | sprint name | sprint id'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const head = String(a.project).trim();
    const keyGuess = (head.includes('/') ? head.split('/')[1] : head).toUpperCase();
    const nums = a.issues.map((i) => issueNumber(keyGuess, i));
    const p = await projectFor(ctx, a.project, nums.map((n) => ['PATCH', `/issues/${n}`] as [string, string]));
    const sprints = await listSprints(ctx.userId, p.id);
    let sprintId: number | null;
    const s = typeof a.sprint === 'string' ? a.sprint.trim().toLowerCase() : a.sprint;
    if (s === 'backlog') sprintId = null;
    else if (s === 'active') sprintId = sprints.find((x) => x.state === 'ACTIVE')?.id ?? -1;
    else if (s === 'next') sprintId = sprints.find((x) => x.state === 'PLANNED')?.id ?? -1; // 19/10: trạng thái là PLANNED (FUTURE không tồn tại ⇒ "next" chưa từng khớp)
    else if (typeof s === 'number') sprintId = sprints.find((x) => x.id === s)?.id ?? -1;
    else sprintId = sprints.find((x) => x.name.toLowerCase() === s)?.id ?? -1;
    if (sprintId === -1) throw new AppError(`Sprint "${String(a.sprint)}" not found (open sprints: ${sprints.map((x) => `${x.name} [${x.state}]`).join(', ') || 'none'})`, 400, 'WORK_BAD_SPRINT');
    const moved: string[] = [];
    const failed: Array<{ issue: string; error: string }> = [];
    for (const n of nums) {
      try {
        const cur = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { version: true } });
        if (!cur) throw new NotFoundError('Issue not found');
        await issues.updateIssueAs(ctx.userId, p.id, n, { sprintId }, cur.version);
        moved.push(`${p.key}-${n}`);
      } catch (err) {
        if (nums.length === 1) throw err;
        failed.push({ issue: `${p.key}-${n}`, error: (err as Error).message.slice(0, 200) });
      }
    }
    return { sprint: sprintId === null ? 'backlog' : sprints.find((x) => x.id === sprintId)?.name, moved, ...(failed.length ? { failed } : {}) };
  },
});

// ─── Giờ ─────────────────────────────────────────────────────────

const worklogList = defineTool({
  name: 'worklog_list', title: 'List work logs of an issue', group: 'planning',
  description: 'Work logs of an issue (id, who, minutes, start, note, activity) — the ids are what worklog_update takes.',
  write: false,
  input: z.object({ project: projectArg, issue: issueArg }),
  run: async (ctx, a) => {
    const { p, key } = await issueHit(ctx, a.project, a.issue, (n) => [['GET', `/issues/${n}/worklogs`]], false);
    const rows = await planning.listWorklogs(ctx.userId, p.id, issueNumber(p.key, a.issue));
    const list = (rows as Array<Record<string, unknown> & { user?: { username?: string } | null }>).map((w) => ({
      id: w.id, user: w.user?.username ?? null, minutes: w.minutes, startedAt: w.startedAt, note: w.note ?? null, activity: w.activity ?? null, workProduct: w.workProduct ?? null, source: w.source ?? null,
    }));
    return `${key}: ${list.length} work log(s)\n${untrusted(`work logs of ${key}`, json(list))}`;
  },
});

const worklogUpdate = defineTool({
  name: 'worklog_update', title: 'Fix a work log', group: 'planning',
  description: 'Corrects one of YOUR work logs: minutes / note / start (re-logged with the same day — the issue totals follow) and/or activity / work product. Weeks already submitted in a timesheet are locked.',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg, worklog: z.number().int().positive().describe('Work log id from worklog_list'),
    minutes: z.number().int().min(1).max(1440).optional(),
    note: z.string().max(1000).nullable().optional(),
    startedAt: z.string().max(40).optional().describe('ISO date-time'),
    activity: z.enum(TL_ACTIVITIES).nullable().optional(),
    workProduct: z.string().max(120).nullable().optional(),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueHit(ctx, a.project, a.issue, (n) => [['PATCH', `/issues/${n}/worklogs/${a.worklog}`], ['DELETE', `/issues/${n}/worklogs/${a.worklog}`], ['POST', `/issues/${n}/worklogs`]]);
    const log = await prisma.workWorklog.findFirst({ where: { id: a.worklog, issue: { projectId: p.id, number: n, deletedAt: null } }, select: { id: true, userId: true, minutes: true, startedAt: true, note: true, activity: true, workProduct: true } });
    if (!log) throw new NotFoundError('Work log not found');
    const reLog = (a.minutes !== undefined && a.minutes !== log.minutes) || (a.note !== undefined && (a.note ?? null) !== log.note) || a.startedAt !== undefined;
    const meta = a.activity !== undefined || a.workProduct !== undefined;
    if (!reLog && !meta) throw new BadRequestError('Nothing to change — pass minutes, note, startedAt, activity or workProduct', 'VALIDATION_ERROR');
    if (!reLog) {
      const row = await timeActivity.setWorklogMeta(ctx.userId, p.id, n, log.id, { activity: a.activity, workProduct: a.workProduct });
      return { issue: key, worklog: row };
    }
    // Phút/ghi chú/giờ bắt đầu: không có tuyến sửa ⇒ ghi lại (thêm mới rồi xoá cũ) — CHỈ giờ của chính mình, để giờ mới
    // không bị gán sang người sửa. Thêm trước xoá sau: lỗi giữa chừng không làm mất giờ.
    if (log.userId !== ctx.userId) throw new AppError('You can only re-log your own work logs (a lead can delete and log again)', 403, 'WORK_NOT_YOURS');
    const added = await planning.addWorklog(ctx.userId, p.id, n, {
      minutes: a.minutes ?? log.minutes, startedAt: a.startedAt ?? log.startedAt.toISOString(), note: a.note !== undefined ? a.note : log.note,
      remaining: 'keep', activity: a.activity !== undefined ? a.activity : log.activity, workProduct: a.workProduct !== undefined ? a.workProduct : log.workProduct,
    });
    try {
      await planning.deleteWorklog(ctx.userId, p.id, n, log.id);
    } catch (err) {
      await planning.deleteWorklog(ctx.userId, p.id, n, added.id).catch(() => undefined);
      throw err;
    }
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, replaced: log.id, worklog: { id: added.id, minutes: added.minutes, startedAt: added.startedAt, note: added.note } };
  },
});

const timesheetSubmit = defineTool({
  name: 'timesheet_submit', title: 'Submit my weekly timesheet', group: 'planning',
  description: 'Submits YOUR timesheet for one week (Monday date) for approval in a project with the Finance module. Logged time of that week is then locked. People only.',
  write: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, weekStart: ymd.describe('Monday of the week, YYYY-MM-DD'), note: z.string().max(1000).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/finance/timesheets/submit']]);
    const r = await finance.submitWeek(ctx.userId, p.id, { weekStart: a.weekStart, note: a.note ?? null });
    return { submitted: true, timesheet: r };
  },
});

// ─── Duyệt ───────────────────────────────────────────────────────

const approvalList = defineTool({
  name: 'approval_list', title: 'List approval requests', group: 'planning',
  description: 'Approval requests of the project (filter by status / issue / Docs page): who must approve, current step, decision.',
  write: false,
  input: z.object({ project: projectArg, status: z.enum(APPROVAL_STATUSES).optional(), issue: issueArg.optional(), page: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/approvals']]);
    const rows = await approvals.listApprovals(ctx.userId, p.id, { status: a.status, issueNumber: a.issue === undefined ? undefined : issueNumber(p.key, a.issue), pageNumber: a.page, limit: 50 });
    return untrusted('approvals', json(rows));
  },
});

const approvalRequest = defineTool({
  name: 'approval_request', title: 'Send for approval', group: 'planning',
  description: 'SENDS an issue or a Docs page for approval to the people you name (usernames). You never approve your own request — approvers decide in CT Work. One pending request per issue/page. Needs the Approvals module.',
  write: true,
  input: z.object({
    project: projectArg,
    issue: issueArg.optional(), page: z.number().int().positive().optional().describe('Docs page number (instead of issue)'),
    approvers: z.array(z.string().min(1).max(60)).min(1).max(10).describe('Usernames, e.g. ["lan.nguyen"]'),
    title: z.string().min(1).max(200).optional(), note: z.string().max(5000).optional(),
    mode: z.enum(['SEQUENTIAL', 'PARALLEL']).optional(), dueDate: ymd.optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    if ((a.issue === undefined) === (a.page === undefined)) throw new BadRequestError('Pass exactly one of issue or page', 'VALIDATION_ERROR');
    const p = await projectFor(ctx, a.project, [['POST', '/approvals']]);
    const approverIds = await memberIdsByUsername(p.id, a.approvers);
    if (approverIds.includes(ctx.userId)) throw new AppError('You cannot approve your own request — name other people', 400, 'WORK_SELF_APPROVAL');
    const r = await approvals.createApproval(ctx.userId, p.id, {
      targetType: a.page !== undefined ? 'DOC' : 'ISSUE',
      ...(a.issue !== undefined ? { issueNumber: issueNumber(p.key, a.issue) } : {}),
      ...(a.page !== undefined ? { pageNumber: a.page } : {}),
      title: a.title, description: a.note ?? null, mode: a.mode, approverIds,
      dueAt: a.dueDate ? new Date(`${a.dueDate}T23:59:59+07:00`) : null,
    }) as { id?: number; status?: string };
    return { approvalId: r.id ?? null, status: r.status ?? 'PENDING', approvers: a.approvers };
  },
});

// ─── Docs ────────────────────────────────────────────────────────

const docsComment = defineTool({
  name: 'docs_comment', title: 'Comment on a Docs page', group: 'docs',
  description: 'Adds a comment (markdown, @mentions by text) to a Docs page; reply_to = a comment id to answer in its thread. To change the page text itself use docs_update_section.',
  write: true,
  input: z.object({ project: projectArg, page: z.number().int().positive(), markdown: z.string().min(1).max(20_000), reply_to: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/pages/${a.page}/comments`]]);
    const c = await pages.addComment(ctx.userId, p.id, a.page, markdownToTiptap(a.markdown).doc, a.reply_to ?? null) as { id: number; parentId?: number | null };
    return { page: a.page, commentId: c.id, ...(c.parentId ? { thread: c.parentId } : {}), url: `/work/${p.workspaceSlug}/${p.key}/docs/${a.page}?comment=${c.id}` };
  },
});

// ─── Form / intake ───────────────────────────────────────────────

const formList = defineTool({
  name: 'form_list', title: 'List project forms', group: 'planning',
  description: 'Open forms of the project (bug report, request, intake…) with their fields: id, kind, label, required, options. Use with form_submit.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/forms']]);
    const r = await forms.listForms(ctx.userId, p.id) as { forms: Array<Record<string, unknown>> };
    const open = r.forms.filter((f) => f.status === 'OPEN' && !f.closed).map((f) => ({
      form: f.key, title: f.title, access: f.access, description: f.description ?? null,
      fields: (f.fields as Array<Record<string, unknown>>).map((x) => ({ id: x.id, kind: x.kind, label: x.label, required: x.required, ...(Array.isArray(x.options) && x.options.length ? { options: x.options } : {}), ...(x.showIf ? { showIf: x.showIf } : {}) })),
    }));
    return `${open.length} open form(s). Answer kinds: text/longtext/select/date (string), multiselect (string[]), number, user (member id), file (form_submit files).\n${untrusted('forms', json(open))}`;
  },
});

const formSubmit = defineTool({
  name: 'form_submit', title: 'Fill in a project form', group: 'planning',
  description: 'Submits a response to an OPEN project form (as you, like opening its link). answers = [{field, value}]; files go per file field (≤ 3 per field, ≤ 5 MB each). The form may create an issue — the result says which. People only.',
  write: true, surfaces: { builtin: false },
  input: z.object({
    project: projectArg,
    form: z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Form number or key ("F-3")'),
    answers: z.array(z.object({ field: z.string().min(1).max(60), value: z.union([z.string().max(5000), z.number(), z.array(z.string().max(200)).max(30)]) })).max(30),
    files: z.array(fileArg.extend({ field: z.string().min(1).max(60) })).max(6).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await topRoute(ctx, 'POST', '/forms/x/responses', 'fill in forms');
    const p = await projectFor(ctx, a.project, [['GET', '/forms']]);
    const m = /^(?:F-?)?(\d{1,6})$/i.exec(String(a.form));
    const f = m ? await prisma.workForm.findFirst({ where: { projectId: p.id, number: Number(m[1]), deletedAt: null }, select: { token: true, status: true } }) : null;
    if (!f) throw new NotFoundError(`Form ${String(a.form)} not found`);
    if (f.status !== 'OPEN' || !f.token) throw new AppError('This form is not open for responses', 410, 'WORK_FORM_CLOSED');
    const answers: Record<string, unknown> = {};
    for (const x of a.answers) answers[x.field] = x.value;
    const files: Record<string, Array<{ name: string; type: string; data: string }>> = {};
    for (const x of a.files ?? []) {
      decodeB64(x.base64);
      (files[x.field] ??= []).push({ name: x.fileName, type: (x.contentType ?? 'application/octet-stream').toLowerCase(), data: x.base64.replace(/^data:[^,]*,/, '') });
    }
    const r = await forms.submitInternalForm(ctx.userId, f.token, { answers, files }, 'mcp') as { issue?: { number?: number; key?: string } | null; message?: string | null };
    return { submitted: true, issue: r.issue ?? null, message: r.message ?? null };
  },
});

// ─── Họp ─────────────────────────────────────────────────────────

const meetingRsvp = defineTool({
  name: 'meeting_rsvp', title: 'Reply to a meeting invite', group: 'planning',
  description: 'Answers a meeting invitation you received: YES / NO / MAYBE, with an optional short note (e.g. why you cannot come). People only.',
  write: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, meeting: z.number().int().positive(), rsvp: z.enum(RSVPS), note: z.string().max(300).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/meetings/${a.meeting}/rsvp`]]);
    await meetingRec.rsvp(ctx.userId, p.id, a.meeting, { rsvp: a.rsvp, note: a.note ?? null });
    return { meeting: a.meeting, rsvp: a.rsvp };
  },
});

// ─── Planning poker · retro ──────────────────────────────────────

const agileRooms = defineTool({
  name: 'agile_rooms', title: 'Poker and retro rooms', group: 'planning',
  description: 'Planning-poker sessions and retro boards of the project. Pass poker (session id) for its items, current issue and deck; pass retro (id) for its columns and cards.',
  write: false,
  input: z.object({ project: projectArg, poker: z.number().int().positive().optional(), retro: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/poker'], ['GET', '/retros']]);
    if (a.poker) return untrusted(`poker session ${a.poker}`, json(await poker.getSession(ctx.userId, p.id, a.poker)));
    if (a.retro) return untrusted(`retro ${a.retro}`, json(await retro.getRetro(ctx.userId, p.id, a.retro)));
    const [ps, rs] = await Promise.all([poker.listSessions(ctx.userId, p.id), retro.listRetros(ctx.userId, p.id)]);
    return untrusted('poker + retros', json({ poker: ps, retros: rs }));
  },
});

const pokerVote = defineTool({
  name: 'poker_vote', title: 'Vote in planning poker', group: 'planning',
  description: 'Casts YOUR estimate card on the issue being voted in a planning-poker session (value must be a card of its deck, e.g. "5" or "M"; null withdraws the vote). Agents cannot vote.',
  write: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, session: z.number().int().positive(), issue: issueArg.optional().describe('Default: the issue being voted now'), value: z.string().min(1).max(8).nullable() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, [['GET', '/poker']]);
    let item: { id: number } | null;
    if (a.issue !== undefined) {
      const iid = await issueIdOf(p0.id, issueNumber(p0.key, a.issue));
      item = iid ? await prisma.workPokerItem.findFirst({ where: { sessionId: a.session, issueId: iid, session: { projectId: p0.id } }, select: { id: true } }) : null;
    } else {
      item = await prisma.workPokerItem.findFirst({ where: { sessionId: a.session, state: 'VOTING', session: { projectId: p0.id } }, orderBy: { id: 'asc' }, select: { id: true } });
    }
    if (!item) throw new NotFoundError(a.issue !== undefined ? 'That issue is not in this poker session' : 'No issue is being voted in this session right now');
    await projectFor(ctx, a.project, [['POST', `/poker/${a.session}/items/${item.id}/vote`]]);
    await poker.vote(ctx.userId, p0.id, a.session, item.id, a.value);
    return { session: a.session, item: item.id, voted: a.value };
  },
});

const retroCardAdd = defineTool({
  name: 'retro_card_add', title: 'Add a retro card', group: 'planning',
  description: 'Adds a card to a retro board column (column key from agile_rooms retro=…, e.g. "went_well"). Agents cannot change retros.',
  write: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, retro: z.number().int().positive(), column: z.string().min(1).max(16), text: z.string().min(1).max(1000) }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/retros/${a.retro}/cards`]]);
    const c = await retro.addCard(ctx.userId, p.id, a.retro, { column: a.column, body: a.text }) as { id?: number };
    return { retro: a.retro, cardId: c.id ?? null, column: a.column };
  },
});

const retroVote = defineTool({
  name: 'retro_vote', title: 'Vote on a retro card', group: 'planning',
  description: 'Gives (+1) or takes back (-1) one of your votes on a retro card.',
  write: true, surfaces: { builtin: false },
  input: z.object({ project: projectArg, retro: z.number().int().positive(), card: z.number().int().positive(), delta: z.union([z.literal(1), z.literal(-1)]).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/retros/${a.retro}/cards/${a.card}/vote`]]);
    const r = await retro.voteCard(ctx.userId, p.id, a.retro, a.card, a.delta ?? 1);
    return { retro: a.retro, card: a.card, result: r };
  },
});

// ─── Lớp học (Classroom) ─────────────────────────────────────────

const classWork = defineTool({
  name: 'class_work', title: 'My classes and assignments', group: 'teaching',
  description: 'Classroom: no args = your classes; classId = assignments with your status (assigned / turned in / late / missing / returned); + assignment = details, your draft, files, teacher comments, can you still turn in.',
  write: false, surfaces: { ask: false, builtin: false },
  input: z.object({ classId: z.number().int().positive().optional(), assignment: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    await topRoute(ctx, 'GET', '/classes', 'use classes');
    if (!a.classId) {
      const r = await classroom.listMyClasses(ctx.userId);
      return untrusted('my classes', json({ enrolled: r.enrolled.map((c) => ({ classId: c.id, name: c.name, subject: c.subject, term: c.term, group: c.group?.name ?? null, archived: !!c.archivedAt })), teaching: r.teaching.map((c) => ({ classId: c.id, name: c.name, role: c.role })) }));
    }
    if (a.assignment) {
      const d = await classwork.getAssignment(ctx.userId, a.classId, a.assignment) as Record<string, unknown>;
      return untrusted(`assignment ${a.assignment}`, json(d));
    }
    const r = await classwork.listAssignments(ctx.userId, a.classId) as { assignments: Array<Record<string, unknown>> };
    return untrusted(`assignments of class ${a.classId}`, json(r.assignments.map((x) => ({ assignment: x.id, title: x.title, kind: x.kind, dueAt: x.dueAt, maxPoints: x.maxPoints, my: x.my ?? null, counts: x.counts ?? undefined }))));
  },
});

const classSubmit = defineTool({
  name: 'class_submit', title: 'Work on / turn in an assignment', group: 'teaching',
  description: 'Your submission for a class assignment: save text and links, attach files (base64, ≤ 6 MB each), add a private comment to the teacher, and turnIn=true to hand it in. Turned-in work must be unsubmitted (class_unsubmit) before changing it. People only.',
  write: true, surfaces: { ask: false, builtin: false },
  input: z.object({
    classId: z.number().int().positive(), assignment: z.number().int().positive(),
    text: z.string().max(50_000).optional(),
    links: z.array(z.object({ url: z.string().min(1).max(2000), label: z.string().max(80).optional() })).max(20).optional(),
    files: z.array(fileArg).max(5).optional(),
    comment: z.string().min(1).max(4000).optional().describe('Private comment to the teacher'),
    turnIn: z.boolean().optional().describe('true = hand in now (default false = save only)'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await topRoute(ctx, 'POST', `/classes/${a.classId}/assignments/${a.assignment}/my/turn-in`, 'use classes');
    if (a.text === undefined && !a.links && !a.files?.length && !a.comment && !a.turnIn) throw new BadRequestError('Nothing to do — pass text, links, files, comment or turnIn', 'VALIDATION_ERROR');
    const done: string[] = [];
    if (a.text !== undefined || a.links) {
      await classwork.saveDraft(ctx.userId, a.classId, a.assignment, { ...(a.text !== undefined ? { text: a.text } : {}), ...(a.links ? { links: a.links } : {}) });
      done.push('draft saved');
    }
    for (const f of a.files ?? []) {
      const row = await classwork.uploadSubmissionFile(ctx.userId, a.classId, a.assignment, { buffer: decodeB64(f.base64), fileName: f.fileName });
      done.push(`file ${row.fileName}`);
    }
    if (a.comment) {
      await classwork.addComment(ctx.userId, a.classId, { assignmentId: a.assignment, body: a.comment });
      done.push('comment sent');
    }
    let state: unknown = null;
    if (a.turnIn) {
      const r = await classwork.turnIn(ctx.userId, a.classId, a.assignment) as { state?: unknown; late?: boolean };
      state = r.state ?? null;
      done.push(r.late ? 'turned in (late)' : 'turned in');
    }
    return { classId: a.classId, assignment: a.assignment, done, ...(state ? { state } : {}) };
  },
});

const classUnsubmit = defineTool({
  name: 'class_unsubmit', title: 'Unsubmit an assignment', group: 'teaching',
  description: 'Takes back a turned-in assignment so you can change it (turn it in again with class_submit turnIn=true). People only.',
  write: true, surfaces: { ask: false, builtin: false },
  input: z.object({ classId: z.number().int().positive(), assignment: z.number().int().positive() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    await topRoute(ctx, 'POST', `/classes/${a.classId}/assignments/${a.assignment}/my/unsubmit`, 'use classes');
    const r = await classwork.unsubmit(ctx.userId, a.classId, a.assignment) as { state?: unknown };
    return { classId: a.classId, assignment: a.assignment, state: r.state ?? null };
  },
});

export const MEMBER_OPS_COMMANDS: ToolDef[] = [
  checklistList, checklistToggle, issueAssign, issueMoveSprint,
  worklogList, worklogUpdate, timesheetSubmit,
  approvalList, approvalRequest, docsComment, formList, formSubmit, meetingRsvp,
  agileRooms, pokerVote, retroCardAdd, retroVote,
  classWork, classSubmit, classUnsubmit,
];
