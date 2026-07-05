'use client';

import { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  resolvedTheme: Theme;
}

// Subscribe to html class changes
const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
};

// Get current theme from DOM
const getSnapshot = (): Theme => {
  const html = document.documentElement;
  if (html.classList.contains('light')) return 'light';
  return 'dark';
};

// Server-side fallback
const getServerSnapshot = (): Theme => 'dark';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  resolvedTheme: 'dark',
});

const STORAGE_KEY = 'theme';

// Get stored preference (sync, no API call)
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
}

// Apply theme to DOM immediately
function applyThemeToDOM(t: Theme) {
  const html = document.documentElement;
  // Global dark class is 'theme-dark', NOT 'dark' — Tailwind's `dark:`
  // variant ('.dark' ancestor) is reserved for the Notes page's own
  // wrapper-scoped 3-theme system.
  if (t === 'dark') {
    html.classList.remove('light');
    html.classList.add('theme-dark');
  } else {
    html.classList.remove('theme-dark');
    html.classList.add('light');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for instant DOM sync
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Initialize theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    applyThemeToDOM(stored);

    // Server sync is auth-only: /users/me/preferences 401s for guests, and
    // ThemeProvider wraps the whole app — every anonymous page view fired a
    // guaranteed-401 (audit 2026-07-05). The auth store hydrates async, so
    // instead of a one-shot check we sync once auth is (or becomes) ready.
    let synced = false;
    const syncFromServer = () => {
      if (synced) return;
      synced = true;
      api.get('/users/me/preferences')
        .then((res) => {
          const serverTheme = res.data?.data?.theme as Theme | undefined;
          if (serverTheme === 'light' || serverTheme === 'dark') {
            if (serverTheme !== getStoredTheme()) {
              applyThemeToDOM(serverTheme);
              localStorage.setItem(STORAGE_KEY, serverTheme);
            }
          }
        })
        .catch(() => {
          // Ignore server errors
        });
    };

    if (useAuthStore.getState().isAuthenticated) {
      syncFromServer();
      return;
    }
    const unsub = useAuthStore.subscribe((s) => {
      if (s.isAuthenticated) {
        syncFromServer();
        unsub();
      }
    });
    return () => unsub();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyThemeToDOM(t);
    localStorage.setItem(STORAGE_KEY, t);

    // Sync to server (fire and forget) — skip for guests (401 otherwise)
    if (useAuthStore.getState().isAuthenticated) {
      api.patch('/users/me/preferences', { theme: t }).catch(() => {});
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Hook to get current DOM theme instantly (no context delay)
export function useThemeClass() {
  const [themeClass, setThemeClass] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setThemeClass(html.classList.contains('light') ? 'light' : 'dark');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    setThemeClass(html.classList.contains('light') ? 'light' : 'dark');
    return () => observer.disconnect();
  }, []);

  return themeClass;
}
