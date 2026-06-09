'use client';

import { Suspense, useState } from 'react';
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
import type { AuthResponse } from '@/types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const redirect = searchParams.get('redirect');

  const onSubmit = async (data: LoginForm) => {
    // #region agent log
    fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'pre-fix',hypothesisId:'H1,H4',location:'frontend/src/app/(auth)/login/page.tsx:45',message:'login submit started',data:{username:data.username,passwordLength:data.password?.length ?? 0,hasRedirect:!!searchParams.get('redirect')},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    setBackendError('');
    try {
      try {
        await signOut({ redirect: false });
      } catch {}

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: data.username, password: data.password }),
      });

      const result = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'pre-fix',hypothesisId:'H1,H3,H4',location:'frontend/src/app/(auth)/login/page.tsx:60',message:'login response received',data:{status:response.status,ok:response.ok,success:!!result?.success,message:result?.message ?? null,hasToken:!!result?.data?.token,role:result?.data?.role ?? null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (!response.ok || !result.success) {
        const errorMsg = result.message || (response.status === 429
          ? 'Too many login attempts. Please wait a moment and try again.'
          : 'Incorrect username or password. Please try again.');
        // #region agent log
        fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'post-fix',hypothesisId:'H1,H3,H4',location:'frontend/src/app/(auth)/login/page.tsx:62',message:'login rejected in ui',data:{status:response.status,message:errorMsg,success:!!result?.success},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        setBackendError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const token = (result.data?.token as string | undefined) ?? '';
      const loginRole = (result.data?.role as string | undefined) ?? 'USER';
      const loginUserId = result.data?.userId as number | undefined;
      const loginEmail = result.data?.email as string | undefined;

      let profileData: any = null;

      // Fetch full profile to get accurate roles
      if (token) {
        try {
          const profileRes = await fetch('/api/v1/profile', {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          });
          if (profileRes.ok) {
            profileData = await profileRes.json();
          }
        } catch (e) {
          console.warn('[login] Profile fetch failed:', e);
        }
      }

      // Build AuthResponse-compatible object
      const authData: AuthResponse = {
        token,
        userId: profileData?.data?.id ?? loginUserId ?? 0,
        username: profileData?.data?.username ?? data.username,
        email: profileData?.data?.email ?? loginEmail ?? '',
        role: loginRole,
        roles: profileData?.data?.roles ?? [loginRole],
      };

      // CRITICAL: call setAuth directly so Zustand state + localStorage are in sync
      // The auth-changed event will propagate to all open tabs/components
      useAuthStore.getState().setAuth(authData);

      // Determine redirect
      const roles: string[] = profileData?.data?.roles ?? [loginRole];
      const isAdmin = roles.some(
        (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN'
      );

      let dest = '/';
      if (isAdmin) {
        dest = '/admin';
      } else if (redirect && redirect !== '/') {
        dest = redirect;
      }

      toast.success(`Welcome back, ${data.username}!`);

      // Hard navigation: replace current history entry so back-button doesn't return to login page
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
    <div suppressHydrationWarning className="min-h-screen bg-darkbg flex items-center justify-center px-4 py-12">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
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

            <motion.button
              type="submit"
              disabled={isLoading}
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

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/oauth-callback' })}
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
              onClick={() => signIn('github', { callbackUrl: '/oauth-callback' })}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-darkborder bg-darkbg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
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
            ← Back to Home
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
