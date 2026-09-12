/**
 * Quản trị thương mại — đối soát chuyển khoản · đổi key hỏng · doanh thu.
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/admin/commerce
 *
 * Ba việc, gom một chỗ vì chúng cùng phục vụ một người (chủ shop) và cùng
 * đọc một tập bảng.
 */
import { Router, type Request, type Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { BadRequestError, ConflictError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { layCauHinh } from '../services/bankTransfer.service.js';
import { markShopOrderPaidAndFulfill } from '../services/shopFulfillment.js';
import { markCourseOrderPaidAndEnroll } from './payment.routes.js';
import { capNhatDonNapDaTra, capNhatDonProDaTra } from '../services/billing.service.js';
import * as thongKe from '../services/commerceStats.service.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

// ═══════════════════ 1. CẤU HÌNH NHẬN CHUYỂN KHOẢN ═══════════════════

router.get('/payment-settings', async (_req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await layCauHinh() });
  } catch (err) { next(err); }
});

router.put('/payment-settings', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const b = req.body as Record<string, unknown>;

    // Bật chuyển khoản mà thiếu một trong ba trường là người mua nhìn thấy
    // một mã QR hỏng. Chặn ngay ở đây.
    const bat = !!b.bankTransferEnabled;
    const bin = b.bankBin ? String(b.bankBin).trim() : null;
    const stk = b.bankAccountNo ? String(b.bankAccountNo).trim() : null;
    const ten = b.bankAccountName ? String(b.bankAccountName).trim() : null;
    if (bat) {
      if (!bin || !/^\d{6}$/.test(bin)) throw new BadRequestError('Mã BIN ngân hàng phải đúng 6 chữ số (vd Vietcombank = 970436)');
      if (!stk || !/^\d{4,19}$/.test(stk)) throw new BadRequestError('Số tài khoản chỉ gồm chữ số, 4–19 ký tự');
      if (!ten) throw new BadRequestError('Vui lòng nhập tên chủ tài khoản');
    }

    const data = await prisma.paymentSetting.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        bankTransferEnabled: bat,
        bankBin: bin, bankAccountNo: stk, bankAccountName: ten,
        bankName: b.bankName ? String(b.bankName).slice(0, 120) : null,
        transferTtlMinutes: Math.max(5, Math.min(1440, Math.floor(Number(b.transferTtlMinutes) || 60))),
        note: b.note ? String(b.note) : null,
        updatedBy: req.userId ?? null,
      },
      update: {
        bankTransferEnabled: bat,
        bankBin: bin, bankAccountNo: stk, bankAccountName: ten,
        bankName: b.bankName === undefined ? undefined : b.bankName ? String(b.bankName).slice(0, 120) : null,
        transferTtlMinutes: b.transferTtlMinutes === undefined ? undefined : Math.max(5, Math.min(1440, Math.floor(Number(b.transferTtlMinutes)))),
        note: b.note === undefined ? undefined : b.note ? String(b.note) : null,
        updatedBy: req.userId ?? null,
      },
    });
    logger.info('[commerce] cập nhật cấu hình thanh toán', { adminId: req.userId, bật: bat });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ═══════════════════ 2. ĐỐI SOÁT CHUYỂN KHOẢN ═══════════════════════

router.get('/bank-transfers', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const size = Math.min(100, Math.max(1, Number(req.query.size) || 30));
    const page = Math.max(0, Number(req.query.page) || 0);
    const status = req.query.status ? String(req.query.status) : undefined;
    const q = req.query.q ? String(req.query.q).trim().toUpperCase() : undefined;
    const where: Prisma.BankTransferWhereInput = {
      ...(status ? { status } : {}),
      ...(q ? { OR: [{ refCode: { contains: q } }, { orderCode: { contains: q } }] } : {}),
    };
    const [rows, total] = await Promise.all([
      prisma.bankTransfer.findMany({ where, orderBy: { createdAt: 'desc' }, skip: page * size, take: size }),
      prisma.bankTransfer.count({ where }),
    ]);
    res.json({ success: true, data: rows, pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) } });
  } catch (err) { next(err); }
});

