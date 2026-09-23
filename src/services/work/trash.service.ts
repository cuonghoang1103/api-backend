/**
 * CT Work — thùng rác (đợt 7.4). Thẻ, dự án, không gian đều xoá MỀM
 * (deletedAt); đây là nơi xem lại và khôi phục. Xoá vĩnh viễn chỉ ADMIN,
 * từng thẻ một, và có ghi audit log.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { audit, auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { emitWorkEvent } from './events.js';
import { requireProject, requireWorkspace } from './permissions.js';

export async function listDeletedIssues(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'issue.delete');
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    take: 500,
    select: { id: true, number: true, title: true, deletedAt: true, typeId: true, statusId: true, parentId: true, reporter: { select: PUBLIC_USER }, type: { select: { level: true } } },
  });
  // Ai đã xoá: đọc dòng lịch sử 'deleted' cuối cùng của mỗi thẻ.
  const hist = await prisma.workHistory.findMany({
    where: { issueId: { in: rows.map((r) => r.id) }, field: 'deleted' },
    orderBy: { id: 'desc' },
    select: { issueId: true, actor: { select: PUBLIC_USER } },
  });
  return rows
    // Việc con bị xoá THEO cha thì khôi phục cùng cha — không liệt kê riêng.
    .filter((r) => !(r.type.level === -1 && r.parentId && rows.some((p) => p.id === r.parentId && p.deletedAt?.getTime() === r.deletedAt?.getTime())))
    .map(({ type: _t, ...r }) => ({ ...r, deletedBy: hist.find((h) => h.issueId === r.id)?.actor ?? null }));
}

export async function restoreIssue(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'issue.delete');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: { not: null } }, select: { id: true, deletedAt: true, statusId: true, typeId: true, parentId: true, parent: { select: { deletedAt: true } } } });
  if (!issue) throw new NotFoundError('Deleted issue not found');
  if (issue.parent?.deletedAt) throw new BadRequestError('Restore its parent issue first', 'WORK_PARENT_DELETED');
  // Trạng thái/loại có thể đã bị xoá sau khi thẻ vào thùng rác.
  const [status, type] = await Promise.all([
    prisma.workStatus.findUnique({ where: { id: issue.statusId }, select: { id: true } }),
    prisma.workIssueType.findUnique({ where: { id: issue.typeId }, select: { archived: true } }),
  ]);
  if (!status || !type || type.archived) throw new ConflictError('This issue’s status or type no longer exists');
  await prisma.$transaction([
    prisma.workIssue.updateMany({ where: { parentId: issue.id, deletedAt: issue.deletedAt }, data: { deletedAt: null } }),
    prisma.workIssue.update({ where: { id: issue.id }, data: { deletedAt: null } }),
    prisma.workHistory.create({ data: { issueId: issue.id, actorId: userId, actorKind: 'USER', field: 'restored', toValue: new Date().toISOString() } }),
  ]);
  emitWorkEvent({ type: 'issue.created', projectId, issueId: issue.id, actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'issue.restore', targetType: 'issue', targetId: issue.id, summary: `Restored issue #${number} from trash` });
}

export async function purgeIssue(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.settings');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: { not: null } }, select: { id: true, title: true } });
  if (!issue) throw new NotFoundError('Deleted issue not found');
  await prisma.$transaction([
    prisma.workIssue.deleteMany({ where: { parentId: issue.id, deletedAt: { not: null } } }),
    prisma.workIssue.updateMany({ where: { parentId: issue.id }, data: { parentId: null } }),
    prisma.workIssue.delete({ where: { id: issue.id } }),
  ]);
  await auditProject(projectId, { actorId: userId, action: 'issue.purge', targetType: 'issue', targetId: issue.id, summary: `Permanently deleted ${access.key}-${number} “${issue.title.slice(0, 120)}”` });
}

export async function listDeletedProjects(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  return prisma.workProject.findMany({
    where: { workspaceId, deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    select: { id: true, key: true, name: true, deletedAt: true, _count: { select: { issues: { where: { deletedAt: null } } } } },
  });
}

export async function restoreProject(userId: number, workspaceId: number, projectId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const p = await prisma.workProject.findFirst({ where: { id: projectId, workspaceId, deletedAt: { not: null } }, select: { key: true, name: true } });
  if (!p) throw new NotFoundError('Deleted project not found');
  await prisma.workProject.update({ where: { id: projectId }, data: { deletedAt: null } });
  await audit({ workspaceId, projectId, actorId: userId, action: 'project.restore', targetType: 'project', targetId: projectId, summary: `Restored project ${p.key} “${p.name}”` });
}

/** Không gian đã xoá của chính mình (chủ sở hữu) — khôi phục từ trang /work. */
export async function listDeletedWorkspaces(userId: number) {
  return prisma.workSpace.findMany({
    where: { ownerId: userId, deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    select: { id: true, name: true, slug: true, deletedAt: true, _count: { select: { projects: { where: { deletedAt: null } } } } },
  });
}

export async function restoreWorkspace(userId: number, workspaceId: number) {
  const ws = await prisma.workSpace.findFirst({ where: { id: workspaceId, ownerId: userId, deletedAt: { not: null } }, select: { name: true } });
  if (!ws) throw new NotFoundError('Deleted workspace not found');
  await prisma.workSpace.update({ where: { id: workspaceId }, data: { deletedAt: null } });
  await audit({ workspaceId, actorId: userId, action: 'workspace.restore', targetType: 'workspace', targetId: workspaceId, summary: `Restored workspace “${ws.name}”` });
}
