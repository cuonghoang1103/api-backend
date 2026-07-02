'use client';

/**
 * NotificationDropdown (added 2026-06-20)
 * ========================================
 *
 * Floating panel for the navbar bell icon. Lists the latest
 * social notifications in a Facebook-style layout:
 *   - sender avatar (left)
 *   - type-aware body text (e.g. "Lan vừa thả ❤️ vào bài viết của bạn")
 *   - relative time (e.g. "2 phút trước")
 *   - blue dot for unread
 *   - click → mark read + deep-link to the target
 *
 * The panel is rendered into a `React.createPortal` so it can
 * escape any parent stacking context. Positioning is dynamic
 * via `getBoundingClientRect()` of the anchor bell.
 *
 * No new dependencies — uses framer-motion, lucide-react, and
 * the existing notificationStore.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Heart,
  MessageCircle,
  AtSign,
  MessageSquare,
  User as UserIcon,
  UserPlus,
  UserCheck,
  Check,
  X,
  Loader2,
  FolderOpen,
  Share2,
} from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import type { SocialNotification, NotificationType } from '@/types/social';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  /** Anchor element (the bell). The dropdown positions itself
   *  relative to this rect. */
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

/** Render a human-friendly sentence for each notification type.
 *  The "actor" + "target" structure keeps us from duplicating
 *  the JSX template per type. */
function describeNotification(n: SocialNotification): string {
  const name = n.sender?.displayName || n.sender?.fullName || n.sender?.username || 'Ai đó';
  switch (n.type) {
    case 'NEW_REACTION': {
      const t = (n.payload?.type as string) || 'LIKE';
      const verb =
        t === 'LOVE' ? 'đã thả ❤️ vào' :
        t === 'HAHA' ? 'đã thả 😆 vào' :
        t === 'SAD'  ? 'đã thả 😢 vào' :
        t === 'ANGRY'? 'đã thả 😡 vào' :
        'đã thích';
      return `${name} ${verb} bài viết của bạn`;
    }
    case 'NEW_COMMENT':
      return `${name} đã bình luận về bài viết của bạn`;
    case 'NEW_REPLY':
      return `${name} đã trả lời bình luận của bạn`;
    case 'NEW_MENTION':
      return `${name} đã nhắc đến bạn trong một bình luận`;
    case 'NEW_MESSAGE':
      return `${name} đã gửi cho bạn một tin nhắn mới`;
    case 'FRIEND_REQUEST':
      return `${name} đã gửi cho bạn lời mời kết bạn`;
    case 'FRIEND_ACCEPT':
      return `${name} đã chấp nhận lời mời kết bạn`;
    case 'NEW_FOLLOW':
      return `${name} đã bắt đầu theo dõi bạn`;
    case 'NOTE_SHARE':
      return `${name} đã chia sẻ một ghi chú với bạn`;
    case 'HUB_SHARE':
      return `${name} đã chia sẻ một thư mục tài liệu với bạn`;
    case 'NEW_POST':
    default:
      return `${name} đã đăng bài viết mới`;
  }
}

function typeIcon(t: NotificationType) {
  switch (t) {
    case 'NEW_REACTION': return Heart;
    case 'NEW_COMMENT': return MessageCircle;
    case 'NEW_REPLY': return MessageCircle;
    case 'NEW_MENTION': return AtSign;
    case 'NEW_MESSAGE': return MessageSquare;
    case 'FRIEND_REQUEST': return UserPlus;
    case 'FRIEND_ACCEPT': return UserCheck;
    case 'NEW_FOLLOW': return UserPlus;
    case 'NOTE_SHARE': return FolderOpen;
    case 'HUB_SHARE': return Share2;
    default: return Bell;
  }
}

