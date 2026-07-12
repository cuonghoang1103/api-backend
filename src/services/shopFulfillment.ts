// Shared shop-order fulfillment. Both payment gateways (VNPay IPN and the
// PayOS webhook / return-poll) funnel through `markShopOrderPaidAndFulfill`
// so the stock-decrement, idempotency and oversell handling live in ONE
// place and can't drift between gateways.

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getPayosStatus, isPayosConfigured } from '../config/payos.js';
import { emailService } from './email.service.js';

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
        select: { id: true, type: true, fileUrl: true, digitalContent: true },
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

  if (oversoldItems.length > 0) {
    logger.error('shop order PAID but stock insufficient — manual fulfillment needed', {
      orderCode: order.orderCode, shopOrderId: order.id, oversold: oversoldItems,
    });
  }
  if (flippedOk) {
    logger.info('shop order fulfilled', {
      orderCode: order.orderCode, shopOrderId: order.id, method: meta.method, txnNo: meta.txnNo, orderType: order.orderType,
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
