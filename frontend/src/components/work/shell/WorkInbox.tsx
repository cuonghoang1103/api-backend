'use client';

/**
 * Hộp thư CT Work — chuông trong sidebar. Navbar của site bị ẩn ở /work nên
 * người dùng không thấy thông báo WORK_* (giao việc, bình luận, nhắc tên…).
 *
 * Dùng lại API + store thông báo của site (chỉ ĐỌC, không sửa store):
 *   - tải 50 thông báo mới nhất rồi lọc loại bắt đầu bằng `WORK_`;
 *   - gộp thêm các mục store nhận qua socket `social:notification` (thời gian thực);
 *   - đánh dấu đã đọc CHỈ các mục WORK_ (không đụng thông báo mạng xã hội).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AtSign, Bell, BellRing, CheckCheck, MessageCircle, UserCheck, UserPlus } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import type { SocialNotification } from '@/types/social';
import { cn } from '@/lib/utils';
import { Popover, relativeTime, Spinner, UserAvatar, useToggle } from '../ui';

const INBOX_KEY = ['work', 'inbox'] as const;

const isWork = (n: SocialNotification) => typeof n.type === 'string' && n.type.startsWith('WORK_');

const str = (v: unknown) => (typeof v === 'string' ? v : '');

function actorName(n: SocialNotification) {
  return n.sender?.displayName || n.sender?.fullName || n.sender?.username || 'Someone';
}

/** Câu tiếng Anh cho một thông báo, vd "Minh assigned you SHOP-12: Checkout page". */
export function describeWorkNotification(n: SocialNotification): { actor: string; text: string } {
  const p = n.payload ?? {};
  const key = str(p.issueKey) || 'an issue';
  const title = str(p.title);
  const target = `${key}${title ? `: ${title}` : ''}`;
  const actor = actorName(n);
  switch (n.type) {
    case 'WORK_INVITE': return { actor, text: `added you to ${str(p.workspaceName) || 'a workspace'}` };
    case 'WORK_ASSIGN': return { actor, text: `assigned you ${target}` };
    case 'WORK_COMMENT': return { actor, text: `commented on ${target}` };
    case 'WORK_MENTION': return { actor, text: `mentioned you in ${target}` };
    case 'WORK_ALERT': return { actor: '', text: `${key}: ${str(p.message) || 'needs your attention'}` };
    default: return { actor, text: `updated ${target}` };
  }
}

/** Chỉ theo đường dẫn nội bộ /work/... (chặn open redirect). */
function workUrl(n: SocialNotification): string {
  const url = n.payload?.url;
  return typeof url === 'string' && url.startsWith('/work/') && !url.startsWith('//') ? url : '/work';
}

function TypeIcon({ type }: { type: string }) {
  const Icon = type === 'WORK_INVITE' ? UserPlus : type === 'WORK_ASSIGN' ? UserCheck : type === 'WORK_COMMENT' ? MessageCircle : type === 'WORK_MENTION' ? AtSign : BellRing;
  return (
    <span className="absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full border-2 border-[var(--w-raised)] bg-[var(--w-accent)] text-white">
      <Icon size={9} strokeWidth={2.5} />
    </span>
  );
}

