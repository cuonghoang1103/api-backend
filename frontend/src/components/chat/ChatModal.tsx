'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, MessageSquare, Loader2, Sparkles, Copy, CheckCheck, User, Send } from 'lucide-react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { ChatMessage, ChatSession } from '@/types';

interface ChatModalProps {
  onClose: () => void;
}

const INITIAL_PROMPTS = [
  { id: '1', label: 'About', icon: '👤', prompt: 'Tell me about CuongHoang' },
  { id: '2', label: 'Skills', icon: '⚡', prompt: 'What skills does CuongHoang have?' },
  { id: '3', label: 'Projects', icon: '🚀', prompt: 'What projects has CuongHoang built?' },
  { id: '4', label: 'Blog', icon: '📝', prompt: 'Show me recent blog posts' },
];

function ChatBubble({ msg, isLastAssistant }: { msg: ChatMessage; isLastAssistant: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
        isUser
          ? 'bg-gradient-to-br from-neon-indigo to-neon-violet'
          : 'bg-neon-violet/20 border border-neon-violet/20'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <img src="/robot-avatar.png" alt="Ai CuongMini" className="w-4 h-4 rounded-full object-cover" />}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-3 py-2 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-tr-sm'
            : 'bg-[#1e1e2e] border border-[#2a2a3e] text-[#e2e8f0] rounded-tl-sm'
        }`}>
          {!isUser ? (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1 py-0.5 bg-white/10 rounded text-[#22d3ee] font-mono text-[11px]" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-black/50 rounded-lg p-2 overflow-x-auto mt-1 mb-1">
                        <code className="text-[#22d3ee] font-mono text-[10px]" {...props}>{children}</code>
                      </pre>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-neon-violet underline underline-offset-2">
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
          {isLastAssistant && (
            <motion.span
              key="cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 ml-1 bg-neon-violet rounded align-middle"
            />
          )}
        </div>
        {/* Copy button + time */}
        {!isUser && (
          <div className={`flex items-center gap-1 mt-0.5 ${isUser ? 'justify-end' : ''}`}>
            <button
              onClick={handleCopy}
              className="p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
            >
              {copied ? <CheckCheck className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
            <span className="text-[10px] text-text-muted">
              {new Date(msg.createdAt).toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <div className="w-7 h-7 rounded-xl bg-neon-violet/20 border border-neon-violet/20 flex items-center justify-center text-xs overflow-hidden">
        <img src="/robot-avatar.png" alt="Ai" className="w-4 h-4 rounded-full object-cover" />
      </div>
      <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[#1e1e2e] border border-[#2a2a3e]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neon-violet"
              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentMessages = currentSessionId ? (messages[currentSessionId] || []) : messages['__modal__'] || [];
  const modalMessages = messages['__modal__'] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [modalMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update emotion based on streaming
  useEffect(() => {
    if (isStreaming) {
      setRobotEmotion('typing');
    } else if (modalMessages.length > 0) {
      const last = modalMessages[modalMessages.length - 1];
      if (last?.role === 'assistant') {
        const content = last.content.toLowerCase();
        if (content.includes('!') || content.includes('great') || content.includes('awesome')) {
          setRobotEmotion('excited');
        } else if (content.includes('thanks') || content.includes('helpful')) {
          setRobotEmotion('happy');
        } else if (content.includes('sorry') || content.includes("don't know")) {
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
      const res = await fetch(
        `/api/v1/ai/chat`,
        {
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
        }
      );

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
              // Persist to backend session if new
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

      // Finalize: create a local session if no backend session
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

      // Update contextual prompts
      const ctx = getContextualPrompts(assistantContent);
      if (ctx.length > 0) setSuggestedPrompts(ctx);
      setShowPrompts(true);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('AI connection error. Please check if backend is running.');
      // Remove failed messages
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed bottom-24 right-6 z-[120] w-[390px] max-w-[calc(100vw-48px)] h-[580px] max-h-[calc(100vh-140px)] bg-[#0f0f1a] rounded-3xl border border-[#2a2a3e] shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a3e] bg-gradient-to-r from-neon-indigo/10 to-neon-violet/10 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center shadow-lg shadow-neon-violet/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">Ai CuongMini</h2>
            <p className="text-xs text-text-muted">
              {isStreaming ? 'Thinking...' : isAuthenticated ? 'Online • RAG powered' : 'Online • Guest mode'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-colors"
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
              <img src="/robot-avatar.png" alt="Ai CuongMini" className="w-12 h-12 rounded-2xl object-cover mx-auto mb-3 shadow-lg" />
              <p className="text-sm text-text-secondary mb-4">
                Hi! Ask me anything about CuongHoang's portfolio, skills, or projects.
              </p>

              {/* Prompts */}
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
                      className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl text-left hover:border-neon-violet/30 transition-colors"
                    >
                      <span className="text-sm">{p.icon}</span>
                      <span className="text-xs text-text-secondary">{p.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence mode="popLayout">
            {modalMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                isLastAssistant={msg.id === lastAssistantId && isStreaming}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isStreaming && modalMessages[modalMessages.length - 1]?.role !== 'assistant' && (
            <TypingIndicator />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[#2a2a3e] flex-shrink-0 bg-[#0a0a14]">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 px-3 py-2.5 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-none transition-colors"
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isStreaming}
              className={`px-3 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isStreaming
                  ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-lg shadow-neon-violet/20'
                  : 'bg-[#1a1a2e] text-text-muted cursor-not-allowed'
              }`}
            >
              {isStreaming ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
