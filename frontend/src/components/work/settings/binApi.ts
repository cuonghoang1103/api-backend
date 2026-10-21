/**
 * CT Work 22/10/2026 — client cho THÙNG RÁC DỮ LIỆU 30 ngày + YÊU CẦU XOÁ chờ trưởng nhóm duyệt.
 * Backend: src/routes/work.trashBin.routes.ts (trashBin.service + deleteRequests.service). Tách khỏi lib/work-api.ts để không
 * giẫm tệp nhiều phiên cùng sửa.
 */

import { toast } from 'sonner';
import { api } from '@/lib/api';
import { workError, type WorkUser } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export interface TrashItem {
  id: number; kind: string; label: string; itemCount: number; source: 'web' | 'ai' | 'token' | 'approved'; requestId: number | null;
  deletedAt: string; expiresAt: string; deletedBy: WorkUser | null; group: 'tests' | 'meetings' | 'raid' | 'diagrams' | 'governance' | 'agile' | 'other';
}
export interface DeleteRequest {
  id: number; projectId: number | null; classId: number | null; kind: string; label: string; itemCount: number;
  via: 'web' | 'ai' | 'token'; aiClient: string | null; status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'FAILED' | 'EXPIRED';
  createdAt: string; expiresAt: string; decidedAt: string | null; decisionNote: string | null; error: string | null;
  requestedBy: WorkUser; decidedBy: WorkUser | null; projectKey: string | null; projectName: string | null; url: string | null;
}
export interface QueuedRequest extends DeleteRequest { approvers: Array<{ id: number; username: string; name: string }>; message: string }
/** Kết quả một lệnh xoá ở backend (FPT): vào thùng rác hoặc thành yêu cầu chờ duyệt. */
export type DeleteOutcome = { deleted: true; trashId: number } | { deleted: false; queued: QueuedRequest };

export const binKeys = {
  data: (pid: number) => ['work', 'project', pid, 'trash-data'] as const,
  requests: (pid: number) => ['work', 'project', pid, 'delete-requests'] as const,
  mine: ['work', 'me', 'delete-requests'] as const,
};

export const binApi = {
  list: (pid: number) => d<{ canPurge: boolean; days: number; items: TrashItem[] }>(api.get(`/work/projects/${pid}/trash/data`)),
  restore: (pid: number, id: number) => d<{ restored: boolean; rows: number; notes: string[] }>(api.post(`/work/projects/${pid}/trash/data/${id}/restore`, {})),
  purge: (pid: number, id: number) => d(api.delete(`/work/projects/${pid}/trash/data/${id}`)),
  requests: (pid: number) => d<{ canDecide: boolean; requests: DeleteRequest[] }>(api.get(`/work/projects/${pid}/trash/requests`)),
  mine: () => d<DeleteRequest[]>(api.get('/work/me/delete-requests')),
  approve: (id: number, note?: string) => d<DeleteRequest>(api.post(`/work/delete-requests/${id}/approve`, { note: note || null }, { timeout: 180_000 })),
  reject: (id: number, note?: string) => d<DeleteRequest>(api.post(`/work/delete-requests/${id}/reject`, { note: note || null })),
  cancel: (id: number) => d<DeleteRequest>(api.post(`/work/delete-requests/${id}/cancel`, {})),
};

/**
 * Sau một lệnh xoá: toast "đã vào thùng rác" kèm nút Hoàn tác, hoặc "đã gửi trưởng nhóm duyệt".
 * `onRestored` chạy sau khi hoàn tác xong (tải lại dữ liệu).
 */
export function afterDelete(pid: number, out: DeleteOutcome | { trashId?: number | null; queued?: QueuedRequest } | undefined, onRestored: () => void, message?: string) {
  if (!out) return;
  if ('queued' in out && out.queued) { toast.info(wt('bin.queuedToast'), { duration: 8000 }); return; }
  const trashId = (out as { trashId?: number | null }).trashId;
  if (!trashId) return;
  undoToast(pid, trashId, onRestored, message ?? wt('bin.movedToTrash', { days: 30 }));
}

export function undoToast(pid: number, trashId: number, onRestored: () => void, message: string) {
  toast.success(message, {
    duration: 10_000,
    action: {
      label: wt('bin.undo'),
      onClick: async () => {
        try {
          const r = await binApi.restore(pid, trashId);
          toast.success(r.notes?.length ? wt('bin.restoredNote', { note: r.notes.join('; ') }) : wt('common.restore'));
          onRestored();
        } catch (e) {
          toast.error(workError(e, wt('bin.restoreFailed')));
        }
      },
    },
  });
}
