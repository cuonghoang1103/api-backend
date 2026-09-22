'use client';

import { Search, X, ChevronDown } from 'lucide-react';
import type { PriceRange, SortOption } from '@/types';
import { CATEGORIES, PRICE_RANGES, SORT_OPTIONS } from '@/data/products';

interface CategoryOption { value: string; label: string }

interface ProductFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (value: PriceRange) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  totalResults: number;
  /** Dynamic (admin-managed) categories. Falls back to the static list. */
  categories?: CategoryOption[];
  /**
   * Các khoảng giá CÓ ÍT NHẤT MỘT sản phẩm. Khoảng rỗng không thành nút — cùng
   * lý do với danh mục rỗng ở `app/shop/page.tsx`: nút dẫn tới trang trắng
   * trông như web hỏng. Còn ≤ 1 khoảng thì bỏ hẳn hàng lọc giá (lọc một
   * khoảng duy nhất không lọc được gì).
   */
  availablePriceRanges?: PriceRange[];
}

/** Sắp xếp mặc định — phải khớp `useState` trong `app/shop/page.tsx`. */
export const DEFAULT_SORT: SortOption = 'featured';

export default function ProductFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sort,
  onSortChange,
  totalResults,
  categories,
  availablePriceRanges,
}: ProductFilterProps) {
  const categoryOptions: CategoryOption[] = categories && categories.length > 0
    ? categories
    : (CATEGORIES as unknown as CategoryOption[]);

  const priceOptions = PRICE_RANGES.filter(
    (r) => r.value === 'all' || !availablePriceRanges || availablePriceRanges.includes(r.value),
  );
  const showPrice = priceOptions.length > 2 || priceRange !== 'all';
  const showCategories = categoryOptions.length > 2 || category !== 'all';

  // ⚠️ Trước 22/09/2026 bộ đếm so `sort !== 'newest'` trong khi mặc định của
  // trang là 'featured' ⇒ vừa mở trang đã hiện "Clear all (1)" dù người dùng
  // chưa chọn gì.
  const activeFiltersCount = [
    category !== 'all',
    priceRange !== 'all',
    sort !== DEFAULT_SORT,
    search.trim() !== '',
  ].filter(Boolean).length;

  const clearAll = () => {
    onCategoryChange('all');
    onPriceRangeChange('all');
    onSortChange(DEFAULT_SORT);
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-2 sm:p-2.5 space-y-2.5"
        style={{
          background: 'rgba(13,11,23,0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(168,85,247,0.14)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        }}
      >
        <div className="flex gap-2 items-stretch">
          {/* Search */}
          <label className="relative flex-1 min-w-0">
            <span className="sr-only">Tìm sản phẩm</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              inputMode="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm gói, key, tính năng…"
              // text-base trên điện thoại: iOS Safari tự PHÓNG TO trang khi ô
              // nhập có cỡ chữ < 16px, rồi không thu lại.
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-base sm:text-sm text-text-primary placeholder:text-text-muted
                         bg-white/[0.04] border border-white/[0.07] focus:outline-none focus:border-neon-violet/50
                         focus:bg-white/[0.06] transition-colors [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Xoá từ khoá"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </label>

          {/* Sort */}
          <label className="relative shrink-0">
            <span className="sr-only">Sắp xếp</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-full appearance-none rounded-xl pl-3.5 pr-9 py-2.5 text-base sm:text-sm cursor-pointer
                         text-text-secondary bg-white/[0.04] border border-white/[0.07]
                         focus:outline-none focus:border-neon-indigo/50 transition-colors max-w-[9.5rem] sm:max-w-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a1625', color: '#f8fafc' }}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </label>
        </div>

        {(showCategories || showPrice) && (
          // Một hàng cuộn ngang trên điện thoại (không gói thành panel ẩn: chỉ
          // có vài nút, giấu sau nút "Bộ lọc" là bắt người dùng bấm thêm một
          // lần cho không), xuống dòng bình thường từ sm trở lên.
          <div className="-mx-1 px-1 flex gap-1.5 items-center overflow-x-auto sm:flex-wrap sm:overflow-visible
                          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showCategories && categoryOptions.map((c) => (
              <Chip
                key={`c-${c.value}`}
                active={category === c.value}
                tone="violet"
                onClick={() => onCategoryChange(c.value)}
              >
                {c.label}
              </Chip>
            ))}
            {showCategories && showPrice && (
              <span aria-hidden className="shrink-0 w-px h-4 mx-1 bg-white/10" />
            )}
            {showPrice && priceOptions.map((r) => (
              <Chip
                key={`p-${r.value}`}
                active={priceRange === r.value}
                tone="cyan"
                onClick={() => onPriceRangeChange(r.value)}
              >
                {r.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1 min-h-[1.5rem]">
        <p className="text-sm text-text-muted" aria-live="polite">
          <span className="font-semibold text-text-primary tabular-nums">{totalResults}</span> sản phẩm
        </p>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-sm text-neon-violet hover:opacity-80 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
            Xoá bộ lọc ({activeFiltersCount})
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: 'violet' | 'cyan';
  onClick: () => void;
  children: React.ReactNode;
}) {
  const on = tone === 'violet'
    ? 'bg-neon-violet/15 border-neon-violet/45 text-violet-300'
    : 'bg-cyan-400/10 border-cyan-400/40 text-cyan-300';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-colors
        ${active ? on : 'border-white/[0.07] text-text-secondary hover:text-text-primary hover:border-white/15'}`}
    >
      {children}
    </button>
  );
}
