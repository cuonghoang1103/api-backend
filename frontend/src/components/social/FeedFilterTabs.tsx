'use client';

// FeedFilterTabs — Phase 5 home upgrade.
//
// Three tabs above the feed:
//   • Tất cả (All) — the default "everything public" view, sorted by
//     createdAt DESC. Matches the pre-Phase 5 behaviour exactly.
//   • Đang theo dõi (Following) — only posts from authors the viewer
//     follows. Empty-state when you don't follow anyone yet.
//   • Phổ biền (Popular) — last 7 days, ranked by a composite
//     score (likes×2 + comments + saves). Lives in a different TQ
//     cache slot from the others.
//
// Implementation notes:
//   - We update the URL search-param (?filter=all|following|popular)
//     so the tab survives reload + share-by-link. The page reads
//     it on mount and writes it on tab click.
//   - Tabs use pill styling consistent with the rest of the app
//     (rounded-full, 28px min-height for touch targets).
//   - We animate the active indicator with framer-motion so
//     tab switching feels iOS-quality (no layout shift on the
//     underline).
//   - Accessible: aria-pressed, keyboard arrow nav (Left/Right
//     move between tabs), role="tablist".

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo } from 'react';

export type FeedFilter = 'all' | 'following' | 'popular';

const FILTERS: ReadonlyArray<{ value: FeedFilter; label: string; hint: string }> = [
  { value: 'all', label: 'Tất cả', hint: 'Mọi bài viết, mới nhất' },
  { value: 'following', label: 'Đang theo dõi', hint: 'Bài viết từ người bạn follow' },
  { value: 'popular', label: 'Phổ biến', hint: '7 ngày gần đây, nhiều tương tác nhất' },
];

interface Props {
  active: FeedFilter;
  onChange: (next: FeedFilter) => void;
}

export default function FeedFilterTabs({ active, onChange }: Props) {
  // Keyboard arrow nav — Left/Right move between tabs. We skip the
  // Home/End handlers because there are only 3 tabs so the math is
  // simpler; users get the standard ARIA tablist behaviour.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const idx = FILTERS.findIndex((f) => f.value === active);
      if (idx < 0) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = FILTERS[(idx + 1) % FILTERS.length];
        onChange(next.value);
        // Move focus to the new tab.
        requestAnimationFrame(() => {
          const el = document.querySelector<HTMLButtonElement>(`[data-feed-tab="${next.value}"]`);
          el?.focus();
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = FILTERS[(idx - 1 + FILTERS.length) % FILTERS.length];
        onChange(next.value);
        requestAnimationFrame(() => {
          const el = document.querySelector<HTMLButtonElement>(`[data-feed-tab="${next.value}"]`);
          el?.focus();
        });
      }
    },
    [active, onChange],
  );

  // Memo the active index so framer-motion's `layoutId` only
  // re-runs when the index actually changes.
  const activeIndex = useMemo(() => FILTERS.findIndex((f) => f.value === active), [active]);

  return (
    <div
      role="tablist"
      aria-label="Bộ lọc feed"
      onKeyDown={onKeyDown}
      className="sticky top-[60px] z-20 -mx-3 flex items-center gap-1 border-b border-theme-light bg-theme-glass px-3 py-2 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border sm:bg-[var(--bg-surface)] sm:px-2 sm:py-1"
    >
      {FILTERS.map((f) => {
        const isActive = f.value === active;
        return (
          <button
            key={f.value}
            type="button"
            role="tab"
            data-feed-tab={f.value}
            aria-selected={isActive}
            aria-controls="feed-list"
            aria-label={f.hint}
            onClick={() => onChange(f.value)}
            className={`relative flex min-h-[28px] flex-1 items-center justify-center rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-150 sm:flex-none ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="feed-tab-indicator"
                className="absolute inset-0 rounded-full bg-[var(--bg-surface-active)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <span className="relative whitespace-nowrap">{f.label}</span>
            {activeIndex === FILTERS.findIndex((f2) => f2.value === f.value) && (
              <span className="sr-only"> — đang chọn</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── URL sync helper ───────────────────────────────────────
// The page owns these — but they're small enough to live next
// to the component that renders them so the URL<->state logic
// stays in one place. We re-export them so page.tsx can use
// the same parsing/serialising helpers.
export function parseFeedFilterFromUrl(search: string): FeedFilter {
  const params = new URLSearchParams(search);
  const raw = params.get('f') ?? 'all';
  if (raw === 'following' || raw === 'popular' || raw === 'all') return raw;
  return 'all';
}

export function writeFeedFilterToUrl(filter: FeedFilter): string {
  if (filter === 'all') return ''; // don't pollute URL with default
  const params = new URLSearchParams();
  params.set('f', filter);
  return `?${params.toString()}`;
}

// Re-export for use in the page (so it can `setSearchParams` with
// the right value).
export const FEED_FILTER_URL_PARAM = 'f';
