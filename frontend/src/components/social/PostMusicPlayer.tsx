'use client';

/**
 * PostMusicPlayer — the small FB/IG-style background-music player shown at the
 * TOP of a post that has an attached track. Compact pill: spinning cover +
 * title + artist + play/pause + a thin progress bar. Plays inline via a single
 * <audio> element (no global store), resolving the URL through getMediaUrl.
 *
 * Only ONE post plays at a time: starting one pauses whichever was playing.
 */

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music2 } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import type { MusicTrackMini } from '@/types/social';

// Module-level singleton so only one post's audio plays at once (FB behaviour).
let currentAudio: HTMLAudioElement | null = null;
const stopAll = (except: HTMLAudioElement | null) => {
  if (currentAudio && currentAudio !== except) {
    currentAudio.pause();
  }
};

export default function PostMusicPlayer({
  track,
  startSec = 0,
}: {
  track: MusicTrackMini;
  startSec?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const src = getMediaUrl(null, track.audioUrl ?? null, track.id);
  const playable = !!src && /^https?:\/\//i.test(src) && !/(?:youtube\.com|youtu\.be)/i.test(src);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (currentAudio === audioRef.current) currentAudio = null;
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = async () => {
    if (!playable) return;

    if (!audioRef.current) {
      const a = new Audio(src);
      a.currentTime = startSec;
      a.addEventListener('timeupdate', () => {
        const dur = a.duration || 0;
        const span = Math.max(1, dur - startSec);
        setProgress(Math.min(1, Math.max(0, (a.currentTime - startSec) / span)));
      });
      // Loop back to the chosen start for a continuous background feel.
      a.addEventListener('ended', () => {
        a.currentTime = startSec;
        a.play().catch(() => setPlaying(false));
      });
      a.addEventListener('pause', () => setPlaying(false));
      a.addEventListener('play', () => setPlaying(true));
      audioRef.current = a;
    }

    const a = audioRef.current;
    if (playing) {
      a.pause();
      return;
    }
    stopAll(a);
    currentAudio = a;
    try {
      if (a.currentTime < startSec) a.currentTime = startSec;
      await a.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-xl border px-3 py-2"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={!playable}
        aria-label={playing ? 'Tạm dừng' : 'Phát nhạc nền'}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-violet/40 to-neon-pink/40 disabled:cursor-not-allowed"
      >
        {track.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverImage}
            alt=""
            className={`h-full w-full object-cover ${playing ? 'animate-[spin_6s_linear_infinite]' : ''}`}
            loading="lazy"
          />
        ) : (
          <Music2 className="h-4 w-4 text-white" />
        )}
        {playable && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/35">
            {playing ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 translate-x-[1px] text-white" />}
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <Music2 className="h-3 w-3" />
          <span>Nhạc nền</span>
        </div>
        <div className="truncate text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {track.title}
        </div>
        <div className="truncate text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
          {track.artist}
        </div>
        {/* Thin progress bar */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-pink transition-[width] duration-200"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
