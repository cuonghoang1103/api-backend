'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MailOpen,
  BellOff,
  Bell,
  Pin,
  PinOff,
  Archive,
  ArchiveRestore,
  User as UserIcon,
  ShieldOff,
  Trash2,
  Flag,
  Clock,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { MessagingThread } from '@/lib/api';

type ReportCategory = 'spam' | 'harassment' | 'hate' | 'impersonation' | 'other';
type Panel = 'main' | 'mute' | 'block' | 'delete' | 'report';

/**
 * 3-dot context menu that pops out from the kebab icon on each
 * thread row in the sidebar. Mirrors the header ThreadHeaderMenu
 * so users get the same actions whether they're looking at the
 * list or already inside a thread.
 *
 * Differences from the header menu:
 *  - Anchored to the row (top-full, right-2) instead of the
 *    header's right edge
 *  - Adds Pin / Unpin (which makes more sense at the list level
 *    than inside an open thread)
 *  - Has Archive / Unarchive context toggle
 */
export default function ThreadRowMenu({
  thread,
  onClose,
}: {
  thread: MessagingThread;
  onClose: () => void;
}) {
  const [panel, setPanel] = useState<Panel>('main');
  const [reportCategory, setReportCategory] = useState<ReportCategory>('spam');
  const [reportReason, setReportReason] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const auth = useAuthStore();
  const store = useMessagingStore();

  const isPinned = !!thread.preferences?.pinnedAt;
  const mutedUntil = thread.preferences?.mutedUntil;
  const isMuted = mutedUntil ? new Date(mutedUntil) > new Date() : false;
  const isArchived = !!thread.preferences?.archivedAt;
  const peerId = thread.peer?.id;
  const isSelfThread = !!peerId && auth.user?.id === peerId;

  // Reset inner-panel state when the menu closes
  useEffect(() => {
    setPanel('main');
    setReportReason('');
    setReportCategory('spam');
  }, []);

  const closeMenu = () => onClose();

  const handlePin = async () => {
    closeMenu();
    try {
      await store.togglePin(thread.id);
      toast.success(isPinned ? 'Đã bỏ ghim' : 'Đã ghim cuộc trò chuyện');
    } catch (e) {
      toast.error('Không thể ghim');
    }
  };

  const handleMarkUnread = async () => {
    closeMenu();
    try {
      await store.markThreadUnread(thread.id);
      toast.success('Đã đánh dấu chưa đọc');
    } catch (e) {
      toast.error('Không thể đánh dấu chưa đọc');
    }
  };

  const handleViewProfile = () => {
    closeMenu();
    if (!peerId) return;
    router.push(`/profile/${peerId}`);
  };

  const handleArchive = async () => {
    closeMenu();
    try {
      if (isArchived) {
        await store.unarchiveThread(thread.id);
        toast.success('Đã bỏ lưu trữ');
      } else {
        await store.archiveThread(thread.id);
        toast.success('Đã lưu trữ cuộc trò chuyện');
      }
    } catch (e) {
      toast.error('Không thể thay đổi trạng thái lưu trữ');
    }
  };

  const handleDelete = async () => {
    closeMenu();
    try {
      await store.deleteChat(thread.id);
      toast.success('Đã xoá cuộc trò chuyện');
    } catch (e) {
      toast.error('Không thể xoá cuộc trò chuyện');
    }
  };

  const handleBlock = async () => {
    closeMenu();
    if (!peerId) return;
    try {
      await store.blockUser(peerId);
      toast.success('Đã chặn người dùng');
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? 'Không thể chặn');
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Vui lòng nhập lý do báo cáo');
      return;
    }
    closeMenu();
    try {
      await store.reportThread(thread.id, {
        reason: reportReason,
        category: reportCategory,
      });
      toast.success('Đã gửi báo cáo tới quản trị viên');
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? 'Không thể gửi báo cáo');
    }
  };

  const handleMuteFor = async (durationMinutes: number | null) => {
    closeMenu();
    try {
      await store.muteFor(thread.id, durationMinutes);
      const label =
        durationMinutes === null
          ? 'Đã tắt thông báo vĩnh viễn'
          : durationMinutes === 0
            ? 'Đã bật thông báo'
            : durationMinutes < 60
              ? `Đã tắt thông báo ${durationMinutes} phút`
              : `Đã tắt thông báo ${durationMinutes / 60} giờ`;
      toast.success(label);
    } catch (e) {
      toast.error('Không thể thay đổi cài đặt thông báo');
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -2 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-2 top-full z-30 mt-1 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a14]/98 p-1.5 shadow-2xl backdrop-blur"
      onMouseLeave={(e) => {
        // Only close if the user truly leaves the menu area —
        // `relatedTarget` is the element the cursor is moving
        // into, so we close only when that's outside both the
        // menu and the kebab trigger.
        const next = e.relatedTarget as HTMLElement | null;
        if (next && (ref.current?.contains(next) || next.closest('[data-kebab]'))) return;
        closeMenu();
      }}
    >
      {panel === 'main' && (
        <div className="space-y-0.5">
          <RowMenuItem
            icon={isPinned ? PinOff : Pin}
            label={isPinned ? 'Bỏ ghim' : 'Ghim'}
            onClick={handlePin}
          />
          <RowMenuItem
            icon={MailOpen}
            label="Đánh dấu chưa đọc"
            onClick={handleMarkUnread}
          />
          <RowMenuItem
            icon={isMuted ? Bell : BellOff}
            label={isMuted ? 'Bật thông báo' : 'Tắt thông báo'}
            trailing={<ChevronRight className="h-3.5 w-3.5 text-text-muted" />}
            onClick={() => setPanel('mute')}
          />
          {peerId && !isSelfThread && (
            <RowMenuItem icon={UserIcon} label="Xem trang cá nhân" onClick={handleViewProfile} />
          )}
          {peerId && !isSelfThread && (
            <RowMenuItem
              icon={ShieldOff}
              label="Chặn"
              tone="warning"
              onClick={() => setPanel('block')}
            />
          )}
          <RowMenuItem
            icon={isArchived ? ArchiveRestore : Archive}
            label={isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
            onClick={handleArchive}
          />
          <div className="my-1 border-t border-white/[0.06]" />
          <RowMenuItem
            icon={Trash2}
            label="Xoá cuộc trò chuyện"
            tone="danger"
            onClick={() => setPanel('delete')}
          />
          {peerId && !isSelfThread && (
            <RowMenuItem
              icon={Flag}
              label="Báo cáo"
              tone="danger"
              onClick={() => setPanel('report')}
            />
          )}
        </div>
      )}

      {panel === 'mute' && (
        <SubPanelHeader
          title={isMuted ? 'Đang tắt thông báo' : 'Tắt thông báo trong…'}
          onBack={() => setPanel('main')}
        >
          <RowMenuItem icon={Clock} label="15 phút" onClick={() => handleMuteFor(15)} />
          <RowMenuItem icon={Clock} label="1 giờ" onClick={() => handleMuteFor(60)} />
          <RowMenuItem icon={Clock} label="8 giờ" onClick={() => handleMuteFor(480)} />
          <RowMenuItem icon={Clock} label="24 giờ" onClick={() => handleMuteFor(1440)} />
          <div className="my-1 border-t border-white/[0.06]" />
          <RowMenuItem
            icon={BellOff}
            label="Cho đến khi tôi bật lại"
            tone="warning"
            onClick={() => handleMuteFor(null)}
          />
          {isMuted && (
            <>
              <div className="my-1 border-t border-white/[0.06]" />
              <RowMenuItem icon={Bell} label="Bật thông báo" onClick={() => handleMuteFor(0)} />
            </>
          )}
        </SubPanelHeader>
      )}

      {panel === 'block' && (
        <ConfirmBlock
          peerName={thread.peer?.displayName ?? thread.peer?.username ?? 'người dùng này'}
          onConfirm={handleBlock}
          onBack={() => setPanel('main')}
        />
      )}

      {panel === 'delete' && (
        <ConfirmDelete
          peerName={thread.peer?.displayName ?? thread.peer?.username ?? 'người dùng này'}
          onConfirm={handleDelete}
          onBack={() => setPanel('main')}
        />
      )}

      {panel === 'report' && (
        <ReportForm
          peerName={thread.peer?.displayName ?? thread.peer?.username ?? 'người dùng này'}
          category={reportCategory}
          reason={reportReason}
          onCategoryChange={setReportCategory}
          onReasonChange={setReportReason}
          onConfirm={handleReport}
          onBack={() => setPanel('main')}
        />
      )}
    </motion.div>
  );
}

