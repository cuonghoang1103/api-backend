'use client';

/**
 * Một bàn giao (S1, mô-đun handoffs): từ ai/bộ phận nào → tới ai/bộ phận nào,
 * checklist, ghi chú, trạng thái. Bên nhận (người đích danh, trưởng bộ phận
 * nhận, ADMIN dự án — server trả `canDecide`) tick ĐỦ checklist mới bấm được
 * Accept; Return bắt buộc lý do. Người gửi / ADMIN rút lại bằng Cancel.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, Check, CornerUpLeft, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, workStudioApi, type MyHandoff, type WorkHandoff, type WorkUser } from '@/lib/work-api';
import { Dialog, Spinner, UserAvatar, relativeTime } from '../ui';
import { HandoffPill, TeamChip, useStudioInvalidate } from './shared';

function Party({ team, user }: { team: WorkHandoff['toTeam']; user: WorkUser | null }) {
  if (!team && !user) return <span className="text-[var(--w-text-3)]">No one</span>;
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      {team && <TeamChip team={team} />}
      {user && <><UserAvatar user={user} size={18} /><span className="truncate">{userName(user)}</span></>}
    </span>
  );
}

export default function HandoffCard({ h, issueHref, compact }: {
  h: WorkHandoff | MyHandoff;
  /** Có ⇒ hiện mã thẻ + tên thẻ dạng link (hộp "Incoming handoffs"). */
  issueHref?: string;
  /** Lịch sử trong chi tiết thẻ: thu gọn bàn giao đã xong. */
  compact?: boolean;
}) {
  const invalidate = useStudioInvalidate();
  const [ticks, setTicks] = useState<boolean[]>(() => h.checklist.map((c) => c.done));
  const [returning, setReturning] = useState(false);
  const [reason, setReason] = useState('');
  const pending = h.status === 'PENDING';
  const allTicked = ticks.every(Boolean);
  const done = ticks.filter(Boolean).length;

  const accept = useMutation({
    mutationFn: () => workStudioApi.acceptHandoff(h.projectId, h.id, ticks),
    onSuccess: () => { toast.success(`Accepted ${h.issueKey}`); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not accept the handoff')),
  });
  const ret = useMutation({
    mutationFn: () => workStudioApi.returnHandoff(h.projectId, h.id, reason.trim()),
    onSuccess: () => { toast.success(`Returned ${h.issueKey}`); setReturning(false); setReason(''); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not return the handoff')),
  });
  const cancel = useMutation({
    mutationFn: () => workStudioApi.cancelHandoff(h.projectId, h.id),
    onSuccess: () => { toast.success('Handoff cancelled'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not cancel the handoff')),
  });

  if (compact && !pending) {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-[12px] text-[var(--w-text-2)]">
        <HandoffPill status={h.status} />
        <Party team={h.fromTeam} user={h.fromUser} />
        <ArrowRight size={12} className="shrink-0 text-[var(--w-text-3)]" />
        <Party team={h.toTeam} user={h.toUser} />
        <span className="ml-auto shrink-0 text-[var(--w-text-3)]">{relativeTime(h.decidedAt ?? h.createdAt)}</span>
        {h.status === 'RETURNED' && h.returnReason && (
          <p className="w-full whitespace-pre-wrap text-[12px] text-[var(--w-text)] [overflow-wrap:anywhere]">“{h.returnReason}”</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 px-3 py-3">
      {issueHref && (
        <Link href={issueHref} className="flex min-w-0 items-center gap-2 text-[13px] hover:underline">
          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{h.issueKey}</span>
          <span className="min-w-0 truncate font-medium">{h.issue.title}</span>
          {'project' in h && <span className="ml-auto hidden shrink-0 text-[12px] text-[var(--w-text-3)] sm:inline">{h.project.name}</span>}
        </Link>
      )}
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px]">
        <HandoffPill status={h.status} />
        <Party team={h.fromTeam} user={h.fromUser} />
        <ArrowRight size={13} className="shrink-0 text-[var(--w-text-3)]" />
        <Party team={h.toTeam} user={h.toUser} />
        <span className="ml-auto shrink-0 text-[12px] text-[var(--w-text-3)]">by {userName(h.createdBy)} · {relativeTime(h.createdAt)}</span>
      </div>
      {h.note && <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--w-text-2)] [overflow-wrap:anywhere]">{h.note}</p>}
      {h.checklist.length > 0 && (
        <div className="rounded-[6px] border border-[var(--w-border)]">
          <div className="flex items-center justify-between border-b border-[var(--w-border)] px-2.5 py-1.5 text-[12px] text-[var(--w-text-3)]">
            <span className="font-medium text-[var(--w-text-2)]">Handoff checklist</span>
            <span className="tabular">{done}/{ticks.length}</span>
          </div>
          <ul className="py-1">
            {h.checklist.map((c, i) => (
              <li key={i}>
                <label className={cn('flex items-start gap-2 px-2.5 py-1 text-[13px]', pending && h.canDecide && 'cursor-pointer hover:bg-[var(--w-hover)]')}>
                  <input
                    type="checkbox"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[var(--w-accent)]"
                    checked={ticks[i] ?? false}
                    disabled={!pending || !h.canDecide}
                    onChange={(e) => setTicks((t) => t.map((x, j) => (j === i ? e.target.checked : x)))}
                  />
                  <span className={cn('min-w-0 [overflow-wrap:anywhere]', ticks[i] && 'text-[var(--w-text-2)]')}>{c.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      {h.status === 'RETURNED' && h.returnReason && (
        <p className="rounded-[6px] border-l-2 border-[var(--w-red)] bg-[var(--w-sunken)] px-2.5 py-1.5 text-[13px] [overflow-wrap:anywhere]"><b className="font-medium">Returned:</b> {h.returnReason}</p>
      )}
      {pending && (h.canDecide || h.canCancel) && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {h.canCancel && (
            <button type="button" className="w-btn w-btn-ghost w-btn-sm mr-auto" disabled={cancel.isPending} onClick={() => cancel.mutate()}>
              <Undo2 size={12} /> Cancel handoff
            </button>
          )}
          {h.canDecide && (
            <>
              {!allTicked && <span className="text-[12px] text-[var(--w-text-3)]">Tick every item to accept</span>}
              <button type="button" className="w-btn w-btn-sm" onClick={() => setReturning(true)}><CornerUpLeft size={12} /> Return</button>
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!allTicked || accept.isPending} onClick={() => accept.mutate()}>
                {accept.isPending ? <Spinner size={11} /> : <Check size={12} />} Accept
              </button>
            </>
          )}
        </div>
      )}
      <Dialog
        open={returning}
        onClose={() => setReturning(false)}
        title={`Return ${h.issueKey}`}
        width={460}
        footer={
          <>
            <button type="button" className="w-btn" onClick={() => setReturning(false)}>Cancel</button>
            <button type="button" className="w-btn w-btn-danger-solid" disabled={reason.trim().length < 3 || ret.isPending} onClick={() => ret.mutate()}>
              {ret.isPending && <Spinner size={12} />} Return handoff
            </button>
          </>
        }
      >
        <label className="w-label" htmlFor={`ho-r-${h.id}`}>Why are you returning it?</label>
        <textarea id={`ho-r-${h.id}`} autoFocus className="w-input" rows={4} maxLength={5000} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What is missing before your team can take it over?" />
        <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">The sender is notified. The issue stays with its current team and assignee.</p>
      </Dialog>
    </div>
  );
}
