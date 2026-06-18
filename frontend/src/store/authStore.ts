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
  updateProfile: (data: {
    username?: string;
    email?: string;
    avatarUrl?: string;
    bio?: string;
    fullName?: string;
    displayName?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    birthYear?: number | null;
    phone?: string | null;
    socialLinks?: Record<string, string> | null;
  }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setAuth: (auth) => {
        const userObj: User = {
          id: auth.userId,
          username: auth.username,
          email: auth.email,
          displayName: auth.username,
          roles: auth.roles || [auth.role],
          enabled: true,
          accountNonLocked: true,
          createdAt: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          // Store user in localStorage for client-side auth checks
          localStorage.setItem('user', JSON.stringify(userObj));
          window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'login', user: userObj } }));
          // Play the "login" sound. Lazy-imported so users who have
          // never logged in don't pay the Web Audio + IndexedDB
          // module-load cost. The sound service itself checks the
          // user's master/sound-kind toggles before actually playing.
          import('@/lib/sound').then(({ playSound }) => {
            playSound('login');
          }).catch(() => { /* ignore */ });
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

        // Capture the active user BEFORE we wipe state so we can
        // scope the IndexedDB cache clear to just their records.
        const prevUserId = get().user?.id;

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

        // 5b. Wipe the per-user message cache so the next user
        // on a shared device doesn't see the previous user's
        // chat history appear from IndexedDB on next login.
        try {
          if (prevUserId != null) {
            const { clearForUser } = await import('@/lib/messageCache');
            await clearForUser(prevUserId);
          }
        } catch {
          // ignore — best effort
        }

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
        // Zustand persist has already restored `user` and `isAuthenticated`
        // from localStorage into the store by the time this callback fires.
        // All we need to do is flip the two flags that the initial
        // `useState` defaults set to `false`/`true` (which is wrong for
        // the rehydration path — on SSR/hydration the user is already
        // known from the cookie, so `isLoading: false` is correct too).
        try {
          const hasUser = Boolean(state && (state as any).user != null);
          useAuthStore.setState({
            isHydrated: true,
            isLoading: false,
            // Force `isAuthenticated` from the persisted state so the
            // dashboard hook sees the real userId immediately after
            // rehydration (not the `'guest'` fallback that fires when
            // `isAuthenticated` is still `false` on first render).
            isAuthenticated: hasUser,
          });
        } catch {
          useAuthStore.setState({ isHydrated: true, isLoading: false });
        }
      },
    }
  )
);
