/**
 * CT Work — BỘ PHẬN (lớp studio đợt S1, mô-đun `teams`).
 *
 * Bộ phận ở cấp KHÔNG GIAN: một bộ phận (vd QA) phục vụ nhiều dự án, nên
 * hàng đợi của bộ phận gom thẻ từ mọi dự án người xem vào được và đang BẬT
 * mô-đun teams. Quyền:
 *   - tạo/sửa/xoá bộ phận, đổi thành viên: OWNER/ADMIN không gian (workspace.teams);
 *   - xem bộ phận + hàng đợi: thành viên không gian (khách GUEST thì không);
 *   - giao việc trong hàng đợi: người sửa được thẻ HOẶC trưởng bộ phận
 *     (canAssignTeamIssue) — thay đổi đi qua applyIssueChange như mọi nơi khác.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { audit } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { TEAM_KEY_RE, type TeamRole } from './constants.js';
import { applyIssueChange } from './issueChange.js';
import { CARD_SELECT, toCard } from './issues.service.js';
import { canAssignTeamIssue, loadProjectAccess, loadWorkspaceRole, requireWorkspace } from './permissions.js';
import { modulesOf } from './studio.js';

const MAX_TEAMS_PER_WORKSPACE = 60;
const MAX_MEMBERS_PER_TEAM = 200;

const TEAM_SELECT = {
  id: true, workspaceId: true, key: true, name: true, color: true, description: true, archivedAt: true, createdAt: true,
  members: { orderBy: [{ role: 'asc' }, { id: 'asc' }], select: { role: true, user: { select: PUBLIC_USER } } },
} satisfies Prisma.WorkTeamSelect;

type TeamRow = Prisma.WorkTeamGetPayload<{ select: typeof TEAM_SELECT }>;

function shape(t: TeamRow, openIssues = 0) {
  const { members, ...rest } = t;
  return {
    ...rest,
    members: members.map((m) => ({ ...m.user, teamRole: m.role as TeamRole })),
    leadIds: members.filter((m) => m.role === 'LEAD').map((m) => m.user.id),
    openIssues,
  };
}

/** Người được vào bộ phận: thành viên không gian, KHÔNG phải khách. */
async function assertTeamEligible(workspaceId: number, userIds: number[]) {
  if (!userIds.length) return;
  const rows = await prisma.workMember.findMany({ where: { workspaceId, userId: { in: userIds } }, select: { userId: true, role: true } });
  for (const uid of userIds) {
    const r = rows.find((x) => x.userId === uid);
    if (!r) throw new BadRequestError('Invite this person to the workspace first', 'WORK_NOT_IN_WORKSPACE');
    if (r.role === 'GUEST') throw new BadRequestError('Guests (clients, teachers) cannot join a team', 'WORK_BAD_TEAM_MEMBER');
  }
}

async function findTeam(workspaceId: number, teamId: number) {
  const t = await prisma.workTeam.findFirst({ where: { id: teamId, workspaceId }, select: TEAM_SELECT });
  if (!t) throw new NotFoundError('Team not found');
  return t;
}

/** Xem bộ phận: thành viên không gian trừ khách. */
async function requireTeamViewer(userId: number, workspaceId: number) {
  const role = await requireWorkspace(userId, workspaceId, 'workspace.view');
  if (role === 'GUEST') throw new ForbiddenError('Guests cannot see the workspace teams');
  return role;
}

export async function listTeams(userId: number, workspaceId: number, opts: { includeArchived?: boolean } = {}) {
  await requireTeamViewer(userId, workspaceId);
  const teams = await prisma.workTeam.findMany({
    where: { workspaceId, ...(opts.includeArchived ? {} : { archivedAt: null }) },
    orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { name: 'asc' }],
    select: TEAM_SELECT,
  });
  const counts = teams.length
    ? await prisma.workIssue.groupBy({
      by: ['teamId'],
      where: { teamId: { in: teams.map((t) => t.id) }, deletedAt: null, resolvedAt: null, project: { deletedAt: null } },
      _count: { _all: true },
    })
    : [];
  return teams.map((t) => shape(t, counts.find((c) => c.teamId === t.id)?._count._all ?? 0));
}

