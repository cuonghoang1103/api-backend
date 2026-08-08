'use client';

/**
 * Bilingual (VI/EN) plumbing for the /projects module.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two separate problems live here, and they are solved differently:
 *
 *   1. CONTENT — titles, prose, milestone descriptions. Comes from the API in
 *      both languages at once (`title` + `titleEn`), so switching is a local
 *      re-render with no refetch. `pickLang()` does the choosing and always
 *      falls back to Vietnamese: a project translated halfway shows Vietnamese
 *      for the untranslated parts, never an empty string.
 *
 *   2. CHROME — button labels, filter names, section headings. These are known
 *      at build time, so they live in the PROJECT_UI table below rather than
 *      going through the global `t()` dictionary. The reason is honesty about
 *      coverage: a missing key in `t()` renders the raw key path into the page
 *      ("projects.filters.level"), which looks like a bug and reads like one.
 *      A table of literal pairs cannot half-exist.
 *
 * The active language is the SITE locale (cookie `locale` + the
 * `locale-changed` window event that LanguageSwitcher broadcasts), so the
 * toggle on this page and the one in the navbar are the same setting — flipping
 * either updates both, instantly, with no navigation.
 */
import { useTranslation } from '@/hooks/useTranslation';

export type Lang = 'vi' | 'en';

/**
 * Choose the translated value, falling back to Vietnamese.
 * Empty strings count as missing — an EN column that exists but is blank is a
 * half-finished translation, not a deliberate empty label.
 */
export function pickLang<T extends string | null | undefined>(
  lang: Lang,
  vi: T,
  en: T,
): string {
  if (lang === 'en') {
    const trimmed = typeof en === 'string' ? en.trim() : '';
    if (trimmed) return trimmed;
  }
  return typeof vi === 'string' ? vi : '';
}

/**
 * Current language for project surfaces, plus the two helpers every component
 * here needs. `L` is for literals written inline, `pick` for API values.
 */
export function useProjectLang() {
  const { locale, setLocale } = useTranslation();
  const lang: Lang = locale === 'en' ? 'en' : 'vi';

  return {
    lang,
    setLang: setLocale,
    /** Inline literal pair: L('Bộ lọc', 'Filters') */
    L: (vi: string, en: string) => (lang === 'en' ? en : vi),
    /** API value pair with VI fallback: pick(p.title, p.titleEn) */
    pick: (vi: string | null | undefined, en: string | null | undefined) =>
      pickLang(lang, vi, en),
  };
}

/**
 * Difficulty / status / category labels. Kept as data because three different
 * components render the same badges and they must not drift apart.
 */
export const LEVEL_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  BEGINNER: { vi: 'Cơ bản', en: 'Beginner' },
  INTERMEDIATE: { vi: 'Trung bình', en: 'Intermediate' },
  ADVANCED: { vi: 'Nâng cao', en: 'Advanced' },
  EXPERT: { vi: 'Chuyên sâu', en: 'Expert' },
};

export const STATUS_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed' },
  IN_PROGRESS: { vi: 'Đang làm', en: 'In progress' },
  PLANNING: { vi: 'Lên kế hoạch', en: 'Planning' },
  MAINTENANCE: { vi: 'Bảo trì', en: 'Maintenance' },
  ON_HOLD: { vi: 'Tạm dừng', en: 'On hold' },
};

export const CATEGORY_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  Web: { vi: 'Web', en: 'Web' },
  Mobile: { vi: 'Di động', en: 'Mobile' },
  AI: { vi: 'AI', en: 'AI' },
  DevOps: { vi: 'DevOps', en: 'DevOps' },
  Game: { vi: 'Game', en: 'Game' },
  IoT: { vi: 'IoT', en: 'IoT' },
  Data: { vi: 'Dữ liệu', en: 'Data' },
  Tooling: { vi: 'Công cụ', en: 'Tooling' },
  Systems: { vi: 'Hệ thống', en: 'Systems' },
  Backend: { vi: 'Backend', en: 'Backend' },
};

/** Milestone phase chips on the case-study timeline. */
export const PHASE_LABELS_I18N: Record<string, { vi: string; en: string }> = {
  IDEATION: { vi: 'Ý tưởng', en: 'Ideation' },
  PLANNING: { vi: 'Lên kế hoạch', en: 'Planning' },
  DESIGN: { vi: 'Thiết kế', en: 'Design' },
  SETUP: { vi: 'Khởi tạo', en: 'Setup' },
  BACKEND: { vi: 'Backend', en: 'Backend' },
  FRONTEND: { vi: 'Frontend', en: 'Frontend' },
  DATABASE: { vi: 'Cơ sở dữ liệu', en: 'Database' },
  MOBILE: { vi: 'Di động', en: 'Mobile' },
  AI: { vi: 'AI', en: 'AI' },
  TESTING: { vi: 'Kiểm thử', en: 'Testing' },
  DEVOPS: { vi: 'DevOps', en: 'DevOps' },
  SECURITY: { vi: 'Bảo mật', en: 'Security' },
  SCALING: { vi: 'Mở rộng', en: 'Scaling' },
  LAUNCH: { vi: 'Ra mắt', en: 'Launch' },
};

/** Look up a badge label, gracefully passing through unknown values. */
export function labelOf(
  table: Record<string, { vi: string; en: string }>,
  key: string | null | undefined,
  lang: Lang,
): string {
  if (!key) return '';
  const entry = table[key];
  if (!entry) return key;
  return lang === 'en' ? entry.en : entry.vi;
}
