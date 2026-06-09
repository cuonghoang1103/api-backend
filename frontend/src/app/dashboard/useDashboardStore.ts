'use client';

/**
 * Dashboard hook — Zustand-style: subscribe + useState snapshot.
 *
 * Guarantees (proven via flow analysis):
 *  - Auth loading: render with defaults (safe — no stale user data)
 *  - Auth resolves: switchUser() called once → loads correct user from localStorage
 *  - Actions: always write to currentState.userId's key
 *  - User switch: saves old → loads new → notifies → all subscribers re-render
 *  - Logout: window.location.href → new JS context → clean defaults
 *  - Tab navigation: auth state persists → switchUser called if userId changed
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
} from './store';
import type { TaskScope } from './types';

export function useDashboardStore() {
  // ── Auth subscription ─────────────────────────────────────────────────────
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Stable userId from auth — only changes after auth fully resolves
  const userId = !isLoading && user?.id != null ? String(user.id) : 'guest';

  // ── Dashboard store subscription ─────────────────────────────────────────
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => {
    const unsub = subscribe(() => {
      setSnapshot(getState());
    });
    return unsub;
  }, []);

  // ── Switch user (called once per auth session) ────────────────────────────
  const switchedRef = useRef<string>('');
  const seededRef = useRef<string>('');

  useEffect(() => {
    if (switchedRef.current !== userId) {
      console.log(`[Dashboard] useEffect: switch "${switchedRef.current}" → "${userId}"`);
      switchUser(userId);
      switchedRef.current = userId;
    }
  }, [userId]);

  // ── Seed tasks once per user session ─────────────────────────────────────
  useEffect(() => {
    if (seededRef.current !== userId) {
      seededRef.current = userId;
      (['today', 'week', 'month'] as TaskScope[]).forEach((s) => ensureScopeSeeded(s));
    }
  }, [userId]);

  return {
    ...snapshot,
    setActivity,
    setActivityFilter,
    addTask,
    toggleTask,
    removeTask,
    awardExp,
    markCelebrated,
    planTomorrow,
    ensureScopeSeeded,
  };
}