export async function getTeam(userId: number, workspaceId: number, teamId: number) {
  await requireTeamViewer(userId, workspaceId);
  return shape(await findTeam(workspaceId, teamId));
}

export interface TeamInput {
  key: string;
  name: string;
  color?: string;
  description?: string | null;
  leadIds?: number[];
  memberIds?: number[];
}

export async function createTeam(userId: number, workspaceId: number, input: TeamInput) {
  await requireWorkspace(userId, workspaceId, 'workspace.teams');
  const key = input.key.trim().toUpperCase();
  if (!TEAM_KEY_RE.test(key)) throw new BadRequestError('Team key must be 2–16 capital letters, digits or _ and start with a letter (e.g. QA)', 'WORK_BAD_TEAM_KEY');
  const name = input.name.trim().slice(0, 80);
  if (!name) throw new BadRequestError('Team name is required', 'WORK_NAME_REQUIRED');
  const count = await prisma.workTeam.count({ where: { workspaceId } });
  if (count >= MAX_TEAMS_PER_WORKSPACE) throw new BadRequestError('This workspace has too many teams', 'WORK_LIMIT');
  const leads = [...new Set(input.leadIds ?? [])];
  const members = [...new Set(input.memberIds ?? [])].filter((id) => !leads.includes(id));
  await assertTeamEligible(workspaceId, [...leads, ...members]);
  try {
    const t = await prisma.workTeam.create({
      data: {
        workspaceId, key, name, color: input.color ?? '#64748b', description: input.description?.trim() || null,
        members: { create: [...leads.map((u) => ({ userId: u, role: 'LEAD' })), ...members.map((u) => ({ userId: u, role: 'MEMBER' }))] },
      },
      select: TEAM_SELECT,
    });
    await audit({ workspaceId, actorId: userId, action: 'team.create', targetType: 'team', targetId: t.id, summary: `Created team ${t.key} — ${t.name}` });
    return shape(t);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError(`Team key ${key} is already used in this workspace`);
    throw err;
  }
}

export async function updateTeam(
  userId: number, workspaceId: number, teamId: number,
  input: { name?: string; color?: string; description?: string | null; archived?: boolean },
) {
  await requireWorkspace(userId, workspaceId, 'workspace.teams');
  await findTeam(workspaceId, teamId);
  const data: Prisma.WorkTeamUpdateInput = {};
  if (input.name !== undefined) {
    const n = input.name.trim().slice(0, 80);
    if (!n) throw new BadRequestError('Team name is required', 'WORK_NAME_REQUIRED');
    data.name = n;
  }
  if (input.color !== undefined) data.color = input.color;
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.archived !== undefined) data.archivedAt = input.archived ? new Date() : null;
  const t = await prisma.workTeam.update({ where: { id: teamId }, data, select: TEAM_SELECT });
  if (input.archived !== undefined) {
    await audit({ workspaceId, actorId: userId, action: input.archived ? 'team.archive' : 'team.unarchive', targetType: 'team', targetId: teamId, summary: `${input.archived ? 'Archived' : 'Unarchived'} team ${t.key}` });
  }
  return shape(t);
}

/** Xoá hẳn: thẻ của bộ phận về "chưa có bộ phận" (FK SET NULL). Muốn giữ lịch sử thì lưu trữ. */
export async function deleteTeam(userId: number, workspaceId: number, teamId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.teams');
  const t = await findTeam(workspaceId, teamId);
  await prisma.workTeam.delete({ where: { id: teamId } });
  await audit({ workspaceId, actorId: userId, action: 'team.delete', targetType: 'team', targetId: teamId, summary: `Deleted team ${t.key} — ${t.name}` });
}

