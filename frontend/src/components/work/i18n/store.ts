'use client';

/**
 * CT Work — ngôn ngữ giao diện theo NGƯỜI DÙNG (10/10/2026).
 *
 * Nguồn sự thật: `users.preferences.work.locale` trên máy chủ (GET/PATCH /users/me/preferences) ⇒ web và app desktop
 * đồng bộ. `null` = người dùng chưa chọn ⇒ CT Work theo ngôn ngữ của SITE (cookie `locale` mà LocaleContext ghi) và
 * hỏi một lần lúc vào (FirstRunLanguagePrompt).
 *
 * Hai hệ chọn ngôn ngữ KHÔNG đánh nhau:
 *   - CT Work không ghi cookie `locale` của site; site không ghi `work.locale`.
 *   - Khi chưa chọn riêng, CT Work đi theo site (nghe sự kiện `locale-changed` của LocaleContext).
 *   - `<html lang>` trong lúc ở /work do CT Work giữ (WorkLangSync), rời /work thì trả về ngôn ngữ của site.
 *
 * localStorage chỉ là bản đệm để lần mở sau vẽ đúng ngôn ngữ ngay (không chớp tiếng Anh rồi mới đổi).
 */

import { create } from 'zustand';
import { preferencesApi } from '@/lib/api';
import type { WorkLocale } from './core';

const CACHE_KEY = 'ctwork:locale';

function readCache(): WorkLocale | null {
  try {
    const v = window.localStorage.getItem(CACHE_KEY);
    return v === 'vi' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}
function writeCache(v: WorkLocale | null) {
  try {
    if (v) window.localStorage.setItem(CACHE_KEY, v);
    else window.localStorage.removeItem(CACHE_KEY);
  } catch {
    /* bị chặn lưu trữ — bỏ qua */
  }
}

/** Ngôn ngữ hiện tại của SITE (cookie do LocaleContext ghi). Mặc định 'en' như LocaleContext. */
export function siteLocale(): WorkLocale {
  if (typeof document === 'undefined') return 'en';
  const v = document.cookie.split('; ').find((r) => r.startsWith('locale='))?.split('=')[1];
  return v === 'vi' ? 'vi' : 'en';
}

interface WorkLocaleState {
  /** Ngôn ngữ đang hiển thị. */
  locale: WorkLocale;
  /** Lựa chọn RIÊNG của người dùng cho CT Work; null = chưa chọn (theo site). */
  explicit: WorkLocale | null;
  /** Đã quyết định ngôn ngữ cho lần vẽ đầu (đọc đệm/cookie). */
  ready: boolean;
  /** Đã đọc được lựa chọn từ máy chủ (mới biết có cần hỏi lần đầu không). */
  serverLoaded: boolean;
  init: () => void;
  /** Chọn ngôn ngữ — lưu lên máy chủ. Trả về false nếu máy chủ không lưu được (vẫn đổi tại chỗ). */
  setLocale: (l: WorkLocale) => Promise<boolean>;
}

let initStarted = false;

export const useWorkLocaleStore = create<WorkLocaleState>((set, get) => ({
  locale: 'en',
  explicit: null,
  ready: false,
  serverLoaded: false,
  init: () => {
    if (initStarted || typeof window === 'undefined') return;
    initStarted = true;
    const cached = readCache();
    set({ locale: cached ?? siteLocale(), explicit: cached, ready: true });

    // Site đổi ngôn ngữ (LanguageSwitcher) ⇒ CT Work đi theo NẾU người dùng chưa chọn riêng.
    window.addEventListener('locale-changed', () => {
      if (!get().explicit) set({ locale: siteLocale() });
    });
    // Tab khác đổi ⇒ tab này theo.
    window.addEventListener('storage', (e) => {
      // Chỉ nhận lựa chọn thật ('vi'/'en'). Khoá bị xoá ở tab khác (vd tab đó vừa đọc máy chủ) không được
      // kéo tab này về ngôn ngữ site — máy chủ mới là nguồn sự thật, lần mở sau sẽ đọc lại.
      if (e.key !== CACHE_KEY || (e.newValue !== 'vi' && e.newValue !== 'en')) return;
      set({ explicit: e.newValue, locale: e.newValue });
    });

    preferencesApi
      .get()
      .then((r) => {
        const server = r.data?.data?.preferences?.work?.locale ?? null;
        const v: WorkLocale | null = server === 'vi' || server === 'en' ? server : null;
        writeCache(v);
        set({ explicit: v, locale: v ?? siteLocale(), serverLoaded: true });
      })
      .catch(() => {
        // Không đọc được (mạng / máy chủ cũ): giữ bản đệm, KHÔNG hỏi lần đầu (tránh hỏi lại mãi khi offline).
        set({ serverLoaded: false });
      });
  },
  setLocale: async (l) => {
    writeCache(l);
    set({ locale: l, explicit: l });
    try {
      await preferencesApi.update({ preferences: { work: { locale: l } } });
      set({ serverLoaded: true });
      return true;
    } catch {
      return false;
    }
  },
}));

/** Đọc ngôn ngữ hiện tại ngoài React (hàm định dạng, hằng số dạng getter). */
export const currentWorkLocale = (): WorkLocale => useWorkLocaleStore.getState().locale;
