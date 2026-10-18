/**
 * Lõi THUẦN của chế độ màu toàn site (18/10/2026) — không React, không DOM ⇒ test được bằng node:test
 * và dùng chung cho cả script chống nháy trong `app/layout.tsx` (server component).
 *
 * Ba lựa chọn người dùng: 'light' | 'dark' | 'system' (Tự động theo hệ điều hành).
 * Thứ thực sự áp lên `<html>` luôn chỉ là HAI giá trị: 'light' ⇒ class `light`, 'dark' ⇒ class `theme-dark`
 * (KHÔNG BAO GIỜ `.dark` — Tailwind `dark:` dành riêng cho Notes, xem CLAUDE.md bảng lỗi 2026-07-02).
 *
 * Máy chủ (`/users/me/preferences`) chỉ nhận 'dark'|'light' ⇒ 'system' là lựa chọn THEO MÁY, chỉ nằm ở
 * localStorage; máy chủ không bao giờ đè lên nó.
 *
 * Chạy test từ gốc repo: npx tsx --test frontend/src/context/themeLogic.test.ts
 */

export type ResolvedTheme = 'dark' | 'light';
export type ThemePreference = ResolvedTheme | 'system';

export const THEME_STORAGE_KEY = 'theme';
/** Thuộc tính trên `<html>` giữ LỰA CHỌN (khác class, là kết quả). */
export const THEME_PREF_ATTR = 'data-theme-pref';
/** Mặc định giữ như trước 18/10/2026: chưa chọn gì = tối. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/** Giá trị lạ / rỗng / null ⇒ mặc định. Giá trị cũ 'dark' | 'light' vẫn hợp lệ như xưa. */
export function parseThemePreference(raw: unknown): ThemePreference {
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : DEFAULT_THEME_PREFERENCE;
}

/** 'system' ⇒ theo hệ điều hành; còn lại giữ nguyên. */
export function resolveTheme(pref: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (pref === 'system') return systemPrefersDark ? 'dark' : 'light';
  return pref;
}

/** Class trên `<html>` ứng với kết quả. */
export function themeClassFor(resolved: ResolvedTheme): 'light' | 'theme-dark' {
  return resolved === 'light' ? 'light' : 'theme-dark';
}

/**
 * Máy chủ trả theme khi đăng nhập: có nên đè lựa chọn trên máy này không?
 * - Máy này chọn 'system' ⇒ KHÔNG (lựa chọn theo máy, máy chủ không biết tới nó).
 * - Máy chủ trả giá trị lạ ⇒ KHÔNG.
 * - Còn lại: đè khi khác.
 */
export function shouldApplyServerTheme(local: ThemePreference, server: unknown): server is ResolvedTheme {
  if (local === 'system') return false;
  if (server !== 'light' && server !== 'dark') return false;
  return server !== local;
}

/** Chỉ 'dark'|'light' được gửi lên máy chủ (nó trả 400 INVALID_THEME với thứ khác). */
export function serverThemeFor(pref: ThemePreference): ResolvedTheme | null {
  return pref === 'system' ? null : pref;
}

/** Nút "đảo" cũ (Navbar, LandingHeader): đảo theo cái ĐANG HIỆN, và chốt thành lựa chọn tường minh. */
export function toggledPreference(resolved: ResolvedTheme): ResolvedTheme {
  return resolved === 'dark' ? 'light' : 'dark';
}

/**
 * Script chống nháy — chạy đồng bộ trong `<body>` TRƯỚC lần vẽ đầu (layout.tsx). Phải tự đủ (không import),
 * nên nó lặp lại đúng luật của parseThemePreference/resolveTheme ở trên; themeLogic.test.ts chạy chính chuỗi này
 * trên DOM giả để hai bên không trôi nhau.
 */
export const THEME_BOOT_SCRIPT =
  "try{var h=document.documentElement,p=localStorage.getItem('theme');" +
  "if(p!=='light'&&p!=='system')p='dark';" +
  "var r=p==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;" +
  "h.classList.add(r==='light'?'light':'theme-dark');h.setAttribute('data-theme-pref',p)" +
  "}catch(e){document.documentElement.classList.add('theme-dark')}";
