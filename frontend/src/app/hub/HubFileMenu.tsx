'use client';

/**
 * HubFileMenu - Context menu for files in list view
 * Provides view detail, delete, share, and manage shares functionality
 */

import { useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import type { HubFile } from '@/lib/api';
import HubFileActionMenu from '@/components/hub/HubFileActionMenu';

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        title="Them"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {/* Portal menu — anchored to the button, so no ancestor
          overflow / transform can clip or displace it. */}
      <HubFileActionMenu
        file={file}
        open={menuOpen}
        anchorRef={buttonRef}
        onClose={() => setMenuOpen(false)}
        onDelete={onDelete}
        onViewDetail={onClick}
        onShare={onShare}
        onManageShares={onManageShares}
        sharedCount={sharedCount}
      />
    </div>
  );
}
