/**
 * CT Work MCP — tool GHI (A10). Mỗi tool:
 *   1. `requireWrite` (scope write, agent PAUSED ⇒ 423) — thay chốt theo method của REST;
 *   2. `projectFor` với tuyến REST tương đương (phạm vi token ⇒ 404, AGENT_DENIED_ROUTES ⇒ 403, cổng khách ⇒ 403);
 *   3. gọi THẲNG service (requireProject + luật agent trong cửa ghi chung chặn lần nữa: Done⇒Review, không giao thẻ
 *      cho người khác, bình luận luôn INTERNAL…);
 *   4. heartbeat ngầm lease của chính thẻ đó (§4.2).
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { putObject } from '../../config/r2.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import * as agents from '../../services/work/agents.service.js';
import { agentBus, listInbox } from '../../services/work/agentEvents.js';
import * as approvals from '../../services/work/approvals.service.js';
import { displayName } from '../../services/work/common.js';
import { markdownToTiptap, type PmNode } from '../../services/work/docMarkdown.js';
import * as issues from '../../services/work/issues.service.js';
import { resolveParentId, typeIdFromKey } from '../../services/work/issueRefs.js';
import * as planning from '../../services/work/planning.service.js';
import { issueIdOf, issueNumber, projectFor, requireAgent, requireWrite, touchLease, type McpCtx, type ProjectHit } from '../context.js';
import { resolveStatus, workflowOf } from '../issueView.js';
import { untrusted } from '../protocol.js';
import { issueArg, projectArg } from './read.js';
import { defineTool, type ToolDef } from './types.js';
import { TL_ACTIVITIES } from '../../services/work/fptReports.js';

/** Tệp gửi thẳng qua MCP (base64 trong JSON-RPC). Lớn hơn ⇒ trả URL ký sẵn để agent PUT thẳng lên kho. */
export const MCP_INLINE_FILE_MAX = 6 * 1024 * 1024;
const MAX_MARKDOWN = 20_000;

const markdownArg = z.string().min(1).max(MAX_MARKDOWN);

function docOf(markdown: string): Prisma.InputJsonValue {
  return markdownToTiptap(markdown).doc as unknown as Prisma.InputJsonValue;
}

/** Thêm một đoạn "@a @b" (node mention thật — luật thông báo/inbox nhận ra theo id) vào cuối tài liệu. */
function withMentions(doc: Prisma.InputJsonValue, prefix: string, people: Array<{ id: number; label: string }>): Prisma.InputJsonValue {
  if (!people.length) return doc;
  const d = doc as unknown as PmNode;
  const para: PmNode = {
    type: 'paragraph',
    content: [{ type: 'text', text: prefix }, ...people.flatMap((p, i) => [
      ...(i ? [{ type: 'text', text: ' ' } as PmNode] : []),
      { type: 'mention', attrs: { id: String(p.id), label: p.label } } as PmNode,
    ])],
  };
  return { ...d, content: [...(d.content ?? []), para] } as unknown as Prisma.InputJsonValue;
}

async function issueCtx(ctx: McpCtx, project: string, issue: unknown, routes: (n: number) => Array<[string, string]>): Promise<{ p: ProjectHit; n: number; key: string }> {
  requireWrite(ctx);
  const head = String(project ?? '').trim();
  const keyGuess = (head.includes('/') ? head.split('/')[1] : head).toUpperCase();
  const n = issueNumber(keyGuess, issue);
  const p = await projectFor(ctx, project, routes(n));
  return { p, n, key: `${p.key}-${n}` };
}

