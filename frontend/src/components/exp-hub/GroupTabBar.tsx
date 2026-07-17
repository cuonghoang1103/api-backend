'use client';

// GroupTabBar — the professional horizontal navigation of TOP-LEVEL groups
// (Backend / Frontend / Database / …) that sits under the EXP_Hub header.
// Selecting a group scopes the left folder tree + list to that group's
// subtree. An "Tất cả" tab clears the scope. Horizontally scrollable on
// mobile. Theme-aware (light/dark via CSS vars + inline accent color).

import { useRef } from 'react';
import { LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SnippetCategory } from '@/types/exp-hub';
import { useTranslation } from '@/hooks/useTranslation';
import { CategoryIcon } from './CategoryIcon';

interface GroupTabBarProps {
  groups: SnippetCategory[];            // root categories (parentId === null)
  activeGroupId?: number;               // undefined = "Tất cả"
  onSelectGroup: (group: SnippetCategory | null) => void;
}

// Count every snippet under a group (itself + all descendants) from the
// nested `_count.snippets` the API already returns per node.
function subtreeCount(node: SnippetCategory): number {
  let n = node._count?.snippets ?? 0;
  for (const c of node.children ?? []) n += subtreeCount(c);
  return n;
}

export function GroupTabBar({ groups, activeGroupId, onSelectGroup }: GroupTabBarProps) {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center gap-1 border-b border-[var(--border-color)] bg-[var(--bg-card)]/70 px-2 backdrop-blur">
      {/* left nudge (desktop, when overflowing) */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        className="hidden shrink-0 rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] sm:block"
        aria-label={t('expHub.scrollLeft')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollerRef}
        className="flex flex-1 items-center gap-1.5 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* "Tất cả" */}
        <button
          type="button"
          onClick={() => onSelectGroup(null)}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeGroupId === undefined
              ? 'bg-[var(--accent-color)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          {t('expHub.all')}
        </button>

        {groups.map((g) => {
          const active = g.id === activeGroupId;
          const accent = g.color || 'var(--accent-color)';
          const count = subtreeCount(g);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelectGroup(g)}
              title={g.description || g.name}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-white shadow-sm'
                  : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
              }`}
              style={
                active
                  ? { background: accent, borderColor: accent }
                  : undefined
              }
            >
              <CategoryIcon name={g.name} slug={g.slug} icon={g.icon} color={active ? '#ffffff' : g.color} size={18} />
              <span className="whitespace-nowrap">{g.name}</span>
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                    active ? 'bg-white/25 text-white' : 'bg-[var(--bg-surface-active)] text-[var(--text-muted)]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => nudge(1)}
        className="hidden shrink-0 rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] sm:block"
        aria-label={t('expHub.scrollRight')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
