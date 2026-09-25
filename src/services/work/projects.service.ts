/**
 * CT Work — dự án: tạo từ mẫu, cấu hình, thành viên, nhãn, component.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import {
  PROJECT_KEY_RE, type ProjectRole, type ProjectTemplate, type ProjectType, type ProjectVisibility,
} from './constants.js';
import { emitWorkEvent, evictFromProject } from './events.js';
import {
  can, effectiveProjectRole, loadProjectAccess, requireProject, requireWorkspace, type ProjectOptions,
} from './permissions.js';
import { seedProjectConfig } from './templates.js';

const MAX_PROJECTS_PER_WORKSPACE = 100;

export async function createProject(
  userId: number,
  workspaceId: number,
  input: {
    key: string; name: string; description?: string | null;
    type: ProjectType; template: ProjectTemplate; visibility?: ProjectVisibility;
    /** Bỏ trống = theo mẫu (SWP391/SWR302 Scrum có sẵn "Sprint 1"). */
    firstSprint?: boolean;
  },
) {
  await requireWorkspace(userId, workspaceId, 'workspace.createProject');
  const key = input.key.trim().toUpperCase();
  if (!PROJECT_KEY_RE.test(key)) {
    throw new BadRequestError('Project key must be 2–10 letters or digits and start with a letter (e.g. SWP)', 'WORK_BAD_KEY');
  }
  const name = input.name.trim();
  if (!name) throw new BadRequestError('Project name is required', 'WORK_NAME_REQUIRED');
  const count = await prisma.workProject.count({ where: { workspaceId, deletedAt: null } });
  if (count >= MAX_PROJECTS_PER_WORKSPACE) throw new BadRequestError('This workspace has too many projects', 'WORK_LIMIT');

  try {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.workProject.create({
        data: {
          workspaceId, key, name: name.slice(0, 120), description: input.description?.trim() || null,
          type: input.type, template: input.template, visibility: input.visibility ?? 'WORKSPACE', leadId: userId,
        },
      });
      // Người tạo luôn là ADMIN của dự án mình tạo — kể cả khi chỉ là MEMBER của không gian.
      await tx.workProjectMember.create({ data: { projectId: project.id, userId, role: 'ADMIN' } });
      await seedProjectConfig(tx, project.id, input.template, input.type, { firstSprint: input.firstSprint });
      return { id: project.id, key: project.key, name: project.name };
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`Project key ${key} is already used in this workspace`);
    }
    throw err;
  }
}

/** Dự án người gọi thấy được trong một không gian, kèm vai trò và số thẻ đang mở. */
export async function listProjects(userId: number, workspaceId: number) {
  const wsRole = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const projects = await prisma.workProject.findMany({
    where: { workspaceId, deletedAt: null },
    orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'asc' }],
    select: {
      id: true, key: true, name: true, description: true, type: true, template: true, visibility: true, archivedAt: true,
      lead: { select: PUBLIC_USER },
      members: { where: { userId }, select: { role: true } },
      _count: { select: { issues: { where: { deletedAt: null, resolvedAt: null } } } },
    },
  });
  const out = [];
  for (const p of projects) {
    const role = effectiveProjectRole({
      workspaceRole: wsRole,
      projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
      visibility: p.visibility as ProjectVisibility,
    });
    if (!role) continue;
    const { members: _m, _count, ...rest } = p;
    out.push({ ...rest, role, openIssues: _count.issues });
  }
  return out;
}

export async function resolveProjectKey(userId: number, workspaceSlug: string, key: string) {
  const p = await prisma.workProject.findFirst({
    where: { key: key.toUpperCase(), deletedAt: null, workspace: { slug: workspaceSlug, deletedAt: null } },
    select: { id: true },
  });
  if (!p) throw new NotFoundError('Project not found');
  await requireProject(userId, p.id, 'project.view');
  return p.id;
}

/**
 * Toàn bộ cấu hình client cần để vẽ dự án: quy trình (trạng thái + luồng
 * chuyển), loại thẻ, nhãn, component, thành viên, sprint chưa đóng, cột board.
 * Một lượt gọi cho cả trang — board, danh sách và chi tiết thẻ dùng chung.
 */
