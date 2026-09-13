/**
 * Xin key OpenCode (cổng key con LLM).
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/llm-keys (người dùng) · /api/v1/admin/llm-keys (quản trị)
 *
 * Luồng: người dùng Pro gửi đơn → admin duyệt và DÁN key con vừa tạo ở New
 * API → người dùng thấy key. Chưa duyệt thì không thấy gì.
 *
 * ⚠️ `keyValue` là BÍ MẬT THẬT:
 *   - chỉ trả về cho ĐÚNG chủ đơn (`userId === req.userId`);
 *   - danh sách admin chỉ thấy bản che (`keyHien`), không thấy key đầy đủ;
 *   - KHÔNG bao giờ đưa vào `logger` — log đi qua nhiều chỗ và sống lâu hơn
 *     ta tưởng.
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { keyReplacementLimiter } from '../middleware/orderRateLimit.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { isProEffective } from '../services/pro.service.js';
import type { ApiResponse } from '../types/index.js';

/** Sáu model cổng rambo đang phục vụ — app/trang hướng dẫn đọc từ đây. */
export const MODEL_OPENCODE = [
  'claude-sonnet-5',
  'claude-sonnet-4-6',
  'claude-opus-4-8',
  'claude-opus-4-7',
  'claude-opus-4-6',
  'claude-haiku-4-5',
] as const;

const BASE_URL = process.env.LLM_KEY_BASE_URL || 'https://api.cuongthai.com/llm/v1';

/** "sk-abcdef…1234" — đủ để nhận ra key nào, không đủ để dùng. */
function cheKey(key: string): string {
  const k = key.trim();
  if (k.length <= 12) return `${k.slice(0, 3)}…`;
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

/** Dạng trả cho CHỦ đơn — có key đầy đủ khi đã duyệt. */
function choChuDon(r: {
  id: number; status: string; reason: string; keyValue: string | null; quotaUsd: number | null;
  adminNote: string | null; createdAt: Date; resolvedAt: Date | null;
}) {
  return {
    id: r.id,
    status: r.status,
    reason: r.reason,
    // Chỉ nhả key khi đơn đã duyệt. Đơn bị thu hồi thì key cũng không còn giá trị.
    key: r.status === 'APPROVED' ? r.keyValue : null,
    quotaUsd: r.quotaUsd,
    adminNote: r.adminNote,
    createdAt: r.createdAt.toISOString(),
    resolvedAt: r.resolvedAt?.toISOString() ?? null,
  };
}

// ═══════════════════════════ NGƯỜI DÙNG ═══════════════════════════

const router = Router();
router.use(authenticate);

/** Thông tin để dựng trang hướng dẫn — không cần có key mới xem được. */
router.get('/info', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: {
        baseUrl: BASE_URL,
        models: MODEL_OPENCODE,
        isPro: await isProEffective(req.userId).catch(() => false),
      },
    });
  } catch (err) { next(err); }
});

/** Đơn của chính mình, mới nhất trước. */
router.get('/mine', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const rows = await prisma.llmKeyRequest.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: rows.map(choChuDon) });
  } catch (err) { next(err); }
});

/**
 * Gửi đơn xin key.
 *
 * Chặn hai thứ: người chưa Pro, và người đã có đơn đang chờ / đã được cấp.
 * Thiếu chốt thứ hai thì một người gửi mười đơn và admin duyệt nhầm thành
 * mười key — đúng kiểu lỗi đã gặp ở luồng đổi key hỏng.
 */
router.post('/request', keyReplacementLimiter, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    if (!(await isProEffective(req.userId))) {
      throw new ForbiddenError('Cấp key dùng OpenCode là quyền lợi của tài khoản Pro. Nâng cấp tại /pro.');
    }
    const reason = String((req.body as { reason?: unknown })?.reason ?? '').trim();
    if (reason.length < 20) {
      throw new BadRequestError('Vui lòng mô tả bạn định dùng key vào việc gì (ít nhất 20 ký tự).');
    }
    if (reason.length > 2000) throw new BadRequestError('Mô tả quá dài (tối đa 2000 ký tự).');

    const dangCo = await prisma.llmKeyRequest.findFirst({
      where: { userId: req.userId!, status: { in: ['PENDING', 'APPROVED'] } },
    });
    if (dangCo) {
      throw new ConflictError(
        dangCo.status === 'PENDING'
          ? 'Bạn đã có một đơn đang chờ duyệt.'
          : 'Bạn đã được cấp key rồi — xem trong trang này.',
      );
    }

    const don = await prisma.llmKeyRequest.create({
      data: { userId: req.userId!, reason },
    });
    logger.info('[llm-key] đơn xin key mới', { requestId: don.id, userId: req.userId });
    res.status(201).json({ success: true, data: choChuDon(don) });
  } catch (err) { next(err); }
});

