'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'unread', label: 'Chua doc', color: 'text-text-muted' },
  { value: 'learning', label: 'Dang hoc', color: 'text-neon-orange' },
  { value: 'done', label: 'Hoan thanh', color: 'text-neon-emerald' },
];

import type { HubLink } from '@/lib/api';

// SSR-safe layout effect
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HubLinkMenuProps {
  link: HubLink;
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
}

/**
 * Action menu rendered via a portal into document.body so it
 * escapes ANY parent overflow / transform / stacking context.
 *
 * Position is computed from `anchorRef.current.getBoundingClientRect()`
 * and recomputed on scroll/resize while open. The menu sits at z-index
 * 9999 with a backdrop at 9998.
 */
export default function HubLinkMenu({
  link,
  open,
  anchorRef,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: HubLinkMenuProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Track mount so we can avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useIsoLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const compute = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Anchor the menu so its right edge aligns with the button's
      // right edge. Width is fixed (w-32 = 128px / w-36 = 144px).
      const width = 144; // matches w-36 below
      setPos({
        top: rect.bottom + 4,
        left: Math.max(8, rect.right - width),
      });
    };
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, anchorRef]);

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
            {/* Status submenu */}
            <div className="border-b border-white/[0.06] px-2 py-1.5">
              <p className="mb-1 px-1 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                Trang thai
              </p>
              <div className="flex flex-col gap-0.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onClose(); onStatusChange(link.id, opt.value); }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                      link.status === opt.value
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
            <button
              onClick={() => { onClose(); onEdit(link); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Edit3 className="h-3 w-3" /> Sua
            </button>
            <button
              onClick={() => {
                onClose();
                if (confirm(`Xoa link "${link.title}"?`)) onDelete(link.id);
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