'use client';

/**
 * ============================================================
 * ListenTogetherSync (Phase 3) — the realtime bridge
 * ============================================================
 *
 * Mounted ONCE globally (root layout, next to MusicAudioController) so
 * sync keeps working while the user navigates. Renders nothing.
 *
 *  - HOST: emits the player state to the room on track/play-pause
 *    change + a 3s heartbeat (covers seeks + late joiners + drift).
 *  - GUEST: applies incoming room state to the local music store —
 *    loads the host's track, mirrors play/pause, and seeks when drift
 *    exceeds 1.5s. Guests never emit, so there's no echo loop.
 *
 * Reuses the existing singleton socket via the helpers in lib/socket.
 * Touches only the music store + listen-together store.
 */

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useMusicStore } from '@/store/musicStore';
import { useListenTogetherStore } from '@/store/listenTogetherStore';
import { useNowListeningStore } from '@/store/nowListeningStore';
import {
  listenControl,
  onListenState,
  onListenMembers,
  onListenClosed,
  emitNowPlaying,
  requestNowPlaying,
  onNowPlaying,
  type ListenState,
  type ListenTrackMeta,
} from '@/lib/socket';
import { formatDuration } from '@/hooks/useMusicQueries';
import type { Track } from '@/types';

function metaToTrack(m: ListenTrackMeta): Track {
  return {
    id: String(m.id),
    title: m.title,
    artist: m.artist,
    audioUrl: m.audioUrl ?? '',
    coverImage: m.coverImage ?? '',
    duration: m.durationSeconds ? formatDuration(m.durationSeconds) : '0:00',
    durationSeconds: m.durationSeconds ?? undefined,
  } as Track;
}

function currentMeta(): ListenTrackMeta | null {
  const t = useMusicStore.getState().currentTrack;
  if (!t) return null;
  return {
    id: String(t.id),
    title: t.title,
    artist: t.artist,
    audioUrl: t.audioUrl ?? null,
    coverImage: t.coverImage ?? null,
    durationSeconds: t.durationSeconds ?? null,
  };
}

function applyRemote(state: ListenState) {
  const music = useMusicStore.getState();
  if (state.track) {
    if (music.currentTrack?.id !== String(state.track.id)) {
      music.playTrack(metaToTrack(state.track));
    }
  }
  // Mirror play/pause.
  const playing = useMusicStore.getState().isPlaying;
  if (state.isPlaying && !playing) music.play();
  else if (!state.isPlaying && playing) music.pause();
  // Correct drift / honour seeks.
  const cur = useMusicStore.getState().currentTime || 0;
  if (Math.abs(cur - state.positionSec) > 1.5) {
    music.setCurrentTime(state.positionSec);
  }
}

export default function ListenTogetherSync() {
  const roomId = useListenTogetherStore((s) => s.roomId);
  const isHost = useListenTogetherStore((s) => s.isHost);
  const setMembers = useListenTogetherStore((s) => s.setMembers);
  const reset = useListenTogetherStore((s) => s.reset);

  // ── Subscriptions (both host + guest): members + room-closed ──
  useEffect(() => {
    if (!roomId) return;

    const offMembers = onListenMembers((p) => {
      if (p.roomId === roomId) setMembers(p.members, p.hostId);
    });
    const offClosed = onListenClosed((p) => {
      if (p.roomId === roomId) {
        reset();
        toast('Phòng nghe chung đã đóng');
      }
    });
    // Guests apply remote state; the host ignores it (and the server
    // doesn't echo to the sender anyway).
    const offState = onListenState((state: ListenState) => {
      if (useListenTogetherStore.getState().isHost) return;
      applyRemote(state);
    });

    return () => {
      offMembers();
      offClosed();
      offState();
    };
  }, [roomId, setMembers, reset]);

  // ── HOST: broadcast player state ──
  useEffect(() => {
    if (!roomId || !isHost) return;

    let lastTrackId: string | null = null;
    let lastPlaying: boolean | null = null;

    const emit = () => {
      const s = useMusicStore.getState();
      listenControl({
        roomId,
        track: currentMeta(),
        isPlaying: s.isPlaying,
        positionSec: s.currentTime || 0,
      });
    };

    // Emit immediately on track switch or play/pause flip.
    const unsub = useMusicStore.subscribe((s) => {
      const tid = s.currentTrack?.id ?? null;
      if (tid !== lastTrackId || s.isPlaying !== lastPlaying) {
        lastTrackId = tid;
        lastPlaying = s.isPlaying;
        emit();
      }
    });

    emit(); // initial state
    const hb = setInterval(emit, 3000); // heartbeat: seeks + drift + late joiners

    return () => {
      unsub();
      clearInterval(hb);
    };
  }, [roomId, isHost]);

  // ── Now-listening presence: broadcast my current track + receive others' ──
  useEffect(() => {
    const setEntry = useNowListeningStore.getState().set;
    const hydrate = useNowListeningStore.getState().hydrate;

    // Receive others' now-listening updates.
    const offNow = onNowPlaying((p) => {
      setEntry(p.userId, p.track ? { username: p.username, title: p.track.title, artist: p.track.artist } : null);
    });
    // Hydrate the current snapshot once (best-effort).
    requestNowPlaying()
      .then((res) => res?.ok && hydrate(res.items ?? []))
      .catch(() => {});

    // Broadcast my own now-listening on track / play-pause change.
    let lastKey = '';
    const broadcast = () => {
      const s = useMusicStore.getState();
      const playing = s.isPlaying && !!s.currentTrack;
      const key = playing ? `${s.currentTrack!.id}` : 'none';
      if (key === lastKey) return;
      lastKey = key;
      emitNowPlaying(playing ? currentMeta() : null);
    };
    broadcast();
    const unsub = useMusicStore.subscribe(broadcast);

    return () => {
      offNow();
      unsub();
      // Clear my presence when this bridge unmounts.
      emitNowPlaying(null);
    };
  }, []);

  return null;
}
