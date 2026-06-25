'use client';

// useComposerDraft — Phase 5 home upgrade.
//
// Auto-saves the post composer's text to localStorage every 1.5s
// of inactivity. When the user re-opens the composer (or reloads
// the page), we restore the draft. Drafts are per-user (keyed by
// userId) so two accounts on the same browser don't collide.
//
// Storage shape (versioned for forward-compat):
//   { v: 1, content: string, ts: number }
//
// We deliberately:
//   • debounce writes to 1.5s of inactivity so we don't hammer
//     localStorage on every keystroke (which can be expensive on
//     iOS Safari);
//   • cap content at 10,000 characters — anything longer is
//     almost certainly a paste-bomb and we shouldn't persist it;
//   • skip the write entirely when content is empty so the storage
//     slot gets cleared on the next save;
//   • clear the slot on a successful post (call `clearDraft()`)
//     so the next session starts blank.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const STORAGE_PREFIX = 'cuongthai:composer-draft:v1:';
const DEBOUNCE_MS = 1500;
const MAX_CONTENT_LEN = 10_000;

interface Draft {
  v: 1;
  content: string;
  ts: number;
}

function keyFor(userId: number): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function readDraft(userId: number): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || parsed.v !== 1) return null;
    if (typeof parsed.content !== 'string') return null;
    return parsed.content;
  } catch {
    return null;
  }
}

function writeDraft(userId: number, content: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (!content) {
      window.localStorage.removeItem(keyFor(userId));
      return;
    }
    const draft: Draft = { v: 1, content, ts: Date.now() };
    window.localStorage.setItem(keyFor(userId), JSON.stringify(draft));
  } catch {
    // Quota exceeded or storage disabled — silently drop. The user
    // can still post normally; we just lose the draft persistence.
  }
}

export interface ComposerDraftHandle {
  /** The content to seed the composer with. null on first render. */
  initialContent: string | null;
  /**
   * Schedule a save. Safe to call from onChange. Internally
   * debounced; the actual write happens ~1.5s after the last call.
   */
  scheduleSave: (content: string) => void;
  /** Clear the persisted draft immediately. */
  clearDraft: () => void;
}

export function useComposerDraft(): ComposerDraftHandle {
  const userId = useAuthStore((s) => s.user?.id);
  // We read the draft synchronously on first mount so the textarea
  // can pre-fill with it. After mount, this state never changes —
  // subsequent saves go straight to localStorage.
  const [initialContent] = useState<string | null>(() =>
    userId != null ? readDraft(userId) : null,
  );
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  // If the user logs out / switches accounts mid-session, drop any
  // pending timer so we don't write under the wrong key.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [userId]);

  const scheduleSave = useCallback(
    (content: string) => {
      if (userId == null) return;
      // Cap at MAX_CONTENT_LEN — anything past that is almost
      // certainly an accidental paste-bomb we shouldn't persist.
      const capped = content.length > MAX_CONTENT_LEN ? content.slice(0, MAX_CONTENT_LEN) : content;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        // Skip the write if nothing actually changed since the
        // last persisted version. Saves the storage write churn
        // when the user clicks in/out of the textarea without
        // typing.
        if (capped === lastSavedRef.current) return;
        writeDraft(userId, capped);
        lastSavedRef.current = capped;
      }, DEBOUNCE_MS);
    },
    [userId],
  );

  const clearDraft = useCallback(() => {
    if (userId == null) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    writeDraft(userId, '');
    lastSavedRef.current = '';
  }, [userId]);

  return { initialContent, scheduleSave, clearDraft };
}
