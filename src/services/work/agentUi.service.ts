/**
 * CT Work — dữ liệu ĐỌC cho giao diện AI agent (CTW-28 GĐ1 A13–A14, phần FE). Tách khỏi agents.service.ts (đang có
 * phiên khác sửa phần chi phí/MCP) để không giẫm nhau. Chỉ đọc, không ghi gì.
 *
 *   projectLeases      — chip "🤖 working · 72%" trên board/backlog/list: lease ACTIVE + lease EXPIRED ≤ 24 giờ của thẻ
 *                        chưa có lease mới (chip đỏ). Khách bị cách ly ⇒ [] (cổng khách không bao giờ lộ agent).
 *   (khối "Agent activity" + chi phí trên thẻ = GET …/issues/:num/agent-activity của phiên BE — agents.service.ts.)
 *   agentsNeedMe       — My Work của owner: thẻ của agent mình đang chờ duyệt (cột review), lease hết hạn còn cờ
 *                        Blocked, phê duyệt agent mình gửi còn chờ.
 */

import { prisma } from '../../config/database.js';
import { PUBLIC_USER } from './common.js';
import { isClientScoped, requireProject } from './permissions.js';
import { getAgent } from './agents.service.js';

const DAY = 86_400_000;
const REVIEW_NAME = /review|qa|verify|kiểm|duyệt/i;

export interface LeaseChip {
  issueId: number;
  leaseId: number;
  status: 'ACTIVE' | 'EXPIRED';
  progress: string | null;
  progressPct: number | null;
  heartbeatAt: Date;
  expiresAt: Date;
  agentUserId: number;
}

export async function projectLeases(userId: number, projectId: number): Promise<LeaseChip[]> {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access)) return [];
  const since = new Date(Date.now() - DAY);
  const rows = await prisma.workAgentLease.findMany({
    where: { projectId, OR: [{ status: 'ACTIVE' }, { status: 'EXPIRED', releasedAt: { gte: since } }] },
    orderBy: { id: 'desc' },
    take: 500,
    select: { id: true, issueId: true, status: true, progress: true, progressPct: true, heartbeatAt: true, expiresAt: true, agent: { select: { userId: true } } },
  });
  // Mỗi thẻ một chip: lease mới nhất thắng (ACTIVE mới hơn EXPIRED cũ ⇒ chip xanh).
  const seen = new Set<number>();
  const out: LeaseChip[] = [];
  for (const r of rows) {
    if (seen.has(r.issueId)) continue;
    seen.add(r.issueId);
    out.push({
      issueId: r.issueId, leaseId: r.id, status: r.status === 'ACTIVE' ? 'ACTIVE' : 'EXPIRED',
      progress: r.progress, progressPct: r.progressPct, heartbeatAt: r.heartbeatAt, expiresAt: r.expiresAt, agentUserId: r.agent.userId,
    });
  }
  return out;
}

