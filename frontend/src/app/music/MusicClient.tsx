'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, RefreshCw, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/providers/ClientOnly';
import CyberBackground from '@/components/music/CyberBackground';
import CyberPlayer from '@/components/music/CyberPlayer';
import CyberPlaylist from '@/components/music/CyberPlaylist';
import { useMusicStore } from '@/store/musicStore';
import type { Track } from '@/types';

function formatSeconds(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function buildTrackPlaybackUrl(rawTrack: unknown): string {
  const t = rawTrack as Record<string, unknown> | undefined;
  if (!t) return '';
  if (typeof t.audioUrl === 'string' && t.audioUrl.trim()) {
    return t.audioUrl;
  }
  if (typeof t.localPath === 'string' && t.localPath.trim()) {
    const normalized = t.localPath.replace(/^\/+/, '');
    return `/uploads/${normalized}`;
  }
  if (typeof t.id === 'number' || typeof t.id === 'string') {
    return `/api/v1/music/stream/${t.id}`;
  }
  return '';
}

async function fetchBackendTracks(signal?: AbortSignal): Promise<Track[]> {
  try {
    const res = await fetch('/api/v1/music/tracks', {
      credentials: 'include',
      signal,
    });
    if (!res.ok) {
      console.warn('[MusicPage] fetchBackendTracks HTTP error:', res.status);
      return [];
    }
    const data = await res.json();
    const raw = Array.isArray(data.data) ? data.data : [];
    return raw
      .filter((t: unknown) => Boolean((t as Record<string, unknown>)?.id))
      .map((t: unknown) => {
        const r = t as Record<string, unknown>;
        return {
          id: String(r.id ?? ''),
          title: String(r.title ?? 'Unknown'),
          artist: String(r.artist ?? 'Unknown'),
          duration: formatSeconds(typeof r.durationSeconds === 'number' ? r.durationSeconds : undefined),
          durationSeconds: typeof r.durationSeconds === 'number' ? r.durationSeconds : undefined,
          audioUrl: buildTrackPlaybackUrl(t),
          coverImage: typeof r.coverImage === 'string' ? r.coverImage : '',
          localPath: typeof r.localPath === 'string' ? r.localPath : undefined,
          fileSize: typeof r.fileSize === 'number' ? r.fileSize : undefined,
          active: typeof r.active === 'boolean' ? r.active : undefined,
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : undefined,
        } satisfies Track;
      });
  } catch (err) {
    if (signal?.aborted) return [];
    console.error('[MusicPage] fetchBackendTracks error:', err);
    console.error('[MusicPage] Error stack:', (err as Error)?.stack);
    console.error('[MusicPage] Error name:', (err as Error)?.name);
    return [];
  }
}

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  glow: 'rgba(139,92,246,0.15)',
  glassBg: 'rgba(15,23,42,0.75)',
  border: 'rgba(139,92,246,0.15)',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  dark: '#0f172a',
} as const;

