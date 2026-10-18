'use client';

/**
 * Chế độ màu toàn site. Từ 18/10/2026 có BA lựa chọn: 'light' | 'dark' | 'system' (Tự động theo hệ điều hành).
 *
 * Tương thích ngược: `theme` và `resolvedTheme` vẫn là thứ ĐANG HIỆN ('dark' | 'light') như trước — mọi chỗ cũ
 * (`theme === 'dark'`, `toggleTheme()`, `setTheme('light')`) chạy y nguyên. Lựa chọn thật đọc ở `preference`.
 * Luật thuần + script chống nháy nằm ở `./themeLogic` (có test).
 */

import { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  DARK_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_PREF_ATTR,
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveTheme,
  serverThemeFor,
  shouldApplyServerTheme,
  toggledPreference,
  type ResolvedTheme,
  type ThemePreference,
} from './themeLogic';

export type { ResolvedTheme, ThemePreference } from './themeLogic';
/** Giữ tên cũ cho ai đang import kiểu `Theme`. */
export type Theme = ResolvedTheme;

interface ThemeContextValue {
  /** Thứ đang hiện ('dark' | 'light') — giữ nghĩa cũ. */
  theme: ResolvedTheme;
  /** Lựa chọn của người dùng, có thể là 'system'. */
  preference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (t: ThemePreference) => void;
  resolvedTheme: ResolvedTheme;
}

// Theo dõi <html>: class (kết quả) + data-theme-pref (lựa chọn).
const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', THEME_PREF_ATTR],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): ResolvedTheme =>
  document.documentElement.classList.contains('light') ? 'light' : 'dark';
const getPrefSnapshot = (): ThemePreference =>
  parseThemePreference(document.documentElement.getAttribute(THEME_PREF_ATTR));

// Server-side fallback
const getServerSnapshot = (): ResolvedTheme => 'dark';
const getServerPrefSnapshot = (): ThemePreference => DEFAULT_THEME_PREFERENCE;

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  preference: DEFAULT_THEME_PREFERENCE,
  toggleTheme: () => {},
  setTheme: () => {},
  resolvedTheme: 'dark',
});

function readStored(): string | null {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
}
function writeStored(p: ThemePreference) {
  try { localStorage.setItem(THEME_STORAGE_KEY, p); } catch { /* chế độ riêng tư — vẫn áp lên DOM */ }
}

// Get stored preference (sync, no API call)
function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE;
  return parseThemePreference(readStored());
}

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_MEDIA_QUERY).matches
    : false; // khớp THEME_BOOT_SCRIPT: không có matchMedia ⇒ sáng
}

// Apply theme to DOM immediately
function applyThemeToDOM(pref: ThemePreference) {
  const html = document.documentElement;
  // Global dark class is 'theme-dark', NOT 'dark' — Tailwind's `dark:`
  // variant ('.dark' ancestor) is reserved for the Notes page's own
  // wrapper-scoped 3-theme system.
  const t = resolveTheme(pref, systemPrefersDark());
  if (t === 'dark') {
    html.classList.remove('light');
    html.classList.add('theme-dark');
  } else {
    html.classList.remove('theme-dark');
    html.classList.add('light');
  }
  if (html.getAttribute(THEME_PREF_ATTR) !== pref) html.setAttribute(THEME_PREF_ATTR, pref);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for instant DOM sync
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const preference = useSyncExternalStore(subscribe, getPrefSnapshot, getServerPrefSnapshot);

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
          const serverTheme: unknown = res.data?.data?.theme;
          // 'system' là lựa chọn theo máy — máy chủ (chỉ biết dark/light) không đè nó.
          if (shouldApplyServerTheme(getStoredTheme(), serverTheme)) {
            applyThemeToDOM(serverTheme);
            writeStored(serverTheme);
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

  // 'system': đổi NGAY khi hệ điều hành đổi sáng/tối. Tab khác đổi lựa chọn ⇒ tab này theo.
  useEffect(() => {
    const mql = typeof window.matchMedia === 'function' ? window.matchMedia(DARK_MEDIA_QUERY) : null;
    const onSystem = () => { if (getStoredTheme() === 'system') applyThemeToDOM('system'); };
    const onStorage = (e: StorageEvent) => { if (e.key === THEME_STORAGE_KEY) applyThemeToDOM(parseThemePreference(e.newValue)); };
    if (mql) {
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onSystem);
      else mql.addListener(onSystem); // Safari < 14
    }
    window.addEventListener('storage', onStorage);
    return () => {
      if (mql) {
        if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', onSystem);
        else mql.removeListener(onSystem);
      }
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setTheme = useCallback((t: ThemePreference) => {
    const pref = parseThemePreference(t);
    applyThemeToDOM(pref);
    writeStored(pref);

    // Sync to server (fire and forget) — skip for guests (401 otherwise).
    // 'system' chỉ lưu ở máy này: máy chủ trả 400 INVALID_THEME với mọi thứ ngoài dark/light.
    const server = serverThemeFor(pref);
    if (server && useAuthStore.getState().isAuthenticated) {
      api.patch('/users/me/preferences', { theme: server }).catch(() => {});
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(toggledPreference(theme));
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, preference, toggleTheme, setTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Cho một vỏ KHÁC dựng cây web mà không có ThemeProvider (app desktop: `VoWeb` trong desktop/…/TrangWeb.tsx).
 * Ở đó chế độ màu do APP giữ (thiết đặt light/dark/system của app, app tự gắn `theme-dark` lên <html>), nên cây web
 * phải đọc/ghi qua app — thiếu cầu này thì `useTheme()` rơi về giá trị mặc định, nút Sáng/Tối/Tự động của CT Work
 * bấm không ăn gì.
 */
export function ThemeBridgeProvider({ preference, resolvedTheme, onChange, children }: {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  onChange: (p: ThemePreference) => void;
  children: ReactNode;
}) {
  const value: ThemeContextValue = {
    theme: resolvedTheme,
    resolvedTheme,
    preference,
    setTheme: (p) => onChange(parseThemePreference(p)),
    toggleTheme: () => onChange(toggledPreference(resolvedTheme)),
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
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
