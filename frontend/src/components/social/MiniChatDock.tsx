'use client';

import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
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
 * the SocialSidebar friend row. Multiple windows can be open at
 * once. The right edge stacks them newest-to-left.
 *
 * Socket wiring:
 *   - On open: calls messagingStore.startUserThread(peerId) to get/create
 *     the DM thread, then joins its socket room.
 *   - While typing: debounced emitTyping(threadId, true) → false after
 *     the user stops for 2 s.
 *   - Receiving: listens to `thread:typing` events that match the open
 *     threadId and shows the animated three-dot indicator.
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
  unread: number;
  /** Remote peer is typing (driven by socket event). */
  isTyping: boolean;
  draft: string;
  /** DM thread id once resolved (null while loading). */
  threadId: number | null;
}

const WINDOW_WIDTH = 300;
const WINDOW_HEIGHT = 360;
const WINDOW_GAP = 12;
const RIGHT_OFFSET = 20;
const BOTTOM_OFFSET = 20;
const MAX_VISIBLE = 3;
/** Stop-typing signal fires this many ms after the last keystroke. */
const TYPING_DEBOUNCE_MS = 2000;

const SUGGESTED_REPLIES = [
  'Chào bạn! 👋',
  'Bạn có khỏe không?',
  'Mình rảnh nè, nói chuyện sau nhé!',
  'Haha, hay quá!',
];

