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
       * Logout — synchronous, no redirects.
       * 1. Clear ALL auth keys from storage
       * 2. Dispatch auth-changed event so ALL components/tabs reset
       * 3. Reset Zustand state immediately
       * Callers should handle navigation AFTER this returns.
       */
      logout: () => {
        if (typeof window === 'undefined') {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
          return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        // Clear the httpOnly cookie — backend_token is the primary auth token
        document.cookie = '__auth__=; path=/; max-age=0';
        document.cookie = 'backend_token=; path=/; max-age=0';
        document.cookie = 'admin_role=; path=/; max-age=0';

        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'logout' } }));

        set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
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
