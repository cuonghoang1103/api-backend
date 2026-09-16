/**
 * Pro membership routes.
 * ────────────────────────────────────────────────────────────
 * Default export  → user router,  mounted at /api/v1/pro
 * Named `adminRouter` → admin router, mounted at /api/v1/admin/pro
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { proOrderLimiter, appleIapLimiter } from '../middleware/orderRateLimit.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as pro from '../services/pro.service.js';
import * as billing from '../services/billing.service.js';
import { taoChuyenKhoan } from '../services/bankTransfer.service.js';
import { isPayosConfigured } from '../config/payos.js';
import * as points from '../services/points.service.js';
import { ghiNhanGiaoDich } from '../services/appleIAP/capPro.js';

const parseId = (v: string): number => {
  const n = parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
};

// ═══════════════════════ USER ROUTER ════════════════════════════
const router = Router();

// ⚠️ KHÔNG dùng `router.use(authenticate)` ở đây: GET /plans là trang bán
// hàng, người CHƯA đăng nhập phải xem được giá. Mọi route khác gắn
// `authenticate` riêng — thêm route mới thì nhớ gắn tay.

/** Bảng giá Pro — CÔNG KHAI. */
router.get('/plans', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: {
        plans: await billing.layBangGiaPro(),
        payosAvailable: isPayosConfigured(),
        pointsPerVnd: points.POINTS_PER_VND,
      },
    });
  } catch (err) { next(err); }
});

router.get('/status', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await pro.getProStatus(req.userId!) });
  } catch (err) { next(err); }
});

router.post('/redeem', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const data = await pro.redeemProCode(req.userId!, String(req.body?.code ?? ''));
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ─────────────────────── Apple In-App Purchase ───────────────────────

/**
 * Ghi nhận một giao dịch mua Pro qua App Store.
 * Body: { jws } — chuỗi JWS mà StoreKit 2 trả về (`Transaction.jsonRepresentation`).
 *
 * ⚠️ KHÔNG có endpoint "khôi phục" riêng, và không cần. Bấm "Khôi phục giao
 * dịch" trong app chỉ khiến StoreKit đọc lại các giao dịch cũ rồi gửi đúng
 * qua đây; khoá duy nhất trên `transaction_id` lo phần không cấp hai lần.
 * Một đường vào, một luật.
 *
 * Máy chủ là nơi phán quyết: app KHÔNG được tự kết luận "đã mua xong" rồi tự
 * mở khoá. Mọi cổng Pro vẫn hỏi `isProEffective` như trước.
 */
router.post('/apple/transactions', authenticate, appleIapLimiter, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const jws = String((req.body as { jws?: unknown })?.jws ?? '').trim();
    if (!jws) throw new BadRequestError('Thiếu jws.');
    // Trần độ dài: JWS thật gồm ba khúc base64url kèm chuỗi chứng thư, cỡ
    // vài KB. Không chặn thì một thân yêu cầu 10MB cũng đi thẳng vào bộ giải
    // mã base64 và bộ dựng X.509.
    if (jws.length > 32_000) throw new BadRequestError('jws quá dài.');
    const data = await ghiNhanGiaoDich(req.userId!, jws);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ─────────────────────── Mua gói Pro (13/09/2026) ───────────────────────

/**
 * Tạo đơn mua Pro.
 * Body: { planCode, paymentMethod: 'POINTS'|'PAYOS'|'BANK_TRANSFER', idempotencyKey? }
 *
 * POINTS → trừ ví và cấp Pro NGAY, trả về `granted: true`.
 * PAYOS / BANK_TRANSFER → tạo đơn PENDING, frontend đi tiếp sang cổng.
 */
router.post('/orders', authenticate, proOrderLimiter, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body as { planCode?: unknown; paymentMethod?: unknown; idempotencyKey?: unknown };
    const planCode = String(b.planCode || '').trim();
    if (!planCode) throw new BadRequestError('Thiếu mã gói');
    const method = String(b.paymentMethod || 'POINTS').toUpperCase();
    if (method !== 'POINTS' && method !== 'PAYOS' && method !== 'BANK_TRANSFER') {
      throw new BadRequestError('Cách thanh toán không hợp lệ');
    }
    if (method === 'PAYOS' && !isPayosConfigured()) {
      throw new BadRequestError('Cổng PayOS hiện chưa sẵn sàng. Vui lòng chọn cách khác.');
    }

    const { order, granted } = await billing.taoDonPro({
      userId: req.userId!,
      planCode,
      paymentMethod: method,
      idempotencyKey: b.idempotencyKey ? String(b.idempotencyKey).slice(0, 64) : null,
    });

    let bank = null;
    if (method === 'BANK_TRANSFER' && !granted) {
      bank = await taoChuyenKhoan({
        orderKind: 'PRO',
        orderId: order.id,
        orderCode: order.orderCode,
        userId: req.userId!,
        amountVnd: order.amountVnd,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderCode: order.orderCode,
          planCode: order.planCode,
          planName: order.planName,
          months: order.months,
          amountVnd: order.amountVnd,
          pointsUsed: order.pointsUsed,
          status: granted ? 'PAID' : order.status,
          paymentMethod: order.paymentMethod,
          expiresAt: order.expiresAt?.toISOString() ?? null,
        },
        granted,
        bank,
        status: granted ? await pro.getProStatus(req.userId!) : null,
      },
    });
  } catch (err) { next(err); }
});

