/**
 * Nạp ví · Bán gói Pro.
 * ─────────────────────────────────────────────────────────────────────────
 * Hai luồng, cùng một hình dạng: tạo đơn PENDING → trả tiền (cổng/chuyển
 * khoản/ví) → một hàm "đã trả" DUY NHẤT chạy phần hậu kỳ.
 *
 * Vì sao mỗi luồng chỉ có MỘT hàm hậu kỳ: mỗi cách trả tiền (PayOS webhook,
 * PayOS đối soát lại, admin xác nhận chuyển khoản) đều gọi đúng hàm đó. Có
 * hai đường giao hàng là sớm muộn cũng có một đường quên cộng điểm, quên gửi
 * mail, hoặc cộng hai lần — đây chính là lớp lỗi làm mất tiền của người mua.
 *
 * Mọi hàm hậu kỳ đều IDEMPOTENT: gọi lại không tạo hiệu ứng thứ hai. Cổng
 * thanh toán gửi lại webhook là chuyện bình thường.
 */
import { nanoid } from 'nanoid';
import { prisma } from '../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { congDiem, truDiem, vndSangDiem, tinhDiemThuong, MIN_TOPUP_VND, MAX_TOPUP_VND } from './points.service.js';
import { grantProToUser } from './pro.service.js';

/** Đơn chưa trả sống bao lâu. Hết hạn thì không cho trả nữa. */
const ORDER_TTL_MINUTES = parseInt(process.env.BILLING_ORDER_TTL_MINUTES || '60', 10);

function maDon(tienTo: string): string {
  return `${tienTo}-${Date.now()}-${nanoid(6).toUpperCase()}`;
}

function hetHanMoi(): Date {
  return new Date(Date.now() + ORDER_TTL_MINUTES * 60_000);
}

// ════════════════════════════ NẠP VÍ ════════════════════════════

export async function layMocNap() {
  const tiers = await prisma.topupTier.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { amountVnd: 'asc' }],
  });
  return tiers.map((t) => {
    const basePoints = vndSangDiem(t.amountVnd);
    const bonusPoints = tinhDiemThuong(basePoints, t.bonusPercent);
    return {
      id: t.id,
      amountVnd: t.amountVnd,
      bonusPercent: t.bonusPercent,
      basePoints,
      bonusPoints,
      totalPoints: basePoints + bonusPoints,
      label: t.label,
      popular: t.popular,
    };
  });
}

/**
 * % thưởng áp cho một số tiền tuỳ ý: lấy theo mốc CAO NHẤT mà số tiền
 * này với tới. Nạp 300k thì hưởng mốc 200k, không phải mốc 500k.
 */
async function phanTramThuongCho(amountVnd: number): Promise<number> {
  const moc = await prisma.topupTier.findFirst({
    where: { active: true, amountVnd: { lte: amountVnd } },
    orderBy: { amountVnd: 'desc' },
    select: { bonusPercent: true },
  });
  return moc?.bonusPercent ?? 0;
}

export interface TaoDonNapInput {
  userId: number;
  amountVnd: number;
  paymentMethod: 'PAYOS' | 'BANK_TRANSFER';
  idempotencyKey?: string | null;
}

export async function taoDonNap(input: TaoDonNapInput) {
  const amountVnd = Math.floor(Number(input.amountVnd));
  if (!Number.isInteger(amountVnd) || amountVnd < MIN_TOPUP_VND) {
    throw new BadRequestError(`Số tiền nạp tối thiểu là ${MIN_TOPUP_VND.toLocaleString('vi-VN')}đ`);
  }
  if (amountVnd > MAX_TOPUP_VND) {
    throw new BadRequestError(`Số tiền nạp tối đa là ${MAX_TOPUP_VND.toLocaleString('vi-VN')}đ mỗi lượt`);
  }

  // Double-click: cùng khoá thì trả lại ĐÚNG đơn cũ thay vì đẻ đơn thứ hai.
  if (input.idempotencyKey) {
    const cu = await prisma.topupOrder.findUnique({
      where: { uk_topup_idempotency: { userId: input.userId, idempotencyKey: input.idempotencyKey } },
    });
    if (cu) return cu;
  }

  const bonusPercent = await phanTramThuongCho(amountVnd);
  const basePoints = vndSangDiem(amountVnd);
  const bonusPoints = tinhDiemThuong(basePoints, bonusPercent);

  try {
    return await prisma.topupOrder.create({
      data: {
        orderCode: maDon('NAP'),
        userId: input.userId,
        amountVnd,
        basePoints,
        bonusPoints,
        totalPoints: basePoints + bonusPoints,
        bonusPercent,
        status: 'PENDING',
        paymentMethod: input.paymentMethod,
        expiresAt: hetHanMoi(),
        idempotencyKey: input.idempotencyKey ?? null,
      },
    });
  } catch (err) {
    // Cuộc đua double-click: lượt thua đọc lại đơn của lượt thắng.
    if ((err as { code?: string })?.code === 'P2002' && input.idempotencyKey) {
      const cu = await prisma.topupOrder.findUnique({
        where: { uk_topup_idempotency: { userId: input.userId, idempotencyKey: input.idempotencyKey } },
      });
      if (cu) return cu;
    }
    throw err;
  }
}

