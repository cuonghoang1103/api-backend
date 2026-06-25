'use client';

// FeedHasNewBanner — Phase 5 home upgrade.
//
// The little "X bài viết mới — Xem" pill that drops down at the
// top of the feed when the socket emits feed:has-new. Sits inside
// the feed list (not sticky) so it scrolls with the content; the
// drop-in animation still gets attention even mid-scroll.
//
// The page calls onAck() when the user clicks. We optimistically
// hide immediately so the click feels instant; the page then
// fetches + prepends the new posts and the banner stays hidden
// until the next feed:has-new ping.

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface Props {
  count: number;
  onAck: () => void;
}

export default function FeedHasNewBanner({ count, onAck }: Props) {
  // AnimatePresence lets the banner fade-in / fade-out cleanly
  // when the count goes 0 → N → 0. We key on count so each new
  // burst re-mounts and re-runs the drop animation.
  return (
    <div className="pointer-events-none sticky top-[112px] z-20 mb-4 flex justify-center sm:top-[60px]">
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            key={`feed-new-${count}`}
            type="button"
            onClick={onAck}
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 460, damping: 28 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-teal-500/30 bg-[#0c0f14]/90 px-4 py-2 text-[13px] font-medium text-teal-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md hover:bg-[#0c0f14]"
            aria-label={`${count} bài viết mới — nhấn để xem`}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>
              {count} bài viết mới — <span className="underline underline-offset-2">Xem</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
