'use client';

/**
 * useMusicKeyboardShortcuts — Phase 1 global keyboard controls.
 *
 * Music-SCOPED, NOT global. The hook is a no-op unless:
 *   1. There IS a current track playing (otherwise nothing to control).
 *   2. The focused element is NOT a text input / textarea /
 *      contenteditable / `<select>` — otherwise space/arrows/M
 *      would hijack typing on every form on the site (the user
 *      explicitly flagged this).
 *
 * Bindings:
 *   Space       → play/pause toggle
 *   ArrowLeft   → seek -5s
 *   ArrowRight  → seek +5s
 *   M           → toggle mute
 *   N (shift)   → next track
 *   P (shift)   → previous track
 *
 * The hook MUST be mounted exactly once in the app (mount it from
 * `GlobalMusicPlayer`). React enforces single-mount since this
 * component is itself mounted once at the root layout.
 */

import { useEffect } from 'react';
import { useMusicStore } from '@/store/musicStore';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  // contenteditable surfaces (notes, blog editor, etc.)
  if (target.isContentEditable) return true;
  return false;
}

export function useMusicKeyboardShortcuts(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: KeyboardEvent) => {
      // (1) Don't fire while typing. We bail BEFORE reading store
      // state so we don't pay any cost when the user is typing in
      // a search box or writing a comment.
      if (isEditableTarget(e.target)) return;

      // (2) Don't fire while modifier keys are held — those
      // belong to the browser/OS (Cmd+R reload, Ctrl+L address
      // bar, etc.).
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const state = useMusicStore.getState();
      if (!state.currentTrack) return;

      switch (e.key) {
        case ' ': // Space
        case 'Spacebar':
          e.preventDefault();
          state.togglePlay();
          return;

        case 'ArrowLeft':
          e.preventDefault();
          {
            const next = Math.max(0, state.currentTime - 5);
            state.setCurrentTime(next);
          }
          return;

        case 'ArrowRight':
          e.preventDefault();
          {
            const next = state.currentTime + 5;
            const cap = state.duration && Number.isFinite(state.duration) ? state.duration : next;
            state.setCurrentTime(Math.min(next, cap));
          }
          return;

        case 'm':
        case 'M':
          e.preventDefault();
          state.toggleMute();
          return;

        case 'n':
        case 'N':
          // Shift+N = next (lower-case 'n' alone would collide
          // with browser find-in-page, so we require shift).
          if (!e.shiftKey) return;
          e.preventDefault();
          state.next();
          return;

        case 'p':
        case 'P':
          if (!e.shiftKey) return;
          e.preventDefault();
          state.previous();
          return;

        default:
          return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}