/**
 * Đơn nạp ĐÃ TRẢ → cộng điểm vào ví. Idempotent hai lớp:
 *  - `updateMany` chỉ ăn khi đơn còn PENDING (lượt thứ hai được 0 dòng);
 *  - sổ điểm có khoá `topup:<id>` nên dù có lọt cũng không cộng hai lần.
 */
export async function capNhatDonNapDaTra(
  topupOrderId: number,
  meta: { paymentId?: string | null; amountPaid?: number | null; method?: string },
): Promise<'paid' | 'already' | 'notfound' | 'amount_mismatch'> {
  const order = await prisma.topupOrder.findUnique({ where: { id: topupOrderId } });
  if (!order) return 'notfound';
  if (order.status === 'PAID') return 'already';

  // Trả thiếu thì KHÔNG cộng điểm. Cộng theo số tiền khai trong đơn mà
  // không đối chiếu số thực nhận là cách kinh điển để mất tiền.
  if (meta.amountPaid != null && Number(meta.amountPaid) < order.amountVnd) {
    logger.warn('[billing] nạp ví: số tiền nhận ÍT HƠN đơn — từ chối cộng điểm', {
      orderCode: order.orderCode, canTra: order.amountVnd, thucNhan: meta.amountPaid,
    });
    return 'amount_mismatch';
  }

  const ketQua = await prisma.$transaction(async (tx) => {
    const hit = await tx.topupOrder.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentId: meta.paymentId ?? null,
        ...(meta.method ? { paymentMethod: meta.method } : {}),
      },
    });
    if (hit.count === 0) return 'already' as const;

    await congDiem(
      {
        userId: order.userId,
        points: order.totalPoints,
        kind: 'TOPUP',
        refKind: 'TOPUP_ORDER',
        refId: order.id,
        description:
          order.bonusPoints > 0
            ? `Nạp ${order.amountVnd.toLocaleString('vi-VN')}đ (+${order.bonusPercent}% thưởng)`
            : `Nạp ${order.amountVnd.toLocaleString('vi-VN')}đ`,
        idempotencyKey: `topup:${order.id}`,
      },
      tx,
    );
    return 'paid' as const;
  });

  if (ketQua === 'paid') {
    logger.info('[billing] nạp ví thành công', {
      orderCode: order.orderCode, userId: order.userId, diem: order.totalPoints,
    });
  }
  return ketQua;
}

// ════════════════════════════ GÓI PRO ════════════════════════════

export async function layBangGiaPro() {
  const plans = await prisma.proPlan.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { months: 'asc' }],
  });
  return plans.map((p) => {
    const giaGoc = p.originalPriceVnd ?? p.priceVnd;
    const tietKiem = giaGoc > p.priceVnd ? Math.round(((giaGoc - p.priceVnd) / giaGoc) * 100) : 0;
    return {
      id: p.id,
      code: p.code,
      name: p.name,
      months: p.months,
      priceVnd: p.priceVnd,
      originalPriceVnd: p.originalPriceVnd,
      /** Giá quy về MỘT THÁNG — con số duy nhất so sánh được giữa các gói. */
      pricePerMonthVnd: Math.round(p.priceVnd / p.months),
      savingPercent: tietKiem,
      description: p.description,
      badge: p.badge,
      popular: p.popular,
      pointsRequired: vndSangDiem(p.priceVnd),
    };
  });
}

