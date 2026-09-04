'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';
import { TurnstileWidget } from '@/components/TurnstileWidget';
import type { AuthResponse } from '@/types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Named ...Values, not LoginForm: the component below is already called
// LoginForm, and a type sharing a value's name trips ESLint's no-redeclare
// (TypeScript itself allows it — the two live in different namespaces).
type LoginFormValues = z.infer<typeof loginSchema>;

function isAdminRole(roles: string[]): boolean {
  if (!roles || roles.length === 0) return false;
  return roles.some((r) => {
    const normalized = (r || '').replace(/^ROLE_/i, '').toUpperCase();
    return normalized === 'ADMIN';
  });
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /**
   * Đường quay về sau khi OAuth xong.
   *
   * App desktop mở trang này kèm `dt_cong` + `dt_nonce` (xem
   * `desktop/src/main/ipc/oauthVong.ts`). Hai tham số đó phải đi THEO qua
   * vòng OAuth để `/oauth-callback` biết trả token về cổng vòng của app —
   * NextAuth không giữ hộ gì cả, rơi mất là người dùng đăng nhập trên web
   * xong mà app vẫn đứng im chờ.
   */
  const duongVe = (): string => {
    const sp = new URLSearchParams(window.location.search);
    const cong = sp.get('dt_cong');
    const nonce = sp.get('dt_nonce');
    if (!cong || !nonce) return '/oauth-callback';
    return `/oauth-callback?dt_cong=${encodeURIComponent(cong)}&dt_nonce=${encodeURIComponent(nonce)}`;
  };

  /*
   * Apple bật hay không là chuyện của MÁY CHỦ (có khoá `.p8` hay chưa), mà đây
   * là client component. Hỏi `/api/auth/providers` — endpoint NextAuth tự phục
   * vụ, suy thẳng từ mảng `providers` — nên nó KHÔNG THỂ lệch với cấu hình thật.
   *
   * ⚠️ Cố ý KHÔNG dùng `NEXT_PUBLIC_APPLE_ENABLED`: biến `NEXT_PUBLIC_*` được
   * nướng vào gói lúc BUILD, nên bật Apple sẽ cần dựng lại frontend chứ không
   * phải khởi động lại — đúng cái bẫy đã ghi trong CLAUDE.md.
   */
  const [coApple, setCoApple] = useState(false);
  useEffect(() => {
    let con = true;
    fetch('/api/auth/providers')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (con && d && typeof d === 'object') setCoApple('apple' in d); })
      .catch(() => { /* không hỏi được thì đơn giản là không vẽ nút */ });
    return () => { con = false; };
  }, []);

  /*
   * App desktop bấm "Đăng nhập bằng Apple" → mở trang này kèm `dt_nha=apple`.
   * Không đọc tham số đó thì người dùng ra trình duyệt và phải bấm LẠI đúng cái
   * nút vừa bấm — vòng OAuth vẫn chạy được nên không có lỗi nào hiện ra, chỉ có
   * một bước thừa khó hiểu.
   *
   * Ba chốt: chỉ tự chạy khi CÓ ĐỦ `dt_cong`+`dt_nonce` (tức đúng là app gọi),
   * chỉ với nhà cung cấp trong danh sách trắng, và chỉ MỘT lần (React 18 gọi
   * effect hai lượt ở chế độ nghiêm ngặt — không chốt thì mở hai vòng OAuth).
   */
  const daTuChay = useRef(false);
  useEffect(() => {
    if (daTuChay.current) return;
    const sp = new URLSearchParams(window.location.search);
    const nha = sp.get('dt_nha');
    if (!nha || !sp.get('dt_cong') || !sp.get('dt_nonce')) return;
    if (!['google', 'github', 'apple'].includes(nha)) return;
    daTuChay.current = true;
    void signIn(nha, { callbackUrl: duongVe() });
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState('');

  // ─── CAPTCHA state ────────────────────────────────────────
  const [captchaSiteKey, setCaptchaSiteKey] = useState<string | null>(null);
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaError, setCaptchaError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const redirect = searchParams.get('callbackUrl') || searchParams.get('redirect');
  const loginError = searchParams.get('error');

  useEffect(() => {
    if (loginError === 'login_required') {
      toast.error('Vui lòng đăng nhập để vào khoá học');
    } else if (loginError === 'not_admin') {
      toast.error('Bạn không có quyền truy cập trang quản trị');
    } else if (loginError === 'account_blocked') {
      toast.error('Tài khoản của bạn đã bị khoá hoặc vô hiệu hoá. Liên hệ quản trị viên để được hỗ trợ.');
    }
  }, [loginError]);

  // Fetch CAPTCHA config (best-effort). If disabled, just skip widget.
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

  // Allow user to submit even if the Turnstile widget failed to render
  // (CDN blocked, etc.) — we send an empty token and rely on the
  // backend's CAPTCHA_REQUIRED=false bypass for verified users. The
  // backend rejects with CAPTCHA_REQUIRED only if the user is unknown
  // / unverified, in which case the form-level error message we
  // already show is enough — no need to lock the submit button forever.
  const captchaReady = true;

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setBackendError('');

    try {
      // Sign out any existing NextAuth session
      try {
        await signOut({ redirect: false });
      } catch {}

      // ─── Step 1: Login via backend API ───────────────────────────
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          'cf-turnstile-response': captchaEnabled ? captchaToken : undefined,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        const errorCode = loginData.code;
        const errorMsg =
          loginData.message ||
          (loginRes.status === 429
            ? 'Too many login attempts. Please wait a moment and try again.'
            : 'Incorrect username or password.');

        setBackendError(errorMsg);
        toast.error(errorMsg);

        // Nếu email chưa xác thực → chuyển sang trang OTP verification
        if (errorCode === 'EMAIL_NOT_VERIFIED') {
          const email = loginData.data?.email || data.username;
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}&resend=1`);
          }, 1500);
        }
        return;
      }

      // ─── Step 2: Extract auth data from login response ──────────
      const token: string = loginData.data?.token ?? '';
      const loginRole: string = loginData.data?.role ?? 'ROLE_USER';
      const loginRoles: string[] = loginData.data?.roles ?? [loginRole];
      const loginUserId: number = loginData.data?.userId ?? 0;
      const loginEmail: string = loginData.data?.email ?? '';

      // ─── Step 3: Enrich from full profile (avatarUrl primary) ───
      // avatarUrl now comes straight from the login response (the
      // /api/auth/login route forwards it). We still fetch /profile to
      // refine roles/email and pick up the avatar if it was missing.
      // The proxy authenticates via the httpOnly backend_token cookie
      // (set by the login response), so credentials:'include' is all we
      // need — a client Authorization header would be ignored. AuthBoot
      // re-syncs the profile on mount too, as a backstop.
      let profileRoles: string[] = loginRoles;
      let profileUserId = loginUserId;
      let profileEmail = loginEmail;
      let profileAvatarUrl: string | undefined = loginData.data?.avatarUrl;

      try {
        const profileRes = await fetch('/api/v1/profile', { credentials: 'include' });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData?.data) {
            profileRoles = profileData.data.roles ?? loginRoles;
            profileUserId = profileData.data.id ?? profileUserId;
            profileEmail = profileData.data.email ?? profileEmail;
            profileAvatarUrl = profileData.data.avatarUrl ?? profileAvatarUrl;
          }
        }
      } catch {
        // silently ignore — use whatever we got from the login response
      }

      // ─── Step 4: Build auth state and update store ──────────────
      const authData: AuthResponse = {
        token,
        userId: profileUserId,
        username: data.username,
        email: profileEmail,
        role: profileRoles[0] ?? 'ROLE_USER',
        roles: profileRoles,
        avatarUrl: profileAvatarUrl,
      };

      useAuthStore.getState().setAuth(authData);

      // ─── Step 5: Redirect based on role ─────────────────────────
      const isAdmin = isAdminRole(profileRoles);
      // "/" is now the marketing landing; signed-in users belong on their feed.
      let dest = '/feed';
      if (isAdmin) {
        dest = '/admin';
      } else if (redirect && /^\/(?!\/)/.test(redirect)) {
        // Only honour the callback if it's a relative internal path,
        // not a full URL (open-redirect protection: something
        // like //evil.com would otherwise bounce the user off-site
        // after they sign in).
        dest = redirect;
      }

      toast.success(`Welcome, ${data.username}!`);

      // Hard navigation - replaces login page in history so back button doesn't return here
      window.location.replace(dest);
    } catch (err: unknown) {
      const error = err as Error;
      const msg = error?.message || 'Something went wrong. Please try again.';
      setBackendError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // `dark-surface` pins the theme CSS variables to their dark values for
    // this subtree. The background here is a fixed dark hero (bg-darkbg) in
    // BOTH themes, but the text uses `text-text-*` utilities that map to
    // theme variables — under the light theme those resolved to near-black
    // on near-black and the form became unreadable. See globals.css.
    <div suppressHydrationWarning className="dark-surface min-h-screen bg-darkbg flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-indigo/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
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
            Welcome Back
          </motion.h1>
          <p className="text-text-secondary mt-2">Sign in to continue with CuongHoang</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-darkcard border border-darkborder rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {backendError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
              >
                {backendError}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
              <input
                {...register('username')}
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className={`w-full px-4 py-3 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                  errors.username
                    ? 'border-red-500/60 focus:border-red-500'
                    : 'border-darkborder'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1.5">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-darkbg border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors ${
                    errors.password
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-darkborder'
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
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-neon-violet hover:text-neon-indigo transition-colors"
              >
                Forgot password?
              </Link>
            </div>

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

            <motion.button
              type="submit"
              disabled={isLoading || !captchaReady}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-darkborder" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-darkcard text-text-muted">or continue with</span>
            </div>
          </div>

          <div className={`grid gap-3 ${coApple ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: duongVe() })}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-darkborder bg-darkbg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: duongVe() })}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-darkborder bg-darkbg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
            {coApple && (
              <button
                type="button"
                onClick={() => signIn('apple', { callbackUrl: duongVe() })}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-darkborder bg-darkbg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            )}
          </div>

          <p className="text-center text-text-muted text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-neon-violet hover:text-neon-indigo transition-colors font-medium"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>

        <p className="text-center text-text-muted text-sm mt-6">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
