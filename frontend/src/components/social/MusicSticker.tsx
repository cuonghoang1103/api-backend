'use client';

/**
 * MusicSticker — Instagram-style music overlay on a social post.
 *
 * Rendered inside the post media area when the post has
 * `musicTrackId` set. Shows the track's title and artist, with
 * a small play/pause button that opens a mini audio player
 * in the corner. Tapping the title/artist area opens the
 * full track page (handled by parent — this component just
 * dispatches a click event).
 *
 * The sticker has two visual modes:
 * - 'inline' (default): a horizontal strip at the BOTTOM of
 *   the media area, semi-transparent black bg, white text —
 *   classic Instagram look.
 * - 'corner': a small circular badge (TODO; inline-only for now).
 *
 * Audio playback is the existing /api/v1/music/<id>/stream
 * endpoint; we don't need any new infra for the audio itself.
 */

import { useState, useRef, useEffect } from 'react';
import { Music2, Pause, Play, X } from 'lucide-react';

export interface MusicTrackMini {
  id: number;
  title: string;
  artist: string;
  coverImage?: string | null;
  audioUrl?: string | null;
  durationSeconds?: number | null;
}

export interface MusicStickerProps {
  track: MusicTrackMini;
  /** Optional: where in the track to start playing. Defaults to 0. */
  startSec?: number;
  /** Optional: remove handler (e.g. while drafting the post). */
  onRemove?: () => void;
}

export default function MusicSticker({
  track,
  startSec = 0,
  onRemove,
}: MusicStickerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we have a direct audio URL (e.g. the backend's music
  // streaming endpoint), play through that. Otherwise show
  // play/disabled state — the track needs to be fetched from
  // the music library first (the composer does this when the
  // user picks a track).
  const hasAudio = !!track.audioUrl;

  const toggle = async () => {
    if (!hasAudio) {
      setError('Audio chua san sang — vui long chon track lai.');
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioUrl!);
      audioRef.current.currentTime = startSec;
      audioRef.current.addEventListener('ended', () => setPlaying(false));
      audioRef.current.addEventListener('error', () => {
        setError('Khong the phat track nay');
        setPlaying(false);
      });
    }
    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio error');
      setPlaying(false);
    }
  };

  // Cleanup on unmount: pause + release audio element.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      data-testid="music-sticker"
      data-music-track-id={track.id}
      className="pointer-events-auto absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-white shadow-lg backdrop-blur-md"
    >
      {/* Cover thumbnail (or fallback icon) */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-violet/40 to-neon-pink/40">
        {track.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverImage}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Music2 className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Title + artist (clickable, opens track page) */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold leading-tight">
          {track.title}
        </div>
        <div className="truncate text-[10px] text-white/70 leading-tight">
          {track.artist}
        </div>
      </div>

      {/* Play/pause button */}
      <button
        type="button"
        onClick={toggle}
        disabled={!hasAudio}
        aria-label={playing ? 'Pause' : 'Play'}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 disabled:opacity-40"
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5 translate-x-[1px]" />
        )}
      </button>

      {/* Remove (used by the composer to drop a track) */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Xoa nhac"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Error toast inline — kept simple since the rest of the UI
          already has a proper toast system. */}
      {error && (
        <span className="absolute -top-7 left-0 rounded-md bg-red-500/90 px-2 py-1 text-[10px] text-white shadow">
          {error}
        </span>
      )}
    </div>
  );
}
