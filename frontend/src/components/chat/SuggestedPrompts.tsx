'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { Database, ArrowUpRight } from 'lucide-react';
import type { ChatSkin } from '@/store/chatSkinStore';

interface SuggestedPromptsProps {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (prompt: string, forceStatic?: boolean) => void;
  isLoading?: boolean;
  /** 'terminal' = bản gốc (mặc định). 'studio' = bản dễ nhìn. */
  skin?: ChatSkin;
}

const LIMITED_PROMPTS = [
  { id: 'l1', label: 'About CuongHoang', icon: '1', prompt: 'Tell me about CuongHoang' },
  { id: 'l2', label: 'Skills & Tech', icon: '2', prompt: 'What skills does CuongHoang have?' },
  { id: 'l3', label: 'Projects Done', icon: '3', prompt: 'What projects has CuongHoang built?' },
  { id: 'l4', label: 'Recent Blogs', icon: '4', prompt: 'Show me recent blog posts' },
  { id: 'l5', label: 'Start a Project', icon: '5', prompt: 'Help me start a new project' },
  { id: 'l6', label: 'Explore Courses', icon: '6', prompt: 'What courses are available?' },
];

const AI_PROMPTS = [
  { id: 'a1', label: 'About CuongHoang', icon: '1', prompt: 'Tell me about CuongHoang' },
  { id: 'a2', label: 'Skills & Tech', icon: '2', prompt: 'What skills does CuongHoang have?' },
  { id: 'a3', label: 'Projects Done', icon: '3', prompt: 'What projects has CuongHoang built?' },
  { id: 'a4', label: 'Recent Blogs', icon: '4', prompt: 'Show me recent blog posts' },
  { id: 'a5', label: 'Start a Project', icon: '5', prompt: 'Help me start a new project' },
  { id: 'a6', label: 'Explore Courses', icon: '6', prompt: 'What courses are available?' },
];

export default function SuggestedPrompts({ onSelect, isLoading, skin = 'terminal' }: SuggestedPromptsProps) {
  const { limitedMode, setLimitedMode } = useChatStore();
  const displayPrompts = limitedMode ? LIMITED_PROMPTS : AI_PROMPTS;

  if (isLoading) return null;

  // ── Bản studio: thẻ gợi ý sạch, chữ sans, theo theme sáng/tối ──
  if (skin === 'studio') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-medium tracking-wide text-[color:var(--studio-text-faint)]">
            {limitedMode ? 'Câu trả lời có sẵn (chế độ tiết kiệm)' : 'Gợi ý mở đầu'}
          </p>
          <AnimatePresence mode="wait">
            {limitedMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setLimitedMode(false, '')}
                className="rounded-full border border-[color:var(--studio-border)] bg-[var(--studio-panel)] px-3 py-1 text-[11px] font-medium text-[color:var(--studio-text-soft)] transition-colors hover:text-[color:var(--studio-text)]"
              >
                Thử lại AI
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {displayPrompts.map((q, i) => (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(q.prompt, limitedMode)}
              className="group flex items-center gap-3 rounded-2xl border border-[color:var(--studio-border)] bg-[var(--studio-panel)] px-4 py-3 text-left transition-colors hover:bg-[var(--studio-bg-raise)]"
              style={{ boxShadow: 'var(--studio-shadow)' }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--studio-accent-soft)] text-[13px] font-semibold text-[color:var(--studio-accent-text)]">
                {limitedMode ? <Database className="h-3.5 w-3.5" /> : q.icon}
              </span>
              <span className="flex-1 text-sm font-medium text-[color:var(--studio-text)]">
                {q.label}
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--studio-text-faint)] opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>

        {limitedMode && (
          <p className="mt-3 text-center text-[11px] text-[color:var(--studio-text-faint)]">
            Đang trả lời bằng nội dung lưu sẵn. AI sẽ trở lại khi hạn mức được đặt lại.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-2xl"
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-[#64748b] uppercase tracking-widest">
          {limitedMode ? (
            <><span className="text-amber-400/60">/* CACHED */</span> static responses</>
          ) : (
            <><span className="text-[#22d3ee]/50">//</span> available commands</>
          )}
        </p>
        <AnimatePresence mode="wait">
          {limitedMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setLimitedMode(false, '')}
              className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono
                bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20
                rounded-full hover:bg-[#22d3ee]/20 transition-colors"
            >
              <span className="text-[#22d3ee]/60">{'>'}</span>
              Try AI when available
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayPrompts.map((q, i) => (
          <motion.button
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(q.prompt, limitedMode)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group
              ${limitedMode
                ? 'bg-[#0a0a0f] border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5 data-card-glow-amber'
                : 'bg-[#0d1117]/80 border border-[#22d3ee]/15 hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/5 data-card-glow-cyan'
              }
            `}
          >
            {/* Command number */}
            <div className={`relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs
              ${limitedMode
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                : 'bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee]'
              }`}
            >
              {limitedMode ? (
                <Database className="w-3.5 h-3.5" />
              ) : (
                <span className="text-[10px] font-mono">{q.icon}.</span>
              )}
            </div>

            {/* Label */}
            <span className={`text-sm font-mono transition-colors ${
              limitedMode
                ? 'text-amber-200/80 group-hover:text-amber-200'
                : 'text-[#94a3b8] group-hover:text-[#f8fafc]'
            }`}>
              {q.label}
            </span>

            {/* Arrow hint */}
            <span className={`ml-auto text-xs font-mono opacity-0 group-hover:opacity-60 transition-opacity ${
              limitedMode ? 'text-amber-400' : 'text-[#22d3ee]'
            }`}>
              {'->'}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      {limitedMode && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[11px] text-[#64748b]/50 mt-3 font-mono"
        >
          <span className="text-amber-400/40">{'/* '}</span>
          Responses served from cache. AI available when quota resets.
          <span className="text-amber-400/40"> {' */'}</span>
        </motion.p>
      )}
    </motion.div>
  );
}
