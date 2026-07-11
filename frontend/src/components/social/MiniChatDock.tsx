'use client';

import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Send, X } from 'lucide-react';
import SafeAvatar from '@/components/ui/SafeAvatar';
import { connectSocket, emitTyping, getSocket } from '@/lib/socket';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import type { MessagingMessage } from '@/lib/api';

class MiniChatDockErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ────────────────────────────────────────────────────────────────────
 * MiniChatDock — Facebook-style floating chat windows
 * ────────────────────────────────────────────────────────────────────
 * Listens for the `social:open-mini-chat` CustomEvent dispatched by
 * the SocialSidebar friend row. Multiple windows can be open at once.
 *
 * Wiring (all reusing the SAME plumbing the main Messenger page uses):
 *
 *   - Resolve / create the 1-to-1 thread via messagingStore.startUserThread
 *     (no parallel API; this is exactly the same call the /messages page uses)
 *   - Fetch history into the SHARED `messagesByThread[threadId]` cache via
 *     messagingStore.loadThreadMessages — does NOT touch `currentThreadId`
 *     so a popup never clobbers the user's currently-open conversation on
 *     the full Messenger page
 *   - Subscribe to that cache slice per-window for both historical render
 *     and real-time incoming (applyIncomingMessage writes to the same slice)
 *   - Send via messagingStore.sendMessage (same call as /messages page)
 *   - Read typing from the SHARED socket singleton — the dock attaches
 *     ONE `thread:typing` listener (not one per window) and maps by threadId
 *   - Read presence from messagingStore.getPresence(peerId)
 *   - Mark-as-read on open via store.markRead (same as /messages page)
 *   - Unread badge for closed/backgrounded windows reads threads[].unreadCount
 *
 * Single socket: `connectSocket()` returns a singleton. The dock attaches
 * its own typing listener once on mount and never opens a second socket.
 * ──────────────────────────────────────────────────────────────────── */

