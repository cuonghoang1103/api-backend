'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Headphones,
  MessageCirclePlus,
  Search,
  Pin,
  PinOff,
  BellOff,
  Bell,
  Archive,
  ArchiveRestore,
  CircleDot,
  MoreHorizontal,
  X,
  Inbox,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// iOS-like spring transition — feels premium and "lightweight"
const HOVER_SPRING = 'transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]';

type FilterMode = 'all' | 'unread' | 'pinned' | 'archived';

export default function ThreadList() {
  const store = useMessagingStore();
  const auth = useAuthStore();
  const isAdmin = (auth.user?.roles ?? []).some(
    (r) => r.replace('ROLE_', '').toUpperCase() === 'ADMIN',
  );
  const getPresence = store.getPresence;

  // Search + filter UI state
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [activeMenuThreadId, setActiveMenuThreadId] = useState<number | null>(null);

  // Re-load the thread list when the panel first opens
  useEffect(() => {
    if (!store.threadsLoaded) store.loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close any open row menu when clicking outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activeMenuThreadId) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenuThreadId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeMenuThreadId]);

  const handleStartAdmin = async () => {
    try {
      const id = await store.startAdminThread();
      await store.openThread(id);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể mở cuộc trò chuyện với admin');
    }
  };

  // Filter + search the threads. Pinned threads are always shown
  // in the "Pinned" tab; archive toggle is global via the filter.
  const visibleThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.threads.filter((t) => {
      // Archived filter — global on/off
      const isArchived = !!t.preferences?.archivedAt;
      if (filter === 'archived' && !isArchived) return false;
      if (filter !== 'archived' && isArchived) return false;
      if (filter === 'unread' && (!t.unreadCount || t.unreadCount <= 0)) return false;
      if (filter === 'pinned' && !t.preferences?.pinnedAt) return false;
      if (q) {
        const name = (
          t.peer?.alias ||
          t.peer?.displayName ||
          t.peer?.username ||
          ''
        ).toLowerCase();
        const last = t.lastMessage?.content?.toLowerCase() ?? '';
        if (!name.includes(q) && !last.includes(q)) return false;
      }
      return true;
    });
  }, [store.threads, query, filter]);

  // Counts for the chip labels
  const counts = useMemo(() => {
    const archived = store.threads.filter((t) => t.preferences?.archivedAt).length;
    const pinned = store.threads.filter((t) => t.preferences?.pinnedAt).length;
    const unread = store.threads.filter((t) => (t.unreadCount ?? 0) > 0).length;
    return { archived, pinned, unread, all: store.threads.length };
  }, [store.threads]);

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 flex-col">
      {/* Quick action — chat with admin (sticky) */}
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

      {/* Search input */}
      <div className="shrink-0 px-3 pt-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm cuộc trò chuyện…"
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-1.5 pl-8 pr-7 text-[12px] text-text-primary placeholder:text-text-muted focus:border-cyan-500/40 focus:bg-white/[0.05] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:bg-white/[0.06] hover:text-text-primary"
              aria-label="Xoá tìm kiếm"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips (Messenger-style segmented control) */}
      <div className="shrink-0 px-3 pt-2">
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <FilterChip
            label="Tất cả"
            count={counts.all}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterChip
            label="Chưa đọc"
            count={counts.unread}
            active={filter === 'unread'}
            onClick={() => setFilter('unread')}
            tone="cyan"
          />
          <FilterChip
            label="Ghim"
            count={counts.pinned}
            active={filter === 'pinned'}
            onClick={() => setFilter('pinned')}
          />
          <FilterChip
            label="Lưu trữ"
            count={counts.archived}
            active={filter === 'archived'}
            onClick={() => setFilter('archived')}
          />
        </div>
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
        ) : visibleThreads.length === 0 ? (
          <EmptyState
            filter={filter}
            hasAnyThread={store.threads.length > 0}
            onStartAdmin={handleStartAdmin}
            onClearFilter={() => { setFilter('all'); setQuery(''); }}
          />
        ) : (
          <ul className="space-y-0.5">
            {visibleThreads.map((t) => {
              const presence = t.peer ? getPresence(t.peer.id) : null;
              const isPinned = !!t.preferences?.pinnedAt;
              const mutedUntil = t.preferences?.mutedUntil;
              const isMuted = mutedUntil ? new Date(mutedUntil) > new Date() : false;
              const isArchived = !!t.preferences?.archivedAt;
              return (
                <li key={t.id} className="relative">
                  <button
                    onClick={() => store.openThread(t.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setActiveMenuThreadId(t.id);
                    }}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl p-2.5 text-left',
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
                      online={!!presence?.online}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        {/* Username — primary, full weight, white */}
                        <p className="flex min-w-0 items-center gap-1 truncate text-sm font-semibold text-text-primary">
                          <span className="truncate">
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
                          </span>
                          {isPinned && <Pin className="h-3 w-3 shrink-0 text-amber-400" aria-label="Đã ghim" />}
                          {isMuted && <BellOff className="h-3 w-3 shrink-0 text-text-muted" aria-label="Đã tắt thông báo" />}
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

                  {/* Right-side quick menu trigger (the kebab) — opens the
                      same context menu as right-click. Visible on hover
                      OR when this row's menu is open. */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuThreadId((cur) => (cur === t.id ? null : t.id));
                    }}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted opacity-0 transition-opacity hover:bg-white/[0.08] hover:text-text-primary group-hover:opacity-100',
                      activeMenuThreadId === t.id && 'opacity-100',
                    )}
                    aria-label="Tuỳ chọn cuộc trò chuyện"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>

                  {/* Row context menu — Messenger-style popup with
                      Pin / Mute / Mark unread / Archive. Positioned
                      next to the kebab trigger. */}
                  <AnimatePresence>
                    {activeMenuThreadId === t.id && (
                      <ThreadContextMenu
                        isPinned={isPinned}
                        isMuted={isMuted}
                        isArchived={isArchived}
                        onPin={() => {
                          setActiveMenuThreadId(null);
                          void store.togglePin(t.id).catch((e) =>
                            toast.error('Không thể ghim cuộc trò chuyện'),
                          );
                        }}
                        onMute={() => {
                          setActiveMenuThreadId(null);
                          void store.toggleMute(t.id).catch((e) =>
                            toast.error('Không thể tắt thông báo'),
                          );
                        }}
                        onMarkUnread={() => {
                          setActiveMenuThreadId(null);
                          void store.markThreadUnread(t.id).catch((e) =>
                            toast.error('Không thể đánh dấu chưa đọc'),
                          );
                        }}
                        onArchive={() => {
                          setActiveMenuThreadId(null);
                          if (isArchived) {
                            void store.unarchiveThread(t.id).then(() => {
                              toast.success('Đã bỏ lưu trữ');
                            }).catch(() => toast.error('Không thể bỏ lưu trữ'));
                          } else {
                            void store.archiveThread(t.id).then(() => {
                              toast.success('Đã lưu trữ cuộc trò chuyện');
                            }).catch(() => toast.error('Không thể lưu trữ'));
                          }
                        }}
                        onClose={() => setActiveMenuThreadId(null)}
                      />
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
  tone = 'default',
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  tone?: 'default' | 'cyan';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        active
          ? tone === 'cyan'
            ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200'
            : 'border-white/15 bg-white/[0.08] text-text-primary'
          : 'border-white/[0.05] bg-white/[0.02] text-text-muted hover:bg-white/[0.05] hover:text-text-secondary',
      )}
    >
      <span>{label}</span>
      {typeof count === 'number' && count > 0 && (
        <span
          className={cn(
            'rounded-full px-1 text-[9px] font-bold tabular-nums',
            active ? 'bg-white/15' : 'bg-white/[0.06]',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({
  filter,
  hasAnyThread,
  onStartAdmin,
  onClearFilter,
}: {
  filter: FilterMode;
  hasAnyThread: boolean;
  onStartAdmin: () => void;
  onClearFilter: () => void;
}) {
  let title = 'Bắt đầu bằng cách chat với admin ở trên.';
  let hint: string | null = null;
  if (filter === 'archived') {
    title = 'Chưa có cuộc trò chuyện nào được lưu trữ';
    hint = 'Lưu trữ giúp dọn dẹp danh sách mà vẫn giữ lại lịch sử trò chuyện';
  } else if (filter === 'unread') {
    title = 'Không có cuộc trò chuyện nào chưa đọc';
    hint = 'Bạn đã đọc hết rồi!';
  } else if (filter === 'pinned') {
    title = 'Chưa ghim cuộc trò chuyện nào';
    hint = 'Ghim để cuộc trò chuyện luôn hiển thị ở trên cùng';
  } else if (hasAnyThread) {
    title = 'Không tìm thấy kết quả';
    hint = 'Thử từ khoá khác hoặc xoá bộ lọc';
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-text-muted">
      {filter === 'archived' ? (
        <Archive className="h-8 w-8 opacity-50" />
      ) : filter === 'unread' ? (
        <CircleDot className="h-8 w-8 opacity-50" />
      ) : (
        <MessageCirclePlus className="h-8 w-8 opacity-50" />
      )}
      <p className="text-xs">{title}</p>
      {hint && <p className="text-[10px] opacity-70">{hint}</p>}
      {filter === 'all' && !hasAnyThread && (
        <button
          onClick={onStartAdmin}
          className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-medium text-cyan-200 transition-colors hover:bg-cyan-500/20"
        >
          Chat với Admin ngay
        </button>
      )}
      {(filter !== 'all' || hasAnyThread) && (
        <button
          onClick={onClearFilter}
          className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:bg-white/[0.08]"
        >
          <Inbox className="mr-1 inline h-3 w-3" /> Xem tất cả
        </button>
      )}
    </div>
  );
}

function ThreadContextMenu({
  isPinned,
  isMuted,
  isArchived,
  onPin,
  onMute,
  onMarkUnread,
  onArchive,
  onClose,
}: {
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  onPin: () => void;
  onMute: () => void;
  onMarkUnread: () => void;
  onArchive: () => void;
  onClose: () => void;
}) {
  // Render the menu as a popover anchored to the row. We position
  // it absolutely to the row container so it doesn't reflow the
  // sidebar when opening/closing.
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -2 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={onClose}
      className="absolute right-2 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a14]/95 p-1 shadow-2xl backdrop-blur"
    >
      <MenuItem icon={isPinned ? PinOff : Pin} label={isPinned ? 'Bỏ ghim' : 'Ghim'} onClick={onPin} />
      <MenuItem icon={isMuted ? Bell : BellOff} label={isMuted ? 'Bật thông báo' : 'Tắt thông báo (8h)'} onClick={onMute} />
      <MenuItem icon={CircleDot} label="Đánh dấu chưa đọc" onClick={onMarkUnread} />
      <div className="my-1 border-t border-white/[0.06]" />
      <MenuItem
        icon={isArchived ? ArchiveRestore : Archive}
        label={isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
        onClick={onArchive}
        danger={!isArchived}
      />
    </motion.div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Pin;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-colors',
        danger
          ? 'text-amber-300 hover:bg-amber-500/15'
          : 'text-text-secondary hover:bg-white/[0.06] hover:text-text-primary',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
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
