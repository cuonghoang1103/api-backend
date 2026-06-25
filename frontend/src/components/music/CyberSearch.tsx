'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useYouTubeSearch, musicKeys } from '@/hooks/useMusicQueries';
import { useMusicStore } from '@/store/musicStore';
import { loadYouTubeAPI } from '@/lib/youtube-player';
import type { Track } from '@/types';
import type { YouTubeSearchResult } from '@/hooks/useMusicQueries';

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  textMuted: '#94a3b8',
};

interface SearchResult {
  type: 'local' | 'youtube';
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  audioUrl: string;
  videoId?: string;
}

interface CyberSearchProps {
  localTracks: Track[];
}

function formatDuration(s?: string | number | undefined): string {
  if (!s) return '--:--';
  if (typeof s === 'number') {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }
  return s;
}

function normalizeDuration(d?: string | number): number {
  if (!d) return 0;
  if (typeof d === 'number') return d;
  const parts = String(d).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
  if (parts.length === 2) return parts[0] * 60 + (parts[1] || 0);
  return Number(d) || 0;
}

export default function CyberSearch({ localTracks }: CyberSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  // Map of result.id → true (first load failed, retrying with lower quality)
  const [retriedThumbs, setRetriedThumbs] = useState<Set<string>>(new Set());
  // Map of result.id → true (all qualities exhausted, show gradient)
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ytQuery, setYtQuery] = useState('');
  const queryClient = useQueryClient();

  const { playTrack, tracks } = useMusicStore();
  const { data: ytResults, isLoading: ytLoading } = useYouTubeSearch(ytQuery, open && ytQuery.trim().length >= 2);

  // Returns a thumbnail URL with the quality suffix swapped, e.g.
  //   hqdefault.jpg → mqdefault.jpg
  // YouTube's CDN serves smaller variants more reliably on production
  // referrers (large `maxresdefault` requests are sometimes blocked
  // or redirected by anti-hotlink rules). This is the same fallback
  // strategy used by the YouTube IFrame API.
  const downgradeYouTubeThumb = (url: string): string => {
    return url
      .replace('/maxresdefault.jpg', '/hqdefault.jpg')
      .replace('/hqdefault.jpg', '/mqdefault.jpg')
      .replace('/sddefault.jpg', '/mqdefault.jpg');
  };

  // ── Debounce query for YouTube API calls ────────────────────────────
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    // Eagerly start loading the YouTube IFrame API the moment the
    // user types — so by the time they click a result, the YT.Player
    // constructor is already available and `handleYouTubeTrack` can
    // run inside the click's user-gesture window without needing the
    // API-ready → setTimeout fallback (which used to wait 500ms and
    // fall outside the gesture window, silently failing autoplay).
    if (typeof window !== 'undefined') {
      void loadYouTubeAPI();
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setYtQuery(value);
    }, 300);
  }, []);

  // ── Memoized combined results ───────────────────────────────────────
  const results = useMemo((): SearchResult[] => [
    ...localTracks
      .filter(
        (t) =>
          !query ||
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5)
      .map((t): SearchResult => ({
        type: 'local',
        id: `local-${t.id}`,
        title: t.title,
        artist: t.artist,
        thumbnail: t.coverImage || '',
        duration: t.duration,
        audioUrl: t.audioUrl,
      })),
    ...(ytResults?.data || []).map((r): SearchResult => ({
      type: 'youtube',
      id: `yt-${r.videoId}`,
      title: r.title,
      artist: r.artist,
      thumbnail: r.thumbnail,
      duration: r.duration,
      audioUrl: `https://www.youtube.com/watch?v=${r.videoId}`,
      videoId: r.videoId,
    })),
  ], [localTracks, query, ytResults]);

  const totalResults = results.length;

  // ── Stable keyboard handler ───────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const idx = focusedIdx >= 0 ? focusedIdx : 0;
        if (results[idx]) {
          e.preventDefault();
          handleSelect(results[idx]);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
        setFocusedIdx(-1);
      }
    },
    [open, focusedIdx, totalResults, results],
  );

  const handleSelect = async (result: SearchResult) => {
    if (result.type === 'local') {
      // Play from existing local tracks
      const track = localTracks.find((t) => String(t.id) === result.id.replace('local-', ''));
      if (track) playTrack(track);
    } else {
      // YouTube: register the track in backend DB FIRST so it survives
      // page reloads and shows up in the regular `useTracks` list
      // (otherwise navigating to /music → back to /music/now-playing
      // would clobber the YT track from the store and auto-play the
      // first library track from the beginning). See
      // backend/src/routes/music.routes.ts `/tracks/remote`.
      const ytId = `yt-${result.videoId}`;
      const trackData: Track = {
        id: ytId,
        title: result.title,
        artist: result.artist,
        coverImage: result.thumbnail,
        audioUrl: result.audioUrl,
        duration: result.duration || '0:00',
        durationSeconds: normalizeDuration(result.duration),
      };

      // ── PLAY FIRST (within the click gesture) ──────────────────
      // CRITICAL: do NOT await the network before playing. The
      // YouTube IFrame player can only autoplay inside the user-gesture
      // window; awaiting POST /tracks/remote first consumed that window,
      // so the very first YouTube pick was silent until the user had
      // already interacted with the player (e.g. played a local track).
      // We register + play synchronously here, then persist in the
      // background below.
      const currentTracks = useMusicStore.getState().tracks;
      if (!currentTracks.find((t) => t.id === trackData.id)) {
        useMusicStore.setState({ tracks: [...currentTracks, trackData] });
      }
      const fresh = useMusicStore.getState().tracks;
      const idx = fresh.findIndex((t) => t.id === trackData.id);
      useMusicStore.getState().playTrackAtIndex(idx >= 0 ? idx : fresh.length - 1);

      // ── PERSIST IN BACKGROUND ──────────────────────────────────
      // Register the YT track as a real DB row so it survives reloads
      // and shows up in the regular track list. We intentionally do NOT
      // mutate the now-playing track's id (changing currentTrack.id mid-
      // play would reload the player and restart from 0). The DB row is
      // picked up on the next page load via the invalidated tracks query.
      void (async () => {
        try {
          const res = await fetch('/api/v1/music/tracks/remote', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: trackData.title,
              artist: trackData.artist,
              audioUrl: trackData.audioUrl,
              coverImage: trackData.coverImage,
              durationSeconds: trackData.durationSeconds,
              source: 'youtube',
              videoId: result.videoId,
            }),
          });
          if (res.ok) {
            queryClient.invalidateQueries({ queryKey: musicKeys.tracks() });
          }
        } catch {
          // Network/backend down — playback already works from the store.
        }
      })();
    }
    setOpen(false);
    setQuery('');
    setFocusedIdx(-1);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search input */}
      <motion.div
        className="relative flex items-center"
        animate={{ scale: open ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute left-3.5 flex items-center pointer-events-none"
        >
          {ytLoading ? (
            <motion.div
              className="w-4 h-4 border-2 rounded-full"
              style={{ borderColor: C.primary, borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            handleQueryChange(e.target.value);
            setOpen(true);
            setFocusedIdx(-1);
          }}
          onFocus={() => {
            // Preload the YT API on focus so the first click on a
            // YouTube result lands inside the gesture window.
            if (typeof window !== 'undefined') void loadYouTubeAPI();
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search local tracks or YouTube..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${open ? C.primary : 'rgba(139,92,246,0.15)'}`,
            color: C.text,
            boxShadow: open ? `0 0 20px rgba(139,92,246,0.15)` : 'none',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </motion.div>

      {/* Results dropdown */}
      <AnimatePresence>
        {open && query.trim().length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(15,23,42,0.95)',
              backdropFilter: 'blur(24px)',
              border: `1px solid rgba(139,92,246,0.2)`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: C.primary }}>
                {totalResults > 0 ? `${totalResults} result${totalResults !== 1 ? 's' : ''}` : 'No results'}
              </span>
              <div className="flex items-center gap-2">
                {ytResults?.data && ytResults.data.length > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${C.primary}15`, color: C.primary }}>
                    YouTube
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${C.secondary}15`, color: C.secondary }}>
                  Local
                </span>
              </div>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto py-1">
              {totalResults === 0 && !ytLoading && (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.5" opacity="0.4">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="text-xs font-mono mt-3" style={{ color: C.textMuted }}>
                    No tracks found for &quot;{query}&quot;
                  </p>
                </div>
              )}

              {results.map((result, idx) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all group"
                  style={{
                    background: focusedIdx === idx ? `${C.primary}12` : 'transparent',
                    borderLeft: focusedIdx === idx ? `2px solid ${C.primary}` : '2px solid transparent',
                  }}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setFocusedIdx(idx)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md bg-black/40">
                    {result.thumbnail && !failedThumbs.has(result.id) ? (
                      // Plain <img> instead of next/image so we can
                      // attach referrerPolicy="no-referrer" (YouTube
                      // CDN sometimes blocks hot-linked requests when
                      // the referer is a production domain).
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={retriedThumbs.has(result.id) ? downgradeYouTubeThumb(result.thumbnail) : result.thumbnail}
                        alt={result.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          const isYT = result.type === 'youtube';
                          if (isYT && !retriedThumbs.has(result.id)) {
                            // First failure: downgrade to hqdefault
                            setRetriedThumbs((prev) => new Set(prev).add(result.id));
                          } else {
                            // Second failure or local track: show gradient
                            setFailedThumbs((prev) => new Set(prev).add(result.id));
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}
                      >
                        <span className="text-white/50 font-bold text-sm">{result.title.charAt(0)}</span>
                      </div>
                    )}
                    {result.type === 'youtube' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.4)' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold font-mono truncate" style={{ color: C.text }}>
                      {result.title}
                    </p>
                    <p className="text-[11px] font-mono truncate" style={{ color: C.textMuted }}>
                      {result.artist}
                    </p>
                  </div>

                  {/* Type badge + duration */}
                  <div className="flex items-center gap-2 shrink-0">
                    {result.type === 'youtube' && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: '#FF000020', color: '#FF0000' }}>
                        YT
                      </span>
                    )}
                    {result.type === 'local' && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${C.secondary}15`, color: C.secondary }}>
                        LOCAL
                      </span>
                    )}
                    <span className="text-[11px] font-mono tabular-nums" style={{ color: C.textMuted }}>
                      {formatDuration(result.duration)}
                    </span>
                  </div>

                  {/* Play icon on hover */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {totalResults > 0 && (
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
              >
                <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: C.textMuted }}>
                  <span>↑↓ navigate</span>
                  <span>↵ play</span>
                  <span>esc close</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
