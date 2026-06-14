'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, Clock, Send, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { OtpInput } from '@/components/OtpInput';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

type Stage = 'email' | 'otp' | 'newpass' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── Stage 1: Submit email → backend sends OTP ───
  const onSubmitEmail = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.forgotPassword(data.email);
      setEmail(data.email);
      const ttl = (res.data as { ttl?: number })?.ttl ?? 600;
      setCountdown(ttl);
      setStage('otp');
      toast.success(`Mã OTP đã được gửi đến ${data.email}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || 'Không thể gửi mã. Vui lòng thử lại.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Resend OTP ───
  const handleResend = async () => {
    if (countdown > 0 || resendCount >= 3 || !email) return;
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      const ttl = (res.data as { ttl?: number })?.ttl ?? 600;
      setCountdown(ttl);
      setResendCount((c) => c + 1);
      toast.success('Đã gửi lại mã OTP');
    } catch {
      toast.error('Không thể gửi lại mã');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Stage 2: Auto-advance to password when OTP complete ───
  const handleOtpComplete = (otp: string) => {
    if (otp.length === 6) {
      setCode(otp);
      setStage('newpass');
    }
  };

  // ─── Stage 3: Submit new password ───
  const onSubmitNewPassword = async () => {
    setError('');

    if (newPassword.length < 12) {
      setError('Mật khẩu phải có ít nhất 12 ký tự');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 1 chữ hoa');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 1 chữ thường');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 1 chữ số');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPasswordOtp({ email, code, newPassword });
      setStage('success');
      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || 'Đặt lại mật khẩu thất bại';
      setError(msg);
      // Nếu OTP sai → quay lại stage OTP
      if (e.response?.data?.message?.includes('Mã')) {
        setStage('otp');
        setCode('');
      }
    } finally {
      setIsLoading(false);
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/images/avatar.png" alt="CuongHoang" className="w-16 h-16 mx-auto rounded-2xl object-cover mb-4" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            {stage === 'success' ? 'Thành công!' : 'Forgot Password'}
          </h1>
          <p className="text-text-secondary mt-2">
            {stage === 'email' && 'Enter your email to receive a 6-digit code'}
            {stage === 'otp' && 'Nhập mã 6 số đã được gửi đến email của bạn'}
            {stage === 'newpass' && 'Tạo mật khẩu mới cho tài khoản'}
            {stage === 'success' && 'Mật khẩu đã được đặt lại thành công'}
          </p>
        </div>

        <div className="bg-darkcard border border-darkborder rounded-2xl p-8">
          {stage === 'email' && (
            <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>
          )}

          {stage === 'otp' && (
            <>
              <OtpInput
                length={6}
                value={code}
                onChange={(v) => { setCode(v); setError(''); }}
                onComplete={handleOtpComplete}
                disabled={isLoading}
                error={error}
              />
              <div className="mt-6 text-center">
                <p className="text-text-muted text-sm mb-2">Không nhận được mã?</p>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || resendCount >= 3}
                  className="inline-flex items-center gap-2 text-sm text-neon-violet hover:text-neon-indigo transition-colors disabled:text-text-muted disabled:cursor-not-allowed"
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
              </div>
              <button
                onClick={() => { setStage('email'); setCode(''); setError(''); }}
                className="mt-4 w-full text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                ← Đổi email khác
              </button>
            </>
          )}

          {stage === 'newpass' && (
            <form onSubmit={(e) => { e.preventDefault(); onSubmitNewPassword(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="Ít nhất 12 ký tự"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          {stage === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-text-secondary">Mật khẩu của bạn đã được đặt lại.</p>
              <p className="text-text-muted text-sm">Tự động chuyển sang trang đăng nhập sau 3 giây...</p>
              <Link href="/login" className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold">
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
