'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { Database } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (prompt: string, forceStatic?: boolean) => void;
  isLoading?: boolean;
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

export default function SuggestedPrompts({ onSelect, isLoading }: SuggestedPromptsProps) {
  const { limitedMode, setLimitedMode } = useChatStore();
  const displayPrompts = limitedMode ? LIMITED_PROMPTS : AI_PROMPTS;

  if (isLoading) return null;

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
