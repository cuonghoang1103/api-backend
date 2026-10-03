/**
 * CT Work — BÀN GIAO (lớp studio đợt S1, mô-đun `handoffs`).
 *
 * Một thẻ chuyển từ bộ phận/người này sang bộ phận/người khác kèm checklist
 * bàn giao (Definition of Ready của bên nhận). Vòng đời:
 *   PENDING → ACCEPTED (bên nhận tick đủ checklist, thẻ đổi teamId/assignee QUA
 *             applyIssueChange ⇒ lịch sử thẻ ghi lại như mọi thay đổi khác)
 *           → RETURNED (bên nhận trả lại, BẮT BUỘC có lý do; thẻ giữ nguyên)
 *           → CANCELLED (người gửi / ADMIN rút lại).
 * Mỗi thẻ chỉ một bàn giao đang chờ. Bước gửi/trả lại cũng ghi một dòng lịch sử
 * thẻ (field `handoff`) để dòng thời gian của thẻ kể đủ câu chuyện.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { emitWorkEvent } from './events.js';
import { applyIssueChange, type IssuePatch } from './issueChange.js';
import { notifyWork } from './notify.js';
import { can, canCancelHandoff, canDecideHandoff, loadProjectAccess, requireProject } from './permissions.js';
import { assertModule } from './studio.js';
import { teamLeadIds } from './teams.service.js';

const MAX_CHECKLIST = 30;

export interface ChecklistItem { text: string; done: boolean }

export const HANDOFF_SELECT = {
  id: true, projectId: true, issueId: true, fromTeamId: true, fromUserId: true, toTeamId: true, toUserId: true,
  checklist: true, note: true, status: true, returnReason: true, createdById: true, decidedById: true, createdAt: true, decidedAt: true,
  issue: { select: { number: true, title: true } },
  fromTeam: { select: { id: true, key: true, name: true, color: true } },
  toTeam: { select: { id: true, key: true, name: true, color: true } },
  fromUser: { select: PUBLIC_USER },
  toUser: { select: PUBLIC_USER },
  createdBy: { select: PUBLIC_USER },
} satisfies Prisma.WorkHandoffSelect;

type HandoffRow = Prisma.WorkHandoffGetPayload<{ select: typeof HANDOFF_SELECT }>;

function cleanChecklist(raw: unknown): ChecklistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => ({ text: String((x as { text?: unknown })?.text ?? '').trim().slice(0, 300), done: (x as { done?: unknown })?.done === true }))
    .filter((x) => x.text)
    .slice(0, MAX_CHECKLIST);
}

async function present(h: HandoffRow, viewerId: number, role: Parameters<typeof canDecideHandoff>[0], projectKey: string) {
  const leads = await teamLeadIds(h.toTeamId);
  return {
    ...h,
    checklist: cleanChecklist(h.checklist),
    issueKey: `${projectKey}-${h.issue.number}`,
    canDecide: h.status === 'PENDING' && canDecideHandoff(role, viewerId, { toUserId: h.toUserId, toTeamLeadIds: leads }),
    canCancel: h.status === 'PENDING' && canCancelHandoff(role, viewerId, h.createdById),
  };
}

async function requireHandoffs(userId: number, projectId: number, action: 'project.view' | 'handoff.create') {
  const access = await requireProject(userId, projectId, action);
  assertModule(access, 'handoffs');
  return access;
}

async function issueByNumber(projectId: number, number: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true, title: true, teamId: true, assigneeId: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

async function issueUrl(projectId: number, number: number) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  return { key: `${p.key}-${number}`, url: `/work/${p.workspace.slug}/${p.key}/issue/${number}` };
}

async function tell(receivers: number[], senderId: number, issueId: number, projectId: number, number: number, title: string, message: string, handoffId: number) {
  try {
    const ref = await issueUrl(projectId, number);
    for (const r of [...new Set(receivers)]) {
      if (!(await loadProjectAccess(r, projectId))) continue;
      await notifyWork({
        receiverId: r, senderId, type: 'WORK_ALERT', entityId: issueId,
        payload: { issueKey: ref.key, title, message, url: ref.url, handoffId },
      });
    }
  } catch (err) {
    logger.warn('[work] báo bàn giao lỗi', { handoffId, err: (err as Error).message });
  }
}

async function getHandoffRow(projectId: number, handoffId: number) {
  const h = await prisma.workHandoff.findFirst({ where: { id: handoffId, projectId }, select: HANDOFF_SELECT });
  if (!h) throw new NotFoundError('Handoff not found');
  return h;
}

async function label(teamId: number | null, userId: number | null) {
  const [t, u] = await Promise.all([
    teamId ? prisma.workTeam.findUnique({ where: { id: teamId }, select: { key: true } }) : null,
    userId ? prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true } }) : null,
  ]);
  return [t?.key, u ? displayName(u) : null].filter(Boolean).join(' / ') || '—';
}

// ─── Tạo ─────────────────────────────────────────────────────────

export async function createHandoff(
  userId: number, projectId: number, number: number,
  input: { toTeamId?: number | null; toUserId?: number | null; checklist?: Array<{ text: string; done?: boolean }>; note?: string | null },
) {
  const access = await requireHandoffs(userId, projectId, 'handoff.create');
  const toTeamId = input.toTeamId ?? null;
  const toUserId = input.toUserId ?? null;
  if (!toTeamId && !toUserId) throw new BadRequestError('Hand off to a team, a person, or both', 'WORK_HANDOFF_TARGET');
  if (toTeamId) {
    assertModule(access, 'teams');
    const t = await prisma.workTeam.findFirst({ where: { id: toTeamId, workspaceId: access.workspaceId, archivedAt: null }, select: { id: true } });
    if (!t) throw new BadRequestError('Team not found in this workspace', 'WORK_BAD_TEAM');
  }
  if (toUserId) {
    const a = await loadProjectAccess(toUserId, projectId);
    if (!a || !can(a.role, 'issue.edit')) throw new BadRequestError('This person cannot take over issues in this project', 'WORK_BAD_ASSIGNEE');
  }
  const issue = await issueByNumber(projectId, number);
  if ((toTeamId === null || toTeamId === issue.teamId) && (toUserId === null || toUserId === issue.assigneeId)) {
    throw new BadRequestError('The issue already belongs to that team/person', 'WORK_HANDOFF_SAME');
  }
  const checklist = cleanChecklist(input.checklist ?? []);
  const h = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issue.id} FOR UPDATE`;
    const open = await tx.workHandoff.count({ where: { issueId: issue.id, status: 'PENDING' } });
    if (open) throw new ConflictError('This issue already has a pending handoff');
    const created = await tx.workHandoff.create({
      data: {
        projectId, issueId: issue.id, fromTeamId: issue.teamId, fromUserId: issue.assigneeId, toTeamId, toUserId,
        checklist: checklist as unknown as Prisma.InputJsonValue, note: input.note?.trim().slice(0, 5000) || null, createdById: userId,
      },
      select: { id: true },
    });
    await tx.workHistory.create({
      data: { issueId: issue.id, actorId: userId, actorKind: 'USER', field: 'handoff', fromValue: await label(issue.teamId, issue.assigneeId), toValue: `PENDING → ${await label(toTeamId, toUserId)}` },
    });
    return created;
  });
  emitWorkEvent({ type: 'handoff.updated', projectId, handoffId: h.id, issueId: issue.id, status: 'PENDING', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'handoff.create', targetType: 'issue', targetId: issue.id, summary: `Handed off ${access.key}-${issue.number} to ${await label(toTeamId, toUserId)}` });
  const receivers = toUserId ? [toUserId, ...(await teamLeadIds(toTeamId))] : await teamLeadIds(toTeamId);
  await tell(receivers, userId, issue.id, projectId, issue.number, issue.title, `Handoff waiting for you to accept: ${issue.title}`, h.id);
  return present(await getHandoffRow(projectId, h.id), userId, access.role, access.key);
}

// ─── Đọc ─────────────────────────────────────────────────────────

export async function listIssueHandoffs(userId: number, projectId: number, number: number) {
  const access = await requireHandoffs(userId, projectId, 'project.view');
  const issue = await issueByNumber(projectId, number);
  const rows = await prisma.workHandoff.findMany({ where: { issueId: issue.id }, orderBy: { id: 'desc' }, take: 100, select: HANDOFF_SELECT });
  return Promise.all(rows.map((h) => present(h, userId, access.role, access.key)));
}

export async function listProjectHandoffs(userId: number, projectId: number, q: { status?: string; limit?: number }) {
  const access = await requireHandoffs(userId, projectId, 'project.view');
  const rows = await prisma.workHandoff.findMany({
    where: { projectId, ...(q.status ? { status: q.status } : {}) },
    orderBy: { id: 'desc' },
    take: Math.min(Math.max(q.limit ?? 50, 1), 200),
    select: HANDOFF_SELECT,
  });
  return Promise.all(rows.map((h) => present(h, userId, access.role, access.key)));
}

/** Bàn giao đang chờ TÔI nhận (đích danh, hoặc tôi là trưởng bộ phận nhận) — mọi dự án. */
export async function myPendingHandoffs(userId: number) {
  const leadOf = (await prisma.workTeamMember.findMany({ where: { userId, role: 'LEAD' }, select: { teamId: true } })).map((m) => m.teamId);
  const rows = await prisma.workHandoff.findMany({
    where: {
      status: 'PENDING', project: { deletedAt: null, workspace: { deletedAt: null } },
      OR: [{ toUserId: userId }, ...(leadOf.length ? [{ toTeamId: { in: leadOf } }] : [])],
    },
    orderBy: { id: 'asc' },
    take: 200,
    select: { ...HANDOFF_SELECT, project: { select: { id: true, key: true, name: true, settings: true, workspace: { select: { slug: true } } } } },
  });
  const out = [];
  for (const r of rows) {
    const { project, ...h } = r;
    const access = await loadProjectAccess(userId, project.id);
    if (!access || !access.modules.handoffs) continue;
    const p = await present(h, userId, access.role, project.key);
    if (!p.canDecide) continue;
    out.push({ ...p, project: { id: project.id, key: project.key, name: project.name, workspaceSlug: project.workspace.slug } });
  }
  return out;
}

