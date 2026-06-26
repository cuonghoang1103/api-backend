'use client';

/**
 * HubFolderMenu — action menu for a folder row, rendered via a
 * React Portal into `document.body` so it escapes any parent
 * overflow / stacking / clipping context.
 *
 * Why a portal? The folder sidebar sits inside `<aside>` which
 * can be clipped by the Hub layout's `overflow: hidden` on
 * certain viewports. Rendering inline would also cause the menu
 * to be hidden under the next sibling (the "Shared with me"
 * widget) when the sidebar is taller than the viewport.
 *
 * Pattern mirrors HubLinkMenu so both menus feel identical to
 * the user — same z-index (9999/9998), same portal target, same
 * backdrop behaviour, same Escape-to-close.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, FolderPlus, Trash2, Share2 } from 'lucide-react';

// SSR-safe layout effect (no window during SSR).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HubFolderMenuProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  onRename: () => void;
  onCreateSubfolder: () => void;
  onDelete: () => void;
  // Phase 2 — owner-side: open the share modal for this folder.
  // Optional so older callers (or tests) can omit it.
  onShare?: () => void;
}

export default function HubFolderMenu({
  open, anchorRef, onClose, onRename, onCreateSubfolder, onDelete, onShare,
}: HubFolderMenuProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const compute = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Anchor so the menu's right edge aligns with the button's
      // right edge. Width = 144px (matches w-36 below). 8px gap
      // below the button.
      const width = 144;
      setPos({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - width),
      });
    };
    compute();
    // Recompute on scroll/resize while open so the menu follows
    // the anchor if the user scrolls the page.
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, anchorRef]);

  // Close on Escape — matches HubLinkMenu behaviour.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <>
          {/* Backdrop at z-index 9998 — sits above page content
              but below the menu, so clicks outside close it. */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
            }}
            className="w-40 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { onClose(); onRename(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Edit3 className="h-3 w-3" /> Doi ten
            </button>
            <button
              onClick={() => { onClose(); onCreateSubfolder(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <FolderPlus className="h-3 w-3" /> Them thu muc con
            </button>
            {onShare && (
              <button
                onClick={() => { onClose(); onShare(); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <Share2 className="h-3 w-3" /> Chia se
              </button>
            )}
            <button
              onClick={() => { onClose(); onDelete(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" /> Xoa
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}