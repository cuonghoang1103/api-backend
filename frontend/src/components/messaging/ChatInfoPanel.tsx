'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  X,
  UserRound,
  Bell,
  BellOff,
  Search,
  ChevronDown,
  FileText,
  Download,
  ShieldOff,
  Archive,
  Trash2,
  Flag,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import type { MessagingThread } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import NicknamePopover from './NicknamePopover';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com';

// Ensure attachment/media URLs are absolute. Old serializer produced
// relative "/uploads/..." paths; new serializer returns full URLs.
// Mirrors the same helper in MessageBubble so cached/old messages
// resolve identically here.
function resolveUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

type MediaImage = { key: string; url: string };
type MediaFile = { key: string; url: string; name: string };

/**
 * Facebook-Messenger-style "chat info" panel — the right-hand
 * column on desktop. Fully self-contained: the parent only needs
 * to render `<ChatInfoPanel thread={currentThread} onClose={…} />`.
 *
 * Layout (top → bottom):
 *  - Big centered avatar + display name + active status
 *  - Row of 3 round action buttons (profile / mute / search)
 *  - Collapsible sections:
 *      • Tuỳ chỉnh đoạn chat  → NicknamePopover
 *      • File phương tiện & file → media/file grid from cache
 *      • Quyền riêng tư & hỗ trợ → block / archive / delete / report
 */
