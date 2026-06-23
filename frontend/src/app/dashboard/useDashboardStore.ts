'use client';

/**
 * Dashboard hook — server is the source of truth, localStorage
 * is the offline mirror.
 *
 * Lifecycle:
 * 1. Auth resolves (isStoreHydrated=true, userId known) → trigger hydrate.
 * 2. We call `hydrateFromServer(userId)` once to fetch the full
 * snapshot from the DB and replace the in-memory state. This is
 * the ONLY way data enters the store from the network.
 * 3. Subsequent user actions go through the action functions
 * (addTask, toggleTask, etc.) which do optimistic local
 * updates + fire-and-forget background sync.
 * 4. When auth changes (login/logout/switch account) we
 * call `hydrateFromServer(newUserId)` again.
 *
 * Why isStoreHydrated matters:
 * - Zustand persist rehydrates asynchronously. Without waiting for
 * isStoreHydrated=true, the hook could compute userId='guest'
 * because isAuthenticated hasn't been flipped yet (it updates
 * inside onRehydrateStorage which runs after the first subscriber
 * fires).
 * - We gate the userId computation on BOTH isLoading=false AND
 * isStoreHydrated=true to ensure the auth state is fully restored
 * before we decide who the user is.
 *
 * Why NOT persist to localStorage for reads:
 * - localStorage edits can inflate level/exp. Server is authoritative.
 * - A different user on the same device would see stale data.
 * - localStorage is only a fallback for offline mode.
 *
 * userId sync (CRITICAL):
 * - The action functions (addTask, toggleTask, ...) short-circuit
 * when currentState.userId === 'guest' to avoid POSTing to a
 * server we can't authenticate as. If currentState.userId stays
 * 'guest' while the user IS logged in, every action becomes a
 * local-only mutation that vanishes on reload.
 * - The previous implementation relied on the `[userId]` effect to
 * call switchUser(newId) when userId changed. If that effect
 * didn't fire (e.g. userId was already 'guest' on first render
 * and never appeared to change, or the effect got short-circuited
 * by some other code path), currentState.userId stayed 'guest'
 * and every task became local-only.
 * - The fix: call switchUser(newId) on EVERY render, before any
 * effect runs. That guarantees currentState.userId matches the
 * latest auth-store userId by the time any action runs, regardless
 * of whether the auth userId flipped from 'guest' to a real id.
 * - switchUser is a no-op if the id hasn't changed, so this is safe
 * to run on every render.
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
 // ── Auth state ───────────────────────────────────────────────────
 // We compute userId from the auth store. We DO NOT gate on
 // `isStoreHydrated` because in production builds Zustand's persist
 // `onRehydrateStorage` callback can fail to flip `isHydrated: true`
 // (observed: isHydrated stays false forever even though `user` is
 // fully populated). Gating on it leaves us stuck at userId='guest'
 // forever, which causes every action to short-circuit into
 // local-only mutations that vanish on reload.
 //
 // The fallback path is to also read `auth-storage` directly from
 // localStorage on the client. This works even when the Zustand
 // rehydration callback never fires.
 const user = useAuthStore((s) => s.user);
 const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

 let resolvedUserId: string | null = null;
 if (isAuthenticated && user?.id != null) {
 resolvedUserId = String(user.id);
 } else if (typeof window !== 'undefined') {
 // Fallback: read directly from localStorage. This handles the
 // case where Zustand persist's onRehydrateStorage didn't flip
 // isHydrated. We only do this client-side to avoid SSR mismatch.
 try {
 const raw = window.localStorage.getItem('auth-storage');
 if (raw) {
 const parsed = JSON.parse(raw);
 const fallbackUser = parsed?.state?.user;
 const fallbackAuth = parsed?.state?.isAuthenticated;
 if (fallbackAuth && fallbackUser?.id != null) {
 resolvedUserId = String(fallbackUser.id);
 }
 }
 } catch {
 // ignore — localStorage unavailable or malformed
 }
 }

 const userId = resolvedUserId ?? 'guest';

 // ── Sync userId into the module-level store on EVERY render ─────
 // This is the bug fix. The previous code only called switchUser()
 // inside the [userId] effect below. If the effect didn't fire for
 // any reason (deps comparison edge case, effect short-circuit on
 // initial render, etc.), the module-level currentState.userId
 // would stay 'guest' even after the auth store flipped to a real
 // userId. Every action would then short-circuit on
 // `if (currentState.userId === 'guest') return optimistic` and the
 // task would never reach the server.
 //
 // switchUser() is a no-op when the id hasn't changed (it checks
 // `if (oldId === newId) return;`), so calling it on every render
 // is safe.
 if (getState().userId !== userId) {
 switchUser(userId);
 }

 // ── Dashboard snapshot (local React state) ───────────────────
 // Initialised to getState() (module-level defaults) so SSR renders
 // a stable shell. Updated via the store subscription.
 const [snapshot, setSnapshot] = useState(getState);
 const [isHydrating, setIsHydrating] = useState(false);

 // Track which userId we've already hydrated for. Using a ref avoids
 // a render loop — we compare without triggering a re-render.
 //
 // IMPORTANT: do NOT initialise from getState().userId here. The
 // in-render switchUser() above has already updated the module-level
 // userId, so getState().userId may already match the new userId
 // before this effect ever runs. If we seeded hydratedForRef from
 // getState().userId, the effect's "have we hydrated for this id
 // yet?" check would always be true and we'd never call
 // hydrateFromServer at all.
 //
 // Initialising to 'guest' means the first time userId becomes a
 // real id, the effect sees 'guest' !== '1' and triggers the
 // server snapshot fetch — exactly the behaviour we want.
 const hydratedForRef = useRef<string>('guest');

 // Subscribe to store changes. The callback fires on every mutation
 // (addTask, toggleTask, etc.) and keeps the local snapshot in sync.
 useEffect(() => {
 const unsub = subscribe(() => {
 setSnapshot(getState());
 });
 return unsub;
 }, []);

 // ── Auth-driven hydration ───────────────────────────────────
 // When userId changes, fetch a fresh snapshot from the server for
 // the new user. We use a hydration timeout as a defensive backstop
 // in case isStoreHydrated never fires (localStorage unavailable).
 //
 // Combined with the in-render sync above, this guarantees that:
 // 1. The module-level userId always matches the auth store.
 // 2. The effect skips when there's nothing new to hydrate.
 // 3. When the user logs in/out, both the userId sync and the effect
 // fire, and the server snapshot is fetched exactly once.
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