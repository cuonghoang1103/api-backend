'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Copy, CheckCheck, User, Send, Search, SquarePen, History, ImageIcon, GraduationCap, Maximize2, Minimize2, MessageSquare } from 'lucide-react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { api, aiApi } from '@/lib/api';
import { findStaticResponse } from '@/lib/ai-static-responses';
import { useChatModelStore, DEFAULT_CHAT_MODEL_ID, getChatModel } from '@/lib/aiChatModels';
import ModelPicker from './ModelPicker';
import ChatMarkdown from './ChatMarkdown';
import GiaSuTrongRobot from './GiaSuTrongRobot';
import { useGiaSuBaiStore } from '@/store/giaSuBaiStore';
import { toast } from 'sonner';
import type { ChatMessage, ChatSession } from '@/types';

const INITIAL_PROMPTS = [
  { id: '1', label: 'About', icon: '1', prompt: 'Tell me about CuongHoang' },
  { id: '2', label: 'Skills', icon: '2', prompt: 'What skills does CuongHoang have?' },
  { id: '3', label: 'Projects', icon: '3', prompt: 'What projects has CuongHoang built?' },
  { id: '4', label: 'Blog', icon: '4', prompt: 'Show me recent blog posts' },
];

// ── Mech typing indicator ─────────────────────────────────────────
const LOADING_MESSAGES = [
  'Đang tìm kiếm thông tin...',
  'Đang phân tích câu hỏi...',
  'Đang truy xuất tài liệu...',
  'Đang suy nghĩ...',
  'Đang chuẩn bị câu trả lời...',
];

