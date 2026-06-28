'use client';

/**
 * HubFileMenu - Context menu for files in list view
 * Provides status change, delete, share, and manage shares functionality
 */

import { useState } from 'react';
import { Trash2, Share2, Users, MoreVertical } from 'lucide-react';
import type { HubFile } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubFileMenuProps {
  file: HubFile;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onShare?: (file: HubFile) => void;
  onManageShares?: (file: HubFile) => void;
  sharedCount?: number;
}

const STATUS_OPTIONS = [
  { value: 'unread', label: 'Chua doc', color: 'text-text-muted' },
  { value: 'learning', label: 'Dang hoc', color: 'text-neon-orange' },
  { value: 'done', label: 'Hoan thanh', color: 'text-neon-emerald' },
];

export default function HubFileMenu({
  file,
  onDelete,
  onStatusChange,
  onShare,
  onManageShares,
  sharedCount,
}: HubFileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        title="Them"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl">
            {/* Status options */}
            <div className="border-b border-white/[0.06] px-2 py-1.5">
              <p className="mb-1 px-1 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                Trang thai
              </p>
              <div className="flex flex-col gap-0.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onStatusChange(file.id, opt.value);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                      file.status === opt.value
                        ? `${opt.color} bg-white/5`
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', opt.color.replace('text-', 'bg-'))} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => {
                setMenuOpen(false);
                if (confirm(`Xoa file "${file.name}"?`)) onDelete(file.id);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" /> Xoa
            </button>

            {/* Share */}
            {onShare && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onShare(file);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <Share2 className="h-3 w-3" /> Chia se
              </button>
            )}

            {/* Manage shares */}
            {onManageShares && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onManageShares(file);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <Users className="h-3 w-3" />
                <span className="flex-1">Quan ly chia se</span>
                {typeof sharedCount === 'number' && sharedCount > 0 && (
                  <span className="rounded-full bg-neon-violet/20 px-1.5 py-0.5 text-[10px] font-semibold text-neon-violet">
                    {sharedCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