interface MiniChatPeer {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface ChatWindowState {
  peer: MiniChatPeer;
  isOpen: boolean;
  isMinimized: boolean;
  /** DM thread id once resolved (null while loading). */
  threadId: number | null;
  /** True while the first loadThreadMessages call is in flight. */
  historyLoading: boolean;
  /** Remote peer is typing (driven by shared socket event). */
  isTyping: boolean;
  draft: string;
}

const WINDOW_WIDTH = 320;
const WINDOW_HEIGHT = 380;
const WINDOW_GAP = 12;
const RIGHT_OFFSET = 20;
const BOTTOM_OFFSET = 20;
const MAX_VISIBLE = 3;
/** Stop-typing signal fires this many ms after the last keystroke. */
const TYPING_DEBOUNCE_MS = 2000;

/** Quick-reply chips — only shown when there is NO message history yet
 *  (i.e. the user opened a brand-new conversation). Once real messages
 *  exist, the chips disappear so the dock doesn't double as a script. */
const SUGGESTED_REPLIES = [
  'Chào bạn! 👋',
  'Bạn có khỏe không?',
  'Mình rảnh nè, nói chuyện sau nhé!',
  'Haha, hay quá!',
];

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function MiniChatDockInner() {
  const [windows, setWindows] = useState<ChatWindowState[]>([]);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  // Per-window typing debounce timers.
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const { isAuthenticated } = useAuthStore();

  // ─── Live store subscriptions ─────────────────────────────
  // The main /messages page is the source of truth for messages +
  // presence + thread metadata; the popup merely renders a slice of
  // it. We subscribe through the shared Zustand store so opening a
  // popup never duplicates state — incoming messages on one surface
  // are visible on the other without an extra fetch.
  //
  // We pull the entire `messagesByThread` map and `threads` array
  // here at the parent level (cheap; the store already memoises) and
  // each window derives its own slice via useMemo. This keeps the
  // subscription count O(1) regardless of how many popups are open.
  const messagesByThread = useMessagingStore((s) => s.messagesByThread);
  const threads = useMessagingStore((s) => s.threads);
  const presence = useMessagingStore((s) => s.presence);

  // Quick lookup: peerId -> unreadCount, derived from the shared
  // threads list. Recomputed only when threads changes.
  const unreadByPeerId = useMemo(() => {
    const map = new Map<number, number>();
    for (const t of threads) {
      const peerId = t.peer?.id;
      if (typeof peerId === 'number') {
        map.set(peerId, t.unreadCount ?? 0);
      }
    }
    return map;
  }, [threads]);

  // Resolve thread + load history + join socket room + mark read.
  const resolveThread = useCallback(async (peerId: number) => {
    if (!isAuthenticated) return;
    try {
      const threadId = await useMessagingStore.getState().startUserThread(peerId);
      // Reconcile the peer from the authoritative thread record (startUserThread
      // ran loadThreads()). The sidebar-supplied avatar/name can be null or
      // stale; the thread's peer carries the canonical values, which fixes the
      // "header shows initials instead of the real avatar" case.
      const storeThread = useMessagingStore
        .getState()
        .threads.find((t) => t.id === threadId || t.peer?.id === peerId);
      const canonicalPeer = storeThread?.peer;
      setWindows((prev) =>
        prev.map((w) =>
          w.peer.id === peerId
            ? {
                ...w,
                threadId,
                historyLoading: true,
                peer: canonicalPeer
                  ? {
                      ...w.peer,
                      avatarUrl: canonicalPeer.avatarUrl ?? w.peer.avatarUrl,
                      displayName: canonicalPeer.displayName ?? w.peer.displayName,
                      username: canonicalPeer.username ?? w.peer.username,
                    }
                  : w.peer,
              }
            : w,
        ),
      );
      // Connect the socket for live updates, but DON'T await it here: if
      // connectSocket() rejects/times out it must not abort the history fetch
      // below (that left the dock permanently on the empty "start a
      // conversation" state). loadThreadMessages' internal joinThread is
      // queue-safe and joins the room once the socket comes up.
      connectSocket().catch(() => {});
      // Fetch + cache + join + markRead via the same REST + cache plumbing the
      // /messages page uses, just without setting currentThreadId.
      await useMessagingStore.getState().loadThreadMessages(threadId);
      setWindows((prev) =>
        prev.map((w) =>
          w.peer.id === peerId ? { ...w, historyLoading: false } : w,
        ),
      );
    } catch {
      setWindows((prev) =>
        prev.map((w) =>
          w.peer.id === peerId ? { ...w, historyLoading: false } : w,
        ),
      );
    }
  }, [isAuthenticated]);

  // ─── Shared socket typing listener (one for the whole dock) ─
  // The /messages page also subscribes to thread:typing via the
  // store, but we still need our own to know WHICH popup window the
  // event belongs to (the store keeps it in typing.byThread but no
  // public selector exposes it per-window). One listener covers all
  // open windows — the handler dispatches to the matching peer by
  // threadId. Cleaned up on unmount.
  useEffect(() => {
    let cancel = false;

    const attachTypingListener = async () => {
      try {
        const socket = await connectSocket();
        if (cancel || !socket) return;

        const onTyping = (payload: { threadId: number; userId: number; isTyping: boolean }) => {
          if (!payload) return;
          setWindows((prev) =>
            prev.map((w) => {
              if (w.threadId !== payload.threadId) return w;
              return { ...w, isTyping: payload.isTyping };
            }),
          );
        };

        socket.on('thread:typing', onTyping);
        return () => socket.off('thread:typing', onTyping);
      } catch {
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    attachTypingListener().then((fn) => { if (!cancel) cleanup = fn; });

    return () => {
      cancel = true;
      cleanup?.();
    };
  }, [isAuthenticated]);

  // ─── Listener: opened from the sidebar ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<MiniChatPeer>).detail;
      if (!detail || !detail.id) return;
      setWindows((prev) => {
        const existing = prev.find((w) => w.peer.id === detail.id);
        if (existing) {
          return prev.map((w) =>
            w.peer.id === detail.id
              ? { ...w, isOpen: true, isMinimized: false }
              : w,
          );
        }
        return [
          ...prev,
          {
            peer: detail,
            isOpen: true,
            isMinimized: false,
            threadId: null,
            historyLoading: false,
            isTyping: false,
            draft: '',
          },
        ];
      });
      // Kick off async thread resolution + history load.
      void resolveThread(detail.id);
    };
    window.addEventListener('social:open-mini-chat', onOpen as EventListener);
    return () =>
      window.removeEventListener('social:open-mini-chat', onOpen as EventListener);
  }, [resolveThread]);

  // Focus the input of the most recently opened window.
  useEffect(() => {
    if (windows.length === 0) return;
    const last = windows[windows.length - 1];
    if (last.isOpen && !last.isMinimized && last.threadId) {
      window.setTimeout(() => {
        inputRefs.current[last.peer.id]?.focus();
      }, 250);
    }
  }, [windows.length]);