/** Số ngày Pro cho `months` tháng. 30 ngày/tháng — nói rõ trên UI. */
export function ngayChoThang(months: number): number {
  return months * 30;
}

export interface TaoDonProInput {
  userId: number;
  planCode: string;
  paymentMethod: 'POINTS' | 'PAYOS' | 'BANK_TRANSFER';
  idempotencyKey?: string | null;
}

/**
 * Tạo đơn mua Pro. Trả bằng ĐIỂM thì trừ và cấp Pro NGAY trong cùng một
 * transaction — không có trạng thái lửng nào giữa "đã trừ điểm" và "đã có
 * Pro" để mà kẹt lại.
 */
export async function taoDonPro(input: TaoDonProInput) {
  const plan = await prisma.proPlan.findUnique({ where: { code: input.planCode } });
  if (!plan || !plan.active) throw new NotFoundError('Gói Pro không tồn tại hoặc đã ngừng bán');

  if (input.idempotencyKey) {
    const cu = await prisma.proOrder.findUnique({
      where: { uk_pro_order_idempotency: { userId: input.userId, idempotencyKey: input.idempotencyKey } },
    });
    if (cu) return { order: cu, granted: cu.granted };
  }

  const grantedDays = ngayChoThang(plan.months);

  // ── Trả bằng ví: một transaction, hoặc xong hết hoặc không gì cả ──
  if (input.paymentMethod === 'POINTS') {
    const diemCan = vndSangDiem(plan.priceVnd);

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.proOrder.create({
        data: {
          orderCode: maDon('PRO'),
          userId: input.userId,
          planId: plan.id,
          planCode: plan.code,
          planName: plan.name,
          months: plan.months,
          amountVnd: plan.priceVnd,
          pointsUsed: diemCan,
          status: 'PENDING',
          paymentMethod: 'POINTS',
          grantedDays,
          idempotencyKey: input.idempotencyKey ?? null,
        },
      });

      // Ném BadRequestError nếu không đủ điểm → transaction cuộn ngược,
      // đơn vừa tạo cũng biến mất. Không để lại đơn rác.
      await truDiem(
        {
          userId: input.userId,
          points: diemCan,
          kind: 'SPEND',
          refKind: 'PRO_ORDER',
          refId: o.id,
          description: `Mua ${plan.name}`,
          idempotencyKey: `pro:${o.id}`,
        },
        tx,
      );

      await tx.proOrder.update({
        where: { id: o.id },
        data: { status: 'PAID', paidAt: new Date(), granted: true },
      });
      return o;
    });

    // Cấp Pro NGOÀI transaction: grantProToUser đọc-rồi-ghi trên bảng users
    // và có logic cộng dồn hạn riêng. Nếu bước này hỏng, đơn đã PAID và
    // điểm đã trừ — cứu bằng `capLaiProChoDonTreo()` chứ không mất tiền.
    await grantProToUser(input.userId, grantedDays, 'PURCHASE');
    logger.info('[billing] mua Pro bằng điểm', {
      orderCode: order.orderCode, userId: input.userId, plan: plan.code, diem: diemCan,
    });
    return { order, granted: true };
  }

  // ── Trả bằng cổng / chuyển khoản: chỉ tạo đơn, cấp Pro khi tiền về ──
  const order = await prisma.proOrder.create({
    data: {
      orderCode: maDon('PRO'),
      userId: input.userId,
      planId: plan.id,
      planCode: plan.code,
      planName: plan.name,
      months: plan.months,
      amountVnd: plan.priceVnd,
      pointsUsed: 0,
      status: 'PENDING',
      paymentMethod: input.paymentMethod,
      grantedDays,
      expiresAt: hetHanMoi(),
      idempotencyKey: input.idempotencyKey ?? null,
    },
  });
  return { order, granted: false };
}

/**
 * Đơn Pro ĐÃ TRẢ → cấp/gia hạn Pro. Idempotent qua cờ `granted`.
 */