/**
 * XÁC NHẬN đã nhận tiền → giao hàng.
 *
 * ⚠️ Đây là nút NGUY HIỂM NHẤT của trang quản trị: bấm nhầm là giao hàng
 * không công. Ba chốt:
 *  1. Chỉ ăn khi lượt chuyển còn AWAITING (`updateMany` có điều kiện) — hai
 *     admin bấm cùng lúc thì chỉ một lượt đi tiếp.
 *  2. Giao hàng gọi ĐÚNG hàm mà cổng thanh toán gọi, không có đường thứ hai.
 *  3. `amountPaid` truyền đúng số đã khai, nên chốt đối chiếu số tiền bên
 *     trong các hàm đó vẫn hoạt động.
 */
router.post('/bank-transfers/:refCode/confirm', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const refCode = String(req.params.refCode).toUpperCase();
    const row = await prisma.bankTransfer.findUnique({ where: { refCode } });
    if (!row) throw new NotFoundError('Không tìm thấy lượt chuyển khoản');
    if (row.status === 'CONFIRMED') throw new ConflictError('Lượt này đã được xác nhận trước đó');

    const hit = await prisma.bankTransfer.updateMany({
      where: { refCode, status: { in: ['AWAITING', 'EXPIRED'] } },
      data: {
        status: 'CONFIRMED',
        confirmedBy: req.userId ?? null,
        confirmedAt: new Date(),
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : null,
      },
    });
    if (hit.count === 0) throw new ConflictError(`Lượt này đang ở trạng thái ${row.status}, không xác nhận được`);

    const meta = { paymentId: `BANK:${refCode}`, amountPaid: row.amountVnd, method: 'BANK_TRANSFER' };
    let ketQua: string;
    switch (row.orderKind) {
      case 'SHOP':
        ketQua = await markShopOrderPaidAndFulfill(row.orderId, {
          txnNo: `BANK:${refCode}`, payDate: new Date(), amountPaid: row.amountVnd, method: 'BANK_TRANSFER',
        });
        break;
      case 'TOPUP':
        ketQua = await capNhatDonNapDaTra(row.orderId, meta);
        break;
      case 'PRO':
        ketQua = await capNhatDonProDaTra(row.orderId, meta);
        break;
      case 'COURSE':
        ketQua = await markCourseOrderPaidAndEnroll(row.orderId, {
          txnNo: `BANK:${refCode}`, payDate: new Date(), amountPaid: row.amountVnd,
        });
        break;
      default:
        throw new BadRequestError(`Loại đơn không hiểu được: ${row.orderKind}`);
    }

    logger.info('[commerce] xác nhận chuyển khoản', {
      refCode, loai: row.orderKind, orderId: row.orderId, adminId: req.userId, ketQua,
    });
    res.json({ success: true, data: { refCode, fulfillment: ketQua } });
  } catch (err) { next(err); }
});

router.post('/bank-transfers/:refCode/reject', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const refCode = String(req.params.refCode).toUpperCase();
    const hit = await prisma.bankTransfer.updateMany({
      where: { refCode, status: { in: ['AWAITING', 'EXPIRED'] } },
      data: {
        status: 'REJECTED',
        confirmedBy: req.userId ?? null,
        confirmedAt: new Date(),
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Không nhận được tiền',
      },
    });
    if (hit.count === 0) throw new ConflictError('Lượt này không ở trạng thái từ chối được');
    res.json({ success: true, data: { refCode, rejected: true } });
  } catch (err) { next(err); }
});

// ═══════════════════ 3. YÊU CẦU ĐỔI KEY HỎNG ════════════════════════

router.get('/key-replacements', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const size = Math.min(100, Math.max(1, Number(req.query.size) || 30));
    const page = Math.max(0, Number(req.query.page) || 0);
    const status = req.query.status ? String(req.query.status) : undefined;
    const where = status ? { status } : {};
    const [rows, total] = await Promise.all([
      prisma.keyReplacementRequest.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: page * size, take: size,
        include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
      }),
      prisma.keyReplacementRequest.count({ where }),
    ]);
    res.json({ success: true, data: rows, pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) } });
  } catch (err) { next(err); }
});

/**
 * DUYỆT đổi key: lấy một key AVAILABLE trong kho của đúng sản phẩm, gán
 * cho người mua, thu hồi key cũ, và cập nhật bản chụp trên dòng đơn hàng.
 *
 * Tất cả trong MỘT transaction: cấp key mới mà không thu key cũ là phát
 * không một key; thu key cũ mà không cấp được key mới là người mua mất
 * hàng đã trả tiền. Cả hai đều không được phép xảy ra một nửa.
 */
