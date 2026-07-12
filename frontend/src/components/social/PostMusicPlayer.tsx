'use client';

/**
 * PostMusicPlayer — background music attached to a post (FB/IG-style), shown at
 * the TOP of the post.
 *
 * Behaviour:
 *  - AUTO-PLAYS when the post scrolls into view (IntersectionObserver on the
 *    post frame), PAUSES when scrolled out, resumes when scrolled back.
 *  - Plays only the trimmed snippet [startSec, endSec] and loops it. When
 *    endSec is null it loops the whole track from startSec.
 *  - One post plays at a time (a new in-view post pauses the previous one).
 *  - The control is a SPEAKER (mute/unmute), not play/pause. Muting is global
 *    (mutes every post) and persists. Default: unmuted.
 *  - Browser autoplay policy blocks sound before the first user gesture; we
 *    retry the in-view post's playback on the first click/tap so it starts
 *    with sound as soon as the user interacts.
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music2 } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import { useFeedMusicStore } from '@/store/feedMusicStore';
import type { MusicTrackMini } from '@/types/social';

// Only one post's audio plays at a time.
let currentAudio: HTMLAudioElement | null = null;

// Autoplay-with-sound needs a user gesture. Until the first one, in-view
// players queue a retry here; the first click/tap flushes them.
let audioUnlocked = false;
const pendingPlays = new Set<() => void>();
function armGestureUnlock() {
  if (typeof window === 'undefined' || audioUnlocked) return;
  const handler = () => {
    audioUnlocked = true;
    const cbs = Array.from(pendingPlays);
    pendingPlays.clear();
    cbs.forEach((fn) => fn());
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('keydown', handler);
  };
  window.addEventListener('pointerdown', handler, { once: true });
  window.addEventListener('keydown', handler, { once: true });
}

export default function PostMusicPlayer({
  track,
  startSec = 0,
  endSec = null,
}: {
  track: MusicTrackMini;
  startSec?: number;
  endSec?: number | null;
}) {
  const muted = useFeedMusicStore((s) => s.muted);
  const toggleMuted = useFeedMusicStore((s) => s.toggleMuted);
  const [playing, setPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inViewRef = useRef(false);

  const src = getMediaUrl(null, track.audioUrl ?? null, track.id);
  const playable = !!src && /^https?:\/\//i.test(src) && !/(?:youtube\.com|youtu\.be)/i.test(src);
  const effEnd = endSec != null && endSec > startSec ? endSec : null;

  // Stable refs to the latest values used inside listeners set up once.
  const boundsRef = useRef({ startSec, effEnd });
  boundsRef.current = { startSec, effEnd };
  // muted = speaker OFF = the audio is PAUSED (not merely silenced).
  // Ref so listeners registered once always read the current value.
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const ensureAudio = (): HTMLAudioElement | null => {
    if (!playable) return null;
    if (audioRef.current) return audioRef.current;
    const a = new Audio(src);
    a.preload = 'auto';
    try { a.currentTime = startSec; } catch { /* metadata not ready yet */ }

    a.addEventListener('timeupdate', () => {
      const { startSec: s, effEnd: e } = boundsRef.current;
      // Loop the trimmed window [startSec, endSec].
      if (e != null && a.currentTime >= e) {
        try { a.currentTime = s; } catch { /* ignore */ }
      }
    });
    a.addEventListener('ended', () => {
      const { startSec: s } = boundsRef.current;
      try { a.currentTime = s; } catch { /* ignore */ }
      // Auto-repeat while the speaker is on and the post is in view.
      if (inViewRef.current && !mutedRef.current) void a.play().catch(() => {});
    });
    a.addEventListener('play', () => setPlaying(true));
    a.addEventListener('pause', () => setPlaying(false));
    audioRef.current = a;
    return a;
  };

  const retry = () => { if (inViewRef.current && !mutedRef.current) tryPlay(); };

  const tryPlay = () => {
    // Speaker off → stay paused.
    if (mutedRef.current) return;
    const a = ensureAudio();
    if (!a) return;
    if (currentAudio && currentAudio !== a) currentAudio.pause();
    currentAudio = a;
    // Always (re)start the snippet from its beginning.
    try { a.currentTime = boundsRef.current.startSec; } catch { /* ignore */ }
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay blocked (no gesture yet) — retry on first interaction.
        if (!audioUnlocked) {
          pendingPlays.add(retry);
          armGestureUnlock();
        }
      });
  };

  // Auto-play / pause based on whether the post frame is in view.
  useEffect(() => {
    if (!playable) return;
    const el =
      (containerRef.current?.closest('.post-card-frame') as Element | null) ??
      containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        inViewRef.current = visible;
        if (visible) tryPlay();
        else audioRef.current?.pause();
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      pendingPlays.delete(retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playable, src]);

  // Speaker toggle = play/pause. Off → pause immediately. On → if this post
  // is in view, (re)start its snippet from the beginning.
  useEffect(() => {
    if (muted) {
      audioRef.current?.pause();
    } else if (inViewRef.current) {
      tryPlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  // Teardown.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (currentAudio === audioRef.current) currentAudio = null;
        audioRef.current = null;
      }
      pendingPlays.delete(retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-4 mt-3 flex items-center gap-3 rounded-xl border px-3 py-2"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
    >
      {/* Cover disc = the speaker toggle. Tap to mute/unmute (all posts). */}
      <button
        type="button"
        onClick={toggleMuted}
        disabled={!playable}
        aria-label={muted ? 'Phát nhạc nền' : 'Dừng nhạc nền'}
        title={muted ? 'Bật loa — phát nhạc nền' : 'Tắt loa — dừng nhạc'}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-violet/40 to-neon-pink/40 disabled:opacity-60"
      >
        {track.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.coverImage}
            alt=""
            className={`h-full w-full object-cover ${playing && !muted ? 'animate-[spin_6s_linear_infinite]' : ''}`}
            loading="lazy"
          />
        ) : (
          <Music2 className="h-4 w-4 text-white" />
        )}
        {playable && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            {muted ? <VolumeX className="h-[18px] w-[18px] text-white" /> : <Volume2 className="h-[18px] w-[18px] text-white" />}
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {track.title}
        </div>
        <div className="truncate text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
          {track.artist}
        </div>
      </div>
    </div>
  );
}
