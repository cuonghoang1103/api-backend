'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocaleContext } from '@/context/LocaleContext';

// Translation type
type Locale = 'vi' | 'en';

// Translation cache — shared across all hook instances
const translations: Record<Locale, Record<string, any>> = {
  vi: {},
  en: {}
};

let isLoading = false;
let loadPromise: Promise<void> | null = null;

async function loadTranslations(locale: Locale): Promise<void> {
  if (Object.keys(translations[locale]).length > 0) return;
  if (isLoading) return loadPromise!;

  isLoading = true;
  loadPromise = import(`../../messages/${locale}.json`).then((mod) => {
    translations[locale] = mod.default;
    isLoading = false;
  }).catch((err) => {
    console.error('Failed to load translations:', err);
    isLoading = false;
  });

  return loadPromise;
}

// Get nested translation value from an object
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let value: any = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * Main translation hook.
 * Uses LocaleContext when available, falls back to standalone mode.
 * Always returns safe string values - never undefined.
 */
export function useTranslation() {
  // Try to use context first
  try {
    const context = useLocaleContext();
    if (context) {
      return {
        t: context.t,
        locale: context.locale,
        setLocale: context.setLocale,
        isLoaded: context.isLoaded
      };
    }
  } catch {
    // Not in provider context, use standalone mode
  }

  // Standalone mode fallback
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/locale=(\w+)/);
    const savedLocale = (match && (match[1] === 'vi' || match[1] === 'en') ? match[1] : 'en') as Locale;

    setLocaleState(savedLocale);
    loadTranslations(savedLocale).then(() => setIsLoaded(true));

    // Listen for locale changes broadcast by LanguageSwitcher
    const handleLocaleChange = () => {
      const newMatch = document.cookie.match(/locale=(\w+)/);
      const newLocale = (newMatch && (newMatch[1] === 'vi' || newMatch[1] === 'en') ? newMatch[1] : 'en') as Locale;
      if (newLocale !== locale) {
        setLocaleState(newLocale);
        loadTranslations(newLocale);
      }
    };

    window.addEventListener('locale-changed', handleLocaleChange);
    return () => window.removeEventListener('locale-changed', handleLocaleChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = getNestedValue(translations[locale], key) as string | undefined;
    if (str) {
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str!.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return str;
    }
    // Fallback to English
    if (locale !== 'en') {
      let fb = getNestedValue(translations['en'], key) as string | undefined;
      if (fb) {
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            fb = fb!.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
          });
        }
        return fb;
      }
    }
    return key;
  };

  const changeLocale = useCallback((newLocale: Locale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setLocaleState(newLocale);
    loadTranslations(newLocale);
    window.dispatchEvent(new Event('locale-changed'));
  }, []);

  return {
    t,
    locale,
    setLocale: changeLocale,
    isLoaded
  };
}

/**
 * Lightweight hook — returns just the current locale string.
 */
export function useLocale() {
  const { locale } = useTranslation();
  return locale;
}

