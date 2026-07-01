'use client';

// FeedTypeTabs — content-type navigation for the home feed.
//
// Primary tab row (sits above the secondary all/following/popular
// FeedFilterTabs):
//   • Tất cả (all)   — every post type, newest first (unchanged feed).
//   • Bài viết (post) — text / images / polls.
//   • Video           — opens the TikTok-style /feed/video experience.
//   • File            — shared files / source (download list).
//
// Mirrors FeedFilterTabs for visual + a11y consistency:
//   - URL search-param `?tab=` so the choice survives reload + share.
//   - role="tablist", aria-selected, Left/Right arrow nav.
//   - framer-motion animated active pill (shared layoutId).
// Each tab shows a count badge fed from GET /social/posts/counts.

import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { FileText, Video, Paperclip, LayoutGrid } from 'lucide-react';
import type { FeedCounts } from '@/hooks/useSocialQueries';

export type FeedType = 'all' | 'post' | 'video' | 'file';

/** Map a UI tab to the backend `type` query value (undefined = all). */
export function feedTypeToParam(t: FeedType): 'POST' | 'VIDEO' | 'FILE' | undefined {
  if (t === 'post') return 'POST';
  if (t === 'video') return 'VIDEO';
  if (t === 'file') return 'FILE';
  return undefined;
}

const TABS: ReadonlyArray<{ value: FeedType; label: string; Icon: typeof FileText; countKey: keyof FeedCounts }> = [
  { value: 'all', label: 'Tất cả', Icon: LayoutGrid, countKey: 'all' },
  { value: 'post', label: 'Bài viết', Icon: FileText, countKey: 'post' },
  { value: 'video', label: 'Video', Icon: Video, countKey: 'video' },
  { value: 'file', label: 'File', Icon: Paperclip, countKey: 'file' },
];

interface Props {
  active: FeedType;
  onChange: (next: FeedType) => void;
  counts?: FeedCounts;
}

export default function FeedTypeTabs({ active, onChange, counts }: Props) {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const idx = TABS.findIndex((t) => t.value === active);
      if (idx < 0) return;
      let nextIdx: number | null = null;
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % TABS.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + TABS.length) % TABS.length;
      if (nextIdx === null) return;
      e.preventDefault();
      const next = TABS[nextIdx];
      onChange(next.value);
      requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(`[data-feed-type-tab="${next.value}"]`)?.focus();
      });
    },
    [active, onChange],
  );

  const fmtCount = useMemo(
    () => (n?: number) => (n == null ? '' : n > 999 ? `${Math.floor(n / 1000)}k` : String(n)),
    [],
  );

  return (
    <div
      role="tablist"
      aria-label="Loại nội dung"
      onKeyDown={onKeyDown}
      className="flex items-center gap-1 overflow-x-auto"
    >
      {TABS.map(({ value, label, Icon, countKey }) => {
        const isActive = value === active;
        const count = counts?.[countKey];
        return (
          <button
            key={value}
            type="button"
            role="tab"
            data-feed-type-tab={value}
            aria-selected={isActive}
            aria-controls="feed-list"
            onClick={() => onChange(value)}
            className={`relative flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
              isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="feed-type-indicator"
                className="absolute inset-0 rounded-full bg-neon-violet/20 ring-1 ring-neon-violet/40"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <Icon size={15} className="relative shrink-0" />
            <span className="relative whitespace-nowrap">{label}</span>
            {count != null && count > 0 && (
              <span
                className={`relative rounded-full px-1.5 text-[11px] tabular-nums ${
                  isActive ? 'bg-[var(--bg-surface-active)] text-text-primary' : 'bg-[var(--bg-surface)] text-text-secondary'
                }`}
              >
                {fmtCount(count)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── URL sync helpers (the page owns the state) ────────────────
export const FEED_TYPE_URL_PARAM = 'tab';

export function parseFeedTypeFromUrl(search: string): FeedType {
  const raw = new URLSearchParams(search).get(FEED_TYPE_URL_PARAM);
  if (raw === 'post' || raw === 'video' || raw === 'file' || raw === 'all') return raw;
  return 'all';
}

export function writeFeedTypeToUrl(t: FeedType): string {
  if (t === 'all') return ''; // keep the default tab out of the URL
  const params = new URLSearchParams();
  params.set(FEED_TYPE_URL_PARAM, t);
  return `?${params.toString()}`;
}