/** Lịch sử mua Pro của chính mình. */
router.get('/orders', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const rows = await prisma.proOrder.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({
      success: true,
      data: rows.map((o) => ({
        id: o.id,
        orderCode: o.orderCode,
        planName: o.planName,
        months: o.months,
        amountVnd: o.amountVnd,
        pointsUsed: o.pointsUsed,
        status: o.status,
        paymentMethod: o.paymentMethod,
        paidAt: o.paidAt?.toISOString() ?? null,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (err) { next(err); }
});

router.get('/orders/:orderCode', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const o = await prisma.proOrder.findUnique({ where: { orderCode: req.params.orderCode } });
    if (!o || o.userId !== req.userId!) throw new NotFoundError('Đơn không tồn tại');
    res.json({
      success: true,
      data: {
        orderCode: o.orderCode, planName: o.planName, months: o.months,
        amountVnd: o.amountVnd, pointsUsed: o.pointsUsed, status: o.status,
        paymentMethod: o.paymentMethod, granted: o.granted,
        paidAt: o.paidAt?.toISOString() ?? null,
        expiresAt: o.expiresAt?.toISOString() ?? null,
      },
    });
  } catch (err) { next(err); }
});

router.post('/orders/:orderCode/cancel', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    await billing.huyDon('PRO', req.params.orderCode, req.userId!);
    res.json({ success: true, data: { cancelled: true } });
  } catch (err) { next(err); }
});

// ═══════════════════════ ADMIN ROUTER ═══════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin());

adminRouter.get('/codes', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await pro.listProCodes() }); } catch (err) { next(err); }
});
adminRouter.post('/codes', async (req: Request, res: Response<ApiResponse>, next) => {
  try { res.status(201).json({ success: true, data: await pro.createProCode(req.body ?? {}, req.userId) }); } catch (err) { next(err); }
});
adminRouter.put('/codes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.updateProCode(id, req.body ?? {}) });
  } catch (err) { next(err); }
});
adminRouter.delete('/codes/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.deleteProCode(id) });
  } catch (err) { next(err); }
});

// Users currently holding Pro
adminRouter.get('/users', async (_req: Request, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await pro.listProUsers() }); } catch (err) { next(err); }
});

// Grant Pro directly to a user (no code needed)
adminRouter.post('/grant', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseId(String(req.body?.userId));
    if (Number.isNaN(userId)) { res.status(400).json({ success: false, message: 'userId không hợp lệ' }); return; }
    const durationDays = req.body?.durationDays == null ? null : parseInt(String(req.body.durationDays), 10);
    // `mode: 'replace'` = ĐỔI GÓI (đặt lại hạn từ bây giờ, kể cả đang vĩnh
    // viễn). Mặc định vẫn là cộng dồn để không đổi hành vi của mọi thứ đang
    // gọi endpoint này.
    const cheDo = String(req.body?.mode ?? '') === 'replace' ? 'thayThe' as const : 'congDon' as const;
    const data = await pro.grantProToUser(userId, Number.isFinite(durationDays as number) && (durationDays as number) > 0 ? (durationDays as number) : null, 'ADMIN', cheDo);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Revoke Pro from a user
adminRouter.post('/revoke', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const userId = parseId(String(req.body?.userId));
    if (Number.isNaN(userId)) { res.status(400).json({ success: false, message: 'userId không hợp lệ' }); return; }
    res.json({ success: true, data: await pro.revokePro(userId) });
  } catch (err) { next(err); }
});