const claimIssue = defineTool({
  name: 'claim_issue',
  surfaces: { ask: false, builtin: false },
  title: 'Claim issue',
  description: 'Start working on an issue assigned to you: takes a lease (default from project settings, 5–240 min). A To-do issue moves to In progress. Another agent holding it ⇒ WORK_LEASE_TAKEN. Keep the lease alive with heartbeat; release_issue when you stop.',
  write: true, agentOnly: true,
  input: z.object({ project: projectArg, issue: issueArg, minutes: z.number().int().min(5).max(240).optional() }),
  run: async (ctx, a) => {
    requireAgent(ctx);
    const { p, n } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/claim`]]);
    const r = await agents.claimIssue(ctx.userId, p.id, n, { minutes: a.minutes });
    return { lease: { id: r.lease.id, expiresAt: r.lease.expiresAt }, issue: r.issueKey, movedToInProgress: r.statusChanged, reclaimed: r.reclaimed };
  },
});

const heartbeat = defineTool({
  name: 'heartbeat',
  surfaces: { ask: false, builtin: false },
  title: 'Heartbeat',
  description: 'Keeps your lease alive and shows progress on the board ("🤖 72% · running tests"). Call at least every lease period; a lease that expires flags the issue as blocked and alerts your owner.',
  write: true, agentOnly: true,
  input: z.object({
    lease: z.number().int().positive(),
    progress: z.string().max(300).optional().describe('One short line: what you are doing now'),
    progressPct: z.number().int().min(0).max(100).optional(),
    extendMinutes: z.number().int().min(5).max(240).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const ag = requireAgent(ctx);
    await leaseInScope(ctx, a.lease);
    const l = await agents.heartbeat(ag.userId, a.lease, { progress: a.progress, progressPct: a.progressPct, extendMinutes: a.extendMinutes });
    return { lease: l.id, expiresAt: l.expiresAt, progressPct: l.progressPct };
  },
});

const releaseIssue = defineTool({
  name: 'release_issue',
  surfaces: { ask: false, builtin: false },
  title: 'Release issue',
  description: 'Ends your lease on an issue (you stopped, finished, or are blocked). The issue stays assigned to you.',
  write: true, agentOnly: true,
  input: z.object({ lease: z.number().int().positive(), reason: z.string().max(300).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const ag = requireAgent(ctx);
    await leaseInScope(ctx, a.lease);
    return agents.releaseLease(ag.userId, a.lease, { reason: a.reason });
  },
});

/** Token giới hạn dự án: lease ở dự án ngoài phạm vi ⇒ 404 (như tuyến /projects/:pid). */
async function leaseInScope(ctx: McpCtx, leaseId: number) {
  if (!ctx.agent?.projectIds) return;
  const l = await prisma.workAgentLease.findFirst({ where: { id: leaseId, agentId: ctx.agent.id }, select: { projectId: true } });
  if (l && !ctx.agent.projectIds.includes(l.projectId)) throw new AppError('Lease not found', 404, 'NOT_FOUND');
}

const comment = defineTool({
  name: 'comment',
  surfaces: { ask: false },
  title: 'Comment',
  description: 'Adds an INTERNAL comment (markdown) to an issue — evidence of your work, questions, results. Agents can never reply to clients. To answer someone in a thread, pass reply_to = the comment id shown in get_issue (replies are one level deep: replying to a reply joins its thread).',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg, markdown: markdownArg,
    // CTW đợt 5b K-1: trả lời theo luồng — người được trả lời nhận thông báo "New reply".
    reply_to: z.number().int().positive().optional().describe('Comment id to reply to (from get_issue, "comment #<id>")'),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/comments`]]);
    const c = await issues.addComment(ctx.userId, p.id, n, docOf(a.markdown), 'USER', 'INTERNAL', { parentId: a.reply_to ?? null });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { commentId: c.id, issue: key, visibility: c.visibility, ...(c.parentId ? { thread: c.parentId } : {}) };
  },
});

