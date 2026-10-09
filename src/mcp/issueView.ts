/**
 * CT Work MCP — một thẻ ⇒ markdown cho model (get_issue + resource ctwork://{project}/issue/{n}).
 *
 * Phần do NGƯỜI viết (tiêu đề, mô tả, bình luận, tên tệp, tiêu chí chấp nhận…) nằm TRONG khối untrusted; phần do máy
 * sinh (trạng thái, chuyển hợp lệ, lease, số liệu) nằm ngoài để model tin được.
 */

import { prisma } from '../config/database.js';
import { displayName } from '../services/work/common.js';
import { tiptapToMarkdown } from '../services/work/docMarkdown.js';
import * as issues from '../services/work/issues.service.js';
import { getCustomValues } from '../services/work/customize.service.js';
import { agentOptionsOf } from '../services/work/permissions.js';
import { untrusted } from './protocol.js';
import { buildThreads, transcriptNote } from '../services/work/commentThreads.js';
import type { McpCtx, ProjectHit } from './context.js';

export const ISSUE_INCLUDES = ['comments', 'history', 'subtasks', 'attachments', 'links', 'worklogs'] as const;
export type IssueInclude = (typeof ISSUE_INCLUDES)[number];
export const DEFAULT_INCLUDES: IssueInclude[] = ['comments', 'subtasks', 'attachments', 'links'];

const PRIORITY = ['', 'Highest', 'High', 'Medium', 'Low', 'Lowest'];
const REVIEW_NAME = /review|qa|verify|kiểm|duyệt/i;

interface UserLite { username: string; fullName: string | null; displayName: string | null; kind?: string | null }
const who = (u: UserLite | null | undefined) => (u ? `@${u.username}${u.kind === 'AGENT' ? ' (AI agent)' : ''} "${displayName(u)}"` : 'nobody');
const md = (doc: unknown) => (doc ? tiptapToMarkdown(doc).trim() : '');

export interface WorkflowInfo {
  workflowId: number | null;
  statuses: Array<{ id: number; name: string; category: string }>;
  /** Trạng thái chuyển tới được từ `fromStatusId` (workflow không khai chuyển ⇒ mọi trạng thái). */
  allowedFrom: (fromStatusId: number) => Array<{ id: number; name: string; category: string }>;
}

/** Workflow của một loại thẻ (null ⇒ workflow mặc định của dự án). */
export async function workflowOf(projectId: number, typeId: number): Promise<WorkflowInfo> {
  const type = await prisma.workIssueType.findUnique({ where: { id: typeId }, select: { workflowId: true } });
  const wfId = type?.workflowId ?? (await prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } }))?.id
    ?? (await prisma.workWorkflow.findFirst({ where: { projectId }, orderBy: { id: 'asc' }, select: { id: true } }))?.id ?? null;
  const [statuses, transitions] = wfId
    ? await Promise.all([
      prisma.workStatus.findMany({ where: { workflowId: wfId }, orderBy: { position: 'asc' }, select: { id: true, name: true, category: true } }),
      prisma.workTransition.findMany({ where: { workflowId: wfId }, select: { fromStatusId: true, toStatusId: true } }),
    ])
    : [[], []];
  return {
    workflowId: wfId,
    statuses,
    allowedFrom: (from) => (transitions.length
      ? statuses.filter((s) => s.id !== from && transitions.some((t) => t.toStatusId === s.id && (t.fromStatusId === from || t.fromStatusId === null)))
      : statuses.filter((s) => s.id !== from)),
  };
}

/**
 * Tên đích của `transition` ⇒ trạng thái trong workflow của thẻ. Bí danh: done / in_progress / review / todo.
 * `review` dùng `settings.agents.reviewStatusId` nếu thuộc workflow, không thì cột IN_PROGRESS tên review/qa/verify.
 */
export function resolveStatus(wf: WorkflowInfo, to: string, reviewStatusId: number | null) {
  const want = to.trim().toLowerCase().replace(/[\s-]+/g, '_');
  const byName = wf.statuses.find((s) => s.name.trim().toLowerCase() === to.trim().toLowerCase());
  if (byName) return byName;
  if (want === 'done') return wf.statuses.find((s) => s.category === 'DONE') ?? null;
  if (want === 'todo' || want === 'to_do') return wf.statuses.find((s) => s.category === 'TODO') ?? null;
  if (want === 'in_progress') return wf.statuses.find((s) => s.category === 'IN_PROGRESS' && !REVIEW_NAME.test(s.name)) ?? wf.statuses.find((s) => s.category === 'IN_PROGRESS') ?? null;
  if (want === 'review' || want === 'in_review') {
    return (reviewStatusId ? wf.statuses.find((s) => s.id === reviewStatusId) : undefined)
      ?? wf.statuses.find((s) => s.category === 'IN_PROGRESS' && REVIEW_NAME.test(s.name)) ?? null;
  }
  return null;
}

