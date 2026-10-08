/**
 * CT Work — HỘP THƯ sự kiện của AI agent (CTW-28 §4.5, việc A7).
 *
 * Một listener trên bus (`onWorkEvent`) biến WorkEvent thành dòng `work_agent_inbox` cho TỪNG agent liên quan:
 *
 *   issue.created/updated, assignee → agent           ⇒ issue.assigned     (agent được giao)
 *   comment.created có @mention agent                  ⇒ comment.mention    (agent được nhắc)
 *   comment.created trên thẻ agent được giao/đang giữ  ⇒ comment.on_my_issue
 *   issue.updated statusId Review/Done → TODO/IN_PROGRESS bởi NGƯỜI ⇒ issue.returned (thẻ bị trả lại)
 *   handoff.updated PENDING, toUserId = agent          ⇒ handoff.received
 *   approval.updated APPROVED/REJECTED, người tạo = agent ⇒ approval.decided
 *   issue.updated cờ Blocked đổi bởi NGƯỜI             ⇒ issue.flag
 *   sweeper                                            ⇒ lease.expired      (agents.service ghi thẳng)
 *
 * CHỐNG TỰ KÍCH (§8.3): sự kiện do CHÍNH agent gây ra không bao giờ vào hộp thư của nó — không thì comment của agent
 * ⇒ comment.on_my_issue ⇒ agent trả lời ⇒ … vòng lặp tốn tiền.
 *
 * Payload KHÔNG chép mô tả/bình luận (đi qua mạng ngoài bằng webhook) — agent gọi API để đọc. Ba đường nhận: SSE
 * `/agents/me/events` (agentBus), poll `/agents/me/inbox`, webhook (webhooks.service dispatcher, cột delivery).
 */

import { EventEmitter } from 'node:events';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { AgentInboxType } from './constants.js';
import { onWorkEvent, type WorkEvent } from './events.js';

/** Phát dòng inbox mới cho SSE trong tiến trình — khoá `agent:<id>`. Một backend ⇒ không cần Redis. */
export const agentBus = new EventEmitter();
agentBus.setMaxListeners(1000);

// ─── Bộ đệm user → agent (30 s; tạo/convert/retire xoá ngay) ─────

interface AgentLite { id: number; userId: number; status: string }
let cache: { at: number; byUser: Map<number, AgentLite> } | null = null;

export function invalidateAgentCache(): void { cache = null; }

async function agentsByUser(): Promise<Map<number, AgentLite>> {
  if (cache && Date.now() - cache.at < 30_000) return cache.byUser;
  const rows = await prisma.workAgent.findMany({ where: { status: { not: 'RETIRED' } }, select: { id: true, userId: true, status: true } });
  cache = { at: Date.now(), byUser: new Map(rows.map((r) => [r.userId, r])) };
  return cache.byUser;
}

// ─── Ghi một dòng ────────────────────────────────────────────────

export interface InboxInput {
  agentId: number;
  projectId: number;
  issueId?: number | null;
  type: AgentInboxType;
  summary: string;
  actor?: { userId: number | null; kind: string } | null;
  changes?: Array<{ field: string; from: string | null; to: string | null }>;
  extra?: Record<string, unknown>;
}

async function issueBrief(issueId: number) {
  const i = await prisma.workIssue.findUnique({
    where: { id: issueId },
    select: { number: true, title: true, project: { select: { key: true, workspace: { select: { slug: true } } } } },
  });
  if (!i) return null;
  return { key: `${i.project.key}-${i.number}`, number: i.number, title: i.title, url: `/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}`, projectKey: i.project.key };
}

