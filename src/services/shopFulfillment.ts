// Shared shop-order fulfillment. Both payment gateways (VNPay IPN and the
// PayOS webhook / return-poll) funnel through `markShopOrderPaidAndFulfill`
// so the stock-decrement, idempotency and oversell handling live in ONE
// place and can't drift between gateways.

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getPayosStatus, isPayosConfigured } from '../config/payos.js';

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

  await prisma.$transaction(async (tx) => {
    const flipped = await tx.shopOrder.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: {
        status: 'PAID',
        paymentStatus: 'PAID',
        ...(meta.method ? { paymentMethod: meta.method } : {}),
        paymentId: meta.txnNo ?? null,
        paidAt: meta.payDate ?? new Date(),
      },
    });
    // Someone else already transitioned it — skip stock side effects.
    if (flipped.count !== 1) return;
    flippedOk = true;

    // Decrement stock + bump sold count. Items link to Product by name (the
    // relation FK). The `stockQuantity >= quantity` guard avoids driving
    // stock negative; only bump soldCount when the decrement matched a row,
    // and flag oversell for manual review (money received — never blindly
    // claim stock we don't have).
    for (const item of order.items) {
      const dec = await tx.product.updateMany({
        where: { name: item.productName, stockQuantity: { gte: item.quantity } },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      if (dec.count === 1) {
        await tx.product.updateMany({
          where: { name: item.productName },
          data: { soldCount: { increment: item.quantity } },
        });
      } else {
        oversoldItems.push(`${item.productName} x${item.quantity}`);
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
      orderCode: order.orderCode, shopOrderId: order.id, method: meta.method, txnNo: meta.txnNo,
    });
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
