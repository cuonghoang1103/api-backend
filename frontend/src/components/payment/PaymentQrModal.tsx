'use client';

/**
 * PaymentQrModal — shared VNPAY-QR payment modal for BOTH the Academy
 * (course) and Shop (product) flows.
 *
 * The parent creates the order + obtains a VNPay `paymentUrl`, then opens
 * this modal. We render that URL as a QR code (the user scans it with
 * their banking app) and poll a caller-supplied `pollStatus()` until the
 * backend IPN flips the order to PAID. The polling is what makes the page
 * update "without F5": the moment VNPay's server-to-server IPN confirms,
 * the next poll sees PAID and we fire `onPaid()`.
 *
 * It is deliberately presentation-only about *what* an order is — the
 * parent owns order creation and the post-payment action (enroll-and-go,
 * show receipt, clear cart…). This keeps one component reusable across
 * the two domains.
 */
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, X, ExternalLink, Smartphone } from 'lucide-react';

/** Normalised order status the modal reacts to. */
export type QrPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

interface PaymentQrModalProps {
  open: boolean;
  /** Full VNPay gateway URL to encode as QR (and offer as a fallback link). */
  paymentUrl: string;
  /** Amount in VND, for display. */
  amount: number;
  /** Human-readable order reference shown under the QR. */
  orderCode: string;
  /** Modal heading, e.g. "Thanh toán khóa học" / "Thanh toán đơn hàng". */
  title?: string;
  /**
   * Polls the backend for the order status. Should return one of
   * 'PENDING' | 'PAID' | 'FAILED'. Thrown errors are treated as a
   * transient PENDING (we keep polling) so a blip doesn't abort payment.
   */
  pollStatus: () => Promise<QrPaymentStatus>;
  /** Fired once when the order becomes PAID. Parent navigates / refreshes. */
  onPaid: () => void;
  /** Fired when the user closes the modal (PENDING or after a failure). */
  onClose: () => void;
  /** Poll interval in ms. Default 3000. */
  pollIntervalMs?: number;
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function PaymentQrModal({
  open,
  paymentUrl,
  amount,
  orderCode,
  title = 'Thanh toán VNPAY-QR',
  pollStatus,
  onPaid,
  onClose,
  pollIntervalMs = 3000,
}: PaymentQrModalProps) {
  const [status, setStatus] = useState<QrPaymentStatus>('PENDING');
  // Guard so onPaid fires exactly once even if a poll overlaps the unmount.
  const settledRef = useRef(false);
  // Keep the latest callbacks without re-arming the interval each render
  // (parents pass fresh closures every render; depending on them would
  // reset the poll timer continuously).
  const pollRef = useRef(pollStatus);
  pollRef.current = pollStatus;
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  useEffect(() => {
    if (!open) return;
    // Reset per-open so reusing the modal for a new order starts clean.
    setStatus('PENDING');
    settledRef.current = false;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = async () => {
      try {
        const s = await pollRef.current();
        if (cancelled || settledRef.current) return;
        if (s === 'PAID') {
          settledRef.current = true;
          setStatus('PAID');
          // Small beat so the user sees the success state before the
          // parent navigates away.
          setTimeout(() => {
            if (!cancelled) onPaidRef.current();
          }, 900);
          return;
        }
        if (s === 'FAILED') {
          settledRef.current = true;
          setStatus('FAILED');
          return;
        }
      } catch {
        // Transient error — swallow and keep polling.
      }
      if (!cancelled && !settledRef.current) {
        timer = setTimeout(tick, pollIntervalMs);
      }
    };

    // First poll after one interval (give the user time to scan).
    timer = setTimeout(tick, pollIntervalMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [open, pollIntervalMs]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-darkborder bg-darkcard p-6 shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-1 text-center font-heading text-lg font-bold text-text-primary">
            {title}
          </h2>
          <p className="mb-5 text-center text-2xl font-bold text-neon-violet">
            {formatVnd(amount)}
          </p>

          {status === 'PAID' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="mb-3 h-16 w-16 text-green-400" />
              <p className="text-lg font-semibold text-text-primary">Thanh toán thành công!</p>
              <p className="mt-1 text-sm text-text-muted">Đang chuyển hướng…</p>
            </div>
          ) : status === 'FAILED' ? (
            <div className="flex flex-col items-center py-8 text-center">
              <XCircle className="mb-3 h-16 w-16 text-red-400" />
              <p className="text-lg font-semibold text-text-primary">Thanh toán thất bại hoặc đã hủy</p>
              <p className="mt-1 text-sm text-text-muted">Vui lòng thử lại.</p>
              <button
                onClick={onClose}
                className="mt-5 rounded-xl bg-darkbg px-6 py-3 font-semibold text-text-primary transition-colors hover:border-neon-violet/30 border border-darkborder"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-4 w-fit rounded-xl bg-white p-4">
                <QRCodeSVG value={paymentUrl} size={208} level="M" includeMargin={false} />
              </div>

              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-text-muted">
                <Smartphone className="h-4 w-4 text-neon-violet" />
                <span>Mở app ngân hàng / ví và quét mã để thanh toán</span>
              </div>

              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-neon-violet" />
                <span>Đang chờ xác nhận thanh toán…</span>
              </div>

              <p className="mb-3 text-center text-xs text-text-muted">
                Mã đơn: <span className="font-mono text-text-primary">{orderCode}</span>
              </p>

              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-darkborder bg-darkbg py-3 text-sm font-medium text-text-primary transition-colors hover:border-neon-violet/30"
              >
                <ExternalLink className="h-4 w-4" />
                Mở trang thanh toán VNPAY
              </a>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
