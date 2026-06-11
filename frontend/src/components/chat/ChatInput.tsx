'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = disabled || isStreaming;

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const text = value.trim();
    if (!text || isDisabled) return;
    onSend(text);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isDisabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 border-t border-[#22d3ee]/10 bg-[#0d1117]/80 backdrop-blur-xl flex-shrink-0 z-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Terminal input box */}
        <div
          className={`
            relative bg-[#0a0a0f] border rounded-xl
            transition-all duration-300
            ${focused
              ? 'border-[#22d3ee]/50 input-circuit-focus data-card-glow-cyan'
              : 'border-[#22d3ee]/15'
            }
          `}
        >
          {/* Terminal prompt prefix */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
            <span className="text-[#22d3ee] font-mono text-sm font-bold">&gt;</span>
            <span className="text-[#64748b] font-mono text-xs">root@cuongmini-os</span>
            <span className="text-[#64748b] font-mono text-xs">:</span>
            <span className="text-[#22d3ee]/60 font-mono text-xs">~</span>
            <span className="text-[#64748b] font-mono text-xs">$</span>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="enter command..."
            disabled={isDisabled}
            rows={1}
            className="w-full pl-[170px] pr-14 py-3 bg-transparent text-[#f8fafc] placeholder:text-[#64748b]/40 font-mono text-sm focus:outline-none resize-none transition-all disabled:opacity-50"
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {/* Execute button */}
          <div className="absolute right-2 bottom-2">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSubmit}
              disabled={!value.trim() || isDisabled}
              className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all shadow-lg overflow-hidden exec-btn-glitch
                ${value.trim() && !isDisabled
                  ? 'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                  : 'bg-[#1a1a24] text-[#64748b] cursor-not-allowed'
                }
              `}
            >
              {isStreaming ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-[11px] text-[#64748b]/50 text-center mt-1.5 font-mono">
          <span className="text-[#22d3ee]/40">//</span> Press Enter to execute &bull; Shift+Enter for new line &bull; AI responses may be incorrect
        </p>
      </div>
    </motion.div>
  );
}
