'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { SnippetTag } from '@/types/exp-hub';

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
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            hasFilters || isOpen
              ? 'bg-accent text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {hasFilters && (
            <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
              {selectedTags.length + (selectedLanguage ? 1 : 0)}
            </span>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Language</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(selectedLanguage === lang ? undefined : lang)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:border-accent'
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
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:border-accent'
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
