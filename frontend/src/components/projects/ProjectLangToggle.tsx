'use client';

/**
 * Segmented VI | EN switch for the projects module.
 *
 * Not a second language system: it writes the same `locale` cookie and fires
 * the same `locale-changed` event as the navbar's LanguageSwitcher, so the two
 * always agree and either one updates the whole page instantly. It exists
 * because the navbar control is a dropdown two clicks deep, and a case-study
 * that ships in two languages should say so where the reader is looking.
 *
 * Both labels are always visible (rather than a single "switch to X" button)
 * so the current language is readable at a glance instead of inferred.
 */
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useProjectLang } from '@/lib/projectI18n';

interface Props {
  /** `compact` drops the icon and tightens padding for dense toolbars. */
  variant?: 'default' | 'compact';
  className?: string;
}

const OPTIONS: Array<{ code: 'vi' | 'en'; label: string; title: string }> = [
  { code: 'vi', label: 'VI', title: 'Tiếng Việt' },
  { code: 'en', label: 'EN', title: 'English' },
];

export default function ProjectLangToggle({ variant = 'default', className = '' }: Props) {
  const { lang, setLang, L } = useProjectLang();
  const compact = variant === 'compact';

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-darkborder bg-darkcard/80 backdrop-blur-sm ${compact ? 'p-0.5' : 'p-1'} ${className}`}
      role="group"
      aria-label={L('Chuyển ngôn ngữ', 'Switch language')}
    >
      {!compact && (
        <Languages className="w-4 h-4 text-text-muted ml-1.5 mr-0.5 shrink-0" aria-hidden />
      )}
      {OPTIONS.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            title={opt.title}
            aria-pressed={active}
            className={`relative ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg font-semibold tracking-wide transition-colors ${
              active ? 'text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {active && (
              // Shared layoutId slides the pill between the two options
              // instead of cross-fading, which reads as one control rather
              // than two independent buttons.
              <motion.span
                layoutId="project-lang-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-lg bg-neon-violet"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