const transition = defineTool({
  name: 'transition',
  surfaces: { builtin: false },
  title: 'Change status',
  description: 'Moves an issue to another status: a status name from get_issue, or "todo" / "in_progress" / "review" / "done". When an AI agent asks for Done, CT Work moves it to the review status instead (redirected) — a person closes it.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, to: z.string().min(1).max(60), comment: markdownArg.optional().describe('Optional comment added after the move') }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/move`], ...(a.comment ? [['POST', `/issues/${n}/comments`] as [string, string]] : [])]);
    const r = await moveTo(ctx, p, n, a.to);
    let commentId: number | undefined;
    if (a.comment) commentId = (await issues.addComment(ctx.userId, p.id, n, docOf(a.comment), 'USER', 'INTERNAL')).id;
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, ...r, ...(commentId ? { commentId } : {}) };
  },
});

/** Đổi trạng thái theo tên/bí danh; báo `redirected` khi luật Done⇒Review đổi đích. Sai đích ⇒ lỗi kèm allowed=[…]. */
async function moveTo(ctx: McpCtx, p: ProjectHit, n: number, to: string) {
  const cur = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { typeId: true, statusId: true } });
  if (!cur) throw new AppError('Issue not found', 404, 'NOT_FOUND');
  const wf = await workflowOf(p.id, cur.typeId);
  const target = resolveStatus(wf, to, p.access.agentOptions.reviewStatusId);
  const allowed = wf.allowedFrom(cur.statusId).map((s) => s.name);
  if (!target) throw new AppError(`"${to}" is not a status of this issue's workflow`, 400, 'WORK_BAD_STATUS', { allowed });
  if (target.id === cur.statusId) return { status: { name: target.name, category: target.category }, unchanged: true };
  try {
    await issues.moveIssueAs(ctx.userId, p.id, n, { statusId: target.id });
  } catch (err) {
    if (err instanceof AppError && err.code === 'WORK_TRANSITION_DENIED') throw new AppError(err.message, err.statusCode, err.code, { ...(err.data ?? {}), allowed });
    throw err;
  }
  const after = await prisma.workIssue.findFirstOrThrow({ where: { projectId: p.id, number: n }, select: { statusId: true } });
  const now = wf.statuses.find((s) => s.id === after.statusId);
  return {
    status: { name: now?.name ?? null, category: now?.category ?? null },
    ...(after.statusId !== target.id ? { redirected: { from: target.name, to: now?.name ?? null, why: 'AI agents cannot close issues — a person reviews and moves it to Done' } } : {}),
  };
}

const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

async function labelIdsOf(projectId: number, names: string[]): Promise<number[]> {
  const all = await prisma.workLabel.findMany({ where: { projectId }, select: { id: true, name: true } });
  const ids: number[] = [];
  const missing: string[] = [];
  for (const n of names) {
    const hit = all.find((l) => l.name.toLowerCase() === n.trim().toLowerCase());
    if (hit) ids.push(hit.id); else missing.push(n);
  }
  if (missing.length) {
    throw new AppError(`Unknown label(s): ${missing.join(', ')}. Agents cannot create labels — use existing ones.`, 400, 'WORK_BAD_LABEL', { allowed: all.map((l) => l.name).slice(0, 50) });
  }
  return ids;
}