// ─── Nhận / trả / huỷ ────────────────────────────────────────────

/** Khoá bàn giao còn PENDING cho người quyết; trả bản ghi để xử lý tiếp. */
async function claimForDecision(userId: number, projectId: number, handoffId: number) {
  const access = await requireHandoffs(userId, projectId, 'project.view');
  const h = await getHandoffRow(projectId, handoffId);
  if (h.status !== 'PENDING') throw new ConflictError(`This handoff is already ${h.status.toLowerCase()}`);
  const leads = await teamLeadIds(h.toTeamId);
  if (!canDecideHandoff(access.role, userId, { toUserId: h.toUserId, toTeamLeadIds: leads })) {
    throw new ForbiddenError('Only the receiving person, the receiving team lead or a project admin can accept or return this handoff');
  }
  return { access, h };
}

/**
 * Nhận bàn giao: checklist phải tick đủ (gửi kèm `checklist` = trạng thái tick
 * mới theo đúng thứ tự). Thẻ đổi bộ phận/người làm QUA applyIssueChange:
 *   - có toUser ⇒ người làm = toUser;
 *   - chỉ có toTeam ⇒ người làm để TRỐNG, trưởng bộ phận giao từ hàng đợi.
 */
export async function acceptHandoff(userId: number, projectId: number, handoffId: number, input: { checklist?: boolean[] } = {}) {
  const { access, h } = await claimForDecision(userId, projectId, handoffId);
  const items = cleanChecklist(h.checklist).map((it, i) => ({ ...it, done: input.checklist?.[i] ?? it.done }));
  const missing = items.filter((it) => !it.done);
  if (missing.length) {
    throw new BadRequestError(`Tick every handoff checklist item before accepting (${missing.length} left: ${missing.slice(0, 3).map((m) => m.text).join('; ')})`, 'WORK_HANDOFF_CHECKLIST');
  }
  // Đổi trạng thái trước (có điều kiện PENDING ⇒ hai người bấm cùng lúc chỉ một người thắng).
  const won = await prisma.workHandoff.updateMany({
    where: { id: handoffId, status: 'PENDING' },
    data: { status: 'ACCEPTED', decidedById: userId, decidedAt: new Date(), checklist: items as unknown as Prisma.InputJsonValue },
  });
  if (!won.count) throw new ConflictError('Someone else just decided on this handoff');
  const patch: IssuePatch = {};
  if (h.toTeamId) patch.teamId = h.toTeamId;
  patch.assigneeId = h.toUserId ?? (h.toTeamId ? null : undefined);
  if (patch.assigneeId === undefined) delete patch.assigneeId;
  try {
    await applyIssueChange(h.issueId, patch, { kind: 'USER', userId });
  } catch (err) {
    // Thẻ không đổi được (vd người nhận vừa mất quyền) ⇒ trả bàn giao về chờ, báo lỗi gốc.
    await prisma.workHandoff.update({ where: { id: handoffId }, data: { status: 'PENDING', decidedById: null, decidedAt: null } });
    throw err;
  }
  emitWorkEvent({ type: 'handoff.updated', projectId, handoffId, issueId: h.issueId, status: 'ACCEPTED', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'handoff.accept', targetType: 'issue', targetId: h.issueId, summary: `Accepted handoff of ${access.key}-${h.issue.number}` });
  if (h.createdById) await tell([h.createdById], userId, h.issueId, projectId, h.issue.number, h.issue.title, `Handoff accepted: ${h.issue.title}`, handoffId);
  return present(await getHandoffRow(projectId, handoffId), userId, access.role, access.key);
}