function typeIconColor(t: NotificationType): string {
  switch (t) {
    case 'NEW_REACTION': return '#ec4899'; // pink
    case 'NEW_COMMENT': return '#3b82f6'; // blue
    case 'NEW_REPLY': return '#22d3ee'; // cyan
    case 'NEW_MENTION': return '#a855f7'; // violet
    case 'NEW_MESSAGE': return '#10b981'; // green
    case 'FRIEND_REQUEST': return '#8b5cf6'; // violet
    case 'FRIEND_ACCEPT': return '#10b981'; // green
    case 'NEW_FOLLOW': return '#06b6d4'; // cyan
    case 'NOTE_SHARE': return '#14b8a6'; // teal
    case 'HUB_SHARE': return '#f59e0b'; // amber
    default: return '#94a3b8';
  }
}

/** Relative time string in Vietnamese. Mirrors the formatter
 *  used elsewhere in the app so the labels feel consistent. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

/** Pick a target URL for a notification. We deep-link to the
 *  entity wherever possible; fall back to the social feed. */
function targetUrl(n: SocialNotification): string {
  if (n.type === 'NEW_MESSAGE') {
    // Backend reserves threadId for NEW_MESSAGE but the existing
    // REST endpoint doesn't surface it today. If the row carries
    // one (e.g. an older payload or a future server fix), use it
    // to deep-link straight into the right conversation; otherwise
    // fall back to the messages inbox. Either way the user lands
    // in the messenger, not on the home page.
    if (n.threadId) return `/messages?thread=${n.threadId}`;
    if (n.entityId) return `/messages?thread=${n.entityId}`;
    return '/messages';
  }
  // Friend graph + follow: entityId is the ACTOR's user id, not a post.
  if (n.type === 'FRIEND_REQUEST') return '/friends';
  if (n.type === 'FRIEND_ACCEPT' || n.type === 'NEW_FOLLOW') {
    return n.entityId ? `/profile/${n.entityId}` : '/friends';
  }
  // Sharing notifications: entityId is the subject/folder id
  if (n.type === 'NOTE_SHARE') return '/notes';
  if (n.type === 'HUB_SHARE') return '/hub';
  if (n.entityId) {
    // entityId for social notifications is the post id. For
    // post-targeted events (NEW_REACTION, NEW_POST) that's the
    // whole story. For comment-targeted events (NEW_COMMENT,
    // NEW_REPLY, NEW_MENTION) the comment id lives in
    // secondaryEntityId and the user expects to be taken to the
    // specific comment, not just the post — we add ?comment=N
    // so the home page can open the comments section, scroll
    // there, and highlight the right item.
    const params = new URLSearchParams();
    params.set('post', String(n.entityId));
    if (
      n.secondaryEntityId &&
      (n.type === 'NEW_COMMENT' ||
        n.type === 'NEW_REPLY' ||
        n.type === 'NEW_MENTION')
    ) {
      params.set('comment', String(n.secondaryEntityId));
    }
    return `/?${params.toString()}`;
  }
  return '/';
}

