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
import { GateEvidenceView } from './GateEvidence';
import { wt } from '@/components/work/i18n';

const short = (h: string | null) => (h ? `${h.slice(0, 8)}…${h.slice(-4)}` : '');

function StepDecision({ step, approval }: { step: ApprovalStep; approval: WorkApproval }) {
  if (step.decision === 'APPROVED') return <Pill tone="green">{wt('portal.stApproved')}</Pill>;
  if (step.decision === 'REJECTED') return <Pill tone="red">{wt('portal.stRejected')}</Pill>;
  if (step.decision === 'SKIPPED') return <Pill tone="neutral">{wt('portal.stSkipped')}</Pill>;
  if (approval.status === 'PENDING' && approval.waitingOn.includes(step.approverId)) return <Pill tone="accent">{wt('studio.theirTurn')}</Pill>;
  return <Pill tone="neutral">{wt('portal.waiting')}</Pill>;
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
      toast.success(decision === 'APPROVE' ? (r.status === 'APPROVED' ? wt('studio.approvedComplete') : wt('studio.approvedNext')) : wt('portal.stRejected'));
      setComment('');
      invalidate();
    },
    onError: (err) => toast.error(workError(err, wt('portal.decisionFailed'))),
  });
  const cancel = useMutation({
    mutationFn: () => workStudioApi.cancelApproval(a.projectId, a.id),
    onSuccess: () => { toast.success(wt('studio.reqCancelled')); setConfirmCancel(false); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('studio.cancelReqFailed'))),
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
          <Pill tone="neutral" title={a.mode === 'SEQUENTIAL' ? wt('studio.seqTitle') : wt('studio.parTitle')}>
            {a.mode === 'SEQUENTIAL' ? wt('studio.sequential') : wt('studio.parallelCap')}
          </Pill>
          <span className="text-[12px] tabular text-[var(--w-text-3)]">{decided} of {a.steps.length} approved</span>
        </div>
        <h2 className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.01em] [overflow-wrap:anywhere]">{a.title}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--w-text-3)]">
          {a.targetType === 'ISSUE' && a.issueKey && (
            base ? <Link href={`${base}/issue/${a.issue?.number}`} className="font-mono text-[var(--w-accent-text)] hover:underline">{a.issueKey}</Link> : <span className="font-mono">{a.issueKey}</span>
          )}
          {a.targetType === 'DOC' && a.page && (
            base ? <Link href={`${base}/docs/${a.page.number}`} className="text-[var(--w-accent-text)] hover:underline">{wt('portal.kDoc')} · {a.page.title}</Link> : <span>{wt('portal.kDoc')} · {a.page.title}</span>
          )}
          {a.targetType === 'CR' && a.changeRequest && (
            base ? <Link href={`${base}/changes/${a.changeRequest.number}`} className="text-[var(--w-accent-text)] hover:underline">{wt('portal.kCr')} · CR-{a.changeRequest.number}</Link> : <span>{wt('portal.kCr')} · CR-{a.changeRequest.number}</span>
          )}
          {a.targetType === 'STAGE_GATE' && a.stage && (
            base ? <Link href={`${base}/stages`} className="text-[var(--w-accent-text)] hover:underline">{wt('portal.kGate')} · {a.stage.n}. {a.stage.name}</Link> : <span>{wt('portal.kGate')} · {a.stage.n}. {a.stage.name}</span>
          )}
          <span aria-hidden="true">·</span>
          <span>{wt('studio.requestedByT', { n: userName(a.createdBy), t: relativeTime(a.createdAt) })}</span>
          {a.dueAt && <><span aria-hidden="true">·</span><span className={cn(a.status === 'PENDING' && new Date(a.dueAt) < new Date() && 'font-medium text-[var(--w-red)]')}>{wt('portal.dueCap', { d: formatDate(a.dueAt) })}</span></>}
        </div>
        {a.description && <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--w-text-2)]">{a.description}</p>}
        {/* CTW-1: lời nhắn người gửi viết cho khách (khách đọc nó thay cho ghi chú nội bộ). */}
        {a.clientNote && !config?.clientView && (
          <div className="mt-3 rounded-[8px] border border-[var(--w-border)] px-3 py-2 text-[13px]" data-testid="approval-client-note">
            <div className="mb-0.5 text-[12px] font-medium text-[var(--w-text-3)]">{wt('portal.msgToClient')}</div>
            <p className="whitespace-pre-wrap leading-relaxed">{a.clientNote}</p>
          </div>
        )}
        {a.evidence && (
          <div className="mt-4">
            <GateEvidenceView pid={a.projectId} ev={a.evidence} clientView={!!config?.clientView} docHref={base ? (n) => `${base}/docs/${n}` : undefined} />
          </div>
        )}
        {(() => {
          const sr = (a as typeof a & { specReview?: (SpecScores & { id: number; scopeLabel: string; createdAt: string }) | null }).specReview;
          if (!sr) return null;
          return (
            <div className="mt-3 rounded-[8px] border border-[var(--w-border)] p-3" data-testid="approval-spec-review">
              <div className="mb-2 flex items-center gap-2.5">
                <OverallBadge n={sr.overall} size={34} />
                <div className="min-w-0 text-[12px] text-[var(--w-text-3)]">
                  <div className="text-[13px] font-medium text-[var(--w-text)]">{wt('studio.specAttached')}</div>
                  <div className="truncate">{wt('studio.checkedT', { s: sr.scopeLabel, t: relativeTime(sr.createdAt) })}</div>
                </div>
                {base && <Link href={`${base}/spec?review=${sr.id}`} className="ml-auto shrink-0 text-[12px] text-[var(--w-accent-text)] hover:underline">{wt('common.open')}</Link>}
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
            <div className="font-semibold">{wt('studio.contentChangedT')}</div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
              {wt('studio.editedAfter', { w: a.targetType === 'STAGE_GATE' ? wt('studio.wStage') : a.targetType === 'DOC' ? wt('studio.wDoc') : a.targetType === 'CR' ? wt('studio.wCr') : wt('studio.wIssue') })}
            </p>
          </div>
        </div>
      )}
      {!a.contentChanged && a.changedSinceRequest && (
        <div className="flex gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
          <ShieldAlert size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          {wt('studio.changedAfterReq')}
        </div>
      )}

      <section>
        <h3 className="w-section-title mb-2 flex items-center gap-1.5">
          {a.mode === 'SEQUENTIAL' ? <ListOrdered size={14} className="text-[var(--w-text-3)]" /> : <Rows3 size={14} className="text-[var(--w-text-3)]" />}
          {a.mode === 'SEQUENTIAL' ? wt('studio.approversOrder') : wt('studio.approvers')}
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
                            title={wt('studio.signedTitle', { h: s.contentHash })}
                          >
                            <Fingerprint size={11} /> {wt('studio.signedH', { h: short(s.contentHash) })}
                          </span>
                        )}
                        {signedChanged && <span className="font-medium text-[var(--w-orange)]">{wt('studio.changedSinceLc')}</span>}
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
          <div className="mb-2 text-[13px] font-semibold">{wt('studio.yourDecision')}</div>
          <label className="w-label" htmlFor={`ap-c-${a.id}`}>{wt('studio.commentL')} {needReason ? <span className="text-[var(--w-red)]">{wt('studio.reqReject')}</span> : <span className="font-normal text-[var(--w-text-3)]">{wt('studio.reqRejectP')}</span>}</label>
          <textarea
            id={`ap-c-${a.id}`}
            className="w-input"
            rows={3}
            maxLength={5000}
            value={comment}
            aria-invalid={needReason && !comment.trim()}
            onChange={(e) => { setComment(e.target.value); if (e.target.value.trim()) setNeedReason(false); }}
            placeholder={wt('studio.decidePh')}
          />
          <p className="mt-1.5 text-[12px] text-[var(--w-text-2)]">{wt('studio.signedCannot')}</p>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button type="button" className="w-btn w-btn-danger" disabled={decide.isPending} onClick={reject}>
              <X size={13} /> {wt('portal.reject')}
            </button>
            <button type="button" className="w-btn w-btn-primary" disabled={decide.isPending} onClick={() => decide.mutate('APPROVE')}>
              {decide.isPending ? <Spinner size={12} /> : <Check size={13} />} {wt('portal.approve')}
            </button>
          </div>
        </section>
      )}

      {a.status === 'PENDING' && !a.canDecide && a.myStepId && (
        <p className="text-[12px] text-[var(--w-text-3)]">{wt('studio.youAreApprover')}</p>
      )}

      {a.canCancel && (
        <div className="flex justify-end border-t border-[var(--w-border)] pt-3">
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setConfirmCancel(true)}>{wt('studio.cancelRequest')}</button>
        </div>
      )}
      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancel.mutate()}
        pending={cancel.isPending}
        title={wt('studio.cancelApprovalT')}
        body={a.targetType === 'STAGE_GATE' ? wt('studio.stageBack') : wt('studio.noLongerDecide')}
        confirmLabel={wt('studio.cancelRequest')}
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
    <Dialog open={!!approvalId} onClose={onClose} title={wt('studio.approvalRequest')} width={620}>
      {q.isLoading ? <PageLoading rows={4} /> : q.data ? <ApprovalBody approval={q.data} config={config} base={base} /> : (
        <EmptyState title={wt('studio.approvalNotFound')} body={workError(q.error, wt('studio.mayDeleted'))} action={<button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>} />
      )}
    </Dialog>
  );
}