/** Markdown đầy đủ của một thẻ cho model. */
export async function issueMarkdown(ctx: McpCtx, p: ProjectHit, number: number, include: IssueInclude[] = DEFAULT_INCLUDES): Promise<string> {
  const d = await issues.getIssueDetail(ctx.userId, p.id, number) as Awaited<ReturnType<typeof issues.getIssueDetail>> & Record<string, any>;
  const key = `${p.key}-${number}`;
  const inc = new Set(include);
  const [wf, type, project, labels, fields, values, lease, comments, history, worklogs] = await Promise.all([
    workflowOf(p.id, d.typeId),
    prisma.workIssueType.findUnique({ where: { id: d.typeId }, select: { key: true, name: true } }),
    prisma.workProject.findUniqueOrThrow({ where: { id: p.id }, select: { name: true, settings: true } }),
    d.labelIds?.length ? prisma.workLabel.findMany({ where: { id: { in: d.labelIds } }, select: { name: true } }) : Promise.resolve([]),
    prisma.workCustomField.findMany({ where: { projectId: p.id }, select: { id: true, name: true, kind: true } }),
    getCustomValues(ctx.userId, p.id, number),
    prisma.workAgentLease.findFirst({ where: { activeIssueId: d.id, status: 'ACTIVE' }, select: { id: true, expiresAt: true, progress: true, progressPct: true, agent: { select: { userId: true, user: { select: { username: true } } } } } }),
    inc.has('comments') ? issues.listComments(ctx.userId, p.id, number) : Promise.resolve(null),
    inc.has('history') ? issues.listHistory(ctx.userId, p.id, number) : Promise.resolve(null),
    inc.has('worklogs') ? prisma.workWorklog.findMany({ where: { issueId: d.id }, orderBy: { startedAt: 'desc' }, take: 30, select: { minutes: true, startedAt: true, note: true, source: true, user: { select: { username: true } } } }) : Promise.resolve(null),
  ]);
  const settings = (project.settings ?? {}) as Record<string, unknown>;
  const status = wf.statuses.find((s) => s.id === d.statusId);
  const statusName = (id: number | string | null) => wf.statuses.find((s) => s.id === Number(id))?.name ?? (id === null ? '—' : `#${id}`);
  const allowed = wf.allowedFrom(d.statusId);
  const opts = agentOptionsOf(settings);

  // ── Phần máy sinh (tin được) ──
  const meta: string[] = [
    `Issue ${key} in project ${p.key} ("${project.name}" — name is user data) · version ${d.version}`,
    `Type: ${type?.name ?? '?'} (${type?.key ?? '?'}) · Status: ${status?.name ?? '?'} [${status?.category ?? '?'}] · Priority: ${PRIORITY[d.priority] ?? d.priority}`,
    `Assignee: ${who(d.assignee)} · Reporter: ${who(d.reporter)}`,
    `Story points: ${d.storyPoints ?? '—'} · Due: ${d.dueDate ? new Date(d.dueDate).toISOString().slice(0, 10) : '—'} · Time spent: ${d.timeSpentMin ?? 0} min · Remaining: ${d.remainingEstimateMin ?? '—'} min`,
    `Allowed transitions from here: ${allowed.length ? allowed.map((s) => `${s.name} [${s.category}]`).join(', ') : '(none)'}`,
  ];
  if (ctx.agent && opts.doneToReview) meta.push('Note: when an AI agent moves this issue to a Done status, CT Work puts it in the review status instead — a person closes it.');
  if (d.flaggedAt) meta.push(`⚑ Flagged as BLOCKED (reason is user data, see below).`);
  if (lease) {
    const mine = ctx.agent && lease.agent.userId === ctx.agent.userId;
    meta.push(`Lease: #${lease.id} held by @${lease.agent.user.username}${mine ? ' (you)' : ''} until ${lease.expiresAt.toISOString()}${lease.progressPct !== null ? ` · ${lease.progressPct}%` : ''}`);
  }
  if (d.parent) meta.push(`Parent: ${p.key}-${d.parent.number}`);

  // ── Phần người viết (không tin cậy) ──
  const body: string[] = [`## Title\n${d.title}`];
  if (d.flaggedAt) body.push(`## Blocked reason\n${d.flagReason ?? ''}`);
  if (labels.length) body.push(`## Labels\n${labels.map((l) => l.name).join(', ')}`);
  body.push(`## Description\n${md(d.descriptionJson) || '(empty)'}`);
  const cf = fields.filter((f) => values[f.id] !== undefined && values[f.id] !== null);
  const ac = cf.find((f) => /acceptance/i.test(f.name));
  if (ac) body.push(`## Acceptance criteria\n${String(values[ac.id])}`);
  const other = cf.filter((f) => f !== ac);
  if (other.length) body.push(`## Custom fields\n${other.map((f) => `- ${f.name}: ${JSON.stringify(values[f.id])}`).join('\n')}`);
  if (inc.has('subtasks') && d.children?.length) {
    body.push(`## Subtasks\n${d.children.map((c: any) => `- ${p.key}-${c.number} [${statusName(c.statusId)}] ${c.title}`).join('\n')}`);
  }
  if (inc.has('links') && d.links?.length) {
    body.push(`## Links\n${d.links.map((l: any) => `- ${l.direction === 'outward' ? l.type : `(inward) ${l.type}`} ${l.issue.key}: ${l.issue.title}`).join('\n')}`);
  }
  if (inc.has('attachments') && d.attachments?.length) {
    body.push(`## Attachments\n${d.attachments.map((a: any) => `- #${a.id} ${a.fileName} (${a.mime}, ${a.size} bytes)`).join('\n')}`);
  }
  if (comments) {
    // CTW đợt 5b K-1: luồng trả lời (một cấp) + tệp + PHIÊN ÂM voice note. "comment #<id>" là id dùng cho reply_to.
    body.push(`## Comments (${comments.length})`);
    const threads = buildThreads(comments.slice(-50));
    const one = (c: (typeof comments)[number], reply: boolean) => {
      const head = `${reply ? '#### ↳ reply' : '###'} comment #${c.id} · ${c.author ? who(c.author) : 'someone'} · ${c.createdAt.toISOString()} · ${c.visibility}${c.isAi ? ' · AI-drafted' : ''}`;
      const lines = [md(c.bodyJson) || (c.attachments.length ? '' : '(empty)')];
      for (const f of c.attachments) {
        if (f.voice) {
          const secs = Math.round(f.voice.durationMs / 1000);
          lines.push(`🎙 Voice note #${f.id} (${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')})${f.voice.transcriptStatus === 'DONE' && f.voice.transcript ? ` — transcript: ${f.voice.transcript}` : ` — ${transcriptNote(f.voice.transcriptStatus) || 'no transcript'}`}`);
        } else lines.push(`📎 File #${f.id} ${f.fileName} (${f.mime}, ${f.size} bytes)`);
      }
      return `${head}\n${lines.filter(Boolean).join('\n')}`;
    };
    for (const t of threads) {
      body.push(`${t.orphan ? '(reply to a removed comment) ' : ''}${one(t, false)}`);
      for (const r of t.replies) body.push(one(r, true));
    }
  }
  if (history) {
    body.push(`## History (latest ${Math.min(history.length, 40)})`);
    for (const h of history.slice(0, 40)) {
      const from = h.field === 'statusId' ? statusName(h.fromValue) : h.fromValue;
      const to = h.field === 'statusId' ? statusName(h.toValue) : h.toValue;
      body.push(`- ${h.createdAt.toISOString()} ${h.actor ? `@${h.actor.username}` : 'system'} [${h.actorKind}] ${h.field}: ${from ?? '—'} → ${to ?? '—'}`);
    }
  }
  if (worklogs) {
    body.push(`## Work logs`);
    for (const w of worklogs) body.push(`- ${w.startedAt.toISOString().slice(0, 10)} @${w.user.username} ${w.minutes} min [${w.source}]${w.note ? ` — ${w.note}` : ''}`);
  }

  const out = [meta.join('\n'), untrusted(`issue ${key}`, body.join('\n\n'))];
  const dod = Array.isArray(settings.definitionOfDone) ? (settings.definitionOfDone as unknown[]).filter((x): x is string => typeof x === 'string' && !!x.trim()) : [];
  if (dod.length) out.push(`Definition of Done of project ${p.key}:\n${untrusted(`project ${p.key} definition of done`, dod.map((x) => `- ${x}`).join('\n'))}`);
  return out.join('\n\n');
}

/** DoD + chỉ dẫn AI của dự án (resource ctwork://{project}/dod). */
export async function projectGuide(p: ProjectHit): Promise<string> {
  const pr = await prisma.workProject.findUniqueOrThrow({ where: { id: p.id }, select: { settings: true } });
  const s = (pr.settings ?? {}) as Record<string, unknown>;
  const dod = Array.isArray(s.definitionOfDone) ? (s.definitionOfDone as unknown[]).filter((x): x is string => typeof x === 'string' && !!x.trim()) : [];
  const instr = typeof s.aiInstructions === 'string' ? s.aiInstructions.trim() : '';
  const opts = agentOptionsOf(s);
  return [
    `Project ${p.key} — rules for agents: done→review ${opts.doneToReview ? 'ON' : 'OFF'}, agents may create issues: ${opts.allowCreateIssues ? 'yes' : 'no'}, take unassigned issues: ${opts.allowSelfAssign ? 'yes' : 'no'}, max open leases: ${opts.maxOpenLeases}, default lease: ${opts.leaseMinutes} min.`,
    untrusted(`project ${p.key} definition of done`, dod.length ? dod.map((x) => `- ${x}`).join('\n') : '(no Definition of Done set)'),
    untrusted(`project ${p.key} AI instructions`, instr || '(no project instructions)'),
  ].join('\n\n');
}