const updateIssue = defineTool({
  name: 'update_issue',
  surfaces: { ask: false },
  title: 'Update issue',
  description: 'Edits fields of an issue assigned to you (or title/description/points of a subtask of your issue). Only the fields you pass change. labels replaces the whole set with existing project labels.',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    title: z.string().min(1).max(255).optional(),
    descriptionMarkdown: z.string().max(100_000).optional(),
    storyPoints: z.number().min(0).max(1000).nullable().optional(),
    remainingMinutes: z.number().int().min(0).max(100_000).nullable().optional(),
    dueDate: dateArg.nullable().optional(),
    labels: z.array(z.string().min(1).max(60)).max(30).optional(),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['PATCH', `/issues/${n}`]]);
    const patch: Record<string, unknown> = {};
    if (a.title !== undefined) patch.title = a.title;
    if (a.descriptionMarkdown !== undefined) patch.descriptionJson = a.descriptionMarkdown.trim() ? docOf(a.descriptionMarkdown) : null;
    if (a.storyPoints !== undefined) patch.storyPoints = a.storyPoints;
    if (a.remainingMinutes !== undefined) patch.remainingEstimateMin = a.remainingMinutes;
    if (a.dueDate !== undefined) patch.dueDate = a.dueDate === null ? null : new Date(`${a.dueDate}T00:00:00.000Z`);
    if (a.labels !== undefined) patch.labelIds = await labelIdsOf(p.id, a.labels);
    if (!Object.keys(patch).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
    const cur = await prisma.workIssue.findFirst({ where: { projectId: p.id, number: n, deletedAt: null }, select: { version: true } });
    if (!cur) throw new AppError('Issue not found', 404, 'NOT_FOUND');
    const after = await issues.updateIssueAs(ctx.userId, p.id, n, patch as Parameters<typeof issues.updateIssueAs>[3], cur.version);
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { issue: key, updated: Object.keys(patch).map((k) => (k === 'descriptionJson' ? 'description' : k === 'labelIds' ? 'labels' : k)), version: (after as { version?: number }).version ?? null };
  },
});

