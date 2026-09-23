/**
 * CT Work — nhật ký quản trị (đợt 7.3).
 *
 * Ghi những việc cần truy vết về sau: đổi quyền, xoá/khôi phục, tạo token,
 * mở link công khai, kết nối GitHub, nhập dữ liệu… KHÔNG ghi thay đổi thẻ
 * thường ngày — cái đó đã có lịch sử từng thẻ (work_history).
 *
 * Ghi nhật ký hỏng không được làm hỏng thao tác chính ⇒ chỉ log lỗi.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { requireWorkspace } from './permissions.js';
import { displayName } from './common.js';

export interface AuditEntry {
  workspaceId: number;
  projectId?: number | null;
  actorId: number | null;
  action: string;
  targetType?: string;
  targetId?: number | null;
  summary: string;
  detail?: Record<string, unknown>;
}

export async function audit(e: AuditEntry): Promise<void> {
  try {
    const actor = e.actorId ? await prisma.user.findUnique({ where: { id: e.actorId }, select: { username: true, fullName: true, displayName: true } }) : null;
    await prisma.workAuditLog.create({
      data: {
        workspaceId: e.workspaceId, projectId: e.projectId ?? null, actorId: e.actorId, actorName: actor ? displayName(actor).slice(0, 100) : null,
        action: e.action.slice(0, 48), targetType: e.targetType ?? null, targetId: e.targetId ?? null,
        summary: e.summary.slice(0, 500), detail: (e.detail ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (err) {
    logger.warn('[work] ghi audit log lỗi', { action: e.action, err: (err as Error).message });
  }
}

/** Ghi theo dự án: tự tra workspaceId. */
export async function auditProject(projectId: number, e: Omit<AuditEntry, 'workspaceId' | 'projectId'>): Promise<void> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  if (p) await audit({ ...e, workspaceId: p.workspaceId, projectId });
}

/** Chỉ quản trị không gian đọc được nhật ký. */
export async function listAudit(userId: number, workspaceId: number, q: { projectId?: number; action?: string; before?: number; limit?: number }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const limit = Math.min(Math.max(q.limit ?? 50, 1), 200);
  const rows = await prisma.workAuditLog.findMany({
    where: {
      workspaceId,
      ...(q.projectId ? { projectId: q.projectId } : {}),
      ...(q.action ? { action: { startsWith: q.action } } : {}),
      ...(q.before ? { id: { lt: q.before } } : {}),
    },
    orderBy: { id: 'desc' },
    take: limit + 1,
    select: { id: true, projectId: true, actorId: true, actorName: true, action: true, targetType: true, targetId: true, summary: true, detail: true, createdAt: true },
  });
  const projects = await prisma.workProject.findMany({ where: { workspaceId }, select: { id: true, key: true, name: true } });
  return {
    items: rows.slice(0, limit).map((r) => ({ ...r, project: projects.find((p) => p.id === r.projectId) ?? null })),
    nextBefore: rows.length > limit ? rows[limit - 1].id : null,
  };
}
