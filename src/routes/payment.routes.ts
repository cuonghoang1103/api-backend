/**
 * Payment Routes — VNPay integration for course purchases.
 *
 * Endpoints:
 *  - POST /api/v1/payments/course           (auth)   Create order, return payment URL
 *  - GET  /api/v1/payments/vnpay/return     (public)  VNPay redirects user here after pay
 *  - POST /api/v1/payments/vnpay/ipn        (public)  Server-to-server IPN from VNPay
 *  - GET  /api/v1/payments/order/:orderCode (auth)    Frontend polls status
 *
 * Flow:
 *   1. User clicks "Mua" on paid course
 *   2. Frontend → POST /payments/course → backend creates CourseOrder(PENDING),
 *      returns VNPay paymentUrl
 *   3. Frontend redirects user to VNPay gateway
 *   4. User pays (QR/ATM/Visa) on VNPay
 *   5. VNPay redirects user → GET /vnpay/return (just redirects to /payment/return)
 *   6. VNPay POSTs IPN → POST /vnpay/ipn (BACKEND DOES THE WORK HERE)
 *      - verify checksum
 *      - idempotent: skip if order already PAID
 *      - if vnp_ResponseCode === '00': mark PAID, create Enrollment, log PaymentTransaction
 *      - always return 200 + RspCode 00 to prevent VNPay retry
 *   7. Frontend polls /payments/order/:orderCode until status === 'PAID'
 *
 * Race condition: return URL arrives before IPN → frontend polls. We solve it
 * by:
 *   - IPN handler is idempotent (uses `enrolled` boolean as guard)
 *   - frontend polls up to 6×1.5s
 *   - even if user closes browser, IPN still processes the order
 */
import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { vnpayIpnGuard } from '../middleware/vnpayIpnGuard.js';
import { emailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';
import { createPayosLink, getPayosLink, verifyPayosWebhook, isPayosConfigured } from '../config/payos.js';
import {
  buildCoursePaymentUrl,
  buildVnpayPaymentUrl,
  getClientIp,
  requestVnpayRefund,
  verifyIpnCall,
  verifyReturnUrl,
} from '../services/payment/vnpay.service.js';
import type { ApiResponse } from '../types/index.js';
import type { VnpIpnParsed } from './payment.types.js';

const router = Router();

// ─── Per-user rate limit on order creation ─────────────────
// Stops a malicious or buggy client from spamming PENDING orders
// (and burning through orderCode uniqueness). The general rate
// limiter in src/index.ts is per-IP, but the right scope for
// payments is per-USER — one person shouldn't be able to create
// more than 5 new orders in a minute.
const orderCreateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.VNPAY_CREATE_LIMIT_PER_MIN || '5', 10),
  standardHeaders: true,
  legacyHeaders: false,
  // Key by userId (set by authenticate middleware) so two users
  // behind the same NAT don't share a bucket.
  keyGenerator: (req: Request): string =>
    `user:${(req as unknown as { userId?: number }).userId ?? req.ip ?? 'anon'}`,
  message: {
    success: false,
    message: 'Ban dang tao qua nhieu don hang. Vui long cho mot lat.',
    code: 'ORDER_RATE_LIMIT_EXCEEDED',
  },
});

// How long an unpaid order stays valid for. After this, the IPN will
// still be accepted if VNPay eventually calls (payment may have been
// delayed), but frontend will stop polling and user can re-attempt.
// Set in minutes; default 15.
const ORDER_TTL_MINUTES = parseInt(
  process.env.VNPAY_ORDER_TTL_MINUTES || '15',
  10,
);

// Shape of the data we need to send a course receipt email. We
// extract this from inside the transaction callback and use it
// after commit to send the email.
type ReceiptContext = {
  to: string;
  fullName: string | null;
  courseTitle: string;
  courseSlug: string;
};

// ─── Helpers ────────────────────────────────────────────────

/**
 * Compute the final amount the user pays (discount-aware).
 * If discountPrice is set and not expired → use discountPrice.
 * Else → use price.
 */
function computeFinalPrice(
  price: Prisma.Decimal | number,
  discountPrice: Prisma.Decimal | number | null,
  discountExpiresAt: Date | null,
): number {
  const basePrice = Number(price);
  if (discountPrice === null || discountPrice === undefined) return basePrice;
  if (discountExpiresAt && discountExpiresAt.getTime() < Date.now()) return basePrice;
  const discount = Number(discountPrice);
  return discount > 0 && discount < basePrice ? discount : basePrice;
}

/**
 * Apply a discount code to a base price.
 * Returns { finalAmount, discountAmount, error }.
 *  - PERCENT: discount = base * (value / 100), capped at maxDiscountAmount if set.
 *  - FIXED:   discount = min(value, base).
 *  - minOrderAmount check happens here.
 *  - maxUses / usedCount: caller must check (we don't increment here).
 */
function applyDiscountCode(
  code: { discountType: string; discountValue: Prisma.Decimal | number; minOrderAmount: Prisma.Decimal | number; maxDiscountAmount: Prisma.Decimal | number | null; maxUses: number | null; usedCount: number; active: boolean; startsAt: Date | null; expiresAt: Date | null; userId: number | null },
  baseAmount: number,
  userId: number,
  now: Date = new Date(),
): { finalAmount: number; discountAmount: number; error?: string } {
  if (!code.active) return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma khong con hieu luc' };
  if (code.startsAt && code.startsAt.getTime() > now.getTime()) {
    return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma chua den thoi gian su dung' };
  }
  if (code.expiresAt && code.expiresAt.getTime() < now.getTime()) {
    return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma da het han' };
  }
  if (code.maxUses !== null && code.usedCount >= code.maxUses) {
    return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma da duoc su dung het' };
  }
  if (code.userId !== null && code.userId !== userId) {
    // Coupon scoped to a specific user. If it's not for this user,
    // we treat it as invalid (don't leak whether the code exists).
    return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma khong ap dung cho tai khoan nay' };
  }
  if (Number(code.minOrderAmount) > 0 && baseAmount < Number(code.minOrderAmount)) {
    return { finalAmount: baseAmount, discountAmount: 0, error: `Don hang phai dat toi thieu ${Number(code.minOrderAmount).toLocaleString('vi-VN')}d` };
  }
  let discount = 0;
  if (code.discountType === 'PERCENT') {
    discount = (baseAmount * Number(code.discountValue)) / 100;
    if (code.maxDiscountAmount !== null && discount > Number(code.maxDiscountAmount)) {
      discount = Number(code.maxDiscountAmount);
    }
  } else if (code.discountType === 'FIXED') {
    discount = Math.min(Number(code.discountValue), baseAmount);
  } else {
    return { finalAmount: baseAmount, discountAmount: 0, error: 'Ma giam gia khong hop le' };
  }
  discount = Math.round(discount); // VND doesn't have fractional units
  const finalAmount = Math.max(0, baseAmount - discount);
  return { finalAmount, discountAmount: discount };
}

/**
 * Generate a unique order code. Format: COURSE_{courseId}_{userId}_{ts}
 * The trailing timestamp is the same vnp_TxnRef constraint:
 * "Khong duoc trung lap trong ngay" — so we use ms + a short random suffix
 * to be extra safe (e.g. two users enrolling in the same millisecond).
 */
