/**
 * Ví điểm — API người dùng + admin.
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/wallet (người dùng) · /api/v1/admin/wallet (quản trị)
 *
 * Mọi route người dùng đều yêu cầu đăng nhập: ví gắn với tài khoản, không
 * có khái niệm ví của khách vãng lai.
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { topupLimiter } from '../middleware/orderRateLimit.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as points from '../services/points.service.js';
import * as billing from '../services/billing.service.js';
import { taoChuyenKhoan } from '../services/bankTransfer.service.js';
import { isPayosConfigured } from '../config/payos.js';

const router = Router();
router.use(authenticate);

// ───────────────────────────── Số dư & lịch sử ─────────────────────────

router.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const vi = await points.layVi(req.userId!);
    res.json({
      success: true,
      data: {
        balance: vi.balance,
        totalEarned: vi.totalEarned,
        totalSpent: vi.totalSpent,
        /** Để UI hiện "≈ x đ" mà không phải tự đoán tỉ lệ. */
        pointsPerVnd: points.POINTS_PER_VND,
      },
    });
  } catch (err) { next(err); }
});

router.get('/transactions', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await points.layLichSu(req.userId!, {
      page: Number(req.query.page) || 0,
      size: Number(req.query.size) || 20,
    });
    res.json({ success: true, data: data.items, pagination: data.pagination });
  } catch (err) { next(err); }
});

// ───────────────────────────── Nạp tiền ────────────────────────────────

/** Mốc nạp dựng sẵn + giới hạn, cho UI vẽ các nút chọn nhanh. */
router.get('/topup/tiers', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: {
        tiers: await billing.layMocNap(),
        minVnd: points.MIN_TOPUP_VND,
        maxVnd: points.MAX_TOPUP_VND,
        payosAvailable: isPayosConfigured(),
      },
    });
  } catch (err) { next(err); }
});

/**
 * Tạo đơn nạp.
 * Body: { amountVnd, paymentMethod: 'PAYOS' | 'BANK_TRANSFER', idempotencyKey? }
 *
 * `idempotencyKey` do client sinh (một UUID cho mỗi lần người dùng thực sự
 * bấm). Gửi lại cùng khoá → trả lại ĐÚNG đơn cũ, không đẻ đơn thứ hai.
 */
router.post('/topup', topupLimiter, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const body = req.body as { amountVnd?: unknown; paymentMethod?: unknown; idempotencyKey?: unknown };
    const method = String(body.paymentMethod || 'PAYOS').toUpperCase();
    if (method !== 'PAYOS' && method !== 'BANK_TRANSFER') {
      throw new BadRequestError('Cách thanh toán không hợp lệ');
    }
    if (method === 'PAYOS' && !isPayosConfigured()) {
      throw new BadRequestError('Cổng PayOS hiện chưa sẵn sàng. Vui lòng chọn chuyển khoản ngân hàng.');
    }

    const order = await billing.taoDonNap({
      userId: req.userId!,
      amountVnd: Number(body.amountVnd),
      paymentMethod: method,
      idempotencyKey: body.idempotencyKey ? String(body.idempotencyKey).slice(0, 64) : null,
    });

    // Chuyển khoản: kèm luôn mã QR + nội dung để người dùng không phải
    // bấm thêm một nhịp nữa.
    let bank = null;
    if (method === 'BANK_TRANSFER') {
      bank = await taoChuyenKhoan({
        orderKind: 'TOPUP',
        orderId: order.id,
        orderCode: order.orderCode,
        userId: req.userId!,
        amountVnd: order.amountVnd,
      });
    }

    res.status(201).json({ success: true, data: { order: congKhaiDonNap(order), bank } });
  } catch (err) { next(err); }
});

router.get('/topup/:orderCode', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const order = await prisma.topupOrder.findUnique({ where: { orderCode: req.params.orderCode } });
    // Đơn của người khác trả 404 chứ không 403: không tiết lộ mã đơn nào tồn tại.
    if (!order || order.userId !== req.userId!) throw new NotFoundError('Đơn nạp không tồn tại');
    res.json({ success: true, data: congKhaiDonNap(order) });
  } catch (err) { next(err); }
});

router.get('/topup', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const size = Math.min(50, Math.max(1, Number(req.query.size) || 20));
    const page = Math.max(0, Number(req.query.page) || 0);
    const [rows, total] = await Promise.all([
      prisma.topupOrder.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: 'desc' },
        skip: page * size,
        take: size,
      }),
      prisma.topupOrder.count({ where: { userId: req.userId! } }),
    ]);
    res.json({
      success: true,
      data: rows.map(congKhaiDonNap),
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (err) { next(err); }
});

router.post('/topup/:orderCode/cancel', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    await billing.huyDon('TOPUP', req.params.orderCode, req.userId!);
    res.json({ success: true, data: { cancelled: true } });
  } catch (err) { next(err); }
});

function congKhaiDonNap(o: {
  id: number; orderCode: string; amountVnd: number; basePoints: number; bonusPoints: number;
  totalPoints: number; bonusPercent: number; status: string; paymentMethod: string;
  paidAt: Date | null; expiresAt: Date | null; createdAt: Date;
}) {
  return {
    id: o.id,
    orderCode: o.orderCode,
    amountVnd: o.amountVnd,
    basePoints: o.basePoints,
    bonusPoints: o.bonusPoints,
    totalPoints: o.totalPoints,
    bonusPercent: o.bonusPercent,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paidAt: o.paidAt?.toISOString() ?? null,
    expiresAt: o.expiresAt?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
  };
}

// ═══════════════════════════ ADMIN ═══════════════════════════════════

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin());

