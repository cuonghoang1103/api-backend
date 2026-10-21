'use client';

/**
 * Yêu cầu xoá chờ trưởng nhóm duyệt (22/10/2026). Hai chỗ dùng:
 *   • Cài đặt dự án → Trash → "Yêu cầu xoá" (`<DeleteRequests config>`): mọi yêu cầu của dự án; trưởng nhóm Duyệt / Từ chối.
 *   • Việc của tôi (`<MyPendingDeletes>`): yêu cầu đang chờ CHÍNH TÔI duyệt ở mọi dự án/lớp (ẩn khi không có).
 * Duyệt chạy lệnh dưới quyền người gửi; dữ liệu bị xoá vẫn vào thùng rác 30 ngày.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, Check, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { Dialog, EmptyState, relativeTime, Spinner, UserAvatar } from '../ui';
import { binApi, binKeys, type DeleteRequest } from './binApi';
import { wt } from '@/components/work/i18n';

const STATUS_TONE: Record<DeleteRequest['status'], string> = {
  PENDING: 'text-[var(--w-yellow)]', APPROVED: 'text-[var(--w-green)]', REJECTED: 'text-[var(--w-text-3)]',
  CANCELLED: 'text-[var(--w-text-3)]', FAILED: 'text-[var(--w-red)]', EXPIRED: 'text-[var(--w-text-3)]',
};
const statusLabel = (s: DeleteRequest['status']) => wt(`bin.s${s}` as 'bin.sPENDING');
const viaLabel = (r: DeleteRequest) => (r.via === 'ai' ? wt('bin.fromAi', { client: r.aiClient ?? 'AI' }) : r.via === 'token' ? wt('bin.fromToken') : wt('bin.fromWeb'));

function useDecide(invalidate: () => void) {
  const approve = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => binApi.approve(id, note),
    onSuccess: (r) => { if (r.status === 'FAILED') toast.error(wt('bin.approveFailed', { error: r.error ?? '' })); else toast.success(wt('bin.approvedToast')); invalidate(); },
    onError: (e) => { toast.error(workError(e)); invalidate(); },
  });
  const reject = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => binApi.reject(id, note),
    onSuccess: () => { toast.success(wt('bin.rejectedToast')); invalidate(); },
    onError: (e) => toast.error(workError(e)),
  });
  const cancel = useMutation({
    mutationFn: (id: number) => binApi.cancel(id),
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(workError(e)),
  });
  return { approve, reject, cancel };
}

function RequestRow({ r, canDecide, meId, onApprove, onReject, onCancel, busy, showProject }: {
  r: DeleteRequest; canDecide: boolean; meId?: number; busy: boolean; showProject?: boolean;
  onApprove: () => void; onReject: () => void; onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          {r.via !== 'web' ? <Bot size={14} className="shrink-0 text-[var(--w-accent-text)]" /> : <ShieldAlert size={14} className="shrink-0 text-[var(--w-yellow)]" />}
          <span className="break-words font-medium">{r.label}</span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
          <span className={cn('font-medium', STATUS_TONE[r.status])}>{statusLabel(r.status)}</span>
          <span>· #{r.id}</span>
          {showProject && r.projectKey && <span>· {r.projectKey}</span>}
          <span>· {viaLabel(r)}</span>
          <span className="inline-flex items-center gap-1">· <UserAvatar user={r.requestedBy} size={14} /> {userName(r.requestedBy)}</span>
          <span>· {relativeTime(r.createdAt)}</span>
          {r.decidedBy && r.status !== 'PENDING' && <span>· {userName(r.decidedBy)}</span>}
          {r.decisionNote && <span>· “{r.decisionNote}”</span>}
        </div>
        {r.error && <div className="mt-1 text-[12px] text-[var(--w-red)]">{r.error}</div>}
      </div>
      {r.status === 'PENDING' && (
        <div className="flex shrink-0 gap-1.5">
          {canDecide && (
            <>
              <button type="button" className="w-btn w-btn-sm w-btn-danger" disabled={busy} onClick={onApprove}><Check size={13} /> {wt('bin.approve')}</button>
              <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={onReject}><X size={13} /> {wt('bin.reject')}</button>
            </>
          )}
          {meId === r.requestedBy.id && <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={onCancel}>{wt('bin.cancel')}</button>}
        </div>
      )}
    </div>
  );
}

function DecideDialog({ req, mode, onClose, onConfirm, pending }: { req: DeleteRequest | null; mode: 'approve' | 'reject'; onClose: () => void; onConfirm: (note: string) => void; pending: boolean }) {
  const [note, setNote] = useState('');
  return (
    <Dialog
      open={!!req}
      onClose={() => { setNote(''); onClose(); }}
      title={mode === 'approve' ? wt('bin.approveQ') : wt('bin.reject')}
      width={480}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="button" className={cn('w-btn', mode === 'approve' ? 'w-btn-danger-solid' : 'w-btn-primary')} disabled={pending} onClick={() => { onConfirm(note); setNote(''); }}>
            {pending && <Spinner size={12} />} {mode === 'approve' ? wt('bin.approve') : wt('bin.reject')}
          </button>
        </>
      }
    >
      <p className="text-[13px] font-medium">{req?.label}</p>
      {req && <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{viaLabel(req)} · {userName(req.requestedBy)}</p>}
      {mode === 'approve' && <p className="mt-3 text-[12.5px] text-[var(--w-text-2)]">{wt('bin.approveBody', { days: 30 })}</p>}
      <label className="mt-3 block text-[12px] text-[var(--w-text-2)]">
        {wt('bin.rejectNote')}
        <input className="w-input mt-1 w-full" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
      </label>
    </Dialog>
  );
}

export default function DeleteRequests({ config }: { config: ProjectConfig }) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id) as number | undefined;
  const key = binKeys.requests(config.id);
  const q = useQuery({ queryKey: key, queryFn: () => binApi.requests(config.id) });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: binKeys.data(config.id) });
    qc.invalidateQueries({ queryKey: binKeys.mine });
    qc.invalidateQueries({ queryKey: ['work', 'fpt', config.id] });
  };
  const { approve, reject, cancel } = useDecide(invalidate);
  const [deciding, setDeciding] = useState<{ r: DeleteRequest; mode: 'approve' | 'reject' } | null>(null);

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title={wt('bin.reqLoadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  const list = q.data?.requests ?? [];
  const pending = list.filter((r) => r.status === 'PENDING');
  const done = list.filter((r) => r.status !== 'PENDING');
  const busy = approve.isPending || reject.isPending || cancel.isPending;
  const row = (r: DeleteRequest) => (
    <RequestRow key={r.id} r={r} canDecide={!!q.data?.canDecide} meId={meId} busy={busy}
      onApprove={() => setDeciding({ r, mode: 'approve' })} onReject={() => setDeciding({ r, mode: 'reject' })} onCancel={() => cancel.mutate(r.id)} />
  );

  return (
    <div>
      <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">{wt('bin.reqDesc')}</p>
      {!q.data?.canDecide && <p className="mb-3 text-[12px] text-[var(--w-text-3)]">{wt('bin.onlyLead')}</p>}
      {!list.length ? (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center text-[13px] text-[var(--w-text-3)]">{wt('bin.reqEmpty')}</div>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">{wt('bin.pending')} · {pending.length}</h3>
              <div className="mb-4 rounded-[8px] border border-[var(--w-border)]">{pending.map(row)}</div>
            </>
          )}
          {done.length > 0 && (
            <>
              <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">{wt('bin.history')}</h3>
              <div className="rounded-[8px] border border-[var(--w-border)]">{done.map(row)}</div>
            </>
          )}
        </>
      )}
      <DecideDialog
        req={deciding?.r ?? null} mode={deciding?.mode ?? 'approve'} onClose={() => setDeciding(null)}
        pending={approve.isPending || reject.isPending}
        onConfirm={(note) => {
          if (!deciding) return;
          const m = deciding.mode === 'approve' ? approve : reject;
          m.mutate({ id: deciding.r.id, note }, { onSettled: () => setDeciding(null) });
        }}
      />
    </div>
  );
}

/** "Việc của tôi": yêu cầu xoá đang chờ TÔI duyệt (mọi dự án / lớp). Không có ⇒ không vẽ gì. */
export function MyPendingDeletes() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: binKeys.mine, queryFn: binApi.mine, staleTime: 30_000 });
  const invalidate = () => { qc.invalidateQueries({ queryKey: binKeys.mine }); qc.invalidateQueries({ queryKey: ['work', 'project'] }); };
  const { approve, reject } = useDecide(invalidate);
  const [deciding, setDeciding] = useState<{ r: DeleteRequest; mode: 'approve' | 'reject' } | null>(null);
  const list = q.data ?? [];
  if (!list.length) return null;
  return (
    <section className="mb-4 rounded-[10px] border border-[color-mix(in_srgb,var(--w-yellow)_45%,var(--w-border))] bg-[color-mix(in_srgb,var(--w-yellow)_6%,transparent)]">
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <ShieldAlert size={15} className="text-[var(--w-yellow)]" />
        <h2 className="text-[13px] font-semibold">{wt('bin.myPending')} · {list.length}</h2>
        <span className="text-[12px] text-[var(--w-text-3)]">{wt('bin.myPendingBody')}</span>
      </div>
      <div className="mt-1">
        {list.slice(0, 8).map((r) => (
          <div key={r.id} className="flex items-start">
            <div className="min-w-0 flex-1">
              <RequestRow r={r} canDecide busy={approve.isPending || reject.isPending} showProject
                onApprove={() => setDeciding({ r, mode: 'approve' })} onReject={() => setDeciding({ r, mode: 'reject' })} onCancel={() => undefined} />
            </div>
            {r.url && <Link href={r.url} className="w-btn w-btn-ghost w-btn-sm m-2 shrink-0">{wt('bin.review')}</Link>}
          </div>
        ))}
      </div>
      <DecideDialog
        req={deciding?.r ?? null} mode={deciding?.mode ?? 'approve'} onClose={() => setDeciding(null)}
        pending={approve.isPending || reject.isPending}
        onConfirm={(note) => {
          if (!deciding) return;
          const m = deciding.mode === 'approve' ? approve : reject;
          m.mutate({ id: deciding.r.id, note }, { onSettled: () => setDeciding(null) });
        }}
      />
    </section>
  );
}