function generateOrderCode(courseId: number, userId: number): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1000)
    .toString(36)
    .padStart(3, '0');
  return `COURSE_${courseId}_${userId}_${ts}_${rand}`;
}

/**
 * Returns true if the PENDING order has passed its TTL window.
 * We keep the row around for audit, but we won't reuse it for a
 * new paymentUrl — user must create a fresh order.
 */
function isOrderExpired(order: { createdAt: Date }, ttlMinutes: number): boolean {
  const ageMs = Date.now() - new Date(order.createdAt).getTime();
  return ageMs > ttlMinutes * 60 * 1000;
}

/**
 * Split a vnp_TxnRef back into { orderType, id }.
 *
 * We encode the order type as the prefix of vnp_TxnRef so the IPN
 * handler can branch (course vs product) WITHOUT a speculative DB
 * lookup against both tables.
 *
 *  - PRODUCT orders (created via /create-qr): `PRODUCT_{shopOrderId}_{ts}`
 *    → { orderType: 'PRODUCT', id: shopOrderId }
 *  - COURSE orders (legacy /course flow):     `COURSE_{courseId}_{userId}_{ts}_{rand}`
 *    → { orderType: 'COURSE', id: null } — the course path looks the
 *      order up by its full orderCode (== vnp_TxnRef), so we don't need
 *      to extract a numeric id here.
 *
 * Returns null orderType for anything we don't recognise.
 */
function parseTxnRef(txnRef: string): { orderType: 'COURSE' | 'PRODUCT' | null; id: number | null } {
  if (txnRef.startsWith('PRODUCT_')) {
    const m = txnRef.match(/^PRODUCT_(\d+)/);
    return { orderType: 'PRODUCT', id: m ? Number(m[1]) : null };
  }
  if (txnRef.startsWith('COURSE_')) {
    return { orderType: 'COURSE', id: null };
  }
  return { orderType: null, id: null };
}

/**
 * Parse the vnp_PayDate "yyyyMMddHHmmss" string into a Date.
 * Returns null if the input is malformed.
 */
function parseVnpayPayDate(raw: unknown): Date | null {
  if (typeof raw !== 'string' || raw.length !== 14) return null;
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
}

/**
 * Handle the PRODUCT (Shop) branch of the VNPay IPN.
 *
 * The caller (the /vnpay/ipn handler) has already done the GLOBAL part
 * of the security check: it verified the HMAC-SHA512 checksum and logged
 * the raw payload to PaymentTransaction. Here we finish the strict
 * 4-step protocol for the shop order:
 *
 *   1. (checksum — already verified by caller)
 *   2. Order existence        → RspCode 01 if missing
 *   3. Amount match           → RspCode 04 if mismatched
 *   4. Status must be PENDING  → RspCode 02 if already finalized
 *
 * On vnp_ResponseCode === '00' we mark the order PAID and decrement
 * stock — all inside a single transaction whose first statement is an
 * atomic `updateMany WHERE status='PENDING'`. That conditional update is
 * the idempotency guard: if VNPay retries the IPN, the second call
 * updates 0 rows and we skip the stock decrement, so inventory is never
 * double-counted and money is never lost.
 *
 * Always responds 200 + { RspCode, Message } (VNPay's required shape) so
 * VNPay does not retry against an already-terminal order.
 */
async function handleProductIpn(
  shopOrderId: number | null,
  ipn: VnpIpnParsed,
  res: Response,
): Promise<void> {
  if (shopOrderId === null) {
    res.status(200).json({ RspCode: '01', Message: 'Malformed product order ref' });
    return;
  }

  // Step 2 — order existence
  const order = await prisma.shopOrder.findUnique({
    where: { id: shopOrderId },
    include: { items: true },
  });
  if (!order) {
    res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    return;
  }

  // Step 4 (early) — idempotent: already finalized → no-op success
  if (order.status === 'PAID') {
    res.status(200).json({ RspCode: '00', Message: 'Already processed' });
    return;
  }

  // Step 3 — amount match (order.total is VND; ipn.amountVnd is /100)
  if (ipn.amountVnd !== Number(order.total)) {
    res.status(200).json({ RspCode: '04', Message: 'Amount mismatch' });
    return;
  }

  // vnp_ResponseCode 00 = success; anything else = failed/cancelled
  if (ipn.responseCode !== '00') {
    await prisma.shopOrder.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', paymentStatus: 'FAILED' },
    });
    res.status(200).json({ RspCode: '00', Message: 'Recorded as failed' });
    return;
  }

  // ── SUCCESS PATH ──
  await prisma.$transaction(async (tx) => {
    // Atomic PENDING → PAID. updateMany returns the affected count, our
    // idempotency guard against concurrent / retried IPNs.
    const flipped = await tx.shopOrder.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: {
        status: 'PAID',
        paymentStatus: 'PAID',
        paymentMethod: 'VNPAY',
        paymentId: ipn.transactionNo,
        paidAt: ipn.payDate || new Date(),
      },
    });

    // Someone else already transitioned it — skip stock side effects.
    if (flipped.count !== 1) return;

    // Decrement stock + bump sold count for each line item. Items link
    // to Product by name (the relation FK). updateMany with a
    // `stockQuantity >= quantity` guard avoids driving stock negative for
    // tracked products; soldCount is bumped unconditionally for analytics.
    for (const item of order.items) {
      await tx.product.updateMany({
        where: { name: item.productName, stockQuantity: { gte: item.quantity } },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      await tx.product.updateMany({
        where: { name: item.productName },
        data: { soldCount: { increment: item.quantity } },
      });
    }
  });

 logger.info('payment-ipn PRODUCT PAID', {
 orderCode: order.orderCode,
 shopOrderId: order.id,
 amountVnd: ipn.amountVnd,
 txnNo: ipn.transactionNo,
 });

  res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
}