function MiniChatDockInner() {
  const [windows, setWindows] = useState<ChatWindowState[]>([]);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  // Per-window typing debounce timers.
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const { isAuthenticated } = useAuthStore();

  // ─── Resolve thread and join socket room ────────────────────
  const resolveThread = useCallback(async (peerId: number) => {
    if (!isAuthenticated) return;
    try {
      const threadId = await useMessagingStore.getState().startUserThread(peerId);
      setWindows((prev) =>
        prev.map((w) => (w.peer.id === peerId ? { ...w, threadId } : w)),
      );
      // Ensure the socket is connected and has joined the thread room.
      const socket = await connectSocket();
      if (socket) socket.emit('thread:join', threadId);
    } catch {
      // Non-fatal: chat still renders, typing won't propagate.
    }
  }, [isAuthenticated]);

  // ─── Global socket typing listener ──────────────────────────
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
              // Only update from the remote peer (not self).
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
              ? { ...w, isOpen: true, isMinimized: false, unread: 0 }
              : w,
          );
        }
        return [
          ...prev,
          {
            peer: detail,
            isOpen: true,
            isMinimized: false,
            unread: 0,
            isTyping: false,
            draft: '',
            threadId: null,
          },
        ];
      });
      // Kick off async thread resolution.
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
    if (last.isOpen && !last.isMinimized) {
      window.setTimeout(() => {
        inputRefs.current[last.peer.id]?.focus();
      }, 250);
    }
  }, [windows.length]);

  const closeWindow = useCallback((peerId: number) => {
    // Clear any pending typing timer.
    if (typingTimers.current[peerId]) {
      clearTimeout(typingTimers.current[peerId]);
      delete typingTimers.current[peerId];
    }
    setWindows((prev) => {
      const win = prev.find((w) => w.peer.id === peerId);
      // Emit typing=false before closing so the peer's indicator clears.
      if (win?.threadId) emitTyping(win.threadId, false);
      return prev.filter((w) => w.peer.id !== peerId);
    });
  }, []);

  const toggleMinimize = useCallback((id: number) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.peer.id === id
          ? { ...w, isMinimized: !w.isMinimized, unread: 0 }
          : w,
      ),
    );
  }, []);

  const updateDraft = useCallback(
    (peerId: number, value: string, threadId: number | null) => {
      setWindows((prev) =>
        prev.map((w) => (w.peer.id === peerId ? { ...w, draft: value } : w)),
      );

      if (!threadId) return;

      // Emit typing=true immediately on first keystroke.
      emitTyping(threadId, true);

      // Debounce: emit typing=false after user stops for TYPING_DEBOUNCE_MS.
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
            return (
              <motion.div
                key={w.peer.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="absolute flex flex-col overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  width: WINDOW_WIDTH,
                  height: w.isMinimized ? 56 : WINDOW_HEIGHT,
                  right: rightOffset,
                  bottom: BOTTOM_OFFSET,
                  background: 'rgba(15,15,25,0.97)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  transition: 'height 0.18s ease',
                }}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggleMinimize(w.peer.id)}
                  className="flex w-full items-center gap-2 border-b border-white/5 px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
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
                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0f] bg-neon-emerald"
                      title="Đang hoạt động"
                    >
                      <span className="absolute inset-0 animate-ping rounded-full bg-neon-emerald opacity-60" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {w.peer?.displayName ?? w.peer?.username ?? ''}
                    </p>
                    <p className="truncate text-[10px] text-white/50">
                      {w.isTyping ? (
                        <span className="text-neon-emerald">đang nhập…</span>
                      ) : (
                        <span>Đang hoạt động</span>
                      )}
                    </p>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMinimize(w.peer.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMinimize(w.peer.id);
                      }
                    }}
                    className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Thu nhỏ"
                    title="Thu nhỏ"
                  >
                    <Minus size={14} />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeWindow(w.peer.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        closeWindow(w.peer.id);
                      }
                    }}
                    className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Đóng"
                    title="Đóng"
                  >
                    <X size={14} />
                  </span>
                </button>

                {/* Body — hidden when minimized */}
                {!w.isMinimized && (
                  <>
                    <div className="flex-1 overflow-y-auto p-3 text-sm">
                      {w.threadId ? (
                        <p className="text-center text-[11px] italic text-white/40">
                          Tin nhắn được lưu trong <a href="/messages" className="underline text-neon-violet/60 hover:text-neon-violet transition-colors">hộp thư</a> của bạn.
                        </p>
                      ) : (
                        <p className="text-center text-[11px] italic text-white/40">
                          Đang kết nối…
                        </p>
                      )}

                      {/* Quick-reply chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {SUGGESTED_REPLIES.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() =>
                              updateDraft(w.peer.id, r, w.threadId)
                            }
                            className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      {/* Typing indicator — shown when peer is typing */}
                      {w.isTyping && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                          <TypingDots />
                          <span className="italic">
                            {w.peer?.displayName ?? w.peer?.username ?? ''} đang nhập…
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Composer */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const draft = w.draft.trim();
                        if (!draft || !w.threadId) return;

                        // Clear draft + stop typing indicator immediately.
                        updateDraft(w.peer.id, '', w.threadId);
                        if (typingTimers.current[w.peer.id]) {
                          clearTimeout(typingTimers.current[w.peer.id]);
                          delete typingTimers.current[w.peer.id];
                        }
                        emitTyping(w.threadId, false);

                        // Send via messaging store so the /messages page
                        // picks up the message on next visit.
                        try {
                          await useMessagingStore
                            .getState()
                            .sendMessage(w.threadId, draft);
                        } catch {
                          // Revert draft on failure so the user doesn't
                          // lose their message.
                          setWindows((prev) =>
                            prev.map((win) =>
                              win.peer.id === w.peer.id
                                ? { ...win, draft }
                                : win,
                            ),
                          );
                        }
                      }}
                      className="flex items-center gap-2 border-t border-white/5 p-2"
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[w.peer.id] = el;
                        }}
                        value={w.draft}
                        onChange={(e) =>
                          updateDraft(w.peer.id, e.target.value, w.threadId)
                        }
                        placeholder={`Nhắn ${w.peer?.displayName ?? w.peer?.username ?? ''}…`}
                        className="flex-1 rounded-full bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:bg-white/10"
                        disabled={!w.threadId}
                      />
                      <button
                        type="submit"
                        disabled={!w.draft.trim() || !w.threadId}
                        aria-label="Gửi"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-violet text-white transition-opacity disabled:opacity-40"
                      >
                        <Send size={13} />
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MiniChatDock() {
  return (
    <MiniChatDockErrorBoundary>
      <MiniChatDockInner />
    </MiniChatDockErrorBoundary>
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
