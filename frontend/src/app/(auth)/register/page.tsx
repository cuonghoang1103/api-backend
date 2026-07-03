'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { authApi } from '@/lib/api';
import type { ApiError } from '@/lib/api';
import { TurnstileWidget } from '@/components/TurnstileWidget';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username max 50 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore'),
    email: z.string().email('Invalid email address'),
    fullName: z.string().optional(),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .max(100, 'Password max 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // ─── CAPTCHA state ────────────────────────────────────────
  const [captchaSiteKey, setCaptchaSiteKey] = useState<string | null>(null);
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaError, setCaptchaError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const password = watch('password');

  const passwordChecks = [
    { label: 'At least 12 characters', ok: !!(password && password.length >= 12) },
    { label: 'Contains uppercase letter (A-Z)', ok: !!(password && /[A-Z]/.test(password)) },
    { label: 'Contains lowercase letter (a-z)', ok: !!(password && /[a-z]/.test(password)) },
    { label: 'Contains a number (0-9)', ok: !!(password && /[0-9]/.test(password)) },
    { label: 'Contains a special character (!@#$...)', ok: !!(password && /[^A-Za-z0-9]/.test(password)) },
  ];

  const allChecksPassed = passwordChecks.every((c) => c.ok);
  // CAPTCHA is soft on this route — backend accepts a missing token
  // and relies on the email-OTP step for the real anti-abuse check.
  // Don't gate the submit button on the widget (which may never load
  // on networks blocking challenges.cloudflare.com).
  const captchaReady = true;

  // Fetch CAPTCHA config once on mount. If disabled on backend, we just
  // skip the widget entirely so the form still works in dev / local.
  useEffect(() => {
    let cancelled = false;
    authApi
      .getCaptchaConfig()
      .then((cfg) => {
        if (cancelled) return;
        setCaptchaEnabled(!!cfg?.enabled);
        setCaptchaSiteKey(cfg?.siteKey ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setCaptchaEnabled(false);
          setCaptchaSiteKey(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setBackendError('');
    try {
      // Go through /api/auth/register (Next.js route handler) so the
      // backend_token httpOnly cookie is set. Going through
      // authApi.register() directly would succeed at the API level
      // but leave the cookie empty, breaking every subsequent
      // authenticated call (e.g. enrolling in a free course).
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName || undefined,
          captchaToken: captchaEnabled ? captchaToken : undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        const msg = json?.message || 'Something went wrong. Please try again.';
        setBackendError(msg);
        toast.error(msg);
        return;
      }
      setRegisteredEmail(data.email);
      toast.success('Account created! Check your email to verify.');
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error.userFriendlyMessage || 'Something went wrong. Please try again.';
      setBackendError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── After successful registration: redirect to OTP verification ───
  if (registeredEmail) {
    // Use replace to allow back-button to skip this state
    if (typeof window !== 'undefined') {
      router.replace(`/verify-otp?email=${encodeURIComponent(registeredEmail)}&resend=1`);
    }
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-indigo/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/images/avatar.png"
              alt="CuongHoang"
              className="w-16 h-16 mx-auto rounded-2xl object-cover mb-4"
            />
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-heading font-bold text-text-primary"
          >
            Create Account
          </motion.h1>
          <p className="text-text-secondary mt-2">
            Join the CuongHoang community today
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-darkcard border border-darkborder rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Backend error banner */}
            {backendError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
              >
                {backendError}
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                {...register('username')}
                type="text"
                placeholder="cuonghoang"
                autoComplete="username"
                className={`w-full px-4 py-3 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                  errors.username ? 'border-red-500/60' : 'border-darkborder'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1.5">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                  errors.email ? 'border-red-500/60' : 'border-darkborder'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name <span className="text-text-muted">(optional)</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                    errors.password ? 'border-red-500/60' : 'border-darkborder'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
              )}
              {/* Password strength hints */}
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {check.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span className={check.ok ? 'text-green-500' : 'text-text-muted'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                    errors.confirmPassword ? 'border-red-500/60' : 'border-darkborder'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* CAPTCHA — Cloudflare Turnstile (only rendered if backend has it enabled) */}
            {captchaEnabled && captchaSiteKey && (
              <div className="flex justify-center">
                <TurnstileWidget
                  siteKey={captchaSiteKey}
                  theme="dark"
                  onVerify={(token) => { setCaptchaToken(token); setCaptchaError(false); }}
                  onError={() => { setCaptchaToken(''); setCaptchaError(true); }}
                  onExpire={() => { setCaptchaToken(''); }}
                />
              </div>
            )}
            {captchaError && (
              <p className="text-red-400 text-sm text-center">
                CAPTCHA verification failed. Please try again.
              </p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !allChecksPassed || !captchaReady}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-neon-violet hover:text-neon-indigo transition-colors font-medium"
            >
              Sign In
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-text-muted text-sm mt-6">
          <Link href="/" className="hover:text-text-primary transition-colors">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
