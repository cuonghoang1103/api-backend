'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Wifi, WifiOff, AlertCircle, RefreshCw, Plus, MessageSquare, Trash2, X, Phone } from 'lucide-react';
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
import ChatSkinToggle from '@/components/chat/ChatSkinToggle';
import VoiceCallOverlay from '@/components/chat/VoiceCallOverlay';
import ContextBar from '@/components/chat/ContextBar';
import { useChatSkinStore } from '@/store/chatSkinStore';
import LottieClient from '@/components/ui/LottieClient';
import type { ChatMessage, ChatSession } from '@/types';
import { findStaticResponse, getDefaultGreeting, getFallbackResponse } from '@/lib/ai-static-responses';
import { useChatModelStore, DEFAULT_CHAT_MODEL_ID, getChatModel } from '@/lib/aiChatModels';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
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

// ── Dấu hiệu nhận diện của bản Studio ───────────────────────────────
// Con gấu trúc ngủ — đúng favicon của web (`/favicon.png`), để avatar trong
// chat và cái tab trình duyệt là MỘT khuôn mặt. Ảnh có nền trong suốt và nét
// viền đen, nên đặt trên nền panel sáng dịu là đọc được ở cả hai theme (đặt
// thẳng lên gradient tím thì phần thân trắng của gấu bị chìm).
function StudioMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg';
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-[color:var(--studio-border)] bg-[var(--studio-panel-soft)] ${
        isLg ? 'h-14 w-14 rounded-2xl p-1' : 'h-9 w-9 rounded-xl p-0.5'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/favicon.png" alt="CuongMini" className="h-full w-full object-contain" />
    </div>
  );
}

