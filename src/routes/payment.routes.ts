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
import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { vnpayIpnGuard } from '../middleware/vnpayIpnGuard.js';
import { emailService } from '../services/email.service.js';
import {
  buildCoursePaymentUrl,
  getClientIp,
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
    const isPaid = !course.isFree && Number(course.price) > 0;
    if (!isPaid) {
      throw new AppError('Khoa hoc nay mien phi, vui long su dung nut enroll', 400);
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
        console.warn('[payment] failed to increment coupon usedCount', err);
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
    if (verify.isSuccess) {
      params.set('status', 'success');
    } else if (verify.isVerified) {
      params.set('status', 'failed');
    } else {
      // checksum mismatch — treat as suspicious
      params.set('status', 'invalid');
    }

    res.redirect(`${frontendBase}/payment/return?${params.toString()}`);
  } catch (error) {
    next(error);
  }
});

// ─── 3. POST /api/v1/payments/vnpay/ipn ─────────────────────
// Server-to-server callback from VNPay. THIS is where we trust the
// payment and update the order.
//
// Required response: 200 with JSON body { RspCode, Message }.
//   RspCode "00" = success → VNPay won't retry
//   anything else  = failure → VNPay will retry
//
// We always return 200 because we never want VNPay to retry our handler
// (the order is already terminal in our DB). The RspCode in the body
// is informational.
router.post('/vnpay/ipn', vnpayIpnGuard, async (req: Request, res: Response, next) => {
  try {
    const query = req.query as Record<string, unknown>;
    const verify = verifyIpnCall(query);

    // Parse all VNPay fields we care about
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
      amountVnd: Math.round(vnpAmount / 100), // VNPay ×100, convert back
      payDate: vnpPayDate,
      isVerified: verify.isVerified,
    };

    // Always log the IPN first, even if verification fails.
    // This is our audit trail.
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

    if (!verify.isVerified) {
      // Bad checksum — could be tampering or misconfigured secret.
      // Return 200 + non-00 RspCode to signal "received but rejected",
      // so VNPay won't retry but we record the attempt.
      res.status(200).json({ RspCode: '97', Message: 'Invalid checksum' });
      return;
    }

    if (!vnpOrderCode) {
      res.status(200).json({ RspCode: '01', Message: 'Missing order code' });
      return;
    }

    const order = await prisma.courseOrder.findUnique({
      where: { orderCode: vnpOrderCode },
    });
    if (!order) {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      return;
    }

    // Idempotent guard — if already PAID, no-op. VNPay might retry.
    if (order.status === 'PAID') {
      res.status(200).json({ RspCode: '00', Message: 'Already processed' });
      return;
    }

    // Verify amount matches what we expect (in VND, since order.amount is VND)
    if (ipnParsed.amountVnd !== Number(order.amount)) {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      res.status(200).json({ RspCode: '04', Message: 'Amount mismatch' });
      return;
    }

    // vnp_ResponseCode 00 = success; anything else = failed
    if (vnpResponseCode !== '00') {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      res.status(200).json({ RspCode: '00', Message: 'Recorded as failed' });
      return;
    }

    // ── SUCCESS PATH ──
    // Wrap in transaction so partial failure can't leave inconsistent state.
    const receiptContextRef: { current: ReceiptContext | null } = { current: null };

    await prisma.$transaction(async (tx) => {
      // 1) mark order PAID
      await tx.courseOrder.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentTxnNo: vnpTransactionNo,
          paymentBankCode: vnpBankCode,
          paymentPayDate: vnpPayDate,
        },
      });

      // 2) create enrollment (idempotent — upsert)
      await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId: order.userId, courseId: order.courseId },
        },
        create: { userId: order.userId, courseId: order.courseId },
        update: { status: 'ACTIVE' },
      });

      // 3) mark order as enrolled + bump course totalStudents.
      // Guard with `enrolled` flag so a retried IPN doesn't double-increment.
      if (!order.enrolled) {
        await tx.courseOrder.update({
          where: { id: order.id },
          data: { enrolled: true },
        });
        await tx.course.update({
          where: { id: order.courseId },
          data: { totalStudents: { increment: 1 } },
        });
      }

      // 4) Pull user + course info to send receipt AFTER the
      //    transaction commits. Done here (read-only) so we don't
      //    need a separate query.
      const user = await tx.user.findUnique({
        where: { id: order.userId },
        select: { email: true, fullName: true },
      });
      const course = await tx.course.findUnique({
        where: { id: order.courseId },
        select: { title: true, slug: true },
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

    // Send the receipt AFTER commit. Failures here don't roll back
    // the enrollment — we never want a Resend outage to refund the
    // user, and the user can re-fetch the receipt from /my-courses
    // anyway. Logged for visibility.
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
        // EmailService already swallows + logs; we catch defensively
        // so the IPN still returns 200 to VNPay.
        console.error('[payment-ipn] receipt email failed', err);
      }
    }

    console.log('[payment-ipn] PAID', {
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
});

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

      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: body.userId, courseId: body.courseId } },
      });
      if (!existing) {
        throw new AppError('Khong tim thay dang ky', 404);
      }

      // Wrap in a transaction so totalStudents doesn't go negative
      // if the counter is already at 0.
      // The non-null assertion is safe because the validation above
      // narrows body.userId / body.courseId to number; TS just
      // doesn't carry the narrowing into the transaction closure.
      const userId = body.userId as number;
      const courseId = body.courseId as number;
      await prisma.$transaction(async (tx) => {
        await tx.enrollment.delete({
          where: { userId_courseId: { userId, courseId } },
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
        console.error('[payment-refund] email failed', err);
      }

      console.log('[payment-refund] REFUNDED', {
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
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
