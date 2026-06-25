'use client';

// useFeedHasNew — Phase 5 home upgrade.
//
// Subscribes to the `feed:has-new` socket event so the feed page
// can show the "X bài viết mới — Xem" banner. The server emits
// this lightweight ping for every follower whenever a post is
// created (skipping PRIVATE posts). We don't fetch the new posts
// here — the page does that on demand when the user clicks the
// banner, via `loadNewPosts` returned alongside the counter.
//
// We deliberately:
//   • keep the ping payload tiny (just viewerId + count) so the
//     socket cost stays negligible regardless of follower count;
//   • debounce bursts so 10 new posts from 10 different authors
//     collapse into "10 bài viết mới" instead of spamming the UI;
//   • auto-clear the counter once the user actually clicks;
//   • don't render anything when there are no new posts (the page
//     passes `count` to the banner component).

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export interface FeedHasNewHandle {
  /** Number of new posts since the last clear; 0 = no banner. */
  count: number;
  /**
   * Called when the user clicks the banner. The page then does
   * a top-up fetch and prepends the new posts to the visible
   * feed. After this call the local counter resets.
   */
  onAck: () => void;
}

/**
 * Subscribe to `feed:has-new` events and return a handle the page
 * uses to drive the banner UI. Returns `count` 0 when there's
 * nothing pending.
 *
 * Usage:
 *   const { count, onAck } = useFeedHasNew();
 *   <FeedHasNewBanner count={count} onAck={onAck} />
 */
export function useFeedHasNew(): FeedHasNewHandle {
  const userId = useAuthStore((s) => s.user?.id);
  const [count, setCount] = useState(0);
  // Burst debounce — collapse multiple pings arriving within 1.5s
  // into a single UI update. Without this, a burst of 5 new posts
  // would trigger 5 re-renders in the same frame.
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    const sock = getSocket();
    if (!sock) return;

    const onHasNew = (payload: { viewerId?: number; count?: number }) => {
      // The server only emits to our personal room so we don't need
      // to filter by viewerId — but we still guard in case the
      // payload shape ever changes.
      if (payload?.viewerId && payload.viewerId !== userId) return;
      const n = typeof payload.count === 'number' && payload.count > 0 ? payload.count : 1;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setCount((c) => c + n);
      }, 1500);
    };

    sock.on('feed:has-new', onHasNew);
    return () => {
      sock.off('feed:has-new', onHasNew);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [userId]);

  const onAck = useCallback(() => {
    setCount(0);
  }, []);

  return { count, onAck };
}