// ─── 1. POST /api/v1/payments/course ────────────────────────
// Body: { courseId: number, idempotencyKey?: string, discountCode?: string }
// Returns: { orderCode, paymentUrl, amount, originalAmount?, discountAmount? }
//
// `idempotencyKey` is optional but recommended. If the same user
// sends the same key twice (e.g. double-clicked "Mua"), we return
// the original order + paymentUrl instead of creating a second one.
// This is a standard idempotency pattern (Stripe-style). We trust
// the key only within the same userId — two different users with
// the same key get separate orders, which is the right semantics.
//
// `discountCode` is optional. If provided, the system looks it up,
// validates it (active, in-window, not exhausted, meets min spend),
// and applies the discount to the post-course-discount price.
router.post('/course', orderCreateLimiter, authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { courseId } = req.body as { courseId?: unknown };
    if (typeof courseId !== 'number' || !Number.isInteger(courseId)) {
      throw new AppError('courseId phai la so nguyen', 400);
    }

    // Validate idempotency key shape (UUIDv4 is 36 chars, allow some
    // flexibility for any string <= 64 chars). Don't accept empty.
    const idempotencyKey = (req.body as { idempotencyKey?: unknown }).idempotencyKey;
    if (idempotencyKey !== undefined) {
      if (typeof idempotencyKey !== 'string' || idempotencyKey.length === 0 || idempotencyKey.length > 64) {
        throw new AppError('idempotencyKey phai la chuoi toi da 64 ky tu', 400);
      }
    }

    // Validate optional discount code shape. Trim + uppercase so
    // "spring2026" and " SPRING2026 " both work.
    const rawDiscountCode = (req.body as { discountCode?: unknown }).discountCode;
    let discountCodeInput: string | null = null;
    if (rawDiscountCode !== undefined && rawDiscountCode !== null && rawDiscountCode !== '') {
      if (typeof rawDiscountCode !== 'string') {
        throw new AppError('discountCode phai la chuoi', 400);
      }
      const trimmed = rawDiscountCode.trim().toUpperCase();
      if (trimmed.length === 0 || trimmed.length > 50) {
        throw new AppError('discountCode khong hop le', 400);
      }
      discountCodeInput = trimmed;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Khoa hoc khong ton tai', 404);
    if (course.isPublished !== true) {
      throw new AppError('Khoa hoc chua duoc xuat ban', 400);
    }
    const isPaid = course.accessType === 'PAID' || (!course.isFree && Number(course.price) > 0);
    if (!isPaid) {
      throw new AppError('Khoa hoc nay khong chap nhan thanh toan. Vui long su dung nut mien phi hoac ma kich hoat.', 400);
    }

    // Block duplicate purchase
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId } },
    });
    if (existingEnrollment) {
      throw new AppError('Ban da dang ky khoa hoc nay roi', 409);
    }

    // ── Idempotency check ──
    // If a key was provided AND we've seen it before for this user,
    // return the previous order. We do this BEFORE the PENDING-reuse
    // check because if a key was set the caller explicitly wants
    // idempotency, not a different PENDING order.
    if (idempotencyKey) {
      // Use findFirst because the @unique includes a nullable column
      // (idempotencyKey?), and Prisma does not generate a
      // WhereUniqueInput selector for nullable compound uniques.
      const existing = await prisma.courseOrder.findFirst({
        where: { userId: req.userId!, idempotencyKey },
      });
      if (existing) {
        // Re-build the payment URL (the original may have expired)
        // and return. We always re-build rather than persist the URL
        // because VNPay signs it with timestamps and we want it fresh.
        const paymentUrl = buildCoursePaymentUrl(
          existing.orderCode,
          Number(existing.amount),
          `Thanh toan khoa hoc ${course.title}`,
          getClientIp(req),
        );
        res.json({
          success: true,
          data: {
            orderCode: existing.orderCode,
            paymentUrl,
            amount: Number(existing.amount),
            originalAmount: existing.originalAmount ? Number(existing.originalAmount) : undefined,
            discountCode: existing.discountCode ?? undefined,
            idempotent: true,
          },
        });
        return;
      }
    }

    // Block if there's already a PENDING order. We re-use it ONLY if
    // it hasn't expired (within ORDER_TTL_MINUTES). Otherwise we mark
    // it FAILED and create a fresh one.
    const existingPending = await prisma.courseOrder.findFirst({
      where: { userId: req.userId!, courseId, status: 'PENDING' },
    });
    if (existingPending && !isOrderExpired(existingPending, ORDER_TTL_MINUTES)) {
      // Reuse the existing order — rebuild payment URL
      const paymentUrl = buildCoursePaymentUrl(
        existingPending.orderCode,
        Number(existingPending.amount),
        `Thanh toan khoa hoc ${course.title}`,
        getClientIp(req),
      );
      res.json({
        success: true,
        data: {
          orderCode: existingPending.orderCode,
          paymentUrl,
          amount: Number(existingPending.amount),
          originalAmount: existingPending.originalAmount ? Number(existingPending.originalAmount) : undefined,
          discountCode: existingPending.discountCode ?? undefined,
        },
      });
      return;
    }
    if (existingPending) {
      // Expired stale order — mark failed so a fresh one can be created
      await prisma.courseOrder.update({
        where: { id: existingPending.id },
        data: { status: 'FAILED' },
      });
    }

    // ── Price calculation ──
    // 1. base = course.price (or course.discountPrice if active)
    // 2. if discountCode provided: apply to base
    // 3. final = max(0, base - discount)
    const baseAmount = computeFinalPrice(
      course.price,
      course.discountPrice,
      course.discountExpiresAt,
    );

    let finalAmount = baseAmount;
    let originalAmount: number | null = null;
    let appliedCoupon: { id: number; code: string } | null = null;
    let discountAmount = 0;

    if (discountCodeInput) {
      const coupon = await prisma.discountCode.findUnique({
        where: { code: discountCodeInput },
      });
      if (!coupon) {
        throw new AppError('Ma giam gia khong ton tai', 400);
      }
      const result = applyDiscountCode(coupon, baseAmount, req.userId!);
      if (result.error) {
        throw new AppError(result.error, 400);
      }
      finalAmount = result.finalAmount;
      discountAmount = result.discountAmount;
      originalAmount = baseAmount;
      appliedCoupon = { id: coupon.id, code: coupon.code };
    }

    const orderCode = generateOrderCode(courseId, req.userId!);

    await prisma.courseOrder.create({
      data: {
        orderCode,
        userId: req.userId!,
        courseId,
        amount: new Prisma.Decimal(finalAmount),
        status: 'PENDING',
        paymentMethod: 'VNPAY',
        idempotencyKey: idempotencyKey || null,
        discountCode: appliedCoupon?.code ?? null,
        discountCodeId: appliedCoupon?.id ?? null,
        originalAmount: originalAmount !== null ? new Prisma.Decimal(originalAmount) : null,
      },
    });

    // Increment the coupon's usedCount atomically. We do this
    // optimistically here; if the user later abandons the order,
    // the count stays high (slight overcount) but that's safer than
    // racing on decrement. The cron job flips stale PENDING to
    // FAILED, but we don't unwind the usedCount — that would be
    // opening a refund-back-door that bad actors could exploit.
    if (appliedCoupon) {
      try {
        await prisma.discountCode.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      } catch (err) {
        // Log only — don't roll back the order. The coupon might
        // already be at maxUses; in that case the next attempt
        // will fail at the applyDiscountCode check.
        logger.warn('failed to increment coupon usedCount', { error: err instanceof Error ? err.message : String(err) });
      }
    }

    const paymentUrl = buildCoursePaymentUrl(
      orderCode,
      finalAmount,
      `Thanh toan khoa hoc ${course.title}`,
      getClientIp(req),
    );

    res.json({
      success: true,
      data: {
        orderCode,
        paymentUrl,
        amount: finalAmount,
        originalAmount: originalAmount ?? undefined,
        discountAmount: discountAmount || undefined,
        discountCode: appliedCoupon?.code,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── 1b. POST /api/v1/payments/create-qr ────────────────────
// Unified QR-payment entry point for BOTH Academy (course) and Shop
// (product). The frontend creates the order first (via its own
// endpoint), then calls this with the resulting order id + type to get
// a VNPay payment URL. The client library turns that URL into a QR code
// in a modal for the user to scan (VNPAY-QR).
//
// Body: { orderId: number, orderType: 'COURSE' | 'PRODUCT' }
// Returns: { paymentUrl, txnRef, amount, orderType }
//
// vnp_TxnRef is encoded as `{ORDER_TYPE}_{id}_{ts}` so the IPN handler
// can split the flow. For COURSE we reuse the order's existing
// `orderCode` (already `COURSE_...`) so the legacy IPN lookup-by-code
// keeps working unchanged.
router.post('/create-qr', orderCreateLimiter, authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { orderId, orderType } = req.body as { orderId?: unknown; orderType?: unknown };

    if (typeof orderId !== 'number' || !Number.isInteger(orderId) || orderId <= 0) {
      throw new AppError('orderId phai la so nguyen duong', 400);
    }
    if (orderType !== 'COURSE' && orderType !== 'PRODUCT') {
      throw new AppError('orderType phai la \'COURSE\' hoac \'PRODUCT\'', 400);
    }

    const ipAddr = getClientIp(req);
    // VNPay requires vnp_TxnRef unique per day. A trailing timestamp lets
    // the same order be re-attempted (e.g. user closed the QR modal) with
    // a fresh ref while the regex in parseTxnRef still recovers the id.
    const ts = Date.now();

    if (orderType === 'COURSE') {
      const order = await prisma.courseOrder.findUnique({
        where: { id: orderId },
        include: { course: { select: { title: true } } },
      });
      if (!order) throw new AppError('Don hang khoa hoc khong ton tai', 404);
      if (order.userId !== req.userId!) {
        throw new AppError('Ban khong co quyen thanh toan don hang nay', 403);
      }
      if (order.status !== 'PENDING') {
        throw new AppError(`Don hang da o trang thai ${order.status}, khong the tao ma QR`, 409);
      }

      // Reuse the existing COURSE_-prefixed orderCode as the txnRef so the
      // unchanged course IPN branch (lookup-by-orderCode) resolves it.
      const paymentUrl = buildVnpayPaymentUrl(
        order.orderCode,
        Number(order.amount),
        `Thanh toan khoa hoc ${order.course.title}`,
        ipAddr,
      );

      res.json({
        success: true,
        data: {
          paymentUrl,
          txnRef: order.orderCode,
          amount: Number(order.amount),
          orderType: 'COURSE',
        },
      });
      return;
    }

    // orderType === 'PRODUCT'
    const order = await prisma.shopOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError('Don hang san pham khong ton tai', 404);
    // Shop checkout allows guests (userId nullable). If the order has an
    // owner, enforce it; guest orders are payable by the authenticated
    // requester who holds the orderCode.
    if (order.userId !== null && order.userId !== req.userId!) {
      throw new AppError('Ban khong co quyen thanh toan don hang nay', 403);
    }
    if (order.status !== 'PENDING') {
      throw new AppError(`Don hang da o trang thai ${order.status}, khong the tao ma QR`, 409);
    }

    const amount = Number(order.total);
    if (!(amount > 0)) {
      throw new AppError('Gia tri don hang khong hop le', 400);
    }

    const txnRef = `PRODUCT_${order.id}_${ts}`;
    const paymentUrl = buildVnpayPaymentUrl(
      txnRef,
      amount,
      `Thanh toan don hang ${order.orderCode}`,
      ipAddr,
    );

    // Mark the chosen payment method so admin/orders shows VNPAY (the
    // column default stays SIMULATED for the legacy simulated checkout).
    // We also attach the authenticated user as the order's owner
    // when one is present. POST /orders is the original guest-checkout
    // path and intentionally leaves userId null. /create-qr is the
    // authenticated path; binding the order to the logged-in user
    // lets /orders/my return this row and lets the IPN handler
    // look it up by `orderCode` (which the user knows).
    await prisma.shopOrder.update({
      where: { id: order.id },
      data: {
        paymentMethod: 'VNPAY',
        // Bind the order to the authenticated user so /orders/my
        // returns it. POST /orders (guest checkout) leaves
        // userId null on create, so we only attach when req.userId
        // is present. order.userId may already be set if the same
        // user re-paid; we don't overwrite to avoid yanking
        // ownership of a guest order someone claimed later.
        ...(req.userId && order.userId === null ? { userId: req.userId } : {}),
      },
    });

    res.json({
      success: true,
      data: {
        paymentUrl,
        txnRef,
        amount,
        orderType: 'PRODUCT',
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── PayOS (primary course payment gateway) ─────────────────
// Reusable: mark a course order PAID and enroll the buyer. Atomic
// PENDING→PAID guard makes it idempotent (safe under webhook retries).
async function markCourseOrderPaidAndEnroll(orderId: number, meta: { txnNo?: string; payDate?: Date }): Promise<'paid' | 'already' | 'notfound'> {
  const order = await prisma.courseOrder.findUnique({ where: { id: orderId } });
  if (!order) return 'notfound';
  if (order.status === 'PAID') return 'already';

  let receiptCtx: { to: string; fullName: string | null; courseTitle: string; courseSlug: string } | null = null;
  let flippedOk = false;

  await prisma.$transaction(async (tx) => {
    const flipped = await tx.courseOrder.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: { status: 'PAID', paymentTxnNo: meta.txnNo ?? null, paymentPayDate: meta.payDate ?? new Date(), enrolled: true },
    });
    if (flipped.count !== 1) return;
    flippedOk = true;
    const [user, course] = await Promise.all([
      tx.user.findUnique({ where: { id: order.userId }, select: { email: true, fullName: true } }),
      tx.course.findUnique({ where: { id: order.courseId }, select: { title: true, slug: true, enrollmentDurationDays: true } }),
    ]);
    const durationDays = course?.enrollmentDurationDays ?? 0;
    const expiresAt = durationDays > 0 ? new Date(Date.now() + durationDays * 86_400_000) : null;
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      create: { userId: order.userId, courseId: order.courseId, source: 'PAID', expiresAt },
      update: { status: 'ACTIVE', source: 'PAID', expiresAt },
    });
    await tx.course.update({ where: { id: order.courseId }, data: { totalStudents: { increment: 1 } } });
    if (user && course) receiptCtx = { to: user.email, fullName: user.fullName, courseTitle: course.title, courseSlug: course.slug };
  });

  if (receiptCtx) {
    const c = receiptCtx as { to: string; fullName: string | null; courseTitle: string; courseSlug: string };
    try {
      await emailService.sendCourseReceiptEmail({
        to: c.to, fullName: c.fullName ?? undefined, orderCode: order.orderCode,
        courseTitle: c.courseTitle, courseSlug: c.courseSlug, amount: Number(order.amount), paidAt: meta.payDate ?? new Date(),
      });
    } catch (err) { logger.error('receipt email failed', { error: err instanceof Error ? err.message : String(err) }); }
  }
  return flippedOk ? 'paid' : 'already';
}

// Create a PayOS checkout link for an existing PENDING course order.
// Body: { orderCode }  →  { checkoutUrl, qrCode }
router.post('/payos/create', orderCreateLimiter, authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    if (!isPayosConfigured()) throw new AppError('PayOS chua duoc cau hinh', 503, 'PAYOS_NOT_CONFIGURED');
    const orderCode = String((req.body as { orderCode?: unknown })?.orderCode || '');
    const order = await prisma.courseOrder.findUnique({ where: { orderCode }, include: { course: { select: { title: true } } } });
    if (!order) throw new AppError('Don hang khong ton tai', 404);
    if (order.userId !== req.userId!) throw new AppError('Ban khong co quyen thanh toan don hang nay', 403);
    if (order.status !== 'PENDING') throw new AppError(`Don hang da o trang thai ${order.status}`, 409);

    const returnUrl = `${config.frontendUrl}/payment/return?orderCode=${encodeURIComponent(order.orderCode)}`;
    const cancelUrl = `${config.frontendUrl}/payment/return?orderCode=${encodeURIComponent(order.orderCode)}&cancel=1`;

    let link;
    try {
      // orderCode for PayOS = the numeric CourseOrder.id (unique per order).
      link = await createPayosLink({
        orderCode: order.id,
        amount: Number(order.amount),
        description: `Khoa hoc #${order.id}`,
        returnUrl,
        cancelUrl,
      });
    } catch (e) {
      // 231 = orderCode already has a link (retry) → fetch the existing one.
      if ((e as Error & { payosCode?: string })?.payosCode === '231') {
        link = await getPayosLink(order.id);
      }
      if (!link) throw e;
    }

    await prisma.courseOrder.update({ where: { id: order.id }, data: { paymentMethod: 'PAYOS' } });
    res.json({ success: true, data: { checkoutUrl: link.checkoutUrl, qrCode: link.qrCode, orderCode: order.orderCode } });
  } catch (error) { next(error); }
});

// PayOS server-to-server webhook. Verifies the signature, then marks the
// order paid + enrolls (success) or failed. Always 200 so PayOS stops retrying.
router.post('/payos/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body as { data?: Record<string, unknown>; signature?: string };
    if (!body?.data) { res.json({ success: true }); return; } // registration ping
    if (!verifyPayosWebhook(body)) { res.status(400).json({ success: false, message: 'invalid signature' }); return; }

    const data = body.data;
    const orderId = Number(data.orderCode);
    if (orderId) {
      if (String(data.code) === '00') {
        await markCourseOrderPaidAndEnroll(orderId, {
          txnNo: String(data.reference || data.paymentLinkId || ''),
          payDate: new Date(),
        });
        logger.info('payos webhook PAID', { orderId, ref: data.reference });
      } else {
        const o = await prisma.courseOrder.findUnique({ where: { id: orderId }, select: { id: true, status: true } });
        if (o && o.status === 'PENDING') await prisma.courseOrder.update({ where: { id: o.id }, data: { status: 'FAILED' } });
      }
    }
    res.json({ success: true });
  } catch (err) {
    logger.error('payos webhook error', { error: err instanceof Error ? err.message : String(err) });
    res.json({ success: true });
  }
});