/** Dòng hộp thư + phát SSE. delivery = PENDING nếu agent có webhook bật nghe loại này, không thì SKIPPED. */
export async function recordInbox(input: InboxInput) {
  const [brief, actor, hooks, project] = await Promise.all([
    input.issueId ? issueBrief(input.issueId) : Promise.resolve(null),
    input.actor?.userId ? prisma.user.findUnique({ where: { id: input.actor.userId }, select: { username: true, kind: true } }) : Promise.resolve(null),
    prisma.workWebhook.findMany({ where: { agentId: input.agentId, enabled: true }, select: { events: true } }),
    prisma.workProject.findUnique({ where: { id: input.projectId }, select: { key: true } }),
  ]);
  const wants = hooks.some((h) => !Array.isArray(h.events) || !(h.events as unknown[]).length || (h.events as unknown[]).includes(input.type));
  const at = new Date();
  const payload = {
    type: input.type,
    project: { key: project?.key ?? brief?.projectKey ?? null },
    issue: brief ? { key: brief.key, number: brief.number, title: brief.title, url: brief.url } : null,
    actor: actor ? { username: actor.username, kind: actor.kind === 'AGENT' ? 'AGENT' : (input.actor?.kind === 'SYSTEM' ? 'SYSTEM' : 'HUMAN') } : (input.actor?.kind ? { username: null, kind: input.actor.kind } : null),
    at: at.toISOString(),
    summary: input.summary.slice(0, 300),
    ...(input.changes?.length ? { changes: input.changes.slice(0, 10) } : {}),
    ...(input.extra ?? {}),
  };
  const row = await prisma.workAgentInbox.create({
    data: {
      agentId: input.agentId, projectId: input.projectId, issueId: input.issueId ?? null, type: input.type,
      payload: payload as Prisma.InputJsonValue, createdAt: at, delivery: wants ? 'PENDING' : 'SKIPPED', nextTryAt: wants ? at : null,
    },
  });
  agentBus.emit(`agent:${input.agentId}`, row);
  // Đợt 3C: kênh chung cho người nghe trong tiến trình (agent BUILTIN tự xếp lượt chạy khi được giao — builtinAgent.service).
  agentBus.emit('inbox', row, input.actor ?? null);
  return row;
}

// ─── Đọc / ack ───────────────────────────────────────────────────

/** Hộp thư của chính agent (token agent): id > after, lọc theo phạm vi dự án của token. */
export async function listInbox(agentId: number, q: { after?: number; limit?: number; projectIds?: number[] | null }) {
  const limit = Math.min(Math.max(q.limit ?? 100, 1), 200);
  const rows = await prisma.workAgentInbox.findMany({
    where: { agentId, id: { gt: q.after ?? 0 }, ...(q.projectIds ? { projectId: { in: q.projectIds } } : {}) },
    orderBy: { id: 'asc' },
    take: limit,
    select: { id: true, type: true, projectId: true, issueId: true, payload: true, createdAt: true, ackedAt: true },
  });
  return { events: rows, lastId: rows.length ? rows[rows.length - 1].id : (q.after ?? 0) };
}

/** Chỉ để UI "agent đã đọc" — không ảnh hưởng gửi lại webhook. */
export async function ackInbox(agentId: number, lastId: number) {
  const r = await prisma.workAgentInbox.updateMany({ where: { agentId, id: { lte: lastId }, ackedAt: null }, data: { ackedAt: new Date() } });
  return { acked: r.count };
}

// ─── Listener ────────────────────────────────────────────────────

const REVIEW_NAME = /review|qa|verify|kiểm|duyệt/i;

