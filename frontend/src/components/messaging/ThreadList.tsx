'use client';

import { useEffect } from 'react';
import { Headphones, MessageCirclePlus } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// iOS-like spring transition — feels premium and "lightweight"
const HOVER_SPRING = 'transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]';

export default function ThreadList() {
  const store = useMessagingStore();
  const auth = useAuthStore();
  const isAdmin = (auth.user?.roles ?? []).some(
    (r) => r.replace('ROLE_', '').toUpperCase() === 'ADMIN',
  );
  const getPresence = store.getPresence;

  // Re-load the thread list when the panel first opens
  useEffect(() => {
    if (!store.threadsLoaded) store.loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartAdmin = async () => {
    try {
      const id = await store.startAdminThread();
      await store.openThread(id);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện với admin');
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-1.5 border-b border-white/[0.04] p-3">
        <button
          onClick={handleStartAdmin}
          className={cn(
            'group flex w-full items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.08] px-3 py-2.5 text-left text-sm text-text-primary',
            HOVER_SPRING,
            'hover:scale-[1.01] hover:border-cyan-500/30 hover:bg-cyan-500/[0.12] hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)] active:scale-[0.99]',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}>
            <Headphones className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">Hỗ trợ từ Admin</p>
            <p className="truncate text-[11px] text-text-muted">
              {isAdmin ? 'Mở thread hỗ trợ của bạn' : 'Chat trực tiếp với admin'}
            </p>
          </div>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
        {store.threadsLoading && !store.threadsLoaded ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>
        ) : store.threads.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-text-muted">
            <MessageCirclePlus className="h-8 w-8 opacity-50" />
            <p className="text-xs">Bắt đầu bằng cách chat với admin ở trên.</p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {store.threads.map((t) => {
              const presence = t.peer ? getPresence(t.peer.id) : null;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => store.openThread(t.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl p-2.5 text-left',
                      HOVER_SPRING,
                      'hover:scale-[1.005] hover:bg-white/[0.04] active:scale-[0.995]',
                      store.currentThreadId === t.id &&
                        // Active state uses a soft cyan tint with a left
                        // accent bar so the selected row is unmistakable
                        // without screaming for attention.
                        'bg-cyan-500/[0.08] shadow-[inset_2px_0_0_0_rgba(6,182,212,0.7)]',
                    )}
                  >
                    <Avatar
                      src={t.peer?.avatarUrl}
                      name={t.peer?.displayName ?? t.peer?.username ?? '?'}
                      badge={t.type === 'ADMIN' ? 'admin' : null}
                      online={presence?.online ?? false}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        {/* Username — primary, full weight, white */}
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {t.peer ? (
                            t.peer.alias ? (
                              <>
                                <span className="text-amber-300">{t.peer.alias}</span>
                                <span className="ml-1 text-[10px] font-normal text-text-muted">(@{t.peer.username ?? 'unknown'})</span>
                              </>
                            ) : (
                              t.peer.displayName ?? t.peer.username ?? 'Cuộc trò chuyện'
                            )
                          ) : (
                            'Cuộc trò chuyện'
                          )}
                        </p>
                        {/* Timestamp — moved closer to username, smaller,
                            muted. `tabular-nums` keeps the digits from
                            jumping around as minutes tick over. */}
                        {t.lastMessageAt && (
                          <span className="shrink-0 text-[10px] font-normal tabular-nums text-text-muted/80">
                            {formatDistanceToNow(new Date(t.lastMessageAt), { addSuffix: false, locale: vi })}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {/* Preview — clearly lighter than the username
                            above to establish text hierarchy. */}
                        <p className="truncate text-[11.5px] font-normal text-text-muted/70">
                          {t.lastMessage?.hasAttachment ? (
                            <>
                              <span className="text-cyan-400">📎</span> {t.lastMessage.attachmentName ?? 'Đính kèm'}
                            </>
                          ) : (
                            t.lastMessage?.content || <span className="italic opacity-60">Chưa có tin nhắn</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {t.unreadCount && t.unreadCount > 0 ? (
                      <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1.5 text-[10px] font-bold text-white">
                        {t.unreadCount}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Avatar({ src, name, badge, online }: { src?: string | null; name: string; badge: 'admin' | null; online: boolean }) {
  return (
    <div className="relative h-10 w-10 shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {badge === 'admin' && <AdminBadge />}
      {/* Online dot — properly overlapping the avatar's bottom-right
          corner using a 2px ring that matches the row background. The
          dot is `h-3 w-3` (slightly larger than the previous 2.5) so
          the status is actually readable at a glance. */}
      {badge !== 'admin' && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2',
            // Slightly larger ring uses a translucent color so the dot
            // "punches out" of any background the row happens to be on
            // (hover, active, default).
            online
              ? 'bg-emerald-400 ring-[#0a0a14] shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              : 'bg-zinc-500 ring-[#0a0a14]',
          )}
          title={online ? 'Đang hoạt động' : 'Ngoại tuyến'}
        />
      )}
      {badge === 'admin' && (
        <span
          className={cn(
            'absolute -bottom-0.5 right-1.5 h-3 w-3 rounded-full ring-2 ring-[#0a0a14]',
            online
              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              : 'bg-zinc-500',
          )}
          title={online ? 'Đang hoạt động' : 'Ngoại tuyến'}
        />
      )}
    </div>
  );
}

function AdminBadge() {
  return (
    <span
      className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold text-black"
      style={{ boxShadow: '0 0 0 2px #0a0a14' }}
      aria-label="Admin"
    >
      ★
    </span>
  );
}
