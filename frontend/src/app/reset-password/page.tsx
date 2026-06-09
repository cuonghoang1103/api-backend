'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

const schema = z.object({
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/[a-z]/, 'At least 1 lowercase letter')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[^A-Za-z0-9]/, 'At least 1 special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, data.password);
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch {
      toast.error('Invalid or expired token. Please request a new reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  const checks = [
    { label: 'At least 8 characters', ok: passwordValue.length >= 8 },
    { label: '1 uppercase letter (A-Z)', ok: /[A-Z]/.test(passwordValue) },
    { label: '1 lowercase letter (a-z)', ok: /[a-z]/.test(passwordValue) },
    { label: '1 number (0-9)', ok: /[0-9]/.test(passwordValue) },
    { label: '1 special character', ok: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  return (
    <div className="bg-darkcard border border-darkborder rounded-2xl p-8">
      {isValid === false ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">Invalid Token</h2>
          <p className="text-text-secondary">
            The password reset link is invalid or has expired.
            Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-2 text-neon-violet hover:text-neon-indigo transition-colors font-medium"
          >
            Request New Link
          </Link>
        </div>
      ) : isSuccess ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">Success!</h2>
          <p className="text-text-secondary">
            Your password has been reset successfully.
            You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                onChange={(e) => setPasswordValue(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-xs">
                <span className={c.ok ? 'text-green-500' : 'text-text-muted'}>
                  {c.ok ? '✓' : '○'} {c.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-indigo/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/images/avatar.png" alt="CuongHoang" className="w-16 h-16 mx-auto rounded-2xl object-cover mb-4" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            Reset Password
          </h1>
          <p className="text-text-secondary mt-2">
            Enter your new password for your account
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-darkcard border border-darkborder rounded-2xl p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-text-muted text-sm mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
