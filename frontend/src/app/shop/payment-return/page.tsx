'use client';

import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, XCircle, Loader2, ArrowLeft, AlertTriangle, ShoppingBag, Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getOrderByCode } from '@/lib/api/shop';
import { generateInvoicePDF } from '@/lib/invoice';
import { useCartStore } from '@/store/cartStore';
import type { Order, BuyerInfo } from '@/types';

/**
 * Shop PayOS return page.
 *  1. User pays on the PayOS hosted checkout.
 *  2. PayOS redirects here with ?orderCode=<numeric PayOS code>
 *     (= PAYOS_SHOP_ORDER_OFFSET + ShopOrder.id) and ?cancel=1 on cancel.
 *  3. We poll GET /shop/orders/:code — that endpoint recovers the order from
 *     the numeric code AND actively reconciles against PayOS, so it flips to
 *     PAID even if the webhook lagged / isn't wired.
 *  4. On PAID: clear cart, celebrate, offer the (Vietnamese-font) invoice.
 */

type PollState = 'polling' | 'success' | 'failed' | 'timeout';

function toLocalOrder(data: any, buyer: BuyerInfo): Order {
  const items = Array.isArray(data?.items) ? data.items : [];
  return {
    id: String(data.id ?? data.orderCode ?? ''),
    orderCode: data.orderCode,
    items: items.map((it: any) => ({
      id: String(it.id ?? it.productSlug ?? it.productName),
      itemType: 'shop' as const,
      name: it.productName,
      thumbnail: it.productImage || '/images/products/default.jpg',
      price: Number(it.price),
      quantity: it.quantity,
      category: 'Web Template' as const,
    })),
    subtotal: Number(data.subtotal ?? 0),
    discountAmount: Number(data.discountAmount ?? 0),
    discountCode: data.discountCode,
    total: Number(data.total ?? 0),
    status: (data.status as Order['status']) ?? 'PAID',
    buyerInfo: buyer,
    createdAt: data.createdAt ?? new Date().toISOString(),
    completedAt: data.paidAt ?? data.completedAt,
  };
}

function ShopReturnContent() {
  const params = useSearchParams();
  const orderCode = params.get('orderCode') || '';
  const cancelled = params.get('cancel') === '1';

  const [state, setState] = useState<PollState>(cancelled ? 'failed' : 'polling');
  const [order, setOrder] = useState<Order | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const cancelledRef = useRef(false);
  const invoicedRef = useRef(false);

  const buildOrder = useCallback((data: any): Order => {
    let buyer: BuyerInfo = { fullName: '', email: '', phone: '', address: '' };
    try {
      const raw = data?.orderCode ? sessionStorage.getItem(`shop_buyer_${data.orderCode}`) : null;
      if (raw) buyer = { ...buyer, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return toLocalOrder(data, buyer);
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    if (cancelled || !orderCode) {
      setState(cancelled ? 'failed' : 'failed');
      return;
    }

    const maxPolls = 8; // 8 × 1.5s = 12s
    const pollIntervalMs = 1500;
    let polls = 0;

    const poll = async () => {
      if (cancelledRef.current) return;
      try {
        const res = await getOrderByCode(orderCode);
        const data = (res as any)?.data;
        if (data?.status === 'PAID') {
          const o = buildOrder(data);
          setOrder(o);
          setState('success');
          clearCart();
          if (!invoicedRef.current) {
            invoicedRef.current = true;
            try { generateInvoicePDF(o, { paymentMethodLabel: 'PayOS' }); } catch { /* ignore */ }
          }
          return;
        }
        if (data?.status === 'CANCELLED' || data?.status === 'FAILED') {
          setState('failed');
          return;
        }
        polls += 1;
        if (polls >= maxPolls) { setState('timeout'); return; }
        setTimeout(poll, pollIntervalMs);
      } catch {
        polls += 1;
        if (polls >= maxPolls) { setState('timeout'); return; }
        setTimeout(poll, pollIntervalMs);
      }
    };

    poll();
    return () => { cancelledRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, cancelled]);

  const money = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-darkcard border border-darkborder/50 rounded-2xl p-8 text-center"
      >
        {state === 'polling' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-neon-violet animate-spin mb-4" />
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Đang xác nhận thanh toán…
            </h1>
            <p className="text-text-muted text-sm">
              Vui lòng chờ trong giây lát, chúng tôi đang xử lý đơn hàng của bạn.
            </p>
          </>
        )}

        {state === 'success' && order && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-text-muted text-sm mb-1">Mã đơn hàng:</p>
            <p className="text-neon-violet font-mono font-semibold mb-4">{order.orderCode}</p>
            <p className="text-text-muted text-xs mb-6">Số tiền: {money(order.total)}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => generateInvoicePDF(order, { paymentMethodLabel: 'PayOS' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-darkbg border border-darkborder text-text-primary font-semibold rounded-xl hover:border-neon-violet/30 transition-colors"
              >
                <Download className="w-5 h-5" />
                Tải hóa đơn (PDF)
              </button>
              <Link
                href="/my-orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-5 h-5" />
                Xem đơn hàng của tôi
              </Link>
            </div>
          </>
        )}

        {state === 'failed' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Thanh toán chưa hoàn tất
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Giao dịch bị hủy hoặc không thành công. Giỏ hàng của bạn vẫn được giữ — vui lòng thử lại.
            </p>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại giỏ hàng
            </Link>
          </>
        )}

        {state === 'timeout' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Đơn hàng đang xử lý
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Thanh toán của bạn đang được xử lý. Vui lòng kiểm tra lại trong mục &quot;Đơn hàng của tôi&quot; sau giây lát.
            </p>
            <Link
              href="/my-orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Đơn hàng của tôi
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ShopPaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-darkbg flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-neon-violet" />
        </div>
      }
    >
      <ShopReturnContent />
    </Suspense>
  );
}
