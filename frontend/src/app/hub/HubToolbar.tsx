'use client';

import { Search, LayoutGrid, List, Plus, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubToolbarProps {
  searchInput: string;
  onSearchInput: (v: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (m: 'grid' | 'list') => void;
  onAddLink: () => void;
  total: number;
  loading: boolean;
  folderName: string;
}

export default function HubToolbar({
  searchInput, onSearchInput, viewMode, onViewModeChange,
  onAddLink, total, loading, folderName,
}: HubToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-heading text-xl font-bold text-text-primary">
          {folderName}
        </h2>
        <p className="text-xs text-text-muted">
          {loading
            ? 'Dang tai...'
            : total === 0
              ? 'Chua co link nao'
              : `${total} link`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={searchInput}
            onChange={(e) => onSearchInput(e.target.value)}
            placeholder="Tim theo tieu de, ghi chu, tag..."
            className="w-56 rounded-xl border border-darkborder bg-darkcard/60 py-2 pl-9 pr-8 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-1 focus:ring-neon-violet/30 sm:w-72"
          />
          {searchInput && (
            <button
              onClick={() => onSearchInput('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary"
              aria-label="Xoa tim kiem"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="inline-flex overflow-hidden rounded-xl border border-darkborder bg-darkcard/60">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'flex h-9 w-9 items-center justify-center transition-colors',
              viewMode === 'grid'
                ? 'bg-neon-violet/20 text-neon-violet'
                : 'text-text-muted hover:text-text-primary',
            )}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'flex h-9 w-9 items-center justify-center transition-colors',
              viewMode === 'list'
                ? 'bg-neon-violet/20 text-neon-violet'
                : 'text-text-muted hover:text-text-primary',
            )}
            title="List view"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Add */}
        <button
          onClick={onAddLink}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Them link</span>
        </button>
      </div>
    </div>
  );
}
