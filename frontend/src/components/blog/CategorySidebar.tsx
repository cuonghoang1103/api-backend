'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Send, TrendingUp, BookOpen, Wifi } from 'lucide-react';
import type { Category } from '@/types';
import { toast } from 'sonner';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory?: string;
  popularTags?: string[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

// ── AI Weight mapping — higher weight = brighter glow ───────────────────────────
const TAG_WEIGHTS: Record<string, number> = {
  'Next.js': 0.95,
  'RAG': 0.92,
  'AI': 0.9,
  'TypeScript': 0.85,
  'Spring Boot': 0.8,
  'React': 0.78,
  'Node.js': 0.72,
  'Docker': 0.68,
  'Python': 0.65,
  'JavaScript': 0.6,
  'PostgreSQL': 0.55,
  'DevOps': 0.5,
  'CSS': 0.35,
};

function getTagGlow(tag: string, isSelected: boolean, isHovered: boolean) {
  const baseWeight = TAG_WEIGHTS[tag] ?? 0.5;
  const active = isSelected || isHovered;
  const weight = active ? Math.min(1, baseWeight + 0.15) : baseWeight;

  // Opacity: 0.12 at weight=0.3, up to 0.5 at weight=1.0
  const bgOpacity = (0.12 + weight * 0.38).toFixed(2);
  // Border glow intensity: weight drives spread and alpha
  const borderAlpha = (0.15 + weight * 0.45).toFixed(2);
  // Text opacity: 0.4 at low weight, 1.0 at high weight
  const textOpacity = (0.4 + weight * 0.6).toFixed(2);
  // Shadow spread
  const shadowSpread = Math.round(8 + weight * 16);

  return {
    bgOpacity,
    borderAlpha,
    textOpacity,
    shadowSpread,
    baseWeight,
  };
}

// ── Neural Tag ────────────────────────────────────────────────────────────────
function NeuralTag({
  tag,
  isSelected,
  onClick,
}: {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const glow = getTagGlow(tag, isSelected, hovered);
  const isHighWeight = glow.baseWeight >= 0.7;
  const isMidWeight = glow.baseWeight >= 0.5;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
      style={{
        background: `rgba(168,85,247,${glow.bgOpacity})`,
        border: `${isSelected ? '1px' : '1px'} solid rgba(168,85,247,${glow.borderAlpha})`,
        color: `rgba(168,85,247,${glow.textOpacity})`,
        boxShadow: isHighWeight || isSelected
          ? `0 0 ${glow.shadowSpread}px rgba(168,85,247,${(parseFloat(glow.borderAlpha) * 0.6).toFixed(2)}), 0 0 ${glow.shadowSpread * 1.5}px rgba(168,85,247,${(parseFloat(glow.borderAlpha) * 0.3).toFixed(2)})`
          : isMidWeight
          ? `0 0 ${glow.shadowSpread * 0.5}px rgba(168,85,247,${glow.borderAlpha})`
          : 'none',
        opacity: glow.baseWeight < 0.4 ? 0.55 : 1,
      }}
    >
      {/* Pulsing indicator for high-weight tags */}
      {isHighWeight && !isSelected && (
        <motion.span
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
          style={{ background: '#a855f7' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* WiFi signal bars for very high weight */}
      {isHighWeight && (
        <Wifi className="inline w-2.5 h-2.5 mr-1 opacity-60" />
      )}

      #{tag}

      {/* Weight indicator dot */}
      <span
        className="ml-1 text-[8px] opacity-40 font-mono"
        style={{ color: '#a855f7' }}
      >
        {(glow.baseWeight * 100).toFixed(0)}
      </span>
    </motion.button>
  );
}

// ── Activity Log Terminal ─────────────────────────────────────────────────────
const AGENT_LOG_LINES = [
  '[Agent-01]: Scanning GitHub commits for documentation triggers...',
  '[Agent-01]: Vectorizing latest RAG architecture updates... Standby.',
  '[Agent-01]: Processing LLM context windows for category clustering...',
  '[Agent-01]: Syncing vector DB embeddings with latest posts...',
  '[Agent-01]: Running inference on draft content quality scores...',
  '[Agent-01]: Knowledge base index updated. Monitoring new commits.',
  '[Agent-01]: Idle — awaiting user interaction.',
];

export function AgentActivityLog() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [dots, setDots] = useState('');

  // Stagger line reveals
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    AGENT_LOG_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 600));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animated dots
  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0,8,4,0.92)',
        border: '1px solid rgba(34,197,94,0.2)',
        boxShadow: '0 0 40px rgba(34,197,94,0.06), inset 0 0 60px rgba(0,0,0,0.5)',
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}
          />
          <span className="text-[10px] font-bold tracking-widest" style={{ color: '#22c55e' }}>
            AGENT-01 ACTIVITY LOG
          </span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'rgba(34,197,94,0.5)' }}>
          sys::{(AGENT_LOG_LINES[visibleLines - 1] || '').replace(/\D/g, '').slice(-3) || '??'}{dots}
        </span>
      </div>

      {/* Log lines */}
      <div className="p-4 space-y-1 min-h-[200px]">
        {AGENT_LOG_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] leading-6 font-mono"
            style={{ color: i === visibleLines - 1 ? '#22c55e' : 'rgba(34,197,94,0.45)' }}
          >
            <span style={{ color: 'rgba(34,197,94,0.25)' }}>
              {new Date().toLocaleTimeString('en-US', { hour12: false })} &gt;{' '}
            </span>
            {line}
            {i === visibleLines - 1 && visibleLines < AGENT_LOG_LINES.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="ml-0.5"
              >
                ▋
              </motion.span>
            )}
          </motion.div>
        ))}

        {visibleLines < AGENT_LOG_LINES.length && (
          <div className="flex items-center gap-2 pt-1">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }}
            />
            <span className="text-[10px] font-mono" style={{ color: 'rgba(168,85,247,0.5)' }}>
              Neural network initializing...
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 text-[9px] font-mono"
        style={{
          background: 'rgba(34,197,94,0.04)',
          borderTop: '1px solid rgba(34,197,94,0.1)',
          color: 'rgba(34,197,94,0.3)',
        }}
      >
        <span>VITE-RAG v2.1.0 // CuongHoangDev</span>
        <span>CPU: {(15 + Math.random() * 30).toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function CategorySidebar({
  categories,
  activeCategory,
  popularTags = [],
  onTagClick,
  selectedTags = [],
}: CategorySidebarProps) {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setSubscribing(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Subscribed successfully!');
    setEmail('');
    setSubscribing(false);
  };

  const displayTags = popularTags.length > 0
    ? popularTags
    : ['AI', 'Next.js', 'RAG', 'TypeScript', 'Spring Boot', 'React', 'Docker', 'Python', 'JavaScript', 'CSS', 'DevOps', 'PostgreSQL'];

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-darkcard rounded-2xl border border-darkborder p-5"
      >
        <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neon-violet" />
          Categories
        </h3>

        <nav className="space-y-1">
          <Link
            href="/blog"
            className={`
              flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200
              ${!activeCategory
                ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/20'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }
            `}
          >
            <span className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              All Posts
            </span>
          </Link>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/20'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }
                `}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-current opacity-40" />
                  {cat.name}
                </span>
                {cat.postCount !== undefined && (
                  <span className="text-xs opacity-60">{cat.postCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.div>

      {/* Neural Tags Cloud */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-darkcard rounded-2xl border border-darkborder p-5"
      >
        <h3 className="font-heading font-semibold text-text-primary mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#a855f7' }} />
          Neural Tags Cloud
        </h3>
        <p className="text-[10px] text-text-muted mb-4 font-mono">
          AI Weight (%) indicates relevance density
        </p>

        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <NeuralTag
              key={tag}
              tag={tag}
              isSelected={selectedTags.includes(tag)}
              onClick={() => onTagClick?.(tag)}
            />
          ))}
        </div>
      </motion.div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gradient-to-br from-neon-indigo/10 via-neon-violet/10 to-neon-fuchsia/10 rounded-2xl border border-neon-violet/20 p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-neon-violet" />
          <h3 className="font-heading font-semibold text-text-primary">Newsletter</h3>
        </div>
        <p className="text-sm text-text-muted mb-4 leading-relaxed">
          Get the latest posts and tutorials delivered to your inbox weekly.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-darkbg/80 border border-darkborder text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
          <button
            type="submit"
            disabled={subscribing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {subscribing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </form>
      </motion.div>
    </aside>
  );
}
