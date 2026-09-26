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

const LOCK_MESSAGE_PREFIX = 'Editing is locked';
const TOAST_ID = 'ctwork-edit-locked';
const lockKey = (pid: number) => ['work', 'project', pid, 'edit-lock'] as const;

let lastLockedPid: number | null = null;
let installed = false;

async function unlock(pid: number) {
  try {
    await workApi.setEditLock(pid, false);
    toast.success('Editing unlocked. Try your change again.', { id: TOAST_ID });
    window.dispatchEvent(new CustomEvent('ctwork:edit-lock', { detail: { pid, locked: false } }));
  } catch (err) {
    toast.error(workError(err, 'Could not unlock editing'), { id: TOAST_ID });
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
    if (typeof message === 'string' && message.startsWith(LOCK_MESSAGE_PREFIX) && lastLockedPid) {
      const pid = lastLockedPid;
      return original('Editing is locked for this project', {
        id: TOAST_ID,
        description: 'You turned on the edit lock so nothing changes by accident. Unlock to make this change.',
        duration: 8000,
        action: { label: 'Unlock', onClick: () => { void unlock(pid); } },
      });
    }
    return original(message, data);
  }) as typeof toast.error;
  toast.error = wrapped;
}
install();

/** Nút khoá / mở khoá trên thanh đầu trang dự án. */
export function EditLockButton({ config }: { config: ProjectConfig }) {
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
      toast.success(r.locked ? 'Editing locked — browse freely, nothing will change by accident' : 'Editing unlocked', { id: TOAST_ID });
    },
    onError: (err) => toast.error(workError(err, 'Could not change the edit lock')),
  });

  if (!q.data) return null;
  return (
    <button
      type="button"
      onClick={() => toggle.mutate(!locked)}
      disabled={toggle.isPending}
      aria-pressed={locked}
      aria-label={locked ? 'Editing is locked — click to unlock' : 'Lock editing'}
      title={locked ? 'Editing is locked for you in this project. Click to unlock.' : 'Lock editing so you can browse without changing anything by accident'}
      className={cn(
        'w-btn w-btn-sm shrink-0',
        locked && 'border-[color-mix(in_srgb,var(--w-orange)_55%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange)]',
      )}
    >
      {locked ? <Lock size={13} /> : <LockOpen size={13} />}
      <span className="max-md:hidden">{locked ? 'Locked' : 'Lock'}</span>
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
      <span className="min-w-0 flex-1"><span className="font-semibold">Editing is locked.</span> You’re viewing this project read-only so nothing changes by accident. Comments and the AI assistant still work.</span>
      <button type="button" className="w-btn w-btn-sm shrink-0" onClick={() => { void unlock(config.id); }}>
        <LockOpen size={12} /> Unlock to edit
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
      title="Editing is locked — you can read, comment and ask the AI. Click to unlock."
      aria-label="Editing is locked — click to unlock"
      className="w-btn w-btn-sm shrink-0 border-[color-mix(in_srgb,var(--w-orange)_55%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange)]"
    >
      <Lock size={12} /> Locked
    </button>
  );
}

