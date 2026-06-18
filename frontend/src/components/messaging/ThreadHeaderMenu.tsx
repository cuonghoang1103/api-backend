'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  MailOpen,
  BellOff,
  Bell,
  User as UserIcon,
  ShieldOff,
  Archive,
  Trash2,
  Flag,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type ReportCategory = 'spam' | 'harassment' | 'hate' | 'impersonation' | 'other';

type Panel = 'main' | 'mute' | 'block' | 'delete' | 'report';

/**
 * The 3-dot menu that lives on the thread header (right side
 * of the avatar + name row). It mirrors the Messenger popover:
 *  - Mark as unread
 *  - Mute / Unmute notifications (Facebook-style: 15m / 1h /
 *    8h / 24h / until you turn it back on)
 *  - View profile
 *  - Block
 *  - Archive chat
 *  - ─── separator
 *  - Delete chat
 *  - Report
 *
 * We deliberately omit Audio / Video call per project
 * requirements (no WebRTC infra).
 */
export default function ThreadHeaderMenu({
  threadId,
  peerId,
}: {
  threadId: number;
  peerId: number;
}) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>('main');
  const [reportCategory, setReportCategory] = useState<ReportCategory>('spam');
  const [reportReason, setReportReason] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const auth = useAuthStore();
  const store = useMessagingStore();
  const thread = store.threads.find((t) => t.id === threadId) ?? store.currentThread;
  const peer = thread?.peer;

  const mutedUntil = thread?.preferences?.mutedUntil;
  const isMuted = mutedUntil ? new Date(mutedUntil) > new Date() : false;
  const isBlocked = store.isBlocked(peerId);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Reset inner-panel state when the menu closes
  useEffect(() => {
    if (open) return;
    setPanel('main');
    setReportReason('');
    setReportCategory('spam');
  }, [open]);

  const requireAuth = () => auth.user?.id === peerId;

  const closeMenu = () => setOpen(false);

  const handleMarkUnread = async () => {
    closeMenu();
    try {
      await store.markThreadUnread(threadId);
      toast.success('Đã đánh dấu chưa đọc');
    } catch (e) {
      toast.error('Không thể đánh dấu chưa đọc');
    }
  };

  const handleViewProfile = () => {
    closeMenu();
    if (!peer) return;
    router.push(`/profile/${peer.id}`);
  };

  const handleArchive = async () => {
    closeMenu();
    try {
      await store.archiveThread(threadId);
      toast.success('Đã lưu trữ cuộc trò chuyện');
    } catch (e) {
      toast.error('Không thể lưu trữ');
    }
  };

  const handleDelete = async () => {
    closeMenu();
    try {
      await store.deleteChat(threadId);
      toast.success('Đã xoá cuộc trò chuyện');
    } catch (e) {
      toast.error('Không thể xoá cuộc trò chuyện');
    }
  };

  const handleBlock = async () => {
    closeMenu();
    try {
      await store.blockUser(peerId);
      toast.success('Đã chặn người dùng');
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? 'Không thể chặn người dùng');
    }
  };

  const handleUnblock = async () => {
    closeMenu();
    try {
      await store.unblockUser(peerId);
      toast.success('Đã bỏ chặn người dùng');
    } catch (e) {
      toast.error('Không thể bỏ chặn');
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Vui lòng nhập lý do báo cáo');
      return;
    }
    closeMenu();
    try {
      await store.reportThread(threadId, {
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
      await store.muteFor(threadId, durationMinutes);
      const label =
        durationMinutes === null
          ? 'Đã tắt thông báo vĩnh viễn'
          : durationMinutes === 0
            ? 'Đã bật thông báo'
            : durationMinutes < 60
              ? `Đã tắt thông báo ${durationMinutes} phút`
              : durationMinutes < 480
                ? `Đã tắt thông báo ${durationMinutes / 60} giờ`
                : `Đã tắt thông báo ${durationMinutes / 60} giờ`;
      toast.success(label);
    } catch (e) {
      toast.error('Không thể thay đổi cài đặt thông báo');
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary"
        aria-label="Mở tuỳ chọn cuộc trò chuyện"
        title="Tuỳ chọn"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-1.5 shadow-[0_12px_48px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.6)] [backdrop-filter:none] [-webkit-backdrop-filter:none]"
          >
            {panel === 'main' && (
              <div className="space-y-0.5">
                <MenuItem icon={MailOpen} label="Đánh dấu chưa đọc" onClick={handleMarkUnread} />
                <MenuItem
                  icon={isMuted ? Bell : BellOff}
                  label={isMuted ? 'Bật thông báo' : 'Tắt thông báo'}
                  trailing={<ChevronRight className="h-3.5 w-3.5 text-text-muted" />}
                  onClick={() => setPanel('mute')}
                />
                {peer && !requireAuth() && (
                  <MenuItem icon={UserIcon} label="Xem trang cá nhân" onClick={handleViewProfile} />
                )}
                {peer && !requireAuth() && !isBlocked && (
                  <MenuItem icon={ShieldOff} label="Chặn" tone="warning" onClick={() => setPanel('block')} />
                )}
                {peer && !requireAuth() && isBlocked && (
                  <MenuItem icon={ShieldOff} label="Bỏ chặn người dùng" onClick={handleUnblock} />
                )}
                <MenuItem icon={Archive} label="Lưu trữ" onClick={handleArchive} />
                <div className="my-1 border-t border-white/[0.06]" />
                <MenuItem icon={Trash2} label="Xoá cuộc trò chuyện" tone="danger" onClick={() => setPanel('delete')} />
                {peer && !requireAuth() && (
                  <MenuItem icon={Flag} label="Báo cáo" tone="danger" onClick={() => setPanel('report')} />
                )}
              </div>
            )}

            {panel === 'mute' && (
              <SubPanel title={isMuted ? 'Đang tắt thông báo' : 'Tắt thông báo trong…'} onBack={() => setPanel('main')}>
                <MenuItem icon={Clock} label="15 phút" onClick={() => handleMuteFor(15)} />
                <MenuItem icon={Clock} label="1 giờ" onClick={() => handleMuteFor(60)} />
                <MenuItem icon={Clock} label="8 giờ" onClick={() => handleMuteFor(480)} />
                <MenuItem icon={Clock} label="24 giờ" onClick={() => handleMuteFor(1440)} />
                <div className="my-1 border-t border-white/[0.06]" />
                <MenuItem icon={BellOff} label="Cho đến khi tôi bật lại" tone="warning" onClick={() => handleMuteFor(null)} />
                {isMuted && (
                  <>
                    <div className="my-1 border-t border-white/[0.06]" />
                    <MenuItem icon={Bell} label="Bật thông báo" onClick={() => handleMuteFor(0)} />
                  </>
                )}
              </SubPanel>
            )}

            {panel === 'block' && (
              <ConfirmBlock
                peerName={peer?.displayName ?? peer?.username ?? 'người dùng này'}
                onConfirm={handleBlock}
                onBack={() => setPanel('main')}
              />
            )}

            {panel === 'delete' && (
              <ConfirmDelete
                peerName={peer?.displayName ?? peer?.username ?? 'người dùng này'}
                onConfirm={handleDelete}
                onBack={() => setPanel('main')}
              />
            )}

            {panel === 'report' && (
              <ReportForm
                peerName={peer?.displayName ?? peer?.username ?? 'người dùng này'}
                category={reportCategory}
                reason={reportReason}
                onCategoryChange={setReportCategory}
                onReasonChange={setReportReason}
                onConfirm={handleReport}
                onBack={() => setPanel('main')}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
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

function SubPanel({
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
        Họ sẽ không thể nhắn tin cho bạn hoặc bắt đầu cuộc trò chuyện mới. Bạn có thể bỏ chặn bất cứ lúc nào trong phần Cài đặt chat.
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
        Cuộc trò chuyện sẽ bị ẩn khỏi tất cả các tab trong hộp thư của bạn. Người kia vẫn giữ bản sao của họ. Hành động này không thể hoàn tác.
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