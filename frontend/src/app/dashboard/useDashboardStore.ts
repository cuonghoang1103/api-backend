'use client';

/**
 * Dashboard hook — server is the source of truth, localStorage
 * is the offline mirror.
 *
 * Lifecycle:
 *   1. Auth resolves → userId is known.
 *   2. We call `hydrateFromServer(userId)` once to fetch the
 *      full snapshot from the DB and replace the in-memory
 *      state. This is the ONLY way data enters the store
 *      from the network on cold start.
 *   3. Subsequent user actions go through the action functions
 *      (addTask, toggleTask, etc.) which do optimistic local
 *      updates + fire-and-forget background sync.
 *   4. When auth changes (login/logout/switch account) we
 *      call `hydrateFromServer(newUserId)` again — same
 *      function, but the local state was already reset to
 *      defaults inside `switchUser`, so the snapshot just
 *      overwrites the empty default.
 *
 * What this fixes vs the previous version:
 *   - Old: data only lived in localStorage. A device wipe or
 *     a new browser meant the user lost all their planning.
 *   - New: data lives in PostgreSQL, scoped by user_id. A new
 *     device is the same data as the old one. A private-mode
 *     browse shows nothing (the API returns 401) which is the
 *     right behavior for a personal dashboard.
 *   - Old: cross-device edits collided silently — two tabs on
 *     two devices could each have a different `exp` total.
 *   - New: the server computes level/exp from its own counter
 *     so a localStorage edit can't inflate the user's stats.
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
import type { TaskScope } from './types';

export function useDashboardStore() {
  // ── Auth subscription ─────────────────────────────────────────────
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Stable userId from auth — only changes after auth fully resolves.
  // 'guest' for the unauthenticated state — actions become local-only.
  const userId = !isLoading && user?.id != null ? String(user.id) : 'guest';

  // ── Dashboard store subscription ──────────────────────────────────
  const [snapshot, setSnapshot] = useState(getState);
  const [isHydrating, setIsHydrating] = useState(false);
  const [hydratedFor, setHydratedFor] = useState<string>('guest');

  useEffect(() => {
    const unsub = subscribe(() => {
      setSnapshot(getState());
    });
    return unsub;
  }, []);

  // ── Auth-driven hydrate ───────────────────────────────────────────
  // When userId changes, reset the in-memory state and fetch
  // the new snapshot. We track `hydratedFor` separately so a
  // re-render that produces the same userId (e.g. the auth
  // store re-emits) doesn't trigger a second hydrate.
  useEffect(() => {
    if (hydratedFor === userId) return;
    setIsHydrating(true);
    switchUser(userId);
    setHydratedFor(userId);

    // Skip the network call for guests — there's no server
    // data to fetch. The user gets the empty default state
    // and the seed function will populate the demo tasks
    // locally so the page has something to show.
    if (userId === 'guest') {
      setIsHydrating(false);
      // Fire-and-forget the seed for guest demo.
      (async () => {
        await ensureScopeSeeded('today');
        await ensureScopeSeeded('week');
        await ensureScopeSeeded('month');
      })();
      return;
    }

    void (async () => {
      try {
        await hydrateFromServer(userId);
        // After we have the server snapshot, seed any scope
        // the user doesn't have tasks for yet. The server's
        // bulk-seed is idempotent so this is safe to call
        // on every load.
        await ensureScopeSeeded('today');
        await ensureScopeSeeded('week');
        await ensureScopeSeeded('month');
      } finally {
        setIsHydrating(false);
      }
    })();
  }, [userId, hydratedFor]);

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
