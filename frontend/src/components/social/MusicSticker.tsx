'use client';

/**
 * MusicSticker — Instagram-style music overlay on a social post.
 *
 * Renders an overlay on the FIRST media tile when the post has a
 * music track attached. The sticker shows:
 *   - the cover image (or a gradient placeholder)
 *   - the track title + artist
 *   - a play/pause button
 *
 * Playback strategy
 * ──────────────────────────────────────────────────────────────────
 *  Tracks in cuongthai.com's music library are YouTube-sourced —
 *  `audioUrl` is `https://www.youtube.com/watch?v=…`. HTML5 <audio>
 *  can't stream YouTube pages (CORS, Widevine, etc.), so we detect
 *  YouTube URLs and use a YouTube embed iframe for playback.
 *  Non-YouTube URLs (e.g. CDN-hosted mp3) fall through to the
 *  direct <audio> path so the same component works for both kinds.
 *
 *  - Clicking the play/pause button on a YouTube track opens a
 *    small modal with a YouTube iframe (autoPlay=1) — the
 *    Instagram-style "tap to preview" pattern. Tap the close
 *    button to dismiss.
 *  - The component is purely cosmetic otherwise; users who
 *    tap the title/artist strip also open the YouTube modal
 *    so they can scrub / watch full.
 */

import { useEffect, useRef, useState } from 'react';
import { Music2, Pause, Play, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

/** Extract a YouTube video id from any common YouTube URL form. */
function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Forms we handle:
  //   https://www.youtube.com/watch?v=VIDEOID
  //   https://m.youtube.com/watch?v=VIDEOID
  //   https://youtu.be/VIDEOID
  //   https://www.youtube.com/embed/VIDEOID
  const patterns: RegExp[] = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

export default function MusicSticker({
  track,
  startSec = 0,
  onRemove,
}: MusicStickerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showYouTube, setShowYouTube] = useState(false);

  const ytId = extractYouTubeId(track.audioUrl);
  const isYouTube = !!ytId;

  // We always render the HTML5 <audio> element when the track
  // is a direct audio file (mp3/m4a CDN URL) so the browser can
  // stream + autoPlay without our intervention. YouTube tracks go
  // through the iframe modal instead because the raw <audio> tag
  // can't render a YT page.
  const isDirectAudio = !isYouTube && !!track.audioUrl;

  const toggle = async () => {
    setError(null);
    if (isYouTube) {
      setShowYouTube(true);
      return;
    }
    if (!isDirectAudio) {
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

  // When the user closes the YouTube modal mid-play, we reset the
  // local playing state so the sticker re-renders as paused.
  useEffect(() => {
    if (!showYouTube) setPlaying(false);
  }, [showYouTube]);

  return (
    <>
      <div
        data-testid="music-sticker"
        data-music-track-id={track.id}
        className="pointer-events-auto absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-white shadow-lg backdrop-blur-md"
      >
        {/* Cover thumbnail (or fallback icon). Tapping the
            thumbnail also opens the player (same as tapping the
            play button) — convenient for one-handed use. */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Mở bài hát"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-violet/40 to-neon-pink/40"
        >
          {track.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.coverImage}
              alt={track.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Music2 className="h-4 w-4 text-white" />
          )}
        </button>

        {/* Title + artist. Clicking also opens the player — same
            affordance as the cover thumbnail. We use a button
            rather than a div so keyboard users can tab into it. */}
        <button
          type="button"
          onClick={toggle}
          className="min-w-0 flex-1 text-left"
        >
          <div className="truncate text-xs font-semibold leading-tight">
            {track.title}
          </div>
          <div className="truncate text-[10px] text-white/70 leading-tight">
            {track.artist}
          </div>
        </button>

        {/* Play/pause button. Disabled state when no audio is
            available (neither YT id nor direct audio URL). */}
        <button
          type="button"
          onClick={toggle}
          disabled={!isYouTube && !isDirectAudio}
          aria-label={
            isYouTube
              ? 'Xem video YouTube'
              : playing
                ? 'Pause'
                : 'Play'
          }
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
            'bg-white/15 hover:bg-white/25',
            !isYouTube && !isDirectAudio && 'opacity-40 cursor-not-allowed',
          )}
        >
          {isYouTube ? (
            <ExternalLink className="h-3.5 w-3.5" />
          ) : playing ? (
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
            aria-label="Xoa nhạc"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Error toast inline */}
        {error && (
          <span className="absolute -top-7 left-0 rounded-md bg-red-500/90 px-2 py-1 text-[10px] text-white shadow">
            {error}
          </span>
        )}
      </div>

      {/* YouTube embed modal. We use the official
          youtube-nocookie.com domain so the embed doesn't set
          tracking cookies before the user actively plays the
          track. autoPlay=1 is fine here because the modal only
          mounts after the user clicks play. */}
      <AnimatePresence>
        {showYouTube && ytId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={() => setShowYouTube(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0d0f18] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-darkborder/60 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-text-primary">
                    {track.title}
                  </div>
                  <div className="truncate text-xs text-text-muted">
                    {track.artist}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowYouTube(false)}
                  aria-label="Đóng"
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 16:9 embed. The padding-bottom trick keeps the
                  aspect ratio without needing JS to measure the
                  parent. */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  title={`${track.title} — ${track.artist}`}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between border-t border-darkborder/60 px-4 py-2.5 text-[11px] text-text-muted">
                <span>YouTube — bấm Esc hoặc click ra ngoài để đóng</span>
                <a
                  href={track.audioUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neon-violet hover:underline"
                >
                  Mở YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
