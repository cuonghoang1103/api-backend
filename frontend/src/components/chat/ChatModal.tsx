'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Loader2, Copy, CheckCheck, User } from 'lucide-react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { ChatMessage, ChatSession } from '@/types';

const INITIAL_PROMPTS = [
  { id: '1', label: 'About', icon: '1', prompt: 'Tell me about CuongHoang' },
  { id: '2', label: 'Skills', icon: '2', prompt: 'What skills does CuongHoang have?' },
  { id: '3', label: 'Projects', icon: '3', prompt: 'What projects has CuongHoang built?' },
  { id: '4', label: 'Blog', icon: '4', prompt: 'Show me recent blog posts' },
];

// ── Mech typing indicator ─────────────────────────────────────────
function MechTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <div className="w-8 h-8 rounded-xl bg-[#0d1117] border border-[#22d3ee]/20 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#22d3ee] mech-pulse-dot" />
            <div className="w-1 h-1 rounded-full bg-[#22d3ee] mech-pulse-dot" style={{ animationDelay: '0.25s' }} />
          </div>
          <div className="w-2 h-px bg-[#22d3ee]/30" />
        </div>
      </div>
      <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-[#0d1117]/80 border border-[#22d3ee]/15 data-card-glow-cyan">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i === 1 ? '#22d3ee' : i === 0 ? '#8b5cf6' : '#22d3ee' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Data card bubble ─────────────────────────────────────────────
function ChatBubble({ msg, isLastAssistant, isStreaming }: {
  msg: ChatMessage;
  isLastAssistant: boolean;
  isStreaming: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-[#ef4444]/80 to-[#dc2626] shadow-[0_0_8px_rgba(239,68,68,0.25)]'
          : 'bg-[#0d1117] border border-[#22d3ee]/20 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#22d3ee] led-eye" />
              <div className="w-1 h-1 rounded-full bg-[#22d3ee] led-eye" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="w-2 h-px bg-[#22d3ee]/40 rounded-full" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        {/* Terminal path */}
        {!isUser && (
          <div className="flex items-center gap-1 mb-0.5 px-1">
            <span className="text-[9px] font-mono text-[#22d3ee]/50">ai@cuongmini-os:~/inference$</span>
          </div>
        )}

        <div className={`inline-block px-3 py-2 rounded-xl text-xs leading-relaxed font-mono ${
          isUser
            ? 'bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/15 text-[#fca5a5] rounded-tr-sm data-card-glow-red border border-[#ef4444]/20'
            : 'bg-[#0d1117]/80 border border-[#22d3ee]/15 text-[#e2e8f0] rounded-tl-sm data-card-glow-cyan'
        }`}>
          {!isUser ? (
            <div className="markdown-content text-xs">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1 py-0.5 bg-[#22d3ee]/10 rounded text-[#22d3ee] font-mono text-[10px] border border-[#22d3ee]/15" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-[#0a0a0f] rounded-lg p-2 overflow-x-auto mt-1 mb-1">
                        <code className="text-[10px] text-[#22d3ee] font-mono" {...props}>{children}</code>
                      </pre>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-[#22d3ee] underline underline-offset-2">
                        {children}
                      </a>
                    );
                  },
                  p({ children }) { return <p className="mb-1 last:mb-0">{children}</p>; },
                  ul({ children }) { return <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>; },
                  ol({ children }) { return <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>; },
                  li({ children }) { return <li className="text-[#e2e8f0]/90">{children}</li>; },
                  strong({ children }) { return <strong className="font-semibold text-white">{children}</strong>; },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          )}
          {/* Cursor */}
          {isLastAssistant && isStreaming && (
            <motion.span
              key="cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1.5 h-3 ml-1 bg-[#22d3ee] rounded align-middle"
            />
          )}
        </div>

        {/* Copy + time */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-0.5 px-1">
            <button onClick={handleCopy} className="p-0.5 rounded text-[#64748b] hover:text-[#22d3ee] transition-colors">
              {copied ? <CheckCheck className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
            <span className="text-[10px] text-[#64748b] font-mono">
              {new Date(msg.createdAt).toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const { isAuthenticated: isBackendAuth } = useAuthStore();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const getToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const {
    currentSessionId, messages, isStreaming,
    setCurrentSessionId, addMessage, updateLastAssistantMessage,
    removePendingMessage, setMessages, setStreaming, setRobotEmotion,
    setSuggestedPrompts, addSession, sessions,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);
  const [focused, setFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const modalMessages = messages['__modal__'] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [modalMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isStreaming) {
      setRobotEmotion('typing');
    } else if (modalMessages.length > 0) {
      const last = modalMessages[modalMessages.length - 1];
      if (last?.role === 'assistant') {
        const content = last.content.toLowerCase();
        if (content.includes('!') || content.includes('great')) {
          setRobotEmotion('excited');
        } else if (content.includes('thanks')) {
          setRobotEmotion('happy');
        } else if (content.includes('sorry')) {
          setRobotEmotion('sad');
        } else {
          setRobotEmotion('idle');
        }
      }
    }
  }, [isStreaming, modalMessages.length]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const sessionId = '__modal__';
    const tempId = Date.now();

    const userMsg: ChatMessage = {
      id: tempId,
      sessionId,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    addMessage(sessionId, userMsg);
    setInput('');
    setShowPrompts(false);
    setRobotEmotion('typing');
    setStreaming(true);

    try {
      const res = await fetch(`/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: currentSessionId || undefined,
          topK: 5,
        }),
      });

      if (!res.ok) throw new Error('Stream failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantContent = '';
      let resolvedSessionId = currentSessionId || '';
      const assistantTempId = tempId + 1;

      const assistantMsg: ChatMessage = {
        id: assistantTempId,
        sessionId: resolvedSessionId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };
      addMessage(sessionId, assistantMsg);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const data = JSON.parse(raw);

            if (data.sessionId && !resolvedSessionId) {
              resolvedSessionId = data.sessionId;
              setCurrentSessionId(resolvedSessionId);
              continue;
            }
            if (data.done) {
              if (resolvedSessionId && !currentSessionId) {
                const newSession: ChatSession = {
                  id: Date.now(),
                  sessionId: resolvedSessionId,
                  title: text.trim().slice(0, 50),
                  createdAt: new Date().toISOString(),
                };
                addSession(newSession);
              }
              continue;
            }
            if (data.error) {
              toast.error(data.error);
              continue;
            }
            if (data.text) {
              assistantContent += data.text;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          } catch {
            if (raw) {
              assistantContent += raw;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          }
        }
      }

      if (!resolvedSessionId) {
        const finalId = Date.now().toString();
        const finalMsg = { ...assistantMsg, id: Date.now() + 1, sessionId: finalId, content: assistantContent };
        setMessages(finalId, [userMsg, finalMsg]);
        setCurrentSessionId(finalId);
        const newSession: ChatSession = {
          id: Date.now(),
          sessionId: finalId,
          title: text.trim().slice(0, 50),
          createdAt: new Date().toISOString(),
        };
        addSession(newSession);
      }

      const ctx = getContextualPrompts(assistantContent);
      if (ctx.length > 0) setSuggestedPrompts(ctx);
      setShowPrompts(true);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('AI connection error. Please check if backend is running.');
      setMessages(sessionId, (messages[sessionId] || []).filter(m => m.id !== tempId && m.id !== (tempId + 1)));
      setRobotEmotion('sad');
    } finally {
      setStreaming(false);
    }
  }, [isStreaming, currentSessionId, addMessage, setStreaming, setRobotEmotion,
      currentMessages, setSuggestedPrompts, setMessages, setCurrentSessionId, addSession,
      updateLastAssistantMessage, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    inputRef.current?.focus();
    handleSend(prompt);
  };

  const lastAssistantId = [...modalMessages].reverse().find(m => m.role === 'assistant')?.id ?? null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
      />

      {/* Modal — Cyber OS Terminal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed bottom-24 right-6 z-[120] w-[390px] max-w-[calc(100vw-48px)] h-[580px] max-h-[calc(100vh-140px)]
          bg-[#0d1117]/95 backdrop-blur-xl
          rounded-2xl
          border border-[#22d3ee]/15
          shadow-[0_0_40px_rgba(34,211,238,0.08),0_8px_32px_rgba(0,0,0,0.8)]
          flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#22d3ee]/10 bg-[#0d1117]/60 flex-shrink-0">
          {/* Robot LED avatar */}
          <div className="relative w-10 h-10 rounded-xl bg-[#0a0a0f] border border-[#22d3ee]/20 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.1)]">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full bg-[#22d3ee] ${isStreaming ? 'animate-pulse' : 'led-eye'}`} />
                <div className={`w-2 h-2 rounded-full bg-[#22d3ee] ${isStreaming ? 'animate-pulse' : 'led-eye'}`} style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="w-3 h-px bg-[#22d3ee]/40 rounded-full" />
            </div>
          </div>

          <div className="flex-1">
            {/* Terminal prompt */}
            <h2 className="text-sm font-mono font-semibold text-[#f8fafc]">
              <span className="text-[#22d3ee]">root</span>
              <span className="text-[#64748b]">@</span>
              <span className="text-[#22d3ee]">CuongMini-OS</span>
              <span className="text-[#64748b]">:~#</span>
            </h2>
            <p className="text-[11px] text-[#64748b] font-mono">
              {isStreaming ? (
                <><span className="text-[#22d3ee]">[SYS]</span> Processing... {isAuthenticated ? 'AUTH' : 'GUEST'}</>
              ) : (
                <><span className="text-green-400">ONLINE</span> {isAuthenticated ? 'AUTH' : 'GUEST'}</>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#22d3ee]/10 text-[#64748b] hover:text-[#22d3ee] transition-colors border border-transparent hover:border-[#22d3ee]/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Welcome */}
          {modalMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              {/* Cyber robot avatar */}
              <div className="w-16 h-16 rounded-2xl mx-auto mb-3 bg-[#0d1117] border border-[#22d3ee]/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] led-eye" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] led-eye" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="w-4 h-px bg-[#22d3ee]/40 rounded-full mt-1" />
                </div>
              </div>
              <p className="text-xs text-[#64748b] font-mono mb-4">
                <span className="text-[#22d3ee]">//</span> Ask about CuongHoang's portfolio, skills &amp; projects.
              </p>

              {/* Prompt grid */}
              {showPrompts && (
                <div className="grid grid-cols-2 gap-2">
                  {INITIAL_PROMPTS.map((p, i) => (
                    <motion.button
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePromptSelect(p.prompt)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0f] border border-[#22d3ee]/15 rounded-xl text-left hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/5 transition-all data-card-glow-cyan"
                    >
                      <span className="text-[10px] font-mono text-[#22d3ee]">{p.icon}.</span>
                      <span className="text-xs text-[#94a3b8] font-mono">{p.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {modalMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                isLastAssistant={msg.id === lastAssistantId}
                isStreaming={isStreaming}
              />
            ))}
          </AnimatePresence>

          {isStreaming && modalMessages[modalMessages.length - 1]?.role !== 'assistant' && (
            <MechTypingIndicator />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[#22d3ee]/10 bg-[#0a0a0f]/80 flex-shrink-0">
          <div className="relative">
            {/* Terminal prompt */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
              <span className="text-[#22d3ee] font-mono text-xs font-bold">&gt;</span>
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="enter command..."
              rows={1}
              className={`
                w-full pl-7 pr-12 py-2.5 bg-[#0a0a0f] rounded-xl text-xs text-[#f8fafc]
                placeholder:text-[#64748b]/40 font-mono focus:outline-none resize-none
                transition-all disabled:opacity-50
                ${focused
                  ? 'border border-[#22d3ee]/50 input-circuit-focus'
                  : 'border border-[#22d3ee]/15'
                }
              `}
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isStreaming}
              className={`
                absolute right-1.5 bottom-1.5 w-8 h-8 rounded-lg flex items-center justify-center
                transition-all overflow-hidden exec-btn-glitch
                ${input.trim() && !isStreaming
                  ? 'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'bg-[#1a1a24] text-[#64748b] cursor-not-allowed'
                }
              `}
            >
              {isStreaming ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-3.5 h-3.5" />
                </motion.div>
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