export async function setTeamMember(userId: number, workspaceId: number, teamId: number, targetUserId: number, role: TeamRole) {
  await requireWorkspace(userId, workspaceId, 'workspace.teams');
  await findTeam(workspaceId, teamId);
  await assertTeamEligible(workspaceId, [targetUserId]);
  const n = await prisma.workTeamMember.count({ where: { teamId } });
  const exists = await prisma.workTeamMember.findUnique({ where: { uk_work_team_member: { teamId, userId: targetUserId } }, select: { id: true } });
  if (!exists && n >= MAX_MEMBERS_PER_TEAM) throw new BadRequestError('This team has too many members', 'WORK_LIMIT');
  await prisma.workTeamMember.upsert({
    where: { uk_work_team_member: { teamId, userId: targetUserId } },
    create: { teamId, userId: targetUserId, role },
    update: { role },
  });
  return shape(await findTeam(workspaceId, teamId));
}

export async function removeTeamMember(userId: number, workspaceId: number, teamId: number, targetUserId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.teams');
  await findTeam(workspaceId, teamId);
  const r = await prisma.workTeamMember.deleteMany({ where: { teamId, userId: targetUserId } });
  if (!r.count) throw new NotFoundError('This person is not in the team');
  return shape(await findTeam(workspaceId, teamId));
}

/** Người này có phải trưởng bộ phận `teamId` không (và còn là thành viên không-khách của không gian). */
export async function isTeamLead(userId: number, teamId: number): Promise<boolean> {
  const m = await prisma.workTeamMember.findFirst({
    where: { teamId, userId, role: 'LEAD' },
    select: { team: { select: { workspaceId: true } } },
  });
  if (!m) return false;
  const role = await loadWorkspaceRole(userId, m.team.workspaceId);
  return role !== null && role !== 'GUEST';
}

/** Trưởng bộ phận (id) của một bộ phận — để báo tin và kiểm quyền nhận bàn giao. */
export async function teamLeadIds(teamId: number | null): Promise<number[]> {
  if (!teamId) return [];
  const rows = await prisma.workTeamMember.findMany({ where: { teamId, role: 'LEAD' }, select: { userId: true } });
  return rows.map((r) => r.userId);
}

// ─── Hàng đợi việc của bộ phận ───────────────────────────────────

export interface QueueQuery {
  projectId?: number;
  /** open (mặc định) · done · all */
  status?: 'open' | 'done' | 'all';
  /** true = chỉ thẻ chưa có người làm (việc chờ trưởng bộ phận giao). */
  unassigned?: boolean;
  limit?: number;
  offset?: number;
}

/** Dự án người gọi xem được trong không gian VÀ đang bật mô-đun teams. */
async function queueProjects(userId: number, workspaceId: number): Promise<Map<number, { key: string; name: string }>> {
  const projects = await prisma.workProject.findMany({
    where: { workspaceId, deletedAt: null },
    select: { id: true, key: true, name: true, settings: true },
  });
  const out = new Map<number, { key: string; name: string }>();
  for (const p of projects) {
    if (!modulesOf(p.settings).teams) continue;
    if (await loadProjectAccess(userId, p.id)) out.set(p.id, { key: p.key, name: p.name });
  }
  return out;
}

export async function teamQueue(userId: number, workspaceId: number, teamId: number, q: QueueQuery) {
  await requireTeamViewer(userId, workspaceId);
  const team = await findTeam(workspaceId, teamId);
  const visible = await queueProjects(userId, workspaceId);
  let projectIds = [...visible.keys()];
  if (q.projectId) projectIds = projectIds.filter((id) => id === q.projectId);
  const where: Prisma.WorkIssueWhereInput = {
    teamId, deletedAt: null, projectId: { in: projectIds },
    ...(q.status === 'done' ? { resolvedAt: { not: null } } : q.status === 'all' ? {} : { resolvedAt: null }),
    ...(q.unassigned ? { assigneeId: null } : {}),
  };
  const limit = Math.min(Math.max(q.limit ?? 50, 1), 200);
  const offset = Math.max(q.offset ?? 0, 0);
  const [total, rows] = await Promise.all([
    prisma.workIssue.count({ where }),
    prisma.workIssue.findMany({
      where,
      // Ưu tiên cao trước, rồi hạn gần trước (không hạn xuống cuối), rồi thẻ cũ trước.
      orderBy: [{ priority: 'asc' }, { dueDate: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }],
      skip: offset,
      take: limit,
      select: { ...CARD_SELECT, projectId: true, assignee: { select: PUBLIC_USER } },
    }),
  ]);
  const lead = team.members.some((m) => m.user.id === userId && m.role === 'LEAD');
  return {
    team: shape(team),
    isLead: lead,
    total, limit, offset,
    items: rows.map((r) => {
      const { projectId, assignee, ...card } = r;
      const p = visible.get(projectId)!;
      return { ...toCard(card), projectId, projectKey: p.key, projectName: p.name, key: `${p.key}-${card.number}`, assignee };
    }),
  };
}

