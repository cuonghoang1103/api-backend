'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

/**
 * Floating chat-sessions drawer that lives inside the navigation
 * dock. It is reused by the dock on every page — the consumer
 * passes:
 *  - `variant`        : 'overlay' (floats over content, used when
 *                        hover-only) or 'pinned' (sits in the
 *                        220px reserved slot, layout shifted)
 *  - `onNavigateAway` : optional hook fired when the user picks
 *                        a session / new session so the dock can
 *                        close its auto-hover drawer.
 *
 * Clicking a session sets the active session in the chatStore
 * and routes the user to /chat. Delete works the same way the
 * inline /chat sidebar did — backend first, then store.
 */
export default function ChatSessionsDrawer({
  variant,
  onNavigateAway,
}: {
  variant: 'overlay' | 'pinned';
  onNavigateAway?: () => void;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const sessions = useChatStore((s) => s.sessions);
  const currentSessionId = useChatStore((s) => s.currentSessionId);
  const setCurrentSessionId = useChatStore((s) => s.setCurrentSessionId);
  const removeSession = useChatStore((s) => s.removeSession);
  const setMessages = useChatStore((s) => s.setMessages);
  const setSuggestedPrompts = useChatStore((s) => s.setSuggestedPrompts);

  // Sessions are loaded on /chat mount; if the user opens the
  // dock before ever visiting /chat the list will be empty until
  // we fetch on demand here.
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (hasFetched) return;
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/ai/chat/sessions');
        const list = res.data?.data ?? [];
        if (cancelled) return;
        if (Array.isArray(list) && list.length) {
          useChatStore.getState().setSessions(list);
        }
        setHasFetched(true);
      } catch {
        // Silent — sidebar is non-critical; /chat will fetch on mount.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasFetched, isAuthenticated]);

  const handleSelect = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    onNavigateAway?.();
    try {
      const res = await api.get(`/ai/chat/history/${sessionId}`);
      setMessages(sessionId, res.data?.data ?? []);
    } catch {
      // ignore — /chat page will retry if user lands there
    }
    router.push('/chat');
  };

  const handleNew = () => {
    setCurrentSessionId(null);
    setSuggestedPrompts(getContextualPrompts(''));
    onNavigateAway?.();
    router.push('/chat');
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      if (!sessionId.startsWith('local_')) {
        await api.delete(`/ai/chat/sessions/${sessionId}`);
      }
      removeSession(sessionId);
      toast.success('Đã xoá cuộc trò chuyện');
    } catch {
      toast.error('Xoá thất bại');
    }
  };

  // Pinned variant lives inside the 220px reserved slot, so we
  // tighten padding / font size to leave more room for messages
  // on /chat. Overlay variant floats over the page edge and
  // uses the original 288px feel.
  const compact = variant === 'pinned';

  return (
    <div
      className={cn(
        'flex h-full flex-col text-[#f8fafc]',
        compact ? 'p-2' : 'p-3',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between shrink-0',
          compact ? 'px-1 pb-2' : 'px-1 pb-3',
        )}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
          <span
            className={cn(
              'font-mono font-semibold tracking-tight',
              compact ? 'text-[11px]' : 'text-sm',
            )}
          >
            <span className="text-[#64748b]">~/</span>
            <span className="text-[#22d3ee]">sessions</span>
          </span>
        </div>
        <span
          className={cn(
            'font-mono text-[#64748b]',
            compact ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          {sessions.length}
        </span>
      </div>

      {/* New session button */}
      <button
        onClick={handleNew}
        className={cn(
          'flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl',
          'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white',
          'font-mono font-semibold transition-opacity hover:opacity-90',
          compact ? 'px-2 py-1.5 text-[10px] mb-1.5' : 'px-3 py-2 text-xs mb-2',
        )}
        title="New chat"
      >
        <Plus className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        <span>&gt; new_session()</span>
      </button>

      {/* Session list */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {sessions.length === 0 ? (
          <p
            className={cn(
              'text-center font-mono text-[#64748b]',
              compact ? 'py-6 px-1 text-[10px]' : 'py-8 px-2 text-xs',
            )}
          >
            <span className="text-[#22d3ee]">// </span>
            chưa có session
          </p>
        ) : (
          <ul className="space-y-0.5">
            {sessions.map((session) => {
              const isActive = currentSessionId === session.sessionId;
              return (
                <li key={session.sessionId}>
                  <button
                    onClick={() => handleSelect(session.sessionId)}
                    className={cn(
                      'group relative flex w-full items-start rounded-xl text-left transition-colors',
                      isActive
                        ? 'bg-[#22d3ee]/10 text-[#f8fafc]'
                        : 'text-[#94a3b8] hover:bg-white/[0.05] hover:text-[#f8fafc]',
                      compact ? 'gap-1.5 px-2 py-1.5 pr-6' : 'gap-2 px-2.5 py-2.5 pr-7',
                    )}
                    title={session.title || 'Untitled'}
                  >
                    <MessageSquare
                      className={cn(
                        'mt-0.5 shrink-0',
                        isActive ? 'text-[#22d3ee]' : 'text-[#64748b]',
                        compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate font-mono',
                          compact ? 'text-[10px]' : 'text-xs',
                        )}
                      >
                        <span className="text-[#64748b]">$ </span>
                        <span className={isActive ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                          {session.title || 'New chat'}
                        </span>
                      </p>
                      <p
                        className={cn(
                          'truncate font-mono text-[#64748b] mt-0.5',
                          compact ? 'text-[8px]' : 'text-[10px]',
                        )}
                      >
                        {format(new Date(session.createdAt), 'dd/MM/yy HH:mm', { locale: vi })}
                      </p>
                    </div>
                    <span
                      onClick={(e) => handleDelete(e, session.sessionId)}
                      className={cn(
                        'absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1',
                        'text-[#64748b] hover:text-red-400 hover:bg-red-500/10',
                        'opacity-0 group-hover:opacity-100 transition-all cursor-pointer',
                      )}
                      role="button"
                      aria-label="Xoá session"
                    >
                      <Trash2 className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer hint */}
      <div
        className={cn(
          'shrink-0 pt-2 font-mono text-[#64748b]/50 text-center',
          compact ? 'text-[8px]' : 'text-[9px]',
        )}
      >
        <span className="text-[#22d3ee]/40">/* </span>
        AI Chat history
        <span className="text-[#22d3ee]/40"> */</span>
      </div>
    </div>
  );
}
