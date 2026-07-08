'use client';

import { useEffect, useRef, useState } from 'react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { AlertCircle, ChevronDown, Loader2, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import type { MessagingMessage } from '@/lib/api';

export default function MessageList() {
  const store = useMessagingStore();
  const auth = useAuthStore();
  const threadId = store.currentThreadId!;
  const messages = store.messagesByThread[threadId] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const setReplyTo = store.setReplyTo;
  // Messenger-style "jump to latest" FAB — appears once the user has
  // scrolled a screenful away from the newest message.
  const [showJump, setShowJump] = useState(false);
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    setShowJump(distanceFromBottom > 320);
  };
  const jumpToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setShowJump(false);
  };

  const handleReply = (msg: MessagingMessage) => {
    setReplyTo(msg);
  };

  // Auto-scroll to the bottom on new messages (only if user is near
  // the bottom; if they've scrolled up to read history, leave them
  // be so the page doesn't keep snapping).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    if (distanceFromBottom < 120) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length, threadId]);

  // Scroll to bottom on thread open
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
  }, [threadId]);

  // Keep the latest message visible when the list itself shrinks — on
  // mobile the shell height changes when the on-screen keyboard opens.
  // Same "only if near the bottom" rule as the new-message autoscroll.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let lastHeight = el.clientHeight;
    const ro = new ResizeObserver(() => {
      const shrunk = el.clientHeight < lastHeight;
      lastHeight = el.clientHeight;
      if (!shrunk) return;
      const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
      if (distanceFromBottom < 200) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [threadId]);

  // Typing users (excluding self) — evict stale
  const typingMap = store.typing.byThread[threadId] ?? {};
  const now = Date.now();
  const typingUserIds = Object.entries(typingMap)
    .filter(([, until]) => until > now)
    .map(([uid]) => Number(uid))
    .filter((uid) => uid !== auth.user?.id);

  // Group messages by day so we can show date separators
  const groups: { day: string; items: typeof messages }[] = [];
  for (const m of messages) {
    const day = format(new Date(m.createdAt), 'yyyy-MM-dd');
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(m);
    else groups.push({ day, items: [m] });
  }

  return (
    <div className="relative h-full">
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="chat-messages-scroll h-full overflow-y-auto px-3 py-2"
      style={{ scrollbarWidth: 'thin' }}
    >
      {store.hasMoreByThread[threadId] && (
        <div className="mb-2 flex justify-center">
          <button
            onClick={() => store.loadMoreMessages(threadId)}
            disabled={store.messagesLoading}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] text-text-secondary transition-colors hover:bg-white/[0.08] disabled:opacity-50"
          >
            {store.messagesLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Tải thêm tin nhắn cũ'}
          </button>
        </div>
      )}

      {messages.length === 0 && !store.messagesLoading && !store.messageLoadError && (
        <div className="flex h-full items-center justify-center text-center text-xs text-text-muted">
          Chưa có tin nhắn. Hãy gửi lời chào!
        </div>
      )}

      {store.messagesLoading && messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        </div>
      )}

      {store.messageLoadError && !store.messagesLoading && (
        // Surface a retry-able error when the server fetch failed.
        // Without this, a transient 401 (cookie race after login)
        // would silently leave the user staring at "Chưa có tin
        // tin nhắn" with no indication anything went wrong.
        <div className="m-3 flex flex-col items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-[12px] leading-relaxed text-red-300">
            {store.messageLoadError}
          </p>
          <button
            onClick={() => store.openThread(threadId)}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            <RefreshCcw className="h-3 w-3" />
            Thử lại
          </button>
        </div>
      )}

      {groups.map((g) => (
        <div key={g.day}>
          <div className="my-2 flex justify-center">
            <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-text-muted">
              {format(new Date(g.day), 'dd MMMM yyyy')}
            </span>
          </div>
          {g.items.map((m, idx) => {
            // Show sender name only for the first message in a run
            // from the same sender (i.e. when previous message is
            // from a different sender). For own messages, never
            // show sender name.
            const prev = idx > 0 ? g.items[idx - 1] : null;
            const showSender =
              m.senderId !== auth.user?.id &&
              (!prev || prev.senderId !== m.senderId);
            return (
              <MessageBubble
                key={m.id}
                message={m}
                isOwn={m.senderId === auth.user?.id}
                showSender={showSender}
                onReply={handleReply}
              />
            );
          })}
        </div>
      ))}

      {typingUserIds.length > 0 && <TypingIndicator />}
    </div>

    {/* Messenger-style jump-to-latest FAB */}
    {showJump && (
      <button
        onClick={jumpToBottom}
        aria-label="Xuống tin nhắn mới nhất"
        className="absolute bottom-3 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#20212e] text-text-primary shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    )}
    </div>
  );
}
