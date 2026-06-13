'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Copy, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import type { ChatMessage } from '@/types';

// ── Inject cyberpunk scrollbar styles directly (bypasses Tailwind build pipeline) ──
function ChatScrollStyles() {
  useEffect(() => {
    // Only inject once
    if (document.getElementById('chat-messages-scroll-style')) return;
    const style = document.createElement('style');
    style.id = 'chat-messages-scroll-style';
    style.textContent = `
      .chat-messages-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(34, 211, 238, 0.6) rgba(13, 17, 23, 0.8);
      }
      .chat-messages-scroll::-webkit-scrollbar { width: 8px; }
      .chat-messages-scroll::-webkit-scrollbar-track {
        background: rgba(13, 17, 23, 0.8);
        border-radius: 4px;
        margin: 4px 0;
      }
      .chat-messages-scroll::-webkit-scrollbar-thumb {
        background: rgba(34, 211, 238, 0.5);
        border-radius: 4px;
        border: 2px solid rgba(13, 17, 23, 0.8);
      }
      .chat-messages-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(34, 211, 238, 0.75);
      }
      .chat-messages-scroll::-webkit-scrollbar-thumb:active {
        background: rgba(34, 211, 238, 1);
      }
      .chat-messages-scroll::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
    return () => { /* keep styles on mount — re-injecting on unmount is harmless */ };
  }, []);
  return null;
}

// ── Mech Thinking Indicator ────────────────────────────────────────
function MechThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#0d1117] border border-[#22d3ee]/20 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mech-pulse-dot" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mech-pulse-dot" style={{ animationDelay: '0.25s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mech-pulse-dot" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="w-3 h-px bg-[#22d3ee]/30 rounded-full" />
        </div>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl rounded-tl-sm bg-[#0d1117]/80 border border-[#22d3ee]/15 data-card-glow-cyan">
        <span className="text-xs text-[#22d3ee] font-mono">[CuongMini] Processing...</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i === 1 ? '#22d3ee' : i === 0 ? '#8b5cf6' : '#22d3ee' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Data Card Message Bubble ──────────────────────────────────────
function MessageBubble({ msg, isStreaming, isLastAssistant }: {
  msg: ChatMessage;
  isStreaming: boolean;
  isLastAssistant: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-[#ef4444]/80 to-[#dc2626] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
            : 'bg-[#0d1117] border border-[#22d3ee]/20 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="w-2.5 h-px bg-[#22d3ee]/40 rounded-full" />
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className={`flex-1 max-w-[72%] ${isUser ? 'text-right' : ''}`}>
        {/* Terminal label */}
        {!isUser && (
          <div className="flex items-center gap-1 mb-1 px-1">
            <span className="text-[10px] font-mono text-[#22d3ee]/60">
              {isUser ? 'guest@local' : 'ai@cuongmini-os'}
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">:</span>
            <span className="text-[10px] font-mono text-[#22d3ee]/40">~</span>
            <span className="text-[10px] font-mono text-[#64748b]">$</span>
            <span className="text-[10px] font-mono text-[#64748b]">/</span>
            <span className="text-[10px] font-mono text-[#22d3ee]/40">inference</span>
          </div>
        )}

        <motion.div
          ref={bubbleRef}
          className={`inline-block px-4 py-3 text-sm leading-relaxed text-left font-mono ${
            isUser
              ? 'bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/15 text-[#fca5a5] rounded-xl rounded-tr-sm data-card-glow-red border border-[#ef4444]/25'
              : 'bg-[#0d1117]/80 text-[#e2e8f0] rounded-xl rounded-tl-sm data-card-glow-cyan border border-[#22d3ee]/15'
          }`}
        >
          {!isUser ? (
            <div className="markdown-content">
              {/* Guard: ensure msg.content is never undefined/null, else show placeholder */}
              {(() => {
                const raw = msg.content ?? '';
                if (!raw.trim()) {
                  return <span className="text-[#64748b] italic">[CuongMini đang xử lý...]</span>;
                }
                return (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code
                              className="px-1.5 py-0.5 bg-[#22d3ee]/10 rounded text-[#22d3ee] font-mono text-xs border border-[#22d3ee]/20"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-[#0a0a0f] rounded-xl p-3 overflow-x-auto mt-2 mb-2 border border-[#22d3ee]/15">
                            <code className="text-xs text-[#22d3ee] font-mono" {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      a({ href, children }) {
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#22d3ee] underline underline-offset-2 hover:text-[#8b5cf6] transition-colors"
                          >
                            {children}
                          </a>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="text-[#e2e8f0]/90">{children}</li>;
                      },
                      h1({ children }) {
                        return <h1 className="text-lg font-bold text-[#f8fafc] mb-2 mt-3 font-mono">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-base font-bold text-[#f8fafc] mb-2 mt-3 font-mono">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-sm font-semibold text-[#f8fafc] mb-1 mt-2 font-mono">{children}</h3>;
                      },
                      strong({ children }) {
                        return <strong className="font-semibold text-white">{children}</strong>;
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-2 border-[#22d3ee] pl-3 italic text-[#94a3b8] my-2 font-mono">
                            {children}
                          </blockquote>
                        );
                      },
                    }}
                  >
                    {raw}
                  </ReactMarkdown>
                );
              })()}
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          )}

          {/* Blinking cursor */}
          {isStreaming && isLastAssistant && (
            <motion.span
              key="cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-2 h-4 ml-1 bg-[#22d3ee] rounded align-middle"
            />
          )}
        </motion.div>

        {/* Footer */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[11px] text-[#64748b] font-mono">
            {format(new Date(msg.createdAt), 'HH:mm:ss')}
          </span>
          {!isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1 rounded-md text-[#64748b] hover:text-[#22d3ee] hover:bg-[#22d3ee]/5 transition-colors"
              title="Copy response"
            >
              {copied ? (
                <CheckCheck className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatMessages({ messages, isStreaming }: {
  messages: ChatMessage[];
  isStreaming: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change (new message added/updated)
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isStreaming]);

  const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === 'assistant');
  const lastAssistantId = lastAssistantIndex >= 0 ? messages[messages.length - 1 - lastAssistantIndex]?.id : null;

  return (
    <>
      <ChatScrollStyles />
      {/* flex-1 = fill remaining vertical space inside the flex column (header + messages + input) */}
      {/* min-w-0  = allow flex child to shrink below its content size (fixes flex overflow bug) */}
      {/* overflow-y-auto = only THIS container scrolls when content exceeds its height */}
      {/* Custom cyber scrollbar via ChatScrollStyles (injected <style> tag) */}
      <div className="flex-1 min-w-0 overflow-y-auto chat-messages-scroll px-4 sm:px-6 py-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isStreaming={isStreaming}
            isLastAssistant={msg.id === lastAssistantId}
          />
        ))}
      </AnimatePresence>

      {/* Streaming thinking indicator */}
      {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
        <MechThinkingIndicator />
      )}

      {/* Invisible anchor — scrollIntoView target sits after last message */}
      <div ref={endRef} aria-hidden="true" />
    </div>
    </>
  );
}
