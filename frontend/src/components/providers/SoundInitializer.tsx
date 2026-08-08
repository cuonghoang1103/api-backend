'use client';

import { useEffect } from 'react';
import { playSound } from '@/lib/sound';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useAuthStore } from '@/store/authStore';

/**
 * SoundInitializer — unlocks the AudioContext on the user's first
 * interaction with the page.
 *
 * Why this exists: Chrome / Safari / Firefox all refuse to start an
 * AudioContext or play any sound until the user has interacted with
 * the page (autoplay policy). For a chat app this matters because
 * the first "new message" sound could otherwise be silently dropped
 * — the user has no chance to click anywhere if the message arrives
 * while the tab is idle.
 *
 * We attach one-time click + keydown listeners at the window level
 * that call `playSound('login')` with master volume 0 (so the user
 * doesn't actually hear the unlock ping) just to spin up the
 * AudioContext. Subsequent events play at the user's set volume.
 *
 * `SoundInitializer` renders nothing.
 */
export default function SoundInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let unlocked = false;
    const unlock = async () => {
      if (unlocked) return;
      unlocked = true;
      // Silent unlock: we don't actually want to play the login
      // sound on every page load. We just need ensureContext() to
      // run so the AudioContext leaves the 'suspended' state. The
      // volume=0 call still goes through ensureContext() because
      // it's called before volume is read.
      try { await playSound('login', { volume: 0 }); } catch { /* ignore */ }
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
    };

    // Respect the user's master toggle — no point attaching listeners
    // if they've disabled sounds entirely.
    if (!usePreferencesStore.getState().masterEnabled) return;

    window.addEventListener('pointerdown', unlock, { capture: true, once: false });
    window.addEventListener('keydown', unlock, { capture: true, once: false });
    window.addEventListener('touchstart', unlock, { capture: true, once: false });
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
    };
  }, []);

  // Reconcile the browser-local settings against the account copy once
  // the user is authenticated (added 2026-08-08). Guests are skipped —
  // /users/me/preferences 401s for them, and this provider wraps every
  // page including anonymous ones.
  //
  // This lives here rather than in the settings page on purpose: the
  // sound settings affect the whole app, so they must follow the account
  // from the first page load, not only once the user happens to open
  // /settings/notifications.
  useEffect(() => {
    let pulled = false;
    const pull = () => {
      if (pulled) return;
      pulled = true;
      void usePreferencesStore.getState().pullFromServer();
    };

    if (useAuthStore.getState().isAuthenticated) {
      pull();
      return;
    }
    // The auth store hydrates asynchronously, so subscribe rather than
    // checking once (same pattern ThemeContext uses).
    const unsub = useAuthStore.subscribe((s) => {
      if (s.isAuthenticated) {
        pull();
        unsub();
      }
    });
    return () => unsub();
  }, []);

  return null;
}