const createIssue = defineTool({
  name: 'create_issue',
  surfaces: { ask: false },
  title: 'Create issue',
  description: 'Creates an issue (type key such as TASK, BUG, STORY, SUBTASK). SUBTASK needs parent. assignToMe takes it yourself. Agents cannot assign to others or plan sprints.',
  write: true,
  input: z.object({
    project: projectArg,
    type: z.string().min(1).max(16).describe('Issue type key, e.g. TASK, BUG, STORY, SUBTASK'),
    title: z.string().min(1).max(255),
    descriptionMarkdown: z.string().max(100_000).optional(),
    parent: issueArg.optional(),
    assignToMe: z.boolean().optional(),
    labels: z.array(z.string().min(1).max(60)).max(30).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/issues']]);
    const typeId = await typeIdFromKey(p.id, a.type, 'type');
    const parentId = a.parent === undefined ? undefined
      : await resolveParentId(p.id, typeof a.parent === 'number' ? { parentNumber: a.parent } : /^\d+$/.test(a.parent.trim()) ? { parentNumber: Number(a.parent) } : { parentKey: a.parent });
    const body: issues.CreateIssueBody = {
      typeId, title: a.title,
      ...(a.descriptionMarkdown?.trim() ? { descriptionJson: docOf(a.descriptionMarkdown) } : {}),
      ...(parentId ? { parentId } : {}),
      ...(a.assignToMe ? { assigneeId: ctx.userId } : {}),
      ...(a.labels?.length ? { labelIds: await labelIdsOf(p.id, a.labels) } : {}),
    };
    const issue = await issues.createIssueAs(ctx.userId, p.id, body);
    const key = `${p.key}-${issue.number}`;
    return { key, number: issue.number, url: `/work/${p.workspaceSlug}/${p.key}/issue/${issue.number}` };
  },
});

const logWork = defineTool({
  name: 'log_work',
  surfaces: { builtin: false },
  title: 'Log work',
  description: 'Logs time spent on an issue (1–1440 minutes). Use it for real work time; CT Work also derives agent time from leases, and skips that when you logged the same issue the same day.',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    minutes: z.number().int().min(1).max(1440),
    note: z.string().max(1000).optional(),
    startedAt: z.string().max(40).optional().describe('ISO date-time; default now'),
    // CTW đợt 4 (A24): cột Activity / Work Product của sheet TimeLogs.
    activity: z.enum(TL_ACTIVITIES).optional().describe('Training | Analyzing | Designing | Coding | Testing | Deploying'),
    workProduct: z.string().max(120).optional().describe('Report1 (Intro)…Report7 (Final), Software Package, or a module name'),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/worklogs`]]);
    const w = await planning.addWorklog(ctx.userId, p.id, n, { minutes: a.minutes, note: a.note, startedAt: a.startedAt, activity: a.activity, workProduct: a.workProduct });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { worklogId: w.id, issue: key, minutes: w.minutes, source: w.source };
  },
});

const reportUsage = defineTool({
  name: 'report_usage',
  surfaces: { ask: false, builtin: false },
  title: 'Report usage',
  description: 'Reports the tokens (and optionally USD) you spent, ideally per issue. Shown in CT Work as "self-reported" agent cost. Without costUsd CT Work estimates it from list prices of known models.',
  write: true, agentOnly: true,
  input: z.object({
    project: projectArg,
    issue: issueArg.optional(),
    model: z.string().min(1).max(80),
    inputTokens: z.number().int().min(0),
    outputTokens: z.number().int().min(0),
    cacheReadTokens: z.number().int().min(0).optional(),
    costUsd: z.number().min(0).max(10_000).optional(),
    note: z.string().max(200).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    requireAgent(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/agent-usage']]);
    const n = a.issue === undefined ? null : issueNumber(p.key, a.issue);
    return agents.reportUsage(ctx.userId, p.id, {
      issueNumber: n, model: a.model, inputTokens: a.inputTokens, outputTokens: a.outputTokens,
      cacheReadTokens: a.cacheReadTokens, costUsd: a.costUsd, note: a.note,
    });
  },
});

const attachFile = defineTool({
  name: 'attach_file',
  surfaces: { ask: false, builtin: false },
  title: 'Attach file',
  description: `Attaches a file (base64) to an issue — screenshots, logs, build output. Up to ${MCP_INLINE_FILE_MAX / 1024 / 1024} MB inline; for bigger files pass sizeBytes without base64: you get a presigned URL to PUT the bytes to, then call attach_complete.`,
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    fileName: z.string().min(1).max(255),
    contentType: z.string().min(1).max(100),
    base64: z.string().max(Math.ceil((MCP_INLINE_FILE_MAX * 4) / 3) + 8).optional(),
    sizeBytes: z.number().int().positive().optional().describe('Only for files too big to send inline'),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/attachments/presign`], ['POST', `/issues/${n}/attachments/complete`]]);
    if (!a.base64) {
      if (!a.sizeBytes) throw new BadRequestError('Send base64 (small files) or sizeBytes (to get an upload URL)', 'VALIDATION_ERROR');
      const pre = await issues.presignAttachment(ctx.userId, p.id, n, { fileName: a.fileName, contentType: a.contentType, size: a.sizeBytes });
      return { presign: { url: pre.uploadUrl, key: pre.key, headers: pre.headers, method: 'PUT' }, next: `PUT the bytes to url with those headers, then call attach_complete with key and fileName (issue ${key}).` };
    }
    const clean = a.base64.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) throw new BadRequestError('base64 is not valid base64', 'VALIDATION_ERROR');
    const buf = Buffer.from(clean, 'base64');
    if (!buf.length) throw new BadRequestError('The file is empty', 'VALIDATION_ERROR');
    if (buf.length > MCP_INLINE_FILE_MAX) throw new BadRequestError(`Files over ${MCP_INLINE_FILE_MAX / 1024 / 1024} MB go through sizeBytes + presigned upload`, 'WORK_FILE_TOO_LARGE');
    const pre = await issues.presignAttachment(ctx.userId, p.id, n, { fileName: a.fileName, contentType: a.contentType, size: buf.length });
    await putObject(pre.key, buf, a.contentType, 'private, max-age=0');
    const att = await issues.completeAttachment(ctx.userId, p.id, n, { key: pre.key, fileName: a.fileName });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { attachmentId: att.id, issue: key, fileName: att.fileName, size: att.size };
  },
});

