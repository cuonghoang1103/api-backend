'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wifi, WifiOff, AlertCircle, RefreshCw, Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import MatrixRain from '@/components/chat/MatrixRain';
import QuotaIndicator from '@/components/chat/QuotaIndicator';
import LottieClient from '@/components/ui/LottieClient';
import type { ChatMessage, ChatSession } from '@/types';
import { findStaticResponse, getDefaultGreeting, getFallbackResponse } from '@/lib/ai-static-responses';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Build version marker. This is a fixed ribbon that
  // shows the current commit hash + build time. It is
  // ALWAYS visible on /chat, no matter what, so that the
  // user can confirm at a glance whether the browser is
  // running the new bundle or a cached old one. The text
  // is intentionally small and tucked into a corner so it
  // doesn't interfere with the chat UI.
  //
  // Bump the BUILD_TAG every time you deploy a chat-side
  // change. If the user reports "no change" again, they
  // can read this ribbon and instantly know whether the
  // browser is on the new build.
  const BUILD_TAG = 'chat-v13-navbar-dock-final-2026-06-16T07:35Z-pending';
  const [showBuildTag, setShowBuildTag] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only show the ribbon when ?build=1 is in the URL,
    // so the ribbon doesn't show in normal use. Press 'B'
    // to toggle it.
    const check = () => {
      const url = new URL(window.location.href);
      setShowBuildTag(url.searchParams.get('build') === '1');
    };
    check();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        if (e.target instanceof HTMLElement) {
          const tag = e.target.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        }
        const url = new URL(window.location.href);
        if (url.searchParams.get('build') === '1') {
          url.searchParams.delete('build');
        } else {
          url.searchParams.set('build', '1');
        }
        window.history.replaceState({}, '', url.toString());
        check();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Chat sessions aside — same floating-panel pattern as
  // the global NavigationDock. Hidden by default, slides
  // in from the left when the user taps the toggle
  // button. The toggle button lives at top-4 left-4 (the
  // same corner as the global dock toggle) but is
  // positioned at top-4 left-16 so it sits to the right
  // of the global toggle when both are visible. When the
  // global dock is closed, the chat-aside toggle still
  // works on its own.
  const [chatAsideOpen, setChatAsideOpen] = useState(false);
  const [chatAsideHovered, setChatAsideHovered] = useState<string | null>(null);
  useEffect(() => {
    if (!chatAsideOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatAsideOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatAsideOpen]);
  // Close on route change.
  useEffect(() => {
    setChatAsideOpen(false);
    setChatAsideHovered(null);
  }, [pathname]);

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

      // Quota counter is auto-incremented by backend middleware (quotaMiddleware on /ai/chat).
      // No need to call /quota/track from frontend — QuotaIndicator auto-refreshes every 30s.

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
        toast.info('AI unavailable — using cached answers');
      } else {
        toast.error('AI connection error. Please check if backend is running.');
        setRobotEmotion('sad');
      }
      removePendingMessage(sessionId, tempId);
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
    <div className="force-dark relative min-h-screen w-full overflow-hidden cyber-grid-bg pt-16">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* ── Chat sessions aside (floating panel) ──────────
          Hidden by default. Slides in from the left when
          the user taps the toggle button at top-left
          (positioned next to the global dock toggle). The
          panel uses the same iOS sheet-presentation
          pattern as the global dock: dim+blur backdrop,
          spring slide-in with a slight scale-up, rounded
          glass surface, hover magnify on the session
          rows. */}
      <AnimatePresence>
        {chatAsideOpen && (
          <motion.div
            key="chat-aside-backdrop"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.32, ease: [0.32, 0.94, 0.6, 1] }}
            className="fixed inset-0 z-[55] bg-black/55"
            onClick={() => { setChatAsideOpen(false); setChatAsideHovered(null); }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatAsideOpen && (
          <motion.aside
            key="chat-aside-panel"
            id="chat-sessions-panel"
            role="dialog"
            aria-label="Chat sessions"
            initial={{ opacity: 0, x: -40, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -32, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.95 }}
            onMouseLeave={() => setChatAsideHovered(null)}
            className="fixed z-[58] top-3 bottom-3 left-3 w-[288px] flex flex-col
              bg-[#0d1117]/85 backdrop-blur-2xl
              border border-white/[0.08]
              rounded-3xl
              shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)]
              overflow-hidden"
            data-build-tag="chat-aside-v3-floating"
          >
            {/* Aside header — pt-20 leaves room for the
                chat-aside toggle button at top-4 in the
                same corner. */}
            <div className="shrink-0 px-5 pt-20 pb-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
                chat
              </p>
              <p className="text-lg font-semibold text-text-primary mt-1">
                Sessions
              </p>
            </div>

            {/* New session button */}
            <div className="px-4 pb-3 shrink-0">
              <button
                onClick={() => {
                  setCurrentSessionId(null);
                  setSuggestedPrompts(getContextualPrompts(''));
                  setChatAsideOpen(false);
                }}
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

            {/* Session list — magnify on hover. */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {sessions.length === 0 && (
                <p className="text-[#64748b] text-xs text-center py-8 px-2 font-mono">
                  <span className="text-[#22d3ee]">//</span> no sessions found
                </p>
              )}
              {sessions.map((session, idx) => {
                const isCurrent = currentSessionId === session.sessionId;
                const isHovered = chatAsideHovered === session.sessionId;
                let scale = 1;
                if (chatAsideHovered) {
                  const hovIdx = sessions.findIndex((s) => s.sessionId === chatAsideHovered);
                  if (hovIdx >= 0) {
                    const d = Math.abs(idx - hovIdx);
                    if (d === 0) scale = 1.55;
                    else if (d === 1) scale = 1.30;
                    else if (d === 2) scale = 1.15;
                  }
                }
                return (
                  <motion.div
                    key={session.sessionId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + idx * 0.02, duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
                    onMouseEnter={() => setChatAsideHovered(session.sessionId)}
                    onMouseLeave={() => {
                      setChatAsideHovered((prev) => (prev === session.sessionId ? null : prev));
                    }}
                    className="relative"
                  >
                    <button
                      onClick={() => {
                        handleSelectSession(session.sessionId);
                        setChatAsideOpen(false);
                      }}
                      className={cn(
                        'w-full text-left pl-3 pr-3 h-12 rounded-2xl',
                        'flex items-center transition-colors duration-150',
                        isCurrent
                          ? 'bg-gradient-to-r from-[#22d3ee]/15 to-[#8b5cf6]/10 text-text-primary'
                          : isHovered
                            ? 'bg-white/[0.06] text-text-primary'
                            : 'text-text-muted hover:text-text-primary',
                      )}
                    >
                      {isCurrent && (
                        <motion.div
                          layoutId="chat-aside-active"
                          className="absolute -left-1 top-2 bottom-2 w-[3px] rounded-full"
                          style={{
                            background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
                            boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.5 }}
                        />
                      )}
                      <motion.div
                        className="flex items-center justify-center w-7 h-7 origin-center"
                        animate={{ scale }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.55 }}
                      >
                        <MessageSquare
                          className={cn(
                            'w-[18px] h-[18px] transition-colors duration-150',
                            isCurrent || isHovered ? 'text-text-primary' : 'text-text-muted',
                          )}
                        />
                      </motion.div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-[14px] font-medium truncate">
                          {session.title || 'New chat'}
                        </p>
                        <p className="text-[10px] font-mono text-text-muted/70 mt-0.5">
                          {format(new Date(session.createdAt), 'dd/MM/yy HH:mm', { locale: vi })}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye shrink-0" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.sessionId); }}
                        className="ml-1 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-white/[0.04] transition-colors shrink-0"
                        aria-label="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Aside footer — Esc hint. */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.06]">
              <p className="text-[10px] font-mono text-text-muted">
                Press <kbd className="px-1 py-0.5 mx-0.5 rounded bg-white/5 border border-white/10">Esc</kbd> to close
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Chat-aside toggle button — to the RIGHT of the
          global dock toggle (which is at top-4 left-4).
          Only relevant on /chat. Sits at top-4 left-16. */}
      <motion.button
        type="button"
        aria-label={chatAsideOpen ? 'Close chat sessions' : 'Open chat sessions'}
        aria-expanded={chatAsideOpen}
        onClick={() => setChatAsideOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.55 }}
        className="fixed top-4 left-16 z-[70] w-11 h-11 rounded-2xl
          flex items-center justify-center
          bg-[#0d1117]/85 backdrop-blur-2xl
          border border-white/10
          shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]
          text-text-primary
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          {chatAsideOpen ? (
            <motion.span
              key="x-icon"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
            >
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="menu-icon"
              initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
            >
              <MessageSquare className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Main chat: centered content area ──────────────────────
          The aside is now a floating panel that only appears
          when the user taps the chat-aside toggle. Main
          content is full-width and centered, with pt-16 to
          clear the global Navbar. The chat-aside toggle
          button sits at top-4 left-16, so we add a small
          pl-4 on the header content to keep it clear of the
          two toggle buttons in the corner. */}
      <main className="pt-16 flex flex-col min-h-screen">
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

          {/* Quota indicator (Mục #4) */}
          <QuotaIndicator compact />
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scanlines chat-messages-scroll">
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-[#64748b] font-mono">[ loading systems... ]</div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
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

      {/* Build tag ribbon. Hidden by default, visible when
          the URL has ?build=1. Press 'B' anywhere on the
          page to toggle. This is a visual marker so the
          user can confirm at a glance whether the browser
          is running the latest bundle. */}
      {showBuildTag && (
        <div
          className="fixed bottom-3 right-3 z-[9999] px-3 py-1.5
            bg-black/80 text-white text-[10px] font-mono
            border border-white/20 rounded-md shadow-lg
            backdrop-blur-md pointer-events-none"
          aria-hidden
        >
          {BUILD_TAG}
        </div>
      )}
    </div>
  );
}
