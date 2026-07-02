'use client';

/**
 * ============================================================
 * Direct Messaging Store
 * ============================================================
 *
 * Owns the lifecycle of the chat widget, the thread list,
 * and the live message stream for the active thread. The
 * Socket.IO connection is mounted as a module-level singleton
 * in `lib/socket.ts`; this store just listens to its events
 * and updates state.
 *
 * The store deliberately does NOT persist message content to
 * localStorage — chats are end-to-end-fresh and shouldn't leak
 * across browsers, plus the volume would blow the quota.
 */

import { create } from 'zustand';
import {
  messagingApi,
  type MessagingMessage,
  type MessagingThread,
  type MessagingBlockedUser,
} from '@/lib/api';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinThread,
  leaveThread,
  emitTyping,
} from '@/lib/socket';
import { useAuthStore } from './authStore';

interface TypingState {
  // userId -> until-timestamp. We evict stale entries on read.
  byThread: Record<number, Record<number, number>>;
}

interface PresenceState {
  // userId -> { online: boolean; lastSeen: number (epoch ms) }
  // Populated by the local socket's connect/disconnect events for
  // the current user, plus heartbeat broadcasts for other users.
  byUserId: Record<number, { online: boolean; lastSeen: number }>;
}

interface MessagingState {
  threads: MessagingThread[];
  threadsLoaded: boolean;
  threadsLoading: boolean;
  /** The viewer's soft-deleted threads, shown in the "Đã xoá"
   *  recovery tab. Loaded lazily the first time that tab is opened
   *  (kept separate from `threads` so the normal inbox payload stays
   *  lean). Restoring a thread moves it back into `threads`. */
  deletedThreads: MessagingThread[];
  deletedThreadsLoaded: boolean;
  deletedThreadsLoading: boolean;
  /** Which inbox `loadThreads` fetches: the viewer's personal DMs
   *  (default) or, for /admin/messages, the support-agent queue.
   *  Stored so reloads/retries keep the same scope. */
  threadScope: 'personal' | 'support';
  /** "Active" = visible in the default inbox. Archived threads are kept
   *  in this list (so we can show them under the "Archived" tab) but
   *  excluded from the default render. */
  showArchived: boolean;
  currentThreadId: number | null;
  currentThread: MessagingThread | null;
  messagesByThread: Record<number, MessagingMessage[]>;
  messagesLoading: boolean;
  /** Set when the latest `listMessages` call for the open thread
   *  failed. The UI surfaces a "Try again" button when this is
   *  non-null. Cleared on a successful retry or when the user
   *  opens a different thread. */
  messageLoadError: string | null;
  hasMoreByThread: Record<number, boolean>;
  unreadTotal: number;
  isWidgetOpen: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  lastConnectAttempt: number;
  initError: string | null;
  typing: TypingState;
  presence: PresenceState;

  // Lifecycle
  init: (scope?: 'personal' | 'support') => Promise<void>;
  shutdown: () => void;
  retryConnection: () => Promise<void>;
  setWidgetOpen: (open: boolean) => void;
  setShowArchived: (show: boolean) => void;

  // Threads
  loadThreads: () => Promise<void>;
  loadDeletedThreads: () => Promise<void>;
  restoreChat: (threadId: number) => Promise<void>;
  refreshThreadSummary: (threadId: number) => Promise<void>;
  loadOnlineUsers: () => Promise<void>;
  refreshUnread: () => Promise<void>;

  // Open / switch thread
  openThread: (threadId: number) => Promise<void>;
  /**
   * Per-popup entry point: fetch a thread's message history into the
   * `messagesByThread[threadId]` cache WITHOUT touching `currentThreadId`
   * or `isWidgetOpen`. Use this from UI surfaces that need to render
   * messages without becoming the active thread on the /messages page
   * (e.g. the floating MiniChatDock — each popup window calls this so
   * a peer popup never clobbers the user's currently-open conversation
   * on the full Messenger page).
   *
   * Idempotent: safe to call repeatedly for the same threadId. Joins
   * the socket room so `thread:new-message` events for this thread are
   * delivered (and thus update `messagesByThread[threadId]` via
   * `applyIncomingMessage`). Marks the thread as read on the server
   * because the user is looking at it.
   */
  loadThreadMessages: (threadId: number) => Promise<void>;
  closeThread: () => void;
  startAdminThread: () => Promise<number>;
  startUserThread: (peerId: number) => Promise<number>;

  // Reply state — the message the user is currently replying to
  replyTo: MessagingMessage | null;
  setReplyTo: (message: MessagingMessage | null) => void;

  // Messages
  loadMoreMessages: (threadId: number) => Promise<void>;
  // Phase 6: postShare param for sharing social posts into chat
  sendMessage: (threadId: number, content: string, fileIds?: number[], parentMessageId?: number | null, postShare?: { postId: number }, media?: { url: string; kind: 'gif' | 'sticker' }) => Promise<void>;
  deleteMessage: (threadId: number, messageId: number) => Promise<void>;
  recallMessage: (threadId: number, messageId: number) => Promise<void>;
  toggleReaction: (threadId: number, messageId: number, emoji: string) => Promise<void>;
  markRead: (threadId: number) => Promise<void>;
  setTyping: (threadId: number, isTyping: boolean) => void;

  // Nicknames
  setNickname: (threadId: number, targetId: number, alias: string) => Promise<void>;
  loadNicknames: () => Promise<void>;

  // Per-user thread preferences (pin / mute / archive / mark-unread)
  setThreadPreference: (
    threadId: number,
    slot: 'pinnedAt' | 'mutedUntil' | 'archivedAt' | 'markedUnreadAt',
    value: string | null,
  ) => Promise<void>;
  togglePin: (threadId: number) => Promise<void>;
  toggleMute: (threadId: number) => Promise<void>;
  // Mute with a duration (Facebook-style).
  //   0     → unmute
  //   15    → 15 minutes
  //   60    → 1 hour
  //   480   → 8 hours
  //   1440  → 24 hours
  //   null  → indefinite
  muteFor: (threadId: number, durationMinutes: number | null) => Promise<void>;
  archiveThread: (threadId: number) => Promise<void>;
  unarchiveThread: (threadId: number) => Promise<void>;
  // Toggle the archived state. Pass `nextView` if you want the
  // caller (UI) to be told which tab to switch to when the row
  // disappears from the current view. This is how the row menu
  // keeps the user in a sensible place after toggling.
  toggleArchive: (threadId: number) => Promise<{ wasArchived: boolean; isArchived: boolean }>;
  markThreadUnread: (threadId: number) => Promise<void>;
  unmarkThreadUnread: (threadId: number) => Promise<void>;
  toggleMarkUnread: (threadId: number) => Promise<{ wasMarked: boolean; isMarked: boolean }>;

  // Messenger-style destructive actions
  deleteChat: (threadId: number) => Promise<void>;
  reportThread: (
    threadId: number,
    payload: { reason: string; category?: 'spam' | 'harassment' | 'hate' | 'impersonation' | 'other' | null },
  ) => Promise<{ id: number; createdAt: string }>;

  // Blocklist
  blockedUsers: MessagingBlockedUser[];
  blockedLoaded: boolean;
  loadBlocked: () => Promise<void>;
  blockUser: (userId: number, reason?: string) => Promise<void>;
  unblockUser: (userId: number) => Promise<void>;
  isBlocked: (userId: number) => boolean;

