'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, Loader2, FileText, FileCode, Image, Film,
  Music, Archive, File, ChevronLeft, ChevronRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

// react-syntax-highlighter's Prism build ships every grammar — load it on
// demand so it stays out of page-initial JS chunks.
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

import { hubFileApi, type HubFile } from '@/lib/api';
import HubCoverUpload from './HubCoverUpload';
import { cn } from '@/lib/utils';

interface HubFilePreviewModalProps {
  file: HubFile | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (id: number) => void;
  // Phase 3 — pass coverImageUrl updates so the parent can
  // either refresh the file row (preferred) or we update
  // locally and persist on close. We keep the existing
  // status/notes/tags surface intact.
  onUpdate?: (id: number, data: { status?: string; notes?: string; tags?: string[]; coverImageUrl?: string | null }) => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  unread: { label: 'Chua doc', color: 'text-text-muted' },
  learning: { label: 'Dang hoc', color: 'text-neon-orange' },
  done: { label: 'Hoan thanh', color: 'text-neon-emerald' },
};

const MIME_CATEGORIES = {
  image: ['image/'],
  pdf: ['application/pdf'],
  video: ['video/'],
  audio: ['audio/'],
  code: [
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    'application/json', 'application/xml', 'application/sql',
    'text/x-python', 'text/x-java', 'text/x-csrc', 'text/x-c++src',
  ],
};

function getFileCategory(mimeType: string): string {
  if (MIME_CATEGORIES.image.some(p => mimeType.startsWith(p))) return 'image';
  if (MIME_CATEGORIES.pdf.some(p => mimeType.startsWith(p))) return 'pdf';
  if (MIME_CATEGORIES.video.some(p => mimeType.startsWith(p))) return 'video';
  if (MIME_CATEGORIES.audio.some(p => mimeType.startsWith(p))) return 'audio';
  if (MIME_CATEGORIES.code.some(p => mimeType.startsWith(p))) return 'code';
  return 'other';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getLanguageFromMime(mimeType: string, name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx',
    py: 'python', java: 'java', sql: 'sql', json: 'json',
    xml: 'xml', html: 'html', css: 'css', md: 'markdown',
    sh: 'bash', ps1: 'powershell', go: 'go', rs: 'rust',
    c: 'c', cpp: 'cpp', cs: 'csharp', rb: 'ruby',
    php: 'php', swift: 'swift', kt: 'kotlin', dart: 'dart',
  };
  return map[ext] ?? 'text';
}

function FileIcon({ mimeType, size = 24 }: { mimeType: string; size?: number }) {
  const cat = getFileCategory(mimeType);
  const map: Record<string, React.ReactNode> = {
    image: <Image className={cn('text-neon-pink')} style={{ width: size, height: size }} />,
    pdf: <FileText className={cn('text-red-400')} style={{ width: size, height: size }} />,
    video: <Film className={cn('text-neon-violet')} style={{ width: size, height: size }} />,
    audio: <Music className={cn('text-neon-cyan')} style={{ width: size, height: size }} />,
    code: <FileCode className={cn('text-neon-emerald')} style={{ width: size, height: size }} />,
    other: <Archive className={cn('text-neon-orange')} style={{ width: size, height: size }} />,
  };
  return <>{map[cat] ?? <File className={cn('text-text-muted')} style={{ width: size, height: size }} />}</>;
}

