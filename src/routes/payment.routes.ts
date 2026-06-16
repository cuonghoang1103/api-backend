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
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  buildCoursePaymentUrl,
  getClientIp,
  verifyIpnCall,
  verifyReturnUrl,
} from '../services/payment/vnpay.service.js';
import type { ApiResponse } from '../types/index.js';
import type { VnpIpnParsed } from './payment.types.js';

const router = Router();

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
// Body: { courseId: number }
// Returns: { orderCode, paymentUrl, amount }
router.post('/course', authenticate, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { courseId } = req.body as { courseId?: unknown };
    if (typeof courseId !== 'number' || !Number.isInteger(courseId)) {
      throw new AppError('courseId phai la so nguyen', 400);
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

    // Block if there's already a PENDING order (avoid creating multiple)
    const existingPending = await prisma.courseOrder.findFirst({
      where: { userId: req.userId!, courseId, status: 'PENDING' },
    });
    if (existingPending) {
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
        },
      });
      return;
    }

    const finalAmount = computeFinalPrice(
      course.price,
      course.discountPrice,
      course.discountExpiresAt,
    );

    const orderCode = generateOrderCode(courseId, req.userId!);

    await prisma.courseOrder.create({
      data: {
        orderCode,
        userId: req.userId!,
        courseId,
        amount: new Prisma.Decimal(finalAmount),
        status: 'PENDING',
        paymentMethod: 'VNPAY',
      },
    });

    const paymentUrl = buildCoursePaymentUrl(
      orderCode,
      finalAmount,
      `Thanh toan khoa hoc ${course.title}`,
      getClientIp(req),
    );

    res.json({
      success: true,
      data: { orderCode, paymentUrl, amount: finalAmount },
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
router.post('/vnpay/ipn', async (req: Request, res: Response, next) => {
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

export default router;
