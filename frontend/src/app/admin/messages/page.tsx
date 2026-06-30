'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Inbox, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import MessageList from '@/components/messaging/MessageList';
import MessageInput from '@/components/messaging/MessageInput';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

/**
 * /admin/messages — admin inbox.
 *
 * Renders the same widgets the user-facing chat uses so the UX is
 * consistent (typing indicator, real-time, attachments). The only
 * admin-specific bits are:
 *   1. The list on the left is filtered server-side to admin-threads.
 *   2. An "Unread only" toggle in the header.
 *   3. A username search input (client-side filter for Phase 1;
 *      switch to /admin/users API later if perf is needed).
 */
export default function AdminMessagesPage() {
  const auth = useAuthStore();
  const store = useMessagingStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !auth.isAuthenticated) return;
    store.init('support');
  }, [mounted, auth.isAuthenticated, store]);

  if (!mounted || !auth.isAuthenticated) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  const threads = store.threads
    .filter((t) => t.type === 'ADMIN')
    .filter((t) => (filter === 'unread' ? (t.unreadCount ?? 0) > 0 : true))
    .filter((t) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        t.peer?.displayName?.toLowerCase().includes(q) ||
        t.peer?.username?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="flex h-[calc(100dvh-100px)] flex-col gap-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-text-primary">Hộp thư hỗ trợ</h1>
          <span className="text-xs text-text-muted">({threads.length} cuộc trò chuyện)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm username..."
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-cyan-500/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'rounded-md px-2.5 py-1 transition-colors',
                filter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-text-muted hover:text-text-primary',
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'rounded-md px-2.5 py-1 transition-colors',
                filter === 'unread' ? 'bg-cyan-500/20 text-cyan-300' : 'text-text-muted hover:text-text-primary',
              )}
            >
              Chưa đọc
            </button>
          </div>
        </div>
      </header>

      <div
        className="flex min-h-0 flex-1 overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(15, 15, 25, 0.6)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Thread list */}
        <div
          className="w-80 shrink-0 overflow-y-auto border-r border-white/[0.06]"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          {threads.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-xs text-text-muted">
              <ShieldCheck className="h-6 w-6 opacity-50" />
              <p>Chưa có cuộc trò chuyện hỗ trợ nào.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {threads.map((t) => {
                const active = store.currentThreadId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => store.openThread(t.id)}
                      className={cn(
                        'flex w-full items-center gap-3 p-3 text-left transition-colors',
                        active ? 'bg-cyan-500/[0.08]' : 'hover:bg-white/[0.03]',
                      )}
                    >
                      <Avatar src={t.peer?.avatarUrl} name={t.peer?.displayName ?? t.peer?.username ?? '?'} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {t.peer?.displayName ?? t.peer?.username}
                          </p>
                          {t.lastMessageAt && (
                            <span className="shrink-0 text-[10px] text-text-muted">
                              {formatDistanceToNow(new Date(t.lastMessageAt), { addSuffix: false, locale: vi })}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-text-muted">
                          {t.lastMessage?.hasAttachment ? '📎 Đính kèm' : t.lastMessage?.content || <em>Chưa có tin nhắn</em>}
                        </p>
                      </div>
                      {(t.unreadCount ?? 0) > 0 && (
                        <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {t.unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Chat area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {store.currentThreadId ? (
            <>
              <button
                onClick={() => store.closeThread()}
                className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2 text-xs text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
              </button>
              <div className="min-h-0 flex-1">
                <MessageList />
              </div>
              <MessageInput />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-text-muted">
              <Inbox className="h-8 w-8 opacity-50" />
              <p className="text-sm">Chọn một cuộc trò chuyện ở bên trái</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return <img src={src} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />;
  }
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
