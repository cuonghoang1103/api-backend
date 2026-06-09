'use client';

import { motion } from 'framer-motion';
import { Download, MessageSquare, Tag } from 'lucide-react';
import type { DevPostCard } from '@/types/devPost';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(15,10,30,0.75)',
  codeBg: 'rgba(5,3,15,0.85)',
};

// Deterministic code snippet per post — extracted from the post title for visual variety
function getCodeSnippet(id: number, title: string): string[] {
  const snippets = [
    [
      'const store = create<Store>()((set) => ({',
      '  tracks: [],',
      '  currentTrack: null,',
      '  isPlaying: false,',
      '  setTracks: (tracks) => set({ tracks }),',
      '  playTrack: (track) => set({ currentTrack: track }),',
      '});',
    ],
    [
      '@Transactional',
      'public <T> T executeQuery(String sql) {',
      '    return jdbcTemplate.queryForObject(',
      '        sql, new BeanPropertyRowMapper<>(T.class));',
      '}',
    ],
    [
      'export async function fetchData(url: string) {',
      '  const res = await fetch(url, {',
      '    credentials: "include",',
      '  });',
      '  if (!res.ok) throw new Error(res.statusText);',
      '  return res.json();',
      '}',
    ],
    [
      'func (p *WorkerPool) Start() {',
      '  for i := 0; i < p.workers; i++ {',
      '    p.wg.Add(1)',
      '    go p.worker(i)',
      '  }',
      '}',
    ],
    [
      'const token = jwt.sign(',
      '  { sub: user.id, role: user.role },',
      '  process.env.JWT_SECRET,',
      '  { expiresIn: "15m" }',
      ');',
    ],
    [
      'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY tenant_isolation ON orders',
      '  USING (user_id = auth.uid());',
    ],
  ];
  const idx = id % snippets.length;
  return snippets[idx];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface DevPostCardProps {
  post: DevPostCard;
  index: number;
  onClick: () => void;
}

export default function DevPostCard({ post, index, onClick }: DevPostCardProps) {
  const snippet = getCodeSnippet(post.id, post.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Card outer shell */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: C.glassBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${C.border}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.4)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px rgba(168,85,247,0.15)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* ── Glassmorphic Code Window Header ── */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{
            background: C.codeBg,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
          </div>
          {/* Fake filename tab */}
          <div
            className="ml-2 px-2.5 py-1 rounded-md text-[10px] font-mono"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: `1px solid ${C.border}` }}
          >
            src/{post.id.toString().padStart(4, '0')}.{post.category.toLowerCase().replace(/\s+/g, '_')}.ts
          </div>
        </div>

        {/* ── Micro Code Snippet (glass overlay) ── */}
        <div
          className="relative px-4 pt-3 pb-2 overflow-hidden"
          style={{ background: C.codeBg, minHeight: '120px' }}
        >
          {/* Glass overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.03) 0%, rgba(236,72,153,0.03) 100%)',
              backdropFilter: 'blur(1px)',
            }}
          />
          {/* Code lines */}
          <pre className="relative font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: '#94a3b8' }}>
            {snippet.map((line, i) => (
              <div key={i}>
                <span style={{ color: '#4b5563', userSelect: 'none' }}>{String(i + 1).padStart(2, ' ')}  </span>
                <span
                  style={
                    line.startsWith('@') || line.startsWith('export') || line.startsWith('const') || line.startsWith('func')
                      ? { color: '#c084fc' }
                      : line.startsWith(' ') && !line.trimStart().startsWith('//')
                      ? { color: '#94a3b8' }
                      : { color: '#67e8f9' }
                  }
                >
                  {line}
                </span>
              </div>
            ))}
          </pre>
          {/* Gradient fade at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${C.codeBg})` }}
          />
        </div>

        {/* ── Card Body ── */}
        <div className="px-4 pb-4">
          {/* Category chip */}
          <div className="mb-2 flex items-center gap-1.5">
            <Tag className="w-3 h-3" style={{ color: C.tertiary }} />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: C.tertiary }}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-sm font-bold leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-neon-violet"
            style={{ color: C.text }}
          >
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: C.textMuted }}>
            {post.description}
          </p>

          {/* ── Engineering Counters + Get Source ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                <Download className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
                <span className="text-[11px] font-mono font-semibold">
                  {post.downloadCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                <MessageSquare className="w-3.5 h-3.5" style={{ color: C.primary }} />
                <span className="text-[11px] font-mono font-semibold">
                  {post.commentCount}
                </span>
              </div>
            </div>

            {/* Get Source Code CTA */}
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                color: '#fff',
                boxShadow: `0 0 12px rgba(168,85,247,0.3)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px rgba(168,85,247,0.5)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px rgba(168,85,247,0.3)`;
              }}
            >
              Get Source Code
            </button>
          </div>
        </div>

        {/* ── Bottom accent line ── */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.primary}, ${C.secondary}, transparent)`,
            opacity: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
}
