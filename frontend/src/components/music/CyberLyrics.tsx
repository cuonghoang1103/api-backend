'use client';

/**
 * ============================================================
 * CyberLyrics — synced karaoke lyrics overlay (Phase 2b)
 * ============================================================
 *
 * A self-contained slide-up panel for the now-playing screen.
 *  - Reads `currentTime` from the global music store and highlights
 *    the active line, auto-scrolling it to centre (karaoke style).
 *  - Click any line to seek there.
 *  - Graceful empty state when a track has no lyrics, with an inline
 *    editor (LRC `[mm:ss.xx] text` or plain text) to add/edit them.
 *  - Every list is []-guarded so a malformed payload can't crash it.
 *  - Respects prefers-reduced-motion (no smooth scroll / spring).
 *
 * Isolation: it only touches the music store (currentTime/seek) and
 * the lyrics API — no shared layout/socket code.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/store/musicStore';
import {
  useTrackLyrics,
  useSaveLyrics,
  useDeleteLyrics,
  type SyncedLine,
} from '@/hooks/useMusicQueries';

const C = {
  primary: '#8B5CF6',
  secondary: '#06b6d4',
  accent: '#ec4899',
  text: '#f8fafc',
  muted: '#94a3b8',
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fmt(t: number): string {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

// Parse an LRC-ish editor blob into synced lines + a plain fallback.
// A line like `[01:23.45] text` becomes { t: 83.45, text }. Lines with
// no timestamp are collected as plain text. If NO timestamps are found
// the whole thing is treated as plain.
function parseEditor(raw: string): { synced: SyncedLine[]; plain: string } {
  const lines = raw.split(/\r?\n/);
  const synced: SyncedLine[] = [];
  const plainLines: string[] = [];
  const re = /^\s*\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]\s?(.*)$/;
  for (const line of lines) {
    const m = line.match(re);
    if (m) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const frac = m[3] ? parseInt(m[3].padEnd(2, '0').slice(0, 2), 10) / 100 : 0;
      const t = min * 60 + sec + frac;
      const text = (m[4] ?? '').trim();
      if (text.length > 0) synced.push({ t, text });
    } else if (line.trim().length > 0) {
      plainLines.push(line.trim());
    }
  }
  synced.sort((a, b) => a.t - b.t);
  return { synced, plain: plainLines.join('\n') };
}

// Render stored lyrics back into the editor's LRC text.
function toEditorText(format: string, synced: SyncedLine[], plain: string | null): string {
  if (format === 'synced' && synced.length > 0) {
    return synced.map((l) => `[${fmt(l.t)}] ${l.text}`).join('\n');
  }
  return plain ?? '';
}

interface Props {
  open: boolean;
  onClose: () => void;
  trackId: number | null;
  trackTitle?: string;
  trackArtist?: string;
}

export default function CyberLyrics({ open, onClose, trackId, trackTitle, trackArtist }: Props) {
  const currentTime = useMusicStore((s) => s.currentTime);
  const setCurrentTime = useMusicStore((s) => s.setCurrentTime);

  const { data: lyrics, isLoading } = useTrackLyrics(trackId, open);
  const saveLyrics = useSaveLyrics();
  const deleteLyrics = useDeleteLyrics();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  const synced = useMemo<SyncedLine[]>(
    () => (Array.isArray(lyrics?.synced) ? lyrics!.synced : []),
    [lyrics],
  );
  const isSynced = lyrics?.format === 'synced' && synced.length > 0;

  // Active line = last line whose timestamp has passed.
  const activeIndex = useMemo(() => {
    if (!isSynced) return -1;
    let idx = -1;
    for (let i = 0; i < synced.length; i++) {
      if (synced[i].t <= currentTime + 0.15) idx = i;
      else break;
    }
    return idx;
  }, [isSynced, synced, currentTime]);

  // Auto-scroll the active line to centre.
  useEffect(() => {
    if (!open || editing || activeIndex < 0 || !activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [activeIndex, open, editing]);

  // Seed the editor when entering edit mode.
  useEffect(() => {
    if (editing) {
      setDraft(toEditorText(lyrics?.format ?? 'plain', synced, lyrics?.plain ?? null));
      setSaveErr(null);
    }
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!trackId) return;
    const { synced: s, plain } = parseEditor(draft);
    if (s.length === 0 && plain.trim().length === 0) {
      setSaveErr('Nhập ít nhất một dòng lời bài hát.');
      return;
    }
    try {
      setSaveErr(null);
      await saveLyrics.mutateAsync({
        trackId,
        synced: s.length > 0 ? s : undefined,
        plain: s.length > 0 ? undefined : plain,
      });
      setEditing(false);
    } catch (e: any) {
      setSaveErr(
        e?.status === 401
          ? 'Bạn cần đăng nhập để lưu lời bài hát.'
          : e?.message || 'Lưu thất bại.',
      );
    }
  };

  const handleDelete = async () => {
    if (!trackId) return;
    try {
      await deleteLyrics.mutateAsync({ trackId });
      setEditing(false);
    } catch {
      /* non-fatal */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion() ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion() ? 0 : 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{
            background: 'linear-gradient(160deg, rgba(10,12,28,0.97), rgba(15,23,42,0.98))',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: C.primary }}>
                LYRICS_MATRIX
              </p>
              <p className="text-sm font-semibold truncate" style={{ color: C.text }}>
                {trackTitle || 'Unknown'} <span style={{ color: C.muted }}>— {trackArtist || ''}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-2 text-xs font-mono rounded-lg transition-all hover:opacity-80"
                  style={{ minHeight: 44, color: C.secondary, border: `1px solid ${C.secondary}40` }}
                >
                  {isSynced || lyrics?.plain ? 'EDIT' : 'ADD'}
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close lyrics"
                className="px-3 py-2 text-xs font-mono rounded-lg transition-all hover:opacity-80"
                style={{ minHeight: 44, color: C.muted, border: '1px solid rgba(255,255,255,0.1)' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              {editing ? (
                <div className="space-y-3">
                  <p className="text-xs font-mono" style={{ color: C.muted }}>
                    Định dạng LRC:{' '}
                    <span style={{ color: C.secondary }}>[mm:ss.xx] nội dung</span>. Bỏ timestamp = lời thường.
                    {' '}Thời gian hiện tại: <span style={{ color: C.accent }}>{fmt(currentTime)}</span>
                  </p>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={'[00:12.00] Dòng đầu tiên\n[00:18.50] Dòng thứ hai'}
                    spellCheck={false}
                    className="w-full h-[50vh] rounded-xl bg-black/40 border border-white/10 p-4 font-mono outline-none"
                    style={{ color: C.text, fontSize: 16, lineHeight: 1.7 }}
                  />
                  {saveErr && (
                    <p className="text-xs font-mono" style={{ color: C.accent }}>{saveErr}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleSave}
                      disabled={saveLyrics.isPending}
                      className="px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ minHeight: 44, color: '#0a0a0a', background: C.primary }}
                    >
                      {saveLyrics.isPending ? 'SAVING…' : 'SAVE'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 text-xs font-mono rounded-lg transition-all hover:opacity-80"
                      style={{ minHeight: 44, color: C.muted, border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      CANCEL
                    </button>
                    {(isSynced || lyrics?.plain) && (
                      <button
                        onClick={handleDelete}
                        className="ml-auto px-4 py-2 text-xs font-mono rounded-lg transition-all hover:opacity-80"
                        style={{ minHeight: 44, color: C.accent, border: `1px solid ${C.accent}40` }}
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                </div>
              ) : isLoading ? (
                <p className="text-center text-sm font-mono" style={{ color: C.muted }}>Loading lyrics…</p>
              ) : isSynced ? (
                <div className="space-y-4 py-[30vh]">
                  {synced.map((line, i) => {
                    const active = i === activeIndex;
                    const past = i < activeIndex;
                    return (
                      <p
                        key={`${line.t}-${i}`}
                        ref={active ? activeRef : undefined}
                        onClick={() => setCurrentTime(line.t)}
                        className="cursor-pointer text-center font-semibold transition-all duration-300 select-none"
                        style={{
                          fontSize: active ? 26 : 20,
                          color: active ? C.text : past ? `${C.muted}99` : C.muted,
                          textShadow: active ? `0 0 24px ${C.primary}99` : 'none',
                          opacity: active ? 1 : 0.55,
                          transform: active ? 'scale(1.04)' : 'scale(1)',
                        }}
                      >
                        {line.text}
                      </p>
                    );
                  })}
                </div>
              ) : lyrics?.plain ? (
                <pre
                  className="whitespace-pre-wrap text-center font-semibold leading-relaxed"
                  style={{ color: C.text, fontSize: 18, fontFamily: 'inherit' }}
                >
                  {lyrics.plain}
                </pre>
              ) : (
                <div className="text-center py-[20vh] space-y-4">
                  <p className="text-5xl">🎤</p>
                  <p className="text-sm font-mono" style={{ color: C.muted }}>
                    Chưa có lời cho bài này.
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-5 py-3 text-xs font-mono font-bold rounded-lg transition-all hover:opacity-90"
                    style={{ minHeight: 44, color: '#0a0a0a', background: C.primary }}
                  >
                    + ADD_LYRICS
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
