'use client';

/**
 * NotesThemeProvider — Phase 4 (theme switcher cho trang /notes)
 *
 * Cung cấp theme 'dark' / 'light' cho toàn bộ cây component dưới
 * /notes thông qua React Context + `class` attribute trên root
 * container. Tailwind `darkMode: 'class'` đã được bật trong
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

export type NotesTheme = 'dark' | 'light';

const STORAGE_KEY = 'notes-theme';
const DEFAULT_THEME: NotesTheme = 'dark';

interface NotesThemeContextValue {
  theme: NotesTheme;
  setTheme: (next: NotesTheme) => void;
  /** Convenience: toggle between the two supported themes. */
  toggleTheme: () => void;
}

const NotesThemeContext = createContext<NotesThemeContextValue | null>(null);

function readStoredTheme(): NotesTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
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
  //   2. CSS variables (nếu có) được cập nhật
  //   3. Trình duyệt không flash sai màu khi reload
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-notes-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: NotesTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<NotesThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <NotesThemeContext.Provider value={value}>
      {/*
        Wrapper div mang class `dark` khi theme='dark'. Tailwind
        darkMode: 'class' sẽ kích hoạt tất cả utility `dark:xxx`
        bên trong cây con. className `notes-theme-root` chỉ để
        tiện debug / style override toàn cục nếu cần sau này.
      */}
      <div
        className={`notes-theme-root h-full ${theme === 'dark' ? 'dark' : ''}`}
        data-notes-theme={theme}
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