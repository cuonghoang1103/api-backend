/**
 * CT Work đợt 7a — mảnh dùng chung của OKR / planning poker / retro / timer.
 *
 * Thời gian thực: phát `work:agile` vào phòng nhân viên `work:project:<id>` (khách bị cách ly vào phòng riêng, không
 * nhận). Sự kiện CHỈ mang loại + id — không lá bài, không nội dung thẻ retro, không tác giả — client tự tải lại qua REST
 * (REST lọc quyền và che lá bài / tác giả ẩn danh). Timer phát `work:timer` vào phòng riêng `user:<id>` (web ↔ app).
 */

import { prisma } from '../../config/database.js';
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/messaging.socket.js';
import { PUBLIC_USER, type PublicUser } from './common.js';
import { projectRoom } from './events.js';
import { isClientScoped, loadProjectAccess, type ProjectAccess } from './permissions.js';

export type AgileKind = 'okr' | 'poker' | 'retro';

export function emitAgile(projectId: number, kind: AgileKind, id: number, action: string): void {
  getIO()?.to(projectRoom(projectId)).emit('work:agile', { projectId, kind, id, action, at: Date.now() });
}

export function emitTimer(userId: number): void {
  getIO()?.to(`user:${userId}`).emit('work:timer', { at: Date.now() });
}

export async function usersById(ids: Array<number | null | undefined>): Promise<Map<number, PublicUser>> {
  const uniq = [...new Set(ids.filter((x): x is number => typeof x === 'number'))];
  if (!uniq.length) return new Map();
  const rows = await prisma.user.findMany({ where: { id: { in: uniq } }, select: PUBLIC_USER });
  return new Map(rows.map((u) => [u.id, u as PublicUser]));
}

export interface TeamAccess extends ProjectAccess {
  /** ADMIN/MEMBER là người (không phải agent) — được ghi (bỏ phiếu, viết thẻ retro, check-in…). */
  canWrite: boolean;
}

/**
 * Đội dự án: ADMIN/MEMBER/TEACHER/VIEWER thấy; CLIENT (khách) không thấy — 404 như mọi tài nguyên nội bộ khác.
 * Agent đọc được, không ghi.
 */
export async function teamAccess(userId: number, projectId: number): Promise<TeamAccess> {
  const a = await loadProjectAccess(userId, projectId);
  if (!a || a.role === 'CLIENT' || isClientScoped(a)) throw new NotFoundError('Project not found');
  return { ...a, canWrite: a.principal === 'HUMAN' && (a.role === 'ADMIN' || a.role === 'MEMBER') };
}

export function requireWrite(a: TeamAccess, what: string): void {
  if (a.principal === 'AGENT') throw new ForbiddenError(`AI agents can read ${what} but cannot change it`);
  if (!a.canWrite) throw new ForbiddenError(`Only project admins and members can change ${what}`);
}
