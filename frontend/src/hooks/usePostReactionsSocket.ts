'use client';

/**
 * usePostReactionsSocket — wires the global Socket.IO stream to
 * the socialStore so reaction counts on every visible PostCard
 * update in real time across all connected viewers.
 *
 * Why this exists:
 * Before this hook, the reactor's own card updated instantly via
 * the optimistic click path, and the post author saw the bell
 * notification, but THIRD-PARTY viewers whose feed had the same
 * post had to refresh to see the new count. The user reported
 * 'reactions are not real-time, sometimes they update, sometimes
 * not' — exactly matching that third-viewer case.
 *
 * The fix has two parts:
 *   (1) Backend (social.service.ts → reactPost) emits a
 *       'post:reacted' event with the new likesCount + breakdown.
 *   (2) This hook listens, calls updatePostReactions() which is
 *       already defined in socialStore (was previously dead code)
 *       so the matching PostCard in the local feed slice re-renders
 *       with the fresh counts.
 *
 * Bounded:
 *   - No new store, no new reducer, no schema migration.
 *   - Just one global socket listener attached once on auth.
 *   - Ignores the reactor's own broadcast (their card already
 *     shows the optimistic update).
 *   - No-ops if the post isn't in the local feed slice
 *     (updatePostReactions only mutates existing entries).
 */

import { useEffect } from 'react';
import { getSocket, connectSocket } from '@/lib/socket';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import type { ReactionBreakdown } from '@/types/social';

interface PostReactedPayload {
  postId: number;
  likesCount: number;
  breakdown: Record<string, number>;
  actorId?: number;
}

let attached = false;
let cleanupFn: (() => void) | null = null;

export function usePostReactionsSocket(): void {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (attached) return;
    attached = true;

    let cancelled = false;

    (async () => {
      try {
        const socket = await connectSocket();
        if (cancelled || !socket) return;

        const onPostReacted = (payload: PostReactedPayload) => {
          if (!payload || typeof payload.postId !== 'number') return;
          // If the reactor is the same user who's receiving the
          // broadcast, their own card already shows the optimistic
          // update — skip to avoid a double-render. The actorId
          // may be undefined on older payloads; in that case we
          // always apply (the receiver's store knows the user's
          // own id and updatePostReactions is a no-op if the post
          // isn't in the local slice anyway).
          try {
            const selfId = useAuthStore.getState().user?.id;
            if (typeof selfId === 'number' && payload.actorId === selfId) return;
          } catch {
            /* ignore — apply below */
          }
          try {
            // The socket payload's `breakdown` is a partial
            // Record<string, number> (only carries the keys that
            // have a count > 0). ReactionBreakdown in the store
            // requires all 5 reaction keys — we normalise so
            // missing types default to 0 instead of `undefined`,
            // which would break the emoji stack render.
            const bd = payload.breakdown ?? {};
            const breakdown: ReactionBreakdown = {
              LIKE: bd.LIKE ?? 0,
              LOVE: bd.LOVE ?? 0,
              HAHA: bd.HAHA ?? 0,
              SAD: bd.SAD ?? 0,
              ANGRY: bd.ANGRY ?? 0,
            };
            useSocialStore.getState().updatePostReactions(
              payload.postId,
              {
                reacted: false, // best-effort: not in the broadcast
                myType: null,    // best-effort: not in the broadcast
                likesCount: payload.likesCount,
                breakdown,
              },
            );
          } catch {
            /* best-effort */
          }
        };

        socket.on('post:reacted', onPostReacted as any);
        cleanupFn = () => {
          socket.off('post:reacted', onPostReacted as any);
        };
      } catch (err) {
        // Socket failed to connect — the next REST poll on
        // feed refetch will catch the user up.
        attached = false;
        console.warn('[usePostReactionsSocket] connect failed:', (err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      if (cleanupFn) {
        cleanupFn();
        cleanupFn = null;
      }
      attached = false;
    };
  }, [isAuthenticated]);
}