/**
 * Giao/bỏ giao một thẻ trong hàng đợi. Trưởng bộ phận làm được kể cả khi vai
 * trong dự án chỉ là VIEWER; người nhận vẫn phải là người được giao việc trong
 * dự án (applyIssueChange kiểm).
 */
export async function assignFromQueue(userId: number, workspaceId: number, teamId: number, issueId: number, assigneeId: number | null) {
  await requireTeamViewer(userId, workspaceId);
  await findTeam(workspaceId, teamId);
  const issue = await prisma.workIssue.findFirst({
    where: { id: issueId, teamId, deletedAt: null, project: { workspaceId, deletedAt: null } },
    select: { id: true, projectId: true, project: { select: { settings: true } } },
  });
  if (!issue) throw new NotFoundError('Issue not found in this team queue');
  const access = await loadProjectAccess(userId, issue.projectId);
  if (!access) throw new NotFoundError('Issue not found in this team queue');
  if (!modulesOf(issue.project.settings).teams) throw new NotFoundError('Issue not found in this team queue');
  if (!canAssignTeamIssue(access.role, await isTeamLead(userId, teamId))) {
    throw new ForbiddenError('Only the team lead or someone who can edit the issue can assign it');
  }
  const { issue: updated } = await applyIssueChange(issueId, { assigneeId }, { kind: 'USER', userId });
  return updated;
}

// ─── Dựng bộ phận theo mẫu (dự án từ phiếu khách) ────────────────

/**
 * Bảo đảm không gian có các bộ phận theo `defs` (khớp theo mã). Bộ phận đã có
 * thì giữ nguyên (kể cả tên đã đổi tay); bộ phận MỚI tạo nhận `leadUserId`
 * làm trưởng để luôn có người nhận việc. Không kiểm quyền — chỉ gọi từ luồng
 * nội bộ đã kiểm (tạo dự án từ phiếu khách bởi admin).
 */
export async function ensureTeams(
  workspaceId: number,
  defs: Array<{ key: string; name: string; color: string; description?: string | null }>,
  leadUserId: number | null,
): Promise<{ byKey: Map<string, number>; created: number }> {
  const byKey = new Map<string, number>();
  let created = 0;
  for (const d of defs) {
    const key = d.key.toUpperCase().slice(0, 16);
    const found = await prisma.workTeam.findUnique({ where: { uk_work_team_key: { workspaceId, key } }, select: { id: true } });
    if (found) { byKey.set(key, found.id); continue; }
    try {
      const t = await prisma.workTeam.create({
        data: {
          workspaceId, key, name: d.name.slice(0, 80), color: d.color, description: d.description ?? null,
          ...(leadUserId ? { members: { create: [{ userId: leadUserId, role: 'LEAD' }] } } : {}),
        },
        select: { id: true },
      });
      byKey.set(key, t.id);
      created++;
    } catch (err) {
      // Hai lượt cùng tạo ⇒ lượt sau lấy bộ phận lượt trước vừa tạo.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const again = await prisma.workTeam.findUnique({ where: { uk_work_team_key: { workspaceId, key } }, select: { id: true } });
        if (again) { byKey.set(key, again.id); continue; }
      }
      throw err;
    }
  }
  return { byKey, created };
}
