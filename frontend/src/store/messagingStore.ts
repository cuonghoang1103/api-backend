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
  /** "Active" = visible in the default inbox. Archived threads are kept
   *  in this list (so we can show them under the "Archived" tab) but
   *  excluded from the default render. */
  showArchived: boolean;
  currentThreadId: number | null;
  currentThread: MessagingThread | null;
  messagesByThread: Record<number, MessagingMessage[]>;
  messagesLoading: boolean;
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
  init: () => Promise<void>;
  shutdown: () => void;
  retryConnection: () => Promise<void>;
  setWidgetOpen: (open: boolean) => void;
  setShowArchived: (show: boolean) => void;

  // Threads
  loadThreads: () => Promise<void>;
  refreshThreadSummary: (threadId: number) => Promise<void>;
  loadOnlineUsers: () => Promise<void>;
  refreshUnread: () => Promise<void>;

  // Open / switch thread
  openThread: (threadId: number) => Promise<void>;
  closeThread: () => void;
  startAdminThread: () => Promise<number>;
  startUserThread: (peerId: number) => Promise<number>;

  // Messages
  loadMoreMessages: (threadId: number) => Promise<void>;
  sendMessage: (threadId: number, content: string, fileIds?: number[]) => Promise<void>;
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
  archiveThread: (threadId: number) => Promise<void>;
  unarchiveThread: (threadId: number) => Promise<void>;
  markThreadUnread: (threadId: number) => Promise<void>;

  // Presence
  getPresence: (userId: number) => { online: boolean; lastSeen: number };

  // Internal socket handlers (called from socket lib)
  applyIncomingMessage: (threadId: number, message: MessagingMessage) => void;
  applyReadReceipt: (threadId: number, readerId: number, readAt?: string) => void;
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
  showArchived: false,
  currentThreadId: null,
  currentThread: null,
  messagesByThread: {},
  messagesLoading: false,
  hasMoreByThread: {},
  unreadTotal: 0,
  isWidgetOpen: false,
  isConnected: false,
  isConnecting: false,
  lastConnectAttempt: 0,
  initError: null,
  typing: { byThread: {} },
  presence: { byUserId: {} },

  async init() {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) return;
    if (getSocket()?.connected) return; // already connected
    // De-dupe in-flight init calls
    if (get().isConnecting) return;

    set({ isConnecting: true, initError: null, lastConnectAttempt: Date.now() });
    try {
      await connectSocket();
      const socket = getSocket();
      if (socket) {
        // Wire socket events into the store once
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
      // Initial data load
      await Promise.all([get().loadThreads(), get().refreshUnread(), get().loadOnlineUsers()]);
      set({ isConnecting: false, initError: null });
    } catch (e: any) {
      set({
        isConnecting: false,
        isConnected: false,
        initError: e?.message ?? 'Failed to connect to chat server',
      });
    }
  },

  async retryConnection() {
    // Force a fresh connection: tear down the current socket, then init.
    if (get().isConnecting) return;
    try { disconnectSocket(); } catch {}
    set({ isConnected: false, initError: null });
    await get().init();
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
      const res = await messagingApi.listThreads();
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
      set({ threadsLoading: false });
      if (status === 401 || status === 403) {
        set({ initError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
      }
    }
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

    // Lazy-load the thread detail if we don't have messages yet
    if (!get().messagesByThread[threadId]) {
      set({ messagesLoading: true });
      try {
        const res = await messagingApi.listMessages(threadId, { limit: 50 });
        const messages = res.data.data ?? [];
        set((s) => ({
          messagesByThread: { ...s.messagesByThread, [threadId]: messages },
          hasMoreByThread: { ...s.hasMoreByThread, [threadId]: messages.length >= 50 },
          messagesLoading: false,
        }));
        // Mark as read on entry
        get().markRead(threadId);
      } catch {
        set({ messagesLoading: false });
      }
    } else {
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
    const res = await messagingApi.getOrCreateUserThread(peerId);
    const thread = res.data.data;
    await get().loadThreads();
    return thread.id;
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

  async sendMessage(threadId, content, fileIds) {
    const trimmed = content.trim();
    if (!trimmed && !(fileIds && fileIds.length)) return;
    const auth = useAuthStore.getState();
    const senderId = auth.user?.id;
    if (!senderId) return;

    // Optimistic insert
    const optimistic: MessagingMessage = {
      id: -Date.now(), // negative id so we can detect & replace on real ack
      threadId,
      senderId,
      content: trimmed,
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
    };
    set((s) => ({
      messagesByThread: {
        ...s.messagesByThread,
        [threadId]: [...(s.messagesByThread[threadId] ?? []), optimistic],
      },
    }));

    try {
      const res = await messagingApi.sendMessage(threadId, { content: trimmed, fileIds });
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
          // Mark as unread bumps the badge even if the user is
          // not currently looking at the thread. lastReadAt isn't
          // reset (that's markRead's job) — we just stamp the
          // preference, and the sidebar's "bold" rendering keys
          // off it.
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
