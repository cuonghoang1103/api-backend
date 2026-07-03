'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Disc3, RefreshCw, Headphones } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/providers/ClientOnly';
import ClubBackground from '@/components/music/remix/ClubBackground';
import DjDeck from '@/components/music/remix/DjDeck';
import { useMusicStore } from '@/store/musicStore';
import { useTracks } from '@/hooks/useMusicQueries';

const NEON_A = '#c026d3';
const NEON_B = '#06b6d4';

// Shared header toggle so /music and /music/remix feel like one page
// with two modes. Kept here (not a shared import) to avoid touching the
// existing MusicClient layout more than necessary.
function ModeToggle({ active }: { active: 'normal' | 'remix' }) {
  const base =
    'px-4 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all';
  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Link
        href="/music"
        className={base}
        style={
          active === 'normal'
            ? { background: `${NEON_B}22`, color: NEON_B, border: `1px solid ${NEON_B}55` }
            : { color: 'rgba(255,255,255,0.55)' }
        }
      >
        Nhạc thường
      </Link>
      <Link
        href="/music/remix"
        className={base}
        style={
          active === 'remix'
            ? { background: `${NEON_A}22`, color: NEON_A, border: `1px solid ${NEON_A}55` }
            : { color: 'rgba(255,255,255,0.55)' }
        }
      >
        Remix
      </Link>
    </div>
  );
}

export default function RemixClient() {
  const setTracks = useMusicStore((s) => s.setTracks);
  const [isMounted, setIsMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useTracks({ size: 100, category: 'REMIX' });

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    refetch();
  }, [isMounted, refetch]);

  // Push the remix list into the shared store WITHOUT clobbering the
  // currently-playing track/position. Same id+length guard as MusicClient.
  useEffect(() => {
    if (!isMounted) return;
    const newTracks = data?.data;
    if (!newTracks) return;

    const cur = useMusicStore.getState().currentTrack;
    const finalTracks =
      cur && !newTracks.some((t) => t.id === cur.id) ? [...newTracks, cur] : newTracks;

    const currentTracks = useMusicStore.getState().tracks;
    if (currentTracks.length === finalTracks.length) {
      let same = true;
      for (let i = 0; i < finalTracks.length; i++) {
        if (currentTracks[i]?.id !== finalTracks[i]?.id) { same = false; break; }
      }
      if (same) return;
    }
    setTracks(finalTracks);
  }, [data, isMounted, setTracks]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const remixTracks = data?.data ?? [];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#05030c' }}>
      {/* Animated nightclub backdrop */}
      <ClientOnly>
        <ClubBackground />
      </ClientOnly>

      <div className="relative z-10 flex flex-col min-h-screen pt-[7rem] pb-28">
        {/* Sticky header below the global Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-[4.5rem] z-20 w-full"
        >
          <div
            className="px-4 sm:px-6 py-3"
            style={{
              background: 'rgba(10,6,16,0.7)',
              borderBottom: `1px solid ${NEON_A}55`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap max-w-6xl mx-auto">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${NEON_A}, ${NEON_B})`, boxShadow: `0 0 20px ${NEON_A}66` }}
                >
                  <Disc3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1
                    className="text-base font-black leading-none font-mono tracking-wide"
                    style={{
                      background: `linear-gradient(90deg, ${NEON_A}, ${NEON_B})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    REMIX BOOTH
                  </h1>
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/40">
                    DJ RX3 · Live Deck
                  </p>
                </div>
              </div>

              <ModeToggle active="remix" />

              <div className="flex items-center gap-2">
                <Link href="/music/now-playing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{ background: `${NEON_B}15`, border: `1px solid ${NEON_B}33`, color: NEON_B }}
                    title="Now playing"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refresh}
                  disabled={refreshing || isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all disabled:opacity-40"
                  style={{ background: `${NEON_A}15`, border: `1px solid ${NEON_A}33`, color: NEON_A }}
                  title="Tải lại"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main deck */}
        <main className="flex-1 px-4 sm:px-6 pt-6">
          {isLoading && (
            <div className="flex items-center justify-center h-64 gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{ background: NEON_A }}
                  animate={{ height: [6, 32, 6] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-sm font-mono text-white/60">Không tải được danh sách remix</p>
              <button
                onClick={refresh}
                className="px-4 py-2 rounded-lg text-xs font-mono text-white"
                style={{ background: `linear-gradient(135deg, ${NEON_A}, ${NEON_B})` }}
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <ClientOnly>
                <DjDeck tracks={remixTracks} />
              </ClientOnly>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
