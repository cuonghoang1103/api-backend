'use client';

/**
 * CT Work — khoá chỉnh sửa cá nhân theo dự án (25/09/2026).
 *
 * `EditLockButton` trên thanh đầu trang dự án bật/tắt khoá. Khi đang khoá, server
 * trả 423 WORK_EDIT_LOCKED cho mọi lệnh sửa (kéo thẻ, sửa trường, AI Apply…).
 *
 * Thông báo "có nút Unlock": thay vì sửa từng chỗ `toast.error(workError(err))`
 * trong hàng chục màn hình, module này
 *   1. gắn một interceptor axios ghi lại DỰ ÁN của request vừa bị từ chối vì khoá;
 *   2. bọc `toast.error` MỘT lần: thông báo nào bắt đầu bằng "Editing is locked"
 *      được thay bằng một toast duy nhất (id cố định — bấm lộn nhiều lần không
 *      chồng 5 toast) có nút Unlock mở khoá ngay.
 * Mở khoá xong phát sự kiện `ctwork:edit-lock` để nút trên header cập nhật.
 */

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Lock, LockOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { editLockedPid, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { wt } from '@/components/work/i18n';

const LOCK_MESSAGE_PREFIX = 'Editing is locked';
const TOAST_ID = 'ctwork-edit-locked';
const lockKey = (pid: number) => ['work', 'project', pid, 'edit-lock'] as const;

let lastLockedPid: number | null = null;
let installed = false;

async function unlock(pid: number) {
  try {
    await workApi.setEditLock(pid, false);
    toast.success(wt('shell.unlockedRetry'), { id: TOAST_ID });
    window.dispatchEvent(new CustomEvent('ctwork:edit-lock', { detail: { pid, locked: false } }));
  } catch (err) {
    toast.error(workError(err, wt('shell.couldNotUnlock')), { id: TOAST_ID });
  }
}

function install() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  api.interceptors.response.use(undefined, (err) => {
    const pid = editLockedPid(err);
    if (pid) lastLockedPid = pid;
    return Promise.reject(err);
  });
  const original = toast.error;
  const wrapped = ((message: Parameters<typeof toast.error>[0], data?: Parameters<typeof toast.error>[1]) => {
    if (typeof message === 'string' && (message.startsWith(LOCK_MESSAGE_PREFIX) || message === wt('errors.editLocked')) && lastLockedPid) {
      const pid = lastLockedPid;
      return original(wt('shell.lockedForProject'), {
        id: TOAST_ID,
        description: wt('shell.lockedToastBody'),
        duration: 8000,
        action: { label: wt('shell.unlock'), onClick: () => { void unlock(pid); } },
      });
    }
    return original(message, data);
  }) as typeof toast.error;
  toast.error = wrapped;
}
install();

/** Trạng thái khoá + bật/tắt — dùng chung cho nút và mục trong menu "More" (UX-A). */
export function useEditLock(config: ProjectConfig) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: lockKey(pid), queryFn: () => workApi.editLock(pid), staleTime: 60_000 });
  const locked = !!q.data?.locked;

  useEffect(() => {
    const onChange = (e: Event) => {
      const d = (e as CustomEvent<{ pid: number; locked: boolean }>).detail;
      if (d?.pid === pid) {
        qc.setQueryData(lockKey(pid), { locked: d.locked, since: d.locked ? new Date().toISOString() : null });
        void qc.invalidateQueries({ queryKey: ['work', 'project', pid] }); // cấu hình dự án ⇒ bật/tắt quyền sửa trên mọi màn
      }
    };
    window.addEventListener('ctwork:edit-lock', onChange);
    return () => window.removeEventListener('ctwork:edit-lock', onChange);
  }, [pid, qc]);

  const toggle = useMutation({
    mutationFn: (next: boolean) => workApi.setEditLock(pid, next),
    onSuccess: (r) => {
      qc.setQueryData(lockKey(pid), r);
      void qc.invalidateQueries({ queryKey: ['work', 'project', pid] });
      toast.success(r.locked ? wt('shell.lockedToast') : wt('shell.unlockedToast'), { id: TOAST_ID });
    },
    onError: (err) => toast.error(workError(err, wt('shell.couldNotChangeLock'))),
  });
  return { ready: !!q.data, locked, pending: toggle.isPending, toggle: () => toggle.mutate(!locked) };
}

/** Nút khoá / mở khoá (bản nút rời — header dự án nay đặt nó trong menu "More"). */
export function EditLockButton({ config }: { config: ProjectConfig }) {
  const l = useEditLock(config);
  if (!l.ready) return null;
  return (
    <button
      type="button"
      onClick={l.toggle}
      disabled={l.pending}
      aria-pressed={l.locked}
      aria-label={l.locked ? wt('shell.lockedClickUnlock') : wt('shell.lockEditing')}
      title={l.locked ? wt('shell.lockedTitle') : wt('shell.lockTitle')}
      className={cn('w-btn shrink-0', l.locked && 'w-btn-warn')}
    >
      {l.locked ? <Lock size={14} /> : <LockOpen size={14} className="text-[var(--w-text-2)]" />}
      <span className="max-xl:hidden">{l.locked ? wt('shell.lockedShort') : wt('shell.lockShort')}</span>
    </button>
  );
}

/**
 * Dải thông báo dưới header khi đang khoá: người dùng luôn biết vì sao không sửa
 * được, và mở khoá ngay tại chỗ (không phải đi tìm nút trên header).
 */
export function EditLockBanner({ config }: { config: ProjectConfig }) {
  if (!config.editLocked) return null;
  return (
    <div role="status" className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-3 py-1.5 text-[12.5px] text-[var(--w-text)] md:px-5">
      <Lock size={13} className="shrink-0 text-[var(--w-orange)]" />
      <span className="min-w-0 flex-1"><span className="font-semibold">{wt('shell.bannerTitle')}</span> {wt('shell.bannerBody')}</span>
      <button type="button" className="w-btn w-btn-sm shrink-0" onClick={() => { void unlock(config.id); }}>
        <LockOpen size={12} /> {wt('shell.unlockToEdit')}
      </button>
    </div>
  );
}

/** Nhãn "Locked" trong ô chi tiết thẻ (ô này trượt ra che mất header + dải thông báo). Bấm = mở khoá. */
export function EditLockPill({ config }: { config: ProjectConfig }) {
  if (!config.editLocked) return null;
  return (
    <button
      type="button"
      onClick={() => { void unlock(config.id); }}
      title={wt('shell.lockedPillTitle')}
      aria-label={wt('shell.lockedClickUnlock')}
      className="w-btn w-btn-sm w-btn-warn shrink-0"
    >
      <Lock size={12} /> {wt('shell.lockedShort')}
    </button>
  );
}

