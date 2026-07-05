'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';
import { useAuthStore } from '@/store/authStore';
import { useRecordPlay } from '@/hooks/useMusicQueries';

/**
 * MusicHistoryRecorder — syncs local play events to PostgreSQL.
 *
 * Mounted at the root layout (inside TanStackQueryProvider).
 * Watches `currentTrack` in the Zustand store. Whenever it changes,
 * fires `useRecordPlay` to persist a play event to the backend.
 *
 * Fire-and-forget: errors are swallowed so they never block playback.
 */
export default function MusicHistoryRecorder() {
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const prevTrackRef = useRef<string | null>(null);
  const recordPlay = useRecordPlay();

  useEffect(() => {
    if (!currentTrack) return;
    // History is a per-user feature — the endpoint 401s for guests, and the
    // music page auto-selects a first track on mount, so without this guard
    // every anonymous visit to /music fired a guaranteed-401 POST
    // (audit 2026-07-05). Guests keep their localStorage history as before.
    if (!useAuthStore.getState().isAuthenticated) return;
    const id = currentTrack.id;

    // Only fire when the actual track changes (not on every re-render).
    if (id === prevTrackRef.current) return;
    prevTrackRef.current = id;

    // Skip YouTube tracks (they don't have numeric DB IDs).
    if (id.startsWith('yt-') || id.startsWith('local-')) return;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return;

    recordPlay.mutate(numericId, {
      onError: () => {
        // Swallow — history persistence must never block playback.
      },
    });
  }, [currentTrack, recordPlay]);

  return null;
}
