'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, MessageSquare, Send, Tag, Calendar, Eye, Loader2, Clock } from 'lucide-react';
import Image from 'next/image';
import { blogApi } from '@/lib/api';
import type { Post, BlogComment } from '@/types';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  textSecondary: '#cbd5e1',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(10,8,25,0.92)',
  codeBg: 'rgba(5,3,15,0.9)',
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

function estimateReadingTime(content?: string) {
  if (!content) return 5;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface BlogPostDetailModalProps {
  postId: number | null;
  onClose: () => void;
}

export default function BlogPostDetailModal({ postId, onClose }: BlogPostDetailModalProps) {
  const [post, setPost] = useState<Post | null>(null);
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
    blogApi.getPostById(postId)
      .then((res) => {
        if (res.data.success) setPost(res.data.data);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleGetSourceCode = async () => {
    if (!post?.sourceUrl) return;
    try {
      const res = await blogApi.recordDownload(post.id);
      if (res.data.success && res.data.data?.url) {
        window.open(res.data.data.url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(post.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(commentName || 'anon')}`;
      const res = await blogApi.addComment(post.id, {
        userName: commentName.trim() || 'Anonymous',
        userAvatar: avatar,
        commentText: commentText.trim(),
      });
      if (res.data.success && res.data.data) {
        setPost((p) => p ? { ...p, commentCount: (p.commentCount ?? 0) + 1 } : p);
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
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ background: C.codeBg, borderBottom: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                    </div>
                    {post.categoryName && (
                      <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase" style={{ color: C.tertiary }}>
                        <Tag className="w-3.5 h-3.5" />{post.categoryName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {post.sourceUrl && (
                      <button
                        onClick={handleGetSourceCode}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                        style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff', boxShadow: `0 0 16px rgba(168,85,247,0.4)` }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Get Source Code
                      </button>
                    )}
                    <button onClick={onClose}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', color: C.textMuted }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content: Left Markdown + Right Comments */}
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Markdown Article */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <div className="mb-4">
                      <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: C.text }}>
                        {post.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: C.textMuted }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount?.toLocaleString() ?? 0} views</span>
                        {post.downloadCount != null && post.downloadCount > 0 && (
                          <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />{post.downloadCount.toLocaleString()} downloads</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{estimateReadingTime(post.content)} min read</span>
                      </div>
                    </div>

                    {post.excerpt && (
                      <p className="text-sm leading-relaxed mb-6 pb-6 border-b" style={{ color: C.textSecondary, borderColor: C.border }}>
                        {post.excerpt}
                      </p>
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
                              <CopyCodeBtn />
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {post.content || '_No content yet._'}
                      </ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tagNames && post.tagNames.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t" style={{ borderColor: C.border }}>
                        {post.tagNames.map((tag) => (
                          <span key={tag} className="px-3 py-1 text-xs bg-neon-indigo/10 text-neon-indigo rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Comments Thread */}
                  <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col"
                    style={{ borderLeft: `1px solid ${C.border}` }}>
                    {/* Thread header */}
                    <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: C.border }}>
                      <MessageSquare className="w-4 h-4" style={{ color: C.primary }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.primary }}>Technical Exchange</span>
                      <span className="ml-auto text-xs font-mono" style={{ color: C.textMuted }}>{post.commentCount ?? 0}</span>
                    </div>

                    {/* Comments list */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                      style={{ maxHeight: 'calc(70vh - 200px)', minHeight: '200px' }}>
                      {(post.commentCount ?? 0) === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: `${C.primary}40` }} />
                          <p className="text-xs" style={{ color: C.textMuted }}>No comments yet. Start the discussion.</p>
                        </div>
                      ) : (
                        (post as any)._comments?.map((comment: BlogComment) => (
                          <CommentItem key={comment.id} comment={comment} />
                        ))
                      )}
                    </div>

                    {/* Comment form */}
                    <div className="p-4 border-t" style={{ borderColor: C.border }}>
                      <form onSubmit={handleSubmitComment} className="space-y-3">
                        <input type="text" placeholder="Your name (optional)" value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text }} />
                        <textarea placeholder="Share your technical insight..." value={commentText}
                          onChange={(e) => setCommentText(e.target.value)} rows={3}
                          className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text }}
                          onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = C.primary)}
                          onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = String(C.border))} />
                        {submitError && <p className="text-xs" style={{ color: '#f87171' }}>{submitError}</p>}
                        <button type="submit" disabled={!commentText.trim() || submitting}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-40"
                          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff' }}>
                          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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

function CommentItem({ comment }: { comment: BlogComment }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(15,10,30,0.6)', border: `1px solid ${C.border}` }}>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5">
          <Image
            src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.userName)}`}
            alt={comment.userName}
            width={28} height={28}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: C.text }}>{comment.userName}</span>
            <span className="text-[10px] font-mono" style={{ color: C.textMuted }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{comment.commentText}</p>
        </div>
      </div>
    </div>
  );
}

function CopyCodeBtn() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const pre = document.querySelector('.prose pre');
    const code = pre?.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <button onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-mono font-bold transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
