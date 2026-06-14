'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, Send } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

type Status = 'verifying' | 'success' | 'error' | 'resend-prompt' | 'resending' | 'resent';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const email = searchParams?.get('email');
  const wantsResend = searchParams?.get('resend') === '1';
  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  // Nếu URL có email + resend=1 → show giao diện "đang gửi lại"
  useEffect(() => {
    if (!token && email && wantsResend) {
      setStatus('resend-prompt');
    } else if (!token && !email) {
      // Không có token và không có email → link không hợp lệ
      setStatus('error');
      setErrorMessage('Link xác thực không hợp lệ. Vui lòng kiểm tra lại link trong email.');
    }
  }, [token, email, wantsResend]);

  // Nếu có token → auto verify
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        await authApi.verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          setTimeout(() => router.push('/login'), 3000);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const error = err as { userFriendlyMessage?: string; message?: string };
        setStatus('error');
        setErrorMessage(
          error.userFriendlyMessage || error.message || 'Xác thực thất bại. Vui lòng thử lại.',
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  const handleResend = async () => {
    if (!email) return;
    setStatus('resending');
    try {
      await authApi.resendVerification(email);
      setStatus('resent');
    } catch {
      toast.error('Không thể gửi lại email. Vui lòng thử lại sau.');
      setStatus('resend-prompt');
    }
  };

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-indigo/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-darkcard border border-darkborder rounded-2xl p-8 text-center"
      >
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-neon-violet animate-spin mb-4" />
            <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
              Đang xác thực email...
            </h2>
            <p className="text-text-muted text-sm">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'resend-prompt' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Email chưa xác thực
            </h2>
            <p className="text-text-secondary mb-2">
              Tài khoản <strong className="text-text-primary">{email}</strong> chưa được xác thực.
            </p>
            <p className="text-text-muted text-sm mb-6">
              Click nút bên dưới để gửi lại email xác thực. Link có hiệu lực trong <strong>24 giờ</strong>.
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Gửi lại email xác thực
            </button>
            <Link
              href="/login"
              className="block w-full py-3 mt-3 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5 transition-colors text-sm text-center"
            >
              Quay lại đăng nhập
            </Link>
          </>
        )}

        {status === 'resending' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto text-neon-violet animate-spin mb-4" />
            <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
              Đang gửi lại email...
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
              Đã gửi lại email xác thực
            </h2>
            <p className="text-text-secondary mb-6">
              Vui lòng kiểm tra hộp thư <strong className="text-text-primary">{email}</strong> và click link xác thực.
            </p>
            <p className="text-text-muted text-sm mb-4">
              (Nếu không thấy, kiểm tra thư mục spam.)
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
            >
              Quay lại đăng nhập
            </Link>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
              Xác thực thành công!
            </h2>
            <p className="text-text-secondary mb-6">
              Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <p className="text-text-muted text-sm mb-4">
              Tự động chuyển sang trang đăng nhập sau 3 giây...
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
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
            <p className="text-text-secondary mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
              >
                Đăng ký lại
              </Link>
              <Link
                href="/login"
                className="block w-full py-3 rounded-xl border border-darkborder text-text-secondary hover:bg-white/5 transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
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

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
