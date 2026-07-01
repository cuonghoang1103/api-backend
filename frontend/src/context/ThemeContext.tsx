'use client';

import { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { api } from '@/lib/api';

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
  if (t === 'dark') {
    html.classList.remove('light');
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
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

    // Then sync with server (non-blocking)
    api.get('/users/me/preferences')
      .then((res) => {
        const serverTheme = res.data?.data?.theme as Theme | undefined;
        if (serverTheme === 'light' || serverTheme === 'dark') {
          if (serverTheme !== stored) {
            applyThemeToDOM(serverTheme);
            localStorage.setItem(STORAGE_KEY, serverTheme);
          }
        }
      })
      .catch(() => {
        // Ignore server errors
      });
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyThemeToDOM(t);
    localStorage.setItem(STORAGE_KEY, t);

    // Sync to server (fire and forget)
    api.patch('/users/me/preferences', { theme: t }).catch(() => {});
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
