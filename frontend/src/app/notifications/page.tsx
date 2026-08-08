'use client';

/**
 * /notifications — the full notification history.
 *
 * Until now the only surface was the 360px bell dropdown, which meant
 * anything older than the first page was effectively unreachable and there
 * was no way to filter. This page shares the same store as the bell, so
 * marking something read here updates the badge instantly and vice versa.
 *
 * The rendering rules (label text, deep-link target, icon, colour) are
 * duplicated from NotificationDropdown deliberately for now — they're
 * presentation-only, and the two surfaces already diverge (the dropdown
 * truncates, this page groups by day). Behaviour that MUST agree — read
 * state, unread count, pagination — lives in the shared store.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell, Heart, MessageCircle, AtSign, MessageSquare, UserPlus, UserCheck,
  Check, Loader2, FolderOpen, Share2, Crown, Send, CornerDownRight,
  Settings as SettingsIcon, CheckCheck, Inbox,
} from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import type { SocialNotification, NotificationType } from '@/types/social';
import { cn } from '@/lib/utils';

/* ─── Presentation helpers ───────────────────────────────────────── */

function describeNotification(n: SocialNotification): string {
  const name = n.sender?.displayName || n.sender?.fullName || n.sender?.username || 'Ai đó';
  switch (n.type) {
    case 'NEW_REACTION': {
      const t = (n.payload?.type as string) || 'LIKE';
      const verb =
        t === 'LOVE' ? 'đã thả ❤️ vào' :
        t === 'HAHA' ? 'đã thả 😆 vào' :
        t === 'SAD' ? 'đã thả 😢 vào' :
        t === 'ANGRY' ? 'đã thả 😡 vào' :
        'đã thích';
      return `${name} ${verb} bài viết của bạn`;
    }
    case 'NEW_COMMENT': return `${name} đã bình luận về bài viết của bạn`;
    case 'NEW_REPLY': return `${name} đã trả lời bình luận của bạn`;
    case 'NEW_MENTION': return `${name} đã nhắc đến bạn trong một bình luận`;
    case 'NEW_MESSAGE': return `${name} đã gửi cho bạn một tin nhắn mới`;
    case 'FRIEND_REQUEST': return `${name} đã gửi cho bạn lời mời kết bạn`;
    case 'FRIEND_ACCEPT': return `${name} đã chấp nhận lời mời kết bạn`;
    case 'NEW_FOLLOW': return `${name} đã bắt đầu theo dõi bạn`;
    case 'NOTE_SHARE': return `${name} đã chia sẻ một ghi chú với bạn`;
    case 'HUB_SHARE': return `${name} đã chia sẻ một thư mục tài liệu với bạn`;
    case 'ADMIN_ANNOUNCEMENT': {
      const title = (n.payload?.title as string) || 'Thông báo mới';
      return `Thông báo mới từ Admin: ${title}`;
    }
    case 'NEW_POST':
    default: return `${name} đã đăng bài viết mới`;
  }
}

function typeIcon(t: NotificationType) {
  switch (t) {
    case 'NEW_REACTION': return Heart;
    case 'NEW_COMMENT': return MessageCircle;
    case 'NEW_REPLY': return CornerDownRight;
    case 'NEW_MENTION': return AtSign;
    case 'NEW_MESSAGE': return MessageSquare;
    case 'FRIEND_REQUEST': return UserPlus;
    case 'FRIEND_ACCEPT': return UserCheck;
    case 'NEW_FOLLOW': return UserPlus;
    case 'NOTE_SHARE': return FolderOpen;
    case 'HUB_SHARE': return Share2;
    case 'ADMIN_ANNOUNCEMENT': return Crown;
    case 'NEW_POST': return Send;
    default: return Bell;
  }
}