  // Presence
  getPresence: (userId: number) => { online: boolean; lastSeen: number };

  // Internal socket handlers (called from socket lib)
  applyIncomingMessage: (threadId: number, message: MessagingMessage) => void;
  applyReadReceipt: (threadId: number, readerId: number, readAt?: string) => void;
  /** Mirror the current `messagesByThread[threadId]` array to
   *  IndexedDB. Called whenever the thread's message list
   *  changes (send, receive, delete, etc.) so a hard refresh
   *  never loses messages. Best-effort: failures are silent. */
  persistThreadMessages: (threadId: number) => void;
  applyThreadUpdated: (threadId: number, changes?: { preferenceChanged?: { userId: number; slot: string; value: string | null } }) => void;
  applyThreadCreated: (thread: MessagingThread) => void;
  applyMessageUpdated: (
    threadId: number,
    messageId: number,
    changes: { deleted?: boolean; recalled?: boolean; recalledAt?: string; reactions?: unknown },
  ) => void;
  applyPeerPresence: (userId: number, online: boolean, lastSeen: number) => void;
  onConnectionChange: (connected: boolean) => void;
}

const TYPING_TIMEOUT_MS = 3500;

/**
 * In-flight de-dupe cache for startUserThread(peerId).
 *
 * See the long comment on startUserThread() below for the race
 * this protects against. Module-level (not store state) because
 * it must outlive any single component render: two components
 * calling getState().startUserThread(N) concurrently need to
 * share the SAME Promise, which Zustand state cannot provide
 * (a `set` inside the second caller would race the first).
 */
const startUserThreadInFlight = new Map<number, Promise<number>>();

/**
 * Merge a freshly-fetched server message list with whatever we
 * currently have cached in `messagesByThread[threadId]`.
 *
 * The previous behaviour of `openThread` and `loadThreadMessages` was
 * to *unconditionally overwrite* the cache with the server response.
 * That looks innocent until you remember there are now TWO writers
 * to the same cache slice:
 *   1. The /messages page calls openThread (which fetches).
 *   2. The popup mini-chat calls loadThreadMessages (which fetches).
 *   3. The socket broadcasts `thread:new-message` via applyIncomingMessage
 *      (which appends optimistically).
 *
 * All three run concurrently. Without a merge, a slow network fetch
 * that started before a just-arrived optimistic message can resolve
 * AFTER the optimistic append and clobber it. The user sees a chat
 * that ends one message short.
 *
 * Merge contract:
 *   - Real messages (`id > 0`) come from the server — server is the
 *     source of truth, we replace whatever we have for those ids
 *     (picks up edits, reactions, recalls).
 *   - Optimistic messages (`id < 0`) come only from the cache; we
 *     keep them so an in-flight POST that hasn't yet received its
 *     server-side id stays visible until applyIncomingMessage
 *     replaces it via the optimistic-id match.
 *   - Anything in the server list with an id we don't have → append.
 *   - Result is sorted by createdAt ASC so the chat is always
 *     newest-at-the-bottom (applyIncomingMessage's append-by-id
 *     relies on this invariant).
 */
function mergeMessages(
  serverMsgs: MessagingMessage[],
  cachedMsgs: MessagingMessage[],
): MessagingMessage[] {
  // Fast path: no cache (popup first-open OR cache miss) → trust
  // server entirely. Nothing to merge.
  if (cachedMsgs.length === 0) return serverMsgs;

  const byId = new Map<number, MessagingMessage>();
  // Cache goes in first so the server overwrites by id (server
  // wins for any id present in BOTH sources).
  for (const m of cachedMsgs) byId.set(m.id, m);
  for (const m of serverMsgs) byId.set(m.id, m);

  const merged = Array.from(byId.values());
  // Stable sort by createdAt so newest-at-bottom holds even if the
  // server returned messages in a different order than we cached.
  merged.sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return ta - tb;
    // Fall back to id order so the sort is fully deterministic when
    // timestamps are equal or missing.
    return a.id - b.id;
  });
  return merged;
}

/**
 * Sort threads for the sidebar:
 *  1. Pinned threads first
 *  2. Then by lastMessageAt DESC (most recent activity)
 *  3. Stable on id for equal timestamps
 */
