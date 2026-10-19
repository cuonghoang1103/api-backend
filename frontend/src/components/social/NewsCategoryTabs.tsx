'use client';

/**
 * NewsCategoryTabs — the AI news-network filter on the home feed.
 *
 * A horizontal, scrollable row of chips: "Tất cả / All" (default, clears the
 * filter) followed by one chip per bot category (Claude · Codex · Gemini ·
 * Antigravity · Tin công nghệ · So sánh AI). Each category chip carries the
 * owning bot's little animated avatar. Selecting a chip tells the feed to
 * refetch with `?newsCategory=<key>`; "Tất cả" passes null (no param).
 *
 * The chip ROW scrolls horizontally on narrow screens — the page itself never
 * gets a horizontal scrollbar. Active chip is highlighted in brand purple
 * (#4f5bd5) / the category accent. Light + dark safe via theme tokens.
 */

import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/botRegistry';

interface NewsCategoryTabsProps {
  /** Active category, or null for "Tất cả". */
  active: NewsCategory | null;
  /** Fired with the new category (null = "Tất cả"). */
  onChange: (next: NewsCategory | null) => void;
}

const BRAND_PURPLE = '#4f5bd5';

export default function NewsCategoryTabs({ active, onChange }: NewsCategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Lọc bản tin AI theo chủ đề"
      className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* "Tất cả / All" — clears the filter. */}
      <Chip
        selected={active == null}
        label="Tất cả"
        ariaLabel="Hiện tất cả bài viết (người dùng và bot)"
        accent={BRAND_PURPLE}
        onClick={() => onChange(null)}
        icon={
          <span aria-hidden className="text-[13px] leading-none">🗂️</span>
        }
      />

      {NEWS_CATEGORIES.map((cat) => {
        const selected = active === cat.key;
        return (
          <Chip
            key={cat.key}
            selected={selected}
            label={cat.label}
            ariaLabel={`Lọc theo chủ đề ${cat.label}`}
            accent={cat.accent}
            onClick={() => onChange(cat.key)}
            icon={
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cat.avatar}
                alt=""
                aria-hidden
                width={18}
                height={18}
                className="h-[18px] w-[18px] rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            }
          />
        );
      })}
    </div>
  );
}

function Chip({
  selected,
  label,
  ariaLabel,
  accent,
  icon,
  onClick,
}: {
  selected: boolean;
  label: string;
  ariaLabel: string;
  accent: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`group inline-flex min-h-[30px] shrink-0 items-center gap-1.5 whitespace-nowrap
                  rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors
                  ${selected
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary bg-theme-surface'}`}
      style={
        selected
          ? {
              background: accent,
              boxShadow: `0 2px 10px ${hexWithAlpha(accent, 0.35)}`,
            }
          : { boxShadow: 'inset 0 0 0 1px var(--border, rgba(148,163,184,0.25))' }
      }
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/** "#rrggbb" + alpha → "rgba(r,g,b,a)". Falls back silently on bad input. */
function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return `rgba(79,91,213,${alpha})`;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