// ─── 2. GET /api/v1/payments/vnpay/return ───────────────────
// VNPay redirects the user's browser here after payment.
// We don't trust this — just redirect to frontend /payment/return
// which polls the actual order status.
//
// Why not just redirect? Because the frontend needs the orderCode
// to poll. Easier to relay it via query string.
router.get('/vnpay/return', async (req: Request, res, next) => {
  try {
    // We still verify the checksum here, but only to detect tampering
    // attempts (e.g. user fiddling with the query string). The actual
    // order update happens in the IPN handler.
    const verify = verifyReturnUrl(req.query as Record<string, unknown>);
    const orderCode = (req.query.vnp_TxnRef as string) || '';
    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

    const params = new URLSearchParams({ orderCode });
    // SECURITY: check the checksum FIRST. `verify.isSuccess` only reflects
    // vnp_ResponseCode==='00' and is true even for a forged query string;
    // never render success/failed for a return whose HMAC doesn't verify
    // (would let an attacker craft a convincing fake "success" receipt).
    if (!verify.isVerified) {
      params.set('status', 'invalid');
    } else if (verify.isSuccess) {
      params.set('status', 'success');
    } else {
      params.set('status', 'failed');
    }

    res.redirect(`${frontendBase}/payment/return?${params.toString()}`);
  } catch (error) {
    next(error);
  }
});

