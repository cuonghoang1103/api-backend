'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { SnippetTag } from '@/types/exp-hub';
import { useTranslation } from '@/hooks/useTranslation';

interface FilterPanelProps {
  tags: SnippetTag[];
  languages?: string[];
  selectedTags: number[];
  selectedLanguage?: string;
  onTagsChange: (tagIds: number[]) => void;
  onLanguageChange: (language: string | undefined) => void;
  onClear: () => void;
  className?: string;
}

export function FilterPanel({
  tags,
  languages = [],
  selectedTags,
  selectedLanguage,
  onTagsChange,
  onLanguageChange,
  onClear,
  className = '',
}: FilterPanelProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const hasFilters = selectedTags.length > 0 || selectedLanguage;

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
            hasFilters || isOpen
              ? 'bg-violet-500/20 border-violet-400/50 text-violet-600 dark:text-violet-200'
              : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>{t('expHub.filter')}</span>
          {hasFilters && (
            <span className="px-1.5 py-0.5 bg-violet-500/25 rounded text-xs">
              {selectedTags.length + (selectedLanguage ? 1 : 0)}
            </span>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-3.5 h-3.5" />
            {t('expHub.clearFilter')}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]">
          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">{t('expHub.language')}</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(selectedLanguage === lang ? undefined : lang)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-violet-500/20 text-violet-600 dark:text-violet-200 border-violet-400/50'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-violet-400/50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">{t('expHub.tags')}</h4>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-violet-500/20 text-violet-600 dark:text-violet-200 border-violet-400/50'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-violet-400/50'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
