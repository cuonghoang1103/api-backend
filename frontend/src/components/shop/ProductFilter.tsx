'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { ProductCategory, PriceRange, SortOption } from '@/types';
import { CATEGORIES, PRICE_RANGES, SORT_OPTIONS } from '@/data/products';

interface ProductFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: ProductCategory | 'all';
  onCategoryChange: (value: ProductCategory | 'all') => void;
  priceRange: PriceRange;
  onPriceRangeChange: (value: PriceRange) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  totalResults: number;
}

const NEON = '#a855f7';
const NEON_CYAN = '#22d3ee';
const NEON_INDIGO = '#818cf8';

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
}: ProductFilterProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFiltersCount = [
    category !== 'all',
    priceRange !== 'all',
    sort !== 'newest',
  ].filter(Boolean).length;

  const clearAll = () => {
    onCategoryChange('all');
    onPriceRangeChange('all');
    onSortChange('newest');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Glassmorphic filter bar */}
      <motion.div
        layout
        className="rounded-2xl p-1"
        style={{
          background: 'rgba(13,11,23,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(168,85,247,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,0.6)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors sm:hidden"
            style={{
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.2)',
              color: NEON,
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: NEON, color: '#fff' }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort — Desktop */}
          <div className="hidden sm:block">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-4 py-2.5 rounded-xl text-sm cursor-pointer focus:outline-none transition-colors appearance-none pr-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(148,163,184,0.9)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a1625', color: '#f8fafc' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category + Price tabs — always visible on desktop, collapsible on mobile */}
        <LayoutGroup>
          <div className="hidden sm:flex gap-2 items-center flex-wrap mt-1 px-1 pb-1">
            <FilterChips category={category} onCategoryChange={onCategoryChange} />
            <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <PriceChips priceRange={priceRange} onPriceRangeChange={onPriceRangeChange} />
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="sm:hidden overflow-hidden px-1 pb-2"
              >
                <div className="flex flex-col gap-3 p-3 rounded-xl mt-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-semibold">Category</p>
                    <FilterChips category={category} onCategoryChange={onCategoryChange} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-semibold">Price</p>
                    <PriceChips priceRange={priceRange} onPriceRangeChange={onPriceRangeChange} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-semibold">Sort</p>
                    <select
                      value={sort}
                      onChange={(e) => onSortChange(e.target.value as SortOption)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm cursor-pointer focus:outline-none transition-colors appearance-none pr-8"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'rgba(148,163,184,0.9)',
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ background: '#1a1625', color: '#f8fafc' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
          <span className="font-bold text-text-primary">{totalResults}</span>{' '}
          {totalResults === 1 ? 'asset found' : 'assets found'}
        </p>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm transition-colors"
            style={{ color: NEON }}
          >
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>
    </div>
  );
}

function FilterChips({ category, onCategoryChange }: { category: string; onCategoryChange: (v: any) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:pb-1">
      {CATEGORIES.map((cat) => {
        const active = category === cat.value;
        return (
          <motion.button
            key={cat.value}
            layout
            onClick={() => onCategoryChange(cat.value as any)}
            className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer max-sm:shrink-0 max-sm:whitespace-nowrap"
            style={{
              background: active ? `${NEON}20` : 'transparent',
              border: `1px solid ${active ? `${NEON}50` : 'rgba(255,255,255,0.06)'}`,
              color: active ? NEON : 'rgba(148,163,184,0.7)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}

function PriceChips({ priceRange, onPriceRangeChange }: { priceRange: string; onPriceRangeChange: (v: any) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:pb-1">
      {PRICE_RANGES.map((range) => {
        const active = priceRange === range.value;
        return (
          <motion.button
            key={range.value}
            layout
            onClick={() => onPriceRangeChange(range.value as any)}
            className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer max-sm:shrink-0 max-sm:whitespace-nowrap"
            style={{
              background: active ? `${NEON_CYAN}15` : 'transparent',
              border: `1px solid ${active ? `${NEON_CYAN}40` : 'rgba(255,255,255,0.06)'}`,
              color: active ? NEON_CYAN : 'rgba(148,163,184,0.7)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {range.label}
          </motion.button>
        );
      })}
    </div>
  );
}