// ─── 3. IPN handler (GET + POST) /api/v1/payments/vnpay/ipn ────
// VNPay v2 API sends IPN as GET (params in query string). We also
// accept POST for backward compatibility with some VNPay configurations.
//
// Required response: 200 with JSON body { RspCode, Message }.
//   RspCode "00" = acknowledged → VNPay won't retry
//   anything else = problem → VNPay will retry until it gets "00"
//
// We always return HTTP 200. The RspCode in the body is what VNPay
// reads to decide whether to retry.
async function handleVnpayIpn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as Record<string, unknown>;
    const verify = verifyIpnCall(query);

    const vnpOrderCode = (query.vnp_TxnRef as string) || '';
    const vnpResponseCode = (query.vnp_ResponseCode as string) || '';
    const vnpTransactionNo = (query.vnp_TransactionNo as string) || null;
    const vnpBankCode = (query.vnp_BankCode as string) || null;
    const vnpAmount = Number(query.vnp_Amount || 0);
    const vnpPayDate = parseVnpayPayDate(query.vnp_PayDate);
    const ipnParsed: VnpIpnParsed = {
      orderCode: vnpOrderCode,
      responseCode: vnpResponseCode,
      transactionNo: vnpTransactionNo,
      bankCode: vnpBankCode,
      amountVnd: Math.round(vnpAmount / 100), // VNPay sends amount × 100
      payDate: vnpPayDate,
      isVerified: verify.isVerified,
    };

    // Audit log — always first, even if verification fails.
    await prisma.paymentTransaction.create({
      data: {
        orderCode: vnpOrderCode || 'UNKNOWN',
        gatewayTxnNo: vnpTransactionNo,
        bankCode: vnpBankCode,
        payDate: vnpPayDate,
        responseCode: vnpResponseCode,
        amount: new Prisma.Decimal(ipnParsed.amountVnd),
        rawPayload: query as Prisma.InputJsonValue,
      },
    });

    // RspCode 97 = checksum mismatch. Return 200 so VNPay doesn't
    // flood us with retries, but the non-00 body signals rejection.
    if (!verify.isVerified) {
      res.status(200).json({ RspCode: '97', Message: 'Invalid checksum' });
      return;
    }

    if (!vnpOrderCode) {
      res.status(200).json({ RspCode: '01', Message: 'Missing order code' });
      return;
    }

    // Route by vnp_TxnRef prefix: PRODUCT_* → shop, anything else → course.
    const { orderType, id: parsedId } = parseTxnRef(vnpOrderCode);
    if (orderType === 'PRODUCT') {
      await handleProductIpn(parsedId, ipnParsed, res);
      return;
    }

    // ── COURSE PATH ──
    const order = await prisma.courseOrder.findUnique({
      where: { orderCode: vnpOrderCode },
    });
    if (!order) {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      return;
    }

    // RspCode 00 for already-PAID prevents unnecessary VNPay retries.
    if (order.status === 'PAID') {
      res.status(200).json({ RspCode: '00', Message: 'Already processed' });
      return;
    }

    // Amount integrity check (order.amount is VND; ipnParsed.amountVnd is /100 already)
    if (ipnParsed.amountVnd !== Number(order.amount)) {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      res.status(200).json({ RspCode: '04', Message: 'Amount mismatch' });
      return;
    }

    if (vnpResponseCode !== '00') {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      res.status(200).json({ RspCode: '00', Message: 'Recorded as failed' });
      return;
    }

    // ── SUCCESS PATH ──
    const receiptContextRef: { current: ReceiptContext | null } = { current: null };

    await prisma.$transaction(async (tx) => {
      // Atomic PENDING→PAID. updateMany with a status='PENDING' guard is
      // the idempotency lock: if two concurrent IPNs arrive simultaneously,
      // only the first wins (count=1); the second sees count=0 and returns
      // early, preventing a double totalStudents increment.
      const flipped = await tx.courseOrder.updateMany({
        where: { id: order.id, status: 'PENDING' },
        data: {
          status: 'PAID',
          paymentTxnNo: vnpTransactionNo,
          paymentBankCode: vnpBankCode,
          paymentPayDate: vnpPayDate,
          enrolled: true,
        },
      });

      if (flipped.count !== 1) return; // concurrent IPN already processed this

      const [user, course] = await Promise.all([
        tx.user.findUnique({
          where: { id: order.userId },
          select: { email: true, fullName: true },
        }),
        tx.course.findUnique({
          where: { id: order.courseId },
          select: { title: true, slug: true, enrollmentDurationDays: true },
        }),
      ]);

      const durationDays = course?.enrollmentDurationDays ?? 0;
      const enrollmentExpiresAt = durationDays > 0
        ? new Date(Date.now() + durationDays * 86_400_000)
        : null;

      await tx.enrollment.upsert({
        where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
        create: { userId: order.userId, courseId: order.courseId, source: 'PAID', expiresAt: enrollmentExpiresAt },
        update: { status: 'ACTIVE', source: 'PAID', expiresAt: enrollmentExpiresAt },
      });

      await tx.course.update({
        where: { id: order.courseId },
        data: { totalStudents: { increment: 1 } },
      });
      if (user && course) {
        receiptContextRef.current = {
          to: user.email,
          fullName: user.fullName,
          courseTitle: course.title,
          courseSlug: course.slug,
        };
      }
    });

    const ctx = receiptContextRef.current;
    if (ctx) {
      try {
        await emailService.sendCourseReceiptEmail({
          to: ctx.to,
          fullName: ctx.fullName ?? undefined,
          orderCode: order.orderCode,
          courseTitle: ctx.courseTitle,
          courseSlug: ctx.courseSlug,
          amount: Number(order.amount),
          paidAt: vnpPayDate || new Date(),
        });
      } catch (err) {
        logger.error('receipt email failed', { error: err instanceof Error ? err.message : String(err) });
      }
    }

 logger.info('payment-ipn PAID', {
 orderCode: order.orderCode,
 userId: order.userId,
 courseId: order.courseId,
 amountVnd: ipnParsed.amountVnd,
 txnNo: vnpTransactionNo,
 });

    res.status(200).json({ RspCode: '00', Message: 'OK' });
  } catch (error) {
    next(error);
  }
}

