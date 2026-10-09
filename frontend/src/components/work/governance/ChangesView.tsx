'use client';

/**
 * Sổ YÊU CẦU THAY ĐỔI (CR) của dự án — /work/<ws>/<KEY>/changes (đợt S3b, mô-đun changeRequests).
 * Dải tổng (CR đã duyệt: +ngày, chi phí theo từng đơn vị — không quy đổi), lọc theo trạng thái
 * (dải đếm = bộ lọc), bảng ≥md / thẻ trên điện thoại, nút "New change request".
 */

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GitPullRequestArrow, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { CR_STATUSES, CR_STATUS_LABEL, govApi, govKeys, type CrStatus, type CrUrgency } from '@/lib/work-s3b-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, UserAvatar, relativeTime } from '../ui';
import { Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { CrStatusPill, fmtCost, fmtDays, useGovInvalidate } from './shared';

export function NewChangeDialog({ config, open, onClose, sourceIssueNumber }: { config: ProjectConfig; open: boolean; onClose: () => void; sourceIssueNumber?: number }) {
  const router = useRouter();
  const invalidate = useGovInvalidate(config.id);
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState<CrUrgency>('MEDIUM');
  const [useTemplate, setUseTemplate] = useState(true);
  const create = useMutation({
    mutationFn: () => govApi.createChange(config.id, { title: title.trim(), reason: reason.trim() || null, urgency, useTemplate, sourceIssueNumber: sourceIssueNumber ?? null }),
    onSuccess: (cr) => {
      toast.success(`${cr.key} created`);
      invalidate();
      onClose();
      setTitle(''); setReason('');
      router.push(`/work/${config.workspace.slug}/${config.key}/changes/${cr.number}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not create the change request')),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New change request"
      width={540}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || create.isPending} onClick={() => create.mutate()} data-testid="cr-create">
            {create.isPending ? <Spinner size={12} /> : <Plus size={13} />} Create
          </button>
        </>
      }
    >
      <Field label="What should change?">
        <input className="w-input" value={title} maxLength={255} autoFocus onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Add PayPal to checkout" data-testid="cr-title" />
      </Field>
      <Field label="Why (business value)">
        <textarea className="w-input" rows={3} maxLength={10000} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Who asked for it and what it is worth" />
      </Field>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <Field label="Urgency">
          <Select aria-label="Urgency" value={urgency} onChange={(e) => setUrgency(e.target.value as CrUrgency)}>
            <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
          </Select>
        </Field>
        <Field label="Description">
          <label className="flex h-9 items-center gap-2 text-[13px]">
            <input type="checkbox" checked={useTemplate} onChange={(e) => setUseTemplate(e.target.checked)} /> Start from the change request form
          </label>
        </Field>
      </div>
      <p className="text-[12px] text-[var(--w-text-3)]">You fill in the impact analysis (scope, schedule, cost, risks, alternatives) on the next page, then send it for approval.</p>
    </Dialog>
  );
}

export default function ChangesView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const [status, setStatus] = useState<CrStatus | ''>('');
  const [creating, setCreating] = useState(false);
  const q = useQuery({ queryKey: govKeys.changes(pid), queryFn: () => govApi.changes(pid) });
  const base = `/work/${config.workspace.slug}/${config.key}/changes`;
  if (q.isLoading) return <PageLoading rows={5} />;
  if (q.error || !q.data) return <EmptyState title="Could not load change requests" body={workError(q.error)} />;
  const { totals } = q.data;
  const items = q.data.items.filter((r) => !status || r.status === status);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-page">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" data-testid="cr-totals">
          <div className="w-card p-3">
            <div className="w-eyebrow">Approved</div>
            <div className="mt-1 text-[20px] font-semibold tabular-nums">{totals.approvedCount}</div>
          </div>
          <div className="w-card p-3">
            <div className="w-eyebrow">Schedule impact</div>
            <div className="mt-1 text-[20px] font-semibold tabular-nums">{fmtDays(totals.approvedDays)}</div>
          </div>
          <div className="w-card p-3">
            <div className="w-eyebrow">Approved cost</div>
            <div className="mt-1 min-w-0 text-[15px] font-semibold tabular-nums [overflow-wrap:anywhere]">
              {totals.approvedCost.length ? totals.approvedCost.map((c) => <div key={c.currency}>{fmtCost(c.amount, c.currency === '—' ? null : c.currency)}</div>) : '—'}
            </div>
          </div>
          <div className="w-card p-3">
            <div className="w-eyebrow">Waiting for decision</div>
            <div className={cn('mt-1 text-[20px] font-semibold tabular-nums', totals.pending > 0 && 'text-[var(--w-orange)]')}>{totals.pending}</div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="-mx-1 flex min-w-0 flex-1 flex-wrap gap-1 px-1" role="tablist" aria-label="Filter by status">
            <button type="button" role="tab" aria-selected={!status} onClick={() => setStatus('')} className={cn('w-btn w-btn-sm', !status && 'w-btn-on')}>All <span className="w-count">{q.data.items.length}</span></button>
            {CR_STATUSES.map((s) => (
              <button key={s} type="button" role="tab" aria-selected={status === s} onClick={() => setStatus(status === s ? '' : s)} className={cn('w-btn w-btn-sm', status === s && 'w-btn-on')}>
                {CR_STATUS_LABEL[s]} {totals.byStatus[s] ? <span className="w-count">{totals.byStatus[s]}</span> : null}
              </button>
            ))}
          </div>
          {q.data.canEdit && (
            <button type="button" className="w-btn w-btn-primary" onClick={() => setCreating(true)} data-testid="cr-new"><Plus size={14} /> New change request</button>
          )}
        </div>

        {!items.length ? (
          <EmptyState
            icon={<GitPullRequestArrow size={20} />}
            title={status ? `No ${CR_STATUS_LABEL[status].toLowerCase()} change requests` : 'No change requests yet'}
            body="Anything outside the signed scope goes here first: describe it, analyse the impact on scope, schedule and cost, then get it approved — by your client too."
          />
        ) : (
          <>
            <div className="w-card hidden overflow-hidden md:block">
            <table className="w-full table-fixed text-[13px]" data-testid="cr-table">
              <thead className="bg-[var(--w-sunken)] text-left text-[12px] text-[var(--w-text-3)]">
                <tr>
                  <th className="w-[84px] px-3 py-2 font-medium">Key</th>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="w-[130px] px-3 py-2 font-medium">Status</th>
                  <th className="w-[96px] px-3 py-2 text-right font-medium">Schedule</th>
                  <th className="w-[130px] px-3 py-2 text-right font-medium">Cost</th>
                  <th className="w-[150px] px-3 py-2 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--w-border)] hover:bg-[var(--w-hover)]">
                    <td className="px-3 py-2.5 font-mono text-[12px]"><Link href={`${base}/${r.number}`} className="text-[var(--w-accent-text)] hover:underline">{r.key}</Link></td>
                    <td className="min-w-0 px-3 py-2.5">
                      <Link href={`${base}/${r.number}`} className="block truncate font-medium hover:underline">{r.title}</Link>
                      <span className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
                        {r.clientVisible && <Pill tone="accent">Shared</Pill>}
                        {r.waitingDays !== null && <span className={cn(r.waitingDays > 5 && 'font-medium text-[var(--w-orange)]')}>waiting {r.waitingDays}d</span>}
                        <span>updated {relativeTime(r.updatedAt)}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5"><CrStatusPill status={r.status} /></td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtDays(r.scheduleDays)}</td>
                    <td className="truncate px-3 py-2.5 text-right tabular-nums">{fmtCost(r.costAmount, r.costCurrency)}</td>
                    <td className="px-3 py-2.5"><span className="flex min-w-0 items-center gap-1.5">{r.owner && <UserAvatar user={r.owner} size={18} />}<span className="truncate">{r.owner ? userName(r.owner) : '—'}</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <ul className="space-y-2 md:hidden" data-testid="cr-cards">
              {items.map((r) => (
                <li key={r.id}>
                  <Link href={`${base}/${r.number}`} className="w-card block p-3 hover:bg-[var(--w-hover)]">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{r.title}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                      <CrStatusPill status={r.status} />
                      <span className="tabular-nums">{fmtDays(r.scheduleDays)}</span>
                      <span className="tabular-nums">{fmtCost(r.costAmount, r.costCurrency)}</span>
                      {r.waitingDays !== null && <span>waiting {r.waitingDays}d</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <NewChangeDialog config={config} open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
