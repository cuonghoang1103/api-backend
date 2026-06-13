'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wifi, WifiOff, AlertCircle, RefreshCw, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import MatrixRain from '@/components/chat/MatrixRain';
import LottieClient from '@/components/ui/LottieClient';
import type { ChatMessage, ChatSession } from '@/types';
import { findStaticResponse, getDefaultGreeting, getFallbackResponse } from '@/lib/ai-static-responses';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// ── Robot avatar with LED eyes ────────────────────────────────────
function RobotAvatar({ isStreaming, robotData }: { isStreaming: boolean; robotData?: object }) {
  return (
    <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center bg-[#0d1117] border border-[#22d3ee]/20 shadow-[0_0_16px_rgba(34,211,238,0.15)]">
      <LottieClient animationData={robotData} loop autoplay style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ── Cyber Terminal Welcome ──────────────────────────────────────────
function ChatWelcome({ prompts, onSelect, isLoading, robotData }: {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (p: string) => void;
  isLoading: boolean;
  robotData?: object;
}) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      {/* Robot */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center mb-6 border border-[#22d3ee]/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        style={{ background: '#0d1117' }}
      >
        <LottieClient animationData={robotData} loop autoplay style={{ width: '100%', height: '100%' }} />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8fafc] mb-3 font-mono tracking-tight">
        &gt; <span className="text-[#22d3ee]">CuongMini</span>
        <span className="text-[#64748b]">.ready()</span>
      </h2>
      <p className="text-[#94a3b8] mb-8 max-w-lg font-mono text-sm">
        <span className="text-[#22d3ee]">//</span> CuongMini — RAG-powered AI assistant by CuongHoangDev.
      </p>

      <SuggestedPrompts prompts={prompts} onSelect={onSelect} isLoading={isLoading} />
    </motion.div>
  );
}

export default function ChatPage() {
  const { isAuthenticated: isBackendAuth } = useAuthStore();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const getToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const {
    sessions,
    currentSessionId,
    messages,
    isStreaming,
    suggestedPrompts,
    limitedMode,
    setSessions,
    addSession,
    removeSession,
    setCurrentSessionId,
    addMessage,
    updateLastAssistantMessage,
    removePendingMessage,
    setMessages,
    setStreaming,
    setRobotEmotion,
    setSuggestedPrompts,
    setLimitedMode,
    clearMessages,
  } = useChatStore();

  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [robotData, setRobotData] = useState<object | null>(null);

  // Fetch robot animation data once
  useEffect(() => {
    fetch('/animations/robot.json')
      .then((r) => r.json())
      .then(setRobotData)
      .catch(() => {});
  }, []);

  const currentMessages = currentSessionId ? (messages[currentSessionId] || []) : [];

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await fetch(`/api/v1/system/health`, {
          signal: typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
            ? AbortSignal.timeout(3000)
            : new AbortController().signal
        });
        setBackendConnected(true);
      } catch {
        setBackendConnected(false);
      }
    };
    checkBackend();
  }, []);

  // Fetch sessions from API and merge with persisted state
  useEffect(() => {
    if (!mounted) return;

    const doMerge = () => {
      // Secondary guard: if sessions already populated (non-empty), skip merge
      const currentSessions = useChatStore.getState().sessions;
      if (currentSessions.length > 0) {
        return;
      }

      api.get('/ai/chat/sessions').then((res) => {
        const apiSessions: ChatSession[] = res.data?.data || [];
        const persisted = useChatStore.getState().sessions;
        const persistedIds = new Set(persisted.map(s => s.sessionId));

        // Keep persisted sessions that aren't in API response (local-only sessions)
        const localOnly = persisted.filter(s => !apiSessions.find(a => a.sessionId === s.sessionId));
        // Prefer API data for sessions that exist in both
        const merged = [...localOnly, ...apiSessions];

        setSessions(merged);
        // Keep persisted currentSessionId (don't overwrite)
      }).catch(() => {});
    };

    // Use setTimeout to defer past the initial hydration burst
    const timer = setTimeout(doMerge, 100);
    return () => clearTimeout(timer);
  }, [mounted, setSessions]);

  // Update contextual prompts
  useEffect(() => {
    const msgs = currentSessionId ? (messages[currentSessionId] || []) : [];
    if (msgs.length > 0) {
      const last = msgs[msgs.length - 1];
      if (last.role === 'assistant' && last.content.length > 50) {
        const ctx = getContextualPrompts(last.content);
        if (ctx.length > 0) setSuggestedPrompts(ctx);
      }
    }
  }, [currentSessionId, messages, setSuggestedPrompts]);

  // Trigger glitch when streaming ends
  useEffect(() => {
    if (isStreaming === false && sessionCount > 0) {
      setGlitchTrigger(true);
      const t = setTimeout(() => setGlitchTrigger(false), 600);
      return () => clearTimeout(t);
    }
  }, [isStreaming, sessionCount]);

  const fetchHistory = useCallback(async (sessionId: string) => {
    try {
      const res = await api.get(`/ai/chat/history/${sessionId}`);
      setMessages(sessionId, res.data.data || []);
    } catch { /* ignore */ }
  }, [setMessages]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    await fetchHistory(sessionId);
  }, [setCurrentSessionId, fetchHistory]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      // Only delete from backend if it's not a local temp session
      if (!sessionId.startsWith('local_')) {
        await api.delete(`/ai/chat/sessions/${sessionId}`);
      }
      removeSession(sessionId);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Delete failed');
    }
  }, [removeSession]);

  const sendMessage = useCallback(async (text: string, forceStatic: boolean = false) => {
    if (!text.trim() || isStreaming) return;

    // Determine sessionId: use current, or create a new local one
    let sessionId = currentSessionId;
    let isNewLocalSession = false;

    if (!sessionId) {
      sessionId = `local_${Date.now()}`;
      const newSession: ChatSession = {
        id: Date.now(),
        sessionId,
        title: text.trim().slice(0, 50),
        createdAt: new Date().toISOString(),
      };
      addSession(newSession);
      setCurrentSessionId(sessionId);
      isNewLocalSession = true;
    }

    const tempId = Date.now();
    setSessionCount((c) => c + 1);

    const userMsg: ChatMessage = {
      id: tempId,
      sessionId,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    addMessage(sessionId, userMsg);
    setRobotEmotion('typing');
    setStreaming(true);
    setSuggestedPrompts([]);

    try {
      const shouldUseStatic = forceStatic || limitedMode;

      if (shouldUseStatic) {
        const staticResp = findStaticResponse(text);
        const responseContent = staticResp?.response || getFallbackResponse(text);
        const words = responseContent.split(/(\s+)/);
        let streamedContent = '';

        const assistantMsg: ChatMessage = {
          id: tempId + 1,
          sessionId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        };
        addMessage(sessionId, assistantMsg);

        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 5));
          streamedContent += word;
          updateLastAssistantMessage(sessionId, streamedContent);
        }

        if (forceStatic) {
          setLimitedMode(true, 'AI quota exceeded - Using cached answers');
          toast.info('Limited Mode: AI quota exceeded, using cached answers');
        }

        if (isNewLocalSession) {
          const state = useChatStore.getState();
          const existing = state.sessions.find(s => s.sessionId === sessionId);
          if (existing) {
            removeSession(sessionId);
            addSession({ ...existing, title: text.trim().slice(0, 50) });
          }
        }

        setRobotEmotion('idle');
        setStreaming(false);
        return;
      }

      const res = await fetch(`/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ message: text.trim(), sessionId: sessionId || undefined, topK: 5 }),
      });

      if (!res.ok) throw new Error('Stream failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantContent = '';
      let resolvedSessionId = '';
      const assistantTempId = tempId + 1;

      const assistantMsg: ChatMessage = {
        id: assistantTempId,
        sessionId,
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

            if (data.type === 'connected') {
              if (data.sessionId) resolvedSessionId = data.sessionId;
              continue;
            }
            if (data.type === 'done' || data.type === 'error') continue;

            const text = data.text ?? data.content ?? '';
            if (text) {
              assistantContent += text;
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

      // Migrate to backend session if resolved
      if (resolvedSessionId) {
        const localMessages = useChatStore.getState().messages[sessionId] || [];

        if (isNewLocalSession || sessionId.startsWith('local_')) {
          removeSession(sessionId);
        }

        // Merge messages into backend session (don't overwrite existing)
        const existingBackendMessages = useChatStore.getState().messages[resolvedSessionId] || [];
        const mergedMessages = [...existingBackendMessages, ...localMessages];

        const newSession: ChatSession = {
          id: Date.now(),
          sessionId: resolvedSessionId,
          title: text.trim().slice(0, 50),
          createdAt: new Date().toISOString(),
        };
        addSession(newSession);
        setCurrentSessionId(resolvedSessionId);

        // Store merged messages under resolvedSessionId
        setMessages(resolvedSessionId, mergedMessages);
        // Clear the old local session messages (already migrated)
        if (sessionId !== resolvedSessionId) {
          useChatStore.setState((state) => {
            const { [sessionId]: _, ...rest } = state.messages;
            return { messages: rest };
          });
        }
      } else {
        // No backend session: keep local, update title
        const state = useChatStore.getState();
        const existing = state.sessions.find(s => s.sessionId === sessionId);
        if (existing) {
          removeSession(sessionId);
          addSession({ ...existing, title: text.trim().slice(0, 50) });
        }
      }

      const ctx = getContextualPrompts(assistantContent);
      if (ctx.length > 0) setSuggestedPrompts(ctx);

      const lower = assistantContent.toLowerCase();
      if (lower.includes('!') || lower.includes('great') || lower.includes('awesome')) {
        setRobotEmotion('excited');
      } else if (lower.includes('sorry') || lower.includes('not sure')) {
        setRobotEmotion('sad');
      } else if (lower.includes('thanks') || lower.includes('helpful')) {
        setRobotEmotion('happy');
      } else {
        setRobotEmotion('idle');
      }
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('AI connection error. Please check if backend is running.');
      removePendingMessage(sessionId, tempId);
      setRobotEmotion('sad');
      const staticResp = findStaticResponse(text);
      if (staticResp) {
        const assistantMsg: ChatMessage = {
          id: tempId + 1,
          sessionId,
          role: 'assistant',
          content: staticResp.response,
          createdAt: new Date().toISOString(),
        };
        addMessage(sessionId, assistantMsg);
        setLimitedMode(true, 'AI unavailable - Using cached answers');
        toast.info('Using cached answers due to connection error.');
      }
    } finally {
      setStreaming(false);
    }
  }, [
    isStreaming, currentSessionId, addMessage, setStreaming, setRobotEmotion,
    setSuggestedPrompts, setMessages, setCurrentSessionId, addSession,
    updateLastAssistantMessage, removePendingMessage, removeSession, limitedMode, setLimitedMode,
    getToken,
  ]);

  const handlePromptSelect = useCallback((prompt: string, forceStatic?: boolean) => {
    inputRef.current?.focus();
    sendMessage(prompt, forceStatic);
  }, [sendMessage]);

  const handleNewSession = useCallback(() => {
    // Create a new local session with a unique temp ID
    const tempId = `local_${Date.now()}`;
    const newSession: ChatSession = {
      id: Date.now(),
      sessionId: tempId,
      title: 'New chat',
      createdAt: new Date().toISOString(),
    };
    addSession(newSession);
    setCurrentSessionId(tempId);
    clearMessages(tempId);
    setSuggestedPrompts(getContextualPrompts(''));
    setRobotEmotion('idle');
    setLimitedMode(false, '');
  }, [addSession, setCurrentSessionId, clearMessages, setSuggestedPrompts, setRobotEmotion, setLimitedMode]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden cyber-grid-bg pt-16">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* ── Persistent left sidebar: chat sessions ───────────────────── */}
      <aside className="fixed top-16 left-0 bottom-0 w-72 z-20 flex flex-col
        bg-[#0d1117]/95 backdrop-blur-xl
        border-r border-[#22d3ee]/10
        shadow-[4px_0_32px_rgba(0,0,0,0.4)]">

        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-[#22d3ee]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22d3ee] led-eye" />
            <span className="font-mono text-sm font-semibold text-[#f8fafc]">
              <span className="text-[#64748b]">~/</span>
              <span className="text-[#22d3ee]">sessions</span>
            </span>
          </div>
        </div>

        {/* New session button */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => { setCurrentSessionId(null); setSuggestedPrompts(getContextualPrompts('')); }}
            className="w-full flex items-center gap-2 px-4 py-2.5
              bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]
              text-white text-sm font-mono font-semibold rounded-xl
              hover:opacity-90 transition-opacity
              shadow-[0_0_16px_rgba(34,211,238,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>&gt; new_session()</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {sessions.length === 0 && (
            <p className="text-[#64748b] text-xs text-center py-8 px-2 font-mono">
              <span className="text-[#22d3ee]">//</span> no sessions found
            </p>
          )}
          {sessions.map((session) => (
            <button
              key={session.sessionId}
              onClick={() => handleSelectSession(session.sessionId)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all relative group
                ${currentSessionId === session.sessionId
                  ? 'bg-[#22d3ee]/10 text-[#f8fafc] border border-[#22d3ee]/20'
                  : 'hover:bg-[#22d3ee]/5 text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
            >
              <div className="flex items-start gap-2 pr-8">
                <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#64748b]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono truncate">
                    <span className="text-[#64748b]">$ </span>
                    <span className={currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                      {session.title || 'New chat'}
                    </span>
                  </p>
                  <p className="text-[10px] font-mono text-[#64748b] mt-0.5">
                    {format(new Date(session.createdAt), 'dd/MM/yy HH:mm', { locale: vi })}
                  </p>
                </div>
              </div>
              {currentSessionId === session.sessionId && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye" />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.sessionId); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                  text-[#64748b] hover:text-red-400 hover:bg-red-500/10
                  opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#22d3ee]/10 shrink-0">
          <p className="text-[10px] font-mono text-[#64748b]/50 text-center">
            <span className="text-[#22d3ee]/40">/* </span>CuongMini-OS v1.0<span className="text-[#22d3ee]/40"> */</span>
          </p>
        </div>
      </aside>

      {/* ── Main chat: centered content area ────────────────────────── */}
      <main className="pl-72 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Cyber Terminal Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-3 border-b border-[#22d3ee]/10 flex items-center gap-4 flex-shrink-0
            bg-[#0d1117]/60 backdrop-blur-md"
        >
          {/* Robot avatar */}
          <motion.div
            animate={{ rotate: isStreaming ? 360 : 0 }}
            transition={{ duration: isStreaming ? 2 : 0, repeat: isStreaming ? Infinity : 0, ease: 'linear' }}
          >
            <RobotAvatar isStreaming={isStreaming} robotData={robotData ?? undefined} />
          </motion.div>

          {/* Title */}
          <div className="flex-1">
            <h1 className="font-mono font-bold text-[#f8fafc] flex items-center gap-2 text-sm">
              <span className="text-[#22d3ee]">root</span>
              <span className="text-[#64748b]">@</span>
              <span className={`text-[#22d3ee] ${glitchTrigger ? 'glitch-burst' : ''}`} data-text="CuongMini-OS">
                CuongMini-OS
              </span>
              <span className="text-[#64748b]">:~#</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-sans ${
                isStreaming ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30' : 'bg-[#22d3ee]/8 text-[#64748b] border border-[#22d3ee]/15'
              }`}>
                {isStreaming ? '[Active]' : '[Ready]'}
              </span>
              {limitedMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Limited
                </span>
              )}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-[#64748b] font-mono">
                {limitedMode ? (
                  <><span className="text-amber-400/80">CACHED</span> • {isAuthenticated ? 'AUTH' : 'GUEST'}</>
                ) : (
                  <>RAG-powered • {isAuthenticated ? 'AUTH' : 'GUEST'}</>
                )}
              </p>
              {backendConnected !== null && !limitedMode && (
                <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  backendConnected ? 'bg-[#22d3ee]/10 text-[#22d3ee]' : 'bg-red-500/10 text-red-400'
                }`}>
                  {backendConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span className="hidden sm:inline">{backendConnected ? 'Online' : 'Offline'}</span>
                </div>
              )}
              {limitedMode && (
                <button
                  onClick={() => setLimitedMode(false, '')}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] hover:bg-[#22d3ee]/20 transition-colors font-mono"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try AI</span>
                </button>
              )}
            </div>
          </div>

          {/* Back to home */}
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/5 text-[#64748b] hover:text-[#f8fafc] transition-colors"
            title="Back to home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scanlines chat-messages-scroll">
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-[#64748b] font-mono">[ loading systems... ]</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentMessages.length === 0 ? (
                <ChatWelcome
                  key="welcome"
                  prompts={suggestedPrompts}
                  onSelect={handlePromptSelect}
                  isLoading={isStreaming}
                  robotData={robotData ?? undefined}
                />
              ) : (
                <ChatMessages
                  key="messages"
                  messages={currentMessages}
                  isStreaming={isStreaming}
                />
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Input — always at bottom */}
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </main>
    </div>
  );
}
