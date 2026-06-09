'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'vi' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translation cache
const translations: Record<Locale, Record<string, any>> = {
  vi: {},
  en: {}
};

async function loadTranslations(locale: Locale): Promise<void> {
  if (Object.keys(translations[locale]).length === 0) {
    try {
      const messages = await import(`../../messages/${locale}.json`);
      translations[locale] = messages.default;
    } catch (e) {
      console.error('Failed to load translations:', e);
    }
  }
}

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let value: any = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  return typeof value === 'string' ? value : undefined;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale;

    const resolved = (savedLocale && (savedLocale === 'vi' || savedLocale === 'en')) ? savedLocale : 'en';
    setLocaleState(resolved);

    loadTranslations(resolved).then(() => setIsLoaded(true));

    const handleChange = () => {
      const updated = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1] as Locale;
      const valid = (updated && (updated === 'vi' || updated === 'en')) ? updated : 'en';
      if (valid !== locale) {
        setLocaleState(valid);
        loadTranslations(valid);
      }
    };

    window.addEventListener('locale-changed', handleChange);
    return () => window.removeEventListener('locale-changed', handleChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    loadTranslations(newLocale);
    window.dispatchEvent(new Event('locale-changed'));
  };

  const t = (key: string): string => {
    const result = getNestedValue(translations[locale], key);
    if (typeof result === 'string') return result;
    if (locale !== 'en') {
      const fallback = getNestedValue(translations['en'], key);
      if (typeof fallback === 'string') return fallback;
    }
    return key;
  };

  // Always render children - don't block rendering while loading
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isLoaded }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    // Fallback when not in provider
    return {
      t: (key: string): string => key,
      locale: 'en' as Locale,
      setLocale: () => {},
      isLoaded: false
    };
  }
  return context;
}

