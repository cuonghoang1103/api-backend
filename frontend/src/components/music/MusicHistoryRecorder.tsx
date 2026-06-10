'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/store/musicStore';
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
