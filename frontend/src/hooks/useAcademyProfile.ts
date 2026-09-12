/**
 * Remembers which FPTU major (and combo) the student picked in the Academy
 * onboarding, so /academy can put their own curriculum first.
 *
 * WHERE IT IS STORED — two layers, on purpose:
 *  · localStorage, always. A guest who never signs in still keeps the answer,
 *    and the robot does not ambush them on every visit.
 *  · the server preferences blob (`preferences.academy`), when signed in, so
 *    the answer follows the student to their phone. The local copy is written
 *    first and the server call is fire-and-forget: a failed PATCH must never
 *    lose the choice the student just made.
 *
 * WHO WINS ON CONFLICT — whoever answered last (`chosenAt`). Reading the
 * server on mount and blindly taking it would undo a choice made offline on
 * this device; taking local blindly would ignore a change made on the phone.
 *
 * `isStudent: false` is a real answer, not "unanswered": it means the visitor
 * said they are not an FPTU student, so we send them to /courses and stop
 * asking. Only `isStudent === null` opens the robot.
 *
 * ⚠️ THE STATE LIVES IN A MODULE-LEVEL STORE, NOT IN useState. The dialog and
 * the page both call this hook, and with per-component state the dialog's
 * save() only updated the dialog's own copy: the student finished onboarding
 * and /academy kept showing nothing personal until a full reload. One store +
 * useSyncExternalStore means every caller sees the same answer immediately.
 */
'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { preferencesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export interface AcademyProfile {
  isStudent: boolean | null;
  /** Khối ngành: 'it' | 'business' | 'communication' | 'language' | 'cs'. */
  faculty: string | null;
  major: string | null;
  combo: string | null;
  chosenAt: string | null;
}

const EMPTY: AcademyProfile = { isStudent: null, faculty: null, major: null, combo: null, chosenAt: null };
const LS_KEY = 'cuong-academy-profile-v1';

interface State { profile: AcademyProfile; ready: boolean }

/** `ready: false` on both the server and the client's first render, so
 *  hydration matches; the effect below flips it after reading storage. */
const INITIAL: State = { profile: EMPTY, ready: false };
let state: State = INITIAL;
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};
const getSnapshot = () => state;
const getServerSnapshot = () => INITIAL;
const setState = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

function readLocal(): AcademyProfile {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<AcademyProfile>;
    const major = typeof p.major === 'string' ? p.major : null;
    return {
      isStudent: typeof p.isStudent === 'boolean' ? p.isStudent : null,
      // Migrate: profile cũ (chỉ IT, chưa có faculty) mà đã có major → khối 'it'.
      faculty: typeof p.faculty === 'string' ? p.faculty : (major ? 'it' : null),
      major,
      combo: typeof p.combo === 'string' ? p.combo : null,
      chosenAt: typeof p.chosenAt === 'string' ? p.chosenAt : null,
    };
  } catch {
    // A private window, cleared site data, or a browser that blocks storage.
    return EMPTY;
  }
}

function writeLocal(p: AcademyProfile) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* storage blocked — the in-memory store still drives this session */
  }
}

const newer = (a: AcademyProfile, b: AcademyProfile): AcademyProfile => {
  const ta = a.chosenAt ? Date.parse(a.chosenAt) : 0;
  const tb = b.chosenAt ? Date.parse(b.chosenAt) : 0;
  return tb > ta ? b : a;
};

/** Module-level so the server copy is fetched once per page load, not once
 *  per component that happens to use this hook. */
let pulled = false;

export function useAcademyProfile() {
  const { isAuthenticated } = useAuthStore();
  const { profile, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!state.ready) setState({ profile: readLocal(), ready: true });
  }, []);

  // Pull the server copy once per sign-in and keep whichever is newer.
  useEffect(() => {
    if (!isAuthenticated || pulled) return;
    pulled = true;
    let alive = true;
    (async () => {
      try {
        const res = await preferencesApi.get();
        const remote = res.data?.data?.preferences?.academy as Partial<AcademyProfile> | undefined;
        if (!alive || !remote) return;
        const win = newer(state.profile, {
          isStudent: remote.isStudent ?? null,
          faculty: remote.faculty ?? (remote.major ? 'it' : null),
          major: remote.major ?? null,
          combo: remote.combo ?? null,
          chosenAt: remote.chosenAt ?? null,
        });
        writeLocal(win);
        setState({ profile: win, ready: true });
      } catch {
        /* offline or not signed in any more — the local copy stands */
      }
    })();
    return () => { alive = false; };
  }, [isAuthenticated]);

  const save = useCallback((next: Omit<AcademyProfile, 'chosenAt'>) => {
    const full: AcademyProfile = { ...next, chosenAt: new Date().toISOString() };
    setState({ profile: full, ready: true });
    writeLocal(full);
    if (isAuthenticated) {
      preferencesApi.update({ preferences: { academy: full } }).catch(() => {
        /* keep the local answer; the next save retries */
      });
    }
    return full;
  }, [isAuthenticated]);

  /** Re-open the robot ("Đổi ngành"): forget the answer but keep nothing stale. */
  const reset = useCallback(() => {
    setState({ profile: EMPTY, ready: true });
    writeLocal(EMPTY);
    if (isAuthenticated) {
      preferencesApi.update({ preferences: { academy: EMPTY } }).catch(() => {});
    }
  }, [isAuthenticated]);

  return {
    profile,
    ready,
    /** The robot should appear only when nobody has answered yet. */
    needsOnboarding: ready && profile.isStudent === null,
    save,
    reset,
  };
}
