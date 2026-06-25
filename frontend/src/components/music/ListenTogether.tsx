'use client';

/**
 * ============================================================
 * ListenTogether (Phase 3) — UI to host/join a listening room
 * ============================================================
 *
 * A button + slide-up panel. Reuses the existing singleton socket
 * (connectSocket) and the listen-together store. The actual playback
 * sync is handled globally by <ListenTogetherSync/>.
 *
 * Host: creates a room → gets a 6-char code to share. Guest: enters a
 * code to join and immediately syncs to the host's playback.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Copy, LogOut, Users, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMusicStore } from '@/store/musicStore';
import { useListenTogetherStore } from '@/store/listenTogetherStore';
import {
  connectSocket,
  listenCreate,
  listenJoin,
  listenLeave,
  type ListenState,
  type ListenTrackMeta,
} from '@/lib/socket';

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  muted: '#94a3b8',
};

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

// Apply the room's initial state right after joining (guest).
function applyInitial(state: ListenState | undefined) {
  if (!state) return;
  const music = useMusicStore.getState();
  if (state.track && music.currentTrack?.id !== String(state.track.id)) {
    music.playTrack({
      id: String(state.track.id),
      title: state.track.title,
      artist: state.track.artist,
      audioUrl: state.track.audioUrl ?? '',
      coverImage: state.track.coverImage ?? '',
      duration: '0:00',
      durationSeconds: state.track.durationSeconds ?? undefined,
    } as any);
  }
  if (state.isPlaying) music.play();
  else music.pause();
  if (state.positionSec > 0) music.setCurrentTime(state.positionSec);
}

export default function ListenTogether() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);

  const roomId = useListenTogetherStore((s) => s.roomId);
  const isHost = useListenTogetherStore((s) => s.isHost);
  const members = useListenTogetherStore((s) => s.members);
  const enterRoom = useListenTogetherStore((s) => s.enterRoom);
  const reset = useListenTogetherStore((s) => s.reset);

  const ensureSocket = async (): Promise<boolean> => {
    try {
      await connectSocket();
      return true;
    } catch {
      toast.error('Cần đăng nhập để dùng Nghe chung');
      return false;
    }
  };

  const handleCreate = async () => {
    setBusy('create');
    try {
      if (!(await ensureSocket())) return;
      const s = useMusicStore.getState();
      const res = await listenCreate({
        track: currentMeta(),
        isPlaying: s.isPlaying,
        positionSec: s.currentTime || 0,
      });
      if (!res?.ok || !res.roomId) {
        toast.error('Không tạo được phòng');
        return;
      }
      enterRoom({ roomId: res.roomId, isHost: true, hostId: res.hostId ?? null, members: res.members ?? [] });
      toast.success(`Đã tạo phòng ${res.roomId}`);
    } catch (e: any) {
      toast.error(e?.message || 'Lỗi tạo phòng');
    } finally {
      setBusy(null);
    }
  };

  const handleJoin = async () => {
    const roomCode = code.trim().toUpperCase();
    if (roomCode.length < 4) {
      toast.error('Nhập mã phòng');
      return;
    }
    setBusy('join');
    try {
      if (!(await ensureSocket())) return;
      const res = await listenJoin(roomCode);
      if (!res?.ok) {
        toast.error(res?.error === 'not_found' ? 'Phòng không tồn tại' : 'Không vào được phòng');
        return;
      }
      enterRoom({ roomId: roomCode, isHost: false, hostId: res.hostId ?? null, members: res.members ?? [] });
      applyInitial(res.state);
      setCode('');
      toast.success(`Đã vào phòng ${roomCode}`);
    } catch (e: any) {
      toast.error(e?.message || 'Lỗi vào phòng');
    } finally {
      setBusy(null);
    }
  };

  const handleLeave = () => {
    if (roomId) listenLeave(roomId);
    reset();
    toast('Đã rời phòng');
  };

  const copyCode = () => {
    if (!roomId) return;
    navigator.clipboard?.writeText(roomId).then(
      () => toast.success('Đã copy mã phòng'),
      () => toast.error('Copy thất bại'),
    );
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="text-xs font-mono font-bold transition-all flex items-center gap-1.5"
        style={{ color: roomId ? C.accent : C.secondary }}
        title="Nghe chung"
      >
        <Radio className="w-3.5 h-3.5" />
        {roomId ? `LIVE·${members.length}` : 'LISTEN'}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: 'rgba(5,7,18,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 p-5"
              style={{ background: 'linear-gradient(160deg, #0f172a, #1e1b4b)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4" style={{ color: C.accent }} />
                  <span className="text-sm font-mono font-bold uppercase tracking-widest" style={{ color: C.text }}>
                    Nghe chung
                  </span>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close" style={{ minHeight: 44, minWidth: 44 }} className="flex items-center justify-center">
                  <X className="w-5 h-5" style={{ color: C.muted }} />
                </button>
              </div>

              {!roomId ? (
                <div className="space-y-4">
                  <button
                    onClick={handleCreate}
                    disabled={busy !== null}
                    className="w-full py-3 rounded-xl text-sm font-mono font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ minHeight: 44, color: '#0a0a0a', background: C.primary }}
                  >
                    {busy === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                    Tạo phòng & mời bạn bè
                  </button>

                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: C.muted }}>
                    <div className="flex-1 h-px bg-white/10" /> hoặc <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                      placeholder="MÃ PHÒNG"
                      maxLength={6}
                      spellCheck={false}
                      className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 outline-none font-mono tracking-[0.3em] text-center"
                      style={{ color: C.text, fontSize: 16, minHeight: 44 }}
                    />
                    <button
                      onClick={handleJoin}
                      disabled={busy !== null}
                      className="px-5 rounded-xl text-sm font-mono font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ minHeight: 44, color: C.secondary, border: `1px solid ${C.secondary}50` }}
                    >
                      {busy === 'join' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'VÀO'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Room code */}
                  <div className="rounded-xl bg-black/40 border border-white/10 p-4 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.muted }}>
                      Mã phòng {isHost ? '(bạn là host)' : '(khách)'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl font-mono font-bold tracking-[0.3em]" style={{ color: C.accent }}>
                        {roomId}
                      </span>
                      <button onClick={copyCode} title="Copy" style={{ minHeight: 44, minWidth: 44 }} className="flex items-center justify-center">
                        <Copy className="w-4 h-4" style={{ color: C.secondary }} />
                      </button>
                    </div>
                    {!isHost && (
                      <p className="text-[11px] font-mono mt-2" style={{ color: C.muted }}>
                        Host điều khiển phát/dừng/tua — bạn nghe theo.
                      </p>
                    )}
                  </div>

                  {/* Members */}
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: C.muted }}>
                      <Users className="w-3 h-3" /> Đang nghe ({members.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {members.map((m) => (
                        <span
                          key={m.userId}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${C.primary}30`,
                            color: C.text,
                          }}
                        >
                          {m.username}
                          {m.userId === useListenTogetherStore.getState().hostId && (
                            <span style={{ color: C.accent }}> ★</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleLeave}
                    className="w-full py-3 rounded-xl text-sm font-mono font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ minHeight: 44, color: C.accent, border: `1px solid ${C.accent}40` }}
                  >
                    <LogOut className="w-4 h-4" />
                    {isHost ? 'Đóng phòng' : 'Rời phòng'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
