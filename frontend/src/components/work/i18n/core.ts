/**
 * CT Work i18n — LÕI THUẦN (không React, không DOM) để test chạy bằng `tsx --test` từ gốc repo.
 *
 * Cú pháp chuỗi:
 *   - Biến:      'Hello {name}'                       ⇒ t('x', { name: 'An' })
 *   - Số nhiều:  '{count} issue|{count} issues'      ⇒ chọn vế theo `count` (1 ⇒ vế đầu, khác ⇒ vế sau).
 *                Chỉ áp khi có biến `count` là số. Tiếng Việt không có số nhiều ⇒ viết MỘT vế.
 *   - Số trong {count} được định dạng theo locale (1.234 / 1,234).
 * Thiếu khoá ở vi ⇒ lùi về en; thiếu cả hai ⇒ trả chính khoá (tsc đã chặn trường hợp này).
 */

import { en } from './en';
import { vi } from './vi';

export type WorkLocale = 'en' | 'vi';
export const WORK_LOCALES: readonly WorkLocale[] = ['en', 'vi'];

/** Khuôn từ điển tiếng Việt: ĐÚNG bộ khoá của bản tiếng Anh (thiếu hay thừa đều lỗi tsc). */
export type Strings<T> = { readonly [K in keyof T]: string };

type EnDict = typeof en;
/** Mọi khoá hợp lệ, dạng 'miền.khoá' — vd 'board.title'. */
export type WKey = { [D in keyof EnDict]: `${D & string}.${keyof EnDict[D] & string}` }[keyof EnDict];
export type WVars = Record<string, string | number | null | undefined>;

const DICTS: Record<WorkLocale, Record<string, Record<string, string>>> = {
  en: en as unknown as Record<string, Record<string, string>>,
  vi: vi as unknown as Record<string, Record<string, string>>,
};

export const intlLocale = (l: WorkLocale) => (l === 'vi' ? 'vi-VN' : 'en-US');

function lookup(locale: WorkLocale, key: string): string | undefined {
  const dot = key.indexOf('.');
  if (dot < 0) return undefined;
  const v = DICTS[locale][key.slice(0, dot)]?.[key.slice(dot + 1)];
  return typeof v === 'string' ? v : undefined;
}

export function hasKey(locale: WorkLocale, key: string): boolean {
  return lookup(locale, key) !== undefined;
}

export function formatNumber(locale: WorkLocale, n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocale(locale), opts).format(n);
}

/** Chọn vế số nhiều + thay biến. Tách riêng để test. */
export function interpolate(locale: WorkLocale, template: string, vars?: WVars): string {
  let s = template;
  if (vars && typeof vars.count === 'number' && s.includes('|')) {
    const forms = s.split('|');
    s = forms.length === 1 ? forms[0] : vars.count === 1 ? forms[0] : forms[1];
  }
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, name: string) => {
    if (!(name in vars)) return m;
    const v = vars[name];
    if (v === null || v === undefined) return '';
    return typeof v === 'number' ? formatNumber(locale, v) : v;
  });
}

export function translate(locale: WorkLocale, key: WKey | string, vars?: WVars): string {
  const raw = lookup(locale, key) ?? (locale !== 'en' ? lookup('en', key) : undefined);
  if (raw === undefined) return key;
  return interpolate(locale, raw, vars);
}

// ─── Ngày giờ ────────────────────────────────────────────────────

function toDate(iso: string | Date): Date {
  if (iso instanceof Date) return iso;
  // 'YYYY-MM-DD' là ngày lịch (không múi giờ) ⇒ đọc theo UTC để không lệch một ngày.
  return new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
}

/** "Oct 9, 2026" / "9 thg 10, 2026". Ngày lịch 'YYYY-MM-DD' đọc theo UTC. */
export function formatDate(locale: WorkLocale, iso: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return '';
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dateOnly = typeof iso === 'string' && iso.length === 10;
  return d.toLocaleDateString(intlLocale(locale), {
    month: 'short', day: 'numeric', year: 'numeric',
    ...(dateOnly ? { timeZone: 'UTC' } : {}),
    ...opts,
  });
}

/** Ngày ngắn không năm khi cùng năm: "Oct 9" / "9 thg 10". */
export function formatShortDate(locale: WorkLocale, iso: string | Date | null | undefined): string {
  if (!iso) return '';
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return '';
  const sameYear = d.getFullYear() === new Date().getFullYear();
  const dateOnly = typeof iso === 'string' && iso.length === 10;
  return d.toLocaleDateString(intlLocale(locale), {
    month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }), ...(dateOnly ? { timeZone: 'UTC' } : {}),
  });
}

export function formatDateTime(locale: WorkLocale, iso: string | Date | null | undefined): string {
  if (!iso) return '';
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(intlLocale(locale), { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** "just now · 5m ago · 3h ago · 2d ago" / "vừa xong · 5 phút trước · …"; quá 7 ngày ⇒ ngày ngắn. */
export function relativeTime(locale: WorkLocale, iso: string | Date, now = Date.now()): string {
  const d = toDate(iso);
  const diff = (now - d.getTime()) / 1000;
  if (diff < 45) return translate(locale, 'common.justNow');
  if (diff < 3600) return translate(locale, 'common.minutesAgo', { n: Math.max(1, Math.round(diff / 60)) });
  if (diff < 86400) return translate(locale, 'common.hoursAgo', { n: Math.round(diff / 3600) });
  if (diff < 86400 * 7) return translate(locale, 'common.daysAgo', { n: Math.round(diff / 86400) });
  return formatShortDate(locale, d);
}
