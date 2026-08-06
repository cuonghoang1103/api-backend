'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, Share2, Users, Info } from 'lucide-react';

import type { HubFile } from '@/lib/api';

// SSR-safe layout effect
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const MENU_WIDTH = 176; // matches w-44 below
const GAP = 4; // space between the trigger button and the menu
const EDGE = 8; // min distance kept from the viewport edges

interface HubFileActionMenuProps {
  file: HubFile;
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  onDelete: (id: number) => void;
  onViewDetail: (file: HubFile) => void;
  onShare?: (file: HubFile) => void;
  onManageShares?: (file: HubFile) => void;
  sharedCount?: number;
}

/**
 * File action menu rendered via a portal into document.body so it
 * escapes ANY parent overflow / transform / stacking context — the
 * hub cards are `overflow-hidden` rounded cards, which used to clip
 * this menu in place (same fix as HubLinkMenu).
 *
 * Position comes from `anchorRef.current.getBoundingClientRect()`,
 * is recomputed on scroll/resize while open, and flips above the
 * button when there isn't room below (last row of the grid).
 */
export default function HubFileActionMenu({
  file,
  open,
  anchorRef,
  onClose,
  onDelete,
  onViewDetail,
  onShare,
  onManageShares,
  sharedCount,
}: HubFileActionMenuProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Track mount so we can avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const compute = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Height is 0 on the very first pass (menu not in the DOM yet);
    // the callback ref below re-runs this once it can be measured.
    const height = menuRef.current?.offsetHeight ?? 0;

    let top = rect.bottom + GAP;
    if (height && top + height > window.innerHeight - EDGE) {
      top = Math.max(EDGE, rect.top - height - GAP);
    }
    // Right edge of the menu aligns with the button, clamped so it
    // never leaves the viewport on narrow screens.
    const left = Math.min(
      Math.max(EDGE, rect.right - MENU_WIDTH),
      Math.max(EDGE, window.innerWidth - MENU_WIDTH - EDGE),
    );
    setPos({ top, left });
  }, [anchorRef]);

  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, compute]);

  // Re-position as soon as the menu node exists, now that we can
  // measure its real height (drives the flip-above behaviour).
  const setMenuNode = useCallback(
    (node: HTMLDivElement | null) => {
      menuRef.current = node;
      if (node) compute();
    },
    [compute],
  );

  // Close on Escape
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
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={setMenuNode}
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
            className="w-44 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { onClose(); onViewDetail(file); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Info className="h-3 w-3" /> Chi tiet
            </button>
            {onShare && (
              <button
                onClick={() => { onClose(); onShare(file); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <Share2 className="h-3 w-3" /> Chia se
              </button>
            )}
            {onManageShares && (
              <button
                onClick={() => { onClose(); onManageShares(file); }}
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
            <button
              onClick={() => {
                onClose();
                if (confirm(`Xoa file "${file.name}"?`)) onDelete(file.id);
              }}
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