function typeColor(t: NotificationType): string {
  switch (t) {
    case 'NEW_REACTION': return '#ec4899';
    case 'NEW_COMMENT': return '#3b82f6';
    case 'NEW_REPLY': return '#22d3ee';
    case 'NEW_MENTION': return '#a855f7';
    case 'NEW_MESSAGE': return '#10b981';
    case 'FRIEND_REQUEST': return '#8b5cf6';
    case 'FRIEND_ACCEPT': return '#10b981';
    case 'NEW_FOLLOW': return '#06b6d4';
    case 'NOTE_SHARE': return '#14b8a6';
    case 'HUB_SHARE': return '#f59e0b';
    case 'ADMIN_ANNOUNCEMENT': return '#fbbf24';
    default: return '#8a8d91';
  }
}

function targetUrl(n: SocialNotification): string {
  if (n.type === 'NEW_MESSAGE') {
    if (n.threadId) return `/messages?thread=${n.threadId}`;
    if (n.entityId) return `/messages?thread=${n.entityId}`;
    return '/messages';
  }
  if (n.type === 'FRIEND_REQUEST') return '/friends';
  if (n.type === 'FRIEND_ACCEPT' || n.type === 'NEW_FOLLOW') {
    return n.entityId ? `/profile/${n.entityId}` : '/friends';
  }
  if (n.type === 'NOTE_SHARE') return '/notes';
  if (n.type === 'HUB_SHARE') return '/hub';
  if (n.type === 'ADMIN_ANNOUNCEMENT') return n.entityId ? `/forum/${n.entityId}` : '/forum';
  if (n.entityId) {
    const params = new URLSearchParams();
    params.set('post', String(n.entityId));
    if (
      n.secondaryEntityId &&
      (n.type === 'NEW_COMMENT' || n.type === 'NEW_REPLY' || n.type === 'NEW_MENTION')
    ) {
      params.set('comment', String(n.secondaryEntityId));
    }
    return `/?${params.toString()}`;
  }
  return '/';
}

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

/** Group header: Hôm nay / Hôm qua / a date. Long lists are much easier to
 *  scan when they're broken up by day. */