function CyberShell() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${C.dark} 0%, #1e1b4b 40%, ${C.dark} 100%)` }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              boxShadow: `0 0 40px rgba(139,92,246,0.4)`,
            }}
          >
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-mono" style={{ color: C.textMuted }}>
            Initializing audio matrix...
          </span>
          <div className="flex gap-1">
            {[0,1,2,3].map(i => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: C.primary }}
                animate={{ height: [4, 20, 4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CyberMusicPage() {
  // Stable ref to store setTracks so the effect doesn't re-run on every render
  const setTracks = useMusicStore((s) => s.setTracks);
  const storeTracks = useMusicStore((s) => s.tracks);
  const recentlyPlayed = useMusicStore((s) => s.recentlyPlayed);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Use store's tracks as source of truth (never local state)
  const tracks = storeTracks;

  // Ref to avoid stale closure in AbortController
  const abortRef = useRef<AbortController | null>(null);

  const loadTracks = useCallback(async (isRefresh = false) => {
    if (!isMounted) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!isRefresh) setIsLoading(true);
    setLoadFailed(false);

    try {
      const result = await fetchBackendTracks(controller.signal);
      if (controller.signal.aborted) return;

      console.log('[MusicPage] loadTracks result count:', result.length, 'first:', result[0]?.title);
      // Always call store.setTracks with the fresh result
      setTracks(result);
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error('[MusicPage] loadTracks catch error:', err);
        setLoadFailed(true);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setRefreshing(false);
      }
    }
  }, [isMounted, setTracks]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadTracks(true);
  }, [loadTracks]);

  // Load on mount; don't put loadTracks in deps — it's stable via ref
  useEffect(() => {
    setIsMounted(true);
    loadTracks();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isMounted) return <CyberShell />;

  const showEmpty = !isLoading && !loadFailed && tracks.length === 0;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #1e1b4b 40%, ${C.dark} 100%)`,
        cursor: 'crosshair',
      }}
    >
      {/* Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Animated background */}
      <ClientOnly>
        <CyberBackground />
      </ClientOnly>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30"
        >
          <div
            className="px-4 sm:px-6 py-3"
            style={{
              background: 'rgba(15,23,42,0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    boxShadow: `0 0 20px rgba(139,92,246,0.3)`,
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(139,92,246,0.3)',
                      '0 0 40px rgba(6,182,212,0.4)',
                      '0 0 20px rgba(236,72,153,0.3)',
                      '0 0 20px rgba(139,92,246,0.3)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Headphones className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <h1
                    className="text-lg font-bold leading-none font-mono"
                    style={{
                      background: `linear-gradient(90deg, ${C.primary}, ${C.secondary}, ${C.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    CYBER_MUSIC
                  </h1>
                  <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: C.textMuted }}>
                    Neural Audio Matrix v2.0
                  </p>
                </div>
              </div>

              {/* Stats bar */}
              <div className="hidden md:flex items-center gap-4 text-xs font-mono" style={{ color: C.textMuted }}>
                <span>
                  <span style={{ color: C.primary }}>{tracks.length}</span> tracks
                </span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span>
                  <span style={{ color: C.secondary }}>{recentlyPlayed.length}</span> played
                </span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span style={{ color: '#4ade80' }}>ONLINE</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refresh}
                  disabled={refreshing || isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all disabled:opacity-40"
                  style={{
                    background: `${C.primary}15`,
                    border: `1px solid ${C.border}`,
                    color: C.primary,
                  }}
                  title="Refresh tracks"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">SCAN</span>
                </motion.button>

                <Link href="/music/now-playing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                      background: `${C.secondary}15`,
                      border: `1px solid rgba(6,182,212,0.2)`,
                      color: C.secondary,
                    }}
                    title="Full-screen now playing"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">NOW PLAYING</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-28">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex items-center justify-center h-64 gap-4">
              <div className="flex gap-1">
                {[0,1,2,3,4].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{ background: C.primary }}
                    animate={{ height: [6, 32, 6] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono" style={{ color: C.textMuted }}>
                Loading audio matrix...
              </span>
            </div>
          )}

          {/* Network error */}
          {!isLoading && loadFailed && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-4xl" style={{ filter: 'hue-rotate(270deg)' }}>⚠</div>
              <p className="text-sm font-mono" style={{ color: C.textMuted }}>
                Matrix corrupted — failed to load tracks
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refresh}
                className="px-4 py-2 rounded-lg text-xs font-mono text-white"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
              >
                RETRY CONNECTION
              </motion.button>
            </div>
          )}

          {/* Content: loaded or empty */}
          {!isLoading && !loadFailed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Left: Playlist */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full xl:w-[38%] xl:shrink-0"
                >
                  <ClientOnly>
                    <CyberPlaylist />
                  </ClientOnly>
                </motion.div>

                {/* Right: Player */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex-1 w-full"
                >
                  <ClientOnly>
                    <CyberPlayer />
                  </ClientOnly>
                </motion.div>
              </div>

              {/* Empty state */}
              {showEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center"
                >
                  <p className="text-sm font-mono mb-2" style={{ color: C.textMuted }}>
                    No tracks detected in the matrix.
                  </p>
                  <p className="text-xs font-mono" style={{ color: C.textMuted, opacity: 0.5 }}>
                    Upload audio files via{' '}
                    <a href="/admin/music" style={{ color: C.primary }} className="underline">
                      admin/music
                    </a>{' '}
                    to populate the system.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