export async function getProjectConfig(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const project = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: {
      id: true, key: true, name: true, description: true, type: true, template: true, visibility: true,
      settings: true, archivedAt: true, createdAt: true, leadId: true,
      workspace: { select: { id: true, name: true, slug: true } },
      workflows: {
        orderBy: { id: 'asc' },
        select: {
          id: true, name: true, isDefault: true,
          statuses: { orderBy: { position: 'asc' }, select: { id: true, name: true, category: true, color: true, position: true, wipLimit: true } },
          transitions: { select: { id: true, fromStatusId: true, toStatusId: true, name: true } },
        },
      },
      issueTypes: { where: { archived: false }, orderBy: { position: 'asc' }, select: { id: true, key: true, name: true, icon: true, color: true, level: true, workflowId: true } },
      labels: { orderBy: { name: 'asc' }, select: { id: true, name: true, color: true } },
      customFields: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, kind: true, options: true, typeKeys: true, required: true, position: true } },
      components: { orderBy: { name: 'asc' }, select: { id: true, name: true, description: true, leadId: true } },
      sprints: {
        where: { state: { not: 'CLOSED' } },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true },
      },
    },
  });
  const members = await projectMembers(projectId);
  return {
    ...project,
    role: access.role,
    workspaceRole: access.workspaceRole,
    permissions: permissionFlags(access.role, access.options),
    boardColumns: boardColumns(project.workflows, project.settings),
    members,
  };
}

/** Cờ quyền gửi cho client để ẩn/hiện nút. Chỉ để hiển thị — API vẫn kiểm lại. */
export function permissionFlags(role: ProjectRole, opts: ProjectOptions = {}) {
  return {
    editIssues: can(role, 'issue.edit'),
    createIssues: can(role, 'issue.create'),
    transition: can(role, 'issue.transition'),
    deleteIssues: can(role, 'issue.delete'),
    comment: can(role, 'comment.create'),
    attach: can(role, 'attachment.add'),
    manageSprints: can(role, 'sprint.manage', opts),
    settings: can(role, 'project.settings'),
    manageMembers: can(role, 'project.members'),
    useAi: can(role, 'ai.use'),
  };
}

/** Mọi người vào được dự án kèm vai trò hiệu lực — dùng cho ô chọn người, @nhắc tên. */
export async function projectMembers(projectId: number) {
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true, visibility: true } });
  const [wsMembers, projMembers] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: project.workspaceId }, select: { role: true, user: { select: PUBLIC_USER } } }),
    prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, role: true } }),
  ]);
  const explicit = new Map(projMembers.map((m) => [m.userId, m.role as ProjectRole]));
  const out: Array<(typeof wsMembers)[number]['user'] & { role: ProjectRole; explicit: boolean }> = [];
  for (const m of wsMembers) {
    const role = effectiveProjectRole({
      workspaceRole: m.role as 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST',
      projectRole: explicit.get(m.user.id) ?? null,
      visibility: project.visibility as ProjectVisibility,
    });
    if (role) out.push({ ...m.user, role, explicit: explicit.has(m.user.id) });
  }
  return out.sort((a, b) => a.username.localeCompare(b.username));
}

// ─── Cột board ───────────────────────────────────────────────────

interface WfLite { id: number; isDefault: boolean; statuses: Array<{ id: number; name: string; category: string; wipLimit: number | null }> }

/**
 * Cột của board = trạng thái của quy trình mặc định. Trạng thái của quy trình
 * khác (vd vòng đời Bug) được xếp vào cột: trùng tên trước, rồi theo nhóm —
 * TODO vào cột TODO đầu tiên, IN_PROGRESS/DONE vào cột CUỐI của nhóm đó
 * (Fixed, Retest rơi vào "In Review"; Closed vào "Done").
 * settings.boardColumns (đợt 5) sẽ cho người dùng tự chia cột.
 */
