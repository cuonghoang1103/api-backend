'use client';

/**
 * NotesThemeProvider — Phase 4 (theme switcher cho trang /notes)
 *
 * Cung cấp theme 'dark' / 'light' / 'light-white' cho toàn bộ cây
 * component dưới /notes thông qua React Context + `class` attribute
 * trên root container. Tailwind `darkMode: 'class'` đã được bật trong
 * tailwind.config.ts, nên các utility `dark:` sẽ tự động áp dụng
 * khi wrapper có class `dark`.
 *
 * Persistence: lưu vào localStorage key `notes-theme`. Mặc định
 * 'dark' để giữ nguyên hành vi cũ cho user mới.
 *
 * Phạm vi: CHỈ áp dụng cho trang /notes. Không đụng đến các trang
 * khác, không đụng đến backend / DB / data người dùng đã lưu.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type NotesTheme = 'dark' | 'brown' | 'light';

// Storage key is versioned (-v2): the previous key ('notes-theme') had 'dark'
// persisted for existing desktops, which overrode the new light default and
// kept the UI dark even after redeploys. Bumping the key ignores that stale
// value once so everyone resets to the white default; users can re-pick a
// theme and it saves under the new key.
const STORAGE_KEY = 'notes-theme-v2';
// Default to the clean white theme (Google-Docs style). This is also the
// fallback whenever localStorage is empty — e.g. a new visitor, or after the
// user clears site data — so the Notes UI opens white instead of reverting to
// dark. Existing users who picked another theme keep their saved choice.
const DEFAULT_THEME: NotesTheme = 'light';

// Theme cycle order starts from the default (white): light → dark → brown.
const THEME_CYCLE: NotesTheme[] = ['light', 'dark', 'brown'];

interface NotesThemeContextValue {
  theme: NotesTheme;
  setTheme: (next: NotesTheme) => void;
  /** Convenience: cycle through the supported themes. */
  toggleTheme: () => void;
  /** Get display info for the current theme. */
  themeInfo: { label: string; icon: 'moon' | 'sun' | 'sparkles' };
}

const NotesThemeContext = createContext<NotesThemeContextValue | null>(null);

function readStoredTheme(): NotesTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'dark' || raw === 'brown' || raw === 'light') return raw as NotesTheme;
  } catch {
    /* localStorage không khả dụng (Safari private mode, quota...) — bỏ qua */
  }
  return DEFAULT_THEME;
}

export function NotesThemeProvider({ children }: { children: ReactNode }) {
  // Bắt đầu với DEFAULT_THEME để SSR/CSR markup khớp nhau
  // (tránh hydration warning). Sau khi mount mới đọc localStorage
  // và sync lại state nếu khác default.
  const [theme, setThemeState] = useState<NotesTheme>(DEFAULT_THEME);
  const [hydrated, setHydrated] = useState(false);

  // Mount effect: đọc localStorage 1 lần. Đặt cờ `hydrated` để
  // lần render đầu tiên dùng DEFAULT_THEME khớp với SSR, rồi
  // re-render với theme thực tế từ localStorage.
  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    setHydrated(true);
  }, []);

  // Persist mỗi khi theme đổi (kể cả lần sync đầu tiên từ
  // localStorage — set cùng giá trị thì localStorage không đổi).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* quota / private mode — bỏ qua, theme vẫn hoạt động trong session */
    }
  }, [theme, hydrated]);

  // Sync theme vào <html data-theme="..."> để:
  //   1. CSS `html[data-theme="light"] .x { ... }` có thể override
  //   2. Trình duyệt không flash sai màu khi reload
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-notes-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: NotesTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const currentIndex = THEME_CYCLE.indexOf(prev);
      const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
      return THEME_CYCLE[nextIndex];
    });
  }, []);

  const themeInfo = useMemo(() => {
    switch (theme) {
      case 'dark':
        return { label: 'Nền tối', icon: 'moon' as const };
      case 'brown':
        return { label: 'Nền nâu ấm', icon: 'sun' as const };
      case 'light':
        return { label: 'Nền trắng sáng', icon: 'sparkles' as const };
    }
  }, [theme]);

  const value = useMemo<NotesThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme, themeInfo }),
    [theme, setTheme, toggleTheme, themeInfo],
  );

  // Build CSS variables object based on theme
  const themeStyles = useMemo(() => {
    if (theme === 'light') {
      // Clean white theme
      return {
        // Declare the scheme so the browser's "force dark mode for web"
        // (e.g. Cốc Cốc/Chrome auto-dark) does NOT invert this subtree.
        colorScheme: 'light',
        '--notes-bg': '#ffffff',
        '--notes-surface': '#ffffff',
        '--notes-border': '#e2e8f0',
        '--notes-text': '#1e293b',
        '--notes-text-muted': '#64748b',
        '--notes-accent': '#0d9488',
        '--notes-sidebar-bg': '#ffffff',
        '--notes-toolbar-bg': '#ffffff',
      } as React.CSSProperties;
    } else if (theme === 'brown') {
      // Warm brown / sepia theme — clearly tan so "Nâu" actually looks brown
      // (the old #faf6f1 was nearly white). Reads like aged paper.
      return {
        colorScheme: 'light',
        '--notes-bg': '#e7d9bf',
        '--notes-surface': '#ddccae',
        '--notes-border': '#c9b491',
        '--notes-text': '#43361f',
        '--notes-text-muted': '#6e5c3f',
        '--notes-accent': '#0d9488',
        '--notes-sidebar-bg': '#e0d2b6',
        '--notes-toolbar-bg': '#e7d9bf',
      } as React.CSSProperties;
    } else {
      // Dark theme
      return {
        colorScheme: 'dark',
        '--notes-bg': '#0c0f14',
        '--notes-surface': '#0e1218',
        '--notes-border': 'rgba(255,255,255,0.06)',
        '--notes-text': '#e2e8f0',
        '--notes-text-muted': '#64748b',
        '--notes-accent': '#14b8a6',
        '--notes-sidebar-bg': '#0e1218',
        '--notes-toolbar-bg': 'rgba(12,15,20,0.9)',
      } as React.CSSProperties;
    }
  }, [theme]);

  return (
    <NotesThemeContext.Provider value={value}>
      {/*
        Wrapper div mang class `dark` khi theme='dark'. Tailwind
        darkMode: 'class' sẽ kích hoạt tất cả utility `dark:xxx`
        bên trong cây con. className `notes-theme-root` chỉ để
        tiện debug / style override toàn cục nếu cần sau này.

        Theme classes:
        - 'dark': Dark background (#0c0f14), dark text
        - 'brown': Warm brown background (#faf6f1)
        - 'light': Pure white background (#ffffff), clean light UI
      */}
      <div
        className={`notes-theme-root h-full ${theme === 'dark' ? 'dark' : ''}`}
        data-notes-theme={theme}
        style={themeStyles}
      >
        {children}
      </div>
    </NotesThemeContext.Provider>
  );
}

export function useNotesTheme(): NotesThemeContextValue {
  const ctx = useContext(NotesThemeContext);
  if (!ctx) {
    throw new Error('useNotesTheme must be used inside <NotesThemeProvider>');
  }
  return ctx;
}

/**
 * Convenience hook: trả về true nếu đang ở dark mode.
 * Tránh phải gọi useNotesTheme().theme === 'dark' ở khắp nơi.
 */
export function useIsNotesDark(): boolean {
  const { theme } = useNotesTheme();
  return theme === 'dark';
}