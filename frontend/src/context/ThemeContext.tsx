'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Read from localStorage first (fast, prevents flash)
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    setThemeState(initial);
    applyTheme(initial);
    setMounted(true);

    // Then sync with server if logged in
    fetchServerPreference(initial);
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    if (t === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const fetchServerPreference = useCallback(async (fallback: Theme) => {
    try {
      const res = await api.get('/users/me/preferences');
      const serverTheme = res.data?.data?.theme as Theme | undefined;
      if (serverTheme === 'light' || serverTheme === 'dark') {
        setThemeState(serverTheme);
        applyTheme(serverTheme);
        localStorage.setItem(STORAGE_KEY, serverTheme);
      }
    } catch {
      // Not logged in or endpoint not available — use fallback
    }
  }, [applyTheme]);

  const setTheme = useCallback(async (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);

    // Sync to server
    try {
      await api.patch('/users/me/preferences', { theme: t });
    } catch {
      // Non-critical — localStorage is enough
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Prevent flash of wrong theme — don't render children until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
