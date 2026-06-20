'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, MoreVertical, Edit3, Trash2, Globe, Link2, Hash,
  Lock, Globe2,
} from 'lucide-react';

import type { HubLink } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubLinkCardProps {
  link: HubLink;
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
}

// Deterministic gradient per-link (so the same link always gets
// the same colors). Hash on id for stability.
function gradientFor(id: number) {
  const palettes = [
    'from-neon-indigo/30 via-neon-violet/20 to-neon-pink/30',
    'from-neon-cyan/25 via-neon-indigo/20 to-neon-violet/30',
    'from-neon-fuchsia/25 via-neon-pink/20 to-neon-orange/30',
    'from-neon-emerald/25 via-neon-cyan/20 to-neon-blue/30',
    'from-neon-orange/25 via-neon-pink/20 to-neon-violet/30',
    'from-neon-blue/25 via-neon-cyan/20 to-neon-emerald/30',
  ];
  return palettes[id % palettes.length];
}

export default function HubLinkCard({ link, onEdit, onDelete }: HubLinkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const host = (() => {
    try { return new URL(link.url).hostname.replace(/^www\./, ''); }
    catch { return link.url; }
  })();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-darkborder/50 bg-darkcard/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-neon-violet/40 hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.4)]">
      {/* Thumbnail */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/9] overflow-hidden bg-darkbg"
      >
        {link.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnailUrl}
            alt={link.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={cn('h-full w-full bg-gradient-to-br', gradientFor(link.id))} />
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
          {link.faviconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.faviconUrl} alt="" className="h-3 w-3" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
          <span className="max-w-[120px] truncate">{host}</span>
        </div>
        {link.isPublic && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-neon-emerald/20 px-1.5 py-1 text-[10px] font-semibold text-neon-emerald backdrop-blur-md">
            <Globe2 className="h-3 w-3" /> Public
          </div>
        )}
      </a>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1.5 line-clamp-2 font-heading text-sm font-bold text-text-primary transition-colors group-hover:text-neon-violet"
        >
          {link.title}
        </a>
        {link.description && (
          <p className="mb-3 line-clamp-2 text-xs text-text-secondary">
            {link.description}
          </p>
        )}

        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {link.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-0.5 rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-muted"
              >
                <Hash className="h-2.5 w-2.5" />{t}
              </span>
            ))}
            {link.tags.length > 4 && (
              <span className="rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-muted">
                +{link.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Notes preview */}
        {link.notes && (
          <p className="mb-3 line-clamp-2 rounded-lg border border-neon-violet/15 bg-neon-violet/[0.04] p-2 text-[11px] italic text-text-secondary">
            {link.notes}
          </p>
        )}

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-3">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-neon-violet"
          >
            <ExternalLink className="h-3 w-3" /> Mo
          </a>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
              title="Them"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
                  >
                    <button
                      onClick={() => { setMenuOpen(false); onEdit(link); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                    >
                      <Edit3 className="h-3 w-3" /> Sua
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm(`Xoa link "${link.title}"?`)) onDelete(link.id);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" /> Xoa
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </article>
  );
}