// ═══════════════════════════ QUẢN TRỊ ═══════════════════════════

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

adminRouter.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const rows = await prisma.llmKeyRequest.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
    });
    // Danh sách admin CHỈ thấy bản che. Xem key đầy đủ là việc của chủ đơn.
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        user: r.user,
        reason: r.reason,
        status: r.status,
        keyHien: r.keyHien,
        quotaUsd: r.quotaUsd,
        adminNote: r.adminNote,
        createdAt: r.createdAt.toISOString(),
        resolvedAt: r.resolvedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) { next(err); }
});

/**
 * DUYỆT — admin dán key con vừa tạo ở New API.
 *
 * Body: { key, quotaUsd?, note? }
 *
 * Vì sao admin dán chứ hệ thống không tự tạo: cụm New API chạy ở mạng docker
 * riêng, backend không gọi tới được, và giao diện quản trị của nó cố ý chỉ mở
 * qua SSH tunnel. Admin vốn đã phải vào đó đặt hạn mức cho key — dán thêm một
 * lần không tốn công, mà đổi lại không phải nhét token quản trị của New API
 * vào backend.
 */
adminRouter.post('/:id/approve', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const key = String((req.body as { key?: unknown })?.key ?? '').trim();
    if (!key) throw new BadRequestError('Thiếu key — tạo key ở New API rồi dán vào đây.');
    if (key.length < 12 || /\s/.test(key)) throw new BadRequestError('Key trông không hợp lệ (quá ngắn hoặc có khoảng trắng).');

    const don = await prisma.llmKeyRequest.findUnique({ where: { id } });
    if (!don) throw new NotFoundError('Đơn không tồn tại');
    if (don.status !== 'PENDING') throw new ConflictError(`Đơn đang ở trạng thái ${don.status}`);

    const quotaRaw = (req.body as { quotaUsd?: unknown })?.quotaUsd;
    const quotaUsd = quotaRaw == null ? null : Math.max(0, Math.floor(Number(quotaRaw) || 0));

    // Chốt tranh chấp: hai admin bấm cùng lúc thì chỉ một lượt ăn.
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: {
        status: 'APPROVED',
        keyValue: key,
        keyHien: cheKey(key),
        quotaUsd,
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : null,
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn vừa được người khác xử lý');

    // ⚠️ KHÔNG log `key`.
    logger.info('[llm-key] duyệt cấp key', { requestId: id, userId: don.userId, adminId: req.userId, quotaUsd });
    res.json({ success: true, data: { id, status: 'APPROVED', keyHien: cheKey(key) } });
  } catch (err) { next(err); }
});

adminRouter.post('/:id/reject', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Không đủ căn cứ',
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn không ở trạng thái từ chối được');
    res.json({ success: true, data: { id, status: 'REJECTED' } });
  } catch (err) { next(err); }
});

/**
 * THU HỒI một key đã cấp.
 *
 * Chỉ đổi trạng thái phía web — key vẫn sống ở New API cho tới khi admin vào
 * đó khoá. Thông điệp trả về nói thẳng điều đó, để không ai tưởng bấm nút này
 * là key hết dùng được.
 */
adminRouter.post('/:id/revoke', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'APPROVED' },
      data: {
        status: 'REVOKED',
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Đã thu hồi',
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn không ở trạng thái thu hồi được');
    res.json({
      success: true,
      data: {
        id,
        status: 'REVOKED',
        nhacNho: 'Người dùng không còn thấy key trên web. PHẢI vào New API khoá key này — thu hồi ở đây không tự khoá nó.',
      },
    });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
