'use client';

/**
 * HubFileMenu - Context menu for files in list view
 * Provides view detail, delete, share, and manage shares functionality
 */

import { useState, useEffect, useRef } from 'react';
import { Trash2, Share2, Users, MoreVertical, Info } from 'lucide-react';
import type { HubFile } from '@/lib/api';

interface HubFileMenuProps {
  file: HubFile;
  onDelete: (id: number) => void;
  onClick: (file: HubFile) => void;
  onShare?: (file: HubFile) => void;
  onManageShares?: (file: HubFile) => void;
  sharedCount?: number;
}

export default function HubFileMenu({
  file,
  onDelete,
  onClick,
  onShare,
  onManageShares,
  sharedCount,
}: HubFileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        title="Them"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {menuOpen && (
        <div className="fixed z-[9999] mt-1 w-48 overflow-visible">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setMenuOpen(false)}
          />

          <div className="overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/98 shadow-2xl backdrop-blur-xl">
            {/* View detail / open */}
            <button
              onClick={() => {
                setMenuOpen(false);
                onClick(file);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Info className="h-3 w-3" /> Chi tiet
            </button>

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
        </div>
      )}
    </div>
  );
}
