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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = disabled || isStreaming;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const text = value.trim();
    if (!text || isDisabled) return;
    onSend(text);
    setValue('');
    // Reset height
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
      className="p-4 border-t border-darkborder bg-darkbg/80 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-darkcard border border-darkborder rounded-2xl focus-within:border-neon-violet/50 transition-colors shadow-lg shadow-black/20">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about CuongHoang's portfolio, skills, projects..."
            disabled={isDisabled}
            rows={1}
            className="w-full px-4 py-3 pr-14 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none resize-none transition-all disabled:opacity-50"
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {/* Send button */}
          <div className="absolute right-2 bottom-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!value.trim() || isDisabled}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                value.trim() && !isDisabled
                  ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-neon-indigo/30'
                  : 'bg-white/5 text-text-muted cursor-not-allowed'
              }`}
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

        <p className="text-xs text-text-muted text-center mt-2">
          AI may be incorrect. Verify important information.
        </p>
      </div>
    </motion.div>
  );
}
