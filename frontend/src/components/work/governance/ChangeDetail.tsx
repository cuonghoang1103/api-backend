'use client';

/**
 * Một YÊU CẦU THAY ĐỔI — /work/<ws>/<KEY>/changes/<n> (đợt S3b).
 *
 * Luồng: Draft → Submitted → Under review (gửi duyệt — approvals targetType CR, chữ ký =
 * phân tích ảnh hưởng) → Approved / Rejected → Implemented. Duyệt xong ⇒ khối wt('gov.implementation')
 * hiện ĐỀ XUẤT thẻ (tất định, sửa được) — chỉ tạo khi bấm "Create issues".
 * `?approval=<id>` (link trong thông báo) mở thẳng hộp phê duyệt.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BadgeCheck, CheckCircle2, Eye, EyeOff, Link2, ListPlus, Save, Send, Trash2, Undo2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, workStudioApi, workStudioKeys, type ProjectConfig, type TiptapDoc } from '@/lib/work-api';
import { CR_STATUS_LABEL, govApi, govKeys, type CrDetail, type CrPatch, type CrUrgency } from '@/lib/work-s3b-api';
import RichEditor, { RichView } from '../RichEditor';
import { EmptyState, Field, PageLoading, Spinner, StatusBadge, UserAvatar, formatDate, relativeTime } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { ApprovalDialog } from '../studio/ApprovalDetail';
import { RequestApprovalDialog } from '../studio/IssueStudio';
import { ApprovalPill, Pill, useStudioInvalidate } from '../studio/shared';
import { CrStatusPill, Kv, PersonSelect, ScoreBadge, Section, fmtCost, fmtDays, useGovInvalidate } from './shared';
import { wt } from '@/components/work/i18n';
import { CrAffected } from '../quality/BaselinesTab'; // CTW đợt 6

type Form = Required<Pick<CrPatch, 'title' | 'reason' | 'urgency' | 'impactScope' | 'scheduleDays' | 'costAmount' | 'costCurrency' | 'impactRisk' | 'alternatives' | 'ownerId' | 'requesterId'>>;

const formOf = (c: CrDetail): Form => ({
  title: c.title, reason: c.reason ?? '', urgency: c.urgency, impactScope: c.impactScope ?? '', scheduleDays: c.scheduleDays, costAmount: c.costAmount,
  costCurrency: c.costCurrency ?? '', impactRisk: c.impactRisk ?? '', alternatives: c.alternatives ?? '', ownerId: c.owner?.id ?? null, requesterId: c.requester?.id ?? null,
});

function Analysis({ config, cr }: { config: ProjectConfig; cr: CrDetail }) {
  const invalidate = useGovInvalidate(config.id);
  const [f, setF] = useState<Form>(() => formOf(cr));
  useEffect(() => setF(formOf(cr)), [cr]);
  const dirty = JSON.stringify(f) !== JSON.stringify(formOf(cr));
  const ro = !cr.canEdit || cr.status === 'IMPLEMENTED';
  const save = useMutation({
    mutationFn: () => govApi.updateChange(config.id, cr.number, {
      ...f, title: f.title.trim(), reason: f.reason || null, impactScope: f.impactScope || null, costCurrency: f.costCurrency || null,
      impactRisk: f.impactRisk || null, alternatives: f.alternatives || null, version: cr.version,
    }),
    onSuccess: () => { toast.success(wt('gov.impactSaved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const area = (k: 'reason' | 'impactScope' | 'impactRisk' | 'alternatives', label: string, ph: string) => (
    <Field label={label}>
      <textarea className="w-input" rows={3} maxLength={10000} value={f[k] ?? ''} disabled={ro} onChange={(e) => set(k, e.target.value)} placeholder={ro ? '—' : ph} data-testid={`cr-${k}`} />
    </Field>
  );
  return (
    <Section
      title={wt('gov.impactAnalysis')}
      action={!ro && (
        <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!dirty || !f.title.trim() || save.isPending} onClick={() => save.mutate()} data-testid="cr-save">
          {save.isPending ? <Spinner size={12} /> : <Save size={13} />} {dirty ? wt('common.save') : wt('common.saved')}
        </button>
      )}
    >
      {cr.pendingApprovalId && dirty && (
        <p className="mb-3 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_9%,transparent)] px-3 py-2 text-[12.5px]">
          {wt('gov.underReviewWarn')}
        </p>
      )}
      <Field label={wt('common.title')}>
        <input className="w-input" value={f.title} maxLength={255} disabled={ro} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        {area('reason', wt('gov.why'), wt('gov.whyPh'))}
        {area('impactScope', wt('gov.scopeImpact'), wt('gov.scopePh'))}
        <Field label={wt('gov.scheduleImpact')} hint={wt('gov.negSaves')}>
          <input type="number" className="w-input" value={f.scheduleDays ?? ''} disabled={ro} step={1} onChange={(e) => set('scheduleDays', e.target.value === '' ? null : Math.trunc(Number(e.target.value)))} placeholder="e.g. 5" data-testid="cr-days" />
        </Field>
        <Field label={wt('gov.cost')} hint={wt('gov.costHint')}>
          <div className="flex gap-2">
            <input type="number" className="w-input min-w-0 flex-1" value={f.costAmount ?? ''} disabled={ro} onChange={(e) => set('costAmount', e.target.value === '' ? null : Number(e.target.value))} placeholder={wt('gov.amountPh')} data-testid="cr-cost" />
            <input className="w-input !w-[96px] shrink-0" value={f.costCurrency ?? ''} maxLength={16} disabled={ro} onChange={(e) => set('costCurrency', e.target.value)} placeholder="USD" aria-label={wt('gov.currencyUnit')} data-testid="cr-currency" />
          </div>
        </Field>
        {area('impactRisk', wt('gov.newRisks'), wt('gov.newRisksPh'))}
        {area('alternatives', wt('gov.alternatives'), wt('gov.altPh'))}
        <Field label={wt('gov.urgency')}>
          <Select aria-label={wt('gov.urgency')} value={f.urgency} disabled={ro} onChange={(e) => set('urgency', e.target.value as CrUrgency)}>
            <option value="LOW">{wt('status.prioLow')}</option><option value="MEDIUM">{wt('status.prioMedium')}</option><option value="HIGH">{wt('status.prioHigh')}</option>
          </Select>
        </Field>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Field label={wt('gov.owner')}><PersonSelect config={config} value={f.ownerId} onChange={(v) => set('ownerId', v)} label={wt('gov.owner')} staffOnly disabled={ro} /></Field>
          <Field label={wt('gov.requestedBy')}><PersonSelect config={config} value={f.requesterId} onChange={(v) => set('requesterId', v)} label={wt('gov.requestedBy')} disabled={ro} /></Field>
        </div>
      </div>
    </Section>
  );
}

function Description({ config, cr }: { config: ProjectConfig; cr: CrDetail }) {
  const invalidate = useGovInvalidate(config.id);
  const [editing, setEditing] = useState(false);
  const [doc, setDoc] = useState<TiptapDoc | null>(cr.descriptionJson);
  const save = useMutation({
    mutationFn: () => govApi.updateChange(config.id, cr.number, { descriptionJson: doc, version: cr.version }),
    onSuccess: () => { toast.success(wt('gov.descSaved')); setEditing(false); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const canEdit = cr.canEdit && cr.status !== 'IMPLEMENTED';
  return (
    <Section
      title={wt('common.description')}
      action={canEdit && (editing ? (
        <>
          <button type="button" className="w-btn w-btn-sm" onClick={() => { setDoc(cr.descriptionJson); setEditing(false); }}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('common.save')}</button>
        </>
      ) : <button type="button" className="w-btn w-btn-sm" onClick={() => { setDoc(cr.descriptionJson); setEditing(true); }}>{wt('common.edit')}</button>)}
    >
      {editing ? (
        <RichEditor value={doc} onChange={(d) => setDoc(d)} docs toolbar minHeight={180} members={config.members} projectId={config.id} />
      ) : cr.descriptionJson ? (
        <div className="w-doc max-w-full overflow-x-auto"><RichView value={cr.descriptionJson} docs /></div>
      ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('gov.noDesc')}</p>}
    </Section>
  );
}

function Affected({ config, cr }: { config: ProjectConfig; cr: CrDetail }) {
  const invalidate = useGovInvalidate(config.id);
  const [kind, setKind] = useState<'issue' | 'stage' | 'version'>('issue');
  const [val, setVal] = useState('');
  const stages = useQuery({ queryKey: workStudioKeys.stages(config.id), queryFn: () => workStudioApi.stages(config.id), enabled: !!config.modules?.stages && kind === 'stage' });
  const versions = useQuery({ queryKey: ['work', 'gov', config.id, 'versions'], queryFn: () => workApi.versions(config.id), enabled: kind === 'version' });
  const add = useMutation({
    mutationFn: () => govApi.linkChange(config.id, cr.number, kind === 'issue'
      ? { issueNumber: Number(val.replace(/^[A-Z0-9]+-/i, '')) }
      : kind === 'stage' ? { stageId: Number(val) } : { versionId: Number(val) }),
    onSuccess: () => { setVal(''); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.linkFailed'))),
  });
  const del = useMutation({
    mutationFn: (id: number) => govApi.unlinkChange(config.id, cr.number, id),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err, wt('gov.unlinkFailed'))),
  });
  const affected = cr.links.filter((l) => l.role === 'AFFECTED');
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const ro = !cr.canEdit || cr.status === 'IMPLEMENTED';
  return (
    <Section title={wt('gov.affected')}>
      {affected.length ? (
        <ul className="mb-3 divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]" data-testid="cr-affected">
          {affected.map((l) => (
            <li key={l.id} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
              {l.issue && <><Link href={`${base}/issue/${l.issue.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.issue.key}</Link><span className="min-w-0 flex-1 truncate">{l.issue.title}</span><StatusBadge status={l.issue.status} /></>}
              {l.stage && <><span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{wt('gov.stage')}</span><span className="min-w-0 flex-1 truncate">{l.stage.n}. {l.stage.name}</span></>}
              {l.version && <><span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{wt('common.version')}</span><span className="min-w-0 flex-1 truncate">{l.version.name}{l.version.releaseDate ? ` · ${formatDate(l.version.releaseDate)}` : ''}</span></>}
              {!ro && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('gov.removeLink')} onClick={() => del.mutate(l.id)}><X size={13} /></button>}
            </li>
          ))}
        </ul>
      ) : <p className="mb-3 text-[13px] text-[var(--w-text-3)]">{wt('gov.nothingLinked')}</p>}
      {!ro && (
        <div className="flex flex-wrap items-center gap-2">
          <Select aria-label={wt('gov.linkType')} value={kind} onChange={(e) => { setKind(e.target.value as typeof kind); setVal(''); }} className="!w-auto">
            <option value="issue">{wt('common.issue')}</option>
            {config.modules?.stages && <option value="stage">{wt('gov.stage')}</option>}
            <option value="version">{wt('common.version')}</option>
          </Select>
          {kind === 'issue' && <input className="w-input !w-[150px]" value={val} onChange={(e) => setVal(e.target.value)} placeholder={`${config.key}-12`} aria-label={wt('gov.issueKey')} data-testid="cr-link-issue" />}
          {kind === 'stage' && (
            <Select aria-label={wt('gov.stage')} value={val} onChange={(e) => setVal(e.target.value)} className="!w-auto max-w-full">
              <option value="">{wt('gov.chooseStage')}</option>
              {(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}
            </Select>
          )}
          {kind === 'version' && (
            <Select aria-label={wt('common.version')} value={val} onChange={(e) => setVal(e.target.value)} className="!w-auto max-w-full">
              <option value="">{wt('gov.chooseVersion')}</option>
              {(versions.data ?? []).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </Select>
          )}
          <button type="button" className="w-btn w-btn-sm" disabled={!val || add.isPending} onClick={() => add.mutate()}><Link2 size={13} /> {wt('desk.link')}</button>
        </div>
      )}
    </Section>
  );
}

function Implementation({ config, cr }: { config: ProjectConfig; cr: CrDetail }) {
  const invalidate = useGovInvalidate(config.id);
  const [rows, setRows] = useState(() => cr.suggestions.map((s) => ({ ...s, on: true })));
  useEffect(() => setRows(cr.suggestions.map((s) => ({ ...s, on: true }))), [cr.suggestions]);
  const create = useMutation({
    mutationFn: () => govApi.implementChange(config.id, cr.number, rows.filter((r) => r.on && r.title.trim()).map((r) => ({ title: r.title.trim(), description: r.description, typeKey: r.typeKey }))),
    onSuccess: (r) => { toast.success(wt('gov.createdKeys', { keys: r.created.map((c) => c.key).join(', ') })); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.createIssuesFailed'))),
  });
  const done = cr.links.filter((l) => l.role === 'IMPLEMENTS' && l.issue);
  const base = `/work/${config.workspace.slug}/${config.key}`;
  if (cr.status !== 'APPROVED' && cr.status !== 'IMPLEMENTED' && !done.length) return null;
  return (
    <Section title={wt('gov.implementation')}>
      {done.length > 0 && (
        <ul className="mb-3 divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]" data-testid="cr-implementing">
          {done.map((l) => (
            <li key={l.id} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
              <Link href={`${base}/issue/${l.issue!.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.issue!.key}</Link>
              <span className="min-w-0 flex-1 truncate">{l.issue!.title}</span>
              <StatusBadge status={l.issue!.status} />
            </li>
          ))}
        </ul>
      )}
      {cr.canEdit && rows.length > 0 && (
        <div data-testid="cr-suggestions">
          <p className="mb-2 text-[12.5px] text-[var(--w-text-2)]">{wt('gov.suggested')}</p>
          <ul className="space-y-1.5">
            {rows.map((r, i) => (
              <li key={i} className="flex min-w-0 items-center gap-2">
                <input type="checkbox" checked={r.on} aria-label={wt('gov.createX', { x: r.title })} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)))} />
                <Pill tone="neutral">{r.typeKey === 'STORY' ? wt('status.tyStory') : wt('status.tyTask')}</Pill>
                <input className="w-input !h-8 min-w-0 flex-1" value={r.title} maxLength={255} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} aria-label={wt('gov.issueTitle')} />
              </li>
            ))}
          </ul>
          <button type="button" className="w-btn w-btn-primary w-btn-sm mt-3" disabled={!rows.some((r) => r.on) || create.isPending} onClick={() => create.mutate()} data-testid="cr-implement">
            {create.isPending ? <Spinner size={12} /> : <ListPlus size={13} />} {wt('gov.createIssues')}
          </button>
        </div>
      )}
      {!rows.length && !done.length && <p className="text-[13px] text-[var(--w-text-3)]">{wt('gov.noSuggestions')}</p>}
    </Section>
  );
}

function Approvals({ config, cr, openId, setOpenId }: { config: ProjectConfig; cr: CrDetail; openId: number | null; setOpenId: (id: number | null) => void }) {
  const q = useQuery({
    queryKey: [...workStudioKeys.approvals(config.id), 'cr', cr.number],
    queryFn: async () => (await workStudioApi.approvals(config.id, { targetType: 'CR', limit: 200 })).filter((a) => a.changeRequest?.number === cr.number),
    enabled: cr.approvalsOn,
  });
  if (!cr.approvalsOn) return null;
  const list = q.data ?? [];
  return (
    <Section title={wt('gov.approvals')}>
      {list.length ? (
        <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]" data-testid="cr-approvals">
          {list.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => setOpenId(a.id)} className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-left text-[13px] hover:bg-[var(--w-hover)]">
                <ApprovalPill status={a.status} />
                <span className="flex -space-x-1">{a.steps.slice(0, 5).map((s) => <UserAvatar key={s.id} user={s.approver} size={18} className="ring-2 ring-[var(--w-panel)]" />)}</span>
                <span className="text-[12px] tabular-nums text-[var(--w-text-3)]">{a.steps.filter((s) => s.decision === 'APPROVED').length}/{a.steps.length}</span>
                {a.contentChanged && <Pill tone="orange">{wt('gov.changedSince')}</Pill>}
                {a.canDecide && <Pill tone="accent">{wt('gov.yourTurn')}</Pill>}
                <span className="ml-auto text-[12px] text-[var(--w-text-3)]">{relativeTime(a.decidedAt ?? a.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('gov.notSent')}</p>}
      <ApprovalDialog pid={config.id} approvalId={openId} config={config} onClose={() => setOpenId(null)} />
    </Section>
  );
}

export default function ChangeDetail({ config, num }: { config: ProjectConfig; num: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const studioInvalidate = useStudioInvalidate();
  const q = useQuery({ queryKey: govKeys.change(pid, num), queryFn: () => govApi.change(pid, num) });
  const [asking, setAsking] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const openId = Number(sp?.get('approval')) || null;
  const setOpenId = (id: number | null) => router.replace(id ? `${pathname}?approval=${id}` : pathname!, { scroll: false });

  const status = useMutation({
    mutationFn: (to: 'SUBMITTED' | 'DRAFT' | 'IMPLEMENTED') => govApi.setChangeStatus(pid, num, to),
    onSuccess: (r) => { toast.success(wt('gov.statusToast', { s: CR_STATUS_LABEL[r.status as keyof typeof CR_STATUS_LABEL] ?? r.status })); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.statusFailed'))),
  });
  const share = useMutation({
    mutationFn: (v: boolean) => govApi.shareChange(pid, num, v),
    onSuccess: (r) => { toast.success(r.clientVisible ? wt('gov.sharedToast') : wt('gov.unsharedToast')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.shareFailed'))),
  });
  const del = useMutation({
    mutationFn: () => govApi.deleteChange(pid, num),
    onSuccess: () => { toast.success(wt('gov.crDeleted')); invalidate(); router.push(`/work/${config.workspace.slug}/${config.key}/changes`); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotDelete'))),
  });

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !q.data) return <EmptyState title={wt('gov.crNotFound')} body={workError(q.error)} />;
  const cr = q.data;
  const base = `/work/${config.workspace.slug}/${config.key}`;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1040px] space-y-4 px-4 py-5 md:px-6">
        <div>
          <Link href={`${base}/changes`} className="text-[12.5px] text-[var(--w-text-3)] hover:text-[var(--w-text)]">{wt('gov.backCrs')}</Link>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] text-[var(--w-accent-text)]">{cr.key}</span>
            <CrStatusPill status={cr.status} />
            {cr.clientVisible && <Pill tone="accent">{wt('gov.sharedWithClient')}</Pill>}
            {cr.waitingDays !== null && <Pill tone={cr.waitingDays > 5 ? 'orange' : 'neutral'}>{wt('gov.waitingD', { n: cr.waitingDays })}</Pill>}
          </div>
          <h1 className="mt-1.5 text-[20px] font-semibold tracking-[-0.015em] [overflow-wrap:anywhere] md:text-[24px]" data-testid="cr-heading">{cr.title}</h1>
          <p className="mt-1 text-[12.5px] text-[var(--w-text-3)]">
            {wt('gov.raisedBy', { name: userName(cr.createdBy), when: relativeTime(cr.createdAt) })}
            {cr.sourceIssue && <> · {wt('gov.fromLc')} <Link href={`${base}/issue/${cr.sourceIssue.number}`} className="text-[var(--w-accent-text)] hover:underline">{cr.sourceIssue.key}</Link></>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2" data-testid="cr-actions">
          {cr.canEdit && cr.status === 'DRAFT' && <button type="button" className="w-btn" disabled={status.isPending} onClick={() => status.mutate('SUBMITTED')} data-testid="cr-submit"><Send size={14} /> {wt('gov.submit')}</button>}
          {cr.canRequestApproval && <button type="button" className="w-btn w-btn-primary" onClick={() => setAsking(true)} data-testid="cr-request-approval"><BadgeCheck size={14} /> {wt('gov.sendApproval')}</button>}
          {cr.canEdit && (cr.status === 'SUBMITTED' || cr.status === 'REJECTED') && <button type="button" className="w-btn" disabled={status.isPending} onClick={() => status.mutate('DRAFT')}><Undo2 size={14} /> {cr.status === 'REJECTED' ? wt('gov.revise') : wt('gov.backDraft')}</button>}
          {cr.canEdit && cr.status === 'APPROVED' && <button type="button" className="w-btn" disabled={status.isPending} onClick={() => status.mutate('IMPLEMENTED')} data-testid="cr-mark-implemented"><CheckCircle2 size={14} /> {wt('gov.markImpl')}</button>}
          {cr.canEdit && cr.portalOn && (
            <button type="button" className={cn('w-btn', cr.clientVisible && 'w-btn-on')} disabled={share.isPending} onClick={() => share.mutate(!cr.clientVisible)} data-testid="cr-share" title={wt('gov.clientOnlyShared')}>
              {cr.clientVisible ? <EyeOff size={14} /> : <Eye size={14} />} {cr.clientVisible ? wt('gov.unshare') : wt('gov.shareClient')}
            </button>
          )}
          {cr.canDelete && <button type="button" className="w-btn w-btn-ghost w-btn-danger ml-auto" onClick={() => setConfirmDel(true)}><Trash2 size={14} /> {wt('common.delete')}</button>}
        </div>

        {!cr.approvalsOn && cr.canEdit && (cr.status === 'DRAFT' || cr.status === 'SUBMITTED') && (
          <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('gov.turnOnApprovals')}</p>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="w-card p-3"><Kv k={wt('gov.schedule')}>{fmtDays(cr.scheduleDays)}</Kv></div>
          <div className="w-card p-3"><Kv k={wt('gov.cost')}>{fmtCost(cr.costAmount, cr.costCurrency)}</Kv></div>
          <div className="w-card p-3"><Kv k={wt('gov.urgency')}>{cr.urgency === 'HIGH' ? wt('status.prioHigh') : cr.urgency === 'MEDIUM' ? wt('status.prioMedium') : wt('status.prioLow')}</Kv></div>
          <div className="w-card p-3"><Kv k={wt('gov.owner')}>{cr.owner ? userName(cr.owner) : '—'}</Kv></div>
        </div>

        <Analysis config={config} cr={cr} />
        <Approvals config={config} cr={cr} openId={openId} setOpenId={setOpenId} />
        <Implementation config={config} cr={cr} />
        <Affected config={config} cr={cr} />
        {/* CTW đợt 6 (R22): CR ↔ yêu cầu/UC/BR/tài liệu bị ảnh hưởng — mở khoá sửa mục đã baseline khi CR được duyệt. */}
        {config.role !== 'CLIENT' && !config.clientView && <CrAffected pid={pid} crNumber={num} canEdit={config.permissions.editIssues} />}
        <Description config={config} cr={cr} />
        {cr.risks.length > 0 && (
          <Section title={wt('gov.relatedRisks')}>
            <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]">
              {cr.risks.map((r) => (
                <li key={r.number} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
                  <ScoreBadge score={r.probability && r.impact ? r.probability * r.impact : null} />
                  <Link href={`${base}/raid?item=${r.number}`} className="min-w-0 flex-1 truncate hover:underline">{r.title}</Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
      <RequestApprovalDialog
        open={asking}
        onClose={() => setAsking(false)}
        config={config}
        title={wt('gov.sendKeyApproval', { key: cr.key })}
        successMessage={wt('gov.keySent', { key: cr.key })}
        excludeClients={!cr.clientVisible}
        hint={cr.clientVisible ? wt('gov.approversSign') : cr.portalOn ? wt('gov.askClientFirst') : undefined}
        send={async (b) => { const r = await govApi.requestChangeApproval(pid, num, b); invalidate(); studioInvalidate(); return r; }}
      />
      <ConfirmDialog
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        title={wt('gov.deleteKeyQ', { key: cr.key })}
        body={wt('gov.crDeleteBody')}
        confirmLabel={wt('common.delete')}
        danger
        pending={del.isPending}
        onConfirm={() => del.mutate()}
      />
    </div>
  );
}