/** "My agents need you" (My Work): chỉ agent mình là owner, chưa RETIRED. Rỗng ⇒ { agents: [] } — UI tự ẩn. */
export async function agentsNeedMe(userId: number) {
  const mine = await prisma.workAgent.findMany({
    where: { ownerId: userId, status: { not: 'RETIRED' } },
    select: { id: true, userId: true, status: true, model: true, workspace: { select: { slug: true, deletedAt: true } }, user: { select: PUBLIC_USER } },
  });
  const live = mine.filter((a) => !a.workspace.deletedAt);
  if (!live.length) return { agents: [], review: [], expired: [], approvals: [] };
  const agentUserIds = live.map((a) => a.userId);
  const since = new Date(Date.now() - 7 * DAY);

  const issueSel = {
    id: true, number: true, title: true, assigneeId: true, flaggedAt: true, flagReason: true, updatedAt: true,
    status: { select: { id: true, name: true, category: true, color: true } },
    project: { select: { id: true, key: true, name: true, settings: true, workspace: { select: { slug: true } } } },
  } as const;

  const [openIssues, expiredLeases, approvals] = await Promise.all([
    prisma.workIssue.findMany({
      where: { assigneeId: { in: agentUserIds }, deletedAt: null, resolvedAt: null, status: { category: 'IN_PROGRESS' }, project: { deletedAt: null, archivedAt: null } },
      orderBy: { updatedAt: 'desc' },
      take: 200,
      select: issueSel,
    }),
    prisma.workAgentLease.findMany({
      where: { agent: { ownerId: userId }, status: 'EXPIRED', releasedAt: { gte: since } },
      orderBy: { id: 'desc' },
      take: 50,
      select: { id: true, releasedAt: true, issueId: true, agent: { select: { userId: true } } },
    }),
    prisma.workApproval.findMany({
      where: { createdById: { in: agentUserIds }, status: 'PENDING', project: { deletedAt: null } },
      orderBy: { id: 'desc' },
      take: 50,
      select: { id: true, title: true, createdAt: true, createdById: true, targetType: true, issue: { select: { number: true } }, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } },
    }),
  ]);

  const url = (slug: string, key: string, n: number) => `/work/${slug}/${key}/issue/${n}`;
  // Thẻ ở cột review: cột chỉ định trong settings.agents.reviewStatusId, hoặc tên khớp review/qa/verify.
  const review = openIssues.filter((i) => {
    const rid = ((i.project.settings as Record<string, unknown> | null)?.agents as { reviewStatusId?: number } | undefined)?.reviewStatusId;
    return rid ? i.status.id === rid : REVIEW_NAME.test(i.status.name);
  }).slice(0, 50).map((i) => ({
    key: `${i.project.key}-${i.number}`, title: i.title, url: url(i.project.workspace.slug, i.project.key, i.number),
    status: { name: i.status.name, category: i.status.category, color: i.status.color }, agentUserId: i.assigneeId, project: { key: i.project.key, name: i.project.name }, updatedAt: i.updatedAt,
  }));

  const expiredIssueIds = [...new Set(expiredLeases.map((l) => l.issueId))];
  const expiredIssues = expiredIssueIds.length ? await prisma.workIssue.findMany({
    where: { id: { in: expiredIssueIds }, deletedAt: null, resolvedAt: null, flaggedAt: { not: null } },
    select: issueSel,
  }) : [];
  const stillActive = expiredIssueIds.length ? new Set((await prisma.workAgentLease.findMany({ where: { issueId: { in: expiredIssueIds }, status: 'ACTIVE' }, select: { issueId: true } })).map((l) => l.issueId)) : new Set<number>();
  const issueById = new Map(expiredIssues.map((i) => [i.id, i]));
  const expired: Array<{ key: string; title: string; url: string; agentUserId: number; expiredAt: Date | null; flagReason: string | null }> = [];
  const seen = new Set<number>();
  for (const l of expiredLeases) {
    const i = issueById.get(l.issueId);
    if (!i || seen.has(l.issueId) || stillActive.has(l.issueId)) continue;
    seen.add(l.issueId);
    expired.push({ key: `${i.project.key}-${i.number}`, title: i.title, url: url(i.project.workspace.slug, i.project.key, i.number), agentUserId: l.agent.userId, expiredAt: l.releasedAt, flagReason: i.flagReason });
  }

  return {
    agents: live.map((a) => ({ id: a.id, userId: a.userId, status: a.status, model: a.model, workspaceSlug: a.workspace.slug, user: { ...a.user, kind: 'AGENT' } })),
    review,
    expired,
    approvals: approvals.map((a) => ({
      id: a.id, title: a.title, createdAt: a.createdAt, agentUserId: a.createdById, targetType: a.targetType,
      project: { key: a.project.key, name: a.project.name },
      url: a.issue ? url(a.project.workspace.slug, a.project.key, a.issue.number) : `/work/${a.project.workspace.slug}/${a.project.key}/approvals`,
    })),
  };
}

/**
 * Trang chi tiết agent: lease đang giữ + 10 lease gần nhất KÈM mã/tiêu đề thẻ (getAgent chỉ có issueId).
 * Quyền = quyền xem agent (getAgent tự kiểm: người trong không gian, không phải khách, không phải token agent).
 */
export async function agentLeasesDetail(callerId: number, workspaceId: number, agentId: number) {
  await getAgent(callerId, workspaceId, agentId);
  const rows = await prisma.workAgentLease.findMany({
    where: { agentId },
    orderBy: [{ status: 'asc' }, { id: 'desc' }],
    take: 20,
    select: { id: true, status: true, claimedAt: true, heartbeatAt: true, expiresAt: true, releasedAt: true, progress: true, progressPct: true, issueId: true },
  });
  const issues = rows.length ? await prisma.workIssue.findMany({
    where: { id: { in: [...new Set(rows.map((r) => r.issueId))] } },
    select: { id: true, number: true, title: true, deletedAt: true, project: { select: { key: true, workspace: { select: { slug: true } } } } },
  }) : [];
  const byId = new Map(issues.map((i) => [i.id, i]));
  const active = rows.filter((r) => r.status === 'ACTIVE');
  const recent = rows.filter((r) => r.status !== 'ACTIVE').slice(0, 10);
  return [...active, ...recent].map((r) => {
    const i = byId.get(r.issueId);
    return {
      ...r,
      issue: i && !i.deletedAt ? { key: `${i.project.key}-${i.number}`, title: i.title, url: `/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}` } : null,
    };
  });
}
