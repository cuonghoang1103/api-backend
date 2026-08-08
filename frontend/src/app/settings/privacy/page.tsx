'use client';

/**
 * /settings/privacy — who can reach you, and who you've blocked.
 *
 * Both halves already existed server-side with no UI in front of them:
 *   - `allowMessagesFromStrangers` was writable via PUT /profile and
 *     enforced in messages.service.ts, but nothing let the user set it.
 *   - `/messages/blocks` (list/add/remove) was only reachable from a
 *     per-thread menu, so once a thread was deleted the block became
 *     invisible and impossible to undo.
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Lock, MessageSquare, UserX, Loader2, ShieldOff } from 'lucide-react';
import { authApi, messagingApi, type MessagingBlockedUser } from '@/lib/api';
import {
  SettingsPage, SettingsCard, SettingsRow, Toggle, Button, EmptyState,
} from '@/components/settings/primitives';

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString('vi-VN') : '';
}

export default function PrivacySettingsPage() {
  const [allowStrangers, setAllowStrangers] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingStrangers, setSavingStrangers] = useState(false);

  const [blocked, setBlocked] = useState<MessagingBlockedUser[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(true);
  const [unblocking, setUnblocking] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.getProfile();
        const p = ((res.data as any)?.data ?? {}) as Record<string, any>;
        if (!cancelled) setAllowStrangers(p.allowMessagesFromStrangers !== false);
      } catch {
        if (!cancelled) toast.error('Không tải được cài đặt riêng tư.');
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadBlocked = useCallback(async () => {
    setLoadingBlocked(true);
    try {
      const res = await messagingApi.listBlocked();
      const list = (res.data as any)?.data;
      setBlocked(Array.isArray(list) ? list : []);
    } catch {
      setBlocked([]);
    } finally {
      setLoadingBlocked(false);
    }
  }, []);

  useEffect(() => { void loadBlocked(); }, [loadBlocked]);

  const handleToggleStrangers = async (v: boolean) => {
    const previous = allowStrangers;
    setAllowStrangers(v); // optimistic — the switch should feel instant
    setSavingStrangers(true);
    try {
      await authApi.updateProfile({ allowMessagesFromStrangers: v });
      toast.success(v ? 'Đã cho phép người lạ nhắn tin.' : 'Đã chặn tin nhắn từ người lạ.');
    } catch {
      setAllowStrangers(previous); // roll back so the UI doesn't lie
      toast.error('Không lưu được thay đổi. Vui lòng thử lại.');
    } finally {
      setSavingStrangers(false);
    }
  };

  const handleUnblock = async (user: MessagingBlockedUser) => {
    setUnblocking(user.id);
    try {
      await messagingApi.unblockUser(user.id);
      setBlocked((list) => list.filter((b) => b.id !== user.id));
      toast.success(`Đã bỏ chặn ${user.displayName || user.username}.`);
    } catch {
      toast.error('Bỏ chặn thất bại. Vui lòng thử lại.');
    } finally {
      setUnblocking(null);
    }
  };

  return (
    <SettingsPage
      title="Riêng tư"
      description="Kiểm soát ai có thể liên hệ với bạn và quản lý những người bạn đã chặn."
    >
      <SettingsCard title="Tin nhắn" icon={<MessageSquare className="h-4 w-4" />}>
        <SettingsRow
          label="Cho phép người lạ nhắn tin"
          description="Khi tắt, chỉ những người đã có cuộc trò chuyện với bạn từ trước mới gửi tin nhắn mới được. Người lạ sẽ nhận thông báo không gửi được."
          control={
            loadingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <Toggle
                checked={allowStrangers}
                onChange={handleToggleStrangers}
                disabled={savingStrangers}
                label="Cho phép người lạ nhắn tin"
              />
            )
          }
        />
      </SettingsCard>

      <SettingsCard
        title="Danh sách đã chặn"
        description="Người bị chặn không thể nhắn tin cho bạn. Bỏ chặn bất cứ lúc nào tại đây — kể cả khi cuộc trò chuyện cũ đã bị xoá."
        icon={<ShieldOff className="h-4 w-4" />}
        footer={
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Muốn chặn ai đó? Mở cuộc trò chuyện với họ trong{' '}
            <Link href="/messages" className="text-neon-violet hover:underline">
              Tin nhắn
            </Link>{' '}
            rồi chọn “Chặn” trong menu.
          </p>
        }
      >
        {loadingBlocked ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách…
          </div>
        ) : blocked.length === 0 ? (
          <EmptyState
            icon={<Lock className="h-8 w-8" />}
            title="Bạn chưa chặn ai"
            description="Những người bạn chặn sẽ xuất hiện ở đây."
          />
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {blocked.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.avatarUrl}
                    alt={u.displayName || u.username}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                    style={{ border: '1px solid var(--border-color)' }}
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                  >
                    <UserX className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {u.displayName || u.username}
                  </p>
                  <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                    @{u.username}
                    {u.blockedAt ? ` · Chặn ngày ${formatDate(u.blockedAt)}` : ''}
                    {u.reason ? ` · ${u.reason}` : ''}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleUnblock(u)}
                  loading={unblocking === u.id}
                  className="shrink-0"
                >
                  Bỏ chặn
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SettingsCard>
    </SettingsPage>
  );
}