export async function capNhatDonProDaTra(
  proOrderId: number,
  meta: { paymentId?: string | null; amountPaid?: number | null; method?: string },
): Promise<'paid' | 'already' | 'notfound' | 'amount_mismatch'> {
  const order = await prisma.proOrder.findUnique({ where: { id: proOrderId } });
  if (!order) return 'notfound';
  if (order.granted) return 'already';

  if (meta.amountPaid != null && Number(meta.amountPaid) < order.amountVnd) {
    logger.warn('[billing] mua Pro: số tiền nhận ÍT HƠN đơn — từ chối cấp Pro', {
      orderCode: order.orderCode, canTra: order.amountVnd, thucNhan: meta.amountPaid,
    });
    return 'amount_mismatch';
  }

  // `granted: false` trong WHERE là chốt chặn thật: hai webhook cùng lúc
  // thì chỉ một lượt lấy được dòng.
  const hit = await prisma.proOrder.updateMany({
    where: { id: order.id, granted: false },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      granted: true,
      paymentId: meta.paymentId ?? null,
      ...(meta.method ? { paymentMethod: meta.method } : {}),
    },
  });
  if (hit.count === 0) return 'already';

  await grantProToUser(order.userId, order.grantedDays ?? ngayChoThang(order.months), 'PURCHASE');
  logger.info('[billing] cấp Pro sau thanh toán', {
    orderCode: order.orderCode, userId: order.userId, ngay: order.grantedDays,
  });
  return 'paid';
}

/**
 * Lưới cứu: đơn đã PAID + granted nhưng `grantProToUser` hỏng giữa chừng
 * (mất kết nối DB đúng lúc đó). Chạy lại việc cấp cho những đơn như vậy.
 * An toàn khi chạy lại vì grantProToUser cộng dồn theo hạn hiện có —
 * nên chỉ gọi cho đơn THẬT SỰ treo, dò bằng `paidAt` gần đây + Pro chưa có.
 */
export async function capLaiProChoDonTreo(proOrderId: number): Promise<boolean> {
  const o = await prisma.proOrder.findUnique({ where: { id: proOrderId } });
  if (!o || o.status !== 'PAID') return false;
  await grantProToUser(o.userId, o.grantedDays ?? ngayChoThang(o.months), 'PURCHASE');
  return true;
}

// ════════════════════════ DỌN ĐƠN QUÁ HẠN ════════════════════════

/**
 * Đơn PENDING quá hạn → EXPIRED. Chạy định kỳ.
 * CHỈ đụng tới đơn chưa trả: đã PAID thì tiền đã về, không bao giờ hết hạn.
 */
export async function donDonQuaHan(): Promise<{ topup: number; pro: number; shop: number }> {
  const now = new Date();
  const dieuKien = { status: 'PENDING', expiresAt: { lt: now } } as const;
  const [topup, pro, shop] = await Promise.all([
    prisma.topupOrder.updateMany({ where: dieuKien, data: { status: 'EXPIRED' } }),
    prisma.proOrder.updateMany({ where: dieuKien, data: { status: 'EXPIRED' } }),
    prisma.shopOrder.updateMany({
      where: { status: 'PENDING', expiresAt: { lt: now } },
      data: { status: 'CANCELLED', paymentStatus: 'EXPIRED' },
    }),
  ]);
  const kq = { topup: topup.count, pro: pro.count, shop: shop.count };
  if (kq.topup || kq.pro || kq.shop) logger.info('[billing] dọn đơn quá hạn', kq);
  return kq;
}

/** Huỷ một đơn PENDING do chính chủ bấm huỷ. */
export async function huyDon(
  loai: 'TOPUP' | 'PRO',
  orderCode: string,
  userId: number,
): Promise<void> {
  const bang = loai === 'TOPUP' ? prisma.topupOrder : prisma.proOrder;
  const o = await (bang as typeof prisma.topupOrder).findUnique({ where: { orderCode } });
  if (!o) throw new NotFoundError('Đơn không tồn tại');
  if (o.userId !== userId) throw new NotFoundError('Đơn không tồn tại');
  if (o.status !== 'PENDING') throw new ConflictError(`Đơn đang ở trạng thái ${o.status}, không huỷ được`);
  await (bang as typeof prisma.topupOrder).update({ where: { id: o.id }, data: { status: 'CANCELLED' } });
}
