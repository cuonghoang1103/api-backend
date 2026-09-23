/**
 * CT Work — "My work": mọi việc đang mở được giao cho người gọi, ở MỌI dự án
 * họ còn quyền xem. Và email nhắc việc buổi sáng (mặc định TẮT).
 *
 * Vì sao nhắc việc đi email chứ không vào chuông: chuông của site
 * (SocialNotification) bắt buộc có người gửi thật và bỏ qua thông báo tự gửi
 * cho mình; nhắc việc thì không có "người gửi" nào đúng nghĩa.
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { frontendUrl, sendWorkEmail } from './common.js';
import { effectiveProjectRole } from './permissions.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import { vnDay } from './sprints.service.js';

async function visibleProjectIds(userId: number): Promise<number[]> {
  const ws = await prisma.workMember.findMany({
    where: { userId, workspace: { deletedAt: null } },
    select: {
      role: true,
      workspace: { select: { projects: { where: { deletedAt: null, archivedAt: null }, select: { id: true, visibility: true, members: { where: { userId }, select: { role: true } } } } } },
    },
  });
  const ids: number[] = [];
  for (const m of ws) {
    for (const p of m.workspace.projects) {
      const role = effectiveProjectRole({
        workspaceRole: m.role as WorkspaceRole,
        projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
        visibility: p.visibility as ProjectVisibility,
      });
      if (role) ids.push(p.id);
    }
  }
  return ids;
}

export async function myWork(userId: number) {
  const projectIds = await visibleProjectIds(userId);
  if (!projectIds.length) return { items: [], counts: { overdue: 0, dueToday: 0, dueSoon: 0, inProgress: 0, total: 0 } };
  const issues = await prisma.workIssue.findMany({
    where: { assigneeId: userId, projectId: { in: projectIds }, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } } },
    orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { priority: 'asc' }, { updatedAt: 'desc' }],
    take: 300,
    select: {
      number: true, title: true, priority: true, dueDate: true, updatedAt: true, typeId: true,
      type: { select: { key: true, name: true, color: true } },
      status: { select: { name: true, category: true } },
      project: { select: { key: true, name: true, workspace: { select: { slug: true, name: true } } } },
    },
  });
  const today = vnDay();
  const soon = vnDay(new Date(Date.now() + 3 * 86_400_000));
  const items = issues.map((i) => {
    const due = i.dueDate ? i.dueDate.toISOString().slice(0, 10) : null;
    const bucket = !due ? 'none' : due < today ? 'overdue' : due === today ? 'today' : due <= soon ? 'soon' : 'later';
    return {
      key: `${i.project.key}-${i.number}`, number: i.number, title: i.title, priority: i.priority, dueDate: due, bucket,
      type: i.type, status: i.status, updatedAt: i.updatedAt,
      project: { key: i.project.key, name: i.project.name }, workspace: i.project.workspace,
      url: `/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}`,
    };
  });
  return {
    items,
    counts: {
      overdue: items.filter((i) => i.bucket === 'overdue').length,
      dueToday: items.filter((i) => i.bucket === 'today').length,
      dueSoon: items.filter((i) => i.bucket === 'soon').length,
      inProgress: items.filter((i) => i.status.category === 'IN_PROGRESS').length,
      total: items.length,
    },
  };
}

/**
 * Email nhắc việc mỗi sáng: chỉ gửi cho người có việc QUÁ HẠN hoặc TỚI HẠN hôm
 * nay; mỗi người tối đa một thư. Bật bằng WORK_REMINDER_EMAILS=true.
 */
export async function sendMorningReminders(): Promise<number> {
  if (process.env.WORK_REMINDER_EMAILS !== 'true') return 0;
  const today = new Date(`${vnDay()}T00:00:00Z`);
  const rows = await prisma.workIssue.findMany({
    where: { deletedAt: null, resolvedAt: null, assigneeId: { not: null }, dueDate: { lte: today }, project: { deletedAt: null, archivedAt: null } },
    select: { assigneeId: true },
    distinct: ['assigneeId'],
  });
  let sent = 0;
  for (const r of rows) {
    try {
      const w = await myWork(r.assigneeId!);
      const urgent = w.items.filter((i) => i.bucket === 'overdue' || i.bucket === 'today');
      if (!urgent.length) continue;
      const user = await prisma.user.findUnique({ where: { id: r.assigneeId! }, select: { email: true, enabled: true } });
      if (!user?.enabled) continue;
      await sendWorkEmail({
        to: user.email,
        subject: `CT Work: ${urgent.length} ${urgent.length === 1 ? 'issue needs' : 'issues need'} your attention today`,
        heading: 'Your work for today',
        lines: urgent.slice(0, 20).map((i) => `${i.key} — ${i.title} (${i.bucket === 'overdue' ? `overdue since ${i.dueDate}` : 'due today'})`),
        cta: { label: 'Open My work', url: frontendUrl('/work?tab=my-work') },
      });
      sent += 1;
    } catch (err) {
      logger.warn('[work] reminder failed', { userId: r.assigneeId, err: (err as Error).message });
    }
  }
  return sent;
}