function RowMenuItem({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
  trailing,
}: {
  icon: typeof MailOpen;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger' | 'warning';
  trailing?: React.ReactNode;
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
      {trailing}
    </button>
  );
}

function SubPanelHeader({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <button
        onClick={onBack}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:bg-white/[0.04]"
      >
        <ChevronRight className="h-3 w-3 rotate-180" />
        <span>{title}</span>
      </button>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ConfirmBlock({
  peerName,
  onConfirm,
  onBack,
}: {
  peerName: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-2 p-2">
      <p className="px-1 text-[13px] font-semibold text-text-primary">Chặn {peerName}?</p>
      <p className="px-1 text-[11.5px] leading-relaxed text-text-muted">
        Họ sẽ không thể nhắn tin cho bạn hoặc bắt đầu cuộc trò chuyện mới.
      </p>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-white/[0.08]"
        >
          Huỷ
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-[12px] font-semibold text-amber-200 transition-colors hover:bg-amber-500/30"
        >
          Chặn
        </button>
      </div>
    </div>
  );
}

function ConfirmDelete({
  peerName,
  onConfirm,
  onBack,
}: {
  peerName: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-2 p-2">
      <p className="px-1 text-[13px] font-semibold text-text-primary">Xoá cuộc trò chuyện với {peerName}?</p>
      <p className="px-1 text-[11.5px] leading-relaxed text-text-muted">
        Sẽ bị ẩn khỏi tất cả các tab trong hộp thư của bạn. Người kia vẫn giữ bản sao của họ.
      </p>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-white/[0.08]"
        >
          Huỷ
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-[12px] font-semibold text-red-200 transition-colors hover:bg-red-500/30"
        >
          Xoá
        </button>
      </div>
    </div>
  );
}

function ReportForm({
  peerName,
  category,
  reason,
  onCategoryChange,
  onReasonChange,
  onConfirm,
  onBack,
}: {
  peerName: string;
  category: ReportCategory;
  reason: string;
  onCategoryChange: (c: ReportCategory) => void;
  onReasonChange: (r: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-2.5 p-2">
      <button
        onClick={onBack}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:bg-white/[0.04]"
      >
        <ChevronRight className="h-3 w-3 rotate-180" />
        <span>Báo cáo {peerName}</span>
      </button>
      <div className="space-y-1">
        <p className="px-1 text-[10.5px] uppercase tracking-wider text-text-muted">Lý do</p>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              { v: 'spam', l: 'Spam / lừa đảo' },
              { v: 'harassment', l: 'Quấy rối' },
              { v: 'hate', l: 'Ngôn từ thù ghét' },
              { v: 'impersonation', l: 'Mạo danh' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              onClick={() => onCategoryChange(opt.v)}
              className={cn(
                'rounded-lg border px-2 py-1.5 text-[11.5px] transition-colors',
                category === opt.v
                  ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200'
                  : 'border-white/[0.06] bg-white/[0.02] text-text-secondary hover:bg-white/[0.05]',
              )}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="px-1 text-[10.5px] uppercase tracking-wider text-text-muted">Chi tiết</p>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          maxLength={200}
          placeholder="Mô tả vấn đề..."
          className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-[12px] text-text-primary placeholder:text-text-muted focus:border-cyan-500/40 focus:outline-none"
          rows={3}
        />
        <p className="px-1 text-right text-[10px] text-text-muted">{reason.length}/200</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-white/[0.08]"
        >
          Huỷ
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-[12px] font-semibold text-red-200 transition-colors hover:bg-red-500/30"
        >
          Gửi báo cáo
        </button>
      </div>
    </div>
  );
}