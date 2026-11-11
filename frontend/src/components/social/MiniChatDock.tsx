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
import {
  ChevronDown, FileText, Image as ImageIcon, Loader2, Maximize2, Mic, Minus, Phone, PlusCircle, RotateCw, Send,
  Smile, Sticker, ThumbsUp, Trash2, UserRound, Video, WifiOff, X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import EmojiPickerPopover from '@/components/messaging/EmojiPickerPopover';
import GifPicker from '@/components/messaging/GifPicker';
import StickerPicker from '@/components/messaging/StickerPicker';
import { dongHo, GIAY_TOI_DA, useGhiAm } from '@/components/messaging/useGhiAm';
import { messagingApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import SafeAvatar from '@/components/ui/SafeAvatar';
import { connectSocket, emitTyping } from '@/lib/socket';

// Màn hình gọi (WebRTC) — chỉ tải khi đã có kết nối realtime.
const CuocGoiOverlay = dynamic(() => import('@/components/messaging/CuocGoiOverlay'), { ssr: false });
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
  /** Có sẵn hội thoại (vd. hội thoại HỖ TRỢ loại ADMIN từ bảng "Đoạn chat") ⇒ mở thẳng nó,
   *  không tạo/tìm hội thoại 1-1 bằng startUserThread. */
  threadId?: number;
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
  /** Mở hội thoại thất bại (mất mạng…) ⇒ hiện "Thử lại" thay vì kẹt "Đang kết nối…" mãi. */
  loadError?: boolean;
}

// Cỡ khung theo Messenger trên Facebook (≈ 338 × 455) — người dùng thấy 320×380 quá nhỏ (11/11/2026).
const WINDOW_WIDTH = 338;
const WINDOW_HEIGHT = 455;
/** Cột bong bóng (khung đã thu nhỏ) nằm ngay TRÊN nút robot AI (fixed bottom-6 right-6, ~64px). */
const BUBBLE_RIGHT = 38;
const BUBBLE_BOTTOM = 112;
const BUBBLE_SIZE = 52;
const WINDOW_GAP = 12;
/** Khung mở xếp bên TRÁI cột bong bóng, áp sát mép dưới như Facebook. */
const RIGHT_OFFSET = 116;
const BOTTOM_OFFSET = 0; // áp sát mép dưới như Facebook
const MAX_VISIBLE = 3; // trần cứng; màn hẹp hơn thì tính theo bề ngang (soKhungVua)
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
  const router = useRouter();

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
  const resolveThread = useCallback(async (peerId: number, knownThreadId?: number) => {
    if (!isAuthenticated) return;
    try {
      const threadId = knownThreadId ?? await useMessagingStore.getState().startUserThread(peerId);
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
                loadError: false,
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
          w.peer.id === peerId ? { ...w, historyLoading: false, loadError: !w.threadId } : w,
        ),
      );
    }
  }, [isAuthenticated]);

  // Mạng vừa có lại ⇒ tự mở lại những khung còn chưa kết nối được (thay vì kẹt "Đang kết nối…").
  const windowsRef = useRef<ChatWindowState[]>([]);
  windowsRef.current = windows;
  useEffect(() => {
    const onOnline = () => {
      for (const w of windowsRef.current) if (!w.threadId) void resolveThread(w.peer.id, w.peer.threadId);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [resolveThread]);

  // Gọi thoại/video từ khung nhỏ: một màn hình gọi dùng chung cho cả dock.
  const realtimeOn = useMessagingStore((s) => s.isConnected);
  const [cuocGoi, setCuocGoi] = useState<{ threadId: number; peer: MiniChatPeer; goiDi: number; goiVideo: number } | null>(null);

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
          // Mở lại một khung đã có ⇒ đưa lên cuối (khung mới nhất, sát bong bóng) và bung ra.
          return [
            ...prev.filter((w) => w.peer.id !== detail.id),
            { ...existing, isOpen: true, isMinimized: false },
          ];
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
      void resolveThread(detail.id, detail.threadId);
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
    setWindows((prev) => {
      const w = prev.find((x) => x.peer.id === id);
      if (!w) return prev;
      // Bung một bong bóng ⇒ đưa khung đó lên cuối (vị trí mới nhất, sát mép phải).
      if (w.isMinimized) return [...prev.filter((x) => x.peer.id !== id), { ...w, isMinimized: false }];
      return prev.map((x) => (x.peer.id === id ? { ...x, isMinimized: true } : x));
    });
  }, []);

  // Số khung mở vừa bề ngang màn hình (còn lại thu thành bong bóng, như Facebook).
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const soKhungVua = Math.max(1, Math.min(MAX_VISIBLE, Math.floor((vw - RIGHT_OFFSET - 16) / (WINDOW_WIDTH + WINDOW_GAP))));

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
    const expanded = windows.filter((w) => w.isOpen && !w.isMinimized);
    return expanded.slice(-soKhungVua);
  }, [windows, soKhungVua]);
  /** Bong bóng: khung đã thu nhỏ + khung mở bị đẩy ra vì hết chỗ. Mới nhất ở dưới cùng. */
  const bubbles = useMemo(() => {
    const shown = new Set(visibleWindows.map((w) => w.peer.id));
    return windows.filter((w) => w.isOpen && !shown.has(w.peer.id)).slice(-6);
  }, [windows, visibleWindows]);

  // Cleanup timers on unmount.
  useEffect(() => {
    return () => {
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  }, []);

  const overlay = realtimeOn ? (
    <CuocGoiOverlay
      threadId={cuocGoi?.threadId}
      peerId={cuocGoi?.peer.id}
      peerName={cuocGoi?.peer.displayName}
      peerAvatar={cuocGoi?.peer.avatarUrl ?? null}
      goiDi={cuocGoi?.goiDi ?? 0}
      goiVideo={cuocGoi?.goiVideo ?? 0}
    />
  ) : null;

  if (windows.length === 0) return overlay;

  return (
    <>
    {overlay}
    <div
      className="pointer-events-none fixed inset-0 z-[120]"
      aria-live="polite"
    >
      {/* Cột bong bóng (như Messenger trên Facebook): bấm ⇒ bung khung, rê chuột ⇒ hiện nút đóng */}
      <div className="pointer-events-auto absolute flex flex-col-reverse items-center gap-2.5" style={{ right: BUBBLE_RIGHT, bottom: BUBBLE_BOTTOM }}>
        <AnimatePresence>
          {bubbles.map((w) => {
            const unread = unreadByPeerId.get(w.peer.id) ?? 0;
            const online = presence.byUserId[w.peer.id]?.online ?? false;
            const ten = w.peer.displayName || w.peer.username;
            return (
              <motion.div
                key={`b-${w.peer.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="group relative"
                style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
              >
                <button
                  type="button"
                  onClick={() => toggleMinimize(w.peer.id)}
                  aria-label={`Mở đoạn chat với ${ten}`}
                  title={ten}
                  className="block h-full w-full overflow-hidden rounded-full bg-[var(--bg-card)] shadow-[0_4px_12px_rgba(0,0,0,0.25)] ring-2 ring-[var(--bg-card)] transition-transform hover:scale-105"
                >
                  <SafeAvatar src={w.peer.avatarUrl} alt={ten} seed={w.peer.username} size={BUBBLE_SIZE} rounded="full" fallbackType="initials" />
                </button>
                {online && <span className="pointer-events-none absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-[#31a24c] ring-2 ring-[var(--bg-card)]" />}
                {unread > 0 && (
                  <span className="pointer-events-none absolute -left-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e41e3f] px-1 text-[11px] font-bold text-white ring-2 ring-[var(--bg-card)]">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => closeWindow(w.peer.id)}
                  aria-label={`Đóng đoạn chat với ${ten}`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-text-secondary opacity-0 shadow transition-opacity hover:text-text-primary focus:opacity-100 group-hover:opacity-100"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
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
                peerLastSeen={peerPresence.lastSeen}
                onRetry={() => {
                  setWindows((prev) => prev.map((x) => (x.peer.id === w.peer.id ? { ...x, loadError: false } : x)));
                  void resolveThread(w.peer.id, w.peer.threadId);
                }}
                onOpenFull={() => {
                  router.push(w.threadId ? `/messages?thread=${w.threadId}` : `/messages?peer=${w.peer.id}`);
                  window.setTimeout(() => closeWindow(w.peer.id), 0);
                }}
                onCall={(video) => {
                  if (!w.threadId) return;
                  if (!realtimeOn) { toast.error('Chưa có kết nối realtime — chưa gọi được. Thử lại sau giây lát.'); return; }
                  setCuocGoi((c) => ({
                    threadId: w.threadId!,
                    peer: w.peer,
                    goiDi: (c?.goiDi ?? 0) + (video ? 0 : 1),
                    goiVideo: (c?.goiVideo ?? 0) + (video ? 1 : 0),
                  }));
                }}
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
    </>
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
  peerLastSeen: number;
  onCall: (video: boolean) => void;
  onRetry: () => void;
  onOpenFull: () => void;
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
  peerLastSeen,
  onCall,
  onRetry,
  onOpenFull,
}: ChatWindowProps) {
  const { user } = useAuthStore();
  const router = useRouter();
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

  const peerName = w.peer?.displayName ?? w.peer?.username ?? '';
  /** Hội thoại hỗ trợ chưa có admin nhận (không có người cụ thể) ⇒ id âm, không gọi/không có trang cá nhân. */
  const khongCoNguoi = w.peer.id < 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  const trangThai = w.isTyping
    ? 'đang nhập…'
    : isPeerOnline
      ? 'Đang hoạt động'
      : peerLastSeen > 0
        ? `Hoạt động ${thoiGianTruoc(peerLastSeen)}`
        : '';

  const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-tone-violet transition-colors hover:bg-[var(--bg-surface-hover)]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="absolute flex flex-col overflow-hidden rounded-t-xl shadow-[0_12px_28px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.12)]"
      style={{
        width: WINDOW_WIDTH,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100dvh - 40px)',
        height: w.isMinimized ? 56 : WINDOW_HEIGHT,
        right: rightOffset,
        bottom: BOTTOM_OFFSET,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderBottom: 'none',
        transition: 'height 0.18s ease',
      }}
    >
      {/* ── Đầu khung (như Messenger): ảnh + tên ⌄ · gọi thoại · gọi video · thu nhỏ · đóng ── */}
      <div className="flex w-full items-center gap-0.5 border-b border-[var(--border-color)] px-1.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="relative min-w-0 flex-1" ref={menuRef}>
          <button
            type="button"
            onClick={() => (w.isMinimized ? onToggleMinimize() : setMenuOpen((v) => !v))}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex w-full min-w-0 items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
          >
            <div className="relative shrink-0">
              <SafeAvatar src={w.peer?.avatarUrl} alt={peerName} seed={w.peer?.username ?? ''} size={32} rounded="full" fallbackType="initials" />
              {/* Chỉ chấm XANH khi đang hoạt động; ngoại tuyến thì không vẽ gì (như Messenger) */}
              {isPeerOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#31a24c] ring-2 ring-[var(--bg-card)]" title="Đang hoạt động" />
              )}
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-0.5 text-[15px] font-semibold leading-tight text-text-primary">
                <span className="truncate">{peerName}</span>
                <ChevronDown size={16} className="shrink-0 text-tone-violet" />
              </p>
              {trangThai && (
                <p className={`truncate text-[11px] leading-tight ${w.isTyping || isPeerOnline ? 'text-[#31a24c]' : 'text-text-muted'}`}>{trangThai}</p>
              )}
            </div>
            {w.isMinimized && peerUnread > 0 && (
              <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e41e3f] px-1.5 text-[10px] font-bold text-white" aria-label={`${peerUnread} tin nhắn chưa đọc`}>
                {peerUnread > 99 ? '99+' : peerUnread}
              </span>
            )}
          </button>
          {menuOpen && (
            <div role="menu" className="absolute left-0 top-full z-10 mt-1 w-56 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-1 shadow-xl">
              <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onOpenFull(); }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium text-text-primary hover:bg-[var(--bg-surface-hover)]">
                <Maximize2 size={16} className="text-text-secondary" />Mở trong Messenger
              </button>
              {!khongCoNguoi && <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); router.push(`/profile/${w.peer.id}/v2`); }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium text-text-primary hover:bg-[var(--bg-surface-hover)]">
                <UserRound size={16} className="text-text-secondary" />Xem trang cá nhân
              </button>}
            </div>
          )}
        </div>
        <button type="button" onClick={() => onCall(false)} disabled={!w.threadId || khongCoNguoi} aria-label="Gọi thoại" title="Gọi thoại" className={`${iconBtn} disabled:opacity-40`}>
          <Phone size={17} className="fill-current" />
        </button>
        <button type="button" onClick={() => onCall(true)} disabled={!w.threadId || khongCoNguoi} aria-label="Gọi video" title="Gọi video" className={`${iconBtn} disabled:opacity-40`}>
          <Video size={19} className="fill-current" />
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onToggleMinimize(); }} aria-label={w.isMinimized ? 'Mở rộng' : 'Thu nhỏ'} title={w.isMinimized ? 'Mở rộng' : 'Thu nhỏ'} className={iconBtn}>
          <Minus size={18} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Đóng" title="Đóng" className={iconBtn}>
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {!w.isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2.5 py-2.5 text-sm" data-testid={`mini-chat-scroll-${w.peer.id}`}>
            {w.loadError ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <WifiOff size={26} className="text-text-muted" />
                <p className="text-[13px] text-text-secondary">Chưa kết nối được tới hội thoại. Kiểm tra mạng rồi thử lại.</p>
                <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-color)] px-3.5 py-1.5 text-[13px] font-semibold text-white hover:opacity-90">
                  <RotateCw size={14} />Thử lại
                </button>
              </div>
            ) : !w.threadId || w.historyLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center text-[12px] text-text-muted">
                <LoaderDot />
                <span>Đang tải hội thoại…</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <SafeAvatar src={w.peer?.avatarUrl} alt={peerName} seed={w.peer?.username ?? ''} size={60} rounded="full" fallbackType="initials" />
                <p className="text-[15px] font-semibold text-text-primary">{peerName}</p>
                <p className="mb-2 text-[12px] text-text-muted">Hãy gửi lời chào để bắt đầu trò chuyện</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {SUGGESTED_REPLIES.map((r) => (
                    <button key={r} type="button" onClick={() => onUpdateDraft(r)} className="rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,var(--bg-card))] px-2.5 py-1 text-[12px] text-text-primary transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_14%,var(--bg-card))]">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {messages.map((m, i) => {
                  const isOwn = selfId != null && m.senderId === selfId;
                  const next = messages[i + 1];
                  const lastOfGroup = !next || next.senderId !== m.senderId;
                  return (
                    <div key={m.id} className={`flex items-end gap-1.5 ${isOwn ? 'justify-end' : 'justify-start'} ${lastOfGroup ? 'mb-1.5' : ''}`}>
                      {!isOwn && (
                        <span className="w-7 shrink-0">
                          {lastOfGroup && <SafeAvatar src={w.peer?.avatarUrl} alt={peerName} seed={w.peer?.username ?? ''} size={28} rounded="full" fallbackType="initials" />}
                        </span>
                      )}
                      <MiniBubble m={m} isOwn={isOwn} />
                    </div>
                  );
                })}
              </div>
            )}

            {w.isTyping && (
              <div className="mt-1 flex items-center gap-1.5 pl-9">
                <span className="rounded-2xl bg-[color-mix(in_srgb,var(--text-primary)_8%,var(--bg-card))] px-3 py-2"><TypingDots /></span>
              </div>
            )}
          </div>

          <MiniComposer
            threadId={w.threadId}
            draft={w.draft}
            inputRefSetter={inputRefSetter}
            onUpdateDraft={onUpdateDraft}
            onSend={onSend}
          />
        </>
      )}
    </motion.div>
  );
}

/* ─── Bong bóng tin nhắn trong khung nhỏ: chữ, GIF/nhãn dán, ảnh, tin thoại, tệp ─── */
/** Ảnh/GIF tải xong làm khung cao lên ⇒ kéo về cuối để tin mới nhất không bị cắt nửa. */
function cuonCuoi(e: React.SyntheticEvent<HTMLElement>) {
  const sc = e.currentTarget.closest('[data-testid^="mini-chat-scroll"]');
  if (sc) sc.scrollTop = sc.scrollHeight;
}

function MiniBubble({ m, isOwn }: { m: MessagingMessage; isOwn: boolean }) {
  const time = formatTime(m.createdAt);
  if (m.recalled || m.deleted) {
    return <div className="rounded-2xl border border-[var(--border-color)] px-3 py-1.5 text-[13px] italic text-text-muted" title={time}>Tin nhắn đã thu hồi</div>;
  }
  const media = m.mediaUrl && (m.mediaKind === 'gif' || m.mediaKind === 'sticker' || m.mediaKind === 'image');
  const atts = m.attachments ?? [];
  const chu = (m.content ?? '').trim();
  // Một tin chỉ có 👍/emoji ngắn ⇒ vẽ to, không bong bóng (như Messenger).
  const chiEmoji = chu && !media && atts.length === 0 && /^(\p{Extended_Pictographic}|\p{Emoji_Component}|\s){1,8}$/u.test(chu) && !/^\d+$/.test(chu);
  return (
    <div className={`flex max-w-[78%] flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`} title={time}>
      {media && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.mediaUrl!} alt={m.mediaKind === 'sticker' ? 'Nhãn dán' : 'GIF'} loading="lazy" onLoad={cuonCuoi} className={m.mediaKind === 'sticker' ? 'h-24 w-24 object-contain' : 'max-h-48 rounded-2xl object-cover'} />
      )}
      {atts.map((a) => (
        a.mimeType?.startsWith('image/') ? (
          <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.thumbnailUrl || a.url} alt={a.fileName} loading="lazy" onLoad={cuonCuoi} className="max-h-48 rounded-2xl object-cover" />
          </a>
        ) : a.mimeType?.startsWith('audio/') ? (
          <audio key={a.id} src={a.url} controls preload="metadata" className="h-9 w-[210px] max-w-full" />
        ) : a.mimeType?.startsWith('video/') ? (
          <video key={a.id} src={a.url} controls preload="metadata" className="max-h-48 rounded-2xl" />
        ) : (
          <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className={`flex max-w-full items-center gap-2 rounded-2xl px-3 py-2 text-[13px] ${isOwn ? 'bg-[var(--accent-color)] text-white' : 'bg-[color-mix(in_srgb,var(--text-primary)_8%,var(--bg-card))] text-text-primary'}`}>
            <FileText size={16} className="shrink-0" /><span className="truncate">{a.fileName}</span>
          </a>
        )
      ))}
      {chu && (chiEmoji ? (
        <span className="text-[34px] leading-none">{chu}</span>
      ) : (
        <div className={`whitespace-pre-wrap break-words rounded-[18px] px-3 py-[7px] text-[15px] leading-[1.35] ${isOwn ? 'bg-[var(--accent-color)] text-white' : 'bg-[color-mix(in_srgb,var(--text-primary)_8%,var(--bg-card))] text-text-primary'}`}>
          {chu}
        </div>
      ))}
    </div>
  );
}

/* ─── Thanh soạn tin kiểu Messenger: 🎤 · ảnh · nhãn dán · GIF · [Aa 😊] · 👍/gửi ─── */
function MiniComposer({
  threadId, draft, inputRefSetter, onUpdateDraft, onSend,
}: {
  threadId: number | null;
  draft: string;
  inputRefSetter: (el: HTMLInputElement | null) => void;
  onUpdateDraft: (value: string) => void;
  onSend: () => Promise<void>;
}) {
  const [picker, setPicker] = useState<'emoji' | 'gif' | 'sticker' | null>(null);
  const [busy, setBusy] = useState(false);
  const [moRong, setMoRong] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLButtonElement | null>(null);
  const gifRef = useRef<HTMLButtonElement | null>(null);
  const stickerRef = useRef<HTMLButtonElement | null>(null);
  const ghi = useGhiAm();
  const ready = !!threadId && !busy;
  const coChu = draft.trim().length > 0;
  // Đang gõ ⇒ thu 4 nút lại thành một nút "+" (như Messenger) để ô chữ rộng ra.
  const hienNut = !coChu || moRong;
  useEffect(() => { if (!coChu) setMoRong(false); }, [coChu]);

  const guiNhanh = async (fn: () => Promise<void>, loi: string) => {
    if (!threadId) return;
    setBusy(true);
    try { await fn(); } catch (e: any) { toast.error(e?.userFriendlyMessage ?? e?.message ?? loi); } finally { setBusy(false); }
  };

  const guiTep = (files: FileList | null) => {
    const list = Array.from(files ?? []).slice(0, 10);
    if (!list.length || !threadId) return;
    void guiNhanh(async () => {
      const ids: number[] = [];
      for (const f of list) {
        if (f.size > 25 * 1024 * 1024) { toast.error(`${f.name} lớn hơn 25MB`); continue; }
        const res = await messagingApi.uploadAttachment(f);
        if (res.data.data?.fileId) ids.push(res.data.data.fileId);
      }
      if (ids.length) await useMessagingStore.getState().sendMessage(threadId, '', ids);
    }, 'Gửi tệp thất bại');
  };

  const guiMedia = (url: string, kind: 'gif' | 'sticker') => {
    setPicker(null);
    void guiNhanh(() => useMessagingStore.getState().sendMessage(threadId!, '', undefined, null, undefined, { url, kind }), 'Gửi thất bại');
  };

  const guiThoai = () => void guiNhanh(async () => {
    const tep = await ghi.ketThuc();
    if (!tep) return;
    const res = await messagingApi.uploadAttachment(tep);
    const id = res.data.data?.fileId;
    if (!id) throw new Error('Máy chủ không trả về mã tệp.');
    await useMessagingStore.getState().sendMessage(threadId!, '', [id]);
  }, 'Gửi tin thoại thất bại');

  const chenEmoji = (e: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? draft.length;
    const end = el?.selectionEnd ?? draft.length;
    onUpdateDraft(draft.slice(0, start) + e + draft.slice(end));
    requestAnimationFrame(() => { el?.focus(); const p = start + e.length; el?.setSelectionRange(p, p); });
  };

  const iconBtn = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-tone-violet transition-colors hover:bg-[var(--bg-surface-hover)] disabled:opacity-40';

  // Đang ghi âm: thay cả thanh bằng thanh ghi (huỷ · đồng hồ · gửi).
  if (ghi.trangThai !== 'roi') {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <button type="button" onClick={() => ghi.huy()} aria-label="Huỷ ghi âm" title="Huỷ" className={iconBtn}><Trash2 size={18} /></button>
        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-[var(--accent-color)] px-3 text-white">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
          <span className="text-[13px] font-semibold tabular-nums">{dongHo(ghi.giay)}</span>
          <span className="ml-auto text-[11px] opacity-80">tối đa {dongHo(GIAY_TOI_DA)}</span>
        </div>
        <button type="button" onClick={guiThoai} disabled={ghi.trangThai === 'dang-xu-ly'} aria-label="Gửi tin thoại" title="Gửi" className={iconBtn}>
          {ghi.trangThai === 'dang-xu-ly' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="fill-current" />}
        </button>
      </div>
    );
  }

  return (
    <div className="relative px-1.5 py-2">
      <EmojiPickerPopover open={picker === 'emoji'} anchorRef={emojiRef} onClose={() => setPicker(null)} onPick={chenEmoji} />
      <GifPicker open={picker === 'gif'} anchorRef={gifRef} onClose={() => setPicker(null)} onPick={(u) => guiMedia(u, 'gif')} />
      <StickerPicker open={picker === 'sticker'} anchorRef={stickerRef} onClose={() => setPicker(null)} onPick={(u) => guiMedia(u, 'sticker')} />
      <input ref={fileRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx,.zip,.txt" multiple hidden onChange={(e) => { guiTep(e.target.files); e.target.value = ''; }} />
      {ghi.loi && <p className="px-2 pb-1 text-[11px] text-red-500">{ghi.loi}</p>}
      <form
        onSubmit={(e) => { e.preventDefault(); if (coChu) void onSend(); }}
        className="flex items-center gap-0.5"
      >
        {hienNut ? (
          <>
            <button type="button" onClick={() => void ghi.batDau()} disabled={!ready} aria-label="Gửi tin thoại" title="Ghi âm tin thoại" className={iconBtn}><Mic size={19} /></button>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={!ready} aria-label="Đính kèm ảnh hoặc tệp" title="Đính kèm ảnh/tệp" className={iconBtn}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={19} />}
            </button>
            <button ref={stickerRef} type="button" onClick={() => setPicker((p) => (p === 'sticker' ? null : 'sticker'))} disabled={!ready} aria-label="Chọn nhãn dán" title="Nhãn dán" className={iconBtn}><Sticker size={19} /></button>
            <button ref={gifRef} type="button" onClick={() => setPicker((p) => (p === 'gif' ? null : 'gif'))} disabled={!ready} aria-label="Chọn GIF" title="GIF" className={iconBtn}>
              <span className="rounded-[5px] bg-current px-[3px] text-[9px] font-black leading-[14px]"><span className="text-[var(--bg-card)]">GIF</span></span>
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setMoRong(true)} aria-label="Hiện thêm tuỳ chọn" title="Thêm" className={iconBtn}><PlusCircle size={20} /></button>
        )}
        <label className="ml-0.5 flex h-9 min-w-0 flex-1 items-center rounded-full bg-[color-mix(in_srgb,var(--text-primary)_7%,var(--bg-card))] pl-3 pr-1">
          <input
            ref={(el) => { inputRef.current = el; inputRefSetter(el); }}
            value={draft}
            onChange={(e) => onUpdateDraft(e.target.value)}
            onFocus={() => coChu && setMoRong(false)}
            onKeyDown={(e) => {
              // Bộ gõ Nhật/Trung/Hàn đang dựng chữ thì Enter là phím CHỐT chữ — đừng để form gửi tin dở.
              if (e.key === 'Enter' && e.nativeEvent.isComposing) { e.preventDefault(); e.stopPropagation(); }
            }}
            placeholder={threadId ? 'Aa' : 'Đang kết nối…'}
            disabled={!threadId}
            aria-label="Nhập tin nhắn"
            autoComplete="off"
            spellCheck={false}
            // 16px: Safari iOS không tự phóng to khi bấm vào ô.
            className="min-w-0 flex-1 bg-transparent text-base text-text-primary placeholder:text-text-muted outline-none sm:text-[15px]"
          />
          <button ref={emojiRef} type="button" onClick={() => setPicker((p) => (p === 'emoji' ? null : 'emoji'))} disabled={!threadId} aria-label="Chọn biểu tượng cảm xúc" title="Biểu tượng cảm xúc" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-tone-violet hover:bg-[var(--bg-surface-hover)] disabled:opacity-40">
            <Smile size={19} />
          </button>
        </label>
        {coChu ? (
          <button type="submit" disabled={!threadId} aria-label="Gửi" title="Gửi (Enter)" className={iconBtn}><Send size={19} className="fill-current" /></button>
        ) : (
          <button type="button" onClick={() => void guiNhanh(() => useMessagingStore.getState().sendMessage(threadId!, '👍'), 'Gửi thất bại')} disabled={!ready} aria-label="Gửi lượt thích" title="Thích" className={iconBtn}>
            <ThumbsUp size={20} className="fill-current" />
          </button>
        )}
      </form>
    </div>
  );
}

/** "5 phút trước" từ mốc ms — cho dòng "Hoạt động … trước" ở đầu khung. */
function thoiGianTruoc(ms: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return 'vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
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