'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, Calendar, ArrowRight, Zap, Bot, Cpu, Download, MessageSquare, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Post, PostCard } from '@/types';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(15,10,30,0.75)',
  codeBg: 'rgba(5,3,15,0.9)',
};

// ── Deterministic code snippet per post ────────────────────────────────────────
function getCodeSnippet(id: number, title: string): string[] {
  const snippets = [
    [
      'const { tracks, currentTrack } = useMusicStore(',
      '  (s) => ({ tracks: s.tracks,',
      '           currentTrack: s.currentTrack })',
      ');',
      '',
      'useEffect(() => {',
      '  if (!isMounted) return;',
      '  fetchBackendTracks();',
      '}, [isMounted]);',
    ],
    [
      '@Service',
      'public class PostService {',
      '  private final PostRepository repo;',
      '',
      '  public PostDto getById(Long id) {',
      '    return repo.findById(id)',
      '      .map(this::toDto)',
      '      .orElseThrow(...);',
      '  }',
      '}',
    ],
    [
      'export default function BlogCard({',
      '  post, index, onClick',
      '}: BlogCardProps) {',
      '  const snippet = getCodeSnippet(',
      '    post.id, post.title',
      '  );',
      '  const counters = {',
      '    dl: post.downloadCount,',
      '    cm: post.commentCount,',
      '  };',
      '}',
    ],
    [
      'function getAiMeta(id: number) {',
      '  const seed = id % 7;',
      '  return {',
      '    confidence: 93 + seed,',
      '    tokens: 8 + seed,',
      '    model: "Gemini-1.5-Pro",',
      '  };',
      '}',
    ],
    [
      'CREATE TABLE comments (',
      '  id SERIAL PRIMARY KEY,',
      '  post_id INT REFERENCES posts,',
      '  user_name VARCHAR(100),',
      '  comment_text TEXT NOT NULL,',
      '  created_at TIMESTAMP',
      ');',
    ],
    [
      'interface MusicState {',
      '  tracks: Track[];',
      '  savedAllTracks: Track[];',
      '  setTracks: (t: Track[]) => void;',
      '  restoreAllTracks: () => void;',
      '}',
    ],
  ];
  const idx = id % snippets.length;
  return snippets[idx];
}

// ── AI Metadata mock ─────────────────────────────────────────────────────────────
function getAiMeta(postId: number | string) {
  const id = typeof postId === 'string' ? parseInt(postId, 36) : postId;
  const confidence = 93 + (id % 7);
  const tokens = 8 + (id % 9);
  return {
    confidence: `${confidence + (id % 10) * 0.1}%`,
    tokens: `~${tokens}k`,
    model: 'Gemini-1.5-Pro',
  };
}

// ── Typewriter ─────────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 18, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return { displayed, done };
}

// ── AI TL;DR points ────────────────────────────────────────────────────────────
function getTldrPoints(post: Post | PostCard): string[] {
  const title = post.title || '';
  const words = title.split(' ').slice(0, 4).join(' ');
  return [
    `This article explores ${words}... with practical implementation patterns for production environments.`,
    `Key architectures covered include modular component design, type-safe APIs, and performance patterns.`,
    `Best suited for developers working with ${(post.tagNames || [])[0] || 'modern web stacks'}.`,
  ];
}

// ── AI Badge ─────────────────────────────────────────────────────────────────
function AIBadge({ pulse }: { pulse?: boolean }) {
  return (
    <span
      className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold"
      style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', textShadow: '0 0 8px #22d3ee60' }}
    >
      {pulse && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: '#22d3ee', display: 'block' }}
        />
      )}
      <Cpu className="w-2.5 h-2.5 relative" />
      AI-Generated &amp; Verified
    </span>
  );
}

// ── AI Metadata Panel ──────────────────────────────────────────────────────────
function AiMetadataPanel({ postId }: { postId: number | string }) {
  const meta = getAiMeta(postId);
  return (
    <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-lg"
      style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
      <span className="text-[10px] font-mono" style={{ color: '#a855f7' }}>
        <Bot className="w-3 h-3 inline mr-0.5 -mt-0.5" />
        Co-Author: <span style={{ color: '#e879f9' }}>{meta.model}</span>
      </span>
      <span className="text-[10px] font-mono" style={{ color: '#22d3ee' }}>Confidence: {meta.confidence}</span>
      <span className="text-[10px] font-mono" style={{ color: '#64748b' }}>Tokens: {meta.tokens}</span>
    </div>
  );
}

