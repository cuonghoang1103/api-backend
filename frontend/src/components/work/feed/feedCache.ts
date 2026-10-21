'use client';

/**
 * Bảng tin nhóm — bộ đệm react-query + thời gian thực.
 *
 *   patchPost / dropPost   sửa / bỏ MỘT bài trong mọi trang bảng tin đang nạp (+ bài đơn) — không tải lại cả danh sách.
 *   refreshPost            xin lại một bài từ máy chủ (bộ đếm, bình luận xem trước) rồi vá vào bộ đệm; 404 ⇒ bỏ khỏi bộ đệm.
 *   useFeedRealtime        `work:feed:subscribe` sau mỗi lần nối ⇒ `work:feed:event` (chỉ id + bộ đếm — nội dung tải qua REST).
 */

import { useEffect, useRef } from 'react';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { connectSocket } from '@/lib/socket';
import { feedApi, feedKeys, type FeedPage, type FeedPost } from '@/lib/work-feed-api';

export interface FeedEvent {
  type: 'post.created' | 'post.updated' | 'post.deleted' | 'comment.created' | 'comment.updated' | 'comment.deleted' | 'reaction' | 'poll';
  postId: number; workspaceId: number; projectId: number | null; actorId?: number; commentId?: number | null; parentId?: number | null;
  commentCount?: number; reactionCount?: number; totalVotes?: number; at: string;
}

function mapList(list: FeedPost[], id: number, fn: (p: FeedPost) => FeedPost | null): FeedPost[] {
  let changed = false;
  const out: FeedPost[] = [];
  for (const p of list) {
    if (p.id !== id) { out.push(p); continue; }
    changed = true;
    const next = fn(p);
    if (next) out.push(next);
  }
  return changed ? out : list;
}

export function patchPost(qc: QueryClient, id: number, fn: (p: FeedPost) => FeedPost | null): void {
  qc.setQueriesData<InfiniteData<FeedPage>>({ queryKey: [...feedKeys.all, 'list'] }, (old) => {
    if (!old?.pages) return old;
    return { ...old, pages: old.pages.map((pg) => ({ ...pg, posts: mapList(pg.posts, id, fn), pinned: mapList(pg.pinned, id, fn) })) };
  });
  qc.setQueryData<FeedPost>(feedKeys.post(id), (old) => (old ? fn(old) ?? old : old));
}

export const dropPost = (qc: QueryClient, id: number) => patchPost(qc, id, () => null);

/** Có bài này trong bộ đệm không (khỏi xin lại bài ngoài màn hình). */
export function postLoaded(qc: QueryClient, id: number): boolean {
  if (qc.getQueryData(feedKeys.post(id))) return true;
  return qc.getQueriesData<InfiniteData<FeedPage>>({ queryKey: [...feedKeys.all, 'list'] })
    .some(([, d]) => d?.pages?.some((pg) => pg.posts.some((p) => p.id === id) || pg.pinned.some((p) => p.id === id)));
}

export async function refreshPost(qc: QueryClient, id: number): Promise<void> {
  try {
    const fresh = await feedApi.get(id);
    patchPost(qc, id, () => fresh);
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) dropPost(qc, id);
  }
}

export function useFeedRealtime(onEvent: (e: FeedEvent) => void, onReconnect?: () => void): void {
  const ev = useRef(onEvent);
  ev.current = onEvent;
  const rc = useRef(onReconnect);
  rc.current = onReconnect;
  useEffect(() => {
    let alive = true;
    let s: Awaited<ReturnType<typeof connectSocket>> | null = null;
    let first = true;
    const subscribe = () => s?.emit('work:feed:subscribe', {}, () => {});
    const onEv = (e: FeedEvent) => ev.current(e);
    const onConnect = () => {
      subscribe();
      if (!first) rc.current?.();
      first = false;
    };
    connectSocket().then((sock) => {
      if (!alive) return;
      s = sock;
      subscribe();
      first = false;
      sock.on('work:feed:event', onEv);
      sock.on('connect', onConnect);
    }).catch(() => undefined);
    return () => {
      alive = false;
      s?.off('work:feed:event', onEv);
      s?.off('connect', onConnect);
    };
  }, []);
}

/** Đổi byte ⇒ chuỗi gọn (25 MB). */
export function mb(n: number): string {
  return n >= 1024 * 1024 ? `${Math.round(n / 1024 / 1024)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}
