/**
 * CT Work — "khoá chỉnh sửa" cá nhân theo dự án (25/09/2026).
 *
 * Người dùng hay LƯỚT xem kế hoạch dựng sẵn và lỡ tay kéo thẻ / sửa trường —
 * không có cách quay lại như cũ. Bật khoá thì mọi lệnh GHI của chính họ trong dự
 * án đó bị server từ chối (423 WORK_EDIT_LOCKED); giao diện bắt mã này và hiện
 * "Editing is locked" kèm nút Unlock. Chặn ở SERVER chứ không chỉ ẩn nút: kéo
 * thả, sửa hàng loạt, app iOS/desktop, AI "Apply" đều đi qua đây.
 *
 * Vẫn cho qua khi đang khoá (không đổi kế hoạch): bình luận / daily log, cảm xúc,
 * theo dõi thẻ, hỏi AI và quản lý hội thoại AI, bỏ qua đề xuất AI, bộ lọc và
 * dashboard cá nhân. API token (script) không bị khoá — khoá là tiện ích giao diện.
 */

import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { requireProject } from './permissions.js';

export const EDIT_LOCKED_CODE = 'WORK_EDIT_LOCKED';

/** Đường ghi (sau /projects/:pid) vẫn được phép khi đang khoá. */
const ALLOWED_WHILE_LOCKED: RegExp[] = [
  /^\/edit-lock$/,
  /^\/issues\/\d+\/comments(\/\d+)?(\/reactions\/[^/]+|\/report)?$/,
  /^\/issues\/\d+\/watch$/,
  /^\/ai\/(chat|quick|filter|weekly-report|plan-sprint|retro|daily-brief)$/,
  /^\/ai\/threads(\/\d+)?$/,
  /^\/ai\/messages\/\d+\/retry$/,
  /^\/ai\/messages\/\d+\/actions\/\d+$/, // bỏ qua / khôi phục đề xuất — KHÔNG phải /apply
  /^\/filters(\/\d+)?$/,
  /^\/dashboards(\/\d+)?$/,
];

export function isAllowedWhileLocked(subPath: string): boolean {
  return ALLOWED_WHILE_LOCKED.some((re) => re.test(subPath));
}

export async function getLock(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const row = await prisma.workEditLock.findUnique({ where: { userId_projectId: { userId, projectId } }, select: { createdAt: true } });
  return { locked: !!row, since: row?.createdAt ?? null };
}

export async function setLock(userId: number, projectId: number, locked: boolean) {
  await requireProject(userId, projectId, 'project.view');
  if (locked) {
    await prisma.workEditLock.upsert({ where: { userId_projectId: { userId, projectId } }, create: { userId, projectId }, update: {} });
  } else {
    await prisma.workEditLock.deleteMany({ where: { userId, projectId } });
  }
  return getLock(userId, projectId);
}

/** Middleware sau bước xác thực: chặn lệnh ghi khi người gọi đang khoá dự án đó. */
export function editLockGuard() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS' || req.workToken) return next();
      const m = /^\/projects\/(\d+)(\/.*)?$/.exec(req.path);
      if (!m) return next();
      const sub = m[2] ?? '';
      if (isAllowedWhileLocked(sub)) return next();
      const r = req as Request & { userId?: number; user?: { userId?: number } };
      const userId = r.userId ?? r.user?.userId;
      if (!userId) return next();
      const locked = await prisma.workEditLock.findUnique({ where: { userId_projectId: { userId, projectId: Number(m[1]) } }, select: { userId: true } });
      if (locked) return next(new AppError('Editing is locked for this project. Unlock it to make changes.', 423, EDIT_LOCKED_CODE));
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
