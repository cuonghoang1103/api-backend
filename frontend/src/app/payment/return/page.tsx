'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, XCircle, Loader2, ArrowLeft, AlertTriangle, BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { paymentApi } from '@/lib/api';

/**
 * VNPay return page.
 *
 * Flow:
 *  1. User pays on VNPay gateway
 *  2. VNPay redirects browser to /api/v1/payments/vnpay/return
 *  3. That endpoint does a verify-and-redirect to /payment/return
 *     with ?orderCode=...&status=success|failed|invalid
 *  4. This page polls /api/v1/payments/order/:orderCode to confirm
 *     the backend has actually processed the IPN (the trusted path).
 *  5. Once the order shows PAID, we celebrate and link to /learn.
 *
 * The status from query string is for UI only — we always re-check
 * with the backend, because the user could have closed the browser
 * between payment and IPN, or the IPN might lag the redirect.
 */

type PollState = 'polling' | 'success' | 'failed' | 'timeout';

function PaymentReturnContent() {
  const params = useSearchParams();
  const orderCode = params.get('orderCode') || '';
  const initialStatus = (params.get('status') || '') as
    | 'success'
    | 'failed'
    | 'invalid'
    | '';

  const [state, setState] = useState<PollState>(
    initialStatus === 'failed' || initialStatus === 'invalid' ? 'failed' : 'polling',
  );
  const [order, setOrder] = useState<{
    status: string;
    amount: number;
    course: { id: number; slug: string; title: string };
  } | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (!orderCode) {
      setState('failed');
      return;
    }

    const maxPolls = 8; // 8 × 1.5s = 12s — covers most IPN lag
    const pollIntervalMs = 1500;

    const poll = async () => {
      if (cancelledRef.current) return;
      try {
        const res = await paymentApi.getOrderStatus(orderCode);
        const data = res.data.data;
        setOrder(data);

        if (data.status === 'PAID') {
          setState('success');
          return;
        }
        if (data.status === 'FAILED') {
          setState('failed');
          return;
        }
        // PENDING or anything else: keep polling until we run out
        if (pollCount + 1 >= maxPolls) {
          setState('timeout');
          return;
        }
        setPollCount(c => c + 1);
        setTimeout(poll, pollIntervalMs);
      } catch {
        if (pollCount + 1 >= maxPolls) {
          setState('timeout');
          return;
        }
        setPollCount(c => c + 1);
        setTimeout(poll, pollIntervalMs);
      }
    };

    poll();

    return () => {
      cancelledRef.current = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode]);

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-darkcard border border-darkborder/50 rounded-2xl p-8 text-center"
      >
        {state === 'polling' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-neon-violet animate-spin mb-4" />
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Dang xac nhan thanh toan...
            </h1>
            <p className="text-text-muted text-sm">
              Vui long cho trong giay lat, chung toi dang xu ly don hang cua ban.
            </p>
          </>
        )}

        {state === 'success' && order && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Thanh toan thanh cong!
            </h1>
            <p className="text-text-muted text-sm mb-1">
              Ban da dang ky thanh cong khoa hoc:
            </p>
            <p className="text-text-primary font-semibold mb-6">
              {order.course.title}
            </p>
            <p className="text-text-muted text-xs mb-6">
              So tien: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
            </p>
            <Link
              href={`/courses/${order.course.slug}/learn`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <BookOpen className="w-5 h-5" />
              Vao hoc ngay
            </Link>
          </>
        )}

        {state === 'failed' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Thanh toan that bai
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Giao dich khong thanh cong hoac bi huy. Vui long thu lai.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lai danh sach khoa hoc
            </Link>
          </>
        )}

        {state === 'timeout' && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Don hang dang xu ly
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Thanh toan cua ban dang duoc he thong xu ly. Chung toi se
              cap nhat email som nhat. Vui long kiem tra lai sau.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Ve trang chu
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-darkbg flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-neon-violet" />
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
