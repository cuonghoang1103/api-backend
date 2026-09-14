// Shared shop-order fulfillment. Both payment gateways (VNPay IPN and the
// PayOS webhook / return-poll) funnel through `markShopOrderPaidAndFulfill`
// so the stock-decrement, idempotency and oversell handling live in ONE
// place and can't drift between gateways.

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getPayosStatus, isPayosConfigured } from '../config/payos.js';
import { emailService } from './email.service.js';
import { goiTheoSlug } from './shop/goiKeyTerminal.js';
import { baoAdmin } from './thongBaoAdmin.service.js';
import { getIO } from '../socket/messaging.socket.js';

// PayOS `orderCode` must be a single positive integer that is unique across
// the WHOLE merchant. Course orders use `CourseOrder.id` directly (small
// numbers). Shop orders would collide with those, so we offset them into a
// disjoint numeric range. Any PayOS orderCode >= this is a shop order.
export const PAYOS_SHOP_ORDER_OFFSET = 2_000_000_000;

export type FulfillResult = 'paid' | 'already' | 'notfound' | 'amount_mismatch';

/**
 * Mark a shop order PAID and run digital/stock fulfillment. Atomic
 * PENDING→PAID guard makes it idempotent under webhook retries / double
 * IPNs / concurrent return-polls. `amountPaid` (from the gateway) is checked
 * against the authoritative order total — we never fulfill an underpayment.
 */
