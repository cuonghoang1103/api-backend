'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { ChatMessage } from '@/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onCopy?: (content: string) => void;
}

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
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-neon-indigo to-neon-violet shadow-lg shadow-neon-indigo/30'
            : 'bg-gradient-to-br from-neon-violet/20 to-neon-fuchsia/20 border border-neon-violet/20'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <img
            src="/robot-avatar.png"
            alt="AI"
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:16px">🤖</span>';
            }}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className={`flex-1 max-w-[72%] ${isUser ? 'text-right' : ''}`}>
        <motion.div
          ref={bubbleRef}
          initial={{ borderRadius: '1.25rem' }}
          className={`inline-block px-4 py-3 text-sm leading-relaxed text-left ${
            isUser
              ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-2xl rounded-tr-sm shadow-lg shadow-neon-indigo/20'
              : 'bg-darkcard border border-darkborder text-text-primary rounded-2xl rounded-tl-sm'
          }`}
        >
          {!isUser ? (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 bg-white/10 rounded text-neon-cyan font-mono text-xs"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-black/40 rounded-xl p-3 overflow-x-auto mt-2 mb-2 border border-white/10">
                        <code className="text-xs text-neon-cyan font-mono" {...props}>
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
                        className="text-neon-violet underline underline-offset-2 hover:text-neon-fuchsia transition-colors"
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
                    return <li className="text-text-primary/90">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold text-text-primary mb-2 mt-3">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold text-text-primary mb-2 mt-3">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-semibold text-text-primary mb-1 mt-2">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-text-primary">{children}</strong>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-3 border-neon-violet pl-3 italic text-text-secondary my-2">
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          )}

          {/* Streaming cursor */}
          {isStreaming && isLastAssistant && (
            <motion.span
              key="cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-2 h-4 ml-1 bg-neon-violet rounded align-middle"
            />
          )}
        </motion.div>

        {/* Footer */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-text-muted">
            {format(new Date(msg.createdAt), 'HH:mm')}
          </span>
          {!isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
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

export default function ChatMessages({ messages, isStreaming, onCopy }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isStreaming]);

  const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === 'assistant');
  const lastAssistantId = lastAssistantIndex >= 0 ? messages[messages.length - 1 - lastAssistantIndex]?.id : null;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, i) => (
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex gap-3"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-br from-neon-violet/20 to-neon-fuchsia/20 border border-neon-violet/20 flex items-center justify-center overflow-hidden">
            <img src="/robot-avatar.png" alt="AI" className="w-5 h-5 rounded-full object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-darkcard border border-darkborder rounded-2xl rounded-tl-sm">
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-violet" />
              <span className="w-1.5 h-1.5 rounded-full bg-neon-violet" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-neon-violet" style={{ animationDelay: '0.4s' }} />
            </motion.div>
            <span className="text-sm text-text-muted">Thinking...</span>
          </div>
        </motion.div>
      )}

      <div ref={endRef} />
    </div>
  );
}