export default function ChatInfoPanel({
  thread,
  onClose,
}: {
  thread: MessagingThread;
  onClose?: () => void;
}) {
  const peer = thread.peer;
  // Subscribe to presence so the "active" line updates live.
  const presence = useMessagingStore((s) => s.presence);
  const messages = useMessagingStore((s) => s.messagesByThread[thread.id]);
  const store = useMessagingStore.getState();
  // Selector must be called unconditionally (Rules of Hooks); guard
  // the peer inside it.
  const isBlocked = useMessagingStore((s) => (peer ? s.isBlocked(peer.id) : false));

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customize: false,
    media: true,
    privacy: false,
  });
  const toggle = (k: string) =>
    setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  const displayName =
    peer?.alias || peer?.displayName || peer?.username || 'Cuộc trò chuyện';

  // Presence line
  const presenceInfo = peer ? presence.byUserId[peer.id] : undefined;
  const isOnline = !!presenceInfo?.online;
  let statusLine: string;
  if (thread.type === 'ADMIN') {
    statusLine = 'Hỗ trợ từ Admin';
  } else if (!peer) {
    statusLine = '';
  } else if (isOnline) {
    statusLine = 'Đang hoạt động';
  } else if (presenceInfo?.lastSeen) {
    statusLine = `Hoạt động ${formatDistanceToNow(new Date(presenceInfo.lastSeen), { addSuffix: true, locale: vi })}`;
  } else {
    statusLine = 'Ngoại tuyến';
  }

  // Mute state
  const mutedUntil = thread.preferences?.mutedUntil;
  const isMuted = mutedUntil ? new Date(mutedUntil) > new Date() : false;

  // ── Aggregate media & files from the cached messages ──────────
  const { images, files } = useMemo(() => {
    const imgs: MediaImage[] = [];
    const fls: MediaFile[] = [];
    for (const m of messages ?? []) {
      if (m.deleted || m.recalled) continue;
      // GIF / sticker media are always images.
      if (m.mediaUrl) {
        imgs.push({ key: `m-${m.id}`, url: resolveUrl(m.mediaUrl) });
      }
      for (const a of m.attachments ?? []) {
        if (a.mimeType?.startsWith('image/')) {
          imgs.push({
            key: `a-${a.id}`,
            url: resolveUrl(a.thumbnailUrl || a.url),
          });
        } else {
          fls.push({ key: `a-${a.id}`, url: resolveUrl(a.url), name: a.fileName });
        }
      }
    }
    return { images: imgs, files: fls };
  }, [messages]);

  // ── Privacy / support actions ─────────────────────────────────
  const handleMuteToggle = async () => {
    try {
      if (isMuted) {
        await store.muteFor(thread.id, 0);
        toast.success('Đã bật thông báo');
      } else {
        await store.muteFor(thread.id, null);
        toast.success('Đã tắt thông báo');
      }
    } catch {
      toast.error('Không thể thay đổi cài đặt thông báo');
    }
  };

  const handleBlockToggle = async () => {
    if (!peer) return;
    if (isBlocked) {
      if (!confirm(`Bỏ chặn ${displayName}?`)) return;
      try {
        await store.unblockUser(peer.id);
        toast.success('Đã bỏ chặn người dùng');
      } catch {
        toast.error('Không thể bỏ chặn');
      }
    } else {
      if (!confirm(`Chặn ${displayName}? Họ sẽ không thể nhắn tin cho bạn.`)) return;
      try {
        await store.blockUser(peer.id);
        toast.success('Đã chặn người dùng');
      } catch (e: any) {
        toast.error(e?.userFriendlyMessage ?? 'Không thể chặn người dùng');
      }
    }
  };

  const handleArchive = async () => {
    try {
      await store.archiveThread(thread.id);
      toast.success('Đã lưu trữ cuộc trò chuyện');
    } catch {
      toast.error('Không thể lưu trữ');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Xoá cuộc trò chuyện với ${displayName}? Hành động này không thể hoàn tác.`)) return;
    try {
      await store.deleteChat(thread.id);
      toast.success('Đã xoá cuộc trò chuyện');
    } catch {
      toast.error('Không thể xoá cuộc trò chuyện');
    }
  };

  const handleReport = async () => {
    const reason = prompt('Lý do báo cáo cuộc trò chuyện này?');
    if (!reason || !reason.trim()) return;
    try {
      await store.reportThread(thread.id, { reason: reason.trim(), category: 'other' });
      toast.success('Đã gửi báo cáo tới quản trị viên');
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? 'Không thể gửi báo cáo');
    }
  };

  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-white/[0.06] bg-[#141522]">
      {/* Close (only when the parent wants a dismissable panel) */}
      {onClose && (
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header — big avatar + name + status */}
      <div className={cn('flex flex-col items-center gap-2 px-4 pb-4', !onClose && 'pt-6')}>
        <div className="relative h-20 w-20">
          {peer?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={peer.avatarUrl}
              alt={displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {thread.type !== 'ADMIN' && peer && (
            <span
              className={cn(
                'absolute bottom-1 right-1 h-4 w-4 rounded-full ring-2 ring-[#141522]',
                isOnline
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : 'bg-zinc-500',
              )}
            />
          )}
        </div>
        <p className="text-center text-lg font-semibold text-text-primary">{displayName}</p>
        {statusLine && <p className="text-center text-xs text-text-muted">{statusLine}</p>}
      </div>

      {/* Row of 3 round action buttons */}
      <div className="flex items-start justify-center gap-6 px-4 pb-4">
        {peer ? (
          <ActionButton as="link" href={`/profile/${peer.id}`} icon={UserRound} label="Trang cá nhân" />
        ) : (
          <ActionButton icon={UserRound} label="Trang cá nhân" disabled title="Không có hồ sơ" />
        )}
        <ActionButton
          icon={isMuted ? Bell : BellOff}
          label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          onClick={handleMuteToggle}
        />
        <ActionButton icon={Search} label="Tìm kiếm" disabled title="Sắp có" />
      </div>

      {/* Collapsible sections */}
      <div className="flex flex-col gap-1 px-2 pb-6">
        <Section
          title="Tuỳ chỉnh đoạn chat"
          open={openSections.customize}
          onToggle={() => toggle('customize')}
        >
          <div className="px-2 py-1">
            {peer ? (
              <NicknamePopover thread={thread} />
            ) : (
              <p className="text-[12px] text-text-muted">Không khả dụng</p>
            )}
          </div>
        </Section>

        <Section
          title="File phương tiện & file"
          open={openSections.media}
          onToggle={() => toggle('media')}
        >
          {images.length === 0 && files.length === 0 ? (
            <p className="px-2 py-2 text-[12px] text-text-muted">Chưa có file nào</p>
          ) : (
            <div className="space-y-3 px-2 py-1">
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-1">
                  {images.map((img) => (
                    <a
                      key={img.key}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt="media"
                        className="aspect-square w-full object-cover transition-opacity hover:opacity-80"
                      />
                    </a>
                  ))}
                </div>
              )}
              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((f) => (
                    <a
                      key={f.key}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-white/[0.06]"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-cyan-300" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <Download className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </Section>

        <Section
          title="Quyền riêng tư & hỗ trợ"
          open={openSections.privacy}
          onToggle={() => toggle('privacy')}
        >
          <div className="space-y-0.5 px-1 py-1">
            {peer && (
              <RowButton
                icon={ShieldOff}
                label={isBlocked ? 'Bỏ chặn người dùng' : 'Chặn'}
                tone={isBlocked ? 'default' : 'warning'}
                onClick={handleBlockToggle}
              />
            )}
            <RowButton icon={Archive} label="Lưu trữ" onClick={handleArchive} />
            <RowButton icon={Trash2} label="Xoá đoạn chat" tone="danger" onClick={handleDelete} />
            {peer && (
              <RowButton icon={Flag} label="Báo cáo" tone="danger" onClick={handleReport} />
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ── Round action button (profile / mute / search) ──────────────
function ActionButton({
  icon: Icon,
  label,
  onClick,
  href,
  as,
  disabled,
  title,
}: {
  icon: typeof UserRound;
  label: string;
  onClick?: () => void;
  href?: string;
  as?: 'link';
  disabled?: boolean;
  title?: string;
}) {
  const circle = (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-text-primary transition-colors group-hover:bg-white/[0.14]">
      <Icon className="h-5 w-5" />
    </span>
  );
  const content = (
    <>
      {circle}
      <span className="text-center text-[11px] text-text-secondary">{label}</span>
    </>
  );

  if (as === 'link' && href && !disabled) {
    return (
      <Link href={href} className="group flex w-16 flex-col items-center gap-1.5" title={title}>
        {content}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'group flex w-16 flex-col items-center gap-1.5',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {content}
    </button>
  );
}

// ── Collapsible section ─────────────────────────────────────────
function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-text-primary transition-colors hover:bg-white/[0.04]"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-text-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

// ── Privacy / support row button ────────────────────────────────
function RowButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: {
  icon: typeof ShieldOff;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger' | 'warning';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] transition-colors',
        tone === 'danger' && 'text-red-300 hover:bg-red-500/15',
        tone === 'warning' && 'text-amber-300 hover:bg-amber-500/15',
        tone === 'default' && 'text-text-secondary hover:bg-white/[0.06] hover:text-text-primary',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
    </button>
  );
}
