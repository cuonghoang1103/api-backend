'use client';

import { useEffect } from 'react';
import { playSound } from '@/lib/sound';
import { usePreferencesStore } from '@/store/preferencesStore';

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

  return null;
}
