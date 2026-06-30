'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';
import type { AuthResponse } from '@/types';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated: isBackendAuthenticated,
    isLoading,
    setAuth,
    updateUser,
    updateProfile,
    logout,
    setLoading,
  } = useAuthStore();

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setLoading(true);
      try {
        const response = await authApi.login({ username, password });
        const authData = response.data.data as AuthResponse;
        setAuth(authData);

        // CRITICAL: fetch full profile (including avatarUrl) BEFORE returning.
        // Without this await, login() returns immediately so the navbar/composer
        // render with no avatar. The cookie is already set at this point so
        // authApi.getProfile() will succeed.
        try {
          const res = await authApi.getProfile();
          if (res.data?.data) {
            updateProfile({
              ...authData,
              ...res.data.data,
              id: authData.userId,
            });
          }
        } catch {
          // silently ignore — user still has a valid session
        }

        const roles = authData.roles || (authData.role ? [authData.role] : []);
        const isAdmin = roles.some(
          (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN'
        );
        return isAdmin;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        const msg =
          error?.response?.data?.message ||
          'Invalid username or password. Please try again.';
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, updateProfile]
  );

  const register = useCallback(
    async (data: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
    }): Promise<boolean> => {
      setLoading(true);
      try {
        await authApi.register(data);
        toast.success('Account created! Please sign in.');
        router.push('/login');
        return true;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        const msg =
          error?.response?.data?.message ||
          'Registration failed. Please try again.';
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, router]
  );

  /**
   * Logout — sequential:
   * 1. Clear Zustand + storage
   * 2. Wait for event propagation
   * 3. Clear NextAuth session
   * 4. Navigate
   */
  const logoutAndRedirect = useCallback(async () => {
    logout(); // clears state + dispatches auth-changed

    try {
      await signOut({ redirect: false });
    } catch {}

    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}

    toast.success('Logged out successfully');
    window.location.href = '/login';
  }, [logout]);

  const logoutSilently = useCallback(() => {
    logout();
    signOut({ redirect: false }).catch(() => {});
  }, [logout]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authApi.getProfile();
      if (res.data?.data) {
        updateProfile(res.data.data);
      }
    } catch {
      // silently ignore
    }
  }, [token, updateProfile]);

  /**
   * Fetches the full profile right after login — accepts the raw auth
   * response so it works even when the cookie hasn't propagated yet.
   * Merges avatarUrl + displayName into the auth store.
   */
  const refreshProfileWithToken = useCallback(
    async (authData: AuthResponse) => {
      try {
        const res = await authApi.getProfile();
        if (res.data?.data) {
          // Merge: keep the id/username/email from setAuth, add the rest
          // from the full profile response (avatarUrl, displayName, bio, …).
          updateProfile({
            ...authData,
            ...res.data.data,
            id: authData.userId,
          });
        }
      } catch {
        // silently ignore — the user still has a valid session
      }
    },
    [updateProfile]
  );

  return {
    user,
    token,
    isAuthenticated: isBackendAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutAndRedirect,
    logoutSilently,
    refreshProfile,
    refreshProfileWithToken,
  };
}