// ── Màn hình chào bản Studio ────────────────────────────────────────
function StudioWelcome({ prompts, onSelect, isLoading }: {
  prompts: { id: string; label: string; icon: string; prompt: string }[];
  onSelect: (p: string) => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      key="welcome-studio"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      // Cùng bề rộng với cột tin nhắn và ô soạn (max-w-3xl) — ba khối lệch
      // nhau vài chục pixel là thứ mắt bắt được ngay dù không gọi tên ra.
      className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 text-center"
    >
      <StudioMark size="lg" />
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[color:var(--studio-text)] sm:text-[28px]">
        Xin chào — tôi giúp gì được cho bạn?
      </h2>
      <p className="mb-8 mt-2.5 max-w-md text-sm leading-6 text-[color:var(--studio-text-soft)]">
        CuongMini là trợ lý AI của <span className="font-medium text-[color:var(--studio-text)]">cuongthai.com</span> —
        hỏi về dự án, khoá học, bài viết, hoặc bất cứ thứ gì bạn đang làm dở.
      </p>

      <SuggestedPrompts prompts={prompts} onSelect={onSelect} isLoading={isLoading} skin="studio" />
    </motion.div>
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

  // ── Giao diện đang chọn ────────────────────────────────────────
  // Lựa chọn nằm trong localStorage, chỉ về SAU khi hydrate — nên
  // trước lúc `mounted` phải render bản terminal (bản mặc định, cũng
  // là thứ server render ra), nếu không HTML hai bên sẽ lệch nhau.
  const persistedSkin = useChatSkinStore((s) => s.skin);
  const skin = mounted ? persistedSkin : 'terminal';
  const isStudio = skin === 'studio';

  /** Cuộc gọi bằng giọng — xem `VoiceCallOverlay`. */
  const [callOpen, setCallOpen] = useState(false);

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
  // iOS on-screen keyboard: shrink the app shell so the composer stays
  // visible above the keyboard (which also covers the bottom nav).
  const keyboardInset = useKeyboardInset();
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
    appendAssistantReasoning,
    contextResetAt,
    setContextReset,
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
  // Stop-generation support: abort the in-flight stream, keep the partial reply.
  const abortRef = useRef<AbortController | null>(null);
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

  // ── Cắt mạch: đo phần ĐANG được gửi lại ở mỗi lượt ───────────────
  //
  // Đo bằng KÝ TỰ chứ không bằng số tin nhắn: mười câu chào hỏi chẳng tốn gì,
  // còn hai lời giải toán kèm hình thì đã hơn 40k ký tự và bị gửi lại nguyên
  // vẹn ở mỗi câu hỏi tiếp theo.
  const NGUONG_HOI = 24_000;      // đủ dài để đáng nhắc
  const NGUONG_TU_CAT = 90_000;   // quá dài — tự cắt, chỉ báo cho biết
  const [daBoQuaCatMach, setDaBoQuaCatMach] = useState(false);
  const mocMach = currentSessionId ? (contextResetAt[currentSessionId] ?? 0) : 0;
  const nguChanh = (() => {
    const trong = currentMessages.filter((m) => new Date(m.createdAt).getTime() >= mocMach);
    return { soTin: trong.length, soKyTu: trong.reduce((s, m) => s + (m.content?.length ?? 0), 0) };
  })();
  const hienThanhCatMach = !daBoQuaCatMach && nguChanh.soKyTu >= NGUONG_HOI;

  // Quá ngưỡng cứng thì tự cắt — nhưng NÓI RA. Một tối ưu âm thầm làm model
  // đột nhiên quên bài đang làm, và người dùng không hiểu vì sao.
  useEffect(() => {
    if (!currentSessionId || isStreaming) return;
    if (nguChanh.soKyTu < NGUONG_TU_CAT) return;
    setContextReset(currentSessionId);
    setDaBoQuaCatMach(false);
    toast.info('Mạch chat đã quá dài nên tôi tự cắt để bạn khỏi tốn — tin nhắn cũ vẫn còn trên màn hình');
  }, [currentSessionId, isStreaming, nguChanh.soKyTu, setContextReset]);

  // Đổi phiên thì lời nhắc phải hiện lại — "để sau" là cho phiên đó thôi.
  useEffect(() => { setDaBoQuaCatMach(false); }, [currentSessionId]);

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

  /**
   * Gửi một lượt hỏi. TRẢ VỀ câu trả lời đã hoàn tất (chuỗi rỗng nếu không có)
   * — chế độ GỌI cần chính chuỗi đó để đọc lên; các nơi gọi khác bỏ qua giá trị
   * trả về nên chữ ký cũ vẫn dùng được nguyên.
   */
  const sendMessage = useCallback(async (
    text: string,
    forceStatic: boolean = false,
    attach?: { images?: string[]; documents?: string[]; documentNames?: string[] },
    opts?: { voice?: boolean },
  ): Promise<string> => {
    const images = attach?.images;
    const documents = attach?.documents;
    const documentNames = attach?.documentNames;
    const hasAttach = (images?.length ?? 0) > 0 || (documents?.length ?? 0) > 0;
    if ((!text.trim() && !hasAttach) || isStreaming) return '';

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
      images: images && images.length > 0 ? images : undefined,
      documentNames: documentNames && documentNames.length > 0 ? documentNames : undefined,
      createdAt: new Date().toISOString(),
    };

    // Capture prior turns for multi-turn memory BEFORE adding the new message.
    // `contextResetAt` = ranh giới "mạch mới": tin nhắn cũ hơn mốc này vẫn nằm
    // trên màn hình nhưng KHÔNG gửi lên model nữa (xem nút "Bắt đầu mạch mới").
    const tatCa = useChatStore.getState().messages[sessionId] || [];
    const moc = useChatStore.getState().contextResetAt[sessionId] ?? 0;
    const historyPayload = tatCa
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
      .filter((m) => new Date(m.createdAt).getTime() >= moc)
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // ── Kèm lại ẢNH ĐỀ BÀI cho lượt hỏi tiếp ─────────────────────
    //
    // Lịch sử gửi lên model là CHỮ THUẦN — ảnh chỉ đi kèm đúng lượt người dùng
    // vừa đính. Nên sau khi gửi ảnh đề toán, hỏi tiếp "viết tiếp" hay "câu c
    // thì sao" là model KHÔNG CÒN NHÌN THẤY ĐỀ, và nó đành xin gửi lại ảnh.
    // Người dùng gặp đúng lỗi này.
    //
    // Cách chữa: lượt sau không đính gì thì tự kèm lại ảnh của lượt có ảnh
    // GẦN NHẤT — nhưng chỉ khi nó còn trong tầm mấy lượt vừa rồi, vì mỗi lần
    // gửi lại là một lần trả tiền cho ảnh đó.
    const TAM_NHO_ANH = 6; // số tin nhắn gần nhất còn coi là "đang làm bài đó"
    let anhGui = images;
    if ((!images || images.length === 0) && documents == null) {
      const ganDay = tatCa.filter((m) => new Date(m.createdAt).getTime() >= moc).slice(-TAM_NHO_ANH);
      const luotCoAnh = [...ganDay].reverse().find((m) => m.role === 'user' && m.images?.length);
      if (luotCoAnh?.images?.length) anhGui = luotCoAnh.images.slice(0, 2);
    }

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
        return responseContent;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch(`/api/v1/ai/chat`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ message: text.trim(), sessionId: sessionId || undefined, topK: 5, model: useChatModelStore.getState().modelId, history: historyPayload, images: anhGui && anhGui.length > 0 ? anhGui : undefined, documents: documents && documents.length > 0 ? documents : undefined, documentNames: documentNames && documentNames.length > 0 ? documentNames : undefined, voice: opts?.voice === true }),
      });

      if (!res.ok) throw new Error('Stream failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantContent = '';
      let resolvedSessionId = '';
      let resolvedMessageId: number | undefined;
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
        let step: ReadableStreamReadResult<Uint8Array>;
        try {
          step = await reader.read();
        } catch {
          break; // aborted mid-read — keep whatever already streamed
        }
        const { done, value } = step;
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
            // Backend tells us which model actually answered. If a Claude tier
            // fell back to the default, revert the picker + inform the user.
            if (data.type === 'model') {
              if (data.fellBack) {
                const requested = getChatModel(data.requested);
                useChatModelStore.getState().setModelId(DEFAULT_CHAT_MODEL_ID);
                toast.info(`${requested.label} không phản hồi — đã chuyển về ${getChatModel(DEFAULT_CHAT_MODEL_ID).label}`);
              }
              continue;
            }
            // Bước suy luận của model. Trường là `step` chứ không phải `text`
            // — cố ý, để nó không bị nhánh cộng chuỗi bên dưới nuốt vào câu
            // trả lời (xem ghi chú ở ai.routes.ts).
            if (data.type === 'reasoning') {
              if (data.step) appendAssistantReasoning(sessionId, data.step);
              continue;
            }
            // Backend kiểm hình bằng toạ độ, thấy sai và đã vẽ lại. Thay đúng
            // khối ```svg thứ `index`, giữ nguyên toàn bộ phần chữ.
            if (data.type === 'figure_fix') {
              if (typeof data.index === 'number' && data.svg) {
                let n = 0;
                assistantContent = assistantContent.replace(/```svg\s*\n[\s\S]*?```/g, (khoi: string) => {
                  const doi = n === data.index;
                  n++;
                  return doi ? '```svg\n' + String(data.svg).trim() + '\n```' : khoi;
                });
                updateLastAssistantMessage(sessionId, assistantContent);
              }
              continue;
            }
            if (data.type === 'done') {
              if (typeof data.messageId === 'number') resolvedMessageId = data.messageId;
              continue;
            }
            // ⚠️ Trước đây dòng này là `continue` — NUỐT LUÔN thông báo lỗi.
            // Backend hết cách, gửi khung `error` lên, và người dùng nhìn thấy
            // một bong bóng trống không kèm lời giải thích nào. Gặp thật
            // 14/08: model nghĩ 49 bước rồi luồng bị ngắt, màn hình im lặng.
            if (data.type === 'error') {
              const loi = typeof data.error === 'string' ? data.error : 'Không lấy được câu trả lời';
              if (!assistantContent.trim()) {
                assistantContent = `> ⚠️ **${loi}**\n>\n> Thử nhắn lại, hoặc hỏi ngắn hơn / tách nhỏ đề bài.`;
                updateLastAssistantMessage(sessionId, assistantContent);
              }
              toast.error(loi);
              continue;
            }

            const text = data.text ?? data.content ?? '';
            if (text) {
              assistantContent += text;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          } catch {
            // Malformed/split SSE frame — NEVER render raw frame text (it showed
            // up as "ký tự lạ" JSON fragments in the reply). Skip silently.
            continue;
          }
        }
      }

      // Attach the real DB message id to the assistant bubble so it can carry feedback.
      if (resolvedMessageId) {
        useChatStore.setState((state) => {
          const msgs = state.messages[sessionId];
          if (!msgs) return state;
          return {
            messages: {
              ...state.messages,
              [sessionId]: msgs.map((m) => (m.id === assistantTempId ? { ...m, dbId: resolvedMessageId } : m)),
            },
          };
        });
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
      return assistantContent;
    } catch (err) {
      // User pressed Stop — keep the partial reply, no error UI.
      if (err instanceof DOMException && err.name === 'AbortError') {
        return '';
      }
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
      return '';
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }, [
    isStreaming, currentSessionId, addMessage, setStreaming, setRobotEmotion,
    setSuggestedPrompts, setMessages, setCurrentSessionId, addSession,
    updateLastAssistantMessage, appendAssistantReasoning, removePendingMessage, removeSession, limitedMode, setLimitedMode,
    getToken,
  ]);

  // Stop generation: abort the fetch — the reader loop exits, the partial
  // reply stays, input unlocks immediately so the user can retype.
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, [setStreaming]);

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
    <div
      className={
        isStudio
          ? 'chat-studio relative min-h-dvh w-full overflow-hidden pt-16'
          : 'force-dark relative min-h-dvh w-full overflow-hidden cyber-grid-bg pt-16'
      }
    >
      {/* Nền mưa Matrix + lưới cyber: GIỮ NGUYÊN cho bản terminal.
          Bản studio bỏ nền động để chữ đọc êm mắt hơn. */}
      {!isStudio && <MatrixRain />}

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
            className={
              isStudio
                ? `fixed z-[58] top-3 bottom-3 left-3 w-[288px] flex flex-col
                   bg-[var(--studio-panel)] border border-[color:var(--studio-border)]
                   rounded-3xl overflow-hidden`
                : `fixed z-[58] top-3 bottom-3 left-3 w-[288px] flex flex-col
                   bg-[#0d1117]/85 backdrop-blur-2xl
                   border border-white/[0.08]
                   rounded-3xl
                   shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)]
                   overflow-hidden`
            }
            style={isStudio ? { boxShadow: 'var(--studio-shadow)' } : undefined}
            data-build-tag="chat-aside-v3-floating"
          >
            {/* Aside header — pt-20 leaves room for the
                chat-aside toggle button at top-4 in the
                same corner. */}
            <div className="shrink-0 px-5 pt-20 pb-3">
              <p className={`text-[10px] uppercase tracking-[0.18em] text-text-muted ${isStudio ? '' : 'font-mono'}`}>
                chat
              </p>
              <p className="text-lg font-semibold text-text-primary mt-1">
                {isStudio ? 'Cuộc trò chuyện' : 'Sessions'}
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
                className={
                  isStudio
                    ? `w-full flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-[var(--studio-accent)] text-white text-sm font-medium
                       hover:opacity-90 transition-opacity`
                    : `w-full flex items-center gap-2 px-4 py-2.5
                       bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]
                       text-white text-sm font-mono font-semibold rounded-xl
                       hover:opacity-90 transition-opacity
                       shadow-[0_0_16px_rgba(34,211,238,0.2)]`
                }
              >
                <Plus className="w-4 h-4" />
                <span>{isStudio ? 'Cuộc trò chuyện mới' : '> new_session()'}</span>
              </button>
            </div>

            {/* Session list — magnify on hover. */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {sessions.length === 0 && (
                isStudio ? (
                  <p className="text-text-muted text-xs text-center py-8 px-2">
                    Chưa có cuộc trò chuyện nào
                  </p>
                ) : (
                  <p className="text-[#64748b] text-xs text-center py-8 px-2 font-mono">
                    <span className="text-[#22d3ee]">//</span> no sessions found
                  </p>
                )
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
        className={
          isStudio
            ? `fixed top-4 left-16 z-[70] w-11 h-11 rounded-2xl
               flex items-center justify-center
               bg-[var(--studio-panel)] border border-[color:var(--studio-border)]
               text-[color:var(--studio-text)]
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]`
            : `fixed top-4 left-16 z-[70] w-11 h-11 rounded-2xl
               flex items-center justify-center
               bg-[#0d1117]/85 backdrop-blur-2xl
               border border-white/10
               shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]
               text-text-primary
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40`
        }
        style={isStudio ? { boxShadow: 'var(--studio-shadow)' } : undefined}
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
      {/* Fixed app-shell height (not min-h): the message list scrolls
          internally (flex-1 overflow-y-auto) and the composer stays visible
          above the mobile bottom nav (--app-chrome-bottom = 0 on desktop). */}
      <main
        className={
          isStudio
            // Bản studio bỏ pt-16 THỨ HAI: div gốc đã chừa 4rem cho Navbar,
            // thêm 4rem nữa chỉ tạo một dải trống dưới navbar (thấy rõ ở bản
            // terminal). Bản terminal giữ nguyên để không đổi bố cục cũ.
            ? 'flex flex-col h-[calc(100dvh-4rem-var(--app-chrome-bottom))]'
            : 'pt-16 flex flex-col h-[calc(100dvh-4rem-var(--app-chrome-bottom))]'
        }
        style={keyboardInset > 0 ? { height: `calc(100dvh - 4rem - ${keyboardInset}px)` } : undefined}
      >
        {/* ══ Thanh đầu trang — bản STUDIO ══════════════════════════ */}
        {isStudio ? (
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-shrink-0 items-center gap-3 border-b border-[color:var(--studio-border-soft)] bg-[var(--studio-bg)]/90 px-4 py-2.5 backdrop-blur-md sm:px-6"
          >
            <StudioMark />
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 text-[15px] font-semibold leading-tight text-[color:var(--studio-text)]">
                CuongMini AI
                {limitedMode && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Tiết kiệm
                  </span>
                )}
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-[color:var(--studio-text-faint)]">
                <span>cuongthai.com</span>
                <span aria-hidden>·</span>
                <span>{isStreaming ? 'đang trả lời…' : 'sẵn sàng'}</span>
                <span aria-hidden>·</span>
                <span>{isAuthenticated ? 'đã đăng nhập' : 'khách'}</span>
                {backendConnected === false && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1 text-rose-500">
                      <WifiOff className="h-3 w-3" /> mất kết nối
                    </span>
                  </>
                )}
              </p>
            </div>

            {limitedMode && (
              <button
                onClick={() => setLimitedMode(false, '')}
                className="hidden items-center gap-1 rounded-full border border-[color:var(--studio-border)] px-2.5 py-1 text-[11px] text-[color:var(--studio-text-soft)] transition-colors hover:text-[color:var(--studio-text)] sm:inline-flex"
              >
                <RefreshCw className="h-3 w-3" />
                Thử lại AI
              </button>
            )}

            {/* Gọi cho CuongMini — nói thay vì gõ */}
            <button
              type="button"
              onClick={() => setCallOpen(true)}
              title="Gọi cho CuongMini"
              aria-label="Gọi cho CuongMini"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--studio-text-soft)] transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
            >
              <Phone className="h-4 w-4" />
            </button>

            {/* Nút đổi giao diện — ngay cạnh nút về trang chủ */}
            <ChatSkinToggle tone="studio" />

            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--studio-text-soft)] transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
              title="Về trang chủ"
            >
              <Home className="h-4 w-4" />
            </Link>

            <QuotaIndicator compact />
          </motion.header>
        ) : (
        /* ══ Thanh đầu trang — bản TERMINAL (bản gốc) ══════════════ */
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

          {/* Gọi cho CuongMini — nói thay vì gõ */}
          <button
            type="button"
            onClick={() => setCallOpen(true)}
            title="Gọi cho CuongMini"
            aria-label="Gọi cho CuongMini"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-[#64748b] hover:text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Nút đổi giao diện — ngay cạnh nút về trang chủ */}
          <ChatSkinToggle tone="terminal" />

          {/* Back to home */}
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/5 text-[#64748b] hover:text-[#f8fafc] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40"
            title="Back to home"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Quota indicator (Mục #4) */}
          <QuotaIndicator compact />
        </motion.header>
        )}

        {/* Messages */}
        <div
          className={
            isStudio
              ? 'flex-1 overflow-y-auto chat-studio-scroll'
              : 'flex-1 overflow-y-auto chat-scanlines chat-messages-scroll'
          }
        >
          {!mounted ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-[#64748b] font-mono">[ loading systems... ]</div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {currentMessages.length === 0 ? (
                isStudio ? (
                  <StudioWelcome
                    key="welcome"
                    prompts={suggestedPrompts}
                    onSelect={handlePromptSelect}
                    isLoading={isStreaming}
                  />
                ) : (
                  <ChatWelcome
                    key="welcome"
                    prompts={suggestedPrompts}
                    onSelect={handlePromptSelect}
                    isLoading={isStreaming}
                    robotData={robotData ?? undefined}
                  />
                )
              ) : (
                <ChatMessages
                  key="messages"
                  messages={currentMessages}
                  isStreaming={isStreaming}
                  skin={skin}
                />
              )}
            </AnimatePresence>
          )}
          {/* Nhắc cắt mạch khi lịch sử đã đủ dài để tốn tiền thật sự.
              Chỉ hiện lúc KHÔNG stream — chen vào giữa lúc đang trả lời thì
              nó nhảy chỗ ngay dưới mắt người đang đọc. */}
          {!isStreaming && hienThanhCatMach && currentSessionId && (
            <ContextBar
              soTin={nguChanh.soTin}
              soKyTu={nguChanh.soKyTu}
              skin={skin}
              onMachMoi={() => {
                setContextReset(currentSessionId);
                setDaBoQuaCatMach(false);
                toast.success('Đã cắt mạch — câu hỏi sau sẽ không gửi lại phần cũ nữa');
              }}
              onBoQua={() => setDaBoQuaCatMach(true)}
            />
          )}
        </div>

        {/* Input — always at bottom */}
        <ChatInput onSend={(msg, attach) => { void sendMessage(msg, false, attach); }} isStreaming={isStreaming} onStop={stopStreaming} skin={skin} />
      </main>

      {/* Cuộc gọi bằng giọng — mỗi lượt vẫn đi qua `sendMessage` nên nội dung
          được lưu vào đúng phiên chat đang mở. */}
      <AnimatePresence>
        {callOpen && (
          <VoiceCallOverlay
            open={callOpen}
            onClose={() => setCallOpen(false)}
            skin={skin}
            onAsk={(text) => sendMessage(text, false, undefined, { voice: true })}
          />
        )}
      </AnimatePresence>

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