export default function WorkInbox({ onNavigate }: { onNavigate?: () => void }) {
  useNotificationSocket(); // idempotent — navbar thường đã gắn rồi
  const router = useRouter();
  const qc = useQueryClient();
  const pop = useToggle();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [readIds, setReadIds] = useState<Set<number>>(() => new Set());

  const q = useQuery({
    queryKey: INBOX_KEY,
    queryFn: async () => {
      const res = await notificationApi.list({ limit: 50 });
      return (res.data.data.items ?? []).filter(isWork);
    },
    staleTime: 30_000,
    refetchInterval: 120_000,
  });
  const live = useNotificationStore((s) => s.items);

  // Mở hộp ⇒ tải lại cho chắc (thông báo đọc ở thiết bị khác).
  useEffect(() => {
    if (pop.on) q.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop.on]);

  const items = useMemo(() => {
    const map = new Map<number, SocialNotification>();
    for (const n of q.data ?? []) map.set(n.id, n);
    for (const n of live) {
      if (!isWork(n) || n.id <= 0) continue;
      const old = map.get(n.id);
      map.set(n.id, old ? { ...old, isRead: old.isRead || n.isRead } : n);
    }
    return [...map.values()]
      .map((n) => (readIds.has(n.id) ? { ...n, isRead: true } : n))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  }, [q.data, live, readIds]);

  const unread = items.filter((n) => !n.isRead);

  /** Đánh dấu đọc ở máy chủ + đồng bộ store của site (badge navbar). */
  const markRead = async (ids: number[]) => {
    if (!ids.length) return;
    setReadIds((s) => new Set([...s, ...ids]));
    const set = new Set(ids);
    useNotificationStore.setState((s) => ({ items: s.items.map((n) => (set.has(n.id) ? { ...n, isRead: true } : n)) }));
    try {
      await notificationApi.markRead({ ids });
    } catch {
      setReadIds((s) => { const next = new Set(s); ids.forEach((i) => next.delete(i)); return next; });
    }
    useNotificationStore.getState().syncUnreadCount();
    qc.invalidateQueries({ queryKey: INBOX_KEY });
  };

  const open = (n: SocialNotification) => {
    if (!n.isRead) void markRead([n.id]);
    pop.close();
    onNavigate?.();
    router.push(workUrl(n));
  };

  const count = unread.length;
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={pop.toggle}
        aria-label={count ? `Notifications, ${count} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={pop.on}
        title="Notifications"
        className={cn(
          'w-nav-row relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[var(--w-text-2)] transition-colors hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
          pop.on && 'bg-[var(--w-active)] text-[var(--w-text)]',
        )}
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--w-red)] px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={btnRef} width={360}>
        <div role="dialog" aria-label="CT Work notifications">
          <div className="flex items-center justify-between border-b border-[var(--w-border)] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold">Inbox</span>
              {count > 0 && <span className="rounded-full bg-[var(--w-accent-soft)] px-1.5 text-[12px] font-medium text-[var(--w-accent-text)]">{count} new</span>}
            </div>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={!count} onClick={() => markRead(unread.map((n) => n.id))}>
              <CheckCheck size={14} /> Mark all as read
            </button>
          </div>
          <div className="max-h-[min(460px,65vh)] overflow-y-auto p-1">
            {q.isLoading && !items.length ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : !items.length ? (
              <div className="px-6 py-10 text-center">
                <Bell size={22} className="mx-auto text-[var(--w-text-3)]" />
                <div className="mt-2 text-[14px] font-medium">You&apos;re all caught up</div>
                <p className="mt-1 text-[13px] text-[var(--w-text-2)]">Assignments, comments and mentions from your projects will show up here.</p>
              </div>
            ) : (
              items.map((n) => {
                const d = describeWorkNotification(n);
                const excerpt = str(n.payload?.excerpt);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => open(n)}
                    className={cn('flex w-full items-start gap-3 rounded-[6px] px-2.5 py-2.5 text-left transition-colors hover:bg-[var(--w-hover)]', !n.isRead && 'bg-[color-mix(in_srgb,var(--w-accent)_7%,transparent)]')}
                  >
                    <span className="relative mt-0.5 shrink-0">
                      <UserAvatar user={n.sender ? { username: n.sender.username, fullName: n.sender.fullName, displayName: n.sender.displayName ?? null, avatarUrl: n.sender.avatarUrl } : null} size={28} />
                      <TypeIcon type={n.type} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] leading-snug text-[var(--w-text)]">
                        {d.actor && <span className="font-semibold">{d.actor} </span>}
                        <span className={cn(n.isRead && 'text-[var(--w-text-2)]')}>{d.text}</span>
                      </span>
                      {excerpt && <span className="mt-0.5 line-clamp-1 block text-[12px] text-[var(--w-text-2)]">“{excerpt}”</span>}
                      <span className="mt-0.5 block text-[12px] text-[var(--w-text-3)]">{relativeTime(n.createdAt)}</span>
                    </span>
                    {!n.isRead && <span aria-label="Unread" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--w-accent)]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Popover>
    </>
  );
}
