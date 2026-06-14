'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { authApi } from '@/lib/api';

type Status = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token xác thực không tồn tại. Vui lòng kiểm tra lại link trong email.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await authApi.verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          // Auto redirect after 3s
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
