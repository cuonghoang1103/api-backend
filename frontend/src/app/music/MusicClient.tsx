'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Headphones, RefreshCw, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/providers/ClientOnly';
import CyberBackground from '@/components/music/CyberBackground';
import CyberPlayer from '@/components/music/CyberPlayer';
import CyberPlaylist from '@/components/music/CyberPlaylist';
import CyberSearch from '@/components/music/CyberSearch';
import PlaylistSection from '@/components/music/PlaylistSection';
import PlaylistView from '@/components/music/PlaylistView';
import PlaylistDrawer from '@/components/music/PlaylistDrawer';
import { useMusicStore } from '@/store/musicStore';
import { useTracks } from '@/hooks/useMusicQueries';
import type { PlaylistSummary } from '@/types';

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  dark: '#0f172a',
};

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
            {[0, 1, 2, 3].map((i) => (
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
  const setTracks = useMusicStore((s) => s.setTracks);
  const storeTracks = useMusicStore((s) => s.tracks);
  const recentlyPlayed = useMusicStore((s) => s.recentlyPlayed);

  const [isMounted, setIsMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);

  // TanStack Query — replaces manual fetch with caching
  // Regular library only — REMIX tracks live on the /music/remix deck and
  // must never appear here (or in the "Tất cả" listing). Backend already
  // defaults to NORMAL, but we pass it explicitly for clarity + cache split.
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useTracks({ size: 100, category: 'NORMAL' });

  // ── Manual refetch on every /music mount ──
  // The user reports that the YouTube track they played on /music is
  // LOST when they navigate to /music/now-playing and back. Root cause:
  // the store's tracks list is clobbered by the new query result if its
  // length doesn't match (the YouTube track isn't yet in the server
  // list, or the query is served from cache that's older than the
  // user's recent /tracks/remote registration). Forcing a refetch here
  // makes sure the latest track list (including any YouTube tracks
  // registered via the search bar's /tracks/remote call) is loaded.
  useEffect(() => {
    if (!isMounted) return;
    refetch();
  }, [isMounted, refetch]);

  // Sync TanStack Query results → Zustand store.
  //
  // CRITICAL: this must NOT clobber the current playback state when the
  // user navigates back to /music. The TanStack Query cache is reused
  // across mounts, so `data` is a NEW object reference on every render
  // (because of `dataUpdatedAt`). Without a guard, `setTracks` would
  // fire on every page revisit, producing a fresh `currentTrack` object
  // that breaks the `===` reference check inside MusicAudioController
  // and forces the audio element to re-load from time 0.
  //
  // We only call `setTracks` when the underlying track list is actually
  // different from what the store already has (compared by id + length).
  useEffect(() => {
    if (!isMounted) return;
    const newTracks = data?.data;
    if (!newTracks) return;

    // Pass the NORMAL list as-is. We deliberately do NOT merge the
    // currently-playing track back in: if a REMIX track is playing
    // (started on /music/remix), appending it here would leak it into
    // the normal deck's list. The store's setTracks already keeps
    // playback smooth on its own — a same-bucket track that's missing
    // (e.g. a just-searched YouTube track) is re-appended there, while
    // a cross-bucket (remix) track keeps playing WITHOUT joining this
    // list. See musicStore.setTracks cross-section handling.
    const currentTracks = useMusicStore.getState().tracks;
    if (currentTracks.length === newTracks.length) {
      let same = true;
      for (let i = 0; i < newTracks.length; i++) {
        if (currentTracks[i]?.id !== newTracks[i]?.id) { same = false; break; }
      }
      if (same) return; // Skip — no real change, keep current playback state
    }
    setTracks(newTracks);
  }, [data, isMounted, setTracks]);

  useEffect(() => { setIsMounted(true); }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (!isMounted) return <CyberShell />;

  const showEmpty = !isLoading && !isError && storeTracks.length === 0;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #1e1b4b 40%, ${C.dark} 100%)`,
        cursor: 'crosshair',
      }}
    >
      {/* Scanlines */}
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

      {/* Main content — padded to clear Navbar + sticky header */}
      <div className="relative z-10 flex flex-col min-h-screen pt-[8rem] pb-28 sm:pb-0">
      {/* iOS Cyber Dock — sticky glass header BELOW Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-[4.5rem] z-20 w-full"
      >
          <div
            className="px-4 sm:px-6 py-3 mx-0 sm:mx-0"
            style={{
              background: 'rgba(10,15,13,0.72)',
              borderBottom: '1px solid rgba(14,165,233,0.35)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                    boxShadow: `0 0 20px rgba(139,92,246,0.3)`,
                  }}
                >
                  <Headphones className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1
                    className="text-base font-black leading-none font-mono tracking-wide"
                    style={{
                      background: `linear-gradient(90deg, #0ea5e9, #a855f7)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 24px rgba(14,165,233,0.4)',
                    }}
                  >
                    CYBER_MUSIC
                  </h1>
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: C.textMuted }}>
                    Neural Audio Matrix v2.0
                  </p>
                </div>
              </div>

              {/* Mode toggle: regular library ↔ Remix booth */}
              <div
                className="inline-flex items-center gap-1 p-1 rounded-xl shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase"
                  style={{ background: `${C.secondary}22`, color: C.secondary, border: `1px solid ${C.secondary}55` }}
                >
                  Nhạc thường
                </span>
                <Link
                  href="/music/remix"
                  className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Remix
                </Link>
              </div>

              {/* Unified Search */}
              <div className="flex-1 max-w-xs w-full md:w-auto order-last md:order-none mt-2 md:mt-0">
                <CyberSearch localTracks={storeTracks} />
              </div>

              {/* Stats */}
              <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono shrink-0" style={{ color: C.textMuted }}>
                <span style={{ color: C.primary }}>{storeTracks.length}</span>
                <span>tracks</span>
                <span style={{ opacity: 0.2 }}>|</span>
                <span style={{ color: C.secondary }}>{recentlyPlayed.length}</span>
                <span>played</span>
                <span style={{ opacity: 0.2 }}>|</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span style={{ color: '#4ade80', letterSpacing: '0.1em' }}>ONLINE</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile search toggle */}
                <Link href="/music/now-playing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all md:hidden"
                    style={{
                      background: `${C.secondary}15`,
                      border: `1px solid rgba(6,182,212,0.2)`,
                      color: C.secondary,
                    }}
                    title="Full-screen now playing"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refresh}
                  disabled={refreshing || isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all disabled:opacity-40"
                  style={{
                    background: `${C.primary}15`,
                    border: `1px solid rgba(139,92,246,0.15)`,
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
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
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
        <main className="flex-1 px-4 sm:px-6 pb-28">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex items-center justify-center h-64 gap-4">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
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
          {!isLoading && isError && (
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
          {!isLoading && !isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto"
            >
              {activePlaylistId !== null ? (
                /* Playlist detail view */
                <PlaylistView
                  playlistId={activePlaylistId}
                  onBack={() => setActivePlaylistId(null)}
                />
              ) : (
                <>
                  {/* Playlist section */}
                  <div className="mb-8">
                    <PlaylistSection
                      onPlaylistClick={(pl) => setActivePlaylistId(pl.id)}
                    />
                  </div>

                  {/* Track list + Player */}
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
                </>
              )}

              {/* Empty state */}
              {showEmpty && activePlaylistId === null && (
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

      {/* Playlist drawer */}
      <ClientOnly>
        <PlaylistDrawer />
      </ClientOnly>
    </div>
  );
}