function sortThreads(threads: MessagingThread[]): MessagingThread[] {
  return threads.slice().sort((a, b) => {
    const ap = a.preferences?.pinnedAt ? 1 : 0;
    const bp = b.preferences?.pinnedAt ? 1 : 0;
    if (ap !== bp) return bp - ap;
    const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    if (bt !== at) return bt - at;
    return b.id - a.id;
  });
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  threads: [],
  threadsLoaded: false,
  threadsLoading: false,
  deletedThreads: [],
  deletedThreadsLoaded: false,
  deletedThreadsLoading: false,
  threadScope: 'personal',
  showArchived: false,
  currentThreadId: null,
  currentThread: null,
  messagesByThread: {},
  messagesLoading: false,
  messageLoadError: null,
  hasMoreByThread: {},
  unreadTotal: 0,
  isWidgetOpen: false,
  isConnected: false,
  isConnecting: false,
  lastConnectAttempt: 0,
  initError: null,
  typing: { byThread: {} },
  presence: { byUserId: {} },
  replyTo: null,
  blockedUsers: [],
  blockedLoaded: false,

  setReplyTo(message) {
    set({ replyTo: message });
  },

  async init(scope: 'personal' | 'support' = 'personal') {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) return;
    // Remember which inbox to fetch so loadThreads (here and on every
    // later reload/retry) pulls the right scope.
    set({ threadScope: scope });
    // De-dupe in-flight init calls (so a re-render storm doesn't
    // queue dozens of connect attempts). The previous code also
    // early-returned when the socket was already connected — that
    // was a bug: the socket singleton outlives auth state (see the
    // comment on `init()` in commit history). If a user logs out and
    // back in, the previously-connected socket might belong to a
    // DIFFERENT user, or its auth context could be stale. We must
    // still refresh REST data on every init() call.
    if (get().isConnecting) return;

    set({ isConnecting: true, initError: null, lastConnectAttempt: Date.now() });

    // ── 1. Ensure the socket is connected and its listeners are wired.
    //       This is a no-op on subsequent init() calls because the
    //       _messagingWired flag guards against double-binding.
    const socketWasConnected = getSocket()?.connected === true;
    if (!socketWasConnected) {
      try {
        await connectSocket();
      } catch (e: any) {
        // Socket connect failed. Don't bail — the REST endpoints
        // still work over the httpOnly auth cookie (the socket uses
        // the same cookie but with a different auth path that can
        // legitimately 401 while the REST cookie is still valid).
        // We surface the socket error AND continue to fetch REST
        // data so the user at least sees their existing inbox.
        set({ initError: e?.message ?? 'Không thể kết nối chat realtime' });
      }
    }

    const socket = getSocket();
    if (socket) {
      if (!(socket as any)._messagingWired) {
        (socket as any)._messagingWired = true;
        socket.on('thread:new-message', (payload: { threadId: number; message: MessagingMessage }) => {
          get().applyIncomingMessage(payload.threadId, payload.message);
        });
        socket.on('thread:read', (payload: { threadId: number; readerId: number; readAt?: string | Date }) => {
          get().applyReadReceipt(payload.threadId, payload.readerId, payload.readAt as any);
        });
        socket.on('thread:updated', (payload: { threadId: number; changes?: any }) => {
          get().applyThreadUpdated(payload.threadId, payload?.changes);
        });
        // NEW: peer started a new conversation. Re-emitted to
        // BOTH participants so the freshly-created thread shows
        // up in both sidebars without a refresh. We treat the
        // payload idempotently — if the row already exists we
        // just refresh its summary.
        socket.on('thread:created', (payload: { thread: MessagingThread }) => {
          get().applyThreadCreated(payload.thread);
        });
        socket.on('thread:typing', (payload: { threadId: number; userId: number; isTyping: boolean }) => {
          const cur = get().typing.byThread[payload.threadId] ?? {};
          const next = { ...cur };
          if (payload.isTyping) {
            next[payload.userId] = Date.now() + TYPING_TIMEOUT_MS;
          } else {
            delete next[payload.userId];
          }
          set((s) => ({ typing: { byThread: { ...s.typing.byThread, [payload.threadId]: next } } }));
        });
        socket.on('presence:update', (payload: { userId: number; online: boolean; lastSeen: number }) => {
          get().applyPeerPresence(payload.userId, payload.online, payload.lastSeen);
        });
        socket.on('connect', () => get().onConnectionChange(true));
        socket.on('disconnect', () => get().onConnectionChange(false));
        // Listen for in-place message updates (recall, delete,
        // reactions) and per-thread metadata changes.
        socket.on(
          'message:updated',
          (payload: {
            threadId: number;
            messageId: number;
            changes: { deleted?: boolean; recalled?: boolean; recalledAt?: string; reactions?: unknown };
          }) => {
            get().applyMessageUpdated(payload.threadId, payload.messageId, payload.changes);
          },
        );
        // CRITICAL: by the time we get here, the socket has ALREADY
        // connected (connectSocket awaited on the 'connect' event).
        // The listeners above will only fire on the NEXT (re)connect.
        // We must mirror the live state into the store right now,
        // otherwise the UI stays stuck on "Ngoại tuyến" forever.
        if (socket.connected) {
          get().onConnectionChange(true);
        }
      }
    }

    // ── 2. REST data load — ALWAYS run, even if the socket failed.
    //       The user has just landed on /messages (or remounted the
    //       dock after a long absence); they need their thread list
    //       and unread counts regardless of realtime status. Without
    //       this step a stale-JWT-but-valid-cookie state would leave
    //       them staring at an empty inbox.
    //
    //       We use Promise.allSettled (not Promise.all) so one
    //       failed fetch doesn't abort the others — loadThreads is
    //       the critical one, but the others (unread count, online
    //       users, blocked list) are nice-to-have and shouldn't
    //       gate the inbox.
    await Promise.allSettled([
      get().loadThreads(),
      get().refreshUnread(),
      get().loadOnlineUsers(),
      get().loadBlocked(),
    ]);

    set({ isConnecting: false });
  },

  async retryConnection() {
    // Force a fresh connection: tear down the current socket, then init.
    if (get().isConnecting) return;
    try { disconnectSocket(); } catch {}
    set({ isConnected: false, initError: null });
    await get().init(get().threadScope);
  },

  shutdown() {
    disconnectSocket();
    set({
      threads: [],
      threadsLoaded: false,
      showArchived: false,
      currentThreadId: null,
      currentThread: null,
      messagesByThread: {},
      hasMoreByThread: {},
      unreadTotal: 0,
      isWidgetOpen: false,
      isConnected: false,
      isConnecting: false,
      initError: null,
      typing: { byThread: {} },
      presence: { byUserId: {} },
    });
  },

  setWidgetOpen(open) {
    set({ isWidgetOpen: open });
  },

  setShowArchived(show) {
    set({ showArchived: show });
  },

  async loadThreads() {
    set({ threadsLoading: true });
    try {
      const res = await messagingApi.listThreads(get().threadScope);
      const raw = res.data.data ?? [];
      set({
        threads: sortThreads(raw),
        threadsLoaded: true,
        threadsLoading: false,
      });
    } catch (e: any) {
      // A 401 here means the JWT in the httpOnly cookie is stale
      // (e.g. roleVersion bump from a password change). Surface
      // a clear error so the UI can prompt the user to re-login
      // instead of silently showing an empty inbox.
      const status = e?.response?.status;
      set({ threadsLoading: false, threadsLoaded: true });
      if (status === 401 || status === 403) {
        set({ initError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
      }
      // For other errors (network, server 500, etc.) we still mark
      // threadsLoaded=true so the ThreadList shows the empty state
      // instead of a spinning skeleton forever. The user can retry
      // via the connection pill button.
    }
  },

  // Load the "Đã xoá" recovery tab (viewer's soft-deleted threads).
  // Lazy: only called when that tab is opened. Kept separate from
  // `threads` so the normal inbox payload isn't bloated.
  async loadDeletedThreads() {
    set({ deletedThreadsLoading: true });
    try {
      const res = await messagingApi.listDeletedThreads();
      set({
        deletedThreads: sortThreads(res.data.data ?? []),
        deletedThreadsLoaded: true,
        deletedThreadsLoading: false,
      });
    } catch {
      // Best-effort: mark loaded so the tab shows an empty state
      // instead of a forever-spinning skeleton. Re-open to retry.
      set({ deletedThreadsLoading: false, deletedThreadsLoaded: true });
    }
  },

  // Undo a "Delete chat". Removes the row from the deleted list and
  // pulls the freshly-restored thread back into the active inbox.
  async restoreChat(threadId) {
    await messagingApi.restoreChat(threadId);
    set((s) => ({
      deletedThreads: s.deletedThreads.filter((t) => t.id !== threadId),
    }));
    // Refetch the active inbox so the restored thread reappears with
    // its up-to-date summary/unread state.
    await get().loadThreads();
  },

  async refreshThreadSummary(threadId) {
    // Re-fetch the single thread to get updated lastMessage/unread
    try {
      const res = await messagingApi.getThread(threadId);
      const updated = res.data.data;
      set((s) => ({
        threads: s.threads.map((t) => (t.id === threadId ? { ...t, ...updated } : t)),
      }));
    } catch {
      // Best-effort: ignore
    }
  },

  async refreshUnread() {
    try {
      const res = await messagingApi.getUnreadCount();
      set({ unreadTotal: res.data.data?.count ?? 0 });
    } catch {
      // ignore
    }
  },

  async loadOnlineUsers() {
    try {
      const res = await messagingApi.getOnlineUsers();
      const ids = res.data.data?.userIds ?? [];
      const now = Date.now();
      set((s) => {
        const next = { ...s.presence.byUserId };
        // Mark everyone from the snapshot as online
        for (const id of ids) next[id] = { online: true, lastSeen: now };
        // Anyone NOT in the snapshot who we previously thought was
        // online becomes offline with the time of this snapshot
        for (const idStr of Object.keys(next)) {
          const id = Number(idStr);
          if (!ids.includes(id) && next[id]?.online) {
            next[id] = { online: false, lastSeen: now };
          }
        }
        return { presence: { byUserId: next } };
      });
    } catch {
      // ignore
    }
  },

  async openThread(threadId) {
    set({ currentThreadId: threadId, isWidgetOpen: true });
    joinThread(threadId);

    // Try to surface the thread detail immediately if we have it
    // in the sidebar cache — otherwise fetch in the background.
    // Only use the cache when it has a peer so the header doesn't
    // render a blank avatar while the API call is in flight.
    const cached = get().threads.find((t) => t.id === threadId && !!t.peer) ?? null;
    if (cached) set({ currentThread: cached });

    // ── Optimistic restore from IndexedDB ─────────────────────────
    // The previous version of this function only fetched from the
    // server, so any of these scenarios produced a permanently
    // empty thread for the user:
    //   1. Hard refresh mid-conversation — in-memory state gone,
    //      server fetch races with cookie hydration, transient
    //      empty result, UI stuck.
    //   2. Sign-out → sign-in on a different device — no local
    //      cache; the new device relies on the network round-trip.
    //   3. The user came back after a long break and the message
    //      endpoint momentarily 401s while the JWT refreshes.
    //
    // Now we restore the last known good message list from
    // IndexedDB the instant the user opens the thread. The
    // server fetch below still runs to pull any newer messages
    // and reconcile the order; if the server fetch fails the
    // user at least sees the conversation history instead of a
    // blank screen.
    const auth = useAuthStore.getState();
    if (auth.user?.id != null && !get().messagesByThread[threadId]) {
      const cachedMsgs = await import('@/lib/messageCache').then((m) =>
        m.loadMessages(threadId, auth.user!.id),
      );
      if (cachedMsgs && cachedMsgs.length > 0) {
        set((s) => ({
          messagesByThread: { ...s.messagesByThread, [threadId]: cachedMsgs as MessagingMessage[] },
          hasMoreByThread: { ...s.hasMoreByThread, [threadId]: cachedMsgs.length >= 50 },
          // Don't flip messagesLoading on for the cache restore —
          // the user already has data to look at.
        }));
      }
    }

    // Lazy-load the thread detail if we don't have messages yet
    // (or even if we do — the server is the source of truth, and
    // newer messages may have arrived while we were away).
    if (!get().messagesByThread[threadId]) {
      set({ messagesLoading: true, messageLoadError: null });
      try {
        const res = await messagingApi.listMessages(threadId, { limit: 50 });
        const messages = (res.data.data ?? []) as MessagingMessage[];
        set((s) => ({
          messagesByThread: { ...s.messagesByThread, [threadId]: messages },
          hasMoreByThread: { ...s.hasMoreByThread, [threadId]: messages.length >= 50 },
          messagesLoading: false,
          messageLoadError: null,
        }));
        // Persist the fresh list to IndexedDB so the next visit
        // can restore from cache. Awaiting isn't required (the
        // store continues to work either way), but doing it
        // before markRead avoids a race where the user sends a
        // message and the cache write from the fetch hasn't
        // landed yet.
        if (auth.user?.id != null) {
          await import('@/lib/messageCache').then((m) =>
            m.saveMessages(threadId, auth.user!.id, messages as unknown[]),
          );
        }
        // Mark as read on entry
        get().markRead(threadId);
      } catch (e: any) {
        // CRITICAL: previously this catch block only cleared the
        // loading flag and left `messagesByThread[threadId]`
        // undefined, so the next `openThread` call would retry
        // from scratch — a UX trap when the failure is sticky
        // (e.g. 401 from a stale JWT). We now set an empty array
        // and surface a retry-able error so the UI can show a
        // proper "Couldn't load messages — try again" state
        // instead of an indefinite "Chưa có tin nhắn" stub.
        const status = e?.response?.status;
        set({
          messagesLoading: false,
          messageLoadError:
            status === 401 || status === 403
              ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
              : 'Không thể tải tin nhắn. Vui lòng thử lại.',
        });
      }
    } else {
      // We already have messages (either from cache or from a
      // previous open). Refetch in the background to pick up
      // anything new without blocking the UI. Failures here are
      // silent — the cached list is good enough.
      //
      // MERGE instead of overwrite: the popup mini-chat shares this
      // same cache slice. If a user sent a message in the popup
      // moments ago and the socket append raced ahead of THIS fetch,
      // an unconditional overwrite would erase that optimistic
      // message. The merge contract is documented on mergeMessages().
      try {
        const res = await messagingApi.listMessages(threadId, { limit: 50 });
        const serverMsgs = (res.data.data ?? []) as MessagingMessage[];
        set((s) => {
          const cached = s.messagesByThread[threadId] ?? [];
          const merged = mergeMessages(serverMsgs, cached);
          return {
            messagesByThread: { ...s.messagesByThread, [threadId]: merged },
            hasMoreByThread: { ...s.hasMoreByThread, [threadId]: serverMsgs.length >= 50 },
            messageLoadError: null,
          };
        });
        if (auth.user?.id != null) {
          await import('@/lib/messageCache').then((m) =>
            m.saveMessages(threadId, auth.user!.id, serverMsgs as unknown[]),
          );
        }
      } catch {
        // Silent — we already have a good list to show.
      }
      get().markRead(threadId);
    }

    // Refresh the thread header info (last message preview, peer)
    try {
      const res = await messagingApi.getThread(threadId);
      set({ currentThread: res.data.data as MessagingThread });
    } catch {
      // Best effort
    }
  },

  // loadThreadMessages — see the action description in the
  // MessagingState interface above. Behaviour is "load + cache +
  // join + markRead", like openThread, but with NO side effects on
  // currentThreadId / currentThread / isWidgetOpen so callers that
  // only want a message-history snapshot (mini-chat popups, future
  // embedded widgets) don't clobber the user's active conversation
  // on the full /messages page.
  async loadThreadMessages(threadId) {
    if (!Number.isFinite(threadId)) return;

    // Always (re-)join the socket room so `thread:new-message`
    // events for this thread land in `messagesByThread[threadId]`
    // via applyIncomingMessage. joinThread is queue-safe and
    // idempotent at the socket layer.
    joinThread(threadId);

    const auth = useAuthStore.getState();

    // ── Optimistic IndexedDB restore (mirrors openThread) ─────
    // If we have nothing in the in-memory cache yet, try to surface
    // the last known good list from IndexedDB so the user sees
    // something immediately. The server fetch below still runs to
    // reconcile any newer messages.
    if (auth.user?.id != null && !get().messagesByThread[threadId]) {
      try {
        const cachedMsgs = await import('@/lib/messageCache').then((m) =>
          m.loadMessages(threadId, auth.user!.id),
        );
        if (cachedMsgs && cachedMsgs.length > 0) {
          set((s) => ({
            messagesByThread: { ...s.messagesByThread, [threadId]: cachedMsgs as MessagingMessage[] },
            hasMoreByThread: { ...s.hasMoreByThread, [threadId]: cachedMsgs.length >= 50 },
          }));
        }
      } catch {
        // Cache restore is best-effort; fall through to the network fetch.
      }
    }

    // ── Authoritative fetch ───────────────────────────────────
    // Either we had nothing in memory + IndexedDB, OR we already
    // had a list and want to pick up anything new. MERGE the
    // server response with whatever is already cached for this
    // threadId so we don't clobber a concurrent optimistic append
    // from the socket (see mergeMessages() for the full contract).
    try {
      const res = await messagingApi.listMessages(threadId, { limit: 50 });
      const serverMsgs = (res.data.data ?? []) as MessagingMessage[];
      set((s) => {
        const cached = s.messagesByThread[threadId] ?? [];
        const merged = mergeMessages(serverMsgs, cached);
        return {
          messagesByThread: { ...s.messagesByThread, [threadId]: merged },
          hasMoreByThread: { ...s.hasMoreByThread, [threadId]: serverMsgs.length >= 50 },
        };
      });
      // Mirror to IndexedDB so the next popup open in a future
      // session can restore from cache. Errors here are silent —
      // the cache is an optimisation, not a correctness requirement.
      // We persist the MERGED list (not just the server slice) so
      // any optimistic messages that haven't yet been confirmed by
      // the server are still there next time the user opens the
      // thread; applyIncomingMessage will de-dupe them by id when
      // the real broadcast lands.
      if (auth.user?.id != null) {
        const toPersist = get().messagesByThread[threadId] ?? serverMsgs;
        await import('@/lib/messageCache').then((m) =>
          m.saveMessages(threadId, auth.user!.id, toPersist as unknown[]),
        );
      }
      // User is reading this thread — clear the unread badge on
      // the server so other devices / sessions see this thread as
      // up to date. markRead is a thin REST call + local clear.
      await get().markRead(threadId);
    } catch {
      // Network blip: the user already has whatever was in cache
      // (if anything). Surfacing a toast from here would compete
      // with other toasts; the popup can render an error banner
      // by checking `messageLoadError` if needed.
    }
  },

  closeThread() {
    if (get().currentThreadId) leaveThread(get().currentThreadId!);
    set({ currentThreadId: null });
  },

  async startAdminThread() {
    const res = await messagingApi.getOrCreateAdminThread();
    const thread = res.data.data;
    await get().loadThreads();
    return thread.id;
  },

  async startUserThread(peerId) {
    // De-dupe in-flight calls for the same peerId.
    //
    // Why this exists: the right-rail "Gợi ý kết nối" widget
    // (SocialRightWidget.handleMessage) and the /messages page
    // `?peer=` effect both call startUserThread(pid) for the same
    // peerId within a few hundred ms of each other. Both reach the
    // store via getState(), so they're racing each other on the
    // network. The backend's POST /messages/threads/user/{peerId}
    // is documented as "get or create" but if BOTH requests land
    // before either has committed a row, two distinct threads can
    // be created. The user then sees an empty thread in the new
    // sidebar slot, and the messages they sent earlier to that
    // peer live on a different threadId they can't navigate to.
    //
    // Fix: hold an in-flight Promise per peerId. Concurrent
    // callers await the SAME Promise, so the network only sees
    // one request. The cache is dropped on settle (success or
    // throw) so a later legit retry can re-fire.
    const existing = startUserThreadInFlight.get(peerId);
    if (existing) return existing;

    const promise = (async () => {
      try {
        const res = await messagingApi.getOrCreateUserThread(peerId);
        const thread = res.data.data;
        await get().loadThreads();
        return thread.id;
      } finally {
        startUserThreadInFlight.delete(peerId);
      }
    })();
    startUserThreadInFlight.set(peerId, promise);
    return promise;
  },

  async loadMoreMessages(threadId) {
    const cur = get().messagesByThread[threadId] ?? [];
    if (cur.length === 0) return;
    const oldest = cur[0];
    set({ messagesLoading: true });
    try {
      const res = await messagingApi.listMessages(threadId, { cursor: oldest.id, limit: 50 });
      const older = res.data.data ?? [];
      set((s) => ({
        messagesByThread: { ...s.messagesByThread, [threadId]: [...older, ...cur] },
        hasMoreByThread: { ...s.hasMoreByThread, [threadId]: older.length >= 50 },
        messagesLoading: false,
      }));
    } catch {
      set({ messagesLoading: false });
    }
  },

  async sendMessage(threadId, content, fileIds, parentMessageId, postShare, media) {
    const trimmed = content.trim();
    if (!trimmed && !(fileIds && fileIds.length) && !postShare && !media) return;
    const auth = useAuthStore.getState();
    const senderId = auth.user?.id;
    if (!senderId) return;

    const replySnap = get().replyTo;

    // Optimistic insert
    const optimistic: MessagingMessage = {
      id: -Date.now(), // negative id so we can detect & replace on real ack
      threadId,
      senderId,
      content: trimmed,
      mediaUrl: media?.url ?? null,
      mediaKind: media?.kind ?? null,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        id: senderId,
        username: auth.user?.username ?? '',
        displayName: auth.user?.displayName ?? auth.user?.username ?? '',
        avatarUrl: auth.user?.avatarUrl ?? null,
      },
      attachments: [], // Real attachments are added after the server roundtrip
      readBy: [],
      parentMessageId: parentMessageId ?? replySnap?.id ?? null,
      parentMessage: replySnap
        ? {
            id: replySnap.id,
            senderId: replySnap.senderId,
            senderName: replySnap.sender.displayName ?? replySnap.sender.username,
            content: replySnap.content,
          }
        : null,
      };

    // Clear reply state immediately on send
    set((s) => ({
      replyTo: null,
      messagesByThread: {
        ...s.messagesByThread,
        [threadId]: [...(s.messagesByThread[threadId] ?? []), optimistic],
      },
    }));

    try {
      const res = await messagingApi.sendMessage(threadId, {
        content: trimmed,
        fileIds,
        parentMessageId: parentMessageId ?? replySnap?.id ?? null,
        postShare,
        media,
      });
      const real = res.data.data;
      // Replace optimistic with real
      set((s) => ({
        messagesByThread: {
          ...s.messagesByThread,
          [threadId]: (s.messagesByThread[threadId] ?? []).map((m) =>
            m.id === optimistic.id ? real : m,
          ),
        },
      }));
      // Update the thread summary (last message preview)
      get().refreshThreadSummary(threadId);
      // Mirror the new state to IndexedDB so a hard refresh
      // immediately after sending doesn't lose the message.
      get().persistThreadMessages(threadId);
    } catch (e) {
      // Roll back the optimistic insert
      set((s) => ({
        messagesByThread: {
          ...s.messagesByThread,
          [threadId]: (s.messagesByThread[threadId] ?? []).filter((m) => m.id !== optimistic.id),
        },
      }));
      throw e;
    }
  },

  async deleteMessage(threadId, messageId) {
    try {
      await messagingApi.deleteMessage(messageId);
      set((s) => ({
        messagesByThread: {
          ...s.messagesByThread,
          [threadId]: (s.messagesByThread[threadId] ?? []).map((m) =>
            m.id === messageId ? { ...m, deleted: true, content: '' } : m,
          ),
        },
      }));
    } catch {
      // ignore
    }
  },

  async recallMessage(threadId, messageId) {
    try {
      await messagingApi.recallMessage(messageId);
      // Optimistic local update — the server will broadcast
      // the canonical update via 'message:updated' which will
      // overwrite this if the timestamps differ.
      set((s) => ({
        messagesByThread: {
          ...s.messagesByThread,
          [threadId]: (s.messagesByThread[threadId] ?? []).map((m) =>
            m.id === messageId
              ? { ...m, recalled: true, recalledAt: new Date().toISOString(), content: '' }
              : m,
          ),
        },
      }));
    } catch (e) {
      throw e;
    }
  },

  async toggleReaction(threadId, messageId, emoji) {
    try {
      const res = await messagingApi.toggleReaction(messageId, emoji);
      set((s) => ({
        messagesByThread: {
          ...s.messagesByThread,
          [threadId]: (s.messagesByThread[threadId] ?? []).map((m) =>
            m.id === messageId ? { ...m, reactions: res.data.data.summary } : m,
          ),
        },
      }));
    } catch {
      // ignore
    }
  },

  async setNickname(threadId, targetId, alias) {
    try {
      await messagingApi.setNickname(threadId, targetId, alias);
      // Update the local peer display name to reflect the alias
      // immediately. The thread list and header both read from
      // `peer.displayName`, so swapping it here gives instant UI
      // feedback even before the next refetch.
      set((s) => {
        const updatePeer = (t: any) => {
          if (t.id !== threadId || !t.peer || t.peer.id !== targetId) return t;
          return {
            ...t,
            peer: {
              ...t.peer,
              alias: alias || null,
              displayName: alias || t.peer.displayName,
            },
          };
        };
        return {
          threads: s.threads.map(updatePeer),
          currentThread: s.currentThread && s.currentThread.id === threadId
            ? updatePeer(s.currentThread) as any
            : s.currentThread,
        };
      });
    } catch (e) {
      throw e;
    }
  },

  async loadNicknames() {
    try {
      const res = await messagingApi.listNicknames();
      const rows = res.data.data ?? [];
      // Build a quick lookup so we can apply the alias to any
      // matching thread/peer in the cache.
      set((s) => {
        const apply = (t: any) => {
          if (!t.peer) return t;
          const nick = rows.find((r) => r.threadId === t.id && r.targetId === t.peer.id);
          if (!nick) return t;
          return {
            ...t,
            peer: {
              ...t.peer,
              alias: nick.alias,
              displayName: nick.alias || t.peer.displayName,
            },
          };
        };
        return {
          threads: s.threads.map(apply),
          currentThread: s.currentThread ? apply(s.currentThread) as any : s.currentThread,
        };
      });
    } catch {
      // ignore
    }
  },

  async markRead(threadId) {
    const auth = useAuthStore.getState();
    if (!auth.user) return;
    try {
      await messagingApi.markRead(threadId);
      // Clear unread for this thread in the sidebar
      set((s) => ({
        threads: s.threads.map((t) =>
          t.id === threadId ? { ...t, unreadCount: 0 } : t,
        ),
      }));
      get().refreshUnread();
    } catch {
      // ignore
    }
  },

  setTyping(threadId, isTyping) {
    emitTyping(threadId, isTyping);
  },

  getPresence(userId) {
    const auth = useAuthStore.getState();
    if (auth.user?.id === userId) {
      // Self: presence is always online (we are running this code).
      return { online: true, lastSeen: Date.now() };
    }
    return get().presence.byUserId[userId] ?? { online: false, lastSeen: 0 };
  },

  applyIncomingMessage(threadId, message) {
    const auth = useAuthStore.getState();
    const isOwn = message.senderId === auth.user?.id;
    // Play a "new message" sound when an incoming message arrives
    // for a thread the user ISN'T currently viewing. If they have
    // the thread open they're already aware of the message; the
    // sound would be annoying. This matches the unread-bump rule
    // (line below: `unreadCount` only increments when
    // currentThreadId !== threadId).
    if (!isOwn) {
      // Lazy-import to avoid loading the sound service when the
      // user has never received a message in this session.
      import('@/lib/sound').then(({ playSound }) => {
        playSound('message');
      }).catch(() => { /* ignore */ });
    }
    set((s) => {
      const cur = s.messagesByThread[threadId] ?? [];
      // De-dupe (sender may receive their own message back via socket)
      if (cur.some((m) => m.id === message.id)) return s;
      // If the optimistic message exists (same sender, near-identical content),
      // replace it instead of appending.
      if (isOwn) {
        const idx = cur.findIndex(
          (m) => m.id < 0 && m.senderId === message.senderId && m.content === message.content,
        );
        if (idx >= 0) {
          const next = cur.slice();
          next[idx] = message;
          return { ...s, messagesByThread: { ...s.messagesByThread, [threadId]: next } };
        }
      }
      // BUGFIX: if the socket event arrived for a thread that ISN'T
      // in the sidebar yet (e.g. peer just started a brand new
      // conversation), fetch the canonical thread row from the
      // REST API and prepend it. Without this, the sidebar would
      // silently ignore the event and the user wouldn't see the
      // new thread until they refreshed the page.
      const threadExists = s.threads.some((t) => t.id === threadId);
      if (!threadExists && !isOwn) {
        // Fire-and-forget the fetch. We don't await — the user
        // gets an immediate empty thread row in the sidebar (so
        // the unread badge is visible right away) and the full
        // row is filled in once the fetch resolves.
        get().refreshThreadSummary(threadId);
      }
      const newThreadPreview = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
        hasAttachment: message.attachments.length > 0,
        attachmentMime: message.attachments[0]?.mimeType,
        attachmentName: message.attachments[0]?.fileName,
      };
      // Bump lastMessage + unreadCount on the matching row.
      // We re-sort the list because lastMessageAt changes and
      // pinned rows need to stay at the top.
      const updatedThreads = s.threads.map((t) => {
        if (t.id !== threadId) return t;
        if (isOwn) return t;
        return {
          ...t,
          unreadCount: s.currentThreadId === threadId ? 0 : (t.unreadCount ?? 0) + 1,
          lastMessage: newThreadPreview,
          lastMessageAt: message.createdAt,
        };
      });
      // If the thread still isn't in the list, add a stub so the
      // user can see something is happening. The full peer info
      // arrives a moment later via refreshThreadSummary.
      if (!threadExists) {
        updatedThreads.push({
          id: threadId,
          type: 'USER',
          lastMessageAt: message.createdAt,
          createdAt: message.createdAt,
          updatedAt: message.createdAt,
          peer: null,
          lastMessage: newThreadPreview,
          unreadCount: isOwn ? 0 : 1,
          preferences: null,
        });
      }
      return {
        ...s,
        messagesByThread: { ...s.messagesByThread, [threadId]: [...cur, message] },
        // Increment unread for non-active threads
        unreadTotal:
          isOwn || s.currentThreadId === threadId
            ? s.unreadTotal
            : s.unreadTotal + 1,
        threads: sortThreads(updatedThreads),
      };
    });
    // If the message came in for the open thread, also mark read
    if (get().currentThreadId === threadId && !isOwn) {
      get().markRead(threadId);
    }
    // Mirror the new state to IndexedDB so the conversation
    // survives a hard refresh even if the user closes the tab
    // immediately. Best-effort, silent on failure.
    get().persistThreadMessages(threadId);
  },

  /**
   * Mirror `messagesByThread[threadId]` to IndexedDB. Fire-and-forget;
   * failures are silent. The store imports `messageCache` lazily so
   * the rest of the bundle doesn't pay for it until the first call.
   *
   * Why an action on the store (not a side-effect inside `set`):
   *   Zustand's `set` is synchronous and we don't want every state
   *   mutation to be followed by an async IndexedDB write inside the
   *   reducer. By exposing this as a method we let the caller decide
   *   *when* to persist (e.g. after a successful network op, not on
   *   every typing indicator tick).
   */
  persistThreadMessages(threadId) {
    const auth = useAuthStore.getState();
    if (auth.user?.id == null) return;
    const list = get().messagesByThread[threadId];
    if (!list) return;
    import('@/lib/messageCache').then(({ saveMessages }) => {
      saveMessages(threadId, auth.user!.id, list as unknown[]);
    }).catch(() => { /* ignore */ });
  },

  applyReadReceipt(threadId, readerId, readAt) {
    const auth = useAuthStore.getState();
    if (readerId === auth.user?.id) return;
    const ts = readAt ? new Date(readAt).getTime() : Date.now();
    set((s) => {
      // Update thread unread in sidebar
      const newThreads = s.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t,
      );
      // Stamp every own message in this thread as "read by readerId"
      // (track the latest read timestamp; we only need to know the
      // last time it was read to render single/double-tick)
      const newMessages = { ...s.messagesByThread };
      const cur = newMessages[threadId];
      if (cur) {
        newMessages[threadId] = cur.map((m) => {
          if (m.senderId !== auth.user?.id) return m;
          const existing = m.readBy ?? [];
          if (existing.some((r) => r.userId === readerId)) return m;
          return { ...m, readBy: [...existing, { userId: readerId, readAt: new Date(ts).toISOString() }] };
        });
      }
      return { threads: newThreads, messagesByThread: newMessages };
    });
  },

  applyThreadCreated(thread) {
    set((s) => {
      // Idempotent: if the row is already there (which happens
      // when the SENDER receives its own broadcast back), just
      // refresh the peer/preferences fields in case the canonical
      // version is fresher.
      const existing = s.threads.find((t) => t.id === thread.id);
      if (existing) {
        return {
          ...s,
          threads: sortThreads(
            s.threads.map((t) =>
              t.id === thread.id
                ? { ...t, ...thread, preferences: thread.preferences ?? t.preferences }
                : t,
            ),
          ),
        };
      }
      return {
        ...s,
        threads: sortThreads([...s.threads, { ...thread, unreadCount: 0 }]),
      };
    });
  },

  applyThreadUpdated(threadId, changes) {
    // Light refresh — re-fetch the thread to update lastMessage preview.
    // For preference changes (pin/mute/archive/mark-unread) we update
    // the local row in-place so the sidebar reflects the change without
    // a round-trip.
    const pc = changes?.preferenceChanged;
    if (pc && typeof pc === 'object' && pc.slot) {
      set((s) => {
        const auth = useAuthStore.getState();
        if (pc.userId !== auth.user?.id) return s; // not for us
        return {
          ...s,
          threads: sortThreads(
            s.threads.map((t) => {
              if (t.id !== threadId) return t;
              const prefs = { ...(t.preferences ?? {}) } as Record<string, any>;
              if (pc.value === null) delete prefs[pc.slot];
              else prefs[pc.slot] = pc.value;
              return { ...t, preferences: prefs };
            }),
          ),
        };
      });
      return;
    }
    get().refreshThreadSummary(threadId);
    get().refreshUnread();
  },

  // ─── Per-user thread preferences (Pin / Mute / Archive / Mark unread) ───
  // All four slots go through one helper so the wiring is consistent.
  async setThreadPreference(threadId, slot, value) {
    // Optimistic local update so the UI feels instant. If the API
    // call fails, the server's `thread:updated` event will overwrite
    // with the actual value when it next propagates.
    set((s) => ({
      threads: sortThreads(
        s.threads.map((t) => {
          if (t.id !== threadId) return t;
          const prefs = { ...(t.preferences ?? {}) } as Record<string, any>;
          if (value === null) delete prefs[slot];
          else prefs[slot] = value;
          return { ...t, preferences: prefs };
        }),
      ),
    }));
    try {
      const res = await messagingApi.updatePreference(threadId, { slot, value });
      const preferences = res.data.data?.preferences ?? null;
      set((s) => ({
        threads: sortThreads(
          s.threads.map((t) => (t.id === threadId ? { ...t, preferences } : t)),
        ),
        currentThread:
          s.currentThread && s.currentThread.id === threadId
            ? { ...s.currentThread, preferences }
            : s.currentThread,
      }));
    } catch (e: any) {
      // Roll back: re-fetch from server. The simplest rollback is
      // a list refresh so we sync back to the source of truth.
      void get().loadThreads();
      throw e;
    }
  },

  async togglePin(threadId) {
    const cur = get().threads.find((t) => t.id === threadId);
    const isPinned = !!cur?.preferences?.pinnedAt;
    await get().setThreadPreference(threadId, 'pinnedAt', isPinned ? null : new Date().toISOString());
  },

  async toggleMute(threadId) {
    const cur = get().threads.find((t) => t.id === threadId);
    const mutedUntil = cur?.preferences?.mutedUntil;
    const isMuted = mutedUntil ? new Date(mutedUntil) > new Date() : false;
    // 8h mute window — common chat-app default. Pass `null` to clear.
    const next: string | null = isMuted
      ? null
      : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    await get().setThreadPreference(threadId, 'mutedUntil', next);
  },

  async archiveThread(threadId) {
    try {
      const res = await messagingApi.archiveThread(threadId);
      const preferences = res.data.data?.preferences ?? null;
      set((s) => ({
        threads: s.threads.map((t) => (t.id === threadId ? { ...t, preferences } : t)),
        currentThread:
          s.currentThread && s.currentThread.id === threadId
            ? { ...s.currentThread, preferences }
            : s.currentThread,
      }));
    } catch (e) {
      throw e;
    }
  },

  async unarchiveThread(threadId) {
    try {
      const res = await messagingApi.unarchiveThread(threadId);
      const preferences = res.data.data?.preferences ?? null;
      set((s) => ({
        threads: s.threads.map((t) => (t.id === threadId ? { ...t, preferences } : t)),
        currentThread:
          s.currentThread && s.currentThread.id === threadId
            ? { ...s.currentThread, preferences }
            : s.currentThread,
      }));
    } catch (e) {
      throw e;
    }
  },

  async markThreadUnread(threadId) {
    try {
      const res = await messagingApi.markThreadUnread(threadId);
      const preferences = res.data.data?.preferences ?? null;
      set((s) => {
        const threads = s.threads.map((t) => {
          if (t.id !== threadId) return t;
          // Mark as unread: stamp the preference + ensure
          // unreadCount is at least 1 so the sidebar badge
          // appears immediately. ThreadList renders the row as
          // "bold" when `preferences.markedUnreadAt` is set.
          return {
            ...t,
            preferences,
            unreadCount: t.unreadCount && t.unreadCount > 0 ? t.unreadCount : 1,
          };
        });
        const unreadTotal = threads.reduce((acc, t) => acc + (t.unreadCount ?? 0), 0);
        return { threads, unreadTotal };
      });
    } catch (e) {
      throw e;
    }
  },

  // Reverse of `markThreadUnread`. Clears the `markedUnreadAt`
  // preference so the row returns to its normal "read" style
  // and (importantly) does NOT keep the forced unreadCount bump
  // from the mark-unread action — the real unreadCount stays as
  // the server reports it.
  async unmarkThreadUnread(threadId) {
    try {
      // The server endpoint is `messagingApi.updatePreference` —
      // passing `value: null` clears the slot. We then mirror
      // the response into local state so the row's "bold" style
      // goes away immediately.
      const res = await messagingApi.updatePreference(threadId, {
        slot: 'markedUnreadAt',
        value: null,
      });
      const preferences = res.data.data?.preferences ?? null;
      set((s) => ({
        threads: s.threads.map((t) => {
          if (t.id !== threadId) return t;
          return { ...t, preferences };
        }),
        currentThread:
          s.currentThread && s.currentThread.id === threadId
            ? { ...s.currentThread, preferences }
            : s.currentThread,
      }));
    } catch (e) {
      throw e;
    }
  },

  // Toggle helper for the "Mark unread" item in the row/header
  // menu. Returns enough info for the caller to update its UI
  // state (e.g. flip the menu label).
  async toggleMarkUnread(threadId) {
    const cur = get().threads.find((t) => t.id === threadId);
    const wasMarked = !!cur?.preferences?.markedUnreadAt;
    if (wasMarked) {
      await get().unmarkThreadUnread(threadId);
      return { wasMarked, isMarked: false };
    }
    await get().markThreadUnread(threadId);
    return { wasMarked, isMarked: true };
  },

  // Toggle helper for the "Lưu trữ" / "Bỏ lưu trữ" item. We
  // reuse the existing archive / unarchive endpoints so the
  // server stays the single source of truth for preferences.
  async toggleArchive(threadId) {
    const cur = get().threads.find((t) => t.id === threadId);
    const wasArchived = !!cur?.preferences?.archivedAt;
    if (wasArchived) {
      await get().unarchiveThread(threadId);
      return { wasArchived, isArchived: false };
    }
    await get().archiveThread(threadId);
    return { wasArchived, isArchived: true };
  },

  // ─── Destructive: delete chat from viewer's inbox ─────
  // Per Messenger convention "Delete chat" is local — it
  // archives the thread (so the row leaves the default inbox)
  // and clears the chat state. The other participant keeps
  // their copy. We also close the thread on the client side
  // so the right-hand panel goes back to the empty state.
  async deleteChat(threadId) {
    try {
      const res = await messagingApi.deleteChat(threadId);
      const preferences = res.data.data?.preferences ?? null;
      // Hard-delete: filter the row OUT of the threads list
      // entirely (the user shouldn't see it in any tab). The
      // server marks preferences.deletedAt so listThreadsForUser
      // will also exclude it on the next refresh — we mirror
      // that here so the UI updates instantly without waiting
      // for a refetch.
      set((s) => ({
        threads: s.threads.filter((t) => t.id !== threadId),
        // Invalidate the "Đã xoá" tab so it re-fetches (and now
        // includes this thread) the next time it's opened.
        deletedThreadsLoaded: false,
        currentThread:
          s.currentThread && s.currentThread.id === threadId ? null : s.currentThread,
        currentThreadId:
          s.currentThreadId === threadId ? null : s.currentThreadId,
      }));
      // If the deleted thread was the one open in the panel,
      // close it so the user lands back on the empty-state
      // hint card instead of staring at a "Chat đã xoá" body.
      if (get().currentThreadId === threadId) {
        get().closeThread();
      }
    } catch (e) {
      throw e;
    }
  },

  // ─── Mute with duration (Facebook-style) ───────────────
  // Pass `durationMinutes`:
  //   0    → unmute
  //   15   → 15 minutes
  //   60   → 1 hour
  //   480  → 8 hours
  //   1440 → 24 hours
  //   null → indefinite (until manually un-muted)
  async muteFor(threadId, durationMinutes) {
    try {
      const res = await messagingApi.muteFor(threadId, durationMinutes);
      const preferences = res.data.data?.preferences ?? null;
      set((s) => ({
        threads: s.threads.map((t) => (t.id === threadId ? { ...t, preferences } : t)),
        currentThread:
          s.currentThread && s.currentThread.id === threadId
            ? { ...s.currentThread, preferences }
            : s.currentThread,
      }));
    } catch (e) {
      throw e;
    }
  },

  // ─── Report thread to moderators ──────────────────────
  async reportThread(threadId, payload) {
    const res = await messagingApi.reportThread(threadId, payload);
    return res.data.data;
  },

  // ─── Blocklist ────────────────────────────────────────
  async loadBlocked() {
    try {
      const res = await messagingApi.listBlocked();
      set({ blockedUsers: res.data.data ?? [], blockedLoaded: true });
    } catch {
      set({ blockedUsers: [], blockedLoaded: true });
    }
  },

  async blockUser(userId, reason) {
    await messagingApi.blockUser(userId, reason);
    // Optimistically refresh the local list so the next
    // `isBlocked()` call returns true without a round-trip.
    set((s) => ({
      blockedUsers: s.blockedUsers.find((u) => u.id === userId)
        ? s.blockedUsers
        : s.blockedUsers,
      blockedLoaded: true,
    }));
    // Pull the canonical list (with the newly-blocked user's
    // profile info) so the UI can show them in a "Blocked"
    // sheet if needed.
    await get().loadBlocked();
    // Also drop any threads with this peer from the sidebar.
    set((s) => ({
      threads: s.threads.filter((t) => {
        const peerId = t.peer?.id;
        return peerId !== userId;
      }),
    }));
  },

  async unblockUser(userId) {
    await messagingApi.unblockUser(userId);
    set((s) => ({
      blockedUsers: s.blockedUsers.filter((u) => u.id !== userId),
    }));
    // Refresh the inbox so the now-unblocked peer's thread
    // reappears (if any).
    await get().loadThreads();
  },

  isBlocked(userId) {
    return get().blockedUsers.some((u) => u.id === userId);
  },

  applyMessageUpdated(
    threadId,
    messageId,
    changes,
  ) {
    set((s) => {
      const cur = s.messagesByThread[threadId];
      if (!cur) return s;
      const next = cur.map((m) => {
        if (m.id !== messageId) return m;
        const merged: MessagingMessage = { ...m, ...changes } as MessagingMessage;
        // Recall: also wipe the content.
        if (changes.recalled) {
          merged.content = '';
        }
        if (changes.deleted) {
          merged.content = '';
        }
        return merged;
      });
      return { messagesByThread: { ...s.messagesByThread, [threadId]: next } };
    });
  },

  applyPeerPresence(userId, online, lastSeen) {
    set((s) => ({
      presence: {
        byUserId: { ...s.presence.byUserId, [userId]: { online, lastSeen } },
      },
    }));
  },

  onConnectionChange(connected) {
    set({ isConnected: connected, isConnecting: false });
    if (connected) {
      // Re-join active thread room after reconnect. The server
      // now auto-joins every thread on connect, but we also
      // re-join explicitly here in case the active thread was
      // created AFTER the initial socket connect.
      const t = get().currentThreadId;
      if (t) joinThread(t);
      // Refresh the online-user list — peers may have come/gone
      // while we were disconnected.
      get().loadOnlineUsers();
    } else {
      // Stamp own last-seen so the peer UI knows we just went offline
      const auth = useAuthStore.getState();
      if (auth.user?.id) {
        set((s) => ({
          presence: {
            byUserId: {
              ...s.presence.byUserId,
              [auth.user!.id]: { online: false, lastSeen: Date.now() },
            },
          },
        }));
      }
    }
  },
}));