async function handle(e: WorkEvent): Promise<void> {
  const agents = await agentsByUser();
  if (!agents.size) return;
  const actorUserId = e.actor.userId;
  // Chống tự kích: agent không nhận sự kiện của chính nó.
  const target = (userId: number | null | undefined): AgentLite | null => {
    if (!userId || userId === actorUserId) return null;
    return agents.get(userId) ?? null;
  };
  const actor = { userId: actorUserId, kind: e.actor.kind };

  if (e.type === 'issue.created') {
    const i = await prisma.workIssue.findUnique({ where: { id: e.issueId }, select: { assigneeId: true } });
    const a = target(i?.assigneeId);
    if (a) await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'issue.assigned', summary: 'A new issue was assigned to you', actor });
    return;
  }

  if (e.type === 'issue.updated') {
    const assign = e.changes.find((c) => c.field === 'assigneeId');
    if (assign?.to) {
      const a = target(Number(assign.to));
      if (a) await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'issue.assigned', summary: 'This issue was assigned to you', actor, changes: [assign] });
    }
    const status = e.changes.find((c) => c.field === 'statusId');
    const flag = e.changes.find((c) => c.field === 'flagged');
    if ((status || flag) && e.actor.kind === 'USER') {
      const i = await prisma.workIssue.findUnique({ where: { id: e.issueId }, select: { assigneeId: true } });
      const a = target(i?.assigneeId);
      if (a && status?.from && status.to) {
        const sts = await prisma.workStatus.findMany({ where: { id: { in: [Number(status.from), Number(status.to)] } }, select: { id: true, name: true, category: true } });
        const from = sts.find((s) => s.id === Number(status.from));
        const to = sts.find((s) => s.id === Number(status.to));
        const fromReview = from && (from.category === 'DONE' || (from.category === 'IN_PROGRESS' && REVIEW_NAME.test(from.name)));
        const toWork = to && (to.category === 'TODO' || (to.category === 'IN_PROGRESS' && !REVIEW_NAME.test(to.name)));
        if (fromReview && toWork) {
          const last = await prisma.workComment.findFirst({ where: { issueId: e.issueId, deletedAt: null }, orderBy: { id: 'desc' }, select: { id: true } });
          await recordInbox({
            agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'issue.returned',
            summary: `Returned from ${from!.name} to ${to!.name}`, actor, changes: [status], extra: { lastCommentId: last?.id ?? null },
          });
        }
      }
      if (a && flag) {
        await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'issue.flag', summary: flag.to === 'true' ? 'This issue was flagged as blocked' : 'The blocked flag was removed', actor, changes: [flag] });
      }
    }
    return;
  }

  if (e.type === 'comment.created') {
    const c = await prisma.workComment.findUnique({
      where: { id: e.commentId },
      select: { authorId: true, bodyJson: true, issue: { select: { assigneeId: true } } },
    });
    if (!c) return;
    const { mentionedUserIds } = await import('./notify.js');
    const mentioned = new Set<number>();
    for (const uid of mentionedUserIds(c.bodyJson)) {
      const a = uid !== c.authorId ? target(uid) : null;
      if (!a) continue;
      mentioned.add(uid);
      await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'comment.mention', summary: 'You were mentioned in a comment', actor, extra: { commentId: e.commentId } });
    }
    // Thẻ của agent (được giao, hoặc đang giữ lease) — trừ khi đã báo mention cho chính agent đó.
    const holders = new Set<number>();
    if (c.issue.assigneeId) holders.add(c.issue.assigneeId);
    const leases = await prisma.workAgentLease.findMany({ where: { issueId: e.issueId, status: 'ACTIVE' }, select: { agent: { select: { userId: true } } } });
    for (const l of leases) holders.add(l.agent.userId);
    for (const uid of holders) {
      if (mentioned.has(uid) || uid === c.authorId) continue;
      const a = target(uid);
      if (a) await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'comment.on_my_issue', summary: 'New comment on your issue', actor, extra: { commentId: e.commentId } });
    }
    return;
  }

  if (e.type === 'handoff.updated' && e.status === 'PENDING') {
    const h = await prisma.workHandoff.findUnique({ where: { id: e.handoffId }, select: { toUserId: true } });
    const a = target(h?.toUserId);
    if (a) await recordInbox({ agentId: a.id, projectId: e.projectId, issueId: e.issueId, type: 'handoff.received', summary: 'An issue was handed off to you', actor, extra: { handoffId: e.handoffId } });
    return;
  }

  if (e.type === 'approval.updated' && (e.status === 'APPROVED' || e.status === 'REJECTED')) {
    const ap = await prisma.workApproval.findUnique({ where: { id: e.approvalId }, select: { createdById: true } });
    const a = target(ap?.createdById);
    if (a) {
      await recordInbox({
        agentId: a.id, projectId: e.projectId, issueId: e.targetIssueId, type: 'approval.decided',
        summary: `Your approval request was ${e.status.toLowerCase()}`, actor, extra: { approvalId: e.approvalId, status: e.status },
      });
    }
  }
}

let registered = false;

/** Gọi một lần lúc khởi động (work.routes.ts import). */
export function registerAgentEvents(): void {
  if (registered) return;
  registered = true;
  onWorkEvent((e) => handle(e).catch((err) => logger.warn('[work] agent inbox: listener lỗi', { type: e.type, err: (err as Error).message })));
}