const attachComplete = defineTool({
  name: 'attach_complete',
  surfaces: { ask: false, builtin: false },
  title: 'Finish attachment',
  description: 'Registers a file you uploaded with the presigned URL from attach_file.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, key: z.string().min(1).max(500), fileName: z.string().min(1).max(255) }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/attachments/complete`]]);
    const att = await issues.completeAttachment(ctx.userId, p.id, n, { key: a.key, fileName: a.fileName });
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { attachmentId: att.id, issue: key, fileName: att.fileName, size: att.size };
  },
});

/** Người cần hỏi: owner của agent + trưởng dự án (người thật, khác người hỏi). */
async function leadsFor(ctx: McpCtx, projectId: number): Promise<Array<{ id: number; label: string; username: string }>> {
  const [project, owner] = await Promise.all([
    prisma.workProject.findUnique({ where: { id: projectId }, select: { lead: { select: { id: true, username: true, fullName: true, displayName: true, kind: true } } } }),
    ctx.agent ? prisma.user.findUnique({ where: { id: ctx.agent.ownerId }, select: { id: true, username: true, fullName: true, displayName: true, kind: true } }) : Promise.resolve(null),
  ]);
  const out = new Map<number, { id: number; label: string; username: string }>();
  for (const u of [owner, project?.lead]) {
    if (u && u.kind !== 'AGENT' && u.id !== ctx.userId) out.set(u.id, { id: u.id, label: displayName(u), username: u.username });
  }
  return [...out.values()];
}

const askLead = defineTool({
  name: 'ask_lead',
  surfaces: { ask: false, builtin: false },
  title: 'Ask the lead',
  description: 'Asks your owner and the project lead a question as an INTERNAL comment that @mentions them. blocking=true also flags the issue as Blocked with the question as reason. Use this instead of retrying when something is forbidden or unclear.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, question: z.string().min(2).max(4000), blocking: z.boolean().optional() }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', `/issues/${n}/comments`], ...(a.blocking ? [['PUT', `/issues/${n}/flag`] as [string, string]] : [])]);
    const people = await leadsFor(ctx, p.id);
    const doc = withMentions(docOf(`**Question:** ${a.question}`), 'Asking: ', people);
    const c = await issues.addComment(ctx.userId, p.id, n, doc, 'USER', 'INTERNAL');
    let flagged = false;
    if (a.blocking) {
      await issues.setIssueFlag(ctx.userId, p.id, n, { flagged: true, reason: `Waiting for an answer: ${a.question}`.slice(0, 450) });
      flagged = true;
    }
    await touchLease(ctx, await issueIdOf(p.id, n));
    return { commentId: c.id, issue: key, asked: people.map((x) => x.username), flagged };
  },
});

