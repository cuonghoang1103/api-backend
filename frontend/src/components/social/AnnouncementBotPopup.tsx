'use client';

/**
 * AnnouncementBotPopup (added 2026-07-09)
 * ========================================
 *
 * The realtime "robot flies in from the top" overlay. When an admin
 * posts a new announcement, `useNotificationSocket` calls
 * `useAnnouncementPopup.show(...)`, and this component (mounted once in
 * the root layout) animates the AI robot avatar down from off-screen to
 * screen-centre with a speech bubble.
 *
 * Deliberately SEPARATE from FloatingAIAssistant: that idle bubble is
 * hidden on most mobile pages / admin / creator, but an admin
 * announcement must reach EVERY user on EVERY page — so this overlay is
 * its own top-level element at a very high z-index.
 *
 * Behaviour:
 *   - Fly-in from `y: -60vh` → `y: 0` (fade + slide). Reduced-motion /
 *     touch users get a plain fade (no fly-in).
 *   - Auto-dismisses after 3s.
 *   - Clicking navigates to the announcement then clears.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnnouncementPopup } from '@/store/useAnnouncementPopup';
import { usePrefersReducedMotion } from '@/hooks/useIsTouch';

const AUTO_DISMISS_MS = 3000;

export default function AnnouncementBotPopup() {
  const router = useRouter();
  const popup = useAnnouncementPopup((s) => s.popup);
  const clear = useAnnouncementPopup((s) => s.clear);
  const reduceMotion = usePrefersReducedMotion();

  // Auto-dismiss after 3 seconds. Re-arms whenever a new popup arrives.
  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => clear(), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [popup, clear]);

  const handleClick = () => {
    const href = popup?.href;
    clear();
    if (href) router.push(href);
  };

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          key="announcement-bot"
          className="fixed left-1/2 top-1/3 z-[300] -translate-x-1/2 cursor-pointer select-none"
          initial={reduceMotion ? { opacity: 0 } : { y: '-60vh', opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: '-40vh', opacity: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { type: 'spring', stiffness: 220, damping: 18 }
          }
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClick();
          }}
          aria-label="Xem thông báo mới từ admin"
        >
          <div className="flex flex-col items-center gap-3">
            {/* Speech bubble */}
            <div
              className="relative max-w-[min(78vw,320px)] rounded-2xl border px-4 py-3 text-center text-sm font-medium shadow-2xl"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.35)',
              }}
            >
              {popup.message}
              {/* Little tail pointing down toward the robot */}
              <div
                className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              />
            </div>

            {/* Robot avatar */}
            <motion.div
              className="relative"
              animate={
                reduceMotion ? undefined : { y: [0, -6, 0] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(139,92,246,0.55), transparent 70%)',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/robot-avatar.png"
                alt="Trợ lý AI"
                width={112}
                height={112}
                className="relative h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-2xl"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