  const closeWindow = useCallback((peerId: number) => {
    if (typingTimers.current[peerId]) {
      clearTimeout(typingTimers.current[peerId]);
      delete typingTimers.current[peerId];
    }
    setWindows((prev) => {
      const win = prev.find((w) => w.peer.id === peerId);
      if (win?.threadId) emitTyping(win.threadId, false);
      return prev.filter((w) => w.peer.id !== peerId);
    });
  }, []);

  const toggleMinimize = useCallback((id: number) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.peer.id === id ? { ...w, isMinimized: !w.isMinimized } : w,
      ),
    );
  }, []);

  const updateDraft = useCallback(
    (peerId: number, value: string, threadId: number | null) => {
      setWindows((prev) =>
        prev.map((w) => (w.peer.id === peerId ? { ...w, draft: value } : w)),
      );

      if (!threadId) return;

      emitTyping(threadId, true);

      if (typingTimers.current[peerId]) clearTimeout(typingTimers.current[peerId]);
      typingTimers.current[peerId] = setTimeout(() => {
        emitTyping(threadId, false);
        delete typingTimers.current[peerId];
      }, TYPING_DEBOUNCE_MS);
    },
    [],
  );

  const visibleWindows = useMemo(() => {
    const open = windows.filter((w) => w.isOpen);
    if (open.length <= MAX_VISIBLE) return open;
    return open.slice(-MAX_VISIBLE);
  }, [windows]);

  // Cleanup timers on unmount.
  useEffect(() => {
    return () => {
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  }, []);

  if (windows.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[120]"
      aria-live="polite"
    >
      <div className="pointer-events-auto absolute bottom-0 right-0 flex items-end gap-3 p-0">
        <AnimatePresence>
          {visibleWindows.map((w, i) => {
            const visibleIndex = visibleWindows.length - 1 - i;
            const rightOffset =
              RIGHT_OFFSET + visibleIndex * (WINDOW_WIDTH + WINDOW_GAP);

            // Slice the shared cache for this window. Empty array if
            // we haven't loaded yet OR the server returned nothing.
            const messages = w.threadId ? messagesByThread[w.threadId] ?? [] : [];

            // Use the live presence snapshot for the peer. Special-
            // case: if this is the current user themselves (e.g. via
            // a future "self-chat" admin thread), show online.
            const peerPresence = presence.byUserId[w.peer.id] ?? { online: false, lastSeen: 0 };
            const isPeerOnline = peerPresence.online;

            // Unread badge (read from the shared threads list, not
            // a local counter). The store's applyIncomingMessage
            // bumps threads[].unreadCount for non-active threads; we
            // render whatever the store says.
            const peerUnread = unreadByPeerId.get(w.peer.id) ?? 0;

            return (
              <ChatWindow
                key={w.peer.id}
                window={w}
                messages={messages}
                isPeerOnline={isPeerOnline}
                peerUnread={peerUnread}
                rightOffset={rightOffset}
                inputRefSetter={(el) => { inputRefs.current[w.peer.id] = el; }}
                onToggleMinimize={() => toggleMinimize(w.peer.id)}
                onClose={() => closeWindow(w.peer.id)}
                onUpdateDraft={(value) => updateDraft(w.peer.id, value, w.threadId)}
                onSend={async () => {
                  const draft = w.draft.trim();
                  if (!draft || !w.threadId) return;
                  // Clear draft + stop typing indicator immediately.
                  updateDraft(w.peer.id, '', w.threadId);
                  if (typingTimers.current[w.peer.id]) {
                    clearTimeout(typingTimers.current[w.peer.id]);
                    delete typingTimers.current[w.peer.id];
                  }
                  emitTyping(w.threadId, false);
                  try {
                    await useMessagingStore.getState().sendMessage(w.threadId, draft);
                    // No explicit refresh needed: applyIncomingMessage
                    // (or the success branch in sendMessage) updates
                    // messagesByThread[threadId] in-place; we re-render
                    // via the parent's store subscription.
                  } catch {
                    // Revert draft on failure so the user doesn't lose their message.
                    setWindows((prev) =>
                      prev.map((win) =>
                        win.peer.id === w.peer.id ? { ...win, draft } : win,
                      ),
                    );
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * ChatWindow — one floating popup. Renders the same dark glass UI as
 * before; the body now shows real messages from the shared cache.
 * ──────────────────────────────────────────────────────────────────── */

interface ChatWindowProps {
  window: ChatWindowState;
  messages: MessagingMessage[];
  isPeerOnline: boolean;
  peerUnread: number;
  rightOffset: number;
  inputRefSetter: (el: HTMLInputElement | null) => void;
  onToggleMinimize: () => void;
  onClose: () => void;
  onUpdateDraft: (value: string) => void;
  onSend: () => Promise<void>;
}

function ChatWindow({
  window: w,
  messages,
  isPeerOnline,
  peerUnread,
  rightOffset,
  inputRefSetter,
  onToggleMinimize,
  onClose,
  onUpdateDraft,
  onSend,
}: ChatWindowProps) {
  const { user } = useAuthStore();
  const selfId = user?.id ?? null;

  // Refs for the scroll container so we can autoscroll on new
  // messages. The container is the inner padded div because that's
  // the actual scrollable element (overflow-y-auto on the parent).
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on initial load and whenever a new
  // message lands. useLayoutEffect avoids a 1-frame flash of the
  // scrollbar at the top before snapping down.
  const lastMsgIdRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    if (messages.length === 0) return;
    const lastId = messages[messages.length - 1]?.id ?? null;
    if (lastId !== lastMsgIdRef.current) {
      lastMsgIdRef.current = lastId;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark-as-read when the user is actively looking at the popup
  // AND a new incoming message lands. The store's
  // `applyIncomingMessage` only auto-marks when `currentThreadId`
  // matches (i.e. the user is on /messages); for popup viewers we
  // call markRead ourselves on each new peer message. `markRead`
  // is a thin PATCH + local clear — calling it per-message is
  // cheap and idempotent on the server, and it keeps the unread
  // badge consistent with the user's actual viewing state.
  //
  // Why per-message (not per-mount): the popup may be open for
  // minutes without new traffic; we don't want to spam
  // /mark-read with no payload. The empty-array guard below
  // skips the call when we haven't even fetched history yet.
  const lastMarkedReadIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!w.threadId) return;
    if (w.isMinimized) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    // Only consider peer messages; we shouldn't bump read-state on
    // our own outgoing messages (the sender already knows).
    if (last.senderId === selfId) return;
    if (last.id === lastMarkedReadIdRef.current) return;
    lastMarkedReadIdRef.current = last.id;
    void useMessagingStore.getState().markRead(w.threadId);
  }, [messages, w.threadId, w.isMinimized, selfId]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="absolute flex flex-col overflow-hidden rounded-2xl shadow-2xl"
      style={{
        width: WINDOW_WIDTH,
        // On small screens we drop the fixed height and let the body
        // shrink so the popup doesn't push the dock off-screen. The
        // window remains capped at WINDOW_HEIGHT on larger screens.
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100dvh - 40px)',
        height: w.isMinimized ? 56 : WINDOW_HEIGHT,
        right: rightOffset,
        bottom: BOTTOM_OFFSET,
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-light)',
        backdropFilter: 'blur(20px)',
        transition: 'height 0.18s ease',
      }}
    >
      {/* Header */}
      <div className="flex w-full items-center gap-2 border-b border-theme-light px-3 py-2">
        <button
          type="button"
          onClick={onToggleMinimize}
          aria-label={w.isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
          className="flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:bg-[var(--bg-surface-hover)] rounded-md py-0.5 pl-0.5 pr-1"
        >
          <div className="relative shrink-0">
            <SafeAvatar
              src={w.peer?.avatarUrl}
              alt={w.peer?.displayName ?? ''}
              seed={w.peer?.username ?? ''}
              size={28}
              rounded="full"
              fallbackType="initials"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0f] ${
                isPeerOnline ? 'bg-neon-emerald' : 'bg-slate-500'
              }`}
              title={isPeerOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
              aria-label={isPeerOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
            >
              {isPeerOnline && (
                <span className="absolute inset-0 animate-ping rounded-full bg-neon-emerald opacity-60" />
              )}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary">
              {w.peer?.displayName ?? w.peer?.username ?? ''}
            </p>
            <p className="truncate text-[10px] text-text-muted">
              {w.isTyping ? (
                <span className="text-neon-emerald">đang nhập…</span>
              ) : isPeerOnline ? (
                <span>Đang hoạt động</span>
              ) : (
                <span>Ngoại tuyến</span>
              )}
            </p>
          </div>
          {/* Unread badge — only show when the window is closed /
              minimised so we don't clash with the active thread view. */}
          {!w.isMinimized && peerUnread > 0 && (
            <span
              className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-neon-violet px-1.5 text-[10px] font-bold text-white"
              aria-label={`${peerUnread} tin nhắn chưa đọc`}
            >
              {peerUnread > 99 ? '99+' : peerUnread}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleMinimize(); }}
          aria-label={w.isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-text-primary"
          style={{ minHeight: 28, minWidth: 28 }}
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Đóng"
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-text-primary"
          style={{ minHeight: 28, minWidth: 28 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Body — hidden when minimized */}
      {!w.isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-2.5 text-sm"
            // data-testid makes E2E tests easy
            data-testid={`mini-chat-scroll-${w.peer.id}`}
          >
            {/* History states */}
            {!w.threadId || w.historyLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center text-[11px] italic text-text-muted">
                <LoaderDot />
                <span>Đang tải hội thoại…</span>
              </div>
            ) : messages.length === 0 ? (
              <>
                <p className="mb-3 text-center text-[11px] italic text-text-muted">
                  Chưa có tin nhắn nào — hãy bắt đầu cuộc trò chuyện.
                </p>
                {/* Quick-reply chips — only as a friendly empty-state
                    affordance now that real history is shown when it
                    exists. */}
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_REPLIES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onUpdateDraft(r)}
                      className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:bg-[var(--bg-surface-active)] hover:text-text-primary"
                      style={{ minHeight: 28 }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                {messages.map((m) => {
                  const isOwn = selfId != null && m.senderId === selfId;
                  const recalled = m.recalled === true;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`relative max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] leading-snug break-words shadow-sm ${
                          isOwn
                            ? 'bg-neon-violet text-white rounded-br-md'
                            : 'bg-[var(--bg-surface)] text-text-primary rounded-bl-md'
                        }`}
                        title={formatTime(m.createdAt)}
                      >
                        {recalled ? (
                          <span className="italic opacity-60">Tin nhắn đã thu hồi</span>
                        ) : (
                          <>
                            <span>{m.content}</span>
                            <span
                              className={`ml-1.5 inline-block align-baseline text-[9px] ${
                                isOwn ? 'text-white/70' : 'text-text-muted'
                              }`}
                            >
                              {formatTime(m.createdAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Typing indicator — shown when peer is typing */}
            {w.isTyping && (
              <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                <TypingDots />
                <span className="italic">
                  {w.peer?.displayName ?? w.peer?.username ?? ''} đang nhập…
                </span>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); void onSend(); }}
            className="flex items-center gap-2 border-t border-theme-light p-2"
          >
            <input
              ref={inputRefSetter}
              value={w.draft}
              onChange={(e) => onUpdateDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  // Form onSubmit already handles Enter; nothing extra
                  // needed here. We keep this handler as a placeholder
                  // for future shortcuts (e.g. Shift+Enter for newline).
                }
              }}
              placeholder={
                w.threadId
                  ? `Nhắn ${w.peer?.displayName ?? w.peer?.username ?? ''}…`
                  : 'Đang kết nối…'
              }
              // text-base (16px) prevents iOS Safari from auto-zooming
              // the input on focus, which would shift the dock off-screen.
              className="flex-1 rounded-full bg-[var(--bg-surface)] px-3 py-2 text-base text-text-primary placeholder-text-muted outline-none focus:bg-[var(--bg-surface-active)]"
              disabled={!w.threadId}
              autoComplete="off"
              spellCheck={false}
              // 44px minimum tap target for mobile
              style={{ minHeight: 40 }}
            />
            <button
              type="submit"
              disabled={!w.draft.trim() || !w.threadId}
              aria-label="Gửi"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-violet text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ minHeight: 40, minWidth: 40 }}
            >
              <Send size={14} />
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function MiniChatDock() {
  return (
    <MiniChatDockErrorBoundary>
      <MiniChatDockInner />
    </MiniChatDockErrorBoundary>
  );
}

/* ─── Tiny loader dot — used in the empty/history-loading state ─ */

function LoaderDot() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--border-light)] border-t-[var(--text-muted)]" />
  );
}

/* ─── Typing indicator (3 bouncing dots) ───────────────────── */

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neon-emerald"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}