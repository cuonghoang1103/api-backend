/**
 * /api/v1/admin/fable — admin duyệt yêu cầu XIN THÊM hạn mức Cuong Fable 5.
 *
 * Người dùng Pro dùng hết hạn mức Fable (xem `services/agent/fable.ts`) thì
 * bấm "Xin thêm" trong AI Code; yêu cầu hiện ở /admin/commerce?tab=fable.
 * Duyệt = cộng `soToken` vào hạn mức của họ trong 30 ngày kể từ lúc duyệt.
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { BadRequestError, ConflictError, NotFoundError } from '../middleware/errorHandler.js';
import { soTokenThemMacDinh, tranFableGoc, xemHanMucFable } from '../services/agent/fable.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

/** Trần một lần duyệt — gõ nhầm thêm ba số 0 không được thành "không giới hạn". */
const TRAN_MOT_LAN = 5_000_000;

router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const rows = await prisma.fableQuotaRequest.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
    });
    /* Kèm mức đang dùng của từng người để admin quyết mà không phải đi tra. */
    const hanMuc = new Map<number, Awaited<ReturnType<typeof xemHanMucFable>>>();
    for (const uid of [...new Set(rows.filter((r) => r.status === 'PENDING').map((r) => r.userId))]) {
      hanMuc.set(uid, await xemHanMucFable(uid));
    }
    res.json({
      success: true,
      data: {
        tranGoc: tranFableGoc(),
        themMacDinh: soTokenThemMacDinh(),
        rows: rows.map((r) => ({
          id: r.id,
          userId: r.userId,
          user: r.user,
          reason: r.reason,
          status: r.status,
          soToken: r.soToken,
          adminNote: r.adminNote,
          createdAt: r.createdAt.toISOString(),
          resolvedAt: r.resolvedAt?.toISOString() ?? null,
          hanMuc: hanMuc.get(r.userId) ?? null,
        })),
      },
    });
  } catch (err) { next(err); }
});

router.post('/:id/approve', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const body = (req.body ?? {}) as { soToken?: unknown; note?: unknown };
    const soToken = body.soToken === undefined || body.soToken === null || body.soToken === ''
      ? soTokenThemMacDinh()
      : Math.floor(Number(body.soToken));
    if (!Number.isFinite(soToken) || soToken <= 0 || soToken > TRAN_MOT_LAN) {
      throw new BadRequestError(`Số token phải từ 1 tới ${TRAN_MOT_LAN.toLocaleString('vi-VN')}.`);
    }
    const don = await prisma.fableQuotaRequest.findUnique({ where: { id } });
    if (!don) throw new NotFoundError('Không có yêu cầu này.');
    if (don.status !== 'PENDING') throw new ConflictError('Yêu cầu này đã được xử lý rồi.');
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) || null : null;
    await prisma.fableQuotaRequest.update({
      where: { id },
      data: { status: 'APPROVED', soToken, adminNote: note, resolvedBy: req.userId ?? null, resolvedAt: new Date() },
    });
    logger.info('[fable] duyệt thêm hạn mức', { id, userId: don.userId, soToken, by: req.userId });
    res.json({ success: true, data: { id, soToken } });
  } catch (err) { next(err); }
});

router.post('/:id/reject', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const don = await prisma.fableQuotaRequest.findUnique({ where: { id } });
    if (!don) throw new NotFoundError('Không có yêu cầu này.');
    if (don.status !== 'PENDING') throw new ConflictError('Yêu cầu này đã được xử lý rồi.');
    const note = String((req.body as { note?: unknown })?.note ?? '').trim().slice(0, 500) || null;
    await prisma.fableQuotaRequest.update({
      where: { id },
      data: { status: 'REJECTED', adminNote: note, resolvedBy: req.userId ?? null, resolvedAt: new Date() },
    });
    res.json({ success: true, data: { id } });
  } catch (err) { next(err); }
});

export default router;