router.post('/key-replacements/:id/approve', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const yc = await prisma.keyReplacementRequest.findUnique({ where: { id } });
    if (!yc) throw new NotFoundError('Yêu cầu không tồn tại');
    if (yc.status !== 'PENDING') throw new ConflictError(`Yêu cầu đã ở trạng thái ${yc.status}`);

    const ketQua = await prisma.$transaction(async (tx) => {
      // Chốt tranh chấp: chỉ một admin lấy được yêu cầu này.
      const lay = await tx.keyReplacementRequest.updateMany({
        where: { id, status: 'PENDING' },
        data: { status: 'APPROVED', resolvedBy: req.userId ?? null, resolvedAt: new Date() },
      });
      if (lay.count === 0) throw new ConflictError('Yêu cầu vừa được người khác xử lý');

      const item = await tx.shopOrderItem.findUnique({ where: { id: yc.orderItemId } });
      if (!item) throw new NotFoundError('Dòng đơn hàng không còn tồn tại');

      // Sản phẩm khớp theo TÊN — đúng cách dòng đơn hàng vốn đang liên hệ
      // với kho (xem chú thích denormalized trên ShopOrderItem).
      const sp = await tx.product.findFirst({ where: { name: item.productName }, select: { id: true } });
      if (!sp) throw new BadRequestError('Không tìm thấy sản phẩm tương ứng trong kho');

      const keyMoi = await tx.productKey.findFirst({
        where: { productId: sp.id, status: 'AVAILABLE' },
        orderBy: { id: 'asc' },
      });
      if (!keyMoi) throw new BadRequestError('Kho đã hết key khả dụng cho sản phẩm này. Nhập thêm key rồi duyệt lại.');

      // Giành key bằng updateMany có điều kiện status — hai yêu cầu chạy
      // song song không thể cùng lấy một key.
      const giành = await tx.productKey.updateMany({
        where: { id: keyMoi.id, status: 'AVAILABLE' },
        data: { status: 'SOLD', orderItemId: item.id, buyerUserId: yc.userId, assignedAt: new Date() },
      });
      if (giành.count === 0) throw new ConflictError('Key vừa bị lượt khác lấy mất, vui lòng thử lại');

      // Thu hồi key cũ (nếu tìm được) — DISABLED chứ không xoá, để còn
      // truy ngược khi có tranh chấp.
      let oldKeyId: number | null = null;
      const keyCu = await tx.productKey.findFirst({
        where: { productId: sp.id, orderItemId: item.id, status: 'SOLD', id: { not: keyMoi.id } },
        orderBy: { id: 'asc' },
      });
      if (keyCu) {
        await tx.productKey.update({ where: { id: keyCu.id }, data: { status: 'DISABLED' } });
        oldKeyId = keyCu.id;
      }

      await tx.shopOrderItem.update({ where: { id: item.id }, data: { digitalContent: keyMoi.content } });
      await tx.keyReplacementRequest.update({
        where: { id },
        data: {
          oldKeyId,
          newKeyId: keyMoi.id,
          adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : null,
        },
      });

      return { newKeyId: keyMoi.id, oldKeyId };
    });

    logger.info('[commerce] duyệt đổi key', { requestId: id, adminId: req.userId, ...ketQua });
    res.json({ success: true, data: ketQua });
  } catch (err) { next(err); }
});

router.post('/key-replacements/:id/reject', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const hit = await prisma.keyReplacementRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Không đủ căn cứ',
      },
    });
    if (hit.count === 0) throw new ConflictError('Yêu cầu không ở trạng thái từ chối được');
    res.json({ success: true, data: { rejected: true } });
  } catch (err) { next(err); }
});

// ═══════════════════ 4. BẢNG ĐIỀU KHIỂN DOANH THU ═══════════════════

/**
 * Một lần gọi trả về đủ dữ liệu cho cả trang.
 * `?days=7|30|90` — mặc định 30.
 */
router.get('/dashboard', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const soNgay = Math.min(365, Math.max(1, Number(req.query.days) || 30));
    res.json({ success: true, data: await thongKe.bangDieuKhien(soNgay) });
  } catch (err) { next(err); }
});

export default router;