export function boardColumns(workflows: WfLite[], settings: unknown) {
  const custom = (settings as { boardColumns?: Array<{ name: string; statusIds: number[]; wipLimit?: number | null }> } | null)?.boardColumns;
  const main = workflows.find((w) => w.isDefault) ?? workflows[0];
  if (!main) return [];
  if (custom?.length) {
    // Nhóm của cột tuỳ chỉnh = nhóm của trạng thái đầu tiên trong cột (board dùng
    // nó để biết cột "xong" — không cho thêm nhanh thẻ vào đó).
    const all = workflows.flatMap((w) => w.statuses);
    // Trạng thái đã bị xoá sau khi cấu hình cột thì bỏ qua, không làm vỡ board.
    return custom.map((c, i) => {
      const ids = c.statusIds.filter((id) => all.some((s) => s.id === id));
      return { key: `c${i}`, name: c.name, statusIds: ids, category: all.find((s) => s.id === ids[0])?.category ?? 'TODO', wipLimit: c.wipLimit ?? null };
    });
  }
  const cols = main.statuses.map((s) => ({ key: `s${s.id}`, name: s.name, category: s.category, statusIds: [s.id], wipLimit: s.wipLimit }));
  for (const wf of workflows) {
    if (wf.id === main.id) continue;
    for (const s of wf.statuses) {
      let col = cols.find((c) => c.name.toLowerCase() === s.name.toLowerCase());
      if (!col) {
        const same = cols.filter((c) => c.category === s.category);
        col = s.category === 'TODO' ? same[0] : same[same.length - 1];
      }
      (col ?? cols[0]).statusIds.push(s.id);
    }
  }
  return cols;
}

// ─── Sửa dự án ───────────────────────────────────────────────────

export async function updateProject(
  userId: number,
  projectId: number,
  input: { name?: string; description?: string | null; visibility?: ProjectVisibility; leadId?: number | null; settings?: Record<string, unknown> },
) {
  await requireProject(userId, projectId, 'project.settings');
  const data: Prisma.WorkProjectUncheckedUpdateInput = {};
  if (input.name !== undefined) {
    const n = input.name.trim();
    if (!n) throw new BadRequestError('Project name is required', 'WORK_NAME_REQUIRED');
    data.name = n.slice(0, 120);
  }
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.visibility !== undefined) data.visibility = input.visibility;
  if (input.leadId !== undefined) {
    if (input.leadId !== null) {
      const a = await loadProjectAccess(input.leadId, projectId);
      if (!a || !can(a.role, 'issue.edit')) throw new BadRequestError('The project lead must be a project member', 'WORK_BAD_LEAD');
    }
    data.leadId = input.leadId;
  }
  if (input.settings !== undefined) {
    // Điều kiện Done: chỉ nhận trường của CHÍNH dự án này, loại thẻ là chuỗi.
    if ('doneRequirements' in input.settings) {
      const raw = input.settings.doneRequirements as { fieldIds?: unknown; typeKeys?: unknown } | null;
      if (raw !== null) {
        const ids = Array.isArray(raw?.fieldIds) ? [...new Set(raw.fieldIds.filter((x): x is number => Number.isInteger(x)))] : [];
        const own = ids.length ? await prisma.workCustomField.count({ where: { projectId, id: { in: ids } } }) : 0;
        if (own !== ids.length) throw new BadRequestError('Some required fields do not belong to this project', 'WORK_BAD_FIELD');
        const typeKeys = Array.isArray(raw?.typeKeys) ? raw.typeKeys.filter((x): x is string => typeof x === 'string').slice(0, 20) : null;
        input.settings = { ...input.settings, doneRequirements: { fieldIds: ids, typeKeys: typeKeys?.length ? typeKeys : null } };
      }
    }
    const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    data.settings = { ...((cur.settings as object) ?? {}), ...input.settings } as Prisma.InputJsonValue;
  }
  const p = await prisma.workProject.update({ where: { id: projectId }, data, select: { id: true, key: true, name: true } });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return p;
}

export async function setProjectArchived(userId: number, projectId: number, archived: boolean) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workProject.update({ where: { id: projectId }, data: { archivedAt: archived ? new Date() : null } });
}