const requestReview = defineTool({
  name: 'request_review',
  surfaces: { ask: false, builtin: false },
  title: 'Request review',
  description: 'Hands finished work to a person: adds a summary comment, creates an approval request (reviewers from project settings, else your owner) when the Approvals module is on, and moves the issue to the review status.',
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg,
    summary: z.string().min(2).max(5000).describe('What you did and how it was verified (markdown)'),
    evidenceAttachmentIds: z.array(z.number().int().positive()).max(20).optional(),
  }),
  run: async (ctx, a) => {
    const { p, n, key } = await issueCtx(ctx, a.project, a.issue, (n) => [['POST', '/approvals'], ['POST', `/issues/${n}/move`], ['POST', `/issues/${n}/comments`]]);
    const issueId = await issueIdOf(p.id, n);
    let evidence = '';
    if (a.evidenceAttachmentIds?.length) {
      const atts = await prisma.workAttachment.findMany({ where: { id: { in: a.evidenceAttachmentIds }, issueId: issueId ?? -1 }, select: { id: true, fileName: true } });
      if (atts.length !== new Set(a.evidenceAttachmentIds).size) throw new BadRequestError('Some evidence attachments are not on this issue', 'WORK_BAD_ATTACHMENT');
      evidence = `\n\n**Evidence:** ${atts.map((x) => `#${x.id} ${x.fileName}`).join(', ')}`;
    }
    const c = await issues.addComment(ctx.userId, p.id, n, docOf(`**Ready for review**\n\n${a.summary}${evidence}`), 'USER', 'INTERNAL');
    const opts = p.access.agentOptions;
    const reviewers = opts.reviewerIds.length ? opts.reviewerIds : ctx.agent ? [ctx.agent.ownerId] : [];
    let approvalId: number | null = null;
    let approvalNote: string | undefined;
    if (!reviewers.length) approvalNote = 'No reviewer configured (Project settings → Agents → reviewers) — no approval request created.';
    else if (!p.access.modules.approvals) approvalNote = 'The Approvals module is off in this project — no approval request created; the issue still moves to review.';
    else {
      const title = (await prisma.workIssue.findFirst({ where: { id: issueId ?? -1 }, select: { title: true } }))?.title ?? key;
      const r = await approvals.createApproval(ctx.userId, p.id, {
        targetType: 'ISSUE', issueNumber: n, title: `Review ${key}: ${title}`.slice(0, 200),
        description: `${a.summary}${evidence}`.slice(0, 5000), approverIds: reviewers,
      }) as { id?: number };
      approvalId = r.id ?? null;
    }
    const moved = await moveTo(ctx, p, n, 'review').catch((err: unknown) => ({ error: err instanceof AppError ? `${err.code ?? 'ERROR'}: ${err.message}` : 'could not move to review' }));
    await touchLease(ctx, issueId);
    return { issue: key, commentId: c.id, approvalId, ...(approvalNote ? { approvalNote } : {}), move: moved };
  },
});

const waitEvents = defineTool({
  name: 'wait_events',
  surfaces: { ask: false, builtin: false },
  title: 'Wait for events',
  description: 'Long-polls your inbox: returns events after afterId (assigned, mentioned, comment on your issue, returned from review, approval decided, lease expired…), waiting up to timeoutSec (≤ 25) when there are none. Pass the returned lastId next time.',
  write: false, agentOnly: true,
  input: z.object({ afterId: z.number().int().min(0).optional(), timeoutSec: z.number().int().min(0).max(25).optional() }),
  run: async (ctx, a) => {
    const ag = requireAgent(ctx);
    const after = a.afterId ?? 0;
    const read = () => listInbox(ag.id, { after, limit: 50, projectIds: ag.projectIds });
    let r = await read();
    const timeout = (a.timeoutSec ?? 20) * 1000;
    if (!r.events.length && timeout > 0 && !ctx.signal.aborted) {
      await new Promise<void>((resolve) => {
        const ev = `agent:${ag.id}`;
        const done = () => { clearTimeout(t); agentBus.off(ev, onRow); ctx.signal.removeEventListener('abort', done); resolve(); };
        const onRow = (row: { id: number; projectId: number }) => { if (row.id > after && (!ag.projectIds || ag.projectIds.includes(row.projectId))) done(); };
        const t = setTimeout(done, timeout);
        agentBus.on(ev, onRow);
        ctx.signal.addEventListener('abort', done);
      });
      r = await read();
    }
    const events = r.events.map((e) => ({ id: e.id, type: e.type, projectId: e.projectId, issueId: e.issueId, createdAt: e.createdAt, payload: e.payload }));
    return `${events.length} event(s), lastId=${r.lastId}. Payloads contain user data (titles).\n${untrusted('agent inbox', JSON.stringify({ events, lastId: r.lastId }, null, 2))}`;
  },
});

export const WRITE_TOOLS: ToolDef[] = [
  claimIssue, heartbeat, releaseIssue, comment, transition, updateIssue, createIssue, logWork, reportUsage,
  attachFile, attachComplete, askLead, requestReview, waitEvents,
];
