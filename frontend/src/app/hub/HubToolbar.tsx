'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, LayoutGrid, List, Plus, X, ChevronDown, Columns3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list' | 'kanban';
export type StatusFilter = 'all' | 'unread' | 'learning' | 'done';

interface HubToolbarProps {
  searchInput: string;
  onSearchInput: (v: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (s: StatusFilter) => void;
  onAddLink: () => void;
  onAddFile: () => void;
  totalLinks: number;
  totalFiles: number;
  loading: boolean;
  folderName: string;
  total: number;
}

const VIEW_OPTIONS: { id: ViewMode; icon: React.ElementType; label: string }[] = [
  { id: 'grid', icon: LayoutGrid, label: 'Grid' },
  { id: 'list', icon: List, label: 'List' },
  { id: 'kanban', icon: Columns3, label: 'Kanban' },
];

const STATUS_OPTIONS: { id: StatusFilter; label: string; color: string }[] = [
  { id: 'all', label: 'Tat ca', color: 'text-text-secondary' },
  { id: 'unread', label: 'Chua doc', color: 'text-text-muted' },
  { id: 'learning', label: 'Dang hoc', color: 'text-neon-orange' },
  { id: 'done', label: 'Hoan thanh', color: 'text-neon-emerald' },
];

export default function HubToolbar({
  searchInput, onSearchInput, viewMode, onViewModeChange,
  statusFilter, onStatusFilterChange,
  onAddLink, onAddFile,
  totalLinks, totalFiles, loading, folderName, total,
}: HubToolbarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
              ? 'Chua co nao'
              : `${totalLinks} link${totalLinks !== 1 ? '' : ''}, ${totalFiles} file${totalFiles !== 1 ? '' : ''}`}
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

        {/* Status filter */}
        <div className="inline-flex overflow-hidden rounded-xl border border-darkborder bg-darkcard/60">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onStatusFilterChange(opt.id)}
              className={cn(
                'flex h-9 px-2.5 items-center justify-center text-xs font-medium transition-colors',
                statusFilter === opt.id
                  ? `bg-neon-violet/20 ${opt.color}`
                  : 'text-text-muted hover:text-text-primary',
                opt.id !== 'all' && 'border-l border-darkborder/50',
              )}
              title={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="inline-flex overflow-hidden rounded-xl border border-darkborder bg-darkcard/60">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onViewModeChange(opt.id)}
              className={cn(
                'flex h-9 w-9 items-center justify-center transition-colors',
                viewMode === opt.id
                  ? 'bg-neon-violet/20 text-neon-violet'
                  : 'text-text-muted hover:text-text-primary',
                opt.id !== 'grid' && 'border-l border-darkborder/50',
              )}
              title={`${opt.label} view`}
              aria-label={`${opt.label} view`}
            >
              <opt.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Add button with dropdown */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setAddMenuOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Them moi</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {addMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
              >
                <button
                  onClick={() => { setAddMenuOpen(false); onAddLink(); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <Plus className="h-4 w-4 text-neon-indigo" />
                  Them link moi
                </button>
                <button
                  onClick={() => { setAddMenuOpen(false); onAddFile(); }}
                  className="flex w-full items-center gap-3 border-t border-white/[0.06] px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <Plus className="h-4 w-4 text-neon-emerald" />
                  Upload file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
