'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, MessageSquare, Send, Tag, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { DevPostDetail } from '@/types/devPost';
import { devPostsApi } from '@/lib/api/devPosts';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(10,8,25,0.92)',
  codeBg: 'rgba(5,3,15,0.9)',
  textSecondary: '#cbd5e1',
};

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface PostDetailModalProps {
  postId: number | null;
  onClose: () => void;
}

export default function PostDetailModal({ postId, onClose }: PostDetailModalProps) {
  const [post, setPost] = useState<DevPostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setPost(null);
    devPostsApi.getById(postId).then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [postId]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleGetSourceCode = async () => {
    if (!post) return;
    const url = await devPostsApi.recordDownload(post.id);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Source code URL not available for this post.');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(commentName || 'anon')}`;
      const comment = await devPostsApi.addComment(post.id, {
        userName: commentName.trim() || 'Anonymous',
        userAvatar: avatar,
        commentText: commentText.trim(),
      });
      if (comment) {
        setPost((p) =>
          p
            ? {
                ...p,
                comments: [...(p.comments ?? []), comment],
                commentCount: p.commentCount + 1,
              }
            : p
        );
        setCommentText('');
        setCommentName('');
      }
    } catch {
      setSubmitError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {postId && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl rounded-2xl overflow-hidden my-auto"
            style={{ background: C.glassBg, border: `1px solid ${C.border}` }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.primary }} />
              </div>
            ) : post ? (
              <>
                {/* ── Header ── */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ background: C.codeBg, borderBottom: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" style={{ color: C.tertiary }} />
                      <span className="text-xs font-mono font-bold uppercase" style={{ color: C.tertiary }}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Get Source Code Button */}
                    <button
                      onClick={handleGetSourceCode}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                        color: '#fff',
                        boxShadow: `0 0 16px rgba(168,85,247,0.4)`,
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Get Source Code
                    </button>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', color: C.textMuted }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Markdown Content */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <div className="mb-4">
                      <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: C.text }}>
                        {post.title}
                      </h1>
                      <div className="flex items-center gap-4 text-xs" style={{ color: C.textMuted }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
                          {post.downloadCount.toLocaleString()} downloads
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" style={{ color: C.primary }} />
                          {post.commentCount} comments
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-6 pb-6 border-b" style={{ color: C.textSecondary, borderColor: C.border }}>
                      {post.description}
                    </p>

                    {/* Video player — rendered when the post has a videoUrl */}
                    {post.videoUrl && (
                      <div className="mb-6 overflow-hidden rounded-xl" style={{ background: '#000', border: `1px solid ${C.border}` }}>
                        <DevHubVideoPlayer src={post.videoUrl} />
                      </div>
                    )}

                    {/* Markdown body */}
                    <div className="prose prose-invert prose-sm max-w-none
                      prose-headings:text-neon-violet
                      prose-code:text-neon-cyan prose-code:bg-darkcard prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                      prose-pre:bg-[rgba(5,3,15,0.9)] prose-pre:border prose-pre:border-darkborder prose-pre:rounded-xl
                      prose-a:text-neon-violet prose-a:no-underline hover:prose-a:underline
                      prose-li:text-text-secondary
                      prose-p:text-text-secondary
                    ">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ children }) => (
                            <pre className="relative group rounded-xl overflow-hidden" style={{ background: C.codeBg, border: `1px solid ${C.border}` }}>
                              <CopyButton />
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {post.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Right: Comments Thread */}
                  <div
                    className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col"
                    style={{ borderLeft: `1px solid ${C.border}` }}
                  >
                    {/* Thread header */}
                    <div
                      className="px-4 py-3 flex items-center gap-2 border-b"
                      style={{ borderColor: C.border }}
                    >
                      <MessageSquare className="w-4 h-4" style={{ color: C.primary }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.primary }}>
                        Technical Exchange
                      </span>
                      <span className="ml-auto text-xs font-mono" style={{ color: C.textMuted }}>
                        {post.commentCount}
                      </span>
                    </div>

                    {/* Comments list */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ maxHeight: 'calc(70vh - 200px)', minHeight: '200px' }}>
                      {post.comments && post.comments.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: `${C.primary}40` }} />
                          <p className="text-xs" style={{ color: C.textMuted }}>No comments yet. Start the discussion.</p>
                        </div>
                      ) : (
                        post.comments?.map((comment) => (
                          <CommentItem key={comment.id} comment={comment} />
                        ))
                      )}
                    </div>

                    {/* Comment form */}
                    <div className="p-4 border-t" style={{ borderColor: C.border }}>
                      <form onSubmit={handleSubmitComment} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${C.border}`,
                            color: C.text,
                          }}
                        />
                        <textarea
                          placeholder="Share your technical insight..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none transition-colors"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${C.border}`,
                            color: C.text,
                          }}
                          onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = C.primary)}
                          onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = String(C.border))}
                        />
                        {submitError && (
                          <p className="text-xs" style={{ color: '#f87171' }}>{submitError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={!commentText.trim() || submitting}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-40"
                          style={{
                            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                            color: '#fff',
                          }}
                        >
                          {submitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          Submit Comment
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-24">
                <p className="text-sm" style={{ color: C.textMuted }}>Post not found.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommentItem({ comment }: { comment: { id: number; userName: string; userAvatar: string; commentText: string; createdAt: string } }) {
  const C_local = {
    primary: '#a855f7',
    secondary: '#ec4899',
    text: '#f8fafc',
    textMuted: '#64748b',
    border: 'rgba(168,85,247,0.15)',
    glassBg: 'rgba(15,10,30,0.6)',
  };

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: C_local.glassBg, border: `1px solid ${C_local.border}` }}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5">
          <Image
            src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.userName)}`}
            alt={comment.userName}
            width={28}
            height={28}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: C_local.text }}>
              {comment.userName}
            </span>
            <span className="text-[10px] font-mono" style={{ color: C_local.textMuted }}>
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C_local.textMuted }}>
            {comment.commentText}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Custom video player for Dev Hub posts ────────────────────────────────────
// Same dark translucent control bar as the rest of the app: layered
// input-range scrubber, auto-hide overlay, fullscreen on container,
// keyboard shortcuts (Space/k = play/pause, ←/→ = ±5s seek).

function DevHubVideoPlayer({ src }: { src: string }) {
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
      className="relative w-full bg-black outline-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full cursor-pointer object-contain"
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
            <div className="group/dvscrub relative mb-3 w-full cursor-pointer py-2">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${progress}%`, background: C.primary }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform duration-150 group-hover/dvscrub:scale-100"
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
                  className="w-20 cursor-pointer"
                  style={{ accentColor: C.primary }}
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

function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const pre = document.querySelector('.prose pre');
    if (pre) {
      const code = pre.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.innerText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-mono font-bold transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
