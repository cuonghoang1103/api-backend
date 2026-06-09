'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { Sparkles, Database, RefreshCw } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (prompt: string, forceStatic?: boolean) => void;
  isLoading?: boolean;
}

// Prompts for Limited Mode (using static data)
const LIMITED_PROMPTS = [
  { id: 'l1', label: 'About CuongHoang', icon: '👤', prompt: 'Tell me about CuongHoang' },
  { id: 'l2', label: 'Skills & Tech', icon: '⚡', prompt: 'What skills does CuongHoang have?' },
  { id: 'l3', label: 'Projects Done', icon: '🚀', prompt: 'What projects has CuongHoang built?' },
  { id: 'l4', label: 'Recent Blogs', icon: '📝', prompt: 'Show me recent blog posts' },
  { id: 'l5', label: 'Start a Project', icon: '💻', prompt: 'Help me start a new project' },
  { id: 'l6', label: 'Explore Courses', icon: '🎓', prompt: 'What courses are available?' },
];

// Prompts for AI Mode (calling real AI)
const AI_PROMPTS = [
  { id: 'a1', label: 'About CuongHoang', icon: '👤', prompt: 'Tell me about CuongHoang' },
  { id: 'a2', label: 'Skills & Tech', icon: '⚡', prompt: 'What skills does CuongHoang have?' },
  { id: 'a3', label: 'Projects Done', icon: '🚀', prompt: 'What projects has CuongHoang built?' },
  { id: 'a4', label: 'Recent Blogs', icon: '📝', prompt: 'Show me recent blog posts' },
  { id: 'a5', label: 'Start a Project', icon: '💻', prompt: 'Help me start a new project' },
  { id: 'a6', label: 'Explore Courses', icon: '🎓', prompt: 'What courses are available?' },
];

export default function SuggestedPrompts({ prompts, onSelect, isLoading }: SuggestedPromptsProps) {
  const { limitedMode, setLimitedMode } = useChatStore();

  // Use different prompts based on mode
  const displayPrompts = limitedMode ? LIMITED_PROMPTS : AI_PROMPTS;

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-2xl"
    >
      {/* Mode indicator */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
          {limitedMode ? '📦 Cached responses' : 'Try asking about'}
        </p>
        <AnimatePresence mode="wait">
          {limitedMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setLimitedMode(false, '')}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 rounded-full hover:bg-green-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI when available
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayPrompts.map((q, i) => (
          <motion.button
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(q.prompt, limitedMode)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group shadow-md ${
              limitedMode
                ? 'bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10'
                : 'bg-darkcard border border-darkborder hover:border-neon-violet/40 hover:bg-darkcard/80'
            }`}
          >
            {/* Icon with mode indicator */}
            <div className={`relative flex-shrink-0 ${limitedMode ? '' : ''}`}>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors ${
                  limitedMode
                    ? 'bg-amber-500/10 border border-amber-500/20'
                    : 'bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20 border border-neon-violet/20 group-hover:border-neon-violet/40'
                }`}
              >
                {limitedMode ? <Database className="w-4 h-4 text-amber-400" /> : q.icon}
              </motion.div>
              {/* Mode indicator dot */}
              {limitedMode && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border border-darkbg" />
              )}
            </div>
            
            {/* Label */}
            <span className={`text-sm font-medium transition-colors ${
              limitedMode
                ? 'text-amber-200/80 group-hover:text-amber-200'
                : 'text-text-secondary group-hover:text-text-primary'
            }`}>
              {q.label}
            </span>

            {/* Static indicator */}
            {limitedMode && (
              <span className="ml-auto text-[10px] text-amber-500/60 font-normal">
                static
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Footer hint */}
      {limitedMode && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-text-muted mt-4"
        >
          💡 Responses are from cached data. AI responses available when quota resets.
        </motion.p>
      )}
    </motion.div>
  );
}