function dayBucket(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return 'Khác';
  const today = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(today) - startOfDay(d)) / 86_400_000);
  if (diffDays <= 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ─── Filters ────────────────────────────────────────────────────── */

const FILTERS: Array<{ key: string; label: string; types: NotificationType[] | null }> = [
  { key: 'all', label: 'Tất cả', types: null },
  { key: 'social', label: 'Tương tác', types: ['NEW_REACTION', 'NEW_COMMENT', 'NEW_REPLY', 'NEW_MENTION'] as NotificationType[] },
  { key: 'people', label: 'Bạn bè', types: ['FRIEND_REQUEST', 'FRIEND_ACCEPT', 'NEW_FOLLOW'] as NotificationType[] },
  { key: 'messages', label: 'Tin nhắn', types: ['NEW_MESSAGE'] as NotificationType[] },
  { key: 'shares', label: 'Chia sẻ', types: ['NOTE_SHARE', 'HUB_SHARE'] as NotificationType[] },
  { key: 'admin', label: 'Từ Admin', types: ['ADMIN_ANNOUNCEMENT'] as NotificationType[] },
];

export default function NotificationsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Same caveat as settings/layout.tsx: `isHydrated` is not reliable in
  // this app (see useDashboardStore.ts), so gate on `mounted` + the
  // persisted auth key instead of waiting for a flag that may never flip.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const persistedUser = (() => {
    if (!mounted || typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem('auth-storage');
      return !!raw && JSON.parse(raw)?.state?.user != null;
    } catch {
      return false;
    }
  })();
  const signedIn = isAuthenticated || persistedUser;

  const {
    items, unreadCount, isLoading, isLoadingMore, hasNextPage,
    loadInitial, loadMore, markAllRead, markOneRead,
  } = useNotificationStore();

  const [filter, setFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    if (signedIn) void loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter);
    return items.filter((n) => {
      if (unreadOnly && n.isRead) return false;
      if (f?.types && !f.types.includes(n.type)) return false;
      return true;
    });
  }, [items, filter, unreadOnly]);

  const grouped = useMemo(() => {
    const out: Array<{ bucket: string; rows: SocialNotification[] }> = [];
    for (const n of visible) {
      const b = dayBucket(n.createdAt);
      const last = out[out.length - 1];
      if (last && last.bucket === b) last.rows.push(n);
      else out.push({ bucket: b, rows: [n] });
    }
    return out;
  }, [visible]);

  if (mounted && !signedIn) {
    return (
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Vui lòng{' '}
          <button onClick={() => router.push('/login')} className="text-neon-violet hover:underline">
            đăng nhập
          </button>{' '}
          để xem thông báo của bạn.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
            >
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Thông báo
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
                style={{ background: 'var(--bg-card)', color: '#8b5cf6', border: '1px solid var(--border-color)' }}
              >
                <CheckCheck className="h-3.5 w-3.5" /> Đánh dấu đã đọc hết
              </button>
            )}
            <Link
              href="/settings/notifications"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              <SettingsIcon className="h-3.5 w-3.5" /> Cài đặt
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: filter === f.key ? 'rgba(139,92,246,0.14)' : 'var(--bg-card)',
                color: filter === f.key ? '#8b5cf6' : 'var(--text-secondary)',
                border: `1px solid ${filter === f.key ? 'rgba(139,92,246,0.4)' : 'var(--border-color)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setUnreadOnly((v) => !v)}
            className="ml-auto shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: unreadOnly ? 'rgba(59,130,246,0.14)' : 'var(--bg-card)',
              color: unreadOnly ? '#3b82f6' : 'var(--text-secondary)',
              border: `1px solid ${unreadOnly ? 'rgba(59,130,246,0.4)' : 'var(--border-color)'}`,
            }}
          >
            Chỉ chưa đọc
          </button>
        </div>

        {/* List */}
        {isLoading && items.length === 0 ? (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-sm"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải thông báo…
          </div>
        ) : visible.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border px-4 py-16 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <Inbox className="mb-3 h-10 w-10" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {items.length === 0 ? 'Bạn chưa có thông báo nào' : 'Không có thông báo nào khớp bộ lọc'}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              {items.length === 0
                ? 'Khi có tương tác mới, chúng sẽ xuất hiện tại đây.'
                : 'Thử chọn “Tất cả” hoặc tắt “Chỉ chưa đọc”.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {grouped.map(({ bucket, rows }) => (
              <section key={bucket}>
                <h2
                  className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {bucket}
                </h2>
                <ul
                  className="divide-y overflow-hidden rounded-2xl border"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {rows.map((n) => {
                    const Icon = typeIcon(n.type);
                    const color = typeColor(n.type);
                    const display =
                      n.sender?.displayName || n.sender?.fullName || n.sender?.username || 'Người dùng';
                    const avatar = n.sender?.avatarUrl
                      ? n.sender.avatarUrl
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.username ?? 'user'}`;
                    return (
                      <li key={n.id} style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex items-start gap-3 px-4 py-3.5">
                          <Link
                            href={targetUrl(n)}
                            onClick={() => { if (!n.isRead) void markOneRead(n.id); }}
                            className="flex min-w-0 flex-1 items-start gap-3"
                          >
                            <div className="relative shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={avatar}
                                alt={display}
                                className="h-10 w-10 rounded-full object-cover"
                                style={{ border: '1px solid var(--border-color)' }}
                              />
                              <span
                                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
                                style={{ background: color, border: '2px solid var(--bg-card)' }}
                              >
                                <Icon className="h-2.5 w-2.5 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn('text-sm leading-snug', !n.isRead && 'font-medium')}
                                style={{ color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                              >
                                {describeNotification(n)}
                              </p>
                              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                {timeAgo(n.createdAt)}
                              </p>
                            </div>
                          </Link>

                          {!n.isRead && (
                            <button
                              type="button"
                              onClick={() => void markOneRead(n.id)}
                              title="Đánh dấu đã đọc"
                              aria-label="Đánh dấu đã đọc"
                              className="mt-1 shrink-0 rounded-lg p-1.5 transition-colors hover:opacity-70"
                              style={{ color: '#3b82f6' }}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {hasNextPage && (
              <div className="flex justify-center pb-6">
                <button
                  type="button"
                  onClick={() => loadMore()}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {isLoadingMore ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</>
                  ) : (
                    'Xem thêm thông báo cũ hơn'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
