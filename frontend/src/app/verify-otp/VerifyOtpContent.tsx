'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, Send, Clock } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { OtpInput } from '@/components/OtpInput';

type Status = 'verifying' | 'success' | 'error' | 'otp-form' | 'resending' | 'resent';

export function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [wantsResend, setWantsResend] = useState(false);
  const [status, setStatus] = useState<Status>('otp-form');
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const sentOnce = useRef(false);

  useEffect(() => {
    if (!searchParams) return;
    setEmail(searchParams.get('email') || '');
    setWantsResend(searchParams.get('resend') === '1');
  }, [searchParams]);

  useEffect(() => {
    if (wantsResend && email && !sentOnce.current) {
      sentOnce.current = true;
      void handleResend();
    }
  }, [email, wantsResend]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (codeToSubmit: string) => {
    if (!email) {
      setStatus('error');
      setErrorMessage('Email không hợp lệ. Vui lòng thử lại từ trang đăng ký.');
      return;
    }
    if (codeToSubmit.length !== 6) return;

    setSubmitting(true);
    setErrorMessage('');
    try {
      await authApi.verifyEmailOtp(email, codeToSubmit);
      setStatus('success');
      toast.success('Xác thực email thành công!');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Mã xác thực không chính xác';
      setErrorMessage(msg);
      toast.error(msg);
      setCode('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    if (resendCount >= 3) {
      toast.error('Bạn đã yêu cầu gửi lại quá nhiều lần. Vui lòng thử lại sau 1 giờ.');
      return;
    }
    if (!email) {
      toast.error('Email không hợp lệ');
      return;
    }

    setStatus('resending');
    try {
      const res = await authApi.resendOtp(email);
      setResendCount((c) => c + 1);
      const ttl = (res.data as { ttl?: number })?.ttl ?? 300;
      setCountdown(ttl);
      setStatus('resent');
      toast.success(`Mã mới đã được gửi đến ${email}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Không thể gửi lại mã');
      setStatus('otp-form');
    }
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-indigo/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-darkcard border border-darkborder rounded-2xl p-8 text-center"
      >
        {status === 'otp-form' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-violet/10 flex items-center justify-center"
            >
              <Mail className="w-8 h-8 text-neon-violet" />
            </motion.div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Xác thực email
            </h2>
            <p className="text-text-secondary mb-2">
              Nhập mã 6 số đã được gửi đến
            </p>
            <p className="text-neon-violet font-medium mb-6 break-all">{email || '(đang tải email...)'}</p>

            <OtpInput
              length={6}
              value={code}
              onChange={setCode}
              onComplete={handleSubmit}
              disabled={submitting}
              error={errorMessage}
            />

            {submitting && (
              <div className="flex items-center justify-center gap-2 mt-4 text-text-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xác thực...
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-darkborder">
              <p className="text-text-muted text-sm mb-3">Không nhận được mã?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendCount >= 3}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-neon-violet hover:text-neon-indigo transition-colors disabled:text-text-muted disabled:cursor-not-allowed"
              >
                {countdown > 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Gửi lại sau {formatCountdown(countdown)}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi lại mã
                  </>
                )}
              </button>
              {resendCount > 0 && (
                <p className="text-text-muted text-xs mt-2">
                  Đã gửi lại {resendCount}/3 lần
                </p>
              )}
            </div>
          </>
        )}

        {status === 'resending' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-neon-violet animate-spin mb-4" />
            <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
              Đang gửi mã mới...
            </h2>
            <p className="text-text-muted text-sm">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'resent' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Mã mới đã được gửi
            </h2>
            <p className="text-text-secondary mb-6">
              Vui lòng kiểm tra hộp thư <strong className="text-text-primary break-all">{email}</strong>
            </p>
            <button
              onClick={() => setStatus('otp-form')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
            >
              Nhập mã
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Xác thực thành công!
            </h2>
            <p className="text-text-secondary mb-2">
              Email của bạn đã được xác thực.
            </p>
            <p className="text-text-muted text-sm mb-6">
              Tự động chuyển sang trang đăng nhập sau 3 giây...
            </p>
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
            >
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Xác thực thất bại
            </h2>
            <p className="text-text-secondary mb-6">{errorMessage || 'Có lỗi xảy ra'}</p>
            <div className="space-y-3">
              {email && (
                <button
                  onClick={() => { setStatus('otp-form'); setErrorMessage(''); setCode(''); }}
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
                >
                  Thử lại
                </button>
              )}
              <Link
                href="/register"
                className="block w-full py-3 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5 transition-colors"
              >
                Đăng ký lại
              </Link>
            </div>
          </>
        )}

        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-neon-violet animate-spin mb-4" />
            <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
              Đang xác thực...
            </h2>
          </>
        )}

        <p className="text-center text-text-muted text-xs mt-6">
          <Link href="/" className="hover:text-text-primary transition-colors">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
