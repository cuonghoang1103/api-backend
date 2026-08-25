'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { getLandingCopy } from './landingCopy';

export default function LandingHeader() {
  const { locale, setLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const isBackendAuth = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const copy = getLandingCopy(locale);
  const isAuthenticated = mounted && (isBackendAuth || !!session);

  return (
    <header className="landing-header">
      <Link href="/" className="landing-wordmark" aria-label={copy.header.homeLabel}>
        <span className="landing-wordmark-short" aria-hidden>
          CT
        </span>
        <span className="landing-wordmark-full">{copy.header.wordmark}</span>
      </Link>

      <div className="landing-header-actions">
        <button
          type="button"
          className="landing-icon-button"
          onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
          aria-label={copy.header.languageLabel}
          title={copy.header.languageLabel}
        >
          <span aria-hidden>{locale === 'vi' ? 'VI' : 'EN'}</span>
        </button>

        <button
          type="button"
          className="landing-icon-button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? copy.header.lightLabel : copy.header.darkLabel}
          title={theme === 'dark' ? copy.header.lightLabel : copy.header.darkLabel}
        >
          {theme === 'dark' ? <Sun aria-hidden size={16} /> : <Moon aria-hidden size={16} />}
        </button>

        <Link
          href={isAuthenticated ? '/dashboard' : '/login'}
          className="landing-header-cta"
        >
          <span>{isAuthenticated ? copy.header.memberCta : copy.header.guestCta}</span>
          <ArrowUpRight aria-hidden size={15} />
        </Link>
      </div>
    </header>
  );
}