// VNPay v2 sends IPN via GET; some configurations use POST. Accept both.
router.get('/vnpay/ipn', vnpayIpnGuard, handleVnpayIpn);
router.post('/vnpay/ipn', vnpayIpnGuard, handleVnpayIpn);

// ─── 4. GET /api/v1/payments/order/:orderCode ───────────────
// Frontend polls this after redirect. We only return info the
// requester is allowed to see: their own order, plus courseId
// (so frontend can navigate).
router.get('/order/:orderCode', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { orderCode } = req.params;
    const order = await prisma.courseOrder.findUnique({
      where: { orderCode },
      include: {
        course: {
          select: { id: true, slug: true, title: true },
        },
      },
    });
    if (!order) {
      throw new AppError('Order khong ton tai', 404);
    }
    if (order.userId !== req.userId) {
      throw new AppError('Ban khong co quyen xem don hang nay', 403);
    }

    res.json({
      success: true,
      data: {
        orderCode: order.orderCode,
        status: order.status,
        amount: Number(order.amount),
        course: order.course,
        createdAt: order.createdAt,
        paymentPayDate: order.paymentPayDate,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/payments/orders/my ──────────────────────────
// The authenticated user's own course-purchase history (all statuses,
// newest first) for the "Lịch sử mua hàng" page.
router.get('/orders/my', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const orders = await prisma.courseOrder.findMany({
      where: { userId: req.userId },
      include: { course: { select: { id: true, slug: true, title: true, thumbnailUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json({
      success: true,
      data: orders.map((o) => ({
        id: o.id,
        orderCode: o.orderCode,
        status: o.status,
        amount: Number(o.amount),
        originalAmount: o.originalAmount != null ? Number(o.originalAmount) : undefined,
        discountCode: o.discountCode ?? undefined,
        paymentMethod: o.paymentMethod,
        paymentTxnNo: o.paymentTxnNo ?? undefined,
        paymentBankCode: o.paymentBankCode ?? undefined,
        paymentPayDate: o.paymentPayDate,
        createdAt: o.createdAt,
        course: o.course,
      })),
    });
  } catch (error) { next(error); }
});

// ─── 5. GET /api/v1/payments/admin/orders (admin) ────────────
// Lists course orders with filters for the admin dashboard.
// Query params:
//   status    = PENDING|PAID|FAILED|REFUNDED (optional)
//   courseId  = filter by course (optional)
//   page      = 1-based, default 1
//   pageSize  = default 20, max 100
router.get(
  '/admin/orders',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const status = (req.query.status as string) || undefined;
      const courseIdStr = req.query.courseId as string | undefined;
      const courseId = courseIdStr ? parseInt(courseIdStr, 10) : undefined;
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
      const pageSize = Math.min(
        100,
        Math.max(1, parseInt((req.query.pageSize as string) || '20', 10)),
      );

      const where: Prisma.CourseOrderWhereInput = {};
      if (
        status &&
        ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(status)
      ) {
        where.status = status;
      }
      if (courseId && !isNaN(courseId)) {
        where.courseId = courseId;
      }

      const [total, items] = await Promise.all([
        prisma.courseOrder.count({ where }),
        prisma.courseOrder.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            user: { select: { id: true, username: true, email: true, fullName: true } },
            course: { select: { id: true, slug: true, title: true } },
          },
        }),
      ]);

      res.json({
        success: true,
        data: {
          total,
          page,
          pageSize,
          items: items.map(o => ({
            id: o.id,
            orderCode: o.orderCode,
            status: o.status,
            amount: Number(o.amount),
            paymentMethod: o.paymentMethod,
            paymentTxnNo: o.paymentTxnNo,
            paymentBankCode: o.paymentBankCode,
            paymentPayDate: o.paymentPayDate,
            enrolled: o.enrolled,
            user: o.user,
            course: o.course,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── 6. GET /api/v1/payments/admin/transactions/:orderCode ───
// Audit trail of every IPN callback VNPay sent for an order.
// Useful when investigating "why did the order fail" — the responseCode
// and rawPayload tell you exactly what VNPay sent.
router.get(
  '/admin/transactions/:orderCode',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const { orderCode } = req.params;
      const txs = await prisma.paymentTransaction.findMany({
        where: { orderCode },
        orderBy: { createdAt: 'desc' },
      });
      res.json({
        success: true,
        data: {
          orderCode,
          transactions: txs.map(t => ({
            id: t.id,
            gatewayTxnNo: t.gatewayTxnNo,
            bankCode: t.bankCode,
            payDate: t.payDate,
            responseCode: t.responseCode,
            amount: Number(t.amount),
            rawPayload: t.rawPayload,
            createdAt: t.createdAt,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── 7. PATCH /api/v1/payments/admin/enrollment ─────────────
// Adjust an existing enrollment: set or clear the expiry date,
// or change its status (ACTIVE / SUSPENDED / COMPLETED).
// Body: { userId, courseId, expiresAt?: string|null, status?: string }
//
// The UI for this lives in /admin/course-orders drawer. We expose
// the most common actions and reject anything not in our whitelist.
router.patch(
  '/admin/enrollment',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const body = req.body as {
        userId?: unknown;
        courseId?: unknown;
        expiresAt?: unknown; // ISO string, '' or null to clear
        status?: unknown;
      };
      if (typeof body.userId !== 'number' || !Number.isInteger(body.userId)) {
        throw new AppError('userId phai la so nguyen', 400);
      }
      if (typeof body.courseId !== 'number' || !Number.isInteger(body.courseId)) {
        throw new AppError('courseId phai la so nguyen', 400);
      }
      const data: Prisma.EnrollmentUpdateInput = {};
      if (body.expiresAt !== undefined) {
        if (body.expiresAt === null || body.expiresAt === '') {
          // null = clear expiry (lifetime)
          (data as Record<string, unknown>).expiresAt = null;
        } else {
          const d = new Date(body.expiresAt as string);
          if (isNaN(d.getTime())) {
            throw new AppError('expiresAt khong hop le', 400);
          }
          data.expiresAt = d;
        }
      }
      if (body.status !== undefined) {
        if (typeof body.status !== 'string' || !['ACTIVE', 'SUSPENDED', 'COMPLETED'].includes(body.status)) {
          throw new AppError('status phai la ACTIVE, SUSPENDED hoac COMPLETED', 400);
        }
        data.status = body.status;
      }
      if (Object.keys(data).length === 0) {
        throw new AppError('Can it nhat mot truong de cap nhat', 400);
      }

      const updated = await prisma.enrollment.update({
        where: { userId_courseId: { userId: body.userId, courseId: body.courseId } },
        data,
        include: {
          user: { select: { id: true, username: true, email: true, fullName: true } },
          course: { select: { id: true, slug: true, title: true } },
        },
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },
);

// ─── 8. DELETE /api/v1/payments/admin/enrollment ────────────
// Revoke a user's access to a course. Used when an admin refunds
// a course purchase or removes a wrongly-granted enrollment.
// Body: { userId, courseId } — also reverses totalStudents so the
// course stats stay accurate.
router.delete(
  '/admin/enrollment',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const body = req.body as { userId?: unknown; courseId?: unknown };
      if (typeof body.userId !== 'number' || !Number.isInteger(body.userId)) {
        throw new AppError('userId phai la so nguyen', 400);
      }
      if (typeof body.courseId !== 'number' || !Number.isInteger(body.courseId)) {
        throw new AppError('courseId phai la so nguyen', 400);
      }

      const userId = body.userId as number;
      const courseId = body.courseId as number;

      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (!existing) {
        throw new AppError('Khong tim thay dang ky', 404);
      }

      // Wrap in a transaction: delete enrollment, cancel related orders,
      // and decrement totalStudents atomically.
      await prisma.$transaction(async (tx) => {
        // Delete enrollment
        await tx.enrollment.delete({
          where: { userId_courseId: { userId, courseId } },
        });
        // Cancel all related CourseOrders for this user+course (keep audit trail)
        // Cancel PENDING, PAID, and COMPLETED — all indicate the user had access.
        await tx.courseOrder.updateMany({
          where: { userId, courseId, status: { in: ['PENDING', 'PAID', 'COMPLETED'] } },
          data: { status: 'CANCELLED' },
        });
        // Decrement totalStudents, never below 0
        await tx.$executeRaw`
          UPDATE courses
          SET total_students = GREATEST(0, total_students - 1)
          WHERE id = ${courseId}
        `;
      });
      res.json({ success: true, data: { revoked: true } });
    } catch (error) {
      next(error);
    }
  },
);

// ─── 9. POST /api/v1/payments/admin/refund (admin) ──────────
// Issue a full or partial refund for a PAID course order.
//
// Body: { orderCode, refundAmount?: number, reason: string }
//   - refundAmount omitted or = order.amount → full refund
//   - refundAmount < order.amount → partial refund
//   - refundAmount must be > 0
//
// Side effects on full refund:
//   - mark order REFUNDED
//   - revoke the user's enrollment
//   - decrement course totalStudents
//   - send refund email to the user
//
// Side effects on partial refund:
//   - mark order REFUNDED (we treat any refund as terminal for the
//     order; there's no "PARTIALLY_REFUNDED" state in our enum to
//     keep things simple)
//   - do NOT revoke enrollment (user keeps access; partial refunds
//     are usually goodwill gestures for things like outages)
//   - do NOT decrement totalStudents
//   - send refund email
//
// Why no automatic enrollment revoke on partial: the user might
// still want to keep the course for the price they paid. If the
// admin really wants to revoke after a partial refund, they can
// use the PATCH /admin/enrollment endpoint or the DELETE endpoint.
router.post(
  '/admin/refund',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const body = req.body as {
        orderCode?: unknown;
        refundAmount?: unknown;
        reason?: unknown;
      };
      if (typeof body.orderCode !== 'string' || body.orderCode.length === 0) {
        throw new AppError('orderCode phai la chuoi khong rong', 400);
      }
      if (typeof body.reason !== 'string' || body.reason.trim().length === 0) {
        throw new AppError('reason phai la chuoi khong rong', 400);
      }
      if (body.reason.length > 500) {
        throw new AppError('reason qua dai (max 500 ky tu)', 400);
      }

      const order = await prisma.courseOrder.findUnique({
        where: { orderCode: body.orderCode },
        include: {
          user: { select: { id: true, email: true, fullName: true } },
          course: { select: { id: true, slug: true, title: true } },
        },
      });
      if (!order) throw new AppError('Khong tim thay don hang', 404);
      if (order.status !== 'PAID') {
        throw new AppError(`Khong the hoan tien don hang o trang thai ${order.status}`, 400);
      }
      if (order.refundAmount !== null) {
        throw new AppError('Don hang da duoc hoan tien truoc do', 409);
      }

      const originalAmount = Number(order.amount);
      const refundAmount =
        body.refundAmount === undefined || body.refundAmount === null
          ? originalAmount
          : Number(body.refundAmount);
      if (isNaN(refundAmount) || refundAmount <= 0) {
        throw new AppError('refundAmount phai la so duong', 400);
      }
      if (refundAmount > originalAmount) {
        throw new AppError('refundAmount khong duoc lon hon so tien goc', 400);
      }
      const isFullRefund = refundAmount >= originalAmount;

      const refundedAt = new Date();
      const adminId = req.userId!;

      // Wrap in transaction so order status + enrollment + course
      // counter all move together (or not at all).
      await prisma.$transaction(async (tx) => {
        // 1) Mark order REFUNDED with all the audit fields
        await tx.courseOrder.update({
          where: { id: order.id },
          data: {
            status: 'REFUNDED',
            refundAmount: new Prisma.Decimal(refundAmount),
            refundReason: body.reason as string,
            refundedAt,
            refundedBy: adminId,
          },
        });

        // 2) On full refund: revoke enrollment + decrement counter
        if (isFullRefund) {
          // Try to delete the enrollment; if it doesn't exist (e.g.
          // user already unenrolled), don't fail.
          try {
            await tx.enrollment.delete({
              where: {
                userId_courseId: {
                  userId: order.userId,
                  courseId: order.courseId,
                },
              },
            });
            await tx.$executeRaw`
              UPDATE courses
              SET total_students = GREATEST(0, total_students - 1)
              WHERE id = ${order.courseId}
            `;
          } catch (err) {
            // P2025 = record not found in delete; that's fine, just
            // skip the decrement. Re-throw anything else.
            if ((err as { code?: string }).code !== 'P2025') throw err;
          }
        }
      });

      // ── Call VNPay's refund API (best-effort, non-blocking) ──
      // We do this AFTER the local DB update so the order is
      // never in an inconsistent state (admin can re-trigger
      // the gateway call from the dashboard if it fails).
      // Skip if we don't have the original VNPay transaction
      // details (older orders, manually-entered refunds, etc.).
      if (order.paymentTxnNo && order.paymentPayDate) {
        // paymentPayDate is stored as a Date; VNPay wants the
        // yyyyMMddHHmmss string the IPN originally sent us.
        const yyyy = order.paymentPayDate.getFullYear().toString();
        const pad = (n: number) => String(n).padStart(2, '0');
        const transactionDate = `${yyyy}${pad(order.paymentPayDate.getMonth() + 1)}${pad(order.paymentPayDate.getDate())}${pad(order.paymentPayDate.getHours())}${pad(order.paymentPayDate.getMinutes())}${pad(order.paymentPayDate.getSeconds())}`;
        try {
          const refundResult = await requestVnpayRefund({
            transactionNo: order.paymentTxnNo,
            transactionDate,
            amount: refundAmount,
            createdBy: adminId,
            ipAddr: getClientIp(req),
            reason: body.reason as string,
          });
          if (refundResult.ok) {
            logger.info('vnpay-refund API success', {
              orderCode: order.orderCode,
              txnNo: order.paymentTxnNo,
              amount: refundAmount,
            });
          } else {
            // VNPay rejected the refund (insufficient funds, etc.)
            // The DB is already marked REFUNDED so we don't fail
            // the admin's request — they can see the error code
            // and retry from the dashboard.
            logger.warn('vnpay-refund API failed', {
              orderCode: order.orderCode,
              responseCode: refundResult.responseCode,
              message: refundResult.message,
            });
          }
          // Surface the gateway result so the admin can see it
          // in the response. We don't fail the request — admin
          // can re-call /admin/refund with a retry if needed.
          // (Future: store refundAttempts[] on the order row so
          // retries are auditable.)
          res.locals.vnpayRefundResult = refundResult;
        } catch (err) {
          // Network error calling VNPay. The DB is updated; admin
          // can retry from the dashboard. We log + continue.
          logger.error('vnpay-refund API exception', {
            orderCode: order.orderCode,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      // Send the refund email AFTER the transaction commits. We do
      // this outside the tx because email sends can take seconds; we
      // don't want to hold row locks that long. If the email fails
      // the refund is still recorded — the user can be notified
      // manually.
      try {
        await emailService.sendCourseRefundEmail({
          to: order.user.email,
          fullName: order.user.fullName ?? undefined,
          orderCode: order.orderCode,
          courseTitle: order.course.title,
          refundAmount,
          originalAmount,
          reason: body.reason as string,
          refundedAt,
        });
      } catch (err) {
        logger.error('refund email failed', { error: err instanceof Error ? err.message : String(err) });
      }

 logger.info('payment-refund REFUNDED', {
 orderCode: order.orderCode,
 amount: refundAmount,
 isFull: isFullRefund,
 adminId,
 });

      res.json({
        success: true,
        data: {
          orderCode: order.orderCode,
          status: 'REFUNDED',
          refundAmount,
          isFullRefund,
          // Phase 2 — surface the VNPay refund-gateway result so the
          // admin dashboard can show "ok" or "needs retry". When
          // VNPay rejected the refund (insufficient funds, order
          // not yet settled, etc.), this lets the admin retry
          // from the UI without digging through server logs.
          vnpayRefund: res.locals.vnpayRefundResult
            ? {
                ok: res.locals.vnpayRefundResult.ok,
                responseCode: res.locals.vnpayRefundResult.responseCode,
                message: res.locals.vnpayRefundResult.message,
              }
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

// ─── GET /api/v1/payments/admin/enrollments ─────────────────────
// Admin list of all course enrollments with source/type detection.
router.get(
  '/admin/enrollments',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const keyword = (req.query.keyword as string) || '';
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
      const pageSize = Math.min(100, Math.max(1, parseInt((req.query.pageSize as string) || '20', 10)));

      const where = keyword
        ? {
            OR: [
              { user: { fullName: { contains: keyword, mode: 'insensitive' as const } } },
              { user: { email: { contains: keyword, mode: 'insensitive' as const } } },
              { course: { title: { contains: keyword, mode: 'insensitive' as const } } },
            ],
          }
        : {};

      const [total, items] = await Promise.all([
        prisma.enrollment.count({ where }),
        prisma.enrollment.findMany({
          where,
          orderBy: { enrolledAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            user: { select: { id: true, username: true, email: true, fullName: true } },
            course: { select: { id: true, slug: true, title: true } },
            usedCourseCode: { select: { code: true } },
          },
        }),
      ]);

      // Fetch related CourseOrders for each enrollment to detect type.
      const userIds = [...new Set(items.map(i => i.userId))];
      const courseIds = [...new Set(items.map(i => i.courseId))];
      const orders = await prisma.courseOrder.findMany({
        where: {
          userId: { in: userIds },
          courseId: { in: courseIds },
        },
        select: {
          id: true, userId: true, courseId: true, status: true,
          paymentMethod: true, amount: true, discountCode: true,
        },
      });
      const orderMap = new Map<string, typeof orders[0]>();
      for (const o of orders) {
        orderMap.set(`${o.userId}-${o.courseId}`, o);
      }

      const enrollmentSource = (
        source: string,
        order: (typeof orders)[0] | undefined,
        usedCode: { code: string } | null,
      ): { label: string; type: string } => {
        if (source === 'ADMIN') {
          return { label: 'Mien phi (Admin cap)', type: 'free' };
        }
        if (source === 'INSTRUCTOR') {
          return { label: 'Mien phi (Giang vien)', type: 'free' };
        }
        if (source === 'CODE' || (usedCode && !order)) {
          return { label: 'Nhap Code', type: 'code' };
        }
        if (!order) {
          return { label: 'Mien phi', type: 'free' };
        }
        if (order.paymentMethod === 'VNPAY' && order.status === 'PAID') {
          return { label: 'Mua bang VNPAY-QR', type: 'vnpay' };
        }
        if (Number(order.amount) === 0 && order.paymentMethod === 'MANUAL') {
          return { label: 'Mien phi (Admin cap)', type: 'free' };
        }
        if (order.status === 'PAID') {
          return { label: 'Mua bang VNPAY-QR', type: 'vnpay' };
        }
        return { label: source, type: 'free' };
      };

      res.json({
        success: true,
        data: {
          total,
          page,
          pageSize,
          items: items.map(e => {
            const order = orderMap.get(`${e.userId}-${e.courseId}`);
            const sourceInfo = enrollmentSource(e.source, order, e.usedCourseCode);
            return {
              id: e.id,
              userId: e.userId,
              courseId: e.courseId,
              enrolledAt: e.enrolledAt,
              status: e.status,
              source: e.source,
              sourceLabel: sourceInfo.label,
              sourceType: sourceInfo.type,
              user: e.user,
              course: e.course,
              usedCode: e.usedCourseCode?.code || null,
              orderId: order?.id || null,
              orderStatus: order?.status || null,
            };
          }),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);
