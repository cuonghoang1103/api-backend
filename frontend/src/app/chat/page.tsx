'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { ChevronRight, Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import MatrixRain from '@/components/chat/MatrixRain';
import type { ChatMessage, ChatSession } from '@/types';
import { findStaticResponse, getDefaultGreeting, getFallbackResponse } from '@/lib/ai-static-responses';

// ── Robot avatar with LED eyes ────────────────────────────────────
function RobotAvatar({ isStreaming }: { isStreaming: boolean }) {
  const [robotData, setRobotData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/animations/robot.json')
      .then((r) => r.json())
      .then(setRobotData)
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center bg-[#0d1117] border border-[#22d3ee]/20 shadow-[0_0_16px_rgba(34,211,238,0.15)]">
      {robotData ? (
        <Lottie animationData={robotData} loop autoplay style={{ width: '100%', height: '100%' }} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
          {/* LED Eyes */}
          <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full bg-[#22d3ee] ${isStreaming ? 'animate-pulse' : 'led-eye'}`} />
            <div className={`w-2 h-2 rounded-full bg-[#22d3ee] ${isStreaming ? 'animate-pulse' : 'led-eye'}`} style={{ animationDelay: '0.5s' }} />
          </div>
          {/* Robot mouth */}
          <div className="w-3 h-0.5 bg-[#22d3ee]/40 rounded-full" />
        </div>
      )}
    </div>
  );
}

// ── Cyber Terminal Welcome ──────────────────────────────────────────
function ChatWelcome({ prompts, onSelect, isLoading }: {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (p: string) => void;
  isLoading: boolean;
}) {
  const [robotData, setRobotData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/animations/robot.json')
      .then((r) => r.json())
      .then(setRobotData)
      .catch(() => {});
  }, []);

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
        {robotData ? (
          <Lottie animationData={robotData} loop autoplay style={{ width: '100%', height: '100%' }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <div className="flex gap-3">
              <div className="w-3 h-3 rounded-full bg-[#22d3ee] led-eye" />
              <div className="w-3 h-3 rounded-full bg-[#22d3ee] led-eye" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="w-5 h-0.5 bg-[#22d3ee]/40 rounded-full mt-1" />
          </div>
        )}
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#f8fafc] mb-3 font-mono tracking-tight">
        &gt; <span className="text-[#22d3ee]">Ai_CuongMini</span>
        <span className="text-[#64748b]">.ready()</span>
      </h2>
      <p className="text-[#94a3b8] mb-8 max-w-lg font-mono text-sm">
        <span className="text-[#22d3ee]">//</span> RAG-powered AI assistant — queries CuongHoang's portfolio, skills, projects &amp; blog.
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
    isSidebarOpen,
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
    setSidebarOpen,
    setLimitedMode,
  } = useChatStore();

  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

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

  // Fetch sessions
  useEffect(() => {
    if (!mounted) return;
    const fetchSessions = async () => {
      try {
        const res = await api.get('/ai/chat/sessions');
        setSessions(res.data?.data || []);
      } catch { /* silently ignore */ }
    };
    fetchSessions();
  }, [mounted, setSessions]);

  // Update contextual prompts
  useEffect(() => {
    if (currentMessages.length > 0) {
      const last = currentMessages[currentMessages.length - 1];
      if (last.role === 'assistant' && last.content.length > 50) {
        const ctx = getContextualPrompts(last.content);
        if (ctx.length > 0) setSuggestedPrompts(ctx);
      }
    }
  }, [currentMessages.length, currentMessages, setSuggestedPrompts]);

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
      await api.delete(`/ai/chat/sessions/${sessionId}`);
      removeSession(sessionId);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Delete failed');
    }
  }, [removeSession]);

  const sendMessage = useCallback(async (text: string, forceStatic: boolean = false) => {
    if (!text.trim() || isStreaming) return;

    const sessionId = currentSessionId || '__new__';
    const tempId = Date.now();
    setSessionCount((c) => c + 1);

    if (!currentSessionId) {
      setCurrentSessionId('__new__');
    }

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

    if (currentMessages.length === 0) {
      setSuggestedPrompts([]);
    }

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

        if (!currentSessionId || currentSessionId === '__new__') {
          const newSession: ChatSession = {
            id: Date.now(),
            sessionId: sessionId,
            title: text.trim().slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          addSession(newSession);
          if (sessionId === '__new__') {
            setCurrentSessionId('__new__');
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
        body: JSON.stringify({ message: text.trim(), sessionId: currentSessionId || undefined, topK: 5 }),
      });

      if (!res.ok) throw new Error('Stream failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantContent = '';
      let resolvedSessionId = currentSessionId || '';
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
      let hasError = false;
      let errorMsg = '';

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

          // DEBUG: log every raw SSE frame so we can see what's arriving
          console.log('[Chat] SSE Raw Frame:', raw);

          try {
            const data = JSON.parse(raw);

            // Backend sends: {"type":"connected","sessionId":"..."} | {"type":"chunk","text":"..."} | {"type":"done",...} | {"type":"error",...}
            if (data.type === 'connected') {
              if (data.sessionId && !resolvedSessionId) resolvedSessionId = data.sessionId;
              continue;
            }
            if (data.type === 'done') continue;

            // Only treat explicit error frames as errors — not chunks containing the word "error"
            if (data.type === 'error') {
              errorMsg += data.error || '';
              continue;
            }

            // chunk: extract text from the correct key
            const text = data.text ?? data.content ?? '';
            if (text) {
              assistantContent += text;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          } catch {
            // Raw content fallback
            if (raw) {
              assistantContent += raw;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          }
        }

        // Guard: if we accumulated nothing but there was no error, show a fallback so bubble is never empty
        if (!assistantContent && !hasError && !errorMsg) {
          console.warn('[Chat] No content received, using fallback');
          assistantContent = 'Xin lỗi, mình chưa nhận được phản hồi từ AI. Bạn thử hỏi lại nhé!';
          updateLastAssistantMessage(sessionId, assistantContent);
        }
      }

      if (hasError || errorMsg) {
        const staticResp = findStaticResponse(text);
        const responseContent = staticResp?.response || getDefaultGreeting();
        updateLastAssistantMessage(sessionId, responseContent);
        assistantContent = responseContent;
        setLimitedMode(true, 'AI quota exceeded');
        toast.info('AI quota exceeded. Using cached answers.');
      }

      if (!currentSessionId || currentSessionId === '__new__') {
        if (resolvedSessionId) {
          const msgs = useChatStore.getState().messages['__new__'] || [];
          const migrated = msgs.map((m) => ({ ...m, sessionId: resolvedSessionId }));
          setMessages(resolvedSessionId, migrated);
          setCurrentSessionId(resolvedSessionId);
          const newSession: ChatSession = {
            id: Date.now(),
            sessionId: resolvedSessionId,
            title: text.trim().slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          addSession(newSession);
        } else {
          const newSession: ChatSession = {
            id: Date.now(),
            sessionId: '__new__',
            title: text.trim().slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          addSession(newSession);
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
    currentMessages, setSuggestedPrompts, setMessages, setCurrentSessionId, addSession,
    updateLastAssistantMessage, removePendingMessage, limitedMode, setLimitedMode,
    getToken,
  ]);

  const handlePromptSelect = useCallback((prompt: string, forceStatic?: boolean) => {
    inputRef.current?.focus();
    sendMessage(prompt, forceStatic);
  }, [sendMessage]);

  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setSuggestedPrompts(getContextualPrompts(''));
  }, [setCurrentSessionId, setSuggestedPrompts]);

  return (
    <div className="flex h-[calc(100vh-6rem)] pt-24 overflow-hidden cyber-grid-bg">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Sidebar */}
      <div className="relative z-10">
        <ChatSidebar
          onDeleteSession={handleDeleteSession}
          onSelectSession={handleSelectSession}
        />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Cyber Terminal Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-[#22d3ee]/10 flex items-center gap-4 flex-shrink-0 bg-[#0d1117]/80 backdrop-blur-xl"
        >
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-[#64748b] hover:text-[#f8fafc] transition-colors md:hidden"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-3">
            {/* Robot avatar with LED eyes */}
            <motion.div
              animate={{ rotate: isStreaming ? 360 : 0 }}
              transition={{ duration: isStreaming ? 2 : 0, repeat: isStreaming ? Infinity : 0, ease: 'linear' }}
            >
              <RobotAvatar isStreaming={isStreaming} />
            </motion.div>

            <div>
              {/* Terminal prompt title */}
              <h1 className="font-heading font-bold text-[#f8fafc] flex items-center gap-2 font-mono text-sm">
                <span className="text-[#22d3ee]">root</span>
                <span className="text-[#64748b]">@</span>
                <span
                  className={`text-[#22d3ee] ${glitchTrigger ? 'glitch-burst' : ''}`}
                  data-text="CuongMini-OS"
                >
                  CuongMini-OS
                </span>
                <span className="text-[#64748b]">:~#</span>
                <span className="text-[#22d3ee]/40">Chat Session</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-sans ${
                  isStreaming ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30' : 'bg-[#22d3ee]/8 text-[#64748b] border border-[#22d3ee]/15'
                }`}>
                  {isStreaming ? '[Active]' : '[Ready]'}
                </span>

                {/* Limited Mode Badge */}
                <AnimatePresence>
                  {limitedMode && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Limited
                    </motion.span>
                  )}
                </AnimatePresence>
              </h1>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-[#64748b] font-mono">
                  {limitedMode ? (
                    <><span className="text-amber-400/80">CACHED</span> • {isAuthenticated ? 'AUTH' : 'GUEST'}</>
                  ) : (
                    <>RAG-powered • {isAuthenticated ? 'AUTH' : 'GUEST'}</>
                  )}
                </p>
                {backendConnected !== null && !limitedMode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title={backendConnected ? 'Backend connected' : 'Backend offline'}
                    className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-mono ${
                      backendConnected ? 'bg-[#22d3ee]/10 text-[#22d3ee]' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {backendConnected ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span className="hidden sm:inline">{backendConnected ? 'Online' : 'Offline'}</span>
                  </motion.div>
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
          </div>
        </motion.header>

        {/* Messages or Welcome */}
        {/* overflow-hidden = prevent child content from breaking flex column boundary */}
        <div className="flex-1 overflow-hidden relative chat-scanlines">
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

        {/* Input */}
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </main>
    </div>
  );
}