// ─── Admin: bảng giá Pro (13/09/2026) ──────────────────────────────────
//
// Sửa được giá mà không cần deploy. Đơn CŨ không bị ảnh hưởng: `ProOrder`
// chụp lại planCode/planName/months/amountVnd lúc mua.

adminRouter.get('/plans', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: await prisma.proPlan.findMany({ orderBy: [{ sortOrder: 'asc' }, { months: 'asc' }] }),
    });
  } catch (err) { next(err); }
});

adminRouter.post('/plans', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body as Record<string, unknown>;
    const code = String(b.code || '').trim().toUpperCase();
    const months = Math.floor(Number(b.months));
    const priceVnd = Math.floor(Number(b.priceVnd));
    if (!/^[A-Z0-9_]{2,30}$/.test(code)) throw new BadRequestError('Mã gói chỉ gồm A-Z, 0-9, _ (2–30 ký tự)');
    if (!Number.isInteger(months) || months < 1) throw new BadRequestError('Số tháng không hợp lệ');
    if (!Number.isInteger(priceVnd) || priceVnd < 0) throw new BadRequestError('Giá không hợp lệ');
    res.status(201).json({
      success: true,
      data: await prisma.proPlan.create({
        data: {
          code,
          name: String(b.name || '').trim().slice(0, 120) || `Pro ${months} tháng`,
          months,
          priceVnd,
          originalPriceVnd: b.originalPriceVnd == null ? null : Math.floor(Number(b.originalPriceVnd)),
          description: b.description ? String(b.description) : null,
          badge: b.badge ? String(b.badge).slice(0, 40) : null,
          popular: !!b.popular,
          active: b.active === undefined ? true : !!b.active,
          sortOrder: Math.floor(Number(b.sortOrder) || 0),
        },
      }),
    });
  } catch (err) { next(err); }
});

adminRouter.put('/plans/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    const b = req.body as Record<string, unknown>;
    res.json({
      success: true,
      data: await prisma.proPlan.update({
        where: { id },
        data: {
          name: b.name === undefined ? undefined : String(b.name).slice(0, 120),
          months: b.months === undefined ? undefined : Math.max(1, Math.floor(Number(b.months))),
          priceVnd: b.priceVnd === undefined ? undefined : Math.max(0, Math.floor(Number(b.priceVnd))),
          originalPriceVnd: b.originalPriceVnd === undefined ? undefined : b.originalPriceVnd == null ? null : Math.floor(Number(b.originalPriceVnd)),
          description: b.description === undefined ? undefined : b.description ? String(b.description) : null,
          badge: b.badge === undefined ? undefined : b.badge ? String(b.badge).slice(0, 40) : null,
          popular: b.popular === undefined ? undefined : !!b.popular,
          active: b.active === undefined ? undefined : !!b.active,
          sortOrder: b.sortOrder === undefined ? undefined : Math.floor(Number(b.sortOrder)),
        },
      }),
    });
  } catch (err) { next(err); }
});

/**
 * Ngừng bán một gói = đặt `active: false`, KHÔNG xoá hàng.
 * Xoá sẽ kéo `ProOrder.planId` về null (onDelete: SetNull) và làm mất đường
 * truy ngược từ đơn cũ về gói — dữ liệu bán hàng thì không vứt đi được.
 */
adminRouter.delete('/plans/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = parseId(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ success: false, message: 'id không hợp lệ' }); return; }
    res.json({ success: true, data: await prisma.proPlan.update({ where: { id }, data: { active: false } }) });
  } catch (err) { next(err); }
});

/** Mọi đơn mua Pro. */
adminRouter.get('/orders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const size = Math.min(100, Math.max(1, Number(req.query.size) || 30));
    const page = Math.max(0, Number(req.query.page) || 0);
    const status = req.query.status ? String(req.query.status) : undefined;
    const where = status ? { status } : {};
    const [rows, total] = await Promise.all([
      prisma.proOrder.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: page * size, take: size,
        include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
      }),
      prisma.proOrder.count({ where }),
    ]);
    res.json({ success: true, data: rows, pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) } });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
