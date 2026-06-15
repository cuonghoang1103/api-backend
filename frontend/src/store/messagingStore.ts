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

  // Threads
  loadThreads: () => Promise<void>;
  refreshThreadSummary: (threadId: number) => Promise<void>;
  loadOnlineUsers: () => Promise<void>;

  // Open / switch thread
  openThread: (threadId: number) => Promise<void>;
  closeThread: () => void;
  startAdminThread: () => Promise<number>;
  startUserThread: (peerId: number) => Promise<number>;

  // Messages
  loadMoreMessages: (threadId: number) => Promise<void>;
  sendMessage: (threadId: number, content: string, fileIds?: number[]) => Promise<void>;
  deleteMessage: (threadId: number, messageId: number) => Promise<void>;
  markRead: (threadId: number) => Promise<void>;
  setTyping: (threadId: number, isTyping: boolean) => void;

  // Presence
  getPresence: (userId: number) => { online: boolean; lastSeen: number };

  // Internal socket handlers (called from socket lib)
  applyIncomingMessage: (threadId: number, message: MessagingMessage) => void;
  applyReadReceipt: (threadId: number, readerId: number, readAt?: string) => void;
  applyThreadUpdated: (threadId: number) => void;
  applyPeerPresence: (userId: number, online: boolean, lastSeen: number) => void;
  onConnectionChange: (connected: boolean) => void;
}

const TYPING_TIMEOUT_MS = 3500;

export const useMessagingStore = create<MessagingState>((set, get) => ({
  threads: [],
  threadsLoaded: false,
  threadsLoading: false,
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
          socket.on('thread:updated', (payload: { threadId: number }) => {
            get().applyThreadUpdated(payload.threadId);
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

  async loadThreads() {
    set({ threadsLoading: true });
    try {
      const res = await messagingApi.listThreads();
      set({ threads: res.data.data ?? [], threadsLoaded: true, threadsLoading: false });
    } catch {
      set({ threadsLoading: false });
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
    const cached = get().threads.find((t) => t.id === threadId) ?? null;
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
      return {
        ...s,
        messagesByThread: { ...s.messagesByThread, [threadId]: [...cur, message] },
        // Increment unread for non-active threads
        unreadTotal:
          isOwn || s.currentThreadId === threadId
            ? s.unreadTotal
            : s.unreadTotal + 1,
        threads: s.threads.map((t) => {
          if (t.id !== threadId) return t;
          if (isOwn) return t;
          return {
            ...t,
            unreadCount: s.currentThreadId === threadId ? 0 : (t.unreadCount ?? 0) + 1,
            lastMessage: {
              id: message.id,
              content: message.content,
              senderId: message.senderId,
              createdAt: message.createdAt,
              hasAttachment: message.attachments.length > 0,
              attachmentMime: message.attachments[0]?.mimeType,
              attachmentName: message.attachments[0]?.fileName,
            },
            lastMessageAt: message.createdAt,
          };
        }),
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

  applyThreadUpdated(threadId) {
    // Light refresh — re-fetch the thread to update lastMessage preview
    get().refreshThreadSummary(threadId);
    get().refreshUnread();
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
      // Re-join active thread room after reconnect
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