// ── AI TL;DR Expander ──────────────────────────────────────────────────────────
function AITldr({ post }: { post: Post | PostCard }) {
  const [open, setOpen] = useState(false);
  const points = getTldrPoints(post);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: open ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.06)',
          border: `1px solid ${open ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.12)'}`,
          color: open ? '#a855f7' : '#818cf8',
        }}
      >
        <Zap className={`w-3.5 h-3.5 ${open ? 'fill-current' : ''}`} />
        {open ? 'Collapse AI Summary' : 'AI TL;DR'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(13,11,23,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 30px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              {points.map((point, i) => <TLdrLine key={i} text={point} delay={i * 150} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TLdrLine({ text, delay }: { text: string; delay: number }) {
  const { displayed, done } = useTypewriter(text, 15, true);
  return (
    <div className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
      <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#a855f7' }} />
      <span className="font-mono">
        {displayed}
        {!done && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="ml-0.5">▋</motion.span>}
      </span>
    </div>
  );
}

// ── Format helpers ─────────────────────────────────────────────────────────────
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function estimateReadingTime(content?: string) {
  if (!content) return 5;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Main Card ─────────────────────────────────────────────────────────────────
export interface BlogCardProps {
  post: Post | PostCard;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
  onCardClick?: () => void;
}

export default function BlogCard({ post, index = 0, variant = 'default', onCardClick }: BlogCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const readingTime = estimateReadingTime((post as Post).content || post.excerpt || '');
  const snippet = getCodeSnippet(post.id, post.title);
  const dlCount = post.downloadCount ?? 0;
  const cmCount = post.commentCount ?? 0;
  const hasSource = Boolean(post.sourceUrl);

  if (isCompact) {
    return (
      <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
        <Link href={`/blog/${post.slug}`}>
          <article className="flex gap-4 p-3 rounded-xl hover:bg-darkcard/60 transition-all duration-200 group">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              {post.thumbnailUrl ? (
                <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
                  <span className="text-white/50 text-xs font-bold">CH</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary text-sm line-clamp-2 group-hover:text-neon-violet transition-colors">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
                <Calendar className="w-3 h-3" /><span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span>&bull;</span><Clock className="w-3 h-3" /><span>{readingTime}m</span>
              </div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  // Main card with glassmorphic code-window header
  const card = (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 ${isFeatured ? 'md:col-span-2' : ''}`}
        style={{ background: C.glassBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${C.border}` }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.4)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px rgba(168,85,247,0.15)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* ── Thumbnail Image ── */}
        {post.thumbnailUrl && (
          <div className="relative overflow-hidden" style={{ height: '180px' }}>
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkbg/80 to-transparent" />
          </div>
        )}

        {/* ── Glassmorphic Code Window Header ── */}
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: C.codeBg, borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
          </div>
          <div className="ml-2 px-2.5 py-1 rounded-md text-[10px] font-mono"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: `1px solid ${C.border}` }}>
            src/blog/{post.id.toString().padStart(4, '0')}.{post.categoryName?.toLowerCase().replace(/\s+/g, '_') ?? 'post'}.ts
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {post.categoryName && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold uppercase" style={{ color: C.tertiary }}>
                <Tag className="w-3 h-3" />{post.categoryName}
              </span>
            )}
          </div>
        </div>

        {/* ── Micro Code Snippet ── */}
        <div className="relative px-4 pt-3 pb-2 overflow-hidden" style={{ background: C.codeBg, minHeight: '100px' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.03) 0%, rgba(236,72,153,0.03) 100%)` }} />
          <pre className="relative font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: '#94a3b8' }}>
            {snippet.map((line, i) => (
              <div key={i}>
                <span style={{ color: '#4b5563', userSelect: 'none' }}>{String(i + 1).padStart(2, ' ')}  </span>
                <span style={
                  line.startsWith('@') || line.startsWith('export') || line.startsWith('const') || line.startsWith('function') || line.startsWith('interface') || line.startsWith('CREATE')
                    ? { color: '#c084fc' }
                    : line.startsWith(' ')
                    ? { color: '#94a3b8' }
                    : { color: '#67e8f9' }
                }>{line}</span>
              </div>
            ))}
          </pre>
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${C.codeBg})` }} />
        </div>

        {/* ── Card Body ── */}
        <div className={`p-5 ${isFeatured ? 'md:p-6' : ''}`}>
          {/* AI Metadata Panel */}
          <div className="mb-3">
            <AiMetadataPanel postId={post.id} />
          </div>

          {/* Title */}
          <h2 className={`font-heading font-bold text-text-primary group-hover:text-neon-violet transition-colors duration-200 line-clamp-2 ${isFeatured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className={`text-text-muted mt-2 line-clamp-2 ${isFeatured ? 'text-sm md:text-base' : 'text-sm'}`}>
              {post.excerpt}
            </p>
          )}

          {/* TL;DR */}
          <AITldr post={post} />

          {/* ── Engineering Counters + Actions ── */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: `${C.border}60` }}>
            {/* Counters */}
            <div className="flex items-center gap-4">
              {hasSource && (
                <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                  <Download className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
                  <span className="text-[11px] font-mono font-semibold">{dlCount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                <MessageSquare className="w-3.5 h-3.5" style={{ color: C.primary }} />
                <span className="text-[11px] font-mono font-semibold">{cmCount}</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono font-semibold">{post.viewCount > 0 ? post.viewCount.toLocaleString() : '0'}</span>
              </div>
            </div>

            {/* Get Source Code CTA */}
            {hasSource ? (
              <button
                onClick={(e) => { e.preventDefault(); onCardClick?.(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff', boxShadow: `0 0 12px rgba(168,85,247,0.3)` }}
              >
                <Download className="w-3 h-3" />
                Get Source Code
              </button>
            ) : (
              <span className="text-neon-violet text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tagNames && post.tagNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tagNames.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-neon-indigo/10 text-neon-indigo rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}, ${C.secondary}, transparent)`, opacity: 0.5 }} />
      </div>
    </motion.article>
  );

  if (onCardClick) {
    return <div onClick={onCardClick}>{card}</div>;
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      {card}
    </Link>
  );
}
