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

interface MessagingState {
  threads: MessagingThread[];
  threadsLoaded: boolean;
  threadsLoading: boolean;
  currentThreadId: number | null;
  messagesByThread: Record<number, MessagingMessage[]>;
  messagesLoading: boolean;
  hasMoreByThread: Record<number, boolean>;
  unreadTotal: number;
  isWidgetOpen: boolean;
  isConnected: boolean;
  typing: TypingState;
  initError: string | null;

  // Lifecycle
  init: () => Promise<void>;
  shutdown: () => void;
  setWidgetOpen: (open: boolean) => void;

  // Threads
  loadThreads: () => Promise<void>;
  refreshThreadSummary: (threadId: number) => Promise<void>;

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

  // Internal socket handlers (called from socket lib)
  applyIncomingMessage: (threadId: number, message: MessagingMessage) => void;
  applyReadReceipt: (threadId: number, readerId: number) => void;
  applyThreadUpdated: (threadId: number) => void;
  onConnectionChange: (connected: boolean) => void;
}

const TYPING_TIMEOUT_MS = 3500;

export const useMessagingStore = create<MessagingState>((set, get) => ({
  threads: [],
  threadsLoaded: false,
  threadsLoading: false,
  currentThreadId: null,
  messagesByThread: {},
  messagesLoading: false,
  hasMoreByThread: {},
  unreadTotal: 0,
  isWidgetOpen: false,
  isConnected: false,
  typing: { byThread: {} },
  initError: null,

  async init() {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) return;
    if (getSocket()) return; // already connected

    set({ initError: null });
    try {
      await connectSocket();
      // Wire socket events into the store once
      const socket = getSocket();
      if (socket) {
        socket.on('thread:new-message', (payload: { threadId: number; message: MessagingMessage }) => {
          get().applyIncomingMessage(payload.threadId, payload.message);
        });
        socket.on('thread:read', (payload: { threadId: number; readerId: number }) => {
          get().applyReadReceipt(payload.threadId, payload.readerId);
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
        socket.on('connect', () => get().onConnectionChange(true));
        socket.on('disconnect', () => get().onConnectionChange(false));
      }
      // Initial data load
      await Promise.all([get().loadThreads(), get().refreshUnread()]);
    } catch (e: any) {
      set({ initError: e?.message ?? 'Failed to connect to chat server' });
    }
  },

  shutdown() {
    disconnectSocket();
    set({
      threads: [],
      threadsLoaded: false,
      currentThreadId: null,
      messagesByThread: {},
      hasMoreByThread: {},
      unreadTotal: 0,
      isWidgetOpen: false,
      isConnected: false,
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

  async openThread(threadId) {
    set({ currentThreadId: threadId, isWidgetOpen: true });
    joinThread(threadId);

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

  applyReadReceipt(threadId, readerId) {
    const auth = useAuthStore.getState();
    if (readerId === auth.user?.id) return;
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t,
      ),
    }));
  },

  applyThreadUpdated(threadId) {
    // Light refresh — re-fetch the thread to update lastMessage preview
    get().refreshThreadSummary(threadId);
    get().refreshUnread();
  },

  onConnectionChange(connected) {
    set({ isConnected: connected });
    if (connected) {
      // Re-join active thread room after reconnect
      const t = get().currentThreadId;
      if (t) joinThread(t);
    }
  },
}));
