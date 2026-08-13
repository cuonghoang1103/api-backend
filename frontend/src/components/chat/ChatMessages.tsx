'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, CheckCheck, Download, FileText, Loader2, ThumbsUp, ThumbsDown, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { ChatMessage } from '@/types';
import { downloadTextFile, downloadPdf } from '@/lib/chatExport';
import ChatMarkdown from './ChatMarkdown';
import { api } from '@/lib/api';
import type { ChatSkin } from '@/store/chatSkinStore';

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

// ── Dấu hiệu "đang soạn" của giao diện studio ─────────────────────
function StudioThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-4"
    >
      <StudioAssistantMark />
      <div className="flex items-center gap-1.5 pt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-[color:var(--studio-text-faint)]"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/** Dấu hiệu nhận diện của trợ lý trong giao diện studio (thay avatar robot). */
function StudioAssistantMark() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--studio-border)] bg-[var(--studio-panel-soft)] p-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/favicon.png" alt="CuongMini" className="h-full w-full object-contain" />
    </div>
  );
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
function MessageBubble({ msg, isStreaming, isLastAssistant, skin = 'terminal' }: {
  msg: ChatMessage;
  isStreaming: boolean;
  isLastAssistant: boolean;
  skin?: ChatSkin;
}) {
  const [copied, setCopied] = useState(false);
  const [dlOpen, setDlOpen] = useState(false);
  const [dlBusy, setDlBusy] = useState(false);
  const [rated, setRated] = useState<null | 'up' | 'down'>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const sendFeedback = async (kind: 'up' | 'down') => {
    if (!msg.dbId || rated) return;
    setRated(kind); // optimistic — the widget stays out of the user's way
    try {
      await api.post('/ai/feedback', { messageId: msg.dbId, rating: kind === 'up' ? 5 : 1, feedbackType: 'thumbs' });
      toast.success('Cảm ơn phản hồi của bạn!');
    } catch {
      setRated(null);
      toast.error('Không gửi được phản hồi');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = msg.role === 'user';

  const download = async (fmt: 'txt' | 'md' | 'pdf') => {
    const base = `cuongmini-${format(new Date(msg.createdAt), 'yyyyMMdd-HHmmss')}`;
    try {
      setDlBusy(true);
      if (fmt === 'pdf') await downloadPdf(msg.content, `${base}.pdf`);
      else downloadTextFile(msg.content, `${base}.${fmt}`);
    } catch {
      toast.error('Tải file thất bại');
    } finally {
      setDlBusy(false);
      setDlOpen(false);
    }
  };

  // ── Giao diện STUDIO ────────────────────────────────────────────
  // Câu trả lời của trợ lý là văn bản trần (không bong bóng) như
  // ChatGPT/Claude — mắt đọc dòng dài dễ hơn; chỉ tin nhắn của người
  // dùng mới có bong bóng, canh phải. Toàn bộ hành vi (chép, chấm
  // điểm, tải file) dùng chung với giao diện terminal ở trên.
  if (skin === 'studio') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`group flex gap-4 ${isUser ? 'justify-end' : ''}`}
      >
        {!isUser && <StudioAssistantMark />}

        <div className={`min-w-0 ${isUser ? 'max-w-[85%] sm:max-w-[75%]' : 'flex-1'}`}>
          {isUser ? (
            <div className="rounded-2xl rounded-tr-md bg-[var(--studio-user-bubble)] px-4 py-2.5 text-[15px] leading-7 text-[color:var(--studio-text)]">
              {msg.images && msg.images.length > 0 && (
                <div className="mb-2 flex flex-wrap justify-end gap-1.5">
                  {msg.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt="attachment"
                      className="max-h-[180px] max-w-[180px] rounded-xl border border-[color:var(--studio-border)] object-cover"
                    />
                  ))}
                </div>
              )}
              {msg.documentNames && msg.documentNames.length > 0 && (
                <div className="mb-2 flex flex-wrap justify-end gap-1.5">
                  {msg.documentNames.map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-[color:var(--studio-border)] bg-[var(--studio-panel)] px-2 py-1"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-[color:var(--studio-text-soft)]" />
                      <span className="truncate text-xs text-[color:var(--studio-text-soft)]">{name}</span>
                    </span>
                  ))}
                </div>
              )}
              {msg.content && <span className="whitespace-pre-wrap">{msg.content}</span>}
            </div>
          ) : (
            <div className="markdown-content pt-0.5 text-[15px] leading-7 text-[color:var(--studio-text)]">
              {(() => {
                const raw = msg.content ?? '';
                if (!raw.trim()) {
                  return <span className="italic text-[color:var(--studio-text-faint)]">Đang soạn câu trả lời…</span>;
                }
                return <ChatMarkdown content={raw} renderMath={!(isStreaming && isLastAssistant)} />;
              })()}
              {isStreaming && isLastAssistant && (
                <motion.span
                  key="cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="ml-0.5 inline-block h-4 w-[3px] rounded-sm align-middle"
                  style={{ background: 'var(--studio-accent)' }}
                />
              )}
            </div>
          )}

          {/* Hàng công cụ — mờ, chỉ rõ khi rê chuột vào tin nhắn */}
          {/* Hàng công cụ. `chat-actions` (globals.css) giữ nó ẩn khi rê chuột
              được, nhưng HIỆN HẲN trên thiết bị cảm ứng: điện thoại không có
              trạng thái hover, để `opacity-0 group-hover` thì nút Chép / Tải /
              Đánh giá không bao giờ hiện ra — mất tính năng, không phải "gọn". */}
          <div
            className={`chat-actions mt-1.5 flex items-center gap-1.5 text-[color:var(--studio-text-faint)] transition-opacity
              ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-[11px] tabular-nums">{format(new Date(msg.createdAt), 'HH:mm')}</span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="rounded-md p-1 transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
                title="Chép câu trả lời"
              >
                {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
            {!isUser && msg.dbId && !isStreaming && (
              <>
                <button
                  onClick={() => sendFeedback('up')}
                  disabled={!!rated}
                  title="Câu trả lời hữu ích"
                  className={`rounded-md p-1 transition-colors disabled:cursor-default ${rated === 'up' ? 'text-emerald-500' : 'hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)]'}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => sendFeedback('down')}
                  disabled={!!rated}
                  title="Câu trả lời chưa tốt"
                  className={`rounded-md p-1 transition-colors disabled:cursor-default ${rated === 'down' ? 'text-rose-500' : 'hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)]'}`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            {!isUser && msg.content?.trim() && (
              <div className="relative">
                <button
                  onClick={() => setDlOpen((o) => !o)}
                  disabled={dlBusy}
                  className="rounded-md p-1 transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
                  title="Tải câu trả lời"
                >
                  {dlBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                </button>
                {dlOpen && !dlBusy && (
                  <div
                    className="absolute bottom-full left-0 z-20 mb-1 flex gap-1 rounded-lg border border-[color:var(--studio-border)] bg-[var(--studio-panel)] p-1"
                    style={{ boxShadow: 'var(--studio-shadow)' }}
                  >
                    {(['txt', 'md', 'pdf'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => download(fmt)}
                        className="rounded px-2 py-0.5 text-[11px] font-medium uppercase text-[color:var(--studio-text-soft)] transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

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
                return <ChatMarkdown content={raw} renderMath={!(isStreaming && isLastAssistant)} />;
              })()}
            </div>
          ) : (
            <div>
              {msg.images && msg.images.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2 justify-end">
                  {msg.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt="attachment"
                      className="max-w-[160px] max-h-[160px] object-cover rounded-lg border border-[#ef4444]/25"
                    />
                  ))}
                </div>
              )}
              {msg.documentNames && msg.documentNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2 justify-end">
                  {msg.documentNames.map((name, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/10 max-w-[200px]">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs truncate">{name}</span>
                    </span>
                  ))}
                </div>
              )}
              {msg.content && <span className="whitespace-pre-wrap">{msg.content}</span>}
            </div>
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
          <span className="text-[11px] text-[#64748b] font-mono tabular-nums">
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
          {/* Feedback thumbs — only once the reply is saved (has a DB id) and done */}
          {!isUser && msg.dbId && !isStreaming && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => sendFeedback('up')}
                disabled={!!rated}
                title="Câu trả lời hữu ích"
                className={`p-1 rounded-md transition-colors ${rated === 'up' ? 'text-green-400' : 'text-[#64748b] hover:text-green-400 hover:bg-green-400/5'} disabled:cursor-default`}
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => sendFeedback('down')}
                disabled={!!rated}
                title="Câu trả lời chưa tốt"
                className={`p-1 rounded-md transition-colors ${rated === 'down' ? 'text-red-400' : 'text-[#64748b] hover:text-red-400 hover:bg-red-400/5'} disabled:cursor-default`}
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
          {/* Download the reply as a file (assistant, non-empty only) */}
          {!isUser && msg.content?.trim() && (
            <div className="relative">
              <button
                onClick={() => setDlOpen((o) => !o)}
                disabled={dlBusy}
                className="p-1 rounded-md text-[#64748b] hover:text-[#22d3ee] hover:bg-[#22d3ee]/5 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40"
                title="Tải câu trả lời"
              >
                {dlBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              </button>
              {dlOpen && !dlBusy && (
                <div className="absolute z-20 bottom-full mb-1 left-0 flex gap-1 p-1 rounded-lg bg-[#0d1117] border border-[#22d3ee]/25 shadow-lg">
                  {(['txt', 'md', 'pdf'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => download(fmt)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono uppercase text-[#e2e8f0] hover:bg-[#22d3ee]/15 hover:text-[#22d3ee] transition-colors"
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatMessages({ messages, isStreaming, skin = 'terminal' }: {
  messages: ChatMessage[];
  isStreaming: boolean;
  /** 'terminal' = bản gốc (mặc định). 'studio' = bản dễ nhìn. */
  skin?: ChatSkin;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const userScrolledUp = useRef<boolean>(false);
  const [showJump, setShowJump] = useState(false);

  // ── Smart auto-scroll ────────────────────────────────────────
  // Chỉ tự cuộn khi người dùng ĐANG ở gần đáy. Cuộn lên đọc lại giữa lúc câu
  // trả lời còn chảy về thì phải để yên cho họ đọc.
  //
  // ⚠️ Cái nghe sự kiện phải gắn vào ĐÚNG phần tử đang cuộn. Trước đây nó gắn
  // vào `containerRef` — mà div đó KHÔNG có `overflow`, phần cuộn thật nằm ở
  // div cha (`flex-1 overflow-y-auto` bên /chat/page.tsx). Sự kiện không bao
  // giờ bắn ⇒ `userScrolledUp` luôn false ⇒ đang đọc dở vẫn bị kéo tuột xuống
  // đáy sau mỗi mẩu chữ. Tìm tổ tiên cuộn được rồi gắn vào đó.
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    // Người xin giảm chuyển động thì nhảy thẳng, đừng trượt: cuộn mượt là
    // chuyển động toàn màn hình, đúng thứ gây chóng mặt mà họ đã tắt.
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'end' });
  }, []);

  useEffect(() => {
    let el: HTMLElement | null = containerRef.current?.parentElement ?? null;
    while (el) {
      const oy = getComputedStyle(el).overflowY;
      if (oy === 'auto' || oy === 'scroll') break;
      el = el.parentElement;
    }
    hostRef.current = el;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el as HTMLElement;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      userScrolledUp.current = distanceFromBottom > 150;
      // Ngưỡng hiện nút cao hơn ngưỡng khoá tự cuộn (240 > 150) để nút không
      // nhấp nháy khi người dùng chỉ nhích nhẹ quanh mép đáy.
      setShowJump(distanceFromBottom > 240);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el?.removeEventListener('scroll', onScroll);
  }, [skin]);

  // Đang chảy chữ: chỉ bám đáy khi người dùng vốn ở đáy.
  useEffect(() => {
    if (isStreaming && !userScrolledUp.current) {
      scrollToBottom('smooth');
    }
  }, [isStreaming, scrollToBottom]);

  // Tin nhắn mới (mình vừa gửi, hoặc câu trả lời vừa xong) → xuống đáy nếu
  // đang ở đáy. Thiếu cái này thì gửi xong tin nhắn tự trôi khỏi màn hình.
  useEffect(() => {
    if (!userScrolledUp.current) scrollToBottom('smooth');
  }, [messages.length, scrollToBottom]);

  const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === 'assistant');
  const lastAssistantId = lastAssistantIndex >= 0 ? messages[messages.length - 1 - lastAssistantIndex]?.id : null;

  const isStudio = skin === 'studio';

  return (
    <>
      {!isStudio && <ChatScrollStyles />}
      {/* Outer scroll container — attach the scroll listener here.
          Bản studio: cột hẹp căn giữa (max-w-3xl) như ChatGPT/Claude,
          dòng chữ không kéo dài hết màn hình rộng. */}
      <div
        ref={containerRef}
        className={
          isStudio
            ? 'mx-auto flex w-full max-w-3xl min-w-0 flex-col px-4 sm:px-6 py-7 space-y-7'
            : 'flex-1 min-w-0 flex flex-col chat-messages-scroll px-4 sm:px-6 py-6 space-y-6'
        }
      >
      {/* popLayout: only animates entering/leaving elements, not existing ones.
          This prevents every message from re-animating when the array changes. */}
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isStreaming={isStreaming}
            isLastAssistant={msg.id === lastAssistantId}
            skin={skin}
          />
        ))}
      </AnimatePresence>

      {/* Streaming thinking indicator */}
      {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
        isStudio ? <StudioThinkingIndicator /> : <MechThinkingIndicator />
      )}

      {/* Invisible anchor — scrollIntoView target sits after last message */}
      <div ref={endRef} aria-hidden="true" />

      {/* Nút "về cuối" — `sticky` nên nó bám mép dưới vùng cuộn mà không cần
          portal hay toạ độ tuyệt đối. Chỉ hiện khi đã cuộn lên quá 240px,
          đúng lúc mất dấu câu trả lời mới nhất. */}
      {/* Hộp chứa phải CÓ chiều cao thật. Cho `height: 0` thì nút 40px tràn ra
          ngoài hộp, và vùng cuộn (`overflow-y:auto`) cắt luôn phần tràn — nút
          nằm trong DOM, opacity 1, mà không ai thấy. */}
      <div className="pointer-events-none sticky bottom-3 z-10 flex justify-center">
        <AnimatePresence>
          {showJump && (
            <motion.button
              key="jump"
              type="button"
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.94 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
              onClick={() => { userScrolledUp.current = false; scrollToBottom('smooth'); }}
              aria-label="Cuộn xuống tin nhắn mới nhất"
              className={
                isStudio
                  ? `pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full border
                     border-[color:var(--studio-border)] bg-[var(--studio-panel)] px-4 text-[13px] font-medium
                     text-[color:var(--studio-text-soft)] transition-colors hover:text-[color:var(--studio-text)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]`
                  : `pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full border
                     border-[#22d3ee]/25 bg-[#0d1117] px-4 text-[13px] font-mono text-[#94a3b8]
                     transition-colors hover:text-[#22d3ee]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40`
              }
              style={isStudio ? { boxShadow: 'var(--studio-shadow)' } : undefined}
            >
              <ArrowDown className="h-4 w-4" />
              Về cuối
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
