import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthResponse } from '@/types';
import { ssrSafeStorage } from './ssrSafeStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setAuth: (auth: AuthResponse) => void;
  updateUser: (user: User) => void;
  updateProfile: (data: { username?: string; email?: string; avatarUrl?: string; bio?: string; fullName?: string }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,

      setAuth: (auth) => {
        const userObj: User = {
          id: auth.userId,
          username: auth.username,
          email: auth.email,
          roles: auth.roles || [auth.role],
          enabled: true,
          accountNonLocked: true,
          createdAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          // Store user in localStorage for client-side auth checks
          localStorage.setItem('user', JSON.stringify(userObj));
          window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'login', user: userObj } }));
        }

        set({ user: userObj, token: null, isAuthenticated: true, isLoading: false });
      },

      updateUser: (user) => set({ user }),

      updateProfile: (data) =>
        set((state) => {
          const nextUser = state.user ? { ...state.user, ...data } : null;

          if (typeof window !== 'undefined' && nextUser) {
            localStorage.setItem('user', JSON.stringify(nextUser));
            window.dispatchEvent(new CustomEvent('auth-changed', {
              detail: {
                action: 'profile-refreshed',
                user: nextUser,
                roles: nextUser.roles ?? [],
              },
            }));
          }

          return { user: nextUser };
        }),

      /**
       * Logout — full security wipe per spec.
       * 1. Call backend to destroy server session cookie
       * 2. Clear ALL auth cookies
       * 3. Wipe Zustand store state
       * 4. Clear React Query / TanStack Query cache
       * 5. Clear localStorage / sessionStorage
       * 6. Hard redirect to /login
       */
      logout: async () => {
        if (typeof window === 'undefined') {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
          return;
        }

        // 1. Hit backend logout endpoint to clear server-side session
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch {
          // ignore
        }

        // 2. Clear all auth cookies
        const cookies = ['token', 'auth_token', 'userId', '__auth__', 'backend_token', 'admin_role'];
        cookies.forEach((name) => {
          document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
        });

        // 3. Dispatch auth-changed event
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'logout' } }));

        // 4. Clear Zustand state
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });

        // 5. Clear localStorage / sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // 6. Hard redirect — purges all client-side state buffers
        window.location.href = '/login';
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({
        user: state.user,
        // NOTE: token is NOT persisted to localStorage.
        // The JWT lives only in the httpOnly backend_token cookie.
        // API calls are authenticated via the cookie through the /api/v1 proxy route.
        // Persisting the token in localStorage is an XSS attack vector.
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.set({ isHydrated: true });
      },
    }
  )
);
