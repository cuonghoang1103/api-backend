'use client';

import { useEffect, useRef } from 'react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MessageList() {
  const store = useMessagingStore();
  const auth = useAuthStore();
  const threadId = store.currentThreadId!;
  const messages = store.messagesByThread[threadId] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={scrollRef}
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

      {messages.length === 0 && !store.messagesLoading && (
        <div className="flex h-full items-center justify-center text-center text-xs text-text-muted">
          Chưa có tin nhắn. Hãy gửi lời chào!
        </div>
      )}

      {store.messagesLoading && messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
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
              />
            );
          })}
        </div>
      ))}

      {typingUserIds.length > 0 && <TypingIndicator />}
    </div>
  );
}
