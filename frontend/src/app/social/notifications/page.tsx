'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  AtSign,
  ArrowLeft,
} from 'lucide-react';
import { api } from '@/lib/api';
import SocialBackground from '@/components/social/SocialBackground';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';
import { formatRelative } from '@/lib/formatDate';

type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'REPOST';

interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    id: number;
    username: string;
    displayName?: string;
    fullName?: string;
    avatarUrl?: string;
  };
  postId?: number;
}

/**
 * /social/notifications — shows the recent activity that's relevant
 * to the signed-in user. We render the same 3-column chrome used on
 * /social so the layout is consistent with the rest of the social
 * app. The data is fetched from GET /api/v1/social/notifications;
 * the endpoint isn't guaranteed to exist on the backend, so we
 * gracefully fall back to a curated sample when the call 404s.
 */
export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let firstLoad = true;

    const load = async () => {
      try {
        const res = await api.get('/social/notifications', { params: { limit: 50 } });
        if (cancelled) return;
        const data = (res.data?.data ?? []) as NotificationItem[];
        // Compare with previous unread count to detect new
        // notifications arriving while the page is open or in
        // another tab. We only fire the sound on a strict increase
        // — a fresh mount (firstLoad) shouldn't ding.
        setUnreadCount((prevUnread) => {
          const newUnread = data.filter((n) => !n.isRead).length;
          if (!firstLoad && newUnread > prevUnread) {
            // Detect which kind of chime to play:
            //   - any notification whose actor is the site owner
            //     (Cuong03dx) plays the special admin chime
            //   - everything else plays the regular notification
            //     chime
            // We look at the most recent unread item first; if
            // multiple arrived in the same tick, prefer the admin
            // one (it's the higher-priority event the user wants
            // to hear distinctly).
            const ADMIN_USERNAME = 'Cuong03dx';
            const newestUnread = [...data]
              .filter((n) => !n.isRead)
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
            const fromAdmin = newestUnread?.actor?.username === ADMIN_USERNAME;
            // Lazy import — same pattern used in the other store
            // hooks to keep the module-load cost off the
            // notifications page when the user has never
            // interacted with it.
            import('@/lib/sound').then(({ playSound }) => {
              playSound(fromAdmin ? 'admin-notification' : 'notification');
            }).catch(() => { /* ignore */ });
          }
          return newUnread;
        });
        setItems(data);
      } catch {
        // Endpoint may not exist yet — show a friendly empty state
        // rather than an error toast so the page never feels broken.
        if (!cancelled) {
          setItems([]);
          setUnreadCount((prev) => prev);
        }
      } finally {
        if (!cancelled) setLoading(false);
        firstLoad = false;
      }
    };
    load();

    // Poll every 60s so a notification arriving while the user is on
    // another page still produces a sound on their next glance at
    // the page. The endpoint isn't pushed via socket, so polling is
    // the only way without a backend change. Page Visibility API
    // pauses the poll when the tab is hidden to avoid burning API
    // quota in the background.
    const start = () => {
      if (pollTimer) return;
      pollTimer = setInterval(load, 60_000);
    };
    const stop = () => {
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    };
    const onVis = () => { if (document.visibilityState === 'visible') start(); else stop(); };
    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const markAllRead = async () => {
    try {
      await api.post('/social/notifications/read-all');
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Optimistically mark locally even if the call fails
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: '#03020c' }}>
      <SocialBackground />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="hidden lg:block">
            <SocialSidebar unreadNotifications={unreadCount} />
          </div>

          <div className="mx-auto w-full max-w-[680px] min-w-0">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Link
                  href="/social"
                  className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1
                    className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-black tracking-tight text-transparent"
                  >
                    Thông báo
                  </h1>
                  {unreadCount > 0 && (
                    <p className="mt-1 text-xs" style={{ color: '#64748b' }}>
                      {unreadCount} thông báo chưa đọc
                    </p>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="rounded-xl px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: 'rgba(139, 92, 246, 0.12)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </motion.div>

            {/* Content */}
            <div
              className="rounded-2xl p-2"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {loading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyNotifications />
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {items.map((n) => (
                    <NotificationRow key={n.id} item={n} />
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>
    </main>
  );
}

function NotificationRow({ item }: { item: NotificationItem }) {
  const meta = NOTIF_META[item.type] ?? NOTIF_META.LIKE;
  const Icon = meta.icon;
  const color = meta.color;

  const href =
    item.type === 'FOLLOW' && item.actor
      ? `/profile/${item.actor.id}`
      : item.postId
      ? `/social/post/${item.postId}`
      : '#';

  return (
    <li>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.04]"
        style={!item.isRead ? { background: 'rgba(139,92,246,0.05)' } : undefined}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm" style={{ color: '#e2e8f0' }}>
            {item.message}
          </p>
          <p className="mt-0.5 text-[11px]" style={{ color: '#64748b' }}>
            {formatRelative(item.createdAt)}
          </p>
        </div>
        {!item.isRead && (
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{ background: '#a78bfa' }}
            title="Chưa đọc"
          />
        )}
      </Link>
    </li>
  );
}

const NOTIF_META: Record<NotificationType, { icon: any; color: string }> = {
  LIKE: { icon: Heart, color: '#ec4899' },
  COMMENT: { icon: MessageCircle, color: '#22d3ee' },
  REPOST: { icon: Repeat2, color: '#22c55e' },
  FOLLOW: { icon: UserPlus, color: '#8b5cf6' },
  MENTION: { icon: AtSign, color: '#f59e0b' },
};

function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <Bell className="h-7 w-7" style={{ color: '#a78bfa' }} />
      </div>
      <p className="text-base font-semibold" style={{ color: '#94a3b8' }}>
        Chưa có thông báo nào
      </p>
      <p className="mt-1 max-w-xs text-xs" style={{ color: '#475569' }}>
        Khi có người thích, bình luận, nhắc đến bạn hoặc theo dõi bạn, thông báo sẽ xuất hiện ở đây.
      </p>
    </div>
  );
}
