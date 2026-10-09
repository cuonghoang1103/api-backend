'use client';

/**
 * Cổng khách — thẻ Approvals: yêu cầu có khách đứng tên duyệt (cổng giai đoạn,
 * tài liệu CLIENT, thẻ, UAT). Khách quyết bước của CHÍNH mình; UAT có form riêng:
 * Approve (kèm điều kiện) / Reject (lý do + các điểm ⇒ thẻ BUG/CR). Đã quyết ⇒
 * link biên bản nghiệm thu in được.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BadgeCheck, CheckCircle2, FileText, Flag, Plus, Printer, ShieldCheck, Trash2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, workPortalApi, workPortalKeys, workStudioApi, type PortalApproval, type ProjectConfig } from '@/lib/work-api';
import { Dialog, EmptyState, formatDate, PageLoading, relativeTime, Spinner, StatusBadge, UserAvatar } from '../ui';
import { ApprovalPill, Pill } from '../studio/shared';
import { GateEvidenceView } from '../studio/GateEvidence';
import { wfmt, wt } from '@/components/work/i18n';

const KIND_LABEL: Record<string, string> = {
  get UAT() { return wt('portal.kUat'); },
  get STAGE_GATE() { return wt('portal.kGate'); },
  get DOC() { return wt('portal.kDoc'); },
  get ISSUE() { return wt('portal.kItem'); },
  get CR() { return wt('portal.kCr'); },
};

export function ApprovalsTab({ pid, asClient, config, openApproval }: { pid: number; asClient: boolean; config: ProjectConfig; openApproval: (id: number) => void }) {
  const q = useQuery({ queryKey: workPortalKeys.tab(pid, 'approvals', asClient), queryFn: () => workPortalApi.approvals(pid, asClient) });
  void config;
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={wt('portal.loadApprovalsFailed')} body={workError(q.error)} />;
  if (!q.data.items.length) return <EmptyState icon={<BadgeCheck size={20} />} title={wt('portal.noApprovals')} body={wt('portal.noApprovalsBody')} />;
  return (
    <ul className="w-card overflow-hidden" data-testid="portal-approvals">
      {q.data.items.map((a) => (
        <li key={a.id} className="border-b border-[var(--w-border)] last:border-b-0">
          <button type="button" onClick={() => openApproval(a.id)} className="flex w-full min-w-0 items-start gap-3 px-4 py-3 text-left hover:bg-[var(--w-hover)] md:items-center">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-sunken)] text-[var(--w-text-3)] md:mt-0">
              {a.targetType === 'UAT' ? <ShieldCheck size={14} /> : a.targetType === 'STAGE_GATE' ? <Flag size={14} /> : a.targetType === 'DOC' ? <FileText size={14} /> : <BadgeCheck size={14} />}
            </span>
            <span className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
              <span className="flex min-w-0 items-center gap-2 md:flex-1">
                <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{KIND_LABEL[a.targetType] ?? a.targetType}</span>
                <span className="truncate text-[14px] font-medium">{a.title}</span>
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-3)] md:mt-0 md:shrink-0">
                <ApprovalPill status={a.status} />
                {a.canDecide && <Pill tone="accent">{wt('gov.yourTurn')}</Pill>}
                {a.uat && <span>{wt('portal.roundItems', { r: a.uat.round, count: a.uat.itemCount })}</span>}
                <span className="whitespace-nowrap">{a.status === 'PENDING' && a.dueAt ? wt('portal.dueCap', { d: formatDate(a.dueAt) }) : relativeTime(a.decidedAt ?? a.createdAt)}</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

type Point = { title: string; kind: 'BUG' | 'CHANGE'; detail: string };

function DecideBox({ pid, a, onDone }: { pid: number; a: PortalApproval; onDone: () => void }) {
  const qc = useQueryClient();
  const isUat = a.targetType === 'UAT';
  const [mode, setMode] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [comment, setComment] = useState('');
  const [conditions, setConditions] = useState('');
  const [points, setPoints] = useState<Point[]>([]);
  const decide = useMutation({
    mutationFn: async () => {
      if (isUat) {
        return workPortalApi.decideUat(pid, a.id, {
          decision: mode!, comment: comment || null, conditions: mode === 'APPROVE' ? conditions || null : null,
          points: mode === 'REJECT' ? points.filter((p) => p.title.trim()).map((p) => ({ title: p.title.trim(), kind: p.kind, detail: p.detail || null })) : undefined,
        });
      }
      return workStudioApi.decideApproval(pid, a.id, { decision: mode!, comment: comment || null });
    },
    onSuccess: () => {
      toast.success(mode === 'APPROVE' ? wt('portal.approvedThanks') : wt('portal.sentBack'));
      qc.invalidateQueries({ queryKey: workPortalKeys.all(pid) });
      setMode(null); onDone();
    },
    onError: (err) => toast.error(workError(err, wt('portal.decisionFailed'))),
  });
  if (!mode) {
    return (
      <div className="flex flex-wrap gap-2">
        <button type="button" className="w-btn w-btn-primary" onClick={() => setMode('APPROVE')} data-testid="portal-approve"><CheckCircle2 size={14} /> {wt('portal.approve')}</button>
        <button type="button" className="w-btn" onClick={() => setMode('REJECT')} data-testid="portal-reject"><XCircle size={14} /> {wt('portal.reject')}</button>
      </div>
    );
  }
  const rejectInvalid = mode === 'REJECT' && !comment.trim();
  return (
    <div className="space-y-3 rounded-[8px] border border-[var(--w-border)] p-3">
      <div className="text-[13px] font-semibold">{mode === 'APPROVE' ? (isUat ? wt('portal.acceptDelivery') : wt('portal.approve')) : (isUat ? wt('portal.rejectFix') : wt('portal.reject'))}</div>
      <label className="block">
        <span className="mb-1 block text-[12.5px] font-medium">{mode === 'REJECT' ? wt('portal.reasonReq') : wt('portal.commentOpt')}</span>
        <textarea className="w-input min-h-[70px] py-2" value={comment} onChange={(e) => setComment(e.target.value)} data-testid="portal-decide-comment" />
      </label>
      {isUat && mode === 'APPROVE' && (
        <label className="block">
          <span className="mb-1 block text-[12.5px] font-medium">{wt('portal.condOpt')}</span>
          <textarea className="w-input min-h-[56px] py-2" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder={wt('portal.condPh')} data-testid="portal-conditions" />
          <span className="mt-1 block text-[11.5px] text-[var(--w-text-3)]">{wt('portal.condNote')}</span>
        </label>
      )}
      {isUat && mode === 'REJECT' && (
        <div>
          <div className="mb-1.5 flex items-center"><span className="text-[12.5px] font-medium">{wt('portal.pointsFound')}</span>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setPoints((p) => [...p, { title: '', kind: 'BUG', detail: '' }])} data-testid="portal-add-point"><Plus size={13} /> {wt('portal.addPoint')}</button>
          </div>
          {!points.length && <p className="text-[12px] text-[var(--w-text-3)]">{wt('portal.pointsNote')}</p>}
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2">
                <select aria-label={wt('swr.kind')} className="w-input !h-9 !w-auto" value={p.kind} onChange={(e) => setPoints((ps) => ps.map((x, j) => (j === i ? { ...x, kind: e.target.value as Point['kind'] } : x)))}>
                  <option value="BUG">{wt('status.tyBug')}</option><option value="CHANGE">{wt('desk.typeChange')}</option>
                </select>
                <input className="w-input" placeholder={wt('portal.pointPh')} value={p.title} onChange={(e) => setPoints((ps) => ps.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} data-testid={`portal-point-${i}`} />
                <button type="button" className="w-btn w-btn-ghost w-btn-icon" aria-label={wt('portal.removePoint')} onClick={() => setPoints((ps) => ps.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" className="w-btn w-btn-ghost" onClick={() => setMode(null)}>{wt('common.cancel')}</button>
        <button type="button" className={cn('w-btn', mode === 'APPROVE' ? 'w-btn-primary' : 'w-btn-danger-solid')} disabled={rejectInvalid || decide.isPending} onClick={() => decide.mutate()} data-testid="portal-confirm-decision">
          {decide.isPending && <Spinner size={12} />} {mode === 'APPROVE' ? wt('portal.confirmApproval') : wt('portal.confirmRejection')}
        </button>
      </div>
      <p className="text-[11.5px] text-[var(--w-text-3)]">{wt('portal.signedNote')}</p>
    </div>
  );
}

export function PortalApprovalDialog({ pid, id, asClient, config, onClose }: { pid: number; id: number | null; asClient: boolean; config: ProjectConfig; onClose: () => void }) {
  const q = useQuery({ queryKey: workPortalKeys.approval(pid, id ?? 0, asClient), queryFn: () => workPortalApi.approval(pid, id!, asClient), enabled: !!id });
  const a = q.data;
  const certHref = `/work/${config.workspace.slug}/${config.key}/portal/uat/${id}${asClient ? '?preview=1' : ''}`;
  return (
    <Dialog open={!!id} onClose={onClose} width={720} title={a ? a.title : wt('common.loading')}>
      {q.isLoading ? <PageLoading rows={3} /> : q.error || !a ? <EmptyState title={wt('diagram.notAvail')} body={workError(q.error)} /> : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
            <ApprovalPill status={a.status} />
            <span>{KIND_LABEL[a.targetType] ?? a.targetType}</span>
            {a.stage && <span>{wt('portal.stageN', { n: a.stage.n, s: a.stage.name })}</span>}
            {a.page && <span>{wt('portal.documentT', { t: a.page.title })}</span>}
            {a.issue && <span>{a.issue.key} {a.issue.title}</span>}
            {a.createdBy && <span>{wt('portal.requestedBy', { n: userName(a.createdBy), t: relativeTime(a.createdAt) })}</span>}
            {a.dueAt && <span>{wt('portal.dueCap', { d: formatDate(a.dueAt) })}</span>}
          </div>
          {a.description && <p className="whitespace-pre-line text-[13.5px]">{a.description}</p>}
          {/* CTW-1: xem trước như khách ⇒ nhân viên thấy đúng lời nhắn khách nhận; quản lý ⇒ thấy cả hai. */}
          {a.clientNote && !asClient && (
            <p className="whitespace-pre-line rounded-[8px] border border-[var(--w-border)] px-3 py-2 text-[13px]"><span className="mb-0.5 block text-[12px] font-medium text-[var(--w-text-3)]">{wt('portal.msgToClient')}</span>{a.clientNote}</p>
          )}
          {a.evidence && <GateEvidenceView pid={pid} ev={a.evidence} clientView={asClient || !!config.clientView} />}
          {a.contentChanged && <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">{wt('portal.contentChanged')}</p>}
          {a.changeRequest && (
            <section data-testid="portal-cr-analysis">
              <h3 className="w-section-title mb-2">{wt('portal.crImpact', { k: a.changeRequest.key })}</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 rounded-[8px] border border-[var(--w-border)] p-3 text-[13px] sm:grid-cols-2">
                {[
                  [wt('portal.why'), a.changeRequest.reason],
                  [wt('rep.scope'), a.changeRequest.impactScope],
                  [wt('gov.schedule'), a.changeRequest.scheduleDays === null ? null : wt('portal.signedDays', { s: a.changeRequest.scheduleDays > 0 ? '+' : '', count: a.changeRequest.scheduleDays })],
                  [wt('gov.cost'), a.changeRequest.costAmount === null ? null : `${a.changeRequest.costAmount.toLocaleString(wfmt.intl())} ${(a.changeRequest.costCurrency ?? '').toUpperCase()}`.trim()],
                  [wt('gov.risks'), a.changeRequest.impactRisk],
                  [wt('gov.alternatives'), a.changeRequest.alternatives],
                ].map(([k, v]) => (
                  <div key={k as string} className="min-w-0">
                    <dt className="text-[12px] font-medium text-[var(--w-text-3)]">{k}</dt>
                    <dd className="mt-0.5 whitespace-pre-line [overflow-wrap:anywhere]">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {a.uat && (
            <section>
              <h3 className="w-section-title mb-2">{wt('portal.accepting', { s: a.uat.version ? `— ${a.uat.version.name}` : a.uat.stage ? `— ${a.uat.stage.n}. ${a.uat.stage.name}` : '' })}</h3>
              <p className="mb-2 text-[12.5px] text-[var(--w-text-3)]">{wt('portal.roundLine', { r: a.uat.round, e: a.uat.environment ? ` · ${a.uat.environment}` : '', b: a.uat.build ? wt('portal.buildSp', { b: a.uat.build }) : '' })}</p>
              <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]" data-testid="portal-uat-items">
                {a.uat.items.map((i) => (
                  <li key={i.number} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
                    <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span>
                    <span className="min-w-0 flex-1 truncate">{i.title}</span>
                    <StatusBadge status={i.status} />
                  </li>
                ))}
              </ul>
              {(a.uat.pages.length > 0 || a.uat.files.length > 0) && (
                <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">{wt('portal.attached', { s: [...a.uat.pages.map((p) => p.title), ...a.uat.files.map((f) => f.fileName)].join(' · ') })}</p>
              )}
              {a.uat.conditions && <p className="mt-2 text-[13px]"><b>{wt('portal.conditions')}</b> {a.uat.conditions}</p>}
              {a.uat.createdIssues.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1 text-[12.5px] font-medium">{wt('portal.raised')}</div>
                  <ul className="space-y-1 text-[13px]">{a.uat.createdIssues.map((i) => <li key={i.number} className="flex items-center gap-2"><span className="font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span><span className="min-w-0 flex-1 truncate">{i.title}</span><span className="text-[12px] text-[var(--w-text-3)]">{i.type.name}</span></li>)}</ul>
                </div>
              )}
            </section>
          )}
          <section>
            <h3 className="w-section-title mb-2">{wt('portal.signOff')}</h3>
            <ol className="space-y-2">
              {a.steps.map((s) => (
                <li key={s.id} className="flex min-w-0 items-start gap-2.5 text-[13px]">
                  <UserAvatar user={s.approver} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{userName(s.approver)}</span> <span className="text-[var(--w-text-3)]">{s.isClient ? wt('portal.client') : wt('portal.team')}</span>
                    <span className="block text-[12px] text-[var(--w-text-3)]">
                      {s.decision === 'PENDING' ? wt('portal.waiting') : `${s.decision === 'APPROVED' ? wt('portal.stApproved') : s.decision === 'REJECTED' ? wt('portal.stRejected') : wt('portal.stSkipped')}${s.decidedAt ? ` · ${new Date(s.decidedAt).toLocaleString(wfmt.intl())}` : ''}`}
                      {s.signature && <span className="font-mono">{wt('portal.sig', { s: s.signature.slice(0, 12) })}</span>}
                    </span>
                    {s.comment && <span className="mt-0.5 block whitespace-pre-line text-[12.5px] text-[var(--w-text-2)]">“{s.comment}”</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
          {a.canDecide && <DecideBox pid={pid} a={a} onDone={() => void q.refetch()} />}
          {a.targetType === 'UAT' && a.status !== 'PENDING' && (
            <Link href={certHref} className="w-btn" data-testid="portal-certificate"><Printer size={14} /> {wt('portal.certificate')}</Link>
          )}
        </div>
      )}
    </Dialog>
  );
}
