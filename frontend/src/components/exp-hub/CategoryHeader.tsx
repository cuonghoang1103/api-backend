'use client';

// CategoryHeader — the rich intro card shown at the top of the list column
// when a category (a top group OR a specific technology) is selected. Gives
// each technology a professional "landing" look: icon, name, short intro,
// an official-docs button and a snippet count. Theme-aware.

import { BookOpen } from 'lucide-react';
import type { SnippetCategory } from '@/types/exp-hub';
import { useTranslation } from '@/hooks/useTranslation';
import { CategoryIcon } from './CategoryIcon';

export function CategoryHeader({
  category,
  count,
}: {
  category: SnippetCategory;
  count?: number;
}) {
  const { t } = useTranslation();
  const accent = category.color || 'var(--accent-color)';

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Cover image (optional) or accent wash */}
      {category.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={category.coverImageUrl} alt="" className="h-20 w-full object-cover" />
      ) : (
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      )}

      <div className="flex items-start gap-3 p-3.5">
        <div
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${typeof accent === 'string' && accent.startsWith('#') ? accent + '1a' : 'var(--bg-surface-active)'}` }}
        >
          <CategoryIcon name={category.name} slug={category.slug} icon={category.icon} color={category.color} size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-[var(--text-primary)]">{category.name}</h2>
            {typeof count === 'number' && count > 0 && (
              <span className="rounded-full bg-[var(--bg-surface-active)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                {count} {t('expHub.items')}
              </span>
            )}
          </div>
          {category.description && (
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {category.description}
            </p>
          )}
          {category.docsUrl && (
            <a
              href={category.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-90"
              style={{ borderColor: accent, color: accent }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              {t('expHub.officialDocs')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
