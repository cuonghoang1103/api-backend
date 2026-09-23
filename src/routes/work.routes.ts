/**
 * CT Work — REST /api/v1/work.
 *
 * Đợt 0 chỉ dựng khung + một tuyến đọc cho smoke-test. Các tuyến của đợt 1
 * (không gian, dự án, thẻ, board) thêm vào đây và đều phải:
 *   - lấy người gọi bằng `req.userId` (KHÔNG `req.user.id` — không tồn tại),
 *   - kiểm quyền qua services/work/permissions.ts,
 *   - ghi thẻ qua services/work/issueChange.ts.
 * Mọi chữ trả về cho người dùng bằng tiếng Anh.
 */

import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';

const router = Router();
router.use(authenticate);

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

// GET /api/v1/work/workspaces — các không gian mà người gọi là thành viên.
// Cũng là tuyến smoke-test của module (401 khi không đăng nhập = đã mount).
router.get(
  '/workspaces',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = callerId(req);
    const rows = await prisma.workMember.findMany({
      where: { userId, workspace: { deletedAt: null } },
      orderBy: { joinedAt: 'asc' },
      select: {
        role: true,
        workspace: {
          select: {
            id: true, name: true, slug: true,
            _count: { select: { projects: { where: { deletedAt: null } }, members: true } },
          },
        },
      },
    });
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.workspace.id,
        name: r.workspace.name,
        slug: r.workspace.slug,
        role: r.role,
        projectCount: r.workspace._count.projects,
        memberCount: r.workspace._count.members,
      })),
    });
  }),
);

export default router;