/** Mốc nạp — CRUD. */
adminRouter.get('/tiers', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await prisma.topupTier.findMany({ orderBy: [{ sortOrder: 'asc' }, { amountVnd: 'asc' }] }) });
  } catch (err) { next(err); }
});

adminRouter.post('/tiers', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body as Record<string, unknown>;
    const amountVnd = Math.floor(Number(b.amountVnd));
    if (!Number.isInteger(amountVnd) || amountVnd <= 0) throw new BadRequestError('Số tiền không hợp lệ');
    const bonusPercent = Math.max(0, Math.min(100, Math.floor(Number(b.bonusPercent) || 0)));
    res.status(201).json({
      success: true,
      data: await prisma.topupTier.create({
        data: {
          amountVnd,
          bonusPercent,
          label: b.label ? String(b.label).slice(0, 80) : null,
          popular: !!b.popular,
          active: b.active === undefined ? true : !!b.active,
          sortOrder: Math.floor(Number(b.sortOrder) || 0),
        },
      }),
    });
  } catch (err) { next(err); }
});

adminRouter.put('/tiers/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const b = req.body as Record<string, unknown>;
    res.json({
      success: true,
      data: await prisma.topupTier.update({
        where: { id },
        data: {
          amountVnd: b.amountVnd === undefined ? undefined : Math.floor(Number(b.amountVnd)),
          bonusPercent: b.bonusPercent === undefined ? undefined : Math.max(0, Math.min(100, Math.floor(Number(b.bonusPercent)))),
          label: b.label === undefined ? undefined : b.label ? String(b.label).slice(0, 80) : null,
          popular: b.popular === undefined ? undefined : !!b.popular,
          active: b.active === undefined ? undefined : !!b.active,
          sortOrder: b.sortOrder === undefined ? undefined : Math.floor(Number(b.sortOrder)),
        },
      }),
    });
  } catch (err) { next(err); }
});

adminRouter.delete('/tiers/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    await prisma.topupTier.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, data: { deleted: true } });
  } catch (err) { next(err); }
});

/** Mọi lượt nạp, lọc theo trạng thái. */
adminRouter.get('/topups', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const size = Math.min(100, Math.max(1, Number(req.query.size) || 30));
    const page = Math.max(0, Number(req.query.page) || 0);
    const status = req.query.status ? String(req.query.status) : undefined;
    const where = status ? { status } : {};
    const [rows, total] = await Promise.all([
      prisma.topupOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: page * size,
        take: size,
        include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
      }),
      prisma.topupOrder.count({ where }),
    ]);
    res.json({ success: true, data: rows, pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) } });
  } catch (err) { next(err); }
});

/**
 * Cộng/trừ điểm thủ công. Dùng cho đền bù sự cố, tặng thưởng, sửa sai.
 * BẮT BUỘC có lý do — một dòng sổ không nói được vì sao nó tồn tại là một
 * dòng sổ vô dụng khi đối soát sáu tháng sau.
 */
adminRouter.post('/adjust', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body as { userId?: unknown; points?: unknown; reason?: unknown };
    const userId = Math.floor(Number(b.userId));
    const diem = Math.floor(Number(b.points));
    const lyDo = String(b.reason || '').trim();
    if (!Number.isInteger(userId) || userId <= 0) throw new BadRequestError('userId không hợp lệ');
    if (!Number.isInteger(diem) || diem === 0) throw new BadRequestError('Số điểm phải là số nguyên khác 0');
    if (lyDo.length < 3) throw new BadRequestError('Vui lòng ghi lý do điều chỉnh');

    const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!u) throw new NotFoundError('Người dùng không tồn tại');

    const kq = await points.ghiSo({
      userId,
      amount: diem,
      kind: 'ADMIN_ADJUST',
      description: `[Admin] ${lyDo}`,
      // Khoá gắn với admin + thời điểm: bấm lại là một lượt điều chỉnh mới
      // (đúng ý), nhưng một request bị gửi lại hai lần thì chỉ ăn một.
      idempotencyKey: `adjust:${req.userId}:${userId}:${Date.now()}`,
    });
    res.json({ success: true, data: kq });
  } catch (err) { next(err); }
});

/** Ví + sổ của một người, cho màn hình hỗ trợ. */
adminRouter.get('/users/:userId', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = Number(req.params.userId);
    const [vi, lichSu, kiem] = await Promise.all([
      prisma.pointAccount.findUnique({ where: { userId } }),
      points.layLichSu(userId, { size: 50 }),
      points.kiemTraSoDu(userId),
    ]);
    res.json({ success: true, data: { wallet: vi, transactions: lichSu.items, audit: kiem } });
  } catch (err) { next(err); }
});

/**
 * Đối chiếu TOÀN BỘ ví: số dư có khớp tổng sổ cái không.
 * Lệch = có chỗ nào đó sửa balance mà không ghi sổ. Đi tìm chỗ đó, ĐỪNG
 * ghi đè số dư cho khớp.
 */
adminRouter.get('/audit', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    const accounts = await prisma.pointAccount.findMany({ select: { userId: true, balance: true } });
    const tong = await prisma.pointTransaction.groupBy({ by: ['userId'], _sum: { amount: true } });
    const mapTong = new Map(tong.map((t) => [t.userId, t._sum.amount ?? 0]));
    const lech = accounts
      .map((a) => ({ userId: a.userId, balance: a.balance, tongSoCai: mapTong.get(a.userId) ?? 0 }))
      .filter((x) => x.balance !== x.tongSoCai);
    res.json({
      success: true,
      data: { tongSoVi: accounts.length, soViLech: lech.length, chiTietLech: lech.slice(0, 200) },
    });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
