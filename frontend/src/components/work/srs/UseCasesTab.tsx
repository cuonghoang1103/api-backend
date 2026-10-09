'use client';

/**
 * CTW đợt 4 (A6) — Use case: bảng danh sách (UC-nn · tên · feature · actor · ưu tiên · trạng thái · thẻ · ô còn thiếu ·
 * mục Report 3) + hộp đặc tả đủ ô của mẫu FPT Report 3 (actor chính/phụ, trigger, mô tả, tiền/hậu điều kiện, luồng chính /
 * thay thế / ngoại lệ, ưu tiên, BR tham chiếu, thẻ yêu cầu). Đề xuất của AI (PROPOSED) có nút Accept / Discard; người
 * ADMIN/MEMBER/TEACHER duyệt (Approve).
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workCtw4Api, workCtw4Keys, type SrsData, type SrsUseCase, type UcPriority, type UseCaseInput } from '@/lib/work-ctw4-api';
import { Dialog, EmptyState, Field, Spinner } from '../ui';
import { Chip, Clip, PriorityChip, STATUS_TEXT, TableFrame, TD, TextArea, TH, UcStatusChip } from './shared';
import { wt } from '@/components/work/i18n';

type Form = {
  name: string; feature: string; primaryActorId: number | null; secondaryActorIds: number[]; trigger: string; description: string;
  preconditions: string; postconditions: string; normalFlow: string; alternativeFlows: string; exceptionFlows: string;
  priority: UcPriority; issue: string; ruleNumbers: number[];
};
const empty = (): Form => ({
  name: '', feature: '', primaryActorId: null, secondaryActorIds: [], trigger: '', description: '', preconditions: '', postconditions: '',
  normalFlow: '1. ', alternativeFlows: '', exceptionFlows: '', priority: 'MEDIUM', issue: '', ruleNumbers: [],
});
const fromUc = (u: SrsUseCase): Form => ({
  name: u.name, feature: u.feature ?? '', primaryActorId: u.primaryActorId, secondaryActorIds: u.secondaryActorIds, trigger: u.trigger ?? '',
  description: u.description ?? '', preconditions: u.preconditions ?? '', postconditions: u.postconditions ?? '', normalFlow: u.normalFlow ?? '',
  alternativeFlows: u.alternativeFlows ?? '', exceptionFlows: u.exceptionFlows ?? '', priority: u.priority, issue: u.issue ? u.issue.key : '', ruleNumbers: u.ruleNumbers,
});
const toInput = (f: Form): UseCaseInput => ({
  name: f.name.trim(), feature: f.feature.trim() || null, primaryActorId: f.primaryActorId, secondaryActorIds: f.secondaryActorIds.filter((x) => x !== f.primaryActorId),
  trigger: f.trigger || null, description: f.description || null, preconditions: f.preconditions || null, postconditions: f.postconditions || null,
  normalFlow: f.normalFlow.trim() && f.normalFlow.trim() !== '1.' ? f.normalFlow : null, alternativeFlows: f.alternativeFlows || null, exceptionFlows: f.exceptionFlows || null,
  priority: f.priority, issueNumber: Number(/(\d+)\s*$/.exec(f.issue)?.[1]) || null, ruleNumbers: f.ruleNumbers,
});

export function UseCaseDialog({ pid, data, uc, open, onClose }: { pid: number; data: SrsData; uc: SrsUseCase | null; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState<Form>(empty);
  useEffect(() => { if (open) setF(uc ? fromUc(uc) : empty()); }, [open, uc]);
  const set = (p: Partial<Form>) => setF((x) => ({ ...x, ...p }));
  const ro = !data.canEdit;
  const refresh = () => qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) });
  const save = useMutation({
    mutationFn: () => (uc ? workCtw4Api.updateUseCase(pid, uc.number, { ...toInput(f), version: uc.version }) : workCtw4Api.createUseCase(pid, toInput(f))),
    onSuccess: (r) => { refresh(); toast.success(wt(uc ? 'srs.savedKey' : 'srs.addedKey', { key: r.key })); onClose(); },
    onError: (e) => toast.error(workError(e, wt('srs.ucSaveFailed'))),
  });
  const status = useMutation({
    mutationFn: (s: 'DRAFT' | 'APPROVED') => workCtw4Api.setUseCaseStatus(pid, uc!.number, s),
    onSuccess: (r) => { refresh(); toast.success(wt('srs.nowStatus', { key: r.key, s: STATUS_TEXT[r.status].toLowerCase() })); onClose(); },
    onError: (e) => toast.error(workError(e, wt('srs.statusFailed'))),
  });
  const del = useMutation({
    mutationFn: () => workCtw4Api.deleteUseCase(pid, uc!.number),
    onSuccess: () => { refresh(); toast.success(wt(uc!.status === 'PROPOSED' ? 'srs.discardedKey' : 'srs.deletedKey', { key: uc!.key })); onClose(); },
    onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))),
  });
  const id = (k: string) => `uc-${uc?.number ?? 'new'}-${k}`;
  const toggle = (list: number[], v: number) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <Dialog open={open} onClose={onClose} width={880} title={uc ? <span className="flex items-center gap-2">{uc.key} <UcStatusChip status={uc.status} /></span> : wt('srs.newUc')}
      footer={(
        <div className="flex w-full flex-wrap items-center gap-2">
          {uc && data.canEdit && (
            <button type="button" className="w-btn w-btn-ghost w-btn-danger" disabled={del.isPending} onClick={() => { if (window.confirm(`${uc.status === 'PROPOSED' ? wt('srs.discard') : wt('common.delete')} ${uc.key}?`)) del.mutate(); }}>
              <Trash2 size={14} /> {uc.status === 'PROPOSED' ? wt('srs.discard') : wt('common.delete')}
            </button>
          )}
          <span className="flex-1" />
          {uc && data.canApprove && uc.status === 'PROPOSED' && <button type="button" className="w-btn" disabled={status.isPending} onClick={() => status.mutate('DRAFT')}>{wt('srs.accept')}</button>}
          {uc && data.canApprove && uc.status === 'DRAFT' && <button type="button" className="w-btn" disabled={status.isPending} onClick={() => status.mutate('APPROVED')}><CheckCircle2 size={14} /> {wt('srs.approve')}</button>}
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          {!ro && <button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner size={12} /> : null} {wt('common.save')}</button>}
        </div>
      )}>
      {uc?.status === 'PROPOSED' && (
        <p className="mb-3 rounded-[6px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-2 text-[12.5px] text-[var(--w-text)]">
          <Sparkles size={13} className="mr-1 inline" aria-hidden="true" />
          Proposed by AI{uc.aiModel ? ` (${uc.aiModel})` : ''}. It stays out of Report 3 until a member or lecturer accepts it. Check every step before accepting.
        </p>
      )}
      <div className="grid gap-x-4 md:grid-cols-[2fr_1fr_1fr]">
        <Field label={wt('srs.ucName')}><input className="w-input" value={f.name} readOnly={ro} maxLength={200} placeholder="Create Reservation" onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field label={wt('school.hFeature')}><input className="w-input" value={f.feature} readOnly={ro} maxLength={120} placeholder="Booking" onChange={(e) => set({ feature: e.target.value })} /></Field>
        <Field label={wt('common.priority')}>
          <select className="w-input" value={f.priority} disabled={ro} onChange={(e) => set({ priority: e.target.value as UcPriority })}>
            <option value="HIGH">{wt('status.prioHigh')}</option><option value="MEDIUM">{wt('status.prioMedium')}</option><option value="LOW">{wt('status.prioLow')}</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-x-4 md:grid-cols-2">
        <Field label={wt('srs.primaryActor')}>
          <select className="w-input" value={f.primaryActorId ?? ''} disabled={ro} onChange={(e) => set({ primaryActorId: Number(e.target.value) || null })}>
            <option value="">— {wt('common.none')} —</option>
            {data.actors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label={wt('srs.reqIssue')} hint={wt('srs.reqIssueHint')}>
          <input className="w-input" value={f.issue} readOnly={ro} placeholder={wt('srs.keyOrNum', { key: `${data.key}-12` })} onChange={(e) => set({ issue: e.target.value })} />
        </Field>
      </div>
      <fieldset className="mb-3">
        <legend className="w-label">{wt('srs.secondaryActors')}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.actors.filter((a) => a.id !== f.primaryActorId).map((a) => (
            <label key={a.id} className="flex items-center gap-1.5 text-[13px]"><input type="checkbox" disabled={ro} checked={f.secondaryActorIds.includes(a.id)} onChange={() => set({ secondaryActorIds: toggle(f.secondaryActorIds, a.id) })} />{a.name}</label>
          ))}
          {data.actors.length < 2 && <span className="text-[12.5px] text-[var(--w-text-3)]">{wt('srs.addActors')}</span>}
        </div>
      </fieldset>
      <TextArea id={id('trigger')} label={wt('srs.trigger')} value={f.trigger} readOnly={ro} rows={1} onChange={(v) => set({ trigger: v })} placeholder={wt('srs.triggerPh')} />
      <TextArea id={id('desc')} label={wt('fpt.fDescription')} value={f.description} readOnly={ro} rows={2} onChange={(v) => set({ description: v })} />
      <div className="grid gap-x-4 md:grid-cols-2">
        <TextArea id={id('pre')} label={wt('srs.pre')} value={f.preconditions} readOnly={ro} rows={2} onChange={(v) => set({ preconditions: v })} />
        <TextArea id={id('post')} label={wt('srs.post')} value={f.postconditions} readOnly={ro} rows={2} onChange={(v) => set({ postconditions: v })} hint={wt('srs.postHint')} />
      </div>
      <TextArea id={id('normal')} label={wt('srs.normal')} mono value={f.normalFlow} readOnly={ro} rows={5} onChange={(v) => set({ normalFlow: v })} hint={wt('srs.normalHint')} />
      <div className="grid gap-x-4 md:grid-cols-2">
        <TextArea id={id('alt')} label={wt('srs.alt')} mono value={f.alternativeFlows} readOnly={ro} rows={4} onChange={(v) => set({ alternativeFlows: v })} placeholder={'2A. Slot already taken\n1. …'} hint={wt('srs.altHint')} />
        <TextArea id={id('exc')} label={wt('srs.exc')} mono value={f.exceptionFlows} readOnly={ro} rows={4} onChange={(v) => set({ exceptionFlows: v })} placeholder={'3E. Database error\n1. …'} />
      </div>
      <fieldset>
        <legend className="w-label">{wt('srs.rulesRef')}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.rules.map((r) => (
            <label key={r.number} className="flex items-center gap-1.5 text-[13px]" title={r.definition ?? ''}><input type="checkbox" disabled={ro} checked={f.ruleNumbers.includes(r.number)} onChange={() => set({ ruleNumbers: toggle(f.ruleNumbers, r.number) })} /><span className="font-mono text-[12px]">{r.key}</span> {r.name}</label>
          ))}
          {!data.rules.length && <span className="text-[12.5px] text-[var(--w-text-3)]">{wt('srs.noRules')}</span>}
        </div>
      </fieldset>
    </Dialog>
  );
}

export function SuggestDialog({ pid, open, onClose }: { pid: number; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [ref, setRef] = useState('');
  useEffect(() => { if (open) setRef(''); }, [open]);
  const run = useMutation({
    mutationFn: () => workCtw4Api.suggest(pid, Number(/(\d+)\s*$/.exec(ref)?.[1])),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) });
      toast.success(r.created.length ? wt('srs.proposedList', { list: r.created.map((c) => c.key).join(', ') }) : wt('srs.noneFound'));
      onClose();
    },
    onError: (e) => toast.error(workError(e, wt('srs.draftFailed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('srs.draftTitle')} width={520}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!/\d+\s*$/.test(ref) || run.isPending} onClick={() => run.mutate()}>{run.isPending ? <Spinner size={12} /> : <Sparkles size={14} />} {wt('srs.draftProposals')}</button></>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{wt('srs.draftIntro')}</p>
      <Field label={wt('srs.issueOrEpic')}><input className="w-input" autoFocus value={ref} placeholder={wt('srs.keyOrNum', { key: 'LAB-12' })} onChange={(e) => setRef(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && /\d+\s*$/.test(ref) && run.mutate()} /></Field>
    </Dialog>
  );
}

export default function UseCasesTab({ pid, data, openUc, onOpenUc, onOpenIssue }: { pid: number; data: SrsData; openUc: number | null; onOpenUc: (n: number | null) => void; onOpenIssue: (n: number) => void }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'PROPOSED' | 'incomplete'>('all');
  const actor = useMemo(() => new Map(data.actors.map((a) => [a.id, a.name])), [data.actors]);
  const current = data.useCases.find((u) => u.number === openUc) ?? null;
  const rows = data.useCases.filter((u) => filter === 'all' || (filter === 'PROPOSED' ? u.status === 'PROPOSED' : u.missing.length > 0));
  const discard = useMutation({
    mutationFn: () => workCtw4Api.discardProposals(pid),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }); toast.success(wt('srs.discardedN', { n: r.useCases })); },
    onError: (e) => toast.error(workError(e, wt('srs.discardFailed'))),
  });
  return (
    <div className="flex flex-col gap-3">
      {data.counts.proposed > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-2 text-[13px]" role="status">
          <Sparkles size={14} aria-hidden="true" /> <span>{wt('srs.proposalsWaiting', { n: data.counts.proposed })}</span>
          <span className="flex-1" />
          <button type="button" className="w-btn w-btn-sm" onClick={() => setFilter('PROPOSED')}>{wt('srs.showProposals')}</button>
          {data.canApprove && <button type="button" className="w-btn w-btn-sm w-btn-ghost" disabled={discard.isPending} onClick={() => window.confirm(wt('srs.discardAllQ')) && discard.mutate()}>{wt('srs.discardAll')}</button>}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" role="group" aria-label={wt('srs.filterUc')}>
          {([['all', `${wt('common.all')} ${data.useCases.length}`], ['PROPOSED', `${wt('srs.stProposed')} ${data.counts.proposed}`], ['incomplete', `${wt('srs.incomplete')} ${data.useCases.filter((u) => u.missing.length).length}`]] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={filter === k} className={`w-btn w-btn-sm ${filter === k ? 'w-btn-primary' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <span className="flex-1" />
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setCreating(true)} data-testid="uc-new"><Plus size={14} /> {wt('srs.newUc')}</button>}
      </div>
      {!data.useCases.length ? (
        <EmptyState title={wt('srs.noUc')} body={wt('srs.noUcBody')} />
      ) : (
        <TableFrame label="Use case">
          <table className="w-full min-w-[980px] border-separate border-spacing-0">
            <thead><tr>{['ID', 'Use case', wt('school.hFeature'), wt('srs.primaryActor'), wt('common.priority'), wt('common.status'), wt('common.issue'), wt('srs.spec'), 'Report 3 §'].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.number} className="cursor-pointer hover:bg-[var(--w-hover)]" onClick={() => onOpenUc(u.number)}>
                  <td className={`${TD} font-mono text-[12px]`}><button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={(e) => { e.stopPropagation(); onOpenUc(u.number); }}>{u.key}</button></td>
                  <td className={`${TD} max-w-[280px] font-medium`}><Clip text={u.name} lines={2} /></td>
                  <td className={TD}><Clip text={u.feature} lines={1} /></td>
                  <td className={TD}>{u.primaryActorId ? actor.get(u.primaryActorId) : <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className={TD}><PriorityChip p={u.priority} /></td>
                  <td className={TD}><UcStatusChip status={u.status} /></td>
                  <td className={TD}>{u.issue ? <button type="button" className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={(e) => { e.stopPropagation(); onOpenIssue(u.issue!.number); }}>{u.issue.key}</button> : <span className="text-[var(--w-text-3)]">—</span>}</td>
                  <td className={TD}>{u.missing.length ? <Chip tone="orange" title={wt('srs.missingList', { list: u.missing.join(', ') })}>{wt('srs.nMissing', { n: u.missing.length })}</Chip> : <Chip tone="green">{wt('srs.complete')}</Chip>}</td>
                  <td className={`${TD} font-mono text-[12px] text-[var(--w-text-2)]`}>{u.section ?? (u.status === 'PROPOSED' ? 'not in document' : '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <UseCaseDialog pid={pid} data={data} uc={current} open={!!current} onClose={() => onOpenUc(null)} />
      <UseCaseDialog pid={pid} data={data} uc={null} open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