export async function deleteProject(userId: number, projectId: number, confirmKey: string) {
  const access = await requireProject(userId, projectId, 'project.delete');
  if (confirmKey.trim().toUpperCase() !== access.key) throw new BadRequestError('Type the project key exactly to confirm', 'WORK_CONFIRM_KEY');
  await prisma.workProject.update({ where: { id: projectId }, data: { deletedAt: new Date() } });
}

// ─── Thành viên dự án ────────────────────────────────────────────

export async function setProjectMember(userId: number, projectId: number, targetUserId: number, role: ProjectRole) {
  const access = await requireProject(userId, projectId, 'project.members');
  const inWs = await prisma.workMember.findFirst({ where: { workspaceId: access.workspaceId, userId: targetUserId }, select: { role: true } });
  if (!inWs) throw new BadRequestError('Invite this person to the workspace first', 'WORK_NOT_IN_WORKSPACE');
  if ((inWs.role === 'OWNER' || inWs.role === 'ADMIN') && role !== 'ADMIN') {
    throw new ForbiddenError('Workspace admins are always project admins');
  }
  if (targetUserId === userId && role !== 'ADMIN') {
    // Không tự hạ quyền mình — dự án có thể mất người quản trị cuối cùng.
    throw new ForbiddenError('You cannot lower your own role');
  }
  await prisma.workProjectMember.upsert({
    where: { uk_work_project_member: { projectId, userId: targetUserId } },
    create: { projectId, userId: targetUserId, role },
    update: { role },
  });
  evictFromProject(projectId, targetUserId); // vào lại phòng với quyền mới
}

export async function removeProjectMember(userId: number, projectId: number, targetUserId: number) {
  await requireProject(userId, projectId, 'project.members');
  if (targetUserId === userId) throw new ForbiddenError('You cannot remove yourself from the project');
  const r = await prisma.workProjectMember.deleteMany({ where: { projectId, userId: targetUserId } });
  if (!r.count) throw new NotFoundError('This person has no project-specific role');
  evictFromProject(projectId, targetUserId);
}

// ─── Nhãn & component ────────────────────────────────────────────

export async function upsertLabel(userId: number, projectId: number, input: { id?: number; name: string; color?: string }) {
  // Tạo nhãn mới ngay trong ô chọn nhãn của thẻ là thao tác của người sửa thẻ (như Jira).
  await requireProject(userId, projectId, input.id ? 'project.settings' : 'issue.edit');
  const name = input.name.trim().slice(0, 50);
  if (!name) throw new BadRequestError('Label name is required', 'WORK_NAME_REQUIRED');
  try {
    if (input.id) {
      return await prisma.workLabel.update({ where: { id: input.id, projectId }, data: { name, color: input.color }, select: { id: true, name: true, color: true } });
    }
    return await prisma.workLabel.create({ data: { projectId, name, color: input.color ?? '#64748b' }, select: { id: true, name: true, color: true } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A label with that name already exists');
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') throw new NotFoundError('Label not found');
    throw err;
  }
}

export async function deleteLabel(userId: number, projectId: number, labelId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workLabel.deleteMany({ where: { id: labelId, projectId } });
  if (!r.count) throw new NotFoundError('Label not found');
}

export async function upsertComponent(userId: number, projectId: number, input: { id?: number; name: string; description?: string | null; leadId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new BadRequestError('Component name is required', 'WORK_NAME_REQUIRED');
  const data = { name, description: input.description?.trim() || null, leadId: input.leadId ?? null };
  try {
    if (input.id) return await prisma.workComponent.update({ where: { id: input.id, projectId }, data });
    return await prisma.workComponent.create({ data: { projectId, ...data } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A component with that name already exists');
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') throw new NotFoundError('Component not found');
    throw err;
  }
}

export async function deleteComponent(userId: number, projectId: number, componentId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workComponent.deleteMany({ where: { id: componentId, projectId } });
  if (!r.count) throw new NotFoundError('Component not found');
}
