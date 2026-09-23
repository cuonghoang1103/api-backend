/**
 * CT Work — link công khai chỉ đọc (đợt 7.5): gửi cho giảng viên / khách
 * hàng xem board, backlog, báo cáo, kết quả kiểm thử mà KHÔNG cần tài khoản.
 *
 * Nguyên tắc lộ dữ liệu tối thiểu:
 *   - Chỉ trả trường cần để xem: KHÔNG email, KHÔNG bình luận, KHÔNG file
 *     đính kèm, KHÔNG lịch sử. Người chỉ hiện tên hiển thị + ảnh.
 *   - Mỗi phần (board / backlog / reports / tests) bật tắt riêng khi tạo link.
 *   - Link thu hồi được, có thể đặt hạn; link hỏng/hết hạn/thu hồi đều trả
 *     CÙNG một 404 để không dò được link nào từng tồn tại.
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { frontendUrl } from './common.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { burndown, velocity } from './reports.service.js';
import { estimateOf, estimationOf } from './sprints.service.js';

export interface ShareOptions { board: boolean; backlog: boolean; reports: boolean; tests: boolean; descriptions: boolean }
const DEFAULT_OPTIONS: ShareOptions = { board: true, backlog: true, reports: true, tests: true, descriptions: false };

function linkUrl(token: string) {
  return frontendUrl(`/work/share/${token}`);
}

export async function listLinks(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const rows = await prisma.workPublicLink.findMany({ where: { projectId, revokedAt: null }, orderBy: { id: 'desc' } });
  return rows.map((r) => ({ ...r, url: linkUrl(r.token), expired: !!r.expiresAt && r.expiresAt < new Date() }));
}

export async function createLink(userId: number, projectId: number, input: { label?: string | null; options?: Partial<ShareOptions>; expiresInDays?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const active = await prisma.workPublicLink.count({ where: { projectId, revokedAt: null } });
  if (active >= 20) throw new BadRequestError('A project can have at most 20 active links', 'WORK_LIMIT');
  const options = { ...DEFAULT_OPTIONS, ...(input.options ?? {}) };
  if (!options.board && !options.backlog && !options.reports && !options.tests) throw new BadRequestError('Share at least one section', 'WORK_SHARE_EMPTY');
  const token = crypto.randomBytes(24).toString('base64url');
  const expiresAt = input.expiresInDays ? new Date(Date.now() + input.expiresInDays * 86_400_000) : null;
  const link = await prisma.workPublicLink.create({ data: { projectId, token, label: input.label?.trim().slice(0, 100) || null, options: options as object, createdById: userId, expiresAt } });
  await auditProject(projectId, { actorId: userId, action: 'share.create', targetType: 'public_link', targetId: link.id, summary: `Created a public read-only link${link.label ? ` "${link.label}"` : ''}`, detail: { options, expiresAt } });
  return { ...link, url: linkUrl(token), expired: false };
}

export async function revokeLink(userId: number, projectId: number, linkId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workPublicLink.updateMany({ where: { id: linkId, projectId, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Link not found');
  await auditProject(projectId, { actorId: userId, action: 'share.revoke', targetType: 'public_link', targetId: linkId, summary: 'Revoked a public link' });
}

// ─── Đọc công khai ───────────────────────────────────────────────

async function resolve(token: string, section?: keyof ShareOptions) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) throw new NotFoundError('This link is not valid');
  const link = await prisma.workPublicLink.findUnique({
    where: { token },
    include: { project: { select: { id: true, key: true, name: true, description: true, type: true, deletedAt: true, archivedAt: true, workspace: { select: { name: true, deletedAt: true } } } } },
  });
  if (!link || link.revokedAt || (link.expiresAt && link.expiresAt < new Date()) || link.project.deletedAt || link.project.workspace.deletedAt) {
    throw new NotFoundError('This link is not valid');
  }
  const options = { ...DEFAULT_OPTIONS, ...(link.options as Partial<ShareOptions>) };
  if (section && !options[section]) throw new NotFoundError('This section is not shared');
  return { link, options, project: link.project };
}

const PUBLIC_CARD = {
  id: true, number: true, title: true, typeId: true, statusId: true, parentId: true, sprintId: true, priority: true, assigneeId: true,
  storyPoints: true, dueDate: true, resolvedAt: true, rank: true,
} as const;

export async function publicSummary(token: string) {
  const { link, options, project } = await resolve(token);
  // Đếm lượt xem (thô) — không chặn đọc nếu ghi hỏng.
  await prisma.workPublicLink.update({ where: { id: link.id }, data: { viewCount: { increment: 1 }, lastViewedAt: new Date() } }).catch(() => undefined);
  const [workflows, types, members, sprints, labels] = await Promise.all([
    prisma.workWorkflow.findMany({ where: { projectId: project.id }, select: { id: true, isDefault: true, statuses: { orderBy: { position: 'asc' }, select: { id: true, name: true, category: true, color: true, position: true } } } }),
    prisma.workIssueType.findMany({ where: { projectId: project.id, archived: false }, orderBy: { position: 'asc' }, select: { id: true, key: true, name: true, icon: true, color: true, level: true } }),
    projectMembers(project.id),
    prisma.workSprint.findMany({ where: { projectId: project.id, state: { not: 'CLOSED' } }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true } }),
    prisma.workLabel.findMany({ where: { projectId: project.id }, select: { id: true, name: true, color: true } }),
  ]);
  return {
    label: link.label, options, expiresAt: link.expiresAt,
    project: { key: project.key, name: project.name, description: project.description, type: project.type, archived: !!project.archivedAt, workspace: project.workspace.name },
    workflows, issueTypes: types, sprints, labels,
    // Chỉ tên + ảnh; không username (tránh dò tài khoản), không email.
    members: members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => ({ id: m.id, name: m.displayName || m.fullName || m.username, avatarUrl: m.avatarUrl })),
  };
}

export async function publicIssues(token: string, section: 'board' | 'backlog') {
  const { project } = await resolve(token, section);
  const where = section === 'board'
    ? { projectId: project.id, deletedAt: null, type: { level: { gte: 0 } }, OR: [{ sprint: { state: 'ACTIVE' } }, ...(project.type === 'KANBAN' ? [{ sprintId: null }] : [])] }
    : { projectId: project.id, deletedAt: null, type: { level: { gte: 0 } }, resolvedAt: null };
  let rows = await prisma.workIssue.findMany({ where, orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 1000, select: PUBLIC_CARD });
  // Scrum chưa có sprint đang chạy: hiện mọi thẻ đang mở (như board nội bộ).
  if (section === 'board' && !rows.length) {
    rows = await prisma.workIssue.findMany({ where: { projectId: project.id, deletedAt: null, type: { level: { gte: 0 } }, resolvedAt: null }, orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 1000, select: PUBLIC_CARD });
  }
  return rows.map(({ id: _id, ...r }) => ({ ...r, key: `${project.key}-${r.number}` }));
}

export async function publicIssue(token: string, number: number) {
  const { options, project } = await resolve(token);
  if (!options.board && !options.backlog) throw new NotFoundError('This section is not shared');
  const i = await prisma.workIssue.findFirst({
    where: { projectId: project.id, number, deletedAt: null },
    select: { ...PUBLIC_CARD, descriptionText: true, startDate: true, createdAt: true, parent: { select: { number: true, title: true } }, children: { where: { deletedAt: null }, select: { number: true, title: true, statusId: true } } },
  });
  if (!i) throw new NotFoundError('Issue not found');
  const { id: _id, descriptionText, ...rest } = i;
  return { ...rest, key: `${project.key}-${i.number}`, description: options.descriptions ? descriptionText : null };
}

export async function publicReports(token: string) {
  const { project } = await resolve(token, 'reports');
  const [unit, active, closedCount, counts] = await Promise.all([
    estimationOf(project.id),
    prisma.workSprint.findFirst({ where: { projectId: project.id, state: 'ACTIVE' }, select: { id: true } }),
    prisma.workSprint.count({ where: { projectId: project.id, state: 'CLOSED' } }),
    prisma.workIssue.findMany({ where: { projectId: project.id, deletedAt: null, type: { level: 0 } }, select: { resolvedAt: true, storyPoints: true, originalEstimateMin: true } }),
  ]);
  // Hàm báo cáo nội bộ đòi người xem có quyền — ở đây gọi bằng quyền hệ thống
  // qua một người có quyền trong dự án (người đầu tiên là ADMIN).
  const admin = (await projectMembers(project.id)).find((m) => m.role === 'ADMIN');
  const done = counts.filter((c) => c.resolvedAt);
  return {
    unit,
    totals: { issues: counts.length, done: done.length, points: counts.reduce((s, c) => s + estimateOf(c, unit), 0), donePoints: done.reduce((s, c) => s + estimateOf(c, unit), 0) },
    burndown: active && admin ? await burndown(admin.id, project.id, active.id) : null,
    velocity: closedCount && admin ? await velocity(admin.id, project.id) : null,
  };
}

export async function publicTests(token: string) {
  const { project } = await resolve(token, 'tests');
  const cycles = await prisma.workTestCycle.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, name: true, environment: true, build: true, state: true, createdAt: true, runs: { select: { status: true } } },
  });
  return cycles.map(({ runs, ...c }) => {
    const counts: Record<string, number> = {};
    for (const r of runs) counts[r.status] = (counts[r.status] ?? 0) + 1;
    const executed = runs.filter((r) => r.status !== 'TODO' && r.status !== 'IN_PROGRESS').length;
    const pass = counts.PASS ?? 0;
    return { ...c, total: runs.length, counts, executed, passRate: executed ? Math.round((pass / executed) * 1000) / 10 : null };
  });
}
