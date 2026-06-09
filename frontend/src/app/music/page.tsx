'use client';

/**
 * MusicPage — stable hydration-safe page shell.
 *
 * The previous version used `require()` inside render, which can create
 * unpredictable module loading during hydration. This version keeps all
 * heavy components imported statically, but mounted only after `isMounted`
 * and wrapped in `ClientOnly` to keep the render tree stable.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Headphones, MoonStar, CloudSun, RefreshCw, ListMusic } from 'lucide-react';
import ClientOnly from '@/components/providers/ClientOnly';
import PremiumBackground from '@/components/music/PremiumBackground';
import PremiumNowPlaying from '@/components/music/PremiumNowPlaying';
import PremiumPlaylist from '@/components/music/PremiumPlaylist';
import PlaylistDrawer from '@/components/music/PlaylistDrawer';
import MiniPlayer from '@/components/music/MiniPlayer';
import { useMousePosition } from '@/components/music/useMousePosition';
import { useMusicStore } from '@/store/musicStore';
import { usePlaylistStore } from '@/store/playlistStore';
import type { Track } from '@/types';

function formatSeconds(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function isValidAudioUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  // Accept any http/https URL.
  // These may come from VPS-hosted `/uploads` or another public source.
  if (url.startsWith('http')) return true;
  return false;
}

function buildTrackPlaybackUrl(rawTrack: any): string {
  if (typeof rawTrack?.audioUrl === 'string' && rawTrack.audioUrl.trim()) {
    return rawTrack.audioUrl;
  }

  if (typeof rawTrack?.localPath === 'string' && rawTrack.localPath.trim()) {
    const normalized = rawTrack.localPath.replace(/^\/+/, '');
    return `/uploads/${normalized}`;
  }

  if (rawTrack?.id) {
    return `/api/v1/music/stream/${rawTrack.id}`;
  }

  return '';
}

async function fetchBackendTracks(): Promise<Track[]> {
  try {
    const res = await fetch('/api/v1/music/tracks', {
      credentials: 'include',
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn('[MusicPage] fetchBackendTracks: HTTP', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    const raw = Array.isArray(data.data) ? data.data : [];

    if (raw.length === 0) {
      console.info('[MusicPage] fetchBackendTracks: no tracks from API, data=', data);
    } else {
      console.info(`[MusicPage] fetchBackendTracks: ${raw.length} tracks loaded`);
    }

    return raw
      .filter((t: any) => Boolean(t?.id))
      .map((t: any) => ({
        id: String(t.id ?? ''),
        title: String(t.title ?? 'Unknown'),
        artist: String(t.artist ?? 'Unknown'),
        duration: formatSeconds(typeof t.durationSeconds === 'number' ? t.durationSeconds : undefined),
        durationSeconds: typeof t.durationSeconds === 'number' ? t.durationSeconds : undefined,
        audioUrl: buildTrackPlaybackUrl(t),
        coverImage: typeof t.coverImage === 'string' ? t.coverImage : '',
        localPath: typeof t.localPath === 'string' ? t.localPath : undefined,
        fileSize: typeof t.fileSize === 'number' ? t.fileSize : undefined,
        active: typeof t.active === 'boolean' ? t.active : undefined,
        createdAt: typeof t.createdAt === 'string' ? t.createdAt : undefined,
      }));
  } catch (err) {
    console.error('[MusicPage] fetchBackendTracks error:', err);
    return [];
  }
}

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  glow: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(15,10,30,0.75)',
  border: 'rgba(168,85,247,0.15)',
  text: '#f8fafc',
  textMuted: '#64748b',
} as const;

function MusicPageShell({ isNight }: { isNight: boolean }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0535 40%, #0f0025 70%, #050010 100%)' }}>
      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-30"
        >
          <div
            className="px-4 sm:px-6 py-3"
            style={{
              background: C.glassBg,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 0 20px ${C.glow}` }}
                  animate={{ boxShadow: [`0 0 20px ${C.glow}`, `0 0 40px ${C.glow}`, `0 0 20px ${C.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Headphones className="w-4.5 h-4.5 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold leading-none" style={{ background: `linear-gradient(135deg, ${C.text}, ${C.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Music Vibes
                  </h1>
                  <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textMuted }}>
                    Anime Chill Coding
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]" style={{ background: isNight ? `${C.primary}15` : 'rgba(99,102,241,0.1)', border: `1px solid ${C.border}`, color: isNight ? C.primary : '#6366f1' }}>
                {isNight ? <MoonStar className="w-3 h-3" /> : <CloudSun className="w-3 h-3" />}
                <span className="hidden sm:inline">{isNight ? 'Night' : 'Day'}</span>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 px-4 sm:px-6 py-6 pb-28">
          <div className="flex items-center justify-center h-64">
            <motion.div className="flex flex-col items-center gap-3" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm" style={{ color: C.textMuted }}>Loading vibes...</span>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MusicPage() {
  const mouse = useMousePosition();
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isNight, setIsNight] = useState(false);
  const storeSetTracks = useMusicStore((s) => s.setTracks);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const check = () => setIsNight(new Date().getHours() < 6 || new Date().getHours() >= 18);
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const loadTracks = useCallback(async () => {
    if (!isMounted) return;
    setIsReady(false);
    setHasError(false);
    setErrorMsg('');

    try {
      const result = await fetchBackendTracks();
      const payload = {
        tracks: result,
        hasStreamUrls: result.filter((track) => track.audioUrl).length,
        hasLocalPaths: result.filter((track) => track.localPath).length,
      };
      console.info('[MusicPage] normalized tracks payload:', payload);
      setTracks(result);
      storeSetTracks(result);
    } catch {
      setHasError(true);
      setErrorMsg('Không thể tải danh sách nhạc. Vui lòng thử lại.');
      setTracks([]);
    } finally {
      setIsReady(true);
    }
  }, [isMounted, storeSetTracks]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  if (!isMounted) {
    return <MusicPageShell isNight={false} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClientOnly>
        <PremiumBackground mouseX={mouse.x} mouseY={mouse.y} />
      </ClientOnly>

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-30"
        >
          <div
            className="px-4 sm:px-6 py-3"
            style={{
              background: C.glassBg,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 0 20px ${C.glow}` }}
                  animate={{ boxShadow: [`0 0 20px ${C.glow}`, `0 0 40px ${C.glow}`, `0 0 20px ${C.glow}`] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Headphones className="w-4.5 h-4.5 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold leading-none" style={{ background: `linear-gradient(135deg, ${C.text}, ${C.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Music Vibes
                  </h1>
                  <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: C.textMuted }}>
                    Anime Chill Coding
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]" style={{ background: isNight ? `${C.primary}15` : 'rgba(99,102,241,0.1)', border: `1px solid ${C.border}`, color: isNight ? C.primary : '#6366f1' }}>
                {isNight ? <MoonStar className="w-3 h-3" /> : <CloudSun className="w-3 h-3" />}
                <span className="hidden sm:inline">{isNight ? 'Night' : 'Day'}</span>
              </div>
              <PlaylistButton />
            </div>
          </div>
        </motion.header>

        <main className="flex-1 px-4 sm:px-6 py-6 pb-28">
          {!isReady && (
            <div className="flex items-center justify-center h-64">
              <motion.div className="flex flex-col items-center gap-3" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm" style={{ color: C.textMuted }}>Loading vibes...</span>
              </motion.div>
            </div>
          )}

          {isReady && hasError && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${C.primary}20` }}>
                <Headphones className="w-6 h-6" style={{ color: C.primary }} />
              </div>
              <p className="text-sm text-center max-w-sm" style={{ color: C.textMuted }}>{errorMsg}</p>
              <button
                onClick={loadTracks}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
              >
                Thử lại
              </button>
            </div>
          )}

          {isReady && !hasError && (
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-5 xl:gap-6 items-start">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full lg:w-[38%] xl:w-[35%] shrink-0">
                  <ClientOnly>
                    <PremiumPlaylist isNight={isNight} />
                  </ClientOnly>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="flex-1 w-full">
                  <ClientOnly>
                    <PremiumNowPlaying isNight={isNight} />
                  </ClientOnly>
                </motion.div>
              </div>
              {tracks.length === 0 && (
                <div className="mt-8 text-center text-sm" style={{ color: C.textMuted }}>
                  Chưa có track nào để phát.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ClientOnly>
        <MiniPlayer isNight={isNight} />
      </ClientOnly>
      <ClientOnly>
        <PlaylistDrawer />
      </ClientOnly>
    </div>
  );
}

function PlaylistButton() {
  const openDrawer = usePlaylistStore((s) => s.openDrawer);
  const playlistCount = usePlaylistStore((s) => s.playlists.length);

  return (
    <button
      onClick={openDrawer}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] transition-all hover:scale-105"
      style={{
        background: `${C.primary}15`,
        border: `1px solid ${C.border}`,
        color: C.primary,
      }}
    >
      <ListMusic className="w-3 h-3" />
      <span className="hidden sm:inline">Playlists</span>
      {playlistCount > 0 && (
        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: C.primary, color: '#fff' }}>
          {playlistCount}
        </span>
      )}
    </button>
  );
}