export default function NotificationDropdown({ anchor, open, onClose }: NotificationDropdownProps) {
  const { items, unreadCount, isLoading, isLoadingMore, hasNextPage, loadInitial, loadMore, markAllRead } =
    useNotificationStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Re-position on every open so the panel stays glued to the
  // bell even after the user resizes the window. We use
  // useLayoutEffect (not useEffect) to avoid a flash where the
  // panel renders at (0,0) for one frame.
  useLayoutEffect(() => {
    if (!open || !anchor) return;
    const place = () => {
      const r = anchor.getBoundingClientRect();
      const PANEL_WIDTH = 360;
      // Prefer the right edge of the bell; if there's not
      // enough room we flip to the left side.
      const left = Math.max(8, Math.min(window.innerWidth - PANEL_WIDTH - 8, r.right - PANEL_WIDTH));
      const top = r.bottom + 8;
      setPos({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, anchor]);

  // Close on outside-click. We listen on the document so a
  // click on the bell itself is also detected (the bell
  // toggles, which calls onClose() via its own handler).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (dropdownRef.current && dropdownRef.current.contains(t)) return;
      if (anchor && anchor.contains(t)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, anchor, onClose]);

  // Hydrate the list on first open; refresh the "mark as read"
  // badge too. We DO NOT call markAllRead on open automatically
  // — the user might just want to peek — but we expose a
  // dedicated "Đánh dấu đã đọc" button below.
  useEffect(() => {
    if (open && isAuthenticated) {
      // Only fetch if we don't have any items yet. Subsequent
      // opens reuse the cached list and rely on the socket
      // push to keep it fresh.
      if (items.length === 0) loadInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAuthenticated]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const content = useMemo(() => {
    if (isLoading && items.length === 0) {
      return (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tải thông báo...
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Bell className="w-10 h-10 text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">Bạn chưa có thông báo nào</p>
          <p className="text-xs text-slate-500 mt-1">Khi có tương tác mới, chúng sẽ xuất hiện tại đây.</p>
        </div>
      );
    }
    return (
      <ul className="divide-y divide-white/[0.06]">
        {items.map((n) => {
          const Icon = typeIcon(n.type);
          const color = typeIconColor(n.type);
          const avatar = n.sender?.avatarUrl
            ? n.sender.avatarUrl
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.username ?? 'user'}`;
          const display = n.sender?.displayName || n.sender?.fullName || n.sender?.username || 'Người dùng';
          return (
            <li key={n.id}>
              <Link
                href={targetUrl(n)}
                onClick={() => {
                  if (!n.isRead) {
                    // Optimistic: mark this single row as read.
                    // (The bulk markAllRead is exposed via the
                    // dedicated button at the top.)
                    useNotificationStore.setState((s) => ({
                      items: s.items.map((it) => (it.id === n.id ? { ...it, isRead: true } : it)),
                      unreadCount: Math.max(0, s.unreadCount - 1),
                    }));
                  }
                  onClose();
                }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 transition-colors',
                  'hover:bg-white/[0.04]',
                  !n.isRead && 'bg-violet-500/[0.05]',
                )}
              >
                <div className="relative shrink-0">
                  <img
                    src={avatar}
                    alt={display}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0d1117]"
                    style={{ background: color }}
                  >
                    <Icon className="w-2.5 h-2.5 text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm leading-snug', n.isRead ? 'text-slate-300' : 'text-white')}>
                    {describeNotification(n)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <span
                    aria-label="Chưa đọc"
                    className="mt-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)] shrink-0"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isLoading]);

  if (!open || typeof document === 'undefined') return null;
  if (!pos) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="notif-dropdown"
        ref={dropdownRef}
        initial={{ opacity: 0, y: -6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.96 }}
        transition={{ duration: 0.16, ease: [0.32, 0.94, 0.6, 1] }}
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: 360,
          maxHeight: 'min(520px, calc(100dvh - 80px))',
          zIndex: 9999,
        }}
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl',
          'bg-[#0d1117]/95 backdrop-blur-2xl',
          'border border-white/10',
          'shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
          <div>
            <p className="text-sm font-semibold text-white">Thông báo</p>
            {unreadCount > 0 && (
              <p className="text-[11px] text-slate-400">{unreadCount} chưa đọc</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1 text-[11px] text-violet-300 hover:text-violet-200 px-2 py-1 rounded-md hover:bg-white/5"
              >
                <Check className="w-3 h-3" />
                Đánh dấu đã đọc
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {content}
        </div>

        {/* Footer — load more */}
        {hasNextPage && items.length > 0 && (
          <div className="border-t border-white/[0.08] px-4 py-2">
            <button
              type="button"
              onClick={() => loadMore()}
              disabled={isLoadingMore}
              className="w-full text-xs text-slate-300 hover:text-white py-1.5 rounded-md hover:bg-white/5 inline-flex items-center justify-center gap-1.5"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang tải...
                </>
              ) : (
                'Xem thêm thông báo cũ hơn'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}