'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Sparkles, ChevronLeft, ChevronRight, Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import type { ChatMessage, ChatSession } from '@/types';
import { findStaticResponse, getDefaultGreeting, getFallbackResponse } from '@/lib/ai-static-responses';

// Load Lottie robot data on client side
function useRobotData() {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch('/animations/robot.json')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);
  return data;
}

function ChatWelcome({ prompts, onSelect, isLoading }: {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (p: string) => void;
  isLoading: boolean;
}) {
  const robotData = useRobotData();

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      {/* Lottie Robot */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center mb-6 shadow-2xl shadow-neon-violet/20"
      >
        {robotData ? (
          <Lottie animationData={robotData} loop autoplay style={{ width: '100%', height: '100%' }} />
        ) : (
          <div className="w-full h-full bg-neon-violet/10 rounded-3xl" />
        )}
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-3">
        Hello! I'm Ai CuongMini
      </h2>
      <p className="text-text-secondary mb-8 max-w-lg">
        I can answer questions about CuongHoang's portfolio, skills, projects, blog posts, and more. Powered by RAG — try asking me anything!
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
    limitedModeReason,
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

  const currentMessages = currentSessionId ? (messages[currentSessionId] || []) : [];
  // Always show messages: if no currentSessionId yet, derive from store directly to avoid stale closure
  const sessionMessages = currentMessages;

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await fetch(`/api/v1/system/health`, {
          signal: AbortSignal.timeout(3000),
        });
        setBackendConnected(true);
      } catch {
        setBackendConnected(false);
      }
    };
    checkBackend();
  }, []);

  // Fetch sessions from backend on mount
  useEffect(() => {
    if (!mounted) return;
    const fetchSessions = async () => {
      try {
        const res = await api.get('/ai/chat/sessions');
        setSessions(res.data?.data || []);
      } catch {
        // silently ignore — use persisted local state
      }
    };
    fetchSessions();
  }, [mounted, setSessions]);

  // Update contextual prompts based on last message
  useEffect(() => {
    if (currentMessages.length > 0) {
      const last = currentMessages[currentMessages.length - 1];
      if (last.role === 'assistant' && last.content.length > 50) {
        const ctx = getContextualPrompts(last.content);
        if (ctx.length > 0) setSuggestedPrompts(ctx);
      }
    }
  }, [currentMessages.length, currentMessages, setSuggestedPrompts]);

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

    // Set sessionId early so UI shows messages immediately
    if (!currentSessionId) {
      setCurrentSessionId('__new__');
    }

    // Create user message
    const userMsg: ChatMessage = {
      id: tempId,
      sessionId,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add user message to store
    addMessage(sessionId, userMsg);
    setRobotEmotion('typing');
    setStreaming(true);

    // Clear prompts once chatting
    if (currentMessages.length === 0) {
      setSuggestedPrompts([]);
    }

    try {
      // ========== LIMITED MODE LOGIC ==========
      // If forceStatic is true or we're in limited mode, use static response
      const shouldUseStatic = forceStatic || limitedMode;

      if (shouldUseStatic) {
        // Use static response
        const staticResp = findStaticResponse(text);
        const responseContent = staticResp?.response || getFallbackResponse(text);

        // Simulate streaming effect for better UX
        const words = responseContent.split(/(\s+)/);
        let streamedContent = '';
        
        // Add pending assistant message
        const assistantMsg: ChatMessage = {
          id: tempId + 1,
          sessionId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        };
        addMessage(sessionId, assistantMsg);

        // Stream word by word with small delay
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 5));
          streamedContent += word;
          updateLastAssistantMessage(sessionId, streamedContent);
        }

        // Set limited mode if this was a 429 error
        if (forceStatic) {
          setLimitedMode(true, 'AI quota exceeded - Using cached answers');
          toast.info('Limited Mode: AI quota exceeded, using cached answers');
        }

        // Create session
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

      // ========== NORMAL AI MODE ==========
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

      // Add pending assistant message
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

          try {
            const data = JSON.parse(raw);

            if (data.sessionId && !resolvedSessionId) {
              resolvedSessionId = data.sessionId;
              continue;
            }

            if (data.done) {
              continue;
            }

            if (data.error) {
              errorMsg = data.error;
              continue;
            }

            if (data.text) {
              // Check if content is an error
              const lowerContent = data.text.toLowerCase();
              if (
                lowerContent.includes('429') ||
                lowerContent.includes('quota') ||
                lowerContent.includes('exceeded') ||
                lowerContent.includes('too many requests') ||
                lowerContent.includes('resource_exhausted') ||
                lowerContent.includes('da xay ra loi') ||
                lowerContent.includes('error')
              ) {
                hasError = true;
                errorMsg += data.text;
              } else {
                assistantContent += data.text;
                updateLastAssistantMessage(sessionId, assistantContent);
              }
            }
          } catch {
            // Raw content might not be JSON, check for error
            const lowerRaw = raw.toLowerCase();
            if (
              lowerRaw.includes('429') ||
              lowerRaw.includes('quota') ||
              lowerRaw.includes('error') ||
              lowerRaw.includes('da xay ra loi')
            ) {
              hasError = true;
              errorMsg += raw;
            } else if (raw) {
              assistantContent += raw;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          }
        }
      }

      // If error detected, use static response
      if (hasError || errorMsg) {
        const staticResp = findStaticResponse(text);
        const responseContent = staticResp?.response || getDefaultGreeting();
        
        // Replace error content with static response
        updateLastAssistantMessage(sessionId, responseContent);
        assistantContent = responseContent;
        
        // Enable Limited Mode
        setLimitedMode(true, 'AI quota exceeded');
        toast.info('AI quota exceeded. Using cached answers.');
      }

      // Finalize: create real session from backend if new
      if (!currentSessionId || currentSessionId === '__new__') {
        if (resolvedSessionId) {
          // Migrate messages from __new__ to real session
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
          // No backend session — use __new__ as sessionId
          const newSession: ChatSession = {
            id: Date.now(),
            sessionId: '__new__',
            title: text.trim().slice(0, 50),
            createdAt: new Date().toISOString(),
          };
          addSession(newSession);
        }
      }

      // Update contextual prompts
      const ctx = getContextualPrompts(assistantContent);
      if (ctx.length > 0) setSuggestedPrompts(ctx);

      // Emotion based on response
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
      
      // Try static response as fallback
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
    <div className="flex h-screen bg-darkbg pt-16 overflow-hidden">
      {/* Sidebar */}
      <div className="relative">
        <ChatSidebar
          onDeleteSession={handleDeleteSession}
          onSelectSession={handleSelectSession}
        />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-darkborder flex items-center gap-4 flex-shrink-0"
        >
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors md:hidden"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isStreaming ? 360 : 0 }}
              transition={{ duration: isStreaming ? 2 : 0, repeat: isStreaming ? Infinity : 0, ease: 'linear' }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-indigo via-neon-violet to-neon-fuchsia flex items-center justify-center shadow-lg shadow-neon-violet/20"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-heading font-bold text-text-primary flex items-center gap-2">
                Ai CuongMini
                {/* Limited Mode Badge */}
                <AnimatePresence>
                  {limitedMode && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Limited Mode
                    </motion.span>
                  )}
                </AnimatePresence>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-text-muted">
                  {limitedMode ? (
                    <span className="text-amber-400/80">📦 Cached answers • {isAuthenticated ? 'Logged in' : 'Guest'}</span>
                  ) : (
                    <>Powered by RAG • {isAuthenticated ? 'Logged in' : 'Guest mode'}</>
                  )}
                </p>
                {backendConnected !== null && !limitedMode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title={backendConnected ? 'Backend connected' : 'Backend offline'}
                    className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${
                      backendConnected
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
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
                {/* Try Again Button in Limited Mode */}
                {limitedMode && (
                  <button
                    onClick={() => setLimitedMode(false, '')}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
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
        <div className="flex-1 overflow-hidden relative">
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-text-muted">Loading...</div>
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
        <ChatInput
          onSend={sendMessage}
          isStreaming={isStreaming}
        />
      </main>

      {/* Floating Ai CuongMini */}
    </div>
  );
}