function MechTypingIndicator() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    // Rotate friendly loading messages every 4s
    // so user sees context even when AI providers are slow/failing
    const t = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <div className="w-8 h-8 rounded-xl bg-[#0d1117] border border-[#22d3ee]/20 flex items-center justify-center overflow-hidden flex-shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#22d3ee] mech-pulse-dot" />
            <div className="w-1 h-1 rounded-full bg-[#22d3ee] mech-pulse-dot" style={{ animationDelay: '0.25s' }} />
          </div>
          <div className="w-2 h-px bg-[#22d3ee]/30" />
        </div>
      </div>
      <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-[#0d1117]/80 border border-[#22d3ee]/15 data-card-glow-cyan flex items-center gap-2">
        <Search className="w-3 h-3 text-[#22d3ee] animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[11px] text-[#94a3b8] font-mono whitespace-nowrap"
          >
            {LOADING_MESSAGES[msgIdx]}
          </motion.span>
        </AnimatePresence>
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
            <span className="text-[9px] font-mono text-[#22d3ee]/50">cuongmini@cuongmini-os:~/inference$</span>
          </div>
        )}

        <div className={`inline-block px-3 py-2 rounded-xl text-xs leading-relaxed font-mono ${
          isUser
            ? 'bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/15 text-[#fca5a5] rounded-tr-sm data-card-glow-red border border-[#ef4444]/20'
            : 'bg-[#0d1117]/80 border border-[#22d3ee]/15 text-[#e2e8f0] rounded-tl-sm data-card-glow-cyan'
        }`}>
          {!isUser ? (
            <div className="markdown-content text-xs overflow-hidden">
              <ChatMarkdown content={msg.content} renderMath={!(isLastAssistant && isStreaming)} />
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

  /* ── Gia sư bài học ──
     `bai` do chính `CourseTutor` ghi vào khi nó được gắn (xem `giaSuBaiStore`),
     nên robot tự biết trang nào là trang học mà không cần trang đó cắm gì. */
  const baiDangHoc = useGiaSuBaiStore((st) => st.bai);
  /* Đang ở trang học thì MẶC ĐỊNH mở thẳng chế độ gia sư — đó là lý do người
     dùng bấm vào robot lúc đang học. Rời trang thì `baiDangHoc` thành null và
     nhánh dưới tự rơi về trợ lý chung, không cần dọn cờ này. */
  const [muonChung, datMuonChung] = useState(false);
  const cheDoGiaSu = !!baiDangHoc && !muonChung;
  /* Phóng to. Bài giảng có bảng, sơ đồ và công thức — 390px là chỗ người dùng
     phải cuộn ngang để đọc, đúng chữ "thô" trong lời than. */
  const [rong, datRong] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  /* ── Lịch sử phiên ──
     Trước bản này khung nổi không có đường nào mở lại cuộc cũ; muốn xem là
     phải sang trang /chat, tức là rời trang đang đọc — đúng việc mà khung nổi
     sinh ra để khỏi phải làm. */
  const [moSu, setMoSu] = useState(false);
  const [su, setSu] = useState<Array<{ id: string; ten: string; so: number }>>([]);
  const [dangNapSu, setDangNapSu] = useState(false);
  /* ── Ảnh dán vào ──
     `images` là data URL, đúng thứ `/api/v1/ai/chat` nhận. Chỉ bậc Pro/Max
     dùng được; chưa Pro thì máy chủ bỏ qua và hạ bậc, và khung báo lại. */
  const [anh, setAnh] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Stop-generation: abort the in-flight stream, keep the partial reply.
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const modalMessages = messages['__modal__'] || [];

  const moLichSu = async () => {
    const mo = !moSu;
    setMoSu(mo);
    if (!mo || su.length > 0) return;
    setDangNapSu(true);
    try {
      const res = await aiApi.getSessions();
      const ds = (res.data?.data ?? []) as Array<{ id: string; title?: string | null; _count?: { messages?: number } }>;
      setSu(ds.slice(0, 30).map((x) => ({
        id: x.id,
        ten: (x.title ?? '').trim() || 'Cuộc chưa đặt tên',
        so: x._count?.messages ?? 0,
      })));
    } catch {
      toast.error('Không tải được lịch sử.');
    } finally {
      setDangNapSu(false);
    }
  };

  const chonPhien = async (id: string) => {
    setMoSu(false);
    setDangNapSu(true);
    try {
      const res = await aiApi.getChatHistory(id);
      const ds = (res.data?.data ?? []) as Array<{ id?: string | number; role?: string; content?: string }>;
      setMessages('__modal__', ds
        .filter((m) => (m.content ?? '').trim() !== '')
        .map((m, i) => ({
          id: String(m.id ?? `cu-${i}`),
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content ?? '',
finished: true,
        })) as never);
      /* Gán phiên đang mở, nếu không thì người dùng thấy lịch sử nhưng câu trả
         lời lại rơi vào một cuộc khác, và lần sau mở lại vẫn không thấy gì. */
      setCurrentSessionId(id);
      setShowPrompts(false);
    } catch {
      toast.error('Không mở được cuộc này.');
    } finally {
      setDangNapSu(false);
    }
  };

  /* Dán ảnh bằng Ctrl/Cmd+V ngay trong ô nhập — cách nhanh nhất: chụp màn hình
     xong dán luôn, không qua bước lưu file. */
  const nhanDan = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const tep = [...e.clipboardData.items]
      .filter((x) => x.kind === 'file' && x.type.startsWith('image/'))
      .map((x) => x.getAsFile())
      .filter((x): x is File => x !== null);
    if (tep.length === 0) return;
    e.preventDefault();
    const con = 4 - anh.length;
    if (con <= 0) { toast.error('Tối đa 4 ảnh một lượt.'); return; }
    for (const f of tep.slice(0, con)) {
      const doc = new FileReader();
      doc.onload = () => {
        const u = typeof doc.result === 'string' ? doc.result : '';
        if (u.startsWith('data:image/')) setAnh((c) => [...c, u].slice(0, 4));
      };
      doc.readAsDataURL(f);
    }
  };

  // No auto-scroll — user controls their own scroll position entirely.

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
    // Gửi được khi CHỈ có ảnh: dán ảnh xong bấm gửi là ý định rõ ràng, bắt gõ
    // thêm chữ chỉ để qua cửa này là bắt làm một việc vô nghĩa.
    if ((!text.trim() && anh.length === 0) || isStreaming) return;

    const sessionId = '__modal__';
    const tempId = Date.now();
    /* Chụp ảnh đang chờ rồi DỌN KHAY NGAY. Dọn sau khi máy chủ trả lời thì
       người dùng gửi câu thứ hai trong lúc câu đầu còn chạy sẽ gửi lại đúng
       mấy tấm ảnh đó lần nữa — và trả tiền hai lần cho chúng. */
    const anhGui = anh;
    setAnh([]);

    const userMsg: ChatMessage = {
      id: tempId,
      sessionId,
      role: 'user',
      content: text.trim() || '(ảnh)',
      createdAt: new Date().toISOString(),
    };

    // Capture prior turns for multi-turn memory BEFORE adding the new message.
    const historyPayload = (useChatStore.getState().messages[sessionId] || [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    addMessage(sessionId, userMsg);
    setInput('');
    setShowPrompts(false);
    setRobotEmotion('typing');
    setStreaming(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch(`/api/v1/ai/chat`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: currentSessionId || undefined,
          topK: 5,
          model: useChatModelStore.getState().modelId,
          history: historyPayload,
          /* Ảnh dán vào. Máy chủ chỉ nhận ở bậc Pro/Max (tier `claude`); chưa
             Pro thì nó bỏ qua và hạ bậc kèm `reason: 'pro_required'` — nhánh
             đọc SSE bên dưới đã báo lại chuyện đó. */
          ...(anhGui.length > 0 ? { images: anhGui } : {}),
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
      let stallCount = 0; // count of consecutive slow chunks
      let idleTimer: ReturnType<typeof setTimeout> | null = null;

      const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);
        // If no chunk arrives within 20s, abort the stream and let the
        // finally block clean up. Prevents spinner from spinning forever
        // if the server hangs after sending a few frames.
        idleTimer = setTimeout(() => {
          try {
            reader.cancel('idle-timeout');
          } catch {}
        }, 45_000);
      };
      resetIdleTimer();

      while (true) {
        let step: ReadableStreamReadResult<Uint8Array>;
        try {
          step = await reader.read();
        } catch {
          break; // aborted/idle-cancelled mid-read — keep partial reply
        }
        const { done, value } = step;
        if (done) break;
        resetIdleTimer();

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const data = JSON.parse(raw);

            // Backend sends: {"type":"connected",...} | {"type":"chunk","text":"..."} | {"type":"done",...} | {"type":"error",...}
            if (data.type === 'connected') {
              if (data.sessionId && !resolvedSessionId) {
                resolvedSessionId = data.sessionId;
                setCurrentSessionId(resolvedSessionId);
              }
              continue;
            }
            if (data.type === 'model') {
              if (data.fellBack) {
                const requested = getChatModel(data.requested);
                useChatModelStore.getState().setModelId(DEFAULT_CHAT_MODEL_ID);
                toast.info(`${requested.label} không phản hồi — đã chuyển về ${getChatModel(DEFAULT_CHAT_MODEL_ID).label}`);
              }
              continue;
            }
            if (data.type === 'done') {
              if (resolvedSessionId && !currentSessionId) {
                const newSession: ChatSession = {
                  id: Date.now(),
                  sessionId: resolvedSessionId,
                  title: assistantContent.trim().slice(0, 50),
                  createdAt: new Date().toISOString(),
                };
                addSession(newSession);
              }
              continue;
            }
            if (data.type === 'error') {
              // Only surface error if we truly got nothing and it's a real failure.
              // Provider-level errors (quota, rate-limit) — no toast, silent.
              // The outer catch block will try static fallback.
              const isProviderError = /429|rate.limit|quota|404|timeout|connection|refused|unavailable/i.test(data.error || '');
              const hasContent = assistantContent.trim().length > 0;
              if (!hasContent && !isProviderError) {
                removePendingMessage(sessionId, assistantTempId);
                toast.error(data.error || 'AI service is temporarily unavailable.');
              }
              break;
            }
            // chunk or raw text
            const text = data.text || data.content || '';
            if (text) {
              assistantContent += text;
              updateLastAssistantMessage(sessionId, assistantContent);
            }
          } catch {
            // Malformed/split SSE frame — never render raw JSON fragments.
            continue;
          }
        }
      }

      // Clean up idle timer regardless of how we exited the loop
      if (idleTimer) clearTimeout(idleTimer);

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
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // user pressed Stop — partial reply already kept
      }
      console.error('Chat error:', err);
      const staticResp = findStaticResponse(text);
      if (staticResp) {
        const fallbackMsg: ChatMessage = {
          id: tempId + 2,
          sessionId,
          role: 'assistant',
          content: staticResp.response,
          createdAt: new Date().toISOString(),
        };
        addMessage(sessionId, fallbackMsg);
      } else {
        toast.error('AI connection error. Please check if backend is running.');
        setRobotEmotion('sad');
      }
      setMessages(sessionId, (messages[sessionId] || []).filter(m => m.id !== tempId && m.id !== (tempId + 1)));
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }, [isStreaming, currentSessionId, addMessage, setStreaming, setRobotEmotion,
      setSuggestedPrompts, setMessages, setCurrentSessionId, addSession,
      updateLastAssistantMessage, removePendingMessage, messages, anh]);

  // Stop generation: abort the fetch, keep the partial reply, unlock input.
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, [setStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;   // Enter đang chốt chữ cho bộ gõ CJK
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
        /* Bề rộng theo chế độ. `max-w`/`max-h` giữ nguyên nên ở cửa sổ hẹp
           hoặc màn điện thoại nó vẫn co lại như cũ, không tràn ra ngoài. */
        className={`fixed bottom-24 right-6 z-[120] ${rong ? 'w-[720px] h-[680px]' : 'w-[390px] h-[580px]'} max-w-[calc(100vw-48px)] max-h-[calc(100dvh-140px)]
          bg-[#0d1117]/95 backdrop-blur-xl
          rounded-2xl
          border border-[#22d3ee]/15
          shadow-[0_0_40px_rgba(34,211,238,0.08),0_8px_32px_rgba(0,0,0,0.8)]
          flex flex-col overflow-hidden`}
          style={{ contain: 'layout style' }}
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

          <div className="min-w-0 flex-1">
            {/* Tiêu đề đổi theo chế độ: ở chế độ gia sư mà vẫn để "root@CuongMini-OS"
                thì người học không có dấu hiệu nào cho biết robot đã nối vào bài. */}
            {cheDoGiaSu ? (
              <>
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#f8fafc]">
                  <GraduationCap className="h-4 w-4 shrink-0 text-[#22d3ee]" /> Gia sư bài học
                </h2>
                <p className="truncate text-[11px] text-[#64748b]">
                  {isStreaming ? 'Đang soạn câu trả lời…' : 'Hỏi ngay tại đây, khỏi cuộn xuống cuối bài'}
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Chuyển chế độ — chỉ hiện khi đang ở một bài học. Không có bài thì
              nút này là một lời hứa suông, bấm vào chẳng đổi gì. */}
          {baiDangHoc && (
            <button
              onClick={() => datMuonChung((v) => !v)}
              disabled={isStreaming}
              title={cheDoGiaSu ? 'Chuyển sang trợ lý chung' : 'Quay lại gia sư của bài đang học'}
              aria-label={cheDoGiaSu ? 'Chuyển sang trợ lý chung' : 'Quay lại gia sư của bài đang học'}
              className="rounded-xl border border-transparent p-2 text-[#64748b] transition-colors hover:border-[#22d3ee]/20 hover:bg-[#22d3ee]/10 hover:text-[#22d3ee] disabled:opacity-40"
            >
              {cheDoGiaSu ? <MessageSquare className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
            </button>
          )}

          {/* Phóng to. Ẩn ở màn hẹp: khung đã chạm `max-w` nên bấm vào không
              rộng thêm được, chỉ là một cái nút chết. */}
          <button
            onClick={() => datRong((v) => !v)}
            title={rong ? 'Thu nhỏ khung' : 'Phóng to khung'}
            aria-label={rong ? 'Thu nhỏ khung' : 'Phóng to khung'}
            className="hidden rounded-xl border border-transparent p-2 text-[#64748b] transition-colors hover:border-[#22d3ee]/20 hover:bg-[#22d3ee]/10 hover:text-[#22d3ee] lg:block"
          >
            {rong ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Lịch sử và "chat mới" thuộc về TRỢ LÝ CHUNG. Ở chế độ gia sư chúng
              không có nghĩa: hội thoại gia sư xếp theo bài, không theo phiên chat,
              nên bấm vào chỉ làm người dùng tưởng mình vừa mất bài đang hỏi. */}
          {!cheDoGiaSu && (
          <button
            onClick={() => void moLichSu()}
            disabled={isStreaming}
            title="Lịch sử trò chuyện"
            aria-label="Lịch sử trò chuyện"
            className="p-2 rounded-xl hover:bg-[#22d3ee]/10 text-[#64748b] hover:text-[#22d3ee] transition-colors border border-transparent hover:border-[#22d3ee]/20 disabled:opacity-40"
          >
            <History className="w-4 h-4" />
          </button>
          )}

          {!cheDoGiaSu && modalMessages.length > 0 && (
            <button
              onClick={() => {
                if (isStreaming) return;
                setMessages('__modal__', []);
                setCurrentSessionId(null);
                setShowPrompts(true);
              }}
              disabled={isStreaming}
              title="Chat mới (xoá hội thoại để đỡ tốn token)"
              className="p-2 rounded-xl hover:bg-[#22d3ee]/10 text-[#64748b] hover:text-[#22d3ee] transition-colors border border-transparent hover:border-[#22d3ee]/20 disabled:opacity-40"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#22d3ee]/10 text-[#64748b] hover:text-[#22d3ee] transition-colors border border-transparent hover:border-[#22d3ee]/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cheDoGiaSu && baiDangHoc ? (
          /* Chế độ gia sư: cùng một ruột với mục cuối bài — xem GiaSuTrongRobot. */
          <GiaSuTrongRobot bai={baiDangHoc} rong={rong} />
        ) : (
          <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3">
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

            {moSu && (
              <div className="mb-3 rounded-xl border border-[#22d3ee]/15 bg-[#0a0a0f]/80 p-1">
                {dangNapSu && su.length === 0 ? (
                  <p className="px-3 py-2 text-xs font-mono text-[#64748b]">Đang tải…</p>
                ) : su.length === 0 ? (
                  <p className="px-3 py-2 text-xs font-mono text-[#64748b]">Chưa có cuộc nào.</p>
                ) : (
                  <div className="max-h-52 overflow-y-auto">
                    {su.map((x) => (
                      <button
                        key={x.id}
                        onClick={() => void chonPhien(x.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#22d3ee]/10 ${
                          x.id === currentSessionId ? 'bg-[#22d3ee]/15' : ''
                        }`}
                      >
                        {/* `min-w-0` để tiêu đề dài CẮT chứ không đẩy con số ra
                            khỏi khung — khung này chỉ rộng ~380px. */}
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-[#cbd5e1]">{x.ten}</span>
                        <span className="shrink-0 font-mono text-[10px] text-[#64748b]">{x.so}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            <div className="mb-2 flex items-center">
              <ModelPicker disabled={isStreaming} />
            </div>

            {anh.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {anh.map((u, i) => (
                  <span key={i} className="relative inline-flex">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-12 w-12 rounded-lg border border-[#22d3ee]/20 object-cover" />
                    <button
                      onClick={() => setAnh((c) => c.filter((_, k) => k !== i))}
                      aria-label="Bỏ ảnh"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#22d3ee]/25 bg-[#0a0a0f] text-[#94a3b8] hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
                onPaste={nhanDan}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="enter command... (paste images)"
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
                onClick={isStreaming ? stopStreaming : () => handleSend(input)}
                disabled={!isStreaming && !input.trim() && anh.length === 0}
                aria-label={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
                title={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
                className={`
                  absolute right-1.5 bottom-1.5 w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all overflow-hidden exec-btn-glitch
                  ${isStreaming
                    ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                    : input.trim()
                      ? 'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                      : 'bg-[#1a1a24] text-[#64748b] cursor-not-allowed'
                  }
                `}
              >
                {isStreaming ? (
                  <span className="block h-2.5 w-2.5 rounded-[2px] bg-white" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </motion.button>
            </div>
          </div>
          </>
        )}
      </motion.div>
    </>
  );
}
