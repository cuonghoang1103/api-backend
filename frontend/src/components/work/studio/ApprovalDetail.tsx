'use client';

/**
 * Chi tiết một yêu cầu phê duyệt (S1, mô-đun approvals): các bước, ai đã quyết,
 * bình luận, chế độ tuần tự/song song, "Signed" (hash nội dung lúc quyết) +
 * cảnh báo "Content changed since approval" khi nội dung bây giờ khác lúc ký.
 *
 * Không ai quyết thay người khác — nút Approve/Reject chỉ hiện khi server nói
 * `canDecide` (đúng lượt của CHÍNH người xem). Reject bắt buộc lý do (server
 * cũng chặn: WORK_REJECT_REASON).
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Fingerprint, ListOrdered, Rows3, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workError, workStudioApi, type ApprovalStep, type ProjectConfig, type WorkApproval,
} from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, Spinner, UserAvatar, formatDate, relativeTime } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { ApprovalPill, Pill, fmtDateTime, useStudioInvalidate } from './shared';
// Đợt S6: lần chấm Spec Fidelity đính kèm phê duyệt cổng.
import { OverallBadge, ScoreBars } from '../spec/SpecPanel';
import type { SpecScores } from '@/lib/work-s6-api';

const short = (h: string | null) => (h ? `${h.slice(0, 8)}…${h.slice(-4)}` : '');

function StepDecision({ step, approval }: { step: ApprovalStep; approval: WorkApproval }) {
  if (step.decision === 'APPROVED') return <Pill tone="green">Approved</Pill>;
  if (step.decision === 'REJECTED') return <Pill tone="red">Rejected</Pill>;
  if (step.decision === 'SKIPPED') return <Pill tone="neutral">Skipped</Pill>;
  if (approval.status === 'PENDING' && approval.waitingOn.includes(step.approverId)) return <Pill tone="accent">Their turn</Pill>;
  return <Pill tone="neutral">Waiting</Pill>;
}

export function ApprovalBody({ approval: a, config, base: baseProp }: { approval: WorkApproval; config?: ProjectConfig | null; base?: string }) {
  const invalidate = useStudioInvalidate();
  const [comment, setComment] = useState('');
  const [needReason, setNeedReason] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const decided = a.steps.filter((s) => s.decision === 'APPROVED').length;
  const base = baseProp ?? (config ? `/work/${config.workspace.slug}/${config.key}` : null);

  const decide = useMutation({
    mutationFn: (decision: 'APPROVE' | 'REJECT') => workStudioApi.decideApproval(a.projectId, a.id, { decision, comment: comment.trim() || null }),
    onSuccess: (r, decision) => {
      toast.success(decision === 'APPROVE' ? (r.status === 'APPROVED' ? 'Approved — the request is complete' : 'Approved — waiting for the next approver') : 'Rejected');
      setComment('');
      invalidate();
    },
    onError: (err) => toast.error(workError(err, 'Could not record your decision')),
  });
  const cancel = useMutation({
    mutationFn: () => workStudioApi.cancelApproval(a.projectId, a.id),
    onSuccess: () => { toast.success('Approval request cancelled'); setConfirmCancel(false); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not cancel the request')),
  });

  const reject = () => {
    if (!comment.trim()) { setNeedReason(true); return; }
    decide.mutate('REJECT');
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <ApprovalPill status={a.status} />
          <Pill tone="neutral" title={a.mode === 'SEQUENTIAL' ? 'Approvers decide one after another, in order' : 'Every approver can decide at any time'}>
            {a.mode === 'SEQUENTIAL' ? 'Sequential' : 'Parallel'}
          </Pill>
          <span className="text-[12px] tabular text-[var(--w-text-3)]">{decided} of {a.steps.length} approved</span>
        </div>
        <h2 className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.01em] [overflow-wrap:anywhere]">{a.title}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--w-text-3)]">
          {a.targetType === 'ISSUE' && a.issueKey && (
            base ? <Link href={`${base}/issue/${a.issue?.number}`} className="font-mono text-[var(--w-accent-text)] hover:underline">{a.issueKey}</Link> : <span className="font-mono">{a.issueKey}</span>
          )}
          {a.targetType === 'DOC' && a.page && (
            base ? <Link href={`${base}/docs/${a.page.number}`} className="text-[var(--w-accent-text)] hover:underline">Document · {a.page.title}</Link> : <span>Document · {a.page.title}</span>
          )}
          {a.targetType === 'CR' && a.changeRequest && (
            base ? <Link href={`${base}/changes/${a.changeRequest.number}`} className="text-[var(--w-accent-text)] hover:underline">Change request · CR-{a.changeRequest.number}</Link> : <span>Change request · CR-{a.changeRequest.number}</span>
          )}
          {a.targetType === 'STAGE_GATE' && a.stage && (
            base ? <Link href={`${base}/stages`} className="text-[var(--w-accent-text)] hover:underline">Stage gate · {a.stage.n}. {a.stage.name}</Link> : <span>Stage gate · {a.stage.n}. {a.stage.name}</span>
          )}
          <span aria-hidden="true">·</span>
          <span>Requested by {userName(a.createdBy)} {relativeTime(a.createdAt)}</span>
          {a.dueAt && <><span aria-hidden="true">·</span><span className={cn(a.status === 'PENDING' && new Date(a.dueAt) < new Date() && 'font-medium text-[var(--w-red)]')}>Due {formatDate(a.dueAt)}</span></>}
        </div>
        {a.description && <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--w-text-2)]">{a.description}</p>}
        {(() => {
          const sr = (a as typeof a & { specReview?: (SpecScores & { id: number; scopeLabel: string; createdAt: string }) | null }).specReview;
          if (!sr) return null;
          return (
            <div className="mt-3 rounded-[8px] border border-[var(--w-border)] p-3" data-testid="approval-spec-review">
              <div className="mb-2 flex items-center gap-2.5">
                <OverallBadge n={sr.overall} size={34} />
                <div className="min-w-0 text-[12px] text-[var(--w-text-3)]">
                  <div className="text-[13px] font-medium text-[var(--w-text)]">Spec Fidelity attached</div>
                  <div className="truncate">{sr.scopeLabel} · checked {relativeTime(sr.createdAt)}</div>
                </div>
                {base && <Link href={`${base}/spec?review=${sr.id}`} className="ml-auto shrink-0 text-[12px] text-[var(--w-accent-text)] hover:underline">Open</Link>}
              </div>
              <ScoreBars s={sr} compact />
            </div>
          );
        })()}
      </div>

      {a.contentChanged && (
        <div className="flex gap-2.5 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_9%,transparent)] px-3 py-2.5 text-[13px]">
          <ShieldAlert size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
          <div>
            <div className="font-semibold">Content changed since approval</div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
              The {a.targetType === 'STAGE_GATE' ? 'stage' : a.targetType === 'DOC' ? 'document' : a.targetType === 'CR' ? 'change request' : 'issue'} was edited after someone signed. Their decision still stands — review what changed, and request a new approval if it matters.
            </p>
          </div>
        </div>
      )}
      {!a.contentChanged && a.changedSinceRequest && (
        <div className="flex gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
          <ShieldAlert size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          The content changed after this request was sent. Approvers sign whatever it says at the moment they decide.
        </div>
      )}

      <section>
        <h3 className="w-section-title mb-2 flex items-center gap-1.5">
          {a.mode === 'SEQUENTIAL' ? <ListOrdered size={14} className="text-[var(--w-text-3)]" /> : <Rows3 size={14} className="text-[var(--w-text-3)]" />}
          {a.mode === 'SEQUENTIAL' ? 'Approvers, in order' : 'Approvers'}
        </h3>
        <ol className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {a.steps.map((s, i) => {
            const signedChanged = !!s.contentHash && !!a.currentHash && s.contentHash !== a.currentHash;
            return (
              <li key={s.id} className="border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
                <div className="flex min-w-0 items-center gap-2.5">
                  {a.mode === 'SEQUENTIAL' && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[11px] font-semibold tabular text-[var(--w-text-2)]">{i + 1}</span>
                  )}
                  <UserAvatar user={s.approver} size={22} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{userName(s.approver)}</span>
                  <StepDecision step={s} approval={a} />
                </div>
                {(s.decidedAt || s.comment) && (
                  <div className={cn('mt-1.5 space-y-1.5', a.mode === 'SEQUENTIAL' ? 'pl-[60px]' : 'pl-[32px]')}>
                    {s.decidedAt && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                        <span>{fmtDateTime(s.decidedAt)}</span>
                        {s.contentHash && (
                          <span
                            className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-mono text-[11px] text-[var(--w-text-2)] shadow-[inset_0_0_0_1px_var(--w-border)]"
                            title={`Signed — SHA-256 of the content at the moment of the decision:\n${s.contentHash}`}
                          >
                            <Fingerprint size={11} /> Signed {short(s.contentHash)}
                          </span>
                        )}
                        {signedChanged && <span className="font-medium text-[var(--w-orange)]">changed since</span>}
                      </div>
                    )}
                    {s.comment && (
                      <p className="whitespace-pre-wrap rounded-[6px] border-l-2 border-[var(--w-border-strong)] bg-[var(--w-sunken)] px-2.5 py-1.5 text-[13px] leading-relaxed text-[var(--w-text)] [overflow-wrap:anywhere]">{s.comment}</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {a.canDecide && (
        <section className="rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-3">
          <div className="mb-2 text-[13px] font-semibold">Your decision</div>
          <label className="w-label" htmlFor={`ap-c-${a.id}`}>Comment {needReason ? <span className="text-[var(--w-red)]">— required to reject</span> : <span className="font-normal text-[var(--w-text-3)]">(required to reject)</span>}</label>
          <textarea
            id={`ap-c-${a.id}`}
            className="w-input"
            rows={3}
            maxLength={5000}
            value={comment}
            aria-invalid={needReason && !comment.trim()}
            onChange={(e) => { setComment(e.target.value); if (e.target.value.trim()) setNeedReason(false); }}
            placeholder="What did you check? Why are you rejecting?"
          />
          <p className="mt-1.5 text-[12px] text-[var(--w-text-2)]">Your decision is signed with a fingerprint of the current content and cannot be changed later.</p>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button type="button" className="w-btn w-btn-danger" disabled={decide.isPending} onClick={reject}>
              <X size={13} /> Reject
            </button>
            <button type="button" className="w-btn w-btn-primary" disabled={decide.isPending} onClick={() => decide.mutate('APPROVE')}>
              {decide.isPending ? <Spinner size={12} /> : <Check size={13} />} Approve
            </button>
          </div>
        </section>
      )}

      {a.status === 'PENDING' && !a.canDecide && a.myStepId && (
        <p className="text-[12px] text-[var(--w-text-3)]">You are an approver on this request. It becomes your turn when the approvers before you have approved.</p>
      )}

      {a.canCancel && (
        <div className="flex justify-end border-t border-[var(--w-border)] pt-3">
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setConfirmCancel(true)}>Cancel request</button>
        </div>
      )}
      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancel.mutate()}
        pending={cancel.isPending}
        title="Cancel approval request"
        body={a.targetType === 'STAGE_GATE' ? 'The stage goes back to Active. You can send it for gate review again later.' : 'Approvers will no longer be able to decide on it. Decisions already made are kept in the history.'}
        confirmLabel="Cancel request"
      />
    </div>
  );
}

/** Hộp thoại chi tiết theo id (dùng ở trang Approvals, trang Stages, chi tiết thẻ). */
export function ApprovalDialog({ pid, approvalId, config, base, onClose }: {
  pid: number; approvalId: number | null; config?: ProjectConfig | null;
  /** /work/<slug>/<KEY> khi không có config (My work). */
  base?: string;
  onClose: () => void;
}) {
  const q = useQuery({
    queryKey: ['work', 'approvals', pid, 'one', approvalId],
    queryFn: () => workStudioApi.approval(pid, approvalId!),
    enabled: !!approvalId,
  });
  return (
    <Dialog open={!!approvalId} onClose={onClose} title="Approval request" width={620}>
      {q.isLoading ? <PageLoading rows={4} /> : q.data ? <ApprovalBody approval={q.data} config={config} base={base} /> : (
        <EmptyState title="Approval request not found" body={workError(q.error, 'It may have been deleted, or you no longer have access to it.')} action={<button type="button" className="w-btn" onClick={onClose}>Close</button>} />
      )}
    </Dialog>
  );
}
