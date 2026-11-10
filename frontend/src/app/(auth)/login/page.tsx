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
import { NutDangNhapMxh } from '@/components/auth/NutDangNhapMxh';
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
    if (loginError === 'session_expired') {
      // lib/hetPhien.ts: vắng mặt lâu ⇒ cookie phiên hết hạn ⇒ đăng xuất gọn rồi đưa về đây (kèm redirect về trang cũ).
      toast.info('Phiên đăng nhập đã hết hạn vì lâu bạn chưa vào. Đăng nhập lại là tiếp tục đúng trang đang xem.');
    } else if (loginError === 'login_required') {
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

          <NutDangNhapMxh callbackUrl={duongVe} />

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
