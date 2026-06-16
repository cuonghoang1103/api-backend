'use client';

import { useEffect } from 'react';
import { ShieldCheck, MessageCirclePlus } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

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
          className="flex w-full items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.08] px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-cyan-500/[0.15]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}>
            <ShieldCheck className="h-4 w-4 text-white" />
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
          <ul className="space-y-1">
            {store.threads.map((t) => {
              const presence = t.peer ? getPresence(t.peer.id) : null;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => store.openThread(t.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors',
                      'hover:bg-white/[0.04]',
                      store.currentThreadId === t.id && 'bg-white/[0.06]',
                    )}
                  >
                    <Avatar
                      src={t.peer?.avatarUrl}
                      name={t.peer?.displayName ?? t.peer?.username ?? '?'}
                      badge={t.type === 'ADMIN' ? 'admin' : null}
                      online={presence?.online ?? false}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-text-primary">
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
                        {t.lastMessageAt && (
                          <span className="shrink-0 text-[10px] text-text-muted">
                            {formatDistanceToNow(new Date(t.lastMessageAt), { addSuffix: false, locale: vi })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[11px] text-text-muted">
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
      {/* Online dot — always shown when peer is known. If lastSeen
          is recent we treat as online; otherwise offline. The
          presence store updates in real time via socket events. */}
      {badge !== 'admin' && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0a0a14]',
            online ? 'bg-emerald-400' : 'bg-zinc-500',
          )}
          title={online ? 'Đang hoạt động' : 'Ngoại tuyến'}
        />
      )}
      {badge === 'admin' && (
        <span
          className={cn(
            'absolute -bottom-0.5 right-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0a0a14]',
            online ? 'bg-emerald-400' : 'bg-zinc-500',
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