export async function markShopOrderPaidAndFulfill(
  shopOrderId: number,
  meta: { txnNo?: string; payDate?: Date; amountPaid?: number; method?: string },
): Promise<FulfillResult> {
  const order = await prisma.shopOrder.findUnique({
    where: { id: shopOrderId },
    include: { items: true },
  });
  if (!order) return 'notfound';
  if (order.status === 'PAID') return 'already';

  // Amount integrity (defense-in-depth, mirrors the VNPay IPN amount check).
  if (meta.amountPaid !== undefined && meta.amountPaid < Number(order.total)) {
    logger.warn('shop payment amount mismatch — refusing to fulfill', {
      shopOrderId, amountPaid: meta.amountPaid, expected: Number(order.total),
    });
    return 'amount_mismatch';
  }

  const oversoldItems: string[] = [];
  // Key terminal vừa giao mà đã gắn cho người khác — kho bị nạp trùng.
  const trungKey: string[] = [];
  let flippedOk = false;

  // Digital-only orders are done the instant they're paid; physical/mixed
  // orders enter the shipping lifecycle at PROCESSING.
  const fulfillmentStatus = order.orderType === 'DIGITAL' ? 'COMPLETED' : 'PROCESSING';

  await prisma.$transaction(async (tx) => {
    const flipped = await tx.shopOrder.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: {
        status: 'PAID',
        paymentStatus: 'PAID',
        fulfillmentStatus,
        ...(meta.method ? { paymentMethod: meta.method } : {}),
        paymentId: meta.txnNo ?? null,
        paidAt: meta.payDate ?? new Date(),
      },
    });
    // Someone else already transitioned it — skip side effects.
    if (flipped.count !== 1) return;
    flippedOk = true;

    for (const item of order.items) {
      const product = await tx.product.findFirst({
        where: { name: item.productName },
        select: { id: true, slug: true, type: true, fileUrl: true, digitalContent: true },
      });
      const pType = item.productType || product?.type || 'DIGITAL';

      if (pType === 'PHYSICAL') {
        // Physical: guarded stock decrement (never negative); only bump
        // soldCount when it matched, else flag oversell (money's in — never
        // blindly claim stock we don't have).
        const dec = await tx.product.updateMany({
          where: { name: item.productName, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (dec.count === 1) {
          await tx.product.updateMany({ where: { name: item.productName }, data: { soldCount: { increment: item.quantity } } });
        } else {
          oversoldItems.push(`${item.productName} x${item.quantity}`);
        }
      } else {
        // Digital: bump soldCount and RELEASE the deliverable onto the order
        // item (only now that it's paid).
        await tx.product.updateMany({ where: { name: item.productName }, data: { soldCount: { increment: item.quantity } } });

        let delivered = false;
        // ── Key pool: hand each unit a UNIQUE, previously-unassigned key so
        // two buyers never receive the same credential. Only products that
        // actually have a pool use this; others fall back to the single
        // shared digitalContent below (legacy behaviour).
        if (product?.id) {
          const poolSize = await tx.productKey.count({ where: { productId: product.id } });
          if (poolSize > 0) {
            const claimed: string[] = [];
            // Grab a few extra candidates to absorb races with a concurrent buyer.
            const candidates = await tx.productKey.findMany({
              where: { productId: product.id, status: 'AVAILABLE' },
              orderBy: { id: 'asc' },
              take: item.quantity + 5,
            });
            for (const k of candidates) {
              if (claimed.length >= item.quantity) break;
              const c = await tx.productKey.updateMany({
                where: { id: k.id, status: 'AVAILABLE' },
                data: { status: 'SOLD', orderItemId: item.id, buyerUserId: order.userId, assignedAt: new Date() },
              });
              if (c.count === 1) claimed.push(k.content);
            }
            if (claimed.length < item.quantity) {
              // Pool ran dry — money is in but we owe key(s). Flag for manual
              // fulfillment (mirrors the physical oversell path).
              oversoldItems.push(`${item.productName} x${item.quantity} (het key/tai khoan)`);
            }
            if (claimed.length > 0) {
              // Keep product stock (= available keys) in sync with what we handed out.
              await tx.product.updateMany({
                where: { id: product.id, stockQuantity: { gte: claimed.length } },
                data: { stockQuantity: { decrement: claimed.length } },
              });
              await tx.shopOrderItem.update({
                where: { id: item.id },
                data: { fileUrl: product.fileUrl, digitalContent: claimed.join('\n---\n') },
              });

              // ── Key terminal: NỐI vào ví AI Code chung của người mua ──
              // Không có bước này thì người mua có hai hạn mức tách rời (một
              // ở terminal, một ở app desktop) = gấp đôi thứ họ trả tiền, và
              // gói "30 ngày" chạy vĩnh viễn vì không ai ghi hạn.
              // `viTien.ts`/`keyTerminal.ts`/`canh` đều đọc bảng này.
              const goi = goiTheoSlug(product.slug);

              // ── GIA HẠN thay vì cấp key mới ──────────────────────────
              //
              // Người dùng đang còn key hợp lệ CỦA CHÍNH GÓI NÀY mà mua tiếp
              // ⇒ cộng thêm ngày vào key cũ, KHÔNG đưa key mới.
              //
              // Vì sao: khách đã cắm key vào `opencode.json` trên máy họ. Đưa
              // key mới nghĩa là mỗi tháng họ phải đi sửa lại file cấu hình —
              // phiền tới mức người ta bỏ gói. Và key cũ thì vứt đi trong khi
              // vẫn còn hạn.
              //
              // ⚠️ Key vừa lấy khỏi kho được TRẢ LẠI (`AVAILABLE`): gia hạn
              // không tiêu một suất hàng. Thiếu bước này là mỗi lần gia hạn
              // đốt mất một key trong kho mà không ai nhận được nó.
              //
              // ⚠️ Cộng dồn từ MỐC CÒN LẠI, không phải từ hôm nay: gia hạn
              // sớm 5 ngày trước khi hết hạn thì 5 ngày đó không được phép
              // biến mất.
              let daGiaHan = false;
              if (goi && order.userId) {
                const dangCo = await tx.llmKeyRequest.findFirst({
                  where: {
                    userId: order.userId,
                    status: 'APPROVED',
                    source: 'SHOP',
                    productId: product.id,
                    keyValue: { not: null },
                    expiresAt: { gt: new Date() },
                  },
                  orderBy: { expiresAt: 'desc' },
                });
                if (dangCo?.expiresAt) {
                  const moc = new Date(dangCo.expiresAt.getTime() + goi.soNgay * 86_400_000 * item.quantity);
                  await tx.llmKeyRequest.update({
                    where: { id: dangCo.id },
                    data: { expiresAt: moc },
                  });
                  // Trả key vừa claim về kho.
                  await tx.productKey.updateMany({
                    where: { orderItemId: item.id, status: 'SOLD' },
                    data: { status: 'AVAILABLE', orderItemId: null, buyerUserId: null, assignedAt: null },
                  });
                  await tx.product.updateMany({
                    where: { id: product.id },
                    data: { stockQuantity: { increment: claimed.length } },
                  });
                  // Dòng đơn nói rõ chuyện gì đã xảy ra — khách mở ra mà thấy
                  // một chuỗi key mới thì họ sẽ đi thay cấu hình, đúng thứ ta
                  // vừa cố tránh.
                  await tx.shopOrderItem.update({
                    where: { id: item.id },
                    data: {
                      digitalContent:
                        `✅ ĐÃ GIA HẠN key hiện tại của bạn — không cần đổi gì trong cấu hình.

`
                        + `Hạn mới: ${moc.toLocaleString('vi-VN')}
`
                        + `Key của bạn giữ nguyên, cứ dùng tiếp như bình thường.`,
                    },
                  });
                  daGiaHan = true;
                }
              }

              if (goi && order.userId && !daGiaHan) {
                const hetHan = new Date(Date.now() + goi.soNgay * 86_400_000 * item.quantity);
                for (const key of claimed) {
                  // Một key chỉ được gắn cho MỘT người. Giao lại key đã gắn
                  // (lỗi vận hành, nạp trùng vào kho) thì bỏ qua chứ không
                  // ghi đè — ghi đè là cướp ví của người mua trước.
                  const daGan = await tx.llmKeyRequest.findFirst({
                    where: { keyValue: key },
                    select: { id: true },
                  });
                  if (daGan) {
                    trungKey.push(key.slice(0, 12));
                    continue;
                  }
                  await tx.llmKeyRequest.create({
                    data: {
                      userId: order.userId,
                      reason: `Mua ở shop — đơn ${order.orderCode} · ${item.productName}`,
                      status: 'APPROVED',
                      source: 'SHOP',
                      productId: product.id,
                      keyValue: key,
                      keyHien: `${key.slice(0, 6)}…${key.slice(-4)}`,
                      quotaUsd: goi.quotaUsd,
                      expiresAt: hetHan,
                      resolvedAt: new Date(),
                    },
                  });
                }
              }
            }
            delivered = true; // keyed product handled (fully or partially) — skip legacy copy
          }
        }

        if (!delivered && product && (product.fileUrl || product.digitalContent)) {
          await tx.shopOrderItem.update({
            where: { id: item.id },
            data: { fileUrl: product.fileUrl, digitalContent: product.digitalContent },
          });
        }
      }
    }
  });

  if (trungKey.length > 0) {
    logger.error('key terminal đã giao NHƯNG trùng với key đã gắn cho người khác — kiểm kho key', {
      orderCode: order.orderCode, shopOrderId: order.id, keys: trungKey,
    });
  }
  if (oversoldItems.length > 0) {
    logger.error('shop order PAID but stock insufficient — manual fulfillment needed', {
      orderCode: order.orderCode, shopOrderId: order.id, oversold: oversoldItems,
    });
  }
  if (flippedOk) {
    logger.info('shop order fulfilled', {
      orderCode: order.orderCode, shopOrderId: order.id, method: meta.method, txnNo: meta.txnNo, orderType: order.orderType,
    });
    // ── Báo NGƯỜI MUA: đơn đã thanh toán, hàng đã giao ──
    //
    // Trang "Đơn của tôi" nạp một lần lúc mở. Khách trả tiền xong quay lại tab
    // cũ thì vẫn thấy "chờ thanh toán" cho tới khi họ tự tải lại — và với đơn
    // chuyển khoản (admin duyệt tay) thì khoảng chờ đó tính bằng phút hoặc
    // giờ. Chỉ báo "có thay đổi", KHÔNG gửi kèm key qua socket.
    if (order.userId) {
      try {
        getIO()?.to(`user:${order.userId}`).emit('shop:don-doi-trang-thai', {
          orderCode: order.orderCode,
          trangThai: 'PAID',
        });
      } catch { /* socket chưa sẵn sàng — trang vẫn có nhịp hỏi lại */ }
    }

    // ── Báo admin ──
    // Gọi NGOÀI `$transaction` (giao dịch đã đóng ở trên): nằm trong đó thì
    // nó giữ kết nối suốt thời gian chờ mạng Telegram, và nếu giao dịch bị
    // cuộn lại thì tin đã trót gửi cho một đơn không tồn tại.
    // `khoaChongTrung` vì webhook PayOS gọi lại nhiều lần cho cùng một đơn.
    const hang = order.items.map((it) => `${it.productName} ×${it.quantity}`).join(', ');
    void baoAdmin({
      loai: 'DA_THANH_TOAN',
      mucDo: oversoldItems.length > 0 || trungKey.length > 0 ? 'can_xu_ly' : 'thuong',
      tieuDe: oversoldItems.length > 0
        ? `⚠️ Đã thu tiền NHƯNG thiếu hàng — ${order.orderCode}`
        : `Thanh toán thành công — ${order.orderCode}`,
      noiDung: [
        `${Number(order.total).toLocaleString('vi-VN')}đ · ${meta.method ?? 'không rõ'}`,
        hang,
        order.buyerName ? `Khách: ${order.buyerName}` : null,
        oversoldItems.length > 0 ? `THIẾU: ${oversoldItems.join('; ')}` : null,
        trungKey.length > 0 ? `KEY TRÙNG: ${trungKey.join('; ')}` : null,
      ].filter(Boolean).join('\n'),
      duongDan: '/admin/orders',
      userId: order.userId ?? null,
      entityId: order.id,
      khoaChongTrung: `DA_THANH_TOAN:shop:${order.id}`,
    });
    // Confirmation email (best-effort — never block/undo fulfillment on failure).
    try {
      await emailService.sendShopReceiptEmail({
        to: order.buyerEmail,
        fullName: order.buyerName,
        orderCode: order.orderCode,
        orderType: order.orderType,
        items: order.items.map((it) => ({ name: it.productName, quantity: it.quantity, total: Number(it.total) })),
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        total: Number(order.total),
        paidAt: meta.payDate ?? new Date(),
        shippingAddress: order.buyerAddress,
      });
    } catch (err) {
      logger.error('shop receipt email failed', { orderCode: order.orderCode, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return flippedOk ? 'paid' : 'already';
}

/**
 * Webhook-independent confirmation: when a still-PENDING PayOS shop order is
 * polled (return page / my-orders), ask PayOS directly whether it was paid
 * and fulfill if so. This makes "Đang xác nhận thanh toán" resolve even if
 * the merchant hasn't wired the webhook or it lagged. Safe/idempotent.
 */
export async function reconcilePayosShopOrder(
  order: { id: number; status: string; paymentMethod: string },
): Promise<void> {
  if (order.status !== 'PENDING' || order.paymentMethod !== 'PAYOS' || !isPayosConfigured()) return;
  try {
    const st = await getPayosStatus(PAYOS_SHOP_ORDER_OFFSET + order.id);
    if (st?.status === 'PAID') {
      await markShopOrderPaidAndFulfill(order.id, {
        txnNo: 'payos-reconcile', payDate: new Date(), amountPaid: st.amountPaid, method: 'PAYOS',
      });
    }
  } catch (err) {
    logger.warn('reconcilePayosShopOrder failed', { shopOrderId: order.id, error: err instanceof Error ? err.message : String(err) });
  }
}
