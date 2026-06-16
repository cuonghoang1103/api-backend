'use client';

/**
 * Dashboard hook — server is the source of truth, localStorage
 * is the offline mirror.
 *
 * Lifecycle:
 *   1. Auth resolves (isStoreHydrated=true, userId known) → trigger hydrate.
 *   2. We call `hydrateFromServer(userId)` once to fetch the full
 *      snapshot from the DB and replace the in-memory state. This is
 *      the ONLY way data enters the store from the network.
 *   3. Subsequent user actions go through the action functions
 *      (addTask, toggleTask, etc.) which do optimistic local
 *      updates + fire-and-forget background sync.
 *   4. When auth changes (login/logout/switch account) we
 *      call `hydrateFromServer(newUserId)` again.
 *
 * Why isStoreHydrated matters:
 *   - Zustand persist rehydrates asynchronously. Without waiting for
 *     isStoreHydrated=true, the hook could compute userId='guest'
 *     because isAuthenticated hasn't been flipped yet (it updates
 *     inside onRehydrateStorage which runs after the first subscriber
 *     fires).
 *   - We gate the userId computation on BOTH isLoading=false AND
 *     isStoreHydrated=true to ensure the auth state is fully restored
 *     before we decide who the user is.
 *
 * Why NOT persist to localStorage for reads:
 *   - localStorage edits can inflate level/exp. Server is authoritative.
 *   - A different user on the same device would see stale data.
 *   - localStorage is only a fallback for offline mode.
 */
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getState,
  subscribe,
  switchUser,
  setActivity,
  setActivityFilter,
  addTask,
  toggleTask,
  removeTask,
  awardExp,
  markCelebrated,
  planTomorrow,
  ensureScopeSeeded,
  celebrate,
  hydrateFromServer,
  replaceSeedTasks,
} from './store';
export type { TaskScope } from './types';

export function useDashboardStore() {
  // ── Auth state ──────────────────────────────────────────────────
  // We wait for isStoreHydrated before deciding the userId. Without
  // this, the first subscriber fire (before onRehydrateStorage runs)
  // could compute userId='guest' even though the user IS logged in.
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isStoreHydrated = useAuthStore((s) => s.isHydrated);

  const userId =
    !isLoading && isStoreHydrated && isAuthenticated && user?.id != null
      ? String(user.id)
      : 'guest';

  // ── Dashboard snapshot (local React state) ─────────────────────
  // Initialised to getState() (module-level defaults) so SSR renders
  // a stable shell. Updated via the store subscription.
  const [snapshot, setSnapshot] = useState(getState);
  const [isHydrating, setIsHydrating] = useState(false);

  // Track which userId we've already hydrated for. Using a ref avoids
  // a render loop — we compare without triggering a re-render.
  const hydratedForRef = useRef<string>('guest');

  // Subscribe to store changes. The callback fires on every mutation
  // (addTask, toggleTask, etc.) and keeps the local snapshot in sync.
  useEffect(() => {
    const unsub = subscribe(() => {
      setSnapshot(getState());
    });
    return unsub;
  }, []);

  // ── Auth-driven hydration ────────────────────────────────────────
  // When userId changes, fetch a fresh snapshot from the server for
  // the new user. We use a hydration timeout as a defensive backstop
  // in case isStoreHydrated never fires (localStorage unavailable).
  useEffect(() => {
    const newId = userId;

    if (hydratedForRef.current === newId) return;

    setIsHydrating(true);
    switchUser(newId);
    hydratedForRef.current = newId;

    if (newId === 'guest') {
      setIsHydrating(false);
      void (async () => {
        await ensureScopeSeeded('today');
        await ensureScopeSeeded('week');
        await ensureScopeSeeded('month');
      })();
      return;
    }

    // Defensive: if isStoreHydrated hasn't fired within 2 seconds,
    // force the hydration anyway using the current userId. This
    // guards against the case where onRehydrateStorage fails to
    // fire (e.g. localStorage blocked) and userId stays 'guest'.
    const timeoutId = setTimeout(() => {
      if (hydratedForRef.current === 'guest' && userId !== 'guest') {
        hydratedForRef.current = userId;
        void (async () => {
          try {
            await hydrateFromServer(userId);
            await ensureScopeSeeded('today');
            await ensureScopeSeeded('week');
            await ensureScopeSeeded('month');
          } finally {
            setIsHydrating(false);
          }
        })();
      }
    }, 2000);

    void (async () => {
      try {
        await hydrateFromServer(newId);
        await ensureScopeSeeded('today');
        await ensureScopeSeeded('week');
        await ensureScopeSeeded('month');
      } finally {
        clearTimeout(timeoutId);
        setIsHydrating(false);
      }
    })();
  }, [userId]);

  return {
    ...snapshot,
    isHydrating,
    setActivity,
    setActivityFilter,
    addTask,
    toggleTask,
    removeTask,
    awardExp,
    markCelebrated,
    planTomorrow,
    ensureScopeSeeded,
    celebrate,
    replaceSeedTasks,
  };
}
