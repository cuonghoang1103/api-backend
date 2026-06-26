'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, FileCode, Image, Film, Music, Archive, File,
  MoreVertical, Hash, Globe2, Share2, Users,
} from 'lucide-react';

import type { HubFile } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubFileCardProps {
  file: HubFile;
  onClick: (file: HubFile) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  // Phase 2 — owner-side: open the share modal for this file.
  onShare?: (file: HubFile) => void;
  // Phase 2 — owner-side: open the manage-shares modal.
  onManageShares?: (file: HubFile) => void;
  // Number of recipients this file has been shared with — drives
  // the count badge next to "Quản lý chia sẻ" in the menu.
  sharedCount?: number;
}

function getFileCategory(mimeType: string): 'image' | 'pdf' | 'video' | 'audio' | 'code' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/xml' ||
    mimeType === 'application/sql' ||
    mimeType.includes('javascript') ||
    mimeType.includes('typescript')
  ) return 'code';
  return 'other';
}

const CATEGORY_ICON = {
  image: Image,
  pdf: FileText,
  video: Film,
  audio: Music,
  code: FileCode,
  other: Archive,
} as const;

const CATEGORY_COLOR = {
  image: 'text-neon-pink',
  pdf: 'text-red-400',
  video: 'text-neon-violet',
  audio: 'text-neon-cyan',
  code: 'text-neon-emerald',
  other: 'text-neon-orange',
} as const;

const GRADIENT = {
  image: 'from-neon-pink/20 via-neon-fuchsia/15 to-neon-violet/20',
  pdf: 'from-red-500/20 via-neon-orange/15 to-neon-pink/20',
  video: 'from-neon-violet/20 via-neon-indigo/15 to-neon-blue/20',
  audio: 'from-neon-cyan/20 via-neon-emerald/15 to-neon-blue/20',
  code: 'from-neon-emerald/20 via-neon-cyan/15 to-neon-blue/20',
  other: 'from-neon-orange/20 via-neon-pink/15 to-neon-fuchsia/20',
} as const;

const STATUS_COLORS: Record<string, string> = {
  unread: 'bg-text-muted/20 text-text-muted',
  learning: 'bg-neon-orange/20 text-neon-orange',
  done: 'bg-neon-emerald/20 text-neon-emerald',
};

const STATUS_LABELS: Record<string, string> = {
  unread: 'Chua doc',
  learning: 'Dang hoc',
  done: 'Hoan thanh',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HubFileCard({ file, onClick, onDelete, onStatusChange, onShare, onManageShares, sharedCount }: HubFileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const category = getFileCategory(file.mimeType);
  const Icon = CATEGORY_ICON[category];
  const color = CATEGORY_COLOR[category];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-darkborder/50 bg-darkcard/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-violet/40 hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.4)]">
      {/* Preview area */}
      <button
        onClick={() => onClick(file)}
        className="relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden bg-darkbg"
      >
        <div className={cn('absolute inset-0 bg-gradient-to-br', GRADIENT[category])} />
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Icon className={cn('h-16 w-16', color)} />
        </motion.div>
        {/* File size badge */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
          {formatBytes(file.size)}
        </div>
        {/* Status badge */}
        <div className={cn(
          'absolute left-2 top-2 rounded-md px-1.5 py-1 text-[10px] font-semibold backdrop-blur-md',
          STATUS_COLORS[file.status],
        )}>
          {STATUS_LABELS[file.status]}
        </div>
        {/* Public badge */}
        {file.isPublic && (
          <div className="absolute right-2 top-2 rounded-md bg-neon-emerald/20 px-1.5 py-1 text-[10px] font-semibold text-neon-emerald backdrop-blur-md">
            <Globe2 className="h-3 w-3 inline" />
          </div>
        )}
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <button
          onClick={() => onClick(file)}
          className="mb-1 line-clamp-2 text-left font-heading text-xs font-bold text-text-primary transition-colors hover:text-neon-violet"
        >
          {file.name}
        </button>

        {/* Tags */}
        {file.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {file.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-0.5 rounded-full border border-darkborder bg-darkbg/60 px-1.5 py-0.5 text-[9px] text-text-muted"
              >
                <Hash className="h-2 w-2" />{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-2">
          <span className="text-[10px] text-text-muted">
            {file.mimeType.split('/')[1]?.toUpperCase() ?? 'FILE'}
          </span>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className="rounded p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl">
                  <button
                    onClick={() => { onStatusChange(file.id, 'unread'); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    Chua doc
                  </button>
                  <button
                    onClick={() => { onStatusChange(file.id, 'learning'); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    Dang hoc
                  </button>
                  <button
                    onClick={() => { onStatusChange(file.id, 'done'); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    Hoan thanh
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (confirm(`Xoa file "${file.name}"?`)) onDelete(file.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Xoa
                  </button>
                  {onShare && (
                    <button
                      onClick={() => { setMenuOpen(false); onShare(file); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                    >
                      <Share2 className="h-3 w-3" /> Chia se
                    </button>
                  )}
                  {onManageShares && (
                    <button
                      onClick={() => { setMenuOpen(false); onManageShares(file); }}
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
        </div>
      </div>
    </article>
  );
}
