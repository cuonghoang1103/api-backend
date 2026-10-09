'use client';

/**
 * CT Work K-3 — thời gian thực của kênh chat.
 *
 *   useChannelRoom   vào phòng `work:chat:<dự án>:<kênh>` (server kiểm quyền) ⇒ `work:chat:event` (tin mới/sửa/xoá/cảm
 *                    xúc/ghim/phiên âm xong). Mất kết nối rồi nối lại ⇒ vào lại phòng + gọi onResync (tải phần đã lỡ).
 *   useTyping        "đang gõ…" trong phòng đó: gửi nhịp khi gõ (tối đa 1 lần / 2,5 giây), tự tắt sau 6 giây không nhận.
 *   useOnline        trạng thái mạng của trình duyệt (hàng chờ gửi lại khi có mạng).
 *
 * Mọi hook gọi trước mọi `return` sớm của component dùng nó (rules-of-hooks).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { connectSocket } from '@/lib/socket';
import type { WorkUser } from '@/lib/work-api';
import type { ChatMessage } from '@/lib/work-chat-api';

type Sock = Awaited<ReturnType<typeof connectSocket>>;

export interface ChatEvent {
  projectId: number; channelId: number;
  type: 'message' | 'update' | 'delete' | 'reaction' | 'pin' | 'channel';
  messageId?: number; parentId?: number | null; userId?: number; pinned?: boolean;
  message?: ChatMessage; hasPreviews?: boolean;
}

export function useChannelRoom(pid: number | undefined, cid: number | null, onEvent: (e: ChatEvent) => void, onResync?: () => void) {
  const evRef = useRef(onEvent);
  evRef.current = onEvent;
  const syncRef = useRef(onResync);
  syncRef.current = onResync;
  useEffect(() => {
    if (!pid || !cid) return;
    let alive = true;
    let s: Sock | null = null;
    const join = () => s?.emit('work:chat:join', { projectId: pid, channelId: cid }, () => {});
    const onEv = (e: ChatEvent) => { if (e.projectId === pid && e.channelId === cid) evRef.current(e); };
    const onReconnect = () => { join(); syncRef.current?.(); };
    connectSocket().then((sock) => {
      if (!alive) return;
      s = sock;
      join();
      sock.on('work:chat:event', onEv);
      sock.on('connect', onReconnect);
    }).catch(() => undefined);
    return () => {
      alive = false;
      s?.off('work:chat:event', onEv);
      s?.off('connect', onReconnect);
      s?.emit('work:chat:leave', { projectId: pid, channelId: cid });
    };
  }, [pid, cid]);
}

type Typer = { user: Pick<WorkUser, 'id' | 'username' | 'fullName' | 'displayName' | 'avatarUrl'>; at: number; threadId: number | null };

export function useTyping(pid: number | undefined, cid: number | null, meId: number | undefined) {
  const [typers, setTypers] = useState<Map<number, Typer>>(new Map());
  const sockRef = useRef<Sock | null>(null);
  const lastSent = useRef(0);
  useEffect(() => {
    setTypers(new Map());
    if (!pid || !cid) return;
    let alive = true;
    const onTyping = (e: { projectId: number; channelId: number; threadId: number | null; typing: boolean; user: Typer['user']; at: number }) => {
      if (e.projectId !== pid || e.channelId !== cid || !e.user || e.user.id === meId) return;
      setTypers((m) => {
        const next = new Map(m);
        if (e.typing) next.set(e.user.id, { user: e.user, at: Date.now(), threadId: e.threadId });
        else next.delete(e.user.id);
        return next;
      });
    };
    connectSocket().then((s) => { if (!alive) return; sockRef.current = s; s.on('work:chat:typing', onTyping); }).catch(() => undefined);
    const sweep = setInterval(() => {
      setTypers((m) => {
        const now = Date.now();
        if (![...m.values()].some((t) => now - t.at > 6000)) return m;
        return new Map([...m].filter(([, t]) => now - t.at <= 6000));
      });
    }, 2000);
    return () => { alive = false; clearInterval(sweep); sockRef.current?.off('work:chat:typing', onTyping); };
  }, [pid, cid, meId]);

  const ping = useCallback((threadId: number | null = null, typing = true) => {
    if (!pid || !cid) return;
    const now = Date.now();
    if (typing && now - lastSent.current < 2500) return;
    lastSent.current = typing ? now : 0;
    sockRef.current?.emit('work:chat:typing', { projectId: pid, channelId: cid, threadId, typing });
  }, [pid, cid]);

  return { typers: [...typers.values()], ping };
}

export function useOnline(): boolean {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const up = () => setOn(navigator.onLine !== false);
    up();
    window.addEventListener('online', up);
    window.addEventListener('offline', up);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', up); };
  }, []);
  return on;
}
