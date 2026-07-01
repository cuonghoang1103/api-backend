'use client';

import { useRef, useState } from 'react';
import { ExternalLink, MoreVertical, Globe, Hash, Globe2 } from 'lucide-react';

import type { HubLink } from '@/lib/api';
import { cn } from '@/lib/utils';
import HubLinkMenu from './HubLinkMenu';

interface HubLinkRowProps {
  link: HubLink;
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
  onViewDetail: (link: HubLink) => void;
  onShare?: (link: HubLink) => void;
  onManageShares?: (link: HubLink) => void;
  sharedCount?: number;
}

function gradientFor(id: number) {
  const palettes = [
    'from-neon-indigo/40 to-neon-violet/40',
    'from-neon-cyan/40 to-neon-indigo/40',
    'from-neon-fuchsia/40 to-neon-pink/40',
    'from-neon-emerald/40 to-neon-cyan/40',
    'from-neon-orange/40 to-neon-pink/40',
    'from-neon-blue/40 to-neon-cyan/40',
  ];
  return palettes[id % palettes.length];
}

export default function HubLinkRow({ link, onEdit, onDelete, onViewDetail, onShare, onManageShares, sharedCount }: HubLinkRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const host = (() => {
    try { return new URL(link.url).hostname.replace(/^www\./, ''); }
    catch { return link.url; }
  })();

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-darkborder/50 bg-darkcard/60 p-3 backdrop-blur-xl transition-all hover:border-neon-violet/40 hover:bg-darkcard/80">
      {/* Thumbnail */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br',
          link.thumbnailUrl ? '' : gradientFor(link.id),
        )}
      >
        {link.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnailUrl}
            alt={link.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {link.faviconUrl && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md border border-darkborder bg-darkcard/90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.faviconUrl} alt="" className="h-3 w-3" />
          </div>
        )}
      </a>

      {/* Body */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-heading text-sm font-bold text-text-primary transition-colors group-hover:text-neon-violet"
            >
              {link.title}
            </a>
            {link.isPublic && (
              <Globe2 className="h-3 w-3 shrink-0 text-neon-emerald" aria-label="Public" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span className="truncate">{host}</span>
            </span>
            {link.tags.length > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1 truncate">
                  {link.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-darkbg/60 px-1.5 py-0.5">
                      #{t}
                    </span>
                  ))}
                  {link.tags.length > 3 && <span>+{link.tags.length - 3}</span>}
                </span>
              </>
            )}
          </div>
        </div>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-neon-violet/15 hover:text-neon-violet sm:flex"
          title="Mo trong tab moi"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            title="Them"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
          <HubLinkMenu
            link={link}
            open={menuOpen}
            anchorRef={buttonRef}
            onClose={() => setMenuOpen(false)}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
            onShare={onShare}
            onManageShares={onManageShares}
            sharedCount={sharedCount}
          />
        </div>
      </div>
    </div>
  );
}
