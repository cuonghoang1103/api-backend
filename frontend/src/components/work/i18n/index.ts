'use client';

/**
 * CT Work i18n — cửa vào cho component.
 *
 *   const { t, locale, fmtDate } = useWT();   // trong component (đăng ký theo dõi ngôn ngữ)
 *   wt('board.title')                          // ngoài component / trong hằng số dạng getter
 *
 * WorkShell gắn `key={locale}` cho vùng nội dung ⇒ đổi ngôn ngữ thì cả cây CT Work vẽ lại từ đầu, nên `wt()` gọi
 * trong lúc render cũng luôn đúng ngôn ngữ. ⚠️ KHÔNG gọi `wt()` ở cấp module (hằng số tính một lần lúc import) —
 * dùng getter: `{ get label() { return wt('x.y'); } }`.
 */

import { useMemo } from 'react';
import {
  formatDate as fDate, formatDateTime as fDateTime, formatNumber as fNumber, formatShortDate as fShort,
  relativeTime as fRel, translate, type WKey, type WVars, type WorkLocale,
} from './core';
import { currentWorkLocale, useWorkLocaleStore } from './store';

export type { WKey, WVars, WorkLocale } from './core';
export { useWorkLocaleStore, currentWorkLocale, siteLocale } from './store';

/** Dịch theo ngôn ngữ CT Work hiện tại (không phải hook). */
export function wt(key: WKey, vars?: WVars): string {
  return translate(currentWorkLocale(), key, vars);
}

export const wfmt = {
  date: (iso: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) => fDate(currentWorkLocale(), iso, opts),
  shortDate: (iso: string | Date | null | undefined) => fShort(currentWorkLocale(), iso),
  dateTime: (iso: string | Date | null | undefined) => fDateTime(currentWorkLocale(), iso),
  number: (n: number, opts?: Intl.NumberFormatOptions) => fNumber(currentWorkLocale(), n, opts),
  relative: (iso: string | Date) => fRel(currentWorkLocale(), iso),
  /** 'vi-VN' | 'en-US' — cho toLocaleString tự gọi. */
  intl: () => (currentWorkLocale() === 'vi' ? 'vi-VN' : 'en-US'),
};

export interface WT {
  t: (key: WKey, vars?: WVars) => string;
  locale: WorkLocale;
  intl: 'vi-VN' | 'en-US';
  fmtDate: (iso: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) => string;
  fmtShortDate: (iso: string | Date | null | undefined) => string;
  fmtDateTime: (iso: string | Date | null | undefined) => string;
  fmtNumber: (n: number, opts?: Intl.NumberFormatOptions) => string;
  fmtRelative: (iso: string | Date) => string;
}

export function useWT(): WT {
  const locale = useWorkLocaleStore((s) => s.locale);
  return useMemo<WT>(() => ({
    locale,
    intl: locale === 'vi' ? 'vi-VN' : 'en-US',
    t: (key, vars) => translate(locale, key, vars),
    fmtDate: (iso, opts) => fDate(locale, iso, opts),
    fmtShortDate: (iso) => fShort(locale, iso),
    fmtDateTime: (iso) => fDateTime(locale, iso),
    fmtNumber: (n, opts) => fNumber(locale, n, opts),
    fmtRelative: (iso) => fRel(locale, iso),
  }), [locale]);
}