export default function HubFilePreviewModal({
  file, open, onClose, onDelete, onUpdate,
}: HubFilePreviewModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  // Phase 3 — local cover URL state. We keep it in sync with
  // `file.coverImageUrl` whenever the modal opens (so editing
  // a file shows its current cover), and propagate changes back
  // via `onUpdate` so the HubClient store refreshes the card.
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeContent, setCodeContent] = useState<string | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSignedUrl = useCallback(async (f: HubFile) => {
    setLoading(true);
    try {
      const res = await hubFileApi.getSignedUrl(f.id);
      setSignedUrl(res.data.data.url);
      // Refresh URL every 4 minutes to prevent expiry
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        void fetchSignedUrl(f);
      }, 4 * 60 * 1000);
    } catch (err) {
      console.error('[hub] getSignedUrl', err);
      toast.error('Khong tai duoc file');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open || !file) return;
    setCodeContent(null);
    setCurrentPage(1);
    // Sync the local cover from the file — the parent passes a
    // fresh file object each time it re-fetches, so this is the
    // authoritative source for "what's the current cover?".
    setCoverImageUrl(file.coverImageUrl ?? null);
    void fetchSignedUrl(file);
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [open, file, fetchSignedUrl]);

  // Fetch and syntax-highlight code files
  useEffect(() => {
    if (!open || !file || getFileCategory(file.mimeType) !== 'code' || !signedUrl) return;
    setLoadingCode(true);
    fetch(signedUrl)
      .then(r => r.text())
      .then(t => setCodeContent(t))
      .catch(() => setCodeContent('// Khong the tai noi dung file'))
      .finally(() => setLoadingCode(false));
  }, [open, file, signedUrl]);

  const handleDownload = async () => {
    if (!signedUrl || !file) return;
    const a = document.createElement('a');
    a.href = signedUrl;
    a.download = file.name;
    a.click();
  };

  if (!file) return null;

  const category = getFileCategory(file.mimeType);
  const statusInfo = STATUS_LABELS[file.status] ?? STATUS_LABELS.unread;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
              className="pointer-events-auto flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-darkborder/60 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon mimeType={file.mimeType} size={20} />
                  <div className="min-w-0">
                    <h2 className="truncate font-heading text-sm font-bold text-text-primary">
                      {file.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span>{formatBytes(file.size)}</span>
                      <span>|</span>
                      <span className={statusInfo.color}>{statusInfo.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdate && (
                    <select
                      value={file.status}
                      onChange={(e) => {
                        onUpdate(file.id, { status: e.target.value });
                        onClose();
                      }}
                      className="rounded-lg border border-darkborder bg-darkbg/60 px-2 py-1 text-xs text-text-secondary focus:border-neon-violet/50 focus:outline-none"
                    >
                      <option value="unread">Chua doc</option>
                      <option value="learning">Dang hoc</option>
                      <option value="done">Hoan thanh</option>
                    </select>
                  )}
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neon-violet/15 px-3 py-1.5 text-xs font-semibold text-neon-violet transition-colors hover:bg-neon-violet/25"
                  >
                    <Download className="h-3.5 w-3.5" /> Tai ve
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Phase 3 — owner cover image (Phase 3). Lives in
                  its own band between header and preview so it
                  doesn't fight for attention with the file viewer.
                  Hidden when the file IS the cover (image mime)
                  because the file's own bytes already serve as the
                  cover — uploading a separate cover would just
                  duplicate it. */}
              {!file.mimeType.startsWith('image/') && (
                <div className="shrink-0 border-b border-white/[0.06] px-5 py-4">
                  <HubCoverUpload
                    value={coverImageUrl}
                    onChange={(url) => {
                      setCoverImageUrl(url);
                      onUpdate?.(file.id, { coverImageUrl: url });
                    }}
                    label={file.name}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Preview area */}
                <div className="flex flex-1 overflow-auto bg-black/30">
                  {loading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-neon-violet" />
                    </div>
                  )}

                  {!loading && category === 'image' && signedUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={signedUrl}
                      alt={file.name}
                      className="mx-auto max-h-full max-w-full object-contain"
                    />
                  )}

                  {!loading && category === 'pdf' && signedUrl && (
                    <iframe
                      src={signedUrl}
                      className="h-full w-full"
                      title={file.name}
                    />
                  )}

                  {!loading && category === 'video' && signedUrl && (
                    <HubVideoPlayer src={signedUrl} />
                  )}

                  {!loading && category === 'audio' && signedUrl && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/30">
                      <FileIcon mimeType={file.mimeType} size={48} />
                      <audio
                        src={signedUrl}
                        controls
                        className="w-full max-w-md"
                      />
                    </div>
                  )}

                  {!loading && category === 'code' && (
                    loadingCode ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
                      </div>
                    ) : codeContent !== null ? (
                      <div className="relative h-full w-full overflow-auto">
                        <div className="relative">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="absolute left-2 top-2 z-10 rounded-lg bg-darkbg/80 p-1 text-text-muted hover:text-text-primary"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="absolute right-2 top-2 z-10 rounded-lg bg-darkbg/80 p-1 text-text-muted hover:text-text-primary"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language={getLanguageFromMime(file.mimeType, file.name)}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            minHeight: '100%',
                            background: 'transparent',
                            fontSize: '12px',
                          }}
                          showLineNumbers
                          wrapLines
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    ) : null
                  )}

                  {!loading && category === 'other' && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                      <FileIcon mimeType={file.mimeType} size={64} />
                      <p className="text-sm text-text-secondary">
                        Khong xem truoc duoc dinh dang nay
                      </p>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
                      >
                        <Download className="h-4 w-4" /> Tai ve may
                      </button>
                    </div>
                  )}
                </div>

                {/* Sidebar: metadata */}
                <div className="w-64 shrink-0 overflow-y-auto border-l border-white/[0.06] p-4">
                  <div className="space-y-4">
                    {/* Tags */}
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        Tags
                      </p>
                      {file.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {file.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-secondary"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted">Chua co tag</p>
                      )}
                    </div>

                    {/* Notes */}
                    {file.notes && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                          Ghi chu
                        </p>
                        <p className="whitespace-pre-wrap text-xs text-text-secondary">
                          {file.notes}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 rounded-xl border border-darkborder/50 bg-darkbg/40 p-3">
                      <MetaRow label="Dinh dang" value={file.mimeType} />
                      <MetaRow label="Kich thuoc" value={formatBytes(file.size)} />
                      <MetaRow
                        label="Tai len"
                        value={new Date(file.createdAt).toLocaleDateString('vi-VN')}
                      />
                    </div>

                    {/* Delete */}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm(`Xoa file "${file.name}"?`)) {
                            onDelete(file.id);
                            onClose();
                          }
                        }}
                        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        Xoa file
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Custom video player (Hub preview) ────────────────────────────────────────
// Matches the translucent dark aesthetic and interactive controls of the
// social VideoPlayerModal: layered input-range scrubber, auto-hide overlay,
// fullscreen on container, keyboard shortcuts (Space/k, ←/→ ±5s).

function HubVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Reset playback state when the signed URL refreshes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    setShowControls(true);
  }, [src]);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 2000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
    resetHideTimer();
  };

  const handlePause = () => {
    setPlaying(false);
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = val === 0; }
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); }
    else { el.requestFullscreen().catch(() => {}); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      v.currentTime = Math.max(0, v.currentTime - 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      v.currentTime = Math.min(duration, v.currentTime + 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    }
  };

  const fmt = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative flex h-full w-full items-center justify-center bg-black outline-none"
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
    >
      <video
        ref={videoRef}
        src={src}
        className="max-h-full max-w-full cursor-pointer object-contain"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={handlePause}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onVolumeChange={() => {
          const v = videoRef.current;
          if (!v) return;
          setVolume(v.muted ? 0 : v.volume);
          setMuted(v.muted);
        }}
      />

      {/* Big play indicator when paused */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-5 backdrop-blur-sm">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            }}
          >
            {/* Scrubber */}
            <div className="group/hscrub relative mb-3 w-full cursor-pointer py-2">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-violet-500"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform duration-150 group-hover/hscrub:scale-100"
                  style={{ left: `calc(${progress}% - 7px)` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = val;
                  setCurrentTime(val);
                  resetHideTimer();
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Seek"
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3 text-white">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="shrink-0 transition-opacity hover:opacity-75" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="text-[13px] tabular-nums opacity-80">
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !videoRef.current.muted;
                      setMuted(videoRef.current.muted);
                    }
                  }}
                  className="transition-opacity hover:opacity-75"
                  aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 cursor-pointer accent-violet-500"
                  aria-label="Volume"
                />
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="ml-1 transition-opacity hover:opacity-75" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}