export async function returnHandoff(userId: number, projectId: number, handoffId: number, input: { reason: string }) {
  const reason = input.reason?.trim() ?? '';
  if (reason.length < 3) throw new BadRequestError('Say why you are returning this handoff', 'WORK_HANDOFF_REASON');
  const { access, h } = await claimForDecision(userId, projectId, handoffId);
  const won = await prisma.$transaction(async (tx) => {
    const r = await tx.workHandoff.updateMany({
      where: { id: handoffId, status: 'PENDING' },
      data: { status: 'RETURNED', returnReason: reason.slice(0, 5000), decidedById: userId, decidedAt: new Date() },
    });
    if (r.count) {
      await tx.workHistory.create({ data: { issueId: h.issueId, actorId: userId, actorKind: 'USER', field: 'handoff', fromValue: 'PENDING', toValue: `RETURNED — ${reason.slice(0, 400)}` } });
    }
    return r.count;
  });
  if (!won) throw new ConflictError('Someone else just decided on this handoff');
  emitWorkEvent({ type: 'handoff.updated', projectId, handoffId, issueId: h.issueId, status: 'RETURNED', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'handoff.return', targetType: 'issue', targetId: h.issueId, summary: `Returned handoff of ${access.key}-${h.issue.number}: ${reason.slice(0, 200)}` });
  if (h.createdById) await tell([h.createdById], userId, h.issueId, projectId, h.issue.number, h.issue.title, `Handoff returned: ${reason.slice(0, 120)}`, handoffId);
  return present(await getHandoffRow(projectId, handoffId), userId, access.role, access.key);
}

export async function cancelHandoff(userId: number, projectId: number, handoffId: number) {
  const access = await requireHandoffs(userId, projectId, 'project.view');
  const h = await getHandoffRow(projectId, handoffId);
  if (!canCancelHandoff(access.role, userId, h.createdById)) throw new ForbiddenError('Only the sender or a project admin can cancel this handoff');
  const r = await prisma.workHandoff.updateMany({ where: { id: handoffId, status: 'PENDING' }, data: { status: 'CANCELLED', decidedById: userId, decidedAt: new Date() } });
  if (!r.count) throw new ConflictError(`This handoff is already ${h.status.toLowerCase()}`);
  emitWorkEvent({ type: 'handoff.updated', projectId, handoffId, issueId: h.issueId, status: 'CANCELLED', actor: { kind: 'USER', userId } });
  return present(await getHandoffRow(projectId, handoffId), userId, access.role, access.key);
}
